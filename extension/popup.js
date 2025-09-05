document.addEventListener("DOMContentLoaded", function () {
  const fontToggle = document.getElementById("font-toggle");
  const spacingToggle = document.getElementById("spacing-toggle");
  const imageUpload = document.getElementById("image-upload");
  const uploadStatus = document.getElementById("upload-status");
  const OCR_API_URL = "http://localhost:3000/api/v1/ocr";

  // State handler
  chrome.storage.sync.get(["fontEnabled", "spacingEnabled"], function (result) {
    // Set default values
    const fontEnabled = result.fontEnabled !== false; // True
    const spacingEnabled = result.spacingEnabled || false; // False

    // Update toggle states
    fontToggle.checked = fontEnabled;
    spacingToggle.checked = spacingEnabled;
  });

  // Font toggle handler
  fontToggle.addEventListener("change", function () {
    const enabled = this.checked;
    chrome.storage.sync.set({ fontEnabled: enabled });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        // Check for active tabs
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
        // Check for active tabs
        chrome.tabs.sendMessage(tabs[0].id, {
          action: enabled ? "enableSpacing" : "disableSpacing",
        });
      }
    });
  });

  imageUpload.addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    uploadStatus.textContent = "Uploading image...";
    uploadStatus.className = "status-message";

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(OCR_API_URL, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process image");
      }

      if (!result.text) {
        throw new Error("No text found in OCR response");
      }

      // Store the OCR result in browser
      await new Promise((resolve, reject) => {
        chrome.storage.local.set(
          {
            ocrResult: result.text,
          },
          () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          }
        );
      });

      // Open results in new tab
      chrome.tabs.create({
        url: chrome.runtime.getURL("ocr-result.html"),
      });

      uploadStatus.textContent = "Text extracted successfully!";
      uploadStatus.className = "status-message success";
    } catch (error) {
      console.error("Upload/OCR error:", error);
      uploadStatus.textContent = `Error: ${error.message}`;
      uploadStatus.className = "status-message error";
    }
  });
});
