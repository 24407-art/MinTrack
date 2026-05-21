import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend, getAuthHeader, fetchBackend } from '@/lib/backend-api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query: Record<string, string> = {}
  const siteId = searchParams.get('siteId')
  const teamId = searchParams.get('teamId')
  if (siteId) query.siteId = siteId
  if (teamId) query.teamId = teamId

  const auth = await getAuthHeader(request)
  const [personnel, sites] = await Promise.all([
    fetchBackend(`/personnel?${new URLSearchParams(query).toString()}`, auth),
    fetchBackend('/sites', auth),
  ])
  const siteMap = new Map<number, any>((sites || []).map((s: any) => [s.id, s]))
  const enriched = (personnel || []).map((p: any) => ({
    ...p,
    siteName: siteMap.get(p.siteId)?.name || '',
    siteCode: siteMap.get(p.siteId)?.code || '',
  }))
  return NextResponse.json(enriched)
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/personnel')
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...body } = data
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/personnel/${id}`, { method: 'PUT', body })
  } catch (error) {
    console.error('Error updating personnel:', error)
    return NextResponse.json({ error: 'Failed to update personnel' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/personnel/${id}`, { method: 'DELETE' })
  } catch (error) {
    console.error('Error deleting personnel:', error)
    return NextResponse.json({ error: 'Failed to delete personnel' }, { status: 500 })
  }
}
