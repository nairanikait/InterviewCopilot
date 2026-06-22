const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');

/**
 * Parses a PDF file, saves extracted text to DB, then deletes the temp file.
 * @param {object} file      - Multer file object
 * @param {string} userId
 * @returns {Promise<Resume>}
 */
const uploadResume = async (file, userId) => {
  let dataBuffer;
  try {
    dataBuffer = fs.readFileSync(file.path);
  } catch {
    const err = new Error('Failed to read uploaded file.');
    err.statusCode = 500;
    throw err;
  }

  let pdfData;
  try {
    pdfData = await pdfParse(dataBuffer);
  } catch {
    throw Object.assign(new Error('Failed to parse PDF. Ensure the file is a valid, readable PDF.'), { statusCode: 422 });
  } finally {
    // Always delete temp file regardless of parse success/failure
    try {
      fs.unlinkSync(file.path);
    } catch {
      // Non-fatal — log and continue
      console.warn('[Resume] Could not delete temp file:', file.path);
    }
  }

  const extractedText = (pdfData.text || '').trim();
  if (!extractedText) {
    throw Object.assign(new Error('Could not extract text from PDF. The file may be image-only or corrupted.'), { statusCode: 422 });
  }

  const resume = await Resume.create({
    userId,
    originalName: file.originalname,
    extractedText,
  });

  return resume;
};

module.exports = { uploadResume };
