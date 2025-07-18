import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ChartGenerator from './ChartGenerator';

interface MarkdownEditorWithChartsProps {
  markdown: string;
  onMarkdownChange: (markdown: string) => void;
}

const MarkdownEditorWithCharts: React.FC<MarkdownEditorWithChartsProps> = ({
  markdown,
  onMarkdownChange,
}) => {
  const [sections, setSections] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');

  // Parse markdown to extract sections (headers and their content)
  useEffect(() => {
    if (!markdown) return;
    
    // Extract headers using regex
    const headerRegex = /^(#{1,6})\s+(.+)$/gm;
    const extractedSections: string[] = [];
    let match;
    
    // Use exec in a loop instead of matchAll for better compatibility
    while ((match = headerRegex.exec(markdown)) !== null) {
      extractedSections.push(match[2].trim());
    }
    
    setSections(extractedSections.length > 0 ? extractedSections : ['Full Document']);
    
    if (extractedSections.length > 0 && !selectedSection) {
      setSelectedSection(extractedSections[0]);
    } else if (extractedSections.length === 0 && markdown) {
      setSelectedSection('Full Document');
    }
  }, [markdown, selectedSection]);

  const handleSampleMarkdown = () => {
    const sampleMarkdown = `# Markdown Chart Studio

## Introduction
This is a tool for creating data visualizations from markdown content.

## How It Works
1. Write or paste your markdown in the editor
2. Select a section to visualize
3. Click "Generate Chart" to create a visual representation

## Features
- Markdown editing and preview
- Section-based chart generation
- Multiple chart types (area, line, bar, pie)

## Examples
Try selecting different sections and generating charts to see how it works!
`;
    onMarkdownChange(sampleMarkdown);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Markdown Editor
            </label>
            <button
              onClick={handleSampleMarkdown}
              className="text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => onMarkdownChange(e.target.value)}
            className="w-full h-[500px] p-4 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your markdown here..."
          />
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select section for chart:
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              disabled={sections.length === 0}
            >
              {sections.map((section, index) => (
                <option key={index} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
          
          <ChartGenerator 
            text={markdown} 
            section={selectedSection} 
          />
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Markdown Preview</h3>
            <div className="markdown-preview p-4 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 prose dark:prose-invert prose-sm max-w-none">
              {markdown ? (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeRaw]}
                >
                  {markdown}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-400 dark:text-gray-600 italic">Preview will appear here...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditorWithCharts; 