import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  BookOpenText,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Eye,
  Flame,
  GitBranch,
  Heart,
  Lightbulb,
  ListTree,
  MoveRight,
  Sparkles,
  Sun,
  Wind,
} from 'lucide-react'
import type { CourseLesson, LessonDetail } from './courseData'
import type { DepthEditionProgress } from './depthEditionTypes'
import {
  getKathaPassagesForSection,
  getKathaPassagesForSession,
  getKathaSection,
  getKathaSession,
  kathaEditorialNote,
  kathaInvocation,
  kathaPassages,
  kathaSections,
  kathaSessions,
  kathaSources,
  type KathaPassage,
  type KathaSection,
} from './kathaData'

type KathaMode = 'map' | 'reader' | 'sections' | 'review'
type StudyMode = 'guided' | 'text' | 'full'

type KathaDepthLessonViewProps = {
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

const validPassageIds = new Set(kathaPassages.map((passage) => passage.id))
const kathaWikisourceBySection: Record<string, string> = {
  '1.1': 'https://sa.wikisource.org/wiki/कठोपनिषत्/प्रथमोध्यायः/प्रथमवल्ली',
  '1.2': 'https://sa.wikisource.org/wiki/कठोपनिषत्/प्रथमोध्यायः/द्वितीयवल्ली',
  '1.3': 'https://sa.wikisource.org/wiki/कठोपनिषत्/प्रथमोध्यायः/तृतीयवल्ली',
  '2.1': 'https://sa.wikisource.org/wiki/कठोपनिषत्/द्वितीयोध्यायः/प्रथमवल्ली',
  '2.2': 'https://sa.wikisource.org/wiki/कठोपनिषत्/द्वितीयोध्यायः/द्वितीयवल्ली',
  '2.3': 'https://sa.wikisource.org/wiki/कठोपनिषत्/द्वितीयोध्यायः/तृतीयवल्ली',
}

function initialRoute(progress: DepthEditionProgress): { mode: KathaMode; passageId: string; canonical: boolean; belongsToKatha: boolean } {
  const hash = window.location.hash
  const fallback = progress.lastId && validPassageIds.has(progress.lastId) ? progress.lastId : '1.1.1'
  if (hash === '#lesson/katha') return { mode: 'map', passageId: fallback, canonical: true, belongsToKatha: true }
  if (!hash.startsWith('#lesson/katha/')) return { mode: 'map', passageId: fallback, canonical: false, belongsToKatha: false }
  const match = hash.match(/^#lesson\/katha\/([^/]+)$/)
  const segment = match?.[1]
  if (segment === 'review') return { mode: 'review', passageId: fallback, canonical: true, belongsToKatha: true }
  if (segment === 'sections') return { mode: 'sections', passageId: fallback, canonical: true, belongsToKatha: true }
  if (segment && validPassageIds.has(segment)) return { mode: 'reader', passageId: segment, canonical: true, belongsToKatha: true }
  return { mode: 'map', passageId: fallback, canonical: false, belongsToKatha: true }
}

function replaceKathaHash(segment?: string) {
  const nextHash = segment ? `#lesson/katha/${segment}` : '#lesson/katha'
  if (window.location.hash !== nextHash) window.history.replaceState(window.history.state, '', nextHash)
}

function pushKathaHash(segment?: string) {
  const nextHash = segment ? `#lesson/katha/${segment}` : '#lesson/katha'
  if (window.location.hash !== nextHash) window.history.pushState(window.history.state, '', nextHash)
}

function motionSafeBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: motionSafeBehavior() })
}

