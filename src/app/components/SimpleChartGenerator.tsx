'use client'

import React, { useState, useEffect } from 'react';
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

interface SimpleChartGeneratorProps {
  data: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  title?: string;
  description?: string;
}

const SimpleChartGenerator: React.FC<SimpleChartGeneratorProps> = ({ 
  data, 
  type, 
  title = 'Chart', 
  description = '' 
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Parse CSV data into chart data
  useEffect(() => {
    try {
      if (!data) return;
      
      const lines = data.trim().split('\n');
      if (lines.length < 2) {
        setError('Not enough data to generate a chart');
        return;
      }
      
      const headers = lines[0].split(',').map(h => h.trim());
      
      if (type === 'pie') {
        // For pie charts, we expect a simple two-column format: name,value
        const parsedData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          return {
            name: values[0],
            value: parseFloat(values[1]) || 0
          };
        });
        setChartData(parsedData);
      } else {
        // For other charts, we use the first column as the x-axis
        const parsedData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const dataPoint: any = { name: values[0] };
          
          // Add remaining columns as data series
          for (let i = 1; i < values.length; i++) {
            if (i < headers.length) {
              dataPoint[headers[i]] = parseFloat(values[i]) || 0;
            }
          }
          
          return dataPoint;
        });
        setChartData(parsedData);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error parsing chart data:', err);
      setError('Failed to parse chart data');
    }
  }, [data, type]);

  // Modern color palette
  const COLORS = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
  ];

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full">Loading chart data...</div>;
  }

  // Render the appropriate chart based on type
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
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
              {Object.keys(chartData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={COLORS[index % COLORS.length]} 
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1, fill: 'white' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
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
              {Object.keys(chartData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar 
                    key={key}
                    dataKey={key} 
                    fill={COLORS[index % COLORS.length]} 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
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
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <defs>
                {Object.keys(chartData[0])
                  .filter(key => key !== 'name')
                  .map((key, index) => (
                    <linearGradient key={`gradient-${key}`} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.2}/>
                    </linearGradient>
                  ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
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
              {Object.keys(chartData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Area 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={COLORS[index % COLORS.length]} 
                    fillOpacity={1}
                    fill={`url(#color${key})`}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div className="w-full h-full">
      {renderChart()}
    </div>
  );
};

export default SimpleChartGenerator;