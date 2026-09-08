import { useState } from 'react'
import type { WordStudyWord } from './wordStudyTypes'

type WordByWordStudyProps = {
  passageId: string
  words: WordStudyWord[]
  invocation?: boolean
  beginner?: boolean
}

export default function WordByWordStudy({ passageId, words, invocation = false, beginner = false }: WordByWordStudyProps) {
  const titleId = `word-study-${passageId.replaceAll('.', '-')}`
  const [showGrammar, setShowGrammar] = useState(!beginner)

  return (
    <section className={`word-study ${invocation ? 'invocation-word-study' : ''} ${beginner ? 'word-study-beginner' : ''} ${!showGrammar ? 'word-study-meanings' : ''}`} aria-labelledby={titleId}>
      <header className="word-study-header">
        <div>
          <span>पद-अध्ययन · WORD BY WORD · {words.length} LEARNING WORDS</span>
          <h2 id={titleId} tabIndex={-1}>{invocation ? 'Learn the peace invocation from the inside.' : beginner ? 'Each word and its meaning' : 'See how the Sanskrit carries the sentence.'}</h2>
        </div>
        <p>{beginner ? 'Read from top to bottom in Sanskrit order. Joined words are separated here so you can match each part to its English meaning. English sentences may use a different order.' : <>A literal learning aid, not a second polished translation. Sanskrit often joins neighboring words through <em>sandhi</em>; these rows undo those joins, while keeping genuine compounds together when that makes the form easier to learn.</>}</p>
      </header>

      {beginner && <button className="word-study-grammar-toggle" aria-pressed={showGrammar} aria-controls={`${titleId}-list ${titleId}-key`} onClick={() => setShowGrammar(!showGrammar)}>{showGrammar ? 'Hide grammar notes' : 'Show grammar notes'}</button>}
      <div className="word-study-columns" aria-hidden="true"><span>Learning word</span><span>Literal sense</span>{showGrammar && <span>Form · grammar · sandhi</span>}</div>
      <ol className="word-study-list" id={`${titleId}-list`} role="list">
        {words.map((word, index) => (
          <li key={`${passageId}-${index}-${word.iast}`}>
            <div className="word-study-form">
              <span className="sr-only">Learning word in Devanagari: </span><strong lang="sa-Deva">{word.source}</strong>
              <span className="sr-only">IAST transliteration: </span><span lang="sa-Latn">{word.iast}</span>
            </div>
            <p><span className="sr-only">Literal sense: </span>{word.meaning}</p>
            {showGrammar && <small><span className="sr-only">Grammar and sandhi: </span>{word.grammar}</small>}
          </li>
        ))}
      </ol>

      <footer className="word-study-key" id={`${titleId}-key`} hidden={!showGrammar}>
        <strong>Quick grammar key</strong>
        <span><b>nominative</b> often marks the subject · <b>accusative</b> the object · <b>instrumental</b> “by/with” · <b>dative</b> “to/for” · <b>ablative</b> “from” · <b>genitive</b> “of” · <b>locative</b> “in/at” · <b>vocative</b> direct address. Context decides the final English wording.</span>
      </footer>
    </section>
  )
}
