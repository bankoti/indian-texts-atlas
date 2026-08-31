import { createServer } from 'vite'
import { existsSync } from 'node:fs'

const server = await createServer({
  appType: 'custom',
  logLevel: 'silent',
  server: { hmr: false, middlewareMode: true },
})

try {
  const curriculum = await server.ssrLoadModule('/src/courseData.ts')
  const kenaEdition = await server.ssrLoadModule('/src/kenaData.ts')
  const { courseLessons, courseSections, lessonDetails } = curriculum
  const { kenaInvocation, kenaPassages, kenaSections, kenaSources } = kenaEdition
  const lessonIds = courseLessons.map((lesson) => lesson.id)
  const duplicateLessonIds = lessonIds.filter((id, index) => lessonIds.indexOf(id) !== index)
  const missingOrIncompleteDetails = courseLessons
    .filter((lesson) => {
      const detail = lessonDetails[lesson.id]
      return !detail
        || !detail.concepts?.length
        || !detail.lenses?.length
        || !detail.quiz?.question?.trim()
        || !detail.quiz?.explanation?.trim()
        || !detail.quiz?.choices?.length
        || detail.quiz.choices.some((choice) => !choice?.trim())
        || !Number.isInteger(detail.quiz.correct)
        || detail.quiz.correct < 0
        || detail.quiz.correct >= detail.quiz.choices.length
        || !detail.sourceLinks?.length
    })
    .map((lesson) => lesson.id)
  const emptySections = courseSections
    .filter((section) => !courseLessons.some((lesson) => lesson.sectionId === section.id))
    .map((section) => section.id)
  const unknownSections = [...new Set(
    courseLessons
      .filter((lesson) => !courseSections.some((section) => section.id === lesson.sectionId))
      .map((lesson) => lesson.sectionId),
  )]
  const kenaIds = kenaPassages.map((passage) => passage.id)
  const expectedKenaIds = [9, 5, 12, 9].flatMap((count, sectionIndex) => Array.from({ length: count }, (_, passageIndex) => `${sectionIndex + 1}.${passageIndex + 1}`))
  const kenaIdsExact = JSON.stringify(kenaIds) === JSON.stringify(expectedKenaIds)
  const duplicateKenaIds = kenaIds.filter((id, index) => kenaIds.indexOf(id) !== index)
  const kenaSectionIds = kenaSections.map((section) => section.id)
  const kenaSectionIdsExact = JSON.stringify(kenaSectionIds) === JSON.stringify([1, 2, 3, 4])
  const kenaSectionCounts = Object.fromEntries(kenaSections.map((section) => [
    String(section.id),
    kenaPassages.filter((passage) => passage.section === section.id).length,
  ]))
  const invalidKenaPassages = kenaPassages
    .filter((passage) => {
      const expectedKind = passage.section <= 2 ? 'mantra' : 'prose paragraph'
      return !/^\d\.\d+$/.test(passage.id)
        || passage.id !== `${passage.section}.${passage.number}`
        || passage.kind !== expectedKind
        || !passage.title?.trim()
        || !passage.devanagari?.trim()
        || !passage.iast?.trim()
        || !passage.gloss?.trim()
        || !passage.explanation?.trim()
        || !passage.terms?.length
        || passage.terms.some((term) => !term.term?.trim() || !term.meaning?.trim())
    })
    .map((passage) => passage.id)
  const invalidKenaSections = kenaSections
    .filter((section) => !section.title?.trim()
      || !section.form?.trim()
      || !section.question?.trim()
      || !section.summary?.trim()
      || !section.recap?.trim()
      || !section.checkpoint?.question?.trim()
      || !section.checkpoint?.explanation?.trim()
      || section.checkpoint.choices.length < 2
      || section.checkpoint.choices.some((choice) => !choice?.trim())
      || !Number.isInteger(section.checkpoint.correct)
      || section.checkpoint.correct < 0
      || section.checkpoint.correct >= section.checkpoint.choices.length)
    .map((section) => section.id)
  const invalidKenaSources = kenaSources.filter((source) => !source.label?.trim() || !source.use?.trim() || !/^https:\/\//.test(source.url ?? '')).map((source) => source.url)
  const kenaIllustrationExists = existsSync(new URL('../public/kena-yaksha-teaching-turn.jpg', import.meta.url))

  const report = {
    sections: courseSections.length,
    lessons: courseLessons.length,
    details: Object.keys(lessonDetails).length,
    available: courseLessons.filter((lesson) => lesson.status === 'available').length,
    duplicateLessonIds,
    missingOrIncompleteDetails,
    emptySections,
    unknownSections,
    kenaEdition: {
      passages: kenaPassages.length,
      idsExact: kenaIdsExact,
      sectionIdsExact: kenaSectionIdsExact,
      sectionCounts: kenaSectionCounts,
      duplicateIds: duplicateKenaIds,
      invalidPassages: invalidKenaPassages,
      invalidSections: invalidKenaSections,
      invalidSources: invalidKenaSources,
      sources: kenaSources.length,
      hasInvocation: Boolean(kenaInvocation?.devanagari?.trim() && kenaInvocation?.iast?.trim()),
      hasIllustration: kenaIllustrationExists,
    },
    sectionCounts: Object.fromEntries(courseSections.map((section) => [
      section.id,
      courseLessons.filter((lesson) => lesson.sectionId === section.id).length,
    ])),
  }

  console.log(JSON.stringify(report, null, 2))

  const failed = report.sections !== 11
    || report.lessons !== 75
    || report.details !== 75
    || report.available !== 75
    || duplicateLessonIds.length > 0
    || missingOrIncompleteDetails.length > 0
    || emptySections.length > 0
    || unknownSections.length > 0
    || kenaPassages.length !== 35
    || !kenaIdsExact
    || !kenaSectionIdsExact
    || JSON.stringify(kenaSectionCounts) !== JSON.stringify({ 1: 9, 2: 5, 3: 12, 4: 9 })
    || duplicateKenaIds.length > 0
    || invalidKenaPassages.length > 0
    || invalidKenaSections.length > 0
    || kenaSources.length < 6
    || invalidKenaSources.length > 0
    || !kenaInvocation?.devanagari?.trim()
    || !kenaInvocation?.iast?.trim()
    || !kenaIllustrationExists

  if (failed) process.exitCode = 1
} finally {
  await server.close()
}
