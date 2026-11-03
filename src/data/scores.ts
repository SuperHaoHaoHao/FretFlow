import { MELODY_POSITIONS, getNote } from '../lib/music'

export interface ScoreEvent {
  syllable: string
  beats: number
  string?: number
  fret?: number
  bar: number
  technique?: string
}

export interface MelodyScore {
  id: string
  kind: 'melody'
  title: string
  subtitle: string
  scope: string
  key: string
  time: string
  bpm: number
  position: '1' | '2' | '5'
  positionLabel: string
  chords: string[]
  techniques: string[]
  videoPage: number
  demoPage: number
  events: ScoreEvent[]
}

function melody(_id: string, position: 'fifth' | 'second', bar: number, syllables: string, rhythm: number[] = []): ScoreEvent[] {
  return syllables.trim().split(/\s+/).map((syllable, index) => {
    const location = MELODY_POSITIONS[position][syllable]
    return { syllable, beats: rhythm[index] ?? 1, string: location?.string, fret: location?.fret, bar }
  })
}

const littleStarBars = [
  '1 1 5 5 6 6 5', '4 4 3 3 2 2 1',
  '5 5 4 4 3 3 2', '5 5 4 4 3 3 2',
  '1 1 5 5 6 6 5', '4 4 3 3 2 2 1',
]

export const LITTLE_STAR: MelodyScore = {
  id: 'little-star', kind: 'melody', title: '小星星', subtitle: '第五把位 C 调 · 完整旋律', scope: '与 W1-EX9-No.4 对应的入门完整旋律，使用第五把位中高音区。', key: 'C 大调', time: '4/4', bpm: 60, position: '5', positionLabel: '第五把位 · 5–8 品', chords: ['旋律练习，无需和弦'], techniques: ['下拨', '一品一指', '二分音符长音'], videoPage: 17, demoPage: 19,
  events: littleStarBars.flatMap((notes, barIndex) => melody('little-star', 'fifth', barIndex + 1, notes, [1, 1, 1, 1, 1, 1, 2])),
}

export const BLUE_PORCELAIN: MelodyScore = {
  id: 'blue-porcelain', kind: 'melody', title: '青花瓷', subtitle: '第二把位 · 课程两句慢速练习', scope: '按课程「素胚……」与「釉色……」两句谱面整理的慢速练习片段，不是全曲谱；细微连线节奏以视频示范为准。', key: 'C 大调', time: '4/4', bpm: 50, position: '2', positionLabel: '第二把位 · 2–5 品', chords: ['旋律练习，无需和弦'], techniques: ['折指', '八分音符', '休止符', '保留指'], videoPage: 35, demoPage: 39,
  events: [
    ...melody('blue-a1', 'second', 1, '0 0 0 2 1 5', [.5, .5, .5, .5, 1, 1]),
    ...melody('blue-a2', 'second', 2, '1 1 6 1 1 6', [1, .5, .5, 1, .5, .5]),
    ...melody('blue-a3', 'second', 3, '1 6 5 0 2 1 6', [.5, .5, 1, .5, .5, .5, .5]),
    ...melody('blue-a4', 'second', 4, '1 1 6 1 1 3', [1, .5, .5, 1, .5, .5]),
    ...melody('blue-b1', 'second', 5, '0 2 1 6', [.5, .5, 1, 2]),
    ...melody('blue-b2', 'second', 6, '1 1 6 1 1 6', [1, .5, .5, 1, .5, .5]),
    ...melody('blue-b3', 'second', 7, '1 6 5 0 5 6 3', [.5, .5, 1, .5, .5, .5, .5]),
    { syllable: '1', beats: 4, string: 3, fret: 5, bar: 8, technique: '练习收尾长音' },
  ],
}

export const SCORES = [LITTLE_STAR, BLUE_PORCELAIN]

export function scoreEventNote(event: ScoreEvent) {
  return event.string !== undefined && event.fret !== undefined ? getNote(event.string, event.fret) : null
}
