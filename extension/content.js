const extensionId = chrome.runtime.id;

// Font styles
const style = document.createElement("style");
style.textContent = `
@font-face {
  font-family: 'OpenDyslexic';
  src: url("chrome-extension://${extensionId}/fonts/OpenDyslexic-Regular.woff2") format("woff2");
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'OpenDyslexic';
  src: url("chrome-extension://${extensionId}/fonts/OpenDyslexic-Bold.woff2") format("woff2");
  font-weight: bold;
  font-style: normal;
}
html.opendyslexic-enabled, html.opendyslexic-enabled body, html.opendyslexic-enabled * {
  font-family: 'OpenDyslexic', sans-serif !important;
}`;
document.head.appendChild(style);

// Check initial states
chrome.storage.sync.get(['fontEnabled', 'spacingEnabled'], function(result) {
  const fontEnabled = result.fontEnabled !== false;
  const spacingEnabled = result.spacingEnabled || false;
  
  if (fontEnabled) {
    document.documentElement.classList.add("opendyslexic-enabled");
  }
  if (spacingEnabled) {
    document.documentElement.classList.add("letter-spacing-enabled");
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message); // Debug logging
  
  switch(message.action) {
    case 'enableFont':
      document.documentElement.classList.add("opendyslexic-enabled");
      break;
    case 'disableFont':
      document.documentElement.classList.remove("opendyslexic-enabled");
      break;
    case 'enableSpacing':
      document.documentElement.classList.add("letter-spacing-enabled");
      break;
    case 'disableSpacing':
      document.documentElement.classList.remove("letter-spacing-enabled");
      break;
  }
  
  // Always send a response to close the message channel
  sendResponse({ success: true });
  return true; // Required to use sendResponse asynchronously
});