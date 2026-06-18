import { describe, expect, it } from 'vitest'
import { CATEGORIES, CATEGORY_MATCHES } from './categories'
import { getSpell } from './spells'

describe('categories', () => {
  it('every category matches at least one spell', () => {
    for (const c of CATEGORIES) {
      expect(CATEGORY_MATCHES.get(c.id)?.size ?? 0, c.id).toBeGreaterThan(0)
    }
  })

  it('has unique ids', () => {
    const ids = CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('classifies Fireball the way the rules do', () => {
    expect(getSpell('fireball')).toBeDefined()
    const has = (id: string) => CATEGORY_MATCHES.get(id)?.has('fireball') ?? false
    expect(has('school:Evocation')).toBe(true)
    expect(has('level:3')).toBe(true)
    expect(has('class:Wizard')).toBe(true)
    expect(has('class:Sorcerer')).toBe(true)
    expect(has('damage:Fire')).toBe(true)
    expect(has('save:DEX')).toBe(true)
    expect(has('class:Cleric')).toBe(false)
    expect(has('tag:concentration')).toBe(false)
  })
})
