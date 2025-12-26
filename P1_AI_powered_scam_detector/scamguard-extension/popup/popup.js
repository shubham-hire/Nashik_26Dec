document.addEventListener('DOMContentLoaded', async function() {
  const statusDot = document.getElementById('status-dot');
  const contentDiv = document.getElementById('content');
  
  // Check if user has API key
  chrome.storage.sync.get(['geminiApiKey'], async function(result) {
    const hasApiKey = result.geminiApiKey && result.geminiApiKey !== 'YOUR_API_KEY_HERE';
    
    if (!hasApiKey) {
      showSetupInstructions();
      return;
    }
    
    // Get current tab
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
      const currentTab = tabs[0];
      if (!currentTab) {
        showError("Can't access current tab");
        return;
      }
      
      // Show loading
      contentDiv.innerHTML = `
        <div style="text-align: center; padding: 30px;">
          <div class="spinner"></div>
          <p>Analyzing with Gemini AI...</p>
          <small>Reading page content</small>
        </div>
      `;
      
      // Request analysis
      try {
        const response = await chrome.tabs.sendMessage(currentTab.id, {action: "getAnalysis"});
        
        if (response && response.success) {
          displayResults(response);
        } else {
          showError(response?.error || "Analysis failed");
        }
      } catch (error) {
        // Content script might not be loaded on some pages
        console.error('Popup error:', error);
        showError("Cannot analyze this page. Try refreshing.");
      }
    });
  });
});

function displayResults(data) {
  const contentDiv = document.getElementById('content');
  const statusDot = document.getElementById('status-dot');
  
  statusDot.className = `status-dot ${data.riskLevel}`;
  
  const riskLabels = {
    high: '🔴 HIGH RISK',
    medium: '🟡 MEDIUM RISK',
    low: '🟢 LOW RISK'
  };
  
  const scamTypeLabels = {
    phishing: 'Phishing Attempt',
    fake_prize: 'Fake Prize Scam',
    impersonation: 'Impersonation',
    investment_scam: 'Investment Scam',
    other: 'Suspicious Activity',
    none: 'No Scam Detected'
  };
  
  contentDiv.innerHTML = `
    <div class="risk-card">
      <div class="risk-level risk-${data.riskLevel}">
        ${riskLabels[data.riskLevel] || 'UNKNOWN RISK'}
        ${data.confidence ? `<br><small>Confidence: ${Math.round(data.confidence * 100)}%</small>` : ''}
      </div>
      
      <h3 class="risk-title">
        ${data.scamType ? scamTypeLabels[data.scamType] : 'Analysis Complete'}
        ${data.source === 'gemini' ? '🤖' : '⚡'}
      </h3>
      
      <p style="margin: 10px 0; color: #495057;">
        ${data.explanation || 'No specific explanation available.'}
      </p>
      
      ${data.reasons && data.reasons.length > 0 ? `
        <div style="margin: 15px 0;">
          <strong>Reasons:</strong>
          <ul class="risk-reasons">
            ${data.reasons.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${data.recommendation ? `
        <div class="decision-section">
          <div class="decision-title">Recommendation:</div>
          <p style="font-size: 14px; color: #212529; background: #e7f3ff; padding: 10px; border-radius: 6px;">
            ${data.recommendation}
          </p>
        </div>
      ` : ''}
      
      <div class="decision-buttons">
        <button class="btn btn-primary" id="learn-more">
          Learn More
        </button>
        <button class="btn btn-secondary" id="report-btn">
          Report Page
        </button>
      </div>
      
      <div style="margin-top: 15px; text-align: center;">
        <small style="color: #6c757d; font-size: 11px;">
          Powered by ${data.source === 'gemini' ? 'Gemini AI' : 'Basic Detection'}
        </small>
      </div>
    </div>
  `;
  
  // Add button events
  document.getElementById('learn-more')?.addEventListener('click', function() {
    chrome.tabs.create({
      url: `https://scamguard.example.com/learn?risk=${data.riskLevel}`
    });
  });
  
  document.getElementById('report-btn')?.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const url = encodeURIComponent(tabs[0].url);
      chrome.tabs.create({
        url: `https://scamguard.example.com/report?url=${url}`
      });
    });
  });
}

function showSetupInstructions() {
  const contentDiv = document.getElementById('content');
  
  contentDiv.innerHTML = `
    <div class="risk-card" style="text-align: center;">
      <div style="font-size: 48px; margin: 20px 0;">🤖</div>
      <h3 style="color: #4285f4;">Gemini AI Required</h3>
      <p>ScamGuard needs a Gemini API key for AI-powered detection.</p>
      
      <ol style="text-align: left; margin: 20px 0; padding-left: 20px;">
        <li>Get a <strong>free API key</strong> from Google AI Studio</li>
        <li>Click "Settings" below</li>
        <li>Paste your API key and save</li>
      </ol>
      
      <div class="decision-buttons">
        <button class="btn btn-primary" id="open-settings">
          Open Settings
        </button>
        <button class="btn btn-secondary" id="get-api-key">
          Get API Key
        </button>
      </div>
      
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        🔐 Your key stays on your device. We never see it.
      </p>
    </div>
  `;
  
  document.getElementById('open-settings').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
  
  document.getElementById('get-api-key').addEventListener('click', function() {
    chrome.tabs.create({
      url: 'https://makersuite.google.com/app/apikey'
    });
  });
}

function showError(message) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = `
    <div class="risk-card">
      <h3 style="color: #dc3545;">⚠️ Error</h3>
      <p>${message}</p>
      <button class="btn btn-primary" id="retry-btn">Try Again</button>
    </div>
  `;
  
  document.getElementById('retry-btn').addEventListener('click', function() {
    location.reload();
  });
}
