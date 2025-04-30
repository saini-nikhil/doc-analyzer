# DocAnalyzer AI

A powerful document analysis application that uses AI to extract insights, summaries, and structured information from various document formats.

![DocAnalyzer AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue)

## Features

- **Document Upload**: Support for PDF, DOCX, and TXT files
- **Entity Extraction**: Automatically identify people, organizations, locations, dates, and key topics
- **Section Summaries**: Break down complex documents into logical sections with concise summaries
- **Sentiment Analysis**: Understand the tone, purpose, and key takeaways of your documents
- **Structured Output**: Results are provided in structured JSON format for easy integration
- **Caching System**: Efficient response caching to improve performance and reduce API costs

## Tech Stack

### Frontend
- React 19
- Vite 6
- TailwindCSS 4
- React Router 7
- Axios for API requests

### Backend
- Express 5
- Multer for file uploads
- Mammoth for DOCX processing
- PDF-Parse for PDF processing
- MongoDB/GridFS for document storage
- Gemini AI API integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance
- Gemini API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/saini-nikhil/doc-analyzer.git
   cd doc-analyzer
   ```

2. Install dependencies for both client and server
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables
   
   Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   CACHE_SIZE=100
   ```

   Create a `.env` file in the client directory with:
   ```
   VITE_RENDER_URL=your_backend_url
   ```

4. Start the development servers
   ```bash
   # Start the backend server
   cd server
   node index.js
   
   # In a separate terminal, start the frontend
   cd client
   npm run dev
   ```

5. Open your browser and navigate to `https://doc-analyzer-86n6.vercel.app/`

## Usage

1. Upload a document (PDF, DOCX, or TXT) using the file upload interface
2. The system will extract the text content from your document
3. Customize the analysis prompts if needed (defaults are provided)
4. Click "Analyze Document" to process the document
5. View the results in the tabbed interface:
   - Entities: People, organizations, locations, dates, and key topics
   - Sections: Document breakdown with summaries
   - Insights: Sentiment analysis, purpose, and key takeaways

## API Endpoints

- `POST /upload`: Upload a document and extract text
- `POST /analyze`: Analyze document content with AI
- `GET /cache/stats`: Get cache statistics
- `POST /cache/clear`: Clear the response cache
- `GET /health`: Health check endpoint

## Performance Optimization

The application includes a caching system that stores AI responses to improve performance and reduce API costs. The cache size can be configured through the `CACHE_SIZE` environment variable.



