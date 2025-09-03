/**
 * ocrService.js
 *
 * Service module for performing OCR on images using Tesseract.js.
 * Handles image processing and text extraction.
 */

// const Tesseract = require('tesseract.js');

// /**
//  * Performs OCR on an image file.
//  * @param {string} imagePath - Path to the image file.
//  * @param {object} options - Options for OCR (e.g., language).
//  * @returns {Promise<{text: string, confidence: number, wordsCount: number}>} OCR result.
//  */
// async function performOCR(imagePath, options = {}) {
//   const { lang = 'eng' } = options;

//   try {
//     // Execute OCR with Tesseract.js
//     const { data } = await Tesseract.recognize(imagePath, lang, {
//       logger: (message) => console.log(message), // Log progress for debugging
//     });

//     // Extract text and confidence from result
//     const text = data.text || '';
//     const confidence = data.confidence || 0;
//     const wordsCount = text.split(/\s+/).filter(word => word.length > 0).length;

//     return {
//       text,
//       confidence,
//       wordsCount,
//     };
//   } catch (error) {
//     console.error('Error in Tesseract OCR processing:', error);
//     throw new Error(`OCR processing failed: ${error.message}`);
//   }
// }

// module.exports = {
//   performOCR,
// };

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
  * @param {object} options - Options for OCR (e.g., language, structured).
  * @returns {Promise<
  *   | {text: string, confidence: number, wordsCount: number}
  *   | {plain_text: string, paragraphs: Array<{lines: Array<{text: string, words: Array<{word: string, conf: number, bbox:{x:number,y:number,w:number,h:number}}>}>>}
  * >} OCR result.
  */

async function performOCR(imagePath, options = {}) {
  const { lang = 'eng', structured = false } = options;
 
   try {
     // Execute OCR with Tesseract.js
     const { data } = await Tesseract.recognize(imagePath, lang, {
       logger: (message) => console.log(message), // Log progress for debugging
     });
 
    // Extract text and confidence from result
     const text = data.text || '';
     const confidence = data.confidence || 0;
     const wordsCount = text.split(/\s+/).filter(word => word.length > 0).length;
 
    // If caller wants the original PoC shape, return it unchanged.
    if (!structured) {
      return { text, confidence, wordsCount };
    }

    // --- Structured mode (added) ---
    // Build lines -> paragraphs from tesseract word boxes.
    const rawWords = Array.isArray(data.words) ? data.words : [];
    const lines = clusterIntoLines(rawWords);
    const paragraphs = clusterLinesIntoParagraphs(lines);

    return {
      plain_text: text.trim(),
      paragraphs
    };
   } catch (error) {
     console.error('Error in Tesseract OCR processing:', error);
     throw new Error(`OCR processing failed: ${error.message}`);
   }
 }

// ----- Helpers (added) -----
const toBBox = (b) => ({ x: b.x0, y: b.y0, w: b.x1 - b.x0, h: b.y1 - b.y0 });

/**
 * Group Tesseract words into lines by vertical proximity, then sort left→right.
 * @param {Array<{ text:string, confidence:number, bbox:{x0:number,y0:number,x1:number,y1:number} }>} words
 * @returns {Array<{ text:string, words:Array<{word:string, conf:number, bbox:{x,y,w,h}}>} >}
 */
function clusterIntoLines(words) {
  if (!words.length) return [];
  const sorted = [...words].sort((a, b) =>
    (a.bbox.y0 - b.bbox.y0) || (a.bbox.x0 - b.bbox.x0)
  );
  const heights = sorted.map(w => w.bbox.y1 - w.bbox.y0).sort((a,b)=>a-b);
  const medianH = heights[Math.floor(heights.length/2)] || 20;
  const threshold = 0.6 * medianH; // bigger gap ⇒ new line

  const groups = [];
  let current = [];
  let lastY = null;
  for (const w of sorted) {
    const y = w.bbox.y0;
    if (lastY !== null && Math.abs(y - lastY) > threshold && current.length) {
      groups.push(current);
      current = [];
    }
    current.push(w);
    lastY = y;
  }
  if (current.length) groups.push(current);

  return groups.map(ws => {
    const wordsInLine = ws
      .sort((a,b)=>a.bbox.x0 - b.bbox.x0)
      .map(w => ({
        word: (w.text || '').trim(),
        conf: Math.round(w.confidence || 0),
        bbox: toBBox(w.bbox)
      }))
      .filter(w => w.word.length > 0);
    return { text: wordsInLine.map(w => w.word).join(' '), words: wordsInLine };
  }).filter(l => l.text.length > 0);
}

/**
 * Group lines into paragraphs using vertical gaps between adjacent lines.
 * @param {Array<{ text:string, words:Array<{bbox:{x,y,w,h}}>} >} lines
 * @returns {Array<{ lines: Array<{ text:string, words:Array }>} >}
 */
function clusterLinesIntoParagraphs(lines) {
  if (!lines.length) return [];
  const lineHeights = lines
    .map(l => Math.max(...l.words.map(w => w.bbox.h)))
    .sort((a,b)=>a-b);
  const medianLH = lineHeights[Math.floor(lineHeights.length/2)] || 20;
  const gapThreshold = 1.8 * medianLH; // bigger gap ⇒ new paragraph

  const paragraphs = [];
  let current = [];
  let lastBottom = null;
  for (const line of lines) {
    const yTop = Math.min(...line.words.map(w => w.bbox.y));
    const yBottom = Math.max(...line.words.map(w => w.bbox.y + w.bbox.h));
    const gap = lastBottom === null ? 0 : (yTop - lastBottom);
    if (lastBottom !== null && gap > gapThreshold && current.length) {
      paragraphs.push(current);
      current = [];
    }
    current.push(line);
    lastBottom = yBottom;
  }
  if (current.length) paragraphs.push(current);
  return paragraphs.map(lines => ({ lines }));
}

 module.exports = {
   performOCR,
 };
