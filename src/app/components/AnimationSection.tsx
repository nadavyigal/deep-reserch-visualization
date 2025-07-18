'use client'

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import anime from 'animejs';
import ChartGenerator from './ChartGenerator';
import { getDefaultAnimationForSection } from './DefaultAnimations';
import FlowchartGenerator from './FlowchartGenerator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleChartGenerator from './SimpleChartGenerator';
import Button from './Button';

interface AnimationSectionProps {
  id: string;
  code: string;
  onUpdate: (code: string) => void;
  isEditable?: boolean;
  sectionText?: string; // Add sectionText prop to pass the text content
}

export default function AnimationSection({ 
  id, 
  code, 
  onUpdate, 
  isEditable = true,
  sectionText = '' // Default to empty string
}: AnimationSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCode, setCurrentCode] = useState(code || '');
  const [key, setKey] = useState(0); // Add a key to force remount
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<'animation' | 'chart' | 'flowchart'>('animation');
  const [containerHeight, setContainerHeight] = useState<number>(400);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);
  const mountedRef = useRef(false);

  // Use default animation if no code is provided
  useEffect(() => {
    if (!code || code.trim() === '') {
      // Extract section title from the section text or use the ID
      const sectionTitle = sectionText.split('\n')[0] || id;
      const defaultAnimation = getDefaultAnimationForSection(sectionTitle);
      setCurrentCode(defaultAnimation);
      
      // Only update if editable to avoid changing parent state unnecessarily
      if (isEditable) {
        onUpdate(defaultAnimation);
      }
    } else {
      setCurrentCode(code);
    }
    
    setKey(prev => prev + 1); // Force remount of animation container
  }, [code, id, sectionText, isEditable, onUpdate]);

  // Run animation when component mounts
  useEffect(() => {
    mountedRef.current = true;
    
    // Skip if container doesn't exist
    if (!containerRef.current) return;
    
    // Skip if no code
    if (!currentCode || currentCode.trim() === '') return;
    
    let isMounted = true;
    let animationInstance: anime.AnimeInstance | null = null;
    
    // Create a safe container reference
    const container = containerRef.current;
    
    try {
      // Safely clear container first
      if (container) {
        container.innerHTML = '';
      }
      
      // Wrap the code in a try-catch block to prevent errors from breaking the app
      // Also add containment safeguards
      const wrappedCode = `
        try {
          // Add containment safeguards
          const originalAppendChild = Element.prototype.appendChild;
          Element.prototype.appendChild = function(child) {
            // Ensure all elements have box-sizing: border-box
            if (child instanceof HTMLElement) {
              child.style.boxSizing = 'border-box';
              
              // If position is absolute, ensure it stays within bounds
              if (getComputedStyle(child).position === 'absolute') {
                child.style.maxWidth = '100%';
                child.style.maxHeight = '100%';
              }
            }
            return originalAppendChild.call(this, child);
          };
          
          // Execute the animation code
          ${currentCode}
          
          // Restore original appendChild
          Element.prototype.appendChild = originalAppendChild;
          
          // If the code defines a createAnimation function, call it
          if (typeof createAnimation === 'function') {
            return createAnimation(anime, container);
          }
          
          // Otherwise, return null (no animation instance)
          return null;
        } catch (error) {
          console.error("Animation execution error:", error);
          const errorElement = document.createElement('div');
          errorElement.className = 'p-4 text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg';
          errorElement.textContent = "Animation error: " + error.message;
          container.appendChild(errorElement);
          return null;
        }
      `;
      
      // Create a function from the code string
      const animationFunction = new Function('anime', 'container', wrappedCode);
      
      // Execute the function with anime.js and the container
      if (container && isMounted) {
        animationInstance = animationFunction(anime, container) || null;
        animationRef.current = animationInstance;
      }
    } catch (error) {
      console.error(`Error in animation for ${id}:`, error);
      
      try {
        if (container && isMounted) {
          // Display error message in container
          container.innerHTML = '';
          const errorElement = document.createElement('div');
          errorElement.className = 'p-4 text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg';
          errorElement.textContent = `Animation error: ${(error as Error).message}`;
          container.appendChild(errorElement);
        }
      } catch (appendError) {
        console.error(`Error displaying animation error for ${id}:`, appendError);
      }
    }
    
    // Return cleanup function
    return () => {
      isMounted = false;
      
      if (animationInstance) {
        try {
          animationInstance.pause();
        } catch (error) {
          console.error(`Error pausing animation for ${id}:`, error);
        }
      }
      
      // Don't try to modify DOM during cleanup if component is unmounting
      if (mountedRef.current && container) {
        try {
          container.innerHTML = '';
        } catch (error) {
          console.error(`Error clearing container for ${id} during cleanup:`, error);
        }
      }
    };
  }, [currentCode, id, key]); // Add key to dependencies
  
  // Set mounted ref to false on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Update container height based on window size
  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      // Responsive height calculation
      if (width < 640) { // Small screens
        setContainerHeight(300);
      } else if (width < 1024) { // Medium screens
        setContainerHeight(400);
      } else { // Large screens
        setContainerHeight(500);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentCode(e.target.value);
  };

  const handleSave = () => {
    onUpdate(currentCode);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentCode(code);
    setIsEditing(false);
  };

  // Function to generate animation using OpenAI
  const generateAnimation = async () => {
    if (!sectionText) {
      setGenerationError("No text content available to generate animation");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    // Set a timeout for the fetch request
    const timeoutId = setTimeout(() => {
      if (isGenerating) {
        setGenerationError("Animation generation is taking longer than expected. Please wait or try again.");
      }
    }, 10000); // Show a message after 10 seconds

    try {
      const controller = new AbortController();
      const abortTimeoutId = setTimeout(() => controller.abort(), 30000); // Abort after 30 seconds
      
      const response = await fetch('/api/openai/generate-animation-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sectionText,
          sectionId: id
        }),
        signal: controller.signal
      });
      
      clearTimeout(abortTimeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate animation');
      }

      const data = await response.json();
      
      if (data.animationCode) {
        // Validate the animation code doesn't redeclare container
        if (data.animationCode.includes('const container') || data.animationCode.includes('let container') || data.animationCode.includes('var container')) {
          // Fix the code by replacing container declarations
          const fixedCode = data.animationCode
            .replace(/const\s+container\s*=/g, 'const animationWrapper =')
            .replace(/let\s+container\s*=/g, 'let animationWrapper =')
            .replace(/var\s+container\s*=/g, 'var animationWrapper =');
          
          setCurrentCode(fixedCode);
          onUpdate(fixedCode);
        } else {
          setCurrentCode(data.animationCode);
          onUpdate(data.animationCode);
        }
        
        setKey(prev => prev + 1); // Force remount to apply the new animation
      } else {
        throw new Error('No animation code was generated');
      }
    } catch (error) {
      console.error('Error generating animation:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        setGenerationError('Animation generation timed out. Please try again.');
      } else {
        setGenerationError(error instanceof Error ? error.message : 'Failed to generate animation');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsGenerating(false);
      setIsEditing(false); // Close the editor after generation
    }
  };

  return (
    <div className="animation-section w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={() => setVisualizationType('animation')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
              visualizationType === 'animation'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            } transition-colors`}
          >
            Animation
          </Button>
          <Button
            onClick={() => setVisualizationType('chart')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
              visualizationType === 'chart'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            } transition-colors`}
          >
            Chart
          </Button>
          <Button
            onClick={() => setVisualizationType('flowchart')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
              visualizationType === 'flowchart'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            } transition-colors`}
          >
            Flowchart
          </Button>
        </div>
        
        {visualizationType === 'animation' && (
          <div className="animation-container" style={{ height: containerHeight }}>
            {/* ... existing animation code ... */}
          </div>
        )}
        
        {visualizationType === 'chart' && (
          <div className="chart-container" style={{ height: containerHeight }}>
            <ChartGenerator text={sectionText} section={id} />
          </div>
        )}
        
        {visualizationType === 'flowchart' && (
          <div className="flowchart-container" style={{ height: containerHeight }}>
            <FlowchartGenerator 
              initialCode={`graph TD
  A[Start] --> B{Is it working?}
  B -->|Yes| C[Great!]
  B -->|No| D[Debug]
  D --> B`}
              height={containerHeight - 40}
            />
          </div>
        )}

        {isEditing && (
          <div className="flex space-x-2 mt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Save
            </Button>
            <Button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function AnimationIcon({ className = "w-6 h-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 8.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function LoadingSpinner({ className = "w-5 h-5" }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
} 