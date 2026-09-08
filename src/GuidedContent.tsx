import { useState } from 'react'
import type { GuidedContent as Guide, SourceExcerpt } from './guidedTypes'
import WordByWordStudy from './WordByWordStudy'

export function ConceptDiagram({ visual }: { visual: Guide['visual'] }) {
  const [active, setActive] = useState(0)
  return <figure className="concept-diagram">
    <figcaption><span className="kicker">SEE THE RELATIONSHIP</span><h3>{visual.title}</h3></figcaption>
    <div className="diagram-nodes" aria-label={visual.title}>
      {visual.nodes.map((node, index) => <button key={node.label} aria-pressed={active === index} aria-controls="diagram-explanation" onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, '0')}</span>{node.label}</button>)}
    </div>
    <div id="diagram-explanation" className="diagram-explanation" aria-live="polite"><strong>{visual.nodes[active].label}</strong><p>{visual.nodes[active].detail}</p></div>
    <p className="diagram-caption">{visual.caption}</p>
  </figure>
}

export function GuidedTeaching({ guide }: { guide: Guide }) {
  return <div className="guided-teaching">
    {guide.teaching.map((part, index) => <section className="teaching-movement" key={part.title}><span className="teaching-index">{index + 1}</span><div><h3>{part.title}</h3><p>{part.body}</p></div></section>)}
    <ConceptDiagram visual={guide.visual} />
  </div>
}

export function WorkedExample({ example }: { example: Guide['example'] }) {
  return <section className="worked-example"><span className="kicker">WORK THROUGH AN EXAMPLE</span><h3>{example.title}</h3><p>{example.scenario}</p><details><summary>Pause and form an answer, then compare</summary><p>{example.explanation}</p></details></section>
}

export function SanskritExcerpt({ excerpt, lessonId }: { excerpt: SourceExcerpt; lessonId: string }) {
  return <section className="guided-excerpt">
    <span className="kicker">A SMALL WINDOW INTO THE SOURCE · SANSKRIT</span>
    <h3>{excerpt.reference}</h3>
    <p className="excerpt-sanskrit" lang="sa-Deva">{excerpt.devanagari}</p>
    <p className="excerpt-iast" lang="sa-Latn">{excerpt.iast}</p>
    <div className="excerpt-translation"><strong>Course translation</strong><p>{excerpt.translation}</p></div>
    <WordByWordStudy passageId={`excerpt-${lessonId}`} words={excerpt.words} beginner />
    <p className="interpretation-note">{excerpt.note}</p>
    <a href={excerpt.sourceUrl} target="_blank" rel="noreferrer">Check the Sanskrit source ↗</a>
  </section>
}
