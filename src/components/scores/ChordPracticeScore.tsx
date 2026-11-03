import { useEffect, useState } from 'react'
import { Check, Pause, Play, Repeat2, Volume2 } from 'lucide-react'
import { CHORDS } from '../../data/chords'
import { guitarAudio } from '../../lib/audio'
import { CompleteButton, Tag } from '../ui/Common'
import { ChordDiagram } from '../chords/ChordDiagram'
import { getChordMidis } from '../../lib/chord-utils'

interface Props {
  completed: boolean
  onComplete: (id: string) => void
  onOpenChords: () => void
}

export function ChordPracticeScore({ completed, onComplete, onOpenChords }: Props) {
  const [version, setVersion] = useState<'open' | 'power'>('open')
  const [bpm, setBpm] = useState(50)
  const [playing, setPlaying] = useState(false)
  const [beat, setBeat] = useState(0)
  const [loop, setLoop] = useState(true)
  const chordIds = version === 'open' ? ['Em', 'C', 'G', 'D'] : ['E5', 'C5', 'G5', 'D5']
  const chords = chordIds.map((id) => CHORDS.find((chord) => chord.id === id)!)
  const currentBar = Math.floor(beat / 4)

  useEffect(() => {
    if (!playing) return
    if (beat % 4 === 0) guitarAudio.playChord(getChordMidis(chords[currentBar]))
    else guitarAudio.click(beat % 4 === 0)
    const timer = window.setTimeout(() => {
      if (beat >= 15) {
        if (loop) setBeat(0)
        else setPlaying(false)
      } else setBeat((value) => value + 1)
    }, 60000 / bpm)
    return () => window.clearTimeout(timer)
  }, [playing, beat, bpm, loop, currentBar, chords])

  function changeVersion(next: 'open' | 'power') {
    setVersion(next)
    setBeat(0)
    setPlaying(false)
  }

  return <div className="chord-practice-score">
    <div className="score-player-toolbar"><div className="segmented-large"><button type="button" className={version === 'open' ? 'active' : ''} onClick={() => changeVersion('open')}>开放和弦版</button><button type="button" className={version === 'power' ? 'active' : ''} onClick={() => changeVersion('power')}>五和弦版</button></div><button type="button" className="button button-primary" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}{playing ? '暂停' : '开始四小节'}</button><label className="range-label">速度 <b>{bpm} BPM</b><input type="range" min="40" max="100" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} /></label><button type="button" className={loop ? 'tool-toggle active' : 'tool-toggle'} aria-pressed={loop} onClick={() => setLoop(!loop)}><Repeat2 size={16} />循环 {loop ? '开' : '关'}</button></div>
    <div className="chord-score-sheet">{chords.map((chord, bar) => <div className={playing && currentBar === bar ? 'chord-score-bar active' : 'chord-score-bar'} key={chord.id}><div className="chord-score-title"><span>第 {bar + 1} 小节</span><button type="button" onClick={() => { setBeat(bar * 4); guitarAudio.playChord(getChordMidis(chord)) }}>{chord.name}<Volume2 size={16} /></button></div><div className="strum-grid">{[1, 2, 3, 4].map((item) => <button type="button" key={item} className={playing && beat === bar * 4 + item - 1 ? 'active' : ''} onClick={() => { setBeat(bar * 4 + item - 1); guitarAudio.playChord(getChordMidis(chord)) }}><b>↓</b><span>{item}</span></button>)}</div><p>四拍下拨 · 下一小节换和弦</p></div>)}</div>
    <div className="score-prereqs"><div className="prereq-title"><Check size={18} /><span>这张谱会用到</span></div><div className="prereq-tags"><Tag tone="mint" onClick={onOpenChords}>{version === 'open' ? 'Em · C · G · D' : 'E5 · C5 · G5 · D5'}</Tag><Tag>第一把位手型</Tag><Tag>4/4 拍</Tag><Tag>全下拨</Tag><Tag>每小节换和弦</Tag><Tag tone="coral">从 50 BPM 开始</Tag></div><div className="prereq-bottom"><p>这是为零基础练习重新编配的四和弦进行，不是《天下》官方原谱，也不包含原曲音频与完整歌词。先保证换和弦时四拍都稳，再逐渐加速。</p></div></div>
    <div className="score-chord-reference">{chords.map((chord) => <div key={chord.id}><ChordDiagram chord={chord} compact /><b>{chord.name}</b><span>{chord.tip}</span></div>)}</div>
    <div className="score-complete"><CompleteButton complete={completed} onClick={() => onComplete('tianxia')}>我已完成这四小节练习</CompleteButton><span>先四拍一换，再尝试两拍一换。</span></div>
  </div>
}
