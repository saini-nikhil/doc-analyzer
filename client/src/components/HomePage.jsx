import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Add a scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          el.classList.add('animate-fade-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center pt-16">
      {/* Hero section with animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white bg-opacity-20"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center relative z-10">
        <div className="transform -rotate-1 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white border-opacity-20 mb-12 animate-on-scroll">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-indigo-900">
            DocAnalyzer AI
          </h1>
          <p className="text-xl md:text-2xl font-medium text-indigo-800 mb-8 max-w-3xl mx-auto">
            Unlock the power of AI to analyze your documents and extract valuable insights in seconds
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-indigo-800 bg-opacity-80 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg border border-indigo-700 border-opacity-50 transform transition-all duration-300 hover:scale-105 animate-on-scroll">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Entity Extraction</h3>
            <p className="text-gray-100 font-medium">Automatically identify people, organizations, locations, and key topics from your documents.</p>
          </div>
          
          <div className="bg-purple-800 bg-opacity-80 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg border border-purple-700 border-opacity-50 transform transition-all duration-300 hover:scale-105 animate-on-scroll" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Section Summaries</h3>
            <p className="text-gray-100 font-medium">Break down complex documents into logical sections with concise summaries for each part.</p>
          </div>
          
          <div className="bg-pink-800 bg-opacity-80 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg border border-pink-700 border-opacity-50 transform transition-all duration-300 hover:scale-105 animate-on-scroll" style={{animationDelay: '0.4s'}}>
            <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Sentiment Analysis</h3>
            <p className="text-gray-100 font-medium">Understand the tone, purpose, and key takeaways of your documents with AI-powered sentiment analysis.</p>
          </div>
        </div>
        
        <Link 
          to="/analyze" 
          className="inline-block px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-800 to-purple-800 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-indigo-900 hover:to-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 animate-pulse animate-on-scroll"
        >
          Try Now
        </Link>
        
        <div className="mt-16 flex flex-wrap justify-center gap-4 animate-on-scroll" style={{animationDelay: '0.6s'}}>
          <div className="bg-indigo-800 bg-opacity-80 backdrop-filter backdrop-blur-lg px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-white">Supports PDF, DOCX, TXT</span>
          </div>
          <div className="bg-purple-800 bg-opacity-80 backdrop-filter backdrop-blur-lg px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-white">Powered by Gemini AI</span>
          </div>
          <div className="bg-pink-800 bg-opacity-80 backdrop-filter backdrop-blur-lg px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-white">Secure & Private</span>
          </div>
        </div>
      </div>
      
      <footer className="w-full py-6 bg-black bg-opacity-80">
        <div className="container mx-auto px-4 text-center text-sm">
          <p className="text-white font-medium">© 2025 DocAnalyzer AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  
  .animate-fade-in {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);