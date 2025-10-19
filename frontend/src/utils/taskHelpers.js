// Utility helpers related to task / Home Assistant entity detection & normalization

// Detect if a task is Home Assistant related
export function isHaTask(task) {
  if (!task) return false
  const details = task.details || {}
  const replyText = (task.description || '').toString()
  const hasBulletEntities = /(^|\n)-\s+([a-zA-Z0-9_\.\/\-]+)/.test(replyText)
  const agent = (task.agent || '').toLowerCase()
  return !!(
    task.entity ||
    details.entity_id ||
    details.ha_result ||
    details.ha_error ||
    hasBulletEntities ||
    (agent.includes('ha') || agent.includes('smart') || agent.includes('home'))
  )
}

// Normalize HA result payload into an array of entries
export function normalizeHaResult(payload) {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object') return [payload]
  return []
}

// Heuristic detection of HA-related intent from reply/user content and metadata
export function detectHaIntent({ replyText = '', userText = '', entity, metadata = {} }) {
  try {
    const combined = (replyText || '') + '\n' + (userText || '')
    const hasBullets = /(^|\n)-\s+([a-zA-Z0-9_\.\/\-]+)/.test(replyText || '')
    const mentionsLamp = /lampa|lampor|lampan|light\./i.test(combined)
    return !!(entity || metadata.entity_id || metadata.ha_result || hasBullets || mentionsLamp)
  } catch {
    return false
  }
}
