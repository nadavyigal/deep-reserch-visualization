'use client'

import React from 'react';
import AppLayout from '../components/AppLayout';
import { MarketOverviewChart, PlatformDistributionChart, RevenueStreamsChart, DemographicsChart } from '../components/SampleCharts';
import ChartGenerator from '../components/ChartGenerator';
import { useAuth } from '@/lib/hooks/useAuth';
import LoginButton from '../components/LoginButton';

const DemoPage = () => {
  const marketOverviewText = `The creator economy is a dynamic sector where individuals monetize digital content, currently estimated at $224.2 billion in 2025, with growth projected to reach $480 billion by 2027 (Global Creator Economy Market Size). Platforms like YouTube, Instagram, and TikTok are pivotal, offering tools for content distribution and monetization.`;
  
  const revenueStreamsText = `Content creators generate income through multiple revenue streams. Ad revenue accounts for 42% of creator income, followed by brand partnerships (28%), direct support like tips and subscriptions (15%), merchandise sales (10%), and other sources (5%). The diversification of income sources has become increasingly important for creator sustainability.`;
  
  const demographicsText = `The creator economy spans diverse demographics. Millennials make up the largest segment at 45%, followed by Gen Z (30%), Gen X (20%), and Baby Boomers (5%). The age distribution varies by platform, with TikTok attracting younger creators while YouTube and blogging platforms have more balanced age distributions.`;

  const { user, loading } = useAuth();

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please sign in to access the Chart Generation Demo.
              </p>
              <LoginButton />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 text-transparent bg-clip-text">
                AI Chart Generation Demo
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                See how our AI can automatically generate charts and visualizations based on your content.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 mb-12">
              {/* Market Overview Section */}
              <section className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Market Overview</h2>
                <p className="mb-6">{marketOverviewText}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <MarketOverviewChart />
                  <PlatformDistributionChart />
                </div>
                
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Generate Your Own Chart</h3>
                  <p className="mb-4">Click the button below to generate a custom chart based on the market overview text.</p>
                  <ChartGenerator text={marketOverviewText} section="market-overview" />
                </div>
              </section>

              {/* Revenue Streams Section */}
              <section className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Revenue Streams</h2>
                <p className="mb-6">{revenueStreamsText}</p>
                
                <div className="mb-8">
                  <RevenueStreamsChart />
                </div>
                
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Generate Your Own Chart</h3>
                  <p className="mb-4">Click the button below to generate a custom chart based on the revenue streams text.</p>
                  <ChartGenerator text={revenueStreamsText} section="revenue-streams" />
                </div>
              </section>

              {/* Demographics Section */}
              <section className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Creator Demographics</h2>
                <p className="mb-6">{demographicsText}</p>
                
                <div className="mb-8">
                  <DemographicsChart />
                </div>
                
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Generate Your Own Chart</h3>
                  <p className="mb-4">Click the button below to generate a custom chart based on the demographics text.</p>
                  <ChartGenerator text={demographicsText} section="demographics" />
                </div>
              </section>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold mb-4">How It Works</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Content Analysis:</strong> The AI analyzes your text content to identify key data points, trends, and relationships.
                </li>
                <li>
                  <strong>Chart Selection:</strong> Based on the content, the AI selects the most appropriate chart type (area, line, bar, or pie).
                </li>
                <li>
                  <strong>Data Generation:</strong> The AI extracts or estimates numerical values from your content to create meaningful visualizations.
                </li>
                <li>
                  <strong>Visualization Creation:</strong> A fully interactive chart is generated with appropriate labels, colors, and formatting.
                </li>
              </ol>
            </div>

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try it with your own content in the Markdown Animation Studio!
              </p>
              <a 
                href="/"
                className="inline-block px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Back to Editor
              </a>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default DemoPage; 