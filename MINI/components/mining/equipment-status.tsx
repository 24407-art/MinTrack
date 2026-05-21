"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Truck, Wrench, AlertTriangle, CheckCircle2 } from "lucide-react"

interface Equipment {
  id: string | number
  name: string
  type: string
  status: string
  efficiencyRate?: number
  fuel?: number
  site?: string
}

interface EquipmentStatusProps {
  equipment?: Equipment[]
}

const defaultEquipment = [
  {
    id: "T-042",
    name: "Camion Benne CAT 797F",
    site: "Zouérate",
    status: "active",
    fuel: 78,
    nextMaintenance: "3 jours",
  },
  {
    id: "E-015",
    name: "Excavatrice Komatsu PC8000",
    site: "Zouérate",
    status: "maintenance",
    fuel: 45,
    nextMaintenance: "En cours",
  },
]

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle2; color: string }> = {
  active: {
    label: "Opérationnel",
    variant: "default",
    icon: CheckCircle2,
    color: "text-success",
  },
  operational: {
    label: "Opérationnel",
    variant: "default",
    icon: CheckCircle2,
    color: "text-success",
  },
  maintenance: {
    label: "En maintenance",
    variant: "secondary",
    icon: Wrench,
    color: "text-warning",
  },
  alert: {
    label: "Alerte",
    variant: "destructive",
    icon: AlertTriangle,
    color: "text-destructive",
  },
  inactive: {
    label: "Inactif",
    variant: "outline",
    icon: AlertTriangle,
    color: "text-muted-foreground",
  },
}

export function EquipmentStatus({ equipment = [] }: EquipmentStatusProps) {
  const displayEquipment = equipment.length > 0 ? equipment.map(eq => ({
    id: eq.id,
    name: eq.name,
    site: eq.site || 'Zouérate',
    status: eq.status,
    fuel: eq.fuel || Math.floor(Math.random() * 40) + 50,
    nextMaintenance: 'N/A',
    type: eq.type
  })) : defaultEquipment
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-foreground">
          État des Équipements
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {displayEquipment.filter((e: any) => e.status === "operational" || e.status === "active").length}/{displayEquipment.length} actifs
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayEquipment.map((item: any, index: number) => {
          const config = statusConfig[item.status as keyof typeof statusConfig]
          const StatusIcon = config.icon
          
          return (
            <div
              key={item.id || index}
              className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm">{item.name}</span>
                  <Badge variant="outline" className="text-xs font-mono">
                    {item.id}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">{item.site}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    Maintenance: {item.nextMaintenance}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">Carburant:</span>
                  <Progress value={item.fuel} className="h-1.5 flex-1 max-w-24" />
                  <span className="text-xs text-muted-foreground">{item.fuel}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${config.color}`} />
                <Badge variant={config.variant} className="text-xs">
                  {config.label}
                </Badge>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
