"use client"

import { useState } from "react"
import { MiningSidebar } from "@/components/mining/sidebar"
import { MiningHeader } from "@/components/mining/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  FileText,
  Download,
  Calendar,
  BarChart3,
  FileSpreadsheet,
  FilePieChart,
  Clock,
  TrendingUp,
  Mountain,
  Users,
  Truck,
  ShieldAlert,
  Printer,
  Mail,
  Filter,
} from "lucide-react"

const reportTypes = [
  {
    id: "production",
    name: "Rapport de Production",
    description: "Statistiques détaillées de production par site et minerai",
    icon: Mountain,
    color: "bg-primary/20 text-primary",
    frequency: "Quotidien / Hebdomadaire / Mensuel",
    formats: ["PDF", "Excel"],
  },
  {
    id: "equipment",
    name: "Rapport Équipements",
    description: "État du parc, maintenance et disponibilité des engins",
    icon: Truck,
    color: "bg-accent/20 text-accent",
    frequency: "Hebdomadaire / Mensuel",
    formats: ["PDF", "Excel"],
  },
  {
    id: "personnel",
    name: "Rapport Personnel",
    description: "Présences, heures travaillées et affectations",
    icon: Users,
    color: "bg-chart-3/20 text-chart-3",
    frequency: "Quotidien / Mensuel",
    formats: ["PDF", "Excel"],
  },
  {
    id: "security",
    name: "Rapport Sécurité",
    description: "Incidents, alertes et indicateurs HSE",
    icon: ShieldAlert,
    color: "bg-destructive/20 text-destructive",
    frequency: "Hebdomadaire / Mensuel",
    formats: ["PDF"],
  },
  {
    id: "financial",
    name: "Rapport Financier",
    description: "Coûts opérationnels, rendement et KPIs financiers",
    icon: BarChart3,
    color: "bg-warning/20 text-warning",
    frequency: "Mensuel / Trimestriel",
    formats: ["PDF", "Excel"],
  },
  {
    id: "environmental",
    name: "Rapport Environnemental",
    description: "Impact environnemental et conformité réglementaire",
    icon: FilePieChart,
    color: "bg-success/20 text-success",
    frequency: "Trimestriel / Annuel",
    formats: ["PDF"],
  },
]

const recentReports = [
  {
    id: 1,
    name: "Production_Mars_2026_Zouerate.pdf",
    type: "Production",
    site: "Zouérate",
    date: "25/03/2026",
    size: "2.4 MB",
    status: "ready",
  },
  {
    id: 2,
    name: "Securite_Hebdo_S12_2026.pdf",
    type: "Sécurité",
    site: "Tous",
    date: "24/03/2026",
    size: "1.8 MB",
    status: "ready",
  },
  {
    id: 3,
    name: "Equipements_Mars_2026.xlsx",
    type: "Équipements",
    site: "Tous",
    date: "23/03/2026",
    size: "3.1 MB",
    status: "ready",
  },
  {
    id: 4,
    name: "Personnel_Presence_Mars.xlsx",
    type: "Personnel",
    site: "Tous",
    date: "22/03/2026",
    size: "1.2 MB",
    status: "ready",
  },
  {
    id: 5,
    name: "Production_Q1_2026.pdf",
    type: "Production",
    site: "Tous",
    date: "20/03/2026",
    size: "5.6 MB",
    status: "ready",
  },
]

const scheduledReports = [
  {
    id: 1,
    name: "Rapport Production Quotidien",
    frequency: "Quotidien",
    nextRun: "26/03/2026 06:00",
    recipients: 3,
    status: "active",
  },
  {
    id: 2,
    name: "Rapport Sécurité Hebdomadaire",
    frequency: "Hebdomadaire",
    nextRun: "31/03/2026 08:00",
    recipients: 5,
    status: "active",
  },
  {
    id: 3,
    name: "Synthèse Mensuelle Direction",
    frequency: "Mensuel",
    nextRun: "01/04/2026 09:00",
    recipients: 8,
    status: "active",
  },
]

