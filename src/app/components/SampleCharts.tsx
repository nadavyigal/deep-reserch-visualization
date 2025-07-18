"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts';

export const MarketOverviewChart = () => {
  // Sample data for creator economy growth
  const chartData = [
    { year: '2021', value: 104.2 },
    { year: '2022', value: 143.7 },
    { year: '2023', value: 173.5 },
    { year: '2024', value: 204.8 },
    { year: '2025', value: 224.2 },
    { year: '2026', value: 335.6 },
    { year: '2027', value: 480.0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator Economy Market Size</CardTitle>
        <CardDescription>Global market size in billions USD (2021-2027)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            width={500}
            height={300}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}B`}
            />
            <Area
              dataKey="value"
              type="monotone"
              fill="#8884d8"
              fillOpacity={0.4}
              stroke="#8884d8"
              stackId="a"
            />
          </AreaChart>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Projected to reach $480B by 2027 <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              The creator economy is growing rapidly with platforms like YouTube, Instagram, and TikTok driving monetization
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export const PlatformDistributionChart = () => {
  // Sample data for platform distribution
  const chartData = [
    { name: 'YouTube', value: 38 },
    { name: 'Instagram', value: 25 },
    { name: 'TikTok', value: 20 },
    { name: 'Twitch', value: 10 },
    { name: 'Others', value: 7 },
  ];

  const COLORS = ['#FF4500', '#FF6A88', '#36D7B7', '#9B59B6', '#3498DB'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator Platform Distribution</CardTitle>
        <CardDescription>Market share by platform (%)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              YouTube leads with 38% market share
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Major platforms dominate the creator economy landscape, offering various monetization tools
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export const RevenueStreamsChart = () => {
  // Sample data for revenue streams
  const chartData = [
    { name: 'Ad Revenue', value: 42 },
    { name: 'Brand Partnerships', value: 28 },
    { name: 'Direct Support', value: 15 },
    { name: 'Merchandise', value: 10 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator Revenue Streams</CardTitle>
        <CardDescription>Percentage of income by source</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            width={500}
            height={300}
            layout="vertical"
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={120}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Ad revenue remains the primary income source
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Creators are increasingly diversifying their revenue streams for sustainability
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export const DemographicsChart = () => {
  // Sample data for creator demographics
  const chartData = [
    { name: 'Millennials', value: 45 },
    { name: 'Gen Z', value: 30 },
    { name: 'Gen X', value: 20 },
    { name: 'Baby Boomers', value: 5 },
  ];

  const COLORS = ['#3F51B5', '#00BCD4', '#FFC107', '#795548'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator Demographics</CardTitle>
        <CardDescription>Age distribution of content creators (%)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Millennials lead with 45% of creators
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Platform preferences vary by age group, with younger creators favoring TikTok
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}; 