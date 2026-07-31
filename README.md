<div align="center">
  <img src="static/icons/logo_500.png" alt="DysHelper Logo" width="150"/>
  <h1>DysHelper</h1>
</div>

**DysHelper** is a lightweight yet impactful Chrome extension that brings accessibility to the web for everyone. Built with dyslexic users in mind, it transforms online content to make reading smoother and less overwhelming. The goal goes beyond dyslexia; DysHelper is about creating a more inclusive internet where digital content is clearer, friendlier, and easier to navigate for all.

## Features

- **OpenDyslexic Font Integration**: Instantly transforms any webpage text to use the dyslexia-friendly OpenDyslexic font
- **Adjustable Letter Spacing**: Toggle increased letter and word spacing for improved readability
- **Image-to-Text (OCR)**: Convert text from images into dyslexia-friendly readable format (runs locally via Tesseract.js)
- **Clean Interface**: Simple, easy-to-use popup controls
- **Cross-Platform**: Works on any Chromium-based browser (Chrome, Edge, Brave, etc.)

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
npm run build        # one-shot production build to dist/
npm run dev          # watch mode (rebuilds on file changes)
npm run lint         # run ESLint
npm run format       # run Prettier
```

Edit source files in `src/`, static assets in `static/`. The build outputs to `dist/` which is what Chrome loads.

## Usage

1. Click the DysHelper icon in your Chrome toolbar
2. Toggle the OpenDyslexic font and/or letter spacing as needed
3. To convert image to text:
   - Click "Upload Screenshot"
   - Select an image containing text (max 5MB)
   - View the progress bar as OCR processes locally
   - View the converted text in a new tab with dyslexia-friendly formatting

## Configuration

### OCR
- Max file size: 5MB
- Supported formats: JPEG, PNG, WEBP
- Runs entirely client-side (first use downloads ~4MB language data)

### Extension
- Font options: Regular, Bold, Italic, Bold Italic
- Letter spacing: 0.15em
- Word spacing: 0.25em
