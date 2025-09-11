<div align="center">
  <img src="extension/icons/logo_500.png" alt="DysHelper Logo" width="150"/>
  <h1>DysHelper</h1>
</div>

**DysHelper** is a lightweight yet impactful Chrome extension that brings accessibility to the web for everyone. Built with dyslexic users in mind, it transforms online content to make reading smoother and less overwhelming. Our goal goes beyond dyslexia — DysHelper is about creating a more inclusive internet where digital content is clearer, friendlier, and easier to navigate for all.

## Features

- **OpenDyslexic Font Integration**: Instantly transforms any webpage text to use the dyslexia-friendly OpenDyslexic font
- **Adjustable Letter Spacing**: Toggle increased letter and word spacing for improved readability
- **Image-to-Text (OCR)**: Convert text from images into dyslexia-friendly readable format
- **Clean Interface**: Simple, easy-to-use popup controls
- **Cross-Platform**: Works on any Chromium-based browser (Chrome, Edge, Brave, etc.)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/misterdesso/DysHelper.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the `extension` folder from the cloned repository

## Dependencies

### Chrome Extension
- OpenDyslexic font (included)
- Chrome Extensions API (v3)

### OCR Server
- Node.js (v14 or higher)
- Express.js
- Tesseract.js
- Additional npm packages:
  - cors
  - helmet
  - morgan
  - multer
  - uuid

The OCR functionality is provided through our hosted service at `dyshelper.onrender.com`, eliminating the need for local server setup.

## Usage

1. Click the DysHelper icon in your Chrome toolbar
2. Toggle the OpenDyslexic font and/or letter spacing as needed
3. To convert image to text:
   - Click "Upload Screenshot"
   - Select an image containing text
   - Wait for processing
   - View the converted text in a new tab with dyslexia-friendly formatting

## Configuration

### OCR Service
- Max file size: 8MB
- Supported formats: JPEG, PNG, WEBP, HEIC

### Extension
- Font options: Regular, Bold, Italic, Bold Italic
- Letter spacing: 0.15em
- Word spacing: 0.25em