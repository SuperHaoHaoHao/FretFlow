import { C_MAJOR, getFinger, getNote, POSITION_CONFIG, STRING_NAMES, type GuitarNote, type PositionId } from '../../lib/music'
import { JianpuNote } from '../music/JianpuNote'

interface PositionMapProps {
  position: Exclude<PositionId, 'all'>
  selected?: GuitarNote | null
  onSelect: (note: GuitarNote) => void
}

const FINGER_NAMES = ['食指', '中指', '无名指', '小拇指']

export function PositionMap({ position, selected, onSelect }: PositionMapProps) {
  const config = POSITION_CONFIG[position]
  const frets = Array.from({ length: config.end - config.start + 1 }, (_, index) => config.start + index)
  const selectedFinger = selected ? getFinger(selected.fret, position) : null

  return <section className="position-map" aria-label={`${config.title} C 大调音阶图`}>
    <div className="position-map-heading">
      <div><span className="eyebrow">LEFT HAND MAP</span><h4>{config.title}{config.title.includes('品') ? '' : ` · ${config.start}–${config.end} 品`}</h4></div>
      <span>C 大调音阶</span>
    </div>
    <p className="position-map-tip">看谱面数字，在左边找相同位置；形状告诉你用哪根手指。</p>
    <div className="position-map-scroll">
      <div className="position-map-grid" role="grid" aria-rowcount={7} aria-colcount={frets.length + 1} style={{ '--position-fret-count': frets.length } as React.CSSProperties}>
        <div className="position-map-frets" role="row"><span />{frets.map((fret) => <b key={fret}>{fret}<small>品</small></b>)}</div>
        {[6, 5, 4, 3, 2, 1].map((string) => <div className="position-map-string" role="row" key={string}>
          <span className="position-map-string-label"><b>{string}</b><small>{STRING_NAMES[string - 1]}</small></span>
          {frets.map((fret) => {
            const note = getNote(string, fret)
            const natural = C_MAJOR.has(note.midi % 12)
            const finger = getFinger(fret, position)
            const active = selected?.string === string && selected.fret === fret
            return <div className="position-map-cell" role="gridcell" key={fret}>
              {natural && <button type="button" className={active ? 'position-map-note active' : 'position-map-note'} onClick={() => onSelect(note)} aria-pressed={active} aria-label={`${string}弦${fret}品，${note.fullName}，简谱${note.syllable}，唱名${note.solfege}${finger ? `，建议${FINGER_NAMES[finger - 1]}` : ''}`}>
                <span className={`position-map-shape finger-${finger}`}><JianpuNote midi={note.midi} /></span>
              </button>}
            </div>
          })}
        </div>)}
      </div>
    </div>
    <div className="finger-legend" aria-label="手指形状图例">
      {FINGER_NAMES.map((name, index) => <span key={name}><i className={`finger-${index + 1}`} />{name}</span>)}
    </div>
    <div className="position-map-current" aria-live="polite">
      {selected ? <><span>当前位置</span><strong>{selected.string} 弦 · {selected.fret} 品</strong><b>{selectedFinger ? FINGER_NAMES[selectedFinger - 1] : '自由按弦'}</b></> : <><span>当前位置</span><strong>休止 / 延音</strong><b>保持节拍</b></>}
    </div>
  </section>
}
