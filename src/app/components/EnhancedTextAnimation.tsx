'use client'

import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

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
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  // Extract key concepts from text
  const extractKeywords = (inputText: string, maxWords = 6): string[] => {
    if (!inputText) return [];
    
    // Remove common stop words
    const stopWords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
      'be', 'been', 'being', 'to', 'of', 'for', 'with', 'by', 'about', 
      'against', 'between', 'into', 'through', 'during', 'before', 'after',
      'above', 'below', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
      'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
      'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
      'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
      'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should',
      'now', 'this', 'that', 'these', 'those'
    ]);
    
    // Split text into words, filter out stop words and short words
    const words = inputText
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word.toLowerCase()))
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)); // Capitalize first letter
    
    // Count word frequency
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
    
    // Sort by frequency and get top words
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxWords)
      .map(entry => entry[0]);
  };

  useEffect(() => {
    // Clean up previous animation
    if (animationRef.current) {
      animationRef.current.pause();
    }
    
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      
      const contentToUse = section && section !== 'Full Document' ? section : text;
      const keywords = extractKeywords(contentToUse);
      
      // If no keywords found, use default words
      const displayWords = keywords.length > 0 
        ? keywords 
        : ['Visualization', 'Animation', 'Interactive', 'Dynamic', 'Content'];
      
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.style.overflow = 'hidden';
      wrapper.style.padding = '20px';
      containerRef.current.appendChild(wrapper);
      
      // Create title
      const title = document.createElement('h2');
      title.textContent = 'Key Concepts';
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';
      title.style.color = '#3498db';
      title.style.opacity = '0';
      title.style.marginBottom = '30px';
      title.style.textAlign = 'center';
      wrapper.appendChild(title);
      
      // Create concept container
      const conceptContainer = document.createElement('div');
      conceptContainer.style.display = 'flex';
      conceptContainer.style.flexWrap = 'wrap';
      conceptContainer.style.justifyContent = 'center';
      conceptContainer.style.alignItems = 'center';
      conceptContainer.style.width = '100%';
      conceptContainer.style.maxWidth = '600px';
      wrapper.appendChild(conceptContainer);
      
      // Create concept elements
      const conceptElements = [];
      const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
      
      displayWords.forEach((word, i) => {
        // Create concept card
        const card = document.createElement('div');
        card.style.backgroundColor = colors[i % colors.length];
        card.style.color = '#fff';
        card.style.padding = '12px 20px';
        card.style.margin = '10px';
        card.style.borderRadius = '8px';
        card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'center';
        card.style.minWidth = '120px';
        card.style.textAlign = 'center';
        
        // Create icon based on word index
        const icon = document.createElement('div');
        icon.style.marginRight = '10px';
        icon.style.fontSize = '20px';
        
        // Simple icon mapping
        const icons = ['📊', '🔍', '📈', '🔄', '📱', '🌟'];
        icon.textContent = icons[i % icons.length];
        
        card.appendChild(icon);
        
        // Create text element
        const textEl = document.createElement('span');
        textEl.textContent = word;
        textEl.style.fontSize = '16px';
        textEl.style.fontWeight = '500';
        
        card.appendChild(textEl);
        conceptContainer.appendChild(card);
        conceptElements.push(card);
      });
      
      // Create visual elements
      const visualContainer = document.createElement('div');
      visualContainer.style.position = 'absolute';
      visualContainer.style.top = '0';
      visualContainer.style.left = '0';
      visualContainer.style.width = '100%';
      visualContainer.style.height = '100%';
      visualContainer.style.pointerEvents = 'none';
      visualContainer.style.zIndex = '-1';
      wrapper.appendChild(visualContainer);
      
      // Create decorative elements
      const decorElements = [];
      for (let i = 0; i < 15; i++) {
        const decor = document.createElement('div');
        decor.style.position = 'absolute';
        decor.style.borderRadius = '50%';
        decor.style.opacity = '0';
        
        // Randomize size
        const size = 5 + Math.random() * 15;
        decor.style.width = `${size}px`;
        decor.style.height = `${size}px`;
        
        // Randomize position
        decor.style.left = `${Math.random() * 100}%`;
        decor.style.top = `${Math.random() * 100}%`;
        
        // Use colors from the concepts
        decor.style.backgroundColor = colors[i % colors.length];
        
        visualContainer.appendChild(decor);
        decorElements.push(decor);
      }
      
      // Create animation
      const timeline = anime.timeline({
        loop: true,
        easing: 'easeOutExpo'
      });
      
      // Animate title
      timeline.add({
        targets: title,
        opacity: [0, 1],
        translateY: [-30, 0],
        duration: 1000,
        easing: 'easeOutElastic(1, .8)'
      })
      
      // Animate concept cards
      .add({
        targets: conceptElements,
        opacity: [0, 1],
        scale: [0.8, 1],
        delay: anime.stagger(150),
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
      })
      
      // Animate decorative elements
      .add({
        targets: decorElements,
        opacity: [0, 0.6],
        scale: [0, 1],
        delay: anime.stagger(50),
        duration: 600,
        easing: 'easeOutQuad'
      }, '-=400')
      
      // Animate concept cards hover effect
      .add({
        targets: conceptElements,
        scale: [1, 1.05],
        boxShadow: ['0 4px 6px rgba(0, 0, 0, 0.1)', '0 8px 15px rgba(0, 0, 0, 0.2)'],
        delay: anime.stagger(150),
        duration: 800,
        easing: 'easeInOutQuad'
      })
      
      // Pause for a moment
      .add({
        duration: 1000
      })
      
      // Animate concept cards out
      .add({
        targets: conceptElements,
        opacity: [1, 0],
        scale: [1.05, 0.8],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeInQuad'
      })
      
      // Animate decorative elements out
      .add({
        targets: decorElements,
        opacity: [0.6, 0],
        scale: [1, 0],
        delay: anime.stagger(50),
        duration: 400,
        easing: 'easeInQuad'
      }, '-=400')
      
      // Animate title out
      .add({
        targets: title,
        opacity: [1, 0],
        translateY: [0, 30],
        duration: 800,
        easing: 'easeInQuad'
      }, '-=200');
      
      animationRef.current = timeline;
    }
    
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [text, section]);

  return (
    <div 
      ref={containerRef} 
      className={`enhanced-text-animation h-[300px] w-full relative bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden ${className}`}
    />
  );
};

export default EnhancedTextAnimation;