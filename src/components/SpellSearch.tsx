import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Modal } from './Modal'
import { searchSpells } from '../lib/spells'
import { KIND_STYLES } from '../lib/theme'
import type { Category } from '../lib/types'

function Chip({ category }: { category: Category }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${KIND_STYLES[category.kind]}`}
    >
      {category.label}
    </span>
  )
}

interface SpellSearchProps {
  onClose: () => void
  rowCat?: Category
  colCat?: Category
  exclude: Set<string>
  onPick: (spellIndex: string) => void
}

// Mounted fresh by the parent each time a cell is opened, so its state always
// starts clean — no open/close syncing effects needed.
export function SpellSearch({ onClose, rowCat, colCat, exclude, onPick }: SpellSearchProps) {
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const results = useMemo(() => searchSpells(query, exclude), [query, exclude])

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 30)
    return () => clearTimeout(t)
  }, [])

  const updateQuery = (value: string) => {
    setQuery(value)
    setHighlight(0)
  }

  const choose = (index: string) => {
    onPick(index)
    onClose()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const s = results[highlight]
      if (s) choose(s.index)
    }
  }

  return (
    <Modal open onClose={onClose} title="Name a spell">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {rowCat && <Chip category={rowCat} />}
        <span className="text-arcane-300/60">×</span>
        {colCat && <Chip category={colCat} />}
      </div>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => updateQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a spell name…"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-lg border border-arcane-400/30 bg-black/30 px-3 py-2.5 text-base text-white outline-none placeholder:text-white/30 focus:border-arcane-400/70 focus:ring-2 focus:ring-arcane-500/30"
      />
      <ul className="scroll-thin mt-2 max-h-72 overflow-y-auto">
        {results.map((s, i) => (
          <li key={s.index}>
            <button
              type="button"
              onMouseEnter={() => setHighlight(i)}
              onClick={() => choose(s.index)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition ${
                i === highlight ? 'bg-arcane-500/20' : 'hover:bg-white/5'
              }`}
            >
              <span className="font-medium text-white">{s.name}</span>
              <span className="shrink-0 text-xs text-arcane-200/60">
                {s.level === 0 ? 'Cantrip' : `Lvl ${s.level}`} · {s.school}
              </span>
            </button>
          </li>
        ))}
        {query.trim() && results.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-white/40">
            No SRD spells match “{query.trim()}”.
          </li>
        )}
        {!query.trim() && (
          <li className="px-3 py-6 text-center text-sm text-white/40">
            Start typing to search all 319 SRD spells.
          </li>
        )}
      </ul>
    </Modal>
  )
}
