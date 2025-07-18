'use client'

import React, { useMemo } from 'react';
import {
  Canvas,
  EdgeData,
  NodeData
} from 'reaflow';

// Pure function for parsing mermaid code (separate from the component)
function parseMermaidCode(mermaidCode: string): { 
  nodes: Array<{ id: string; text: string; type?: string }>;
  edges: Array<{ id: string; source: string; target: string; label?: string }>;
} {
  const nodes: Array<{ id: string; text: string; type?: string }> = [];
  const edges: Array<{ id: string; source: string; target: string; label?: string }> = [];
  
  try {
    // Ensure we have valid mermaid code
    if (!mermaidCode || mermaidCode.trim() === '') {
      return { nodes, edges };
    }

    // Remove the mermaid diagram type declaration if present (flowchart/graph)
    const codeWithoutDeclaration = mermaidCode
      .replace(/^(flowchart|graph)\s+[A-Za-z0-9]+\s*\n?/i, '')
      .trim();
    
    // Clean code - remove any unnecessary whitespace
    const cleanedCode = codeWithoutDeclaration.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    // Extract nodes with improved regex
    // This regex handles various node formats: A[Text], A(Text), A{Text}, A>Text<, A
    const nodeRegex = /\b([A-Za-z0-9_-]+)\s*(?:\[([^\]]+)\]|\(([^\)]+)\)|{([^}]+)}|>([^<]+)<|([^\s\[\]\(\)\{\}<>-][^\s\[\]\(\)\{\}<>,-]*))?\b/g;
    let nodeMatch;
    
    while ((nodeMatch = nodeRegex.exec(cleanedCode)) !== null) {
      const id = nodeMatch[1];
      // Get text from any of the capturing groups
      const text = nodeMatch[2] || nodeMatch[3] || nodeMatch[4] || nodeMatch[5] || nodeMatch[6] || id;
      let type = 'default';
      
      // Determine node type based on syntax
      if (nodeMatch[3]) type = 'circle';
      else if (nodeMatch[4]) type = 'diamond';
      else if (nodeMatch[5]) type = 'square';
      
      // Only add the node if it doesn't already exist
      if (id && !nodes.some(n => n.id === id)) {
        nodes.push({ id, text, type });
      }
    }
    
    // Extract edges with improved regex that captures various edge types
    // This handles: A-->B, A -- Text --> B, A ---|Text| B, A ==> B
    const edgeRegex = /\b([A-Za-z0-9_-]+)\s*(?:-+-(?:\|([^|]+)\|)?|=+=(?:\|([^|]+)\|)?|\s+--\s+(?:"([^"]+)")?\s+-->|\s+-->\s*)\s*([A-Za-z0-9_-]+)\b/g;
    let edgeMatch;
    
    while ((edgeMatch = edgeRegex.exec(cleanedCode)) !== null) {
      const source = edgeMatch[1];
      const target = edgeMatch[5];
      // Get label from any of the capturing groups
      const label = edgeMatch[2] || edgeMatch[3] || edgeMatch[4] || '';
      
      if (source && target) {
        edges.push({
          id: `${source}-${target}`,
          source,
          target,
          label: label.trim()
        });
      }
    }
    
    // If no nodes were found with the regex but there are edges, 
    // extract node IDs from the edges
    if (nodes.length === 0 && edges.length > 0) {
      const nodeIds = new Set<string>();
      
      // Add source and target from each edge
      edges.forEach(edge => {
        nodeIds.add(edge.source);
        nodeIds.add(edge.target);
      });
      
      // Create basic nodes
      nodeIds.forEach(id => {
        nodes.push({ id, text: id, type: 'default' });
      });
    }
    
    // Handle the case where we have edges but no corresponding nodes
    edges.forEach(edge => {
      // Check if source node exists
      if (!nodes.some(n => n.id === edge.source)) {
        nodes.push({ id: edge.source, text: edge.source, type: 'default' });
      }
      
      // Check if target node exists
      if (!nodes.some(n => n.id === edge.target)) {
        nodes.push({ id: edge.target, text: edge.target, type: 'default' });
      }
    });
  } catch (error) {
    console.error('Error parsing Mermaid code:', error);
  }
  
  return { nodes, edges };
}

interface ReaflowComponentsProps {
  mermaidCode: string;
  height?: number;
  className?: string;
}

