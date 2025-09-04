document.addEventListener('DOMContentLoaded', function() {
  const fontToggle = document.getElementById('font-toggle');
  const spacingToggle = document.getElementById('spacing-toggle');
  
  // Get current states
  chrome.storage.sync.get(['fontEnabled', 'spacingEnabled'], function(result) {
    // Set default values
    const fontEnabled = result.fontEnabled !== false; // Default to true
    const spacingEnabled = result.spacingEnabled || false; // Default to false
    
    // Update toggle states
    fontToggle.checked = fontEnabled;
    spacingToggle.checked = spacingEnabled;
  });
  
  // Font toggle handler
  fontToggle.addEventListener('change', function() {
    const enabled = this.checked;
    chrome.storage.sync.set({ fontEnabled: enabled });
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {  // Check if there's an active tab
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: enabled ? 'enableFont' : 'disableFont' 
        });
      }
    });
  });

  // Spacing toggle handler
  spacingToggle.addEventListener('change', function() {
    const enabled = this.checked;
    chrome.storage.sync.set({ spacingEnabled: enabled });
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {  // Check if there's an active tab
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: enabled ? 'enableSpacing' : 'disableSpacing' 
        });
      }
    });
  });
});