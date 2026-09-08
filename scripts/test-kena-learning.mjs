import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { hmr: false, middlewareMode: true } })
after(() => server.close())
const { firstUnreadKenaPassage, markKenaPassageRead, nextKenaReviewTask } = await server.ssrLoadModule('/src/kenaLearning.ts')
const { kenaPassages, kenaSections } = await server.ssrLoadModule('/src/kenaData.ts')
const { default: WordByWordStudy } = await server.ssrLoadModule('/src/WordByWordStudy.tsx')
const { default: KenaReader } = await server.ssrLoadModule('/src/KenaDepthLessonView.tsx')
const { courseLessons, lessonDetails } = await server.ssrLoadModule('/src/courseData.ts')

test('finishing a passage preserves preferences, checkpoint answers, and existing progress', () => {
  const progress = { readIds: ['1.1', '1.1', 'invalid'], lastId: '1.1', checkpointAnswers: { 1: 1 }, studyMode: 'guided' }
  const next = markKenaPassageRead(progress, '1.2')
  assert.deepEqual(next, { ...progress, readIds: ['1.1', '1.2'], lastId: '1.2' })
  assert.deepEqual(progress.readIds, ['1.1', '1.1', 'invalid'])
  assert.deepEqual(markKenaPassageRead(next, '1.2'), next)
  assert.equal(markKenaPassageRead(next, 'unknown'), next)
})

test('reading through all four section boundaries records every one of the 35 passages', () => {
  let progress = { readIds: [], checkpointAnswers: {} }
  for (const passage of kenaPassages) progress = markKenaPassageRead(progress, passage.id)
  assert.equal(progress.readIds.length, 35)
  assert.equal(progress.lastId, '4.9')
  assert.equal(firstUnreadKenaPassage(progress.readIds), undefined)
  for (const id of ['1.9', '2.5', '3.12', '4.9']) assert.ok(progress.readIds.includes(id))
})

test('review sends a learner to missing work in order: reading, checkpoints, synthesis', () => {
  const ids = kenaPassages.map((passage) => passage.id)
  const progress = { readIds: ids.filter((id) => id !== '3.6'), checkpointAnswers: {} }
  assert.deepEqual(nextKenaReviewTask(progress, false), { kind: 'passage', id: '3.6', label: 'Continue with unread passage 3.6' })
  progress.readIds = ids
  assert.equal(nextKenaReviewTask(progress, false).id, 'kena-checkpoint-1')
  for (const section of kenaSections) {
    assert.equal(nextKenaReviewTask(progress, false).id, `kena-checkpoint-${section.id}`)
    progress.checkpointAnswers[String(section.id)] = section.checkpoint.correct
  }
  assert.equal(nextKenaReviewTask(progress, false).kind, 'quiz')
  assert.equal(nextKenaReviewTask(progress, true), undefined)
})

test('the first unread passage is found even after out-of-order browsing', () => {
  assert.equal(firstUnreadKenaPassage([]), '1.1')
  assert.equal(firstUnreadKenaPassage(['4.9', '1.2', '1.1']), '1.3')
})

test('word-study rendering retains every meaning while grammar is optional for beginners', () => {
  const words = [{ source: 'केन', iast: 'kena', meaning: 'by whom?', grammar: 'instrumental singular' }]
  const full = renderToStaticMarkup(createElement(WordByWordStudy, { passageId: 'regular', words }))
  const beginner = renderToStaticMarkup(createElement(WordByWordStudy, { passageId: 'beginner', words, beginner: true }))
  // These assertions check the component’s emitted public HTML, not its implementation source.
  assert.match(full, /instrumental singular/)
  assert.match(beginner, /केन/)
  assert.match(beginner, /by whom\?/)
  assert.doesNotMatch(beginner, /instrumental singular/)
  assert.match(beginner, /aria-pressed="false"[^>]*>Show grammar notes/)
})

const noop = () => {}
function renderReader(hash, progress = { readIds: [], checkpointAnswers: {} }) {
  const previousWindow = globalThis.window
  globalThis.window = { location: { hash } }
  try {
    return renderToStaticMarkup(createElement(KenaReader, {
      lesson: courseLessons.find((lesson) => lesson.id === 'kena'),
      detail: lessonDetails.kena,
      completed: false,
      reflection: '',
      progress,
      onProgressChange: noop,
      onReflectionChange: noop,
      onQuizSelect: noop,
      onComplete: noop,
      onClose: noop,
    }))
  } finally {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
}

test('direct entry at 1.1 starts with orientation and meaning and includes all 22 word rows', () => {
  const html = renderReader('#lesson/kena/1.1')
  assert.ok(html.indexOf('The idea in plain English') < html.indexOf('id="devanagari-1.1"'))
  assert.ok(html.indexOf('id="kena-opening-check-title"') < html.indexOf('id="devanagari-1.1"'))
  assert.match(html, /A student asks the opening question/)
  assert.match(html, /Choose a question from Kena 1.1/)
  assert.match(html, /Mark read &amp; continue/)
  assert.doesNotMatch(html, /<span>Next<\/span>/)
  assert.match(html, /22 LEARNING WORDS/)
  assert.match(html, /id="word-study-kena-1-1"/)
})

test('every deep link renders its passage and a section-end continuation records reading explicitly', () => {
  for (const passage of kenaPassages) {
    const html = renderReader(`#lesson/kena/${passage.id}`)
    assert.ok(html.includes(`id="devanagari-${passage.id}"`), passage.id)
    assert.ok(html.includes(`id="word-study-kena-${passage.id.replaceAll('.', '-')}"`), passage.id)
  }
  for (const id of ['1.9', '2.5', '3.12', '4.9']) {
    assert.ok(renderReader(`#lesson/kena/${id}`).includes(`Mark ${id} read &amp; `), id)
  }
})

test('saved script preference is honored and review points to the actual unread passage', () => {
  const html = renderReader('#lesson/kena/1.1', { readIds: [], checkpointAnswers: {}, studyMode: 'guided' })
  assert.match(html, /The idea in plain English/)
  assert.doesNotMatch(html, /22 LEARNING WORDS/)
  const review = renderReader('#lesson/kena/review', { readIds: ['1.1', '1.2'], checkpointAnswers: {} })
  assert.match(review, /Continue with unread passage 1.3/)
})

test('the map offers review after all reading and labels a browsed but unread resume correctly', () => {
  const map = renderReader('#lesson/kena', { readIds: kenaPassages.map((passage) => passage.id), checkpointAnswers: {} })
  assert.match(map, /Continue to review/)
  assert.doesNotMatch(map, /Resume at 1.1/)
  const browsing = renderReader('#lesson/kena', { readIds: [], checkpointAnswers: {}, lastId: '2.1' })
  assert.match(browsing, /Resume at 2.1/)
})
