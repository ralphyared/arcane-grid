import { useCallback, useEffect, useMemo, useState } from 'react'
import { utcDateKey } from '../lib/dateSeed'
import { loadJSON, saveJSON } from '../lib/storage'

const DAY_MS = 86_400_000
const STATS_KEY = 'stats'

export interface DailyResult {
  correct: number
  score: number
  guesses: number
}

interface StatsData {
  results: Record<string, DailyResult>
}

function loadStats(): StatsData {
  const data = loadJSON<StatsData>(STATS_KEY)
  return data?.results ? data : { results: {} }
}

function dayBefore(dateKey: string): string {
  return new Date(Date.parse(`${dateKey}T00:00:00Z`) - DAY_MS).toISOString().slice(0, 10)
}

function computeStreaks(results: Record<string, DailyResult>): { current: number; max: number } {
  const days = Object.keys(results).sort()
  if (days.length === 0) return { current: 0, max: 0 }

  let max = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    const gap = Date.parse(`${days[i]}T00:00:00Z`) - Date.parse(`${days[i - 1]}T00:00:00Z`)
    run = gap === DAY_MS ? run + 1 : 1
    if (run > max) max = run
  }

  // A streak is "current" only if it includes today or yesterday (UTC).
  const today = utcDateKey()
  const yesterday = dayBefore(today)
  let current = 0
  let cursor = results[today] ? today : results[yesterday] ? yesterday : null
  while (cursor && results[cursor]) {
    current++
    cursor = dayBefore(cursor)
  }
  return { current, max }
}

export interface StatsView {
  played: number
  bestScore: number
  bestCorrect: number
  avgCorrect: number
  currentStreak: number
  maxStreak: number
  /** distribution[n] = number of games with exactly n correct (0..9). */
  distribution: number[]
  recordDaily: (dateKey: string, result: DailyResult) => void
  hasResult: (dateKey: string) => boolean
}

export function useStats(): StatsView {
  const [data, setData] = useState<StatsData>(() => loadStats())

  useEffect(() => {
    saveJSON(STATS_KEY, data)
  }, [data])

  const recordDaily = useCallback((dateKey: string, result: DailyResult) => {
    setData((prev) => {
      if (prev.results[dateKey]) return prev // only the first attempt counts
      return { results: { ...prev.results, [dateKey]: result } }
    })
  }, [])

  const hasResult = useCallback((dateKey: string) => Boolean(data.results[dateKey]), [data])

  return useMemo(() => {
    const values = Object.values(data.results)
    const played = values.length
    const distribution = Array<number>(10).fill(0)
    let totalCorrect = 0
    let bestScore = 0
    let bestCorrect = 0
    for (const r of values) {
      distribution[Math.max(0, Math.min(9, r.correct))]++
      totalCorrect += r.correct
      if (r.score > bestScore) bestScore = r.score
      if (r.correct > bestCorrect) bestCorrect = r.correct
    }
    const { current, max } = computeStreaks(data.results)
    return {
      played,
      bestScore,
      bestCorrect,
      avgCorrect: played ? totalCorrect / played : 0,
      currentStreak: current,
      maxStreak: max,
      distribution,
      recordDaily,
      hasResult,
    }
  }, [data, recordDaily, hasResult])
}
