import { createServer } from 'vite'
import { existsSync } from 'node:fs'

const server = await createServer({
  appType: 'custom',
  logLevel: 'silent',
  server: { hmr: false, middlewareMode: true },
})

const duplicateValues = (values) => values.filter((value, index) => values.indexOf(value) !== index)
const validSource = (source) => Boolean(source.label?.trim() && source.use?.trim() && /^https:\/\//.test(source.url ?? ''))
const validCheckpoint = (section, expectedChoices) => Boolean(
  section.checkpoint?.question?.trim()
  && section.checkpoint?.explanation?.trim()
  && section.checkpoint?.choices?.length === expectedChoices
  && section.checkpoint.choices.every((choice) => choice?.trim())
  && Number.isInteger(section.checkpoint.correct)
  && section.checkpoint.correct >= 0
  && section.checkpoint.correct < section.checkpoint.choices.length
)

try {
  const [curriculum, kenaEdition, kathaEdition, registryModule] = await Promise.all([
    server.ssrLoadModule('/src/courseData.ts'),
    server.ssrLoadModule('/src/kenaData.ts'),
    server.ssrLoadModule('/src/kathaData.ts'),
    server.ssrLoadModule('/src/depthEditionRegistry.ts'),
  ])
  const { courseLessons, courseSections, lessonDetails } = curriculum
  const { kenaInvocation, kenaPassages, kenaSections, kenaSources } = kenaEdition
  const { kathaInvocation, kathaPassages, kathaSections, kathaSessions, kathaSources } = kathaEdition
  const { depthEditionRegistry, expectedDepthPassageIds, isValidDepthPassageId } = registryModule

  const lessonIds = courseLessons.map((lesson) => lesson.id)
  const duplicateLessonIds = duplicateValues(lessonIds)
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

  const kenaDescriptor = depthEditionRegistry.kena
  const kenaIds = kenaPassages.map((passage) => passage.id)
  const expectedKenaIds = expectedDepthPassageIds(kenaDescriptor)
  const kenaIdsExact = JSON.stringify(kenaIds) === JSON.stringify(expectedKenaIds)
  const duplicateKenaIds = duplicateValues(kenaIds)
  const kenaSectionIds = kenaSections.map((section) => String(section.id))
  const kenaSectionIdsExact = JSON.stringify(kenaSectionIds) === JSON.stringify(kenaDescriptor.sectionIds)
  const kenaSectionCounts = Object.fromEntries(kenaSections.map((section) => [
    String(section.id),
    kenaPassages.filter((passage) => passage.section === section.id).length,
  ]))
  const invalidKenaPassages = kenaPassages
    .filter((passage) => {
      const expectedKind = passage.section <= 2 ? 'mantra' : 'prose paragraph'
      return !isValidDepthPassageId('kena', passage.id)
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
      || !validCheckpoint(section, kenaDescriptor.checkpointChoiceCount))
    .map((section) => section.id)
  const invalidKenaSources = kenaSources.filter((source) => !validSource(source)).map((source) => source.url)
  const kenaCheckpointAnswersMatchRegistry = kenaSections.every((section) => (
    kenaDescriptor.checkpointCorrectAnswers[String(section.id)] === section.checkpoint.correct
  ))
  const kenaIllustrationExists = existsSync(new URL('../public/kena-yaksha-teaching-turn.jpg', import.meta.url))

  const kathaDescriptor = depthEditionRegistry.katha
  const kathaIds = kathaPassages.map((passage) => passage.id)
  const expectedKathaIds = expectedDepthPassageIds(kathaDescriptor)
  const kathaIdsExact = JSON.stringify(kathaIds) === JSON.stringify(expectedKathaIds)
  const duplicateKathaIds = duplicateValues(kathaIds)
  const kathaSectionIds = kathaSections.map((section) => section.id)
  const kathaSectionIdsExact = JSON.stringify(kathaSectionIds) === JSON.stringify(kathaDescriptor.sectionIds)
  const kathaSectionCounts = Object.fromEntries(kathaSections.map((section) => [
    section.id,
    kathaPassages.filter((passage) => passage.sectionId === section.id).length,
  ]))
  const kathaSessionIds = kathaSessions.map((session) => session.id)
  const duplicateKathaSessionIds = duplicateValues(kathaSessionIds)
  const invalidKathaPassages = kathaPassages
    .filter((passage) => !isValidDepthPassageId('katha', passage.id)
      || passage.id !== `${passage.sectionId}.${passage.number}`
      || passage.kind !== 'numbered unit'
      || !kathaDescriptor.sectionIds.includes(passage.sectionId)
      || !kathaSessionIds.includes(passage.sessionId)
      || !passage.title?.trim()
      || !passage.devanagari?.trim()
      || !passage.iast?.trim()
      || !passage.gloss?.trim()
      || !passage.explanation?.trim()
      || !passage.terms?.length
      || passage.terms.some((term) => !term.term?.trim() || !term.meaning?.trim()))
    .map((passage) => passage.id)
  const invalidKathaSections = kathaSections
    .filter((section) => section.id !== `${section.adhyaya}.${section.valli}`
      || !section.label?.trim()
      || !section.title?.trim()
      || !section.form?.trim()
      || !section.question?.trim()
      || !section.summary?.trim()
      || !section.recap?.trim()
      || !validCheckpoint(section, kathaDescriptor.checkpointChoiceCount))
    .map((section) => section.id)
  const invalidKathaSessions = kathaSessions
    .filter((session) => {
      const [start, end] = session.range ?? []
      const sectionSize = kathaDescriptor.sectionSizes[session.sectionId]
      const passageCount = kathaPassages.filter((passage) => passage.sessionId === session.id).length
      return !/^\d\.\d\.[a-z]$/.test(session.id)
        || !kathaDescriptor.sectionIds.includes(session.sectionId)
        || !Number.isInteger(session.order)
        || !Number.isInteger(start)
        || !Number.isInteger(end)
        || start < 1
        || end < start
        || end > sectionSize
        || passageCount !== end - start + 1
        || !session.title?.trim()
        || !session.recall?.trim()
        || !session.nextQuestion?.trim()
    })
    .map((session) => session.id)
  const kathaSessionCoverageProblems = kathaPassages
    .filter((passage) => {
      const matches = kathaSessions.filter((session) => (
        session.sectionId === passage.sectionId
        && passage.number >= session.range[0]
        && passage.number <= session.range[1]
      ))
      return matches.length !== 1 || matches[0]?.id !== passage.sessionId
    })
    .map((passage) => passage.id)
  const kathaSessionOrdersExact = JSON.stringify(kathaSessions.map((session) => session.order)) === JSON.stringify(Array.from({ length: 18 }, (_, index) => index + 1))
  const invalidKathaSources = kathaSources.filter((source) => !validSource(source)).map((source) => source.url)
  const kathaCheckpointAnswersMatchRegistry = kathaSections.every((section) => (
    kathaDescriptor.checkpointCorrectAnswers[section.id] === section.checkpoint.correct
  ))
  const kathaIllustrationExists = existsSync(new URL('../public/naciketas-threshold-three-nights.jpg', import.meta.url))
  const kathaLesson = courseLessons.find((lesson) => lesson.id === 'katha')
  const kathaMetadataValid = Boolean(kathaLesson?.form?.includes('119') && kathaLesson.minutes === 360)

  const registryValid = kenaDescriptor.totalUnits === 35
    && JSON.stringify(kenaDescriptor.sectionIds) === JSON.stringify(['1', '2', '3', '4'])
    && JSON.stringify(kenaDescriptor.sectionSizes) === JSON.stringify({ 1: 9, 2: 5, 3: 12, 4: 9 })
    && kathaDescriptor.totalUnits === 119
    && JSON.stringify(kathaDescriptor.sectionIds) === JSON.stringify(['1.1', '1.2', '1.3', '2.1', '2.2', '2.3'])
    && JSON.stringify(kathaDescriptor.sectionSizes) === JSON.stringify({ '1.1': 29, '1.2': 25, '1.3': 17, '2.1': 15, '2.2': 15, '2.3': 18 })

  const report = {
    sections: courseSections.length,
    lessons: courseLessons.length,
    details: Object.keys(lessonDetails).length,
    available: courseLessons.filter((lesson) => lesson.status === 'available').length,
    duplicateLessonIds,
    missingOrIncompleteDetails,
    emptySections,
    unknownSections,
    registryValid,
    kenaEdition: {
      passages: kenaPassages.length,
      idsExact: kenaIdsExact,
      sectionIdsExact: kenaSectionIdsExact,
      sectionCounts: kenaSectionCounts,
      duplicateIds: duplicateKenaIds,
      invalidPassages: invalidKenaPassages,
      invalidSections: invalidKenaSections,
      invalidSources: invalidKenaSources,
      checkpointAnswersMatchRegistry: kenaCheckpointAnswersMatchRegistry,
      sources: kenaSources.length,
      hasInvocation: Boolean(kenaInvocation?.devanagari?.trim() && kenaInvocation?.iast?.trim()),
      hasIllustration: kenaIllustrationExists,
    },
    kathaEdition: {
      passages: kathaPassages.length,
      idsExact: kathaIdsExact,
      sectionIdsExact: kathaSectionIdsExact,
      sectionCounts: kathaSectionCounts,
      duplicateIds: duplicateKathaIds,
      invalidPassages: invalidKathaPassages,
      invalidSections: invalidKathaSections,
      sessions: kathaSessions.length,
      sessionOrdersExact: kathaSessionOrdersExact,
      duplicateSessionIds: duplicateKathaSessionIds,
      invalidSessions: invalidKathaSessions,
      sessionCoverageProblems: kathaSessionCoverageProblems,
      invalidSources: invalidKathaSources,
      checkpointAnswersMatchRegistry: kathaCheckpointAnswersMatchRegistry,
      sources: kathaSources.length,
      metadataValid: kathaMetadataValid,
      hasInvocation: Boolean(kathaInvocation?.devanagari?.trim() && kathaInvocation?.iast?.trim()),
      hasIllustration: kathaIllustrationExists,
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
    || !registryValid
    || kenaPassages.length !== 35
    || !kenaIdsExact
    || !kenaSectionIdsExact
    || JSON.stringify(kenaSectionCounts) !== JSON.stringify(kenaDescriptor.sectionSizes)
    || duplicateKenaIds.length > 0
    || invalidKenaPassages.length > 0
    || invalidKenaSections.length > 0
    || kenaSources.length < 6
    || invalidKenaSources.length > 0
    || !kenaCheckpointAnswersMatchRegistry
    || !kenaInvocation?.devanagari?.trim()
    || !kenaInvocation?.iast?.trim()
    || !kenaIllustrationExists
    || kathaPassages.length !== 119
    || !kathaIdsExact
    || !kathaSectionIdsExact
    || JSON.stringify(kathaSectionCounts) !== JSON.stringify(kathaDescriptor.sectionSizes)
    || duplicateKathaIds.length > 0
    || invalidKathaPassages.length > 0
    || invalidKathaSections.length > 0
    || kathaSessions.length !== 18
    || !kathaSessionOrdersExact
    || duplicateKathaSessionIds.length > 0
    || invalidKathaSessions.length > 0
    || kathaSessionCoverageProblems.length > 0
    || kathaSources.length < 8
    || invalidKathaSources.length > 0
    || !kathaCheckpointAnswersMatchRegistry
    || !kathaMetadataValid
    || !kathaInvocation?.devanagari?.trim()
    || !kathaInvocation?.iast?.trim()
    || !kathaIllustrationExists

  if (failed) process.exitCode = 1
} finally {
  await server.close()
}
