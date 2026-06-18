// Thin, defensive wrapper over localStorage. All keys are namespaced; every
// access is guarded so private-mode / disabled-storage never crashes the app.

const PREFIX = 'arcane-grid:'

export function loadJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Ignore quota errors / unavailable storage.
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    // Ignore.
  }
}
