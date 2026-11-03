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
  quiz: { question: string; options: string[]; answer: number; explanation: string }
}

export const THEORY_TOPICS: TheoryTopic[] = [
  {
    id: 'tab', eyebrow: '01 · READ TAB', title: '六线谱，就是手指的地图', subtitle: '先看弦，再看品，最后按顺序弹', minutes: 4,
    intro: '六线谱不是五线谱多了一根线。它的六根线直接对应吉他六根弦，数字告诉你按第几品。你不需要先会五线谱，也能马上读懂第一句。',
    points: [
      { title: '先找弦', text: '谱面最上方通常是最细的一弦，最下方是最粗的六弦。想象把吉他指板朝上平放。' },
      { title: '数字是品位', text: '3 不是 mi，也不是第三根手指，而是「在这根弦上按三品」。0 表示左手不用按，直接弹空弦。' },
      { title: '从左往右读', text: '数字按从左到右的顺序弹奏；上下对齐的数字则是一起弹。' },
    ],
    correct: '一弦上写 3 → 左手按一弦三品，右手弹一弦。', wrong: '一弦上写 3 → 用第三根手指弹三弦。',
    quiz: { question: '六线谱最下方的线上写着 0，应该怎样弹？', options: ['按一弦空弦', '弹六弦空弦', '按住六弦三品'], answer: 1, explanation: '最下方对应最粗的六弦，0 表示空弦，所以直接弹六弦。' },
  },
  {
    id: 'notes', eyebrow: '02 · PITCH', title: '音名与简谱，是两套昵称', subtitle: 'C 是音名，1 是唱名角色，不要混为一谈', minutes: 5,
    intro: 'C、D、E 像音的固定姓名；1、2、3 表示音在当前调里的角色。只有在 C 大调里，C 才恰好对应 1（do）。',
    points: [
      { title: '七个自然音', text: 'C D E F G A B 不断循环。到 B 以后又回到 C，只是音高进入了下一个八度。' },
      { title: '简谱的八度点', text: '数字上方的点表示高八度，下方的点表示低八度；没有点就先理解为中音区。' },
      { title: '升降号', text: '♯ 表示升高半音，♭ 表示降低半音。在吉他上，相邻一品就是相邻半音。' },
    ],
    correct: 'C 大调：C=1、D=2、E=3，唱作 do、re、mi。', wrong: '无论什么调，D 都永远等于 1。',
    quiz: { question: '在 C 大调里，简谱 5 对应哪个音名？', options: ['E', 'F', 'G'], answer: 2, explanation: 'C 大调从 C 开始排列，1=C、2=D、3=E、4=F、5=G。' },
  },
  {
    id: 'rhythm', eyebrow: '03 · RHYTHM', title: '音高决定弹什么，节奏决定何时弹', subtitle: '先把一拍走稳，再谈速度', minutes: 5,
    intro: '四四拍里，一小节有四拍，四分音符占一拍。把拍子想成四张大小相同的椅子，音符按自己的时值坐进去。',
    points: [
      { title: '音符时值会减半', text: '全音符四拍、二分音符两拍、四分音符一拍、八分音符半拍、十六分音符四分之一拍。' },
      { title: '八分音符两人一拍', text: '一拍里均匀放下两个八分音符；四个十六分音符也共享一拍。' },
      { title: '休止也是音乐', text: '休止符不是「这一拍坏了」，而是按要求保持安静。延音线则把音的时长连接起来。' },
    ],
    correct: '两个八分音符 = 一拍；四个十六分音符 = 一拍。', wrong: '音符看起来越小，就应该抢得越快、越不均匀。',
    quiz: { question: '四四拍的一小节里，哪一组正好填满？', options: ['一个二分音符 + 两个四分音符', '三个二分音符', '五个四分音符'], answer: 0, explanation: '二分音符两拍，加两个各一拍的四分音符，总共四拍。' },
  },
  {
    id: 'position', eyebrow: '04 · POSITION', title: '把位，是左手负责的一小块区域', subtitle: '同一个音，可以在不同弦上出现', minutes: 4,
    intro: '把位不是琴弦编号，也不等于某一个品。第五把位通常指食指从五品开始，其他手指分别覆盖六、七、八品。',
    points: [
      { title: '一品一个半音', text: '同一根弦向琴身移动一品，音升高半音；移动两品，升高一个全音。' },
      { title: '把位会扩展', text: '「一品一指」是入门定位方法，遇到伸展、滑弦或乐句需要时，手指可以暂时离开负责区域。' },
      { title: '换弦不换音名', text: '二弦一品和三弦五品都是 C4。音名相同，音色和按弦手感却不同，这正是指板有趣的地方。' },
    ],
    correct: '第五把位：食指 5 品、中指 6 品、无名指 7 品、小指 8 品。', wrong: '第五把位：所有手指都只能按第五品。',
    quiz: { question: '同一根弦从五品移到六品，音高怎样变化？', options: ['升高半音', '降低半音', '升高八度'], answer: 0, explanation: '向琴身方向移动一品，音升高一个半音。' },
  },
  {
    id: 'chords', eyebrow: '05 · HARMONY', title: '和弦，是几个音组成的小队', subtitle: '先找到根音，再听三音决定色彩', minutes: 6,
    intro: '同时或按顺序演奏三个及以上的音，就能形成和弦。大三和弦与小三和弦只差一个三音的位置，却有明显不同的情绪。',
    points: [
      { title: '根音是队名', text: 'C 和弦的根音是 C，Am 的根音是 A。扫弦时从正确的根音区域开始，声音会更清楚。' },
      { title: '大三与小三', text: 'C 是 C+E+G；把 E 降低半音成 E♭，就变成 Cm。Am 则是 A+C+E。' },
      { title: '五和弦更简洁', text: '五和弦只保留根音和五音，例如 E5=E+B。它没有三音，所以在失真音色下更干净。' },
    ],
    correct: 'Am = A + C + E；E5 = E + B。', wrong: 'Am 必须包含 A + C♯ + E。',
    quiz: { question: 'C 大三和弦由哪三个音组成？', options: ['C E G', 'C E♭ G', 'C F A'], answer: 0, explanation: 'C 大三和弦是根音 C、大三度 E、纯五度 G。' },
  },
  {
    id: 'techniques', eyebrow: '06 · ARTICULATION', title: '技巧符号，是动作的说明书', subtitle: '先慢做动作，再让符号变成声音', minutes: 5,
    intro: '谱面上的字母和弧线不是装饰。它们告诉你右手是否收住声音、左手是否滑动，以及一个音之后怎样连接下一个音。',
    points: [
      { title: 'P.M. 与 ×', text: 'P.M. 是右手掌根轻靠琴桥附近做闷音；× 常表示制音，让琴弦发出短促的噪声节奏。' },
      { title: 'H 与 P', text: 'H 是击弦，P 是勾弦。它们都能在不再次拨弦的情况下，让第二个音出现。' },
      { title: 'S、b 与 ~', text: 'S 或斜线表示滑弦，b 表示推弦，~ 常表示揉弦。斜线节奏谱则主要告诉你扫弦节奏。' },
    ],
    correct: '5h7 = 先弹五品，再用另一根手指击响七品。', wrong: '5h7 = 五品和七品必须用右手同时拨两次。',
    quiz: { question: '看到 P.M. 时，主要应该调整哪里？', options: ['右手掌根靠近琴桥', '把吉他升高八度', '左手松开所有琴弦'], answer: 0, explanation: 'P.M. 是闷音标记，用右手掌根轻靠琴桥附近，保留音高但缩短延音。' },
  },
]
