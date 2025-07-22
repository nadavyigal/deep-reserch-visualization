"use client"

import React, { useState, useEffect, useCallback, memo } from 'react';
import mermaid from 'mermaid';
import ReaflowChart from './ReaflowChart';
import './reaflow-styles.css';
import Button from './Button';
import logger from '@/lib/utils/logger';

// Import UI components with proper typing
import dynamic from 'next/dynamic';

// Simple UI components to avoid using shadcn/ui which might have server component issues
const Card = memo(({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`rounded-lg border bg-white dark:bg-gray-800 shadow-sm ${className || ''}`}>
    {children}
  </div>
));
Card.displayName = 'Card';

const CardHeader = memo(({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}>
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

const CardContent = memo(({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-6 pt-0 ${className || ''}`}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

const CardFooter = memo(({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`flex items-center p-6 pt-0 ${className || ''}`}>
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';

const CardTitle = memo(({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}>
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

interface FlowchartGeneratorProps {
  initialCode?: string;
  height?: number;
}

function FlowchartGenerator({ 
  initialCode = 'graph TD\n  A[Start] --> B{Decision?}\n  B -->|Yes| C[Process]\n  B -->|No| D[End]', 
  height = 400 
}: FlowchartGeneratorProps) {
  const [mermaidCode, setMermaidCode] = useState<string>(initialCode);
  const [copied, setCopied] = useState<boolean>(false);
  const [uniqueId] = useState<string>(`mermaid-${Math.random().toString(36).substring(2, 11)}`);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  
  // Initialize mermaid
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initMermaid = async () => {
      try {
        // Wait for mermaid to be fully loaded
        if (typeof mermaid === 'undefined') {
          logger.warn('Mermaid not loaded yet');
          return;
        }
        
        // Reset mermaid to ensure clean initialization
        try {
          if (mermaid.mermaidAPI) {
            mermaid.mermaidAPI.reset();
          }
        } catch (resetError) {
          logger.warn('Error resetting mermaid:', resetError);
        }
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Inter, sans-serif',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          },
          logLevel: 1 // Reduce log level to minimize console noise
        });
        
        logger.info('Mermaid initialized successfully');
      } catch (err) {
        logger.error('Mermaid initialization error:', err);
        setRenderError('Failed to initialize diagram renderer');
      }
    };
    
    // Add a small delay to ensure mermaid is loaded
    const timer = setTimeout(initMermaid, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Render mermaid diagram with error handling
  const renderMermaidDiagram = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Reset any previous errors
      setRenderError(null);
      
      // Get the container element
      const element = document.getElementById(uniqueId);
      if (!element) {
        logger.warn('Container element not found');
        return;
      }
      
      // Clear previous content
      element.innerHTML = '';
      
      // Check if mermaid is available
      if (typeof mermaid === 'undefined') {
        setRenderError('Diagram renderer not available');
        element.innerHTML = `<div class="p-4 text-red-500">Diagram renderer not available</div>`;
        return;
      }
      
      // Make sure the mermaid code starts with a valid diagram type
      let codeToRender = mermaidCode.trim();
      if (!codeToRender.startsWith('graph ') && !codeToRender.startsWith('flowchart ')) {
        codeToRender = 'flowchart TD\n' + codeToRender;
      }
      
      logger.info('Rendering mermaid with code:', codeToRender);
      
      // Render with try-catch for better error handling
      try {
        // Validate the diagram before rendering
        const isValid = await mermaid.parse(codeToRender);
        if (!isValid) {
          throw new Error('Invalid mermaid syntax');
        }
        
        // Render the diagram
        const result = await mermaid.render(`svg-${uniqueId}`, codeToRender);
        
        if (element && result && result.svg) {
          element.innerHTML = result.svg;
          
          // Adjust SVG to fit container
          const svg = element.querySelector('svg');
          if (svg) {
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.maxWidth = '100%';
            svg.style.maxHeight = `${Math.min(300, height)}px`;
            svg.style.display = 'block';
          }
        }
      } catch (parseError) {
        logger.error('Error parsing/rendering mermaid code:', parseError);
        setRenderError('Invalid flowchart syntax. Please check your code.');
        
        if (element) {
          element.innerHTML = `<div class="p-4 text-red-500 text-sm">Invalid flowchart syntax: ${(parseError as Error)?.message || 'Unknown error'}</div>`;
        }
      }
    } catch (error) {
      logger.error('Error rendering mermaid diagram:', error);
      setRenderError('Error rendering flowchart. Please try again.');
      
      const element = document.getElementById(uniqueId);
      if (element) {
        element.innerHTML = `<div class="p-4 text-red-500 text-sm">Error rendering flowchart: ${(error as Error)?.message || 'Unknown error'}</div>`;
      }
    }
  }, [mermaidCode, uniqueId, height]);
  
  // Render diagram on code change with a debounce
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const timer = setTimeout(() => {
      renderMermaidDiagram().catch(error => {
        logger.error('Failed to render diagram:', error);
        setRenderError('Failed to render diagram');
      });
    }, 500); // Increased timeout for better stability
    
    return () => clearTimeout(timer);
  }, [mermaidCode, renderMermaidDiagram]);
  
  // Handle copy button click
  const handleCopy = useCallback(() => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(mermaidCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [mermaidCode]);
  
  // Toggle editor visibility
  const handleEditToggle = useCallback(() => {
    setShowEditor(prev => !prev);
  }, []);
  
  // Handle mermaid code change
  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMermaidCode(e.target.value);
  }, []);
  
  // Handle refresh/reset
  const handleRefresh = useCallback(() => {
    setMermaidCode(initialCode);
    setRenderError(null);
  }, [initialCode]);
  
  // Use reaflow if available and valid, otherwise fall back to mermaid
  const hasValidFlowchart = mermaidCode && mermaidCode.includes('-->');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flowchart</CardTitle>
      </CardHeader>
      
      {renderError && (
        <div className="mx-6 mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
          <p className="font-medium">Error</p>
          <p>{renderError}</p>
        </div>
      )}
      
      <CardContent>
        {showEditor ? (
          <div className="mb-4">
            <textarea
              value={mermaidCode}
              onChange={handleCodeChange}
              className="w-full h-48 p-3 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 font-mono text-sm"
              placeholder="Enter mermaid flowchart code here..."
              spellCheck="false"
            />
          </div>
        ) : (
          <div className="flex justify-end mb-2">
            <Button 
              onClick={handleEditToggle}
              className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Flowchart
            </Button>
          </div>
        )}
        
        <div className="relative min-h-[300px] w-full rounded-md overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          {hasValidFlowchart && !renderError ? (
            <div className="flowchart-container">
              <ReaflowChart mermaidCode={mermaidCode} height={300} />
            </div>
          ) : (
            <div id={uniqueId} className="w-full min-h-[300px] flex items-center justify-center">
              {!mermaidCode.trim() && (
                <div className="text-gray-400 dark:text-gray-500 text-sm">
                  Enter flowchart code to see the diagram
                </div>
              )}
            </div>
          )}
        </div>
        
        {showEditor && (
          <div className="mt-4">
            <Button 
              onClick={handleEditToggle}
              className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/30"
            >
              Done Editing
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end pt-2 gap-2">
        <Button 
          onClick={handleRefresh}
          className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
          title="Reset to default"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M3 21v-5h5"></path>
          </svg>
          <span>Reset</span>
        </Button>
        
        <Button 
          onClick={handleCopy}
          className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
          title="Copy flowchart code"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
              <span>Copy</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Export the component
export default memo(FlowchartGenerator); 