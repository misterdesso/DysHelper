import { setLocal } from "../shared/storage.js";
import { sendToActiveTab, getActiveTab } from "../shared/messaging.js";
import { DEFAULTS } from "../shared/defaults.js";
import { getBaseDomain } from "../shared/domain.js";
import {
  getGlobalSettings,
  setGlobalSettings,
  getSiteSettings,
  setSiteSettings,
  removeSiteSettings,
} from "../shared/site-settings.js";

document.addEventListener("DOMContentLoaded", async function () {
  const fontFamilySelect = document.getElementById("font-family-select");
  const fontSizeSlider = document.getElementById("font-size-slider");
  const fontSizeValue = document.getElementById("font-size-value");
  const letterSpacingSlider = document.getElementById("letter-spacing-slider");
  const letterSpacingValue = document.getElementById("letter-spacing-value");
  const wordSpacingSlider = document.getElementById("word-spacing-slider");
  const wordSpacingValue = document.getElementById("word-spacing-value");
  const resetButton = document.getElementById("reset-button");
  const scopeSiteLabel = document.getElementById("scope-site-label");
  const scopeSiteButton = document.getElementById("scope-site-button");
  const scopeGlobalButton = document.getElementById("scope-global-button");
  const imageUpload = document.getElementById("image-upload");
  const uploadStatus = document.getElementById("upload-status");

  // Resolve the current site from the active tab.
  const tab = await getActiveTab();
  const domain = domainFromTab(tab);

  // Load both scopes. The site working copy is seeded from the global default
  // when no override exists, so untouched fields are preserved on first edit.
  const globalSettings = await getGlobalSettings();
  const siteOverride = domain ? await getSiteSettings(domain) : null;
  let hasSiteOverride = Boolean(siteOverride);
  const siteSettings = siteOverride
    ? { ...siteOverride }
    : { ...globalSettings };

  // Per-site is the default scope; restricted pages fall back to global only.
  let scope = domain ? "site" : "global";

  if (domain) {
    scopeSiteLabel.textContent = domain;
  } else {
    scopeSiteLabel.textContent = "Unavailable on this page";
    scopeSiteButton.disabled = true;
  }

  applyScopeUI();
  populateControls(activeSettings());

  let saveTimeout = null;

  function activeSettings() {
    return scope === "site" ? siteSettings : globalSettings;
  }

  // What the current site actually renders: its override if one exists,
  // otherwise the global default.
  function resolvedForCurrentSite() {
    return hasSiteOverride ? siteSettings : globalSettings;
  }

  function applyScopeUI() {
    const isSite = scope === "site";
    scopeSiteButton.classList.toggle("is-active", isSite);
    scopeGlobalButton.classList.toggle("is-active", !isSite);
    resetButton.textContent = isSite ? "Reset This Site" : "Reset to Defaults";
  }

  function saveAndApply(updates) {
    Object.assign(activeSettings(), updates);
    if (scope === "site") hasSiteOverride = true;

    sendToActiveTab({
      action: "applySettings",
      settings: { ...resolvedForCurrentSite() },
    });

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      if (scope === "site" && domain) {
        setSiteSettings(domain, siteSettings);
      } else {
        setGlobalSettings(globalSettings);
      }
    }, 300);
  }

  scopeSiteButton.addEventListener("click", () => {
    if (scope === "site" || scopeSiteButton.disabled) return;
    scope = "site";
    applyScopeUI();
    populateControls(siteSettings);
  });

  scopeGlobalButton.addEventListener("click", () => {
    if (scope === "global") return;
    scope = "global";
    applyScopeUI();
    populateControls(globalSettings);
  });

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
    clearTimeout(saveTimeout);

    if (scope === "site" && domain) {
      // Remove the override so the site falls back to the global default.
      hasSiteOverride = false;
      Object.assign(siteSettings, globalSettings);
      removeSiteSettings(domain);
      populateControls(siteSettings);
    } else {
      Object.assign(globalSettings, DEFAULTS);
      setGlobalSettings(globalSettings);
      populateControls(globalSettings);
    }

    sendToActiveTab({
      action: "applySettings",
      settings: { ...resolvedForCurrentSite() },
    });
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

function domainFromTab(tab) {
  if (!tab || !tab.url) return null;
  try {
    const url = new URL(tab.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return getBaseDomain(url.hostname);
  } catch {
    return null;
  }
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
