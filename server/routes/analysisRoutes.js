const express = require('express');
const router = express.Router();
const { analyzeDocument } = require('../controllers/analysisController');

// Analysis routes
router.post('/', analyzeDocument);

module.exports = router;
