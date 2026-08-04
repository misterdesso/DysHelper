<div align="center">
  <img src="static/icons/logo_500.png" alt="DysHelper Logo" width="150"/>
  <h1>DysHelper</h1>
</div>

**DysHelper** is a lightweight Chromium extension that brings accessibility to the web for dyslexic users. Through various methods, it transforms online content to make reading smoother and less overwhelming. The goal goes beyond dyslexia; DysHelper is about creating a more inclusive internet where digital content is clearer, friendlier, and easier to navigate for all.

## Features

- **OpenDyslexic font integration**: Instantly transforms any webpage text to use the dyslexia-friendly OpenDyslexic font
- **Adjustable letter spacing**: Toggle increased letter and word spacing for improved readability
- **Image-to-text (OCR)**: Convert text from images into dyslexia-friendly readable format (runs locally via Tesseract.js)
- **Clean interface**: Simple, easy-to-use popup controls
- **Cross-platform**: Works on any Chromium-based browser (Chrome, Edge, etc.)

## Installation

### Users

TBC

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
npm run build        # build to dist/
npm run lint         # run ESLint
npm run format       # format with Prettier
npm test             # run unit tests
```

Edit source files in `src/`, static assets in `static/`. The build outputs to `dist/` which is what Chrome loads.

## Usage

1. Click the DysHelper icon in your Chrome toolbar
2. Toggle the OpenDyslexic font and/or letter spacing as needed
3. To convert image to text:
   - Click "Upload Screenshot"
   - Select an image containing text
   - View the progress bar as OCR processes locally
   - View the converted text in a new tab with dyslexia-friendly formatting

## Notes

### OCR
- Max file size: 5MB
- Supported formats: JPEG, PNG, WEBP
- Runs client-side via Tesseract.js (WASM)
- First use may take a few extra seconds to initialise

### Font & Spacing
- Font: OpenDyslexic (Regular, Bold, Italic, Bold Italic, Alta, Mono variants bundled)
- Letter spacing: 0.15em
- Word spacing: 0.25em
