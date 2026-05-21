import { NextRequest, NextResponse } from 'next/server'
import { proxyToBackend } from '@/lib/backend-api'

export async function GET(request: Request) {
  return proxyToBackend(request, '/teams')
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/teams')
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { action, teamId, personnelId, role } = data
    if (action === 'assign') {
      return proxyToBackend(request, `/teams/${teamId}/members/${personnelId}?role=${role || 'ouvrier'}`, { method: 'POST' })
    }
    if (action === 'remove') {
      return proxyToBackend(request, `/teams/${teamId}/members/${personnelId}`, { method: 'DELETE' })
    }
    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 })
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
  }
}
