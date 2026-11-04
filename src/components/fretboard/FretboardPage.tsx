import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftRight, Check, Eye, EyeOff, Music2, Pause, Play, RotateCcw, Sparkles, Volume2, X } from 'lucide-react'
import { POSITION_CONFIG, getFinger, getNote, getPositionScale, type GuitarNote, type PositionId } from '../../lib/music'
import { guitarAudio } from '../../lib/audio'
import { SectionHeading, VideoLink } from '../ui/Common'
import { Tabs } from '../ui/Tabs'
import { JianpuNote } from '../music/JianpuNote'
import { Fretboard } from './Fretboard'

type PracticeMode = 'explore' | 'scale' | 'challenge'
type Challenge = { note: GuitarNote }

interface FretboardPageProps {
  position: PositionId
  onPositionChange: (position: PositionId) => void
  onChallengeResult: (correct: boolean, streak: number) => void
  challengeStats: { correct: number; total: number; bestStreak: number }
}

const POSITION_ITEMS: { id: PositionId; label: string }[] = [
  { id: '1', label: '第一把位' }, { id: '2', label: '第二把位' }, { id: '4', label: '第四把位' },
  { id: '5', label: '第五把位 · 5–8品' }, { id: 'mi', label: 'Mi 指型 · 12–15品' }, { id: 'all', label: '全指板' },
]

