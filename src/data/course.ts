export const COURSE = {
  title: '零基础入门电吉他教学完整版',
  author: '帅帅是把电吉他',
  baseUrl: 'https://www.bilibili.com/video/BV1FT411Z7iu/',
}

export function videoUrl(page: number, time?: number) {
  return `${COURSE.baseUrl}?p=${page}${time ? `&t=${time}` : ''}`
}

export const COURSE_LINKS = [
  { page: 3, label: '六线谱入门', detail: 'W1-EX1 · 右手空弦下拨' },
  { page: 17, label: '简谱视奏', detail: 'W1-EX9 · C 调简谱' },
  { page: 96, label: '五线谱入门', detail: 'W6-EX5 · 五线谱介绍' },
  { page: 100, label: '和弦乐理', detail: 'W6-EX7 · 原位三和弦' },
]
