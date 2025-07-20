'use client'

import React from 'react';
import Link from 'next/link';
import AppLayout from './components/AppLayout';

export default function HomePage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Deep Research Visualization
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Powerful tools for visualizing research data and concepts
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Graphs</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Visualize quantitative data with interactive charts and graphs
                </p>
                <div className="mt-4">
                  <Link 
                    href="/examples" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Examples
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Flowcharts</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Create clear process visualizations and decision trees
                </p>
                <div className="mt-4">
                  <Link 
                    href="/examples" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Examples
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Animations</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  Bring concepts to life with dynamic animations
                </p>
                <div className="mt-4">
                  <Link 
                    href="/examples" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Examples
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}