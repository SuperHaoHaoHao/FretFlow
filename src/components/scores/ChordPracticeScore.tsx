import { useEffect, useMemo, useState } from 'react'
import { Check, ExternalLink, Pause, Play, Repeat2, Volume2 } from 'lucide-react'
import { CHORDS } from '../../data/chords'
import { guitarAudio } from '../../lib/audio'
import { getNote } from '../../lib/music'
import { CompleteButton, Tag } from '../ui/Common'
import { ChordDiagram } from '../chords/ChordDiagram'
import { getChordMidis } from '../../lib/chord-utils'

interface Props {
  completed: boolean
  onComplete: (id: string) => void
  onOpenChords: () => void
}

const POWER_IDS = ['A5', 'B5', 'G#5', 'C#5', 'A5', 'B5', 'G#5', 'C#5']
const SOLO_EVENTS = [
  { fret: 11, syllable: '6', solfege: 'la', beats: .5 },
  { fret: 9, syllable: '5', solfege: 'sol', beats: .5 },
  { fret: 9, syllable: '5', solfege: 'sol', beats: .5 },
  { fret: 11, syllable: '6', solfege: 'la', beats: .5 },
]

export function ChordPracticeScore({ completed, onComplete, onOpenChords }: Props) {
  const [mode, setMode] = useState<'power' | 'solo'>('power')
  const [bpm, setBpm] = useState(72)
  const [playing, setPlaying] = useState(false)
  const [beat, setBeat] = useState(0)
  const [soloIndex, setSoloIndex] = useState(0)
  const [loop, setLoop] = useState(true)
  const chords = useMemo(() => POWER_IDS.map((id) => CHORDS.find((chord) => chord.id === id)!), [])
  const currentBar = Math.floor(beat / 4)
  const currentSolo = SOLO_EVENTS[soloIndex]
  const currentSoloNote = getNote(4, currentSolo.fret)

  useEffect(() => {
    if (!playing || mode !== 'power') return
    guitarAudio.playChord(getChordMidis(chords[currentBar]), false, (60 / bpm) * 0.85)
    const timer = window.setTimeout(() => {
      if (beat >= 31) {
        if (loop) setBeat(0)
        else setPlaying(false)
      } else setBeat((value) => value + 1)
    }, 60000 / bpm)
    return () => window.clearTimeout(timer)
  }, [playing, mode, beat, bpm, loop, currentBar, chords])

  useEffect(() => {
    if (!playing || mode !== 'solo') return
    guitarAudio.playNote(currentSoloNote.midi, (currentSolo.beats * 60) / bpm)
    const timer = window.setTimeout(() => {
      if (soloIndex >= SOLO_EVENTS.length - 1) {
        if (loop) setSoloIndex(0)
        else setPlaying(false)
      } else setSoloIndex((value) => value + 1)
    }, (currentSolo.beats * 60000) / bpm)
    return () => window.clearTimeout(timer)
  }, [playing, mode, soloIndex, bpm, loop, currentSolo, currentSoloNote.midi])

  function changeMode(next: 'power' | 'solo') {
    setMode(next)
    setBeat(0)
    setSoloIndex(0)
    setPlaying(false)
    guitarAudio.stopAll()
  }

  function togglePlayback() {
    if (!playing && ((mode === 'power' && beat >= 31) || (mode === 'solo' && soloIndex >= SOLO_EVENTS.length - 1))) {
      setBeat(0)
      setSoloIndex(0)
    }
    setPlaying(!playing)
  }

  return <div className="chord-practice-score">
    <div className="score-player-toolbar">
      <div className="segmented-large"><button type="button" className={mode === 'power' ? 'active' : ''} onClick={() => changeMode('power')}>强力和弦伴奏</button><button type="button" className={mode === 'solo' ? 'active' : ''} onClick={() => changeMode('solo')}>Solo 四音片段</button></div>
      <button type="button" className="button button-primary" onClick={togglePlayback}>{playing ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}{playing ? '暂停' : mode === 'power' ? '开始八小节' : '播放四音片段'}</button>
      <label className="range-label">速度 <b>{bpm} BPM</b><input type="range" min="40" max="100" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} /></label>
      <button type="button" className={loop ? 'tool-toggle active' : 'tool-toggle'} aria-pressed={loop} onClick={() => setLoop(!loop)}><Repeat2 size={16} />循环 {loop ? '开' : '关'}</button>
    </div>

    {mode === 'power' ? <>
      <div className="chord-score-sheet tianxia-power-sheet">{chords.map((chord, bar) => <div className={playing && currentBar === bar ? 'chord-score-bar active' : 'chord-score-bar'} key={`${chord.id}-${bar}`}><div className="chord-score-title"><span>第 {bar + 1} 小节</span><button type="button" onClick={() => { setBeat(bar * 4); guitarAudio.playChord(getChordMidis(chord)) }}>{chord.name}<Volume2 size={16} /></button></div><div className="strum-grid">{[1, 2, 3, 4].map((item) => <button type="button" key={item} className={playing && beat === bar * 4 + item - 1 ? 'active' : ''} onClick={() => { setBeat(bar * 4 + item - 1); guitarAudio.playChord(getChordMidis(chord)) }}><b>↓</b><span>{item}</span></button>)}</div><p>四拍下拨 · 练习节奏</p></div>)}</div>
      <div className="score-prereqs"><div className="prereq-title"><Check size={18} /><span>这张伴奏会用到</span></div><div className="prereq-tags"><Tag tone="mint" onClick={onOpenChords}>A5 · B5 · G♯5 · C♯5</Tag><Tag>⑤弦与⑥弦根音</Tag><Tag>可移动手型</Tag><Tag>4/4 拍</Tag><Tag>全下拨</Tag><Tag>无三音</Tag><Tag tone="coral">参考 72 BPM</Tag></div><div className="prereq-bottom"><p>依据公开弹唱扒谱的副歌和声骨架，将 F—G—Em—Am 移高四品得到 A—B—G♯m—C♯m，再简化为强力和弦。每和弦一小节及右手节奏均为入门编排，不是原曲电吉他分轨逐音扒谱。</p><a className="text-button" href="https://www.jitapai.com/20201103.html" target="_blank" rel="noreferrer">和声依据<ExternalLink size={13} /></a></div></div>
      <div className="score-chord-reference">{chords.slice(0, 4).map((chord) => <div key={chord.id}><ChordDiagram chord={chord} compact /><b>{chord.name}</b><span>{chord.tip}</span></div>)}</div>
    </> : <>
      <div className="solo-fragment-sheet">
        <div className="solo-fragment-heading"><div><span className="eyebrow">DJ VERSION · VERIFIED FOUR NOTES</span><h3>公开视频里的四音片段</h3></div><Tag tone="coral">不是完整小节</Tag></div>
        <p>标准调弦 · 1=E · 四个八分音符，共 2 拍。数字按 E 大调唱名体系标注：6=la，5=sol。</p>
        <div className="solo-note-grid">{SOLO_EVENTS.map((event, index) => { const note = getNote(4, event.fret); return <button type="button" key={index} className={playing && soloIndex === index ? 'solo-note active' : 'solo-note'} onClick={() => { setSoloIndex(index); guitarAudio.playNote(note.midi, (event.beats * 60) / bpm) }}><span className="solo-jianpu"><b>{event.syllable}</b><small>{event.solfege}</small></span><strong>{note.fullName}</strong><span>4 弦 {event.fret} 品</span><small>八分音符 · ½ 拍</small></button> })}</div>
        <div className="solo-current-note" aria-live="polite">当前：4 弦 {currentSolo.fret} 品 · {currentSoloNote.fullName} · {currentSolo.syllable}（{currentSolo.solfege}）</div>
      </div>
      <div className="score-prereqs"><div className="prereq-title"><Check size={18} /><span>这个 Solo 片段会用到</span></div><div className="prereq-tags"><Tag tone="mint">四弦 9 / 11 品</Tag><Tag>1=E 的 5 与 6</Tag><Tag>八分音符</Tag><Tag>标准调弦</Tag><Tag>DJ 简单改编</Tag><Tag tone="coral">参考 72 BPM</Tag></div><div className="prereq-bottom"><p>只转录公开视频约 00:10 处能可靠辨认的 11–9–9–11 四音，不补写其他音符。它不是《明天过后》专辑原版 Solo，也不是完整 Solo；其余段落尚未核验。</p><a className="text-button" href="https://www.bilibili.com/video/BV1zt42177Tu/" target="_blank" rel="noreferrer">打开附谱视频<ExternalLink size={13} /></a></div></div>
    </>}
    <div className="score-complete"><CompleteButton complete={completed} onClick={() => onComplete('tianxia')}>我已完成这组练习</CompleteButton><span>伴奏先练手型移动，Solo 再把四个音连稳。</span></div>
  </div>
}
