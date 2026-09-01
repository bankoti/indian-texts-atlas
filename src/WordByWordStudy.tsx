import type { WordStudyWord } from './wordStudyTypes'

type WordByWordStudyProps = {
  passageId: string
  words: WordStudyWord[]
  invocation?: boolean
}

export default function WordByWordStudy({ passageId, words, invocation = false }: WordByWordStudyProps) {
  const titleId = `word-study-${passageId.replaceAll('.', '-')}`

  return (
    <section className={`word-study ${invocation ? 'invocation-word-study' : ''}`} aria-labelledby={titleId}>
      <header className="word-study-header">
        <div>
          <span>पद-अध्ययन · WORD BY WORD · {words.length} LEARNING WORDS</span>
          <h2 id={titleId}>{invocation ? 'Learn the peace invocation from the inside.' : 'See how the Sanskrit carries the sentence.'}</h2>
        </div>
        <p>A literal learning aid, not a second polished translation. Sanskrit often joins neighboring words through <em>sandhi</em>; these rows undo those joins, while keeping genuine compounds together when that makes the form easier to learn.</p>
      </header>

      <div className="word-study-columns" aria-hidden="true"><span>Learning word</span><span>Literal sense</span><span>Form · grammar · sandhi</span></div>
      <ol className="word-study-list" role="list">
        {words.map((word, index) => (
          <li key={`${passageId}-${index}-${word.iast}`}>
            <div className="word-study-form">
              <span className="sr-only">Learning word in Devanagari: </span><strong lang="sa-Deva">{word.source}</strong>
              <span className="sr-only">IAST transliteration: </span><span lang="sa-Latn">{word.iast}</span>
            </div>
            <p><span className="sr-only">Literal sense: </span>{word.meaning}</p>
            <small><span className="sr-only">Grammar and sandhi: </span>{word.grammar}</small>
          </li>
        ))}
      </ol>

      <footer className="word-study-key">
        <strong>Quick grammar key</strong>
        <span><b>nominative</b> often marks the subject · <b>accusative</b> the object · <b>instrumental</b> “by/with” · <b>dative</b> “to/for” · <b>ablative</b> “from” · <b>genitive</b> “of” · <b>locative</b> “in/at” · <b>vocative</b> direct address. Context decides the final English wording.</span>
      </footer>
    </section>
  )
}
