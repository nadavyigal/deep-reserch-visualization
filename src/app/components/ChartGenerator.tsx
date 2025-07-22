"use client"

import React, { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { 
  Area, 
  Bar, 
  CartesianGrid, 
  Cell, 
  Line, 
  Pie, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  BarChart,
  LineChart,
  PieChart
} from 'recharts';
import Button from './Button';
import logger from '@/lib/utils/logger';

// Lazy load heavier components
const FlowchartGenerator = lazy(() => import('./FlowchartGenerator'));
const AnimationGenerator = lazy(() => import('./AnimationGenerator'));

// Define interfaces for the lazy-loaded component props
interface FlowchartGeneratorProps {
  initialCode?: string;
  text?: string;
  height?: number;
  width?: number;
}

interface AnimationGeneratorProps {
  text: string;
  section?: string;
}

// Define color palette once
const COLORS = ['#36B37E', '#FF5630', '#FFAB00', '#6554C0', '#00B8D9', '#6B778C'];

// Throttle function to limit execution frequency
const throttle = (func: Function, limit: number) => {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  return function(this: any, ...args: any[]) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

interface ChartGeneratorProps {
  text: string;
  section?: string;
}

// Memoized chart components
const MemoizedAreaChart = memo(({ data, colors }: { data: any[], colors: string[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart
      data={data}
      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
    >
      <defs>
        <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={colors[0]} stopOpacity={0.2}/>
        </linearGradient>
        <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={colors[1]} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={colors[1]} stopOpacity={0.2}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
      <XAxis 
        dataKey="name" 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: '#888' }}
        dy={10}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: '#888' }}
        dx={-10}
      />
      <Tooltip 
        contentStyle={{ 
          borderRadius: '8px', 
          border: 'none', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontSize: '12px'
        }} 
      />
      <Area 
        type="monotone" 
        dataKey="value1" 
        stackId="1"
        stroke={colors[0]} 
        fillOpacity={1}
        fill="url(#colorValue1)" 
      />
      <Area 
        type="monotone" 
        dataKey="value2" 
        stackId="1"
        stroke={colors[1]} 
        fillOpacity={1}
        fill="url(#colorValue2)" 
      />
    </AreaChart>
  </ResponsiveContainer>
));

const MemoizedLineChart = memo(({ data, colors }: { data: any[], colors: string[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart
      data={data}
      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
      <XAxis 
        dataKey="name" 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: '#888' }}
        dy={10}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: '#888' }}
        dx={-10}
      />
      <Tooltip 
        contentStyle={{ 
          borderRadius: '8px', 
          border: 'none', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontSize: '12px'
        }} 
      />
      <Legend 
        verticalAlign="top" 
        height={36}
        iconType="circle"
        iconSize={8}
        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
      />
      <Line 
        type="monotone" 
        dataKey="value1" 
        name="Value 1"
        stroke={colors[0]} 
        strokeWidth={2}
        dot={{ r: 4, strokeWidth: 1 }}
        activeDot={{ r: 6, strokeWidth: 0 }}
      />
      <Line 
        type="monotone" 
        dataKey="value2" 
        name="Value 2"
        stroke={colors[1]} 
        strokeWidth={2}
        dot={{ r: 4, strokeWidth: 1 }}
        activeDot={{ r: 6, strokeWidth: 0 }}
      />
    </LineChart>
  </ResponsiveContainer>
));

const MemoizedBarChart = memo(({ data, colors }: { data: any[], colors: string[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={data}
      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
      <XAxis 
        dataKey="name" 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: '#888' }}
        dy={10}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: '#888' }}
        dx={-10}
      />
      <Tooltip 
        contentStyle={{ 
          borderRadius: '8px', 
          border: 'none', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontSize: '12px'
        }} 
      />
      <Legend 
        verticalAlign="top" 
        height={36}
        iconType="circle"
        iconSize={8}
        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
      />
      <Bar dataKey="value1" name="Value 1" fill={colors[0]} radius={[4, 4, 0, 0]} />
      <Bar dataKey="value2" name="Value 2" fill={colors[1]} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
));

