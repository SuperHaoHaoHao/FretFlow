import { useState } from 'react'
import { ArrowRight, CheckCircle2, Lightbulb, XCircle } from 'lucide-react'
import { THEORY_TOPICS } from '../../data/theory'
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
  const [answer, setAnswer] = useState<number | null>(null)
  const topic = THEORY_TOPICS.find((item) => item.id === topicId) ?? THEORY_TOPICS[0]

  function selectTopic(id: string) {
    setTopicId(id)
    setAnswer(null)
  }

  return (
    <section className="page-section theory-page" id="theory">
      <SectionHeading eyebrow="THEORY WITHOUT TEARS" title="乐理知识，不讲天书" description="每张图都能点，每个概念都落到吉他上。建议按顺序看，也可以直接补你卡住的地方。" action={<div className="completion-count"><strong>{completed.length}<span>/6</span></strong><small>已看懂</small></div>} />
      <Tabs label="乐理二级分类" value={topicId} onChange={selectTopic} items={THEORY_TOPICS.map((item) => ({ id: item.id, label: item.title.split('，')[0], icon: completed.includes(item.id) ? <CheckCircle2 size={15} /> : undefined }))} />
      <div className="theory-layout" role="tabpanel" id={`panel-乐理二级分类-${topic.id}`} aria-labelledby={`tab-乐理二级分类-${topic.id}`}>
        <article className="theory-copy">
          <div className="theory-title-row"><span className="eyebrow">{topic.eyebrow}</span><Tag tone="mint">{topic.minutes} 分钟</Tag></div>
          <h3>{topic.title}</h3><p className="theory-subtitle">{topic.subtitle}</p><p className="theory-intro">{topic.intro}</p>
          <div className="theory-points">{topic.points.map((point, index) => <div key={point.title}><span>{String(index + 1).padStart(2, '0')}</span><p><b>{point.title}</b>{point.text}</p></div>)}</div>
          <div className="example-pair"><div className="example-correct"><CheckCircle2 size={18} /><p><b>这样理解是对的</b>{topic.correct}</p></div><div className="example-wrong"><XCircle size={18} /><p><b>新手常见误会</b>{topic.wrong}</p></div></div>
        </article>
        <div className="theory-interactive"><TheoryVisual topic={topic.id} /><div className="quiz-card"><span className="eyebrow">30 秒小检查</span><h4>{topic.quiz.question}</h4><div className="quiz-options">{topic.quiz.options.map((option, index) => <button key={option} type="button" className={answer === null ? '' : index === topic.quiz.answer ? 'correct' : answer === index ? 'wrong' : 'muted'} onClick={() => setAnswer(index)}>{option}<span>{answer !== null && index === topic.quiz.answer ? <CheckCircle2 size={17} /> : answer === index ? <XCircle size={17} /> : <ArrowRight size={16} />}</span></button>)}</div>{answer !== null && <div className={answer === topic.quiz.answer ? 'quiz-feedback success' : 'quiz-feedback retry'} role="status"><Lightbulb size={18} /><p><b>{answer === topic.quiz.answer ? '答对了！' : '再看一下提示'}</b>{topic.quiz.explanation}</p></div>}</div><div className="theory-actions"><CompleteButton complete={completed.includes(topic.id)} onClick={() => onComplete(topic.id)} />{topic.id === 'chords' && <button type="button" className="text-button" onClick={onOpenChords}>去按出第一个和弦 <ArrowRight size={16} /></button>}{topic.id === 'position' && <button type="button" className="text-button" onClick={onOpenFretboard}>去指板上找音 <ArrowRight size={16} /></button>}</div></div>
      </div>
    </section>
  )
}
