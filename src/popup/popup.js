document.addEventListener("DOMContentLoaded", function () {
  const fontToggle = document.getElementById("font-toggle");
  const spacingToggle = document.getElementById("spacing-toggle");
  const imageUpload = document.getElementById("image-upload");
  const uploadStatus = document.getElementById("upload-status");

  // State handler
  chrome.storage.sync.get(["fontEnabled", "spacingEnabled"], function (result) {
    const fontEnabled = result.fontEnabled !== false;
    const spacingEnabled = result.spacingEnabled || false;

    fontToggle.checked = fontEnabled;
    spacingToggle.checked = spacingEnabled;
  });

  // Font toggle handler
  fontToggle.addEventListener("change", function () {
    const enabled = this.checked;
    chrome.storage.sync.set({ fontEnabled: enabled });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: enabled ? "enableFont" : "disableFont",
        });
      }
    });
  });

  // Spacing toggle handler
  spacingToggle.addEventListener("change", function () {
    const enabled = this.checked;
    chrome.storage.sync.set({ spacingEnabled: enabled });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: enabled ? "enableSpacing" : "disableSpacing",
        });
      }
    });
  });

  // OCR image upload handler
  imageUpload.addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      uploadStatus.textContent = "Error: Image must be under 5MB";
      uploadStatus.className = "status-message error";
      return;
    }

    uploadStatus.textContent = "Preparing image...";
    uploadStatus.className = "status-message";

    try {
      const dataUrl = await fileToDataURL(file);

      await new Promise((resolve, reject) => {
        chrome.storage.local.set({ ocrImage: dataUrl }, () => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve();
        });
      });

      chrome.tabs.create({
        url: chrome.runtime.getURL("ocr/ocr-result.html"),
      });

      uploadStatus.textContent = "Processing in new tab...";
      uploadStatus.className = "status-message success";
    } catch (error) {
      console.error("OCR error:", error);
      uploadStatus.textContent = `Error: ${error.message}`;
      uploadStatus.className = "status-message error";
    }
  });
});

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
