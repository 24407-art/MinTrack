"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface ProductionData {
  date: string
  tonnes: number
}

interface ProductionChartProps {
  data?: ProductionData[]
}

const defaultData = [
  { date: "Lun", tonnes: 4200 },
  { date: "Mar", tonnes: 4500 },
  { date: "Mer", tonnes: 4100 },
  { date: "Jeu", tonnes: 4800 },
  { date: "Ven", tonnes: 4600 },
  { date: "Sam", tonnes: 3800 },
  { date: "Dim", tonnes: 2200 },
]

export function ProductionChart({ data = defaultData }: ProductionChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-foreground">
          Production Hebdomadaire
        </CardTitle>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">Tonnes</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.15 165)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.65 0.15 165)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCuivre" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.60 0.18 280)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.60 0.18 280)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 250)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="oklch(0.60 0 0)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="oklch(0.60 0 0)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0.01 250)",
                  border: "1px solid oklch(0.28 0.01 250)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0 0)",
                }}
                labelStyle={{ color: "oklch(0.95 0 0)" }}
              />
              <Area
                type="monotone"
                dataKey="tonnes"
                stroke="oklch(0.72 0.18 55)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFer)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
