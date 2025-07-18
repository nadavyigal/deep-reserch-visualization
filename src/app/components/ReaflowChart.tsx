'use client'

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Canvas, Edge, Node, NodeProps, EdgeProps, ElkRoot } from 'reaflow';
import { nanoid } from 'nanoid';
import './reaflow-styles.css';

interface ReaflowNode {
  id: string;
  text: string;
  type?: string;
  width?: number;
  height?: number;
  data?: Record<string, any>;
}

interface ReaflowEdge {
  id: string;
  from: string;
  to: string;
  text?: string;
}

interface ReaflowChartProps {
  mermaidCode: string;
  height?: number;
  width?: number;
}

const parseMermaidCode = (code: string): { nodes: ReaflowNode[]; edges: ReaflowEdge[] } => {
  const nodes: ReaflowNode[] = [];
  const edges: ReaflowEdge[] = [];
  const nodeMap: Record<string, boolean> = {};

  // Normalize line endings
  const normalizedCode = code.replace(/\r\n/g, '\n');
  
  // Extract lines, ignoring comments and empty lines
  const lines = normalizedCode
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('%') && !line.startsWith('%%'));

  // The first line might be the graph definition - skip if it is
  const startIndex = lines[0]?.startsWith('graph ') || lines[0]?.startsWith('flowchart ') ? 1 : 0;

  // Process each line
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines or purely comment lines
    if (!line || line.startsWith('%') || line.startsWith('%%')) continue;
    
    // Extract node and connection information
    try {
      // Edge case: Line with direct node definition like A[Start]
      if (!line.includes('-->') && !line.includes('->')) {
        const nodeMatch = line.match(/^([A-Za-z0-9_]+)(?:\[([^\]]+)\]|\(([^\)]+)\)|{([^}]+)}|>"([^"]+)")?/);
        if (nodeMatch) {
          const id = nodeMatch[1];
          // Extract text from one of the possible formats: [], (), {}, >""
          const text = nodeMatch[2] || nodeMatch[3] || nodeMatch[4] || nodeMatch[5] || id;
          
          if (!nodeMap[id]) {
            nodes.push({
              id,
              text,
              type: line.includes('[') ? 'process' : 
                    line.includes('(') ? 'subprocess' : 
                    line.includes('{') ? 'decision' : 'default'
            });
            nodeMap[id] = true;
          }
          continue;
        }
      }
      
      // Process connections (edges) with two formats: --> or ->
      const arrowTypes = ['-->', '->'];
      let connectionFound = false;
      
      for (const arrowType of arrowTypes) {
        if (line.includes(arrowType)) {
          connectionFound = true;
          const parts = line.split(arrowType);
          
          if (parts.length >= 2) {
            // Process source node
            let sourceId = parts[0].trim();
            let sourceText = sourceId;
            let sourceType = 'default';
            
            // Extract node text and type if defined with [], (), or {}
            const sourceNodeMatch = sourceId.match(/^([A-Za-z0-9_]+)(?:\[([^\]]+)\]|\(([^\)]+)\)|{([^}]+)}|>"([^"]+)")?/);
            if (sourceNodeMatch) {
              sourceId = sourceNodeMatch[1];
              sourceText = sourceNodeMatch[2] || sourceNodeMatch[3] || sourceNodeMatch[4] || sourceNodeMatch[5] || sourceId;
              sourceType = sourceNodeMatch[2] ? 'process' : 
                        sourceNodeMatch[3] ? 'subprocess' : 
                        sourceNodeMatch[4] ? 'decision' : 'default';
            }
            
            // Add source node if not already added
            if (!nodeMap[sourceId]) {
              nodes.push({ id: sourceId, text: sourceText, type: sourceType });
              nodeMap[sourceId] = true;
            }
            
            // Process target node
            let targetPart = parts[1].trim();
            let edgeLabel = '';
            
            // Check if there's a label on the edge
            const edgeLabelMatch = targetPart.match(/\|([^|]+)\|/);
            if (edgeLabelMatch) {
              edgeLabel = edgeLabelMatch[1].trim();
              targetPart = targetPart.replace(/\|([^|]+)\|/, '').trim();
            }
            
            let targetId = targetPart;
            let targetText = targetId;
            let targetType = 'default';
            
            // Extract target node information
            const targetNodeMatch = targetPart.match(/^([A-Za-z0-9_]+)(?:\[([^\]]+)\]|\(([^\)]+)\)|{([^}]+)}|>"([^"]+)")?/);
            if (targetNodeMatch) {
              targetId = targetNodeMatch[1];
              targetText = targetNodeMatch[2] || targetNodeMatch[3] || targetNodeMatch[4] || targetNodeMatch[5] || targetId;
              targetType = targetNodeMatch[2] ? 'process' : 
                        targetNodeMatch[3] ? 'subprocess' : 
                        targetNodeMatch[4] ? 'decision' : 'default';
            }
            
            // Add target node if not already added
            if (!nodeMap[targetId]) {
              nodes.push({ id: targetId, text: targetText, type: targetType });
              nodeMap[targetId] = true;
            }
            
            // Add the edge
            edges.push({
              id: `${sourceId}-${targetId}-${nanoid(4)}`,
              from: sourceId,
              to: targetId,
              text: edgeLabel
            });
          }
        }
      }
      
      // If we didn't find a connection and haven't processed this as a node yet, 
      // check if it's another format of node definition
      if (!connectionFound) {
        // Try more node formats (this is simplified and may need expansion)
        const complexNodeMatch = line.match(/^([A-Za-z0-9_]+)(?:\[([^\]]+)\]|\(([^\)]+)\)|{([^}]+)}|>"([^"]+)")?/);
        if (complexNodeMatch) {
          const id = complexNodeMatch[1];
          const text = complexNodeMatch[2] || complexNodeMatch[3] || complexNodeMatch[4] || complexNodeMatch[5] || id;
          
          if (!nodeMap[id]) {
            nodes.push({
              id,
              text,
              type: line.includes('[') ? 'process' : 
                    line.includes('(') ? 'subprocess' : 
                    line.includes('{') ? 'decision' : 'default'
            });
            nodeMap[id] = true;
          }
        }
      }
    } catch (error) {
      console.error('Error parsing line:', line, error);
    }
  }
  
  // Ensure we have valid data to return
  return {
    nodes: nodes.length > 0 ? nodes : [{ id: 'placeholder', text: 'No valid nodes found' }],
    edges: edges.filter(edge => 
      // Ensure both source and target nodes exist
      nodes.some(node => node.id === edge.from) && 
      nodes.some(node => node.id === edge.to)
    )
  };
};

