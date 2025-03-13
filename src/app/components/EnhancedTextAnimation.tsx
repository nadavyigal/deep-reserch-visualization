import React, { useEffect, useRef, useState } from 'react';
import { advancedTextAnimation } from './AnimationTemplates';

interface EnhancedTextAnimationProps {
  text: string;
  section?: string;
  className?: string;
}

const EnhancedTextAnimation: React.FC<EnhancedTextAnimationProps> = ({ 
  text, 
  section, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Reset animation when text or section changes
    setKey(prev => prev + 1);
  }, [text, section]);

  useEffect(() => {
    let animationInstance: any = null;
    let observer: IntersectionObserver | null = null;
    
    const runAnimation = async () => {
      if (!containerRef.current) return;
      
      try {
        // Clean up any previous animation
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        
        // Create a text container to hold the text for keyword extraction
        const textContainer = document.createElement('div');
        textContainer.style.position = 'absolute';
        textContainer.style.visibility = 'hidden';
        textContainer.textContent = text;
        containerRef.current.appendChild(textContainer);
        
        // Dynamically import anime.js
        const animeModule = await import('animejs').catch(err => {
          console.error('Failed to load anime.js:', err);
          return { default: null };
        });
        
        const anime = animeModule.default;
        if (!anime || !containerRef.current) {
          console.error('Animation library or container not available');
          return;
        }
        
        // Use the advanced text animation template
        const animationCode = advancedTextAnimation;
        
        // Extract the createAnimation function from the code
        const createAnimationFn = new Function(
          'return ' + animationCode.replace('function createAnimation', 'function')
        )();
        
        // Run the animation
        animationInstance = createAnimationFn(anime, containerRef.current);
        
        // Remove the hidden text container after animation is created
        if (textContainer.parentNode) {
          textContainer.parentNode.removeChild(textContainer);
        }
      } catch (error) {
        console.error('Error executing animation:', error);
      }
    };
    
    // Set up intersection observer to only run animation when visible
    if (containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          setIsVisible(entry.isIntersecting);
          
          if (entry.isIntersecting) {
            runAnimation();
          } else if (animationInstance && animationInstance.pause) {
            animationInstance.pause();
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(containerRef.current);
    }
    
    return () => {
      // Clean up animation and observer
      if (animationInstance && animationInstance.pause) {
        animationInstance.pause();
      }
      
      if (observer) {
        observer.disconnect();
      }
      
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [key, text]);
  
  return (
    <div 
      className={`relative w-full h-64 md:h-80 bg-gray-50 rounded-lg shadow-sm overflow-hidden ${className}`}
      data-section={section}
      data-text={text}
    >
      <div 
        ref={containerRef} 
        className="w-full h-full"
        key={`animation-container-${key}`}
      />
      
      {!isVisible && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <span>Scroll to view animation</span>
        </div>
      )}
    </div>
  );
};

export default EnhancedTextAnimation;