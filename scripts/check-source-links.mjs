import { createServer } from 'vite'

// Optional network audit; intentionally separate from reproducible/offline CI.
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { hmr: false, middlewareMode: true } })
const { lessonDetails, referenceSources } = await server.ssrLoadModule('/src/courseData.ts')
const { guidedContent } = await server.ssrLoadModule('/src/guidedData.ts')
const urls = [...new Set([
  ...referenceSources.map((source) => source.url),
  ...Object.values(lessonDetails).flatMap((lesson) => lesson.sourceLinks.map((source) => source.url)),
  ...Object.values(guidedContent).flatMap((guide) => [...guide.sourceLinks.map((source) => source.url), ...(guide.excerpt ? [guide.excerpt.sourceUrl] : [])]),
])]
await server.close()
let checked = 0
const issues = []
const pending = [...urls]
await Promise.all(Array.from({ length: 8 }, async () => {
  while (pending.length) {
    const url = pending.shift()
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: 'follow' })
      const html = response.headers.get('content-type')?.includes('text/html') ? await response.text() : ''
      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? ''
      if (!response.ok || /account suspended|page not found|404 not found/i.test(title)) {
        const issue = { url, status: response.status, title, finalUrl: response.url }
        issues.push(issue)
        console.log(JSON.stringify(issue))
      }
      await response.body?.cancel().catch(() => {})
    } catch (error) {
      const issue = { url, status: 'unverified', reason: error.message }
      issues.push(issue)
      console.log(JSON.stringify(issue))
    }
    checked++
  }
}))
console.log(JSON.stringify({ checked, reachable: checked - issues.length, requireReview: issues.length }))
if (issues.some((issue) => issue.status === 404 || issue.status === 410 || /account suspended|page not found|404 not found/i.test(issue.title ?? ''))) process.exitCode = 1
