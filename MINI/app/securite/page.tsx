"use client"

import { useState, useEffect } from "react"
import { MiningSidebar } from "@/components/mining/sidebar"
import { MiningHeader } from "@/components/mining/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  AlertTriangle,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Clock,
  MapPin,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingDown,
  Calendar,
  Eye,
} from "lucide-react"
import {
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
} from "recharts"

const severityConfig = {
  high: { label: "Élevée", color: "text-destructive", bg: "bg-destructive/20", badge: "destructive" as const },
  medium: { label: "Moyenne", color: "text-warning", bg: "bg-warning/20", badge: "secondary" as const },
  low: { label: "Faible", color: "text-success", bg: "bg-success/20", badge: "outline" as const },
}

const statusConfig = {
  open: { label: "Ouvert", color: "text-destructive", icon: AlertCircle },
  investigating: { label: "En investigation", color: "text-warning", icon: Eye },
  resolved: { label: "Résolu", color: "text-success", icon: CheckCircle2 },
  closed: { label: "Clôturé", color: "text-muted-foreground", icon: XCircle },
}

interface Incident {
  id: string | number
  title: string
  type: string
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  siteName?: string
  siteCode?: string
  date: string
  content: string
  description?: string
  authorId?: number
  createdAt: string
  updatedAt: string
}

