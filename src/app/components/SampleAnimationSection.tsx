"use client"

import React from 'react';
import AnimationSection from './AnimationSection';
import { MarketOverviewChart, PlatformDistributionChart } from './SampleCharts';

const marketOverviewText = `The creator economy is a dynamic sector where individuals monetize digital content, currently estimated at $224.2 billion in 2025, with growth projected to reach $480 billion by 2027 (Global Creator Economy Market Size). Platforms like YouTube, Instagram, and TikTok are pivotal, offering tools for content distribution and monetization.`;

const SampleAnimationSection = () => {
  return (
    <div className="sample-animation-section">
      <h2 className="text-2xl font-bold mb-4">Market Overview</h2>
      <p className="mb-6">{marketOverviewText}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MarketOverviewChart />
        <PlatformDistributionChart />
      </div>
      
      <div className="mb-8">
        <AnimationSection 
          id="market-overview" 
          code="" 
          onUpdate={() => {}} 
          isEditable={true} 
          sectionText={marketOverviewText} 
        />
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">How It Works</h3>
        <p className="mb-4">
          When you click &quot;Add Visualization&quot; under a section, you can choose between:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Animation:</strong> Create custom Anime.js animations or generate them with AI</li>
          <li><strong>Chart:</strong> Generate data visualizations based on the section content</li>
        </ul>
        <p>
          The AI will analyze your content and create appropriate visualizations that highlight key information.
        </p>
      </div>
    </div>
  );
};

export default SampleAnimationSection; 