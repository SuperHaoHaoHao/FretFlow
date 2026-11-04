import { useState } from 'react'
import { C_MAJOR, getFinger, getNote, isInPosition, STRING_NAMES, type GuitarNote, type PositionId } from '../../lib/music'
import { JianpuNote } from '../music/JianpuNote'

interface FretboardProps {
  position: PositionId
  displayMode: 'name' | 'syllable' | 'both'
  cMajorOnly: boolean
  hideNames: boolean
  selected?: GuitarNote | null
  highlighted?: GuitarNote[]
  onSelect: (note: GuitarNote) => void
  correctTarget?: GuitarNote | null
}

export function Fretboard({ position, displayMode, cMajorOnly, hideNames, selected, highlighted = [], onSelect, correctTarget }: FretboardProps) {
  const [focused, setFocused] = useState({ string: 1, fret: 5 })
  const frets = Array.from({ length: 16 }, (_, index) => index)

  function moveFocus(event: React.KeyboardEvent, string: number, fret: number) {
    let nextString = string
    let nextFret = fret
    if (event.key === 'ArrowRight') nextFret += 1
    else if (event.key === 'ArrowLeft') nextFret -= 1
    else if (event.key === 'ArrowDown') nextString += 1
    else if (event.key === 'ArrowUp') nextString -= 1
    else if (event.key === 'Home') nextFret = 0
    else if (event.key === 'End') nextFret = 15
    else return
    if (nextString < 1 || nextString > 6 || nextFret < 0 || nextFret > 15) return
    event.preventDefault()
    setFocused({ string: nextString, fret: nextFret })
    const target = document.getElementById(`fret-${nextString}-${nextFret}`)
    target?.focus()
    target?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  return (
    <div className="fretboard-scroll" aria-label="吉他指板，使用方向键移动，回车发声">
      <div className="fretboard" role="grid" aria-rowcount={6} aria-colcount={16}>
        <div className="fret-numbers" role="row"><span />{frets.map((fret) => <b key={fret} className={isInPosition(fret, position) ? 'in-position' : ''}>{fret === 0 ? '空' : fret}</b>)}</div>
        {[1, 2, 3, 4, 5, 6].map((string) => <div className="fret-row" role="row" key={string}>
          <span className="string-label"><b>{string}</b><small>{STRING_NAMES[string - 1]}</small></span>
          {frets.map((fret) => {
            const note = getNote(string, fret)
            const inPosition = isInPosition(fret, position)
            const isNatural = C_MAJOR.has(note.midi % 12)
            const isSelected = selected?.string === string && selected.fret === fret
            const isHighlighted = highlighted.some((item) => item.string === string && item.fret === fret)
            const isTarget = correctTarget?.string === string && correctTarget.fret === fret
            const dimmed = !inPosition || (cMajorOnly && !isNatural)
            const finger = getFinger(fret, position)
            return <button
              id={`fret-${string}-${fret}`}
              role="gridcell"
              type="button"
              key={fret}
              tabIndex={focused.string === string && focused.fret === fret ? 0 : -1}
              className={`fret-note ${dimmed ? 'dimmed' : ''} ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${isTarget ? 'target' : ''}`}
              aria-label={`${string}弦${fret}品，${hideNames && !isTarget ? '答案已隐藏' : `${note.fullName}，简谱${note.syllable}，唱名${note.solfege}`}`}
              aria-pressed={isSelected}
              onFocus={() => setFocused({ string, fret })}
              onKeyDown={(event) => moveFocus(event, string, fret)}
              onClick={() => onSelect(note)}
            >
              <span className="fret-note-content">{hideNames && !isTarget ? '?' : displayMode === 'name' ? note.name : <JianpuNote midi={note.midi} showSolfege={displayMode === 'both'} />}</span>
              {finger && inPosition && !hideNames && <small>{finger}</small>}
            </button>
          })}
        </div>)}
        <div className="fret-markers"><span />{frets.map((fret) => <i key={fret}>{[3, 5, 7, 9].includes(fret) ? '•' : fret === 12 ? '••' : ''}</i>)}</div>
      </div>
    </div>
  )
}
