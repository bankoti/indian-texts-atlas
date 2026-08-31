import { kathaTeaching } from './kathaTeaching.generated'
import { kathaVerseTexts } from './kathaVerseTexts.generated'

export type KathaTerm = {
  term: string
  meaning: string
}

export type KathaPassage = {
  id: string
  sectionId: string
  number: number
  sessionId: string
  kind: 'numbered unit'
  title: string
  devanagari: string
  iast: string
  gloss: string
  explanation: string
  terms: KathaTerm[]
  textNote?: string
}

export type KathaSection = {
  id: string
  adhyaya: number
  valli: number
  label: string
  title: string
  form: string
  question: string
  summary: string
  recap: string
  checkpoint: {
    question: string
    choices: string[]
    correct: number
    explanation: string
  }
}

export type KathaSession = {
  id: string
  sectionId: string
  order: number
  title: string
  range: [number, number]
  recall: string
  nextQuestion: string
}

export const kathaInvocation = {
  devanagari: `ॐ सह नाववतु । सह नौ भुनक्तु । सहवीर्यं करवावहै ।
तेजस्वि नावधीतमस्तु । मा विद्विषावहै ॥
ॐ शान्तिः शान्तिः शान्तिः ॥`,
  iast: `oṃ saha nāv avatu | saha nau bhunaktu | sahavīryaṃ karavāvahai |
tejasvi nāv adhītam astu | mā vidviṣāvahai ||
oṃ śāntiḥ śāntiḥ śāntiḥ ||`,
  note: 'Traditional peace invocation for teacher and learner. It appears at the opening and again after the text in many editions; it is not counted among the 119 progress-bearing units.',
}

