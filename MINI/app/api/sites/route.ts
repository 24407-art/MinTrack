import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend } from '@/lib/backend-api'

export async function GET(request: Request) {
  return proxyToBackend(request, '/sites')
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/sites')
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...body } = data
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/sites/${id}`, { method: 'PUT', body })
  } catch (error) {
    console.error('Error updating site:', error)
    return NextResponse.json({ error: 'Failed to update site' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    return proxyToBackend(request, `/sites/${id}`, { method: 'DELETE' })
  } catch (error) {
    console.error('Error deleting site:', error)
    return NextResponse.json({ error: 'Failed to delete site' }, { status: 500 })
  }
}
