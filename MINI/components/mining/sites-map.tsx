"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, MapPin } from "lucide-react"

interface Site {
  id: number
  name: string
  code: string
  mineral: string
  region: string
  coordinates: string
  status: string
  capacity: number
  currentProduction: number
  workers: number
  equipmentCount: number
  startDate: string
  area: string
}

interface SitesMapProps {
  sites: Site[]
}

// Parse coordinates string like "22.7306° N, 12.4713° W" to [lat, lng]
function parseCoordinates(coordString: string): [number, number] | null {
  try {
    const match = coordString.match(/(\d+\.?\d*)°\s*([NS]),\s*(\d+\.?\d*)°\s*([EW])/)
    if (!match) return null
    
    let lat = parseFloat(match[1])
    let lng = parseFloat(match[3])
    
    if (match[2] === 'S') lat = -lat
    if (match[4] === 'W') lng = -lng
    
    return [lat, lng]
  } catch {
    return null
  }
}

const miningIcon = new Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23f59e0b' stroke='%23fff' stroke-width='2'%3E%3Cpath d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z'/%3E%3C/svg%3E",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})

export function SitesMap({ sites }: SitesMapProps) {
  // Center on Mauritania
  const defaultCenter: [number, number] = [20.2, -10.5]
  
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
          <MapContainer
            center={defaultCenter}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {sites.map((site) => {
              const position = parseCoordinates(site.coordinates)
              if (!position) return null
              
              return (
                <Marker key={site.id} position={position} icon={miningIcon}>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                          <Mountain className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{site.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{site.code}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p><span className="text-muted-foreground">Minerai:</span> {site.mineral}</p>
                        <p><span className="text-muted-foreground">Région:</span> {site.region}</p>
                        <p><span className="text-muted-foreground">Production:</span> {site.currentProduction.toLocaleString()} t/j</p>
                        <p><span className="text-muted-foreground">Employés:</span> {site.workers.toLocaleString()}</p>
                        <div className="pt-1">
                          <Badge 
                            variant={site.status === "active" ? "default" : "secondary"}
                            className={site.status === "active" ? "bg-success text-success-foreground" : ""}
                          >
                            {site.status === "active" ? "Actif" : "Maintenance"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 p-3 rounded-lg shadow-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Légende</p>
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#fff" strokeWidth="2">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                </svg>
              </div>
              <span className="text-xs">Site minier</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{sites.length} sites en Mauritanie</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
