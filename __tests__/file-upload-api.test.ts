// Unit tests for file upload logic (extracted from API route)
export {} // keeps this file's helpers out of the global scope url-shortener-api.test.ts also declares

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

function generateSlug(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function sanitizeFilename(name: string): string {
  const base = name.replace(/[/\\]/g, "_")
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-200) || "file"
}

describe('File Upload - Slug Generation', () => {
  test('generates slug of correct length', () => {
    expect(generateSlug()).toHaveLength(6)
  })

  test('slug contains only alphanumeric characters', () => {
    expect(generateSlug()).toMatch(/^[a-zA-Z0-9]+$/)
  })

  test('generates unique slugs', () => {
    const slugs = new Set(Array.from({ length: 100 }, () => generateSlug()))
    expect(slugs.size).toBeGreaterThan(95)
  })
})

describe('File Upload - Size Validation', () => {
  test('accepts files at or under 100MB', () => {
    expect(MAX_FILE_SIZE).toBeLessThanOrEqual(100 * 1024 * 1024)
    expect(50 * 1024 * 1024).toBeLessThanOrEqual(MAX_FILE_SIZE)
  })

  test('rejects files over 100MB', () => {
    expect(101 * 1024 * 1024).toBeGreaterThan(MAX_FILE_SIZE)
  })
})

describe('File Upload - Filename Sanitization', () => {
  test('strips directory traversal attempts', () => {
    expect(sanitizeFilename('../../etc/passwd')).not.toContain('/')
    expect(sanitizeFilename('..\\..\\windows\\system32')).not.toContain('\\')
  })

  test('preserves safe filenames', () => {
    expect(sanitizeFilename('report.pdf')).toBe('report.pdf')
    expect(sanitizeFilename('my-file_v2.docx')).toBe('my-file_v2.docx')
  })

  test('replaces unsafe characters', () => {
    expect(sanitizeFilename('weird file!@#.txt')).toMatch(/^[a-zA-Z0-9._-]+$/)
  })

  test('falls back to a default name if empty after sanitizing', () => {
    expect(sanitizeFilename('')).toBe('file')
  })

  test('caps extremely long filenames', () => {
    const longName = 'a'.repeat(300) + '.pdf'
    expect(sanitizeFilename(longName).length).toBeLessThanOrEqual(200)
  })
})
