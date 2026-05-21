"use client"

import { useState } from "react"
import { 
  Mountain, 
  Home, 
  ClipboardList, 
  AlertTriangle, 
  User,
  Bell,
  ChevronRight,
  Plus,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  ChevronLeft,
  Send,
  Truck,
  HardHat,
  Calendar,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type MobileScreen = "home" | "production" | "incident" | "planning" | "profile"

export default function MobileMockupPage() {
  const [currentScreen, setCurrentScreen] = useState<MobileScreen>("home")
  const [isOnline, setIsOnline] = useState(true)
  const [showIncidentForm, setShowIncidentForm] = useState(false)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Application Mobile MineTrack</h1>
          <p className="mt-2 text-muted-foreground">Maquette de l&apos;application terrain pour les opérateurs</p>
        </div>

        {/* Mobile Frame */}
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
          {/* Phone Mockup */}
          <div className="relative">
            <div className="relative mx-auto h-[700px] w-[350px] overflow-hidden rounded-[3rem] border-[8px] border-neutral-800 bg-background shadow-2xl">
              {/* Status Bar */}
              <div className="flex h-8 items-center justify-between bg-secondary px-6 text-xs text-muted-foreground">
                <span>09:41</span>
                <div className="flex items-center gap-2">
                  <Signal className="h-3 w-3" />
                  {isOnline ? (
                    <Wifi className="h-3 w-3 text-success" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-destructive" />
                  )}
                  <Battery className="h-3 w-3" />
                </div>
              </div>

              {/* Dynamic Notch */}
              <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-neutral-800" />

              {/* Screen Content */}
              <div className="h-[calc(100%-8rem)] overflow-y-auto">
                {currentScreen === "home" && <HomeScreen setScreen={setCurrentScreen} />}
                {currentScreen === "production" && <ProductionScreen onBack={() => setCurrentScreen("home")} />}
                {currentScreen === "incident" && (
                  <IncidentScreen 
                    onBack={() => setCurrentScreen("home")} 
                    showForm={showIncidentForm}
                    setShowForm={setShowIncidentForm}
                  />
                )}
                {currentScreen === "planning" && <PlanningScreen onBack={() => setCurrentScreen("home")} />}
                {currentScreen === "profile" && <ProfileScreen onBack={() => setCurrentScreen("home")} />}
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 flex h-16 items-center justify-around border-t border-border bg-card">
                <NavButton 
                  icon={<Home className="h-5 w-5" />} 
                  label="Accueil" 
                  active={currentScreen === "home"}
                  onClick={() => setCurrentScreen("home")}
                />
                <NavButton 
                  icon={<ClipboardList className="h-5 w-5" />} 
                  label="Production" 
                  active={currentScreen === "production"}
                  onClick={() => setCurrentScreen("production")}
                />
                <NavButton 
                  icon={<AlertTriangle className="h-5 w-5" />} 
                  label="Incident" 
                  active={currentScreen === "incident"}
                  onClick={() => { setCurrentScreen("incident"); setShowIncidentForm(false); }}
                  badge={2}
                />
                <NavButton 
                  icon={<Calendar className="h-5 w-5" />} 
                  label="Planning" 
                  active={currentScreen === "planning"}
                  onClick={() => setCurrentScreen("planning")}
                />
                <NavButton 
                  icon={<User className="h-5 w-5" />} 
                  label="Profil" 
                  active={currentScreen === "profile"}
                  onClick={() => setCurrentScreen("profile")}
                />
              </div>
            </div>
          </div>

          {/* Features Description */}
          <div className="w-full max-w-md space-y-4 lg:pt-8">
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                    <WifiOff className="h-4 w-4 text-primary" />
                  </div>
                  Mode Hors-ligne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Saisie des données de production même sans connexion. Synchronisation automatique au retour du réseau.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => setIsOnline(!isOnline)}
                >
                  {isOnline ? "Simuler hors-ligne" : "Simuler en ligne"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  Alertes Push
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Notifications instantanées pour les pannes équipement, dépassements de seuils et alertes sécurité.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                    <Camera className="h-4 w-4 text-accent" />
                  </div>
                  Capture Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Documentation visuelle des incidents et anomalies avec géolocalisation automatique.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  Géolocalisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Suivi de position pour les opérateurs terrain et localisation précise des incidents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavButton({ 
  icon, 
  label, 
  active, 
  onClick,
  badge 
}: { 
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  badge?: number
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-1 px-3 py-2 transition-colors",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      <div className="relative">
        {icon}
        {badge && (
          <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px]">{label}</span>
    </button>
  )
}

function HomeScreen({ setScreen }: { setScreen: (screen: MobileScreen) => void }) {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Mountain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bonjour,</p>
            <p className="font-semibold text-foreground">Mohamed Ould Ahmed</p>
          </div>
        </div>
        <button className="relative rounded-full bg-secondary p-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </button>
      </div>

      {/* Current Shift */}
      <Card className="mb-4 border-primary/30 bg-primary/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Quart actuel</p>
              <p className="font-semibold text-foreground">Matin - 06:00 à 14:00</p>
              <p className="text-xs text-muted-foreground">Site: Zouerate Nord</p>
            </div>
            <div className="text-right">
              <Badge className="bg-success text-success-foreground">En cours</Badge>
              <p className="mt-1 text-xs text-muted-foreground">5h restantes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <QuickAction 
          icon={<Plus className="h-5 w-5" />}
          label="Saisir Production"
          color="bg-primary"
          onClick={() => setScreen("production")}
        />
        <QuickAction 
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Déclarer Incident"
          color="bg-destructive"
          onClick={() => setScreen("incident")}
        />
        <QuickAction 
          icon={<Truck className="h-5 w-5" />}
          label="État Équipement"
          color="bg-accent"
        />
        <QuickAction 
          icon={<FileText className="h-5 w-5" />}
          label="Mes Rapports"
          color="bg-chart-3"
        />
      </div>

      {/* Today's Stats */}
      <h3 className="mb-3 text-sm font-semibold text-foreground">Statistiques du jour</h3>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <StatCard 
          label="Production" 
          value="2,450" 
          unit="tonnes" 
          trend="+12%"
          trendUp={true}
        />
        <StatCard 
          label="Objectif" 
          value="78%" 
          unit="atteint" 
          trend="+5%"
          trendUp={true}
        />
      </div>

      {/* Recent Alerts */}
      <h3 className="mb-3 text-sm font-semibold text-foreground">Alertes récentes</h3>
      <div className="space-y-2">
        <AlertItem 
          type="warning"
          title="Maintenance préventive"
          description="Camion CAT-789D requiert inspection"
          time="Il y a 30 min"
        />
        <AlertItem 
          type="danger"
          title="Seuil dépassé"
          description="Température moteur excavatrice #3"
          time="Il y a 1h"
        />
      </div>
    </div>
  )
}

function QuickAction({ 
  icon, 
  label, 
  color,
  onClick 
}: { 
  icon: React.ReactNode
  label: string
  color: string
  onClick?: () => void
}) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-xl bg-card p-4 transition-transform active:scale-95"
    >
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-full text-primary-foreground", color)}>
        {icon}
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </button>
  )
}

