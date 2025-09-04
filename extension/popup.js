document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('toggle');
  const statusText = document.getElementById('status-text');
  
  // Get current state
  chrome.storage.sync.get(['enabled'], function(result) {
    const enabled = result.enabled !== false; // Default to true
    toggle.checked = enabled;
    statusText.textContent = enabled ? 'Enabled' : 'Disabled';
  });
  
  // Toggle state when switch is clicked
  toggle.addEventListener('change', function() {
    const enabled = this.checked;
    chrome.storage.sync.set({ enabled: enabled });
    statusText.textContent = enabled ? 'Enabled' : 'Disabled';
    
    // Send message to current tab to update font
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: enabled ? 'enable' : 'disable' });
    });
  });
});