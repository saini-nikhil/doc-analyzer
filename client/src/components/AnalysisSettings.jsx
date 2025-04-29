import React from "react";

const AnalysisSettings = ({
  extractedText,
  isAnalyzing,
  showPrompts,
  setShowPrompts,
  analysisPrompts,
  handlePromptChange,
  handleRemovePrompt,
  handleAddPrompt,
  handleAnalyze,
  currentPromptIndex
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Configure Analysis Chain</h2>
        <button
          className="ml-auto text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center focus:outline-none"
          onClick={() => setShowPrompts(!showPrompts)}
        >
          {showPrompts ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Hide Prompts
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Show Prompts
            </>
          )}
        </button>
      </div>

      {showPrompts && (
        <div className="mb-8 bg-gray-50 rounded-xl p-5">
          <p className="text-sm text-gray-600 mb-4">
            The AI will process your document through this sequence of prompts. Each prompt builds on the previous analysis:
          </p>
          
          {analysisPrompts.map((prompt, index) => (
            <div key={index} className="mb-6 border-l-4 border-purple-400 pl-4 rounded-r-lg bg-white p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-800 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-bold mr-2">
                    {index + 1}
                  </span>
                  Prompt {index + 1}
                </h3>
                <button
                  onClick={() => handleRemovePrompt(index)}
                  disabled={analysisPrompts.length <= 1}
                  className={`text-sm font-medium rounded-lg px-2 py-1 flex items-center ${
                    analysisPrompts.length <= 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => handlePromptChange(index, e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-500 focus:outline-none"
                rows="4"
                placeholder="Enter prompt instructions..."
              />
            </div>
          ))}
          
          <button
            onClick={handleAddPrompt}
            className="text-sm bg-white hover:bg-gray-50 text-purple-700 hover:text-purple-800 py-2 px-4 rounded-lg border border-purple-200 hover:border-purple-300 flex items-center shadow-sm transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Another Prompt
          </button>
        </div>
      )}

      <button
        className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
          !extractedText || isAnalyzing 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-300'
        }`}
        onClick={handleAnalyze}
        disabled={!extractedText || isAnalyzing}
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Step {currentPromptIndex + 1} of {analysisPrompts.length}...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Analysis Chain
          </div>
        )}
      </button>
      
      {isAnalyzing && (
        <div className="mt-6">
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${((currentPromptIndex + 1) / analysisPrompts.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Step {currentPromptIndex + 1}</span>
            <span>{Math.round(((currentPromptIndex + 1) / analysisPrompts.length) * 100)}% Complete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisSettings;
