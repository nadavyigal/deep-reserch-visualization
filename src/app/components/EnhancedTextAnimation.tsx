'use client'

import React, { useEffect, useRef, useState } from 'react';

interface EnhancedTextAnimationProps {
  text: string;
  section?: string;
  className?: string;
}

const EnhancedTextAnimation: React.FC<EnhancedTextAnimationProps> = ({
  text,
  section,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const animationRef = useRef<any>(null);

  // Set of common stop words to filter out
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'to', 'of', 'for', 'with', 'by', 'about', 
    'against', 'between', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
    'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
    'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just',
    'should', 'now', 'this', 'that', 'these', 'those'
  ]);

  // Extract keywords from text
  const extractKeywords = (text: string, maxKeywords = 8): string[] => {
    if (!text) return [];
    
    // Tokenize and clean text
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(word => 
        word.length > 3 && // Filter out short words
        !stopWords.has(word) // Filter out stop words
      );
    
    // Count word frequency
    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Sort by frequency and get top keywords
    return Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word]) => word);
  };

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
    if (!isClient || !containerRef.current) return;
    
    const createAnimation = async () => {
      try {
        // Dynamically import anime.js
        const animeModule = await import('animejs');
        const anime = animeModule.default;
        
        // Clean up previous animation
        if (animationRef.current) {
          animationRef.current.pause();
        }
        
        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = '';
        
        // Extract keywords from text
        const keywords = extractKeywords(text);
        if (keywords.length === 0) return;
        
        // Create container for animation
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.style.width = '100%';
        container.style.height = '100%';
        
        // Create elements for each keyword
        const elements: HTMLElement[] = [];
        const colors = [
          '#3b82f6', // blue-500
          '#10b981', // emerald-500
          '#f59e0b', // amber-500
          '#ef4444', // red-500
          '#8b5cf6', // violet-500
          '#ec4899', // pink-500
        ];
        
        keywords.forEach((keyword, index) => {
          const el = document.createElement('div');
          el.textContent = keyword;
          el.style.position = 'absolute';
          el.style.padding = '8px 16px';
          el.style.borderRadius = '16px';
          el.style.backgroundColor = colors[index % colors.length];
          el.style.color = 'white';
          el.style.fontWeight = 'bold';
          el.style.fontSize = '16px';
          el.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          el.style.transform = 'scale(0)';
          el.style.opacity = '0';
          
          container.appendChild(el);
          elements.push(el);
        });
        
        // Position elements in a circular pattern
        const centerX = container.offsetWidth / 2;
        const centerY = container.offsetHeight / 2;
        const radius = Math.min(centerX, centerY) * 0.7;
        
        elements.forEach((el, i) => {
          const angle = (i / elements.length) * Math.PI * 2;
          const x = centerX + radius * Math.cos(angle) - el.offsetWidth / 2;
          const y = centerY + radius * Math.sin(angle) - el.offsetHeight / 2;
          
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
        });
        
        // Create central node with section title
        const centralNode = document.createElement('div');
        centralNode.textContent = section || 'Key Concepts';
        centralNode.style.position = 'absolute';
        centralNode.style.left = '50%';
        centralNode.style.top = '50%';
        centralNode.style.transform = 'translate(-50%, -50%) scale(0)';
        centralNode.style.padding = '12px 20px';
        centralNode.style.borderRadius = '20px';
        centralNode.style.backgroundColor = '#1e293b'; // slate-800
        centralNode.style.color = 'white';
        centralNode.style.fontWeight = 'bold';
        centralNode.style.fontSize = '18px';
        centralNode.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        centralNode.style.zIndex = '10';
        centralNode.style.opacity = '0';
        
        container.appendChild(centralNode);
        
        // Create connection lines
        const lines: SVGElement[] = [];
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "5";
        
        container.appendChild(svg);
        
        elements.forEach((el) => {
          const line = document.createElementNS(svgNS, "line");
          line.setAttribute("x1", `${centerX}`);
          line.setAttribute("y1", `${centerY}`);
          line.setAttribute("x2", `${parseFloat(el.style.left) + el.offsetWidth / 2}`);
          line.setAttribute("y2", `${parseFloat(el.style.top) + el.offsetHeight / 2}`);
          line.setAttribute("stroke", "#cbd5e1"); // slate-300
          line.setAttribute("stroke-width", "2");
          line.setAttribute("stroke-dasharray", "5,5");
          line.setAttribute("opacity", "0");
          
          svg.appendChild(line);
          lines.push(line);
        });
        
        // Animate elements
        const timeline = anime.timeline({
          easing: 'easeOutElastic(1, .5)',
          duration: 800,
        });
        
        // Animate central node
        timeline.add({
          targets: centralNode,
          scale: [0, 1],
          opacity: [0, 1],
          duration: 800,
        });
        
        // Animate lines
        timeline.add({
          targets: lines,
          opacity: [0, 0.7],
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeOutQuad',
          duration: 600,
          delay: anime.stagger(100),
        }, '-=400');
        
        // Animate keyword elements
        timeline.add({
          targets: elements,
          scale: [0, 1],
          opacity: [0, 1],
          duration: 800,
          delay: anime.stagger(150),
        }, '-=600');
        
        // Add hover effects
        elements.forEach((el) => {
          el.addEventListener('mouseenter', () => {
            anime({
              targets: el,
              scale: 1.2,
              duration: 300,
              easing: 'easeOutElastic(1, .5)',
            });
          });
          
          el.addEventListener('mouseleave', () => {
            anime({
              targets: el,
              scale: 1,
              duration: 300,
              easing: 'easeOutElastic(1, .5)',
            });
          });
        });
        
        // Store animation reference for cleanup
        animationRef.current = timeline;
        
      } catch (error) {
        console.error('Error creating animation:', error);
      }
    };
    
    createAnimation();
  }, [text, section, isClient]);

  return (
    <div 
      ref={containerRef} 
      className={`enhanced-text-animation w-full h-full ${className}`}
    ></div>
  );
};

export default EnhancedTextAnimation;