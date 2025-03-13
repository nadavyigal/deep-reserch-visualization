'use client'

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface SimpleFlowchartGeneratorProps {
  data: string;
  title?: string;
  description?: string;
}

const SimpleFlowchartGenerator: React.FC<SimpleFlowchartGeneratorProps> = ({
  data,
  title = 'Flowchart',
  description = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uniqueId] = useState(`flowchart-${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    // Initialize mermaid with custom theme
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#3b82f6',
        lineColor: '#6b7280',
        secondaryColor: '#10b981',
        tertiaryColor: '#f0f9ff'
      }
    });

    const renderFlowchart = async () => {
      if (!containerRef.current || !data) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Clear previous flowchart
        const container = containerRef.current;
        container.innerHTML = `<div class="mermaid" id="${uniqueId}">${data}</div>`;
        
        // Render new flowchart
        await mermaid.run({
          nodes: [document.getElementById(uniqueId) as HTMLElement]
        });
        
        // Add animation classes to SVG elements
        const svg = container.querySelector('svg');
        if (svg) {
          svg.style.maxWidth = '100%';
          
          // Add fade-in animation to the entire SVG
          svg.classList.add('animate-fade-in');
          svg.style.opacity = '0';
          setTimeout(() => {
            svg.style.opacity = '1';
            svg.style.transition = 'opacity 0.5s ease-in-out';
          }, 100);
          
          // Add animations to nodes
          const nodes = svg.querySelectorAll('.node');
          nodes.forEach((node, index) => {
            (node as HTMLElement).style.opacity = '0';
            (node as HTMLElement).style.transform = 'translateY(20px)';
            (node as HTMLElement).style.transition = `opacity 0.5s ease-in-out ${index * 0.1}s, transform 0.5s ease-in-out ${index * 0.1}s`;
            
            setTimeout(() => {
              (node as HTMLElement).style.opacity = '1';
              (node as HTMLElement).style.transform = 'translateY(0)';
            }, 200 + index * 100);
          });
          
          // Add animations to edges
          const edges = svg.querySelectorAll('.edgePath');
          edges.forEach((edge, index) => {
            (edge as HTMLElement).style.opacity = '0';
            setTimeout(() => {
              (edge as HTMLElement).style.opacity = '1';
              (edge as HTMLElement).style.transition = `opacity 0.5s ease-in-out ${index * 0.05 + 0.3}s`;
            }, 500 + index * 50);
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error rendering flowchart:', err);
        setError('Failed to render flowchart. Please check your syntax.');
        setLoading(false);
      }
    };

    renderFlowchart();
  }, [data, uniqueId]);

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-md bg-red-50">
        <p className="font-medium">Error rendering flowchart:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full h-full overflow-auto"
        style={{ visibility: loading ? 'hidden' : 'visible' }}
      ></div>
    </div>
  );
};

export default SimpleFlowchartGenerator;