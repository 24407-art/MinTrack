"use client"

import { useState, useEffect } from "react"
import { MiningSidebar } from "@/components/mining/sidebar"
import { MiningHeader } from "@/components/mining/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Users,
  Plus,
  Search,
  Clock,
  Calendar,
  HardHat,
  UserCheck,
  UserX,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  MoreHorizontal,
  Sun,
  Moon,
  Sunrise,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Types
interface Personnel {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  position: string
  department: string
  siteId: number
  siteName: string
  siteCode: string
  hireDate: string
  salary?: number
  status: string
  createdAt: string
  updatedAt: string
  role?: string
  teamId?: number
  shiftId?: number
}

interface Shift {
  id: number
  name: string
  time: string
  workers: number
  sites: string[]
  status: string
  startTime: string
  endTime: string
}

const statusConfig = {
  present: { label: "Présent", variant: "default" as const, color: "bg-success" },
  absent: { label: "Absent", variant: "destructive" as const, color: "bg-destructive" },
  conge: { label: "En congé", variant: "secondary" as const, color: "bg-muted-foreground" },
  active: { label: "Actif", variant: "default" as const, color: "bg-success" },
  inactive: { label: "Inactif", variant: "destructive" as const, color: "bg-destructive" },
}

export default function PersonnelPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSite, setFilterSite] = useState("all")
  const [filterShift, setFilterShift] = useState("all")
  const [personnel, setPersonnel] = useState<Personnel[]>([])
  const [shifts, setShifts] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [teamsByDepartment, setTeamsByDepartment] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [planningOpen, setPlanningOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [createTeamOpen, setCreateTeamOpen] = useState(false)
  const [shiftAssignmentsOpen, setShiftAssignmentsOpen] = useState(false)
  const [selectedShiftForAssignments, setSelectedShiftForAssignments] = useState<any>(null)
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null)
  const [selectedShiftId, setSelectedShiftId] = useState<string>('none')
  const [scheduleData, setScheduleData] = useState({
    monday: 'none',
    tuesday: 'none',
    wednesday: 'none',
    thursday: 'none',
    friday: 'none',
    saturday: 'none',
    sunday: 'none'
  })
  const [allSchedules, setAllSchedules] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [validationOpen, setValidationOpen] = useState(false)
  
  // États du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    siteId: '',
    hireDate: '',
    salary: '',
    role: 'ouvrier',
    teamId: 'none'
  })

  // États du formulaire équipe
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    code: '',
    department: '',
    siteId: '',
    shiftId: 'none'
  })

  useEffect(() => {
    fetchPersonnel()
    fetchShifts()
    fetchTeams()
    fetchAllSchedules()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      setTeams(data.teams || [])
      setTeamsByDepartment(data.teamsByDepartment || {})
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const fetchShifts = async () => {
    try {
      const response = await fetch('/api/shifts')
      const data = await response.json()
      setShifts(data)
    } catch (error) {
      console.error('Error fetching shifts:', error)
    }
  }

  const fetchPersonnel = async () => {
    try {
      const response = await fetch('/api/personnel')
      const data = await response.json()
      setPersonnel(data)
    } catch (error) {
      console.error('Error fetching personnel:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Déduire le département, site et poste depuis l'équipe et le rôle
    const selectedTeam = teams.find(t => t.id.toString() === formData.teamId)
    const department = selectedTeam?.department || 'Non assigné'
    const siteId = selectedTeam?.site_id || formData.siteId
    const position = formData.role === 'chef_equipe' ? 'Chef d\'équipe' : 
                     formData.role === 'adjoint' ? 'Adjoint' : 'Ouvrier'
    
    try {
      const response = await fetch('/api/personnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          siteId: parseInt(siteId),
          salary: formData.salary ? parseFloat(formData.salary) : null,
          teamId: formData.teamId && formData.teamId !== 'none' ? parseInt(formData.teamId) : null,
          department,
          position
        })
      })
      
      if (response.ok) {
        setDialogOpen(false)
        setFormData({ firstName: '', lastName: '', email: '', phone: '', position: '', department: '', siteId: '', hireDate: '', salary: '', role: 'ouvrier', teamId: 'none' })
        fetchPersonnel()
      } else {
        console.error('Error creating personnel')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPerson) return
    
    setSubmitting(true)
    try {
      const response = await fetch('/api/personnel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPerson.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          department: formData.department,
          siteId: parseInt(formData.siteId),
          hireDate: formData.hireDate,
          salary: formData.salary ? parseFloat(formData.salary) : null
        })
      })
      
      if (response.ok) {
        setEditOpen(false)
        fetchPersonnel()
      } else {
        console.error('Error updating personnel')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedPerson) return
    
    try {
      setSubmitting(true)
      const response = await fetch(`/api/personnel?id=${selectedPerson.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setDeleteOpen(false)
        setSelectedPerson(null)
        fetchPersonnel()
      } else {
        console.error('Error deleting personnel')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...teamFormData,
          siteId: parseInt(teamFormData.siteId),
          shiftId: teamFormData.shiftId && teamFormData.shiftId !== 'none' ? parseInt(teamFormData.shiftId) : null
        })
      })
      
      if (response.ok) {
        setCreateTeamOpen(false)
        setTeamFormData({ name: '', code: '', department: '', siteId: '', shiftId: 'none' })
        fetchTeams()
      } else {
        console.error('Error creating team')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateShift = async () => {
    if (!selectedPerson) return
    
    try {
      setSubmitting(true)
      const response = await fetch('/api/personnel/shift', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPerson.id,
          shiftId: selectedShiftId !== 'none' ? parseInt(selectedShiftId) : null
        })
      })
      
      if (response.ok) {
        setPlanningOpen(false)
        fetchPersonnel()
      } else {
        console.error('Error updating shift')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const fetchSchedule = async (personnelId: number) => {
    try {
      const weekStart = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/personnel/schedule?personnelId=${personnelId}&weekStart=${weekStart}`)
      const data = await response.json()
      setScheduleData({
        monday: data.monday || 'none',
        tuesday: data.tuesday || 'none',
        wednesday: data.wednesday || 'none',
        thursday: data.thursday || 'none',
        friday: data.friday || 'none',
        saturday: data.saturday || 'none',
        sunday: data.sunday || 'none'
      })
    } catch (error) {
      console.error('Error fetching schedule:', error)
    }
  }

  const fetchAllSchedules = async () => {
    try {
      const weekStart = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/personnel/schedule?weekStart=${weekStart}`)
      const data = await response.json()
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setAllSchedules(data)
      } else if (data.error) {
        console.error('API error:', data.error)
        setAllSchedules([])
      } else {
        setAllSchedules([])
      }
    } catch (error) {
      console.error('Error fetching all schedules:', error)
      setAllSchedules([])
    }
  }

  const handleSaveSchedule = () => {
    if (!selectedPerson) {
      alert('Aucune personne sélectionnée')
      return
    }
    // Ouvrir la dialog de validation
    setValidationOpen(true)
  }

  const confirmSaveSchedule = async () => {
    if (!selectedPerson) return
    
    try {
      setSubmitting(true)
      const weekStart = new Date().toISOString().split('T')[0]
      const payload = {
        personnelId: selectedPerson.id,
        weekStart,
        monday: scheduleData.monday,
        tuesday: scheduleData.tuesday,
        wednesday: scheduleData.wednesday,
        thursday: scheduleData.thursday,
        friday: scheduleData.friday,
        saturday: scheduleData.saturday,
        sunday: scheduleData.sunday
      }
      
      const response = await fetch('/api/personnel/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        const result = await response.json()
        setValidationOpen(false)
        setPlanningOpen(false)
        await fetchPersonnel()
        await fetchAllSchedules()
      } else {
        const errorText = await response.text()
        alert('Erreur serveur: ' + errorText)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur de connexion: ' + error)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPersonnel = personnel.filter((person) => {
    const fullName = `${person.firstName} ${person.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      person.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSite = filterSite === "all" || person.siteName.toLowerCase().includes(filterSite)
    return matchesSearch && matchesSite
  })

  const activeCount = personnel.filter(p => p.status === "active").length
  const inactiveCount = personnel.filter(p => p.status === "inactive").length

  return (
    <div className="min-h-screen bg-background">
      <MiningSidebar />
      
      <main className="pl-64">
        <MiningHeader 
          title="Personnel" 
          subtitle="Gestion des équipes et affectations" 
        />
        
        <div className="p-6 space-y-6">
          {/* Actions Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterSite} onValueChange={setFilterSite}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les sites</SelectItem>
                  <SelectItem value="zouérate">Zouérate</SelectItem>
                  <SelectItem value="akjoujt">Akjoujt</SelectItem>
                  <SelectItem value="tasiast">Tasiast</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterShift} onValueChange={setFilterShift}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Quart" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les quarts</SelectItem>
                  <SelectItem value="matin">Matin</SelectItem>
                  <SelectItem value="après-midi">Après-midi</SelectItem>
                  <SelectItem value="nuit">Nuit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvel Employé
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Ajouter un Employé</DialogTitle>
                  <DialogDescription>
                    Enregistrez un nouvel employé dans le système.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                <FieldGroup className="gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Prénom</FieldLabel>
                      <Input 
                        placeholder="Ex: Mohamed" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Nom</FieldLabel>
                      <Input 
                        placeholder="Ex: Ould Ahmed" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                      />
                    </Field>
                  </div>

                  {/* Rôle et Équipe uniquement - Site et Département déduits de l'équipe */}
                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                    <Field>
                      <FieldLabel>Rôle</FieldLabel>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({...formData, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ouvrier">Ouvrier simple</SelectItem>
                          <SelectItem value="chef_equipe">Chef d'équipe</SelectItem>
                          <SelectItem value="adjoint">Adjoint</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Équipe</FieldLabel>
                      <Select
                        value={formData.teamId}
                        onValueChange={(value) => setFormData({...formData, teamId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une équipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucune équipe</SelectItem>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id.toString()}>
                              {team.name} ({team.department})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Téléphone</FieldLabel>
                      <Input 
                        placeholder="+222 XX XX XX XX" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <Input 
                        type="email" 
                        placeholder="email@minetrack.mr" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Date d&apos;embauche</FieldLabel>
                      <Input 
                        type="date"
                        value={formData.hireDate}
                        onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Salaire</FieldLabel>
                      <Input 
                        type="number"
                        placeholder="50000"
                        value={formData.salary}
                        onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      />
                    </Field>
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={submitting}>
                    {submitting ? 'Ajout en cours...' : 'Ajouter l\'employé'}
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
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{personnel.length}</p>
                    <p className="text-sm text-muted-foreground">Total employés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-success/20 p-2">
                    <UserCheck className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                    <p className="text-sm text-muted-foreground">Actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-destructive/20 p-2">
                    <UserX className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{inactiveCount}</p>
                    <p className="text-sm text-muted-foreground">Inactifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-secondary p-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{personnel.length - activeCount}</p>
                    <p className="text-sm text-muted-foreground">Autres</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">Liste du Personnel</TabsTrigger>
              <TabsTrigger value="teams">Équipes & Quarts</TabsTrigger>
              <TabsTrigger value="planning">Planning Global</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPersonnel.map((person) => {
                  const config = statusConfig[person.status as keyof typeof statusConfig]
                  
                  return (
                    <Card key={person.id} className="border-border bg-card">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                                {person.firstName[0]}{person.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{person.firstName} {person.lastName}</span>
                                <span className={`h-2 w-2 rounded-full ${config.color}`} />
                              </div>
                              <p className="text-sm text-muted-foreground">{person.position}</p>
                              <Badge variant="outline" className="mt-1 text-xs font-mono">EMP-{person.id}</Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedPerson(person)
                                  setProfileOpen(true)
                                }}
                              >
                                Voir profil
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedPerson(person)
                                  setFormData({
                                    firstName: person.firstName,
                                    lastName: person.lastName,
                                    email: person.email,
                                    phone: person.phone || '',
                                    position: person.position,
                                    department: person.department,
                                    siteId: person.siteId.toString(),
                                    hireDate: person.hireDate,
                                    salary: person.salary?.toString() || '',
                                    role: person.role || 'ouvrier',
                                    teamId: person.teamId ? person.teamId.toString() : 'none'
                                  })
                                  setEditOpen(true)
                                }}
                              >
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedPerson(person)
                                  setPlanningOpen(true)
                                }}
                              >
                                Planning
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedPerson(person)
                                  setHistoryOpen(true)
                                }}
                              >
                                Historique
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedPerson(person)
                                  setDeleteOpen(true)
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            <span>{person.department}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{person.siteName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{person.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{person.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Embauche: {person.hireDate}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                          <Badge variant={config.variant}>{config.label}</Badge>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-6">
              {/* Section Quarts de Travail */}
              <div className="grid gap-6 lg:grid-cols-3">
                {shifts.map((shift) => {
                  const isActive = shift.status === "active"
                  const assignedCount = personnel.filter(p => Number(p.shiftId) === Number(shift.id)).length
                  const ShiftIcon = shift.name.includes("Matin") ? Sunrise : shift.name.includes("Nuit") ? Moon : Sun
                  
                  return (
                    <Card 
                      key={shift.id} 
                      className={`border-border bg-card ${isActive ? "ring-2 ring-primary" : ""}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-lg p-2 ${isActive ? "bg-primary/20" : "bg-secondary"}`}>
                              <ShiftIcon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                              <CardTitle className="text-base">{shift.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{shift.time}</p>
                            </div>
                          </div>
                          {isActive && (
                            <Badge className="bg-primary text-primary-foreground">En cours</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{assignedCount} ouvriers</span>
                          </div>
                          <Badge variant={assignedCount > 0 ? "default" : "outline"}>
                            {assignedCount > 0 ? `${assignedCount} assignés` : "Aucun"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Sites concernés:</p>
                          <div className="flex flex-wrap gap-2">
                            {shift.sites.map((site: string) => (
                              <Badge key={site} variant="outline">{site}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant={assignedCount > 0 ? "default" : "outline"}
                          className="w-full"
                          onClick={() => {
                            setSelectedShiftForAssignments(shift)
                            setShiftAssignmentsOpen(true)
                          }}
                        >
                          {assignedCount > 0 ? `Gérer ${assignedCount} affectations` : "Affecter du personnel"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Séparateur */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Équipes par Département</h3>
              </div>

              {/* Bouton Créer une équipe */}
              <div className="flex justify-end">
                <Button onClick={() => setCreateTeamOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une équipe
                </Button>
              </div>

              {Object.entries(teamsByDepartment).map(([department, deptTeams]: [string, any]) => (
                <div key={department} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold capitalize">{department}</h3>
                    <Badge variant="outline">{deptTeams.length} équipe(s)</Badge>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {deptTeams.map((team: any) => (
                      <Card key={team.id} className="border-border bg-card">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{team.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{team.site_name} • {team.workersCount} ouvriers</p>
                            </div>
                            <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                              {team.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Chef d'équipe */}
                          {team.chef && (
                            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                              <p className="text-xs text-muted-foreground mb-2">Chef d&apos;équipe</p>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                    {team.chef.firstName[0]}{team.chef.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{team.chef.firstName} {team.chef.lastName}</p>
                                  <p className="text-xs text-muted-foreground">{team.chef.email}</p>
                                </div>
                                <Badge variant="default" className="ml-auto text-xs">Chef</Badge>
                              </div>
                            </div>
                          )}

                          {/* Adjoint */}
                          {team.adjoint && (
                            <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-3">
                              <p className="text-xs text-muted-foreground mb-2">Adjoint</p>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                                    {team.adjoint.firstName[0]}{team.adjoint.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{team.adjoint.firstName} {team.adjoint.lastName}</p>
                                  <p className="text-xs text-muted-foreground">{team.adjoint.email}</p>
                                </div>
                                <Badge variant="secondary" className="ml-auto text-xs">Adjoint</Badge>
                              </div>
                            </div>
                          )}

                          {/* Liste des ouvriers */}
                          {team.workers && team.workers.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Ouvriers ({team.workers.length})</p>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {team.workers.map((worker: any) => (
                                  <div key={worker.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                                        {worker.firstName[0]}{worker.lastName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{worker.firstName} {worker.lastName}</p>
                                      <p className="text-xs text-muted-foreground truncate">{worker.position}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {!team.chef && !team.adjoint && (!team.workers || team.workers.length === 0) && (
                            <div className="text-center py-6 text-muted-foreground">
                              <p>Aucun membre dans cette équipe</p>
                              <Button variant="outline" size="sm" className="mt-2">
                                <Plus className="h-4 w-4 mr-1" />
                                Ajouter des membres
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              {teams.length === 0 && (
                <div className="text-center py-12">
                  <HardHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune équipe créée</p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-1" />
                    Créer une équipe
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Planning Global - Vue du planning de tous les employés */}
            <TabsContent value="planning" className="space-y-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Planning Hebdomadaire - Tous les Employés</CardTitle>
                  <CardDescription>Vue d&apos;ensemble des quarts de travail pour la semaine en cours</CardDescription>
                </CardHeader>
                <CardContent>
                  {personnel.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Aucun employé enregistré</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50">
                            <th className="px-3 py-3 text-left text-sm font-medium text-muted-foreground">Employé</th>
                            <th className="px-2 py-3 text-center text-xs font-medium text-muted-foreground">Lun</th>
                            <th className="px-2 py-3 text-center text-xs font-medium text-muted-foreground">Mar</th>
                            <th className="px-2 py-3 text-center text-xs font-medium text-muted-foreground">Mer</th>
                            <th className="px-2 py-3 text-center text-xs font-medium text-muted-foreground">Jeu</th>
                            <th className="px-2 py-3 text-center text-xs font-medium text-muted-foreground">Ven</th>
                            <th className="px-2 py-3 text-center text-xs font-medium text-muted-foreground">Sam</th>
                            <th className="px-2 py-3 text-center text-xs font-medium text-muted-foreground">Dim</th>
                            <th className="px-3 py-3 text-center text-sm font-medium text-muted-foreground">Shift Actuel</th>
                          </tr>
                        </thead>
                        <tbody>
                          {personnel.map((person) => {
                            // Find schedule for this person
                            const personSchedule = allSchedules.find((s: any) => s.personnelId === person.id)
                            
                            return (
                            <tr key={person.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                                      {person.firstName[0]}{person.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">{person.firstName} {person.lastName}</p>
                                    <p className="text-xs text-muted-foreground">{person.position}</p>
                                  </div>
                                </div>
                              </td>
                              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                const shiftColors: Record<string, string> = {
                                  none: 'bg-muted',
                                  matin: 'bg-primary',
                                  apresmidi: 'bg-warning',
                                  nuit: 'bg-chart-3'
                                }
                                const shiftLabels: Record<string, string> = {
                                  none: '-',
                                  matin: 'M',
                                  apresmidi: 'A',
                                  nuit: 'N'
                                }
                                // Get actual shift from schedule data
                                const shift = personSchedule?.[day] || 'none'
                                return (
                                  <td key={day} className="px-2 py-3 text-center">
                                    <div className={`w-6 h-6 rounded-full ${shiftColors[shift]} flex items-center justify-center text-xs font-bold mx-auto`}>
                                      {shiftLabels[shift]}
                                    </div>
                                  </td>
                                )
                              })}
                              <td className="px-3 py-3 text-center">
                                {person.shiftId ? (
                                  <Badge className={person.shiftId === 1 ? 'bg-primary' : person.shiftId === 2 ? 'bg-warning' : 'bg-chart-3'}>
                                    {person.shiftId === 1 ? 'Matin' : person.shiftId === 2 ? 'Après-midi' : 'Nuit'}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Non assigné</Badge>
                                )}
                              </td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* Légende */}
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">M</div>
                      <span>Matin (06h-14h)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-warning flex items-center justify-center text-xs font-bold">A</div>
                      <span>Après-midi (14h-22h)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-chart-3 flex items-center justify-center text-xs font-bold">N</div>
                      <span>Nuit (22h-06h)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-xs font-bold">-</div>
                      <span>Repos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Modal Voir Profil */}
          <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Profil de l&apos;Employé</DialogTitle>
              </DialogHeader>
              {selectedPerson && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary/20 text-primary text-xl font-semibold">
                        {selectedPerson.firstName[0]}{selectedPerson.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedPerson.firstName} {selectedPerson.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{selectedPerson.position}</p>
                      <Badge variant={statusConfig[selectedPerson.status as keyof typeof statusConfig]?.variant || 'default'} className="mt-1">
                        {statusConfig[selectedPerson.status as keyof typeof statusConfig]?.label || selectedPerson.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">ID</p>
                      <p className="font-medium">EMP-{selectedPerson.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Département</p>
                      <p className="font-medium">{selectedPerson.department}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Site</p>
                    <p className="font-medium">{selectedPerson.siteName} ({selectedPerson.siteCode})</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedPerson.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{selectedPerson.phone || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date d&apos;embauche</p>
                      <p className="font-medium">{selectedPerson.hireDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salaire</p>
                      <p className="font-medium">{selectedPerson.salary ? `${selectedPerson.salary} MRU` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Modal Modifier */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Modifier l&apos;Employé</DialogTitle>
                <DialogDescription>
                  {selectedPerson && `Modifier les informations de ${selectedPerson.firstName} ${selectedPerson.lastName}`}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdate}>
                <FieldGroup className="gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Prénom</FieldLabel>
                      <Input 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Nom</FieldLabel>
                      <Input 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                      />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>Poste</FieldLabel>
                    <Input 
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      required
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Téléphone</FieldLabel>
                      <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Date d&apos;embauche</FieldLabel>
                      <Input 
                        type="date"
                        value={formData.hireDate}
                        onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Salaire</FieldLabel>
                      <Input 
                        type="number"
                        value={formData.salary}
                        onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      />
                    </Field>
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={submitting}>
                    {submitting ? 'Modification en cours...' : 'Enregistrer les modifications'}
                  </Button>
                </FieldGroup>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal Planning */}
          <Dialog open={planningOpen} onOpenChange={(open) => {
            setPlanningOpen(open)
            if (open && selectedPerson) fetchSchedule(selectedPerson.id)
          }}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Planning Hebdomadaire</DialogTitle>
                <DialogDescription>
                  {selectedPerson && `Définir les quarts de travail pour ${selectedPerson.firstName} ${selectedPerson.lastName}`}
                </DialogDescription>
              </DialogHeader>
              {selectedPerson && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Employé</p>
                      <p className="font-medium">{selectedPerson.firstName} {selectedPerson.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Poste</p>
                      <p className="font-medium">{selectedPerson.position}</p>
                    </div>
                  </div>
                  
                  {/* Planning par jour - UI améliorée */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Cliquez sur un jour pour modifier</p>
                    <div className="grid grid-cols-7 gap-2">
                      {[
                        { key: 'monday', label: 'Lun', full: 'Lundi' },
                        { key: 'tuesday', label: 'Mar', full: 'Mardi' },
                        { key: 'wednesday', label: 'Mer', full: 'Mercredi' },
                        { key: 'thursday', label: 'Jeu', full: 'Jeudi' },
                        { key: 'friday', label: 'Ven', full: 'Vendredi' },
                        { key: 'saturday', label: 'Sam', full: 'Samedi' },
                        { key: 'sunday', label: 'Dim', full: 'Dimanche' }
                      ].map((day) => {
                        const shift = scheduleData[day.key as keyof typeof scheduleData]
                        const colors = {
                          none: 'bg-muted hover:bg-muted/80',
                          matin: 'bg-primary text-primary-foreground hover:bg-primary/90',
                          apresmidi: 'bg-warning text-warning-foreground hover:bg-warning/90',
                          nuit: 'bg-chart-3 text-foreground hover:bg-chart-3/90'
                        }
                        const labels = {
                          none: 'R',
                          matin: 'M',
                          apresmidi: 'A',
                          nuit: 'N'
                        }
                        
                        return (
                          <button
                            key={day.key}
                            onClick={() => {
                              const shifts = ['none', 'matin', 'apresmidi', 'nuit']
                              const currentIndex = shifts.indexOf(shift)
                              const nextShift = shifts[(currentIndex + 1) % shifts.length]
                              setScheduleData({...scheduleData, [day.key]: nextShift})
                            }}
                            className={`p-3 rounded-lg transition-all ${colors[shift as keyof typeof colors]} cursor-pointer`}
                            title={`${day.full}: ${shift === 'none' ? 'Repos' : shift === 'matin' ? 'Matin (06h-14h)' : shift === 'apresmidi' ? 'Après-midi (14h-22h)' : 'Nuit (22h-06h)'}`}
                          >
                            <p className="text-xs font-medium">{day.label}</p>
                            <p className="text-lg font-bold mt-1">{labels[shift as keyof typeof labels]}</p>
                          </button>
                        )
                      })}
                    </div>
                    
                    {/* Légende */}
                    <div className="flex flex-wrap gap-3 mt-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-primary" />
                        <span>Matin (06h-14h)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-warning" />
                        <span>Après-midi (14h-22h)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-chart-3" />
                        <span>Nuit (22h-06h)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-muted" />
                        <span>Repos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => setPlanningOpen(false)}
                      disabled={submitting}
                    >
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleSaveSchedule}
                      disabled={submitting}
                    >
                      {submitting ? 'Enregistrement...' : 'Enregistrer le planning'}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Modal Historique */}
          <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Historique de l&apos;Employé</DialogTitle>
                <DialogDescription>
                  {selectedPerson && `Historique de ${selectedPerson.firstName} ${selectedPerson.lastName}`}
                </DialogDescription>
              </DialogHeader>
              {selectedPerson && (
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{new Date(selectedPerson.createdAt).toLocaleDateString('fr-FR')}</p>
                      <p className="font-medium">Employé créé</p>
                      <p className="text-sm text-muted-foreground">Ajout au système de gestion</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{new Date(selectedPerson.hireDate).toLocaleDateString('fr-FR')}</p>
                      <p className="font-medium">Date d&apos;embauche</p>
                      <p className="text-sm text-muted-foreground">Début du contrat</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{new Date(selectedPerson.updatedAt).toLocaleDateString('fr-FR')}</p>
                      <p className="font-medium">Dernière mise à jour</p>
                      <p className="text-sm text-muted-foreground">Modification des informations</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Site: {selectedPerson.siteName}</p>
                    <p className="text-sm text-muted-foreground">Statut actuel: {statusConfig[selectedPerson.status as keyof typeof statusConfig]?.label || selectedPerson.status}</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Modal Confirmation Suppression */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Confirmer la suppression
                </DialogTitle>
                <DialogDescription>
                  {selectedPerson && (
                    <span>
                      Êtes-vous sûr de vouloir supprimer <strong>{selectedPerson.firstName} {selectedPerson.lastName}</strong> ?
                      <br />
                      Cette action est irréversible.
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteOpen(false)}
                  disabled={submitting}
                >
                  Annuler
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={submitting}
                >
                  {submitting ? 'Suppression...' : 'Supprimer'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal Créer une Équipe */}
          <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Créer une Nouvelle Équipe</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer une nouvelle équipe.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTeam}>
                <FieldGroup className="space-y-4 py-4">
                  <Field>
                    <FieldLabel>Nom de l&apos;équipe</FieldLabel>
                    <Input 
                      placeholder="Ex: Équipe Alpha" 
                      value={teamFormData.name}
                      onChange={(e) => setTeamFormData({...teamFormData, name: e.target.value})}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Code</FieldLabel>
                    <Input 
                      placeholder="Ex: ALPHA-001" 
                      value={teamFormData.code}
                      onChange={(e) => setTeamFormData({...teamFormData, code: e.target.value})}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Département</FieldLabel>
                    <Select 
                      value={teamFormData.department}
                      onValueChange={(value) => setTeamFormData({...teamFormData, department: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="extraction">Extraction</SelectItem>
                        <SelectItem value="forage">Forage</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="terrassement">Terrassement</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Site</FieldLabel>
                    <Select 
                      value={teamFormData.siteId}
                      onValueChange={(value) => setTeamFormData({...teamFormData, siteId: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un site" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Zouérate</SelectItem>
                        <SelectItem value="2">Akjoujt</SelectItem>
                        <SelectItem value="3">Tasiast</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Quart de travail (optionnel)</FieldLabel>
                    <Select 
                      value={teamFormData.shiftId}
                      onValueChange={(value) => setTeamFormData({...teamFormData, shiftId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un quart" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucun</SelectItem>
                        {shifts.map((shift: any) => (
                          <SelectItem key={shift.id} value={shift.id.toString()}>
                            {shift.name} ({shift.startTime}-{shift.endTime})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCreateTeamOpen(false)}
                    disabled={submitting}
                    type="button"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Création...' : 'Créer l\'équipe'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal Affectations du Shift */}
          <Dialog open={shiftAssignmentsOpen} onOpenChange={setShiftAssignmentsOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Affectations - {selectedShiftForAssignments?.name}</DialogTitle>
                <DialogDescription>
                  Employés assignés à ce quart de travail ({selectedShiftForAssignments?.time})
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {personnel.filter(p => Number(p.shiftId) === Number(selectedShiftForAssignments?.id)).length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">Aucun employé assigné à ce shift</p>
                    
                    {/* Liste des employés sans shift */}
                    <div className="text-left">
                      <p className="text-sm font-medium mb-2">Employés disponibles :</p>
                      {personnel.filter(p => !p.shiftId).length === 0 ? (
                        <p className="text-sm text-muted-foreground">Tous les employés ont un shift assigné</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {personnel
                            .filter(p => !p.shiftId)
                            .map(person => (
                              <div key={person.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                                    {person.firstName[0]}{person.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{person.firstName} {person.lastName}</p>
                                  <p className="text-xs text-muted-foreground truncate">{person.position}</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={async () => {
                                    try {
                                      const response = await fetch('/api/personnel/shift', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          id: person.id,
                                          shiftId: selectedShiftForAssignments?.id
                                        })
                                      })
                                      if (response.ok) {
                                        fetchPersonnel()
                                      }
                                    } catch (error) {
                                      console.error('Error assigning shift:', error)
                                    }
                                  }}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  personnel
                    .filter(p => Number(p.shiftId) === Number(selectedShiftForAssignments?.id))
                    .map(person => (
                      <div key={person.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                            {person.firstName[0]}{person.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{person.firstName} {person.lastName}</p>
                          <p className="text-sm text-muted-foreground">{person.position} • {person.siteName}</p>
                        </div>
                        <Badge variant="outline">{person.department}</Badge>
                      </div>
                    ))
                )}
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setShiftAssignmentsOpen(false)}>Fermer</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal de Validation du Planning */}
          <Dialog open={validationOpen} onOpenChange={setValidationOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Valider le Planning</DialogTitle>
                <DialogDescription>
                  Confirmez les quarts de travail pour {selectedPerson?.firstName} {selectedPerson?.lastName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Récapitulatif de la semaine</h4>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {[
                      { day: 'Lun', shift: scheduleData.monday },
                      { day: 'Mar', shift: scheduleData.tuesday },
                      { day: 'Mer', shift: scheduleData.wednesday },
                      { day: 'Jeu', shift: scheduleData.thursday },
                      { day: 'Ven', shift: scheduleData.friday },
                      { day: 'Sam', shift: scheduleData.saturday },
                      { day: 'Dim', shift: scheduleData.sunday },
                    ].map(({ day, shift }) => {
                      const shiftColors: Record<string, string> = {
                        none: 'bg-muted text-muted-foreground',
                        matin: 'bg-primary text-primary-foreground',
                        apresmidi: 'bg-warning text-warning-foreground',
                        nuit: 'bg-chart-3 text-foreground'
                      }
                      const shiftLabels: Record<string, string> = {
                        none: '-',
                        matin: 'M',
                        apresmidi: 'A',
                        nuit: 'N'
                      }
                      return (
                        <div key={day} className="flex flex-col items-center gap-1">
                          <span className="text-xs text-muted-foreground">{day}</span>
                          <div className={`w-8 h-8 rounded-full ${shiftColors[shift]} flex items-center justify-center text-sm font-bold`}>
                            {shiftLabels[shift]}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Détails :</p>
                  <ul className="space-y-1">
                    <li>• Employé : {selectedPerson?.firstName} {selectedPerson?.lastName}</li>
                    <li>• Poste : {selectedPerson?.position}</li>
                    <li>• Semaine : {new Date().toLocaleDateString('fr-FR')}</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setValidationOpen(false)}
                  disabled={submitting}
                >
                  Modifier
                </Button>
                <Button 
                  onClick={confirmSaveSchedule}
                  disabled={submitting}
                >
                  {submitting ? 'Enregistrement...' : 'Confirmer'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
