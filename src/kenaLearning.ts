import type { DepthEditionProgress } from './depthEditionTypes'
import { kenaPassages, kenaSections } from './kenaData'

const passageIds = new Set(kenaPassages.map((passage) => passage.id))

/** Mark only the passage the learner explicitly finishes; browsing never marks it. */
export function markKenaPassageRead(progress: DepthEditionProgress, passageId: string): DepthEditionProgress {
  if (!passageIds.has(passageId)) return progress
  return {
    ...progress,
    readIds: [...new Set([...progress.readIds.filter((id) => passageIds.has(id)), passageId])],
    lastId: passageId,
  }
}

export function firstUnreadKenaPassage(readIds: string[]): string | undefined {
  const read = new Set(readIds)
  return kenaPassages.find((passage) => !read.has(passage.id))?.id
}

export function nextKenaReviewTask(progress: DepthEditionProgress, finalQuizCorrect: boolean) {
  const unread = firstUnreadKenaPassage(progress.readIds)
  if (unread) return { kind: 'passage' as const, id: unread, label: `Continue with unread passage ${unread}` }
  const section = kenaSections.find((item) => progress.checkpointAnswers[String(item.id)] !== item.checkpoint.correct)
  if (section) return { kind: 'checkpoint' as const, id: `kena-checkpoint-${section.id}`, label: `Complete the Section ${section.roman} check` }
  if (!finalQuizCorrect) return { kind: 'quiz' as const, id: 'kena-final-quiz-title', label: 'Try the final question' }
  return undefined
}

export const kenaOpeningQuestions = [
  {
    label: 'Thinking',
    source: 'केनेषितं पतति प्रेषितं मनः',
    iast: 'keneṣitaṃ patati preṣitaṃ manaḥ',
    familiar: 'A thought comes to mind.',
    question: 'By whom or what is the mind directed?',
    word: 'मनः · manaḥ · mind',
  },
  {
    label: 'Breathing',
    source: 'केन प्राणः प्रथमः प्रैति युक्तः',
    iast: 'kena prāṇaḥ prathamaḥ praiti yuktaḥ',
    familiar: 'The vital breath keeps moving.',
    question: 'By whom or what is the foremost breath set in motion?',
    word: 'प्राणः · prāṇaḥ · vital breath',
  },
  {
    label: 'Speaking',
    source: 'केनेषितां वाचमिमां वदन्ति',
    iast: 'keneṣitāṃ vācam imāṃ vadanti',
    familiar: 'People speak and form words.',
    question: 'Prompted by whom or what do people speak?',
    word: 'वाचम् · vācam · speech',
  },
  {
    label: 'Seeing & hearing',
    source: 'चक्षुः श्रोत्रं क उ देवो युनक्ति',
    iast: 'cakṣuḥ śrotraṃ ka u devo yunakti',
    familiar: 'You see a shape or hear a sound.',
    question: 'Which deity joins sight and hearing to their work?',
    word: 'चक्षुः · cakṣuḥ · sight / श्रोत्रम् · śrotram · hearing',
  },
] as const

type OpeningLesson = {
  orientation: string
  takeaway: string
  grammar: { title: string; forms: string; explanation: string }
  check: { question: string; choices: string[]; correct: number; feedback: string[] }
}

export const kenaOpeningLessons: Partial<Record<string, OpeningLesson>> = {
  '1.1': {
    orientation: 'A student asks the opening question. Kena means “by whom?” or “by what?” This passage asks; the teacher’s reply begins in 1.2.',
    takeaway: 'The student asks what enables thinking, breathing, speaking, seeing, and hearing.',
    grammar: {
      title: 'Recognize your first Sanskrit question word',
      forms: 'केन + इषितम् → केनेषितम् · kena + iṣitam → keneṣitam',
      explanation: 'Kena means “by whom?” or “by what?” Iṣitam means “impelled.” When the words meet, a + i becomes e. This sound-joining is called sandhi. Before patati in the verse, final m is written ṃ: keneṣitaṃ patati. The word-by-word list separates the joined words again.',
    },
    check: {
      question: 'Which question is closest to the student’s?',
      choices: ['What thought should I think next?', 'What enables the mind to think at all?'],
      correct: 1,
      feedback: ['That asks about the content of a thought. Try shifting attention to what makes thinking possible.', 'Yes. The question turns from a particular thought to what enables thinking. You can understand the question before settling on an answer.'],
    },
  },
  '1.2': {
    orientation: 'The teacher begins answering 1.1 with a repeated phrase: “hearing of hearing,” “mind of mind.” Read the repetition slowly.',
    takeaway: 'The reply points to what enables our abilities. It calls this “hearing of hearing.”',
    grammar: {
      title: 'An ending can tell you how two words connect',
      forms: 'श्रोत्रस्य श्रोत्रम् · śrotrasya śrotram · hearing of hearing',
      explanation: 'Śrotrasya means “of hearing” or “of the ear.” The ending -sya gives the relationship “of”; grammarians call this the genitive. Śrotram means “hearing” or “ear.” “Hearing behind hearing” is an explanatory rendering of this repeated phrase.',
    },
    check: {
      question: 'In this course’s reading, what does “hearing of hearing” point toward?',
      choices: ['What enables hearing to occur', 'A quieter sound that needs a stronger ear'],
      correct: 0,
      feedback: ['Yes. The phrase directs the inquiry toward what makes hearing possible.', 'A quieter sound would still be something heard. The teacher is pointing toward what enables hearing itself.'],
    },
  },
  '1.3': {
    orientation: 'After the unusual answer in 1.2, the teacher explains why it is difficult to teach through ordinary description.',
    takeaway: 'Something that enables seeing and thinking may not be grasped like an object we see or think about.',
    grammar: {
      title: 'Learn a small word you can recognize immediately',
      forms: 'न तत्र चक्षुः गच्छति · na tatra cakṣuḥ gacchati',
      explanation: 'This short excerpt shows the word forms separately. Na means “not”; tatra means “there”; cakṣuḥ means “sight”; gacchati means “goes.” In the continuous verse, cakṣuḥ becomes cakṣur before gacchati. A close rendering is “Sight does not go there.” Find the repeated na in the verse.',
    },
    check: {
      question: 'Why does the teacher admit difficulty here?',
      choices: ['Every kind of learning is useless', 'Ordinary descriptions may not capture what the teacher is pointing to'],
      correct: 1,
      feedback: ['The teacher continues teaching. The difficulty concerns how to communicate this particular insight.', 'Yes. The admission explains a limit of ordinary description; it does not end the inquiry.'],
    },
  },
  '1.4': {
    orientation: 'The teacher now sharpens the point: “unknown” is not a sufficient description either. The teaching is received from earlier teachers.',
    takeaway: 'The text challenges both “I have it figured out” and “it is just something I have not discovered yet.”',
    grammar: {
      title: 'Notice how a prefix changes a meaning',
      forms: 'विदित · vidita · known → अविदित · avidita · unknown',
      explanation: 'The prefix a- negates vidita. The verse uses viditāt and aviditāt in the ablative case, which can express separation or comparison. Anyat gives “other than the known”; adhi gives “beyond the unknown.”',
    },
    check: {
      question: 'Which is the better reading of this passage?',
      choices: ['The source of knowing does not fit neatly into “known object” or “undiscovered object”', 'Brahman is simply an object that nobody has found yet'],
      correct: 0,
      feedback: ['Yes. This prepares you for the repeated teaching in 1.5–1.9.', 'That would place it entirely in the “unknown” category. The teacher explicitly challenges that category too.'],
    },
  },
}
