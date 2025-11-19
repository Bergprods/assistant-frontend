type ClassValue = string | number | null | undefined | ClassValue[] | { [key: string]: boolean }

function pushClass(value: ClassValue, collector: string[]): void {
  if (!value) return

  if (typeof value === 'string' || typeof value === 'number') {
    collector.push(String(value))
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item) => pushClass(item, collector))
    return
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, condition]) => {
      if (condition) collector.push(key)
    })
  }
}

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []
  inputs.forEach((input) => pushClass(input, classes))
  return classes.join(' ')
}
