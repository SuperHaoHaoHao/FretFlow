import { scoreEventNote, type ScoreEvent } from '../../data/scores'
import { JianpuNote } from '../music/JianpuNote'

interface TablatureStaffProps {
  events: ScoreEvent[]
  bars: number[]
  current: number
  hideTab: boolean
  onSelect: (index: number) => void
}

const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E']
const BARS_PER_SYSTEM = 4

export function TablatureStaff({ events, bars, current, hideTab, onSelect }: TablatureStaffProps) {
  const systems = Array.from({ length: Math.ceil(bars.length / BARS_PER_SYSTEM) }, (_, index) => bars.slice(index * BARS_PER_SYSTEM, (index + 1) * BARS_PER_SYSTEM))

  return <div className="tablature-staff">
    {systems.map((systemBars) => <div className="tab-system" key={systemBars[0]} style={{ '--system-bar-count': systemBars.length } as React.CSSProperties}>
      <div className="tab-string-labels" aria-hidden="true"><span />{STRING_LABELS.map((label) => <b key={label}>{label}</b>)}</div>
      <div className="tab-system-bars">
        {systemBars.map((bar) => <div className={events[current]?.bar === bar ? 'tab-bar current' : 'tab-bar'} key={bar}>
          <span className="tab-bar-number">{bar}</span>
          <div className="tab-bar-events">
            {events.map((event, index) => ({ event, index })).filter(({ event }) => event.bar === bar).map(({ event, index }) => {
              const note = scoreEventNote(event)
              return <button type="button" key={index} className={`tab-event ${current === index ? 'active' : ''} ${event.tie === 'toNext' ? 'tie-next' : ''} ${event.tie === 'fromPrev' ? 'tie-from' : ''}`} style={{ flexGrow: event.beats }} onClick={() => onSelect(index)} aria-label={`第${bar}小节，${note ? `简谱${note.syllable}，唱名${note.solfege}，${event.string}弦${event.fret}品` : '休止'}，${event.beats}拍${event.lyric ? `，歌词${event.lyric}` : ''}${event.tie === 'fromPrev' ? '，延续前音，不重新拨弦' : ''}`}>
                <span className="tab-note-syllable">{note ? <JianpuNote midi={note.midi} /> : <b>0</b>}</span>
                <span className={event.beats === .5 || event.beats === 1.5 ? 'tab-note-duration is-eighth' : 'tab-note-duration'}>{event.beats === 1.5 || event.beats === 2 ? '—' : event.beats === 4 ? '— — —' : ''}</span>
                <span className="tab-fret-rows">{[1, 2, 3, 4, 5, 6].map((string) => <i className="tab-fret-row" key={string}>{!hideTab && event.string === string ? <b>{event.tie === 'fromPrev' ? `(${event.fret})` : event.fret}</b> : null}</i>)}</span>
                <span className="tab-note-lyric">{event.lyric ?? (event.tie === 'fromPrev' ? '延音' : '')}</span>
                <small>{event.beats}拍</small>
              </button>
            })}
          </div>
        </div>)}
      </div>
    </div>)}
  </div>
}
