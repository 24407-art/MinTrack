import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend } from '@/lib/backend-api'

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/personnel', { query: { department: 'mobile' } })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const body = { ...data, department: 'mobile' }
    return proxyToBackend(request, '/personnel', { method: 'POST', body })
  } catch (error) {
    console.error('Error creating mobile personnel:', error)
    return NextResponse.json({ error: 'Failed to create mobile personnel' }, { status: 500 })
  }
}
