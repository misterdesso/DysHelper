const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

const { performOCR } = require("./utils/ocrService");

const app = express();
const PORT = process.env.PORT || 3000;

// Constants
const uploadFolder = path.join(__dirname, "tmp_uploads");
const outputFolder = path.join(__dirname, "ocr_outputs");

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Multer for uploading files
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(uploadFolder, { recursive: true });
      cb(null, uploadFolder);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max file size
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Accept JPEG/PNG/WEBP/HEIC."));
    }
  },
});

// Create output directory if it doesn't exist
fs.mkdir(outputFolder, { recursive: true }).catch((err) => {
  console.error("Failed to create output directory:", err);
});

// Routing (POST /api/v1/ocr)
app.post("/api/v1/ocr", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file uploaded.',
    });
  }

  const filePath = req.file.path;

  try {
    const ocrResult = await performOCR(filePath, { lang: "eng" });

    // // Save OCR results to files (FOR DEBUGGING)
    // const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // // Save as json
    // const jsonOutput = {
    //   timestamp,
    //   originalFile: req.file.originalname,
    //   results: {
    //     text: ocrResult.text,
    //     confidence: ocrResult.confidence,
    //     wordsCount: ocrResult.wordsCount
    //   }
    // };

    // await fs.writeFile(
    //   path.join(outputFolder, `output-${timestamp}.json`),
    //   JSON.stringify(jsonOutput, null, 2)
    // );

    // // Save as txt
    // await fs.writeFile(
    //   path.join(outputFolder, `output-${timestamp}.txt`),
    //   ocrResult.text
    // );

    // Format return data for frontend
    res.json({
      success: true,
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      wordsCount: ocrResult.wordsCount,
    });
  } catch (err) {
    console.error("OCR processing failed:", err);
    res.status(500).json({
      success: false,
      error: "OCR processing failed",
      message: err.message,
    });
  } finally {
    // Clean up uploaded file
    try {
      await fs.unlink(filePath);
    } catch (cleanupErr) {
      console.warn("Failed to delete temp file:", filePath, cleanupErr);
    }
  }
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`OCR server listening on port ${PORT}`);
});
