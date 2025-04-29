import React from "react";

const ResultTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6">
      <ul className="flex flex-wrap text-sm font-medium text-center border-b border-gray-200">
        <li className="mr-2">
          <a
            href="#entities"
            className={`inline-block p-4 rounded-t-lg border-b-2 ${
              activeTab === "entities"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent hover:border-gray-300 hover:text-gray-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("entities");
            }}
          >
            Key Entities
          </a>
        </li>
        <li className="mr-2">
          <a
            href="#sections"
            className={`inline-block p-4 rounded-t-lg border-b-2 ${
              activeTab === "sections"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent hover:border-gray-300 hover:text-gray-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("sections");
            }}
          >
            Section Summaries
          </a>
        </li>
        <li className="mr-2">
          <a
            href="#sentiment"
            className={`inline-block p-4 rounded-t-lg border-b-2 ${
              activeTab === "sentiment"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent hover:border-gray-300 hover:text-gray-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("sentiment");
            }}
          >
            Sentiment & Takeaways
          </a>
        </li>
        <li className="mr-2">
          <a
            href="#raw"
            className={`inline-block p-4 rounded-t-lg border-b-2 ${
              activeTab === "raw"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent hover:border-gray-300 hover:text-gray-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("raw");
            }}
          >
            Raw Output
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ResultTabs;
