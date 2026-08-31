export type DepthEditionProgress = {
  readIds: string[]
  lastId?: string
  checkpointAnswers: Record<string, number>
  studyMode?: 'guided' | 'text' | 'full'
  completed?: boolean
}

export type DepthEditionProgressMap = Record<string, DepthEditionProgress>
