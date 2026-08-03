export function injectFontFaces() {
  const style = document.createElement("style");
  style.id = "dyshelper-fonts";
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
}
@font-face {
  font-family: 'OpenDyslexicAlta';
  src: url("${chrome.runtime.getURL("fonts/OpenDyslexicAlta-Regular.woff2")}") format("woff2");
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'OpenDyslexicAlta';
  src: url("${chrome.runtime.getURL("fonts/OpenDyslexicAlta-Bold.woff2")}") format("woff2");
  font-weight: bold;
  font-style: normal;
}
@font-face {
  font-family: 'OpenDyslexicMono';
  src: url("${chrome.runtime.getURL("fonts/OpenDyslexicMono-Regular.woff2")}") format("woff2");
  font-weight: normal;
  font-style: normal;
}`;
  document.head.appendChild(style);
}