export function FretboardPage({ position, onPositionChange, onChallengeResult, challengeStats }: FretboardPageProps) {
  const [mode, setMode] = useState<PracticeMode>('explore')
  const [displayMode, setDisplayMode] = useState<'name' | 'syllable' | 'both'>('both')
  const [cMajorOnly, setCMajorOnly] = useState(true)
  const [hideNames, setHideNames] = useState(false)
  const [selected, setSelected] = useState<GuitarNote | null>(getNote(3, 5))
  const [scaleIndex, setScaleIndex] = useState<number | null>(null)
  const [scaleBpm, setScaleBpm] = useState(60)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [challengeResult, setChallengeResult] = useState<boolean | null>(null)
  const [streak, setStreak] = useState(0)
  const scaleNotes = useMemo(() => position === 'all' ? [] : getPositionScale(position), [position])
  const config = position === 'all' ? null : POSITION_CONFIG[position]

  useEffect(() => {
    if (scaleIndex === null || !scaleNotes.length) return
    const note = scaleNotes[scaleIndex]
    guitarAudio.playNote(note.midi, Math.min(0.65, 60 / scaleBpm))
    const timer = window.setTimeout(() => {
      if (scaleIndex >= scaleNotes.length - 1) setScaleIndex(null)
      else {
        setSelected(scaleNotes[scaleIndex + 1])
        setScaleIndex(scaleIndex + 1)
      }
    }, 60000 / scaleBpm)
    return () => window.clearTimeout(timer)
  }, [scaleIndex, scaleNotes, scaleBpm])

  function changePosition(next: PositionId) {
    onPositionChange(next)
    setScaleIndex(null)
    setChallenge(null)
    setChallengeResult(null)
    const notes = next === 'all' ? [] : getPositionScale(next)
    setSelected(next === 'all' ? getNote(3, 5) : notes.find((note) => note.name === 'C') ?? notes[0] ?? null)
  }

  function selectNote(note: GuitarNote) {
    if (mode === 'challenge' && challenge && challengeResult === null) {
      const correct = note.string === challenge.note.string && note.fret === challenge.note.fret
      answerChallenge(correct)
    }
    setSelected(note)
    guitarAudio.playNote(note.midi, 0.65)
  }

  function newChallenge() {
    if (position === 'all') onPositionChange('5')
    const pool = (position === 'all' ? getPositionScale('5') : scaleNotes).filter((note) => note.fret > 0)
    const note = pool[Math.floor(Math.random() * pool.length)]
    setChallenge({ note })
    setChallengeResult(null)
    setSelected(null)
    setHideNames(true)
    setMode('challenge')
  }

  function answerChallenge(correct: boolean) {
    if (challengeResult !== null) return
    const nextStreak = correct ? streak + 1 : 0
    setChallengeResult(correct)
    setStreak(nextStreak)
    setHideNames(false)
    onChallengeResult(correct, nextStreak)
    if (correct) guitarAudio.playNote(challenge!.note.midi, 0.8)
  }

  function changeMode(next: PracticeMode) {
    setMode(next)
    setScaleIndex(null)
    guitarAudio.stopAll()
    if (next === 'challenge') newChallenge()
    else { setChallenge(null); setChallengeResult(null); setHideNames(false) }
  }

  return (
    <section className="page-section fretboard-page" id="fretboard">
      <SectionHeading eyebrow="MAKE THE NECK YOUR MAP" title="指板训练，不再死记硬背" description="先点亮一个把位，再点音、听音、藏起答案。默认同时看简谱和唱名，让眼睛、耳朵和手指建立同一套联系。" action={<div className="stat-badge"><span>找音最佳连击</span><strong>{challengeStats.bestStreak}</strong></div>} />
      <Tabs label="把位选择" value={position} onChange={changePosition} items={POSITION_ITEMS} />
      <div className="position-intro">
        <div><span className="eyebrow">{position === 'all' ? 'FULL NECK' : position === 'mi' ? 'COURSE MI PATTERN' : `POSITION 0${position}`}</span><h3>{position === 'all' ? '全指板自由探索 · 0–15 品' : config?.title}</h3><p>{position === 'all' ? '点击任意弦品，观察同一个音在指板上的不同位置。' : config?.summary}</p></div>
        {config && <VideoLink page={config.videoPage}>跟着视频学这把位</VideoLink>}
      </div>
      <div className="fretboard-workbench">
        <div className="workbench-toolbar">
          <Tabs label="指板练习模式" variant="compact" value={mode} onChange={changeMode} items={[{ id: 'explore', label: '自由探索', icon: <Sparkles size={15} /> }, { id: 'scale', label: '音阶跟练', icon: <Music2 size={15} /> }, { id: 'challenge', label: '找音练习', icon: <ArrowLeftRight size={15} /> }]} />
          <div className="toolbar-actions">
            <div className="segmented-mini" aria-label="音符显示方式">{(['name', 'syllable', 'both'] as const).map((item) => <button type="button" key={item} className={displayMode === item ? 'active' : ''} onClick={() => setDisplayMode(item)}>{item === 'name' ? '音名' : item === 'syllable' ? '简谱' : '简谱＋唱名'}</button>)}</div>
            <button type="button" className={cMajorOnly ? 'tool-toggle active' : 'tool-toggle'} aria-pressed={cMajorOnly} onClick={() => setCMajorOnly(!cMajorOnly)}>只看 C 大调</button>
            <button type="button" className={hideNames ? 'tool-toggle active' : 'tool-toggle'} aria-pressed={hideNames} onClick={() => setHideNames(!hideNames)}>{hideNames ? <Eye size={16} /> : <EyeOff size={16} />}{hideNames ? '显示答案' : '隐藏答案'}</button>
          </div>
        </div>
        {mode === 'challenge' && challenge && <div className={`challenge-prompt ${challengeResult === null ? '' : challengeResult ? 'success' : 'retry'}`}>
          <div><span className="eyebrow">FIND THE NOTE · 当前连击 {streak}</span><h3>在指板上找到 <b>{challenge.note.name}</b></h3><p>{challengeResult === null ? '直接点击对应的弦品，答错也会立即听到真实音高。' : challengeResult ? '找到了！再听一次，把这个位置和声音一起记住。' : '正确位置已经点亮，对比刚才选的位置再听一次。'}</p></div>
          <div className="challenge-feedback">{challengeResult !== null && <><span>{challengeResult ? <Check size={18} /> : <X size={18} />}{challenge.note.string} 弦 {challenge.note.fret} 品 = {challenge.note.fullName}</span><button type="button" className="button button-primary" onClick={newChallenge}>再找一个 <RotateCcw size={16} /></button></>}</div>
        </div>}
        {mode === 'scale' && position !== 'all' && <div className="scale-player"><button type="button" className="button button-primary" onClick={() => { if (scaleIndex === null) setSelected(scaleNotes[0]); setScaleIndex(scaleIndex === null ? 0 : null) }}>{scaleIndex === null ? <Play size={17} /> : <Pause size={17} />}{scaleIndex === null ? '从低音到高音播放' : '暂停音阶'}</button><div className="scale-progress"><span>{scaleIndex === null ? '准备开始' : `${scaleIndex + 1} / ${scaleNotes.length}`}</span><progress max={scaleNotes.length} value={scaleIndex === null ? 0 : scaleIndex + 1} /></div><label>速度 <b>{scaleBpm}</b> BPM<input type="range" min="40" max="100" value={scaleBpm} onChange={(event) => setScaleBpm(Number(event.target.value))} /></label></div>}
        {mode === 'scale' && position === 'all' && <div className="inline-hint">音阶跟练需要先选定一个把位或课程指型。点击上方「第五把位」即可开始。</div>}
        <Fretboard position={position} displayMode={displayMode} cMajorOnly={cMajorOnly} hideNames={hideNames} selected={selected} highlighted={scaleIndex !== null ? [scaleNotes[scaleIndex]] : []} onSelect={selectNote} correctTarget={challengeResult !== null ? challenge?.note : null} />
        <div className="fretboard-legend"><span><i className="legend-dot in" />当前把位</span><span><i className="legend-dot out" />暂时淡化</span><span>1=C · 上点高八度 / 下点低八度</span><span>圆点角标是建议手指</span><span>键盘：方向键移动 · 回车发声</span></div>
        {selected && <div className="note-inspector" aria-live="polite"><div className="note-identity"><span>{selected.string} 弦 · {selected.fret} 品</span><strong>{selected.fullName}</strong><div className="note-jianpu"><JianpuNote midi={selected.midi} /></div></div><div className="note-details"><p><span>音名</span>{selected.name}</p><p><span>简谱角色</span>{selected.syllable === '—' ? 'C 大调外的变化音' : selected.syllable}</p><p><span>建议手指</span>{getFinger(selected.fret, position) ? `${getFinger(selected.fret, position)} 指` : selected.fret === 0 ? '空弦，不用按' : '自由选择'}</p><p><span>物理频率</span>{(440 * 2 ** ((selected.midi - 69) / 12)).toFixed(1)} Hz</p></div><div className="note-actions"><button type="button" className="button button-secondary" onClick={() => guitarAudio.playNote(selected.midi, 0.8)}><Volume2 size={16} />再听一次</button><button type="button" className="text-button" onClick={() => { const next = getNote(selected.string, Math.max(0, selected.fret - 1)); setSelected(next); guitarAudio.playNote(next.midi) }}>低半音</button><button type="button" className="text-button" onClick={() => { const next = getNote(selected.string, Math.min(15, selected.fret + 1)); setSelected(next); guitarAudio.playNote(next.midi) }}>高半音</button></div></div>}
      </div>
      <div className="practice-tip"><span>记忆小口诀</span><p><b>先看弦，再看品；先听音，再藏名。</b>每天一个把位练 5 分钟，比一次背完整张指板更容易留下长期记忆。</p></div>
    </section>
  )
}
