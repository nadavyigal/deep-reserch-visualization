"use client"

import * as React from "react"
import { createContext, useContext } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

const ChartContext = createContext<ChartConfig | null>(null)

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <ChartContext.Provider value={config}>
      <div
        className={className}
        style={{
          "--color-chart-1": "hsl(var(--primary))",
          "--color-chart-2": "hsl(var(--muted))",
          "--color-chart-3": "hsl(var(--accent))",
          "--color-chart-4": "hsl(var(--secondary))",
          "--color-chart-5": "hsl(var(--destructive))",
          ...Object.entries(config).reduce(
            (acc, [key, { color }]) => ({
              ...acc,
              [`--color-${key}`]: color,
            }),
            {}
          ),
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
}

export function useChartConfig() {
  const context = useContext(ChartContext)

  if (!context) {
    throw new Error("useChartConfig must be used within a ChartContainer")
  }

  return context
}

interface ChartTooltipProps {
  indicator?: "dot" | "line"
  cursor?: boolean
  content?: React.ReactNode
  children?: React.ReactNode
}

export function ChartTooltip({
  indicator = "line",
  children,
  ...props
}: ChartTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  )
}

interface ChartTooltipContentProps {
  indicator?: "dot" | "line"
  className?: string
  payload?: Array<{
    dataKey: string | number
    value: any
    [key: string]: any
  }>
}

export function ChartTooltipContent({
  indicator = "line",
  className,
  payload = [],
  ...props
}: ChartTooltipContentProps) {
  const config = useChartConfig()

  return (
    <TooltipContent
      className={className}
      {...props}
    >
      {payload?.map((item, index) => {
        const dataKey = item.dataKey as string
        const configItem = config[dataKey]

        if (!configItem) {
          return null
        }

        return (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: configItem.color }}
            />
            <div className="flex gap-1">
              <span className="font-medium">{configItem.label}:</span>
              <span>{item.value}</span>
            </div>
          </div>
        )
      })}
    </TooltipContent>
  )
} 