import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    // Stocker le token dans un cookie
    const token = data.token
    const nextResponse = NextResponse.json(data)
    nextResponse.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/',
    })

    return nextResponse
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}
