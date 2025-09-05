const Tesseract = require("tesseract.js");

async function performOCR(imagePath, options = {}) {
  const { lang = "eng" } = options;

  try {
    // OCR with tesseract
    const { data } = await Tesseract.recognize(imagePath, lang, {
      logger: (message) => console.log(message), // Logs
    });

    // Extract text and confidence
    const text = data.text || "";
    const confidence = data.confidence || 0;
    const wordsCount = text
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    return {
      text,
      confidence,
      wordsCount,
    };
  } catch (error) {
    console.error("Error in Tesseract OCR processing:", error);
    throw new Error(`OCR processing failed: ${error.message}`);
  }
}

module.exports = {
  performOCR,
};
