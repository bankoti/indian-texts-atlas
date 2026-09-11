import type { WordStudyWord } from './wordStudyTypes'

export type MandukyaQuestion = {
  question: string
  choices: string[]
  correct: number
  explanation: string
}

export type MandukyaSource = { label: string; url: string; use: string }
export type MandukyaText = {
  id: string
  devanagari: string
  iast: string
  gloss: string
  textNote: string
  words: WordStudyWord[]
}
export type MandukyaTeaching = {
  id: string
  title: string
  explanation: string
  example: { title: string; scenario: string; explanation: string }
  reflectionPrompt: string
  practice: MandukyaQuestion
  terms: { term: string; meaning: string }[]
}
export type MandukyaSession = {
  id: string
  order: number
  title: string
  verses: number[]
  question: string
  summary: string
  recall: string
  checkpoint: MandukyaQuestion
}
export type MandukyaPassage = MandukyaText & MandukyaTeaching & { sessionId: string }

export type MandukyaTeachingAsset = {
  sources: MandukyaSource[]
  orientation: { lead: string; context: string; goal: string; guardrails: string[] }
  passages: MandukyaTeaching[]
  sessions: MandukyaSession[]
  finalSynthesis: MandukyaQuestion & { statement: string; reflectionPrompt: string; retrievalPrompt: string }
  interpretiveLenses: { name: string; description: string }[]
}
