'use client'

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChartGenerator from './ChartGenerator';
import { Save, FileText } from 'lucide-react';
// Import html2pdf dynamically to avoid SSR issues
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/hooks/useAuth';
import LoginButton from './LoginButton';
import Link from 'next/link';
import Button from './Button';

interface ResearchViewProps {
  initialContent?: string;
}

const ResearchView: React.FC<ResearchViewProps> = ({ initialContent = '' }) => {
  const [researchContent, setResearchContent] = useState<string>(initialContent);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [sections, setSections] = useState<{ title: string; content: string; level?: number }[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();

  // Parse research content to extract sections (headers and their content)
  useEffect(() => {
    if (!researchContent) {
      setSections([]);
      return;
    }
    
    // Split the content by headers (including numbered lists that might be headers)
    const headerRegex = /^(#{1,3})\s+(.+)$|^(\d+)\.\s+(.+)$/gm;
    const lines = researchContent.split('\n');
    
    const extractedSections: { title: string; content: string; level: number }[] = [];
    let currentSection: { title: string; content: string; level: number } | null = null;
    
    lines.forEach((line, index) => {
      // Check for markdown headers (# Header)
      const markdownHeaderMatch = line.match(/^(#{1,3})\s+(.+)$/);
      
      // Check for numbered list items that might be headers (1. Header)
      const numberedHeaderMatch = line.match(/^(\d+)\.\s+(.+)$/);
      
      if (markdownHeaderMatch) {
        // If we find a header and already have a current section, push it to the array
        if (currentSection) {
          extractedSections.push(currentSection);
        }
        
        // Start a new section with markdown header
        const headerLevel = markdownHeaderMatch[1].length;
        const headerTitle = markdownHeaderMatch[2].trim();
        
        currentSection = {
          title: headerTitle,
          content: line + '\n', // Include the header in the content
          level: headerLevel,
        };
      } else if (numberedHeaderMatch && (index === 0 || lines[index-1].trim() === '')) {
        // If we find a numbered item that looks like a header (at start of text or after blank line)
        // and already have a current section, push it to the array
        if (currentSection) {
          extractedSections.push(currentSection);
        }
        
        // Start a new section with numbered header (convert to markdown header)
        const headerTitle = numberedHeaderMatch[2].trim();
        const formattedHeader = `## ${headerTitle}`;
        
        currentSection = {
          title: headerTitle,
          content: formattedHeader + '\n', // Convert numbered list to markdown header
          level: 2, // Treat numbered headers as h2
        };
      } else if (currentSection) {
        // Add the line to the current section's content
        currentSection.content += line + '\n';
      } else if (line.trim() !== '') {
        // If there's no current section but we have content, create an "Introduction" section
        currentSection = {
          title: 'Introduction',
          content: '# Introduction\n' + line + '\n',
          level: 1,
        };
      }
    });
    
    // Add the last section if it exists
    if (currentSection) {
      extractedSections.push(currentSection);
    }
    
    // If no sections were found but we have content, create a single section
    if (extractedSections.length === 0 && researchContent.trim() !== '') {
      extractedSections.push({
        title: 'Research Content',
        content: '# Research Content\n' + researchContent,
        level: 1,
      });
    }
    
    setSections(extractedSections);
  }, [researchContent]);

  // Function to export the document as PDF
  const exportToPdf = async () => {
    if (!contentRef.current || !user) return;
    
    setIsExporting(true);
    
    try {
      // Dynamically import html2pdf to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Temporarily add a class to the content container for PDF styling
      contentRef.current.classList.add('pdf-export');
      
      // Make sure all charts and flowcharts are visible
      const chartContainers = contentRef.current.querySelectorAll('.flowchart-container, .chart-container');
      chartContainers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.style.height = 'auto';
          container.style.minHeight = '400px';
          container.style.overflow = 'visible';
        }
      });
      
      // Get document title from first section or use default
      const documentTitle = sections.length > 0 && sections[0].title 
        ? sections[0].title 
        : 'Research Document';
      
      // Create a filename with timestamp to ensure uniqueness
      const timestamp = new Date().getTime();
      const filename = `${documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}.pdf`;
      
      // Set options for PDF generation
      const opt = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: true,
          letterRendering: true,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as 'portrait',
          compress: true
        }
      };
      
      // Generate PDF as blob
      const pdfBlob = await html2pdf().set(opt).from(contentRef.current).output('blob');
      
      // Save to Firebase Storage
      const { ref: storageRef, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { storage, db } = await import('@/lib/firebase/firebase');
      
      // Create a reference to the file location in Firebase Storage
      const fileRef = storageRef(storage, `documents/${user.uid}/${filename}`);
      
      // Upload the blob
      await uploadBytes(fileRef, pdfBlob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(fileRef);
      
      // Save metadata to Firestore
      await addDoc(collection(db, 'documents'), {
        title: documentTitle,
        userId: user.uid,
        createdAt: serverTimestamp(),
        fileUrl: downloadURL,
        fileName: filename,
        contentPreview: researchContent.substring(0, 200) + (researchContent.length > 200 ? '...' : '')
      });
      
      console.log('PDF exported and saved successfully');
      
      // Show success message
      alert('Document saved successfully! You can view it in the Documents page.');
      
      // Remove the temporary class
      contentRef.current.classList.remove('pdf-export');
      
      // Reset chart container styles
      chartContainers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.style.height = '';
          container.style.minHeight = '';
          container.style.overflow = '';
        }
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to save document. Please try again later.');
    } finally {
      setIsExporting(false);
    }
  };

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
              {sections.map((section, index) => (
                <div key={`section-${index}`} className="mb-8">
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
                  
                  {/* Add visualization after each section */}
                  {section.content.length > 100 && (
                    <div className="mt-4 mb-8">
                      <ChartGenerator text={section.content} section={section.title} />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResearchView; 