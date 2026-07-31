export function injectFontFaces() {
  const style = document.createElement("style");
  style.textContent = `
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
  document.head.appendChild(style);
}
