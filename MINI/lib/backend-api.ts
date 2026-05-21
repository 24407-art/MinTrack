import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api'

export async function getAuthHeader(request?: Request | NextRequest): Promise<Record<string, string>> {
  let token: string | undefined
  if (request && 'cookies' in request && request.cookies) {
    token = request.cookies.get('token')?.value
  }
  if (!token) {
    try {
      const cookieStore = await cookies()
      token = cookieStore.get('token')?.value
    } catch {
      // ignore
    }
  }
  if (!token && request) {
    const auth = request.headers.get('authorization')
    if (auth) return { 'Authorization': auth }
  }
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export async function fetchBackend(path: string, auth: Record<string, string> = {}): Promise<any> {
  const response = await fetch(`${BACKEND_URL}${path}`, { headers: auth })
  if (!response.ok) return []
  return response.json()
}

export async function proxyToBackend(
  request: Request | NextRequest,
  backendPath: string,
  options?: {
    method?: string
    body?: any
    query?: Record<string, string>
  }
) {
  const url = new URL(`${BACKEND_URL}${backendPath}`)

  if (options?.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value)
      }
    })
  }

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!['host', 'content-length'].includes(key.toLowerCase())) {
      headers.set(key, value)
    }
  })

  // Lire le token depuis le cookie NextRequest ou next/headers
  let token: string | undefined
  if ('cookies' in request && request.cookies) {
    token = request.cookies.get('token')?.value
  }
  if (!token) {
    try {
      const cookieStore = await cookies()
      token = cookieStore.get('token')?.value
    } catch {
      // ignore: pas dans un contexte server
    }
  }

  // Rejeter si pas de token (routes protégées)
  if (!token && !backendPath.startsWith('/auth/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (token && !headers.has('authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (options?.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json')
  }

  const fetchOptions: RequestInit = {
    method: options?.method || request.method,
    headers,
  }

  if (options?.body) {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body)
  } else if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.text()
    if (body) {
      fetchOptions.body = body
    }
  }

  try {
    const response = await fetch(url.toString(), fetchOptions)

    const responseBody = await response.text()
    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      if (!['transfer-encoding', 'content-encoding'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value)
      }
    })

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error(`Backend unreachable (${url.toString()}):`, error)
    return NextResponse.json(
      { error: 'Backend service unavailable' },
      { status: 502 }
    )
  }
}
