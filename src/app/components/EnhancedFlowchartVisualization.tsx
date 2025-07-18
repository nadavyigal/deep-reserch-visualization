"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Mermaid from 'mermaid';

interface EnhancedFlowchartVisualizationProps {
  definition: string;
  title: string;
  description?: string;
  className?: string;
  darkMode?: boolean;
}

const EnhancedFlowchartVisualization: React.FC<EnhancedFlowchartVisualizationProps> = ({
  definition,
  title,
  description,
  className = '',
  darkMode,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const flowchartRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(`flowchart-${Math.random().toString(36).substring(2, 11)}`);
  const [height, setHeight] = useState<number>(400);
  
  const defaultConfig = {
    theme: (darkMode ? 'dark' : 'default') as 'dark' | 'default',
    themeVariables: darkMode ? {
      primaryColor: '#3b82f6',
      primaryTextColor: '#ffffff',
      primaryBorderColor: '#2563eb',
      lineColor: '#64748b',
      secondaryColor: '#10b981',
      tertiaryColor: '#1f2937',
      backgroundColor: '#111827',
      mainBkg: '#1f2937',
      secondaryBorderColor: '#0d9488',
      tertiaryBorderColor: '#374151',
      textColor: '#e5e7eb',
      edgeLabelBackground: '#374151',
    } : {
      primaryColor: '#3b82f6',
      primaryTextColor: '#ffffff',
      primaryBorderColor: '#2563eb',
      lineColor: '#64748b',
      secondaryColor: '#10b981',
      tertiaryColor: '#f3f4f6',
      backgroundColor: '#ffffff',
      mainBkg: '#f9fafb',
      secondaryBorderColor: '#0d9488',
      tertiaryBorderColor: '#e5e7eb',
      textColor: '#374151',
      edgeLabelBackground: '#f9fafb',
    },
    flowchart: {
      diagramPadding: 8,
      htmlLabels: true,
      curve: 'basis' as const,
    },
    sequence: {
      diagramMarginX: 50,
      diagramMarginY: 10,
      actorMargin: 50,
      width: 150,
      height: 65,
      boxMargin: 10,
      boxTextMargin: 5,
      noteMargin: 10,
      messageMargin: 35
    }
  };

  // Initialize Mermaid
  useEffect(() => {
    const initializeMermaid = async () => {
      try {
        Mermaid.initialize({
          startOnLoad: false,
          ...defaultConfig
        });
        setLoading(false);
      } catch (err) {
        console.error('Error initializing Mermaid:', err);
        setError('Failed to initialize diagram renderer');
        setLoading(false);
      }
    };

    initializeMermaid();
  }, [darkMode]);

  // Render the flowchart
  useEffect(() => {
    const renderFlowchart = async () => {
      if (!flowchartRef.current || !definition || loading) return;
      
      try {
        // Clear previous content
        flowchartRef.current.innerHTML = '';
        
        // Add a wrapper div with the unique ID
        const wrapperDiv = document.createElement('div');
        wrapperDiv.id = uniqueId.current;
        wrapperDiv.className = 'mermaid';
        wrapperDiv.textContent = definition;
        flowchartRef.current.appendChild(wrapperDiv);
        
        // Render the diagram
        await Mermaid.run({
          nodes: [wrapperDiv],
          suppressErrors: false
        });
        
        // Adjust height based on content
        if (flowchartRef.current.firstChild) {
          const svgElement = flowchartRef.current.querySelector('svg');
          if (svgElement) {
            // Get SVG height and add padding
            const svgHeight = svgElement.getBoundingClientRect().height;
            setHeight(Math.max(svgHeight + 40, 400)); // Minimum height of 400px
            
            // Add responsive attributes to SVG
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '100%');
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            
            // Apply animations to SVG elements
            const nodes = svgElement.querySelectorAll('.node');
            const edges = svgElement.querySelectorAll('.edge');
            
            // Animate nodes
            nodes.forEach((node, index) => {
              const htmlNode = node as HTMLElement;
              htmlNode.style.opacity = '0';
              htmlNode.style.transform = 'scale(0.8)';
              htmlNode.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
              
              setTimeout(() => {
                htmlNode.style.opacity = '1';
                htmlNode.style.transform = 'scale(1)';
              }, 100);
            });
            
            // Animate edges
            edges.forEach((edge, index) => {
              const path = edge.querySelector('path') as SVGPathElement;
              if (path) {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length.toString();
                path.style.strokeDashoffset = length.toString();
                path.style.transition = `stroke-dashoffset 1s ease ${index * 0.15 + 0.3}s`;
                
                setTimeout(() => {
                  path.style.strokeDashoffset = '0';
                }, 100);
              }
            });
          }
        }
      } catch (err) {
        console.error('Error rendering flowchart:', err);
        setError('Failed to render diagram');
      }
    };

    renderFlowchart();
  }, [definition, loading, darkMode]);

  return (
    <Card className={`overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 transition-all duration-200 hover:shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent 
        className="p-4 overflow-auto"
        style={{ height: loading ? '400px' : `${height}px` }}
      >
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        <div 
          ref={flowchartRef} 
          className="flowchart-container w-full h-full flex items-center justify-center"
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedFlowchartVisualization; 