// Inject @font-face with absolute extension URLs (required because
// manifest-injected CSS resolves urls relative to the page origin)
const fontStyle = document.createElement("style");
fontStyle.textContent = `
@font-face {
  font-family: 'OpenDyslexic';
  src: url("${chrome.runtime.getURL("fonts/OpenDyslexic-Regular.woff2")}") format("woff2");
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'OpenDyslexic';
  src: url("${chrome.runtime.getURL("fonts/OpenDyslexic-Bold.woff2")}") format("woff2");
  font-weight: bold;
  font-style: normal;
}`;
document.head.appendChild(fontStyle);

// Check initial states
chrome.storage.sync.get(["fontEnabled", "spacingEnabled"], function (result) {
  const fontEnabled = result.fontEnabled !== false;
  const spacingEnabled = result.spacingEnabled || false;

  if (fontEnabled) {
    document.documentElement.classList.add("opendyslexic-enabled");
  }
  if (spacingEnabled) {
    document.documentElement.classList.add("letter-spacing-enabled");
  }
});

// Listen for messages from popup ui
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {

  switch (message.action) {
    case "enableFont":
      document.documentElement.classList.add("opendyslexic-enabled");
      break;
    case "disableFont":
      document.documentElement.classList.remove("opendyslexic-enabled");
      break;
    case "enableSpacing":
      document.documentElement.classList.add("letter-spacing-enabled");
      break;
    case "disableSpacing":
      document.documentElement.classList.remove("letter-spacing-enabled");
      break;
  }

  sendResponse({ success: true });
  return true;
});
