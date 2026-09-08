import { useEffect, useRef, useState } from 'react'
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
  MoveRight,
  Sparkles,
  Zap,
} from 'lucide-react'
import type { CourseLesson, LessonDetail } from './courseData'
import type { DepthEditionProgress } from './depthEditionTypes'
import WordByWordStudy from './WordByWordStudy'
import { firstUnreadKenaPassage, kenaOpeningLessons, kenaOpeningQuestions, markKenaPassageRead, nextKenaReviewTask } from './kenaLearning'
import {
  getKenaPassagesForSection,
  getKenaSection,
  kenaEditorialNote,
  kenaInvocation,
  kenaPassages,
  kenaSections,
  kenaSources,
  type KenaPassage,
  type KenaSection,
} from './kenaData'

type KenaMode = 'map' | 'reader' | 'review'
type StudyMode = 'guided' | 'text' | 'full'

type KenaDepthLessonViewProps = {
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

const validPassageIds = new Set(kenaPassages.map((passage) => passage.id))

function initialRoute(progress: DepthEditionProgress): { mode: KenaMode; passageId: string } {
  const segment = window.location.hash.replace('#', '').split('/')[2]
  if (segment === 'review') return { mode: 'review', passageId: progress.lastId && validPassageIds.has(progress.lastId) ? progress.lastId : '1.1' }
  if (segment && validPassageIds.has(segment)) return { mode: 'reader', passageId: segment }
  return { mode: 'map', passageId: progress.lastId && validPassageIds.has(progress.lastId) ? progress.lastId : '1.1' }
}

function pushKenaHash(segment?: string) {
  const hash = segment ? `#lesson/kena/${segment}` : '#lesson/kena'
  if (window.location.hash !== hash) window.history.pushState(window.history.state, '', hash)
}

function motionSafeBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: motionSafeBehavior() })
}

function focusLearningSection(id: string) {
  window.requestAnimationFrame(() => {
    const element = document.getElementById(id)
    element?.focus({ preventScroll: true })
    element?.scrollIntoView({ behavior: motionSafeBehavior(), block: 'start' })
  })
}

