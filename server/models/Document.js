const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: true,
    unique: true
  },
  fileName: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  textPreview: {
    type: String,
    required: false
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  analysisResults: [{
    type: mongoose.Schema.Types.Mixed,
    default: []
  }]
});

module.exports = mongoose.model('Document', DocumentSchema);
