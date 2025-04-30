"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

const statusLabels: Record<string, Record<number, string>> = {
  books: {
    1: "Read",
    2: "Reading",
    3: "Want to Read",
    4: "Dropped",
  },
  movies: {
    1: "Watched",
    2: "Watching",
    3: "Watchlist",
    4: "Dropped",
  },
  games: {
    1: "Played",
    2: "Playing",
    3: "Wishlist",
    4: "Dropped",
  },
  "TV Shows": {
    1: "Watched",
    2: "Watching",
    3: "Plan to Watch",
    4: "Dropped",
  },
};

const statusColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const getChartData = (
  mediaKey: string,
  stats: Record<number | string, number>
) => {
  return [1, 2, 3, 4].map((status, index) => ({
    name: statusLabels[mediaKey][status],
    value: stats[status] ?? 0,
    color: statusColors[index],
  }));
};

export type ChartDataItem = {
  name: string;
  value: number;
  color: string;
};

interface MediaChartProps {
  stats: Record<number | string, number>;
  total: number;
  icon: React.ReactNode;
  title: string;
  colorful?: boolean;
}

// Vibrant color palettes for different media types
export const BOOK_COLORS = ["#FF6B6B", "#FF9E7D", "#FFD166"];
export const MOVIE_COLORS = ["#4ECDC4", "#1A535C", "#7BE0AD"];
export const GAME_COLORS = ["#9B5DE5", "#F15BB5", "#00BBF9"];
export const TV_COLORS = ["#3A86FF", "#8338EC", "#FF006E"];

const MediaChart = ({
  stats,
  total,
  icon,
  title,
  colorful = true,
}: MediaChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = getChartData(title, stats);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Custom active shape for the pie chart
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 4}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke={fill}
          strokeWidth={2}
        />
      </g>
    );
  };

  return (
    <Card className="p-3 bg-muted/50 hover:shadow-md transition-all duration-300">
      <CardHeader className="p-2 pb-0">
        <div className="flex items-center justify-center gap-2">
          {icon}
          <span className="font-medium capitalize">{title}</span>
        </div>
      </CardHeader>
      <CardContent className="p-2 flex flex-col items-center">
        <div className="relative w-full h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-xl font-semibold">{total}</span>
              <span className="sr-only">Total {title}</span>
            </div>
          </div>
        </div>

        <div className="w-full mt-2 space-y-1 text-xs">
          {data.map((item, index) => (
            <TooltipProvider key={index} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex justify-between items-center p-1 rounded cursor-pointer transition-colors duration-200 ${
                      activeIndex === index ? "bg-muted" : "hover:bg-muted/70"
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <span className="flex items-center gap-1">
                      <span
                        className="block w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      {item.name}
                    </span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="text-xs">
                    <p>
                      {item.name}: {item.value}
                    </p>
                    <p>{Math.round((item.value / total) * 100)}% of total</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaChart;
