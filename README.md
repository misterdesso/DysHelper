<div align="center">
  <img src="static/icons/logo_500.png" alt="DysHelper Logo" width="150"/>
  <h1>DysHelper</h1>
</div>

**DysHelper** is a lightweight Chromium extension that brings accessibility to the web for dyslexic users. Through various techniques (see features), it transforms online content to make reading smoother and less overwhelming. The goal goes beyond dyslexia; DysHelper is about creating a more inclusive internet where digital content is clearer, friendlier, and easier to navigate for everyone.

## Features

- **Dyslexia-friendly fonts**: Apply OpenDyslexic (or the Alta and Mono variants) to any webpage
- **Adjustable typography**: Tune font size and letter/word spacing with sliders
- **Per-site memory**: Save different settings for different sites, or adjust the global default
- **Image-to-text (OCR)**: Convert text from images into dyslexia-friendly readable format (runs client-side via Tesseract.js)
- **Clean interface**: Simple, easy-to-use popup controls
- **Cross-platform**: Works on any Chromium-based browser (Chrome, Edge, etc.)

## Installation

### Users

1. Download `dyshelper.zip` from the [latest release](https://github.com/misterdesso/DysHelper/releases/latest) and unzip it.
2. Load the unzipped folder into Chrome.

### Developers

1. Clone the repository:
```bash
git clone https://github.com/misterdesso/DysHelper.git
```

2. Install dependencies and build:
```bash
npm install
npm run build
```

3. Load the `dist` folder into Chrome.

### Load into Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the folder from the step above

## Development

```bash
npm install          # install dependencies
npm run build        # build to dist/
npm run lint         # run ESLint
npm run format       # format with Prettier
npm test             # run unit tests
```

Edit source files in `src/`, static assets in `static/`. The build outputs to `dist/` which is what Chrome loads.

## Usage

1. Open DysHelper from your extension toolbar
2. Choose a font and adjust the size and spacing sliders. Use the **"This Site / All Sites"** switch to scope your changes, then click **Save** to keep them
3. To convert image to text:
   - Click "Upload Screenshot"
   - Select an image containing text
   - Wait for local processing
   - View the converted text in a new tab with dyslexia-friendly formatting

## Notes

### OCR
- Max file size: 5MB
- Supported formats: JPEG, PNG, WEBP
- Runs client-side via Tesseract.js (WASM)
- First use downloads the English language model (needs an internet connection) and may take a few extra seconds to initialise

### Fonts & typography
- Fonts: OpenDyslexic, OpenDyslexic Alta, OpenDyslexic Mono (bundled)
- Font size: 0.8×–2.0×
- Letter spacing: 0–0.3em
- Word spacing: 0–0.5em
- Settings apply globally by default, or per-site (by domain) when scoped to "This Site"
