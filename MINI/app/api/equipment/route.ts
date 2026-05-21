import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend, getAuthHeader, fetchBackend } from '@/lib/backend-api'

export async function GET(request: Request) {
  const auth = await getAuthHeader(request)
  const [equipment, sites] = await Promise.all([
    fetchBackend('/equipment', auth),
    fetchBackend('/sites', auth),
  ])
  const siteMap = new Map<number, any>((sites || []).map((s: any) => [s.id, s]))
  const enriched = (equipment || []).map((e: any) => ({
    ...e,
    siteName: siteMap.get(e.siteId)?.name || '',
    siteCode: siteMap.get(e.siteId)?.code || '',
  }))
  return NextResponse.json(enriched)
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/equipment')
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...body } = data
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/equipment/${id}`, { method: 'PUT', body })
  } catch (error) {
    console.error('Error updating equipment:', error)
    return NextResponse.json({ error: 'Failed to update equipment' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/equipment/${id}`, { method: 'DELETE' })
  } catch (error) {
    console.error('Error deleting equipment:', error)
    return NextResponse.json({ error: 'Failed to delete equipment' }, { status: 500 })
  }
}
