import { useState } from 'react'
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, XCircle } from 'lucide-react'
import { THEORY_OVERVIEW, THEORY_TOPICS } from '../../data/theory'
import { CompleteButton, SectionHeading, Tag } from '../ui/Common'
import { Tabs } from '../ui/Tabs'
import { TheoryVisual } from './TheoryVisual'

interface TheoryPageProps {
  completed: string[]
  onComplete: (id: string) => void
  onOpenChords: () => void
  onOpenFretboard: () => void
}

export function TheoryPage({ completed, onComplete, onOpenChords, onOpenFretboard }: TheoryPageProps) {
  const [topicId, setTopicId] = useState('tab')
  const topic = THEORY_TOPICS.find((item) => item.id === topicId) ?? THEORY_TOPICS[0]
  const completedCount = THEORY_TOPICS.filter((item) => completed.includes(item.id)).length

  return (
    <section className="page-section theory-page" id="theory">
      <SectionHeading eyebrow="THEORY WITHOUT TEARS" title="乐理知识，不讲天书" description="先看总图建立框架，再查自己卡住的地方。这里不做考试，每个概念都尽量落到能看、能听、能弹。" action={<div className="completion-count"><strong>{completedCount}<span>/{THEORY_TOPICS.length}</span></strong><small>已看懂</small></div>} />
      <details className="theory-overview" open>
        <summary><span><BookOpen size={19} />零基础乐理总图</span><small>练琴前扫一眼 · 点击收起</small></summary>
        <div className="theory-overview-grid">{THEORY_OVERVIEW.map((item, index) => <article key={item.id}>
          <span className="overview-index">{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.summary}</p>
          <details><summary>展开速查</summary><ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></details>
        </article>)}</div>
        <p className="overview-note"><b>怎样读这份网站：</b>“事实”是通行乐理与音高规则；“记谱约定”可能因教材而不同；“教学建议”是帮助你入门的练习顺序，不是不可违反的定律。</p>
      </details>
      <Tabs label="乐理二级分类" value={topicId} onChange={setTopicId} items={THEORY_TOPICS.map((item) => ({ id: item.id, label: item.title, icon: completed.includes(item.id) ? <CheckCircle2 size={15} /> : undefined }))} />
      <div className="theory-layout" role="tabpanel" id={`panel-乐理二级分类-${topic.id}`} aria-labelledby={`tab-乐理二级分类-${topic.id}`}>
        <article className="theory-copy">
          <div className="theory-title-row"><span className="eyebrow">{topic.eyebrow}</span><Tag tone="mint">{topic.minutes} 分钟</Tag></div>
          <h3>{topic.title}</h3><p className="theory-subtitle">{topic.subtitle}</p><p className="theory-intro">{topic.intro}</p>
          <div className="theory-points">{topic.points.map((point, index) => <div key={point.title}><span>{String(index + 1).padStart(2, '0')}</span><p><b>{point.title}</b>{point.text}</p></div>)}</div>
          <div className="example-pair"><div className="example-correct"><CheckCircle2 size={18} /><p><b>这样理解是对的</b>{topic.correct}</p></div><div className="example-wrong"><XCircle size={18} /><p><b>新手常见误会</b>{topic.wrong}</p></div></div>
          <div className="theory-sources"><span>资料依据</span>{topic.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={12} /></a>)}</div>
        </article>
        <div className="theory-interactive"><TheoryVisual topic={topic.id} /><div className="theory-actions"><CompleteButton complete={completed.includes(topic.id)} onClick={() => onComplete(topic.id)} />{topic.id === 'chords' && <button type="button" className="text-button" onClick={onOpenChords}>去按出第一个和弦 <ArrowRight size={16} /></button>}{topic.id !== 'chords' && <button type="button" className="text-button" onClick={onOpenFretboard}>去指板上找音 <ArrowRight size={16} /></button>}</div></div>
      </div>
    </section>
  )
}
