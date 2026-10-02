"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { Bucket } from "@/lib/freeserp"
import { formatNumber } from "@/lib/format"

// Single-series bar charts (one validated hue, no legend: the card title names the series).
// Marks follow the dataviz spec: <= 24px thick, 4px rounded data end, square at the baseline,
// values at the bar tip, per-bar tooltip, and a table for screen readers.

const config = { count: { label: "Startups", color: "var(--chart-bar)" } } satisfies ChartConfig

function share(count: number, total: number) {
  return total ? `${((count / total) * 100).toFixed(1)}%` : "0%"
}

function ChartTable({ title, data, total }: { title: string; data: Bucket[]; total: number }) {
  return (
    <table className="sr-only">
      <caption>{title}</caption>
      <thead>
        <tr>
          <th scope="col">Group</th>
          <th scope="col">Startups</th>
          <th scope="col">Share</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.label}>
            <th scope="row">{d.label}</th>
            <td>{formatNumber(d.count)}</td>
            <td>{share(d.count, total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Tooltip({ total }: { total: number }) {
  return (
    <ChartTooltip
      cursor={false}
      content={
        <ChartTooltipContent
          hideIndicator
          formatter={(value) => (
            <span className="tabular-nums">
              {formatNumber(Number(value))} startups ({share(Number(value), total)})
            </span>
          )}
        />
      }
    />
  )
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

/** Ordered buckets (Domain Rating bands) as columns. */
export function ColumnChartCard({
  title,
  description,
  data,
  total,
}: {
  title: string
  description: string
  data: Bucket[]
  total: number
}) {
  return (
    <ChartCard title={title} description={description}>
      <ChartContainer config={config} className="aspect-auto h-56 w-full" aria-hidden="true">
        <BarChart
          accessibilityLayer={false}
          data={data}
          margin={{ top: 22, right: 4, left: 4, bottom: 0 }}
        >
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval={0} />
          <Tooltip total={total} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} maxBarSize={24}>
            <LabelList
              dataKey="count"
              position="top"
              offset={6}
              className="fill-foreground"
              fontSize={12}
              formatter={(v) => formatNumber(Number(v))}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartTable title={title} data={data} total={total} />
    </ChartCard>
  )
}

/** Ranked categories (domain zones, builders) as horizontal bars, largest first. */
export function RankedBarChartCard({
  title,
  description,
  data,
  total,
}: {
  title: string
  description: string
  data: Bucket[]
  total: number
}) {
  return (
    <ChartCard title={title} description={description}>
      <ChartContainer
        config={config}
        className="aspect-auto w-full"
        style={{ height: data.length * 34 + 8 }}
        aria-hidden="true"
      >
        <BarChart
          accessibilityLayer={false}
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
          barCategoryGap={8}
        >
          <YAxis
            dataKey="label"
            type="category"
            tickLine={false}
            axisLine={false}
            width={112}
            interval={0}
          />
          <XAxis type="number" dataKey="count" hide />
          <Tooltip total={total} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} maxBarSize={20}>
            <LabelList
              dataKey="count"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
              formatter={(v) => formatNumber(Number(v))}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartTable title={title} data={data} total={total} />
    </ChartCard>
  )
}