const CustomNode = ({ ...props }: NodeProps) => {
  const node = (props as any).node;
  const nodeType = node.properties?.type || 'default';
  
  // Set default dimensions based on text length
  const text = node.text || '';
  const width = Math.max(100, Math.min(250, text.length * 10));
  const height = text.length > 20 ? 60 : 40;
  
  let nodeShape;
  
  switch (nodeType) {
    case 'process':
      nodeShape = (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={5}
          ry={5}
          className="reaflow-node-body"
        />
      );
      break;
    case 'decision':
      nodeShape = (
        <polygon
          points={`${width/2},0 ${width},${height/2} ${width/2},${height} 0,${height/2}`}
          className="reaflow-node-body"
        />
      );
      break;
    case 'subprocess':
      nodeShape = (
        <ellipse
          cx={width/2}
          cy={height/2}
          rx={width/2}
          ry={height/2}
          className="reaflow-node-body"
        />
      );
      break;
    default:
      nodeShape = (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={5}
          ry={5}
          className="reaflow-node-body"
        />
      );
  }
  
  return (
    <g className="reaflow-node">
      {nodeShape}
      <foreignObject x={0} y={0} width={width} height={height} className="reaflow-node-foreign-object">
        <div className="reaflow-node-text-container">
          <div className="reaflow-node-text">
            {text}
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

const CustomEdge = ({ ...props }: EdgeProps) => {
  const edge = (props as any).edge;
  const text = edge.properties?.text;
  
  return (
    <g className="reaflow-edge">
      <Edge {...props} />
      {text && (
        <foreignObject
          width={100}
          height={30}
          x={50}
          y={15}
          className="reaflow-edge-text-container"
        >
          <div className="reaflow-edge-text">
            {text}
          </div>
        </foreignObject>
      )}
    </g>
  );
};

const ReaflowChart: React.FC<ReaflowChartProps> = ({ mermaidCode, height = 400, width = 800 }) => {
  const [elkLayout, setElkLayout] = useState<ElkRoot | null>(null);
  
  // Parse mermaid code
  const { nodes, edges } = useMemo(() => {
    try {
      return parseMermaidCode(mermaidCode);
    } catch (error) {
      console.error('Error parsing mermaid code:', error);
      return { nodes: [{ id: 'error', text: 'Error parsing flowchart' }], edges: [] };
    }
  }, [mermaidCode]);
  
  // Set up layout
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const timer = setTimeout(() => {
      setElkLayout({
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': 'DOWN',
          'elk.spacing.nodeNode': '50',
          'elk.layered.spacing.nodeNodeBetweenLayers': '80'
        }
      });
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="reaflow-container" style={{ width: '100%', height }}>
      {nodes.length > 0 && (
        <Canvas
          className="reaflow-canvas"
          maxWidth={width}
          maxHeight={height}
          nodes={nodes.map(node => ({
            ...node,
            width: node.width || Math.max(100, Math.min(250, node.text.length * 10)),
            height: node.height || (node.text.length > 20 ? 60 : 40),
          }))}
          edges={edges}
          node={<CustomNode />}
          edge={<CustomEdge />}
          fit
          animated
          zoomable
          readonly
          pannable
          direction="DOWN"
          elkLayout={elkLayout}
        />
      )}
    </div>
  );
};

export default ReaflowChart; 