import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { hmr: false, middlewareMode: true } })
after(() => server.close())
const { courseLessons, lessonDetails } = await server.ssrLoadModule('/src/courseData.ts')
const { guidedContent, guidedStepIds, foundationStepIds, guidedStepFromHash, setLessonStepHash } = await server.ssrLoadModule('/src/guidedData.ts')
const { widerModules } = await server.ssrLoadModule('/src/widerModules.ts')
const { LessonView } = await server.ssrLoadModule('/src/App.tsx')
const { default: CourseReview } = await server.ssrLoadModule('/src/CourseReview.tsx')
const { readStoredProgress, currentCompleted, currentQuizVersions, lessonIsComplete } = await server.ssrLoadModule('/src/progressStorage.ts')
const { courseReviewCases, courseReviewVersion, sanitizeReviewAnswers, reviewIsPassed, nextLessonInPath, reviewCaseFromHash, rememberReviewCase, focusCourseReview } = await server.ssrLoadModule('/src/courseReviewData.ts')
const { depthEditionRegistry, expectedDepthPassageIds } = await server.ssrLoadModule('/src/depthEditionRegistry.ts')
const ids = courseLessons.map((lesson) => lesson.id)
const noop = () => {}
const escaped = (value) => renderToStaticMarkup(createElement('span', null, value)).slice(6, -7)

function withWindow(value, run) {
  const previous = globalThis.window
  globalThis.window = value
  try { return run() } finally { if (previous === undefined) delete globalThis.window; else globalThis.window = previous }
}

function stored(value) {
  return withWindow({ localStorage: { getItem: () => typeof value === 'string' ? value : JSON.stringify(value) } }, readStoredProgress)
}

function lessonHtml(id, step, overrides = {}) {
  return withWindow({ location: { hash: `#lesson/${id}/${step}` } }, () => renderToStaticMarkup(createElement(LessonView, {
    lesson: courseLessons.find((lesson) => lesson.id === id), detail: lessonDetails[id], completed: false,
    reflection: '', depthProgress: { readIds: [], checkpointAnswers: {} }, onReflectionChange: noop,
    onQuizSelect: noop, onDepthProgressChange: noop, onComplete: noop, onClose: noop, onOpenLesson: noop, ...overrides,
  })))
}

test('every non-depth lesson has authored teaching, examples, diagrams, sources, and valid cross-links', () => {
  assert.equal(Object.keys(guidedContent).length, 71)
  assert.equal(Object.keys(widerModules).length, 61)
  assert.deepEqual(Object.keys(guidedContent).sort(), ids.filter((id) => !['course-0', 'kena', 'katha', 'isha'].includes(id)).sort())
  for (const [id, guide] of Object.entries(guidedContent)) {
    assert.ok(guide.opening.length > 80, id)
    assert.equal(guide.teaching.length, 3, id)
    assert.ok(guide.teaching.every((part) => part.title && part.body.length > 160), id)
    assert.ok(guide.example.scenario.length > 80 && guide.example.explanation.length > 100, id)
    assert.ok(guide.visual.nodes.length >= 3 && guide.visual.nodes.every((node) => node.label && node.detail), id)
    assert.equal(guide.connections.length, 2, id)
    assert.ok(guide.connections.every((connection) => ids.includes(connection.lessonId) && connection.lessonId !== id && connection.why), id)
    assert.ok(guide.sourceLinks.length >= 2 && guide.sourceLinks.every((source) => new URL(source.url).protocol === 'https:' && source.label), id)
  }
})

test('the 61 wider lessons have distinct application quizzes and real contextual vocabulary', () => {
  assert.equal(new Set(Object.values(widerModules).map((guide) => guide.quiz.question)).size, 61)
  const positions = new Set()
  for (const [id, guide] of Object.entries(widerModules)) {
    const quiz = lessonDetails[id].quiz
    assert.deepEqual(quiz, guide.quiz)
    assert.equal(quiz.choices.length, 3, id)
    assert.equal(new Set(quiz.choices).size, 3, id)
    assert.ok(Number.isInteger(quiz.correct) && quiz.correct >= 0 && quiz.correct < 3, id)
    assert.ok(!quiz.question.startsWith('Which takeaway best fits'), id)
    assert.ok(guide.terms.every((term) => !['Guiding question', 'Crucial learning', 'Source boundary'].includes(term.term)), id)
    positions.add(quiz.correct)
  }
  assert.equal(positions.size, 3)
})