function StatCard({ 
  label, 
  value, 
  unit, 
  trend, 
  trendUp 
}: { 
  label: string
  value: string
  unit: string
  trend: string
  trendUp: boolean
}) {
  return (
    <div className="rounded-xl bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{unit}</span>
        <span className={cn("text-xs font-medium", trendUp ? "text-success" : "text-destructive")}>
          {trend}
        </span>
      </div>
    </div>
  )
}

function AlertItem({ 
  type, 
  title, 
  description, 
  time 
}: { 
  type: "warning" | "danger"
  title: string
  description: string
  time: string
}) {
  return (
    <div className={cn(
      "flex items-start gap-3 rounded-lg p-3",
      type === "warning" ? "bg-warning/10" : "bg-destructive/10"
    )}>
      <div className={cn(
        "mt-0.5 rounded-full p-1",
        type === "warning" ? "bg-warning" : "bg-destructive"
      )}>
        <AlertTriangle className={cn(
          "h-3 w-3",
          type === "warning" ? "text-warning-foreground" : "text-destructive-foreground"
        )} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="mt-1 text-xs text-muted-foreground">{time}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}

function ProductionScreen({ onBack }: { onBack: () => void }) {
  const [quantity, setQuantity] = useState("")

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={onBack} className="rounded-full bg-secondary p-2">
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">Saisie Production</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Site</label>
          <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">Zouerate Nord - Secteur A</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Type de minerai</label>
          <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
            <Mountain className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">Fer - Hématite</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Quantité extraite (tonnes)</label>
          <Input 
            type="number" 
            placeholder="0" 
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="bg-secondary text-center text-2xl font-bold"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Équipement utilisé</label>
          <select className="w-full rounded-lg bg-secondary p-3 text-sm text-foreground">
            <option>EXC-001 - Excavatrice Caterpillar</option>
            <option>EXC-002 - Excavatrice Komatsu</option>
            <option>CAM-005 - Camion Benne 40T</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Observations</label>
          <Textarea 
            placeholder="Notes additionnelles..."
            className="bg-secondary"
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span className="text-xs text-muted-foreground">Données sauvegardées localement</span>
        </div>

        <Button className="w-full gap-2">
          <Send className="h-4 w-4" />
          Envoyer la saisie
        </Button>
      </div>
    </div>
  )
}

