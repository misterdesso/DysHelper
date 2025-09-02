/**
 * ocrService.js
 *
 * Service module for performing OCR on images using Tesseract.js.
 * Handles image processing and text extraction.
 */

const Tesseract = require('tesseract.js');

/**
 * Performs OCR on an image file.
 * @param {string} imagePath - Path to the image file.
 * @param {object} options - Options for OCR (e.g., language).
 * @returns {Promise<{text: string, confidence: number, wordsCount: number}>} OCR result.
 */
async function performOCR(imagePath, options = {}) {
  const { lang = 'eng' } = options;

  try {
    // Execute OCR with Tesseract.js
    const { data } = await Tesseract.recognize(imagePath, lang, {
      logger: (message) => console.log(message), // Log progress for debugging
    });

    // Extract text and confidence from result
    const text = data.text || '';
    const confidence = data.confidence || 0;
    const wordsCount = text.split(/\s+/).filter(word => word.length > 0).length;

    return {
      text,
      confidence,
      wordsCount,
    };
  } catch (error) {
    console.error('Error in Tesseract OCR processing:', error);
    throw new Error(`OCR processing failed: ${error.message}`);
  }
}

module.exports = {
  performOCR,
};