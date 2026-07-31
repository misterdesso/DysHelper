import Tesseract from "tesseract.js";

document.addEventListener("DOMContentLoaded", async function () {
  const loadingEl = document.getElementById("loading");
  const progressBar = document.getElementById("progress");
  const progressContainer = document.getElementById("progress-container");
  const errorEl = document.getElementById("error");
  const ocrTextEl = document.getElementById("ocrText");

  try {
    const { ocrImage } = await new Promise((resolve, reject) => {
      chrome.storage.local.get(["ocrImage"], (result) => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve(result);
      });
    });

    if (!ocrImage) {
      showError("No image found. Please upload an image from the popup.");
      return;
    }

    chrome.storage.local.remove("ocrImage");

    loadingEl.textContent = "Recognizing text...";
    progressContainer.style.display = "block";

    const { data } = await Tesseract.recognize(ocrImage, "eng", {
      workerPath: chrome.runtime.getURL("ocr/tesseract-worker.js"),
      corePath: chrome.runtime.getURL("ocr/tesseract-core"),
      workerBlobURL: false,
      logger: (info) => {
        if (info.status === "recognizing text") {
          const pct = Math.round(info.progress * 100);
          progressBar.textContent = `${pct}%`;
          progressBar.style.width = `${pct}%`;
        } else if (info.status) {
          loadingEl.textContent =
            info.status.charAt(0).toUpperCase() + info.status.slice(1) + "...";
        }
      },
    });

    if (!data.text || !data.text.trim()) {
      showError("No text could be extracted from this image.");
      return;
    }

    loadingEl.style.display = "none";
    progressContainer.style.display = "none";
    ocrTextEl.style.display = "block";
    ocrTextEl.textContent = data.text;
  } catch (err) {
    showError(`OCR failed: ${err?.message || err || "Unknown error"}`);
  }

  function showError(message) {
    loadingEl.style.display = "none";
    progressContainer.style.display = "none";
    errorEl.style.display = "block";
    errorEl.textContent = message;
  }
});
