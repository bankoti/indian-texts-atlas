import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookOpenText,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Layers3,
  LibraryBig,
  Map,
  Menu,
  NotebookPen,
  Route,
  Sparkles,
  X,
} from 'lucide-react'
import {
  courseLessons,
  lessonDetails,
  referenceSources,
  rootBranches,
  type CourseLesson,
  type LessonDetail,
} from './courseData'
import './App.css'

type View = 'atlas' | 'path' | 'notebook' | 'reference'

type ProgressState = {
  completed: string[]
  reflections: Record<string, string>
  quizAnswers: Record<string, number>
}

const emptyProgress: ProgressState = { completed: [], reflections: {}, quizAnswers: {} }

const lessonSteps = [
  { id: 'locate', label: 'Locate' },
  { id: 'read', label: 'Read' },
  { id: 'unpack', label: 'Unpack' },
  { id: 'compare', label: 'Compare' },
  { id: 'reflect', label: 'Reflect' },
  { id: 'remember', label: 'Remember' },
]

function readStoredProgress(): ProgressState {
  try {
    const stored = window.localStorage.getItem('indian-texts-atlas-progress-v1')
    return stored ? { ...emptyProgress, ...JSON.parse(stored) } : emptyProgress
  } catch {
    return emptyProgress
  }
}

function viewFromHash(): View {
  const value = window.location.hash.replace('#', '').split('/')[0]
  return value === 'path' || value === 'notebook' || value === 'reference' || value === 'lesson' ? (value === 'lesson' ? 'path' : value) : 'atlas'
}

function lessonFromHash(): string | null {
  const [kind, id] = window.location.hash.replace('#', '').split('/')
  return kind === 'lesson' && id ? id : null
}

