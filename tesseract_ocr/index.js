/**
 * index.js
 *
 * Main Express server: exposes a POST /api/v1/ocr endpoint that accepts an image file
 * and returns extracted text via the OCR service.
 *
 * - Uses multer to parse multipart/form-data uploads (images).
 * - Uses tesseract.js (ocrService.js) to extract text.
 * - Basic security: helmet, CORS, input validation and file-size limits.
 *
 * Run:
 *   npm install
 *   npm run dev   # requires nodemon or use `npm start`
 */

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const { performOCR } = require('./utils/ocrService');

const app = express();
const PORT = process.env.PORT || 3000;

// ----- Constants ----- //
const uploadFolder = path.join(__dirname, 'tmp_uploads');
const outputFolder = path.join(__dirname, 'ocr_outputs');

// ----- Middlewares ----- //
app.use(helmet()); // basic security HTTP headers
app.use(cors()); // enable CORS - adjust origin in production
app.use(morgan('dev')); // logging middleware
app.use(express.json()); // parse JSON body for other endpoints if needed

// ----- Multer setup for file uploads ----- //
// We store uploaded images temporarily on disk, then delete after processing.
// Limits: file size capped to 8MB (adjust as needed)
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // ensure the upload folder exists
    try {
      await fs.mkdir(uploadFolder, { recursive: true });
      cb(null, uploadFolder);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    // create a unique filename using uuid + original extension
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (req, file, cb) => {
    // Accept common image mime types
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Accept JPEG/PNG/WEBP/HEIC.'));
    }
  }
});

// Create output directory if it doesn't exist
fs.mkdir(outputFolder, { recursive: true }).catch(err => {
  console.error('Failed to create output directory:', err);
});

// ----- Routes ----- //

/**
 * POST /api/v1/ocr
 * - Accepts form-data: single file field named "image"
 * - Optional query/body params could be added later (language, enhanceImage, etc.)
 * - Returns: { text: "...", raw: {...} }
 */
app.post('/api/v1/ocr', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file uploaded. Please upload an "image" field.' });
  }

  const filePath = req.file.path;

  try {
    const ocrResult = await performOCR(filePath, { lang: 'eng' });

    // Save OCR results to files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save as JSON
    const jsonOutput = {
      timestamp,
      originalFile: req.file.originalname,
      results: {
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        wordsCount: ocrResult.wordsCount
      }
    };
    
    await fs.writeFile(
      path.join(outputFolder, `output-${timestamp}.json`),
      JSON.stringify(jsonOutput, null, 2)
    );

    // Save as TXT
    await fs.writeFile(
      path.join(outputFolder, `output-${timestamp}.txt`),
      ocrResult.text
    );

    // Modified response structure to match frontend expectations
    res.json({
      success: true,
      text: ocrResult.text,  // Changed from extractedText to text
      confidence: ocrResult.confidence,
      wordsCount: ocrResult.wordsCount
    });
  } catch (err) {
    console.error('OCR processing failed:', err);
    res.status(500).json({ 
      success: false, 
      error: 'OCR processing failed', 
      message: err.message 
    });
  } finally {
    // clean up the uploaded file no matter what
    try {
      await fs.unlink(filePath);
    } catch (cleanupErr) {
      // non-fatal, just log
      console.warn('Failed to delete temp file:', filePath, cleanupErr);
    }
  }
});

// simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// global error handler (basic)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`OCR server listening on port ${PORT}`);
});
