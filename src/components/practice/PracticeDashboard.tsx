import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { BarChart3, Check, Pause, Play, RotateCcw, ShieldCheck, TimerReset, Trash2 } from 'lucide-react'
import { getStreak, getWeekDays, todayKey, type ProgressState } from '../../lib/progress'
import { ProgressRing } from '../ui/Common'
const PracticeChart = lazy(() => import('./PracticeChart').then((module) => ({ default: module.PracticeChart })))

interface Props {
  progress: ProgressState
  onRecord: (activity: string, minutes: number) => void
  onReset: () => void
}

const PLAN = [
  { id: '节奏与乐理', minutes: 3, detail: '四四拍 + 一个乐理小卡' },
  { id: '指板找音', minutes: 5, detail: '当前把位 + 找音挑战' },
  { id: '和弦切换', minutes: 4, detail: '一组和弦，四拍慢换' },
  { id: '曲谱跟练', minutes: 3, detail: '一个难小节，循环三遍' },
]

export function PracticeDashboard({ progress, onRecord, onReset }: Props) {
  const [goal, setGoal] = useState(15)
  const [active, setActive] = useState<string | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [done, setDone] = useState<string[]>([])
  const dialog = useRef<HTMLDialogElement>(null)
  const today = progress.practiceDays[todayKey()] ?? { minutes: 0, activities: [] }
  const week = getWeekDays()
  const weekMinutes = week.reduce((total, day) => total + (progress.practiceDays[day.key]?.minutes ?? 0), 0)
  const accuracy = progress.challenge.total ? Math.round((progress.challenge.correct / progress.challenge.total) * 100) : 0

  useEffect(() => {
    if (!active) return
    const timer = window.setInterval(() => setSeconds((value) => {
      const next = value + 1
      if (next % 60 === 0) onRecord(active, 1)
      return next
    }), 1000)
    return () => window.clearInterval(timer)
  }, [active, onRecord])

  function complete(id: string, minutes: number) {
    if (!done.includes(id)) {
      setDone((items) => [...items, id])
      onRecord(id, minutes)
    }
  }

  return <section className="practice-dashboard" id="practice"><div className="dashboard-heading"><div><span className="eyebrow">TODAY'S LITTLE WIN</span><h2>今天，只进步 15 分钟</h2><p>不用等完整的一小时。四个小任务，做完就是胜利。</p></div><div className="goal-editor"><label htmlFor="daily-goal">今日目标</label><div><input id="daily-goal" type="number" min="5" max="120" step="5" value={goal} onChange={(event) => setGoal(Math.max(5, Number(event.target.value)))} /><span>分钟</span></div></div></div><div className="dashboard-grid"><div className="daily-plan"><div className="daily-progress"><ProgressRing value={Math.min(100, (today.minutes / goal) * 100)} label={`今日目标已完成${today.minutes}分钟，共${goal}分钟`} caption="今日完成" /><div><strong>{today.minutes}<small> / {goal} 分钟</small></strong><span>{today.minutes >= goal ? '目标完成，给自己一点掌声。' : `再来 ${Math.max(0, goal - today.minutes)} 分钟，就完成今天的小目标。`}</span><div className="streak-line">连续练习 <b>{getStreak(progress.practiceDays)}</b> 天</div></div></div><div className="plan-list">{PLAN.map((item) => <div className={done.includes(item.id) ? 'plan-item done' : 'plan-item'} key={item.id}><button type="button" className="plan-check" aria-label={`完成${item.id}`} onClick={() => complete(item.id, item.minutes)}>{done.includes(item.id) ? <Check size={16} /> : <span />}</button><div><b>{item.id}<small>{item.minutes} 分钟</small></b><span>{item.detail}</span></div><button type="button" className={active === item.id ? 'plan-play active' : 'plan-play'} aria-label={active === item.id ? `暂停${item.id}计时` : `开始${item.id}计时`} onClick={() => { setSeconds(0); setActive(active === item.id ? null : item.id) }}>{active === item.id ? <Pause size={16} /> : <Play size={16} />}</button></div>)}</div>{active && <div className="active-timer" role="status"><span><i className="live-dot" />正在计时 · {active}</span><b>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</b><button type="button" onClick={() => setActive(null)}>停止</button></div>}</div><div className="week-chart-card"><div className="chart-heading"><div><BarChart3 size={18} /><span>近 7 天练习</span></div><b>{weekMinutes}<small> 分钟</small></b></div><Suspense fallback={<div className="practice-chart chart-loading">正在准备练习图表…</div>}><PracticeChart days={progress.practiceDays} /></Suspense>{weekMinutes === 0 && <div className="chart-empty"><TimerReset size={23} /><p>你的第一根练习柱，<br />会从今天的 3 分钟开始。</p></div>}<div className="chart-caption"><ShieldCheck size={15} />只保存在当前浏览器，不上传练习数据</div></div></div><div className="dashboard-footer"><div><span>找音挑战</span><b>{progress.challenge.correct} / {progress.challenge.total}</b><small>答对 / 总题数</small></div><div><span>当前正确率</span><b>{accuracy}%</b><small>最佳连击 {progress.challenge.bestStreak}</small></div><div><span>已完成曲谱</span><b>{progress.completedScores.length} / 3</b><small>慢练达标才算完成</small></div><button type="button" className="reset-data" onClick={() => dialog.current?.showModal()}><Trash2 size={15} />清除本机记录</button></div><dialog ref={dialog} className="confirm-dialog" aria-labelledby="reset-title"><h3 id="reset-title">清除所有练习记录？</h3><p>乐理完成状态、曲谱记录、挑战成绩和练习分钟都会从当前浏览器删除。这个操作无法撤销。</p><div><button type="button" className="button button-secondary" onClick={() => dialog.current?.close()}>保留记录</button><button type="button" className="button button-danger" onClick={() => { onReset(); setDone([]); setActive(null); dialog.current?.close() }}><RotateCcw size={16} />确认清除</button></div></dialog></section>
}
