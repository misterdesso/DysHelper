import { getSync, setSync, setLocal } from "../shared/storage.js";
import { sendToActiveTab } from "../shared/messaging.js";
import { DEFAULTS, migrateSettings } from "../shared/defaults.js";

document.addEventListener("DOMContentLoaded", async function () {
  const fontFamilySelect = document.getElementById("font-family-select");
  const fontSizeSlider = document.getElementById("font-size-slider");
  const fontSizeValue = document.getElementById("font-size-value");
  const letterSpacingSlider = document.getElementById("letter-spacing-slider");
  const letterSpacingValue = document.getElementById("letter-spacing-value");
  const wordSpacingSlider = document.getElementById("word-spacing-slider");
  const wordSpacingValue = document.getElementById("word-spacing-value");
  const resetButton = document.getElementById("reset-button");
  const imageUpload = document.getElementById("image-upload");
  const uploadStatus = document.getElementById("upload-status");

  const raw = await getSync([
    "fontEnabled",
    "spacingEnabled",
    "fontFamily",
    "fontSize",
    "letterSpacing",
    "wordSpacing",
  ]);
  const settings = migrateSettings(raw);

  populateControls(settings);

  let saveTimeout = null;

  function saveAndApply(updates) {
    Object.assign(settings, updates);

    sendToActiveTab({ action: "applySettings", settings: { ...settings } });

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      setSync({
        fontFamily: settings.fontFamily,
        fontSize: settings.fontSize,
        letterSpacing: settings.letterSpacing,
        wordSpacing: settings.wordSpacing,
      });
    }, 300);
  }

  fontFamilySelect.addEventListener("change", () => {
    saveAndApply({ fontFamily: fontFamilySelect.value });
  });

  fontSizeSlider.addEventListener("input", () => {
    const val = parseFloat(fontSizeSlider.value);
    fontSizeValue.textContent = `${val.toFixed(1)}x`;
    saveAndApply({ fontSize: val });
  });

  letterSpacingSlider.addEventListener("input", () => {
    const val = parseFloat(letterSpacingSlider.value);
    letterSpacingValue.textContent = `${val.toFixed(2)}em`;
    saveAndApply({ letterSpacing: val });
  });

  wordSpacingSlider.addEventListener("input", () => {
    const val = parseFloat(wordSpacingSlider.value);
    wordSpacingValue.textContent = `${val.toFixed(2)}em`;
    saveAndApply({ wordSpacing: val });
  });

  resetButton.addEventListener("click", () => {
    const defaults = { ...DEFAULTS };
    populateControls(defaults);
    saveAndApply(defaults);
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

  function populateControls(s) {
    fontFamilySelect.value = s.fontFamily;
    fontSizeSlider.value = s.fontSize;
    fontSizeValue.textContent = `${s.fontSize.toFixed(1)}x`;
    letterSpacingSlider.value = s.letterSpacing;
    letterSpacingValue.textContent = `${s.letterSpacing.toFixed(2)}em`;
    wordSpacingSlider.value = s.wordSpacing;
    wordSpacingValue.textContent = `${s.wordSpacing.toFixed(2)}em`;
  }

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
