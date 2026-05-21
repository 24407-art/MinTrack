"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, MapPin, User, ChevronRight } from "lucide-react"

interface Incident {
  id: string | number
  title: string
  severity: 'high' | 'medium' | 'low'
  status: string
  siteName: string
  date: string
  content?: string
  reporter?: string
}

interface AlertItem {
  id: string | number
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
  site: string
  reporter: string
  time: string
}

interface SafetyAlertsProps {
  incidents?: Incident[]
}

const severityConfig = {
  high: { label: "Élevée", variant: "destructive" as const, bgColor: "bg-destructive/10 border-destructive/30" },
  medium: { label: "Moyenne", variant: "secondary" as const, bgColor: "bg-warning/10 border-warning/30" },
  low: { label: "Faible", variant: "outline" as const, bgColor: "bg-accent/10 border-accent/30" },
}

const defaultAlerts: AlertItem[] = [
  {
    id: 1,
    severity: "high",
    title: "Éboulement zone B3",
    description: "Éboulement mineur détecté dans la zone d'extraction B3. Évacuation préventive en cours.",
    site: "Akjoujt",
    reporter: "Ahmed Diallo",
    time: "Il y a 15 min",
  },
  {
    id: 2,
    severity: "medium",
    title: "Température excessive",
    description: "Température ambiante dépassant 45°C. Rotation des équipes recommandée.",
    site: "Zouérate",
    reporter: "Système automatique",
    time: "Il y a 1h",
  },
]

export function SafetyAlerts({ incidents = [] }: SafetyAlertsProps) {
  // Transformer les incidents du backend au format attendu
  const alerts: AlertItem[] = incidents.length > 0 ? incidents.map((incident, index) => ({
    id: incident.id || index,
    severity: incident.severity || 'medium',
    title: incident.title,
    description: incident.content || incident.title,
    site: incident.siteName || 'Unknown',
    reporter: incident.reporter || 'System',
    time: incident.date ? new Date(incident.date).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
  })) : defaultAlerts

  return (
    <Card className="border-border bg-card h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Alertes Sécurité
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {alerts.length} alertes
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity]
          return (
            <div key={alert.id} className={`rounded-lg border p-3 ${config.bgColor}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-foreground">{alert.title}</span>
                <Badge variant={config.variant} className="text-xs">
                  {config.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {alert.site}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {alert.reporter}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {alert.time}
                </span>
              </div>
            </div>
          )
        })}
        <Button variant="ghost" className="w-full text-xs" size="sm">
          Voir tout
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  )
}
