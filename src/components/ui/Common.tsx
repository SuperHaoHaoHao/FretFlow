import type { CSSProperties, ReactNode } from 'react'
import { ArrowUpRight, BookOpen, Check, ExternalLink, Play } from 'lucide-react'
import { videoUrl } from '../../data/course'

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

export function VideoLink({ page, time, children = '打开对应课程', className = '' }: { page: number; time?: number; children?: ReactNode; className?: string }) {
  return <a className={`video-link ${className}`} href={videoUrl(page, time)} target="_blank" rel="noreferrer"><Play size={15} fill="currentColor" />{children}<ArrowUpRight size={14} /></a>
}

export function CourseNote({ page, children }: { page: number; children: ReactNode }) {
  return <div className="course-note"><BookOpen size={18} /><div><span>与视频课程搭配使用</span><p>{children}</p></div><VideoLink page={page}>第 {page} 集</VideoLink></div>
}

export function ProgressRing({ value, label, caption }: { value: number; label: string; caption?: string }) {
  const bounded = Math.max(0, Math.min(100, value))
  return (
    <div className="progress-ring-wrapper">
      <progress className="progress-ring" max={100} value={bounded} aria-label={label} style={{ '--value': bounded } as CSSProperties} />
      <div className="progress-ring-content"><strong>{Math.round(bounded)}<small>%</small></strong>{caption && <span>{caption}</span>}</div>
    </div>
  )
}

export function CompleteButton({ complete, onClick, children = '标记为已看懂' }: { complete: boolean; onClick: () => void; children?: string }) {
  return <button type="button" className={complete ? 'button button-success' : 'button button-secondary'} onClick={onClick}><Check size={17} />{complete ? '已完成，再复习一次' : children}</button>
}

export function Tag({ children, tone = 'default', onClick }: { children: ReactNode; tone?: 'default' | 'mint' | 'coral' | 'dark'; onClick?: () => void }) {
  if (onClick) return <button type="button" className={`tag tag-${tone} tag-button`} onClick={onClick}>{children}<ArrowUpRight size={12} /></button>
  return <span className={`tag tag-${tone}`}>{children}</span>
}

export function ExternalSource({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="text-link">{children}<ExternalLink size={13} /></a>
}
