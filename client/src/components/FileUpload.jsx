import React from "react";

const FileUpload = ({ 
  selectedFile, 
  isUploading, 
  isAnalyzing, 
  error, 
  extractedText, 
  fileInputRef, 
  handleFileChange, 
  handleFileUploadClick, 
  handleUpload 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Upload Your Document</h2>
      </div>
      
      <div className="mb-6">
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
          accept=".pdf,.txt,.docx"
        />
        
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="flex items-center px-5 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
            onClick={handleFileUploadClick}
            disabled={isUploading || isAnalyzing}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            {selectedFile ? 'Change File' : 'Select File'}
          </button>
          
          <button
            className={`flex items-center px-5 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 ${
              !selectedFile || isUploading || isAnalyzing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus:ring-purple-300'
            }`}
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || isAnalyzing}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload
              </>
            )}
          </button>
        </div>
        
        {selectedFile && (
          <div className="mt-3 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Supported formats: PDF, TXT, DOCX (Max 10MB)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg" role="alert">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {extractedText && (
        <div className="border border-gray-100 rounded-xl p-5 mt-6 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Extracted Text Preview
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {extractedText.length.toLocaleString()} characters
            </span>
          </div>
          <div className="h-24 overflow-y-auto text-sm bg-white p-4 rounded-lg border border-gray-100 shadow-inner">
            {extractedText.substring(0, 500)}
            {extractedText.length > 500 && (
              <span className="text-indigo-600 font-medium"> ... (content truncated)</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
