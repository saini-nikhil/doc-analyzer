import React from "react";

const SectionsTab = ({ sectionSummaries, activeTab }) => {
  return (
    <div id="sections" className={`mb-6 ${activeTab !== "sections" ? "hidden" : ""}`}>
      {sectionSummaries && sectionSummaries.sections ? (
        <div className="space-y-4">
          {sectionSummaries.sections.map((section, index) => (
            <div key={index} className="border-l-4 border-green-500 pl-4 py-2 bg-white hover:bg-green-50 rounded-lg transition-all duration-200 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800">{section.title}</h3>
              <p className="text-gray-700 my-2 text-sm">{section.summary}</p>
              {section.keyEntities && section.keyEntities.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600">Key entities:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {section.keyEntities.map((entity, i) => (
                      <span key={i} className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded">
                        {entity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Section summaries not available in structured format
        </div>
      )}
    </div>
  );
};

export default SectionsTab;
