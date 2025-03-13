"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import EnhancedTextAnimation from './EnhancedTextAnimation';

interface AnimationGeneratorProps {
  text: string;
  section?: string;
}

const AnimationGenerator: React.FC<AnimationGeneratorProps> = ({ text, section }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0); // Key to force re-render

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRegenerateClick = () => {
    // Force re-render of the animation by updating the key
    setKey(prevKey => prevKey + 1);
  };

  if (!isClient) {
    return (
      <Card className="overflow-hidden border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Interactive Animation</CardTitle>
          <CardDescription>
            Loading animation...
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="animation-container h-[300px] w-full relative bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Loading animation component...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Interactive Animation</CardTitle>
        <CardDescription>
          Visual representation of key concepts
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="animation-container w-full relative">
          {error ? (
            <div className="p-4 text-red-500 h-[300px] flex items-center justify-center">
              <div>
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <EnhancedTextAnimation 
              key={`animation-${key}`} 
              text={text} 
              section={section} 
            />
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <button 
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
          onClick={handleRegenerateClick}
          disabled={loading}
        >
          Regenerate Animation
        </button>
      </CardFooter>
    </Card>
  );
};

export default AnimationGenerator;