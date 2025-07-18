'use client'

import { useState, useEffect, useRef, useMemo, memo, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useAuth } from '../../lib/hooks/useAuth';
import LoginButton from './LoginButton';
import { sampleAnimations } from './SampleAnimations';
import FlowchartGenerator from './FlowchartGenerator';
import ChartGenerator from './ChartGenerator';

// Dynamically load heavy components
const ReactMarkdownDynamic = dynamic(() => import('react-markdown'), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-md"></div>,
  ssr: false
});


// Lazy load heavy interactive components
const AnimationSection = lazy(() => import('./AnimationSection'));
const FlowchartGeneratorDynamic = lazy(() => import('./FlowchartGenerator'));
const ChartGeneratorDynamic = lazy(() => import('./ChartGenerator'));

// Loading component for Suspense
const LoadingComponent = () => (
  <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg">
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

interface AnimationData {
  id: string;
  code: string;
}

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>('');
  const [animations, setAnimations] = useState<Record<string, AnimationData>>({});
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [showChartSuggestions, setShowChartSuggestions] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user, loading } = useAuth();
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Load saved data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Defer non-critical operations with requestIdleCallback
      const loadData = () => {
      const savedMarkdown = localStorage.getItem('markdown');
      const savedAnimations = localStorage.getItem('animations');
      
      if (savedMarkdown) {
        setMarkdown(savedMarkdown);
      }
      
      if (savedAnimations) {
        try {
          setAnimations(JSON.parse(savedAnimations));
        } catch (e) {
          console.error('Failed to parse saved animations', e);
        }
        }
        
        setIsLoadingData(false);
      };
      
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadData);
      } else {
        setTimeout(loadData, 200);
      }
    }
  }, []);

  // Save data to localStorage when it changes - debounced
  useEffect(() => {
    if (typeof window !== 'undefined' && markdown) {
      const timeoutId = setTimeout(() => {
      localStorage.setItem('markdown', markdown);
      }, 1000); // 1-second debounce

      return () => clearTimeout(timeoutId);
    }
  }, [markdown]);

  // Save animations with debounce
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(animations).length > 0) {
      const timeoutId = setTimeout(() => {
      localStorage.setItem('animations', JSON.stringify(animations));
      }, 1000); // 1-second debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [animations]);

  // Memoize handlers to prevent unnecessary rerenders
  const handleMarkdownChange = useMemo(() => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
    setCursorPosition(e.target.selectionStart);
  }, []);

  const handleAnimationUpdate = useMemo(() => (id: string, code: string) => {
    setAnimations(prev => ({
      ...prev,
      [id]: { id, code }
    }));
  }, []);

  const handleImport = useMemo(() => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setMarkdown(content);
      }
    };
    reader.readAsText(file);
  }, []);

  // Memoize the section extraction logic
  const sections = useMemo(() => {
    if (!markdown) return [];
    
    // Extract sections with regex pattern matching
    const regex = /^(#{1,6})\s+(.+)$/gm;
    const matches = Array.from(markdown.matchAll(regex));
    
    return matches.map((match, index) => {
      const level = match[1].length;
      const title = match[2];
      const sectionId = `section-${title.toLowerCase().replace(/[^\w]+/g, '-')}`;
      
      // Get the content until the next header or end of string
      const startPos = match.index! + match[0].length;
      const nextMatch = matches[index + 1];
      const endPos = nextMatch ? nextMatch.index! : markdown.length;
      const content = markdown.substring(startPos, endPos);
      
      return { level, title, id: sectionId, content };
    });
  }, [markdown]);

  const loadSampleMarkdown = async () => {
    try {
      const response = await fetch('/sample.md');
      const text = await response.text();
      setMarkdown(text);
      
      // Add sample animations
      const newAnimations = { ...animations };
      
      // Add sample animations if they don't already exist
      Object.keys(sampleAnimations).forEach(key => {
        if (!newAnimations[key]) {
          newAnimations[key] = {
            id: key,
            code: sampleAnimations[key]
          };
        }
      });
      
      setAnimations(newAnimations);
      setIsEditing(false); // Switch to preview mode
    } catch (error) {
      console.error('Failed to load sample markdown', error);
    }
  };

  // Export functionality 
  const handleExport = async () => {
    // Create HTML document with embedded animations
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Markdown Animation Export</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js" defer></script>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .animation-container { aspect-ratio: 16/9; background: #f5f5f5; margin: 20px 0; border-radius: 8px; overflow: hidden; position: relative; }
        </style>
      </head>
      <body>
        <div id="content">
          ${document.getElementById('preview')?.innerHTML || ''}
        </div>
        <script>
          // Animation scripts
          window.addEventListener('DOMContentLoaded', () => {
          ${Object.values(animations).map(anim => `
            // Animation for ${anim.id}
            (function() {
              ${anim.code}
            })();
          `).join('\n')}
          });
        </script>
      </body>
      </html>
    `;

    try {
    // Create download link
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-animation-export.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const insertChartTemplate = (chartType: string) => {
    if (!textareaRef.current || cursorPosition === null) return;
    
    let template = '';
    
    switch (chartType) {
      case 'table':
        template = `
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |
| Row 3    | Data     | Data     |
`;
        break;
      case 'bar':
        template = `
\`\`\`chart
type: bar
labels: [January, February, March, April, May]
datasets:
  - label: Sales
    data: [50, 60, 70, 180, 190]
  - label: Revenue
    data: [100, 200, 300, 400, 500]
\`\`\`
`;
        break;
      case 'line':
        template = `
\`\`\`chart
type: line
labels: [2019, 2020, 2021, 2022, 2023]
datasets:
  - label: Users
    data: [1000, 1500, 2000, 3500, 4000]
  - label: Active Users
    data: [800, 1000, 1800, 3000, 3800]
\`\`\`
`;
        break;
      case 'pie':
        template = `
\`\`\`chart
type: pie
labels: [Product A, Product B, Product C, Product D]
datasets:
  - label: Sales Distribution
    data: [25, 35, 20, 20]
\`\`\`
`;
        break;
      case 'doughnut':
        template = `
\`\`\`chart
type: doughnut
labels: [Desktop, Mobile, Tablet, Other]
datasets:
  - label: Traffic Sources
    data: [45, 35, 15, 5]
\`\`\`
`;
        break;
      case 'flowchart':
        template = `
\`\`\`flowchart
type: process
title: Business Process Flow
description: A flowchart showing the key steps in the business process
\`\`\`
`;
        break;
    }
    
    const currentValue = textareaRef.current.value;
    const newValue = currentValue.substring(0, cursorPosition) + template + currentValue.substring(cursorPosition);
    
    setMarkdown(newValue);
    
    // Schedule focus and selection update after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = cursorPosition + template.length;
        textareaRef.current.selectionEnd = cursorPosition + template.length;
      }
    }, 0);
    
    setShowChartSuggestions(false);
  };

  // Use memoized react-markdown components for better performance
  const MarkdownPreview = useMemo(() => {
      return (
      <Suspense fallback={<LoadingComponent />}>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdownDynamic>
            {markdown}
          </ReactMarkdownDynamic>
        </div>
      </Suspense>
    );
  }, [markdown]);

  if (loading || isLoadingData) {
      return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="mb-6">You need to be logged in to use the markdown editor.</p>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Control buttons */}
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isEditing && (
          <div className="md:col-span-1">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={handleMarkdownChange}
                className="w-full h-[calc(100vh-12rem)] p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 font-mono"
                placeholder="# Start writing your markdown here..."
              ></textarea>
              
              {/* Chart template suggestions dropdown */}
            </div>
          </div>
        )}

        <div className={`${isEditing ? 'md:col-span-1' : 'md:col-span-2'}`}>
          <div id="preview" className="p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg shadow-sm min-h-[calc(100vh-12rem)]">
            {MarkdownPreview}
      </div>
        </div>
      </div>
    </div>
  );
}

// Export memoized component to prevent unnecessary renders
export default memo(MarkdownEditor); 