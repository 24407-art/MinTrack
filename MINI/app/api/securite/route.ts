import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend, getAuthHeader, fetchBackend } from '@/lib/backend-api'

export async function GET(request: NextRequest) {
  const auth = await getAuthHeader(request)
  const [reports, sites] = await Promise.all([
    fetchBackend('/reports?type=security', auth),
    fetchBackend('/sites', auth),
  ])
  const siteMap = new Map<number, any>((sites || []).map((s: any) => [s.id, s]))
  const enriched = (reports || []).map((r: any) => ({
    ...r,
    siteName: siteMap.get(r.siteId)?.name || '',
    siteCode: siteMap.get(r.siteId)?.code || '',
  }))
  return NextResponse.json(enriched)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const body = { ...data, type: 'security' }
    return proxyToBackend(request, '/reports', { method: 'POST', body })
  } catch (error) {
    console.error('Error creating security report:', error)
    return NextResponse.json({ error: 'Failed to create security report' }, { status: 500 })
  }
}
