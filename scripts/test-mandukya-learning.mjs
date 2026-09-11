import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createHash } from 'node:crypto'
import { createServer } from 'vite'

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { hmr: false, middlewareMode: true } })
after(() => server.close())
const { default: Reader, MandukyaQuestionView } = await server.ssrLoadModule('/src/MandukyaDepthLessonView.tsx')
const { mandukyaPassages, mandukyaSources } = await server.ssrLoadModule('/src/mandukyaData.ts')
const { mandukyaSessions, mandukyaFinalSynthesis } = await server.ssrLoadModule('/src/mandukyaCourse.ts')
const { default: audit } = await server.ssrLoadModule('/src/mandukyaTextAudit.json')
const { mandukyaPassageIds, parseMandukyaRoute, markMandukyaRead, rememberMandukyaRoute, nextMandukyaWork, mandukyaCompletionState, completeMandukya, focusMandukyaTarget } = await server.ssrLoadModule('/src/mandukyaLearning.ts')
const { courseLessons, lessonDetails } = await server.ssrLoadModule('/src/courseData.ts')
const { depthEditionRegistry, isValidDepthPassageId } = await server.ssrLoadModule('/src/depthEditionRegistry.ts')
const { readStoredProgress, currentCompleted, currentQuizVersions, lessonIsComplete } = await server.ssrLoadModule('/src/progressStorage.ts')
const lesson = courseLessons.find((item) => item.id === 'mandukya')
const detail = lessonDetails.mandukya
const noop = () => {}
const empty = () => ({ readIds: [], checkpointAnswers: {} })
const escaped = (value) => renderToStaticMarkup(createElement('span', null, value)).slice(6, -7)
const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex')
function withWindow(value, run) {
  const previous = globalThis.window
  globalThis.window = value
  try { return run() } finally { if (previous === undefined) delete globalThis.window; else globalThis.window = previous }
}
function html(segment = '', progress = empty(), overrides = {}) {
  return withWindow({ location: { hash: `#lesson/mandukya${segment ? `/${segment}` : ''}` } }, () => renderToStaticMarkup(createElement(Reader, {
    lesson, detail, progress, reflection: '', completed: false, onProgressChange: noop,
    onReflectionChange: noop, onQuizSelect: noop, onComplete: noop, onClose: noop, ...overrides,
  })))
}
function stored(value) { return withWindow({ localStorage: { getItem: () => JSON.stringify(value) } }, readStoredProgress) }

test('Mandukya publishes exactly twelve reviewed root mantras and all 206 word-study entries', () => {
  assert.deepEqual(mandukyaPassages.map((item) => item.id), mandukyaPassageIds)
  assert.equal(mandukyaPassages.reduce((total, item) => total + item.words.length, 0), 206)
  assert.equal(audit.length, 12)
  for (const passage of mandukyaPassages) {
    const expected = audit.find((entry) => entry.id === passage.id)
    assert.equal(digest([passage.id, passage.devanagari, passage.iast]), expected.textFingerprint, passage.id)
    assert.equal(digest(passage.words), expected.wordFingerprint, passage.id)
    assert.equal(passage.words.length, expected.rowCount, passage.id)
    for (const word of passage.words) for (const field of ['source', 'iast', 'meaning', 'grammar']) {
      assert.ok(word[field].trim(), `${passage.id}: ${field}`)
      assert.equal(word[field], word[field].normalize('NFC'))
    }
    assert.ok(passage.gloss && passage.textNote && passage.reflectionPrompt && passage.explanation)
  }
})

test('every Mandukya mantra renders its English, Sanskrit, IAST and all word meanings on direct entry', () => {
  for (const passage of mandukyaPassages) {
    const output = html(passage.id)
    for (const field of ['title', 'gloss', 'devanagari', 'iast']) assert.ok(output.includes(escaped(passage[field])), `${passage.id}: ${field}`)
    for (const word of passage.words) {
      assert.ok(output.includes(escaped(word.source)), `${passage.id}: ${word.source}`)
      assert.ok(output.includes(escaped(word.meaning)), `${passage.id}: ${word.meaning}`)
    }
    assert.match(output, /Show grammar notes/)
    assert.match(output, /0 \/ 12 read/)
    assert.match(output, /not yet marked read/)
    assert.match(output, /id="mandukya-title" tabindex="-1"/)
    assert.ok(output.includes(escaped(passage.terms[0].meaning)))
    assert.match(output, /principally the Advaita lens/)
  }
})

