import { Component, lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
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
  courseSections,
  lessonDetails,
  referenceSources,
  rootBranches,
  type CourseLesson,
  type LessonDetail,
} from './courseData'
import {
  getDepthEditionDescriptor,
  isDepthEdition,
  isValidDepthPassageId,
} from './depthEditionRegistry'
import type { DepthEditionId } from './depthEditionRegistry'
import type { DepthEditionProgress, DepthEditionProgressMap } from './depthEditionTypes'
import './App.css'

const KenaDepthLessonView = lazy(() => import('./KenaDepthLessonView'))
const KathaDepthLessonView = lazy(() => import('./KathaDepthLessonView'))
const IshaDepthLessonView = lazy(() => import('./IshaDepthLessonView'))
const depthEditionReaders = {
  kena: KenaDepthLessonView,
  katha: KathaDepthLessonView,
  isha: IshaDepthLessonView,
} satisfies Record<DepthEditionId, typeof KenaDepthLessonView>

class DepthEditionErrorBoundary extends Component<{ children: ReactNode; lessonTitle: string; onClose: () => void }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section className="lesson-player kena-load-error" role="alert">
        <div>
          <BookOpenText size={28} />
          <h1>The {this.props.lessonTitle} reader did not finish loading.</h1>
          <p>Your saved progress is safe. Check your connection and try once more.</p>
          <button className="primary-button" onClick={() => window.location.reload()}>Reload reader</button>
          <button className="quiet-button" onClick={this.props.onClose}>Return to the path</button>
        </div>
      </section>
    )
  }
}

type View = 'atlas' | 'path' | 'notebook' | 'reference'

type ProgressState = {
  completed: string[]
  reflections: Record<string, string>
  quizAnswers: Record<string, number>
  quizVersions: Record<string, number>
  depthEditions: DepthEditionProgressMap
}

const emptyDepthProgress: DepthEditionProgress = { readIds: [], checkpointAnswers: {} }
const emptyProgress: ProgressState = { completed: [], reflections: {}, quizAnswers: {}, quizVersions: {}, depthEditions: {} }
const lessonIdSet = new Set(courseLessons.map((lesson) => lesson.id))
const currentQuizVersions: Record<string, number> = { isha: 2 }

function lessonIsComplete(id: string, completed: string[], depthEditions: DepthEditionProgressMap) {
  return isDepthEdition(id) ? depthEditions[id]?.completed === true : completed.includes(id)
}

function canPersistProgress() {
  const probeKey = 'indian-texts-atlas-storage-probe'
  try {
    window.localStorage.setItem(probeKey, '1')
    window.localStorage.removeItem(probeKey)
    return true
  } catch {
    return false
  }
}

const lessonSteps = [
  { id: 'locate', label: 'Locate' },
  { id: 'read', label: 'Read' },
  { id: 'unpack', label: 'Unpack' },
  { id: 'compare', label: 'Compare' },
  { id: 'reflect', label: 'Reflect' },
  { id: 'remember', label: 'Remember' },
]

const courseZeroSteps = [
  { id: 'landscape', label: 'Landscape' },
  { id: 'coordinates', label: '3 questions' },
  { id: 'vedic-family', label: 'Vedic family' },
  { id: 'upanishads', label: 'Upaniṣads' },
  { id: 'rebuild', label: 'Rebuild' },
  { id: 'checkpoint', label: 'Checkpoint' },
]

const courseZeroFamilies = [
  {
    title: 'Veda-oriented and Brahmanical-Hindu worlds',
    text: 'Vedas, epics, Purāṇas, Dharma texts, philosophical schools, and many later devotional and scholarly works.',
  },
  {
    title: 'Buddhist textual traditions',
    text: 'Different Buddhist communities preserved their own canons, teachings, commentaries, and philosophical debates.',
  },
  {
    title: 'Jain textual traditions',
    text: 'Jain communities preserved distinct scriptures, narratives, philosophy, ethics, and commentarial traditions.',
  },
  {
    title: 'Languages and regions cross the boundaries',
    text: 'Sanskrit, Pali, Prakrit, Tamil, and other languages carry works from several traditions. A language is not a religion.',
  },
]

const vedicLayers = [
  { name: 'Saṃhitā', plain: 'Hymns, chants, and ritual formulas', note: 'The core collections associated with each Veda.' },
  { name: 'Brāhmaṇa', plain: 'Ritual explanation', note: 'Prose that explains actions, meanings, and correspondences.' },
  { name: 'Āraṇyaka', plain: '“Forest” reflection', note: 'Ritual and cosmology are re-read in more inward or esoteric ways.' },
  { name: 'Upaniṣad', plain: 'Philosophical inquiry', note: 'Sustained questions about self, reality, knowledge, action, and liberation.' },
]

