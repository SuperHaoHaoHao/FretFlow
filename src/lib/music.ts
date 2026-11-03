export const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'] as const
export const C_MAJOR = new Set([0, 2, 4, 5, 7, 9, 11])
export const SYLLABLES: Record<number, string> = { 0: '1', 2: '2', 4: '3', 5: '4', 7: '5', 9: '6', 11: '7' }
export const SOLFEGE: Record<number, string> = { 0: 'do', 2: 're', 4: 'mi', 5: 'fa', 7: 'sol', 9: 'la', 11: 'si' }
export const STRING_MIDI = [64, 59, 55, 50, 45, 40]
export const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E']

export type PositionId = 'all' | '1' | '2' | '4' | '5'

export interface GuitarNote {
  string: number
  fret: number
  midi: number
  name: string
  fullName: string
  syllable: string
  solfege: string
}

export const POSITION_CONFIG: Record<Exclude<PositionId, 'all'>, {
  start: number
  end: number
  videoPage: number
  title: string
  summary: string
}> = {
  '1': { start: 1, end: 4, videoPage: 47, title: '第一把位', summary: '食指负责 1 品，依次到小指 4 品；空弦也属于这里的重要声音。' },
  '2': { start: 2, end: 5, videoPage: 31, title: '第二把位', summary: '食指从 2 品出发，《青花瓷》课程片段就在这里。' },
  '4': { start: 4, end: 7, videoPage: 67, title: '第四把位', summary: '把同样的音阶形状向上移动，感受指板的重复规律。' },
  '5': { start: 5, end: 8, videoPage: 15, title: '第五把位', summary: '食指负责 5 品，小指负责 8 品；《小星星》就在这里。' },
}

export function getNote(string: number, fret: number): GuitarNote {
  const midi = STRING_MIDI[string - 1] + fret
  const pitch = midi % 12
  const name = NOTE_NAMES[pitch]
  return {
    string,
    fret,
    midi,
    name,
    fullName: `${name}${Math.floor(midi / 12) - 1}`,
    syllable: SYLLABLES[pitch] ?? '—',
    solfege: SOLFEGE[pitch] ?? '变化音',
  }
}

export function midiToFrequency(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12)
}

export function midiToFullName(midi: number) {
  return `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`
}

export function isInPosition(fret: number, position: PositionId) {
  if (position === 'all') return true
  const config = POSITION_CONFIG[position]
  return (position === '1' && fret === 0) || (fret >= config.start && fret <= config.end)
}

export function getFinger(fret: number, position: PositionId) {
  if (position === 'all' || fret === 0) return null
  const config = POSITION_CONFIG[position]
  const finger = fret - config.start + 1
  return finger >= 1 && finger <= 4 ? finger : null
}

export function getPositionScale(position: Exclude<PositionId, 'all'>) {
  const notes: GuitarNote[] = []
  for (let string = 6; string >= 1; string -= 1) {
    for (let fret = 0; fret <= 12; fret += 1) {
      const note = getNote(string, fret)
      if (isInPosition(fret, position) && C_MAJOR.has(note.midi % 12)) notes.push(note)
    }
  }
  return notes.sort((a, b) => a.midi - b.midi)
}

export function getPositionNotes(position: Exclude<PositionId, 'all'>, low = 48, high = 79) {
  return getPositionScale(position).filter((note) => note.midi >= low && note.midi <= high)
}

export const MELODY_POSITIONS: Record<string, Record<string, { string: number; fret: number }>> = {
  fifth: {
    '1': { string: 3, fret: 5 }, '2': { string: 3, fret: 7 }, '3': { string: 2, fret: 5 },
    '4': { string: 2, fret: 6 }, '5': { string: 2, fret: 8 }, '6': { string: 1, fret: 5 },
    '7': { string: 1, fret: 7 }, '1̇': { string: 1, fret: 8 },
  },
  second: {
    '5': { string: 4, fret: 5 }, '6': { string: 3, fret: 2 }, '1': { string: 3, fret: 5 },
    '2': { string: 2, fret: 3 }, '3': { string: 2, fret: 5 }, '5̇': { string: 1, fret: 3 },
  },
}
