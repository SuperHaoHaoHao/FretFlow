import { useEffect, useState } from 'react'
import { Pause, Play, Volume2 } from 'lucide-react'
import { guitarAudio } from '../../lib/audio'
import { getNote, STRING_MIDI } from '../../lib/music'

export function TheoryVisual({ topic }: { topic: string }) {
  switch (topic) {
    case 'tab': return <TabDiagram />
    case 'notes': return <PitchDiagram />
    case 'rhythm': return <RhythmDiagram />
    case 'position': return <PositionDiagram />
    case 'chords': return <ChordDiagram />
    default: return <TechniqueDiagram />
  }
}

function TabDiagram() {
  const [active, setActive] = useState(-1)
  const notes = [{ string: 3, fret: 0 }, { string: 3, fret: 2 }, { string: 2, fret: 0 }, { string: 2, fret: 1 }]
  function play() {
    notes.forEach((note, index) => guitarAudio.playNote(getNote(note.string, note.fret).midi, 0.5, index * 0.45))
    setActive(0)
  }
  useEffect(() => {
    if (active < 0) return
    const timer = window.setInterval(() => setActive((value) => {
      if (value >= notes.length - 1) { window.clearInterval(timer); return -1 }
      return value + 1
    }), 450)
    return () => window.clearInterval(timer)
  }, [active >= 0]) // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="visual-card"><div className="visual-topline"><span>小例子 · G 弦与 B 弦</span><button className="icon-button" type="button" onClick={play} aria-label="播放六线谱示例"><Play size={17} /></button></div><div className="tab-example">{['1弦 e', '2弦 B', '3弦 G', '4弦 D', '5弦 A', '6弦 E'].map((name, stringIndex) => <div className="tab-line" key={name}><span>{name}</span><div className="tab-rule" />{stringIndex === 2 && <><b className={active === 0 ? 'active' : ''}>0</b><b className={active === 1 ? 'active' : ''}>2</b></>}{stringIndex === 1 && <><b className={active === 2 ? 'active' : ''}>0</b><b className={active === 3 ? 'active' : ''}>1</b></>}</div>)}</div><p className="visual-caption">从左到右：G 空弦 → G 二品 → B 空弦 → B 一品。点击播放，跟着高亮读。</p></div>
}

function PitchDiagram() {
  const [active, setActive] = useState<number | null>(null)
  const scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']
  return <div className="visual-card"><div className="visual-topline"><span>点击音阶，建立音高感</span><Volume2 size={17} /></div><div className="pitch-ladder">{scale.map((note, index) => <button key={`${note}-${index}`} type="button" className={active === index ? 'pitch-step active' : 'pitch-step'} style={{ '--step': index } as React.CSSProperties} onClick={() => { setActive(index); guitarAudio.playNote(60 + [0, 2, 4, 5, 7, 9, 11, 12][index], 0.6) }}><span>{note}</span><b>{index === 7 ? '1̇' : index + 1}</b><small>{['do', 're', 'mi', 'fa', 'sol', 'la', 'si', 'do'][index]}</small></button>)}</div><div className="staff-mini" aria-label="C 大调五线谱示意">{[0, 1, 2, 3, 4].map((line) => <i key={line} />)}<div className="staff-notes">{scale.map((_, index) => <b key={index} style={{ bottom: `${index * 7 + 2}px`, left: `${index * 11 + 4}%` }} />)}</div><span className="treble">𝄞</span></div><p className="visual-caption">同一组音在简谱、音名和五线谱上的三种表达。</p></div>
}

function RhythmDiagram() {
  const [beat, setBeat] = useState(-1)
  const [bpm, setBpm] = useState(60)
  useEffect(() => {
    if (beat < 0) return
    guitarAudio.click(beat % 4 === 0)
    const timer = window.setTimeout(() => setBeat((value) => value >= 15 ? -1 : value + 1), 60000 / bpm)
    return () => window.clearTimeout(timer)
  }, [beat, bpm])
  return <div className="visual-card"><div className="visual-topline"><span>四四拍 · 两轮共八拍</span><button type="button" className="icon-button" onClick={() => setBeat((value) => value < 0 ? 0 : -1)} aria-label={beat < 0 ? '播放四四拍' : '停止节拍'}>{beat < 0 ? <Play size={17} /> : <Pause size={17} />}</button></div><div className="beat-grid">{Array.from({ length: 8 }, (_, index) => <button key={index} type="button" className={beat === index ? 'beat-cell active' : 'beat-cell'} onClick={() => guitarAudio.click(index % 4 === 0)}><b>{index % 4 + 1}</b><span>{index % 2 === 0 ? '♩' : '♫'}</span><small>{index % 2 === 0 ? '一拍' : '两个八分'}</small></button>)}</div><label className="range-label">节拍速度 <b>{bpm} BPM</b><input type="range" min="40" max="100" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} /></label><div className="duration-tree"><span>全音符 · 4拍</span><span>二分 · 2 + 2</span><span>四分 · 1 + 1 + 1 + 1</span><span>八分 · ½ × 8</span></div></div>
}

