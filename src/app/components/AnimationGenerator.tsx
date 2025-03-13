"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getRandomTemplate } from './AnimationTemplates';

interface AnimationGeneratorProps {
  text: string;
  section?: string;
}

const AnimationGenerator: React.FC<AnimationGeneratorProps> = ({ text, section }) => {
  const [animationCode, setAnimationCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    return () => {
      // Clean up animation when component unmounts
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (isClient && animationCode && containerRef.current) {
      executeAnimation();
    }
  }, [animationCode, isClient]);

  const generateAnimation = async () => {
    if (!text || !isClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the correct API endpoint
      const response = await fetch('/api/openai/generate-animation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          section: section || 'Full Document' 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate animation');
      }
      
      const data = await response.json();
      
      // Check for the correct property name in the response
      if (data.animationCode) {
        setAnimationCode(data.animationCode);
      } else if (data.code) {
        setAnimationCode(data.code);
      } else {
        throw new Error('No animation code received');
      }
    } catch (err) {
      console.error('Error generating animation:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Use fallback animation
      setAnimationCode(getRandomTemplate());
    } finally {
      setLoading(false);
    }
  };

  const executeAnimation = () => {
    if (!containerRef.current || !animationCode) return;
    
    // Clear previous animation
    if (animationRef.current) {
      animationRef.current.pause();
    }
    
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    
    try {
      // Import anime.js dynamically
      import('animejs').then((animeModule) => {
        const anime = animeModule.default;
        
        // Prepare the container
        const container = containerRef.current;
        if (!container) return;
        
        // Process the animation code to ensure it's properly formatted
        let processedCode = animationCode;
        
        // Check if the code already has a function declaration
        if (!processedCode.includes('function createAnimation')) {
          // Wrap the code in a createAnimation function if it doesn't have one
          processedCode = `function createAnimation(anime, container) {
            ${processedCode}
          }`;
        }
        
        // Make sure the function returns the animation
        if (!processedCode.includes('return')) {
          processedCode = processedCode.replace(
            /function createAnimation\(anime, container\) {/,
            'function createAnimation(anime, container) {\n  let animation;'
          );
          
          // Add return statement before the last closing brace
          const lastBraceIndex = processedCode.lastIndexOf('}');
          processedCode = 
            processedCode.substring(0, lastBraceIndex) + 
            '\n  return animation;\n' + 
            processedCode.substring(lastBraceIndex);
        }
        
        // Create a function from the processed code
        const animationFunction = new Function('anime', 'container', `
          ${processedCode}
          return createAnimation(anime, container);
        `);
        
        // Execute the function with anime.js and the container
        try {
          animationRef.current = animationFunction(anime, container);
          
          // If animation didn't return anything, try to find it in the scope
          if (!animationRef.current && window.animation) {
            animationRef.current = window.animation;
            delete window.animation;
          }
        } catch (execError) {
          console.error('Error executing animation:', execError);
          // If execution fails, use fallback animation
          const fallbackFunction = new Function('anime', 'container', `
            ${getRandomTemplate()}
            return createAnimation(anime, container);
          `);
          animationRef.current = fallbackFunction(anime, container);
        }
      }).catch(err => {
        console.error('Error loading anime.js:', err);
        setError('Error loading animation library');
      });
    } catch (err) {
      console.error('Error setting up animation:', err);
      setError('Error setting up animation');
    }
  };

  const handleRegenerateClick = () => {
    generateAnimation();
  };

  // Generate animation on initial load
  useEffect(() => {
    if (isClient && text) {
      generateAnimation();
    }
  }, [isClient, text]);

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Interactive Animation</CardTitle>
        <CardDescription>
          {loading ? 'Generating animation...' : 'Visual representation of the content'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          ref={containerRef} 
          className="animation-container h-[300px] w-full relative bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
        >
          {!animationCode && !loading && !error && (
            <div className="text-center text-gray-500">
              <p>Click "Generate Animation" to create a visualization</p>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          )}
          {error && (
            <div className="p-4 text-red-500">
              <p>Error: {error}</p>
            </div>
          )}
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