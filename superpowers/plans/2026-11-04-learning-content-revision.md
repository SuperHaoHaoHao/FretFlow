# FretFlow 零基础内容纠偏与练习重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改变现有静态架构和视觉风格的前提下，修正乐理、八度简谱、课程谱和《天下》练习，使内容可核查且适合日常跟练。

**Architecture:** 以 MIDI/弦品为唯一音高来源，新增共用简谱显示模型；乐理、指板、曲谱和和弦分别修改现有模块，不引入后端。课程谱与教学改编在数据及页面来源说明中分开。

**Tech Stack:** Vite、React 19、TypeScript、现有 CSS、Lucide、Web Audio API。

**Spec:** `docs/superpowers/specs/2026-11-04-learning-content-revision-design.md`

## Global Constraints

- 所有面向用户的内容使用中文；唱名统一采用 `do re mi fa sol la si`。
- 不做书面问答或选择题，不虚构原版谱，不混用专辑版、Live 版和 DJ 版。
- C4–B4 为课程中音区；八度点从 MIDI 推导，高点在数字上、低点在数字下。
- 保留纯静态、无登录、localStorage、本机发声和 GitHub Pages 相对路径。
- 不增加大型依赖，不直接编辑 `dist`，不新增测试脚手架，不提交或推送。
- 《青花瓷》以 `/Users/lingfeng/文件/电吉他/PixPin_2026-11-04_16-10-34.png` 为唯一主基准。

## Review Focus

- 负八度与跨八度：E2、B3、C4、C5 必须分别显示倍低音 3、低音 7、中音 1、高音 1，见任务 1 的数据校验。
- 延音事件：`fromPrev` 只计时不重新发音，跨小节循环不得漏拍或重复拨弦，见任务 3 的浏览器验收。
- 指板扩展：13–15 品可点击、可发声，方向键移动后焦点必须进入可视区域，见任务 1 和任务 5。
- 版本混用：专辑和声改编与 DJ Solo 必须独立标注；无法核实的 Solo 不得渲染为谱，见任务 4。
- 既有记录：旧 localStorage 中已完成的理论/曲谱 ID 不得导致页面崩溃，见任务 5。

---

### Task 1: 统一简谱模型与扩展指板

**Files:**
- Create: `src/components/music/JianpuNote.tsx`
- Modify: `src/lib/music.ts`
- Modify: `src/components/fretboard/Fretboard.tsx`
- Modify: `src/components/fretboard/FretboardPage.tsx`
- Modify: `src/styles/learning.css`

**Interfaces:**
- Produces: `getJianpu(midi: number): { syllable: string; solfege: string; octave: number } | null`，无八度数字时返回 `null`。
- Produces: `JianpuNote({ midi, showSolfege = true, className? })`，从 MIDI 渲染数字、唱名和八度点。
- Produces: `PositionId = 'all' | '1' | '2' | '4' | '5' | 'mi'`；`mi` 对应 12–15 品课程 Mi 指型。
- Consumes: 现有 `getNote(string, fret)`、`GuitarNote` 和 `guitarAudio`。

- [ ] **Step 1: 记录当前错误基线**

运行一次性 `node` 计算或浏览器检查，确认当前空弦只显示无八度数字、指板只有 0–12 品、默认“两者”为 `C·1` 而不是数字加唱名。无需保留脚本文件。

- [ ] **Step 2: 实现八度与指型数据**

在 `music.ts` 增加 `getJianpu`，以 `Math.floor(midi / 12) - 5` 得到八度偏移；自然音使用现有 `SYLLABLES/SOLFEGE`，变化音返回 `null`。将 `mi` 加入 `POSITION_CONFIG`，音阶扫描上限改为 15，保留第五把位 5–8 品。

- [ ] **Step 3: 实现共用简谱组件**

`JianpuNote` 使用独立高点槽、数字、唱名、低点槽，不用组合 Unicode 点；为屏幕阅读器提供“倍低音/低音/中音/高音 + 唱名 + 音名八度”。无点时槽位保留，变化音显示原音名并标注“C 大调外”。

- [ ] **Step 4: 接入指板与键盘导航**

指板生成 0–15 品，`aria-colcount` 和 End 键同步改为 16/15；默认显示简谱加唱名，详情区复用 `JianpuNote`。新增 Mi 指型选项，焦点移动后调用 `scrollIntoView({ block: 'nearest', inline: 'nearest' })`，无有效移动时不阻止默认滚动。

