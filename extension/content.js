const extensionId = chrome.runtime.id;

// OpenDyslexic font styles
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

// Check initial state
chrome.storage.sync.get(['enabled'], function(result) {
  const enabled = result.enabled !== false;
  if (enabled) {
    document.documentElement.classList.add("opendyslexic-enabled");
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'enable') {
    document.documentElement.classList.add("opendyslexic-enabled");
  } else if (message.action === 'disable') {
    document.documentElement.classList.remove("opendyslexic-enabled");
  }
});