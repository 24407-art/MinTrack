"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Factory, Users, TrendingUp } from "lucide-react"

const sites = [
  {
    id: 1,
    name: "Zouérate",
    mineral: "Fer",
    coordinates: "22.7306° N, 12.4713° W",
    status: "active",
    production: 4800,
    workers: 1250,
    efficiency: 94,
  },
  {
    id: 2,
    name: "Akjoujt",
    mineral: "Or / Cuivre",
    coordinates: "19.7500° N, 14.3833° W",
    status: "active",
    production: 85,
    workers: 680,
    efficiency: 87,
  },
  {
    id: 3,
    name: "Tasiast",
    mineral: "Or",
    coordinates: "20.3333° N, 16.0833° W",
    status: "active",
    production: 92,
    workers: 890,
    efficiency: 91,
  },
  {
    id: 4,
    name: "Nouadhibou",
    mineral: "Cuivre",
    coordinates: "20.9333° N, 17.0333° W",
    status: "maintenance",
    production: 0,
    workers: 145,
    efficiency: 0,
  },
]

export function SiteMap() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-foreground">
          Sites Miniers - Mauritanie
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {sites.filter(s => s.status === "active").length} actifs
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder */}
        <div className="relative mb-4 h-48 overflow-hidden rounded-lg border border-border bg-secondary">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-primary opacity-50" />
              <p className="mt-2 text-sm text-muted-foreground">Carte Interactive</p>
              <p className="text-xs text-muted-foreground">Mauritanie - 4 sites miniers</p>
            </div>
          </div>
          {/* Site Markers */}
          <div className="absolute left-[30%] top-[25%]">
            <div className="relative">
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-foreground">
                Zouérate
              </span>
            </div>
          </div>
          <div className="absolute left-[40%] top-[45%]">
            <div className="h-3 w-3 rounded-full bg-accent" />
          </div>
          <div className="absolute left-[25%] top-[40%]">
            <div className="h-3 w-3 rounded-full bg-accent" />
          </div>
          <div className="absolute left-[15%] top-[35%]">
            <div className="h-3 w-3 rounded-full bg-muted-foreground opacity-50" />
          </div>
        </div>

        {/* Sites List */}
        <div className="space-y-3">
          {sites.map((site) => (
            <div
              key={site.id}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${site.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-sm">{site.name}</span>
                    <Badge variant="outline" className="text-xs">{site.mineral}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{site.coordinates}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Factory className="h-3.5 w-3.5" />
                  <span>{site.production > 0 ? `${site.production} t/j` : "—"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{site.workers}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className={`h-3.5 w-3.5 ${site.efficiency > 0 ? "text-success" : "text-muted-foreground"}`} />
                  <span className={site.efficiency > 0 ? "text-success" : "text-muted-foreground"}>
                    {site.efficiency > 0 ? `${site.efficiency}%` : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
