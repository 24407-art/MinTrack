import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend, getAuthHeader, fetchBackend } from '@/lib/backend-api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query: Record<string, string> = {}
  const siteId = searchParams.get('siteId')
  if (siteId) query.siteId = siteId

  const auth = await getAuthHeader(request)
  const [production, sites] = await Promise.all([
    fetchBackend(`/production?${new URLSearchParams(query).toString()}`, auth),
    fetchBackend('/sites', auth),
  ])
  const siteMap = new Map<number, any>((sites || []).map((s: any) => [s.id, s]))
  const enriched = (production || []).map((p: any) => ({
    ...p,
    siteName: siteMap.get(p.siteId)?.name || '',
    siteCode: siteMap.get(p.siteId)?.code || '',
    siteMineral: siteMap.get(p.siteId)?.mineral || '',
  }))
  return NextResponse.json(enriched)
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/production')
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...body } = data
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/production/${id}`, { method: 'PUT', body })
  } catch (error) {
    console.error('Error updating production:', error)
    return NextResponse.json({ error: 'Failed to update production' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/production/${id}`, { method: 'DELETE' })
  } catch (error) {
    console.error('Error deleting production:', error)
    return NextResponse.json({ error: 'Failed to delete production' }, { status: 500 })
  }
}
