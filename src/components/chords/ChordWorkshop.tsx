import { useEffect, useState } from 'react'
import { ArrowRight, Check, ChevronRight, Music, Pause, Play, RotateCcw, Timer, Volume2 } from 'lucide-react'
import { CHORDS, SWITCH_PAIRS, type ChordDef } from '../../data/chords'
import { guitarAudio } from '../../lib/audio'
import { ProgressRing, SectionHeading, Tag } from '../ui/Common'
import { Tabs } from '../ui/Tabs'
import { ChordDiagram } from './ChordDiagram'
import { getChordMidis } from '../../lib/chord-utils'

interface ChordWorkshopProps {
  onOpenScore: (id: string) => void
  chordBest: Record<string, number>
  onChordBest: (pair: string, count: number) => void
}

export function ChordWorkshop({ onOpenScore, chordBest, onChordBest }: ChordWorkshopProps) {
  const [area, setArea] = useState<'library' | 'switch'>('library')
  const [family, setFamily] = useState<'开放和弦' | '五和弦'>('开放和弦')
  const [selected, setSelected] = useState<ChordDef>(CHORDS[0])
  const [pairId, setPairId] = useState('Em-Am')
  const [bpm, setBpm] = useState(60)
  const [beatsPerChange, setBeatsPerChange] = useState(4)
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(60)
  const [count, setCount] = useState(0)
  const [beat, setBeat] = useState(0)
  const pair = SWITCH_PAIRS.find((item) => item.id === pairId) ?? SWITCH_PAIRS[0]
  const fromChord = CHORDS.find((chord) => chord.id === pair.from)!
  const toChord = CHORDS.find((chord) => chord.id === pair.to)!
  const currentChord = Math.floor(beat / beatsPerChange) % 2 === 0 ? fromChord : toChord

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value <= 1) {
        setRunning(false)
        onChordBest(pairId, count)
        return 0
      }
      return value - 1
    }), 1000)
    return () => window.clearInterval(timer)
  }, [running, pairId, count, onChordBest])

  useEffect(() => {
    if (!running) return
    guitarAudio.click(beat % beatsPerChange === 0)
    const timer = window.setTimeout(() => setBeat((value) => value + 1), 60000 / bpm)
    return () => window.clearTimeout(timer)
  }, [running, beat, bpm, beatsPerChange])

  function start() {
    if (running) { setRunning(false); return }
    if (seconds === 0) { setSeconds(60); setCount(0) }
    setRunning(true)
  }

  function reset() {
    setRunning(false)
    setSeconds(60)
    setCount(0)
    setBeat(0)
  }

  function registerSwitch() {
    if (!running || seconds === 0) return
    const next = count + 1
    setCount(next)
    guitarAudio.playChord(getChordMidis(next % 2 === 0 ? fromChord : toChord))
  }

  function selectFamily(value: '开放和弦' | '五和弦') {
    setFamily(value)
    const first = CHORDS.find((chord) => chord.family === value)
    if (first) setSelected(first)
  }

  return (
    <section className="page-section chords-page" id="chords">
      <SectionHeading eyebrow="CHORD WORKSHOP" title="和弦工坊，从按响到换稳" description="先看懂每根手指为什么在那里，再用计时器练切换。网站不会假装听见你的琴，成绩由你真实点击记录。" action={<Tag tone="coral">11 个入门和弦</Tag>} />
      <Tabs label="和弦学习区域" value={area} onChange={setArea} items={[{ id: 'library', label: '和弦图书馆', icon: <Music size={16} /> }, { id: 'switch', label: '和弦切换训练', icon: <Timer size={16} /> }]} />
      {area === 'library' ? <div className="chord-library">
        <div className="chord-browser">
          <Tabs label="和弦类型" variant="compact" value={family} onChange={selectFamily} items={[{ id: '开放和弦', label: '开放和弦' }, { id: '五和弦', label: '五和弦 Power Chord' }]} />
          <div className="chord-list">{CHORDS.filter((chord) => chord.family === family).map((chord) => <button type="button" key={chord.id} className={selected.id === chord.id ? 'chord-list-item active' : 'chord-list-item'} onClick={() => setSelected(chord)}><span><b>{chord.name}</b><small>{chord.quality.split(' · ')[1]}</small></span><span className="difficulty" aria-label={`难度${chord.difficulty}级`}>{Array.from({ length: 3 }, (_, index) => <i key={index} className={index < chord.difficulty ? 'filled' : ''} />)}</span><ChevronRight size={17} /></button>)}</div>
        </div>
        <article className="chord-detail">
          <div className="chord-detail-main"><div className="chord-diagram-wrap"><ChordDiagram chord={selected} /><span className="diagram-hint"><Volume2 size={14} />点击指法图试听</span></div><div className="chord-copy"><span className="eyebrow">{selected.family} · ROOT {selected.root}</span><h3>{selected.name}<small>{selected.quality}</small></h3><div className="chord-facts"><div><span>根音</span><b>{selected.root}</b></div><div><span>入门难度</span><b>{['', '轻松上手', '稍加练习', '需要耐心'][selected.difficulty]}</b></div><div><span>发声琴弦</span><b>{selected.strings.filter((fret) => fret >= 0).length} 根</b></div></div><button type="button" className="button button-primary" onClick={() => guitarAudio.playChord(getChordMidis(selected))}><Play size={17} fill="currentColor" />扫弦试听</button><button type="button" className="button button-secondary" onClick={() => guitarAudio.playChord(getChordMidis(selected), true)}><Volume2 size={17} />逐弦检查</button></div></div>
          <div className="chord-advice"><div><Check size={18} /><p><b>这样练</b>{selected.tip}</p></div><div><span>!</span><p><b>常见小问题</b>{selected.mistake}</p></div></div>
          <div className="chord-reading"><span>图怎么读？</span><p>竖线从左到右是 <b>6 → 1 弦</b>；○ 是空弦，× 是不弹，圆点数字是左手手指。橙色圆点表示根音。</p></div>
        </article>
      </div> : <div className="switch-workspace">
        <div className="switch-controls">
          <span className="eyebrow">60 秒切换挑战</span><h3>不求快，先求每一次都响</h3><p>{pair.tip}</p>
          <label className="field-label">选择和弦组合<select value={pairId} disabled={running} onChange={(event) => { setPairId(event.target.value); reset() }}>{SWITCH_PAIRS.map((item) => <option key={item.id} value={item.id}>{item.from} ↔ {item.to}</option>)}</select></label>
          <div className="field-label">每几拍换一次？<div className="segmented-large">{[4, 2, 1].map((value) => <button type="button" key={value} disabled={running} className={beatsPerChange === value ? 'active' : ''} onClick={() => { setBeatsPerChange(value); setBeat(0) }}>{value === 4 ? '四拍慢换' : value === 2 ? '两拍换' : '一拍换'}</button>)}</div></div>
          <label className="range-label">节拍速度 <b>{bpm} BPM</b><input type="range" min="40" max="100" disabled={running} value={bpm} onChange={(event) => setBpm(Number(event.target.value))} /></label>
          <div className="switch-buttons"><button type="button" className="button button-primary" onClick={start}>{running ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}{running ? '暂停本轮' : seconds < 60 && seconds > 0 ? '继续本轮' : '开始 60 秒'}</button><button type="button" className="icon-button" onClick={reset} aria-label="重置本轮"><RotateCcw size={18} /></button></div>
          <p className="best-score">本组合最好成绩：<b>{chordBest[pairId] ?? 0}</b> 次 / 分钟</p>
        </div>
        <div className="switch-stage">
          <div className="timer-ring"><ProgressRing value={(seconds / 60) * 100} label={`本轮剩余${seconds}秒`} caption="剩余时间" /><strong className="timer-number">{seconds}<small>s</small></strong></div>
          <div className="beat-dots" aria-label={`当前第${(beat % beatsPerChange) + 1}拍`}>{Array.from({ length: beatsPerChange }, (_, index) => <i key={index} className={running && beat % beatsPerChange === index ? 'active' : ''} />)}</div>
          <div className="current-chord"><span>现在弹</span><strong>{running ? currentChord.name : `${pair.from} ↔ ${pair.to}`}</strong><small>{running ? '跟着节拍准备下一次切换' : '准备好后，从第一个和弦开始'}</small></div>
          <button type="button" className="switch-hit" disabled={!running || seconds === 0} onClick={registerSwitch}><span>每成功换一次，就点这里</span><b>完成一次切换</b><strong>{count}</strong></button>
          {seconds === 0 && <div className="session-result" role="status"><Check size={20} /><p><b>本轮完成：{count} 次</b>{count >= (chordBest[pairId] ?? 0) ? '新纪录已经保存在这台设备上。' : '已经保存在本轮记录里，再试一次会更稳。'}</p></div>}
        </div>
        <div className="switch-mini-diagrams"><div><ChordDiagram chord={fromChord} compact /><b>{pair.from}</b></div><ArrowRight size={24} /><div><ChordDiagram chord={toChord} compact /><b>{pair.to}</b></div></div>
      </div>}
      <div className="tianxia-card"><div><span className="eyebrow">FIRST SONG · 入门简化版</span><h3>《天下》四和弦练习</h3><p><b>Em — C — G — D</b>，每个和弦四拍，只用下拨。也可以换成五和弦手型，体验更摇滚的声音。</p><div className="tag-row"><Tag>4/4 拍</Tag><Tag>建议 50 BPM</Tag><Tag tone="coral">非官方原谱</Tag></div></div><div className="tianxia-chords">{['Em', 'C', 'G', 'D'].map((id) => <button type="button" key={id} onClick={() => guitarAudio.playChord(getChordMidis(CHORDS.find((chord) => chord.id === id)!))}>{id}<Volume2 size={14} /></button>)}</div><button type="button" className="button button-light" onClick={() => onOpenScore('tianxia')}>打开完整练习谱 <ArrowRight size={17} /></button></div>
    </section>
  )
}
