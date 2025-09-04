// content.js
const extensionId = chrome.runtime.id;

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

document.documentElement.classList.add("opendyslexic-enabled");
console.log("[DysHelper Extension] Font applied to page.");
c