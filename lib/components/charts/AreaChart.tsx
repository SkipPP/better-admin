"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/lib/components/ui/chart";

const chartData = [
  { month: "Janvier", users: 12 },
  { month: "Février", users: 31 },
  { month: "Mars", users: 48 },
];

const chartConfig = {
  users: {
    label: "Membres",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AreaChart() {
  return (
    <Card className="border-dashed shadow-none">
      <CardHeader>
        <CardTitle>Nombre de membres</CardTitle>

        <CardDescription>Nombre de membres pour les 6 derniers mois</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[150px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

            <Line
              dataKey="users"
              type="natural"
              stroke="var(--color-users)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              En hausse de 5.2% ce mois-ci <TrendingUp className="h-4 w-4" />
            </div>

            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Janvier - March 2025
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
