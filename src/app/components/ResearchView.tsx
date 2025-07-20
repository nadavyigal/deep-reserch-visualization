'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Save, FileText } from 'lucide-react';
import Link from 'next/link';
import Button from './Button';

interface ResearchViewProps {
  initialContent?: string;
}

const ResearchView: React.FC<ResearchViewProps> = ({ initialContent = '' }) => {
  const [researchContent, setResearchContent] = useState<string>(initialContent);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

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
        
        {/* Right side - Preview */}
        <div className={`w-full ${!isPreviewMode ? 'lg:w-1/2' : 'lg:w-full'} overflow-auto`}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Research Preview</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              {!researchContent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <FileText size={48} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                    No content yet
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md">
                    {!isPreviewMode 
                      ? "Start typing your research content in the left panel."
                      : "Add some content first to see the preview."
                    }
                  </p>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{researchContent}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResearchView; 