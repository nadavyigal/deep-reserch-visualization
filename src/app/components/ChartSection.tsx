'use client'

import { useState } from 'react';
import ChartGenerator from './ChartGenerator';

interface ChartSectionProps {
  id: string;
  code: string;
  onUpdate: (code: string) => void;
  isEditable: boolean;
  sectionText?: string;
}

export default function ChartSection({ 
  id, 
  code, 
  onUpdate, 
  isEditable,
  sectionText = ''
}: ChartSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCode, setCurrentCode] = useState(code);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentCode(e.target.value);
  };

  const handleSave = () => {
    onUpdate(currentCode);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentCode(code);
    setIsEditing(false);
  };

  return (
    <div className="chart-section mb-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="chart-container relative">
        {isEditing ? (
          <div className="p-4">
            <div className="mb-4">
              <div className="chart-container">
                <ChartGenerator text={sectionText} section={id} />
              </div>
            </div>
            
            {generationError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                {generationError}
              </div>
            )}
          </div>
        ) : (
          <div 
            className={`chart-display min-h-[200px] flex items-center justify-center p-4 ${!code ? 'cursor-pointer' : ''}`}
            onClick={() => !code && isEditable && setIsEditing(true)}
          >
            {code ? (
              <div className="w-full h-full">
                {/* Chart will be rendered here */}
              </div>
            ) : (
              <div className="text-center group">
                {isEditable ? (
                  <>
                    <ChartIcon className="w-12 h-12 mb-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <p className="group-hover:text-primary-500 transition-colors">Click to add chart</p>
                  </>
                ) : (
                  <p>No chart added</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {isEditable && (
        <div className="mt-3 flex justify-end p-3 bg-gray-50 dark:bg-gray-800">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                className="btn-primary mr-2"
              >
                Save
              </button>
              <button 
                onClick={handleCancel}
                className="btn-outline"
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn-secondary"
            >
              {code ? 'Edit Chart' : 'Add Chart'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ChartIcon({ className = "w-6 h-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
} 