export const kathaSections: KathaSection[] = [
  {
    id: '1.1', adhyaya: 1, valli: 1, label: 'I · 1', title: 'Protect the question', form: '29 numbered units · 4 sessions',
    question: 'What makes a question worth refusing every substitute?',
    summary: 'Naciketas notices a troubling gift, reaches Death’s house, receives three boons, and will not exchange his final question for wealth or longevity.',
    recap: 'Naciketas enacts discernment before Yama names it: he repairs a relationship, learns the fire teaching faithfully, then protects the question that impermanent rewards cannot answer.',
    checkpoint: {
      question: 'Why does Naciketas refuse the long life, wealth, music, and pleasures Yama offers?',
      choices: ['Because every pleasure is sinful', 'Because they are temporary and leave his question about death unanswered', 'Because he wants a larger kingdom instead', 'Because he has already learned the answer'],
      correct: 1,
      explanation: 'His refusal is not a condemnation of every pleasure. It tests whether the third boon can be displaced by attractive but impermanent substitutes.',
    },
  },
  {
    id: '1.2', adhyaya: 1, valli: 2, label: 'I · 2', title: 'Learn to discriminate', form: '25 numbered units · 4 sessions',
    question: 'How do we distinguish what is beneficial from what is merely attractive now?',
    summary: 'Yama names śreyas and preyas, considers the conditions of learning, introduces Oṃ, and describes the unborn Self without dismissing ethical preparation.',
    recap: 'The teaching joins a quality of choice, a capable teacher and learner, concentrated support in Oṃ, and disciplined conduct. Study matters, but possession-like certainty is not enough.',
    checkpoint: {
      question: 'What does the distinction between śreyas and preyas ask the learner to discern?',
      choices: ['Painful choices from pleasant ones', 'The genuinely beneficial when it conflicts with immediate attraction', 'Religious actions from every ordinary action', 'Knowledge from all forms of enjoyment'],
      correct: 1,
      explanation: 'Pleasant and beneficial can coincide. The distinction becomes decisive when immediate attraction pulls away from a deeper or longer-horizon good.',
    },
  },
  {
    id: '1.3', adhyaya: 1, valli: 3, label: 'I · 3', title: 'Train the vehicle', form: '17 numbered units · 2 sessions',
    question: 'What must be coordinated for a person to travel well?',
    summary: 'The chariot analogy relates body, senses, mind, discernment, and Self; a hierarchy of inward gathering then leads to wakefulness and the razor-edge image.',
    recap: 'The image does not ask the learner to destroy the senses. Discernment guides, mind holds the reins, and the whole embodied system is trained toward its destination.',
    checkpoint: {
      question: 'In the chariot analogy, what enables the journey to reach its destination?',
      choices: ['The senses act without restraint', 'The body is rejected as unreal', 'Discernment guides, mind holds the reins, and the senses are trained together', 'The passenger becomes the charioteer'],
      correct: 2,
      explanation: 'The analogy assigns distinct roles. Its teaching is coordinated governance, not hostility toward embodiment or sensation.',
    },
  },
  {
    id: '2.1', adhyaya: 2, valli: 1, label: 'II · 1', title: 'Turn attention around', form: '15 numbered units · 3 sessions',
    question: 'What becomes visible when outward attention learns to reverse direction?',
    summary: 'The senses face outward, but a discerning learner turns inward. Waking, dream, inherited cosmic images, non-difference, and water analogies point back to “this indeed is that.”',
    recap: 'The repeated refrain gathers many images without making them identical. Each redirects the third boon toward a reality present in experience and not exhausted by appearances.',
    checkpoint: {
      question: 'What does the refrain etad vai tat—“this indeed is that”—do across this vallī?',
      choices: ['It marks unrelated ritual instructions', 'It connects varied inward and cosmic indications to the reality Naciketas asked about', 'It means every object is physically identical', 'It ends the dialogue after each verse'],
      correct: 1,
      explanation: 'The refrain acts like a return signal: these different images are answers to the same inquiry, not a collection of disconnected claims.',
    },
  },
  {
    id: '2.2', adhyaya: 2, valli: 2, label: 'II · 2', title: 'Recognize one within many', form: '15 numbered units · 2 sessions',
    question: 'How can one reality appear through many lives and forms?',
    summary: 'The eleven-gated city, breath, death, dream, fire, wind, sun, and light beyond lights develop a pattern of indwelling presence without simple reduction.',
    recap: 'Fire and wind take the forms of what they enter; the sun illuminates without being stained by what is seen. The analogies show relation while warning against exhausting the Self in any one form.',
    checkpoint: {
      question: 'What do the fire, wind, and sun analogies contribute?',
      choices: ['A physical theory of the elements', 'One indwelling reality appears through diverse forms without being exhausted by them', 'Proof that suffering is unreal', 'A replacement for the earlier chariot analogy'],
      correct: 1,
      explanation: 'The images make unity and diversity thinkable together. They do not erase lived difference or dismiss suffering.',
    },
  },
  {
    id: '2.3', adhyaya: 2, valli: 3, label: 'II · 3', title: 'Stabilize and release', form: '18 numbered units · 3 sessions',
    question: 'How does recognition become a stable way of being?',
    summary: 'An inverted tree, cosmic order, degrees of clarity, inner hierarchy, sensory steadiness, disciplined affirmation, released desires, heart-knots, nāḍīs, and a reed-fibre image bring the teaching to its close.',
    recap: 'Kaṭha’s closing movement joins steadiness and vigilance. Release is not numbness: binding desire and confusion loosen as the learner recognizes what the text calls bright and deathless.',
    checkpoint: {
      question: 'What do 2.3.10–11 call yoga?',
      choices: ['Posture alone', 'Sleep without dreams', 'Stable holding of the faculties together with vigilance', 'Permanent mental blankness'],
      correct: 2,
      explanation: 'This is an early, text-specific definition: the senses, mind, and discernment become steady, while the practitioner remains alert because such steadiness can arise and subside.',
    },
  },
]

