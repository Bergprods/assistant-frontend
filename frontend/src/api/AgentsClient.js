import { ApiClient } from './ApiClient'

function inferAgentsBase() {
  if (import.meta.env?.VITE_AGENTS_URL) return import.meta.env.VITE_AGENTS_URL
  try {
    const url = new URL(window.location.href)
    // Vite dev server, run agents-connector on 8700
    if (url.port === '5173') return `${url.protocol}//${url.hostname}:8700`
  } catch {}
  // Fallback: same host on 8700
  return `${window.location.protocol}//${window.location.hostname}:8700`
}

export class AgentsClient extends ApiClient {
  constructor(baseUrl) {
    super(baseUrl || inferAgentsBase())
  }

  async sendMessage(conversationId, message, context = {}) {
    const payload = { input_as_text: message }
    if (context.workflowId) payload.workflow_id = context.workflowId
    if (context.smalltalkerWorkflowId) payload.smalltalker_workflow_id = context.smalltalkerWorkflowId
    if (conversationId) payload.conversation_id = conversationId
    const res = await this.post('/run', payload)
    // Prefer the backend's human reply if present; fall back to structured output
    return {
      reply: res?.reply ?? res?.output_text ?? JSON.stringify(res),
      parsed: res?.output_parsed,
      raw: res
    }
  }

  streamMessage(conversationId, message, context = {}, { onMessage, onDone, onError } = {}) {
    const params = new URLSearchParams()
    params.set('q', message)
    if (context.workflowId) params.set('workflow_id', context.workflowId)
    if (context.smalltalkerWorkflowId) params.set('smalltalker_workflow_id', context.smalltalkerWorkflowId)
    if (conversationId) params.set('conversation_id', conversationId)
    const url = this.baseUrl + '/run/stream?' + params.toString()
    const es = new EventSource(url)
    es.addEventListener('message', (e) => {
      try { onMessage?.(JSON.parse(e.data)) } catch {}
    })
    es.addEventListener('done', (e) => {
      try { if (e?.data) onDone?.(JSON.parse(e.data)); else onDone?.() } finally { es.close() }
    })
    es.addEventListener('error', (e) => {
      try { onError?.(e) } finally { es.close() }
    })
    return es
  }
}
