export type CourseStatus = 'available' | 'mapped'

export type Upanishad = {
  id: string
  order: number
  title: string
  plainTitle: string
  veda: string
  form: string
  question: string
  insight: string
  status: CourseStatus
  minutes: number
  references: string[]
}

export type LessonDetail = {
  id: string
  locate: {
    corpus: string
    placement: string
    context: string
  }
  read: {
    anchor: string
    paraphrase: string
    readingNote: string
  }
  concepts: Array<{ term: string; meaning: string }>
  lenses: Array<{ name: string; reading: string }>
  reflection: string
  quiz: {
    question: string
    choices: string[]
    correct: number
    explanation: string
  }
  sourceLinks: Array<{ label: string; url: string }>
}

export const upanishads: Upanishad[] = [
  {
    id: 'kena', order: 1, title: 'Kena Upaniṣad', plainTitle: 'Kena', veda: 'Sāmaveda', form: 'Prose and verse', minutes: 12,
    question: 'What makes the mind think?',
    insight: 'Mind, speech, sight, and hearing do not exhaust what makes cognition possible. Its closing story also humbles any claim to possess ultimate knowledge.',
    status: 'available', references: ['Kena 1.1–9', 'Kena 3–4'],
  },
  {
    id: 'katha', order: 2, title: 'Kaṭha Upaniṣad', plainTitle: 'Katha', veda: 'Kṛṣṇa Yajurveda', form: 'Dialogue', minutes: 14,
    question: 'What can death teach us about the self?',
    insight: 'Naciketas chooses śreyas—the genuinely beneficial—over preyas, the immediately pleasant, opening a disciplined inquiry into self and mortality.',
    status: 'available', references: ['Kaṭha 1.2.1–2', 'Kaṭha 1.3.3–9'],
  },
  {
    id: 'isha', order: 3, title: 'Īśā Upaniṣad', plainTitle: 'Isha', veda: 'Śukla Yajurveda', form: '18 verses', minutes: 12,
    question: 'Can freedom and action belong together?',
    insight: 'Its compact verses place enjoyment and renunciation, action and freedom, knowledge and ignorance in deliberate tension rather than offering easy binaries.',
    status: 'available', references: ['Īśā 1–2', 'Īśā 9–14'],
  },
  {
    id: 'mundaka', order: 4, title: 'Muṇḍaka Upaniṣad', plainTitle: 'Mundaka', veda: 'Atharvaveda', form: 'Verse teaching', minutes: 13,
    question: 'What kind of knowledge can liberate?',
    insight: 'It distinguishes lower learning—including Vedic disciplines—from higher knowledge of the imperishable, and uses two birds to explore participation and witnessing.',
    status: 'mapped', references: ['Muṇḍaka 1.1.4–5', 'Muṇḍaka 3.1.1–2'],
  },
  {
    id: 'taittiriya', order: 5, title: 'Taittirīya Upaniṣad', plainTitle: 'Taittiriya', veda: 'Kṛṣṇa Yajurveda', form: 'Three sections', minutes: 16,
    question: 'How should learning transform a person?',
    insight: 'Ethical formation, food, breath, mind, understanding, and bliss become nested approaches to education and selfhood—not merely an abstract metaphysical chart.',
    status: 'mapped', references: ['Taittirīya 1.11', 'Taittirīya 2.1–5'],
  },
  {
    id: 'chandogya', order: 6, title: 'Chāndogya Upaniṣad', plainTitle: 'Chandogya', veda: 'Sāmaveda', form: 'Eight chapters', minutes: 20,
    question: 'Can an unseen essence explain visible plurality?',
    insight: 'Its analogies and experiments culminate in “tat tvam asi,” a teaching whose meaning is interpreted differently across Vedānta traditions.',
    status: 'mapped', references: ['Chāndogya 6.1–16'],
  },
  {
    id: 'brihadaranyaka', order: 7, title: 'Bṛhadāraṇyaka Upaniṣad', plainTitle: 'Brihadaranyaka', veda: 'Śukla Yajurveda', form: 'Six chapters', minutes: 22,
    question: 'Can the deepest self become an object?',
    insight: '“Not this, not this,” the inner controller, and the debates of Yājñavalkya, Maitreyī, and Gārgī make inquiry argumentative, social, and ethically consequential.',
    status: 'mapped', references: ['Bṛhadāraṇyaka 2.3.6', 'Bṛhadāraṇyaka 3.7'],
  },
  {
    id: 'mandukya', order: 8, title: 'Māṇḍūkya Upaniṣad', plainTitle: 'Mandukya', veda: 'Atharvaveda', form: '12 verses', minutes: 11,
    question: 'What remains through waking, dream, and sleep?',
    insight: 'It maps Oṃ to waking, dreaming, deep sleep, and turīya—the “fourth”—while later commentary develops claims that should not be silently merged into the base text.',
    status: 'mapped', references: ['Māṇḍūkya 1–12'],
  },
  {
    id: 'aitareya', order: 9, title: 'Aitareya Upaniṣad', plainTitle: 'Aitareya', veda: 'Ṛgveda', form: 'Three chapters', minutes: 12,
    question: 'What role does consciousness play in a world?',
    insight: 'Creation, embodiment, birth, and awareness converge in a reflection on consciousness as central to identity and experience.',
    status: 'mapped', references: ['Aitareya 1–3'],
  },
  {
    id: 'kaushitaki', order: 10, title: 'Kauṣītaki Upaniṣad', plainTitle: 'Kaushitaki', veda: 'Ṛgveda', form: 'Four chapters', minutes: 13,
    question: 'How are breath, awareness, and life connected?',
    insight: 'Its dialogues connect prāṇa, consciousness, ritual reinterpretation, and journeys after death without collapsing them into a single later doctrine.',
    status: 'mapped', references: ['Kauṣītaki 1–4'],
  },
  {
    id: 'prashna', order: 11, title: 'Praśna Upaniṣad', plainTitle: 'Prashna', veda: 'Atharvaveda', form: 'Six questions', minutes: 15,
    question: 'What changes when inquiry becomes disciplined?',
    insight: 'Six students ask structured questions about life, prāṇa, sleep, cosmology, and Oṃ, making the form of questioning part of the teaching.',
    status: 'mapped', references: ['Praśna 1–6'],
  },
  {
    id: 'shvetashvatara', order: 12, title: 'Śvetāśvatara Upaniṣad', plainTitle: 'Shvetashvatara', veda: 'Kṛṣṇa Yajurveda', form: 'Six chapters', minutes: 16,
    question: 'How do yoga and devotion reshape older inquiry?',
    insight: 'It brings yogic practice and a more explicitly theistic orientation into conversation with Upaniṣadic questions of cause, self, and liberation.',
    status: 'mapped', references: ['Śvetāśvatara 1–6'],
  },
  {
    id: 'maitri', order: 13, title: 'Maitrī Upaniṣad', plainTitle: 'Maitri', veda: 'Kṛṣṇa Yajurveda', form: 'Seven lessons', minutes: 17,
    question: 'Can the restless mind become a path?',
    insight: 'A later synthesis examines mind, time, embodiment, and yoga, showing the Upaniṣadic tradition continuing to reinterpret itself.',
    status: 'mapped', references: ['Maitrī 1–7'],
  },
]