export default function KenaDepthLessonView({
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
}: KenaDepthLessonViewProps) {
  const [route] = useState(() => initialRoute(progress))
  const [mode, setMode] = useState<KenaMode>(route.mode)
  const [activePassageId, setActivePassageId] = useState(route.passageId)
  const readerHeadingRef = useRef<HTMLHeadingElement>(null)

  const readIds = [...new Set(progress.readIds.filter((id) => validPassageIds.has(id)))]
  const readSet = new Set(readIds)
  const readCount = readSet.size
  const progressPercent = Math.round((readCount / kenaPassages.length) * 100)
  const activeIndex = Math.max(0, kenaPassages.findIndex((passage) => passage.id === activePassageId))
  const activePassage = kenaPassages[activeIndex]
  const activeSection = getKenaSection(activePassage.section) ?? kenaSections[0]
  const sectionPassages = getKenaPassagesForSection(activePassage.section)
  const isLastInSection = sectionPassages.at(-1)?.id === activePassage.id
  const previousPassage = kenaPassages[activeIndex - 1]
  const nextPassage = kenaPassages[activeIndex + 1]
  const checkpointCorrectCount = kenaSections.filter((section) => progress.checkpointAnswers[String(section.id)] === section.checkpoint.correct).length
  const finalQuizCorrect = selectedQuiz === detail.quiz.correct
  const depthReady = readCount === kenaPassages.length && checkpointCorrectCount === kenaSections.length && finalQuizCorrect
  const editionCompleted = progress.completed === true
  const studyMode: StudyMode = progress.studyMode ?? 'full'
  const openingLesson = kenaOpeningLessons[activePassage.id]

  useEffect(() => {
    if (mode !== 'reader') return
    const frame = window.requestAnimationFrame(() => readerHeadingRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [activePassageId, mode])

  useEffect(() => {
    const syncRoute = () => {
      const next = initialRoute(progress)
      setMode(next.mode)
      setActivePassageId(next.passageId)
    }
    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    return () => {
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [progress])

  const showMap = () => {
    setMode('map')
    pushKenaHash()
    scrollToTop()
  }

  const showReview = () => {
    setMode('review')
    pushKenaHash('review')
    scrollToTop()
  }

  const openPassage = (id: string, nextProgress: DepthEditionProgress = progress) => {
    if (!validPassageIds.has(id)) return
    setActivePassageId(id)
    setMode('reader')
    pushKenaHash(id)
    onProgressChange({ ...nextProgress, lastId: id })
    scrollToTop()
  }

  const openSection = (section: KenaSection) => {
    const passages = getKenaPassagesForSection(section.id)
    const target = passages.find((passage) => !readSet.has(passage.id)) ?? passages[0]
    openPassage(target.id)
  }

  const markReadAndContinue = () => {
    const nextProgress = markKenaPassageRead(progress, activePassage.id)
    if (nextPassage && !isLastInSection) {
      openPassage(nextPassage.id, nextProgress)
      return
    }
    onProgressChange(nextProgress)
    scrollToCheckpoint()
  }

  const scrollToCheckpoint = () => {
    focusLearningSection(`kena-checkpoint-title-${activeSection.id}`)
  }

  const finishSection = () => {
    const nextProgress = markKenaPassageRead(progress, activePassage.id)
    if (nextPassage) openPassage(nextPassage.id, nextProgress)
    else {
      onProgressChange(nextProgress)
      showReview()
    }
  }

  const updateCheckpoint = (sectionId: number, answer: number) => {
    onProgressChange({
      ...progress,
      checkpointAnswers: { ...progress.checkpointAnswers, [String(sectionId)]: answer },
    })
  }

  const updateStudyMode = (nextMode: StudyMode) => {
    onProgressChange({ ...progress, studyMode: nextMode })
  }

  const completeDepthEdition = () => {
    if (!depthReady || editionCompleted) return
    onProgressChange({ ...progress, readIds, completed: true })
    onComplete()
  }

  return (
    <section className="lesson-player kena-player kena-learning-player">
      <header className="lesson-player-header kena-player-header">
        <button className="back-button" onClick={onClose}><ArrowLeft size={17} /> Path</button>
        <div><small>Sāmaveda · Kena Upaniṣad</small><strong>{lesson.title}</strong></div>
        <span aria-live="polite">{editionCompleted ? <><CheckCircle2 size={15} /> Complete</> : `${readCount} / 35 read`}</span>
      </header>

      <nav className="kena-rail" aria-label="Kena Upanishad course sections">
        <button className={mode === 'map' ? 'active' : ''} aria-current={mode === 'map' ? 'page' : undefined} onClick={showMap}><Compass size={16} /><span>Map</span></button>
        {kenaSections.map((section) => {
          const sectionRead = getKenaPassagesForSection(section.id).filter((passage) => readSet.has(passage.id)).length
          const sectionTotal = getKenaPassagesForSection(section.id).length
          const isActive = mode === 'reader' && activePassage.section === section.id
          return (
            <button key={section.id} className={isActive ? 'active' : ''} aria-label={`Section ${section.roman}: ${section.title}, ${sectionRead} of ${sectionTotal} read`} aria-current={isActive ? 'step' : undefined} onClick={() => openSection(section)}>
              <i>{sectionRead === sectionTotal ? <Check size={12} /> : section.roman}</i>
              <span><b>{['The question', 'Knowing', 'The story', 'Practice'][section.id - 1]}</b><small>{sectionRead}/{sectionTotal}</small></span>
            </button>
          )
        })}
        <button className={mode === 'review' ? 'active' : ''} aria-current={mode === 'review' ? 'page' : undefined} onClick={showReview}><CheckCircle2 size={16} /><span>Review</span></button>
      </nav>

      {mode === 'map' && (
        <KenaMap
          readSet={readSet}
          progressPercent={progressPercent}
          lastPassageId={progress.lastId}
          onOpenPassage={openPassage}
          onOpenSection={openSection}
          onReview={showReview}
        />
      )}

      {mode === 'reader' && (
        <div className="kena-reader">
          <div className="kena-reader-tools">
            <div><span>Section {activeSection.roman}</span><strong>{activeSection.title}</strong></div>
            <label>
              <span>Jump to a passage</span>
              <select value={activePassage.id} onChange={(event) => openPassage(event.target.value)}>
                {kenaSections.map((section) => (
                  <optgroup key={section.id} label={`Section ${section.roman} · ${section.title}`}>
                    {getKenaPassagesForSection(section.id).map((passage) => <option value={passage.id} key={passage.id}>{readSet.has(passage.id) ? '✓ ' : ''}{passage.id} · {passage.title}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>

          <div className="kena-reader-layout">
            <article className="kena-passage-card">
              <header>
                <div><span>Kena {activePassage.id}</span><small>Section {activePassage.section} · passage {activePassage.number}</small></div>
                {readSet.has(activePassage.id) && <span className="kena-read-badge"><Check size={13} /> Read</span>}
                <h1 ref={readerHeadingRef} tabIndex={-1}>{activePassage.title}</h1>
                {openingLesson && <p className="kena-opening-orientation">{openingLesson.orientation}</p>}
                <nav className="kena-page-jumps" aria-label="Parts of this passage">
                  <button onClick={() => focusLearningSection(`meaning-${activePassage.id}`)}>1. Understand</button>
                  <button onClick={() => focusLearningSection(`devanagari-${activePassage.id}`)}>2. Read Sanskrit</button>
                  <button onClick={() => { updateStudyMode('full'); focusLearningSection(`word-study-kena-${activePassage.id.replaceAll('.', '-')}`) }}>3. Learn the words</button>
                </nav>
              </header>

              <section className="kena-explanation" aria-labelledby={`meaning-${activePassage.id}`}>
                <h2 className="kena-section-label" id={`meaning-${activePassage.id}`} tabIndex={-1}>The idea in plain English</h2>
                <p className="kena-beginner-explanation">{activePassage.explanation}</p>
                <div className="kena-plain-note"><Lightbulb size={18} aria-hidden="true" /><div><strong>English meaning · course rendering</strong><p>{activePassage.gloss}</p></div></div>
              </section>

              {activePassage.id === '1.1' && <KenaOpeningQuestions />}
              <KenaDiagram passage={activePassage} />
              {openingLesson && <KenaOpeningCheck key={activePassage.id} lesson={openingLesson} />}

              <div className="katha-study-mode kena-study-mode" role="group" aria-label="Reading layer">
                <span>Sanskrit reading aids</span>
                <div>{(['guided', 'text', 'full'] as StudyMode[]).map((item) => <button key={item} className={studyMode === item ? 'active' : ''} aria-label={item === 'guided' ? 'Sanskrit script only, with English explanation' : item === 'text' ? 'Add Roman-script transliteration, called IAST' : 'Add word-by-word meanings and optional grammar notes'} aria-pressed={studyMode === item} onClick={() => updateStudyMode(item)}>{item === 'guided' ? 'Script' : item === 'text' ? '+ Roman script' : 'Word by word'}</button>)}</div>
              </div>

              <section className="kena-text-layer devanagari-layer" aria-labelledby={`devanagari-${activePassage.id}`}>
                <div><span>मूल</span><h2 id={`devanagari-${activePassage.id}`} tabIndex={-1}>Sanskrit</h2></div>
                <p lang="sa-Deva">{activePassage.devanagari}</p>
              </section>

              {studyMode !== 'guided' && (
                <section className="kena-text-layer iast-layer" aria-labelledby={`iast-${activePassage.id}`}>
                  <div><span>IAST</span><h2 id={`iast-${activePassage.id}`}>In Roman letters</h2></div>
                  <p lang="sa-Latn">{activePassage.iast}</p>
                </section>
              )}

              {studyMode === 'full' && <>
                {openingLesson && <aside className="kena-sanskrit-hint" aria-label="One Sanskrit pattern to learn"><span>One pattern to learn</span><h2>{openingLesson.grammar.title}</h2><p className="kena-sandhi-example">{openingLesson.grammar.forms}</p><p>{openingLesson.grammar.explanation}</p></aside>}
                <WordByWordStudy key={activePassage.id} beginner passageId={`kena-${activePassage.id}`} words={activePassage.words} />
              </>}

              <details className="kena-vocabulary">
                <summary>Open the key words <span>{activePassage.terms.length} terms</span></summary>
                <dl>{activePassage.terms.map((term) => <div key={term.term}><dt lang="sa-Latn">{term.term}</dt><dd>{term.meaning}</dd></div>)}</dl>
              </details>

              {activePassage.textNote && (
                <details className="kena-text-note">
                  <summary>Edition / variant note</summary>
                  <p>{activePassage.textNote}</p>
                </details>
              )}
            </article>

            <aside className="kena-section-sidebar">
              <span>Where you are</span>
              <h2>{activeSection.question}</h2>
              <p>{activeSection.summary}</p>
              <button className="quiet-button" onClick={showMap}><Compass size={16} /> See how Kena fits together</button>
              <div className="kena-section-mini-progress">
                <i><b style={{ width: `${(sectionPassages.filter((passage) => readSet.has(passage.id)).length / sectionPassages.length) * 100}%` }} /></i>
                <span>{sectionPassages.filter((passage) => readSet.has(passage.id)).length} of {sectionPassages.length} read</span>
              </div>
              <small>Study note</small>
              <p>{activePassage.kind === 'mantra' ? 'Sections I–II are metrical teaching.' : 'Sections III–IV are prose. These units are passages, not ślokas.'}</p>
              <p>Use “Mark read” when you finish a passage. Your progress is saved on this device. The passage menu lets you browse freely.</p>
              <div className="kena-reader-attribution">
                <small>Text source & license</small>
                <a href="https://sa.wikisource.org/wiki/केनोपनिषद्" target="_blank" rel="noreferrer">Sanskrit Wikisource <ExternalLink size={13} /></a>
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0 <ExternalLink size={13} /></a>
              </div>
            </aside>
          </div>

          {isLastInSection && (
            <div className="kena-reader-checkpoint">
                <CheckpointCard
                  section={activeSection}
                  selected={progress.checkpointAnswers[String(activeSection.id)]}
                  onSelect={(answer) => updateCheckpoint(activeSection.id, answer)}
                  locked={editionCompleted}
                />
              <button className="primary-button" onClick={finishSection}>{readSet.has(activePassage.id) ? '' : `Mark ${activePassage.id} read & `}{nextPassage ? `begin Section ${getKenaSection(nextPassage.section)?.roman}` : 'open final review'} <ChevronRight size={17} /></button>
            </div>
          )}

          <div className="kena-next-preview"><span>{isLastInSection ? 'Pause here' : 'Coming next'}</span><p>{isLastInSection ? 'Recall the section’s main idea, then try its checkpoint.' : `${nextPassage.id} · ${nextPassage.title}`}</p></div>
          <footer className="kena-reader-controls">
            <button onClick={() => previousPassage && openPassage(previousPassage.id)} disabled={!previousPassage}><ChevronLeft size={18} /><span>Previous</span></button>
            <span className="kena-passage-position">{activeIndex + 1} / {kenaPassages.length}</span>
            <button className="kena-read-continue" onClick={markReadAndContinue}>
              {readSet.has(activePassage.id) ? <Check size={17} /> : <BookOpenText size={17} />}
              <span>{isLastInSection ? (readSet.has(activePassage.id) ? 'Checkpoint' : 'Mark read & check') : (readSet.has(activePassage.id) ? 'Continue' : 'Mark read & continue')}</span><ChevronRight size={17} />
            </button>
          </footer>
        </div>
      )}

      {mode === 'review' && (
        <KenaReview
          detail={detail}
          overviewCompleted={completed}
          editionCompleted={editionCompleted}
          depthReady={depthReady}
          readCount={readCount}
          checkpointCorrectCount={checkpointCorrectCount}
          reflection={reflection}
          selectedQuiz={selectedQuiz}
          checkpointAnswers={progress.checkpointAnswers}
          readIds={readIds}
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

function KenaMap({ readSet, progressPercent, lastPassageId, onOpenPassage, onOpenSection, onReview }: {
  readSet: Set<string>
  progressPercent: number
  lastPassageId?: string
  onOpenPassage: (id: string) => void
  onOpenSection: (section: KenaSection) => void
  onReview: () => void
}) {
  const unreadId = firstUnreadKenaPassage([...readSet])
  const resumeId = lastPassageId && validPassageIds.has(lastPassageId) && !readSet.has(lastPassageId)
    ? lastPassageId
    : unreadId ?? '1.1'
  const hasStarted = readSet.size > 0 || Boolean(lastPassageId && validPassageIds.has(lastPassageId))

  return (
    <div className="kena-map-page">
      <section className="kena-map-hero">
        <div>
          <span className="kicker">KENA UPANIṢAD · COMPLETE READER</span>
          <h1>What makes knowing possible?</h1>
          <p>A student asks what lets us think, speak, breathe, see, and hear. A teacher replies; a story about the gods brings the question to life.</p>
          <div className="kena-map-actions">
            <button className="primary-button" onClick={() => unreadId ? onOpenPassage(resumeId) : onReview()}>{!unreadId ? 'Continue to review' : hasStarted ? `Resume at ${resumeId}` : 'Begin with 1.1'} <ChevronRight size={17} /></button>
            <span>35 units · word-by-word Sanskrit · progress stays on this device</span>
          </div>
        </div>
        <div className="kena-progress-orbit" style={{ background: `conic-gradient(var(--saffron) ${progressPercent * 3.6}deg, rgba(255,255,255,.34) 0deg)` }} role="progressbar" aria-label="Kena depth edition reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}>
          <div><strong>{progressPercent}%</strong><span>{readSet.size} / 35 read</span></div>
        </div>
      </section>

      <section className="kena-idea-map" aria-labelledby="kena-idea-map-title">
        <div className="kena-idea-intro"><span>START WITH THE QUESTION</span><h2 id="kena-idea-map-title">You can hear a sound. What makes hearing possible?</h2></div>
        <div className="kena-faculty-map" role="img" aria-label="Thinking, speaking, breathing, seeing, and hearing lead to the question: what enables these abilities?">
          <div className="kena-faculty-nodes"><span>mind</span><span>speech</span><span>breath</span><span>sight</span><span>hearing</span></div>
          <MoveRight size={24} aria-hidden="true" />
          <div className="kena-ground-node"><small>KENA · BY WHOM OR WHAT?</small><strong>What enables these abilities?</strong><span>The opening asks. The teacher replies.</span></div>
        </div>
      </section>

      <figure className="kena-story-illustration">
        <img src="./kena-yaksha-teaching-turn.jpg" alt="Manuscript-inspired teaching illustration: personified fire and wind pause before an untouched blade of grass while Indra questions and Umā teaches in the background" loading="lazy" decoding="async" />
        <figcaption><span>THE BLADE OF GRASS</span><strong>Power meets a limit it cannot explain away.</strong><p>An original teaching illustration of the narrative’s central turn—not a historical reconstruction or a substitute for the prose.</p></figcaption>
      </figure>

      <section className="kena-section-map" aria-labelledby="kena-four-movements">
        <div className="kena-section-map-heading"><span className="kicker">THE FOUR MOVEMENTS</span><h2 id="kena-four-movements">One argument becomes a story—and then a practice.</h2></div>
        <div className="kena-section-cards">
          {kenaSections.map((section) => {
            const passages = getKenaPassagesForSection(section.id)
            const complete = passages.filter((passage) => readSet.has(passage.id)).length
            return (
              <button key={section.id} onClick={() => onOpenSection(section)}>
                <span className="kena-section-card-number">{section.roman}</span>
                <small>{section.form}</small>
                <h3>{section.title}</h3>
                <p>{section.question}</p>
                <div><i><b style={{ width: `${(complete / passages.length) * 100}%` }} /></i><span>{complete}/{passages.length}</span></div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="kena-origin-grid">
        <article><span>TEXTUAL ADDRESS</span><h2>Sāmaveda → Talavakāra / Jaiminīya tradition → Kena</h2><p>The title comes from the opening word <em>kena</em>, “by whom?” Manuscript organizations vary, so this course uses passage numbers as a learning convenience rather than pretending every edition is arranged identically.</p></article>
        <article><span>HOW TO READ THIS EDITION</span><h2>Base text, course gloss, and interpretation stay separate.</h2><p>{kenaEditorialNote}</p></article>
      </section>

      <details className="kena-invocation">
        <summary><Sparkles size={17} /> Begin with the peace invocation <span>not counted among the 35 units</span></summary>
        <div><p lang="sa-Deva">{kenaInvocation.devanagari}</p><p lang="sa-Latn">{kenaInvocation.iast}</p><small>{kenaInvocation.note}</small><WordByWordStudy invocation passageId="kena-invocation" words={kenaInvocation.words} /></div>
      </details>
    </div>
  )
}

function KenaOpeningQuestions() {
  const [selected, setSelected] = useState(0)
  const question = kenaOpeningQuestions[selected]
  return (
    <section className="kena-opening-explorer" aria-labelledby="kena-opening-explorer-title">
      <span>Explore the four questions</span>
      <h2 id="kena-opening-explorer-title">Start with something you do every day.</h2>
      <p>Choose an ability to see how the student asks about it. Sight and hearing share the fourth question.</p>
      <div className="kena-question-options" role="group" aria-label="Choose a question from Kena 1.1">
        {kenaOpeningQuestions.map((item, index) => <button key={item.label} aria-pressed={selected === index} aria-controls="kena-opening-example" onClick={() => setSelected(index)}>{item.label}</button>)}
      </div>
      <div id="kena-opening-example" aria-live="polite" aria-atomic="true">
        <div className="kena-question-flow"><div><small>Familiar experience</small><p>{question.familiar}</p></div><MoveRight aria-hidden="true" /><div><small>The student’s question</small><p>{question.question}</p></div></div>
        <p className="kena-example-source" lang="sa-Deva">{question.source}</p>
        <p className="kena-example-iast" lang="sa-Latn">{question.iast}</p>
        <p className="kena-example-word">{question.word}</p>
      </div>
      <p className="kena-model-note">The arrow follows a change in the question. This is a reading aid, not a diagram of how the brain works.</p>
    </section>
  )
}

function KenaOpeningCheck({ lesson }: { lesson: NonNullable<typeof kenaOpeningLessons[string]> }) {
  const [answer, setAnswer] = useState<number>()
  const correct = answer === lesson.check.correct
  return (
    <section className="kena-opening-check" aria-labelledby="kena-opening-check-title">
      <span>A quick pause · optional practice</span>
      <h2 id="kena-opening-check-title">{lesson.check.question}</h2>
      <div className="quiz-choices">{lesson.check.choices.map((choice, index) => <button key={choice} aria-pressed={answer === index} className={answer === index ? `chosen ${correct ? 'correct' : ''}` : ''} onClick={() => setAnswer(index)}><i>{String.fromCharCode(65 + index)}</i><span>{choice}</span></button>)}</div>
      {answer !== undefined && <p className={`quiz-feedback ${correct ? 'success' : 'try-again'}`} role="status">{lesson.check.feedback[answer]}</p>}
      <details><summary>One idea to carry forward</summary><p>{lesson.takeaway}</p></details>
    </section>
  )
}

function KenaDiagram({ passage }: { passage: KenaPassage }) {
  if (passage.id === '1.2') {
    return (
      <figure className="kena-concept-figure faculty-figure">
        <figcaption><span>FOLLOW THE QUESTION</span><strong>From the sound to what enables hearing.</strong></figcaption>
        <div><span>heard sound</span><MoveRight size={18} /><span>hearing</span><MoveRight size={18} /><strong>“hearing of hearing”</strong></div>
        <p>In this course’s reading, “hearing of hearing” points to what makes the act of hearing possible. The phrase is not describing a second sound.</p>
      </figure>
    )
  }

  if (passage.id === '2.3') {
    return (
      <figure className="kena-concept-figure knowing-figure">
        <figcaption><span>THREE BANDS OF KNOWING</span><strong>Where does the paradox point?</strong></figcaption>
        <div><article><small>KNOWN</small><strong>An object I can describe</strong></article><article><small>UNKNOWN</small><strong>An object I may discover</strong></article><article><small>NON-POSSESSIVE</small><strong>The ground present in knowing</strong></article></div>
        <p>Kena refuses to place Brahman neatly in either of the first two bands.</p>
      </figure>
    )
  }

  if (passage.id === '3.2' || passage.id === '3.12') {
    return (
      <figure className="kena-concept-figure story-figure">
        <figcaption><span>THE STORY ARC</span><strong>Power learns where it comes from.</strong></figcaption>
        <ol><li>Victory</li><li>Claim</li><li>Agni</li><li>Vāyu</li><li>Indra</li><li>Umā</li><li>Recognition</li></ol>
        <p>Each failed attempt removes one layer of certainty until instruction becomes possible.</p>
      </figure>
    )
  }

  if (passage.id === '4.4') {
    return (
      <figure className="kena-concept-figure flash-figure">
        <figcaption><span>TWO INDICATIONS</span><strong>Images of swift manifestation.</strong></figcaption>
        <div><article><Zap size={22} /><small>COSMIC</small><strong>lightning flashes</strong><span>sudden · bright · swift</span></article><article><Eye size={22} /><small>EMBODIED</small><strong>the eye blinks</strong><span>immediate · brief · discontinuous</span></article></div>
        <p>The course reads the images’ suddenness as disclosure without possession; the passage itself supplies the comparisons.</p>
      </figure>
    )
  }

  return null
}

function CheckpointCard({ section, selected, onSelect, locked = false }: { section: KenaSection; selected?: number; onSelect: (answer: number) => void; locked?: boolean }) {
  const correct = selected === section.checkpoint.correct
  return (
    <section className="kena-checkpoint-card" id={`kena-checkpoint-${section.id}`} aria-labelledby={`kena-checkpoint-title-${section.id}`}>
      <div><span>SECTION {section.roman} · CHECKPOINT</span><h2 id={`kena-checkpoint-title-${section.id}`} tabIndex={-1}>{section.checkpoint.question}</h2></div>
      <details className="kena-checkpoint-recap"><summary>Review the section’s main idea</summary><p>{section.recap}</p></details>
      <div className="quiz-choices">{section.checkpoint.choices.map((choice, index) => {
        const chosen = selected === index
        const showCorrect = selected !== undefined && index === section.checkpoint.correct
        return <button key={choice} className={`${chosen ? 'chosen' : ''} ${showCorrect ? 'correct' : ''}`} aria-pressed={chosen} disabled={locked} onClick={() => onSelect(index)}><i>{String.fromCharCode(65 + index)}</i><span>{choice}</span>{showCorrect && <Check size={17} />}</button>
      })}</div>
      {selected !== undefined && <div className={`quiz-feedback ${correct ? 'success' : 'try-again'}`} role="status" aria-live="polite"><strong>{correct ? 'Yes—that is the section’s turn.' : 'Revisit the relationship, not just the vocabulary.'}</strong><p>{section.checkpoint.explanation}</p></div>}
    </section>
  )
}

function KenaReview({ detail, overviewCompleted, editionCompleted, depthReady, readCount, checkpointCorrectCount, reflection, selectedQuiz, checkpointAnswers, readIds, onCheckpointSelect, onReflectionChange, onQuizSelect, onComplete, onOpenPassage }: {
  detail: LessonDetail
  overviewCompleted: boolean
  editionCompleted: boolean
  depthReady: boolean
  readCount: number
  checkpointCorrectCount: number
  reflection: string
  selectedQuiz?: number
  checkpointAnswers: Record<string, number>
  readIds: string[]
  onCheckpointSelect: (sectionId: number, answer: number) => void
  onReflectionChange: (value: string) => void
  onQuizSelect: (answer: number) => void
  onComplete: () => void
  onOpenPassage: (id: string) => void
}) {
  const finalQuizCorrect = selectedQuiz === detail.quiz.correct
  const nextTask = nextKenaReviewTask({ readIds, checkpointAnswers }, finalQuizCorrect)
  const goToNextTask = () => {
    if (!nextTask) return
    if (nextTask.kind === 'passage') onOpenPassage(nextTask.id)
    else focusLearningSection(nextTask.kind === 'checkpoint' ? nextTask.id.replace('checkpoint-', 'checkpoint-title-') : nextTask.id)
  }
  return (
    <div className="kena-review-page">
      <section className="kena-review-hero">
        <div><span className="kicker">REVIEW · CONNECT THE IDEAS</span><h1>Can you explain Kena in your own words?</h1><p>Recall the opening question, the teacher’s reply, the gods’ mistake, and the practices that close the text.</p>{nextTask && !editionCompleted && <button className="primary-button" onClick={goToNextTask}>{nextTask.label} <ChevronRight size={17} /></button>}</div>
        <div className="kena-completion-list" aria-label="Kena depth edition completion requirements">
          <div className={readCount === 35 ? 'done' : ''}>{readCount === 35 ? <CheckCircle2 /> : <BookOpenText />}<span><strong>{readCount} / 35</strong><small>passages read</small></span></div>
          <div className={checkpointCorrectCount === 4 ? 'done' : ''}>{checkpointCorrectCount === 4 ? <CheckCircle2 /> : <Compass />}<span><strong>{checkpointCorrectCount} / 4</strong><small>section checks</small></span></div>
          <div className={finalQuizCorrect ? 'done' : ''}>{finalQuizCorrect ? <CheckCircle2 /> : <Lightbulb />}<span><strong>{finalQuizCorrect ? 'Ready' : 'Pending'}</strong><small>final synthesis</small></span></div>
        </div>
      </section>

      {overviewCompleted && !editionCompleted && <div className="kena-prior-progress"><strong>Your earlier overview completion is preserved.</strong><p>This 35-unit depth edition has its own checklist, so it has not been silently marked as read.</p></div>}

      <section className="kena-review-summary" aria-labelledby="kena-review-summary-title">
        <span className="kicker">THE WHOLE MOVEMENT</span>
        <h2 id="kena-review-summary-title">From faculty → to humility → to revelation → to practice.</h2>
        <div><article><strong>I</strong><span>What enables knowing?</span></article><MoveRight /><article><strong>II</strong><span>Knowing without possession</span></article><MoveRight /><article><strong>III</strong><span>Power humbled</span></article><MoveRight /><article><strong>IV</strong><span>Insight embodied</span></article></div>
      </section>

      <div className="kena-review-checkpoints">
        {kenaSections.map((section) => <CheckpointCard key={section.id} section={section} selected={checkpointAnswers[String(section.id)]} onSelect={(answer) => onCheckpointSelect(section.id, answer)} locked={editionCompleted} />)}
      </div>

      <section className="kena-final-reflection">
        <div><span>OPTIONAL REFLECTION</span><h2>Where do you confuse a real capacity with independent ownership?</h2><p>Use the gods’ mistake as a mirror. Your note is saved only in this browser and is not required for completion.</p></div>
        <label className="reflection-field"><span>Your private note · saved on this device</span><textarea value={reflection} onChange={(event) => onReflectionChange(event.target.value)} placeholder="A capacity I value is… What it depends on is…" rows={7} /></label>
      </section>

      <section className="kena-final-quiz" aria-labelledby="kena-final-quiz-title">
        <span>FINAL SYNTHESIS</span>
        <h2 id="kena-final-quiz-title" tabIndex={-1}>{detail.quiz.question}</h2>
        <div className="quiz-choices">{detail.quiz.choices.map((choice, index) => {
          const chosen = selectedQuiz === index
          const showCorrect = selectedQuiz !== undefined && index === detail.quiz.correct
          return <button key={choice} className={`${chosen ? 'chosen' : ''} ${showCorrect ? 'correct' : ''}`} aria-pressed={chosen} disabled={editionCompleted} onClick={() => onQuizSelect(index)}><i>{String.fromCharCode(65 + index)}</i><span>{choice}</span>{showCorrect && <Check size={17} />}</button>
        })}</div>
        {selectedQuiz !== undefined && <div className={`quiz-feedback ${finalQuizCorrect ? 'success' : 'try-again'}`} role="status" aria-live="polite"><strong>{finalQuizCorrect ? 'You have the central movement.' : 'Return to the opening question.'}</strong><p>{detail.quiz.explanation}</p></div>}
        <div className="kena-complete-action">
          <button className="primary-button" disabled={!depthReady || editionCompleted} onClick={onComplete}>{editionCompleted ? 'Depth edition completed' : depthReady ? 'Complete the Kena edition' : 'Finish the three checks above'} <CheckCircle2 size={17} /></button>
          {nextTask && !editionCompleted && <button className="quiet-button" onClick={goToNextTask}>{nextTask.label}</button>}
        </div>
      </section>

      <section className="kena-sources" aria-labelledby="kena-sources-title">
        <div><span>TEXT & EDITORIAL SOURCES</span><h2 id="kena-sources-title">Know what layer you are reading.</h2><p>{kenaEditorialNote}</p></div>
        <div>{kenaSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span><strong>{source.label}</strong><small>{source.use}</small></span><ExternalLink size={16} /></a>)}</div>
        <p className="kena-license-note">The Sanskrit and IAST text layers are adapted from “केनोपनिषद्” by Sanskrit Wikisource contributors (source linked above); spacing, punctuation, transliteration, and learning-unit segmentation have been changed. Those adapted text layers are licensed under CC BY-SA 4.0 (license linked above). Word-by-word meanings and grammar cues, course paraphrases, teaching notes, diagrams, and questions are original editorial material. No copyrighted modern translation is reproduced.</p>
      </section>
    </div>
  )
}
