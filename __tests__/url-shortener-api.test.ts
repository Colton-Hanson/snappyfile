// Unit tests for URL shortener logic (extracted from API route)

function generateSlug(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

describe('URL Shortener - Slug Generation', () => {
  test('generates slug of correct length', () => {
    const slug = generateSlug()
    expect(slug).toHaveLength(6)
  })

  test('slug contains only alphanumeric characters', () => {
    const slug = generateSlug()
    expect(slug).toMatch(/^[a-zA-Z0-9]+$/)
  })

  test('generates unique slugs', () => {
    const slugs = new Set(Array.from({ length: 100 }, () => generateSlug()))
    expect(slugs.size).toBeGreaterThan(95)
  })

  test('custom length works', () => {
    expect(generateSlug(8)).toHaveLength(8)
    expect(generateSlug(4)).toHaveLength(4)
  })
})

describe('URL Shortener - URL Validation', () => {
  test('accepts valid https URLs', () => {
    expect(isValidUrl('https://google.com')).toBe(true)
    expect(isValidUrl('https://snappyfile.com')).toBe(true)
    expect(isValidUrl('https://example.com/path?foo=bar')).toBe(true)
  })

  test('accepts valid http URLs', () => {
    expect(isValidUrl('http://example.com')).toBe(true)
  })

  test('rejects plain text', () => {
    expect(isValidUrl('not-a-url')).toBe(false)
    expect(isValidUrl('hello world')).toBe(false)
    expect(isValidUrl('')).toBe(false)
  })

  test('rejects missing protocol', () => {
    expect(isValidUrl('google.com')).toBe(false)
    expect(isValidUrl('www.google.com')).toBe(false)
  })

  test('accepts URLs with query strings and fragments', () => {
    expect(isValidUrl('https://example.com/path?foo=bar&baz=1#section')).toBe(true)
  })

  test('rejects numeric input', () => {
    expect(isValidUrl(String(12345))).toBe(false)
  })
})
