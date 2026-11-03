import { midiToFrequency } from './music'

class GuitarAudio {
  private context: AudioContext | null = null
  private active = new Set<OscillatorNode>()

  private getContext() {
    if (!this.context) this.context = new AudioContext()
    if (this.context.state === 'suspended') void this.context.resume()
    return this.context
  }

  playNote(midi: number, duration = 0.45, when = 0) {
    const context = this.getContext()
    const start = context.currentTime + when
    const oscillator = context.createOscillator()
    const overtone = context.createOscillator()
    const filter = context.createBiquadFilter()
    const gain = context.createGain()
    oscillator.type = 'triangle'
    overtone.type = 'sine'
    oscillator.frequency.setValueAtTime(midiToFrequency(midi), start)
    overtone.frequency.setValueAtTime(midiToFrequency(midi) * 2, start)
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2400, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.24, start + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(filter)
    overtone.connect(filter)
    filter.connect(gain)
    gain.connect(context.destination)
    oscillator.start(start)
    overtone.start(start)
    oscillator.stop(start + duration + 0.03)
    overtone.stop(start + duration + 0.03)
    this.active.add(oscillator)
    this.active.add(overtone)
    oscillator.onended = () => this.active.delete(oscillator)
    overtone.onended = () => this.active.delete(overtone)
  }

  playChord(midis: number[], arpeggiate = false) {
    midis.forEach((midi, index) => this.playNote(midi, arpeggiate ? 0.65 : 1.1, arpeggiate ? index * 0.12 : index * 0.018))
  }

  click(accent = false, when = 0) {
    const context = this.getContext()
    const start = context.currentTime + when
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(accent ? 1320 : 880, start)
    gain.gain.setValueAtTime(0.16, start)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.055)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(start)
    oscillator.stop(start + 0.06)
    this.active.add(oscillator)
    oscillator.onended = () => this.active.delete(oscillator)
  }

  stopAll() {
    this.active.forEach((oscillator) => {
      try { oscillator.stop() } catch { /* already stopped */ }
    })
    this.active.clear()
  }
}

export const guitarAudio = new GuitarAudio()
