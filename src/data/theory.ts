export interface TheoryTopic {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  minutes: number
  intro: string
  points: { title: string; text: string }[]
  correct: string
  wrong: string
  sources: { label: string; url: string }[]
}

export const THEORY_OVERVIEW = [
  {
    id: 'pitch', title: '音高：三种语言别混用', summary: 'C 是音名，do 是唱名，1 是简谱数字。',
    details: ['C 大调首调：C=1=do，D=2=re，E=3=mi，F=4=fa，G=5=sol，A=6=la，B=7=si。', '谱首写 1=G 时，G 才唱 do；不要再把 C 当成 1。', '固定唱名法中 C 永远唱 do；首调唱名法中大调主音唱 do。'],
  },
  {
    id: 'interval', title: '全半音：指板定位规则', summary: '大调：全—全—半—全—全—全—半。',
    details: ['3-4、7-高音 1 是半音，在同一根弦上相邻一品；其余相邻自然音是两品。', 'E-F、B-C 是半音。向琴身移一品升半音，移两品升全音，12 品高一个八度。'],
  },
  {
    id: 'tab', title: '读谱：先看弦，再看品', summary: '六线谱最上方通常是一弦，最下方是六弦。',
    details: ['六线谱数字是品位，上下对齐一起弹，从左到右依次弹。', '六线谱的 0 是空弦；简谱的 0 是休止。两个 0 不是一回事。', '简谱数字上、下的点是八度点；数字右侧的附点属于节奏。'],
  },
  {
    id: 'rhythm', title: '节奏：4/4 每小节四拍', summary: '四分 1 拍，八分 ½ 拍，十六分 ¼ 拍。',
    details: ['全音符 4 拍、二分音符 2 拍；两个八分或四个十六分共享一拍。', '右侧附点增加原时值的一半：附点四分音符是 1.5 拍。', '延音线连接相邻同音，后音不重新发声；休止时也要继续数拍。'],
  },
  {
    id: 'chords', title: '和弦：看组成，不背情绪', summary: '大三 1-3-5，小三 1-♭3-5，强力和弦 1-5。',
    details: ['C=C+E+G，Cm=C+E♭+G，Am=A+C+E。大小性质由三音决定。', 'A5=A+E，可再加高八度 A。强力和弦没有三音，本身不分大小。', '强力和弦常用于失真节奏，但不是大小三和弦的等价替代。'],
  },
  {
    id: 'position', title: '把位与指型：不是同一个概念', summary: '第五把位是 5–8 品；课程 Mi 指型截图在 12–15 品。',
    details: ['左手第几把位通常按食指所在品区域理解，一品一指只是入门定位法。', '音阶指型可以移动；课程所说“第五把位 Mi 指型”是第五种指型标签。', '同一个音可在不同弦出现：二弦一品和三弦五品都是 C4。'],
  },
]

