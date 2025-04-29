const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadDocument, getDocument } = require('../controllers/documentController');

// Configure multer for file storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Document routes
router.post('/upload', upload.single('document'), uploadDocument);
router.get('/:id', getDocument);

module.exports = router;
