import { Music2 } from 'lucide-react'
import { SCORES } from '../../data/scores'
import { SectionHeading, Tag } from '../ui/Common'
import { Tabs } from '../ui/Tabs'
import { ChordPracticeScore } from './ChordPracticeScore'
import { MelodyScore } from './MelodyScore'

interface ScorePageProps {
  selectedId: string
  onSelect: (id: string) => void
  completed: string[]
  onComplete: (id: string) => void
  onOpenPosition: (position: '1' | '2' | '5') => void
  onOpenChords: () => void
}

export function ScorePage({ selectedId, onSelect, completed, onComplete, onOpenPosition, onOpenChords }: ScorePageProps) {
  const items = [...SCORES.map((score) => ({ id: score.id, label: score.title, shortLabel: score.subtitle })), { id: 'tianxia', label: '天下 · 强力和弦 + Solo', shortLabel: '双轨入门练习' }]
  const selected = SCORES.find((score) => score.id === selectedId)
  return <section className="page-section scores-page" id="scores"><SectionHeading eyebrow="PLAY YOUR FIRST SONGS" title="曲谱跟练，让练习有旋律" description="简谱、六线谱、声音和指板位置同步出现。先慢到不会出错，再一小节一小节加速。" action={<Tag tone="mint"><Music2 size={14} />3 个练习</Tag>} /><Tabs label="练习曲谱" value={selectedId} onChange={onSelect} items={items} /><div className="score-title"><div><span className="eyebrow">{selected?.subtitle ?? '天下 · 强力和弦伴奏 + DJ Solo 片段'}</span><h3>{selected?.title ?? '天下（电吉他双轨练习）'}</h3></div><p>{selected?.scope ?? '副歌强力和弦入门改编：A5—B5—G♯5—C♯5；另有公开 DJ 附谱视频中核实的四音 Solo 片段，版本分别标注。'}</p></div>{selected ? <MelodyScore key={selected.id} score={selected} completed={completed.includes(selected.id)} onComplete={onComplete} onOpenPosition={onOpenPosition} /> : <ChordPracticeScore completed={completed.includes('tianxia')} onComplete={onComplete} onOpenChords={onOpenChords} />}</section>
}
