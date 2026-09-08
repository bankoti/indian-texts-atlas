import type { WordStudyWord } from './wordStudyTypes'

export type SourceExcerpt = {
  reference: string
  devanagari: string
  iast: string
  translation: string
  note: string
  sourceUrl: string
  words: WordStudyWord[]
}

export type GuidedContent = {
  opening: string
  teaching: Array<{ title: string; body: string }>
  example: { title: string; scenario: string; explanation: string }
  visual: { title: string; nodes: Array<{ label: string; detail: string }>; caption: string }
  connections: Array<{ lessonId: string; why: string }>
  sourceLinks: Array<{ label: string; url: string }>
  excerpt?: SourceExcerpt
}

export type WiderModule = GuidedContent & {
  terms: Array<{ term: string; meaning: string }>
  reflection: string
  quiz: { question: string; choices: string[]; correct: number; explanation: string }
}