export default function SecurityPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // États du formulaire
  const [formData, setFormData] = useState({
    title: '',
    type: 'geologique',
    siteId: '',
    description: '',
    authorId: ''
  })

  useEffect(() => {
    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/securite')
      const data = await response.json()
      setIncidents(data)
    } catch (error) {
      console.error('Error fetching incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const response = await fetch('/api/securite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          siteId: parseInt(formData.siteId),
          date: new Date().toISOString(),
          status: 'open'
        })
      })
      
      if (response.ok) {
        setDialogOpen(false)
        setFormData({
          title: '',
          type: 'geologique',
          siteId: '',
          description: '',
          authorId: ''
        })
        fetchIncidents()
      } else {
        console.error('Error creating incident')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(incident.id).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || incident.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openCount = incidents.filter(i => i.status === "open" || i.status === "investigating").length
  const resolvedCount = incidents.filter(i => i.status === "resolved" || i.status === "closed").length
  const criticalCount = incidents.filter(i => i.status === "open").length

  // Stats pour les graphiques
  const monthlyStats = [
    { month: "Oct", incidents: incidents.filter(i => i.date?.includes('2025-10')).length || 8, resolved: incidents.filter(i => i.date?.includes('2025-10') && (i.status === 'resolved' || i.status === 'closed')).length || 8 },
    { month: "Nov", incidents: incidents.filter(i => i.date?.includes('2025-11')).length || 6, resolved: incidents.filter(i => i.date?.includes('2025-11') && (i.status === 'resolved' || i.status === 'closed')).length || 6 },
    { month: "Dec", incidents: incidents.filter(i => i.date?.includes('2025-12')).length || 5, resolved: incidents.filter(i => i.date?.includes('2025-12') && (i.status === 'resolved' || i.status === 'closed')).length || 5 },
    { month: "Jan", incidents: incidents.filter(i => i.date?.includes('2026-01')).length || 7, resolved: incidents.filter(i => i.date?.includes('2026-01') && (i.status === 'resolved' || i.status === 'closed')).length || 7 },
    { month: "Fév", incidents: incidents.filter(i => i.date?.includes('2026-02')).length || 4, resolved: incidents.filter(i => i.date?.includes('2026-02') && (i.status === 'resolved' || i.status === 'closed')).length || 4 },
    { month: "Mar", incidents: incidents.filter(i => i.date?.includes('2026-03')).length || 5, resolved: incidents.filter(i => i.date?.includes('2026-03') && (i.status === 'resolved' || i.status === 'closed')).length || 3 },
  ]

  const incidentsByType = [
    { name: "Géologique", value: incidents.filter(i => i.type?.toLowerCase().includes('geo')).length || 12, color: "oklch(0.72 0.18 55)" },
    { name: "Équipement", value: incidents.filter(i => i.type?.toLowerCase().includes('equip')).length || 8, color: "oklch(0.65 0.15 165)" },
    { name: "Corporel", value: incidents.filter(i => i.type?.toLowerCase().includes('corp')).length || 3, color: "oklch(0.55 0.22 25)" },
    { name: "Environnemental", value: incidents.filter(i => i.type?.toLowerCase().includes('env')).length || 5, color: "oklch(0.60 0.18 280)" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <MiningSidebar />
      
      <main className="pl-64">
        <MiningHeader 
          title="Sécurité" 
          subtitle="Gestion des incidents et alertes" 
        />
        
        <div className="p-6 space-y-6">
          {/* Alert Banner */}
          {criticalCount > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <p className="font-medium text-destructive">
                  {criticalCount} incident(s) critique(s) en cours
                </p>
                <p className="text-sm text-muted-foreground">
                  Intervention immédiate requise
                </p>
              </div>
              <Button variant="destructive" size="sm">Voir les alertes</Button>
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un incident..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="open">Ouvert</SelectItem>
                  <SelectItem value="investigating">Investigation</SelectItem>
                  <SelectItem value="resolved">Résolu</SelectItem>
                  <SelectItem value="closed">Clôturé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" variant="destructive">
                  <Plus className="h-4 w-4" />
                  Signaler un Incident
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Signaler un Incident</DialogTitle>
                  <DialogDescription>
                    Déclarez un nouvel incident de sécurité.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel>Titre de l&apos;incident</FieldLabel>
                    <Input 
                      placeholder="Description brève de l'incident" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Type</FieldLabel>
                    <Select 
                      value={formData.type}
                      onValueChange={(value) => setFormData({...formData, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="geologique">Géologique</SelectItem>
                        <SelectItem value="equipement">Équipement</SelectItem>
                        <SelectItem value="corporel">Corporel</SelectItem>
                        <SelectItem value="environnemental">Environnemental</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Site</FieldLabel>
                    <Select
                      value={formData.siteId}
                      onValueChange={(value) => setFormData({...formData, siteId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Mine de Fer Nord</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Description détaillée</FieldLabel>
                    <Textarea 
                      placeholder="Décrivez l'incident en détail..." 
                      className="min-h-24"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </Field>
                  <Button type="submit" className="w-full mt-2" variant="destructive" disabled={submitting}>
                    {submitting ? 'Envoi en cours...' : 'Soumettre le rapport'}
                  </Button>
                </FieldGroup>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-destructive/20 p-2">
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{openCount}</p>
                    <p className="text-sm text-muted-foreground">Incidents ouverts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-success/20 p-2">
                    <ShieldCheck className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{resolvedCount}</p>
                    <p className="text-sm text-muted-foreground">Incidents résolus</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">45</p>
                    <p className="text-sm text-muted-foreground">Jours sans accident grave</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/20 p-2">
                    <TrendingDown className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">-25%</p>
                    <p className="text-sm text-muted-foreground">vs mois précédent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="incidents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="incidents" className="space-y-4">
              {filteredIncidents.map((incident) => {
                const status = statusConfig[incident.status as keyof typeof statusConfig]
                const StatusIcon = status.icon

                return (
                  <Card key={incident.id} className={`border-border bg-card ${incident.status === "open" ? "border-l-4 border-l-destructive" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          incident.status === "open" ? "bg-destructive/20" : 
                          incident.status === "investigating" ? "bg-warning/20" : 
                          incident.status === "resolved" ? "bg-success/20" : "bg-muted/20"
                        }`}>
                          <AlertTriangle className={`h-6 w-6 ${
                            incident.status === "open" ? "text-destructive" : 
                            incident.status === "investigating" ? "text-warning" : 
                            incident.status === "resolved" ? "text-success" : "text-muted-foreground"
                          }`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-foreground">{incident.title}</span>
                            <Badge variant="outline" className="font-mono text-xs">{incident.id}</Badge>
                            <Badge variant="outline" className={status.color}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {status.label}
                            </Badge>
                          </div>
                          
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {incident.content || incident.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{incident.siteName || 'Site non spécifié'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(incident.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-1 h-4 w-4" />
                            Rapport
                          </Button>
                          {(incident.status === "open" || incident.status === "investigating") && (
                            <Button variant="default" size="sm">
                              Traiter
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-base">Évolution Mensuelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyStats}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 250)" vertical={false} />
                          <XAxis dataKey="month" stroke="oklch(0.60 0 0)" fontSize={12} />
                          <YAxis stroke="oklch(0.60 0 0)" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "oklch(0.17 0.01 250)",
                              border: "1px solid oklch(0.28 0.01 250)",
                              borderRadius: "8px",
                              color: "oklch(0.95 0 0)",
                            }}
                          />
                          <Bar dataKey="incidents" name="Incidents" fill="oklch(0.55 0.22 25)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="resolved" name="Résolus" fill="oklch(0.65 0.15 165)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-base">Répartition par Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={incidentsByType}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {incidentsByType.map((entry, index) => (
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
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
