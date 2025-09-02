# DysHelper

DysHelper is an all-in-one application that assists dyslexic users with day-to-day understanding and reading of the text around them, whether it be on their smart devices or in real life. Currently features a lightweight OCR (Optical Character Recognition) service built with Node.js and Tesseract.js.

## Features

- Image to text conversion via REST API
- Supports JPEG, PNG, WEBP, and HEIC formats
- Automatic file cleanup after processing
- Results saved in both JSON and TXT formats

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## Usage

Send a POST request to `/api/v1/ocr` with an image file:

```bash
curl -X POST "http://localhost:3000/api/v1/ocr" \
  -H "Accept: application/json" \
  -F "image=@/path/to/your/image.jpg"
```

## Configuration

- Max file size: 8MB
- Supported formats: JPEG, PNG, WEBP, HEIC
- Default port: 3000 (configurable via PORT environment variable)
