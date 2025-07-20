'use client'

import React, { useState, useEffect } from 'react';
import EnhancedTextAnimation from './EnhancedTextAnimation';
import { advancedTextAnimation } from './AnimationTemplates';

interface AnimationGeneratorProps {
  text: string;
  section?: string;
  className?: string;
}

const AnimationGenerator: React.FC<AnimationGeneratorProps> = ({ 
  text, 
  section,
  className = ''
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState<number>(0);
  const [animationText, setAnimationText] = useState<string>(text);

  // Extract key concepts from text for animation
  useEffect(() => {
    // Update animation text when text prop changes
    setAnimationText(text);
  }, [text]);

  // Function to regenerate animation
  const regenerateAnimation = () => {
    setLoading(true);
    setError(null);
    
    // Force re-render of animation component by updating key
    setKey(prevKey => prevKey + 1);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <div className={`animation-generator ${className}`}>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">
          Visualization
        </h3>
        <button
          onClick={regenerateAnimation}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? 'Regenerating...' : 'Regenerate Animation'}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        <EnhancedTextAnimation 
          key={`animation-${key}`}
          text={animationText}
          section={section}
          className="border border-gray-200"
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <p>Animation displays key concepts from your text. Click regenerate to create a new visualization.</p>
      </div>
    </div>
  );
};

export default AnimationGenerator;