test('all 426 guided step URLs render their actual teaching surfaces', () => {
  for (const [id, guide] of Object.entries(guidedContent)) {
    for (const step of guidedStepIds) {
      const html = lessonHtml(id, step)
      assert.doesNotMatch(html, /Lesson data unavailable/)
      assert.match(html, /aria-current="step"/)
      if (step === 'locate') assert.ok(html.includes(escaped(guide.opening)), id)
      if (step === 'read') for (const part of guide.teaching) assert.ok(html.includes(escaped(part.body)), id)
      if (step === 'unpack') assert.ok(html.includes(escaped(lessonDetails[id].concepts[0].term)), id)
      if (step === 'compare') {
        assert.ok(html.includes(escaped(guide.example.scenario)), id)
        for (const link of guide.connections) assert.ok(html.includes(`href="#lesson/${link.lessonId}"`), id)
      }
      if (step === 'reflect') assert.ok(html.includes(escaped(lessonDetails[id].reflection)), id)
      if (step === 'remember') assert.ok(html.includes(escaped(lessonDetails[id].quiz.question)), id)
    }
  }
})

test('every new quoted Sanskrit excerpt has complete study fields and visible meanings', () => {
  const excerpts = Object.entries(guidedContent).filter(([, guide]) => guide.excerpt)
  assert.equal(excerpts.length, 14)
  for (const [id, { excerpt }] of excerpts) {
    assert.ok(excerpt.reference && excerpt.devanagari && excerpt.iast && excerpt.translation && excerpt.note, id)
    assert.equal(new URL(excerpt.sourceUrl).protocol, 'https:')
    assert.ok(excerpt.words.length > 0)
    const html = lessonHtml(id, 'unpack')
    assert.ok(html.includes(escaped(excerpt.devanagari)), id)
    assert.ok(html.includes(escaped(excerpt.translation)), id)
    for (const word of excerpt.words) {
      for (const field of ['source', 'iast', 'meaning', 'grammar']) assert.ok(word[field]?.trim() && word[field] === word[field].normalize('NFC'), `${id} ${field}`)
      assert.ok(html.includes(escaped(word.source)), id)
      assert.ok(html.includes(escaped(word.meaning)), id)
    }
    assert.match(html, /Show grammar notes/)
  }
  assert.equal(guidedContent.mundaka.excerpt.words.find((word) => word.source === 'तत्').iast, 'tat')
})

test('direct entry at a final step does not claim that earlier steps were read', () => {
  for (const id of ['mundaka', 'gita-afterlives', 'course-0']) {
    const html = lessonHtml(id, id === 'course-0' ? 'checkpoint' : 'remember')
    const rail = html.match(/<nav class="step-rail[^"]*"[\s\S]*?<\/nav>/)?.[0]
    assert.ok(rail)
    assert.doesNotMatch(rail, /visited|lucide-check/)
  }
})

test('Course 0 and guided routes restore each step, while unknown paths safely start at the beginning', () => {
  for (const [id, steps] of [['course-0', foundationStepIds], ['mundaka', guidedStepIds]]) {
    for (const [index, step] of steps.entries()) {
      assert.equal(guidedStepFromHash(`#lesson/${id}/${step}`, id), index)
      withWindow({ location: { hash: '' } }, () => {
        setLessonStepHash(id, index)
        assert.equal(window.location.hash, `lesson/${id}/${step}`)
      })
    }
  }
  assert.equal(guidedStepFromHash('#lesson/mundaka/nonsense', 'mundaka'), 0)
  assert.equal(guidedStepFromHash('#lesson/kena/1.1', 'mundaka'), 0)
  assert.match(lessonHtml('course-0', 'checkpoint'), /Keep four sentences/)
})

