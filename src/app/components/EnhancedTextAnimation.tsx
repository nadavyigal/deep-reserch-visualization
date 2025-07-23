'use client'

import React, { useEffect, useRef, useState } from 'react';
import nlp from 'compromise';

export interface TextAnimationTheme {
  colors?: string[];
  fontSize?: number;
  durations?: {
    centralNode?: number;
    lines?: number;
    keywords?: number;
  };
}

interface EnhancedTextAnimationProps {
  text: string;
  section?: string;
  className?: string;
  maxKeywords?: number;
  theme?: TextAnimationTheme;
  layout?: 'circle' | 'grid' | 'spiral';
}

const EnhancedTextAnimation: React.FC<EnhancedTextAnimationProps> = ({
  text,
  section,
  className = '',
  maxKeywords = 8,
  theme,
  layout = 'circle',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const animationRef = useRef<any>(null);

  const defaultTheme: Required<TextAnimationTheme> = {
    colors: [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#ec4899',
    ],
    fontSize: 16,
    durations: {
      centralNode: 800,
      lines: 600,
      keywords: 800,
    },
  };

  const mergedTheme = { ...defaultTheme, ...theme };

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
  const extractKeywords = (content: string, max = 8): string[] => {
    if (!content) return [];

    try {
      const doc: any = nlp(content);
      const freqs = doc.nouns().out('freq');
      return freqs
        .filter((f: any) => !stopWords.has(f.normal.toLowerCase()))
        .slice(0, max)
        .map((f: any) => f.normal);
    } catch (err) {
      console.error('Keyword extraction error', err);
      return [];
    }
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
        const keywords = extractKeywords(text, maxKeywords);
        if (keywords.length === 0) return;
        
        // Create container for animation
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.style.width = '100%';
        container.style.height = '100%';
        
        // Create elements for each keyword
        const elements: HTMLElement[] = [];
        const colors = mergedTheme.colors;
        
        keywords.forEach((keyword, index) => {
          const el = document.createElement('div');
          el.textContent = keyword;
          el.style.position = 'absolute';
          el.style.padding = '8px 16px';
          el.style.borderRadius = '16px';
          el.style.backgroundColor = colors[index % colors.length];
          el.style.color = 'white';
          el.style.fontWeight = 'bold';
          el.style.fontSize = `${mergedTheme.fontSize}px`;
          el.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          el.style.transform = 'scale(0)';
          el.style.opacity = '0';
          
          container.appendChild(el);
          elements.push(el);
        });
        
        // Position elements based on layout
        const centerX = container.offsetWidth / 2;
        const centerY = container.offsetHeight / 2;
        const radius = Math.min(centerX, centerY) * 0.7;

        const positionElements = () => {
          if (layout === 'grid') {
            const cols = Math.ceil(Math.sqrt(elements.length));
            const rows = Math.ceil(elements.length / cols);
            const spacingX = container.offsetWidth / (cols + 1);
            const spacingY = container.offsetHeight / (rows + 1);
            elements.forEach((el, i) => {
              const row = Math.floor(i / cols);
              const col = i % cols;
              const x = spacingX * (col + 1) - el.offsetWidth / 2;
              const y = spacingY * (row + 1) - el.offsetHeight / 2;
              el.style.left = `${x}px`;
              el.style.top = `${y}px`;
            });
          } else if (layout === 'spiral') {
            const spacing = 20;
            elements.forEach((el, i) => {
              const angle = i * 0.5;
              const r = spacing * angle;
              const x = centerX + r * Math.cos(angle) - el.offsetWidth / 2;
              const y = centerY + r * Math.sin(angle) - el.offsetHeight / 2;
              el.style.left = `${x}px`;
              el.style.top = `${y}px`;
            });
          } else {
            elements.forEach((el, i) => {
              const angle = (i / elements.length) * Math.PI * 2;
              const x = centerX + radius * Math.cos(angle) - el.offsetWidth / 2;
              const y = centerY + radius * Math.sin(angle) - el.offsetHeight / 2;
              el.style.left = `${x}px`;
              el.style.top = `${y}px`;
            });
          }
        };

        positionElements();
        
        // Create central node with section title
        const centralNode = document.createElement('div');
        centralNode.textContent = section || 'Key Concepts';
        centralNode.style.position = 'absolute';
        centralNode.style.left = '50%';
        centralNode.style.top = '50%';
        centralNode.style.transform = 'translate(-50%, -50%) scale(0)';
        centralNode.style.padding = '12px 20px';
        centralNode.style.borderRadius = '20px';
        centralNode.style.backgroundColor = mergedTheme.colors[0];
        centralNode.style.color = 'white';
        centralNode.style.fontWeight = 'bold';
        centralNode.style.fontSize = `${mergedTheme.fontSize + 2}px`;
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
          duration: mergedTheme.durations.centralNode,
        });
        
        // Animate central node
        timeline.add({
          targets: centralNode,
          scale: [0, 1],
          opacity: [0, 1],
          duration: mergedTheme.durations.centralNode,
        });
        
        // Animate lines
        timeline.add({
          targets: lines,
          opacity: [0, 0.7],
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeOutQuad',
          duration: mergedTheme.durations.lines,
          delay: anime.stagger(100),
        }, '-=400');
        
        // Animate keyword elements
        timeline.add({
          targets: elements,
          scale: [0, 1],
          opacity: [0, 1],
          duration: mergedTheme.durations.keywords,
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
  }, [text, section, isClient, layout, maxKeywords, theme]);

  return (
    <div 
      ref={containerRef} 
      className={`enhanced-text-animation w-full h-full ${className}`}
    ></div>
  );
};

export default EnhancedTextAnimation;