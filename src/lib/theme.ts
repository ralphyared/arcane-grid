import type { CategoryKind } from './types'

// Tailwind classes per category family, so each axis chip is colour-coded.
// Full literal strings (no interpolation) so Tailwind's scanner keeps them.
export const KIND_STYLES: Record<CategoryKind, string> = {
  school: 'border-arcane-400/50 bg-arcane-500/15 text-arcane-100',
  class: 'border-sky-400/50 bg-sky-500/15 text-sky-100',
  level: 'border-amber-400/50 bg-amber-500/15 text-amber-100',
  damage: 'border-rose-400/50 bg-rose-500/15 text-rose-100',
  save: 'border-emerald-400/50 bg-emerald-500/15 text-emerald-100',
  casting: 'border-cyan-400/50 bg-cyan-500/15 text-cyan-100',
  range: 'border-teal-400/50 bg-teal-500/15 text-teal-100',
  duration: 'border-indigo-400/50 bg-indigo-500/15 text-indigo-100',
  concentration: 'border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-100',
  ritual: 'border-yellow-400/50 bg-yellow-500/15 text-yellow-100',
  attack: 'border-orange-400/50 bg-orange-500/15 text-orange-100',
  material: 'border-slate-400/50 bg-slate-500/15 text-slate-100',
}
