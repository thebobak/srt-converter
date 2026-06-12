import { describe, it, expect } from 'vitest'
import {
  parseSrtTimestamp,
  isSentenceEnd,
  convertSrtToVtt,
  convertSrtToSmartTxt,
} from './srtConverter'

// ============================================================================
// parseSrtTimestamp tests
// ============================================================================
describe('parseSrtTimestamp', () => {
  it('converts a simple timestamp to seconds', () => {
    // Arrange
    const timestamp = '00:00:01,000'

    // Act
    const result = parseSrtTimestamp(timestamp)

    // Assert
    expect(result).toBe(1)
  })

  it('handles minutes correctly', () => {
    expect(parseSrtTimestamp('00:01:00,000')).toBe(60)
  })

  it('handles hours correctly', () => {
    expect(parseSrtTimestamp('01:00:00,000')).toBe(3600)
  })

  it('handles milliseconds correctly', () => {
    expect(parseSrtTimestamp('00:00:01,500')).toBe(1.5)
  })

  it('handles complex timestamps', () => {
    // 1 hour + 23 minutes + 45 seconds + 678ms
    expect(parseSrtTimestamp('01:23:45,678')).toBe(5025.678)
  })

  it('returns 0 for empty string', () => {
    expect(parseSrtTimestamp('')).toBe(0)
  })

  it('returns 0 for null/undefined', () => {
    expect(parseSrtTimestamp(null)).toBe(0)
    expect(parseSrtTimestamp(undefined)).toBe(0)
  })

  it('returns 0 for malformed timestamp', () => {
    expect(parseSrtTimestamp('invalid')).toBe(0)
    expect(parseSrtTimestamp('00:00')).toBe(0) // missing seconds
  })
})

// ============================================================================
// isSentenceEnd tests
// ============================================================================
describe('isSentenceEnd', () => {
  describe('returns true for sentence endings', () => {
    it('handles period at end', () => {
      expect(isSentenceEnd('Hello world.')).toBe(true)
    })

    it('handles exclamation mark', () => {
      expect(isSentenceEnd('Hello world!')).toBe(true)
    })

    it('handles question mark', () => {
      expect(isSentenceEnd('Hello world?')).toBe(true)
    })

    it('handles punctuation with quotes', () => {
      expect(isSentenceEnd('He said "hello."')).toBe(true)
      expect(isSentenceEnd("She asked 'why?'")).toBe(true)
    })
  })

  describe('returns false for abbreviations', () => {
    it('handles common titles', () => {
      expect(isSentenceEnd('Dr.')).toBe(false)
      expect(isSentenceEnd('Mr.')).toBe(false)
      expect(isSentenceEnd('Mrs.')).toBe(false)
      expect(isSentenceEnd('Ms.')).toBe(false)
    })

    it('handles other abbreviations', () => {
      expect(isSentenceEnd('e.g.')).toBe(false)
      expect(isSentenceEnd('i.e.')).toBe(false)
      expect(isSentenceEnd('etc.')).toBe(false)
    })

    it('handles abbreviations in context', () => {
      expect(isSentenceEnd('Talk to Dr.')).toBe(false)
      expect(isSentenceEnd('For example, e.g.')).toBe(false)
    })
  })

  describe('returns false for non-endings', () => {
    it('handles no punctuation', () => {
      expect(isSentenceEnd('Hello world')).toBe(false)
    })

    it('handles empty/null input', () => {
      expect(isSentenceEnd('')).toBe(false)
      expect(isSentenceEnd(null)).toBe(false)
    })

    it('handles single initials', () => {
      expect(isSentenceEnd('John F.')).toBe(false) // single letter initial
    })
  })
})

// ============================================================================
// convertSrtToVtt tests
// ============================================================================
describe('convertSrtToVtt', () => {
  it('converts basic SRT to VTT format', () => {
    const srt = `1
00:00:01,000 --> 00:00:04,000
Hello world`

    const result = convertSrtToVtt(srt)

    expect(result).toContain('WEBVTT')
    expect(result).toContain('00:00:01.000 --> 00:00:04.000')
    expect(result).toContain('Hello world')
  })

  it('replaces commas with periods in timestamps', () => {
    const srt = `1
00:01:23,456 --> 00:01:25,789
Test`

    const result = convertSrtToVtt(srt)

    expect(result).toContain('00:01:23.456 --> 00:01:25.789')
    expect(result).not.toContain(',')
  })

  it('handles multiple subtitle blocks', () => {
    const srt = `1
00:00:01,000 --> 00:00:02,000
First line

2
00:00:03,000 --> 00:00:04,000
Second line`

    const result = convertSrtToVtt(srt)

    expect(result).toContain('First line')
    expect(result).toContain('Second line')
  })

  it('preserves multi-line subtitle text', () => {
    const srt = `1
00:00:01,000 --> 00:00:04,000
Line one
Line two`

    const result = convertSrtToVtt(srt)

    expect(result).toContain('Line one')
    expect(result).toContain('Line two')
  })
})

// ============================================================================
// convertSrtToSmartTxt tests
// ============================================================================
describe('convertSrtToSmartTxt', () => {
  it('extracts plain text from SRT', () => {
    const srt = `1
00:00:01,000 --> 00:00:04,000
Hello world`

    const result = convertSrtToSmartTxt(srt)

    expect(result).toBe('Hello world')
  })

  it('strips HTML tags', () => {
    const srt = `1
00:00:01,000 --> 00:00:04,000
<i>Italic text</i>`

    const result = convertSrtToSmartTxt(srt)

    expect(result).toBe('Italic text')
    expect(result).not.toContain('<i>')
    expect(result).not.toContain('</i>')
  })

  it('joins consecutive subtitle blocks', () => {
    const srt = `1
00:00:01,000 --> 00:00:02,000
Hello

2
00:00:02,000 --> 00:00:03,000
world`

    const result = convertSrtToSmartTxt(srt)

    expect(result).toBe('Hello world')
  })

  it('creates paragraph break after significant pause (>2 seconds)', () => {
    const srt = `1
00:00:01,000 --> 00:00:02,000
First paragraph.

2
00:00:05,000 --> 00:00:06,000
Second paragraph.`

    const result = convertSrtToSmartTxt(srt)

    expect(result).toContain('First paragraph.')
    expect(result).toContain('Second paragraph.')
    // Should have paragraph break (double newline)
    expect(result.split('\n\n').length).toBe(2)
  })
})
