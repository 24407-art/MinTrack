import { NextRequest, NextResponse } from 'next/server'
import { getAuthHeader } from '@/lib/backend-api'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api'

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, shiftId } = data
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    const auth = await getAuthHeader(request)
    const response = await fetch(`${BACKEND_URL}/personnel/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...auth,
      },
      body: JSON.stringify({ shiftId }),
    })
    const result = await response.text()
    return new NextResponse(result, { status: response.status, statusText: response.statusText })
  } catch (error) {
    console.error('Error updating shift:', error)
    return NextResponse.json({ error: 'Failed to update shift' }, { status: 500 })
  }
}
