/**
 * Utility to load and initialize the Mermaid library
 */

declare global {
  interface Window {
    mermaid: any;
  }
}

/**
 * Loads the Mermaid library if it's not already loaded and initializes it
 * @returns A promise that resolves when Mermaid is loaded and initialized
 */
export const loadMermaid = async (): Promise<void> => {
  // If we're not in a browser environment, return
  if (typeof window === 'undefined') {
    return;
  }

  // If Mermaid is already loaded, just initialize it
  if (window.mermaid) {
    window.mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      fontSize: 16
    });
    return;
  }

  // Otherwise, load Mermaid
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.async = true;
    
    script.onload = () => {
      window.mermaid.initialize({ 
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        fontSize: 16
      });
      resolve();
    };
    
    script.onerror = (error) => {
      reject(new Error('Failed to load Mermaid library'));
    };
    
    document.head.appendChild(script);
  });
};

/**
 * Renders a Mermaid diagram in the specified container
 * @param container The HTML element to render the diagram in
 * @param code The Mermaid code to render
 */
export const renderMermaidDiagram = async (container: HTMLElement, code: string): Promise<void> => {
  try {
    await loadMermaid();
    
    // Clear the container
    container.innerHTML = '';
    
    // Create a div for the Mermaid diagram
    const mermaidDiv = document.createElement('div');
    mermaidDiv.className = 'mermaid';
    mermaidDiv.style.width = '100%';
    mermaidDiv.style.minHeight = '300px';
    mermaidDiv.style.display = 'flex';
    mermaidDiv.style.justifyContent = 'center';
    mermaidDiv.style.alignItems = 'center';
    mermaidDiv.textContent = code;
    container.appendChild(mermaidDiv);
    
    // Render the diagram
    window.mermaid.run({
      nodes: [mermaidDiv]
    });
  } catch (error) {
    console.error('Error rendering Mermaid diagram:', error);
    throw error;
  }
}; 