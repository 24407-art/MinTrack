import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend } from '@/lib/backend-api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query: Record<string, string> = {}
  const siteId = searchParams.get('siteId')
  if (siteId) query.siteId = siteId
  return proxyToBackend(request, '/reports', { query })
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/reports')
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...body } = data
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/reports/${id}`, { method: 'PUT', body })
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/reports/${id}`, { method: 'DELETE' })
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 })
  }
}
