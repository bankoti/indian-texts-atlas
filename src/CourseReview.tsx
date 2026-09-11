import { useEffect, useState } from 'react'
import { courseLessons } from './courseData'
import { courseReviewCases, reviewIsPassed, reviewCaseFromHash, rememberReviewCase, focusCourseReview } from './courseReviewData'

export default function CourseReview({ completedIds, answers, reflection, onAnswer, onReflection, openLesson }: {
  completedIds: string[]
  answers: Record<string, number>
  reflection: string
  onAnswer: (id: string, value: number) => void
  onReflection: (value: string) => void
  openLesson: (id: string) => void
}) {
  const [activeCase, setActiveCase] = useState(() => reviewCaseFromHash(window.location.hash))
  useEffect(() => {
    let frame: number | undefined
    const focus = () => {
      if (window.location.hash.startsWith('#path/review')) {
        if (frame !== undefined) window.cancelAnimationFrame(frame)
        frame = window.requestAnimationFrame(focusCourseReview)
      }
    }
    const restore = () => { setActiveCase(reviewCaseFromHash(window.location.hash)); focus() }
    focus()
    window.addEventListener('hashchange', restore)
    return () => { if (frame !== undefined) window.cancelAnimationFrame(frame); window.removeEventListener('hashchange', restore) }
  }, [])
  const missing = courseLessons.filter((lesson) => !completedIds.includes(lesson.id))
  const passed = reviewIsPassed(answers)
  const correctCount = courseReviewCases.filter((entry) => answers[entry.id] === entry.correct).length
  return <section className="course-review" id="course-review" aria-labelledby="review-title">
    <span className="kicker">FINAL REVIEW · PUT THE MAP BACK TOGETHER</span>
    <h2 id="review-title" tabIndex={-1}>What can you now explain?</h2>
    <p>Try these seven connections without your notes. This is a check of reading and reasoning, not a test of religious belief. You can explore it at any time and return to the linked lessons when needed.</p>
    <div className="review-status" role="status">
      <strong>{passed && missing.length === 0 ? 'Curated course complete' : passed ? 'Final review passed' : `${correctCount} / ${courseReviewCases.length} connections understood`}</strong>
      <span>{missing.length === 0 ? 'All 75 lessons completed, including the four full depth editions.' : `${completedIds.length} / ${courseLessons.length} lessons completed. Finish the remaining lessons as well as this review to complete the course.`}</span>
    </div>
    {missing.length > 0 && <button className="text-button" onClick={() => openLesson(missing[0].id)}>Continue with {missing[0].title} →</button>}
    <div className="review-cases">{courseReviewCases.map((entry, index) => {
      const selected = answers[entry.id]
      const correct = selected === entry.correct
      return <details key={entry.id} className="review-case" open={activeCase === entry.id} onToggle={(event) => {
        if (event.currentTarget.open && activeCase !== entry.id) { rememberReviewCase(entry.id); setActiveCase(entry.id) }
        else if (!event.currentTarget.open && reviewCaseFromHash(window.location.hash) === entry.id) { rememberReviewCase(); setActiveCase(undefined) }
      }}>
        <summary id={`review-case-${entry.id}`}><span>{index + 1}. {entry.title}</span><small>{correct ? 'Understood' : selected === undefined ? 'Try it' : 'Revisit'}</small></summary>
        <p className="quiz-question">{entry.question}</p>
        <div className="quiz-choices">{entry.choices.map((choice, choiceIndex) => <button key={choice} className={`${selected === choiceIndex ? 'chosen' : ''} ${correct && selected === choiceIndex ? 'correct' : ''}`} aria-pressed={selected === choiceIndex} onClick={() => onAnswer(entry.id, choiceIndex)}><i>{String.fromCharCode(65 + choiceIndex)}</i><span>{choice}</span></button>)}</div>
        {selected !== undefined && <div className={`quiz-feedback ${correct ? 'success' : 'try-again'}`} role="status"><strong>{correct ? 'That keeps the connection and the distinction.' : 'Try again with this distinction in mind.'}</strong><p>{entry.explanation}</p></div>}
        <div className="review-links"><strong>Revisit</strong>{entry.lessons.map((id) => <a href={`#lesson/${id}`} key={id} onClick={() => rememberReviewCase(entry.id)}>{courseLessons.find((lesson) => lesson.id === id)?.plainTitle} ↗</a>)}</div>
      </details>
    })}</div>
    <label className="reflection-field"><span>Your final synthesis · private, saved in this browser</span><p>Choose two texts from different paths. Explain one question they share, one real disagreement, and which source or passage supports your comparison. Then name a question you would investigate next.</p><textarea value={reflection} onChange={(event) => onReflection(event.target.value)} rows={7} placeholder="My comparison begins with…" /></label>
    {passed && missing.length === 0 && <div className="lesson-route-note"><strong>You can navigate the landscape.</strong><p>You have completed this curated course of key teachings. Kena, Kaṭha, Īśā, and the twelve root mantras of Māṇḍūkya were studied in full; the other paths introduced representative passages and text clusters. This is a foundation for further reading—not mastery of every Indian text, all 108 Upaniṣads, or Sanskrit as a language. Use your final question to choose what to study more deeply.</p></div>}
  </section>
}
