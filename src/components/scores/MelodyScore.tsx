import { useCallback, useEffect, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Eye, EyeOff, Pause, Play, Repeat2, Volume2 } from 'lucide-react'
import { scoreEventNote, type MelodyScore as MelodyScoreData } from '../../data/scores'
import { guitarAudio } from '../../lib/audio'
import type { GuitarNote } from '../../lib/music'
import { CompleteButton, Tag, VideoLink } from '../ui/Common'
import { Fretboard } from '../fretboard/Fretboard'

interface Props {
  score: MelodyScoreData
  completed: boolean
  onComplete: (id: string) => void
  onOpenPosition: (position: '1' | '2' | '5') => void
}

export function MelodyScore({ score, completed, onComplete, onOpenPosition }: Props) {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(score.bpm)
  const [loop, setLoop] = useState('off')
  const [metronome, setMetronome] = useState(false)
  const [hideTab, setHideTab] = useState(false)
  const [locator, setLocator] = useState<GuitarNote | null>(null)
  const bars = Array.from(new Set(score.events.map((event) => event.bar)))
  const currentEvent = score.events[current]
  const currentNote = scoreEventNote(currentEvent)

  const rangeForLoop = useCallback(() => {
    if (!/^\d+$/.test(loop)) return { start: 0, end: score.events.length - 1 }
    const indices = score.events.map((event, index) => ({ event, index })).filter(({ event }) => event.bar === Number(loop)).map(({ index }) => index)
    return { start: indices[0] ?? 0, end: indices.at(-1) ?? score.events.length - 1 }
  }, [loop, score.events])

  const next = useCallback(() => {
    const { start, end } = rangeForLoop()
    if (current >= end) {
      if (loop === 'off') { setPlaying(false); return }
      setCurrent(start)
    } else setCurrent((value) => value + 1)
  }, [current, loop, rangeForLoop])

  useEffect(() => {
    if (!playing) return
    const event = score.events[current]
    const note = scoreEventNote(event)
    if (note) guitarAudio.playNote(note.midi, Math.min(1.4, (event.beats * 60) / bpm))
    const timer = window.setTimeout(next, (event.beats * 60000) / bpm)
    return () => window.clearTimeout(timer)
  }, [playing, current, bpm, next, score.events])

  useEffect(() => {
    if (!playing || !metronome) return
    let beat = 0
    guitarAudio.click(true)
    const timer = window.setInterval(() => {
      beat += 1
      guitarAudio.click(beat % 4 === 0)
    }, 60000 / bpm)
    return () => window.clearInterval(timer)
  }, [playing, metronome, bpm])

  function selectEvent(index: number) {
    setCurrent(index)
    const note = scoreEventNote(score.events[index])
    if (note) { setLocator(note); guitarAudio.playNote(note.midi, 0.65) }
  }

  function changeLoop(value: string) {
    setLoop(value)
    if (/^\d+$/.test(value)) {
      const index = score.events.findIndex((event) => event.bar === Number(value))
      if (index >= 0) setCurrent(index)
    }
  }

  return (
    <div className="melody-score">
      <div className="score-player-toolbar">
        <div className="player-main-buttons"><button type="button" className="button button-primary" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}{playing ? '暂停跟练' : '开始跟练'}</button><button type="button" className="icon-button" aria-label="上一个音" onClick={() => selectEvent(Math.max(0, current - 1))}><ChevronLeft size={19} /></button><button type="button" className="icon-button" aria-label="下一个音" onClick={() => selectEvent(Math.min(score.events.length - 1, current + 1))}><ChevronRight size={19} /></button></div>
        <label className="range-label">速度 <b>{bpm} BPM</b><input type="range" min="40" max="120" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} /></label>
        <label className="select-loop"><Repeat2 size={16} /><select aria-label="循环范围" value={loop} onChange={(event) => changeLoop(event.target.value)}><option value="off">不循环</option><option value="all">整首循环</option>{bars.map((bar) => <option key={bar} value={bar}>第 {bar} 小节循环</option>)}</select></label>
        <button type="button" className={metronome ? 'tool-toggle active' : 'tool-toggle'} aria-pressed={metronome} onClick={() => setMetronome(!metronome)}>节拍器 {metronome ? '开' : '关'}</button>
        <button type="button" className="tool-toggle" aria-pressed={hideTab} onClick={() => setHideTab(!hideTab)}>{hideTab ? <Eye size={16} /> : <EyeOff size={16} />}{hideTab ? '显示弦品' : '隐藏弦品'}</button>
      </div>
      <div className="score-progress"><span>第 {currentEvent.bar} 小节 · 第 {current + 1}/{score.events.length} 音</span><progress max={score.events.length} value={current + 1} /></div>
      <div className="score-sheet" aria-label={`${score.title}简谱和六线谱`}>
        <div className="sheet-header"><span>{score.key} · {score.time} 拍</span><b>慢练，也要每个音都清楚</b></div>
        <div className="score-bars">{bars.map((bar) => <div className={currentEvent.bar === bar ? 'score-bar current' : 'score-bar'} key={bar}><div className="bar-number">{String(bar).padStart(2, '0')}<span>小节</span></div><div className="bar-events">{score.events.map((event, index) => ({ event, index })).filter(({ event }) => event.bar === bar).map(({ event, index }) => <button type="button" key={index} className={current === index ? 'melody-note active' : 'melody-note'} style={{ flex: event.beats }} onClick={() => selectEvent(index)} aria-label={`第${bar}小节，简谱${event.syllable}${event.string ? `，${event.string}弦${event.fret}品` : '，休止'}，${event.beats}拍`}><b className="note-syllable">{event.syllable}</b><span className={event.beats === .5 ? 'note-duration is-eighth' : 'note-duration'}>{event.beats === 2 ? '—' : event.beats === 4 ? '— — —' : ''}</span><span className="six-lines">{[1, 2, 3, 4, 5, 6].map((string) => <i key={string}>{!hideTab && event.string === string ? event.fret : ''}</i>)}</span><small>{event.beats}拍</small></button>)}</div></div>)}</div>
      </div>
      <div className="current-note-strip" aria-live="polite"><div><span>当前音</span><strong>{currentEvent.syllable}</strong></div><p>{currentNote ? <><b>{currentNote.fullName}</b> · {currentNote.string} 弦 {currentNote.fret} 品{currentEvent.technique ? ` · ${currentEvent.technique}` : ''}</> : '休止：保持安静，但节拍继续向前走'}</p><button type="button" className="icon-button" disabled={!currentNote} aria-label="试听当前音" onClick={() => currentNote && guitarAudio.playNote(currentNote.midi, 0.7)}><Volume2 size={18} /></button></div>
      <div className="score-prereqs"><div className="prereq-title"><Check size={18} /><span>这张谱会用到</span></div><div className="prereq-tags"><Tag tone="mint" onClick={() => onOpenPosition(score.position)}>{score.positionLabel}</Tag>{score.chords.map((chord) => <Tag key={chord}>{chord}</Tag>)}<Tag>{score.key}</Tag><Tag>{score.time} 拍</Tag>{score.techniques.map((technique) => <Tag key={technique}>{technique}</Tag>)}<Tag tone="coral">从 {score.bpm} BPM 开始</Tag></div><div className="prereq-bottom"><p>{score.scope}</p><div><VideoLink page={score.videoPage}>课程讲解</VideoLink><VideoLink page={score.demoPage}>示范视频</VideoLink></div></div></div>
      <details className="locator-details"><summary>打开谱面指板定位器 <span>点击当前音，看看它在哪里</span></summary><Fretboard position={score.position} displayMode="both" cMajorOnly hideNames={false} selected={locator ?? currentNote} onSelect={(note) => { setLocator(note); guitarAudio.playNote(note.midi, 0.6) }} /></details>
      <div className="score-complete"><CompleteButton complete={completed} onClick={() => onComplete(score.id)}>我已完成这首慢速练习</CompleteButton><span>能连续两遍不出错，再加 5 BPM。</span></div>
    </div>
  )
}
