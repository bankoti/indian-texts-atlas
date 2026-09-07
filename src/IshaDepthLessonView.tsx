import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import {
  ArrowLeft,
  BookOpenText,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Eye,
  Lightbulb,
  ListTree,
  MoveRight,
  Sparkles,
} from 'lucide-react'
import type { CourseLesson, LessonDetail } from './courseData'
import type { DepthEditionProgress } from './depthEditionTypes'
import WordByWordStudy from './WordByWordStudy'
import {
  getIshaPassagesForSection,
  getIshaPassagesForSession,
  getIshaSection,
  getIshaSession,
  ishaEditorialNote,
  ishaFinalSynthesis,
  ishaInvocation,
  ishaInterpretiveLenses,
  ishaPassages,
  ishaSections,
  ishaSessions,
  ishaSources,
  type IshaPassage,
  type IshaSection,
} from './ishaData'

type IshaMode = 'map' | 'reader' | 'sessions' | 'review'
type StudyMode = 'guided' | 'text' | 'full'

type IshaDepthLessonViewProps = {
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

const validPassageIds = new Set(ishaPassages.map((passage) => passage.id))
const ishaWikisource = 'https://sa.wikisource.org/wiki/ईशोपनिषत्'

function initialRoute(progress: DepthEditionProgress): { mode: IshaMode; passageId: string; canonical: boolean; belongsToIsha: boolean } {
  const hash = window.location.hash
  const fallback = progress.lastId && validPassageIds.has(progress.lastId) ? progress.lastId : '1'
  if (hash === '#lesson/isha') return { mode: 'map', passageId: fallback, canonical: true, belongsToIsha: true }
  if (!hash.startsWith('#lesson/isha/')) return { mode: 'map', passageId: fallback, canonical: false, belongsToIsha: false }
  const match = hash.match(/^#lesson\/isha\/([^/]+)$/)
  const segment = match?.[1]
  if (segment === 'review') return { mode: 'review', passageId: fallback, canonical: true, belongsToIsha: true }
  if (segment === 'sessions') return { mode: 'sessions', passageId: fallback, canonical: true, belongsToIsha: true }
  if (segment && validPassageIds.has(segment)) return { mode: 'reader', passageId: segment, canonical: true, belongsToIsha: true }
  return { mode: 'map', passageId: fallback, canonical: false, belongsToIsha: true }
}

function replaceIshaHash(segment?: string) {
  const nextHash = segment ? `#lesson/isha/${segment}` : '#lesson/isha'
  if (window.location.hash !== nextHash) window.history.replaceState(window.history.state, '', nextHash)
}

function pushIshaHash(segment?: string) {
  const nextHash = segment ? `#lesson/isha/${segment}` : '#lesson/isha'
  if (window.location.hash !== nextHash) window.history.pushState(window.history.state, '', nextHash)
}

function motionSafeBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: motionSafeBehavior() })
}

