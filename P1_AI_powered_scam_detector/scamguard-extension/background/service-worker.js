import { GeminiAnalyzer } from '../utils/gemini-analyzer.js';

let geminiAnalyzer = null;

// Initialize Gemini analyzer with stored API key
async function initializeAnalyzer() {
  const result = await chrome.storage.sync.get(['geminiApiKey']);
  const apiKey = result.geminiApiKey || 'YOUR_API_KEY_HERE';
  geminiAnalyzer = new GeminiAnalyzer(apiKey);
}

// Listen for analysis requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeWithGemini") {
    handleGeminiAnalysis(request.data, sender.tab.id)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Analysis error:', error);
        sendResponse({ error: 'Analysis failed' });
      });
    return true; // Keep message channel open for async
  }
});

// Handle Gemini analysis
async function handleGeminiAnalysis(data, tabId) {
  if (!geminiAnalyzer) {
    await initializeAnalyzer();
  }

  try {
    const analysis = await geminiAnalyzer.analyzePageContent(data.text, data.url);
    
    // Update badge based on risk
    updateBadge(tabId, analysis.riskLevel);
    
    // Send notification for high risk
    if (analysis.riskLevel === 'high') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '⚠️ AI Scam Alert',
        message: analysis.reasons[0] || 'High-risk page detected',
        priority: 2
      });
    }
    
    return {
      success: true,
      ...analysis,
      analyzedAt: new Date().toISOString(),
      source: 'gemini'
    };
  } catch (error) {
    console.error('Gemini analysis failed:', error);
    return {
      success: false,
      error: error.message,
      source: 'fallback'
    };
  }
}

// Listen for API key changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.geminiApiKey) {
    initializeAnalyzer();
  }
});

// Initialize on startup
initializeAnalyzer();

// Keep existing badge and tab management functions
function updateBadge(tabId, riskLevel) {
  const badgeColors = {
    high: '#dc3545',
    medium: '#ffc107',
    low: '#28a745',
    default: '#6c757d'
  };
  
  const badgeTexts = {
    high: '!',
    medium: '?',
    low: '✓'
  };
  
  chrome.action.setBadgeBackgroundColor({
    color: badgeColors[riskLevel] || badgeColors.default,
    tabId: tabId
  });
  
  chrome.action.setBadgeText({
    text: badgeTexts[riskLevel] || '',
    tabId: tabId
  });
}
