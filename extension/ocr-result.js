document.addEventListener("DOMContentLoaded", function () {
  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");
  const ocrTextEl = document.getElementById("ocrText");

  console.log("OCR result page loaded");

  // Get OCR result from backend
  chrome.storage.local.get(["ocrResult"], function (result) {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving OCR result:", chrome.runtime.lastError);
      showError("Failed to retrieve OCR result");
      return;
    }

    if (!result.ocrResult) {
      showError("No OCR result found");
      return;
    }

    // Display text
    loadingEl.style.display = "none";
    errorEl.style.display = "none";
    ocrTextEl.style.display = "block";
    ocrTextEl.textContent = result.ocrResult;

    // Clear the stored result
    chrome.storage.local.remove("ocrResult");
  });

  function showError(message) {
    loadingEl.style.display = "none";
    errorEl.style.display = "block";
    errorEl.textContent = message;
  }
});
