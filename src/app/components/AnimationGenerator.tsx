"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import EnhancedTextAnimation from './EnhancedTextAnimation';

interface AnimationGeneratorProps {
  text: string;
  section?: string;
}

const AnimationGenerator: React.FC<AnimationGeneratorProps> = ({ text, section }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState<number>(0); // Used to force re-render
  const [animationType, setAnimationType] = useState<string>('auto');

  // Determine the most appropriate animation type based on content
  useEffect(() => {
    if (!text) return;

    // Simple content analysis to determine the best animation type
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('data') && (lowerText.includes('chart') || lowerText.includes('graph') || lowerText.includes('statistics'))) {
      setAnimationType('data');
    } else if (lowerText.includes('process') || lowerText.includes('workflow') || lowerText.includes('steps')) {
      setAnimationType('process');
    } else if (lowerText.includes('network') || lowerText.includes('connection') || lowerText.includes('relationship')) {
      setAnimationType('network');
    } else if (lowerText.includes('timeline') || lowerText.includes('history') || lowerText.includes('evolution')) {
      setAnimationType('timeline');
    } else {
      // Default to concept map for other types of content
      setAnimationType('concept');
    }
  }, [text]);

  // Set loading to false after a short delay to simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [key]);

  const handleRegenerateClick = () => {
    setLoading(true);
    setError(null);
    setKey(prev => prev + 1); // Force re-render
  };

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Interactive Animation</CardTitle>
        <CardDescription>
          {loading ? 'Generating animation based on content...' : `${animationType.charAt(0).toUpperCase() + animationType.slice(1)} visualization of the content`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="animation-container h-[300px] w-full relative bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          {loading && (
            <div className="flex items-center justify-center absolute inset-0 z-10 bg-gray-50/80 dark:bg-gray-900/80">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          )}
          
          {error && (
            <div className="p-4 text-red-500">
              <p>Error: {error}</p>
            </div>
          )}
          
          <EnhancedTextAnimation 
            key={key}
            text={text} 
            section={section}
            animationType={animationType}
            className="w-full h-full"
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <button 
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
          onClick={handleRegenerateClick}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Regenerate Animation'}
        </button>
      </CardFooter>
    </Card>
  );
};

export default AnimationGenerator; 