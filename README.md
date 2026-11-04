# 弦上 FretFlow

面向零基础电吉他学习者的纯静态互动练习网站。与 B 站 UP 主「帅帅是把电吉他」的《零基础入门电吉他教学完整版》分集搭配使用，同时参考公开音乐教育资料，不只依赖单一课程。

## 功能

- 乐理知识：零基础总览速查，以及吉他坐标、音名与唱名、简谱与八度、节奏、把位与指型、三和弦与强力和弦、技巧符号。附发声图解和公开资料来源，无问答题。
- 指板训练：标准调弦 0–15 品发声，默认显示简谱数字、唱名和八度点；第一、第二、第四、第五把位，另有课程 12–15 品 Mi 指型和直接找音练习。
- 和弦工坊：开放和弦、强力和弦（五和弦）指法与试听，60 秒计时切换训练。
- 曲谱跟练：小星星、青花瓷课程 16 小节、天下强力和弦伴奏与 DJ Solo 四音片段，支持变速、循环、节拍器和谱下先备知识。
- 今日练习：本机计时、练习分钟、连续天数、挑战正确率与近七天 ECharts 图表。

不需要登录或后端。练习记录只保存在当前浏览器的 `localStorage`，清除浏览器数据会删除记录。

## 本地运行

```bash
npm install
npm run dev
```

终端会输出本地地址。默认是 `http://localhost:5173`，端口被占用时 Vite 会自动选择下一个端口。

## 检查与构建

```bash
npm run lint
npm run build
npm run preview
```

`npm run lint` 检查源码，忽略 `docs/` 和 `dist/` 中的静态构建产物。生产文件输出到 `dist/`。`vite.config.ts` 已设置 `base: './'`，可部署在域名子路径下。

## 静态部署

`npm run build` 的产物输出到 `dist/`。仓库的 `docs/` 目录保存用于托管的静态构建产物。

GitHub Pages 已启用，公网地址为 **https://superhaohaohao.github.io/FretFlow/**。源码位于 `main` 分支，Pages 使用 `gh-pages` 分支；Gitee 的 `origin` 与 GitHub 的 `github` 两个远程仓库同时保留。

用户明确要求更新并发布时，执行：

```bash
npm run build
cp -R dist/. docs/
git add docs
git commit -m "deploy: 更新静态网站"
git push origin main
git push github main
git push github $(git subtree split --prefix=docs):gh-pages
```

Gitee Pages 当前处于暂停服务状态，因此不使用 Gitee 的页面托管功能。只在本机使用时，运行 `npm run preview` 即可。

## 内容与版权说明

- 视频仅提供 B 站分集外链，不搬运课程视频、音频或整套课件。
- 小星星使用第五把位 5–8 品；课程截图中的“第五把位 Mi 指型”实际位于 12–15 品，网站将左手品位区域与音阶指型分开解释。
- 青花瓷按用户提供的 W2-EX9 课程截图整理为 16 小节、80 BPM，不是官方全曲谱；八度点、歌词与延音以截图为准。
- 《天下》伴奏依据公开弹唱和声骨架移调并简化为 `A5—B5—G♯5—C♯5`，不是原曲电吉他分轨逐音扒谱。
- 《天下》Solo 仅转录公开 DJ 附谱视频 BV1zt42177Tu 中可可靠辨认的四弦 `11–9–9–11` 四音，不是专辑原版或完整 Solo，不补猜其他音符。
- 发音由 Web Audio API 合成，用于确认音高与节奏，不模拟真实音箱或效果器音色。
