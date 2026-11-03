export interface PracticeDay {
  minutes: number
  activities: string[]
}

export interface ProgressState {
  completedTheory: string[]
  completedScores: string[]
  practiceDays: Record<string, PracticeDay>
  challenge: { correct: number; total: number; bestStreak: number }
  chordBest: Record<string, number>
  lastTab: string
  lastPosition: string
  bpm: number
}

export const EMPTY_PROGRESS: ProgressState = {
  completedTheory: [],
  completedScores: [],
  practiceDays: {},
  challenge: { correct: 0, total: 0, bestStreak: 0 },
  chordBest: {},
  lastTab: 'overview',
  lastPosition: '5',
  bpm: 60,
}

const STORAGE_KEY = 'fretflow-progress-v1'

export function todayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function loadProgress(): ProgressState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return EMPTY_PROGRESS
    const parsed = JSON.parse(saved) as Partial<ProgressState>
    return {
      ...EMPTY_PROGRESS,
      ...parsed,
      challenge: { ...EMPTY_PROGRESS.challenge, ...parsed.challenge },
      practiceDays: parsed.practiceDays ?? {},
      completedTheory: parsed.completedTheory ?? [],
      completedScores: parsed.completedScores ?? [],
      chordBest: parsed.chordBest ?? {},
    }
  } catch {
    return EMPTY_PROGRESS
  }
}

export function saveProgress(progress: ProgressState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) } catch { /* storage can be unavailable */ }
}

export function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* storage can be unavailable */ }
}

export function getStreak(days: Record<string, PracticeDay>) {
  let streak = 0
  const cursor = new Date()
  if (!days[todayKey(cursor)]?.minutes) cursor.setDate(cursor.getDate() - 1)
  while (days[todayKey(cursor)]?.minutes > 0) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function getWeekDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    return { key: todayKey(date), label: `${date.getMonth() + 1}/${date.getDate()}` }
  })
}
