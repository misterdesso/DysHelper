import { setLocal } from "../shared/storage.js";
import { getActiveTab } from "../shared/messaging.js";
import { DEFAULTS, SETTING_KEYS } from "../shared/defaults.js";
import { getBaseDomain } from "../shared/domain.js";
import {
  getGlobalSettings,
  setGlobalSettings,
  getSiteSettings,
  setSiteSettings,
  removeSiteSettings,
  normalizeSiteSettings,
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
  const saveButton = document.getElementById("save-button");
  const scopeSiteLabel = document.getElementById("scope-site-label");
  const scopeSiteButton = document.getElementById("scope-site-button");
  const scopeGlobalButton = document.getElementById("scope-global-button");
  const imageUpload = document.getElementById("image-upload");
  const uploadStatus = document.getElementById("upload-status");

  // Resolve the current site from the active tab.
  const tab = await getActiveTab();
  const domain = domainFromTab(tab);

  // Live previews stream to the content script over a port. When the popup
  // closes the port disconnects and the content script reverts to saved
  // settings, so an unsaved preview never lingers on the page.
  const previewPort =
    tab && domain ? chrome.tabs.connect(tab.id, { name: "dys-preview" }) : null;

  // Saved baselines (what is currently persisted).
  let globalSaved = await getGlobalSettings();
  let siteSaved = domain
    ? normalizeSiteSettings(await getSiteSettings(domain), globalSaved)
    : null;
  let hasSiteOverrideSaved = Boolean(siteSaved);

  // Working copies (what the controls show and what the page previews).
  // The site copy is seeded from the global default when no override exists.
  const globalWorking = { ...globalSaved };
  const siteWorking = siteSaved ? { ...siteSaved } : { ...globalSaved };

  // Per-site is the default scope; restricted pages fall back to global only.
  let scope = domain ? "site" : "global";

  if (domain) {
    scopeSiteLabel.textContent = domain;
  } else {
    scopeSiteLabel.textContent = "Unavailable on this page";
    scopeSiteButton.disabled = true;
  }

  applyScopeUI();
  populateControls(working());
  refreshSaveButton();

  function working() {
    return scope === "site" ? siteWorking : globalWorking;
  }

  // The committed baseline for the current scope — what a save would compare
  // against. In site scope with no saved override, that baseline is global.
  function savedBaseline() {
    if (scope === "site") return siteSaved ?? globalSaved;
    return globalSaved;
  }

  // What the current site actually renders in preview: the site working copy
  // when editing the site, otherwise its saved override (if any) or the
  // working global default.
  function previewSettings() {
    if (scope === "site") return siteWorking;
    return hasSiteOverrideSaved ? siteSaved : globalWorking;
  }

  function isDirty() {
    return !settingsEqual(working(), savedBaseline());
  }

  function applyScopeUI() {
    const isSite = scope === "site";
    scopeSiteButton.classList.toggle("is-active", isSite);
    scopeGlobalButton.classList.toggle("is-active", !isSite);
    resetButton.textContent = isSite ? "Reset This Site" : "Reset to Defaults";
  }

  function refreshSaveButton() {
    saveButton.disabled = !isDirty();
  }

  // Live preview to the page + refresh the Save button. Never writes storage.
  function previewAndRefresh() {
    if (previewPort) {
      previewPort.postMessage({ settings: { ...previewSettings() } });
    }
    refreshSaveButton();
  }

  function switchScope(target) {
    if (scope === target) return;
    // Discard unsaved changes in the scope we are leaving.
    if (scope === "site") {
      Object.assign(siteWorking, siteSaved ?? globalSaved);
    } else {
      Object.assign(globalWorking, globalSaved);
    }
    scope = target;
    // Load the target scope's saved baseline into its working copy.
    if (target === "site") {
      Object.assign(siteWorking, siteSaved ?? globalSaved);
    } else {
      Object.assign(globalWorking, globalSaved);
    }
    applyScopeUI();
    populateControls(working());
    previewAndRefresh();
  }

  scopeSiteButton.addEventListener("click", () => {
    if (!scopeSiteButton.disabled) switchScope("site");
  });

  scopeGlobalButton.addEventListener("click", () => switchScope("global"));

  fontFamilySelect.addEventListener("change", () => {
    working().fontFamily = fontFamilySelect.value;
    previewAndRefresh();
  });

  fontSizeSlider.addEventListener("input", () => {
    const val = parseFloat(fontSizeSlider.value);
    fontSizeValue.textContent = `${val.toFixed(1)}x`;
    working().fontSize = val;
    previewAndRefresh();
  });

  letterSpacingSlider.addEventListener("input", () => {
    const val = parseFloat(letterSpacingSlider.value);
    letterSpacingValue.textContent = `${val.toFixed(2)}em`;
    working().letterSpacing = val;
    previewAndRefresh();
  });

  wordSpacingSlider.addEventListener("input", () => {
    const val = parseFloat(wordSpacingSlider.value);
    wordSpacingValue.textContent = `${val.toFixed(2)}em`;
    working().wordSpacing = val;
    previewAndRefresh();
  });

  // Reset is staged: it previews the reset and enables Save, but only commits
  // when the user saves.
  resetButton.addEventListener("click", () => {
    if (scope === "site" && domain) {
      Object.assign(siteWorking, globalSaved);
    } else {
      Object.assign(globalWorking, DEFAULTS);
    }
    populateControls(working());
    previewAndRefresh();
  });

  saveButton.addEventListener("click", async () => {
    if (scope === "site" && domain) {
      if (settingsEqual(siteWorking, globalSaved)) {
        // Working copy matches the global default — drop the override.
        await removeSiteSettings(domain);
        hasSiteOverrideSaved = false;
        siteSaved = null;
      } else {
        await setSiteSettings(domain, siteWorking);
        hasSiteOverrideSaved = true;
        siteSaved = { ...siteWorking };
      }
    } else {
      await setGlobalSettings(globalWorking);
      globalSaved = { ...globalWorking };
    }
    refreshSaveButton();
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

function settingsEqual(a, b) {
  return SETTING_KEYS.every((key) => a[key] === b[key]);
}

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