export default function KathaDepthLessonView({
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
}: KathaDepthLessonViewProps) {
  const [route] = useState(() => initialRoute(progress))
  const [mode, setMode] = useState<KathaMode>(route.mode)
  const [activePassageId, setActivePassageId] = useState(route.passageId)
  const readerHeadingRef = useRef<HTMLHeadingElement>(null)
  const progressRef = useRef(progress)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  const readIds = [...new Set(progress.readIds.filter((id) => validPassageIds.has(id)))]
  const readSet = new Set(readIds)
  const readCount = readSet.size
  const progressPercent = Math.round((readCount / kathaPassages.length) * 100)
  const activeIndex = Math.max(0, kathaPassages.findIndex((passage) => passage.id === activePassageId))
  const activePassage = kathaPassages[activeIndex]
  const activeSection = getKathaSection(activePassage.sectionId) ?? kathaSections[0]
  const activeSession = getKathaSession(activePassage.sessionId) ?? kathaSessions[0]
  const sectionPassages = getKathaPassagesForSection(activePassage.sectionId)
  const sessionPassages = getKathaPassagesForSession(activePassage.sessionId)
  const isLastInSection = sectionPassages.at(-1)?.id === activePassage.id
  const isLastInSession = sessionPassages.at(-1)?.id === activePassage.id
  const previousPassage = kathaPassages[activeIndex - 1]
  const nextPassage = kathaPassages[activeIndex + 1]
  const checkpointCorrectCount = kathaSections.filter((section) => progress.checkpointAnswers[section.id] === section.checkpoint.correct).length
  const finalQuizCorrect = selectedQuiz === detail.quiz.correct
  const depthReady = readCount === kathaPassages.length && checkpointCorrectCount === kathaSections.length && finalQuizCorrect
  const editionCompleted = progress.completed === true
  const studyMode: StudyMode = progress.studyMode === 'text' || progress.studyMode === 'full' ? progress.studyMode : 'guided'

  useEffect(() => {
    if (mode !== 'reader') return
    const frame = window.requestAnimationFrame(() => readerHeadingRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [activePassageId, mode])

  useEffect(() => {
    if (mode === 'reader') return
    const frame = window.requestAnimationFrame(() => document.getElementById(`katha-${mode}-title`)?.focus({ preventScroll: true }))
    return () => window.cancelAnimationFrame(frame)
  }, [mode])

  useEffect(() => {
    const syncRoute = () => {
      const next = initialRoute(progressRef.current)
      if (!next.belongsToKatha) return
      if (!next.canonical) replaceKathaHash()
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
    pushKathaHash()
    scrollToTop()
  }

  const showSections = () => {
    setMode('sections')
    pushKathaHash('sections')
    scrollToTop()
  }

  const showReview = () => {
    setMode('review')
    pushKathaHash('review')
    scrollToTop()
  }

  const openPassage = (id: string, nextProgress: DepthEditionProgress = progress) => {
    if (!validPassageIds.has(id)) return
    setActivePassageId(id)
    setMode('reader')
    pushKathaHash(id)
    onProgressChange({ ...nextProgress, lastId: id })
    scrollToTop()
  }

  const openSection = (section: KathaSection) => {
    const passages = getKathaPassagesForSection(section.id)
    const target = passages.find((passage) => !readSet.has(passage.id)) ?? passages[0]
    openPassage(target.id)
  }

  const updateStudyMode = (nextMode: StudyMode) => {
    onProgressChange({ ...progress, studyMode: nextMode })
  }

  const scrollToSessionPause = () => {
    window.requestAnimationFrame(() => {
      const target = document.getElementById(`katha-session-title-${activeSession.id}`)
      target?.focus({ preventScroll: true })
      target?.scrollIntoView({ behavior: motionSafeBehavior(), block: 'start' })
    })
  }

  const scrollToCheckpoint = () => {
    window.requestAnimationFrame(() => {
      const target = document.getElementById(`katha-checkpoint-title-${activeSection.id}`)
      target?.focus({ preventScroll: true })
      target?.scrollIntoView({ behavior: motionSafeBehavior(), block: 'start' })
    })
  }

  const markReadAndContinue = () => {
    const nextReadIds = readSet.has(activePassage.id) ? readIds : [...readIds, activePassage.id]
    if (nextPassage && !isLastInSession) {
      const nextProgress = { ...progress, readIds: nextReadIds, lastId: nextPassage.id }
      setActivePassageId(nextPassage.id)
      replaceKathaHash(nextPassage.id)
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
    <section className="lesson-player kena-player katha-player">
      <header className="lesson-player-header kena-player-header katha-player-header">
        <button className="back-button" onClick={onClose}><ArrowLeft size={17} /> Path</button>
        <div><small>Kṛṣṇa Yajurveda · depth edition</small><strong>{lesson.title}</strong></div>
        <span aria-live="polite">{editionCompleted ? <><CheckCircle2 size={15} /> Complete</> : `${readCount} / 119 read`}</span>
      </header>

      <nav className="kena-rail katha-rail" aria-label="Kaṭha Upanishad course sections">
        <button className={mode === 'map' ? 'active' : ''} aria-current={mode === 'map' ? 'page' : undefined} onClick={showMap}><Compass size={16} /><span>Map</span></button>
        {kathaSections.map((section) => {
          const sectionRead = getKathaPassagesForSection(section.id).filter((passage) => readSet.has(passage.id)).length
          const sectionTotal = getKathaPassagesForSection(section.id).length
          const isActive = mode === 'reader' && activePassage.sectionId === section.id
          return (
            <button key={section.id} className={isActive ? 'active' : ''} aria-label={`Adhyāya ${section.adhyaya}, Vallī ${section.valli}: ${section.title}, ${sectionRead} of ${sectionTotal} read`} aria-current={isActive ? 'step' : undefined} onClick={() => openSection(section)}>
              <i>{sectionRead === sectionTotal ? <Check size={12} /> : section.id}</i>
              <span><b>{section.label}</b><small>{sectionRead}/{sectionTotal}</small></span>
            </button>
          )
        })}
        <button className={mode === 'review' ? 'active' : ''} aria-current={mode === 'review' ? 'page' : undefined} onClick={showReview}><CheckCircle2 size={16} /><span>Review</span></button>
      </nav>

      <nav className="katha-mobile-nav" aria-label="Kaṭha reader destinations">
        <button className={mode === 'map' ? 'active' : ''} aria-current={mode === 'map' ? 'page' : undefined} onClick={showMap}><Compass size={17} /><span>Map</span></button>
        <button className={mode === 'reader' ? 'active' : ''} aria-label={`Reader · ${activeSection.title} · ${activePassage.id}`} aria-current={mode === 'reader' ? 'page' : undefined} onClick={() => openPassage(activePassage.id)}><BookOpenText size={17} /><span>{activeSection.label}</span></button>
        <button className={mode === 'sections' ? 'active' : ''} aria-current={mode === 'sections' ? 'page' : undefined} onClick={showSections}><ListTree size={17} /><span>Sections</span></button>
        <button className={mode === 'review' ? 'active' : ''} aria-current={mode === 'review' ? 'page' : undefined} onClick={showReview}><CheckCircle2 size={17} /><span>Review</span></button>
      </nav>

      {mode === 'map' && <KathaMap readSet={readSet} progressPercent={progressPercent} lastPassageId={progress.lastId} onOpenPassage={openPassage} onOpenSection={openSection} />}
      {mode === 'sections' && <KathaSectionsPage readSet={readSet} onOpenSection={openSection} onOpenPassage={openPassage} />}

      {mode === 'reader' && (
        <div className="kena-reader katha-reader">
          <div className="kena-reader-tools katha-reader-tools">
            <div><span>Adhyāya {activeSection.adhyaya} · Vallī {activeSection.valli} · Session {activeSession.order} of 18</span><strong>{activeSession.title}</strong></div>
            <label>
              <span>Jump to a numbered unit</span>
              <select value={activePassage.id} onChange={(event) => openPassage(event.target.value)}>
                {kathaSections.map((section) => (
                  <optgroup key={section.id} label={`${section.label} · ${section.title}`}>
                    {getKathaPassagesForSection(section.id).map((passage) => <option value={passage.id} key={passage.id}>{readSet.has(passage.id) ? '✓ ' : ''}{passage.id} · {passage.title}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>

          <div className="katha-study-mode" aria-label="Reading layer">
            <span>Reading layer</span>
            <div>{(['guided', 'text', 'full'] as StudyMode[]).map((item) => <button key={item} className={studyMode === item ? 'active' : ''} aria-pressed={studyMode === item} onClick={() => updateStudyMode(item)}>{item === 'guided' ? 'Guided' : item === 'text' ? '+ IAST' : 'Full study'}</button>)}</div>
          </div>

          <div className="kena-reader-layout">
            <article className="kena-passage-card katha-passage-card">
              <header>
                <div><span>Kaṭha {activePassage.id}</span><small>{activePassage.kind}</small></div>
                {readSet.has(activePassage.id) && <span className="kena-read-badge"><Check size={13} /> Read</span>}
                <h1 ref={readerHeadingRef} tabIndex={-1}>{activePassage.title}</h1>
              </header>

              <section className="kena-text-layer devanagari-layer" aria-labelledby={`katha-devanagari-${activePassage.id}`}>
                <div><span>मूल</span><h2 id={`katha-devanagari-${activePassage.id}`}>Sanskrit</h2></div>
                <p lang="sa-Deva">{activePassage.devanagari}</p>
              </section>

              {studyMode !== 'guided' && (
                <section className="kena-text-layer iast-layer" aria-labelledby={`katha-iast-${activePassage.id}`}>
                  <div><span>IAST</span><h2 id={`katha-iast-${activePassage.id}`}>Transliteration</h2></div>
                  <p lang="sa-Latn">{activePassage.iast}</p>
                </section>
              )}

              <section className="kena-explanation" aria-labelledby={`katha-meaning-${activePassage.id}`}>
                <span className="kena-section-label">COURSE PARAPHRASE</span>
                <p className="kena-gloss" id={`katha-meaning-${activePassage.id}`}>{activePassage.gloss}</p>
                <div className="kena-plain-note"><Lightbulb size={18} /><div><strong>What to notice</strong><p>{activePassage.explanation}</p></div></div>
              </section>

              <KathaDiagram passage={activePassage} />

              {studyMode === 'full' && (
                <details className="kena-vocabulary">
                  <summary>Key words <span>{activePassage.terms.length} terms</span></summary>
                  <dl>{activePassage.terms.map((term) => <div key={`${activePassage.id}-${term.term}`}><dt lang="sa-Latn">{term.term}</dt><dd>{term.meaning}</dd></div>)}</dl>
                </details>
              )}

              {studyMode === 'full' && activePassage.textNote && (
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
              <div className="katha-breadcrumb"><small>{activePassage.id}</small><strong>{activeSession.recall}</strong></div>
              <div className="kena-section-mini-progress">
                <i><b style={{ width: `${(sectionPassages.filter((passage) => readSet.has(passage.id)).length / sectionPassages.length) * 100}%` }} /></i>
                <span>{sectionPassages.filter((passage) => readSet.has(passage.id)).length} of {sectionPassages.length} in this vallī</span>
              </div>
              <small>Study note</small>
              <p>Kaṭha’s units are traditionally numbered by adhyāya, vallī, and unit. “Numbered unit” avoids pretending every passage has exactly the same metrical form.</p>
              <div className="kena-reader-attribution">
                <small>Text source & license</small>
                <a href={kathaWikisourceBySection[activePassage.sectionId]} target="_blank" rel="noreferrer">This vallī on Sanskrit Wikisource <ExternalLink size={13} /></a>
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0 <ExternalLink size={13} /></a>
              </div>
            </aside>
          </div>

          {isLastInSession && (
            <div className="katha-session-pause" id={`katha-session-${activeSession.id}`}>
              <div><span>SESSION {activeSession.order} · SAY IT WITHOUT LOOKING</span><h2 id={`katha-session-title-${activeSession.id}`} tabIndex={-1}>{activeSession.recall}</h2><p>Next question: {activeSession.nextQuestion}</p></div>
              {isLastInSection && <CheckpointCard section={activeSection} selected={progress.checkpointAnswers[activeSection.id]} onSelect={(answer) => updateCheckpoint(activeSection.id, answer)} locked={editionCompleted} />}
              {nextPassage ? <button className="primary-button" onClick={() => openPassage(nextPassage.id)}>Begin session {getKathaSession(nextPassage.sessionId)?.order} <ChevronRight size={17} /></button> : <button className="primary-button" onClick={showReview}>Open final review <ChevronRight size={17} /></button>}
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
        <KathaReview
          detail={detail}
          overviewCompleted={completed}
          editionCompleted={editionCompleted}
          depthReady={depthReady}
          readCount={readCount}
          checkpointCorrectCount={checkpointCorrectCount}
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

function KathaMap({ readSet, progressPercent, lastPassageId, onOpenPassage, onOpenSection }: {
  readSet: Set<string>
  progressPercent: number
  lastPassageId?: string
  onOpenPassage: (id: string) => void
  onOpenSection: (section: KathaSection) => void
}) {
  const resumeId = lastPassageId && validPassageIds.has(lastPassageId) ? lastPassageId : '1.1.1'
  return (
    <div className="kena-map-page katha-map-page">
      <section className="kena-map-hero katha-map-hero">
        <div><span className="kicker">KAṬHA UPANIṢAD · COMPLETE READER</span><h1 id="katha-map-title" tabIndex={-1}>What deserves choosing when time is limited?</h1><p>A young seeker protects one question through three boons. Death answers with discrimination, disciplined attention, inward recognition, and release.</p><div className="kena-map-actions"><button className="primary-button" onClick={() => onOpenPassage(resumeId)}>{readSet.size ? `Resume ${resumeId}` : 'Begin with 1.1.1'} <ChevronRight size={17} /></button><span>119 units · 18 sessions · about 6 hours</span></div></div>
        <div className="kena-progress-orbit" style={{ background: `conic-gradient(var(--saffron) ${progressPercent * 3.6}deg, rgba(255,255,255,.34) 0deg)` }} role="progressbar" aria-label="Kaṭha depth edition reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}><div><strong>{progressPercent}%</strong><span>{readSet.size} / 119 read</span></div></div>
      </section>

      <section className="katha-movement-map" aria-labelledby="katha-movement-title">
        <div><span className="kicker">THE WHOLE MOVEMENT</span><h2 id="katha-movement-title">Naciketas lives the answer before Yama explains it.</h2></div>
        <ol><li><strong>Question</strong><span>protect what matters</span></li><li><strong>Choice</strong><span>śreyas / preyas</span></li><li><strong>Training</strong><span>coordinate the faculties</span></li><li><strong>Inward turn</strong><span>reverse attention</span></li><li><strong>Recognition</strong><span>one within many</span></li><li><strong>Release</strong><span>steady and loosen</span></li></ol>
      </section>

      <figure className="kena-story-illustration katha-story-illustration">
        <img src="./naciketas-threshold-three-nights.jpg" alt="Manuscript-inspired teaching illustration: the young Naciketas waits calmly at a threshold beside three lamps as a dignified distant figure approaches at dawn" loading="lazy" decoding="async" />
        <figcaption><span>THREE NIGHTS AT THE THRESHOLD</span><strong>The question begins with patience, not spectacle.</strong><p>An original literary teaching illustration—not a historical reconstruction or a literal image of the afterlife.</p></figcaption>
      </figure>

      <section className="katha-two-adhyayas" aria-labelledby="katha-structure-title">
        <div><span className="kicker">TEXTUAL ADDRESS</span><h2 id="katha-structure-title">Two adhyāyas. Six vallīs. One continuous dialogue.</h2><p>The course IDs preserve all three coordinates: <strong>1.2.23</strong> means Adhyāya I, Vallī 2, unit 23.</p></div>
        <div className="katha-adhyaya-columns">{[1, 2].map((adhyaya) => <section key={adhyaya}><header><small>ADHYĀYA</small><h3>{adhyaya === 1 ? 'I · the question is protected' : 'II · recognition is stabilized'}</h3></header>{kathaSections.filter((section) => section.adhyaya === adhyaya).map((section) => { const passages = getKathaPassagesForSection(section.id); const complete = passages.filter((passage) => readSet.has(passage.id)).length; return <button key={section.id} onClick={() => onOpenSection(section)}><span>{section.label}</span><div><strong>{section.title}</strong><small>{section.form}</small></div><i><b style={{ width: `${(complete / passages.length) * 100}%` }} /></i><em>{complete}/{passages.length}</em></button> })}</section>)}</div>
      </section>

      <section className="kena-origin-grid">
        <article><span>LINEAGE</span><h2>Kṛṣṇa Yajurveda → Kaṭha / Kāṭhaka school → Kaṭha Upaniṣad</h2><p>“Kaṭha,” “Kāṭhaka,” and “Kāṭhopaniṣad” appear in scholarship and catalogues. The dialogue’s central learner is Naciketas, also commonly spelled Nachiketa.</p></article>
        <article><span>HOW TO READ THIS EDITION</span><h2>Text, paraphrase, and interpretation remain separate.</h2><p>{kathaEditorialNote}</p></article>
      </section>

      <details className="kena-invocation"><summary><Sparkles size={17} /> Begin with the peace invocation <span>not counted among the 119 units</span></summary><div><p lang="sa-Deva">{kathaInvocation.devanagari}</p><p lang="sa-Latn">{kathaInvocation.iast}</p><small>{kathaInvocation.note}</small></div></details>
    </div>
  )
}

function KathaSectionsPage({ readSet, onOpenSection, onOpenPassage }: { readSet: Set<string>; onOpenSection: (section: KathaSection) => void; onOpenPassage: (id: string) => void }) {
  return <div className="katha-sections-page"><header><span className="kicker">SIX VALLĪS · EIGHTEEN SESSIONS</span><h1 id="katha-sections-title" tabIndex={-1}>Choose your place without losing the whole arc.</h1><p>Each vallī has one scored checkpoint. Session pauses are unscored invitations to retrieve the idea in your own words.</p></header><div>{kathaSections.map((section) => { const passages = getKathaPassagesForSection(section.id); const complete = passages.filter((passage) => readSet.has(passage.id)).length; return <article key={section.id}><button onClick={() => onOpenSection(section)}><span>{section.label}</span><div><small>ADHYĀYA {section.adhyaya} · VALLĪ {section.valli}</small><h2>{section.title}</h2><p>{section.question}</p><i><b style={{ width: `${(complete / passages.length) * 100}%` }} /></i><em>{complete} / {passages.length} read</em></div><ChevronRight /></button><ol>{kathaSessions.filter((session) => session.sectionId === section.id).map((session) => { const sessionPassages = getKathaPassagesForSession(session.id); const target = sessionPassages.find((passage) => !readSet.has(passage.id)) ?? sessionPassages[0]; const sessionRead = sessionPassages.filter((passage) => readSet.has(passage.id)).length; return <li key={session.id}><button onClick={() => onOpenPassage(target.id)} aria-label={`Session ${session.order}: ${session.title}, ${sessionRead} of ${sessionPassages.length} read. Open ${target.id}.`}><span>{session.order}</span><div><strong>{session.title}</strong><small>{section.id}.{session.range[0]}–{section.id}.{session.range[1]} · {sessionRead}/{sessionPassages.length} read</small></div><ChevronRight size={16} /></button></li> })}</ol></article> })}</div></div>
}

function KathaDiagram({ passage }: { passage: KathaPassage }) {
  if (passage.id === '1.1.20') return <figure className="kena-concept-figure katha-boons-figure"><figcaption><span>THE THREE BOONS</span><strong>The third question changes the level of inquiry.</strong></figcaption><ol><li><span>1</span><strong>Relationship repaired</strong><small>father and son</small></li><li><span>2</span><strong>Fire taught</strong><small>heavenly attainment</small></li><li><span>3</span><strong>Death questioned</strong><small>what remains?</small></li></ol><p>The ritual teaching is not erased; the dialogue moves through it toward a different question.</p></figure>
  if (passage.id === '1.2.1' || passage.id === '1.2.2') return <figure className="kena-concept-figure katha-choice-figure"><figcaption><span>ŚREYAS / PREYAS</span><strong>Not good versus evil. A test of orientation.</strong></figcaption><div><article><small>CAN OVERLAP</small><strong>pleasant + beneficial</strong></article><GitBranch aria-hidden="true" /><article><span><b>preyas</b>immediate attraction</span><span><b>śreyas</b>deeper benefit</span></article></div><p>The distinction matters when the paths diverge.</p></figure>
  if (passage.id === '1.3.3' || passage.id === '1.3.4') return <figure className="kena-concept-figure katha-chariot-figure"><figcaption><span>ANALOGY, NOT ANATOMY</span><strong>A coordinated journey.</strong></figcaption><div><span><small>ĀTMAN</small>rider / owner</span><MoveRight /><span><small>BUDDHI</small>charioteer</span><MoveRight /><span><small>MANAS</small>reins</span><MoveRight /><span><small>SENSES</small>horses</span><MoveRight /><span><small>OBJECTS</small>roads</span></div><p>The embodied experiencer is the whole related system; ātman is not a small ego driving inside the body.</p></figure>
  if (passage.id === '2.1.1') return <figure className="kena-concept-figure katha-inward-figure"><figcaption><span>THE TURN</span><strong>Attention changes direction.</strong></figcaption><div><article><Eye /><small>ORDINARY ORIENTATION</small><strong>senses → outward</strong></article><MoveRight /><article><Heart /><small>DISCIPLINED REVERSAL</small><strong>attention → inward</strong></article></div><p>The senses are not evil. The verse asks whether attention can notice what outward pursuit usually overlooks.</p></figure>
  if (passage.id === '2.2.9' || passage.id === '2.2.10' || passage.id === '2.2.11') return <figure className="kena-concept-figure katha-elements-figure"><figcaption><span>ONE WITHIN MANY</span><strong>Three analogies, three different contributions.</strong></figcaption><div><article><Flame /><strong>Fire</strong><span>takes many forms</span></article><article><Wind /><strong>Wind</strong><span>enters many forms</span></article><article><Sun /><strong>Sun</strong><span>illuminates unstained</span></article></div><p>No single analogy exhausts the claim, and none licenses indifference to suffering.</p></figure>
  if (passage.id === '2.3.1') return <figure className="kena-concept-figure katha-tree-figure"><figcaption><span>THE INVERTED TREE</span><strong>The visible branches depend on a root above.</strong></figcaption><div><strong>ROOT · bright / brahman / deathless</strong><ArrowDown /><span>worlds · lives · changing branches</span></div><p>Kaṭha supplies this image. The later Bhagavad Gītā develops a related tree, but its entire allegory should not be imported backward.</p></figure>
  if (passage.id === '2.3.10' || passage.id === '2.3.11') return <figure className="kena-concept-figure katha-stillness-figure"><figcaption><span>KAṬHA’S DEFINITION OF YOGA</span><strong>Steadiness with vigilance.</strong></figcaption><div><span>senses steady</span><span>mind steady</span><span>discernment quiet</span><strong>remain attentive</strong></div><p>This early formulation is not identical with either Pātañjala yoga or modern posture practice.</p></figure>
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

function CheckpointCard({ section, selected, onSelect, locked = false }: { section: KathaSection; selected?: number; onSelect: (answer: number) => void; locked?: boolean }) {
  const correct = selected === section.checkpoint.correct
  return <section className="kena-checkpoint-card" id={`katha-checkpoint-${section.id}`} aria-labelledby={`katha-checkpoint-title-${section.id}`}><div><span>{section.label} · VALLĪ CHECKPOINT</span><h2 id={`katha-checkpoint-title-${section.id}`} tabIndex={-1}>{section.recap}</h2></div><p>{section.checkpoint.question}</p><div className="quiz-choices" role="radiogroup" aria-label={`${section.label} checkpoint answer`}>{section.checkpoint.choices.map((choice, index) => { const chosen = selected === index; const showCorrect = selected !== undefined && index === section.checkpoint.correct; return <button role="radio" key={choice} className={`${chosen ? 'chosen' : ''} ${showCorrect ? 'correct' : ''}`} aria-checked={chosen} tabIndex={chosen || (selected === undefined && index === 0) ? 0 : -1} disabled={locked} onClick={() => onSelect(index)} onKeyDown={(event) => moveRadioChoice(event, index, section.checkpoint.choices.length, onSelect)}><i>{String.fromCharCode(65 + index)}</i><span>{choice}</span>{showCorrect && <><span className="sr-only">Correct answer</span><Check size={17} aria-hidden="true" /></>}</button> })}</div>{selected !== undefined && <div className={`quiz-feedback ${correct ? 'success' : 'try-again'}`} role="status" aria-live="polite"><strong>{correct ? 'Yes—that is this vallī’s turn.' : 'Return to the relationship among the images.'}</strong><p>{section.checkpoint.explanation}</p></div>}</section>
}

function KathaReview({ detail, overviewCompleted, editionCompleted, depthReady, readCount, checkpointCorrectCount, reflection, selectedQuiz, checkpointAnswers, onCheckpointSelect, onReflectionChange, onQuizSelect, onComplete, onOpenPassage }: {
  detail: LessonDetail
  overviewCompleted: boolean
  editionCompleted: boolean
  depthReady: boolean
  readCount: number
  checkpointCorrectCount: number
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
  return <div className="kena-review-page katha-review-page">
    <section className="kena-review-hero"><div><span className="kicker">REVIEW · INTEGRATE · CONTINUE</span><h1 id="katha-review-title" tabIndex={-1}>A protected question becomes a disciplined life.</h1><p>Completion means you have encountered every numbered unit, retrieved each vallī’s movement, and can reconstruct the dialogue without reducing it to one famous image.</p></div><div className="kena-completion-list" aria-label="Kaṭha depth edition completion requirements"><div className={readCount === 119 ? 'done' : ''}>{readCount === 119 ? <CheckCircle2 /> : <BookOpenText />}<span><strong>{readCount} / 119</strong><small>units read</small></span></div><div className={checkpointCorrectCount === 6 ? 'done' : ''}>{checkpointCorrectCount === 6 ? <CheckCircle2 /> : <Compass />}<span><strong>{checkpointCorrectCount} / 6</strong><small>vallī checks</small></span></div><div className={finalQuizCorrect ? 'done' : ''}>{finalQuizCorrect ? <CheckCircle2 /> : <Lightbulb />}<span><strong>{finalQuizCorrect ? 'Ready' : 'Pending'}</strong><small>final synthesis</small></span></div></div></section>

    {overviewCompleted && !editionCompleted && <div className="kena-prior-progress"><strong>Your earlier Kaṭha overview completion is preserved.</strong><p>The 119-unit depth edition has its own checklist, so it has not been silently marked as read.</p></div>}

    <section className="kena-review-summary katha-review-summary" aria-labelledby="katha-review-summary-title"><span className="kicker">THE WHOLE MOVEMENT</span><h2 id="katha-review-summary-title">Question → choice → training → inward turn → recognition → release.</h2><div>{kathaSections.map((section, index) => <div className="katha-review-step" key={section.id}><article><strong>{section.label}</strong><span>{section.title}</span></article>{index < kathaSections.length - 1 && <MoveRight />}</div>)}</div></section>

    <div className="kena-review-checkpoints">{kathaSections.map((section) => <CheckpointCard key={section.id} section={section} selected={checkpointAnswers[section.id]} onSelect={(answer) => onCheckpointSelect(section.id, answer)} locked={editionCompleted} />)}</div>

    <section className="kena-final-reflection"><div><span>OPTIONAL REFLECTION</span><h2>Which question in your life is too important to trade for an attractive substitute?</h2><p>Your note remains in this browser and is not required for completion.</p></div><label className="reflection-field"><span>Your private note · saved on this device</span><textarea value={reflection} onChange={(event) => onReflectionChange(event.target.value)} placeholder="The question I want to protect is… The substitute I usually accept is…" rows={7} /></label></section>

    <section className="kena-final-quiz" aria-labelledby="katha-final-quiz-title"><span>FINAL SYNTHESIS</span><h2 id="katha-final-quiz-title">{detail.quiz.question}</h2><div className="quiz-choices" role="radiogroup" aria-label="Final synthesis answer">{detail.quiz.choices.map((choice, index) => { const chosen = selectedQuiz === index; const showCorrect = selectedQuiz !== undefined && index === detail.quiz.correct; return <button role="radio" key={choice} className={`${chosen ? 'chosen' : ''} ${showCorrect ? 'correct' : ''}`} aria-checked={chosen} tabIndex={chosen || (selectedQuiz === undefined && index === 0) ? 0 : -1} disabled={editionCompleted} onClick={() => onQuizSelect(index)} onKeyDown={(event) => moveRadioChoice(event, index, detail.quiz.choices.length, onQuizSelect)}><i>{String.fromCharCode(65 + index)}</i><span>{choice}</span>{showCorrect && <><span className="sr-only">Correct answer</span><Check size={17} aria-hidden="true" /></>}</button> })}</div>{selectedQuiz !== undefined && <div className={`quiz-feedback ${finalQuizCorrect ? 'success' : 'try-again'}`} role="status" aria-live="polite"><strong>{finalQuizCorrect ? 'You have the dialogue’s full arc.' : 'Return to the sequence, not only its famous sayings.'}</strong><p>{detail.quiz.explanation}</p></div>}<div className="kena-complete-action"><button className="primary-button" disabled={!depthReady || editionCompleted} onClick={onComplete}>{editionCompleted ? 'Depth edition completed' : depthReady ? 'Complete the Kaṭha edition' : 'Finish the three checks above'} <CheckCircle2 size={17} /></button>{!depthReady && <button className="quiet-button" onClick={() => onOpenPassage('1.1.1')}>Return to the text</button>}</div></section>

    <section className="kena-sources" aria-labelledby="katha-sources-title"><div><span>TEXT & EDITORIAL SOURCES</span><h2 id="katha-sources-title">Know what layer you are reading.</h2><p>{kathaEditorialNote}</p></div><div>{kathaSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span><strong>{source.label}</strong><small>{source.use}</small></span><ExternalLink size={16} /></a>)}</div><p className="kena-license-note">The Sanskrit and IAST text layers are adapted from the six “कठोपनिषत्” vallī pages by Sanskrit Wikisource contributors (first source linked above); punctuation, spelling, lineation, transliteration, and study formatting have been changed. Those adapted layers are licensed under CC BY-SA 4.0 (license linked above). Course paraphrases, teaching notes, diagrams, session prompts, and questions are original editorial material. No copyrighted modern English translation is reproduced.</p></section>
  </div>
}
