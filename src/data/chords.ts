export interface ChordFinger { string: number; fret: number; finger: number }
export interface ChordDef {
  id: string
  name: string
  family: '开放和弦' | '五和弦'
  quality: string
  root: string
  difficulty: number
  strings: number[]
  fingers: ChordFinger[]
  tip: string
  mistake: string
}

export const CHORDS: ChordDef[] = [
  { id: 'Em', name: 'Em', family: '开放和弦', quality: '小三和弦 · 柔和、忧郁', root: 'E', difficulty: 1, strings: [0, 0, 0, 2, 2, 0], fingers: [{ string: 4, fret: 2, finger: 2 }, { string: 5, fret: 2, finger: 3 }], tip: '只按两根手指，先让每根弦都响，再练习扫弦。', mistake: '手指碰到旁边琴弦，导致某根弦突然没声音。' },
  { id: 'Am', name: 'Am', family: '开放和弦', quality: '小三和弦 · 温柔、内敛', root: 'A', difficulty: 2, strings: [0, 1, 2, 2, 0, -1], fingers: [{ string: 2, fret: 1, finger: 1 }, { string: 3, fret: 2, finger: 3 }, { string: 4, fret: 2, finger: 2 }], tip: '2、3 指挤在一起时，手腕轻轻向前送。', mistake: '六弦也扫响；Am 从五弦根音开始。' },
  { id: 'C', name: 'C', family: '开放和弦', quality: '大三和弦 · 明亮、稳定', root: 'C', difficulty: 2, strings: [0, 1, 0, 2, 3, -1], fingers: [{ string: 2, fret: 1, finger: 1 }, { string: 4, fret: 2, finger: 2 }, { string: 5, fret: 3, finger: 3 }], tip: '三根手指形成小斜坡，指尖尽量垂直。', mistake: '一指躺太平，碰到一弦或三弦。' },
  { id: 'G', name: 'G', family: '开放和弦', quality: '大三和弦 · 开阔、有力量', root: 'G', difficulty: 3, strings: [3, 0, 0, 0, 2, 3], fingers: [{ string: 1, fret: 3, finger: 4 }, { string: 5, fret: 2, finger: 2 }, { string: 6, fret: 3, finger: 3 }], tip: '先摆好六弦和一弦，再放五弦二品。', mistake: '手指跨度大时耸肩；保持肩膀和手腕放松。' },
  { id: 'D', name: 'D', family: '开放和弦', quality: '大三和弦 · 清亮、轻快', root: 'D', difficulty: 2, strings: [2, 3, 2, 0, -1, -1], fingers: [{ string: 1, fret: 2, finger: 3 }, { string: 2, fret: 3, finger: 2 }, { string: 3, fret: 2, finger: 1 }], tip: '只扫最细的四根弦，三根手指围成小三角。', mistake: '扫到五、六弦，让和弦变得浑浊。' },
  { id: 'Dm', name: 'Dm', family: '开放和弦', quality: '小三和弦 · 细腻、伤感', root: 'D', difficulty: 3, strings: [1, 3, 2, 0, -1, -1], fingers: [{ string: 1, fret: 1, finger: 1 }, { string: 2, fret: 3, finger: 3 }, { string: 3, fret: 2, finger: 2 }], tip: '一弦一品只用指尖侧面，别碰二弦。', mistake: '一品没有靠近品丝，出现滋滋声。' },
  { id: 'E5', name: 'E5', family: '五和弦', quality: '根音 + 五音 · 干净、有力', root: 'E', difficulty: 1, strings: [-1, -1, -1, 2, 2, 0], fingers: [{ string: 4, fret: 2, finger: 3 }, { string: 5, fret: 2, finger: 2 }], tip: '从六弦开始扫，适合先开一点失真。', mistake: '把一、二、三弦也扫进去，失去五和弦的干净感。' },
  { id: 'A5', name: 'A5', family: '五和弦', quality: '根音 + 五音 · 稳定、直接', root: 'A', difficulty: 1, strings: [-1, -1, 2, 2, 0, -1], fingers: [{ string: 3, fret: 2, finger: 3 }, { string: 4, fret: 2, finger: 2 }], tip: '从五弦开始，手指也可以轻轻折指盖住两弦。', mistake: '六弦空弦混入，根音听起来不再明确。' },
  { id: 'D5', name: 'D5', family: '五和弦', quality: '根音 + 五音 · 明亮、现代', root: 'D', difficulty: 2, strings: [-1, 3, 2, 0, -1, -1], fingers: [{ string: 2, fret: 3, finger: 3 }, { string: 3, fret: 2, finger: 2 }], tip: '只扫二、三、四弦，先慢速确认三个音。', mistake: '一弦被误扫，产生额外音高。' },
  { id: 'G5', name: 'G5', family: '五和弦', quality: '根音 + 五音 · 厚实、摇滚', root: 'G', difficulty: 3, strings: [-1, -1, -1, 5, 5, 3], fingers: [{ string: 4, fret: 5, finger: 4 }, { string: 5, fret: 5, finger: 3 }, { string: 6, fret: 3, finger: 2 }], tip: '保持手指整体形状，把它想成可移动的架子。', mistake: '移动后手指塌陷，闷住不该闷的弦。' },
  { id: 'C5', name: 'C5', family: '五和弦', quality: '根音 + 五音 · 扎实、集中', root: 'C', difficulty: 3, strings: [-1, -1, 5, 5, 3, -1], fingers: [{ string: 3, fret: 5, finger: 4 }, { string: 4, fret: 5, finger: 3 }, { string: 5, fret: 3, finger: 2 }], tip: '从五弦三品出发，和 G5 使用相同手型。', mistake: '从六弦开始扫，低音变得模糊。' },
  { id: 'B5', name: 'B5', family: '五和弦', quality: '强力和弦 · 根音 B + 五音 F♯', root: 'B', difficulty: 2, strings: [-1, -1, 4, 4, 2, -1], fingers: [{ string: 3, fret: 4, finger: 4 }, { string: 4, fret: 4, finger: 3 }, { string: 5, fret: 2, finger: 1 }], tip: '从五弦二品开始，保持 A5 的手型整体上移两品。', mistake: '扫到六弦空弦，根音会变得不清楚。' },
  { id: 'G#5', name: 'G♯5', family: '五和弦', quality: '强力和弦 · 根音 G♯ + 五音 D♯', root: 'G♯', difficulty: 3, strings: [-1, -1, -1, 6, 6, 4], fingers: [{ string: 4, fret: 6, finger: 4 }, { string: 5, fret: 6, finger: 3 }, { string: 6, fret: 4, finger: 1 }], tip: '从六弦四品开始，只扫六、五、四弦。', mistake: '把它当成 G♯ 大三或小三和弦；强力和弦本身没有三音。' },
  { id: 'C#5', name: 'C♯5', family: '五和弦', quality: '强力和弦 · 根音 C♯ + 五音 G♯', root: 'C♯', difficulty: 3, strings: [-1, -1, 6, 6, 4, -1], fingers: [{ string: 3, fret: 6, finger: 4 }, { string: 4, fret: 6, finger: 3 }, { string: 5, fret: 4, finger: 1 }], tip: '从五弦四品开始，保持手型，只扫五、四、三弦。', mistake: '从六弦开始扫，加入不属于这个手型的低音。' },
]

export const SWITCH_PAIRS = [
  { id: 'Em-Am', from: 'Em', to: 'Am', tip: 'Em 的 2、3 指向上移动一根弦，再放下一指。' },
  { id: 'C-Am', from: 'C', to: 'Am', tip: '保留一指，2、3 指向上移动一根弦。' },
  { id: 'C-G', from: 'C', to: 'G', tip: '先找六弦三品和一弦三品，再补五弦二品。' },
  { id: 'G-D', from: 'G', to: 'D', tip: '整只手放松离开，再在最细四弦摆小三角。' },
]
