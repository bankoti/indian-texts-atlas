export type DepthEditionProgress = {
  readIds: string[]
  lastId?: string
  checkpointAnswers: Record<string, number>
  completed?: boolean
}

export type DepthEditionProgressMap = Record<string, DepthEditionProgress>
