'use client'

import React from 'react'
import AppLayout from '../components/AppLayout'
import EnhancedChartVisualization from '../components/EnhancedChartVisualization'
import EnhancedFlowchartVisualization from '../components/EnhancedFlowchartVisualization'
import EnhancedAnimationVisualization from '../components/EnhancedAnimationVisualization'

export const metadata = {
  title: 'Enhanced Visualizations | Deep Research Visualization',
  description: 'Demonstration of enhanced visualization components',
}

const chartData = [
  { name: 'A', value: 30 },
  { name: 'B', value: 80 },
  { name: 'C', value: 45 },
  { name: 'D', value: 60 },
]

const flowchartDef = `graph TD
  A[Start] --> B{Decision}
  B -- Yes --> C[End]
  B -- No --> D[Retry]`

export default function EnhancedDemoPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <h1 className="text-2xl font-bold">Enhanced Visualization Demo</h1>
        <EnhancedChartVisualization
          data={chartData}
          type="bar"
          title="Sample Chart"
        />
        <EnhancedFlowchartVisualization
          definition={flowchartDef}
          title="Sample Flowchart"
        />
        <EnhancedAnimationVisualization
          title="Sample Animation"
        />
      </div>
    </AppLayout>
  )
}
