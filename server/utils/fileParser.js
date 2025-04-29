const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

/**
 * Extract text from different file types
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromFile = async (fileBuffer, fileName) => {
  const fileExt = path.extname(fileName).toLowerCase();
  
  if (fileExt === '.pdf') {
    const pdfData = await pdfParse(fileBuffer);
    return pdfData.text;
  } else if (fileExt === '.txt') {
    return fileBuffer.toString('utf-8');
  } else if (fileExt === '.docx') {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } else {
    throw new Error('Unsupported file type. Please upload a .pdf, .txt, or .docx file.');
  }
};

module.exports = { extractTextFromFile };
