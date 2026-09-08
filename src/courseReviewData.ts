export const courseReviewVersion = 1
export const courseReviewCases = [
  {
    id: 'coordinates', title: 'Rebuild the root map',
    question: 'A friend puts the Buddhist Nikāyas and Jain Āgamas inside the four Vedas. How would you repair the map?',
    choices: ['Move them into the Purāṇas instead.', 'Give them their own transmitted libraries, then show relationships and debates across traditions.', 'Put all Sanskrit works in the Vedas and all other languages outside religion.'],
    correct: 1, explanation: 'Vedic, Buddhist, and Jain authority structures are not nested versions of one canon. Language, genre, and tradition are different coordinates; texts can share questions without sharing scriptural authority.', lessons: ['course-0', 'buddhist-canons', 'jain-canons'],
  },
  {
    id: 'vedic-knowledge', title: 'Connect learning and practice',
    question: 'Muṇḍaka calls Vedic disciplines aparā learning. A student takes this as permission to abandon study and responsible conduct. What has been missed?',
    choices: ['The distinction concerns the aim of knowledge, not a blanket claim that study and conduct have no value.', 'Aparā means every Vedic discipline is a forgery.', 'Parā means memorizing a longer list of facts.'],
    correct: 0, explanation: 'Muṇḍaka re-ranks kinds of knowledge by their object and aim. Taittirīya’s educational instructions and the technical work of the Vedāṅgas make it especially important not to turn that distinction into a general dismissal of learning.', lessons: ['mundaka', 'taittiriya', 'vedangas-sutras'],
  },
  {
    id: 'sanskrit', title: 'Read a small Sanskrit sentence',
    question: 'In the Chāndogya refrain, tat means “that,” tvam “you,” and asi “are.” Which claim goes beyond those word meanings alone?',
    choices: ['The sentence addresses a learner.', 'The sentence relates “you” and “that.”', 'Those three words by themselves settle every disagreement among later Vedānta schools.'],
    correct: 2, explanation: 'Word-by-word work helps you see the sentence, but cannot replace context or settle all interpretive disputes. Read Uddālaka’s examples first, then compare the explanations of later schools.', lessons: ['chandogya', 'vedanta-schools', 'paninian-grammar'],
  },
  {
    id: 'ethics', title: 'Read a conflict before extracting a rule',
    question: 'An epic character invokes dharma to defend an action that another character contests. What should a careful reader do first?',
    choices: ['Treat the first character’s claim as the author’s final command.', 'Reconstruct the competing duties, who speaks, and who bears the consequences.', 'Assume that disagreement makes the episode meaningless.'],
    correct: 1, explanation: 'Epic narrative lets claims about duty encounter their costs. A character’s assertion is evidence within the argument, not automatically its resolution. This also differs from treating a Dharmaśāstra prescription as a census of social life.', lessons: ['ramayana-exile', 'mahabharata-war', 'dharmashastra'],
  },
  {
    id: 'difference', title: 'Compare without making everything identical',
    question: 'Jain accounts of enduring souls and Buddhist critiques of a permanent self both connect knowledge with liberation. What is the best comparison?',
    choices: ['They share a practical concern while disagreeing substantially about what a person is.', 'They must teach exactly the same ontology because both seek liberation.', 'They cannot be compared because disagreement makes discussion impossible.'],
    correct: 0, explanation: 'A shared problem does not imply the same answer. Jain many-sided reasoning is also not a declaration that all contradictory claims are equally true. Name the specific tradition, argument, and textual context.', lessons: ['tattvarthasutra', 'discourses-vinaya', 'anekantavada'],
  },
  {
    id: 'evidence', title: 'Distinguish a historical system from a present-day claim',
    question: 'A technical treatise describes a treatment and another prescribes ideal building proportions. What evidence would you need to claim that either was universally used or is reliable today?',
    choices: ['Their presence in a Sanskrit text is sufficient for both claims.', 'No additional evidence, provided the text is old.', 'Evidence of historical practice for usage, and appropriate independent modern evidence for present-day reliability.'],
    correct: 2, explanation: 'Written prescriptions, surviving practices, and modern effectiveness are different claims. Mathematical procedures, clinical theories, and workshop rules need investigation suited to each discipline; antiquity alone neither validates nor invalidates them.', lessons: ['classical-medicine', 'architecture-workshops', 'mathematics-astronomy'],
  },
  {
    id: 'afterlives', title: 'Follow a text into another world',
    question: 'A Tamil retelling and a Persian court translation reshape an epic. How should they appear on the atlas?',
    choices: ['As later works with their own audiences and purposes, linked to earlier narratives without being labelled ancient originals.', 'As word-for-word copies with no new argument.', 'As proof that each language belongs exclusively to one religion.'],
    correct: 0, explanation: 'Translation, retelling, ritual, and performance can create new meanings and authority. Tamil devotional canons, Persianate translation, Sikh scripture, and regional literary worlds must be situated in their own histories, not collapsed into one ancient Sanskrit bookshelf.', lessons: ['many-ramayanas', 'tamil-devotion', 'multilingual-crossings'],
  },
]

export function sanitizeReviewAnswers(value: unknown, version: unknown) {
  if (version !== courseReviewVersion || !value || typeof value !== 'object') return {}
  return Object.fromEntries(Object.entries(value).filter(([id, answer]) => {
    const entry = courseReviewCases.find((item) => item.id === id)
    return entry && typeof answer === 'number' && Number.isInteger(answer) && answer >= 0 && answer < entry.choices.length
  })) as Record<string, number>
}

export function reviewIsPassed(answers: Record<string, number>) {
  return courseReviewCases.every((entry) => answers[entry.id] === entry.correct)
}

export function nextLessonInPath(lessonIds: string[], completedIds: string[]) {
  return lessonIds.find((id) => !completedIds.includes(id))
}

export function reviewCaseFromHash(hash: string) {
  const [view, section, id] = hash.replace(/^#/, '').split('/')
  return view === 'path' && section === 'review' && courseReviewCases.some((entry) => entry.id === id) ? id : undefined
}

export function rememberReviewCase(id?: string) {
  window.history.replaceState(null, '', `#path/review${id ? `/${id}` : ''}`)
}

export function focusCourseReview() {
  const id = reviewCaseFromHash(window.location.hash)
  const target = document.getElementById(id ? `review-case-${id}` : 'review-title')
  target?.focus({ preventScroll: true })
  target?.scrollIntoView({ block: 'start' })
}

export function openCourseReview() {
  window.location.hash = 'path/review'
  focusCourseReview()
}