- [ ] **Step 5: 校验音高与显示**

一次性核对：1→6 空弦为 `3、低音7、低音5、低音2、倍低音6、倍低音3`；5–8 品仍是第五把位；Mi 指型为 12–15 品且六弦到一弦数字为 `3 4 5 / 6 7 1 / 2 3 4 / 5 6 / 7 1 2 / 3 4 5`。

### Task 2: 乐理总览与分层速查

**Files:**
- Modify: `src/data/theory.ts`
- Modify: `src/components/theory/TheoryPage.tsx`
- Modify: `src/components/theory/TheoryVisual.tsx`
- Modify: `src/styles/learning.css`

**Interfaces:**
- Produces: `TheoryTopic` 保留 `id/title/intro/points/correct/wrong`，删除 `quiz`，新增 `sources: { label: string; url: string }[]`。
- Produces: `THEORY_OVERVIEW` 总览条目，包含音名/唱名/简谱、全半音、六线谱、节奏、和弦公式。
- Consumes: 现有 `TheoryVisual(topic.id)`、本机 `completedTheory`。

- [ ] **Step 1: 替换未经限定的乐理内容**

按设计重写主题：吉他坐标、音名与唱名、简谱与八度、节奏与休止、把位与指型、和弦与强力和弦、技巧符号。明确首调/固定调、延音线/连音线、强力和弦无三音；技巧标记注明“常见写法，以谱首图例为准”。

- [ ] **Step 2: 添加总览速查**

在主题选项卡前增加可扫描的总图：七音对照、大调 `全全半全全全半`、六线谱上 1 下 6、4/4 时值表、三和弦与 `X5` 公式。进阶说明放进原生 `details`，保持页内搜索可用。

- [ ] **Step 3: 删除问答并改为发声/定位互动**

移除 `answer` 状态、quiz 卡片和反馈样式引用；每章保留现有发声图解，提供“去指板找音”或“去和弦工坊”等相关操作。更新“已看懂”分母为实际主题数，旧完成 ID 只忽略、不清空。

- [ ] **Step 4: 展示资料依据**

每章底部渲染 `sources` 外链，使用 `target="_blank" rel="noreferrer"`；在总览说明“事实、记谱约定、教学建议”的区别。

- [ ] **Step 5: 检查内容完整性**

浏览器确认页面无任何问答题；总览能查到 `do`、`3-4`、`7-1`、`P.M.`、`A5`、八度点和强力和弦；所有主题可切换且图解无空白。

### Task 3: 课程旋律谱与延音播放

**Files:**
- Modify: `src/data/scores.ts`
- Modify: `src/lib/music.ts`
- Modify: `src/components/scores/MelodyScore.tsx`
- Modify: `src/styles/scores.css`

**Interfaces:**
- Produces: `ScoreEvent` 新增 `lyric?: string; tie?: 'toNext' | 'fromPrev'`。
- Consumes: 任务 1 的 `JianpuNote` 与 `scoreEventNote(event)`。
- Produces: 完整 `BLUE_PORCELAIN.events`，16 小节，每小节总拍数严格为 4。

- [ ] **Step 1: 校验旧谱错误**

对照截图确认旧版第 1 小节末音、5–8 小节及缺失 9–16 小节，确认旧 `'5'`/`'5̇'` 映射混淆 G3/G4。保留证据用于修复后复核。

- [ ] **Step 2: 修正旋律位置与数据模型**

第二把位使用：`5̣=4弦5品`、`6̣=3弦2品`、`1=3弦5品`、`2=2弦3品`、`3=2弦5品`、`5=1弦3品`。删除错误的 `5̇` 课程映射；`ScoreEvent` 增加歌词和延音字段。

- [ ] **Step 3: 录入完整课程谱**

按截图及研究转录录入 16 小节、80 BPM、歌词和休止；第 7、8→9、15→16 小节录入延音，第 9 小节保留 1.5 拍事件。截图“袖色渲”原样保留并加版本备注，不宣称官方谱。

- [ ] **Step 4: 校验每小节拍数和实际音高**

运行一次性校验：16 小节各自 `beats` 总和均为 4；所有非休止事件都能取得弦品；`5̣` 为 G3、`6̣` 为 A3、无点 `5` 为 G4；连线两端音高相同。

- [ ] **Step 5: 更新谱面和播放器**

