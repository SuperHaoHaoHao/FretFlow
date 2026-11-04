# 曲谱与把位联动练习实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让旋律谱以紧凑六线谱呈现，并与带手指形状的当前把位图同步高亮。

**Architecture:** 继续使用事件数据驱动曲谱。新增只负责当前把位展示的 `PositionMap` 和只负责谱面排版的 `TablatureStaff`，由 `MelodyScore` 持有当前音状态并连接两个视图。

**Tech Stack:** React 19、TypeScript、CSS Grid、现有 Lucide 与 Web Audio API。

**Spec:** `docs/superpowers/specs/2026-11-04-linked-score-position-design.md`

## Global Constraints

- 不修改任何曲子的音符、节奏或和声数据。
- 保留现有播放、循环、节拍器、歌词、延音、简谱唱名与隐藏弦品功能。
- 不新增依赖或测试文件，不编辑 `dist/`，不提交、不推送、不发布。
- 所有界面文字使用中文，技术术语可保留英文。

## Review Focus

- 休止符和延音没有新按弦位置：把位图保持合理定位，不能显示不存在的手指。
- 多位音品和八分音符：数字必须完整落在线上且不能互相挤压。
- 第二把位与第五把位：品位范围和 `getFinger()` 映射必须来自同一数据源。
- 手机窄屏：允许谱面与把位图各自横向滚动，不缩小到无法辨认。
- 键盘与读屏：音符仍是按钮，当前音与完整八度读法不能因视觉重构丢失。

---

### Task 1: 可复用把位图

**Files:**
- Create: `src/components/fretboard/PositionMap.tsx`
- Modify: `src/styles/learning.css`

**Interfaces:**
- Produces: `PositionMap({ position, selected, onSelect }: { position: Exclude<PositionId, 'all'>; selected?: GuitarNote | null; onSelect: (note: GuitarNote) => void })`。
- Consumes: `POSITION_CONFIG`、`getNote()`、`getFinger()`、`isInPosition()`、`C_MAJOR`。

- [ ] 实现六弦到一弦的紧凑把位图，只画当前把位品位，音点显示简谱、唱名和八度点。
- [ ] 用圆形、方形、菱形、三角形表示食指到小指，提供中文图例；当前音高亮并标注弦、品、手指。
- [ ] 添加组件作用域样式、可见焦点与横向滚动，运行 `npm run lint` 和 `npm run build`。

### Task 2: 通用紧凑六线谱

**Files:**
- Create: `src/components/scores/TablatureStaff.tsx`
- Modify: `src/styles/scores.css`

**Interfaces:**
- Produces: `TablatureStaff({ events, bars, current, hideTab, onSelect }: { events: ScoreEvent[]; bars: number[]; current: number; hideTab: boolean; onSelect: (index: number) => void })`。
- Consumes: 现有 `ScoreEvent`、`scoreEventNote()` 和 `JianpuNote`。

- [ ] 按小节和拍宽排列事件，绘制连续六条弦与左右小节线；音品数字位于弦线上，以背景遮住线段。
- [ ] 保留每个事件的简谱唱名、八度点、节奏线、歌词、拍数、延音和休止，当前音同步高亮且按钮可点击。
- [ ] 移除被替换的卡片式谱面样式，添加紧凑桌面布局与手机横向滚动；运行 `npm run lint` 和 `npm run build`。

### Task 3: 联动整合与验收

**Files:**
- Modify: `src/components/scores/MelodyScore.tsx`
- Modify: `src/styles/scores.css`

**Interfaces:**
- Consumes: Task 1 的 `PositionMap` 和 Task 2 的 `TablatureStaff`。

- [ ] 用左右联动工作区替换旧谱面和折叠定位器，把当前谱音传给把位图；点击把位图保留试听功能。
- [ ] 保留原有工具栏、进度、当前音详情、把位/和弦提示和完成按钮，不改曲谱数据。
- [ ] 运行 `npm run lint && npm run build`，确保无错误。
- [ ] 在真实浏览器验收《小星星》《青花瓷》桌面与手机布局，检查点击、播放、暂停、循环、延音、隐藏弦品和把位同步高亮。
- [ ] 检查 `git status --short`，仅保留本次需要的源码与设计/计划文档，不生成额外报告。
