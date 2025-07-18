"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface EnhancedAnimationVisualizationProps {
  title: string;
  description?: string;
  className?: string;
  animationCode?: string;
}

// Basic sample animation for fallback
const SAMPLE_ANIMATION = `
  // Create elements
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  container.style.backgroundColor = 'rgba(243, 244, 246, 0.1)';
  parentContainer.appendChild(container);
  
  // Create some animated elements
  const elements = [];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = colors[i % colors.length];
    const size = 10 + Math.random() * 40;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.opacity = '0';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = Math.random() * 100 + '%';
    
    container.appendChild(el);
    elements.push(el);
  }
  
  // Create the animation
  const animation = anime.timeline({
    easing: 'easeOutElastic',
    loop: true
  });
  
  animation.add({
    targets: elements,
    scale: [0, 1],
    opacity: [0, 0.7],
    delay: anime.stagger(100),
    duration: 1000
  }).add({
    targets: elements,
    translateX: function() { return anime.random(-100, 100) + 'px'; },
    translateY: function() { return anime.random(-100, 100) + 'px'; },
    duration: 3000,
    delay: anime.stagger(30),
    easing: 'easeOutElastic(1, .5)'
  }).add({
    targets: elements,
    scale: 0,
    opacity: 0,
    duration: 1000,
    delay: anime.stagger(30),
    easing: 'easeInElastic',
    complete: function(anim) {
      // Reset positions for next loop
      elements.forEach(el => {
        el.style.transform = 'none';
      });
    }
  });
  
  return animation;
`;

const EnhancedAnimationVisualization: React.FC<EnhancedAnimationVisualizationProps> = ({
  title,
  description,
  className = '',
  animationCode,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);
  const [animeLoaded, setAnimeLoaded] = useState(false);
  
  // Load anime.js library
  useEffect(() => {
    const loadAnimeJS = async () => {
      try {
        await import('animejs').then((anime) => {
          // Store the anime module for later use
          window.anime = anime.default;
          setAnimeLoaded(true);
        });
      } catch (err) {
        console.error('Error loading anime.js:', err);
        setError('Failed to load animation library');
        setLoading(false);
      }
    };
    
    loadAnimeJS();
    
    return () => {
      // Cleanup animation on unmount
      if (animationRef.current) {
        try {
          animationRef.current.pause();
        } catch (err) {
          console.error('Error pausing animation:', err);
        }
      }
    };
  }, []);
  
  // Execute animation once the library is loaded
  useEffect(() => {
    if (!animeLoaded || !containerRef.current) return;
    
    const runAnimation = () => {
      setLoading(true);
      
      try {
        // Clear previous animation and content
        if (animationRef.current) {
          try {
            animationRef.current.pause();
          } catch (err) {
            console.error('Error pausing previous animation:', err);
          }
        }
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        
        // Use provided animation code or fallback
        const codeToUse = animationCode || SAMPLE_ANIMATION;
        
        // Create a function to run the animation
        const animationFunction = new Function(
          'anime', 
          'parentContainer', 
          `
            try {
              ${codeToUse}
            } catch(err) {
              console.error('Animation code error:', err);
              throw err;
            }
          `
        );
        
        // Execute the animation function
        animationRef.current = animationFunction(window.anime, containerRef.current);
        setLoading(false);
        
      } catch (err) {
        console.error('Error executing animation:', err);
        setError('Failed to execute animation');
        setLoading(false);
        
        // Try to run fallback animation
        if (animationCode !== SAMPLE_ANIMATION) {
          try {
            const fallbackFunction = new Function(
              'anime',
              'parentContainer',
              `
                try {
                  ${SAMPLE_ANIMATION}
                } catch(err) {
                  console.error('Fallback animation error:', err);
                  throw err;
                }
              `
            );
            
            animationRef.current = fallbackFunction(window.anime, containerRef.current);
          } catch (fallbackErr) {
            console.error('Fallback animation error:', fallbackErr);
          }
        }
      }
    };
    
    runAnimation();
  }, [animeLoaded, animationCode]);
  
  const handleRegenerate = () => {
    if (!animeLoaded || !containerRef.current) return;
    
    // Pause current animation if any
    if (animationRef.current) {
      try {
        animationRef.current.pause();
        animationRef.current.restart();
      } catch (err) {
        console.error('Error restarting animation:', err);
      }
    }
  };
  
  return (
    <Card className={`overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 transition-all duration-200 hover:shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex justify-between items-center">
          <span>{title}</span>
          <button 
            onClick={handleRegenerate}
            disabled={loading || !animeLoaded}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Restart Animation"
            type="button"
          >
            <RefreshCw className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </CardTitle>
        {description && (
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          className="animation-container bg-gray-50 dark:bg-gray-800 relative"
          style={{ height: '350px' }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50/80 dark:bg-gray-800/80">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50/80 dark:bg-gray-800/80">
              <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg max-w-[90%]">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <div 
            ref={containerRef}
            className="w-full h-full"
          ></div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Interactive animation visualization
        </p>
      </CardFooter>
    </Card>
  );
};

// Add the missing window.anime type
declare global {
  interface Window {
    anime: any;
  }
}

export default EnhancedAnimationVisualization; 