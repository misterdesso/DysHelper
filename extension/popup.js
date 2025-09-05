document.addEventListener('DOMContentLoaded', function() {
  const fontToggle = document.getElementById('font-toggle');
  const spacingToggle = document.getElementById('spacing-toggle');
  const imageUpload = document.getElementById('image-upload');
  const uploadStatus = document.getElementById('upload-status');
  const OCR_API_URL = 'http://localhost:3000/api/v1/ocr';

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

  imageUpload.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    uploadStatus.textContent = 'Uploading image...';
    uploadStatus.className = 'status-message';

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(OCR_API_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('OCR processing failed');

      const result = await response.json();
      
      if (result.success && result.extractedText) {
        // Create a new tab with the OCR result
        chrome.tabs.create({
          url: chrome.runtime.getURL('ocr-result.html')
        }, (tab) => {
          // Send the OCR result to the new tab
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === tab.id && info.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);
              chrome.tabs.sendMessage(tabId, {
                action: 'displayOcrResult',
                text: result.extractedText
              });
            }
          });
        });
        
        uploadStatus.textContent = 'Text extracted successfully!';
        uploadStatus.className = 'status-message success';
      } else {
        throw new Error('No text extracted');
      }
    } catch (error) {
      console.error('Upload error:', error);
      uploadStatus.textContent = 'Error processing image';
      uploadStatus.className = 'status-message error';
    }
  });
});