import { useState } from 'react'

const states = [
  { label: 'Waking', name: 'Vaiśvānara', direction: 'Outward knowing', detail: 'A cup on your desk is encountered through waking experience. Mantra 3 calls this the first pāda; it also uses a cosmic description, not just individual psychology.', mantra: '3', sound: 'A', link: 'First / reaching', reason: 'Mantra 9 links A with reaching or pervading (āpti) and being first (ādimattva).' },
  { label: 'Dreaming', name: 'Taijasa', direction: 'Inward knowing', detail: 'In a dream, a conversation or landscape appears without the same present external situation. Mantra 4 turns to inwardly presented experience.', mantra: '4', sound: 'U', link: 'Elevation / between', reason: 'Mantra 10 links U with elevation (utkarṣa) and its relation to both (ubhayatva), traditionally explained by U’s position between A and M.' },
  { label: 'Deep sleep', name: 'Prājña', direction: 'No differentiated dream', detail: 'Mantra 5 describes sleep without a desired object or dream. It calls this unified and a mass of awareness; mantra 7 explicitly distinguishes the fourth from this description.', mantra: '5', sound: 'M', link: 'Measure / merging', reason: 'Mantra 11 links M with measuring (miti) and merging or absorption (apīti). These are the text’s contemplative correspondences.' },
]

export function MandukyaStateMap({ active = 0 }: { active?: number }) {
  const [selected, setSelected] = useState(active)
  return <figure className="mandukya-visual">
    <figcaption><strong>Three changing forms of experience</strong><span>Tap a card to compare. This is a reading map, not a chart of clinical sleep stages.</span></figcaption>
    <div className="mandukya-state-cards">{states.map((state, index) => <button key={state.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><small>Mantra {state.mantra}</small><strong>{state.label}</strong><span>{state.name}</span><b>{state.direction}</b></button>)}</div>
    <p className="mandukya-visual-detail" aria-live="polite">{states[selected].detail}</p>
    <div className="mandukya-fourth"><span>Mantra 7 · “the fourth”</span><strong>Not another experience to add to the sequence.</strong><p>The text refuses to identify ātman with outward knowing, inward knowing, their combination, deep sleep’s mass of awareness, ordinary knowing, or non-knowing. Its positive words include peaceful, auspicious, and nondual.</p></div>
  </figure>
}

export function MandukyaOmMap({ active = 0 }: { active?: number }) {
  const [selected, setSelected] = useState(active)
  return <figure className="mandukya-visual">
    <figcaption><strong>From experience to Oṃ</strong><span>The root text’s teaching correspondences, not a claim that a sound mechanically produces realization.</span></figcaption>
    <div className="mandukya-state-cards">{states.map((state, index) => <button key={state.sound} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><small>Mantra {index + 9}</small><strong className="mandukya-sound">{state.sound}</strong><span>{state.label} · {state.name}</span><b>{state.link}</b></button>)}</div>
    <p className="mandukya-visual-detail" aria-live="polite">{states[selected].reason}</p>
    <div className="mandukya-fourth"><span>Mantra 12 · amātra</span><strong>Not a fourth spoken component.</strong><p>Amātra means without a measure or component. Silence can be a teaching analogy, but “silence after chanting” is not its literal translation or a sufficient definition of the Self.</p></div>
  </figure>
}

export function MandukyaTimeMap() {
  return <figure className="mandukya-visual"><figcaption><strong>What does “all this” include?</strong><span>Mantra 1 introduces the scope before explaining the Self.</span></figcaption><div className="mandukya-time"><span>What was<br /><strong>bhūtam</strong></span><span>What is<br /><strong>bhavat</strong></span><span>What will be<br /><strong>bhaviṣyat</strong></span></div><div className="mandukya-fourth"><strong>And whatever is beyond those three times.</strong><p>The mantra uses Oṃ to encompass the whole, not merely one sound among the things in time.</p></div></figure>
}

export function MandukyaNegationMap() {
  const candidates = ['Inward knowing', 'Outward knowing', 'Both together', 'A mass of awareness', 'Knowing', 'Non-knowing']
  const [selected, setSelected] = useState<number[]>([])
  return <figure className="mandukya-visual"><figcaption><strong>Watch the description refuse a box</strong><span>Tap each proposed definition. Mantra 7 says “not” to all six; negation is not a claim that nothing exists.</span></figcaption><div className="mandukya-negations">{candidates.map((candidate, index) => <button key={candidate} type="button" aria-pressed={selected.includes(index)} onClick={() => setSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])}><span>{selected.includes(index) ? 'Not this definition' : 'Test this definition'}</span><strong>{candidate}</strong></button>)}</div><div className="mandukya-fourth" aria-live="polite"><strong>{selected.length} of 6 definitions examined</strong><p>The same mantra then says “peaceful,” “auspicious,” “nondual,” and “to be known.” It redirects inquiry rather than recommending blankness.</p></div></figure>
}

export function MandukyaCosmicMap() {
  const descriptions = [
    ['Sarveśvara', 'Lord of all', 'The scope is all beings, not only one person’s mood.'],
    ['Sarvajña', 'Knower of all', 'A cosmological description, not a claim that a sleeping person knows every fact.'],
    ['Antaryāmin', 'Inner governor', 'The language concerns governance from within, not just outward sensations.'],
    ['Yoni · prabhava–apyaya', 'Source · arising and return', 'Beings are considered in relation to their origin and dissolution.'],
  ]
  return <figure className="mandukya-visual"><figcaption><strong>Mantra 6 changes the scale</strong><span>Śaṅkara connects the preceding Prājña description with Īśvara, the cosmic source. The root mantra supplies these descriptions:</span></figcaption><div className="mandukya-cosmic-grid">{descriptions.map(([term, meaning, detail]) => <article key={term}><span>{term}</span><h3>{meaning}</h3><p>{detail}</p></article>)}</div><div className="mandukya-fourth"><strong>A question about everything—not merely a report about sleep.</strong><p>The next mantra asks whether even these relational descriptions exhaust the Self.</p></div></figure>
}

export default function MandukyaPassageVisual({ id }: { id: string }) {
  const number = Number(id)
  if (number === 1) return <MandukyaTimeMap />
  if (number === 6) return <MandukyaCosmicMap />
  if (number === 7) return <MandukyaNegationMap />
  if (number >= 8) return <MandukyaOmMap key={id} active={Math.max(0, Math.min(2, number - 9))} />
  return <MandukyaStateMap key={id} active={Math.max(0, Math.min(2, number - 3))} />
}