function IncidentScreen({ 
  onBack, 
  showForm, 
  setShowForm 
}: { 
  onBack: () => void
  showForm: boolean
  setShowForm: (show: boolean) => void
}) {
  if (showForm) {
    return (
      <div className="p-4">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => setShowForm(false)} className="rounded-full bg-secondary p-2">
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Déclarer un incident</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Type d&apos;incident</label>
            <select className="w-full rounded-lg bg-secondary p-3 text-sm text-foreground">
              <option>Accident corporel</option>
              <option>Panne équipement</option>
              <option>Incident environnemental</option>
              <option>Quasi-accident</option>
              <option>Autre</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Niveau de gravité</label>
            <div className="grid grid-cols-3 gap-2">
              <button className="rounded-lg bg-warning/20 p-3 text-center text-sm font-medium text-warning">
                Mineur
              </button>
              <button className="rounded-lg bg-chart-4/20 p-3 text-center text-sm font-medium text-chart-4">
                Modéré
              </button>
              <button className="rounded-lg bg-destructive/20 p-3 text-center text-sm font-medium text-destructive">
                Grave
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
            <Textarea 
              placeholder="Décrivez l'incident en détail..."
              className="bg-secondary"
              rows={4}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Photos</label>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary p-6">
              <Camera className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ajouter des photos</span>
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Position: 22.7356° N, 12.4892° W</span>
          </div>

          <Button className="w-full gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90">
            <AlertTriangle className="h-4 w-4" />
            Soumettre l&apos;incident
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={onBack} className="rounded-full bg-secondary p-2">
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">Incidents & Sécurité</h2>
      </div>

      <Button 
        onClick={() => setShowForm(true)}
        className="mb-6 w-full gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        <Plus className="h-4 w-4" />
        Déclarer un incident
      </Button>

      <h3 className="mb-3 text-sm font-semibold text-foreground">Incidents récents</h3>
      <div className="space-y-3">
        <IncidentCard 
          title="Panne hydraulique"
          location="Secteur B - Zone 3"
          time="Aujourd'hui, 08:45"
          status="En cours"
          severity="warning"
        />
        <IncidentCard 
          title="Glissement terrain"
          location="Secteur A - Talus Nord"
          time="Hier, 14:20"
          status="Résolu"
          severity="danger"
        />
        <IncidentCard 
          title="Fuite carburant"
          location="Dépôt central"
          time="22/03/2026"
          status="Résolu"
          severity="warning"
        />
      </div>
    </div>
  )
}

function IncidentCard({ 
  title, 
  location, 
  time, 
  status, 
  severity 
}: { 
  title: string
  location: string
  time: string
  status: string
  severity: "warning" | "danger"
}) {
  return (
    <div className="rounded-xl bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn(
            "mt-1 rounded-full p-2",
            severity === "warning" ? "bg-warning/20" : "bg-destructive/20"
          )}>
            <AlertTriangle className={cn(
              "h-4 w-4",
              severity === "warning" ? "text-warning" : "text-destructive"
            )} />
          </div>
          <div>
            <p className="font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{location}</p>
            <p className="mt-1 text-xs text-muted-foreground">{time}</p>
          </div>
        </div>
        <Badge variant={status === "Résolu" ? "outline" : "default"} className={cn(
          status === "Résolu" 
            ? "border-success text-success" 
            : "bg-warning text-warning-foreground"
        )}>
          {status}
        </Badge>
      </div>
    </div>
  )
}

function PlanningScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={onBack} className="rounded-full bg-secondary p-2">
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">Mon Planning</h2>
      </div>

      {/* Week View */}
      <div className="mb-6 flex justify-between rounded-xl bg-card p-3">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => (
          <div 
            key={day} 
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-2 py-1",
              i === 1 && "bg-primary text-primary-foreground"
            )}
          >
            <span className="text-xs">{day}</span>
            <span className="text-sm font-semibold">{24 + i}</span>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-sm font-semibold text-foreground">Aujourd&apos;hui - 25 Mars</h3>
      <div className="space-y-3">
        <ShiftCard 
          shift="Matin"
          time="06:00 - 14:00"
          site="Zouerate Nord"
          role="Opérateur Excavatrice"
          status="current"
        />
        <ShiftCard 
          shift="Briefing sécurité"
          time="13:30 - 14:00"
          site="Salle de réunion"
          role="Obligatoire"
          status="upcoming"
        />
      </div>

      <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">Demain - 26 Mars</h3>
      <div className="space-y-3">
        <ShiftCard 
          shift="Après-midi"
          time="14:00 - 22:00"
          site="Zouerate Sud"
          role="Opérateur Camion"
          status="scheduled"
        />
      </div>
    </div>
  )
}

function ShiftCard({ 
  shift, 
  time, 
  site, 
  role, 
  status 
}: { 
  shift: string
  time: string
  site: string
  role: string
  status: "current" | "upcoming" | "scheduled"
}) {
  return (
    <div className={cn(
      "rounded-xl p-4",
      status === "current" 
        ? "border border-primary/30 bg-primary/10" 
        : "bg-card"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HardHat className="h-4 w-4 text-primary" />
            <p className="font-medium text-foreground">{shift}</p>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{time}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{site}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{role}</p>
        </div>
        {status === "current" && (
          <Badge className="bg-success text-success-foreground">En cours</Badge>
        )}
      </div>
    </div>
  )
}

function ProfileScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={onBack} className="rounded-full bg-secondary p-2">
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">Mon Profil</h2>
      </div>

      {/* Profile Header */}
      <div className="mb-6 flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
          MA
        </div>
        <h3 className="mt-3 text-lg font-semibold text-foreground">Mohamed Ould Ahmed</h3>
        <p className="text-sm text-muted-foreground">Opérateur Senior</p>
        <Badge className="mt-2 bg-success/20 text-success">Actif</Badge>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-card p-3 text-center">
          <p className="text-xl font-bold text-primary">156</p>
          <p className="text-xs text-muted-foreground">Jours travaillés</p>
        </div>
        <div className="rounded-xl bg-card p-3 text-center">
          <p className="text-xl font-bold text-success">0</p>
          <p className="text-xs text-muted-foreground">Incidents</p>
        </div>
        <div className="rounded-xl bg-card p-3 text-center">
          <p className="text-xl font-bold text-foreground">4.8</p>
          <p className="text-xs text-muted-foreground">Performance</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        <ProfileMenuItem icon={<User className="h-5 w-5" />} label="Informations personnelles" />
        <ProfileMenuItem icon={<FileText className="h-5 w-5" />} label="Mes certifications" />
        <ProfileMenuItem icon={<Bell className="h-5 w-5" />} label="Notifications" badge="3" />
        <ProfileMenuItem icon={<HardHat className="h-5 w-5" />} label="Formations sécurité" />
      </div>
    </div>
  )
}

function ProfileMenuItem({ 
  icon, 
  label, 
  badge 
}: { 
  icon: React.ReactNode
  label: string
  badge?: string
}) {
  return (
    <button className="flex w-full items-center justify-between rounded-xl bg-card p-4">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <Badge variant="secondary" className="bg-destructive text-destructive-foreground">
            {badge}
          </Badge>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  )
}
