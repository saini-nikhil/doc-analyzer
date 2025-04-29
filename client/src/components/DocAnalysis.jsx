import React, { useState, useRef } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";
import AnalysisSettings from "./AnalysisSettings";
import AnalysisResults from "./AnalysisResults";

const BACKEND_URL = 'http://localhost:5000';

// Example chain-of-prompts
const DEFAULT_PROMPTS = [
  // First prompt extracts key entities in structured format
  `Extract all key entities from the document and organize them into the following categories:
  - People: Full names of individuals mentioned
  - Organizations: Companies, institutions, or other formal groups
  - Locations: Places, addresses, countries, or regions
  - Dates: All dates, timeframes, or periods
  - Key Topics: Main subjects or themes discussed
  
  Return the results in valid JSON format as follows:
  \`\`\`json
  {
    "people": ["Name 1", "Name 2"],
    "organizations": ["Org 1", "Org 2"],
    "locations": ["Location 1", "Location 2"],
    "dates": ["Date 1", "Date 2"],
    "keyTopics": ["Topic 1", "Topic 2"]
  }
  \`\`\``,
  
  // Second prompt creates section summaries
  `Based on the document and the extracted entities, identify the main sections or logical parts of the document. 
  For each section, provide:
  1. A title or heading that describes the section
  2. A 1-2 sentence summary of the key points
  3. The most important entities related to that section
  
  Format your response as valid JSON:
  \`\`\`json
  {
    "sections": [
      {
        "title": "Section title",
        "summary": "Brief summary of this section",
        "keyEntities": ["Entity 1", "Entity 2"]
      }
    ]
  }
  \`\`\``,
  
  // Third prompt evaluates sentiment and importance
  `Analyze the document to determine:
  1. The overall sentiment (positive, negative, neutral, or mixed)
  2. The apparent purpose of the document
  3. The top 3 most important takeaways
  4. Any action items or next steps implied by the document
  
  Format your response as valid JSON:
  \`\`\`json
  {
    "sentiment": {
      "overall": "positive|negative|neutral|mixed",
      "score": 0.7, 
      "explanation": "Brief explanation of sentiment assessment"
    },
    "purpose": "Brief statement of document purpose",
    "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
    "actionItems": ["Action 1", "Action 2"]
  }
  \`\`\``
];

function DocAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysisPrompts, setAnalysisPrompts] = useState(DEFAULT_PROMPTS);
  const [showPrompts, setShowPrompts] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const fileInputRef = useRef(null);
  const [fileId, setFileId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState("entities");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File is too large. Maximum file size is 10MB.");
        return;
      }
      
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!['pdf', 'txt', 'docx'].includes(fileExt)) {
        setError("Unsupported file type. Please upload a PDF, TXT, or DOCX file.");
        return;
      }
      
      setSelectedFile(file);
      setError("");
    }
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setError("");
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setExtractedText(response.data.content);
      setFileId(response.data.fileId);
      setError("");
    } catch (error) {
      console.error("File upload error:", error);
      setError(`Failed to upload file: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePromptChange = (index, value) => {
    const newPrompts = [...analysisPrompts];
    newPrompts[index] = value;
    setAnalysisPrompts(newPrompts);
  };

  const handleAddPrompt = () => {
    setAnalysisPrompts([...analysisPrompts, ""]);
  };

  const handleRemovePrompt = (index) => {
    const newPrompts = [...analysisPrompts];
    newPrompts.splice(index, 1);
    setAnalysisPrompts(newPrompts);
  };

  const handleAnalyze = async () => {
    if (!extractedText) {
      setError("Please upload a document first.");
      return;
    }

    if (analysisPrompts.some(prompt => !prompt.trim())) {
      setError("All prompts must be filled.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setAnalysisResult(null);
    setRetryCount(0);
    setCurrentPromptIndex(0);

    try {
      const response = await axios.post(`${BACKEND_URL}/analyze`, {
        content: extractedText,
        prompts: analysisPrompts,
      });
      
      setAnalysisResult(response.data.results);
    } catch (error) {
      console.error("Analysis error:", error);
      
      if (error.response?.data?.partialResults) {
        // Show partial results if we have them
        setAnalysisResult({
          intermediateResults: error.response.data.partialResults,
          finalResult: "Analysis was incomplete due to an error.",
          isPartial: true
        });
      }
      
      setError(`Analysis failed: ${error.response?.data?.error || error.message}`);
      
      // Implement retry logic for frontend
      if (retryCount < 2) {
        setError(`Analysis attempt ${retryCount + 1} failed. Retrying...`);
        setRetryCount(prev => prev + 1);
        
        // Wait 2 seconds before retry
        setTimeout(() => {
          handleAnalyze();
        }, 2000);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to try parsing JSON from responses
  const tryParseJSON = (text) => {
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                       text.match(/\{[\s\S]*\}/);
                       
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
    } catch (e) {
      console.log("Failed to parse JSON from response");
    }
    return null;
  };

  // Extract structured data from analysis results
  const extractedEntities = analysisResult?.structuredData?.step1 || 
                           tryParseJSON(analysisResult?.intermediateResults?.[0] || "");
                           
  const sectionSummaries = analysisResult?.structuredData?.step2 || 
                          tryParseJSON(analysisResult?.intermediateResults?.[1] || "");
                           
  const sentimentAnalysis = analysisResult?.structuredData?.step3 || 
                           tryParseJSON(analysisResult?.intermediateResults?.[2] || "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-16">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            AI Document Analysis
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Upload your document and get AI-powered insights, summaries, and analysis through a multi-step chain of specialized prompts.
          </p>
        </div>
        
        {/* File Upload Section */}
        <FileUpload 
          selectedFile={selectedFile}
          isUploading={isUploading}
          isAnalyzing={isAnalyzing}
          error={error}
          extractedText={extractedText}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleFileUploadClick={handleFileUploadClick}
          handleUpload={handleUpload}
        />

        {/* Analysis Settings Section */}
        {extractedText && (
          <AnalysisSettings 
            extractedText={extractedText}
            isAnalyzing={isAnalyzing}
            showPrompts={showPrompts}
            setShowPrompts={setShowPrompts}
            analysisPrompts={analysisPrompts}
            handlePromptChange={handlePromptChange}
            handleRemovePrompt={handleRemovePrompt}
            handleAddPrompt={handleAddPrompt}
            handleAnalyze={handleAnalyze}
            currentPromptIndex={currentPromptIndex}
          />
        )}

        {/* Results Section */}
        {analysisResult && (
          <AnalysisResults 
            analysisResult={analysisResult}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            extractedEntities={extractedEntities}
            sectionSummaries={sectionSummaries}
            sentimentAnalysis={sentimentAnalysis}
          />
        )}
      </div>
    </div>
  );
}

export default DocAnalysis;
