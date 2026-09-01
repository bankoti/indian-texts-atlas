export type WordStudyWord = {
  source: string
  iast: string
  meaning: string
  grammar: string
}

export type WordStudyEntry = {
  id: string
  words: WordStudyWord[]
}

export type WordStudyAuditEntry = {
  id: string
  textFingerprint: string
  rowCount: number
}
