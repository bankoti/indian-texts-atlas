import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, Compass, ExternalLink } from 'lucide-react'
import type { CourseLesson, LessonDetail } from './courseData'
import type { DepthEditionProgress } from './depthEditionTypes'
import type { MandukyaQuestion } from './mandukyaTypes'
import WordByWordStudy from './WordByWordStudy'
import MandukyaPassageVisual, { MandukyaStateMap, MandukyaOmMap } from './MandukyaVisuals'
import { mandukyaEditorialNote, mandukyaPassages, mandukyaSources } from './mandukyaData'
import { mandukyaFinalSynthesis, mandukyaInterpretiveLenses, mandukyaOrientation, mandukyaSessions } from './mandukyaCourse'
import { completeMandukya, focusMandukyaTarget, mandukyaCompletionState, markMandukyaRead, nextMandukyaWork, parseMandukyaRoute, rememberMandukyaRoute } from './mandukyaLearning'

type Props = {
  lesson: CourseLesson
  detail: LessonDetail
  completed: boolean
  reflection: string
  selectedQuiz?: number
  progress: DepthEditionProgress
  onProgressChange: (progress: DepthEditionProgress) => void
  onReflectionChange: (value: string) => void
  onQuizSelect: (answer: number) => void
  onComplete: () => void
  onClose: () => void
}