export const lessonDetails: Record<string, LessonDetail> = {
  kena: {
    id: 'kena',
    locate: {
      corpus: 'Sāmaveda → Talavakāra branch → Kena Upaniṣad',
      placement: 'One of the early principal Upaniṣads; its name comes from its opening question, “by whom?”',
      context: 'The work moves from compressed philosophical questions to a narrative in which the gods mistake a victory for their own achievement.',
    },
    read: {
      anchor: 'Kena 1.1–9 and 3–4',
      paraphrase: 'The text asks what impels mind, speech, breath, sight, and hearing. It answers by pointing toward what enables these capacities without becoming one more object among them. A later story lets an unknown presence defeat the gods’ certainty.',
      readingNote: 'This is a course paraphrase, not a substitute for a named translation. Notice how the text teaches through both paradox and story.',
    },
    concepts: [
      { term: 'Kena', meaning: '“By whom?”—the question that opens the inquiry.' },
      { term: 'Brahman', meaning: 'Here, the enabling reality that exceeds ordinary sensory and conceptual grasp.' },
      { term: 'Vidyā', meaning: 'Knowledge or understanding; the text complicates what it means to “know.”' },
    ],
    lenses: [
      { name: 'Epistemic lens', reading: 'The point is not anti-intellectualism. It is a warning that the conditions of knowing are not captured like ordinary objects.' },
      { name: 'Narrative lens', reading: 'The Yakṣa story converts abstraction into an ethical lesson: insight and power do not justify pride.' },
      { name: 'Vedānta reception', reading: 'Later schools explain the relation between awareness, self, and Brahman differently; the base text should be encountered before choosing one synthesis.' },
    ],
    reflection: 'Think of something you understand well. What makes that understanding possible, yet is difficult to turn into an object of the same understanding?',
    quiz: {
      question: 'What is the Kena Upaniṣad primarily doing when it asks what directs mind and speech?',
      choices: ['Naming a new sense organ', 'Pointing toward the enabling ground of cognition', 'Rejecting every kind of learning', 'Offering a ritual calendar'],
      correct: 1,
      explanation: 'The text redirects attention from objects we know toward what makes knowing possible, while refusing to reduce that ground to another ordinary object.',
    },
    sourceLinks: [
      { label: 'IEP overview of the Upaniṣads', url: 'https://iep.utm.edu/upanisad/' },
      { label: 'Public-domain Hume translation index', url: 'https://onlinebooks.library.upenn.edu/webbin/book/lookupid?key=olbp42350' },
    ],
  },
  katha: {
    id: 'katha',
    locate: {
      corpus: 'Kṛṣṇa Yajurveda → Kaṭha school → Kaṭha Upaniṣad',
      placement: 'A principal Upaniṣad structured around the dialogue between the young Naciketas and Yama, lord of death.',
      context: 'Its memorable narrative makes it a strong early entry point, but its images still support several later philosophical readings.',
    },
    read: {
      anchor: 'Kaṭha 1.2.1–2 and 1.3.3–9',
      paraphrase: 'Yama distinguishes what is genuinely beneficial from what is immediately pleasant. The text later pictures body as chariot, senses as horses, mind as reins, and discernment as charioteer—an image of disciplined integration.',
      readingNote: 'The chariot is an analogy, not a literal anatomy. Ask what the relationships in the image reveal, and where the analogy may stop working.',
    },
    concepts: [
      { term: 'Śreyas', meaning: 'The genuinely good or beneficial, especially over a longer horizon.' },
      { term: 'Preyas', meaning: 'What is immediately pleasant, attractive, or gratifying.' },
      { term: 'Ātman', meaning: 'Self; its precise meaning shifts by context and later interpretive tradition.' },
    ],
    lenses: [
      { name: 'Ethical lens', reading: 'Freedom begins in the quality of choice: which desire deserves authority over the others?' },
      { name: 'Psychological lens', reading: 'The chariot image models coordination among sensation, attention, judgment, and a deeper center of identity.' },
      { name: 'Mortality lens', reading: 'Death is not merely an enemy in the dialogue; it becomes the boundary that makes Naciketas’ question unavoidable.' },
    ],
    reflection: 'Name one current choice where preyas and śreyas point in different directions. What makes the pleasant option persuasive?',
    quiz: {
      question: 'What distinction does Yama ask Naciketas to recognize?',
      choices: ['Speech versus silence', 'Public versus private ritual', 'The beneficial versus the merely pleasant', 'Waking versus dreaming'],
      correct: 2,
      explanation: 'Śreyas and preyas can overlap, but the teaching matters precisely when immediate attraction conflicts with deeper benefit.',
    },
    sourceLinks: [
      { label: 'IEP overview of the Upaniṣads', url: 'https://iep.utm.edu/upanisad/' },
      { label: 'Vedic Heritage Portal: Upaniṣads', url: 'https://vedicheritage.gov.in/upanishads/' },
    ],
  },
  isha: {
    id: 'isha',
    locate: {
      corpus: 'Śukla Yajurveda → Vājasaneyi Saṃhitā → Īśā Upaniṣad',
      placement: 'An unusually short principal Upaniṣad that appears as the final portion of a Vedic Saṃhitā.',
      context: 'Its eighteen verses are densely compressed. Translation choices strongly influence whether individual lines sound world-affirming, renunciatory, devotional, or nondual.',
    },
    read: {
      anchor: 'Īśā 1–2 and 9–14',
      paraphrase: 'The opening pairs an all-pervading sacred reality with disciplined enjoyment or renunciation, then allows a full life of action. Later verses resist a simple victory of knowledge over ignorance by asking the learner to hold both in relation.',
      readingNote: 'Key Sanskrit terms in these verses carry several plausible meanings. Compare named translations before treating any English wording as the text itself.',
    },
    concepts: [
      { term: 'Īśā / Īśāvāsya', meaning: 'A phrase often read in relation to indwelling, enveloping, or divine presence.' },
      { term: 'Karman', meaning: 'Action and its consequences; not simply fate.' },
      { term: 'Vidyā / avidyā', meaning: 'Knowledge and ignorance, whose relationship here is deliberately difficult.' },
    ],
    lenses: [
      { name: 'Action lens', reading: 'The text does not permit an easy equation of spirituality with inactivity.' },
      { name: 'Renunciation lens', reading: 'Renunciation may concern possessiveness and identity, not only physical departure from social life.' },
      { name: 'Translation lens', reading: 'Words in the opening verse can shift the balance between inhabiting, enjoying, protecting, and relinquishing.' },
    ],
    reflection: 'What would it mean to act fully in one part of your life while loosening the claim that its outcome belongs entirely to you?',
    quiz: {
      question: 'Why is the Īśā Upaniṣad a poor fit for a simple “worldly action versus spiritual knowledge” binary?',
      choices: ['It never discusses action', 'It treats ritual as the only knowledge', 'It holds action, knowledge, and renunciation in productive tension', 'It has no surviving text'],
      correct: 2,
      explanation: 'Its compact verses repeatedly pair ideas that later readers may be tempted to separate, requiring careful interpretation rather than a quick slogan.',
    },
    sourceLinks: [
      { label: 'Vedic Heritage Portal: Upaniṣads', url: 'https://vedicheritage.gov.in/upanishads/' },
      { label: 'Sacred Books of the East, Part I', url: 'https://archive.sacred-texts.com/hin/sbe01/index.htm' },
    ],
  },
}

