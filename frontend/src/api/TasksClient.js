import { ApiClient } from './ApiClient'

export class TasksClient extends ApiClient {
  list() { return this.get('/tasks') }

  // Returns unsubscribe function. Handles auto reconnect with backoff.
  subscribe(onEvent) {
    let es
    let retry = 0
    const connect = () => {
      es = this.createEventSource('/events', {
        onmessage: (e) => {
          try { onEvent(JSON.parse(e.data)) } catch {}
        },
        onerror: () => {
          try { es.close() } catch {}
          const backoff = Math.min(30000, 1000 * Math.pow(2, retry++))
          setTimeout(connect, backoff)
        },
        onopen: () => { retry = 0 }
      })
    }
    connect()
    return () => { try { es && es.close() } catch {} }
  }
}
