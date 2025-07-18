'use client'

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import ReaflowChart from './ReaflowChart';

// Define the props interface
interface SimpleFlowchartGeneratorProps {
  data: string; // Mermaid markdown content
  title?: string;
  description?: string;
}

const SimpleFlowchartGenerator: React.FC<SimpleFlowchartGeneratorProps> = ({
  data,
  title,
  description
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartId] = useState(`flowchart-${Math.random().toString(36).substring(2, 11)}`);
  const [shouldUseReaflow, setShouldUseReaflow] = useState(false);

  useEffect(() => {
    if (!data) {
      setError('No flowchart data provided');
      setLoading(false);
      return;
    }

    // Check if the flowchart has arrow notation that Reaflow can handle better
    if (data.includes('-->') || data.includes('->')) {
      setShouldUseReaflow(true);
      setLoading(false);
      return;
    }

    try {
      // Initialize mermaid with safer configuration
      if (typeof window === 'undefined') return;
      
      // Reset any previous mermaid configuration
      if (window.mermaid) {
        try {
          // @ts-ignore
          window.mermaid.mermaidAPI.reset();
        } catch (e) {
          console.warn('Could not reset mermaid API:', e);
        }
      }
      
      mermaid.initialize({
        startOnLoad: true,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          useMaxWidth: true
        },
        logLevel: 3
      });

      const renderChart = async () => {
        if (!containerRef.current) return;
        
        try {
          // Clear previous content
          containerRef.current.innerHTML = '';
          
          // Format data to ensure it starts with a valid graph definition
          let formattedData = data.trim();
          if (!formattedData.startsWith('graph ') && !formattedData.startsWith('flowchart ')) {
            formattedData = `graph TD\n${formattedData}`;
          }
          
          // Create a div for the chart
          const chartDiv = document.createElement('div');
          chartDiv.id = chartId;
          chartDiv.className = 'mermaid';
          chartDiv.textContent = formattedData;
          containerRef.current.appendChild(chartDiv);
          
          // First try to parse to validate
          try {
            mermaid.parse(formattedData);
            
            // Then render the chart
            const { svg } = await mermaid.render(chartId, formattedData);
            
            // Replace the chart div with the rendered SVG
            if (containerRef.current) {
              containerRef.current.innerHTML = svg;
              
              // Apply styling to the SVG for better display
              const svgElement = containerRef.current.querySelector('svg');
              if (svgElement) {
                svgElement.setAttribute('width', '100%');
                svgElement.setAttribute('height', '100%');
                svgElement.style.maxWidth = '100%';
                svgElement.style.maxHeight = '100%';
                
                // Apply dark mode class to SVG if needed
                if (document.documentElement.classList.contains('dark')) {
                  svgElement.classList.add('dark-mode');
                }
                
                // Fix text color in dark mode
                if (document.documentElement.classList.contains('dark')) {
                  const textElements = svgElement.querySelectorAll('text');
                  textElements.forEach(text => {
                    text.setAttribute('fill', '#e2e8f0');
                  });
                }
              }
            }
            
            setLoading(false);
          } catch (parseError) {
            console.error('Error parsing mermaid code:', parseError);
            // If parsing fails, try using Reaflow
            setShouldUseReaflow(true);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error rendering flowchart:', err);
          setError('Failed to render flowchart');
          setLoading(false);
        }
      };

      renderChart();
    } catch (err) {
      console.error('Error initializing mermaid:', err);
      setError('Failed to initialize flowchart renderer');
      setLoading(false);
    }
  }, [data, chartId]);

  return (
    <div className="w-full h-full flex flex-col">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
      
      <div className="flex-grow overflow-auto">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 p-4 border border-red-200 dark:border-red-900 rounded bg-red-50 dark:bg-red-900/20">
            {error}
          </div>
        )}
        
        {shouldUseReaflow ? (
          <div className="w-full h-64">
            <ReaflowChart mermaidCode={data} height={250} />
          </div>
        ) : (
          <div 
            ref={containerRef} 
            className="w-full h-full flex justify-center items-center"
          ></div>
        )}
      </div>
    </div>
  );
};

export default SimpleFlowchartGenerator; 