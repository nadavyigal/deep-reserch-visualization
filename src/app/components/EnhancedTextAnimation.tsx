'use client'

import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { getRandomTemplate } from './AnimationTemplates';

interface EnhancedTextAnimationProps {
  text: string;
  section?: string;
  animationType?: string;
  className?: string;
}

// Helper function to extract keywords from text
const extractKeywords = (text: string, maxKeywords: number = 8): string[] => {
  // Common words to exclude
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'to', 'of', 'for', 'with', 'by', 'about', 
    'against', 'between', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
    'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
    'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will',
    'just', 'don', 'should', 'now', 'this', 'that'
  ]);

  // Split text into words, convert to lowercase, and remove punctuation
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

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

// Helper function to select the appropriate animation template based on content type
const selectAnimationTemplate = (animationType: string, text: string): string => {
  // This function would ideally select from a wider range of specialized templates
  // For now, we'll use the existing templates and add logic to select the most appropriate one
  
  switch (animationType) {
    case 'data':
      return 'dataVisualizationAnimation';
    case 'process':
      return 'flowProcessAnimation';
    case 'network':
      return 'networkConnectionAnimation';
    case 'timeline':
      return 'timelineAnimation';
    case 'concept':
    default:
      return 'advancedTextAnimation';
  }
};

const EnhancedTextAnimation: React.FC<EnhancedTextAnimationProps> = ({ 
  text, 
  section,
  animationType = 'concept',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  // Extract keywords from text
  useEffect(() => {
    try {
      const extractedKeywords = extractKeywords(text);
      setKeywords(extractedKeywords);
    } catch (err) {
      console.error('Error extracting keywords:', err);
      setError('Failed to analyze text');
    }
  }, [text]);

  // Create and run the animation
  useEffect(() => {
    if (!containerRef.current || keywords.length === 0) return;

    // Clean up any previous animation
    if (animationRef.current) {
      animationRef.current.pause();
    }

    const container = containerRef.current;
    container.innerHTML = '';

    try {
      // Create wrapper for the animation
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.style.overflow = 'hidden';
      container.appendChild(wrapper);

      // Add a unique identifier to the container
      wrapper.setAttribute('data-animation-container', section || 'default');
      wrapper.setAttribute('data-animation-type', animationType);

      // Create animation based on type
      switch (animationType) {
        case 'data':
          animationRef.current = createDataVisualization(wrapper, keywords);
          break;
        case 'process':
          animationRef.current = createProcessFlow(wrapper, keywords);
          break;
        case 'network':
          animationRef.current = createNetworkAnimation(wrapper, keywords);
          break;
        case 'timeline':
          animationRef.current = createTimelineAnimation(wrapper, keywords);
          break;
        case 'concept':
        default:
          animationRef.current = createConceptMap(wrapper, keywords);
          break;
      }

      setIsVisible(true);
    } catch (err) {
      console.error('Error creating animation:', err);
      setError('Failed to create animation');
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [keywords, section, animationType]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      data-text={text}
      data-section={section}
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

// Animation creation functions
const createConceptMap = (wrapper: HTMLElement, keywords: string[]) => {
  const centralNode = document.createElement('div');
  centralNode.textContent = 'Key Concepts';
  centralNode.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 20px;
    border-radius: 20px;
    background-color: #1e293b;
    color: white;
    font-weight: bold;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10;
    opacity: 0;
  `;
  wrapper.appendChild(centralNode);

  const keywordNodes = keywords.map((keyword, index) => {
    const node = document.createElement('div');
    node.textContent = keyword;
    node.style.cssText = `
      position: absolute;
      padding: 8px 16px;
      border-radius: 16px;
      background-color: #f1f5f9;
      color: #334155;
      font-weight: 500;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      opacity: 0;
      z-index: 10;
    `;
    wrapper.appendChild(node);
    return node;
  });

  // Position nodes in a circle
  const radius = Math.min(wrapper.offsetWidth, wrapper.offsetHeight) * 0.35;
  keywordNodes.forEach((node, index) => {
    const angle = (index / keywords.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    node.style.left = `calc(50% + ${x}px)`;
    node.style.top = `calc(50% + ${y}px)`;
    node.style.transform = 'translate(-50%, -50%)';
  });

  // Create animation
  return anime.timeline({
    easing: 'easeOutElastic(1, .5)',
  })
    .add({
      targets: centralNode,
      scale: [0, 1],
      opacity: [0, 1],
      duration: 800
    })
    .add({
      targets: keywordNodes,
      opacity: [0, 1],
      scale: [0, 1],
      delay: anime.stagger(100),
      duration: 600
    }, '-=400')
    .add({
      targets: centralNode,
      scale: [1, 1.1, 1],
      duration: 1500,
      loop: true,
      easing: 'easeInOutQuad'
    });
};

const createDataVisualization = (wrapper: HTMLElement, keywords: string[]) => {
  // Implementation for data visualization animation
  // Similar structure to createConceptMap but with charts/graphs
  return anime.timeline();
};

const createProcessFlow = (wrapper: HTMLElement, keywords: string[]) => {
  // Implementation for process flow animation
  // Similar structure to createConceptMap but with sequential steps
  return anime.timeline();
};

const createNetworkAnimation = (wrapper: HTMLElement, keywords: string[]) => {
  // Implementation for network animation
  // Similar structure to createConceptMap but with connected nodes
  return anime.timeline();
};

const createTimelineAnimation = (wrapper: HTMLElement, keywords: string[]) => {
  // Implementation for timeline animation
  // Similar structure to createConceptMap but with chronological layout
  return anime.timeline();
};

export default EnhancedTextAnimation; 