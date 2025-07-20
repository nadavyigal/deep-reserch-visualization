'use client'

import { useState, useEffect } from 'react';

interface HealthStatus {
  status: string;
  timestamp: string;
  environment: string;
  firebaseConfig: {
    status: string;
    details: Record<string, boolean>;
  };
}

export default function HealthCheckPage() {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const fetchHealthStatus = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/health');
        
        if (!response.ok) {
          throw new Error(`Health check failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        setHealthData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch health status');
        console.error('Health check error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthStatus();
  }, [refreshCount]);

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Health Check</h1>
        
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {healthData && !loading && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                healthData.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <h2 className="text-xl font-semibold">Overall Status: {healthData.status}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Environment</p>
                <p className="font-medium">{healthData.environment}</p>
              </div>
              
              <div>
                <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="font-medium">{new Date(healthData.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                healthData.firebaseConfig.status === 'complete' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <h2 className="text-xl font-semibold">Firebase Configuration: {healthData.firebaseConfig.status}</h2>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Environment Variables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(healthData.firebaseConfig.details).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${value ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-mono text-sm">{key}: {value ? 'Set' : 'Not Set'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Raw Response</h2>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto text-xs">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}