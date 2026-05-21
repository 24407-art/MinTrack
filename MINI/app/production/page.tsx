"use client"

import { useState, useEffect, useMemo } from "react"
import { MiningSidebar } from "@/components/mining/sidebar"
import { MiningHeader } from "@/components/mining/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Target,
  Mountain,
  Factory,
  Clock,
} from "lucide-react"

interface Production {
  id: number
  siteId: number
  siteName: string
  siteCode: string
  siteMineral: string
  date: string
  target: number
  actual: number
  unit: string
  notes: string
  createdAt: string
  updatedAt: string
}

const shifts = [
  { shift: "Matin (6h-14h)", production: 1850, workers: 145 },
  { shift: "Après-midi (14h-22h)", production: 1720, workers: 138 },
  { shift: "Nuit (22h-6h)", production: 1230, workers: 112 },
]

// Couleurs pour les minerais
const mineralColors: Record<string, string> = {
  "Fer": "oklch(0.72 0.18 55)",
  "Or": "oklch(0.65 0.15 165)",
  "Cuivre": "oklch(0.60 0.18 280)",
  "Phosphate": "oklch(0.55 0.15 195)",
  "Autre": "oklch(0.50 0.10 250)"
}

export default function ProductionPage() {
  const [period, setPeriod] = useState("month")
  const [selectedSite, setSelectedSite] = useState("all")
  const [production, setProduction] = useState<Production[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduction()
  }, [])

  const fetchProduction = async () => {
    try {
      const response = await fetch('/api/production')
      const data = await response.json()
      setProduction(data)
    } catch (error) {
      console.error('Error fetching production:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les données selon le site et la période sélectionnés
  const filteredProduction = production.filter((item) => {
    // Filtre par site
    if (selectedSite !== "all") {
      const siteName = (item.siteName || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const siteCode = (item.siteCode || "").toLowerCase()
      const filterValue = selectedSite.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      
      // Vérifier si le nom ou le code contient la valeur filtrée
      const nameMatch = siteName.includes(filterValue) || filterValue.includes(siteName)
      const codeMatch = siteCode.includes(filterValue) || filterValue.includes(siteCode)
      
      if (!nameMatch && !codeMatch) {
        return false
      }
    }
    
    // Filtre par période
    if (period !== "all") {
      const itemDate = new Date(item.date)
      const today = new Date()
      
      switch (period) {
        case "day": {
          // Aujourd'hui
          return itemDate.toDateString() === today.toDateString()
        }
        case "week": {
          // Cette semaine
          const weekAgo = new Date(today)
          weekAgo.setDate(today.getDate() - 7)
          return itemDate >= weekAgo
        }
        case "month": {
          // Ce mois
          return itemDate.getMonth() === today.getMonth() && 
                 itemDate.getFullYear() === today.getFullYear()
        }
        case "quarter": {
          // Ce trimestre (3 mois)
          const quarterAgo = new Date(today)
          quarterAgo.setMonth(today.getMonth() - 3)
          return itemDate >= quarterAgo
        }
      }
    }
    
    return true
  })

  // Préparer les données pour le graphique d'évolution journalière
  const dailyProductionData = useMemo(() => {
    if (!production.length) return []
    
    // Grouper les productions par date
    const groupedByDate = production.reduce((acc: Record<string, { date: string; total: number; count: number }>, item: Production) => {
      const date = new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
      if (!acc[date]) {
        acc[date] = { date, total: 0, count: 0 }
      }
      acc[date].total += item.actual
      acc[date].count += 1
      return acc
    }, {})
    
    // Convertir en tableau et trier par date
    return Object.values(groupedByDate)
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/')
        const [dayB, monthB] = b.date.split('/')
        return parseInt(monthA) * 100 + parseInt(dayA) - (parseInt(monthB) * 100 + parseInt(dayB))
      })
      .slice(-30) // Derniers 30 jours
      .map((item: { date: string; total: number }) => ({
        date: item.date,
        production: item.total
      }))
  }, [production])

  // Préparer les données pour le graphique Production par Site
  const siteProductionData = useMemo(() => {
    if (!production.length) return []
    
    // Grouper par site et calculer la production moyenne
    const groupedBySite = production.reduce((acc: Record<string, { site: string; production: number; target: number; count: number }>, item: Production) => {
      const siteName = item.siteName || item.siteCode || 'Unknown'
      if (!acc[siteName]) {
        acc[siteName] = { site: siteName, production: 0, target: 0, count: 0 }
      }
      acc[siteName].production += item.actual
      acc[siteName].target += item.target
      acc[siteName].count += 1
      return acc
    }, {})
    
    // Calculer la moyenne et le rendement
    return Object.values(groupedBySite).map((item) => ({
      site: item.site,
      production: Math.round(item.production / item.count),
      target: Math.round(item.target / item.count),
      efficiency: item.target > 0 ? Math.round((item.production / item.target) * 100) : 0
    }))
  }, [production])

  // Préparer les données pour la répartition par minerai
  const mineralDistributionData = useMemo(() => {
    if (!production.length) return []
    
    // Extraire le type de minerai depuis siteMineral
    const getMineralFromSite = (siteMineral: string): string => {
      if (!siteMineral) return 'Autre'
      const mineral = siteMineral.toLowerCase()
      if (mineral.includes('fer')) return 'Fer'
      if (mineral.includes('or')) return 'Or'
      if (mineral.includes('cuivre')) return 'Cuivre'
      if (mineral.includes('phosphate')) return 'Phosphate'
      return 'Autre'
    }
    
    // Grouper par type de minerai
    const groupedByMineral = production.reduce((acc: Record<string, { name: string; value: number; count: number }>, item: Production) => {
      const mineralKey = item.siteMineral || 'Unknown'
      const mineral = getMineralFromSite(mineralKey)
      if (!acc[mineral]) {
        acc[mineral] = { name: mineral, value: 0, count: 0 }
      }
      acc[mineral].value += item.actual
      acc[mineral].count += 1
      return acc
    }, {})
    
    console.log('Grouped by mineral:', groupedByMineral)
    
    // Convertir en format pour le graphique
    const result = Object.values(groupedByMineral).map((item) => ({
      name: item.name,
      value: Math.round(item.value / item.count),
      color: mineralColors[item.name] || mineralColors['Autre']
    }))
    
    console.log('Mineral distribution:', result)
    return result
  }, [production])

  return (
    <div className="min-h-screen bg-background">
      <MiningSidebar />
      
      <main className="pl-64">
        <MiningHeader 
          title="Production" 
          subtitle="Suivi en temps réel des extractions" 
        />
        
        <div className="p-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les sites</SelectItem>
                  <SelectItem value="zouerate">Zouérate</SelectItem>
                  <SelectItem value="akjoujt">Akjoujt</SelectItem>
                  <SelectItem value="tasiast">Tasiast</SelectItem>
                </SelectContent>
              </Select>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Aujourd&apos;hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>

          

          {/* Charts */}
          <Tabs defaultValue="evolution" className="space-y-4">
            <TabsList>
              <TabsTrigger value="shifts">liste de Production</TabsTrigger>
              <TabsTrigger value="evolution">Évolution</TabsTrigger>
              <TabsTrigger value="sites">Par Site</TabsTrigger>
              <TabsTrigger value="minerals">Par Minerai</TabsTrigger>
            </TabsList>

            <TabsContent value="evolution">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">Production Journalière </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {dailyProductionData.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Aucune donnée de production disponible
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyProductionData}>
                          <defs>
                            <linearGradient id="productionGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 250)" vertical={false} />
                          <XAxis dataKey="date" stroke="oklch(0.60 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="oklch(0.60 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "oklch(0.17 0.01 250)",
                              border: "1px solid oklch(0.28 0.01 250)",
                              borderRadius: "8px",
                              color: "oklch(0.95 0 0)",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="production"
                            name="Production (t)"
                            stroke="oklch(0.72 0.18 55)"
                            strokeWidth={2}
                            fill="url(#productionGrad)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sites">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-base">Production par Site - Base de données</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      {siteProductionData.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          Aucune donnée disponible
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={siteProductionData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 250)" horizontal={false} />
                            <XAxis type="number" stroke="oklch(0.60 0 0)" fontSize={12} />
                            <YAxis dataKey="site" type="category" stroke="oklch(0.60 0 0)" fontSize={12} width={100} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "oklch(0.17 0.01 250)",
                                border: "1px solid oklch(0.28 0.01 250)",
                                borderRadius: "8px",
                                color: "oklch(0.95 0 0)",
                              }}
                            />
                            <Bar dataKey="production" name="Production" fill="oklch(0.72 0.18 55)" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="target" name="Objectif" fill="oklch(0.28 0.01 250)" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                
              </div>
            </TabsContent>

            <TabsContent value="minerals">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-base">Répartition par Minerai - Base de données</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      {mineralDistributionData.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          Aucune donnée disponible
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={mineralDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {mineralDistributionData.map((entry: { name: string; color: string }, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "oklch(0.17 0.01 250)",
                                border: "1px solid oklch(0.28 0.01 250)",
                                borderRadius: "8px",
                                color: "oklch(0.95 0 0)",
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-base">Production par Minerai</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mineralDistributionData.length === 0 ? (
                      <p className="text-muted-foreground">Aucune donnée disponible</p>
                    ) : (
                      mineralDistributionData.map((mineral: { name: string; value: number; color: string }) => (
                        <div key={mineral.name} className="flex items-center gap-4">
                          <div 
                            className="h-10 w-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${mineral.color}20` }}
                          >
                            <Mountain className="h-5 w-5" style={{ color: mineral.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground">{mineral.name}</span>
                              <span className="text-lg font-bold text-foreground">{mineral.value.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {mineral.name === "Fer" ? "tonnes/jour" : "kg/jour"}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="shifts">
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Données de Production </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {filteredProduction.length} / {production.length} entrées
                    </Badge>
                    <Button variant="outline" size="sm" onClick={fetchProduction}>
                      Rafraîchir
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    {loading ? (
                      <p className="text-center py-4 text-muted-foreground">Chargement...</p>
                    ) : filteredProduction.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">Aucune donnée de production</p>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Site</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Objectif</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Réel</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rendement</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProduction.map((item) => (
                            <tr key={item.id} className="border-b border-border last:border-0">
                              <td className="px-4 py-3 text-sm text-muted-foreground">
                                {new Date(item.date).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="px-4 py-3 text-sm text-foreground">
                                <div className="flex items-center gap-2">
                                  <Mountain className="h-4 w-4 text-primary" />
                                  <span>{item.siteName || item.siteCode}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-foreground">
                                {item.target.toLocaleString()} {item.unit}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-foreground">
                                {item.actual.toLocaleString()} {item.unit}
                              </td>
                              <td className="px-4 py-3">
                                <Badge 
                                  variant={item.actual >= item.target ? "default" : "secondary"}
                                  className={item.actual >= item.target ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}
                                >
                                  {Math.round((item.actual / item.target) * 100)}%
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                                {item.notes || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
