"use client";

import React from "react";
import { PieChart, Pie, Label } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// -------------------- CONFIG ----------------------

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

// -------------------- UTILS ----------------------

const getChartData = (
  mediaKey: string,
  stats: Record<number | string, number>
) => {
  return [1, 2, 3, 4].map((status, index) => ({
    label: statusLabels[mediaKey][status],
    value: stats[status] ?? 0,
    fill: statusColors[index],
  }));
};

// -------------------- DONUT CHART PER MEDIA ----------------------

const MediaDonutChart = ({
  mediaKey,
  stats,
}: {
  mediaKey: string;
  stats: Record<number | string, number>;
}) => {
  console.log("here ", mediaKey, stats);
  const chartData = getChartData(mediaKey, stats);
  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="flex flex-col bg-none border-none shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="capitalize">{mediaKey}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square h-[300px] w-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-base"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MediaDonutChart;
