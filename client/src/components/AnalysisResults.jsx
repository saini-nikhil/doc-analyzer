import React from "react";
import ResultTabs from "./ResultTabs";
import EntitiesTab from "./EntitiesTab";
import SectionsTab from "./SectionsTab";
import SentimentTab from "./SentimentTab";
import RawOutputTab from "./RawOutputTab";

const AnalysisResults = ({ 
  analysisResult, 
  activeTab, 
  setActiveTab, 
  extractedEntities, 
  sectionSummaries, 
  sentimentAnalysis 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Analysis Results</h2>
      </div>
      
      {analysisResult.isPartial && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg" role="alert">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-bold">Partial Results</p>
              <p>The analysis was incomplete. Showing the results that were successfully generated.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabbed Results View */}
      <ResultTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Tab Contents */}
      <EntitiesTab extractedEntities={extractedEntities} activeTab={activeTab} />
      <SectionsTab sectionSummaries={sectionSummaries} activeTab={activeTab} />
      <SentimentTab sentimentAnalysis={sentimentAnalysis} activeTab={activeTab} />
      <RawOutputTab analysisResult={analysisResult} activeTab={activeTab} />
    </div>
  );
};

export default AnalysisResults;
