import { useEffect, useMemo, useState } from 'react'
import { Footer, Header } from './components/Header'
import { Grid } from './components/Grid'
import { SpellSearch } from './components/SpellSearch'
import { ResultModal } from './components/ResultModal'
import { HelpModal } from './components/HelpModal'
import { StatsModal } from './components/StatsModal'
import { useGame } from './hooks/useGame'
import { useStats } from './hooks/useStats'
import { dailySeedKey, practiceSeedKey, prettyDate, utcDateKey } from './lib/dateSeed'
import { loadJSON, saveJSON } from './lib/storage'

type Mode = 'daily' | 'practice'

export default function App() {
  const [mode, setMode] = useState<Mode>('daily')
  const dateKey = useMemo(() => utcDateKey(), [])
  const dailyKey = useMemo(() => dailySeedKey(dateKey), [dateKey])
  const [practiceKey, setPracticeKey] = useState(() => practiceSeedKey())

  const activeSeedKey = mode === 'daily' ? dailyKey : practiceKey
  const game = useGame(activeSeedKey)
  const stats = useStats()
  const { recordDaily, hasResult } = stats

  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [prevFinished, setPrevFinished] = useState(game.finished)
  const [showHelp, setShowHelp] = useState(() => !loadJSON<boolean>('seen-help'))
  const [showStats, setShowStats] = useState(false)

  // Remember (in storage) that the rules have now been shown to this visitor.
  useEffect(() => {
    saveJSON('seen-help', true)
  }, [])

  // Record the daily result exactly once, when the daily game finishes.
  useEffect(() => {
    if (mode === 'daily' && game.finished && !hasResult(dateKey)) {
      recordDaily(dateKey, {
        correct: game.correct,
        score: game.score,
        guesses: 9 - game.state.guessesLeft,
      })
    }
  }, [
    mode,
    dateKey,
    game.finished,
    game.correct,
    game.score,
    game.state.guessesLeft,
    hasResult,
    recordDaily,
  ])

  // Open the result panel the moment a game becomes complete, and close it when a
  // fresh grid begins — a render-phase transition check rather than an effect.
  if (game.finished !== prevFinished) {
    setPrevFinished(game.finished)
    setShowResult(game.finished)
  }

  const rowCat = activeCell != null ? game.grid.rows[Math.floor(activeCell / 3)] : undefined
  const colCat = activeCell != null ? game.grid.cols[activeCell % 3] : undefined
  const title = mode === 'daily' ? `Daily · ${prettyDate(dateKey)}` : 'Practice grid'
  const newPractice = () => setPracticeKey(practiceSeedKey())

  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col px-4 pb-10">
      <Header
        onHelp={() => setShowHelp(true)}
        onStats={() => setShowStats(true)}
        streak={stats.currentStreak}
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-0.5">
          {(['daily', 'practice'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-md px-3.5 py-1.5 text-sm font-medium capitalize transition ${
                mode === m ? 'bg-arcane-600 text-white' : 'text-arcane-200/70 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-arcane-200/70">
            Guesses left <span className="font-semibold text-white">{game.state.guessesLeft}</span>
          </div>
          {mode === 'practice' && (
            <button
              type="button"
              onClick={newPractice}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-arcane-100 transition hover:bg-white/10"
            >
              New grid
            </button>
          )}
        </div>
      </div>

      <p className="mb-3 text-center text-sm text-arcane-200/60">{title}</p>

      <Grid
        grid={game.grid}
        state={game.state}
        finished={game.finished}
        onCellClick={(i) => setActiveCell(i)}
      />

      {game.finished && (
        <div className="mt-5 text-center">
          <button type="button" onClick={() => setShowResult(true)} className="btn-primary">
            View result
          </button>
        </div>
      )}

      <Footer />

      {activeCell != null && (
        <SpellSearch
          onClose={() => setActiveCell(null)}
          rowCat={rowCat}
          colCat={colCat}
          exclude={game.usedSpellIndexes}
          onPick={(spellIndex) => game.guess(activeCell, spellIndex)}
        />
      )}
      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        grid={game.grid}
        state={game.state}
        title={title}
        correct={game.correct}
        score={game.score}
        isPractice={mode === 'practice'}
        onNewPractice={newPractice}
      />
      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
      <StatsModal open={showStats} onClose={() => setShowStats(false)} stats={stats} />
    </div>
  )
}