音符按钮复用 `JianpuNote` 显示八度和唱名，增加歌词与连线视觉；`fromPrev` 不调用 `playNote`，但仍按事件拍数计时。点击延续音可试听当前音，不改变自动播放规则。

- [ ] **Step 6: 浏览器核对三首入口**

确认《小星星》仍在 5–8 品，《青花瓷》显示完整 16 小节、80 BPM 和课程来源，谱下先备知识包含第二把位、八度点、八分音符、休止与延音。

### Task 4: 《天下》强力和弦与 Solo 区域

**Files:**
- Modify: `src/data/chords.ts`
- Modify: `src/components/scores/ChordPracticeScore.tsx`
- Modify: `src/components/scores/ScorePage.tsx`
- Modify: `src/components/chords/ChordWorkshop.tsx`
- Modify: `src/styles/scores.css`
- Modify: `src/styles/learning.css`

**Interfaces:**
- Produces: `CHORDS` 新增 `B5/G#5/C#5`，`ChordDef.family` 保留现有 `'五和弦'` 以兼容筛选。
- Produces: 《天下》练习模式 `'power' | 'solo'`；伴奏数据为两轮 `A5—B5—G♯5—C♯5`，每和弦 4 拍。
- Consumes: 现有 `getChordMidis`、`ChordDiagram`、`guitarAudio`。

- [ ] **Step 1: 添加强力和弦手型**

新增 B5=`⑤2、④4、③4`，G♯5=`⑥4、⑤6、④6`，C♯5=`⑤4、④6、③6`；核对试听音分别为根音、纯五度和可选八度根音。页面文案统一解释“强力和弦（五和弦）”。

- [ ] **Step 2: 替换普通和弦练习**

删除《天下》的开放/五和弦版本切换和 `Em—C—G—D`，改为 `A5—B5—G♯5—C♯5` 两轮八小节。默认 72 BPM，可从低速调节；四拍下拨明确标为练习节奏，不称原曲节奏。

- [ ] **Step 3: 建立双轨区域**

增加“强力和弦伴奏 / Solo 片段”切换。只有研究记录给出可辨认的公开 DJ 附谱片段时才渲染 Solo 谱，并复用任务 1/3 的简谱与播放能力；否则展示“暂未核验逐音谱”及专辑版、2020 Live、DJ 版来源入口，不生成替代旋律。

- [ ] **Step 4: 固定版本与先备知识**

谱下写明：依据公开弹唱和声骨架移调并简化，非原曲电吉他分轨扒谱；参考专辑版 4/4、72 BPM。列出 A5/B5/G♯5/C♯5、根音弦、可移动手型、全下拨和强力和弦无三音。

- [ ] **Step 5: 更新和弦工坊入口**

《天下》卡片展示实际强力和弦与双轨练习，不再出现普通开放和弦宣传；和弦总数由数据计算，避免硬编码失效。

### Task 5: 全站校验与交付文档

**Files:**
- Modify: `README.md`
- Modify: `src/App.tsx`
- Modify: `src/styles/learning.css`
- Modify: `src/styles/scores.css`

**Interfaces:**
- Consumes: 任务 1–4 的所有页面与数据。
- Produces: 与现状一致的启动、内容和版权说明；不生成部署提交。

- [ ] **Step 1: 清理旧行为文案和样式引用**

更新页脚《天下》说明、README 的功能与版本边界；删除不再使用的 quiz 样式和旧曲谱描述，不删除仍被其他组件使用的样式。

- [ ] **Step 2: 运行静态检查**

Run: `npm run lint` 与 `npm run build`。
Expected: 均为 0 错误；构建成功，无未使用导入或类型错误。

- [ ] **Step 3: 执行桌面浏览器验收**

在内置浏览器打开本地生产预览，实际点击乐理总览与所有主题、指板 0/12/15 品和 Mi 指型、三首曲谱的播放/暂停/循环/变速、强力和弦试听。确认《青花瓷》延续音不重复发声，无未经核验的 Solo 音符。

- [ ] **Step 4: 执行键盘、手机和记录验收**

用方向键走完指板边界并确认焦点可见；手机宽度下谱面可横向阅读、双轨按钮可用；刷新后旧/新完成记录仍可读，hash `/#scores/tianxia` 直达《天下》。

- [ ] **Step 5: 检查交付范围**

Run: `git status --short`。
Expected: 仅包含本次源码、设计/计划和 README 改动；没有 `dist` 或临时校验文件，不提交、不推送。
