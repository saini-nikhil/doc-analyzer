import React from "react";
import ReactMarkdown from "react-markdown";

const RawOutputTab = ({ analysisResult, activeTab }) => {
  return (
    <div id="raw" className={`${activeTab !== "raw" ? "hidden" : ""}`}>
      <div className="space-y-4">
        {analysisResult.intermediateResults && analysisResult.intermediateResults.map((result, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200">
            <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold mr-2">
                {index + 1}
              </span>
              Step {index + 1} Output:
            </h3>
            <div className="bg-white p-4 rounded text-sm overflow-auto border border-gray-100 shadow-inner">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RawOutputTab;
