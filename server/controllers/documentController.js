const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getGridFS } = require('../config/db');
const { extractTextFromFile } = require('../utils/fileParser');
const Document = require('../models/Document');

/**
 * Upload a document and extract its text
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname.toLowerCase();
  const fileId = uuidv4();

  try {
    // Extract text from the file
    const extractedText = await extractTextFromFile(fileBuffer, fileName);
    
    // Store file in MongoDB GridFS
    const gfs = getGridFS();
    const uploadStream = gfs.openUploadStream(fileName, {
      metadata: {
        fileId,
        contentType: req.file.mimetype,
        extractedText: extractedText.substring(0, 1000) // Store preview of text
      }
    });
    
    uploadStream.write(fileBuffer);
    uploadStream.end();

    // Create document record
    await Document.create({
      fileId,
      fileName,
      contentType: req.file.mimetype,
      textPreview: extractedText.substring(0, 1000)
    });

    // Store extracted text in a separate file for quick retrieval
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const textFilename = `${fileId}.txt`;
    fs.writeFileSync(path.join(uploadsDir, textFilename), extractedText);

    res.json({ 
      message: 'File uploaded and text extracted successfully.', 
      content: extractedText,
      fileId
    });

  } catch (error) {
    console.error('Error processing uploaded file:', error.message);
    res.status(500).json({ error: 'Failed to extract text from the uploaded file.' });
  }
};

/**
 * Get a document by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findOne({ fileId: id });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Read the extracted text file
    const textFilePath = path.join(__dirname, '../../uploads', `${id}.txt`);
    if (!fs.existsSync(textFilePath)) {
      return res.status(404).json({ error: 'Document text not found' });
    }
    
    const extractedText = fs.readFileSync(textFilePath, 'utf-8');
    
    res.json({
      document,
      content: extractedText
    });
    
  } catch (error) {
    console.error('Error retrieving document:', error.message);
    res.status(500).json({ error: 'Failed to retrieve document' });
  }
};

module.exports = {
  uploadDocument,
  getDocument
};