export function MandukyaQuestionView({ question, value, onAnswer, label, id, disabled = false }: {
  question: MandukyaQuestion; value?: number; onAnswer: (answer: number) => void; label: string; id: string; disabled?: boolean
}) {
  return <section className="mandukya-question" aria-labelledby={`${id}-title`}>
    <p className="mandukya-kicker">{label}</p><h3 id={`${id}-title`} tabIndex={-1}>{question.question}</h3>
    <div className="mandukya-choices">{question.choices.map((choice, index) => <button type="button" key={choice} aria-pressed={value === index} disabled={disabled} onClick={() => onAnswer(index)}><span aria-hidden="true">{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div>
    {value !== undefined && <p className={`mandukya-feedback ${value === question.correct ? 'correct' : ''}`} role="status"><strong>{value === question.correct ? 'Yes. ' : 'Not quite. '}</strong>{question.explanation}{value !== question.correct && ' Try another answer when you are ready.'}</p>}
  </section>
}

function Practice({ question, id }: { question: MandukyaQuestion; id: string }) {
  const [answer, setAnswer] = useState<number>()
  return <details className="mandukya-disclosure"><summary>Try a quick question · optional</summary><MandukyaQuestionView question={question} value={answer} onAnswer={setAnswer} label="Practice · not required for completion" id={`mandukya-practice-${id}`} /></details>
}

function ReadingGuide() {
  return <details className="mandukya-disclosure"><summary>New to Sanskrit? How to use this reader</summary>
    <p>Start with the English meaning. Then follow the Sanskrit rows from top to bottom. Joined words are separated for learning; English may need a different word order.</p>
    <dl className="mandukya-pronunciation"><div><dt>ā · ī · ū</dt><dd>The bar marks a long vowel. Keep it distinct from a · i · u.</dd></div><div><dt>ṃ · ḥ</dt><dd>Anusvāra marks a nasal sound; visarga a breath-like release. Their realization depends on context and recitation tradition.</dd></div><div><dt>ṭ · ḍ · ṇ · ṣ</dt><dd>The dot distinguishes retroflex sounds from their dental or other counterparts.</dd></div><div><dt>Oṃ · A–U–M</dt><dd>Oṃ is the standard transliteration. Mantras 8–12 analyze it through A, U, and M as a contemplative teaching.</dd></div></dl>
    <p>IAST is a transliteration aid, not an audio lesson. This unaccented study text does not prescribe Vedic pitch or chanting rhythm. “Show grammar notes” adds word forms and explains sound joins called <em>sandhi</em>.</p>
  </details>
}

export default function MandukyaDepthLessonView({ lesson, reflection, selectedQuiz, progress, onProgressChange, onReflectionChange, onQuizSelect, onComplete, onClose }: Props) {
  const [route, setRoute] = useState(() => parseMandukyaRoute(window.location.hash, progress))
  const pendingFocusRef = useRef<string | undefined>(undefined)
  const progressRef = useRef(progress)
  const onProgressRef = useRef(onProgressChange)
  const state = mandukyaCompletionState(progress, selectedQuiz)
  const nextWork = nextMandukyaWork(progress)
  const passage = mandukyaPassages.find((item) => item.id === route.passageId) ?? mandukyaPassages[0]
  const session = mandukyaSessions.find((item) => item.id === passage.sessionId)!
  const lastInSession = session.verses.at(-1) === Number(passage.id)
  const nextPassage = mandukyaPassages[Number(passage.id)]
  const studyMode = progress.studyMode ?? 'full'
  const commentarySource = mandukyaSources.find((source) => source.label.includes(`Mantra ${passage.id},`))

  useEffect(() => { progressRef.current = progress; onProgressRef.current = onProgressChange }, [progress, onProgressChange])
  useEffect(() => {
    const sync = () => {
      const next = parseMandukyaRoute(window.location.hash, progressRef.current)
      if (!next.belongs) return
      if (!next.canonical) window.history.replaceState(window.history.state, '', '#lesson/mandukya')
      const remembered = rememberMandukyaRoute(progressRef.current, next)
      if (remembered !== progressRef.current) onProgressRef.current(remembered)
      setRoute(next)
    }
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync) }
  }, [])
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      focusMandukyaTarget(pendingFocusRef.current ?? 'mandukya-title')
      pendingFocusRef.current = undefined
    })
    return () => window.cancelAnimationFrame(frame)
  }, [route])

  const navigate = (target = '', nextProgress = progress, focusId?: string) => {
    const hash = `#lesson/mandukya${target ? `/${target}` : ''}`
    const next = parseMandukyaRoute(hash, nextProgress)
    if (!next.canonical) return
    pendingFocusRef.current = focusId
    if (window.location.hash !== hash) window.history.pushState(window.history.state, '', hash)
    setRoute(next)
    if (next.mode === 'reader') onProgressChange({ ...nextProgress, lastId: next.passageId })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const openNextWork = () => {
    const unfinishedSession = mandukyaSessions.find((item) => item.verses.includes(Number(nextWork.target)))
    navigate(nextWork.target, progress, nextWork.reason === 'checkpoint' && unfinishedSession ? `mandukya-check-${unfinishedSession.id}-title` : undefined)
  }
  const finishPassage = () => {
    const next = markMandukyaRead(progress, passage.id)
    if (!lastInSession && nextPassage) navigate(nextPassage.id, next)
    else {
      onProgressChange(next)
      window.requestAnimationFrame(() => {
        const target = document.getElementById(`mandukya-check-${session.id}-title`)
        target?.focus({ preventScroll: true })
        target?.scrollIntoView({ behavior: 'instant', block: 'center' })
      })
    }
  }
  const finishCourse = () => {
    if (!state.ready || state.complete) return
    onProgressChange(completeMandukya(progress, selectedQuiz))
    onComplete()
  }

  return <section className="lesson-player mandukya-player">
    <header className="lesson-player-header">
      <button className="back-button" onClick={onClose}><ArrowLeft size={18} />Path</button>
      <div><small>Atharvaveda · complete twelve-mantra reader</small><strong>{lesson.title}</strong></div>
      <span aria-live="polite">{state.complete ? <><CheckCircle2 size={16} /> Complete</> : `${state.readIds.length} / 12 read`}</span>
    </header>
    <nav className="mandukya-nav" aria-label="Māṇḍūkya course">
      <button aria-current={route.mode === 'map' ? 'page' : undefined} onClick={() => navigate()}><Compass size={16} />Course map</button>
      <button aria-current={route.mode === 'reader' ? 'page' : undefined} onClick={() => navigate(route.passageId)}>Read the mantras</button>
      <button aria-current={route.mode === 'review' ? 'page' : undefined} onClick={() => navigate('review')}>Final review</button>
    </nav>

    {route.mode === 'map' && <div className="mandukya-page">
      <header className="mandukya-page-heading"><p className="mandukya-kicker">Twelve mantras · {mandukyaSessions.length} study sessions</p><h1 id="mandukya-title" tabIndex={-1}>What changes—and what is the Self?</h1><p className="mandukya-lead">{mandukyaOrientation.lead}</p><button className="primary-button" onClick={openNextWork}>{state.readIds.length ? nextWork.label : 'Begin with mantra 1'}<ArrowRight size={18} /></button></header>
      <div className="mandukya-orientation"><article><h2>Where this text belongs</h2><p>{mandukyaOrientation.context}</p></article><article><h2>What you will learn</h2><p>{mandukyaOrientation.goal}</p></article></div>
      <MandukyaStateMap />
      <section aria-labelledby="mandukya-session-heading"><h2 id="mandukya-session-heading">A small text. Read it slowly.</h2><p>These sessions are learning aids, not traditional divisions. Read each mantra, explore its meaning and words, then select “Mark read.” The session checks and final review check understanding, not belief.</p>
        <div className="mandukya-session-grid">{mandukyaSessions.map((item) => <article key={item.id}><p className="mandukya-kicker">Session {item.order} · mantras {item.verses.join(', ')}</p><h3>{item.title}</h3><p>{item.summary}</p><p><strong>{item.question}</strong></p><div className="mandukya-passage-links">{item.verses.map((number) => <button key={number} onClick={() => navigate(String(number))} aria-label={`Read mantra ${number}${state.readIds.includes(String(number)) ? ', marked read' : ', not yet marked read'}`}><span>{number}</span>{state.readIds.includes(String(number)) && <CheckCircle2 size={15} aria-hidden="true" />}</button>)}</div><small>{item.verses.filter((number) => state.readIds.includes(String(number))).length} / {item.verses.length} marked read · {progress.checkpointAnswers[item.id] === item.checkpoint.correct ? 'check passed' : 'check pending'}</small></article>)}</div>
      </section>
      <ReadingGuide />
      <aside className="mandukya-boundary"><h2>Keep these boundaries clear</h2><ul>{mandukyaOrientation.guardrails.map((guardrail) => <li key={guardrail}>{guardrail}</li>)}</ul></aside>
      <Sources />
    </div>}

    {route.mode === 'reader' && <article className="mandukya-page" key={passage.id}>
      <header className="mandukya-page-heading"><p className="mandukya-kicker">Session {session.order} · mantra {passage.id} of 12 · {state.readIds.includes(passage.id) ? 'marked read' : 'not yet marked read'}</p><h1 id="mandukya-title" tabIndex={-1}>{passage.title}</h1><p>{session.question}</p></header>
      <div className="mandukya-display-control"><label htmlFor="mandukya-display">Reading view</label><select id="mandukya-display" value={studyMode} onChange={(event) => onProgressChange({ ...progress, studyMode: event.target.value as 'guided' | 'text' | 'full' })}><option value="full">English + Sanskrit + words</option><option value="guided">English explanation first</option><option value="text">Sanskrit text + words</option></select></div>
      <section className="mandukya-translation"><p className="mandukya-kicker">Mantra {passage.id} · original course translation</p><p>{passage.gloss}</p></section>
      {studyMode !== 'text' && <>
        <section className="mandukya-explanation"><h2>In plain English</h2><p className="mandukya-secondary">Learning explanation · principally the Advaita lens. {commentarySource && <a href={commentarySource.url} target="_blank" rel="noreferrer">Read the relevant Śaṅkara commentary</a>}</p>{passage.explanation.split('\n\n').map((part) => <p key={part}>{part}</p>)}</section>
        <MandukyaPassageVisual id={passage.id} />
        <details className="mandukya-disclosure"><summary>Key terms in this mantra</summary><dl className="mandukya-key-terms">{passage.terms.map((term) => <div key={term.term}><dt>{term.term}</dt><dd>{term.meaning}</dd></div>)}</dl></details>
        <details className="mandukya-disclosure"><summary>{passage.example.title} · a learning example</summary><p>{passage.example.scenario}</p><p>{passage.example.explanation}</p><small>Modern illustration—not a quotation or proof of the text’s metaphysical claims.</small></details>
        <Practice key={passage.id} question={passage.practice} id={passage.id} />
      </>}
      <section className="mandukya-sanskrit" aria-labelledby="mandukya-sanskrit-title"><h2 id="mandukya-sanskrit-title">The Sanskrit behind the meaning</h2><p className="mandukya-deva" lang="sa-Deva">{passage.devanagari}</p><p className="mandukya-iast" lang="sa-Latn">{passage.iast}</p><small>Normalized, unaccented study text · <a href={mandukyaSources[0].url} target="_blank" rel="noreferrer">Compare with the source <ExternalLink size={13} /></a></small></section>
      {studyMode === 'guided' ? <details className="mandukya-disclosure"><summary>Explore every Sanskrit word and its meaning</summary><WordByWordStudy passageId={`mandukya-${passage.id}`} words={passage.words} beginner /></details> : <WordByWordStudy passageId={`mandukya-${passage.id}`} words={passage.words} beginner />}
      <ReadingGuide />
      {passage.textNote && <details className="mandukya-disclosure"><summary>Wording and interpretation notes</summary><p>{passage.textNote}</p></details>}
      <aside className="mandukya-reflect"><strong>Pause before moving on</strong><p>{passage.reflectionPrompt}</p><small>No need to adopt the text’s answer. First try to explain its question accurately.</small></aside>
      <div className="mandukya-reader-actions"><button className="quiet-button" disabled={passage.id === '1'} onClick={() => navigate(String(Number(passage.id) - 1))}><ChevronLeft size={16} />Previous</button><button className="primary-button" onClick={finishPassage}>{lastInSession ? 'Mark read · go to session check' : `Mark read · continue to ${Number(passage.id) + 1}`}<ArrowRight size={17} /></button></div>
      {lastInSession && <section className="mandukya-session-end"><h2>Pause at the end of session {session.order}</h2><p>{session.recall}</p><MandukyaQuestionView question={session.checkpoint} value={progress.checkpointAnswers[session.id]} onAnswer={(answer) => onProgressChange({ ...progress, checkpointAnswers: { ...progress.checkpointAnswers, [session.id]: answer } })} label="Session understanding check" id={`mandukya-check-${session.id}`} disabled={state.complete} />
        <button className="primary-button" onClick={() => navigate(nextPassage?.id ?? 'review')}>{nextPassage ? `Browse next session · mantra ${nextPassage.id}` : 'Open final review'}<ArrowRight size={17} /></button><p className="mandukya-secondary">Browsing does not mark unread mantras as read. You can return to any unfinished reading from the final review.</p>
      </section>}
    </article>}

    {route.mode === 'review' && <div className="mandukya-page">
      <header className="mandukya-page-heading"><p className="mandukya-kicker">Māṇḍūkya · final review</p><h1 id="mandukya-title" tabIndex={-1}>Connect the whole argument.</h1><p className="mandukya-lead">{mandukyaFinalSynthesis.statement}</p></header>
      <MandukyaOmMap />
      <section className="mandukya-review-progress" aria-label="Completion requirements"><h2>{state.complete ? 'Māṇḍūkya course complete' : 'Your remaining work'}</h2><p>{state.readIds.length} / 12 mantras marked read · {state.checkpoints} / {mandukyaSessions.length} session checks correct · {selectedQuiz === mandukyaFinalSynthesis.correct ? 'final check correct' : 'final check pending'}</p>{state.complete ? <p>You have completed all reading and checks. Revisit any mantra, keep refining your reflection, or return to the full learning path.</p> : state.readIds.length !== 12 || state.checkpoints !== mandukyaSessions.length ? <button className="primary-button" onClick={openNextWork}>{nextWork.label}<ArrowRight size={17} /></button> : <p>All reading and session checks are ready. Answer the final check below, then mark the course complete.</p>}</section>
      <MandukyaQuestionView question={mandukyaFinalSynthesis} value={selectedQuiz} onAnswer={onQuizSelect} label="Final understanding check" id="mandukya-final" disabled={state.complete} />
      <section className="mandukya-notes"><label htmlFor="mandukya-reflection">Your private reflection · optional</label><p>{mandukyaFinalSynthesis.reflectionPrompt}</p><textarea id="mandukya-reflection" value={reflection} onChange={(event) => onReflectionChange(event.target.value)} placeholder="Explain the teaching in your own words…" /><small>Saved in this browser on this device, alongside your existing course notes.</small></section>
      <button className="primary-button" disabled={!state.ready || state.complete} onClick={finishCourse}>{state.complete ? 'Course complete' : 'Mark Māṇḍūkya complete'}<CheckCircle2 size={17} /></button>
      <section><h2>Return to this question tomorrow</h2><p>{mandukyaFinalSynthesis.retrievalPrompt}</p><h2>Compare without collapsing the texts</h2><div className="mandukya-connections"><a href="#lesson/kena">Kena: what makes knowing possible?<ArrowRight size={16} /></a><a href="#lesson/katha">Katha: the Self and disciplined attention<ArrowRight size={16} /></a><a href="#lesson/isha">Isha: unity alongside action and difference<ArrowRight size={16} /></a><a href="#lesson/vedanta-schools">How later Vedānta schools interpret texts<ArrowRight size={16} /></a></div></section>
      <section><h2>The root text and its readers</h2>{mandukyaInterpretiveLenses.map((lens) => <article key={lens.name}><h3>{lens.name}</h3><p>{lens.description}</p></article>)}</section>
      <Sources /><button className="quiet-button" onClick={onClose}><ArrowLeft size={17} />Return to the full learning path</button>
    </div>}
  </section>
}

function Sources() {
  return <details className="mandukya-disclosure mandukya-sources"><summary>Sources and editorial approach</summary><p>{mandukyaEditorialNote}</p>{mandukyaSources.map((source) => <div key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={14} /></a><p>{source.use}</p></div>)}</details>
}
