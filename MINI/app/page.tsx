"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MiningSidebar } from "@/components/mining/sidebar"
import { MiningHeader } from "@/components/mining/header"
import { StatsCard } from "@/components/mining/stats-card"
import { ProductionChart } from "@/components/mining/production-chart"
import { EquipmentStatus } from "@/components/mining/equipment-status"
import { SafetyAlerts } from "@/components/mining/safety-alerts"
import { SiteMap } from "@/components/mining/site-map"
import { PersonnelSchedule } from "@/components/mining/personnel-schedule"
import {
  Mountain,
  Truck,
  Users,
  AlertTriangle,
  TrendingUp,
  Factory,
} from "lucide-react"

interface DashboardStats {
  production: { daily: number; change: number }
  equipment: { active: number; total: number; change: number }
  personnel: { total: number; change: number }
  incidents: { open: number; change: number }
  sites: { active: number; total: number }
}

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    production: { daily: 0, change: 0 },
    equipment: { active: 0, total: 0, change: 0 },
    personnel: { total: 0, change: 0 },
    incidents: { open: 0, change: 0 },
    sites: { active: 0, total: 0 }
  })
  const [productionChart, setProductionChart] = useState([])
  const [recentIncidents, setRecentIncidents] = useState([])
  const [equipmentStatus, setEquipmentStatus] = useState([])
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/dashboard')
      if (response.status === 401) {
        router.push('/login')
        return
      }
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données')
      }
      const data = await response.json()
      setStats(data.stats || {
        production: { daily: 0, change: 0 },
        equipment: { active: 0, total: 0, change: 0 },
        personnel: { total: 0, change: 0 },
        incidents: { open: 0, change: 0 },
        sites: { active: 0, total: 0 }
      })
      setProductionChart(data.productionChart || [])
      setRecentIncidents(data.recentIncidents || [])
      setEquipmentStatus(data.equipmentStatus || [])
      setShifts(data.shifts || [])
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Impossible de charger les données du tableau de bord')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Réessayer</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MiningSidebar />
      
      <main className="pl-64">
        <MiningHeader 
          title="Tableau de Bord" 
          subtitle="Vue d'ensemble des opérations minières" 
        />
        
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <StatsCard
              title="Production Journalière"
              value={stats.production.daily.toLocaleString()}
              unit="tonnes"
              change={stats.production.change}
              changeLabel="vs hier"
              icon={Mountain}
              trend="up"
            />
            <StatsCard
              title="Équipements Actifs"
              value={String(stats.equipment.active)}
              unit={`/ ${stats.equipment.total}`}
              change={stats.equipment.change}
              changeLabel="en panne"
              icon={Truck}
              trend="down"
            />
            <StatsCard
              title="Personnel sur Site"
              value={stats.personnel.total.toLocaleString()}
              unit="ouvriers"
              change={stats.personnel.change}
              changeLabel="vs sem. dern."
              icon={Users}
              trend="up"
            />
            <StatsCard
              title="Incidents Ouverts"
              value={String(stats.incidents.open)}
              unit="alertes"
              change={stats.incidents.change}
              changeLabel="vs mois dern."
              icon={AlertTriangle}
              iconColor="text-destructive"
              trend="up"
            />
            <StatsCard
              title="Rendement Global"
              value="91.4"
              unit="%"
              change={2.8}
              changeLabel="vs objectif"
              icon={TrendingUp}
              trend="up"
            />
            <StatsCard
              title="Sites Opérationnels"
              value={String(stats.sites.active)}
              unit={`/ ${stats.sites.total}`}
              icon={Factory}
              trend="neutral"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Production Chart */}
            <div className="lg:col-span-2">
              <ProductionChart data={productionChart} />
            </div>

            {/* Safety Alerts */}
            <div>
              <SafetyAlerts incidents={recentIncidents} />
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="grid gap-4 lg:grid-cols-2">
            <EquipmentStatus equipment={equipmentStatus} />
            <PersonnelSchedule shifts={shifts} />
          </div>

          {/* Site Map - Full Width */}
          <SiteMap />
        </div>
      </main>
    </div>
  )
}