// Node style map - Outside component to avoid recreation
const NODE_STYLES = {
  default: {
    stroke: '#1a192b',
    fill: '#f8fafc',
    strokeWidth: 1,
    rx: 4,
    ry: 4,
  },
  circle: {
    stroke: '#1a192b',
    fill: '#f1f5f9',
    strokeWidth: 1,
    rx: 50,
    ry: 50,
  },
  diamond: {
    stroke: '#1a192b',
    fill: '#f0fdfa',
    strokeWidth: 1,
    rx: 4,
    ry: 4,
  },
  square: {
    stroke: '#1a192b',
    fill: '#f3f4f6',
    strokeWidth: 1,
    rx: 0,
    ry: 0,
  },
};

// Node sizes - Outside component to avoid recreation
const NODE_DEFAULT_SIZE = {
  default: { width: 100, height: 32 },
  circle: { width: 70, height: 70 },
  diamond: { width: 90, height: 60 },
  square: { width: 70, height: 70 },
};

// Edge styles - Outside component to avoid recreation
const EDGE_STYLE = {
  stroke: '#5c6ac4',
  strokeWidth: 1.5,
  strokeDasharray: '',
};

// Separate standalone component for "no data" state
function NoFlowchartData() {
  return (
    <div className="flex items-center justify-center border border-gray-300 rounded-md p-4 bg-gray-50 text-gray-500">
      No flowchart data available or invalid diagram code
    </div>
  );
}

function ReaflowComponents({ 
  mermaidCode, 
  height = 400,
  className = '',
}: ReaflowComponentsProps) {
  // Convert mermaid code to reaflow nodes and edges
  const { nodes, edges } = useMemo(() => {
    try {
      // Parse mermaid code to get nodes and edges
      const { nodes: parsedNodes, edges: parsedEdges } = parseMermaidCode(mermaidCode);
      
      // Transform nodes with proper styling based on their type
      const styledNodes: NodeData[] = parsedNodes.map((node) => {
        const nodeType = node.type || 'default';
        const style = NODE_STYLES[nodeType as keyof typeof NODE_STYLES] || NODE_STYLES.default;
        const size = NODE_DEFAULT_SIZE[nodeType as keyof typeof NODE_DEFAULT_SIZE] || NODE_DEFAULT_SIZE.default;
        
        return {
          id: node.id,
          text: node.text,
          data: { type: nodeType },
          className: "reaflow-node",
          width: size.width,
          height: size.height,
          style,
        };
      });
      
      // Transform edges with consistent styling
      const styledEdges: EdgeData[] = parsedEdges.map((edge) => ({
        id: edge.id,
        from: edge.source,
        to: edge.target,
        text: edge.label,
        style: EDGE_STYLE,
      }));
      
      return { nodes: styledNodes, edges: styledEdges };
    } catch (error) {
      console.error('Error parsing mermaid code:', error);
      return { nodes: [], edges: [] };
    }
  }, [mermaidCode]);
  
  // Calculate initial zoom based on number of nodes to ensure proper scaling
  const initialScale = useMemo(() => {
    const nodeCount = nodes.length;
    if (nodeCount <= 5) return 0.95;
    if (nodeCount <= 10) return 0.85;
    if (nodeCount <= 15) return 0.75;
    if (nodeCount <= 20) return 0.65;
    return 0.55;
  }, [nodes.length]);

  // Early return if no nodes or invalid mermaid code
  if (nodes.length === 0) {
    return <NoFlowchartData />;
  }
  
  // Container styles for good isolation
  const containerStyle = {
    height: `${height}px`,
    width: '100%',
    maxHeight: `${height}px`,
    overflow: 'hidden' as const
  };
  
  return (
    <div 
      className={`reaflow-container ${className}`} 
      style={containerStyle}
    >
      <Canvas
        className="reaflow-canvas"
        nodes={nodes}
        edges={edges}
        fit={true}
        direction="DOWN"
        pannable={true}
        zoomable={true}
        readonly={true}
        animated={true}
        maxHeight={height}
        minZoom={0.3}
        maxZoom={2}
        key={`canvas-${nodes.length}`}
        layoutOptions={{
          'elk.padding': '[20, 20, 20, 20]',
          'elk.spacing.nodeNode': '25',
          'elk.layered.spacing.nodeNodeBetweenLayers': '35'
        }}
        zoom={initialScale}
        height={height}
      />
    </div>
  );
}

export default React.memo(ReaflowComponents); 