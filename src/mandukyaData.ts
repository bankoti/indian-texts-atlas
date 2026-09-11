import texts from './mandukyaTexts.json'
import sources from './mandukyaSources.json'
import teachingEntries from './mandukyaTeaching.json'
import { mandukyaSessions } from './mandukyaCourse'
import type { MandukyaPassage, MandukyaSource } from './mandukyaTypes'

export const mandukyaSources: MandukyaSource[] = sources
export const mandukyaPassages: MandukyaPassage[] = texts.map((text) => {
  const teaching = teachingEntries.find((item) => item.id === text.id)
  const session = mandukyaSessions.find((item) => item.verses.includes(Number(text.id)))
  if (!teaching || !session) throw new Error(`Missing Māṇḍūkya teaching for mantra ${text.id}`)
  return { ...text, ...teaching, sessionId: session.id }
})

export const mandukyaEditorialNote = 'This edition contains all twelve root mantras of the Māṇḍūkya Upaniṣad, traditionally affiliated with the Atharvaveda. The ancient Sanskrit follows the Sanskrit Documents witness, compared with two GRETIL transcriptions; noteworthy differences are disclosed beside the text. This is a normalized unaccented study transcription, not a critical manuscript edition or a pitch-accented recitation guide. Transliterated word forms and original contextual English glosses separate sandhi and explain compounds for learners, not as a canonical padapāṭha. The English translations, examples, quizzes and four sessions are course-original. Explanations mainly use an explicitly identified Advaita lens; Madhva illustrates a different reception. Gauḍapāda’s Kārikā and the varying peace invocations printed around the text are not counted among these twelve mantras and are not reproduced as additional units.'
