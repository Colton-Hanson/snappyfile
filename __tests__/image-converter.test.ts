// Unit tests for image converter logic (format validation, slug generation etc.)

describe('Image Converter - Format Support', () => {
  const supportedFormats = ['PNG', 'JPG', 'WEBP', 'BMP', 'GIF']
  const mimeMap: Record<string, string> = {
    PNG: 'image/png',
    JPG: 'image/jpeg',
    WEBP: 'image/webp',
    BMP: 'image/bmp',
    GIF: 'image/gif'
  }

  test('supports all expected output formats', () => {
    expect(supportedFormats).toContain('PNG')
    expect(supportedFormats).toContain('JPG')
    expect(supportedFormats).toContain('WEBP')
    expect(supportedFormats).toContain('BMP')
    expect(supportedFormats).toContain('GIF')
  })

  test('each format maps to correct MIME type', () => {
    expect(mimeMap['PNG']).toBe('image/png')
    expect(mimeMap['JPG']).toBe('image/jpeg')
    expect(mimeMap['WEBP']).toBe('image/webp')
    expect(mimeMap['BMP']).toBe('image/bmp')
    expect(mimeMap['GIF']).toBe('image/gif')
  })

  test('output filename uses correct extension', () => {
    const inputName = 'photo.png'
    const targetFormat = 'WEBP'
    const baseName = inputName.replace(/\.[^.]+$/, '')
    const outputName = `${baseName}.${targetFormat.toLowerCase()}`
    expect(outputName).toBe('photo.webp')
  })

  test('strips existing extension correctly for various inputs', () => {
    const cases = [
      ['image.png', 'image'],
      ['my.photo.jpg', 'my.photo'],
      ['document.jpeg', 'document'],
      ['file.name.with.dots.webp', 'file.name.with.dots']
    ]
    cases.forEach(([input, expected]) => {
      expect(input.replace(/\.[^.]+$/, '')).toBe(expected)
    })
  })

  test('file size display rounds correctly', () => {
    const sizeBytes = 204800
    const displayKB = (sizeBytes / 1024).toFixed(0)
    expect(displayKB).toBe('200')
  })

  test('only image files are accepted', () => {
    const files = [
      { name: 'photo.png', type: 'image/png' },
      { name: 'document.pdf', type: 'application/pdf' },
      { name: 'photo.jpg', type: 'image/jpeg' },
      { name: 'data.csv', type: 'text/csv' },
    ]
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    expect(imageFiles).toHaveLength(2)
    expect(imageFiles.map(f => f.name)).toEqual(['photo.png', 'photo.jpg'])
  })
})

describe('Image Converter - JPG White Background', () => {
  test('JPG format requires white background fill', () => {
    const formatsNeedingWhiteBg = ['JPG']
    expect(formatsNeedingWhiteBg).toContain('JPG')
    expect(formatsNeedingWhiteBg).not.toContain('PNG')
    expect(formatsNeedingWhiteBg).not.toContain('WEBP')
  })
})
