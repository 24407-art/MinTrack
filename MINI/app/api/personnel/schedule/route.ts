import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend } from '@/lib/backend-api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query: Record<string, string> = {}
  const personnelId = searchParams.get('personnelId')
  const weekStart = searchParams.get('weekStart')
  if (personnelId) query.personnelId = personnelId
  if (weekStart) query.weekStart = weekStart
  return proxyToBackend(request, '/personnel/schedule', { query })
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...body } = data
    if (id) {
      return proxyToBackend(request, `/personnel/schedule/${id}`, { method: 'PUT', body })
    }
    return proxyToBackend(request, '/personnel/schedule', { method: 'POST', body })
  } catch (error) {
    console.error('Error saving schedule:', error)
    return NextResponse.json({ error: 'Failed to save schedule' }, { status: 500 })
  }
}