test('all three reading views preserve translations and Sanskrit access without losing saved preferences', () => {
  for (const studyMode of ['full', 'guided', 'text']) for (const passage of mandukyaPassages) {
    const output = html(passage.id, { ...empty(), studyMode })
    assert.ok(output.includes(escaped(passage.gloss)))
    assert.ok(output.includes(escaped(passage.devanagari)))
    assert.ok(output.includes(escaped(passage.words[0].meaning)))
    if (studyMode === 'guided') assert.match(output, /Explore every Sanskrit word and its meaning/)
    if (studyMode === 'text') assert.doesNotMatch(output, /In plain English/)
    else assert.match(output, /In plain English/)
  }
})

test('sessions cover the root text exactly once and registry checkpoints agree with the rendered checks', () => {
  assert.equal(mandukyaSessions.length, 4)
  assert.deepEqual(mandukyaSessions.flatMap((item) => item.verses).map(String), mandukyaPassageIds)
  assert.deepEqual(depthEditionRegistry.mandukya.passageIds, mandukyaPassageIds)
  for (const session of mandukyaSessions) {
    assert.equal(depthEditionRegistry.mandukya.checkpointCorrectAnswers[session.id], session.checkpoint.correct)
    const output = html(String(session.verses.at(-1)))
    assert.ok(output.includes(escaped(session.checkpoint.question)))
    assert.match(output, new RegExp(`id="mandukya-check-${session.id}-title" tabindex="-1"`))
    assert.equal(new Set(session.checkpoint.choices).size, 4)
  }
  assert.equal(detail.quiz.correct, mandukyaFinalSynthesis.correct)
  assert.equal(detail.quiz.question, mandukyaFinalSynthesis.question)
  for (const passage of mandukyaPassages) assert.equal(new Set(passage.practice.choices).size, 4)
  assert.ok(mandukyaSources.every((source) => new URL(source.url).protocol === 'https:' && source.label && source.use))
})

test('direct and Back-style routes remember location without recording reading or overwriting study mode', () => {
  let progress = { ...empty(), studyMode: 'text', checkpointAnswers: { 'scope-and-self': 0 } }
  for (const id of ['7', '8', '7']) {
    const route = parseMandukyaRoute(`#lesson/mandukya/${id}`, progress)
    assert.equal(route.mode, 'reader')
    progress = rememberMandukyaRoute(progress, route)
    assert.equal(progress.lastId, id)
    assert.deepEqual(progress.readIds, [])
    assert.equal(progress.studyMode, 'text')
  }
  assert.equal(parseMandukyaRoute('#lesson/mandukya', progress).passageId, '7')
  assert.equal(parseMandukyaRoute('#lesson/kena/1.1', progress).belongs, false)
  for (const bad of ['0', '13', '01', '__proto__', 'read', '7/extra']) {
    assert.equal(parseMandukyaRoute(`#lesson/mandukya/${bad}`, progress).canonical, false)
    assert.equal(isValidDepthPassageId('mandukya', bad), false)
  }
})

test('Mark read records all twelve passages including every session boundary and preserves other answers', () => {
  let progress = { ...empty(), studyMode: 'guided', checkpointAnswers: { 'scope-and-self': 0 } }
  for (const id of mandukyaPassageIds) progress = markMandukyaRead(progress, id)
  assert.deepEqual(progress.readIds, mandukyaPassageIds)
  assert.equal(progress.lastId, '12')
  assert.equal(progress.studyMode, 'guided')
  assert.deepEqual(progress.checkpointAnswers, { 'scope-and-self': 0 })
  assert.equal(markMandukyaRead(progress, '999'), progress)
  assert.deepEqual(markMandukyaRead(progress, '7').readIds, mandukyaPassageIds)
})

