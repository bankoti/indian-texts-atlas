import { courseLessons, lessonDetails } from './courseData'
import { getDepthEditionDescriptor, isDepthEdition, isValidDepthPassageId } from './depthEditionRegistry'
import type { DepthEditionProgress, DepthEditionProgressMap } from './depthEditionTypes'
import { courseReviewVersion, sanitizeReviewAnswers } from './courseReviewData'

export type ProgressState = {
  completed: string[]
  reflections: Record<string, string>
  quizAnswers: Record<string, number>
  quizVersions: Record<string, number>
  depthEditions: DepthEditionProgressMap
  reviewAnswers: Record<string, number>
  reviewReflection: string
  reviewVersion: number
}

export const emptyDepthProgress: DepthEditionProgress = { readIds: [], checkpointAnswers: {} }
const emptyProgress: ProgressState = { completed: [], reflections: {}, quizAnswers: {}, quizVersions: {}, depthEditions: {}, reviewAnswers: {}, reviewReflection: '', reviewVersion: courseReviewVersion }
const lessonIdSet = new Set(courseLessons.map((lesson) => lesson.id))
export const currentQuizVersions: Record<string, number> = { isha: 2, ...Object.fromEntries(courseLessons.filter((lesson) => lesson.sectionId !== 'foundation' && lesson.sectionId !== 'upanishads').map((lesson) => [lesson.id, 2])) }

export function currentCompleted(progress: ProgressState) {
  return progress.completed.filter((id) => !currentQuizVersions[id] || progress.quizAnswers[id] === lessonDetails[id]?.quiz.correct)
}

export function lessonIsComplete(id: string, completed: string[], depthEditions: DepthEditionProgressMap) {
  return isDepthEdition(id) ? depthEditions[id]?.completed === true : completed.includes(id)
}

export function canPersistProgress() {
  const probeKey = 'indian-texts-atlas-storage-probe'
  try {
    window.localStorage.setItem(probeKey, '1')
    window.localStorage.removeItem(probeKey)
    return true
  } catch {
    return false
  }
}

export function readStoredProgress(): ProgressState {
  try {
    const stored = window.localStorage.getItem('indian-texts-atlas-progress-v1')
    if (!stored) return emptyProgress
    const parsed: unknown = JSON.parse(stored)
    if (!parsed || typeof parsed !== 'object') return emptyProgress
    const data = parsed as Partial<ProgressState>
    const reflections = data.reflections && typeof data.reflections === 'object'
      ? Object.fromEntries(Object.entries(data.reflections).filter((entry): entry is [string, string] => lessonIdSet.has(entry[0]) && typeof entry[1] === 'string'))
      : {}
    const quizVersions = data.quizVersions && typeof data.quizVersions === 'object'
      ? Object.fromEntries(Object.entries(data.quizVersions).filter((entry): entry is [string, number] => (
          lessonIdSet.has(entry[0]) && Number.isInteger(entry[1]) && entry[1] > 0
        )))
      : {}
    const quizAnswers = data.quizAnswers && typeof data.quizAnswers === 'object'
      ? Object.fromEntries(Object.entries(data.quizAnswers).filter((entry): entry is [string, number] => {
          const [lessonId, answer] = entry
          const choiceCount = lessonDetails[lessonId]?.quiz.choices.length ?? 0
          const currentVersion = currentQuizVersions[lessonId]
          return lessonIdSet.has(lessonId)
            && Number.isInteger(answer)
            && answer >= 0
            && answer < choiceCount
            && (currentVersion === undefined || quizVersions[lessonId] === currentVersion)
        }))
      : {}
    const depthEditions: DepthEditionProgressMap = {}
    if (data.depthEditions && typeof data.depthEditions === 'object') {
      for (const [editionId, editionValue] of Object.entries(data.depthEditions)) {
        const descriptor = getDepthEditionDescriptor(editionId)
        if (!descriptor || !editionValue || typeof editionValue !== 'object') continue
        const edition = editionValue as Partial<DepthEditionProgress>
        const checkpointAnswers = edition.checkpointAnswers && typeof edition.checkpointAnswers === 'object'
          ? Object.fromEntries(Object.entries(edition.checkpointAnswers).filter((entry): entry is [string, number] => {
              const [sectionId, answer] = entry
              return descriptor.sectionIds.includes(sectionId)
                && Number.isInteger(answer)
                && answer >= 0
                && answer < descriptor.checkpointChoiceCount
            }))
          : {}
        const rawReadIds = Array.isArray(edition.readIds) ? edition.readIds.filter((id): id is string => typeof id === 'string') : []
        const readIds = [...new Set(rawReadIds.filter((id) => isValidDepthPassageId(editionId, id)))]
        const lastId = typeof edition.lastId === 'string' && isValidDepthPassageId(editionId, edition.lastId) ? edition.lastId : undefined
        const completionIsValid = edition.completed === true
          && readIds.length === descriptor.totalUnits
          && descriptor.sectionIds.every((sectionId) => checkpointAnswers[sectionId] === descriptor.checkpointCorrectAnswers[sectionId])
          && quizAnswers[editionId] === lessonDetails[editionId]?.quiz.correct
        depthEditions[editionId] = {
          readIds,
          checkpointAnswers,
          ...(lastId ? { lastId } : {}),
          ...(edition.studyMode === 'guided' || edition.studyMode === 'text' || edition.studyMode === 'full' ? { studyMode: edition.studyMode } : {}),
          ...(completionIsValid ? { completed: true } : {}),
        }
      }
    }
    return {
      completed: Array.isArray(data.completed)
        ? [...new Set(data.completed.filter((id): id is string => typeof id === 'string' && lessonIdSet.has(id)))]
        : [],
      reflections,
      quizAnswers,
      quizVersions,
      depthEditions,
      reviewAnswers: sanitizeReviewAnswers(data.reviewAnswers, data.reviewVersion),
      reviewReflection: typeof data.reviewReflection === 'string' ? data.reviewReflection : '',
      reviewVersion: courseReviewVersion,
    }
  } catch {
    return emptyProgress
  }
}
