import { getJianpu, midiToFullName } from '../../lib/music'

interface JianpuNoteProps {
  midi: number
  showSolfege?: boolean
  className?: string
}

function octaveLabel(octave: number) {
  if (octave <= -2) return '倍低音'
  if (octave === -1) return '低音'
  if (octave === 0) return '中音'
  if (octave === 1) return '高音'
  return '倍高音'
}

export function JianpuNote({ midi, showSolfege = true, className = '' }: JianpuNoteProps) {
  const value = getJianpu(midi)
  const fullName = midiToFullName(midi)
  if (!value) return <span className={`jianpu-note chromatic ${className}`} aria-label={`${fullName}，C 大调外的变化音`}><b>{fullName}</b><small>变化音</small></span>
  const dots = Array.from({ length: Math.min(2, Math.abs(value.octave)) }, (_, index) => <i key={index} />)
  return <span className={`jianpu-note ${className}`} aria-label={`${octaveLabel(value.octave)} ${value.solfege}，${fullName}`}>
    <span aria-hidden="true" className="jianpu-visual">
      <span className="octave-dots octave-high">{value.octave > 0 && dots}</span>
      <b>{value.syllable}</b>
      {showSolfege && <small>{value.solfege}</small>}
      <span className="octave-dots octave-low">{value.octave < 0 && dots}</span>
    </span>
  </span>
}