export const kathaSessions: KathaSession[] = [
  { id: '1.1.a', sectionId: '1.1', order: 1, title: 'A gift that cannot nourish', range: [1, 6], recall: 'What does Naciketas notice, and why does mortality enter his reasoning?', nextQuestion: 'What happens when a guest reaches Death’s house before Death does?' },
  { id: '1.1.b', sectionId: '1.1', order: 2, title: 'Three nights, first boon', range: [7, 11], recall: 'Why is hospitality more than background scenery here?', nextQuestion: 'Why does the second boon return to ritual rather than skip directly to liberation?' },
  { id: '1.1.c', sectionId: '1.1', order: 3, title: 'The Nāciketa fire', range: [12, 19], recall: 'What does the text actually promise through the fire teaching?', nextQuestion: 'What question can only Death answer?' },
  { id: '1.1.d', sectionId: '1.1', order: 4, title: 'The third boon tested', range: [20, 29], recall: 'Name the logic of Naciketas’ refusal without saying that pleasure is evil.', nextQuestion: 'How will Yama name the quality Naciketas has already displayed?' },
  { id: '1.2.a', sectionId: '1.2', order: 5, title: 'Two orientations', range: [1, 6], recall: 'When do śreyas and preyas pull in different directions?', nextQuestion: 'Why are both teacher and learner described as rare?' },
  { id: '1.2.b', sectionId: '1.2', order: 6, title: 'Teaching and reception', range: [7, 13], recall: 'Why is argument alone described as insufficient rather than useless?', nextQuestion: 'How does Naciketas ask for what lies beyond familiar opposites?' },
  { id: '1.2.c', sectionId: '1.2', order: 7, title: 'Oṃ and the unborn Self', range: [14, 19], recall: 'What functions does Oṃ serve in this vallī—and what later scheme is not yet stated?', nextQuestion: 'How can the Self be described as both smaller and greater?' },
  { id: '1.2.d', sectionId: '1.2', order: 8, title: 'Subtle presence, prepared learner', range: [20, 25], recall: 'What capacities and ethical conditions accompany this knowledge?', nextQuestion: 'How will the next vallī picture those capacities working together?' },
  { id: '1.3.a', sectionId: '1.3', order: 9, title: 'Bridge and chariot', range: [1, 9], recall: 'Rebuild the chariot analogy role by role without turning it into anatomy.', nextQuestion: 'What lies beyond the senses, mind, and discernment?' },
  { id: '1.3.b', sectionId: '1.3', order: 10, title: 'Gathering and wakefulness', range: [10, 17], recall: 'Why is the path compared to a sharpened edge?', nextQuestion: 'What changes when attention stops moving only outward?' },
  { id: '2.1.a', sectionId: '2.1', order: 11, title: 'Outward and inward', range: [1, 5], recall: 'What is reversed—and what is not condemned—when attention turns inward?', nextQuestion: 'Why does Yama use inherited images of birth, fire, and sun?' },
  { id: '2.1.b', sectionId: '2.1', order: 12, title: 'Cosmic indications', range: [6, 9], recall: 'What work does “this indeed is that” perform after each image?', nextQuestion: 'How will the text relate what is here to what is there?' },
  { id: '2.1.c', sectionId: '2.1', order: 13, title: 'Here, there, and water', range: [10, 15], recall: 'How do the two water images contrast scattered difference and recognition?', nextQuestion: 'What might it mean to call the body an eleven-gated city?' },
  { id: '2.2.a', sectionId: '2.2', order: 14, title: 'City, breath, death', range: [1, 7], recall: 'Why does the text say life depends on more than the breaths themselves?', nextQuestion: 'What remains awake while ordinary awareness sleeps?' },
  { id: '2.2.b', sectionId: '2.2', order: 15, title: 'One within many', range: [8, 15], recall: 'What do fire, wind, and sun each add to the one-and-many pattern?', nextQuestion: 'Why will the final vallī begin with a tree whose root is above?' },
  { id: '2.3.a', sectionId: '2.3', order: 16, title: 'Rooted cosmos, urgent life', range: [1, 6], recall: 'What kind of order or awe does the text’s language of bhaya evoke?', nextQuestion: 'What lies beyond the senses in the final hierarchy?' },
  { id: '2.3.b', sectionId: '2.3', order: 17, title: 'Stillness and affirmation', range: [7, 13], recall: 'Why does this yoga require both steadiness and vigilance?', nextQuestion: 'What would release mean if it is not repression?' },
  { id: '2.3.c', sectionId: '2.3', order: 18, title: 'Knots loosen, story closes', range: [14, 18], recall: 'How do desire, heart-knots, subtle channels, and the reed image differ from one another?', nextQuestion: 'Can you retell the whole movement from protected question to release?' },
]