test('resume points to missing reading, then the precise session check, then the final review', () => {
  let progress = { ...empty(), readIds: ['1', '3'] }
  assert.equal(nextMandukyaWork(progress).target, '2')
  progress = { ...progress, readIds: mandukyaPassageIds }
  for (const session of mandukyaSessions) {
    assert.equal(nextMandukyaWork(progress).reason, 'checkpoint')
    assert.equal(nextMandukyaWork(progress).target, String(session.verses.at(-1)))
    progress = { ...progress, checkpointAnswers: { ...progress.checkpointAnswers, [session.id]: session.checkpoint.correct } }
  }
  assert.equal(nextMandukyaWork(progress).target, 'review')
  assert.doesNotMatch(html('', progress), /Begin with mantra 1/)
  const previousDocument = globalThis.document
  const calls = []
  globalThis.document = { getElementById: (id) => ({ focus: () => calls.push(['focus', id]), scrollIntoView: () => calls.push(['scroll', id]) }) }
  try {
    focusMandukyaTarget('mandukya-check-the-fourth-title')
    assert.deepEqual(calls, [['focus', 'mandukya-check-the-fourth-title'], ['scroll', 'mandukya-check-the-fourth-title']])
  } finally { if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument }
})

test('upgrading the old Mandukya overview preserves notes but cannot falsely complete the full reader', () => {
  const progress = stored({ completed: ['mandukya'], reflections: { mandukya: 'My old reflection' }, quizAnswers: { mandukya: 2 } })
  assert.equal(progress.reflections.mandukya, 'My old reflection')
  assert.deepEqual(progress.completed, ['mandukya'])
  assert.equal(progress.quizAnswers.mandukya, undefined)
  assert.equal(lessonIsComplete('mandukya', currentCompleted(progress), progress.depthEditions), false)
  assert.equal(currentQuizVersions.mandukya, 2)
})

test('completion requires every mantra, all four checkpoints, and the new final check', () => {
  const ready = { readIds: mandukyaPassageIds, checkpointAnswers: depthEditionRegistry.mandukya.checkpointCorrectAnswers }
  assert.equal(mandukyaCompletionState(ready).ready, false)
  assert.equal(completeMandukya(ready), ready)
  const completed = completeMandukya(ready, mandukyaFinalSynthesis.correct)
  assert.equal(completed.completed, true)
  assert.equal(mandukyaCompletionState({ ...completed, readIds: ['1', '1', 'bogus'] }, mandukyaFinalSynthesis.correct).complete, false)
  for (const session of mandukyaSessions) {
    const incomplete = { ...ready, checkpointAnswers: { ...ready.checkpointAnswers, [session.id]: (session.checkpoint.correct + 1) % 4 } }
    assert.equal(mandukyaCompletionState(incomplete, mandukyaFinalSynthesis.correct).ready, false)
  }
  const saved = stored({ quizAnswers: { mandukya: mandukyaFinalSynthesis.correct }, quizVersions: { mandukya: 2 }, depthEditions: { mandukya: completed } })
  assert.equal(lessonIsComplete('mandukya', [], saved.depthEditions), true)
  const output = html('review', completed, { selectedQuiz: mandukyaFinalSynthesis.correct })
  assert.match(output, /Māṇḍūkya course complete/)
  assert.doesNotMatch(output, /Answer the final check below, then mark the course complete/)
})

test('question feedback distinguishes incorrect and correct answers without gating religious belief', () => {
  const render = (value) => renderToStaticMarkup(createElement(MandukyaQuestionView, { question: mandukyaFinalSynthesis, value, onAnswer: noop, label: 'Final check', id: 'check' }))
  assert.doesNotMatch(render(undefined), /role="status"/)
  assert.match(render(0), /Not quite/)
  assert.match(render(mandukyaFinalSynthesis.correct), /Yes\./)
  assert.match(html(), /understanding, not belief/)
  assert.match(html('6'), /Mantra 6 changes the scale/)
  assert.match(html('12'), /not its literal translation/)
})
