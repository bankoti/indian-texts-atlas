import {
  ishaFinalSynthesis,
  ishaInterpretiveLenses,
  ishaMovements,
  ishaSessions,
  ishaTeaching,
  type IshaMovement,
  type IshaSession,
} from './ishaTeaching.generated'
import { ishaVerseTexts } from './ishaVerseTexts.generated'
import { ishaInvocationWordStudy, ishaWordStudy } from './ishaWordStudy.generated'
import type { WordStudyWord } from './wordStudyTypes'

export type IshaTerm = {
  term: string
  meaning: string
}

export type IshaPassage = {
  id: string
  number: number
  sectionId: string
  sessionId: string
  kind: 'mantra'
  title: string
  devanagari: string
  iast: string
  gloss: string
  explanation: string
  terms: IshaTerm[]
  words: WordStudyWord[]
  textNote?: string
}

export type IshaSection = IshaMovement
export type { IshaMovement, IshaSession }
export { ishaFinalSynthesis, ishaInterpretiveLenses, ishaMovements, ishaSessions }
export const ishaSections = ishaMovements

export const ishaInvocation = {
  devanagari: `ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते ।
पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥
ॐ शान्तिः शान्तिः शान्तिः ॥`,
  iast: `oṃ pūrṇam adaḥ pūrṇam idaṃ pūrṇāt pūrṇam udacyate |
pūrṇasya pūrṇam ādāya pūrṇam evāvaśiṣyate ||
oṃ śāntiḥ śāntiḥ śāntiḥ ||`,
  note: 'The traditional Śukla Yajurveda peace invocation. It is often printed before Īśā, but it is not counted among the Kāṇva recension’s 18 mantras. Its compact language of fullness has its own interpretive history.',
  words: ishaInvocationWordStudy.words,
}

const teachingById = new Map(ishaTeaching.map((entry) => [entry.id, entry]))
const wordsById = new Map(ishaWordStudy.map((entry) => [entry.id, entry.words]))

function movementFor(number: number): IshaMovement {
  const movement = ishaMovements.find((entry) => entry.verses.includes(number))
  if (!movement) throw new Error(`No Īśā movement for mantra ${number}`)
  return movement
}

function sessionFor(number: number): IshaSession {
  const session = ishaSessions.find((entry) => entry.verses.includes(number))
  if (!session) throw new Error(`No Īśā session for mantra ${number}`)
  return session
}

export const ishaPassages: IshaPassage[] = ishaVerseTexts.map((text) => {
  const teaching = teachingById.get(text.id)
  if (!teaching) throw new Error(`Missing Īśā teaching metadata for ${text.id}`)
  const words = wordsById.get(text.id)
  if (!words) throw new Error(`Missing Īśā word study for ${text.id}`)
  const number = Number(text.id)
  const textNotes = [text.textNote, teaching.textNote].filter(Boolean)
  return {
    ...text,
    ...teaching,
    number,
    sectionId: movementFor(number).id,
    sessionId: sessionFor(number).id,
    kind: 'mantra',
    words,
    ...(textNotes.length ? { textNote: textNotes.join('\n\n') } : {}),
  }
})

export function getIshaSection(sectionId: string): IshaMovement | undefined {
  return ishaMovements.find((movement) => movement.id === sectionId)
}

export function getIshaSession(sessionId: string): IshaSession | undefined {
  return ishaSessions.find((session) => session.id === sessionId)
}

export function getIshaPassagesForSection(sectionId: string): IshaPassage[] {
  return ishaPassages.filter((passage) => passage.sectionId === sectionId)
}

export function getIshaPassagesForSession(sessionId: string): IshaPassage[] {
  return ishaPassages.filter((passage) => passage.sessionId === sessionId)
}

export const ishaEditorialNote = 'This complete reader follows the 18-mantra Kāṇva recension of Vājasaneyi Saṃhitā 40. The Mādhyaṃdina recension has 17 mantras and differs in ordering and wording, especially after mantra 8. The displayed Sanskrit is a normalized, unaccented study text adapted from Sanskrit Wikisource and checked against academic and Vedic text witnesses; it is not a chanting guide. “Movements” and “sessions” are course navigation, not traditional divisions. Word-by-word entries are original contextual learning aids that undo surface sandhi and explain compounds where useful; they are not a canonical padapāṭha. Course paraphrases remain separate from later interpretations, and consequential alternatives are named rather than silently harmonized.'

export const ishaSources = [
  {
    label: 'Sanskrit Wikisource · Īśāvāsyopaniṣad',
    url: 'https://sa.wikisource.org/wiki/ईशोपनिषत्',
    use: 'Base Devanagari transcription adapted for the unaccented study display; spacing, lineation, and transliteration are editorially normalized.',
  },
  {
    label: 'Vedic Heritage Portal · Vājasaneyi Kāṇva Saṃhitā 40',
    url: 'https://vedicheritage.gov.in/hi/samhitas/yajurveda/vajasaneyi-kanva-samhita/vajasaneyi-kanva-samhita-chapter-40/',
    use: 'Comparative accented Kāṇva witness. Its displayed arśat in mantra 4 and anomalous shorter mantra 16 are treated as variants, not silently adopted as the course wording.',
  },
  {
    label: 'TITUS · Vājasaneyi Mādhyaṃdina Saṃhitā 40',
    url: 'https://titus.uni-frankfurt.de/texte/etcd/ind/aind/ved/yvw/vs/vs040.htm',
    use: 'Scholarly electronic witness used for comparison with the substantially different 17-unit Mādhyaṃdina arrangement.',
  },
  {
    label: 'UT Austin · Olivelle early Upaniṣad transcriptions',
    url: 'https://sites.utexas.edu/sanskrit/resources/early-upanisads-olivelle-edition/',
    use: 'Academic Roman-text comparison for the Kāṇva sequence and consequential readings.',
  },
  {
    label: 'GRETIL · Īśa Upaniṣad, Kāṇva recension',
    url: 'https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/1_veda/4_upa/isupsb_u.htm',
    use: 'Electronic Kāṇva mūla used for collation; the attached Śaṅkara commentary is consulted cautiously because GRETIL labels it unproofread.',
  },
  {
    label: 'Cologne Digital Sanskrit Dictionaries',
    url: 'https://www.sanskrit-lexicon.uni-koeln.de/',
    use: 'Lexical reference used to check the course-original word meanings; dictionary prose is not copied.',
  },
  {
    label: 'Sanskrit Heritage Engine · reference manual',
    url: 'https://sanskrit.uohyd.ac.in/SKT/manual.html',
    use: 'Morphology and sandhi reference used to check learning segmentations and grammatical labels.',
  },
  {
    label: 'R. E. Hume · Thirteen Principal Upanishads (1921)',
    url: 'https://oll.libertyfund.org/titles/hume-the-thirteen-principal-upanishads',
    use: 'Public-domain historical translation consulted for comparison, not reproduced.',
  },
  {
    label: 'F. Max Müller · Vājasaneyi-Saṃhitā-Upaniṣad (1879)',
    url: 'https://sacred-texts.com/hin/sbe01/sbe01243.htm',
    use: 'Public-domain translation and notes used to locate older interpretive disagreements.',
  },
  {
    label: 'Creative Commons Attribution-ShareAlike 4.0',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    use: 'License governing the adapted Sanskrit Wikisource text layer.',
  },
]
