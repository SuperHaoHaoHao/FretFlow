import { getNote } from '../../lib/music'
import type { ChordDef } from '../../data/chords'
import { guitarAudio } from '../../lib/audio'
import { getChordMidis } from '../../lib/chord-utils'

export function ChordDiagram({ chord, compact = false, onPlay }: { chord: ChordDef; compact?: boolean; onPlay?: () => void }) {
  const fretted = chord.fingers.map((finger) => finger.fret)
  const startFret = fretted.length && Math.min(...fretted) > 3 ? Math.min(...fretted) : 1
  function play() {
    guitarAudio.playChord(getChordMidis(chord), true)
    onPlay?.()
  }
  return (
    <button type="button" className={`chord-diagram ${compact ? 'compact' : ''}`} onClick={play} aria-label={`试听${chord.name}和弦，逐弦发声`}>
      <svg viewBox="0 0 280 250" role="img" aria-label={`${chord.name}和弦指法图`}>
        <text x="14" y="25" className="diagram-fret">{startFret > 1 ? `${startFret}品` : ''}</text>
        {[6, 5, 4, 3, 2, 1].map((string, index) => {
          const fret = chord.strings[string - 1]
          return <g key={string}><text x={45 + index * 38} y="25" className={fret < 0 ? 'mute' : 'open'}>{fret < 0 ? '×' : fret === 0 ? '○' : ''}</text><text x={45 + index * 38} y="239" className="string-number">{string}</text></g>
        })}
        {[0, 1, 2, 3, 4, 5].map((line) => <line key={`v-${line}`} x1={45 + line * 38} y1="40" x2={45 + line * 38} y2="220" className="chart-line" />)}
        {[0, 1, 2, 3, 4].map((line) => <line key={`h-${line}`} x1="45" y1={40 + line * 45} x2="235" y2={40 + line * 45} className={line === 0 && startFret === 1 ? 'chart-nut' : 'chart-line'} />)}
        {chord.fingers.map((finger, index) => {
          const x = 45 + (6 - finger.string) * 38
          const y = 40 + (finger.fret - startFret + 0.5) * 45
          const isRoot = getNote(finger.string, finger.fret).name === chord.root
          return <g key={`${finger.string}-${index}`} className={isRoot ? 'finger-dot root' : 'finger-dot'}><circle cx={x} cy={y} r="14" /><text x={x} y={y + 5}>{finger.finger}</text></g>
        })}
      </svg>
    </button>
  )
}
