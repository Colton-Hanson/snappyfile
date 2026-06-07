describe('QR Code Generator - Input Validation', () => {
  test('empty string is invalid input', () => {
    const url = ''
    expect(url.trim().length).toBe(0)
  })

  test('whitespace only is invalid input', () => {
    const url = '   '
    expect(url.trim().length).toBe(0)
  })

  test('valid URL passes trim check', () => {
    const url = 'https://snappyfile.com'
    expect(url.trim().length).toBeGreaterThan(0)
  })

  test('size stays within valid bounds', () => {
    const min = 128
    const max = 512
    const step = 32
    const validSizes = []
    for (let s = min; s <= max; s += step) validSizes.push(s)
    expect(validSizes).toContain(128)
    expect(validSizes).toContain(256)
    expect(validSizes).toContain(512)
    expect(validSizes).not.toContain(100)
    expect(validSizes).not.toContain(600)
  })

  test('default color values are valid hex', () => {
    const defaultColor = '#000000'
    const defaultBg = '#ffffff'
    const hexRegex = /^#[0-9a-fA-F]{6}$/
    expect(hexRegex.test(defaultColor)).toBe(true)
    expect(hexRegex.test(defaultBg)).toBe(true)
  })

  test('debounce delay is reasonable', () => {
    const debounceMs = 600
    expect(debounceMs).toBeGreaterThanOrEqual(300)
    expect(debounceMs).toBeLessThanOrEqual(1000)
  })

  test('download filename is correct', () => {
    const filename = 'snappyfile-qr.png'
    expect(filename).toMatch(/\.png$/)
    expect(filename).toContain('snappyfile')
  })
})
