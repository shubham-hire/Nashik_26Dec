// Collect page content and send to Gemini
async function analyzeWithGemini() {
  const text = document.body.innerText;
  const url = window.location.href;
  const title = document.title;
  
  // Clean text (remove excessive whitespace, limit length)
  const cleanText = text
    .replace(/\s+/g, ' ')
    .substring(0, 15000); // Limit for API
  
  try {
    // Send to background script for Gemini analysis
    const response = await chrome.runtime.sendMessage({
      action: "analyzeWithGemini",
      data: {
        text: cleanText,
        url: url,
        title: title,
        timestamp: Date.now()
      }
    });
    
    return response;
  } catch (error) {
    console.error('Failed to analyze with Gemini:', error);
    return getFallbackAnalysis(text, url);
  }
}

// Fallback analysis
function getFallbackAnalysis(text, url) {
  const lowerText = text.toLowerCase();
  
  const patterns = {
    urgency: ['limited time', 'act now', 'today only'],
    payment: ['wire transfer', 'gift cards', 'bitcoin'],
    deception: ['you won', 'free prize', 'congratulations']
  };
  
  const detected = [];
  for (const [type, keywords] of Object.entries(patterns)) {
    if (keywords.some(k => lowerText.includes(k))) {
      detected.push(type);
    }
  }
  
  const riskLevel = detected.length >= 2 ? 'high' : 
                   detected.length === 1 ? 'medium' : 'low';
  
  return {
    success: true,
    riskLevel,
    confidence: 0.7,
    scamType: detected.length > 0 ? 'suspicious' : 'none',
    reasons: detected.map(d => `${d} patterns detected`),
    explanation: 'Basic pattern detection (AI not available)',
    recommendation: 'Use Gemini AI for better analysis',
    source: 'fallback'
  };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getAnalysis") {
    // Start analysis and respond asynchronously
    analyzeWithGemini().then(result => {
      sendResponse(result);
    });
    return true; // Keep message channel open for async
  }
});

// Auto-analyze on page load (with delay for dynamic content)
setTimeout(async () => {
  const analysis = await analyzeWithGemini();
  
  // Store locally for quick access
  window.scamguardAnalysis = analysis;
  
  // Send to background for badge updates
  chrome.runtime.sendMessage({
    action: "pageAnalyzed",
    data: analysis
  });
}, 2000);
