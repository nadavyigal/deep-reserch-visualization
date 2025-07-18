"use client"

import React, { useState } from 'react';
import ChartGenerator from './ChartGenerator';
import { MarketOverviewChart } from './SampleCharts';

const SampleChartSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'demo' | 'generate'>('demo');
  
  const sampleText = `The creator economy has experienced significant growth over the past five years, with annual revenue increasing from $1.7 billion in 2020 to $5.8 billion in 2025. This represents a compound annual growth rate (CAGR) of 27.8%. The number of full-time content creators has also risen dramatically, from approximately 200,000 in 2020 to over 800,000 by 2025. Platforms like YouTube, Instagram, and TikTok have been the primary drivers of this growth, with YouTube accounting for 42% of creator revenue, followed by Instagram (28%) and TikTok (15%).`;

  return (
    <div className="sample-section">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'demo'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('demo')}
        >
          Sample Chart
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'generate'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('generate')}
        >
          Generate Your Own
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'demo' ? (
          <div>
            <p className="mb-4">{sampleText}</p>
            <div className="mt-6">
              <MarketOverviewChart />
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-4">{sampleText}</p>
            <div className="mt-6">
              <ChartGenerator text={sampleText} section="sample" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SampleChartSection; 