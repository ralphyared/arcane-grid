// Builds the Wordle-style shareable result text from a finished game.

const EMOJI = {
  correct: '🟪',
  wrong: '🟥',
  empty: '⬜',
} as const

export interface ShareParams {
  title: string
  /** Length 9, row-major: true = correct, false = wrong guess, null = unattempted. */
  cells: (boolean | null)[]
  correct: number
  score: number
  url?: string
}

export function buildShareText({ title, cells, correct, score, url }: ShareParams): string {
  const rows: string[] = []
  for (let r = 0; r < 3; r++) {
    let line = ''
    for (let c = 0; c < 3; c++) {
      const v = cells[r * 3 + c]
      line += v === true ? EMOJI.correct : v === false ? EMOJI.wrong : EMOJI.empty
    }
    rows.push(line)
  }
  const lines = [`${title} — ${correct}/9`, '', ...rows, '', `Arcane score: ${score}`]
  if (url) lines.push(url)
  return lines.join('\n')
}
