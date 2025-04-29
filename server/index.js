// backend/src/index.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;
const geminiApiKey = process.env.GEMINI_API_KEY ;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Set up GridFS
let gfs;
mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper function for delay (used in retry logic)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to call AI API with exponential backoff retry
async function callAIWithRetry(prompt, retries = 2, backoff = 300) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.candidates && 
        response.data.candidates.length > 0 && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts.length > 0) {
      return response.data.candidates[0].content.parts[0].text;
    } else if (response.data.promptFeedback && response.data.promptFeedback.blockReason) {
      throw new Error(`Gemini API blocked the request: ${response.data.promptFeedback.blockReason}`);
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }
  } catch (error) {
    if (retries > 0) {
      console.log(`AI API call failed, retrying in ${backoff}ms... (${retries} retries left)`);
      await delay(backoff);
      return callAIWithRetry(prompt, retries - 1, backoff * 2);
    } else {
      throw error;
    }
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });}) 

// File upload endpoint
app.post('/upload', upload.single('document'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname.toLowerCase();
  const fileExt = path.extname(fileName);
  const fileId = uuidv4();

  try {
    let extractedText = '';

    // Extract text from different file types
    if (fileExt === '.pdf') {
      const pdfData = await pdfParse(fileBuffer);
      extractedText = pdfData.text;
    } else if (fileExt === '.txt') {
      extractedText = fileBuffer.toString('utf-8');
    } else if (fileExt === '.docx') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = result.value;
    } else {
      return res.status(400).json({ 
        error: 'Unsupported file type. Please upload a .pdf, .txt, or .docx file.' 
      });
    }

    // Store file in MongoDB GridFS
    const uploadStream = gfs.openUploadStream(fileName, {
      metadata: {
        fileId,
        contentType: req.file.mimetype,
        extractedText: extractedText.substring(0, 1000) // Store preview of text
      }
    });
    
    uploadStream.write(fileBuffer);
    uploadStream.end();

    // Store extracted text in a separate file for quick retrieval
    const textFilename = `${fileId}.txt`;
    fs.writeFileSync(path.join(__dirname, '../uploads', textFilename), extractedText);

    res.json({ 
      message: 'File uploaded and text extracted successfully.', 
      content: extractedText,
      fileId
    });

  } catch (error) {
    console.error('Error processing uploaded file:', error.message);
    res.status(500).json({ error: 'Failed to extract text from the uploaded file.' });
  }
});

// Document analysis endpoint
app.post('/analyze', async (req, res) => {
  const { content, prompts } = req.body;

  if (!content || !Array.isArray(prompts) || prompts.length === 0) {
    return res.status(400).json({ error: 'Missing document content or prompts.' });
  }

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured in the backend.' });
  }

  try {
    let currentContext = content;
    const intermediateResults = [];
    let finalResult = '';
    let structuredData = {};

    // Chain of prompts execution
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      
      // Construct a contextual prompt that passes previous results
      let aiPrompt = `Context Document:\n"${currentContext}"\n\n`;
      
      // Include intermediate results in the prompt for context
      if (intermediateResults.length > 0) {
        aiPrompt += "Previously extracted information:\n";
        for (let j = 0; j < intermediateResults.length; j++) {
          aiPrompt += `Step ${j+1}: ${intermediateResults[j]}\n\n`;
        }
      }
      
      aiPrompt += `Instructions:\n${prompt}\n\nAnswer:`;

      try {
        const aiResponse = await callAIWithRetry(aiPrompt);
        intermediateResults.push(aiResponse);
        currentContext = aiResponse; // Chain the output
        finalResult = aiResponse;
        
        // Try to extract structured data if the prompt requests it
        if (prompt.toLowerCase().includes('json') || 
            prompt.toLowerCase().includes('structured') ||
            prompt.toLowerCase().includes('extract')) {
          try {
            // Try to find a JSON object in the response
            const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                            aiResponse.match(/\{[\s\S]*\}/);
                            
            if (jsonMatch) {
              const jsonStr = jsonMatch[1] || jsonMatch[0];
              const parsedData = JSON.parse(jsonStr);
              structuredData[`step${i+1}`] = parsedData;
            }
          } catch (jsonError) {
            console.log('Could not extract structured data from response');
          }
        }
      } catch (error) {
        return res.status(500).json({ 
          error: `Error during step ${i+1} of document analysis: ${error.message}`,
          partialResults: intermediateResults.length > 0 ? intermediateResults : null
        });
      }
    }

    res.json({ 
      results: { 
        finalResult, 
        intermediateResults,
        structuredData: Object.keys(structuredData).length > 0 ? structuredData : null
      }
    });

  } catch (error) {
    console.error('Error in analysis chain:', error.message);
    res.status(500).json({ 
      error: `Error during document analysis: ${error.message}`,
      partialResults: intermediateResults && intermediateResults.length > 0 ? intermediateResults : null
    });
  }
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