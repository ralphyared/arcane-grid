// Daily puzzles are keyed by the UTC date so every player worldwide gets the
// same grid on a given calendar day (in UTC), with no backend required.

export function utcDateKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

export function dailySeedKey(dateKey: string = utcDateKey()): string {
  return `daily-${dateKey}`
}

export function practiceSeedKey(): string {
  const rand = Math.floor(Math.random() * 1e9).toString(36)
  return `practice-${Date.now().toString(36)}-${rand}`
}

export function prettyDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
