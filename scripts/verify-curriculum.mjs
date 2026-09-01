import { createServer } from 'vite'
import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'

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
const wordStudyFields = ['source', 'iast', 'meaning', 'grammar']
const validWordStudyWord = (word) => wordStudyFields.every((field) => (
  typeof word?.[field] === 'string'
  && word[field].trim()
  && word[field] === word[field].normalize('NFC')
))
const validWordStudyWords = (words) => Array.isArray(words) && words.length > 0 && words.every(validWordStudyWord)
const validWordStudyEntry = (entry) => Boolean(entry?.id?.trim() && validWordStudyWords(entry.words))
const wordStudyRowsMatch = (left, right) => JSON.stringify(left) === JSON.stringify(right)
const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const sourceTextFingerprint = (id, text) => sha256(JSON.stringify([id, text?.devanagari, text?.iast]))
const validWordStudyAuditEntry = (entry) => Boolean(
  entry?.id?.trim()
  && /^[a-f0-9]{64}$/.test(entry.textFingerprint ?? '')
  && Number.isInteger(entry.rowCount)
  && entry.rowCount > 0
)
const reviewedWordStudyDigests = {
  kena: 'b76d29a5a6b3042df5f8c3a2a24b0f2ae378fa66fd61e8fe31dfbdca784d76cc',
  katha: '5c30ae7743a94dca2f026acb14810ff20184824d0140c51732fa6c1565c48952',
}
const wordStudyDigest = (entries, invocation, audit, invocationAudit) => sha256(JSON.stringify({
  entries,
  invocation,
  audit,
  invocationAudit,
}))

