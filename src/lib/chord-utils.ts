import type { ChordDef } from '../data/chords'
import { STRING_MIDI } from './music'

export function getChordMidis(chord: ChordDef) {
  return chord.strings.map((fret, index) => fret >= 0 ? STRING_MIDI[index] + fret : null).filter((midi): midi is number => midi !== null).reverse()
}
