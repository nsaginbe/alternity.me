import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Alternity
        </h1>
        <p className="text-gray-600 mb-8">
          Main page coming soon...
        </p>
        <Link 
          to="/coming-soon"
          className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold"
        >
          View Coming Soon Page
        </Link>
      </div>
    </div>
  );
}

export default Home; 