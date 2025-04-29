import React from "react";

const EntitiesTab = ({ extractedEntities, activeTab }) => {
  return (
    <div id="entities" className={`mb-6 ${activeTab !== "entities" ? "hidden" : ""}`}>
      {extractedEntities ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* People */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200">
            <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              People
            </h3>
            {extractedEntities.people && extractedEntities.people.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {extractedEntities.people.map((person, i) => (
                  <li key={i} className="text-gray-700 text-sm">{person}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-sm">No people identified</p>
            )}
          </div>
          
          {/* Organizations */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200">
            <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Organizations
            </h3>
            {extractedEntities.organizations && extractedEntities.organizations.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {extractedEntities.organizations.map((org, i) => (
                  <li key={i} className="text-gray-700 text-sm">{org}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-sm">No organizations identified</p>
            )}
          </div>
          
          {/* Locations */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200">
            <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Locations
            </h3>
            {extractedEntities.locations && extractedEntities.locations.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {extractedEntities.locations.map((location, i) => (
                  <li key={i} className="text-gray-700 text-sm">{location}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-sm">No locations identified</p>
            )}
          </div>
          
          {/* Dates */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200">
            <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Dates
            </h3>
            {extractedEntities.dates && extractedEntities.dates.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {extractedEntities.dates.map((date, i) => (
                  <li key={i} className="text-gray-700 text-sm">{date}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-sm">No dates identified</p>
            )}
          </div>
          
          {/* Key Topics */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200 md:col-span-2">
            <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Key Topics
            </h3>
            {extractedEntities.keyTopics && extractedEntities.keyTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {extractedEntities.keyTopics.map((topic, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-lg">
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">No key topics identified</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Entity extraction results not available in structured format
        </div>
      )}
    </div>
  );
};

export default EntitiesTab;
