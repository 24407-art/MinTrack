"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MapPin,
  BarChart3,
  Truck,
  Users,
  ShieldAlert,
  FileText,
  Settings,
  Bell,
  HardHat,
  Mountain,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { name: "Sites Miniers", href: "/sites", icon: MapPin },
  { name: "Production", href: "/production", icon: BarChart3 },
  { name: "Équipements", href: "/equipements", icon: Truck },
  { name: "Personnel", href: "/personnel", icon: Users },
  { name: "Sécurité", href: "/securite", icon: ShieldAlert, badge: 3 },
  { name: "Rapports", href: "/rapports", icon: FileText },
]

const secondaryNav = [
  { name: "Paramètres", href: "/parametres", icon: Settings },
]

export function MiningSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Mountain className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">MineTrack</span>
          <span className="text-xs text-muted-foreground">Mauritanie</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Principal
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}

        <div className="my-4 border-t border-sidebar-border" />

        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Système
        </p>
        {secondaryNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <HardHat className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">Mohamed Ould</p>
            <p className="truncate text-xs text-muted-foreground">Directeur Opérations</p>
          </div>
          <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </div>
      </div>
    </aside>
  )
}
