chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'displayOcrResult') {
    document.getElementById('ocrText').textContent = message.text;
  }
});