test('old quiz versions cannot falsely pass rewritten lessons, while notes and historical records survive', () => {
  const id = 'rigveda-hymns'
  const progress = stored({ completed: [id, id, 'bad-id'], reflections: { [id]: 'Keep my thought', bad: 'ignore' }, quizAnswers: { [id]: 0 }, quizVersions: {}, depthEditions: { kena: { readIds: ['1.1'], checkpointAnswers: {}, studyMode: 'text' } } })
  assert.deepEqual(progress.completed, [id])
  assert.equal(progress.reflections[id], 'Keep my thought')
  assert.equal(progress.quizAnswers[id], undefined)
  assert.equal(currentCompleted(progress).includes(id), false)
  assert.deepEqual(progress.depthEditions.kena.readIds, ['1.1'])
  assert.equal(progress.depthEditions.kena.studyMode, 'text')
  progress.quizAnswers[id] = lessonDetails[id].quiz.correct
  progress.quizVersions[id] = currentQuizVersions[id]
  assert.equal(currentCompleted(stored(progress)).includes(id), true)
})

test('saved full-edition completion requires every passage and correct checkpoints and synthesis', () => {
  for (const [id, descriptor] of Object.entries(depthEditionRegistry)) {
    const progress = {
      completed: [id], quizAnswers: { [id]: lessonDetails[id].quiz.correct }, quizVersions: { [id]: currentQuizVersions[id] },
      depthEditions: { [id]: { readIds: expectedDepthPassageIds(descriptor), checkpointAnswers: descriptor.checkpointCorrectAnswers, completed: true } },
    }
    const valid = stored(progress)
    assert.equal(lessonIsComplete(id, valid.completed, valid.depthEditions), true, id)
    progress.depthEditions[id].readIds = progress.depthEditions[id].readIds.slice(1)
    const invalid = stored(progress)
    assert.equal(lessonIsComplete(id, invalid.completed, invalid.depthEditions), false, id)
  }
})

test('corrupt or unavailable storage and invalid review answers recover safely', () => {
  assert.deepEqual(stored('{broken').completed, [])
  const unavailable = withWindow({ localStorage: { getItem: () => { throw new Error('Unavailable') } } }, readStoredProgress)
  assert.deepEqual(unavailable.reviewAnswers, {})
  const caseId = courseReviewCases[0].id
  assert.deepEqual(sanitizeReviewAnswers({ [caseId]: 99, unknown: 0 }, courseReviewVersion), {})
  assert.deepEqual(sanitizeReviewAnswers({ [caseId]: 0 }, 999), {})
  assert.deepEqual(sanitizeReviewAnswers({ [caseId]: 0 }, courseReviewVersion), { [caseId]: 0 })
})

test('final review only passes with seven correct answers and course completion still requires every lesson', () => {
  const correct = Object.fromEntries(courseReviewCases.map((entry) => [entry.id, entry.correct]))
  assert.equal(reviewIsPassed({}), false)
  assert.equal(reviewIsPassed(correct), true)
  const render = (completedIds) => withWindow({ location: { hash: '#path/review' } }, () => renderToStaticMarkup(createElement(CourseReview, { completedIds, answers: correct, reflection: '', onAnswer: noop, onReflection: noop, openLesson: noop })))
  assert.match(render([]), /Final review passed/)
  assert.doesNotMatch(render([]), /Curated course complete/)
  assert.match(render(ids), /Curated course complete/)
  assert.equal(nextLessonInPath(ids, ids.slice(0, 2)), ids[2])
  assert.equal(nextLessonInPath(ids, ids), undefined)
  for (const entry of courseReviewCases) assert.ok(entry.lessons.every((id) => ids.includes(id)))
})

test('review case deep links restore the open case and move focus to its summary', () => {
  const hash = '#path/review/sanskrit'
  assert.equal(reviewCaseFromHash(hash), 'sanskrit')
  assert.equal(reviewCaseFromHash('#path/review/unknown'), undefined)
  const html = withWindow({ location: { hash } }, () => renderToStaticMarkup(createElement(CourseReview, { completedIds: [], answers: {}, reflection: '', onAnswer: noop, onReflection: noop, openLesson: noop })))
  assert.match(html, /<details class="review-case" open=""><summary id="review-case-sanskrit">/)
  const previousDocument = globalThis.document
  const calls = []
  globalThis.document = { getElementById: (id) => ({ focus: () => calls.push(`focus:${id}`), scrollIntoView: () => calls.push(`scroll:${id}`) }) }
  try {
    withWindow({ location: { hash }, history: { replaceState: (_state, _title, url) => calls.push(url) } }, () => { rememberReviewCase('sanskrit'); focusCourseReview() })
    assert.deepEqual(calls, [hash, 'focus:review-case-sanskrit', 'scroll:review-case-sanskrit'])
  } finally { if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument }
})