export const rootBranches = [
  {
    id: 'shruti', eyebrow: 'Authority: “heard”', title: 'Śruti', tone: 'saffron',
    description: 'Vedic textual authority, preserved through oral lineages and school-specific recensions. Each Veda is associated with multiple textual layers.',
    nodes: ['Ṛgveda', 'Sāmaveda', 'Yajurveda', 'Atharvaveda'],
    subnodes: ['Saṃhitā', 'Brāhmaṇa', 'Āraṇyaka', 'Upaniṣad'],
    note: 'The layer sequence is an orientation aid, not a strict publication timeline.',
  },
  {
    id: 'smriti', eyebrow: 'Authority: “remembered”', title: 'Smṛti', tone: 'rose',
    description: 'A wide field of composed and remembered traditions that transmit narrative, ethics, law, devotion, cosmology, and social thought.',
    nodes: ['Itihāsa', 'Purāṇa', 'Dharma literature', 'Bhagavad Gītā'],
    subnodes: ['Mahābhārata', 'Rāmāyaṇa', 'Many Purāṇas', 'Sūtra & Śāstra'],
    note: 'The Bhagavad Gītā is a section within the Mahābhārata, not a separate Veda.',
  },
  {
    id: 'systems', eyebrow: 'Disciplines and lineages', title: 'Knowledge systems', tone: 'indigo',
    description: 'These categories describe supporting disciplines, philosophical schools, or practice lineages—not the same kind of authority tier as Śruti and Smṛti.',
    nodes: ['Six Vedāṅgas', 'Six Darśanas', 'Yoga lineages', 'Āgama & Tantra'],
    subnodes: ['Language & ritual', 'Reason & metaphysics', 'Practice & liberation', 'Revelation & ritual'],
    note: 'Āgama and Tantra span Śaiva, Vaiṣṇava, Śākta, Buddhist, and Jain contexts.',
  },
  {
    id: 'plural', eyebrow: 'Parallel Indian traditions', title: 'Many voices', tone: 'leaf',
    description: 'Ancient Indian thought is not exhausted by Veda-oriented traditions. Other communities developed their own canons, languages, and arguments.',
    nodes: ['Buddhist canons', 'Jain textual histories', 'Sangam corpus', 'Materialist voices'],
    subnodes: ['Pāli & beyond', 'Śvetāmbara / Digambara', 'Classical Tamil', 'Cārvāka fragments'],
    note: 'Buddhist and Jain traditions belong alongside—not underneath—the Brahmanical map.',
  },
]

export const referenceSources = [
  { label: 'Internet Encyclopedia of Philosophy: Upaniṣads', url: 'https://iep.utm.edu/upanisad/', use: 'Academic overview, chronology, themes, and bibliography' },
  { label: 'Government of India: Vedic Heritage Portal', url: 'https://vedicheritage.gov.in/upanishads/', use: 'Vedic affiliations and textual orientation' },
  { label: 'UT Austin Sanskrit: Early Upaniṣads', url: 'https://sites.utexas.edu/sanskrit/resources/early-upanisads-olivelle-edition/', use: 'Searchable Roman-script transcriptions; translation remains copyrighted' },
  { label: 'UPenn: Hume’s Thirteen Principal Upanishads', url: 'https://onlinebooks.library.upenn.edu/webbin/book/lookupid?key=olbp42350', use: 'Stable access to a public-domain translation' },
  { label: 'GRETIL, University of Göttingen', url: 'https://gretil.sub.uni-goettingen.de/gretil.html', use: 'Electronic Sanskrit, Pāli, and Prakrit texts' },
]
