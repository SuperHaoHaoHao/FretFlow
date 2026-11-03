import { useState } from 'react'
import { guitarAudio } from '../../lib/audio'

export function GuitarArt() {
  const [activeString, setActiveString] = useState<number | null>(null)
  const notes = [64, 59, 55, 50, 45, 40]

  function play(index: number) {
    setActiveString(index)
    guitarAudio.playNote(notes[index], 0.8)
    window.setTimeout(() => setActiveString(null), 450)
  }

  return (
    <div className="guitar-art" aria-label="可点击发声的六弦吉他插画">
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <svg viewBox="0 0 560 480" role="img" aria-labelledby="guitar-art-title">
        <title id="guitar-art-title">一把风格化电吉他，右侧六根弦可点击发声</title>
        <defs>
          <linearGradient id="bodyGradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffad8f"/><stop offset="1" stopColor="#ff725c"/></linearGradient>
          <linearGradient id="neckGradient" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#785f4a"/><stop offset="1" stopColor="#3d312a"/></linearGradient>
          <filter id="guitarShadow"><feDropShadow dx="0" dy="18" stdDeviation="18" floodOpacity=".3"/></filter>
        </defs>
        <g transform="rotate(-18 280 240)" filter="url(#guitarShadow)">
          <path d="M187 190c-40-29-91-18-105 17-11 28 3 48-13 70-25 34-12 89 32 107 32 13 57-2 81-13 30-14 55-6 78-23 26-20 35-59 17-83-14-19-16-44-32-59-15-13-38-11-58-16Z" fill="url(#bodyGradient)"/>
          <path d="M201 207 406 88l19 37-198 127Z" fill="url(#neckGradient)"/>
          <path d="m400 91 47-36 43 22-4 39-63 15Z" fill="#f4e9d7"/>
          <path d="m421 87 42-18M427 99l45-17M432 111l47-14" stroke="#9a8d7a" strokeWidth="3"/>
          <g stroke="#d8cbb9" strokeWidth="2" opacity=".7">
            {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${220 + i * 15} ${199 - i * 9}l15 30`} />)}
          </g>
          <rect x="126" y="231" width="84" height="24" rx="6" fill="#182635" transform="rotate(-12 168 243)"/>
          <rect x="140" y="278" width="84" height="24" rx="6" fill="#182635" transform="rotate(-12 182 290)"/>
          <circle cx="128" cy="332" r="12" fill="#f6e9d2"/><circle cx="161" cy="345" r="12" fill="#f6e9d2"/>
          <path d="M115 264c36 5 67-2 92-19" fill="none" stroke="#f7e9d5" strokeWidth="5" strokeLinecap="round"/>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <g key={index} onClick={() => play(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') play(index) }} role="button" tabIndex={0} aria-label={`弹奏${6 - index}弦空弦`} className={activeString === index ? 'art-string active' : 'art-string'}>
              <path d={`M${90 + index * 5} ${249 + index * 9}L468 ${62 + index * 8}`} stroke="transparent" strokeWidth="14" fill="none"/>
              <path d={`M${90 + index * 5} ${249 + index * 9}L468 ${62 + index * 8}`} stroke={activeString === index ? '#77e4d4' : '#f8f0df'} strokeWidth={activeString === index ? 3 : 1.4} fill="none"/>
            </g>
          ))}
        </g>
      </svg>
      <div className="art-note"><span className="live-dot" />点击琴弦，听见你的第一步</div>
    </div>
  )
}
