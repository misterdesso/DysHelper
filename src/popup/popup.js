import { getSync, setSync, setLocal } from "../shared/storage.js";
import { sendToActiveTab } from "../shared/messaging.js";

document.addEventListener("DOMContentLoaded", async function () {
  const fontToggle = document.getElementById("font-toggle");
  const spacingToggle = document.getElementById("spacing-toggle");
  const imageUpload = document.getElementById("image-upload");
  const uploadStatus = document.getElementById("upload-status");

  const { fontEnabled, spacingEnabled } = await getSync([
    "fontEnabled",
    "spacingEnabled",
  ]);
  fontToggle.checked = fontEnabled !== false;
  spacingToggle.checked = spacingEnabled || false;

  fontToggle.addEventListener("change", async function () {
    const enabled = this.checked;
    await setSync({ fontEnabled: enabled });
    sendToActiveTab({ action: enabled ? "enableFont" : "disableFont" });
  });

  spacingToggle.addEventListener("change", async function () {
    const enabled = this.checked;
    await setSync({ spacingEnabled: enabled });
    sendToActiveTab({ action: enabled ? "enableSpacing" : "disableSpacing" });
  });

  imageUpload.addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showStatus("Error: Image must be under 5MB", "error");
      return;
    }

    showStatus("Preparing image...", "");

    try {
      const dataUrl = await fileToDataURL(file);
      await setLocal({ ocrImage: dataUrl });

      chrome.tabs.create({
        url: chrome.runtime.getURL("ocr/ocr-result.html"),
      });

      showStatus("Processing in new tab...", "success");
    } catch (error) {
      console.error("OCR error:", error);
      showStatus(`Error: ${error.message}`, "error");
    }
  });

  function showStatus(text, type) {
    uploadStatus.textContent = text;
    uploadStatus.className = `status-message${type ? ` ${type}` : ""}`;
  }
});

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
