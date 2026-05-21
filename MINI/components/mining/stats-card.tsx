import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  unit?: string
  change?: number
  changeLabel?: string
  icon: LucideIcon
  iconColor?: string
  trend?: "up" | "down" | "neutral"
}

export function StatsCard({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon: Icon,
  iconColor = "text-primary",
  trend = "neutral",
}: StatsCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {change !== undefined && (
              <div className="flex items-center gap-1.5">
                <TrendIcon
                  className={cn(
                    "h-4 w-4",
                    trend === "up" && "text-success",
                    trend === "down" && "text-destructive",
                    trend === "neutral" && "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend === "up" && "text-success",
                    trend === "down" && "text-destructive",
                    trend === "neutral" && "text-muted-foreground"
                  )}
                >
                  {change > 0 ? "+" : ""}{change}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className={cn("rounded-lg bg-secondary p-3", iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
