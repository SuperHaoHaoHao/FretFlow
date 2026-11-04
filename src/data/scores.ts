import { MELODY_POSITIONS, getNote } from '../lib/music'

export interface ScoreEvent {
  syllable: string
  beats: number
  string?: number
  fret?: number
  bar: number
  technique?: string
  lyric?: string
  tie?: 'toNext' | 'fromPrev'
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

type CourseEvent = [syllable: string, beats: number, lyric?: string, tie?: ScoreEvent['tie']]

function course(position: 'second', bar: number, events: CourseEvent[]): ScoreEvent[] {
  return events.map(([syllable, beats, lyric, tie]) => {
    const location = syllable === '0' ? undefined : MELODY_POSITIONS[position][syllable]
    return { syllable, beats, lyric, tie, string: location?.string, fret: location?.fret, bar }
  })
}

const littleStarBars = [
  '1 1 5 5 6 6 5', '4 4 3 3 2 2 1',
  '5 5 4 4 3 3 2', '5 5 4 4 3 3 2',
  '1 1 5 5 6 6 5', '4 4 3 3 2 2 1',
]

export const LITTLE_STAR: MelodyScore = {
  id: 'little-star', kind: 'melody', title: '小星星', subtitle: '第五把位 C 调 · 完整旋律', scope: '与 W1-EX9-No.4 对应的入门完整旋律，使用第五把位 5–8 品。课程参考速度为 100 BPM，网站从 60 BPM 慢练。', key: 'C 大调', time: '4/4', bpm: 60, position: '5', positionLabel: '第五把位 · 5–8 品', chords: ['旋律练习，无需和弦'], techniques: ['下拨', '一品一指', '二分音符长音'], videoPage: 17, demoPage: 19,
  events: littleStarBars.flatMap((notes, barIndex) => melody('little-star', 'fifth', barIndex + 1, notes, [1, 1, 1, 1, 1, 1, 2])),
}

export const BLUE_PORCELAIN: MelodyScore = {
  id: 'blue-porcelain', kind: 'melody', title: '青花瓷', subtitle: '第二把位 · 课程 16 小节', scope: '按用户课程截图 W2-EX9 完整整理，共 16 小节，不是官方全曲谱。截图中的歌词“袖色渲”按原图保留，延音与八度点也以截图为准。', key: 'C 大调', time: '4/4', bpm: 80, position: '2', positionLabel: '第二把位 · 2–5 品', chords: ['旋律练习，无需和弦'], techniques: ['八度点', '八分音符', '休止符', '同音延音'], videoPage: 35, demoPage: 39,
  events: [
    ...course('second', 1, [['0', .5], ['0', .5], ['0', .5], ['2', .5, '素'], ['1', 1, '胚'], ['6̣', 1, '勾']]),
    ...course('second', 2, [['1', 1, '勒'], ['1', .5, '出'], ['6̣', .5, '青'], ['1', 1, '花'], ['1', .5, '笔'], ['6̣', .5, '锋']]),
    ...course('second', 3, [['1', .5, '浓'], ['6̣', .5, '转'], ['5̣', 1, '淡'], ['0', .5], ['2', .5, '瓶'], ['1', .5, '身'], ['6̣', .5, '描']]),
    ...course('second', 4, [['1', 1, '绘'], ['1', .5, '的'], ['6̣', .5, '牡'], ['1', 1, '丹'], ['1', .5, '一'], ['3', .5, '如']]),
    ...course('second', 5, [['2', .5, '你'], ['1', .5, '初'], ['1', 1, '装'], ['0', .5], ['5̣', .5, '冉'], ['6̣', .5, '冉'], ['3', .5, '檀']]),
    ...course('second', 6, [['3', 1, '香'], ['3', .5, '透'], ['2', .5, '过'], ['3', 1, '窗'], ['3', .5, '心'], ['2', .5, '事']]),
    ...course('second', 7, [['3', .5, '我'], ['5', .5, '了', 'toNext'], ['5', .5, undefined, 'fromPrev'], ['3', .5, '然', 'toNext'], ['3', .5, undefined, 'fromPrev'], ['3', .5, '宣'], ['3', .5, '纸'], ['3', .5, '上']]),
    ...course('second', 8, [['2', .5, '走'], ['2', .5, '笔'], ['2', .5, '至'], ['2', .5, '此'], ['2', 1, '搁'], ['1', .5, '一'], ['3', .5, '半', 'toNext']]),
    ...course('second', 9, [['3', .5, undefined, 'fromPrev'], ['2', 1.5], ['0', .5], ['2', .5, '袖'], ['1', .5, '色'], ['6̣', .5, '渲']]),
    ...course('second', 10, [['1', 1, '染'], ['1', .5, '仕'], ['6̣', .5, '女'], ['1', 1, '图'], ['1', .5, '韵'], ['6̣', .5, '味']]),
    ...course('second', 11, [['1', .5, '被'], ['6̣', .5, '私'], ['5̣', 1, '藏'], ['0', .5], ['5̣', .5, '而'], ['6̣', .5, '你'], ['3', .5, '依']]),
    ...course('second', 12, [['5', 1, '然'], ['5', .5, '的'], ['3', .5, '一'], ['5', 1, '笑'], ['5', .5, '如'], ['3', .5, '含']]),
    ...course('second', 13, [['2', .5, '苞'], ['1', .5, '待'], ['1', 1, '放'], ['0', .5], ['2', .5, '你'], ['1', .5, '的'], ['2', .5, '美']]),
    ...course('second', 14, [['3', .5, '一'], ['2', .5, '缕'], ['2', 1, '飘'], ['2', 1, '散'], ['1', .5, '去'], ['6̣', .5, '到']]),
    ...course('second', 15, [['2', .5, '我'], ['1', .5, '去'], ['1', .5, '不'], ['6̣', .5, '了'], ['1', 1, '的'], ['1', .5, '地'], ['1', .5, '方', 'toNext']]),
    ...course('second', 16, [['1', 4, undefined, 'fromPrev']]),
  ],
}

export const SCORES = [LITTLE_STAR, BLUE_PORCELAIN]

export function scoreEventNote(event: ScoreEvent) {
  return event.string !== undefined && event.fret !== undefined ? getNote(event.string, event.fret) : null
}

export function getEventSustainBeats(events: ScoreEvent[], start: number, end = events.length - 1) {
  const event = events[start]
  if (!event || event.tie !== 'toNext') return event?.beats ?? 0
  let beats = event.beats
  for (let index = start + 1; index <= end && events[index]?.tie === 'fromPrev'; index += 1) beats += events[index].beats
  return beats
}
