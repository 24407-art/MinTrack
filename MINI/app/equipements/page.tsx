"use client"

import { useState, useEffect } from "react"
import { MiningSidebar } from "@/components/mining/sidebar"
import { MiningHeader } from "@/components/mining/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
  Truck,
  Plus,
  Search,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Fuel,
  Clock,
  Calendar,
  MoreHorizontal,
  Filter,
  Gauge,
  Settings,
  Mountain,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Equipment {
  id: number
  name: string
  type: string
  model: string
  serial: string
  siteId: number
  siteName: string
  siteCode: string
  status: string
  purchaseDate: string
  lastMaintenance: string
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  operational: {
    label: "Opérationnel",
    variant: "default" as const,
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/20",
  },
  maintenance: {
    label: "En maintenance",
    variant: "secondary" as const,
    icon: Wrench,
    color: "text-warning",
    bgColor: "bg-warning/20",
  },
  alert: {
    label: "Alerte",
    variant: "destructive" as const,
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/20",
  },
}

export default function EquipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [maintenanceOpen, setMaintenanceOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [maintenanceData, setMaintenanceData] = useState({
    date: '',
    description: ''
  })
  
  // États du formulaire
  const [formData, setFormData] = useState({
    serial: '',
    type: '',
    name: '',
    model: '',
    siteId: '',
    purchaseDate: '',
    status: 'operational'
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      console.log('Fetching equipment...')
      const response = await fetch('/api/equipment')
      const data = await response.json()
      console.log('Equipment loaded:', data.length, 'items')
      setEquipment(data)
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const response = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          siteId: parseInt(formData.siteId)
        })
      })
      
      if (response.ok) {
        setDialogOpen(false)
        setFormData({ serial: '', type: '', name: '', model: '', siteId: '', purchaseDate: '', status: 'operational' })
        fetchEquipment()
      } else {
        console.error('Error creating equipment')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    const matchesCategory = filterCategory === "all" || item.type === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Extraire les types uniques depuis la base de données
  const uniqueTypes = Array.from(new Set(equipment.map(e => e.type))).sort()

  const operationalCount = equipment.filter(e => e.status === "operational").length
  const maintenanceCount = equipment.filter(e => e.status === "maintenance").length
  const alertCount = equipment.filter(e => e.status === "alert").length

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) return
    
    try {
      const response = await fetch(`/api/equipment?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchEquipment()
      } else {
        console.error('Error deleting equipment')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handlePlanMaintenance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEquipment) return
    
    try {
      // Mettre à jour le statut et la date de dernière maintenance
      const response = await fetch('/api/equipment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEquipment.id,
          status: 'maintenance',
          lastMaintenance: maintenanceData.date
        })
      })
      
      if (response.ok) {
        setMaintenanceOpen(false)
        setMaintenanceData({ date: '', description: '' })
        fetchEquipment()
      } else {
        console.error('Error planning maintenance')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <MiningSidebar />
      
      <main className="pl-64">
        <MiningHeader 
          title="Équipements" 
          subtitle="Gestion du parc d'engins et maintenance" 
        />
        
        <div className="p-6 space-y-6">
          {/* Actions Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un équipement..."
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
                  <SelectItem value="operational">Opérationnel</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="alert">Alerte</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvel Équipement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Ajouter un Équipement</DialogTitle>
                  <DialogDescription>
                    Enregistrez un nouvel engin dans le parc d&apos;équipements.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <FieldGroup className="gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Numéro de série</FieldLabel>
                        <Input 
                          placeholder="Ex: SN-12345" 
                          value={formData.serial}
                          onChange={(e) => setFormData({...formData, serial: e.target.value})}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Type</FieldLabel>
                        <Select 
                          value={formData.type} 
                          onValueChange={(value) => setFormData({...formData, type: value})}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>Nom</FieldLabel>
                      <Input 
                        placeholder="Ex: Camion Benne CAT 797F" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Modèle</FieldLabel>
                      <Input 
                        placeholder="Ex: CAT 797F" 
                        value={formData.model}
                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Site d&apos;affectation</FieldLabel>
                      <Select 
                        value={formData.siteId} 
                        onValueChange={(value) => setFormData({...formData, siteId: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un site" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(equipment.map(e => ({ id: e.siteId, name: e.siteName })))).map((site) => (
                            <SelectItem key={site.id} value={site.id.toString()}>{site.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Date d&apos;acquisition</FieldLabel>
                        <Input 
                          type="date" 
                          value={formData.purchaseDate}
                          onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Statut</FieldLabel>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value) => setFormData({...formData, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operational">Opérationnel</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="alert">Alerte</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full mt-2" 
                      disabled={submitting}
                    >
                      {submitting ? 'Ajout en cours...' : 'Ajouter l\'équipement'}
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
                  <div className="rounded-lg bg-primary/20 p-2">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{equipment.length}</p>
                    <p className="text-sm text-muted-foreground">Équipements totaux</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-success/20 p-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{operationalCount}</p>
                    <p className="text-sm text-muted-foreground">Opérationnels</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-warning/20 p-2">
                    <Wrench className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{maintenanceCount}</p>
                    <p className="text-sm text-muted-foreground">En maintenance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-destructive/20 p-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{alertCount}</p>
                    <p className="text-sm text-muted-foreground">Alertes actives</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="fleet" className="space-y-4">
            <TabsList>
              <TabsTrigger value="fleet">Parc d&apos;Engins</TabsTrigger>
              <TabsTrigger value="maintenance">Planning Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="fleet" className="space-y-4">
              {(() => {
                console.log('Render state:', { loading, equipmentLength: equipment.length, filteredLength: filteredEquipment.length })
                return null
              })()}
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">Chargement des équipements...</p>
              ) : equipment.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Aucun équipement dans la base de données</p>
              ) : filteredEquipment.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Aucun équipement ne correspond aux filtres</p>
              ) : (
              <div className="grid gap-4">
                {filteredEquipment.map((item) => {
                  const config = statusConfig[item.status as keyof typeof statusConfig]
                  const StatusIcon = config.icon

                  return (
                    <Card key={item.id} className="border-border bg-card">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Icon */}


                          {/* Main Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">{item.name}</span>
                              <Badge variant="outline" className="font-mono text-xs">{item.id}</Badge>
                              <Badge variant={config.variant}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {config.label}
                              </Badge>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span>{item.type}</span>
                              <span>•</span>
                              <span>{item.siteName}</span>
                              <span>•</span>
                              <span>Modèle: {item.model}</span>
                            </div>
                          </div>

                          {/* Metrics - depuis la base de données */}
                          <div className="hidden lg:flex items-center gap-6">
                            <div className="text-center">
                              <div className="flex items-center gap-1.5">
                                <Mountain className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-foreground">{item.siteCode}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Site</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-foreground text-sm">
                                  {item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString('fr-FR') : 'N/A'}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">Dern. maint.</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center gap-1.5">
                                <Settings className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-foreground text-xs">{item.model}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Modèle</p>
                            </div>
                          </div>

                          {/* Mobile Info */}
                          <div className="lg:hidden">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mountain className="h-4 w-4" />
                              <span>{item.siteName}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedEquipment(item)
                                  setDetailOpen(true)
                                }}
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                Détails
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedEquipment(item)
                                  setMaintenanceOpen(true)
                                }}
                              >
                                <Wrench className="mr-2 h-4 w-4" />
                                Planifier maintenance
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedEquipment(item)
                                  setHistoryOpen(true)
                                }}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                Historique
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDelete(item.id)}
                              >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
            </TabsContent>

            <TabsContent value="maintenance">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">Équipements en Maintenance </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    {loading ? (
                      <p className="text-center py-4 text-muted-foreground">Chargement...</p>
                    ) : equipment.filter(e => e.status === 'maintenance').length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">Aucun équipement en maintenance</p>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Équipement</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Site</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Dernière maintenance</th>
                           
                          </tr>
                        </thead>
                        <tbody>
                          {equipment.filter(e => e.status === 'maintenance').map((item: Equipment) => (
                            <tr key={item.id} className="border-b border-border last:border-0">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="font-mono">{item.id}</Badge>
                                  <span className="text-foreground">{item.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-foreground">{item.type}</td>
                              <td className="px-4 py-3 text-foreground">{item.siteName}</td>
                              <td className="px-4 py-3 text-foreground">
                                {item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString('fr-FR') : 'N/A'}
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

          {/* Modal Détails */}
          <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Détails de l&apos;Équipement</DialogTitle>
              </DialogHeader>
              {selectedEquipment && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">ID</p>
                      <p className="font-medium">{selectedEquipment.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Numéro de série</p>
                      <p className="font-medium">{selectedEquipment.serial}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium text-lg">{selectedEquipment.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">{selectedEquipment.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Modèle</p>
                      <p className="font-medium">{selectedEquipment.model}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Site</p>
                    <p className="font-medium">{selectedEquipment.siteName} ({selectedEquipment.siteCode})</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <Badge variant={statusConfig[selectedEquipment.status as keyof typeof statusConfig]?.variant || 'default'}>
                        {statusConfig[selectedEquipment.status as keyof typeof statusConfig]?.label || selectedEquipment.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date d&apos;acquisition</p>
                      <p className="font-medium">{selectedEquipment.purchaseDate ? new Date(selectedEquipment.purchaseDate).toLocaleDateString('fr-FR') : 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dernière maintenance</p>
                    <p className="font-medium">{selectedEquipment.lastMaintenance ? new Date(selectedEquipment.lastMaintenance).toLocaleDateString('fr-FR') : 'N/A'}</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Modal Planifier Maintenance */}
          <Dialog open={maintenanceOpen} onOpenChange={setMaintenanceOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Planifier une Maintenance</DialogTitle>
                <DialogDescription>
                  {selectedEquipment && `Planifier une maintenance pour ${selectedEquipment.name}`}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePlanMaintenance}>
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel>Date de maintenance</FieldLabel>
                    <Input 
                      type="date" 
                      value={maintenanceData.date}
                      onChange={(e) => setMaintenanceData({...maintenanceData, date: e.target.value})}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Description / Notes</FieldLabel>
                    <Input 
                      placeholder="Description de la maintenance..."
                      value={maintenanceData.description}
                      onChange={(e) => setMaintenanceData({...maintenanceData, description: e.target.value})}
                    />
                  </Field>
                  <Button type="submit" className="w-full">
                    Confirmer la maintenance
                  </Button>
                </FieldGroup>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal Historique */}
          <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Historique de l&apos;Équipement</DialogTitle>
                <DialogDescription>
                  {selectedEquipment && `Historique de ${selectedEquipment.name}`}
                </DialogDescription>
              </DialogHeader>
              {selectedEquipment && (
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{new Date(selectedEquipment.createdAt).toLocaleDateString('fr-FR')}</p>
                      <p className="font-medium">Équipement créé</p>
                      <p className="text-sm text-muted-foreground">Ajout au parc d&apos;équipements</p>
                    </div>
                    {selectedEquipment.lastMaintenance && (
                      <div>
                        <p className="text-sm text-muted-foreground">{new Date(selectedEquipment.lastMaintenance).toLocaleDateString('fr-FR')}</p>
                        <p className="font-medium">Dernière maintenance</p>
                        <p className="text-sm text-muted-foreground">Statut: {selectedEquipment.status}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">{new Date(selectedEquipment.updatedAt).toLocaleDateString('fr-FR')}</p>
                      <p className="font-medium">Dernière mise à jour</p>
                      <p className="text-sm text-muted-foreground">Modification des informations</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Site: {selectedEquipment.siteName}</p>
                    <p className="text-sm text-muted-foreground">Statut actuel: {statusConfig[selectedEquipment.status as keyof typeof statusConfig]?.label || selectedEquipment.status}</p>
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
