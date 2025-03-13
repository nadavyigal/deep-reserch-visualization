'use client'

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface SimpleFlowchartGeneratorProps {
  markdownContent: string;
  id: string;
}

const SimpleFlowchartGenerator: React.FC<SimpleFlowchartGeneratorProps> = ({ 
  markdownContent, 
  id 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
      },
    });

    const renderDiagram = async () => {
      if (containerRef.current) {
        try {
          // Clear previous content
          containerRef.current.innerHTML = '';
          
          // Create a container for the diagram
          const diagramContainer = document.createElement('div');
          diagramContainer.className = 'mermaid';
          diagramContainer.textContent = markdownContent;
          containerRef.current.appendChild(diagramContainer);
          
          // Render the diagram
          await mermaid.run();
        } catch (error) {
          console.error('Error rendering flowchart:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<div class="text-red-500 p-4">Error rendering flowchart</div>`;
          }
        }
      }
    };

    renderDiagram();
  }, [markdownContent]);

  return (
    <div 
      ref={containerRef} 
      id={id} 
      className="w-full h-full flex items-center justify-center overflow-auto"
    >
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
};

export default SimpleFlowchartGenerator;