export const kathaSources = [
  { label: 'Sanskrit Wikisource · Kaṭha I.1', url: 'https://sa.wikisource.org/wiki/कठोपनिषत्/प्रथमोध्यायः/प्रथमवल्ली', use: 'Reusable Devanagari base; the six vallī pages supply the study text.' },
  { label: 'Vedic Heritage Portal · Kathopanishad', url: 'https://vedicheritage.gov.in/hi/upanishads/kathopanishad/', use: 'Government reference for the two-adhyāya, six-vallī hierarchy and terminal counts.' },
  { label: 'GRETIL · Kāṭha-Upaniṣad', url: 'https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/1_veda/4_upa/kathop_u.htm', use: 'Scholarly transliteration used only as a collation aid, not reproduced as the course base.' },
  { label: 'TITUS · Kāṭha-Upaniṣad', url: 'https://titus.uni-frankfurt.de/texte/etcs/ind/aind/ved/yvs/upanisad/kathup/kathut.htm', use: 'Detailed edition used only to check difficult forms and numbering.' },
  { label: 'Dominik Haas · Vom Feueraltar zum Yoga (2024)', url: 'https://hasp.ub.uni-heidelberg.de/catalog/book/1329', use: 'Open-access recent critical study for textual and interpretive checks.' },
  { label: 'Max Müller · Kaṭha Upaniṣad (1884)', url: 'https://en.wikisource.org/wiki/Sacred_Books_of_the_East/Volume_15/Katha-upanishad', use: 'Public-domain English comparison and historical notes; not copied as the course voice.' },
  { label: 'R. E. Hume · Thirteen Principal Upanishads (1921)', url: 'https://openlibrary.org/books/OL6639499M/The_thirteen_principal_Upanishads', use: 'Public-domain comparison translation.' },
  { label: 'Creative Commons Attribution-ShareAlike 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/', use: 'License governing the adapted Wikisource Sanskrit and derived IAST layers.' },
]

export const kathaEditorialNote = 'This course presents 119 progress-bearing numbered units in the traditional two-adhyāya, six-vallī hierarchy: 29 + 25 + 17 + 15 + 15 + 18. Opening and closing peace invocations are not counted. The Devanagari layer is adapted from Sanskrit Wikisource and checked against the Vedic Heritage Portal, GRETIL, TITUS, and recent open scholarship; punctuation, lineation, spelling, and the generated IAST study layer are normalized. It is an unaccented study text, not a chanting guide. Course paraphrases are original and intentionally separated from interpretation; selected variant notes mark consequential uncertainties.'

const teachingById = new Map(kathaTeaching.map((item) => [item.id, item]))

function sessionFor(sectionId: string, number: number): KathaSession {
  const session = kathaSessions.find((item) => item.sectionId === sectionId && number >= item.range[0] && number <= item.range[1])
  if (!session) throw new Error(`No Kaṭha session for ${sectionId}.${number}`)
  return session
}

export const kathaPassages: KathaPassage[] = kathaVerseTexts.map((text) => {
  const teaching = teachingById.get(text.id)
  if (!teaching) throw new Error(`No Kaṭha teaching metadata for ${text.id}`)
  return {
    ...text,
    ...teaching,
    sessionId: sessionFor(text.sectionId, text.number).id,
    kind: 'numbered unit',
  }
})

export function getKathaSection(sectionId: string): KathaSection | undefined {
  return kathaSections.find((section) => section.id === sectionId)
}

export function getKathaPassagesForSection(sectionId: string): KathaPassage[] {
  return kathaPassages.filter((passage) => passage.sectionId === sectionId)
}

export function getKathaSession(sessionId: string): KathaSession | undefined {
  return kathaSessions.find((session) => session.id === sessionId)
}

export function getKathaPassagesForSession(sessionId: string): KathaPassage[] {
  return kathaPassages.filter((passage) => passage.sessionId === sessionId)
}