try {
  const [curriculum, kenaEdition, kathaEdition, registryModule, kenaWordStudyModule, kathaWordStudyModule] = await Promise.all([
    server.ssrLoadModule('/src/courseData.ts'),
    server.ssrLoadModule('/src/kenaData.ts'),
    server.ssrLoadModule('/src/kathaData.ts'),
    server.ssrLoadModule('/src/depthEditionRegistry.ts'),
    server.ssrLoadModule('/src/kenaWordStudy.generated.ts'),
    server.ssrLoadModule('/src/kathaWordStudy.generated.ts'),
  ])
  const { courseLessons, courseSections, lessonDetails } = curriculum
  const { kenaInvocation, kenaPassages, kenaSections, kenaSources } = kenaEdition
  const { kathaInvocation, kathaPassages, kathaSections, kathaSessions, kathaSources } = kathaEdition
  const { depthEditionRegistry, expectedDepthPassageIds, isValidDepthPassageId } = registryModule
  const {
    kenaInvocationWordStudy,
    kenaInvocationWordStudyAudit,
    kenaWordStudy,
    kenaWordStudyAudit,
  } = kenaWordStudyModule
  const {
    kathaInvocationWordStudy,
    kathaInvocationWordStudyAudit,
    kathaWordStudy,
    kathaWordStudyAudit,
  } = kathaWordStudyModule

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
  const kenaWordStudyIds = kenaWordStudy.map((entry) => entry.id)
  const kenaWordStudyIdsExact = JSON.stringify(kenaWordStudyIds) === JSON.stringify(expectedKenaIds)
  const duplicateKenaWordStudyIds = duplicateValues(kenaWordStudyIds)
  const invalidKenaWordStudyEntries = kenaWordStudy.filter((entry) => !validWordStudyEntry(entry)).map((entry) => entry.id)
  const kenaWordStudyRows = kenaWordStudy.reduce((total, entry) => total + entry.words.length, 0)
  const kenaWordStudyById = new Map(kenaWordStudy.map((entry) => [entry.id, entry.words]))
  const kenaWordStudyAttached = kenaPassages.every((passage) => wordStudyRowsMatch(passage.words, kenaWordStudyById.get(passage.id)))
  const kenaWordStudyAuditIds = kenaWordStudyAudit.map((entry) => entry.id)
  const kenaWordStudyAuditIdsExact = JSON.stringify(kenaWordStudyAuditIds) === JSON.stringify(expectedKenaIds)
  const duplicateKenaWordStudyAuditIds = duplicateValues(kenaWordStudyAuditIds)
  const invalidKenaWordStudyAuditEntries = kenaWordStudyAudit.filter((entry) => !validWordStudyAuditEntry(entry)).map((entry) => entry.id)
  const kenaWordStudyAuditById = new Map(kenaWordStudyAudit.map((entry) => [entry.id, entry]))
  const kenaSourceFingerprintsValid = kenaPassages.every((passage) => (
    kenaWordStudyAuditById.get(passage.id)?.textFingerprint === sourceTextFingerprint(passage.id, passage)
  ))
  const kenaRowCountsExact = kenaWordStudy.every((entry) => (
    kenaWordStudyAuditById.get(entry.id)?.rowCount === entry.words.length
  ))
  const kenaInvocationWordStudyValid = kenaInvocationWordStudy.id === 'invocation'
    && validWordStudyEntry(kenaInvocationWordStudy)
    && wordStudyRowsMatch(kenaInvocation.words, kenaInvocationWordStudy.words)
  const kenaInvocationWordStudyAuditValid = kenaInvocationWordStudyAudit.id === 'invocation'
    && validWordStudyAuditEntry(kenaInvocationWordStudyAudit)
    && kenaInvocationWordStudyAudit.rowCount === kenaInvocationWordStudy.words.length
    && kenaInvocationWordStudyAudit.textFingerprint === sourceTextFingerprint('invocation', kenaInvocation)
  const kenaReviewedWordStudyDigestValid = wordStudyDigest(
    kenaWordStudy,
    kenaInvocationWordStudy,
    kenaWordStudyAudit,
    kenaInvocationWordStudyAudit,
  ) === reviewedWordStudyDigests.kena
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
        || !validWordStudyWords(passage.words)
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
  const kathaWordStudyIds = kathaWordStudy.map((entry) => entry.id)
  const kathaWordStudyIdsExact = JSON.stringify(kathaWordStudyIds) === JSON.stringify(expectedKathaIds)
  const duplicateKathaWordStudyIds = duplicateValues(kathaWordStudyIds)
  const invalidKathaWordStudyEntries = kathaWordStudy.filter((entry) => !validWordStudyEntry(entry)).map((entry) => entry.id)
  const kathaWordStudyRows = kathaWordStudy.reduce((total, entry) => total + entry.words.length, 0)
  const kathaWordStudyById = new Map(kathaWordStudy.map((entry) => [entry.id, entry.words]))
  const kathaWordStudyAttached = kathaPassages.every((passage) => wordStudyRowsMatch(passage.words, kathaWordStudyById.get(passage.id)))
  const kathaWordStudyAuditIds = kathaWordStudyAudit.map((entry) => entry.id)
  const kathaWordStudyAuditIdsExact = JSON.stringify(kathaWordStudyAuditIds) === JSON.stringify(expectedKathaIds)
  const duplicateKathaWordStudyAuditIds = duplicateValues(kathaWordStudyAuditIds)
  const invalidKathaWordStudyAuditEntries = kathaWordStudyAudit.filter((entry) => !validWordStudyAuditEntry(entry)).map((entry) => entry.id)
  const kathaWordStudyAuditById = new Map(kathaWordStudyAudit.map((entry) => [entry.id, entry]))
  const kathaSourceFingerprintsValid = kathaPassages.every((passage) => (
    kathaWordStudyAuditById.get(passage.id)?.textFingerprint === sourceTextFingerprint(passage.id, passage)
  ))
  const kathaRowCountsExact = kathaWordStudy.every((entry) => (
    kathaWordStudyAuditById.get(entry.id)?.rowCount === entry.words.length
  ))
  const kathaInvocationWordStudyValid = kathaInvocationWordStudy.id === 'invocation'
    && validWordStudyEntry(kathaInvocationWordStudy)
    && wordStudyRowsMatch(kathaInvocation.words, kathaInvocationWordStudy.words)
  const kathaInvocationWordStudyAuditValid = kathaInvocationWordStudyAudit.id === 'invocation'
    && validWordStudyAuditEntry(kathaInvocationWordStudyAudit)
    && kathaInvocationWordStudyAudit.rowCount === kathaInvocationWordStudy.words.length
    && kathaInvocationWordStudyAudit.textFingerprint === sourceTextFingerprint('invocation', kathaInvocation)
  const kathaReviewedWordStudyDigestValid = wordStudyDigest(
    kathaWordStudy,
    kathaInvocationWordStudy,
    kathaWordStudyAudit,
    kathaInvocationWordStudyAudit,
  ) === reviewedWordStudyDigests.katha
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
      || passage.terms.some((term) => !term.term?.trim() || !term.meaning?.trim())
      || !validWordStudyWords(passage.words))
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
      wordStudy: {
        entries: kenaWordStudy.length,
        rows: kenaWordStudyRows,
        idsExact: kenaWordStudyIdsExact,
        duplicateIds: duplicateKenaWordStudyIds,
        invalidEntries: invalidKenaWordStudyEntries,
        attachedToPassages: kenaWordStudyAttached,
        auditIdsExact: kenaWordStudyAuditIdsExact,
        duplicateAuditIds: duplicateKenaWordStudyAuditIds,
        invalidAuditEntries: invalidKenaWordStudyAuditEntries,
        sourceFingerprintsValid: kenaSourceFingerprintsValid,
        rowCountsExact: kenaRowCountsExact,
        reviewedDigestValid: kenaReviewedWordStudyDigestValid,
        invocationRows: kenaInvocationWordStudy.words.length,
        invocationValid: kenaInvocationWordStudyValid,
        invocationAuditValid: kenaInvocationWordStudyAuditValid,
      },
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
      wordStudy: {
        entries: kathaWordStudy.length,
        rows: kathaWordStudyRows,
        idsExact: kathaWordStudyIdsExact,
        duplicateIds: duplicateKathaWordStudyIds,
        invalidEntries: invalidKathaWordStudyEntries,
        attachedToPassages: kathaWordStudyAttached,
        auditIdsExact: kathaWordStudyAuditIdsExact,
        duplicateAuditIds: duplicateKathaWordStudyAuditIds,
        invalidAuditEntries: invalidKathaWordStudyAuditEntries,
        sourceFingerprintsValid: kathaSourceFingerprintsValid,
        rowCountsExact: kathaRowCountsExact,
        reviewedDigestValid: kathaReviewedWordStudyDigestValid,
        invocationRows: kathaInvocationWordStudy.words.length,
        invocationValid: kathaInvocationWordStudyValid,
        invocationAuditValid: kathaInvocationWordStudyAuditValid,
      },
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
    || kenaWordStudy.length !== 35
    || kenaWordStudyRows !== 605
    || !kenaWordStudyIdsExact
    || duplicateKenaWordStudyIds.length > 0
    || invalidKenaWordStudyEntries.length > 0
    || !kenaWordStudyAttached
    || !kenaWordStudyAuditIdsExact
    || duplicateKenaWordStudyAuditIds.length > 0
    || invalidKenaWordStudyAuditEntries.length > 0
    || !kenaSourceFingerprintsValid
    || !kenaRowCountsExact
    || !kenaReviewedWordStudyDigestValid
    || kenaInvocationWordStudy.words.length !== 46
    || !kenaInvocationWordStudyValid
    || !kenaInvocationWordStudyAuditValid
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
    || kathaWordStudy.length !== 119
    || kathaWordStudyRows !== 1979
    || !kathaWordStudyIdsExact
    || duplicateKathaWordStudyIds.length > 0
    || invalidKathaWordStudyEntries.length > 0
    || !kathaWordStudyAttached
    || !kathaWordStudyAuditIdsExact
    || duplicateKathaWordStudyAuditIds.length > 0
    || invalidKathaWordStudyAuditEntries.length > 0
    || !kathaSourceFingerprintsValid
    || !kathaRowCountsExact
    || !kathaReviewedWordStudyDigestValid
    || kathaInvocationWordStudy.words.length !== 20
    || !kathaInvocationWordStudyValid
    || !kathaInvocationWordStudyAuditValid
    || !kathaIllustrationExists

  if (failed) process.exitCode = 1
} finally {
  await server.close()
}