function App() {
  const [view, setView] = useState<View>(viewFromHash)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeBranch, setActiveBranch] = useState('shruti')
  const [activeLessonId, setActiveLessonId] = useState<string | null>(lessonFromHash)
  const [progress, setProgress] = useState<ProgressState>(readStoredProgress)

  useEffect(() => {
    window.localStorage.setItem('indian-texts-atlas-progress-v1', JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    const handleHashChange = () => {
      setView(viewFromHash())
      setActiveLessonId(lessonFromHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (next: View) => {
    setView(next)
    setActiveLessonId(null)
    setMenuOpen(false)
    window.location.hash = next
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openLesson = (id: string) => {
    setView('path')
    setActiveLessonId(id)
    window.location.hash = `lesson/${id}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateReflection = (id: string, value: string) => {
    setProgress((current) => ({ ...current, reflections: { ...current.reflections, [id]: value } }))
  }

  const selectQuiz = (id: string, answer: number) => {
    setProgress((current) => ({ ...current, quizAnswers: { ...current.quizAnswers, [id]: answer } }))
  }

  const completeLesson = (id: string) => {
    setProgress((current) => current.completed.includes(id) ? current : { ...current, completed: [...current.completed, id] })
  }

  const activeLesson = activeLessonId ? courseLessons.find((item) => item.id === activeLessonId) ?? null : null

  return (
    <div className="app-shell">
      <Header view={view} menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} />

      {menuOpen && (
        <nav className="mobile-menu" aria-label="Mobile course navigation">
          <button onClick={() => navigate('atlas')}>Explore the atlas <Map size={18} /></button>
          <button onClick={() => navigate('path')}>Follow the learning path <Route size={18} /></button>
          <button onClick={() => navigate('notebook')}>Open your notebook <NotebookPen size={18} /></button>
          <button onClick={() => navigate('reference')}>Browse references <BookMarked size={18} /></button>
        </nav>
      )}

      <main>
        {activeLesson ? (
          <LessonView
            key={activeLesson.id}
            lesson={activeLesson}
            detail={lessonDetails[activeLesson.id]}
            completed={progress.completed.includes(activeLesson.id)}
            reflection={progress.reflections[activeLesson.id] ?? ''}
            selectedQuiz={progress.quizAnswers[activeLesson.id]}
            onReflectionChange={(value) => updateReflection(activeLesson.id, value)}
            onQuizSelect={(answer) => selectQuiz(activeLesson.id, answer)}
            onComplete={() => completeLesson(activeLesson.id)}
            onClose={() => navigate('path')}
          />
        ) : (
          <>
            {view === 'atlas' && <AtlasView activeBranch={activeBranch} setActiveBranch={setActiveBranch} navigate={navigate} openLesson={openLesson} />}
            {view === 'path' && <PathView completed={progress.completed} openLesson={openLesson} />}
            {view === 'notebook' && <NotebookView progress={progress} updateReflection={updateReflection} openLesson={openLesson} />}
            {view === 'reference' && <ReferenceView />}
          </>
        )}
      </main>

      {!activeLesson && <SiteFooter navigate={navigate} />}

      {!activeLesson && (
        <nav className="bottom-nav" aria-label="Course navigation">
          <button className={view === 'atlas' ? 'active' : ''} onClick={() => navigate('atlas')}><Map size={19} /><span>Atlas</span></button>
          <button className={view === 'path' ? 'active' : ''} onClick={() => navigate('path')}><Route size={19} /><span>Path</span></button>
          <button className={view === 'notebook' ? 'active' : ''} onClick={() => navigate('notebook')}><NotebookPen size={19} /><span>Notes</span></button>
          <button className={view === 'reference' ? 'active' : ''} onClick={() => navigate('reference')}><BookMarked size={19} /><span>Sources</span></button>
        </nav>
      )}
    </div>
  )
}

function Header({ view, menuOpen, setMenuOpen, navigate }: {
  view: View
  menuOpen: boolean
  setMenuOpen: (value: boolean | ((current: boolean) => boolean)) => void
  navigate: (view: View) => void
}) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => navigate('atlas')} aria-label="Go to course atlas">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span><strong>Indian Texts Atlas</strong><small>an evolving course</small></span>
      </button>
      <nav className="desktop-nav" aria-label="Course navigation">
        <button className={view === 'atlas' ? 'active' : ''} onClick={() => navigate('atlas')}>Atlas</button>
        <button className={view === 'path' ? 'active' : ''} onClick={() => navigate('path')}>Learning path</button>
        <button className={view === 'notebook' ? 'active' : ''} onClick={() => navigate('notebook')}>Notebook</button>
        <button className={view === 'reference' ? 'active' : ''} onClick={() => navigate('reference')}>References</button>
      </nav>
      <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
    </header>
  )
}

function AtlasView({ activeBranch, setActiveBranch, navigate, openLesson }: {
  activeBranch: string
  setActiveBranch: (id: string) => void
  navigate: (view: View) => void
  openLesson: (id: string) => void
}) {
  const branch = useMemo(() => rootBranches.find((item) => item.id === activeBranch) ?? rootBranches[0], [activeBranch])

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> Start at the roots</div>
          <h1>A living map of India’s ancient texts.</h1>
          <p className="hero-intro">Learn how traditions relate, where the Upaniṣads belong, and what questions each text asks—without pretending there is only one canon or interpretation.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => openLesson('course-0')}>Begin with Course 0 <ArrowRight size={18} /></button>
            <button className="quiet-button" onClick={() => navigate('path')}>View the whole path</button>
          </div>
          <div className="hero-stats" aria-label="Course statistics">
            <div><strong>4</strong><span>Vedas mapped</span></div>
            <div><strong>13</strong><span>principal Upaniṣads</span></div>
            <div><strong>4</strong><span>interactive lessons live</span></div>
          </div>
        </div>
        <div className="root-orbit" aria-label="A visual map connecting ancient Indian textual traditions">
          <div className="orbit-ring ring-one" />
          <div className="orbit-ring ring-two" />
          <div className="orbit-node node-a">Śruti</div>
          <div className="orbit-node node-b">Smṛti</div>
          <div className="orbit-node node-c">Darśana</div>
          <div className="orbit-node node-d">Many voices</div>
          <div className="orbit-center"><BookOpenText size={26} /><span>Begin<br />with context</span></div>
        </div>
      </section>

      <section className="atlas-section">
        <div className="section-heading">
          <div><span className="kicker">01 · THE ROOT MAP</span><h2>Three maps intersect here</h2></div>
          <p><strong>Authority</strong> (Śruti/Smṛti), <strong>genre</strong> (Itihāsa/Purāṇa), and <strong>school</strong> (Darśana) are different organizing ideas. Flattening them into one tree creates false certainty.</p>
        </div>

        <div className="atlas-workspace">
          <div className="branch-list" role="tablist" aria-label="Textual traditions">
            {rootBranches.map((item) => (
              <button key={item.id} className={`branch-tab ${item.id === activeBranch ? 'active' : ''}`} onClick={() => setActiveBranch(item.id)} role="tab" aria-selected={item.id === activeBranch}>
                <span className={`branch-dot ${item.tone}`} />
                <span><small>{item.eyebrow}</small><strong>{item.title}</strong></span>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
          <article className={`branch-detail ${branch.tone}`}>
            <span className="detail-eyebrow">{branch.eyebrow}</span>
            <h3>{branch.title}</h3>
            <p>{branch.description}</p>
            <div className="node-grid">
              {branch.nodes.map((node, index) => (
                <div className="node-card" key={node}><span>{String(index + 1).padStart(2, '0')}</span><strong>{node}</strong><small>{branch.subnodes[index]}</small></div>
              ))}
            </div>
            <div className="sequence-note"><Layers3 size={17} /><span>Keep in view</span><strong>{branch.note}</strong></div>
          </article>
        </div>
      </section>

      <section className="path-preview">
        <div className="section-heading compact">
          <div><span className="kicker">02 · START WITH CONTEXT</span><h2>Course 0, then the Upaniṣadic questions</h2></div>
          <button className="text-button" onClick={() => navigate('path')}>See the full path <ArrowRight size={17} /></button>
        </div>
        <div className="lesson-grid">
          {courseLessons.slice(0, 4).map((lesson) => <LessonCard lesson={lesson} key={lesson.id} onOpen={() => openLesson(lesson.id)} />)}
        </div>
      </section>

      <section className="cover-section">
        <img src="./og.png" alt="Indian Texts Atlas cover with archival manuscript textures and branching knowledge-map lines" />
        <div><span className="kicker">THE COURSE PROMISE</span><h2>Context before conclusions.</h2><p>Every lesson separates the base text, historical questions, later commentary, and living interpretations. Sanskrit terms stay visible when one English word would conceal a real debate.</p></div>
      </section>
    </>
  )
}

function PathView({ completed, openLesson }: { completed: string[]; openLesson: (id: string) => void }) {
  const available = courseLessons.filter((item) => item.status === 'available')
  const progress = Math.round((completed.length / available.length) * 100)
  return (
    <section className="course-view">
      <div className="course-hero">
        <div><span className="kicker">COURSE 0 + THE FIRST LEARNING PATH</span><h1>See the landscape before entering a text.</h1><p>Course 0 explains how authority, genre, textual layer, and philosophical school connect. Then a pedagogical path moves through thirteen principal Upaniṣads. Four lessons are fully interactive now; the remaining ten are mapped for the next releases.</p></div>
        <div className="progress-medallion"><strong>{progress}%</strong><span>of live lessons<br />completed</span></div>
      </div>
      <div className="path-legend"><span><i className="legend-live" /> Interactive now</span><span><i className="legend-mapped" /> Mapped next</span></div>
      <div className="full-path">
        {courseLessons.map((lesson) => (
          <LessonCard lesson={lesson} key={lesson.id} onOpen={() => openLesson(lesson.id)} completed={completed.includes(lesson.id)} />
        ))}
      </div>
    </section>
  )
}

function LessonCard({ lesson, onOpen, completed = false }: { lesson: CourseLesson; onOpen: () => void; completed?: boolean }) {
  return (
    <article className={`lesson-card ${lesson.status} ${lesson.id === 'course-0' ? 'foundation' : ''}`}>
      <div className="lesson-number">{String(lesson.order).padStart(2, '0')}</div>
      <div className="lesson-body">
        <span>{lesson.veda} · {lesson.form}</span>
        <h3>{lesson.title}</h3>
        <p className="lesson-question">{lesson.question}</p>
        <p>{lesson.insight}</p>
        <div className="lesson-meta-row">
          <span>{lesson.status === 'available' ? `${lesson.minutes} min · interactive` : 'Course map ready'}</span>
          {completed && <span className="complete-label"><CheckCircle2 size={14} /> Completed</span>}
        </div>
      </div>
      <button onClick={onOpen} aria-label={`Open ${lesson.title}`}><ArrowRight size={17} /></button>
    </article>
  )
}

function LessonView({ lesson, detail, completed, reflection, selectedQuiz, onReflectionChange, onQuizSelect, onComplete, onClose }: {
  lesson: CourseLesson
  detail?: LessonDetail
  completed: boolean
  reflection: string
  selectedQuiz?: number
  onReflectionChange: (value: string) => void
  onQuizSelect: (answer: number) => void
  onComplete: () => void
  onClose: () => void
}) {
  const [step, setStep] = useState(0)
  const isFoundation = lesson.id === 'course-0'

  if (!detail) {
    return (
      <section className="mapped-lesson">
        <button className="back-button" onClick={onClose}><ArrowLeft size={17} /> Back to the path</button>
        <div className="mapped-card">
          <span className="mapped-badge">Mapped for the next release</span>
          <small>{lesson.veda} · {lesson.form}</small>
          <h1>{lesson.title}</h1>
          <p className="mapped-question">{lesson.question}</p>
          <p>{lesson.insight}</p>
          <div className="reference-strip"><strong>Passage anchors</strong>{lesson.references.map((reference) => <span key={reference}>{reference}</span>)}</div>
          <button className="primary-button" onClick={onClose}>Continue exploring <ArrowRight size={17} /></button>
        </div>
      </section>
    )
  }

  const correct = selectedQuiz === detail.quiz.correct
  const panelCopy = isFoundation ? {
    locate: ['FOUNDATION · ORIENT', 'See the whole landscape.'],
    read: ['READ THE CONNECTION MAP', 'Three organizing axes intersect.'],
    unpack: ['UNPACK THE CATEGORIES', 'Learn what each label is doing.'],
    compare: ['COMPARE THE LANDSCAPES', 'No single branch contains the whole.'],
    reflect: ['REFLECT BEFORE READING', 'Notice the map you brought with you.'],
    remember: ['REMEMBER THE MAP', 'Check the connections.'],
  } : {
    locate: ['LOCATE IN THE TRADITION', 'First, know where you are.'],
    read: ['READ A PASSAGE CLUSTER', 'Stay close to the text.'],
    unpack: ['UNPACK KEY IDEAS', 'Keep difficult words visible.'],
    compare: ['COMPARE INTERPRETIVE LENSES', 'A text can sustain disagreement.'],
    reflect: ['REFLECT', 'Bring the question into your life.'],
    remember: ['REMEMBER', 'Check the shape of the idea.'],
  }

  return (
    <section className="lesson-player">
      <header className="lesson-player-header">
        <button className="back-button" onClick={onClose}><ArrowLeft size={17} /> Path</button>
        <div><small>Lesson {String(lesson.order).padStart(2, '0')} · {lesson.veda}</small><strong>{lesson.title}</strong></div>
        <span>{completed ? <><CheckCircle2 size={15} /> Complete</> : `${step + 1} / ${lessonSteps.length}`}</span>
      </header>

      <nav className="step-rail" aria-label="Lesson steps">
        {lessonSteps.map((item, index) => (
          <button key={item.id} className={index === step ? 'active' : index < step ? 'visited' : ''} onClick={() => setStep(index)} aria-current={index === step ? 'step' : undefined}>
            <i>{index < step || completed ? <Check size={12} /> : index + 1}</i><span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="lesson-content">
        {step === 0 && (
          <LessonPanel kicker={panelCopy.locate[0]} title={panelCopy.locate[1]} icon={<Map size={22} />}>
            <div className="location-chain">{detail.locate.corpus.split(' → ').map((item, index) => <span key={item}>{index > 0 && <ChevronRight size={15} />}{item}</span>)}</div>
            <div className="reading-block"><h3>Placement</h3><p>{detail.locate.placement}</p></div>
            <div className="reading-block"><h3>Context</h3><p>{detail.locate.context}</p></div>
          </LessonPanel>
        )}
        {step === 1 && (
          <LessonPanel kicker={panelCopy.read[0]} title={panelCopy.read[1]} icon={<BookOpenText size={22} />}>
            <div className="passage-anchor">{detail.read.anchorLabel ?? 'Passage anchor'} · {detail.read.anchor}</div>
            {isFoundation && (
              <div className="course-zero-map" aria-label="Three intersecting ways to locate a text">
                <article><small>01 · AUTHORITY</small><strong>How is it regarded?</strong><span>Śruti ↔ Smṛti</span></article>
                <i aria-hidden="true">×</i>
                <article><small>02 · GENRE</small><strong>What kind of work is it?</strong><span>Upaniṣad · Itihāsa · Purāṇa · more</span></article>
                <i aria-hidden="true">×</i>
                <article><small>03 · RECEPTION</small><strong>Who interprets it?</strong><span>Schools · lineages · communities</span></article>
              </div>
            )}
            <p className="large-reading">{detail.read.paraphrase}</p>
            <div className="interpretation-note"><strong>Reading note</strong><p>{detail.read.readingNote}</p></div>
          </LessonPanel>
        )}
        {step === 2 && (
          <LessonPanel kicker={panelCopy.unpack[0]} title={panelCopy.unpack[1]} icon={<LibraryBig size={22} />}>
            <div className="concept-list">{detail.concepts.map((concept) => <article key={concept.term}><h3>{concept.term}</h3><p>{concept.meaning}</p></article>)}</div>
          </LessonPanel>
        )}
        {step === 3 && (
          <LessonPanel kicker={panelCopy.compare[0]} title={panelCopy.compare[1]} icon={<Layers3 size={22} />}>
            <div className="lens-grid">{detail.lenses.map((lens, index) => <article key={lens.name}><span>0{index + 1}</span><h3>{lens.name}</h3><p>{lens.reading}</p></article>)}</div>
          </LessonPanel>
        )}
        {step === 4 && (
          <LessonPanel kicker={panelCopy.reflect[0]} title={panelCopy.reflect[1]} icon={<NotebookPen size={22} />}>
            <p className="reflection-prompt">{detail.reflection}</p>
            <label className="reflection-field"><span>Your private note · saved on this device</span><textarea value={reflection} onChange={(event) => onReflectionChange(event.target.value)} placeholder="Write without trying to sound philosophical…" rows={7} /></label>
          </LessonPanel>
        )}
        {step === 5 && (
          <LessonPanel kicker={panelCopy.remember[0]} title={panelCopy.remember[1]} icon={<CheckCircle2 size={22} />}>
            <p className="quiz-question">{detail.quiz.question}</p>
            <div className="quiz-choices">{detail.quiz.choices.map((choice, index) => {
              const chosen = selectedQuiz === index
              const showCorrect = selectedQuiz !== undefined && index === detail.quiz.correct
              return <button key={choice} className={`${chosen ? 'chosen' : ''} ${showCorrect ? 'correct' : ''}`} onClick={() => onQuizSelect(index)}><i>{String.fromCharCode(65 + index)}</i><span>{choice}</span>{showCorrect && <Check size={17} />}</button>
            })}</div>
            {selectedQuiz !== undefined && <div className={`quiz-feedback ${correct ? 'success' : 'try-again'}`}><strong>{correct ? (isFoundation ? 'That connection is right.' : 'That is the central move.') : 'Look once more at the distinction.'}</strong><p>{detail.quiz.explanation}</p></div>}
            {correct && <button className="primary-button complete-button" onClick={onComplete}>{completed ? 'Lesson completed' : 'Mark lesson complete'} <CheckCircle2 size={17} /></button>}
            <div className="lesson-source-links"><strong>Continue with sources</strong>{detail.sourceLinks.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={14} /></a>)}</div>
          </LessonPanel>
        )}
      </div>

      <footer className="lesson-controls">
        <button onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}><ChevronLeft size={18} /> Previous</button>
        <span>{lessonSteps[step].label}</span>
        {step < lessonSteps.length - 1 ? <button className="next-step" onClick={() => setStep((current) => Math.min(lessonSteps.length - 1, current + 1))}>Next <ChevronRight size={18} /></button> : <button className="next-step" onClick={onClose}>Return to path <ChevronRight size={18} /></button>}
      </footer>
    </section>
  )
}

function LessonPanel({ kicker, title, icon, children }: { kicker: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <article className="lesson-panel"><div className="panel-title"><div>{icon}</div><span className="kicker">{kicker}</span><h2>{title}</h2></div><div className="panel-body">{children}</div></article>
}

function NotebookView({ progress, updateReflection, openLesson }: { progress: ProgressState; updateReflection: (id: string, value: string) => void; openLesson: (id: string) => void }) {
  const liveLessons = courseLessons.filter((lesson) => lesson.status === 'available')
  return (
    <section className="notebook-page">
      <div className="course-hero notebook-hero">
        <div><span className="kicker">YOUR NOTEBOOK</span><h1>Questions worth carrying.</h1><p>Reflections stay in this browser on this device. They are never uploaded by the course.</p></div>
        <div className="notebook-count"><strong>{progress.completed.length}</strong><span>of {liveLessons.length}<br />live lessons complete</span></div>
      </div>
      <div className="notebook-grid">
        {liveLessons.map((lesson) => (
          <article className="note-card" key={lesson.id}>
            <header><div><small>{lesson.veda}</small><h2>{lesson.title}</h2></div>{progress.completed.includes(lesson.id) && <CheckCircle2 size={20} />}</header>
            <p>{lessonDetails[lesson.id].reflection}</p>
            <textarea value={progress.reflections[lesson.id] ?? ''} onChange={(event) => updateReflection(lesson.id, event.target.value)} placeholder="Your reflection will appear here…" rows={5} />
            <button onClick={() => openLesson(lesson.id)}>Return to lesson <ArrowRight size={16} /></button>
          </article>
        ))}
      </div>
    </section>
  )
}

function ReferenceView() {
  const vedas = [
    { name: 'Ṛgveda', texts: 'Aitareya · Kauṣītaki' },
    { name: 'Sāmaveda', texts: 'Kena · Chāndogya' },
    { name: 'Śukla Yajurveda', texts: 'Īśā · Bṛhadāraṇyaka' },
    { name: 'Kṛṣṇa Yajurveda', texts: 'Kaṭha · Taittirīya · Śvetāśvatara · Maitrī' },
    { name: 'Atharvaveda', texts: 'Muṇḍaka · Māṇḍūkya · Praśna' },
  ]
  return (
    <section className="reference-page">
      <div className="course-hero">
        <div><span className="kicker">REFERENCE DESK</span><h1>What the map can—and cannot—claim.</h1><p>Canon, dating, translation, and interpretation are genuinely disputed. The course surfaces those disputes instead of manufacturing one tidy answer.</p></div>
        <BookMarked size={58} strokeWidth={1.1} />
      </div>

      <div className="guardrail-grid">
        <article><strong>Not one fixed canon</strong><p>Ten texts are commonly privileged in Vedānta, thirteen make a useful early foundation, the later Muktikā lists 108, and hundreds more use the title Upaniṣad.</p></article>
        <article><strong>Dates are approximate</strong><p>Historical dates describe periods of oral composition and redaction, often with several strata—not modern publication dates or single known authors.</p></article>
        <article><strong>Translation is interpretation</strong><p>Ātman, brahman, dharma, tapas, and yoga do not each have one context-free English equivalent. Named translations matter.</p></article>
        <article><strong>Living traditions differ</strong><p>Advaita, Viśiṣṭādvaita, Dvaita, and other lineages may draw sharply different conclusions from the same passage.</p></article>
      </div>

      <div className="reference-section">
        <div><span className="kicker">VEDIC AFFILIATIONS</span><h2>Where the thirteen are placed</h2></div>
        <div className="veda-table">{vedas.map((veda) => <div key={veda.name}><strong>{veda.name}</strong><span>{veda.texts}</span></div>)}</div>
      </div>

      <div className="reference-section source-section">
        <div><span className="kicker">PUBLIC SOURCE STACK</span><h2>Follow the scholarship</h2><p>Course summaries are orientation. Use these sources to inspect texts, translations, and academic context directly.</p></div>
        <div className="source-list">{referenceSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><div><strong>{source.label}</strong><span>{source.use}</span></div><ExternalLink size={17} /></a>)}</div>
      </div>
    </section>
  )
}

function SiteFooter({ navigate }: { navigate: (view: View) => void }) {
  return (
    <footer className="site-footer">
      <div><Compass size={17} /><span>Built as a map, studied as a conversation.</span></div>
      <button onClick={() => navigate('reference')}>Sources & editorial approach</button>
    </footer>
  )
}

export default App
