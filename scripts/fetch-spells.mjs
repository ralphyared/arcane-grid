// Fetches the D&D 5e SRD spell list and writes a trimmed, app-shaped JSON file
// to src/data/spells.json.
//
// Source: 5e-bits/5e-database (the dataset behind dnd5eapi.co). It contains only
// SRD 5.1 content, which is released under the OGL 1.0a / CC-BY-4.0 and is therefore
// legal to redistribute in a public app.
//
// Re-run any time with:  npm run fetch-spells
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(HERE, '../src/data/spells.json')
const LOCAL_FALLBACK = resolve(HERE, '../spells-sample.json')

// The repo reorganised content under src/<edition>/<locale>/. Try the known path(s).
const SOURCE_URLS = [
  'https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2014/en/5e-SRD-Spells.json',
  'https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2014/5e-SRD-Spells.json',
]

/** Bucket the free-text casting time into a small, filterable set. */
function castingBucket(castingTime) {
  const s = String(castingTime).toLowerCase()
  if (s.includes('bonus')) return 'bonus'
  if (s.includes('reaction')) return 'reaction'
  if (s.startsWith('1 action')) return 'action'
  return 'long' // 1 minute / 10 minutes / 1 hour / etc.
}

/** Bucket the free-text range into a small, filterable set. */
function rangeBucket(range) {
  const s = String(range).toLowerCase()
  if (s.startsWith('self')) return 'self'
  if (s.startsWith('touch')) return 'touch'
  if (['sight', 'unlimited', 'special'].includes(s)) return 'special'
  return 'ranged'
}

function transform(raw) {
  return raw
    .map((s) => {
      const components = Array.isArray(s.components) ? s.components : []
      return {
        index: s.index,
        name: s.name,
        level: s.level,
        school: s.school?.name ?? 'Unknown',
        classes: (s.classes ?? []).map((c) => c.name).sort(),
        castingTime: s.casting_time,
        castingBucket: castingBucket(s.casting_time),
        range: s.range,
        rangeBucket: rangeBucket(s.range),
        duration: s.duration,
        concentration: Boolean(s.concentration),
        ritual: Boolean(s.ritual),
        components,
        hasMaterial: components.includes('M'),
        damageType: s.damage?.damage_type?.name ?? null,
        saveType: s.dc?.dc_type?.name ?? null,
        attack: Boolean(s.attack_type),
        summary: (s.desc?.[0] ?? '').replace(/\s+/g, ' ').trim(),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

async function loadRaw() {
  for (const url of SOURCE_URLS) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        console.log(`  fetched ${url}`)
        return await res.json()
      }
      console.warn(`  ! ${url} -> HTTP ${res.status}`)
    } catch (err) {
      console.warn(`  ! ${url} -> ${err.message}`)
    }
  }
  if (existsSync(LOCAL_FALLBACK)) {
    console.warn('  ! network unavailable; using local spells-sample.json')
    return JSON.parse(readFileSync(LOCAL_FALLBACK, 'utf8'))
  }
  throw new Error('Could not load SRD spells from network or local fallback.')
}

const raw = await loadRaw()
const spells = transform(raw)
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(spells) + '\n')
console.log(`Wrote ${spells.length} spells -> src/data/spells.json`)
