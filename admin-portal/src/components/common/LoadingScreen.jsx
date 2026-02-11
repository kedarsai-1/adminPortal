import { Leaf } from 'lucide-react';
import React from 'react';


export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Leaf className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Reco Admin Portal</h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}