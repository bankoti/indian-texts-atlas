import { createServer } from 'vite'

const server = await createServer({
  appType: 'custom',
  logLevel: 'silent',
  server: { hmr: false, middlewareMode: true },
})

try {
  const curriculum = await server.ssrLoadModule('/src/courseData.ts')
  const { courseLessons, courseSections, lessonDetails } = curriculum
  const lessonIds = courseLessons.map((lesson) => lesson.id)
  const duplicateLessonIds = lessonIds.filter((id, index) => lessonIds.indexOf(id) !== index)
  const missingOrIncompleteDetails = courseLessons
    .filter((lesson) => {
      const detail = lessonDetails[lesson.id]
      return !detail
        || !detail.concepts?.length
        || !detail.lenses?.length
        || !detail.quiz?.choices?.length
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

  const report = {
    sections: courseSections.length,
    lessons: courseLessons.length,
    details: Object.keys(lessonDetails).length,
    available: courseLessons.filter((lesson) => lesson.status === 'available').length,
    duplicateLessonIds,
    missingOrIncompleteDetails,
    emptySections,
    unknownSections,
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

  if (failed) process.exitCode = 1
} finally {
  await server.close()
}