const upanishadVedaFamilies = [
  { veda: 'Ṛgveda', texts: 'Aitareya · Kauṣītaki' },
  { veda: 'Sāmaveda', texts: 'Kena · Chāndogya' },
  { veda: 'Śukla Yajurveda', texts: 'Īśā · Bṛhadāraṇyaka' },
  { veda: 'Kṛṣṇa Yajurveda', texts: 'Kaṭha · Taittirīya · Śvetāśvatara · Maitrī' },
  { veda: 'Atharvaveda', texts: 'Muṇḍaka · Māṇḍūkya · Praśna' },
]

function readStoredProgress(): ProgressState {
  try {
    const stored = window.localStorage.getItem('indian-texts-atlas-progress-v1')
    if (!stored) return emptyProgress
    const parsed: unknown = JSON.parse(stored)
    if (!parsed || typeof parsed !== 'object') return emptyProgress
    const data = parsed as Partial<ProgressState>
    const reflections = data.reflections && typeof data.reflections === 'object'
      ? Object.fromEntries(Object.entries(data.reflections).filter((entry): entry is [string, string] => lessonIdSet.has(entry[0]) && typeof entry[1] === 'string'))
      : {}
    const quizVersions = data.quizVersions && typeof data.quizVersions === 'object'
      ? Object.fromEntries(Object.entries(data.quizVersions).filter((entry): entry is [string, number] => (
          lessonIdSet.has(entry[0]) && Number.isInteger(entry[1]) && entry[1] > 0
        )))
      : {}
    const quizAnswers = data.quizAnswers && typeof data.quizAnswers === 'object'
      ? Object.fromEntries(Object.entries(data.quizAnswers).filter((entry): entry is [string, number] => {
          const [lessonId, answer] = entry
          const choiceCount = lessonDetails[lessonId]?.quiz.choices.length ?? 0
          const currentVersion = currentQuizVersions[lessonId]
          return lessonIdSet.has(lessonId)
            && Number.isInteger(answer)
            && answer >= 0
            && answer < choiceCount
            && (currentVersion === undefined || quizVersions[lessonId] === currentVersion)
        }))
      : {}
    const depthEditions: DepthEditionProgressMap = {}
    if (data.depthEditions && typeof data.depthEditions === 'object') {
      for (const [editionId, editionValue] of Object.entries(data.depthEditions)) {
        const descriptor = getDepthEditionDescriptor(editionId)
        if (!descriptor || !editionValue || typeof editionValue !== 'object') continue
        const edition = editionValue as Partial<DepthEditionProgress>
        const checkpointAnswers = edition.checkpointAnswers && typeof edition.checkpointAnswers === 'object'
          ? Object.fromEntries(Object.entries(edition.checkpointAnswers).filter((entry): entry is [string, number] => {
              const [sectionId, answer] = entry
              return descriptor.sectionIds.includes(sectionId)
                && Number.isInteger(answer)
                && answer >= 0
                && answer < descriptor.checkpointChoiceCount
            }))
          : {}
        const rawReadIds = Array.isArray(edition.readIds) ? edition.readIds.filter((id): id is string => typeof id === 'string') : []
        const readIds = [...new Set(rawReadIds.filter((id) => isValidDepthPassageId(editionId, id)))]
        const lastId = typeof edition.lastId === 'string' && isValidDepthPassageId(editionId, edition.lastId) ? edition.lastId : undefined
        const completionIsValid = edition.completed === true
          && readIds.length === descriptor.totalUnits
          && descriptor.sectionIds.every((sectionId) => checkpointAnswers[sectionId] === descriptor.checkpointCorrectAnswers[sectionId])
          && quizAnswers[editionId] === lessonDetails[editionId]?.quiz.correct
        depthEditions[editionId] = {
          readIds,
          checkpointAnswers,
          ...(lastId ? { lastId } : {}),
          ...(edition.studyMode === 'guided' || edition.studyMode === 'text' || edition.studyMode === 'full' ? { studyMode: edition.studyMode } : {}),
          ...(completionIsValid ? { completed: true } : {}),
        }
      }
    }
    return {
      completed: Array.isArray(data.completed)
        ? [...new Set(data.completed.filter((id): id is string => typeof id === 'string' && lessonIdSet.has(id)))]
        : [],
      reflections,
      quizAnswers,
      quizVersions,
      depthEditions,
    }
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
  const [activeCourseSectionId, setActiveCourseSectionId] = useState(() => {
    const lessonId = lessonFromHash()
    return courseLessons.find((lesson) => lesson.id === lessonId)?.sectionId ?? 'foundation'
  })
  const [progress, setProgress] = useState<ProgressState>(readStoredProgress)
  const [storageWarning] = useState(() => !canPersistProgress())

  useEffect(() => {
    try {
      window.localStorage.setItem('indian-texts-atlas-progress-v1', JSON.stringify(progress))
    } catch {
      // Progress remains usable in memory for this visit when storage is unavailable.
    }
  }, [progress])

  useEffect(() => {
    const handleHashChange = () => {
      const lessonId = lessonFromHash()
      setView(viewFromHash())
      setActiveLessonId(lessonId)
      if (lessonId) {
        const sectionId = courseLessons.find((lesson) => lesson.id === lessonId)?.sectionId
        if (sectionId) setActiveCourseSectionId(sectionId)
      }
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
    const sectionId = courseLessons.find((lesson) => lesson.id === id)?.sectionId
    if (sectionId) setActiveCourseSectionId(sectionId)
    window.location.hash = `lesson/${id}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateReflection = (id: string, value: string) => {
    setProgress((current) => ({ ...current, reflections: { ...current.reflections, [id]: value } }))
  }

  const selectQuiz = (id: string, answer: number) => {
    setProgress((current) => ({
      ...current,
      quizAnswers: { ...current.quizAnswers, [id]: answer },
      quizVersions: currentQuizVersions[id]
        ? { ...current.quizVersions, [id]: currentQuizVersions[id] }
        : current.quizVersions,
    }))
  }

  const completeLesson = (id: string) => {
    setProgress((current) => current.completed.includes(id) ? current : { ...current, completed: [...current.completed, id] })
  }

  const updateDepthProgress = (id: string, value: DepthEditionProgress) => {
    setProgress((current) => ({ ...current, depthEditions: { ...current.depthEditions, [id]: value } }))
  }

  const activeLesson = activeLessonId ? courseLessons.find((item) => item.id === activeLessonId) ?? null : null

  return (
    <div className="app-shell">
      {storageWarning && <div className="storage-warning" role="status">Progress is available for this visit, but this browser could not save it for later.</div>}
      {!activeLesson && <Header view={view} menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} />}

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
            depthProgress={progress.depthEditions[activeLesson.id] ?? emptyDepthProgress}
            onReflectionChange={(value) => updateReflection(activeLesson.id, value)}
            onQuizSelect={(answer) => selectQuiz(activeLesson.id, answer)}
            onDepthProgressChange={(value) => updateDepthProgress(activeLesson.id, value)}
            onComplete={() => completeLesson(activeLesson.id)}
            onClose={() => navigate('path')}
          />
        ) : (
          <>
            {view === 'atlas' && <AtlasView activeBranch={activeBranch} setActiveBranch={setActiveBranch} navigate={navigate} openLesson={openLesson} />}
            {view === 'path' && <PathView completed={progress.completed} depthEditions={progress.depthEditions} openLesson={openLesson} activeSectionId={activeCourseSectionId} setActiveSectionId={setActiveCourseSectionId} />}
            {view === 'notebook' && <NotebookView progress={progress} updateReflection={updateReflection} openLesson={openLesson} />}
            {view === 'reference' && <ReferenceView />}
          </>
        )}
      </main>

      {!activeLesson && <SiteFooter navigate={navigate} />}

      {!activeLesson && (
        <nav className="bottom-nav" aria-label="Course navigation">
          <button className={view === 'atlas' ? 'active' : ''} aria-current={view === 'atlas' ? 'page' : undefined} onClick={() => navigate('atlas')}><Map size={19} /><span>Atlas</span></button>
          <button className={view === 'path' ? 'active' : ''} aria-current={view === 'path' ? 'page' : undefined} onClick={() => navigate('path')}><Route size={19} /><span>Path</span></button>
          <button className={view === 'notebook' ? 'active' : ''} aria-current={view === 'notebook' ? 'page' : undefined} onClick={() => navigate('notebook')}><NotebookPen size={19} /><span>Notes</span></button>
          <button className={view === 'reference' ? 'active' : ''} aria-current={view === 'reference' ? 'page' : undefined} onClick={() => navigate('reference')}><BookMarked size={19} /><span>Sources</span></button>
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
        <button className={view === 'atlas' ? 'active' : ''} aria-current={view === 'atlas' ? 'page' : undefined} onClick={() => navigate('atlas')}>Atlas</button>
        <button className={view === 'path' ? 'active' : ''} aria-current={view === 'path' ? 'page' : undefined} onClick={() => navigate('path')}>Learning path</button>
        <button className={view === 'notebook' ? 'active' : ''} aria-current={view === 'notebook' ? 'page' : undefined} onClick={() => navigate('notebook')}>Notebook</button>
        <button className={view === 'reference' ? 'active' : ''} aria-current={view === 'reference' ? 'page' : undefined} onClick={() => navigate('reference')}>References</button>
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
            <div><strong>{courseSections.length}</strong><span>guided paths</span></div>
            <div><strong>13</strong><span>principal Upaniṣads</span></div>
            <div><strong>{courseLessons.length}</strong><span>interactive units</span></div>
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
          <div className="branch-list" aria-label="Textual traditions">
            {rootBranches.map((item) => (
              <button key={item.id} className={`branch-tab ${item.id === activeBranch ? 'active' : ''}`} onClick={() => setActiveBranch(item.id)} aria-pressed={item.id === activeBranch}>
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
          <div><span className="kicker">02 · START WITH CONTEXT</span><h2>Course 0, the Upaniṣads, then nine wider paths</h2></div>
          <button className="text-button" onClick={() => navigate('path')}>See the full path <ArrowRight size={17} /></button>
        </div>
        <div className="lesson-grid">
          {courseLessons.slice(0, 4).map((lesson) => <LessonCard lesson={lesson} key={lesson.id} onOpen={() => openLesson(lesson.id)} />)}
        </div>
      </section>

      <section className="cover-section">
        <img src="./og.png" alt="Indian Texts Atlas cover with archival manuscript textures and branching knowledge-map lines" loading="lazy" decoding="async" />
        <div><span className="kicker">THE COURSE PROMISE</span><h2>Context before conclusions.</h2><p>Every lesson separates the base text, literal word meanings, historical questions, later commentary, and living interpretations. Kena, Kaṭha, and Īśā now form the first complete depth editions, with a Sanskrit-learning layer for every unit.</p></div>
      </section>
    </>
  )
}

function PathView({ completed, depthEditions, openLesson, activeSectionId, setActiveSectionId }: {
  completed: string[]
  depthEditions: DepthEditionProgressMap
  openLesson: (id: string) => void
  activeSectionId: string
  setActiveSectionId: (id: string) => void
}) {
  const available = courseLessons.filter((item) => item.status === 'available')
  const validCompleted = available.filter((lesson) => lessonIsComplete(lesson.id, completed, depthEditions))
  const progress = Math.round((validCompleted.length / available.length) * 100)
  const activeSection = courseSections.find((section) => section.id === activeSectionId) ?? courseSections[0]
  const sectionLessons = courseLessons.filter((lesson) => lesson.sectionId === activeSection.id)
  const sectionCompleted = sectionLessons.filter((lesson) => lessonIsComplete(lesson.id, completed, depthEditions)).length

  return (
    <section className="course-view">
      <div className="course-hero">
        <div><span className="kicker">THE COMPLETE CURRICULUM MAP</span><h1>Start at the root. Grow branch by branch.</h1><p>Course 0 gives you the coordinates. Thirteen principal Upaniṣads come next. Nine wider paths then open the Vedas, epics, Purāṇas, philosophical debate, Buddhist and Jain libraries, social thought, technical sciences, and regional literatures. This is a curated map of representative text clusters—not a claim to contain every surviving work.</p></div>
        <div className="progress-medallion"><strong>{progress}%</strong><span>of {available.length} units<br />completed</span></div>
      </div>
      <div className="path-legend"><span><i className="legend-live" /> {courseSections.length} guided paths</span><span><i className="legend-cluster" /> {available.length} interactive units</span></div>

      <div className="curriculum-section-grid" aria-label="Course paths">
        {courseSections.map((section) => {
          const lessons = courseLessons.filter((lesson) => lesson.sectionId === section.id)
          const completedCount = lessons.filter((lesson) => lessonIsComplete(lesson.id, completed, depthEditions)).length
          return (
            <button
              key={section.id}
              className={`curriculum-section-card ${section.tone} ${section.id === activeSection.id ? 'active' : ''}`}
              onClick={() => setActiveSectionId(section.id)}
              aria-pressed={section.id === activeSection.id}
            >
              <span className="section-card-index">{String(section.order).padStart(2, '0')}</span>
              <span className="section-card-copy"><small>{section.eyebrow}</small><strong>{section.shortTitle}</strong><span>{section.description}</span></span>
              <span className="section-card-progress"><i><b style={{ width: `${lessons.length ? (completedCount / lessons.length) * 100 : 0}%` }} /></i><em>{completedCount} / {lessons.length}</em></span>
            </button>
          )
        })}
      </div>

      <div className={`selected-course-header ${activeSection.tone}`}>
        <div><span className="kicker">{activeSection.eyebrow}</span><h2>{activeSection.title}</h2><p>{activeSection.description}</p></div>
        <aside><strong>{sectionCompleted} / {sectionLessons.length}</strong><span>completed in this path</span><p>{activeSection.promise}</p></aside>
      </div>

      <div className="full-path">
        {sectionLessons.map((lesson) => {
          const descriptor = getDepthEditionDescriptor(lesson.id)
          const editionProgress = descriptor ? depthEditions[lesson.id] : undefined
          return (
            <LessonCard
              lesson={lesson}
              key={lesson.id}
              onOpen={() => openLesson(lesson.id)}
              completed={lessonIsComplete(lesson.id, completed, depthEditions)}
              overviewCompleted={Boolean(descriptor && completed.includes(lesson.id) && !editionProgress?.completed)}
              depthReadCount={descriptor ? new Set(editionProgress?.readIds ?? []).size : undefined}
              depthTotal={descriptor?.totalUnits}
            />
          )
        })}
      </div>
    </section>
  )
}

function LessonCard({ lesson, onOpen, completed = false, overviewCompleted = false, depthReadCount, depthTotal }: {
  lesson: CourseLesson
  onOpen: () => void
  completed?: boolean
  overviewCompleted?: boolean
  depthReadCount?: number
  depthTotal?: number
}) {
  return (
    <article className={`lesson-card ${lesson.status} ${lesson.id === 'course-0' ? 'foundation' : ''}`}>
      <div className="lesson-number">{String(lesson.order).padStart(2, '0')}</div>
      <div className="lesson-body">
        <span>{lesson.veda} · {lesson.form}</span>
        <h3>{lesson.title}</h3>
        <p className="lesson-question">{lesson.question}</p>
        <p>{lesson.insight}</p>
        <div className="lesson-meta-row">
          <span>{depthReadCount !== undefined && depthTotal !== undefined ? `${depthReadCount}/${depthTotal} read · depth edition` : lesson.status === 'available' ? `${lesson.minutes} min · interactive` : 'Course map ready'}</span>
          {completed && <span className="complete-label"><CheckCircle2 size={14} /> Completed</span>}
          {overviewCompleted && <span className="overview-label"><BookOpenText size={14} /> Overview saved</span>}
        </div>
      </div>
      <button onClick={onOpen} aria-label={`Open ${lesson.title}`}><ArrowRight size={17} /></button>
    </article>
  )
}

function LessonView({ lesson, detail, completed, reflection, selectedQuiz, depthProgress, onReflectionChange, onQuizSelect, onDepthProgressChange, onComplete, onClose }: {
  lesson: CourseLesson
  detail?: LessonDetail
  completed: boolean
  reflection: string
  selectedQuiz?: number
  depthProgress: DepthEditionProgress
  onReflectionChange: (value: string) => void
  onQuizSelect: (answer: number) => void
  onDepthProgressChange: (progress: DepthEditionProgress) => void
  onComplete: () => void
  onClose: () => void
}) {
  const [step, setStep] = useState(0)
  const isFoundation = lesson.id === 'course-0'

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('.lesson-panel h2')?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [step])

  if (!detail) {
    return (
      <section className="mapped-lesson">
        <button className="back-button" onClick={onClose}><ArrowLeft size={17} /> Back to the path</button>
        <div className="mapped-card">
          <span className="mapped-badge">Lesson data unavailable</span>
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

  if (isFoundation) {
    return (
      <CourseZeroLessonView
        lesson={lesson}
        detail={detail}
        completed={completed}
        reflection={reflection}
        selectedQuiz={selectedQuiz}
        step={step}
        setStep={setStep}
        onReflectionChange={onReflectionChange}
        onQuizSelect={onQuizSelect}
        onComplete={onComplete}
        onClose={onClose}
      />
    )
  }

  if (isDepthEdition(lesson.id)) {
    const DepthReader = depthEditionReaders[lesson.id]
    return (
      <DepthEditionErrorBoundary key={lesson.id} lessonTitle={lesson.plainTitle} onClose={onClose}>
        <Suspense fallback={<section className="lesson-player kena-loading" aria-live="polite"><div><BookOpenText size={28} /><strong>Opening the {lesson.plainTitle} reader…</strong></div></section>}>
          <DepthReader
            lesson={lesson}
            detail={detail}
            completed={completed}
            reflection={reflection}
            selectedQuiz={selectedQuiz}
            progress={depthProgress}
            onProgressChange={onDepthProgressChange}
            onReflectionChange={onReflectionChange}
            onQuizSelect={onQuizSelect}
            onComplete={onComplete}
            onClose={onClose}
          />
        </Suspense>
      </DepthEditionErrorBoundary>
    )
  }

  const correct = selectedQuiz === detail.quiz.correct
  const panelCopy = {
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
        <span aria-live="polite">{completed ? <><CheckCircle2 size={15} /> Complete</> : `${step + 1} / ${lessonSteps.length}`}</span>
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
              return <button key={choice} className={`${chosen ? 'chosen' : ''} ${showCorrect ? 'correct' : ''}`} aria-pressed={chosen} onClick={() => onQuizSelect(index)}><i>{String.fromCharCode(65 + index)}</i><span>{choice}</span>{showCorrect && <Check size={17} />}</button>
            })}</div>
            {selectedQuiz !== undefined && <div className={`quiz-feedback ${correct ? 'success' : 'try-again'}`} role="status" aria-live="polite"><strong>{correct ? 'That is the central move.' : 'Look once more at the distinction.'}</strong><p>{detail.quiz.explanation}</p></div>}
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

function CourseZeroLessonView({ lesson, detail, completed, reflection, selectedQuiz, step, setStep, onReflectionChange, onQuizSelect, onComplete, onClose }: {
  lesson: CourseLesson
  detail: LessonDetail
  completed: boolean
  reflection: string
  selectedQuiz?: number
  step: number
  setStep: (step: number) => void
  onReflectionChange: (value: string) => void
  onQuizSelect: (answer: number) => void
  onComplete: () => void
  onClose: () => void
}) {
  const correct = selectedQuiz === detail.quiz.correct

  return (
    <section className="lesson-player course-zero-player">
      <header className="lesson-player-header">
        <button className="back-button" onClick={onClose}><ArrowLeft size={17} /> Path</button>
        <div><small>Course 0 · Start here</small><strong>{lesson.title}</strong></div>
        <span aria-live="polite">{completed ? <><CheckCircle2 size={15} /> Complete</> : `${step + 1} / ${courseZeroSteps.length}`}</span>
      </header>

      <nav className="step-rail course-zero-rail" aria-label="Course 0 steps">
        {courseZeroSteps.map((item, index) => (
          <button key={item.id} className={index === step ? 'active' : index < step ? 'visited' : ''} onClick={() => setStep(index)} aria-current={index === step ? 'step' : undefined}>
            <i>{index < step || completed ? <Check size={12} /> : index + 1}</i><span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="lesson-content course-zero-content">
        {step === 0 && (
          <LessonPanel kicker="1 · THE LANDSCAPE" title="There is no single bookshelf." icon={<LibraryBig size={22} />}>
            <p className="course-zero-lead">Ancient South Asia did not share one master list of important texts. Begin with several libraries in conversation.</p>
            <p className="course-zero-definition"><strong>Canon</strong><span>A collection a community treats as especially authoritative—not a universal list for everyone.</span></p>
            <figure className="course-zero-figure">
              <img src="./course-zero-landscape.jpg" alt="Four distinct streams of blank manuscript materials cross and exchange threads without merging into a single stream" loading="lazy" decoding="async" />
              <figcaption>Different textual traditions developed their own collections while exchanging stories, arguments, languages, and practices.</figcaption>
            </figure>
            <div className="course-zero-thesis"><strong>The first idea to remember</strong><span>Indian textual history is a connected landscape of many libraries—not one canon.</span></div>
            <div className="landscape-families">
              {courseZeroFamilies.map((family, index) => (
                <article key={family.title}><span>0{index + 1}</span><h3>{family.title}</h3><p>{family.text}</p></article>
              ))}
            </div>
          </LessonPanel>
        )}

        {step === 1 && (
          <LessonPanel kicker="2 · A WORKED EXAMPLE" title="A text has more than one address." icon={<Compass size={22} />}>
            <p className="course-zero-lead">When you meet a text, do not force it onto one branch. Give it three coordinates by asking three separate questions.</p>
            <div className="coordinate-example" aria-label="Three coordinates of the Bhagavad Gita">
              <div className="coordinate-center"><small>EXAMPLE TEXT</small><strong>Bhagavad Gītā</strong><span>A dialogue inside the Mahābhārata</span></div>
              <div className="coordinate-grid">
                <article><span>01</span><small>AUTHORITY</small><h3>How is it regarded?</h3><p>Traditionally classified as <strong>Smṛti</strong>—“remembered tradition,” rather than Vedic Śruti.</p></article>
                <article><span>02</span><small>GENRE + LOCATION</small><h3>What is it, and where?</h3><p>A dialogue within the <strong>Mahābhārata</strong>, an Itihāsa or epic traditional history.</p></article>
                <article><span>03</span><small>RECEPTION</small><h3>Who interprets it?</h3><p>Several <strong>Vedānta schools</strong> and devotional traditions, with different readings.</p></article>
              </div>
            </div>
            <div className="course-zero-caveat"><strong>Do not choose only one label.</strong><p>The Gītā is not “either Smṛti, Itihāsa, or Vedānta.” Each label answers a different question. A coordinate is not a competing branch.</p></div>
          </LessonPanel>
        )}

        {step === 2 && (
          <LessonPanel kicker="3 · ZOOM IN" title="Now enter the Vedic family." icon={<Layers3 size={22} />}>
            <p className="course-zero-lead">The Vedic textual world begins with four Vedas, each transmitted through particular schools or lineages.</p>
            <p className="course-zero-definition"><strong>Veda</strong><span>Not one book, but four related textual families preserved in multiple transmission lineages.</span></p>
            <div className="four-vedas" aria-label="The four Vedas"><span>Ṛgveda</span><span>Sāmaveda</span><span>Yajurveda</span><span>Atharvaveda</span></div>
            <div className="vedic-layer-intro"><strong>Within those lineages, four layers of emphasis help us orient ourselves:</strong></div>
            <div className="vedic-layer-flow">
              {vedicLayers.map((layer, index) => (
                <article key={layer.name} className={layer.name === 'Upaniṣad' ? 'highlight' : ''}>
                  <span>{String(index + 1).padStart(2, '0')}</span><h3>{layer.name}</h3><strong>{layer.plain}</strong><p>{layer.note}</p>
                </article>
              ))}
            </div>
            <div className="course-zero-caveat"><strong>This is a guide, not a rigid timeline.</strong><p>The layers overlap, their boundaries vary by Vedic school, and an Upaniṣad may sit inside a Saṃhitā, Brāhmaṇa, or Āraṇyaka. The Upaniṣads did not simply replace ritual with philosophy.</p></div>
          </LessonPanel>
        )}

        {step === 3 && (
          <LessonPanel kicker="4 · YOUR FIRST PATH" title="The Upaniṣads are one room in a larger house." icon={<BookOpenText size={22} />}>
            <div className="vedic-house" aria-label="Upanishads highlighted within the Vedic textual family">
              <div><small>THE VEDIC TEXTUAL FAMILY</small><strong>Four Vedas · many transmission lineages</strong></div>
              <div className="vedic-house-layers"><span>Saṃhitā</span><span>Brāhmaṇa</span><span>Āraṇyaka</span><span className="active">Upaniṣad</span></div>
            </div>
            <p className="course-zero-lead">Every principal Upaniṣad in this course is associated with a Veda and a transmission lineage. These are the thirteen on our first path:</p>
            <div className="upanishad-families">
              {upanishadVedaFamilies.map((family) => <article key={family.veda}><h3>{family.veda}</h3><p>{family.texts}</p></article>)}
            </div>
            <div className="course-zero-thesis"><strong>Where we go next</strong><span>Course 1 begins with three complete readers on three Vedic branches: Kena on the Sāmaveda, Kaṭha on the Kṛṣṇa Yajurveda, and Īśā as chapter 40 of the Śukla Yajurveda’s Vājasaneyi Saṃhitā. Each keeps Sanskrit, transliteration, word-by-word literal meaning and grammar, course paraphrase, teaching note, textual variants, and interpretation distinct while adapting the pace to its text. Nine wider paths then open the Vedas, epics and Gītā, Purāṇas, Darśanas, Buddhist and Jain texts, social and technical thought, and regional-language literatures.</span></div>
            <div className="course-zero-caveat"><strong>“Principal” is a course doorway, not a verdict.</strong><p>These thirteen are early or historically influential starting points. Many later Upaniṣads also matter, and traditional lists differ.</p></div>
          </LessonPanel>
        )}

        {step === 4 && (
          <LessonPanel kicker="5 · REBUILD THE MAP" title="Can you explain it without the labels?" icon={<NotebookPen size={22} />}>
            <p className="course-zero-lead">Write three or four plain sentences. If you can rebuild the map in your own words, the vocabulary will have somewhere to attach.</p>
            <ol className="rebuild-prompts">
              <li><span>01</span><p>Why is “Indian texts” a landscape of libraries rather than one canon?</p></li>
              <li><span>02</span><p>What three questions give a text its coordinates?</p></li>
              <li><span>03</span><p>Where do the Upaniṣads sit inside the Vedic family?</p></li>
            </ol>
            <label className="reflection-field"><span>Your private note · saved on this device</span><textarea value={reflection} onChange={(event) => onReflectionChange(event.target.value)} placeholder="Try: ‘There was no single bookshelf because…’" rows={8} /></label>
          </LessonPanel>
        )}

        {step === 5 && (
          <LessonPanel kicker="6 · CHECKPOINT" title="Keep four sentences." icon={<CheckCircle2 size={22} />}>
            <div className="course-zero-recap" aria-label="Course 0 summary">
              <span>One landscape, many libraries.</span>
              <span>Every text needs more than one coordinate.</span>
              <span>Four Vedas contain school-specific, overlapping layers.</span>
              <span>Upaniṣads belong to the Vedic world; they are not all Indian thought.</span>
            </div>
            <p className="quiz-question">{detail.quiz.question}</p>
            <div className="quiz-choices">{detail.quiz.choices.map((choice, index) => {
              const chosen = selectedQuiz === index
              const showCorrect = selectedQuiz !== undefined && index === detail.quiz.correct
              return <button key={choice} className={`${chosen ? 'chosen' : ''} ${showCorrect ? 'correct' : ''}`} aria-pressed={chosen} onClick={() => onQuizSelect(index)}><i>{String.fromCharCode(65 + index)}</i><span>{choice}</span>{showCorrect && <Check size={17} />}</button>
            })}</div>
            {selectedQuiz !== undefined && <div className={`quiz-feedback ${correct ? 'success' : 'try-again'}`} role="status" aria-live="polite"><strong>{correct ? 'Yes—that is the connection.' : 'Look again at what each label is describing.'}</strong><p>{detail.quiz.explanation}</p></div>}
            {correct && <button className="primary-button complete-button" onClick={onComplete}>{completed ? 'Course 0 completed' : 'Mark Course 0 complete'} <CheckCircle2 size={17} /></button>}
            <div className="lesson-source-links"><strong>Continue with sources</strong>{detail.sourceLinks.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={14} /></a>)}</div>
          </LessonPanel>
        )}
      </div>

      <footer className="lesson-controls">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}><ChevronLeft size={18} /> Previous</button>
        <span>{courseZeroSteps[step].label}</span>
        {step < courseZeroSteps.length - 1 ? <button className="next-step" onClick={() => setStep(Math.min(courseZeroSteps.length - 1, step + 1))}>Next <ChevronRight size={18} /></button> : <button className="next-step" onClick={onClose}>Return to path <ChevronRight size={18} /></button>}
      </footer>
    </section>
  )
}

function LessonPanel({ kicker, title, icon, children }: { kicker: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <article className="lesson-panel"><div className="panel-title"><div>{icon}</div><span className="kicker">{kicker}</span><h2 tabIndex={-1}>{title}</h2></div><div className="panel-body">{children}</div></article>
}

function NotebookView({ progress, updateReflection, openLesson }: { progress: ProgressState; updateReflection: (id: string, value: string) => void; openLesson: (id: string) => void }) {
  const [activeSectionId, setActiveSectionId] = useState('foundation')
  const liveLessons = courseLessons.filter((lesson) => lesson.status === 'available')
  const selectedSection = courseSections.find((section) => section.id === activeSectionId) ?? courseSections[0]
  const selectedLessons = liveLessons.filter((lesson) => lesson.sectionId === selectedSection.id)
  const validCompleted = liveLessons.filter((lesson) => lessonIsComplete(lesson.id, progress.completed, progress.depthEditions))
  return (
    <section className="notebook-page">
      <div className="course-hero notebook-hero">
        <div><span className="kicker">YOUR NOTEBOOK</span><h1>Questions worth carrying.</h1><p>Reflections stay in this browser on this device. They are never uploaded by the course.</p></div>
        <div className="notebook-count"><strong>{validCompleted.length}</strong><span>of {liveLessons.length}<br />units complete</span></div>
      </div>
      <div className="notebook-filter" aria-label="Choose a course path">
        {courseSections.map((section) => (
          <button key={section.id} className={section.id === selectedSection.id ? 'active' : ''} onClick={() => setActiveSectionId(section.id)} aria-pressed={section.id === selectedSection.id}>
            <span>{section.shortTitle}</span><small>{courseLessons.filter((lesson) => lesson.sectionId === section.id).length}</small>
          </button>
        ))}
      </div>
      <div className="notebook-section-heading">
        <div><span className="kicker">{selectedSection.eyebrow}</span><h2>{selectedSection.title}</h2></div>
        <p>{selectedSection.promise}</p>
      </div>
      <div className="notebook-grid">
        {selectedLessons.map((lesson) => (
          <article className="note-card" key={lesson.id}>
            <header><div><small>{lesson.veda}</small><h2>{lesson.title}</h2></div>{lessonIsComplete(lesson.id, progress.completed, progress.depthEditions) && <CheckCircle2 size={20} />}</header>
            <p>{lessonDetails[lesson.id]?.reflection}</p>
            <textarea aria-label={`Reflection for ${lesson.title}`} value={progress.reflections[lesson.id] ?? ''} onChange={(event) => updateReflection(lesson.id, event.target.value)} placeholder="Your reflection will appear here…" rows={5} />
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
        <article><strong>A curated map, not every text</strong><p>The atlas teaches representative works and text clusters across eleven paths. “Complete” here means every mapped section is teachable, not that every surviving manuscript has been summarized.</p></article>
        <article><strong>Not one fixed canon</strong><p>Ten Upaniṣads are commonly privileged in Vedānta, thirteen make a useful early foundation, the later Muktikā lists 108, and hundreds more use the title Upaniṣad.</p></article>
        <article><strong>Dates are approximate</strong><p>Historical dates describe periods of oral composition and redaction, often with several strata—not modern publication dates or single known authors.</p></article>
        <article><strong>Translation is interpretation</strong><p>Ātman, brahman, dharma, tapas, and yoga do not each have one context-free English equivalent. Named translations matter.</p></article>
        <article><strong>Living traditions differ</strong><p>Advaita, Viśiṣṭādvaita, Dvaita, and other lineages may draw sharply different conclusions from the same passage.</p></article>
        <article><strong>Prescription is not a census</strong><p>A normative rule, ritual manual, or political ideal is evidence for an argument and institution—not proof that every person or community lived that way.</p></article>
      </div>

      <div className="reference-section curriculum-scope-section">
        <div><span className="kicker">CURRICULUM SCOPE</span><h2>Eleven connected paths</h2><p>Each path keeps the base text, commentary, performance, and modern reception visible as different layers.</p></div>
        <div className="curriculum-scope-grid">{courseSections.map((section) => {
          const count = courseLessons.filter((lesson) => lesson.sectionId === section.id).length
          return <article key={section.id} className={section.tone}><small>{String(section.order).padStart(2, '0')}</small><div><strong>{section.shortTitle}</strong><span>{count} {count === 1 ? 'unit' : 'units'}</span></div></article>
        })}</div>
      </div>

      <div className="reference-section">
        <div><span className="kicker">VEDIC AFFILIATIONS</span><h2>Where the thirteen are placed</h2></div>
        <div className="veda-table">{vedas.map((veda) => <div key={veda.name}><strong>{veda.name}</strong><span>{veda.texts}</span></div>)}</div>
      </div>

      <div className="reference-section source-section">
        <div><span className="kicker">PUBLIC SOURCE STACK</span><h2>Follow the scholarship</h2><p>Course summaries are orientation. Use these sources to inspect texts, translations, and academic context directly.</p></div>
        <div className="source-list">{referenceSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={`${source.label}-${source.url}`}><div><strong>{source.label}</strong><span>{source.use}</span></div><ExternalLink size={17} /></a>)}</div>
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
