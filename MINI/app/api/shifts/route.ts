import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend } from '@/lib/backend-api'

export async function GET(request: Request) {
  const response = await proxyToBackend(request, '/shifts')
  const data = await response.json()
  if (Array.isArray(data)) {
    const transformed = data.map((shift: any) => ({
      id: shift.id,
      name: shift.name,
      time: `${shift.startTime || ''} - ${shift.endTime || ''}`,
      workers: shift.workers || 0,
      status: shift.status,
      sites: [],
    }))
    return NextResponse.json(transformed)
  }
  return response
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/shifts')
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...body } = data
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/shifts/${id}`, { method: 'PUT', body })
  } catch (error) {
    console.error('Error updating shift:', error)
    return NextResponse.json({ error: 'Failed to update shift' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/shifts/${id}`, { method: 'DELETE' })
  } catch (error) {
    console.error('Error deleting shift:', error)
    return NextResponse.json({ error: 'Failed to delete shift' }, { status: 500 })
  }
}