export const THEORY_TOPICS: TheoryTopic[] = [
  {
    id: 'tab', eyebrow: '01 · GUITAR MAP', title: '先建立吉他坐标', subtitle: '弦号、品号、音名和唱名，各管一件事', minutes: 4,
    intro: '标准调弦从最粗的六弦到最细的一弦是 E2、A2、D3、G3、B3、E4。六线谱把最细的一弦画在最上方，数字告诉你在哪一品发声。',
    points: [
      { title: '六线谱数字是品位', text: '一弦上写 3，就是按一弦三品；不是简谱 mi，也不是必须用第三根手指。' },
      { title: '两个 0 要分开', text: '六线谱 0 表示不用按、直接弹空弦；简谱 0 表示休止，保持安静但继续数拍。' },
      { title: '一品一个半音', text: '同一根弦向琴身移动一品升高半音，12 品比空弦高一个八度；跨弦不能机械套用。' },
    ],
    correct: '一弦三品是 G4；在 C 大调首调里是 5（sol）。', wrong: '一弦上写 3，就是弹三弦或唱 mi。',
    sources: [
      { label: 'Fender：标准调弦', url: 'https://www.fender.com/articles/tech-talk/standard-tuning-how-eadgbe-came-to-be' },
      { label: 'Fender：六线谱入门', url: 'https://www.fender.com/articles/techniques/how-to-read-tabs' },
    ],
  },
  {
    id: 'notes', eyebrow: '02 · PITCH LANGUAGE', title: '音名、唱名与首调', subtitle: '先知道自己在说名字、唱声音，还是描述调内角色', minutes: 5,
    intro: '音名 C D E F G A B 是音的字母名称。do re mi fa sol la si 是视唱用的唱名。首调和固定调说的是怎样使用唱名，不是使用哪一种谱纸。',
    points: [
      { title: '首调唱名法', text: '大调把主音唱作 do。C 大调 C=do；G 大调 G=do，其他音按调内关系排列。' },
      { title: '固定唱名法', text: 'C 永远唱 do、D 永远唱 re，不因乐曲换调而改变。两种体系都能用于五线谱或简谱。' },
      { title: '新手怎样配合', text: '用音名在指板上定位，用首调唱名理解歌曲里的音高关系；不必争论哪个体系更高级。' },
    ],
    correct: '谱首 1=G：G=1=do，A=2=re，B=3=mi。', wrong: '无论什么调、什么体系，C 都永远等于简谱 1。',
    sources: [
      { label: 'Open Music Theory：大调音阶', url: 'https://viva.pressbooks.pub/openmusictheory/chapter/major-scales/' },
      { label: '好和弦：首调与固定调', url: 'https://nicechord.com/post/fixed-do-vs-movable-do/' },
    ],
  },
  {
    id: 'jianpu', eyebrow: '03 · JIANPU', title: '简谱数字与八度点', subtitle: '数字表示调内音级，点告诉你落在哪个八度', minutes: 5,
    intro: '简谱是一种数字记谱法。常见大调首调写法用 1–7 表示七个音级，谱首 1=C 或 1=G 决定数字对应的实际音名。',
    points: [
      { title: '上点和下点', text: '数字上方一点高一个八度，下方一点低一个八度；两个点就移动两个八度。' },
      { title: '本网站的参照', text: '课程练习以 C4–B4 为中音区：C4 是中音 1，B3 是低音 7，C5 是高音 1。' },
      { title: '升降与附点', text: '♯ 升半音、♭ 降半音。数字右侧的附点增加时值的一半，不是八度点。' },
    ],
    correct: '二弦空弦 B3 是低音 7（si），三弦五品 C4 是中音 1（do）。', wrong: '所有 5 都是同一个音高，数字下面有没有点都一样。',
    sources: [
      { label: 'Guitar Pro：简谱记法', url: 'https://www.guitar-pro.com/docs/gp8/score/note/jianpu' },
      { label: 'Eason Music School：Jianpu 101', url: 'https://www.easonmusicschool.com/jianpu-101-how-to-read-numeric-scores/' },
    ],
  },
  {
    id: 'rhythm', eyebrow: '04 · RHYTHM', title: '节奏、休止与延音', subtitle: '音高决定弹什么，节奏决定何时弹、响多久', minutes: 6,
    intro: '4/4 拍表示每小节四拍，并以四分音符为一拍。音符占几拍由拍号决定，实际占几秒还会随 BPM 改变。',
    points: [
      { title: '时值按倍数细分', text: '在 4/4 中，全音符 4 拍、二分 2 拍、四分 1 拍、八分半拍、十六分四分之一拍。' },
      { title: '附点与数拍', text: '右侧附点增加原时值的一半。可把八分音符数成 1 & 2 & 3 & 4 &，保持每拍均匀。' },
      { title: '休止与两种弧线', text: '休止要继续数拍。延音线连接相邻同音并合并时值；不同音之间的弧线通常是连音线。' },
    ],
    correct: '两个八分音符是一拍；附点四分音符是一拍半；跨小节同音延音不重新拨弦。', wrong: '看到休止就连拍子一起停，或把不同音之间的弧线都当成延音。',
    sources: [
      { label: 'Open Music Theory：节奏时值', url: 'https://openmusictheory.github.io/rhythmicValues.html' },
      { label: 'Open Music Theory：拍号', url: 'https://openmusictheory.github.io/simple-meter-and-time-signatures/' },
    ],
  },
  {
    id: 'position', eyebrow: '05 · POSITION & PATTERN', title: '把位与指型分开记', subtitle: '一个是手在哪里，一个是音阶怎样排列', minutes: 5,
    intro: '左手第几把位通常描述食指开始的品位区域；音阶指型描述一组可以移动的音符排列。课程里两种叫法都出现，必须看圆点实际落在哪些品。',
    points: [
      { title: '左手第五把位', text: '本网站指 5–8 品：食指 5 品、中指 6 品、无名指 7 品、小指 8 品，《小星星》在这里。' },
      { title: '课程 Mi 指型', text: '用户课程截图的“第五把位”圆点在 12–15 品，是第五种音阶指型标签，最低音为 mi。' },
      { title: '同音可以有多个位置', text: '二弦一品和三弦五品都是 C4。学会找音后，就能按手型、音色和乐句需要选择。' },
    ],
    correct: '看到“第五把位”先看语境：是 5–8 品的左手区域，还是 12–15 品的课程 Mi 指型。', wrong: '所有叫第五把位的图，圆点都应该固定在第五品。',
    sources: [
      { label: 'Classical Guitar Shed：把位的两种含义', url: 'https://classicalguitarshed.com/guitar-positions/' },
      { label: 'Applied Guitar Theory：大调指型', url: 'https://appliedguitartheory.com/lessons/major-scale/' },
    ],
  },
  {
    id: 'chords', eyebrow: '06 · HARMONY', title: '三和弦与强力和弦', subtitle: '根音、三音、五音决定你听到了什么', minutes: 6,
    intro: '三和弦由三个可按三度排列的音构成。大三和小三和弦的差别在三音；强力和弦写作 X5，由根音与纯五度构成，常再重复根音八度。',
    points: [
      { title: '大三与小三', text: 'C=C+E+G，Cm=C+E♭+G，Am=A+C+E。大三度与小三度相差半音。' },
      { title: '强力和弦没有三音', text: 'E5=E+B，A5=A+E，可重复八度根音。它本身不分大小，不是某种三和弦的等价版本。' },
      { title: '可移动手型', text: '保持根音与五音的弦品关系，整体移动就得到其他强力和弦；先确认根音在哪根弦。' },
    ],
    correct: 'G♯m 在教学编配中可以简化成 G♯5，但省略三音后就不再表达小调性质。', wrong: 'A5 既是 A 大三和弦，也是 A 小三和弦，乐理上完全等价。',
    sources: [
      { label: 'Open Music Theory：三和弦', url: 'https://viva.pressbooks.pub/openmusictheory/chapter/triads/' },
      { label: 'Fender：G5 强力和弦', url: 'https://www.fender.com/articles/chords/how-to-play-the-g5-chord-on-guitar' },
    ],
  },
  {
    id: 'techniques', eyebrow: '07 · ARTICULATION', title: '技巧符号与动作', subtitle: '符号是动作说明，实际以这份谱的图例为准', minutes: 5,
    intro: '六线谱技巧缩写没有完全统一的全球标准。下面是最常见写法；遇到教材自己的图例时，优先看本谱说明。',
    points: [
      { title: 'H 与 P', text: 'H 是击弦，P 是勾弦。通常先让第一个音发声，再由左手动作带出第二个音。' },
      { title: 'S、sl 与斜线', text: '常表示滑弦。/ 常向上、\\ 常向下；目标音是否重新拨弦要看具体记谱。' },
      { title: 'P.M. 与制音', text: 'P.M. 是右手掌根轻靠琴桥附近的闷音，仍有音高；× 常表示左手制音的噪声节奏。' },
    ],
    correct: '5h7：先弹五品，再用另一根手指击响七品，通常不重新拨弦。', wrong: 'P.M. 就是把所有弦完全闷死，不需要保留音高。',
    sources: [
      { label: 'Guitar Pro：技巧符号', url: 'https://www.guitar-pro.com/docs/gp8/score/note/symbols/effects' },
      { label: 'Guitar Pro：手掌闷音', url: 'https://www.guitar-pro.com/academy/l/49332-palm-muting' },
    ],
  },
]
