const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import routes
const documentRoutes = require('./routes/documentRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// Use routes
app.use('/documents', documentRoutes);
app.use('/analyze', analysisRoutes);

// Backward compatibility for existing frontend
app.post('/upload', (req, res) => {
  // Forward to the new route structure
  req.url = '/documents/upload';
  app.handle(req, res);
});

// Start the server
app.listen(port, () => {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  console.log(`Server listening on port ${port}`);
});