const MemoizedPieChart = memo(({ data, colors }: { data: any[], colors: string[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={120}
        innerRadius={60}
        fill="#8884d8"
        paddingAngle={2}
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip 
        contentStyle={{ 
          borderRadius: '8px', 
          border: 'none', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontSize: '12px'
        }} 
      />
    </PieChart>
  </ResponsiveContainer>
));

const ChartGenerator: React.FC<ChartGeneratorProps> = ({ text, section }) => {
  // Generate a unique ID for this component instance
  const instanceId = useMemo(() => Math.random().toString(36).substring(2, 15), []);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [chartType, setChartType] = useState<string>('');
  const [chartTitle, setChartTitle] = useState<string>('');
  const [chartDescription, setChartDescription] = useState<string>('');
  const [visualizationType, setVisualizationType] = useState<'chart' | 'diagram' | 'animation' | null>(null);
  const [flowchartKey, setFlowchartKey] = useState<number>(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Load chart data when component mounts or text changes
  useEffect(() => {
    if (text && text.trim().length > 50 && visualizationType === 'chart') {
      generateChart();
    }
    
    // Cleanup function to abort any pending requests on unmount or when dependencies change
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [text, visualizationType]);

  // Generate chart with API call
  const generateChart = useCallback(async () => {
    if (!text) return;
    
    setLoading(true);
    setError(null);
    
    // Abort previous request if it exists
    if (abortController) {
      abortController.abort();
    }
    
    // Create a new abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);
    
    try {
      const response = await fetch('/api/openai/generate-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, section }),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate chart');
      }
      
      const data = await response.json();
      
      if (data.chartData && data.chartType) {
        setChartData(data.chartData);
        setChartType(data.chartType);
        setChartTitle(data.chartTitle || 'Data Visualization');
        setChartDescription(data.chartDescription || '');
      } else {
        throw new Error('Invalid chart data received');
      }
    } catch (err) {
      // Only set error if not aborted
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setError('Error generating chart. Please try again.');
        logger.error('Chart generation error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [text, section]);

  // Handle visualization type change - throttled to prevent rapid changes
  const handleVisualizationClick = useCallback(throttle((type: 'chart' | 'diagram' | 'animation') => {
    // If clicking the same type, regenerate content
    if (type === visualizationType) {
      if (type === 'diagram') {
        // Force re-render by updating the key
        setFlowchartKey(prev => prev + 1);
      } else if (type === 'chart') {
        generateChart();
      }
    } else {
      setVisualizationType(type);
      setError(null); // Clear any previous errors
      
      if (type === 'chart') {
        generateChart();
      } else if (type === 'diagram') {
        // Reset the key when switching to diagram
        setFlowchartKey(0);
      }
    }
  }, 300), [visualizationType, generateChart]);

  // Fallback data for when API fails
  const fallbackData = useMemo(() => ({
    area: [
      { name: 'Jan', value1: 400, value2: 240 },
      { name: 'Feb', value1: 300, value2: 139 },
      { name: 'Mar', value1: 200, value2: 980 },
      { name: 'Apr', value1: 278, value2: 390 },
      { name: 'May', value1: 189, value2: 480 },
      { name: 'Jun', value1: 239, value2: 380 },
    ],
    line: [
      { name: 'Jan', value1: 400, value2: 240 },
      { name: 'Feb', value1: 300, value2: 139 },
      { name: 'Mar', value1: 200, value2: 980 },
      { name: 'Apr', value1: 278, value2: 390 },
      { name: 'May', value1: 189, value2: 480 },
      { name: 'Jun', value1: 239, value2: 380 },
    ],
    bar: [
      { name: 'Item 1', value1: 400, value2: 240 },
      { name: 'Item 2', value1: 300, value2: 139 },
      { name: 'Item 3', value1: 200, value2: 980 },
      { name: 'Item 4', value1: 278, value2: 390 },
    ],
    pie: [
      { name: 'Group A', value: 400 },
      { name: 'Group B', value: 300 },
      { name: 'Group C', value: 300 },
      { name: 'Group D', value: 200 },
    ]
  }), []);

  // Render the appropriate chart - memoized to prevent unnecessary rerenders
  const renderedChart = useMemo(() => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center h-[300px] flex items-center justify-center">
          <div>
            <p className="font-medium mb-2">Error generating chart</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => generateChart()} 
              className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (!chartData || !chartType) {
      // Use fallback data if no chart data is available
      if (visualizationType === 'chart') {
        return (
          <MemoizedAreaChart data={fallbackData.area} colors={COLORS} />
        );
      }
      return null;
    }

    const commonCardProps = {
      className: "overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-800",
    };

    switch (chartType.toLowerCase()) {
      case 'area':
        return <MemoizedAreaChart data={chartData} colors={COLORS} />;
      
      case 'line':
        return <MemoizedLineChart data={chartData} colors={COLORS} />;
      
      case 'bar':
        return <MemoizedBarChart data={chartData} colors={COLORS} />;
      
      case 'pie':
        return <MemoizedPieChart data={chartData} colors={COLORS} />;
      
      default:
        return <MemoizedLineChart data={chartData} colors={COLORS} />;
    }
  }, [chartData, chartType, loading, error, visualizationType, fallbackData, COLORS, generateChart]);

  // Render the component
  return (
    <div className="chart-generator w-full">
      {/* Type selection buttons */}
      <div className="flex space-x-1 mb-4">
        <Button
          onClick={() => handleVisualizationClick('chart')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            visualizationType === 'chart' 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Chart
        </Button>
        <Button
          onClick={() => handleVisualizationClick('diagram')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            visualizationType === 'diagram' 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Diagram
        </Button>
        <Button
          onClick={() => handleVisualizationClick('animation')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            visualizationType === 'animation' 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Animation
        </Button>
      </div>

      {/* Content area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {visualizationType === 'chart' && (
          <div>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium">{chartTitle || 'Data Visualization'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{chartDescription || 'Based on document analysis'}</p>
            </div>
            <div className="p-4">
              {renderedChart}
            </div>
          </div>
        )}

        {visualizationType === 'diagram' && (
          <Suspense fallback={
            <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          }>
            <div className="p-4">
              <FlowchartGenerator key={`flowchart-${flowchartKey}`} initialCode={text} />
            </div>
          </Suspense>
        )}

        {visualizationType === 'animation' && (
          <Suspense fallback={
            <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          }>
            <div className="p-4">
              <AnimationGenerator text={text} />
            </div>
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default memo(ChartGenerator); 