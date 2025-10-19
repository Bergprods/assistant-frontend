// Summarization & cleanup helpers extracted from App.jsx
export function summarizeTask(text, opts = {}) {
  if (!text) return ''
  const s = text.toString().toLowerCase()
  const isHa = !!opts.isHa || !!opts.ha_injected
  const objLamp = /lampor?|lights?|light/i
  const objSensor = /sensor|temperatur|humidity|rörelse/i
  const objSwitch = /switch|uttag|kontakt/i
  const source = isHa ? ' från HA' : ''
  if ((/hämta|hämtar|hämta alla|lista|lista över|lista på|lista av/).test(s) && objLamp.test(s)) return 'Hämta alla lampor' + source
  if ((/hämta|lista/).test(s) && objSensor.test(s)) return 'Hämta sensorer' + source
  if ((/slå på|sätt på|aktivera|turn on|starta/).test(s) && objLamp.test(s)) return 'Sätt på lampor' + source
  if ((/stäng av|släck|turn off|deactivate/).test(s) && objLamp.test(s)) return 'Stäng av lampor' + source
  if ((/call service|callservice|call_service|tjänst|service|anropa/).test(s)) return 'Anropa tjänst' + source
  const words = text.replace(/\s+/g,' ').trim().split(' ').slice(0,6)
  let small = words.join(' ')
  small = small.replace(/^(användaren bad om|direkt svar:|kan svara direkt[:\-]?)/i,'')
  small = small.replace(/[\.\;\:]$/,'').trim()
  if (!small) return ''
  return small.charAt(0).toUpperCase() + small.slice(1) + source
}
export function cleanDescription(text) {
  if (!text) return ''
  let s = text.toString()
  s = s.replace(/\s*[—-]\s*(RouterGPT\b.*|kan\s+(besvaras|svara)\s+direkt.*)$/i,'')
  s = s.replace(/\s*\(.*kan\s+(besvaras|svara).*?\)\s*$/i,'')
  return s.trim()
}
