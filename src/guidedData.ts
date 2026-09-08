import type { GuidedContent } from './guidedTypes'
import { upanishadGuides } from './upanishadGuides'
import { widerModules } from './widerModules'

export const guidedContent: Record<string, GuidedContent> = { ...upanishadGuides, ...widerModules }

export const guidedStepIds = ['locate', 'read', 'unpack', 'compare', 'reflect', 'remember']
export const foundationStepIds = ['landscape', 'coordinates', 'vedic-family', 'upanishads', 'rebuild', 'checkpoint']

export function guidedStepFromHash(hash: string, lessonId: string) {
  const [kind, id, step] = hash.replace(/^#/, '').split('/')
  const steps = lessonId === 'course-0' ? foundationStepIds : guidedStepIds
  return kind === 'lesson' && id === lessonId ? Math.max(0, steps.indexOf(step)) : 0
}

export function setLessonStepHash(lessonId: string, step: number) {
  const steps = lessonId === 'course-0' ? foundationStepIds : guidedStepIds
  if (step >= 0 && step < steps.length) window.location.hash = `lesson/${lessonId}/${steps[step]}`
}
