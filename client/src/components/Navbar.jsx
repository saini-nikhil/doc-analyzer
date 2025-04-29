import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <nav className={`w-full py-4 ${isHomePage ? 'absolute top-0 z-10' : 'bg-indigo-900'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-white text-xl font-bold">DocAnalyzer AI</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          {!isHomePage && (
            <Link to="/" className="text-white hover:text-purple-200 transition-colors">
              Home
            </Link>
          )}
          {isHomePage ? (
            <Link 
              to="/analyze" 
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Now
            </Link>
          ) : (
            <a 
              href="https://github.com/yourusername/doc-analyzer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-purple-200 transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