export default function IshaDepthLessonView({
  lesson,
  detail,
  completed,
  reflection,
  selectedQuiz,
  progress,
  onProgressChange,
  onReflectionChange,
  onQuizSelect,
  onComplete,
  onClose,
}: IshaDepthLessonViewProps) {
  const [route] = useState(() => initialRoute(progress))
  const [mode, setMode] = useState<IshaMode>(route.mode)
  const [activePassageId, setActivePassageId] = useState(route.passageId)
  const readerHeadingRef = useRef<HTMLHeadingElement>(null)
  const progressRef = useRef(progress)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  const readIds = [...new Set(progress.readIds.filter((id) => validPassageIds.has(id)))]
  const readSet = new Set(readIds)
  const readCount = readSet.size
  const progressPercent = Math.round((readCount / ishaPassages.length) * 100)
  const activeIndex = Math.max(0, ishaPassages.findIndex((passage) => passage.id === activePassageId))
  const activePassage = ishaPassages[activeIndex]
  const activeSection = getIshaSection(activePassage.sectionId) ?? ishaSections[0]
  const activeSession = getIshaSession(activePassage.sessionId) ?? ishaSessions[0]
  const sectionPassages = getIshaPassagesForSection(activePassage.sectionId)
  const sessionPassages = getIshaPassagesForSession(activePassage.sessionId)
  const isLastInSection = sectionPassages.at(-1)?.id === activePassage.id
  const isLastInSession = sessionPassages.at(-1)?.id === activePassage.id
  const previousPassage = ishaPassages[activeIndex - 1]
  const nextPassage = ishaPassages[activeIndex + 1]
  const checkpointCorrectCount = ishaSections.filter((section) => progress.checkpointAnswers[section.id] === section.checkpoint.correct).length
  const finalQuizCorrect = selectedQuiz === detail.quiz.correct
  const depthReady = readCount === ishaPassages.length && checkpointCorrectCount === ishaSections.length && finalQuizCorrect
  const editionCompleted = progress.completed === true
  const studyMode: StudyMode = progress.studyMode === 'guided' || progress.studyMode === 'text' ? progress.studyMode : 'full'
  const firstUnreadId = ishaPassages.find((passage) => !readSet.has(passage.id))?.id

  useEffect(() => {
    if (mode !== 'reader') return
    const frame = window.requestAnimationFrame(() => readerHeadingRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [activePassageId, mode])

  useEffect(() => {
    if (mode === 'reader') return
    const frame = window.requestAnimationFrame(() => document.getElementById(`isha-${mode}-title`)?.focus({ preventScroll: true }))
    return () => window.cancelAnimationFrame(frame)
  }, [mode])

  useEffect(() => {
    const syncRoute = () => {
      const next = initialRoute(progressRef.current)
      if (!next.belongsToIsha) return
      if (!next.canonical) replaceIshaHash()
      setMode(next.mode)
      setActivePassageId(next.passageId)
    }
    syncRoute()
    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    return () => {
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [])

  const showMap = () => {
    setMode('map')
    pushIshaHash()
    scrollToTop()
  }

  const showSessions = () => {
    setMode('sessions')
    pushIshaHash('sessions')
    scrollToTop()
  }

  const showReview = () => {
    setMode('review')
    pushIshaHash('review')
    scrollToTop()
  }

  const openPassage = (id: string, nextProgress: DepthEditionProgress = progress) => {
    if (!validPassageIds.has(id)) return
    setActivePassageId(id)
    setMode('reader')
    pushIshaHash(id)
    onProgressChange({ ...nextProgress, lastId: id })
    scrollToTop()
  }

  const openSection = (section: IshaSection) => {
    const passages = getIshaPassagesForSection(section.id)
    const target = passages.find((passage) => !readSet.has(passage.id)) ?? passages[0]
    openPassage(target.id)
  }

  const updateStudyMode = (nextMode: StudyMode) => {
    onProgressChange({ ...progress, studyMode: nextMode })
  }

  const scrollToSessionPause = () => {
    window.requestAnimationFrame(() => {
      const target = document.getElementById(`isha-session-title-${activeSession.id}`)
      target?.focus({ preventScroll: true })
      target?.scrollIntoView({ behavior: motionSafeBehavior(), block: 'start' })
    })
  }

  const scrollToCheckpoint = () => {
    window.requestAnimationFrame(() => {
      const target = document.getElementById(`isha-checkpoint-title-${activeSection.id}`)
      target?.focus({ preventScroll: true })
      target?.scrollIntoView({ behavior: motionSafeBehavior(), block: 'start' })
    })
  }

  const markReadAndContinue = () => {
    const nextReadIds = readSet.has(activePassage.id) ? readIds : [...readIds, activePassage.id]
    if (nextPassage && !isLastInSession) {
      const nextProgress = { ...progress, readIds: nextReadIds, lastId: nextPassage.id }
      setActivePassageId(nextPassage.id)
      replaceIshaHash(nextPassage.id)
      onProgressChange(nextProgress)
      scrollToTop()
      return
    }
    onProgressChange({ ...progress, readIds: nextReadIds, lastId: activePassage.id })
    scrollToSessionPause()
  }

  const updateCheckpoint = (sectionId: string, answer: number) => {
    if (editionCompleted) return
    onProgressChange({
      ...progress,
      checkpointAnswers: { ...progress.checkpointAnswers, [sectionId]: answer },
    })
  }

  const completeDepthEdition = () => {
    if (!depthReady || editionCompleted) return
    onProgressChange({ ...progress, readIds, completed: true })
    onComplete()
  }

  return (
    <section className="lesson-player kena-player isha-player">
      <header className="lesson-player-header kena-player-header isha-player-header">
        <button className="back-button" onClick={onClose}><ArrowLeft size={17} /> Path</button>
        <div><small>Śukla Yajurveda · Kāṇva recension · depth edition</small><strong>{lesson.title}</strong></div>
        <span aria-live="polite">{editionCompleted ? <><CheckCircle2 size={15} /> Complete</> : `${readCount} / 18 read`}</span>
      </header>

      <nav className="kena-rail isha-rail" aria-label="Īśā Upaniṣad course movements">
        <button className={mode === 'map' ? 'active' : ''} aria-current={mode === 'map' ? 'page' : undefined} onClick={showMap}><Compass size={16} /><span>Map</span></button>
        {ishaSections.map((section) => {
          const sectionRead = getIshaPassagesForSection(section.id).filter((passage) => readSet.has(passage.id)).length
          const sectionTotal = getIshaPassagesForSection(section.id).length
          const isActive = mode === 'reader' && activePassage.sectionId === section.id
          return (
            <button key={section.id} className={isActive ? 'active' : ''} aria-label={`${section.label}: ${section.title}, ${sectionRead} of ${sectionTotal} read`} aria-current={isActive ? 'step' : undefined} onClick={() => openSection(section)}>
              <i>{sectionRead === sectionTotal ? <Check size={12} /> : section.id}</i>
              <span><b>{section.label.replace('MOVEMENT ', 'M')}</b><small>{sectionRead}/{sectionTotal}</small></span>
            </button>
          )
        })}
        <button className={mode === 'sessions' ? 'active' : ''} aria-current={mode === 'sessions' ? 'page' : undefined} onClick={showSessions}><ListTree size={16} /><span>Sessions</span></button>
        <button className={mode === 'review' ? 'active' : ''} aria-current={mode === 'review' ? 'page' : undefined} onClick={showReview}><CheckCircle2 size={16} /><span>Review</span></button>
      </nav>

      <nav className="isha-mobile-nav" aria-label="Īśā reader destinations">
        <button className={mode === 'map' ? 'active' : ''} aria-current={mode === 'map' ? 'page' : undefined} onClick={showMap}><Compass size={17} /><span>Map</span></button>
        <button className={mode === 'reader' ? 'active' : ''} aria-label={`Reader · ${activeSection.title} · ${activePassage.id}`} aria-current={mode === 'reader' ? 'page' : undefined} onClick={() => openPassage(activePassage.id)}><BookOpenText size={17} /><span>{activeSection.label}</span></button>
        <button className={mode === 'sessions' ? 'active' : ''} aria-current={mode === 'sessions' ? 'page' : undefined} onClick={showSessions}><ListTree size={17} /><span>Sessions</span></button>
        <button className={mode === 'review' ? 'active' : ''} aria-current={mode === 'review' ? 'page' : undefined} onClick={showReview}><CheckCircle2 size={17} /><span>Review</span></button>
      </nav>

      {mode === 'map' && <IshaMap readSet={readSet} progressPercent={progressPercent} lastPassageId={progress.lastId} onOpenPassage={openPassage} onOpenSection={openSection} onShowSessions={showSessions} />}
      {mode === 'sessions' && <IshaSessionsPage readSet={readSet} onOpenSection={openSection} onOpenPassage={openPassage} />}

      {mode === 'reader' && (
        <div className="kena-reader isha-reader">
          <div className="kena-reader-tools isha-reader-tools">
            <div><span>{activeSection.label} · Session {activeSession.order} of 6 · mantras {activeSession.verses[0]}–{activeSession.verses.at(-1)}</span><strong>{activeSession.title}</strong></div>
            <label>
              <span>Jump to a mantra</span>
              <select value={activePassage.id} onChange={(event) => openPassage(event.target.value)}>
                {ishaSections.map((section) => (
                  <optgroup key={section.id} label={`${section.label} · ${section.title}`}>
                    {getIshaPassagesForSection(section.id).map((passage) => <option value={passage.id} key={passage.id}>{readSet.has(passage.id) ? '✓ ' : ''}{passage.id} · {passage.title}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>

          <div className="isha-study-mode" role="group" aria-label="Reading layer">
            <span>Reading layer</span>
            <div>{(['guided', 'text', 'full'] as StudyMode[]).map((item) => <button key={item} className={studyMode === item ? 'active' : ''} aria-label={item === 'guided' ? 'Guided: Sanskrit and course meaning' : item === 'text' ? 'IAST: add transliteration' : 'Word by word: add literal meanings, grammar, and sandhi'} aria-pressed={studyMode === item} onClick={() => updateStudyMode(item)}>{item === 'guided' ? 'Guided' : item === 'text' ? '+ IAST' : 'Word by word'}</button>)}</div>
          </div>

          <div className="kena-reader-layout">
            <article className="kena-passage-card isha-passage-card">
              <header>
                <div><span>Īśā mantra {activePassage.id}</span><small>{activePassage.kind}</small></div>
                {readSet.has(activePassage.id) && <span className="kena-read-badge"><Check size={13} /> Read</span>}
                <h1 ref={readerHeadingRef} tabIndex={-1}>{activePassage.title}</h1>
              </header>

              <section className="kena-text-layer devanagari-layer" aria-labelledby={`isha-devanagari-${activePassage.id}`}>
                <div><span>मूल</span><h2 id={`isha-devanagari-${activePassage.id}`}>Sanskrit</h2></div>
                <p lang="sa-Deva">{activePassage.devanagari}</p>
              </section>

              {studyMode !== 'guided' && (
                <section className="kena-text-layer iast-layer" aria-labelledby={`isha-iast-${activePassage.id}`}>
                  <div><span>IAST</span><h2 id={`isha-iast-${activePassage.id}`}>Transliteration</h2></div>
                  <p lang="sa-Latn">{activePassage.iast}</p>
                </section>
              )}

              {studyMode === 'full' && <WordByWordStudy passageId={`isha-${activePassage.id}`} words={activePassage.words} />}

              <section className="kena-explanation" aria-labelledby={`isha-meaning-${activePassage.id}`}>
                <span className="kena-section-label">COURSE PARAPHRASE</span>
                <p className="kena-gloss" id={`isha-meaning-${activePassage.id}`}>{activePassage.gloss}</p>
                <div className="kena-plain-note"><Lightbulb size={18} /><div><strong>What to notice</strong><p>{activePassage.explanation}</p></div></div>
              </section>

              <IshaDiagram passage={activePassage} />

              {studyMode === 'full' && (
                <details className="kena-vocabulary">
                  <summary>Key words <span>{activePassage.terms.length} terms</span></summary>
                  <dl>{activePassage.terms.map((term) => <div key={`${activePassage.id}-${term.term}`}><dt lang="sa-Latn">{term.term}</dt><dd>{term.meaning}</dd></div>)}</dl>
                </details>
              )}

              {activePassage.textNote && (
                <details className="kena-text-note">
                  <summary>Edition / interpretation note</summary>
                  <p>{activePassage.textNote}</p>
                </details>
              )}
            </article>

            <aside className="kena-section-sidebar">
              <span>WHERE ARE WE?</span>
              <h2>{activeSession.title}</h2>
              <p>{activeSection.summary}</p>
              <div className="isha-breadcrumb"><small>{activePassage.id}</small><strong>{activeSession.recall}</strong></div>
              <div className="kena-section-mini-progress">
                <i><b style={{ width: `${(sectionPassages.filter((passage) => readSet.has(passage.id)).length / sectionPassages.length) * 100}%` }} /></i>
                <span>{sectionPassages.filter((passage) => readSet.has(passage.id)).length} of {sectionPassages.length} in this movement</span>
              </div>
              <small>Study note</small>
              <p>Īśā is one compact sequence of 18 mantras. The three “movements” and six sessions are learning aids, not divisions in the transmitted text.</p>
              <div className="kena-reader-attribution">
                <small>Text source & license</small>
                <a href={ishaWikisource} target="_blank" rel="noreferrer">Kāṇva text on Sanskrit Wikisource <ExternalLink size={13} /></a>
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0 <ExternalLink size={13} /></a>
              </div>
            </aside>
          </div>

          {isLastInSession && (
            <div className="isha-session-pause" id={`isha-session-${activeSession.id}`}>
              <div><span>SESSION {activeSession.order} · SAY IT WITHOUT LOOKING</span><h2 id={`isha-session-title-${activeSession.id}`} tabIndex={-1}>{activeSession.recall}</h2><p>Next question: {activeSession.nextQuestion}</p></div>
              {isLastInSection && <CheckpointCard section={activeSection} selected={progress.checkpointAnswers[activeSection.id]} onSelect={(answer) => updateCheckpoint(activeSection.id, answer)} locked={editionCompleted} />}
              {nextPassage ? <button className="primary-button" onClick={() => openPassage(nextPassage.id)}>Begin session {getIshaSession(nextPassage.sessionId)?.order} <ChevronRight size={17} /></button> : <button className="primary-button" onClick={showReview}>Open final review <ChevronRight size={17} /></button>}
            </div>
          )}

          <footer className="kena-reader-controls">
            <button onClick={() => previousPassage && openPassage(previousPassage.id)} disabled={!previousPassage}><ChevronLeft size={18} /><span>Previous</span></button>
            <button className="kena-read-continue" onClick={markReadAndContinue}>
              {readSet.has(activePassage.id) ? <Check size={17} /> : <BookOpenText size={17} />}
              <span>{isLastInSession ? (readSet.has(activePassage.id) ? 'Session pause' : 'Read & pause') : (readSet.has(activePassage.id) ? 'Continue' : 'Read & continue')}</span>
            </button>
            {isLastInSession
              ? <button onClick={isLastInSection ? scrollToCheckpoint : scrollToSessionPause}><span>{isLastInSection ? 'Checkpoint' : 'Pause'}</span><ChevronRight size={18} /></button>
              : <button onClick={() => nextPassage && openPassage(nextPassage.id)} disabled={!nextPassage}><span>Next</span><ChevronRight size={18} /></button>}
          </footer>
        </div>
      )}

      {mode === 'review' && (
        <IshaReview
          detail={detail}
          overviewCompleted={completed}
          editionCompleted={editionCompleted}
          depthReady={depthReady}
          readCount={readCount}
          checkpointCorrectCount={checkpointCorrectCount}
          firstUnreadId={firstUnreadId}
          reflection={reflection}
          selectedQuiz={selectedQuiz}
          checkpointAnswers={progress.checkpointAnswers}
          onCheckpointSelect={updateCheckpoint}
          onReflectionChange={onReflectionChange}
          onQuizSelect={onQuizSelect}
          onComplete={completeDepthEdition}
          onOpenPassage={openPassage}
        />
      )}
    </section>
  )
}

function IshaMap({ readSet, progressPercent, lastPassageId, onOpenPassage, onOpenSection, onShowSessions }: {
  readSet: Set<string>
  progressPercent: number
  lastPassageId?: string
  onOpenPassage: (id: string) => void
  onOpenSection: (section: IshaSection) => void
  onShowSessions: () => void
}) {
  const resumeId = lastPassageId && validPassageIds.has(lastPassageId) ? lastPassageId : '1'
  return (
    <div className="kena-map-page isha-map-page">
      <section className="kena-map-hero isha-map-hero">
        <div><span className="kicker">ĪŚĀ UPANIṢAD · COMPLETE KĀṆVA READER</span><h1 id="isha-map-title" tabIndex={-1}>Can freedom and action belong together?</h1><p>Eighteen compact mantras begin with a world that cannot be owned, move through action and transformed seeing, preserve two difficult pairs, and end by asking for truth, memory, and a good path.</p><div className="kena-map-actions"><button className="primary-button" onClick={() => onOpenPassage(resumeId)}>{readSet.size ? `Resume mantra ${resumeId}` : 'Begin with mantra 1'} <ChevronRight size={17} /></button><button className="quiet-button" onClick={onShowSessions}>Preview six sessions</button><span>18 mantras · 6 sessions · about 90 minutes · word-by-word Sanskrit</span></div></div>
        <div className="kena-progress-orbit" style={{ background: `conic-gradient(var(--saffron) ${progressPercent * 3.6}deg, rgba(255,255,255,.34) 0deg)` }} role="progressbar" aria-label="Īśā depth edition reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}><div><strong>{progressPercent}%</strong><span>{readSet.size} / 18 read</span></div></div>
      </section>

      <section className="isha-movement-map" aria-labelledby="isha-movement-title">
        <div><span className="kicker">THE WHOLE POEM IN THREE MOVEMENTS</span><h2 id="isha-movement-title">A posture becomes a way of seeing, then a prayer.</h2><p>These movements are study aids, not divisions in the transmitted Upaniṣad.</p></div>
        <ol role="list">{ishaSections.map((section) => <li key={section.id}><button aria-label={`Open ${section.label}: ${section.title}, mantras ${section.verses[0]} to ${section.verses.at(-1)}`} onClick={() => onOpenSection(section)}><small>{section.label} · {section.verses[0]}–{section.verses.at(-1)}</small><strong>{section.title}</strong><span>{section.question}</span><em>Open first unread mantra <ChevronRight size={15} /></em></button></li>)}</ol>
      </section>

      <figure className="kena-story-illustration isha-story-illustration">
        <img src="./isha-golden-disc.jpg" alt="A vast golden circular veil opens to reveal a quieter light while a small human figure stands below" loading="lazy" decoding="async" />
        <figcaption><span>THE GOLDEN COVER · MANTRA 15</span><strong>Radiance can reveal—and conceal.</strong><p>The closing speaker asks that a brilliant covering be drawn aside so truth may be seen. This original teaching illustration is symbolic, not a historical reconstruction.</p></figcaption>
      </figure>

      <section className="isha-section-cards" aria-labelledby="isha-structure-title">
        <div className="isha-section-cards-heading"><span className="kicker">YOUR THREE ANCHORS</span><h2 id="isha-structure-title">Keep the structure visible while the terms grow difficult.</h2></div>
        {ishaSections.map((section) => { const passages = getIshaPassagesForSection(section.id); const complete = passages.filter((passage) => readSet.has(passage.id)).length; return <article key={section.id}><button aria-label={`Open ${section.label}: ${section.title}, ${complete} of ${passages.length} mantras read`} onClick={() => onOpenSection(section)}><span>{section.label}</span><h3>{section.title}</h3><p>{section.summary}</p><small>{section.form}</small><i aria-hidden="true"><b style={{ width: `${(complete / passages.length) * 100}%` }} /></i><em>{complete}/{passages.length} read</em></button></article> })}
      </section>

      <section className="kena-origin-grid">
        <article><span>TEXTUAL ADDRESS</span><h2>Śukla Yajurveda → Vājasaneyi Saṃhitā 40 → Īśā Upaniṣad</h2><p>This reader follows the 18-mantra Kāṇva recension. The Mādhyaṃdina recension has 17 units and a different order after the opening sequence.</p></article>
        <article><span>HOW TO READ THIS EDITION</span><h2>Text, paraphrase, and interpretation remain separate.</h2><p>{ishaEditorialNote}</p></article>
      </section>

      <details className="kena-invocation"><summary><Sparkles size={17} /> Begin with the peace invocation <span>not counted among the 18 mantras</span></summary><div><p lang="sa-Deva">{ishaInvocation.devanagari}</p><p lang="sa-Latn">{ishaInvocation.iast}</p><small>{ishaInvocation.note}</small><WordByWordStudy invocation passageId="isha-invocation" words={ishaInvocation.words} /></div></details>
    </div>
  )
}

function IshaSessionsPage({ readSet, onOpenSection, onOpenPassage }: { readSet: Set<string>; onOpenSection: (section: IshaSection) => void; onOpenPassage: (id: string) => void }) {
  return <div className="katha-sections-page isha-sessions-page"><header><span className="kicker">THREE MOVEMENTS · SIX SESSIONS</span><h1 id="isha-sessions-title" tabIndex={-1}>Read slowly enough to retrieve the argument.</h1><p>Each session ends with an unscored recall pause. Each movement ends with one checkpoint; all three checkpoints count toward the final review.</p></header><div>{ishaSections.map((section) => { const passages = getIshaPassagesForSection(section.id); const complete = passages.filter((passage) => readSet.has(passage.id)).length; return <article key={section.id}><button aria-label={`Open ${section.label}: ${section.title}, ${complete} of ${passages.length} mantras read`} onClick={() => onOpenSection(section)}><span>{section.label}</span><div><small>MANTRAS {section.verses[0]}–{section.verses.at(-1)}</small><h2>{section.title}</h2><p>{section.question}</p><i aria-hidden="true"><b style={{ width: `${(complete / passages.length) * 100}%` }} /></i><em>{complete} / {passages.length} read</em></div><ChevronRight /></button><ol role="list">{ishaSessions.filter((session) => session.movementId === section.id).map((session) => { const sessionPassages = getIshaPassagesForSession(session.id); const target = sessionPassages.find((passage) => !readSet.has(passage.id)) ?? sessionPassages[0]; const sessionRead = sessionPassages.filter((passage) => readSet.has(passage.id)).length; return <li key={session.id}><button onClick={() => onOpenPassage(target.id)} aria-label={`Session ${session.order}: ${session.title}, ${sessionRead} of ${sessionPassages.length} read. Open mantra ${target.id}.`}><span>{session.order}</span><div><strong>{session.title}</strong><small>Mantras {session.verses[0]}–{session.verses.at(-1)} · {sessionRead}/{sessionPassages.length} read</small></div><ChevronRight size={16} /></button></li> })}</ol></article> })}</div></div>
}

function IshaDiagram({ passage }: { passage: IshaPassage }) {
  if (passage.id === '1' || passage.id === '2') return <figure className="kena-concept-figure isha-cycle-figure"><figcaption><span>USE WITHOUT ABSOLUTE OWNERSHIP</span><strong>A practice loop, not an escape from life.</strong></figcaption><ol role="list"><li><span>1</span><strong>Receive</strong><small>what is relinquished</small></li><li><span>2</span><strong>Use</strong><small>what sustains life</small></li><li><span>3</span><strong>Act</strong><small>through the full lifespan</small></li><li><span>4</span><strong>Release</strong><small>“this is absolutely mine”</small></li></ol><p>“Enjoy,” “protect,” and “use” are all argued for in mantra 1. The course keeps that ambiguity visible.</p></figure>
  if (passage.id === '4' || passage.id === '5') return <figure className="kena-concept-figure isha-paradox-figure"><figcaption><span>NOT A CHOICE BETWEEN OPPOSITES</span><strong>The mantra asserts both sides.</strong></figcaption><div><span>unmoving <b>and</b> swifter than mind</span><span>standing <b>and</b> outstripping runners</span><span>far <b>and</b> near</span><span>within all <b>and</b> outside all</span></div><p>The pairs loosen the habit of treating the One as an ordinary object with one fixed location or speed.</p></figure>
  if (passage.id === '6' || passage.id === '7') return <figure className="kena-concept-figure isha-mutual-figure"><figcaption><span>MUTUAL SEEING</span><strong>Vision changes response.</strong></figcaption><ol role="list"><li><Eye aria-hidden="true" /><span>all beings in the Self</span></li><li><MoveRight aria-hidden="true" /><span>the Self in all beings</span></li><li><MoveRight aria-hidden="true" /><span>less recoil</span></li><li><MoveRight aria-hidden="true" /><span>what delusion, what sorrow?</span></li></ol><p>This is a relational claim. It does not pretend that empirical differences or suffering simply disappear.</p></figure>
  if (['9', '10', '11', '12', '13', '14'].includes(passage.id)) return <figure className="kena-concept-figure isha-triads-figure"><figcaption><span>THE PATTERN IS CLEAR; THE LABELS ARE DEBATED</span><strong>Two parallel triads.</strong></figcaption><div className="isha-triad-tables"><table><caption>Vidyā / avidyā · 9–11</caption><tbody><tr><th scope="row">9</th><td>exclusive A and exclusive B are warned against</td></tr><tr><th scope="row">10</th><td>the two are said to have different results</td></tr><tr><th scope="row">11</th><td>know both together; each has a different function</td></tr></tbody></table><table><caption>Origination vocabulary · 12–14</caption><tbody><tr><th scope="row">12</th><td>exclusive A and exclusive B are warned against</td></tr><tr><th scope="row">13</th><td>the two are said to have different results</td></tr><tr><th scope="row">14</th><td>know both together; each has a different function</td></tr></tbody></table></div><p>Śaṅkara, theistic Vedānta, and philological readings identify the poles differently. Read the structure before choosing a lens.</p></figure>
  if (passage.id === '15' || passage.id === '16') return <figure className="kena-concept-figure isha-golden-figure"><img src="./isha-golden-disc.jpg" alt="A golden circular veil opens toward a quiet central light" loading="lazy" decoding="async" /><figcaption><span>RADIANCE CAN CONCEAL</span><strong>Uncover → gather the rays → let me see.</strong><p>The solar imagery turns philosophy into petition: even brilliance may need to be drawn aside for disclosure.</p></figcaption></figure>
  if (passage.id === '17' || passage.id === '18') return <figure className="kena-concept-figure isha-verbs-figure"><figcaption><span>WHAT THE CLOSING SPEAKER ASKS</span><strong>Insight remains dependent on memory and guidance.</strong></figcaption><ol role="list"><li><span>15</span><strong>UNCOVER</strong></li><li><span>16</span><strong>GATHER & SEE</strong></li><li><span>17</span><strong>REMEMBER</strong></li><li><span>18</span><strong>LEAD US & REMOVE</strong></li></ol><p>The final pronoun is plural: the poem closes with “lead us,” not a private claim of arrival.</p></figure>
  return null
}

function moveRadioChoice(event: ReactKeyboardEvent<HTMLButtonElement>, index: number, count: number, onSelect: (answer: number) => void) {
  const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
  const destination = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : direction ? (index + direction + count) % count : null
  if (destination === null) return
  event.preventDefault()
  onSelect(destination)
  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[destination]?.focus()
}

function CheckpointCard({ section, selected, onSelect, locked = false }: { section: IshaSection; selected?: number; onSelect: (answer: number) => void; locked?: boolean }) {
  const correct = selected === section.checkpoint.correct
  return <section className="kena-checkpoint-card" id={`isha-checkpoint-${section.id}`} aria-labelledby={`isha-checkpoint-title-${section.id}`}><div><span>{section.label} · CHECKPOINT</span><h2 id={`isha-checkpoint-title-${section.id}`} tabIndex={-1}>{section.recap}</h2></div><p>{section.checkpoint.question}</p><div className="quiz-choices" role="radiogroup" aria-label={`${section.label} checkpoint answer`}>{section.checkpoint.choices.map((choice, index) => { const chosen = selected === index; const showCorrect = selected !== undefined && index === section.checkpoint.correct; return <button role="radio" key={choice} className={`${chosen ? 'chosen' : ''} ${showCorrect ? 'correct' : ''}`} aria-checked={chosen} tabIndex={chosen || (selected === undefined && index === 0) ? 0 : -1} disabled={locked} onClick={() => onSelect(index)} onKeyDown={(event) => moveRadioChoice(event, index, section.checkpoint.choices.length, onSelect)}><i>{String.fromCharCode(65 + index)}</i><span>{choice}</span>{showCorrect && <><span className="sr-only">Correct answer</span><Check size={17} aria-hidden="true" /></>}</button> })}</div>{selected !== undefined && <div className={`quiz-feedback ${correct ? 'success' : 'try-again'}`} role="status" aria-live="polite"><strong>{correct ? 'Yes—that preserves this movement’s turn.' : 'Return to the sequence before choosing again.'}</strong><p>{section.checkpoint.explanation}</p></div>}</section>
}

function IshaReview({ detail, overviewCompleted, editionCompleted, depthReady, readCount, checkpointCorrectCount, firstUnreadId, reflection, selectedQuiz, checkpointAnswers, onCheckpointSelect, onReflectionChange, onQuizSelect, onComplete, onOpenPassage }: {
  detail: LessonDetail
  overviewCompleted: boolean
  editionCompleted: boolean
  depthReady: boolean
  readCount: number
  checkpointCorrectCount: number
  firstUnreadId?: string
  reflection: string
  selectedQuiz?: number
  checkpointAnswers: Record<string, number>
  onCheckpointSelect: (sectionId: string, answer: number) => void
  onReflectionChange: (value: string) => void
  onQuizSelect: (answer: number) => void
  onComplete: () => void
  onOpenPassage: (id: string) => void
}) {
  const finalQuizCorrect = selectedQuiz === detail.quiz.correct
  const firstIncompleteMovement = ishaSections.find((section) => checkpointAnswers[section.id] !== section.checkpoint.correct)
  const completionLabel = editionCompleted
    ? 'Depth edition completed'
    : readCount < 18
      ? `Read ${18 - readCount} remaining mantra${18 - readCount === 1 ? '' : 's'}`
      : checkpointCorrectCount < 3
        ? `Complete ${3 - checkpointCorrectCount} movement check${3 - checkpointCorrectCount === 1 ? '' : 's'}`
        : !finalQuizCorrect
          ? 'Answer the final synthesis correctly'
          : 'Complete the Īśā edition'
  const nextRequirementLabel = firstUnreadId
    ? `Go to first unread mantra ${firstUnreadId}`
    : firstIncompleteMovement
      ? `Go to ${firstIncompleteMovement.label.toLowerCase()} checkpoint`
      : 'Go to final synthesis'
  const goToNextRequirement = () => {
    if (firstUnreadId) {
      onOpenPassage(firstUnreadId)
      return
    }
    const targetId = firstIncompleteMovement ? `isha-checkpoint-title-${firstIncompleteMovement.id}` : 'isha-final-quiz-title'
    const target = document.getElementById(targetId)
    target?.focus({ preventScroll: true })
    target?.scrollIntoView({ behavior: motionSafeBehavior(), block: 'start' })
  }
  return <div className="kena-review-page isha-review-page">
    <section className="kena-review-hero"><div><span className="kicker">REVIEW · INTEGRATE · CONTINUE</span><h1 id="isha-review-title" tabIndex={-1}>A way of inhabiting becomes a request to be led.</h1><p>Completion means reading all 18 mantras, retrieving each movement, and reconstructing the poem without flattening its tensions into a single slogan.</p></div><div className="kena-completion-list" aria-label="Īśā depth edition completion requirements"><div className={readCount === 18 ? 'done' : ''}>{readCount === 18 ? <CheckCircle2 /> : <BookOpenText />}<span><strong>{readCount} / 18</strong><small>mantras read</small></span></div><div className={checkpointCorrectCount === 3 ? 'done' : ''}>{checkpointCorrectCount === 3 ? <CheckCircle2 /> : <Compass />}<span><strong>{checkpointCorrectCount} / 3</strong><small>movement checks</small></span></div><div className={finalQuizCorrect ? 'done' : ''}>{finalQuizCorrect ? <CheckCircle2 /> : <Lightbulb />}<span><strong>{finalQuizCorrect ? 'Ready' : 'Pending'}</strong><small>final synthesis</small></span></div></div></section>

    {overviewCompleted && !editionCompleted && <div className="kena-prior-progress"><strong>Your earlier Īśā overview completion is preserved.</strong><p>The complete 18-mantra edition has its own checklist, so it has not been silently marked as read.</p></div>}

    <section className="kena-review-summary isha-review-summary" aria-labelledby="isha-review-summary-title"><span className="kicker">THE WHOLE ARC</span><h2 id="isha-review-summary-title">Inhabit and act → see and hold together → uncover, remember, and be led.</h2><p>{ishaFinalSynthesis.statement}</p><div>{ishaSections.map((section, index) => <div className="isha-review-step" key={section.id}><article><strong>{section.label}</strong><span>{section.title}</span><small>{section.verses[0]}–{section.verses.at(-1)}</small></article>{index < ishaSections.length - 1 && <MoveRight aria-hidden="true" />}</div>)}</div></section>

    <div className="kena-review-checkpoints">{ishaSections.map((section) => <CheckpointCard key={section.id} section={section} selected={checkpointAnswers[section.id]} onSelect={(answer) => onCheckpointSelect(section.id, answer)} locked={editionCompleted} />)}</div>

    <section className="isha-lenses" aria-labelledby="isha-lenses-title"><span className="kicker">THREE LABELED LENSES</span><h2 id="isha-lenses-title">The text stays fixed; the interpretive frame changes.</h2><p>Use these as reading lenses, not as interchangeable “translations.” The course paraphrase above does not silently choose among them.</p><div>{ishaInterpretiveLenses.map((lens) => <article key={lens.name}><strong>{lens.name}</strong><p>{lens.reading}</p></article>)}</div></section>

    <section className="kena-final-reflection"><div><span>OPTIONAL REFLECTION</span><h2>{ishaFinalSynthesis.reflectionPrompt}</h2><p>Your note remains in this browser and is not required for completion.</p></div><label className="reflection-field"><span>Your private note · saved on this device</span><textarea value={reflection} onChange={(event) => onReflectionChange(event.target.value)} placeholder="The pair I usually split is… Holding both changes…" rows={7} /></label></section>

    <section className="isha-retrieval-card" aria-labelledby="isha-retrieval-title"><span>SIX-SESSION RETRIEVAL · UNSCORED</span><h2 id="isha-retrieval-title">Rebuild the course before choosing an answer.</h2><p>{ishaFinalSynthesis.retrievalPrompt}</p></section>

    <section className="kena-final-quiz" aria-labelledby="isha-final-quiz-title"><span>FINAL SYNTHESIS</span><h2 id="isha-final-quiz-title" tabIndex={-1}>{detail.quiz.question}</h2><div className="quiz-choices" role="radiogroup" aria-label="Final synthesis answer">{detail.quiz.choices.map((choice, index) => { const chosen = selectedQuiz === index; const showCorrect = selectedQuiz !== undefined && index === detail.quiz.correct; return <button role="radio" key={choice} className={`${chosen ? 'chosen' : ''} ${showCorrect ? 'correct' : ''}`} aria-checked={chosen} tabIndex={chosen || (selectedQuiz === undefined && index === 0) ? 0 : -1} disabled={editionCompleted} onClick={() => onQuizSelect(index)} onKeyDown={(event) => moveRadioChoice(event, index, detail.quiz.choices.length, onQuizSelect)}><i>{String.fromCharCode(65 + index)}</i><span>{choice}</span>{showCorrect && <><span className="sr-only">Correct answer</span><Check size={17} aria-hidden="true" /></>}</button> })}</div>{selectedQuiz !== undefined && <div className={`quiz-feedback ${finalQuizCorrect ? 'success' : 'try-again'}`} role="status" aria-live="polite"><strong>{finalQuizCorrect ? 'You have the poem’s full arc.' : 'Return to the sequence, not only one famous phrase.'}</strong><p>{detail.quiz.explanation}</p></div>}<div className="kena-complete-action"><button className="primary-button" disabled={!depthReady || editionCompleted} onClick={onComplete}>{completionLabel} <CheckCircle2 size={17} /></button>{!depthReady && <button className="quiet-button" onClick={goToNextRequirement}>{nextRequirementLabel}</button>}</div></section>

    <section className="kena-sources" aria-labelledby="isha-sources-title"><div><span>TEXT & EDITORIAL SOURCES</span><h2 id="isha-sources-title">Know what layer you are reading.</h2><p>{ishaEditorialNote}</p></div><div>{ishaSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span><strong>{source.label}</strong><small>{source.use}</small></span><ExternalLink size={16} /></a>)}</div><p className="kena-license-note">The Sanskrit and IAST text layers are adapted from the “ईशोपनिषत्” page by Sanskrit Wikisource contributors (first source linked above); punctuation, spacing, lineation, transliteration, and study formatting have been changed. Those adapted layers are licensed under CC BY-SA 4.0. Word-by-word meanings and grammar cues, course paraphrases, teaching notes, diagrams, session prompts, and questions are original editorial material. Modern scholarly and historical translations were consulted for comparison; no copyrighted modern English translation is reproduced.</p></section>
  </div>
}