function PositionDiagram() {
  const [position, setPosition] = useState(5)
  return <div className="visual-card"><div className="visual-topline"><span>同一根弦，向琴身移动就是升高</span><div className="segmented-mini">{[1, 2, 5].map((item) => <button key={item} type="button" className={position === item ? 'active' : ''} onClick={() => setPosition(item)}>第{item}把位</button>)}</div></div><div className="position-mini"><div className="position-frets">{Array.from({ length: 9 }, (_, index) => <span key={index}>{index}</span>)}</div>{[1, 2, 3].map((string) => <div className="position-string" key={string}><span>{string}弦</span>{Array.from({ length: 9 }, (_, fret) => { const start = position; const active = fret >= start && fret <= start + 3; return <i key={fret} className={active ? 'in-position' : ''}>{active && C_MAJOR_NOTE(string, fret) ? <b>{getNote(string, fret).name}</b> : null}</i> })}</div>)}</div><p className="visual-caption">亮框是第 {position} 把位的「一品一指」区域，圆点是其中的 C 大调自然音。</p></div>
}

function C_MAJOR_NOTE(string: number, fret: number) { return [0, 2, 4, 5, 7, 9, 11].includes(getNote(string, fret).midi % 12) }

function ChordDiagram() {
  const [selected, setSelected] = useState('C')
  const recipes: Record<string, { notes: string[]; midis: number[]; label: string }> = { C: { notes: ['G', 'E', 'C'], midis: [67, 64, 60], label: '明亮的大三和弦' }, Am: { notes: ['E', 'C', 'A'], midis: [64, 60, 57], label: '柔和的小三和弦' }, E5: { notes: ['B', 'E'], midis: [59, 52], label: '只有根音和五音的五和弦' } }
  const recipe = recipes[selected]
  return <div className="visual-card"><div className="visual-topline"><div className="segmented-mini">{Object.keys(recipes).map((id) => <button key={id} className={selected === id ? 'active' : ''} type="button" onClick={() => setSelected(id)}>{id}</button>)}</div><button className="icon-button" type="button" aria-label={`试听${selected}和弦`} onClick={() => guitarAudio.playChord(recipe.midis, true)}><Volume2 size={17} /></button></div><div className="chord-stack">{recipe.notes.map((note, index) => <div key={note} style={{ '--stack-index': index } as React.CSSProperties}><span>{note}</span><small>{index === recipe.notes.length - 1 ? '根音' : index === recipe.notes.length - 2 ? '三音' : '五音'}</small></div>)}</div><p className="visual-caption">{selected} = {recipe.notes.slice().reverse().join(' + ')} · {recipe.label}。从低向高依次发声。</p></div>
}

function TechniqueDiagram() {
  const techniques = [{ sign: 'P.M.', name: '闷音', action: '右手掌根轻靠琴桥' }, { sign: '×', name: '制音', action: '左手轻触弦，不按出音高' }, { sign: 'h', name: '击弦', action: '左手敲击出第二个音' }, { sign: 'p', name: '勾弦', action: '左手指向下勾响琴弦' }, { sign: 's /', name: '滑弦', action: '按住音滑向另一品' }, { sign: 'b', name: '推弦', action: '推弦让音高上升' }, { sign: '~', name: '揉弦', action: '有规律地轻微改变音高' }, { sign: '////', name: '斜线记谱', action: '按节奏扫弦，不写具体音高' }]
  return <div className="technique-grid">{techniques.map((item) => <button type="button" key={item.name} onClick={() => guitarAudio.playNote(STRING_MIDI[2], 0.35)} className="technique-card"><b>{item.sign}</b><span>{item.name}</span><small>{item.action}</small></button>)}</div>
}
