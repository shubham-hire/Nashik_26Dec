document.addEventListener('DOMContentLoaded', function() {
  // Load saved API key
  chrome.storage.sync.get(['geminiApiKey'], function(result) {
    if (result.geminiApiKey) {
      document.getElementById('api-key').value = result.geminiApiKey;
    }
  });

  // Save button
  document.getElementById('save-btn').addEventListener('click', function() {
    const apiKey = document.getElementById('api-key').value.trim();
    
    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }

    chrome.storage.sync.set({ geminiApiKey: apiKey }, function() {
      showStatus('API key saved successfully!', 'success');
    });
  });

  // Test button
  document.getElementById('test-btn').addEventListener('click', async function() {
    const apiKey = document.getElementById('api-key').value.trim();
    
    if (!apiKey) {
      showStatus('Please enter an API key first', 'error');
      return;
    }

    showStatus('Testing connection to Gemini API...', 'info');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Say "OK" if you can read this.' }]
            }]
          })
        }
      );

      if (response.ok) {
        showStatus('✅ Connection successful! Gemini API is working.', 'success');
        
        // Save if test succeeds
        chrome.storage.sync.set({ geminiApiKey: apiKey });
      } else {
        showStatus('❌ Connection failed. Check your API key.', 'error');
      }
    } catch (error) {
      showStatus(`❌ Error: ${error.message}`, 'error');
    }
  });
});

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = type;
  statusDiv.style.display = 'block';
  
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 5000);
}
