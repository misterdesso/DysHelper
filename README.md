<div align="center">
  <img src="static/icons/logo_500.png" alt="DysHelper Logo" width="150"/>
  <h1>DysHelper</h1>
</div>

**DysHelper** is a lightweight yet impactful Chrome extension that brings accessibility to the web for everyone. Built with dyslexic users in mind, it transforms online content to make reading smoother and less overwhelming. The goal goes beyond dyslexia; DysHelper is about creating a more inclusive internet where digital content is clearer, friendlier, and easier to navigate for all.

## Features

- **OpenDyslexic font integration**: Instantly transforms any webpage text to use the dyslexia-friendly OpenDyslexic font
- **Adjustable letter spacing**: Toggle increased letter and word spacing for improved readability
- **Image-to-text (OCR)**: Convert text from images into dyslexia-friendly readable format (runs locally via Tesseract.js)
- **Clean interface**: Simple, easy-to-use popup controls
- **Cross-platform**: Works on any Chromium-based browser (Chrome, Edge, etc.)

## Installation

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

3. Open Chrome and navigate to `chrome://extensions/`

4. Enable "Developer mode" in the top right corner

5. Click "Load unpacked" and select the `dist` folder from the cloned repository

## Development

```bash
npm install          # install dependencies
npm run build        # production build to dist/
npm run dev          # watch mode (rebuilds on file changes)
npm run lint         # run ESLint
npm run lint:fix     # run ESLint with auto-fix
npm run format       # format with Prettier
npm run format:check # check formatting without writing
npm test             # run unit tests
npm run test:watch   # run tests in watch mode
```

Edit source files in `src/`, static assets in `static/`. The build outputs to `dist/` which is what Chrome loads.

### Project Structure

```
src/
├── background.js          # service worker
├── content/               # content script (injected into all pages)
│   ├── content.js         # entry point
│   ├── font-loader.js     # @font-face injection
│   ├── toggles.js         # CSS class toggle functions
│   └── styles.css         # font/spacing rules
├── popup/                 # extension popup
│   ├── popup.js           # toggle + OCR upload logic
│   ├── popup.html
│   └── popup.css
├── ocr/                   # OCR result page
│   ├── ocr-result.js      # Tesseract.js client-side OCR
│   └── ocr-result.html
└── shared/                # shared utilities
    ├── storage.js         # chrome.storage promise wrappers
    └── messaging.js       # tab messaging helper

static/                    # copied to dist/ as-is
├── manifest.json
├── fonts/                 # OpenDyslexic .woff2 files
└── icons/                 # extension icons

tests/                     # Vitest unit tests
```

## Usage

1. Click the DysHelper icon in your Chrome toolbar
2. Toggle the OpenDyslexic font and/or letter spacing as needed
3. To convert image to text:
   - Click "Upload Screenshot"
   - Select an image containing text (max 5MB; JPEG, PNG, or WEBP)
   - View the progress bar as OCR processes locally
   - View the converted text in a new tab with dyslexia-friendly formatting

## Configuration

### OCR
- Max file size: 5MB
- Supported formats: JPEG, PNG, WEBP
- Runs entirely client-side via Tesseract.js (WASM)
- First use may take a few extra seconds to initialize

### Font & Spacing
- Font: OpenDyslexic (Regular, Bold, Italic, Bold Italic, Alta, Mono variants bundled)
- Letter spacing: 0.15em
- Word spacing: 0.25em
