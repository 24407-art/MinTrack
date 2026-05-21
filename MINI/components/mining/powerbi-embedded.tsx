"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface PowerBIEmbeddedProps {
  reportId?: string
  embedUrl?: string
  accessToken?: string
  title?: string
}

// Composant pour intégrer Power BI Embedded
export function PowerBIEmbedded({ 
  reportId = "YOUR_REPORT_ID",
  embedUrl = "YOUR_EMBED_URL", 
  accessToken = "YOUR_ACCESS_TOKEN",
  title = "Analyse Power BI"
}: PowerBIEmbeddedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Script Power BI Embed
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/powerbi-client@2.21.1/dist/powerbi.min.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Méthode simple avec iframe (pour démonstration)
  // En production, utilisez le SDK Power BI avec authentification
  const embedUrlWithParams = `${embedUrl}?rs:Embed=true&filterPaneEnabled=false&navContentPaneEnabled=false`

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-foreground">
          {title}
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <a 
            href={`https://app.powerbi.com/groups/me/reports/${reportId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-1 h-4 w-4" />
            Ouvrir dans Power BI
          </a>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full" style={{ height: '400px' }}>
          <iframe
            ref={iframeRef}
            src={embedUrlWithParams}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            allowFullScreen
            title={title}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Composant pour lier vers Power BI avec données filtrées
interface PowerBILinkProps {
  reportId: string
  filters?: Record<string, string>
  children: React.ReactNode
}

export function PowerBILink({ reportId, filters, children }: PowerBILinkProps) {
  const buildPowerBIUrl = () => {
    const baseUrl = `https://app.powerbi.com/groups/me/reports/${reportId}`
    if (!filters || Object.keys(filters).length === 0) return baseUrl
    
    const filterParams = Object.entries(filters)
      .map(([key, value]) => `filter=${key} eq '${value}'`)
      .join('&')
    
    return `${baseUrl}?${filterParams}`
  }

  return (
    <a 
      href={buildPowerBIUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {children}
    </a>
  )
}
