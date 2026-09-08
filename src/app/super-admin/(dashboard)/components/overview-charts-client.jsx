"use client";

import { format } from "date-fns";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

function TrendAreaChart({ data, label, colorVar, gradientId }) {
  const config = { count: { label, color: `hsl(var(${colorVar}))` } };

  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <AreaChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          tickFormatter={(value) => format(new Date(value), "MMM d")}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={28}
          allowDecimals={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")}
            />
          }
        />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="count"
          type="monotone"
          fill={`url(#${gradientId})`}
          stroke="var(--color-count)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function AdmissionsTrendChart({ data, label }) {
  return (
    <TrendAreaChart
      data={data}
      label={label}
      colorVar="--chart-1"
      gradientId="fillAdmissionsTrend"
    />
  );
}

export function PageViewsTrendChart({ data, label }) {
  return (
    <TrendAreaChart
      data={data}
      label={label}
      colorVar="--chart-2"
      gradientId="fillPageViewsTrend"
    />
  );
}

export function HomeworkTrendChart({ data, label }) {
  return (
    <TrendAreaChart
      data={data}
      label={label}
      colorVar="--chart-3"
      gradientId="fillHomeworkTrend"
    />
  );
}

export function HomeworkByClassChart({ data, label }) {
  const config = { count: { label, color: "hsl(var(--chart-3))" } };

  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <BarChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={28}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

export function ContentStatusChart({ data, publishedLabel, draftLabel }) {
  const config = {
    published: { label: publishedLabel, color: "hsl(var(--chart-1))" },
    draft: { label: draftLabel, color: "hsl(var(--chart-4))" },
  };

  return (
    <ChartContainer config={config} className="aspect-auto h-[300px] w-full">
      <BarChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={28}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="published" fill="var(--color-published)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="draft" fill="var(--color-draft)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
