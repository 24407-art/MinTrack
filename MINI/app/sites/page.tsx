"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { MiningSidebar } from "@/components/mining/sidebar"
import { MiningHeader } from "@/components/mining/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SitesMap = dynamic(() => import("@/components/mining/sites-map").then(mod => mod.SitesMap), { ssr: false })
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  MapPin,
  Plus,
  Search,
  Factory,
  Users,
  Truck,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  Mountain,
  AlertTriangle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { prisma } from "@/lib/prisma"

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

export default function SitesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [historySite, setHistorySite] = useState<Site | null>(null)
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editSiteId, setEditSiteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    mineral: "",
    region: "",
    coordinates: "",
    capacity: "",
    startDate: "",
    area: ""
  })

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites')
      const data = await response.json()
      setSites(data)
    } catch (error) {
      console.error('Error fetching sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = '/api/sites'
      const method = editSiteId ? 'PUT' : 'POST'
      const bodyPayload = editSiteId
        ? { ...formData, id: editSiteId, capacity: parseInt(formData.capacity) }
        : {
          ...formData,
          capacity: parseInt(formData.capacity),
          currentProduction: 0,
          workers: 0,
          equipmentCount: 0,
          status: "active"
        }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      })

      if (response.ok) {
        await fetchSites()
        setIsModalOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving site:', error)
    }
  }

  const resetForm = () => {
    setEditSiteId(null)
    setFormData({
      name: "",
      code: "",
      mineral: "",
      region: "",
      coordinates: "",
      capacity: "",
      startDate: "",
      area: ""
    })
  }

  const handleEdit = (site: Site) => {
    setEditSiteId(site.id)
    setFormData({
      name: site.name,
      code: site.code,
      mineral: site.mineral,
      region: site.region,
      coordinates: site.coordinates,
      capacity: site.capacity.toString(),
      startDate: site.startDate,
      area: site.area
    })
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (site: Site) => {
    try {
      const newStatus = site.status === "active" ? "inactive" : "active"
      const response = await fetch('/api/sites', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: site.id, status: newStatus }),
      })
      
      if (response.ok) {
        await fetchSites()
      }
    } catch (error) {
      console.error('Error toggling site status:', error)
    }
  }

  const handleDelete = async () => {
    if (!siteToDelete) return
    
    try {
      const response = await fetch(`/api/sites?id=${siteToDelete.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchSites()
        setSiteToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting site:', error)
    }
  }

  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.mineral.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || site.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <MiningSidebar />

      <main className="pl-64">
        <MiningHeader
          title="Sites Miniers"
          subtitle="Gestion des sites d'extraction en Mauritanie"
        />

        <div className="p-6 space-y-6">
          {/* Actions Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un site..."
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
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isModalOpen} onOpenChange={(open) => {
              if (!open) resetForm()
              setIsModalOpen(open)
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => {
                  resetForm()
                  setIsModalOpen(true)
                }}>
                  <Plus className="h-4 w-4" />
                  Nouveau Site
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editSiteId ? "Modifier le Site" : "Ajouter un Site Minier"}</DialogTitle>
                  <DialogDescription>
                    {editSiteId
                      ? "Modifiez les informations du site ci-dessous."
                      : "Créez un nouveau site minier en remplissant les informations ci-dessous."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <FieldGroup className="gap-4">
                    <Field>
                      <FieldLabel>Nom du site</FieldLabel>
                      <Input
                        placeholder="Ex: Site de Nouakchott"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Code</FieldLabel>
                        <Input
                          placeholder="Ex: NKT-005"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Type de minerai</FieldLabel>
                        <Select value={formData.mineral} onValueChange={(value) => setFormData({ ...formData, mineral: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fer">Fer</SelectItem>
                            <SelectItem value="or">Or</SelectItem>
                            <SelectItem value="cuivre">Cuivre</SelectItem>
                            <SelectItem value="phosphate">Phosphate</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>Région</FieldLabel>
                      <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une région" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tiris Zemmour">Tiris Zemmour</SelectItem>
                          <SelectItem value="Inchiri">Inchiri</SelectItem>
                          <SelectItem value="Dakhlet Nouadhibou">Dakhlet Nouadhibou</SelectItem>
                          <SelectItem value="Adrar">Adrar</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Latitude</FieldLabel>
                        <Input
                          placeholder="Ex: 22.7306"
                          value={formData.coordinates.split(',')[0] || ''}
                          onChange={(e) => setFormData({ ...formData, coordinates: `${e.target.value},${formData.coordinates.split(',')[1] || ''}` })}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Longitude</FieldLabel>
                        <Input
                          placeholder="Ex: -12.4713"
                          value={formData.coordinates.split(',')[1] || ''}
                          onChange={(e) => setFormData({ ...formData, coordinates: `${formData.coordinates.split(',')[0] || ''},${e.target.value}` })}
                        />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>Capacité (tonnes/jour)</FieldLabel>
                      <Input
                        type="number"
                        placeholder="Ex: 5000"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Date de début</FieldLabel>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Surface (km²)</FieldLabel>
                      <Input
                        placeholder="Ex: 450 km²"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        required
                      />
                    </Field>
                    <Button type="submit" className="w-full mt-2">
                      {editSiteId ? "Enregistrer les modifications" : "Créer le site"}
                    </Button>
                  </FieldGroup>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Summary */}


          {/* Sites Tabs */}
          <Tabs defaultValue="grid" className="space-y-4">
            <TabsList>
              <TabsTrigger value="grid">Vue Grille</TabsTrigger>
              <TabsTrigger value="list">Vue Liste</TabsTrigger>
              <TabsTrigger value="map">Vue Carte</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                {filteredSites.map((site) => (
                  <Card key={site.id} className="border-border bg-card overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                            <Mountain className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{site.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs font-mono">{site.code}</Badge>
                              <Badge
                                variant={site.status === "active" ? "default" : "secondary"}
                                className={site.status === "active" ? "bg-success text-success-foreground" : ""}
                              >
                                {site.status === "active" ? "Actif" : "Maintenance"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedSite(site)}>Voir les détails</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(site)}>Modifier</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setHistorySite(site)}>Historique</DropdownMenuItem>
                            <DropdownMenuItem 
                              className={site.status === "active" ? "text-destructive" : "text-success"} 
                              onClick={() => handleToggleStatus(site)}
                            >
                              {site.status === "active" ? "Désactiver" : "Activer"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive" 
                              onSelect={(e) => {
                                e.preventDefault()
                                setSiteToDelete(site)
                              }}
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Minerai</p>
                          <p className="font-medium text-foreground">{site.mineral}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Région</p>
                          <p className="font-medium text-foreground">{site.region}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Production</span>
                          <span className="font-medium text-foreground">
                            {site.currentProduction.toLocaleString()} / {site.capacity.toLocaleString()} t/j
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(site.currentProduction / site.capacity) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 rounded-lg border border-border bg-secondary/50 p-3">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-semibold text-foreground">{site.workers.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Employés</p>
                        </div>
                        <div className="text-center border-x border-border">
                          <div className="flex items-center justify-center gap-1">
                            <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-semibold text-foreground">{site.equipmentCount}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Équipements</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5 text-success" />
                            <span className="font-semibold text-success">
                              {site.status === "active" ? `${Math.round((site.currentProduction / site.capacity) * 100)}%` : "—"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Rendement</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{site.coordinates}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Depuis {site.startDate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <Card className="border-border bg-card">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Site</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Minerai</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Région</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Production</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Employés</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSites.map((site) => (
                          <tr key={site.id} className="border-b border-border last:border-0">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                                  <Mountain className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{site.name}</p>
                                  <p className="text-xs text-muted-foreground font-mono">{site.code}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground">{site.mineral}</td>
                            <td className="px-4 py-3 text-sm text-foreground">{site.region}</td>
                            <td className="px-4 py-3 text-sm text-foreground">
                              {site.currentProduction.toLocaleString()} t/j
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground">{site.workers.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={site.status === "active" ? "default" : "secondary"}
                                className={site.status === "active" ? "bg-success text-success-foreground" : ""}
                              >
                                {site.status === "active" ? "Actif" : "Maintenance"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedSite(site)}>Détails</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map">
              <SitesMap sites={filteredSites} />
            </TabsContent>
          </Tabs>

          {/* Dialog détails du site */}
          <Dialog open={!!selectedSite} onOpenChange={(open) => !open && setSelectedSite(null)}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Mountain className="h-5 w-5 text-primary" />
                  </div>
                  Détails du Site : {selectedSite?.name}
                </DialogTitle>
              </DialogHeader>
              {selectedSite && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Code du site</p>
                      <p className="font-semibold text-foreground font-mono">{selectedSite.code}</p>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Statut</p>
                      <Badge variant={selectedSite.status === "active" ? "default" : "secondary"} className={selectedSite.status === "active" ? "bg-success text-success-foreground" : ""}>
                        {selectedSite.status === "active" ? "Actif" : "Maintenance"}
                      </Badge>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Type de minerai</p>
                      <div className="flex items-center gap-2">
                        <Mountain className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{selectedSite.mineral}</span>
                      </div>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Région</p>
                      <p className="font-semibold text-foreground">{selectedSite.region}</p>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Coordonnées GPS</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-sm">{selectedSite.coordinates}</span>
                      </div>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Date d'ouverture</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-sm">{selectedSite.startDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mt-2">
                    <h4 className="font-medium mb-3 text-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Ressources & Production
                    </h4>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-secondary/50 p-4 rounded-xl text-center border border-border">
                        <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold text-foreground">{selectedSite.workers.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Employés</p>
                      </div>
                      <div className="bg-secondary/50 p-4 rounded-xl text-center border border-border">
                        <Truck className="h-5 w-5 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold text-foreground">{selectedSite.equipmentCount}</p>
                        <p className="text-xs text-muted-foreground mt-1">Équipements</p>
                      </div>
                      <div className="bg-secondary/50 p-4 rounded-xl text-center border border-border">
                        <Factory className="h-5 w-5 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold text-foreground">{selectedSite.capacity.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Capacité (t/j)</p>
                      </div>
                    </div>

                    <div className="bg-secondary/40 p-4 rounded-xl border border-border">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">Production actuelle</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Moyenne journalière</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-foreground">
                            {selectedSite.currentProduction.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground"> / {selectedSite.capacity.toLocaleString()} t</span>
                        </div>
                      </div>

                      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full transition-all rounded-full ${selectedSite.currentProduction > 0 ? "bg-primary" : "bg-muted-foreground/30"}`}
                          style={{ width: `${Math.min(100, Math.max(2, (selectedSite.currentProduction / (selectedSite.capacity || 1)) * 100))}%` }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">Rendement</span>
                        <span className={selectedSite.currentProduction > 0 ? "text-success" : "text-muted-foreground"}>
                          {Math.round((selectedSite.currentProduction / (selectedSite.capacity || 1)) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Dialog Confirmation de suppression */}
          <Dialog open={!!siteToDelete} onOpenChange={(open) => !open && setSiteToDelete(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  Confirmer la suppression
                </DialogTitle>
                <DialogDescription className="pt-3">
                  Êtes-vous sûr de vouloir supprimer définitivement le site <strong className="text-foreground">{siteToDelete?.name}</strong> ?<br/><br/>
                  Cette action est irréversible et supprimera toutes les données associées à ce site.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
                <Button variant="outline" onClick={() => setSiteToDelete(null)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Supprimer définitivement
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Dialog Historique du site */}
          <Dialog open={!!historySite} onOpenChange={(open) => !open && setHistorySite(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  Historique : {historySite?.name}
                </DialogTitle>
                <DialogDescription>
                  Derniers événements et activités liés à ce site.
                </DialogDescription>
              </DialogHeader>

              {historySite && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 mt-2">
                  <div className="relative border-l-2 border-muted ml-3 space-y-6 pb-2">
                    <div className="relative pl-6">
                      <div className="absolute left-[-7px] top-1.5 h-3 w-3 rounded-full bg-success ring-4 ring-background"></div>
                      <p className="text-sm font-medium text-foreground">Production maximale atteinte</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Aujourd'hui, 14:30</p>
                      <p className="text-xs text-foreground mt-1 bg-secondary p-3 rounded-lg border border-border">
                        Le site a atteint 98% de sa capacité journalière prévue ({historySite.capacity} t).
                      </p>
                    </div>

                    <div className="relative pl-6">
                      <div className="absolute left-[-7px] top-1.5 h-3 w-3 rounded-full bg-warning ring-4 ring-background"></div>
                      <p className="text-sm font-medium text-foreground">Maintenance préventive</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Il y a 3 jours</p>
                      <p className="text-xs text-foreground mt-1 bg-secondary p-3 rounded-lg border border-border">
                        Inspection réussie de 5 camions et de 2 excavatrices.
                      </p>
                    </div>

                    <div className="relative pl-6">
                      <div className="absolute left-[-7px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background"></div>
                      <p className="text-sm font-medium text-foreground">Augmentation de l'effectif</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Le mois dernier</p>
                      <p className="text-xs text-foreground mt-1 bg-secondary p-3 rounded-lg border border-border">
                        Arrivée de nouveaux opérateurs sur le site pour soutenir la production.
                      </p>
                    </div>

                    <div className="relative pl-6">
                      <div className="absolute left-[-7px] top-1.5 h-3 w-3 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                      <p className="text-sm font-medium text-foreground">Ouverture officielle du site</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Depuis {historySite.startDate}</p>
                      <p className="text-xs text-foreground mt-1 bg-secondary p-3 rounded-lg border border-border">
                        Début des opérations d'extraction de {historySite.mineral} dans la région de {historySite.region}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

        </div>
      </main>
    </div>
  )
}
