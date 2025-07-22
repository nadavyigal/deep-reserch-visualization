'use client'

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import ChartGenerator from './ChartGenerator';
import SimpleChartGenerator from './SimpleChartGenerator';
import FlowchartGenerator from './FlowchartGenerator';
import AnimationGenerator from './AnimationGenerator';
import { Save, FileText, BarChart3, GitBranch, Zap, Plus, X } from 'lucide-react';
// Import html2pdf dynamically to avoid SSR issues
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/hooks/useAuth';
import LoginButton from './LoginButton';
import Link from 'next/link';
import Button from './Button';
import logger from '@/lib/utils/logger';
import { parseSections, Section } from '@/lib/utils/parseSections';
import { exportResearchToPdf } from '@/lib/utils/exportPdf';

interface VisualizationItem {
  id: string;
  type: 'chart' | 'flowchart' | 'animation';
  sectionIndex: number;
  data?: any;
  config?: any;
}

interface ResearchViewProps {
  initialContent?: string;
}

const ResearchView: React.FC<ResearchViewProps> = ({ initialContent = '' }) => {
  const [researchContent, setResearchContent] = useState<string>(initialContent);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [sections, setSections] = useState<{ title: string; content: string; level?: number }[]>([]);
  const [visualizations, setVisualizations] = useState<VisualizationItem[]>([]);
  const [showVisualizationPanel, setShowVisualizationPanel] = useState<{ sectionIndex: number | null }>({ sectionIndex: null });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();

  // Parse research content to extract sections (headers and their content)
  useEffect(() => {
    const parsed = parseSections(researchContent);
    logger.info('Parsed sections:', parsed);
    setSections(parsed);
    setVisualizations(prev => prev.filter(viz => viz.sectionIndex < parsed.length));
  }, [researchContent]);

  // Add visualization to a section
  const addVisualization = (sectionIndex: number, type: 'chart' | 'flowchart' | 'animation') => {
    logger.info(`Adding ${type} visualization to section ${sectionIndex}`);
    
    try {
      const newViz: VisualizationItem = {
        id: `viz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        sectionIndex,
      };
      
      logger.info('New visualization:', newViz);
      setVisualizations(prev => {
        const updated = [...prev, newViz];
        logger.info('Updated visualizations:', updated);
        return updated;
      });
      setShowVisualizationPanel({ sectionIndex: null });
    } catch (error) {
      logger.error('Error adding visualization:', error);
    }
  };

  // Remove visualization
  const removeVisualization = (vizId: string) => {
    logger.info('Removing visualization with ID:', vizId);
    setVisualizations(prev => {
      const updated = prev.filter(viz => viz.id !== vizId);
      logger.info('Visualizations after removal:', updated);
      return updated;
    });
  };

  // Get visualizations for a specific section
  const getVisualizationsForSection = (sectionIndex: number) => {
    return visualizations.filter(viz => viz.sectionIndex === sectionIndex);
  };

  // Function to export the document as PDF
  const exportToPdf = async () => {
    if (!contentRef.current || !user) return;

    setIsExporting(true);
    try {
      await exportResearchToPdf({
        element: contentRef.current,
        user,
        sections: sections as Section[],
        researchContent
      });
      logger.info('PDF exported and saved successfully');
      alert('Document saved successfully! You can view it in the Documents page.');
    } catch (error) {
      logger.error('Error exporting PDF:', error);
      alert('Failed to save document. Please try again later.');
    } finally {
      setIsExporting(false);
    }
  };

  // Render visualization component based on type
  const renderVisualization = (viz: VisualizationItem, section: any) => {
    logger.info('Rendering visualization:', viz.type, 'for section:', section.title);
    
    const sectionContent = section.content;
    const sectionTitle = section.title;

    try {
      switch (viz.type) {
        case 'chart':
          return (
            <div key={viz.id} className="relative bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-700">
              <button
                onClick={() => {
                  logger.info('Removing visualization:', viz.id);
                  removeVisualization(viz.id);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
              >
                <X size={12} />
              </button>
              <h4 className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-200">📊 AI-Generated Chart for "{sectionTitle}"</h4>
              <div className="bg-white dark:bg-gray-800 rounded-md p-2">
                <ChartGenerator text={sectionContent} section={sectionTitle} />
              </div>
            </div>
          );
        
        case 'flowchart':
          return (
            <div key={viz.id} className="relative bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 mb-4 border border-green-200 dark:border-green-700">
              <button
                onClick={() => {
                  logger.info('Removing visualization:', viz.id);
                  removeVisualization(viz.id);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
              >
                <X size={12} />
              </button>
              <h4 className="text-sm font-medium mb-3 text-green-800 dark:text-green-200">🔀 Process Flowchart for "{sectionTitle}"</h4>
              <div className="bg-white dark:bg-gray-800 rounded-md p-2">
                <FlowchartGenerator 
                  initialCode={`graph TD\n  A[Start: ${sectionTitle}] --> B{Decision?}\n  B -->|Yes| C[Process]\n  B -->|No| D[End]`}
                  height={300} 
                />
              </div>
            </div>
          );
        
        case 'animation':
          return (
            <div key={viz.id} className="relative bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 mb-4 border border-purple-200 dark:border-purple-700">
              <button
                onClick={() => {
                  logger.info('Removing visualization:', viz.id);
                  removeVisualization(viz.id);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
              >
                <X size={12} />
              </button>
              <h4 className="text-sm font-medium mb-3 text-purple-800 dark:text-purple-200">✨ Animated Concepts for "{sectionTitle}"</h4>
              <div className="bg-white dark:bg-gray-800 rounded-md p-2">
                <AnimationGenerator text={sectionContent} section={sectionTitle} />
              </div>
            </div>
          );
        
        default:
          logger.warn('Unknown visualization type:', viz.type);
          return null;
      }
    } catch (error) {
      logger.error('Error rendering visualization:', error);
      return (
        <div key={viz.id} className="relative bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4 border border-red-200 dark:border-red-700">
          <button
            onClick={() => removeVisualization(viz.id)}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
          <h4 className="text-sm font-medium mb-2 text-red-700 dark:text-red-300">Error Loading Visualization</h4>
          <p className="text-xs text-red-600 dark:text-red-400">Failed to load {viz.type} visualization</p>
        </div>
      );
    }
  };

  // Visualization panel component
  const VisualizationPanel = ({ sectionIndex }: { sectionIndex: number }) => (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-gray-600 rounded-xl p-6 mb-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Choose Visualization Type for Section {sectionIndex + 1}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Select how you want to visualize this section</p>
        </div>
        <button
          onClick={() => {
            logger.info('Closing visualization panel');
            setShowVisualizationPanel({ sectionIndex: null });
          }}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => {
            logger.info(`Adding chart to section ${sectionIndex}`);
            addVisualization(sectionIndex, 'chart');
          }}
          className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
        >
          <BarChart3 size={32} className="mb-2 text-blue-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Chart</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">Auto-generate charts from your content</span>
        </button>
        <button
          onClick={() => {
            logger.info(`Adding flowchart to section ${sectionIndex}`);
            addVisualization(sectionIndex, 'flowchart');
          }}
          className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 rounded-xl hover:border-green-400 dark:hover:border-green-500 hover:shadow-md transition-all"
        >
          <GitBranch size={32} className="mb-2 text-green-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Flowchart</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">Create process diagrams</span>
        </button>
        <button
          onClick={() => {
            logger.info(`Adding animation to section ${sectionIndex}`);
            addVisualization(sectionIndex, 'animation');
          }}
          className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all"
        >
          <Zap size={32} className="mb-2 text-purple-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Animation</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">Animate key concepts</span>
        </button>
      </div>
    </div>
  );

  // If loading, show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to access the Research Analysis tool.
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Research Analysis</h2>
        <div className="flex space-x-2">
          <Link
            href="/documents"
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            View Documents
          </Link>
          <Button
            onClick={exportToPdf}
            disabled={isExporting}
            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isExporting ? 'Saving...' : 'Save as PDF'}
          </Button>
          <Button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="px-4 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
        {/* Left side - Research input */}
        {!isPreviewMode && (
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-2 flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Research Content (Markdown)
              </label>
              <a 
                href="https://github.com/topics/markdown" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Markdown Reference
              </a>
            </div>
            <textarea
              value={researchContent}
              onChange={(e) => setResearchContent(e.target.value)}
              className="flex-1 p-4 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your research content in Markdown format..."
            />
          </div>
        )}
        
        {/* Right side - Preview with visualizations */}
        <div className={`w-full ${!isPreviewMode ? 'lg:w-1/2' : 'lg:w-full'} overflow-auto`} ref={contentRef}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>
                {sections.length > 0 && sections[0].level === 1 
                  ? sections[0].title 
                  : 'Research Preview'}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              {sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <FileText size={48} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                    No content yet
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md">
                    {!isPreviewMode 
                      ? "Start typing your research content in the left panel. You'll be able to add visualizations to each section."
                      : "Add some content first to see the preview and visualization options."
                    }
                  </p>
                </div>
              ) : (
                sections.map((section, index) => {
                  logger.info(`Rendering section ${index}:`, section.title);
                  return (
                  <div key={`section-${index}`} className="mb-8 border-l-4 border-blue-200 pl-4">
                    {/* Section Header */}
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                        Section {index + 1}: {section.title}
                      </h3>
                    </div>
                    
                    {/* Section Content */}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        // Custom rendering for headings to add spacing
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                        // Add more custom components as needed
                      }}
                    >
                      {section.content}
                    </ReactMarkdown>
                    
                    {/* Visualization controls and content */}
                    <div className="mt-6 space-y-4">
                      {/* Show visualization panel if this section is selected */}
                      {showVisualizationPanel.sectionIndex === index && (
                        <VisualizationPanel sectionIndex={index} />
                      )}
                      
                      {/* Render existing visualizations for this section */}
                      <div className="space-y-4">
                        {getVisualizationsForSection(index).map(viz => 
                          renderVisualization(viz, section)
                        )}
                      </div>
                      
                      {/* Add visualization button - ALWAYS show if not in preview mode */}
                      {!isPreviewMode && (
                        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 mt-6">
                          {showVisualizationPanel.sectionIndex !== index ? (
                            <button
                              onClick={() => {
                                logger.info(`Adding visualization to section ${index}`);
                                setShowVisualizationPanel({ sectionIndex: index });
                              }}
                              className="w-full flex items-center justify-center gap-3 px-6 py-4 text-sm bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/50 dark:hover:to-purple-800/50 border-2 border-blue-200 dark:border-blue-700 rounded-xl transition-all shadow-sm hover:shadow-md font-medium"
                            >
                              <Plus size={20} className="text-blue-600 dark:text-blue-400" />
                              <span className="text-gray-700 dark:text-gray-300">Add Visualization to Section {index + 1}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">Charts, Flowcharts, Animations</span>
                            </button>
                          ) : (
                            <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                              Choose a visualization type above
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResearchView; 