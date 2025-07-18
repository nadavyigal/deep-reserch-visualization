'use client'

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

// Define the props interface
interface SimpleChartGeneratorProps {
  data: string; // CSV data
  type: 'line' | 'bar' | 'pie' | 'area';
  title?: string;
  description?: string;
}

// Define the parsed data structure
interface ParsedData {
  [key: string]: string | number;
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
];

const SimpleChartGenerator: React.FC<SimpleChartGeneratorProps> = ({ 
  data, 
  type, 
  title, 
  description 
}) => {
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);
  const [keys, setKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!data) {
        setError('No data provided');
        setLoading(false);
        return;
      }

      // Parse CSV data
      const lines = data.trim().split('\n');
      const headers = lines[0].split(',');
      
      const parsedRows = lines.slice(1).map(line => {
        const values = line.split(',');
        const row: ParsedData = {};
        
        headers.forEach((header, index) => {
          const value = values[index]?.trim();
          // Try to convert to number if possible
          row[header] = isNaN(Number(value)) ? value : Number(value);
        });
        
        return row;
      });

      setParsedData(parsedRows);
      setKeys(headers.slice(1)); // First column is usually labels
      setLoading(false);
    } catch (err) {
      console.error('Error parsing chart data:', err);
      setError('Failed to parse chart data');
      setLoading(false);
    }
  }, [data]);

  const renderChart = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-full">Loading chart...</div>;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (parsedData.length === 0) {
      return <div>No data available</div>;
    }

    const labelKey = keys.length > 0 ? Object.keys(parsedData[0])[0] : '';

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={parsedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={labelKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.map((key, index) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={COLORS[index % COLORS.length]} 
                  activeDot={{ r: 8 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={parsedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={labelKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        // For pie charts, we need to transform the data
        // We'll use the first row if there's only one data series
        const pieData = keys.length === 1 
          ? parsedData.map(item => ({
              name: item[labelKey],
              value: item[keys[0]]
            }))
          : keys.map((key, index) => ({
              name: key,
              value: parsedData[0][key]
            }));

        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={parsedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={labelKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.map((key, index) => (
                <Area 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke={COLORS[index % COLORS.length]}
                  fillOpacity={0.3}
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
    <div className="w-full h-full flex flex-col">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      <div className="flex-grow">
        {renderChart()}
      </div>
    </div>
  );
};

export default SimpleChartGenerator; 