export default function ReportsPage() {
  const [selectedSite, setSelectedSite] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  return (
    <div className="min-h-screen bg-background">
      <MiningSidebar />
      
      <main className="pl-64">
        <MiningHeader 
          title="Rapports" 
          subtitle="Génération et export de rapports" 
        />
        
        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les sites</SelectItem>
                  <SelectItem value="zouerate">Zouérate</SelectItem>
                  <SelectItem value="akjoujt">Akjoujt</SelectItem>
                  <SelectItem value="tasiast">Tasiast</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Aujourd&apos;hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Imprimer
              </Button>
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Envoyer
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList>
              <TabsTrigger value="generate">Générer un Rapport</TabsTrigger>
              <TabsTrigger value="recent">Rapports Récents</TabsTrigger>
              <TabsTrigger value="scheduled">Rapports Planifiés</TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reportTypes.map((report) => {
                  const Icon = report.icon
                  return (
                    <Card key={report.id} className="border-border bg-card hover:border-primary/50 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`rounded-lg p-2.5 ${report.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex gap-1">
                            {report.formats.map((format) => (
                              <Badge key={format} variant="outline" className="text-xs">
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <CardTitle className="text-base mt-3">{report.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {report.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{report.frequency}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                            <FileSpreadsheet className="h-4 w-4" />
                            Excel
                          </Button>
                          <Button size="sm" className="flex-1 gap-1.5">
                            <FileText className="h-4 w-4" />
                            PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Custom Report Builder */}
              <Card className="mt-6 border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">Rapport Personnalisé</CardTitle>
                  <CardDescription>
                    Créez un rapport sur mesure avec les indicateurs de votre choix
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Type de données</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="equipment">Équipements</SelectItem>
                          <SelectItem value="personnel">Personnel</SelectItem>
                          <SelectItem value="security">Sécurité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Site</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les sites</SelectItem>
                          <SelectItem value="zouerate">Zouérate</SelectItem>
                          <SelectItem value="akjoujt">Akjoujt</SelectItem>
                          <SelectItem value="tasiast">Tasiast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Période</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="custom">Personnalisée</SelectItem>
                          <SelectItem value="week">Dernière semaine</SelectItem>
                          <SelectItem value="month">Dernier mois</SelectItem>
                          <SelectItem value="quarter">Dernier trimestre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full gap-2">
                        <Filter className="h-4 w-4" />
                        Générer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">Rapports Générés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nom du fichier</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Site</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Taille</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentReports.map((report) => (
                          <tr key={report.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {report.name.endsWith(".pdf") ? (
                                  <FileText className="h-4 w-4 text-destructive" />
                                ) : (
                                  <FileSpreadsheet className="h-4 w-4 text-success" />
                                )}
                                <span className="font-medium text-foreground">{report.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline">{report.type}</Badge>
                            </td>
                            <td className="px-4 py-3 text-foreground">{report.site}</td>
                            <td className="px-4 py-3 text-muted-foreground">{report.date}</td>
                            <td className="px-4 py-3 text-muted-foreground">{report.size}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="gap-1.5">
                                  <Download className="h-4 w-4" />
                                  Télécharger
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-base">Rapports Automatiques</CardTitle>
                    <CardDescription>
                      Rapports générés et envoyés automatiquement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {scheduledReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/20 p-2">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{report.name}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>{report.frequency}</span>
                              <span>•</span>
                              <span>{report.recipients} destinataires</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={report.status === "active" ? "default" : "secondary"}>
                            {report.status === "active" ? "Actif" : "Inactif"}
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Prochain: {report.nextRun}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2">
                      Configurer un nouveau rapport
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-base">Indicateurs Clés (KPIs)</CardTitle>
                    <CardDescription>
                      Résumé des performances du mois
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border border-border bg-secondary/50 p-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="text-sm text-muted-foreground">Production</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-foreground">91.4%</p>
                        <p className="text-xs text-success">+8.2% vs objectif</p>
                      </div>
                      <div className="rounded-lg border border-border bg-secondary/50 p-4">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Disponibilité</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-foreground">94.2%</p>
                        <p className="text-xs text-muted-foreground">Équipements</p>
                      </div>
                      <div className="rounded-lg border border-border bg-secondary/50 p-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent" />
                          <span className="text-sm text-muted-foreground">Présence</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-foreground">96.8%</p>
                        <p className="text-xs text-muted-foreground">Personnel</p>
                      </div>
                      <div className="rounded-lg border border-border bg-secondary/50 p-4">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-muted-foreground">Sécurité</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-foreground">45</p>
                        <p className="text-xs text-muted-foreground">Jours sans accident</p>
                      </div>
                    </div>
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Exporter le tableau de bord
                    </Button>
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
