import type { DepthEditionProgress } from './depthEditionTypes'
import { mandukyaFinalSynthesis, mandukyaSessions } from './mandukyaCourse'

export const mandukyaPassageIds = Array.from({ length: 12 }, (_, index) => String(index + 1))
export type MandukyaRoute = { mode: 'map' | 'reader' | 'review'; passageId: string; canonical: boolean; belongs: boolean }

export function parseMandukyaRoute(hash: string, progress: DepthEditionProgress): MandukyaRoute {
  const passageId = progress.lastId && mandukyaPassageIds.includes(progress.lastId) ? progress.lastId : '1'
  const fallback = { mode: 'map' as const, passageId, canonical: false, belongs: true }
  if (hash === '#lesson/mandukya') return { ...fallback, canonical: true }
  if (!hash.startsWith('#lesson/mandukya/')) return { ...fallback, belongs: false }
  const segment = hash.slice('#lesson/mandukya/'.length)
  if (segment === 'review') return { ...fallback, mode: 'review', canonical: true }
  if (mandukyaPassageIds.includes(segment)) return { ...fallback, mode: 'reader', passageId: segment, canonical: true }
  // Older six-step links intentionally return to the upgraded course map.
  return fallback
}

export function mandukyaReadIds(progress: DepthEditionProgress) {
  return [...new Set(progress.readIds.filter((id) => mandukyaPassageIds.includes(id)))]
}

export function markMandukyaRead(progress: DepthEditionProgress, id: string): DepthEditionProgress {
  if (!mandukyaPassageIds.includes(id)) return progress
  return { ...progress, readIds: [...new Set([...mandukyaReadIds(progress), id])], lastId: id }
}

export function rememberMandukyaRoute(progress: DepthEditionProgress, route: MandukyaRoute): DepthEditionProgress {
  return route.belongs && route.canonical && route.mode === 'reader' && progress.lastId !== route.passageId
    ? { ...progress, lastId: route.passageId }
    : progress
}

export function focusMandukyaTarget(id: string) {
  const target = document.getElementById(id)
  target?.focus({ preventScroll: true })
  if (id !== 'mandukya-title') target?.scrollIntoView({ behavior: 'instant', block: 'center' })
}

export function mandukyaCompletionState(progress: DepthEditionProgress, finalAnswer?: number) {
  const readIds = mandukyaReadIds(progress)
  const checkpoints = mandukyaSessions.filter((session) => progress.checkpointAnswers[session.id] === session.checkpoint.correct).length
  const ready = readIds.length === 12 && checkpoints === mandukyaSessions.length && finalAnswer === mandukyaFinalSynthesis.correct
  return { readIds, checkpoints, ready, complete: ready && progress.completed === true }
}

export function nextMandukyaWork(progress: DepthEditionProgress) {
  const readIds = mandukyaReadIds(progress)
  const unread = mandukyaPassageIds.find((id) => !readIds.includes(id))
  if (unread) return { target: unread, label: `Continue with mantra ${unread}`, reason: 'reading' as const }
  const session = mandukyaSessions.find((item) => progress.checkpointAnswers[item.id] !== item.checkpoint.correct)
  if (session) return { target: String(session.verses.at(-1)), label: `Return to session ${session.order} check`, reason: 'checkpoint' as const }
  return { target: 'review', label: 'Continue to final review', reason: 'review' as const }
}

export function completeMandukya(progress: DepthEditionProgress, finalAnswer?: number): DepthEditionProgress {
  if (!mandukyaCompletionState(progress, finalAnswer).ready) return progress
  return { ...progress, readIds: mandukyaReadIds(progress), completed: true }
}
