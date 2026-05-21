"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Sun, Moon, Sunrise } from "lucide-react"

interface Shift {
  id: string | number
  name: string
  startTime: string
  endTime: string
  status: string
  workers: number
}

interface PersonnelScheduleProps {
  shifts?: Shift[]
}

const defaultShifts = [
  {
    id: 1,
    name: "Équipe Alpha",
    shift: "Matin",
    time: "06:00 - 14:00",
    icon: Sunrise,
    workers: 45,
    supervisor: "Amadou Ba",
    site: "Zouérate",
    status: "active",
  },
  {
    id: 2,
    name: "Équipe Beta",
    shift: "Après-midi",
    time: "14:00 - 22:00",
    icon: Sun,
    workers: 42,
    supervisor: "Fatima Mint",
    site: "Zouérate",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Équipe Gamma",
    shift: "Nuit",
    time: "22:00 - 06:00",
    icon: Moon,
    workers: 38,
    supervisor: "Ibrahim Ould",
    site: "Zouérate",
    status: "upcoming",
  },
]

const recentActivity = [
  { name: "Oumar Diop", action: "Pointage entrée", time: "06:02", site: "Zouérate" },
  { name: "Khadija Ba", action: "Pointage entrée", time: "06:05", site: "Zouérate" },
  { name: "Moussa Kane", action: "Congé validé", time: "05:45", site: "Akjoujt" },
  { name: "Aissata Sy", action: "Pointage entrée", time: "06:08", site: "Zouérate" },
]

export function PersonnelSchedule({ shifts = [] }: PersonnelScheduleProps) {
  const displayShifts = shifts.length > 0 ? shifts.map(s => ({
    id: s.id,
    name: s.name,
    shift: s.name.includes('Matin') ? 'Matin' : s.name.includes('Nuit') ? 'Nuit' : 'Après-midi',
    time: `${s.startTime} - ${s.endTime}`,
    icon: s.name.includes('Matin') ? Sunrise : s.name.includes('Nuit') ? Moon : Sun,
    workers: s.workers,
    supervisor: 'Superviseur',
    site: 'Zouérate',
    status: s.status
  })) : defaultShifts
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-foreground">
          Planning du Personnel
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          Aujourd&apos;hui
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shifts */}
        <div className="space-y-3">
          {displayShifts.map((shift: any) => {
            const ShiftIcon = shift.icon
            return (
              <div
                key={shift.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  shift.status === "active"
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-secondary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${
                    shift.status === "active" ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <ShiftIcon className={`h-4 w-4 ${
                      shift.status === "active" ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">{shift.name}</span>
                      {shift.status === "active" && (
                        <Badge className="text-xs bg-primary text-primary-foreground">En cours</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{shift.time}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{shift.supervisor}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-foreground">{shift.workers}</span>
                  <p className="text-xs text-muted-foreground">ouvriers</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="border-t border-border pt-4">
          <p className="mb-3 text-sm font-medium text-foreground">Activité Récente</p>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-secondary text-xs text-foreground">
                    {activity.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-foreground">{activity.name}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
