import React from "react";

const SentimentTab = ({ sentimentAnalysis, activeTab }) => {
  return (
    <div id="sentiment" className={`mb-6 ${activeTab !== "sentiment" ? "hidden" : ""}`}>
      {sentimentAnalysis ? (
        <div className="space-y-6">
          {/* Sentiment Analysis */}
          <div className="bg-gray-50 rounded-lg p-6 hover:bg-white hover:shadow-sm transition-all duration-200 border border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Document Sentiment
            </h3>
            <div className="flex items-center mb-3">
              <div className="flex-1">
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full
                  ${sentimentAnalysis.sentiment.overall === 'positive' ? 'bg-green-100 text-green-800' : 
                    sentimentAnalysis.sentiment.overall === 'negative' ? 'bg-red-100 text-red-800' :
                    sentimentAnalysis.sentiment.overall === 'mixed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'}`}>
                  {sentimentAnalysis.sentiment.overall.charAt(0).toUpperCase() + sentimentAnalysis.sentiment.overall.slice(1)}
                </span>
                {sentimentAnalysis.sentiment.score && (
                  <span className="ml-2 text-xs text-gray-600">
                    Score: {sentimentAnalysis.sentiment.score}
                  </span>
                )}
              </div>
            </div>
            {sentimentAnalysis.sentiment.explanation && (
              <p className="text-gray-700 text-sm">{sentimentAnalysis.sentiment.explanation}</p>
            )}
          </div>
          
          {/* Document Purpose */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200">
            <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Document Purpose
            </h3>
            <p className="text-gray-700 text-sm">{sentimentAnalysis.purpose}</p>
          </div>
          
          {/* Key Takeaways */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200">
            <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Key Takeaways
            </h3>
            {sentimentAnalysis.keyTakeaways && sentimentAnalysis.keyTakeaways.length > 0 ? (
              <ol className="list-decimal list-inside space-y-1">
                {sentimentAnalysis.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="text-gray-700 text-sm">{takeaway}</li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500 italic text-sm">No key takeaways available</p>
            )}
          </div>
          
          {/* Action Items */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200">
            <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Action Items
            </h3>
            {sentimentAnalysis.actionItems && sentimentAnalysis.actionItems.length > 0 ? (
              <ul className="space-y-1">
                {sentimentAnalysis.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 mr-2 bg-indigo-50 text-indigo-700 rounded-full">
                      <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-sm">No action items identified</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Sentiment analysis not available in structured format
        </div>
      )}
    </div>
  );
};

export default SentimentTab;
