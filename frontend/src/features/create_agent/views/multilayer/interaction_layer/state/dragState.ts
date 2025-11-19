let currentCardType: string | null = null;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function setDraggingCardType(type: string | null) {
  if (isBrowser()) {
    (window as any).__dragCardType = type;
  }
  currentCardType = type;
  try { console.debug('[dragState] set type ->', type); } catch {}
}

export function getDraggingCardType(): string | null {
  let type: string | null = null;
  if (isBrowser()) {
    type = (window as any).__dragCardType ?? null;
  }
  if (type == null) type = currentCardType;
  try { console.debug('[dragState] get type ->', type); } catch {}
  return type;
}