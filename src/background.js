chrome.runtime.onInstalled.addListener(async () => {
  const raw = await chrome.storage.sync.get([
    "fontEnabled",
    "spacingEnabled",
    "fontFamily",
  ]);

  if ("fontEnabled" in raw && !("fontFamily" in raw)) {
    const fontFamily = raw.fontEnabled !== false ? "opendyslexic" : "none";
    const letterSpacing = raw.spacingEnabled ? 0.15 : 0;
    const wordSpacing = raw.spacingEnabled ? 0.25 : 0;
    await chrome.storage.sync.set({
      fontFamily,
      fontSize: 1.0,
      letterSpacing,
      wordSpacing,
    });
    await chrome.storage.sync.remove(["fontEnabled", "spacingEnabled"]);
  }
});
