import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToReadableStream } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { hmr: false, middlewareMode: true } })
after(() => server.close())
const { LessonView } = await server.ssrLoadModule('/src/App.tsx')
const { courseLessons, lessonDetails } = await server.ssrLoadModule('/src/courseData.ts')
const { mandukyaSessions, mandukyaFinalSynthesis } = await server.ssrLoadModule('/src/mandukyaCourse.ts')
const { markMandukyaRead, completeMandukya } = await server.ssrLoadModule('/src/mandukyaLearning.ts')
const { readStoredProgress } = await server.ssrLoadModule('/src/progressStorage.ts')
const noop = () => {}

async function render(segment, progress, reflection = '', selectedQuiz) {
  const previous = globalThis.window
  globalThis.window = { location: { hash: `#lesson/mandukya${segment ? `/${segment}` : ''}` } }
  try {
    const stream = await renderToReadableStream(createElement(LessonView, {
      lesson: courseLessons.find((lesson) => lesson.id === 'mandukya'), detail: lessonDetails.mandukya,
      completed: false, reflection, selectedQuiz, depthProgress: progress,
      onReflectionChange: noop, onQuizSelect: noop, onDepthProgressChange: noop,
      onComplete: noop, onClose: noop, onOpenLesson: noop,
    }))
    await stream.allReady
    // Streaming React inserts hydration comments between adjacent text nodes.
    return (await new Response(stream).text()).replace(/<!--.*?-->/gs, '')
  } finally {
    if (previous === undefined) delete globalThis.window
    else globalThis.window = previous
  }
}

async function evidence(name, markup) {
  if (!process.env.MANDUKYA_EVIDENCE_DIR) return
  const css = await Promise.all(['src/index.css', 'src/App.css'].map((file) => readFile(file, 'utf8')))
  await mkdir(process.env.MANDUKYA_EVIDENCE_DIR, { recursive: true })
  await writeFile(join(process.env.MANDUKYA_EVIDENCE_DIR, name), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mandukya server-rendered evidence</title><style>${css.join('\n')}</style></head><body><div id="root" class="app-shell">${markup}</div></body></html>`)
}

test('the public lesson view resolves the lazy Mandukya reader and renders the course and mantra seven', async () => {
  assert.equal(courseLessons.length, 75)
  const empty = { readIds: [], checkpointAnswers: {} }
  const map = await render('', empty)
  assert.match(map, /0 \/ 12 read/)
  for (const session of mandukyaSessions) assert.ok(map.includes(session.title))
  assert.doesNotMatch(map, /Opening the .* reader/)
  await evidence('mandukya-course-map.html', map)
  const mantra = await render('7', empty)
  assert.match(mantra, /Watch the description refuse a box/)
  assert.match(mantra, /0 of 6 definitions examined/)
  assert.match(mantra, /lang="sa-Deva"/)
  assert.match(mantra, /lang="sa-Latn"/)
  assert.match(mantra, /Show grammar notes/)
  await evidence('mandukya-mantra-seven.html', mantra)
})

test('a four-session study journey restores saved notes and completion into the public final review', async () => {
  let progress = { readIds: [], checkpointAnswers: {}, studyMode: 'guided' }
  for (const session of mandukyaSessions) {
    for (const number of session.verses) progress = markMandukyaRead(progress, String(number))
    progress = { ...progress, checkpointAnswers: { ...progress.checkpointAnswers, [session.id]: session.checkpoint.correct } }
  }
  assert.equal(completeMandukya(progress).completed, undefined)
  progress = completeMandukya(progress, mandukyaFinalSynthesis.correct)
  const reflection = 'My earlier notes remain; deep sleep is not liberation.'
  const serialized = JSON.stringify({ depthEditions: { mandukya: progress }, reflections: { mandukya: reflection }, quizAnswers: { mandukya: mandukyaFinalSynthesis.correct }, quizVersions: { mandukya: 2 } })
  const previous = globalThis.window
  let restored
  globalThis.window = { localStorage: { getItem: () => serialized } }
  try { restored = readStoredProgress() } finally {
    if (previous === undefined) delete globalThis.window
    else globalThis.window = previous
  }
  assert.equal(restored.depthEditions.mandukya.studyMode, 'guided')
  assert.equal(restored.reflections.mandukya, reflection)
  const review = await render('review', restored.depthEditions.mandukya, restored.reflections.mandukya, restored.quizAnswers.mandukya)
  assert.match(review, /Māṇḍūkya course complete/)
  assert.match(review, /12 \/ 12 mantras marked read · 4 \/ 4 session checks correct · final check correct/)
  assert.ok(review.includes(reflection))
  await evidence('mandukya-completed-review.html', review)
})
