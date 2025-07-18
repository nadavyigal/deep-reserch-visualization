"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  PieChart,
  Sector,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedChartVisualizationProps {
  data: any[];
  type: 'line' | 'bar' | 'area' | 'pie' | 'radialBar';
  title: string;
  description?: string;
  height?: number;
  dataKeys?: string[];
  xAxisKey?: string;
  className?: string;
}

const COLOR_PALETTE = {
  light: [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
    '#14b8a6', // teal-500
  ],
  dark: [
    '#60a5fa', // blue-400
    '#34d399', // emerald-400
    '#fbbf24', // amber-400
    '#f87171', // red-400
    '#a78bfa', // violet-400
    '#f472b6', // pink-400
    '#22d3ee', // cyan-400
    '#fb923c', // orange-400
    '#818cf8', // indigo-400
    '#2dd4bf', // teal-400
  ]
};

const EnhancedChartVisualization: React.FC<EnhancedChartVisualizationProps> = ({
  data,
  type,
  title,
  description,
  height = 350,
  dataKeys = ['value'],
  xAxisKey = 'name',
  className = '',
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const COLORS = theme === 'dark' ? COLOR_PALETTE.dark : COLOR_PALETTE.light;

  useEffect(() => {
    setIsVisible(true);
    
    // Check if data has changed since last render
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (chartRef.current) {
      observer.observe(chartRef.current);
    }
    
    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, [data]);
  
  // Enhanced tooltip component with animation
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center mt-1">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {entry.name}: 
              </span>
              <span className="ml-1 font-medium text-gray-900 dark:text-gray-100 text-sm">
                {typeof entry.value === 'number' 
                  ? entry.value.toLocaleString() 
                  : entry.value}
              </span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };
  
  // Custom active shape for pie chart
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">
          {`Value: ${value.toLocaleString()}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const renderChart = () => {
    // Common chart style for consistent design across all chart types
    const commonChartStyle = {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '12px',
    };
    
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} style={commonChartStyle} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <defs>
                {dataKeys.map((key, index) => (
                  <linearGradient key={`gradient-${key}`} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
                tickLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
                axisLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
              />
              <YAxis 
                tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
                tickLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
                axisLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line
                  key={`line-${key}`}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  dot={{ stroke: COLORS[index % COLORS.length], strokeWidth: 2, r: 4, fill: theme === 'dark' ? '#1f2937' : '#ffffff' }}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} style={commonChartStyle} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <defs>
                {dataKeys.map((key, index) => (
                  <linearGradient key={`gradient-${key}`} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
                tickLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
                axisLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
              />
              <YAxis 
                tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
                tickLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
                axisLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {dataKeys.map((key, index) => (
                <Bar
                  key={`bar-${key}`}
                  dataKey={key}
                  fill={`url(#color-${key})`}
                  radius={[4, 4, 0, 0]}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} style={commonChartStyle} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <defs>
                {dataKeys.map((key, index) => (
                  <linearGradient key={`gradient-${key}`} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
                tickLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
                axisLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
              />
              <YAxis 
                tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }}
                tickLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
                axisLine={{ stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {dataKeys.map((key, index) => (
                <Area
                  key={`area-${key}`}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  fillOpacity={1}
                  fill={`url(#color-${key})`}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart style={commonChartStyle}>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKeys[0]}
                nameKey={xAxisKey}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                animationDuration={1500}
                animationEasing="ease-in-out"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'radialBar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="10%" 
              outerRadius="80%" 
              barSize={20} 
              data={data}
              style={commonChartStyle}
            >
              <RadialBar
                background
                dataKey={dataKeys[0]}
                angleAxisId={0}
                data={data}
                label={{
                  position: "insideStart",
                  fill: "#fff"
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </RadialBar>
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  paddingLeft: '20px',
                }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">
              Unsupported chart type: {type}
            </p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={chartRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className={`enhanced-chart-visualization ${className}`}
        >
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  {description}
                </CardDescription>
              )}
            </CardHeader>
            
            <CardContent className="p-4">
              {renderChart()}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedChartVisualization; 