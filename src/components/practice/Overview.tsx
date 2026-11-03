import { ArrowRight, BookOpen, CheckCircle2, Clock3, Flame, Guitar, Map, Music2, Play, Sparkles } from 'lucide-react'
import { COURSE, COURSE_LINKS } from '../../data/course'
import { getStreak, type ProgressState } from '../../lib/progress'
import { ExternalSource, VideoLink } from '../ui/Common'
import { GuitarArt } from '../ui/GuitarArt'
import { PracticeDashboard } from './PracticeDashboard'

interface OverviewProps {
  progress: ProgressState
  onNavigate: (tab: string) => void
  onContinue: () => void
  onRecord: (activity: string, minutes: number) => void
  onReset: () => void
}

export function Overview({ progress, onNavigate, onContinue, onRecord, onReset }: OverviewProps) {
  const paths = [
    { id: 'theory', step: '01', title: '乐理知识', subtitle: '先听懂，再看懂', text: '六线谱、简谱、节奏、把位与和弦，全部配互动图解。', icon: <BookOpen size={23} />, progress: Math.round((progress.completedTheory.length / 6) * 100), color: 'mint' },
    { id: 'fretboard', step: '02', title: '指板训练', subtitle: '让手指知道去哪', text: '第一、二、四、五把位，点音发声与找音挑战。', icon: <Map size={23} />, progress: progress.challenge.total, color: 'blue' },
    { id: 'chords', step: '03', title: '和弦工坊', subtitle: '从按响到换稳', text: '开放和弦、五和弦，以及 60 秒切换训练。', icon: <Guitar size={23} />, progress: Object.keys(progress.chordBest).length * 25, color: 'coral' },
    { id: 'scores', step: '04', title: '曲谱跟练', subtitle: '把练习变成音乐', text: '小星星、青花瓷课程片段与天下简化和弦版。', icon: <Music2 size={23} />, progress: Math.round((progress.completedScores.length / 3) * 100), color: 'gold' },
  ]
  return <>
    <section className="hero-section"><div className="hero-grid-pattern" /><div className="hero-copy"><div className="hero-kicker"><Sparkles size={15} /><span>为零基础设计的电吉他互动练习室</span></div><h1>把指板，变成你的<br /><em>第二张地图。</em></h1><p>跟着「{COURSE.author}」学，也用「弦上」练。<br className="desktop-break" />从第一个音到第一段旋律，每一步都能点、能听、能跟上。</p><div className="hero-actions"><button type="button" className="button button-coral button-large" onClick={onContinue}><Play size={18} fill="currentColor" />继续上次练习<ArrowRight size={18} /></button><button type="button" className="button button-ghost button-large" onClick={() => onNavigate('fretboard')}>从第一把位开始</button></div><div className="hero-proof"><div><strong>4</strong><span>互动学习区</span></div><i /><div><strong>0–12</strong><span>品全指板发声</span></div><i /><div><strong>15<small>min</small></strong><span>每日微练习</span></div></div></div><GuitarArt /><div className="hero-side-note"><span>NO TALENT REQUIRED</span><p>不需要「音乐细胞」，<br />只需要今天再弹一次。</p></div></section>
    <div className="overview-body"><PracticeDashboard progress={progress} onRecord={onRecord} onReset={onReset} /><section className="learning-path"><div className="section-heading"><div><span className="eyebrow">YOUR LEARNING PATH</span><h2>四步，走出新手村</h2><p>不用一次学完。每一区都可以独立使用，也会把相关练习串起来。</p></div></div><div className="path-grid">{paths.map((path) => <button type="button" className={`path-card path-${path.color}`} key={path.id} onClick={() => onNavigate(path.id)}><div className="path-card-top"><span>{path.step}</span>{path.icon}</div><span className="path-subtitle">{path.subtitle}</span><h3>{path.title}</h3><p>{path.text}</p><div className="path-bottom"><div><i style={{ width: `${Math.min(100, path.progress)}%` }} /><span>{path.id === 'fretboard' ? `${progress.challenge.total} 次挑战` : path.id === 'chords' ? `${Object.keys(progress.chordBest).length} 组成绩` : `${Math.min(100, path.progress)}% 完成`}</span></div><ArrowRight size={20} /></div></button>)}</div></section>
    <section className="course-companion"><div className="course-companion-main"><span className="eyebrow">VIDEO + PRACTICE</span><h2>视频负责教，网站陪你练</h2><p>本站根据「{COURSE.author}」的《{COURSE.title}》分集设置练习入口。视频里看动作，回到这里慢速找音、循环谱面。</p><div className="course-links">{COURSE_LINKS.map((link) => <div key={link.page}><span>{link.label}<small>{link.detail}</small></span><VideoLink page={link.page}>前往</VideoLink></div>)}</div><ExternalSource href={COURSE.baseUrl}>在 B 站打开完整课程</ExternalSource></div><div className="course-companion-side"><Flame size={28} /><span>当前连续练习</span><strong>{getStreak(progress.practiceDays)}<small>天</small></strong><p><Clock3 size={15} />建议每天同一时间，<br />让练琴变成自然而然的事。</p><div><CheckCircle2 size={17} />不用登录，也没有打卡压力</div></div></section>
    </div>
  </>
}
