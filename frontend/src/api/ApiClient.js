// Generic API client handling base URL inference and JSON requests
export class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = (baseUrl || this._inferBase()).replace(/\/$/, '')
  }

  _inferBase() {
    if (import.meta.env?.VITE_API_URL) return import.meta.env.VITE_API_URL
    try {
      const url = new URL(window.location.href)
      // If running vite dev server assume backend on 8080
      if (url.port === '5173') return `${url.protocol}//${url.hostname}:8080`
    } catch {}
    return window.location.origin
  }

  async request(path, { method = 'GET', headers = {}, body, timeout = 20000 } = {}) {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), timeout)
    try {
      const res = await fetch(this.baseUrl + path, {
        method,
        headers: {
          'Accept': 'application/json',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...headers
        },
        body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
        signal: ctrl.signal
      })
      const contentType = res.headers.get('content-type') || ''
      const text = await res.text()
      if (!contentType.includes('application/json')) {
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}: ${text.slice(0,180)}`)
        // Unexpected non-JSON success
        return { raw: text }
      }
      const json = text ? JSON.parse(text) : null
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}: ${JSON.stringify(json).slice(0,200)}`)
      return json
    } finally {
      clearTimeout(to)
    }
  }

  get(path, opts) { return this.request(path, { ...opts, method: 'GET' }) }
  post(path, body, opts) { return this.request(path, { ...opts, method: 'POST', body }) }

  createEventSource(path, handlers = {}) {
    const es = new EventSource(this.baseUrl + path)
    if (handlers.onmessage) es.onmessage = handlers.onmessage
    if (handlers.onerror) es.onerror = handlers.onerror
    if (handlers.onopen) es.onopen = handlers.onopen
    return es
  }
}
