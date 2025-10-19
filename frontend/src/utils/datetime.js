export function formatTs(iso) {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('sv-SE', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }).format(d)
  } catch { return iso }
}
export function formatDate(iso) {
  try { const d = new Date(iso); return new Intl.DateTimeFormat('sv-SE',{year:'numeric',month:'2-digit',day:'2-digit'}).format(d) } catch { return iso }
}
export function formatTime(iso) {
  try { const d = new Date(iso); return new Intl.DateTimeFormat('sv-SE',{hour:'2-digit',minute:'2-digit'}).format(d) } catch { return iso }
}
