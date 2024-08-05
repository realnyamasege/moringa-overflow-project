import React from 'react';

export default function NoPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-8">Page Not Found</p>
        <p className="text-gray-500">
          It seems like the page you're looking for doesn't exist. 
          <a href="/" className="text-blue-500 hover:underline"> Go back to homepage</a>.
        </p>
      </div>
    </div>
  );
}
