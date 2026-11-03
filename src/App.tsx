import { useCallback, useEffect, useState } from 'react'
import { BookOpen, CheckCircle2, ExternalLink, Guitar, Map, Music2 } from 'lucide-react'
import { ChordWorkshop } from './components/chords/ChordWorkshop'
import { FretboardPage } from './components/fretboard/FretboardPage'
import { Overview } from './components/practice/Overview'
import { ScorePage } from './components/scores/ScorePage'
import { TheoryPage } from './components/theory/TheoryPage'
import { Tabs } from './components/ui/Tabs'
import { COURSE, COURSE_LINKS } from './data/course'
import { guitarAudio } from './lib/audio'
import type { PositionId } from './lib/music'
import { clearProgress, EMPTY_PROGRESS, loadProgress, saveProgress, todayKey, type ProgressState } from './lib/progress'

type MainTab = 'overview' | 'theory' | 'fretboard' | 'chords' | 'scores'
const MAIN_TABS: MainTab[] = ['overview', 'theory', 'fretboard', 'chords', 'scores']

function initialTab(): MainTab {
  const hash = window.location.hash.replace('#', '').split('/')[0] as MainTab
  return MAIN_TABS.includes(hash) ? hash : 'overview'
}

export default function App() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress)
  const [tab, setTab] = useState<MainTab>(initialTab)
  const [position, setPosition] = useState<PositionId>((['all', '1', '2', '4', '5'].includes(loadProgress().lastPosition) ? loadProgress().lastPosition : '5') as PositionId)
  const [scoreId, setScoreId] = useState(window.location.hash.split('/')[1] ?? 'little-star')
  const [notice, setNotice] = useState('')

  useEffect(() => saveProgress(progress), [progress])
  useEffect(() => {
    const onHash = () => { setTab(initialTab()); const score = window.location.hash.split('/')[1]; if (score) setScoreId(score) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => { guitarAudio.stopAll() }, [tab])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 2800)
    return () => window.clearTimeout(timer)
  }, [notice])

  function navigate(next: string, options?: { score?: string; position?: PositionId }) {
    const target = MAIN_TABS.includes(next as MainTab) ? next as MainTab : 'overview'
    if (options?.score) setScoreId(options.score)
    if (options?.position) setPosition(options.position)
    setTab(target)
    setProgress((current) => ({ ...current, lastTab: target, lastPosition: options?.position ?? position }))
    const hash = target === 'overview' ? '' : `#${target}${target === 'scores' ? `/${options?.score ?? scoreId}` : ''}`
    window.history.pushState(null, '', `${window.location.pathname}${window.location.search}${hash}`)
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  const recordPractice = useCallback((activity: string, minutes: number) => {
    setProgress((current) => {
      const key = todayKey()
      const day = current.practiceDays[key] ?? { minutes: 0, activities: [] }
      return { ...current, practiceDays: { ...current.practiceDays, [key]: { minutes: day.minutes + minutes, activities: Array.from(new Set([...day.activities, activity])) } } }
    })
  }, [])

  const saveChordBest = useCallback((pair: string, count: number) => {
    setProgress((current) => ({ ...current, chordBest: { ...current.chordBest, [pair]: Math.max(current.chordBest[pair] ?? 0, count) } }))
  }, [])

  function completeTheory(id: string) {
    setProgress((current) => ({ ...current, completedTheory: Array.from(new Set([...current.completedTheory, id])) }))
    recordPractice('乐理知识', 1)
    setNotice('这一节已收进你的学习地图')
  }

  function completeScore(id: string) {
    setProgress((current) => ({ ...current, completedScores: Array.from(new Set([...current.completedScores, id])) }))
    recordPractice('曲谱跟练', 3)
    setNotice('完成一次慢练！稳定比速度更值得庆祝')
  }

  function resetAll() {
    clearProgress()
    setProgress(EMPTY_PROGRESS)
    setNotice('本机练习记录已清除')
  }

  const navItems = [
    { id: 'theory', label: '乐理知识', icon: <BookOpen size={17} /> },
    { id: 'fretboard', label: '指板训练', icon: <Map size={17} /> },
    { id: 'chords', label: '和弦工坊', icon: <Guitar size={17} /> },
    { id: 'scores', label: '曲谱跟练', icon: <Music2 size={17} /> },
  ]

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">跳到主要内容</a>
    <header className="site-header"><button type="button" className="brand" onClick={() => navigate('overview')} aria-label="弦上 FretFlow 首页"><span className="brand-mark"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M7 24c0-7 5-12 12-12 4 0 6 2 8 4l5-7 4 3-6 8c1 2 2 4 2 6 0 7-5 12-12 12S7 31 7 24Z"/><path className="brand-neck" d="m16 30 16-20"/><circle cx="16" cy="24" r="4"/></svg></span><span><b>弦上</b><small>FRETFLOW</small></span></button><div className="header-center">个人电吉他成长练习室</div><div className="local-status"><span className="live-dot" /><span>无需登录 · 本机保存</span></div></header>
    <div className="main-nav-wrap"><nav aria-label="主导航"><Tabs label="主导航" variant="main" value={tab === 'overview' ? 'theory' : tab} onChange={navigate} items={navItems} /></nav><button type="button" className={tab === 'overview' ? 'overview-link active' : 'overview-link'} onClick={() => navigate('overview')}>学习概览 <CheckCircle2 size={16} /></button></div>
    <main id="main-content" tabIndex={-1}>
      {tab === 'overview' && <Overview progress={progress} onNavigate={navigate} onContinue={() => navigate(progress.lastTab === 'overview' ? 'theory' : progress.lastTab)} onRecord={recordPractice} onReset={resetAll} />}
      {tab === 'theory' && <div role="tabpanel" id="panel-主导航-theory" aria-labelledby="tab-主导航-theory"><TheoryPage completed={progress.completedTheory} onComplete={completeTheory} onOpenChords={() => navigate('chords')} onOpenFretboard={() => navigate('fretboard')} /></div>}
      {tab === 'fretboard' && <div role="tabpanel" id="panel-主导航-fretboard" aria-labelledby="tab-主导航-fretboard"><FretboardPage position={position} onPositionChange={(next) => { setPosition(next); setProgress((current) => ({ ...current, lastPosition: next })) }} challengeStats={progress.challenge} onChallengeResult={(correct, streak) => setProgress((current) => ({ ...current, challenge: { correct: current.challenge.correct + (correct ? 1 : 0), total: current.challenge.total + 1, bestStreak: Math.max(current.challenge.bestStreak, streak) } }))} /></div>}
      {tab === 'chords' && <div role="tabpanel" id="panel-主导航-chords" aria-labelledby="tab-主导航-chords"><ChordWorkshop chordBest={progress.chordBest} onChordBest={saveChordBest} onOpenScore={(id) => navigate('scores', { score: id })} /></div>}
      {tab === 'scores' && <div role="tabpanel" id="panel-主导航-scores" aria-labelledby="tab-主导航-scores"><ScorePage selectedId={scoreId} onSelect={(id) => navigate('scores', { score: id })} completed={progress.completedScores} onComplete={completeScore} onOpenPosition={(next) => navigate('fretboard', { position: next })} onOpenChords={() => navigate('chords')} /></div>}
    </main>
    <footer className="site-footer"><div className="footer-brand"><b>弦上 FRETFLOW</b><span>每天一小节，指尖有答案。</span></div><p>学习伴侣，不替代课程本身。谱面为入门练习整理；《天下》为简化编配。</p><div>{COURSE_LINKS.slice(0, 1).map((link) => <a key={link.page} href={COURSE.baseUrl} target="_blank" rel="noreferrer">课程来源：{COURSE.author}<ExternalLink size={13} /></a>)}</div></footer>
    <div className={notice ? 'toast visible' : 'toast'} role="status" aria-live="polite"><CheckCircle2 size={18} />{notice}</div>
  </div>
}
