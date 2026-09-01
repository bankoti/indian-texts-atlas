import {
  widerLessonDetails,
  widerLessons,
  widerReferenceSources,
  widerSections,
} from './widerCourseData'

export type CourseStatus = 'available' | 'mapped'

export type CourseLesson = {
  id: string
  sectionId: string
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
    anchorLabel?: string
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

export type CourseSection = {
  id: string
  order: number
  shortTitle: string
  title: string
  eyebrow: string
  description: string
  promise: string
  tone: 'saffron' | 'rose' | 'indigo' | 'leaf'
}

export const foundationLesson: CourseLesson = {
  id: 'course-0', sectionId: 'foundation', order: 0, title: 'Course 0 · How It All Connects', plainTitle: 'Course 0', veda: 'Foundation', form: 'Visual orientation', minutes: 18,
  question: 'What is the whole landscape, and where do the Upaniṣads fit?',
  insight: 'Begin with one clear picture: many textual libraries in conversation. Then use a worked example to learn three coordinates before zooming into the Vedas and Upaniṣads.',
  status: 'available', references: ['Śruti / Smṛti', 'Genre / textual layer', 'Tradition / school'],
}

export const upanishads: CourseLesson[] = [
  {
    id: 'kena', sectionId: 'upanishads', order: 1, title: 'Kena Upaniṣad', plainTitle: 'Kena', veda: 'Sāmaveda', form: '35-unit depth edition', minutes: 95,
    question: 'What makes the mind think?',
    insight: 'Read every mantra and prose passage with an optional word-by-word Sanskrit layer: the inquiry behind mind and senses becomes a story about power, humility, revelation, and disciplined truthfulness.',
    status: 'available', references: ['Kena I · 9 mantras', 'Kena II · 5 mantras', 'Kena III–IV · 21 prose passages'],
  },
  {
    id: 'katha', sectionId: 'upanishads', order: 2, title: 'Kaṭha Upaniṣad', plainTitle: 'Kaṭha', veda: 'Kṛṣṇa Yajurveda', form: '119-unit depth edition', minutes: 360,
    question: 'What can death teach us about the self?',
    insight: 'Read all six vallīs in eighteen paced sessions, with every unit available word by word: Naciketas protects his question, distinguishes śreyas from preyas, trains the faculties, turns inward, recognizes one presence through many forms, and follows the teaching toward release.',
    status: 'available', references: ['Kaṭha I · 71 units', 'Kaṭha II · 48 units', 'Six vallīs · 119 total'],
  },
  {
    id: 'isha', sectionId: 'upanishads', order: 3, title: 'Īśā Upaniṣad', plainTitle: 'Isha', veda: 'Śukla Yajurveda', form: '18 verses', minutes: 12,
    question: 'Can freedom and action belong together?',
    insight: 'Its compact verses place enjoyment and renunciation, action and freedom, knowledge and ignorance in deliberate tension rather than offering easy binaries.',
    status: 'available', references: ['Īśā 1–2', 'Īśā 9–14'],
  },
  {
    id: 'mundaka', sectionId: 'upanishads', order: 4, title: 'Muṇḍaka Upaniṣad', plainTitle: 'Mundaka', veda: 'Atharvaveda', form: 'Verse teaching', minutes: 13,
    question: 'What kind of knowledge can liberate?',
    insight: 'It distinguishes lower learning—including Vedic disciplines—from higher knowledge of the imperishable, and uses two birds to explore participation and witnessing.',
    status: 'available', references: ['Muṇḍaka 1.1.4–5', 'Muṇḍaka 3.1.1–2'],
  },
  {
    id: 'taittiriya', sectionId: 'upanishads', order: 5, title: 'Taittirīya Upaniṣad', plainTitle: 'Taittiriya', veda: 'Kṛṣṇa Yajurveda', form: 'Three sections', minutes: 16,
    question: 'How should learning transform a person?',
    insight: 'Ethical formation, food, breath, mind, understanding, and bliss become nested approaches to education and selfhood—not merely an abstract metaphysical chart.',
    status: 'available', references: ['Taittirīya 1.11', 'Taittirīya 2.1–5'],
  },
  {
    id: 'chandogya', sectionId: 'upanishads', order: 6, title: 'Chāndogya Upaniṣad', plainTitle: 'Chandogya', veda: 'Sāmaveda', form: 'Eight chapters', minutes: 20,
    question: 'Can an unseen essence explain visible plurality?',
    insight: 'Its analogies and experiments culminate in “tat tvam asi,” a teaching whose meaning is interpreted differently across Vedānta traditions.',
    status: 'available', references: ['Chāndogya 6.1–16'],
  },
  {
    id: 'brihadaranyaka', sectionId: 'upanishads', order: 7, title: 'Bṛhadāraṇyaka Upaniṣad', plainTitle: 'Brihadaranyaka', veda: 'Śukla Yajurveda', form: 'Six chapters', minutes: 22,
    question: 'Can the deepest self become an object?',
    insight: '“Not this, not this,” the inner controller, and the debates of Yājñavalkya, Maitreyī, and Gārgī make inquiry argumentative, social, and ethically consequential.',
    status: 'available', references: ['Bṛhadāraṇyaka 2.3.6', 'Bṛhadāraṇyaka 3.7'],
  },
  {
    id: 'mandukya', sectionId: 'upanishads', order: 8, title: 'Māṇḍūkya Upaniṣad', plainTitle: 'Mandukya', veda: 'Atharvaveda', form: '12 verses', minutes: 11,
    question: 'What remains through waking, dream, and sleep?',
    insight: 'It maps Oṃ to waking, dreaming, deep sleep, and turīya—the “fourth”—while later commentary develops claims that should not be silently merged into the base text.',
    status: 'available', references: ['Māṇḍūkya 1–12'],
  },
  {
    id: 'aitareya', sectionId: 'upanishads', order: 9, title: 'Aitareya Upaniṣad', plainTitle: 'Aitareya', veda: 'Ṛgveda', form: 'Three chapters', minutes: 12,
    question: 'What role does consciousness play in a world?',
    insight: 'Creation, embodiment, birth, and awareness converge in a reflection on consciousness as central to identity and experience.',
    status: 'available', references: ['Aitareya 1–3'],
  },
  {
    id: 'kaushitaki', sectionId: 'upanishads', order: 10, title: 'Kauṣītaki Upaniṣad', plainTitle: 'Kaushitaki', veda: 'Ṛgveda', form: 'Four chapters', minutes: 13,
    question: 'How are breath, awareness, and life connected?',
    insight: 'Its dialogues connect prāṇa, consciousness, ritual reinterpretation, and journeys after death without collapsing them into a single later doctrine.',
    status: 'available', references: ['Kauṣītaki 1–4'],
  },
  {
    id: 'prashna', sectionId: 'upanishads', order: 11, title: 'Praśna Upaniṣad', plainTitle: 'Prashna', veda: 'Atharvaveda', form: 'Six questions', minutes: 15,
    question: 'What changes when inquiry becomes disciplined?',
    insight: 'Six students ask structured questions about life, prāṇa, sleep, cosmology, and Oṃ, making the form of questioning part of the teaching.',
    status: 'available', references: ['Praśna 1–6'],
  },
  {
    id: 'shvetashvatara', sectionId: 'upanishads', order: 12, title: 'Śvetāśvatara Upaniṣad', plainTitle: 'Shvetashvatara', veda: 'Kṛṣṇa Yajurveda', form: 'Six chapters', minutes: 16,
    question: 'How do yoga and devotion reshape older inquiry?',
    insight: 'It brings yogic practice and a more explicitly theistic orientation into conversation with Upaniṣadic questions of cause, self, and liberation.',
    status: 'available', references: ['Śvetāśvatara 1–6'],
  },
  {
    id: 'maitri', sectionId: 'upanishads', order: 13, title: 'Maitrī Upaniṣad', plainTitle: 'Maitri', veda: 'Kṛṣṇa Yajurveda', form: 'Seven lessons', minutes: 17,
    question: 'Can the restless mind become a path?',
    insight: 'A later synthesis examines mind, time, embodiment, and yoga, showing the Upaniṣadic tradition continuing to reinterpret itself.',
    status: 'available', references: ['Maitrī 1–7'],
  },
]

export const courseSections: CourseSection[] = [
  {
    id: 'foundation',
    order: 0,
    shortTitle: 'Course 0',
    title: 'How It All Connects',
    eyebrow: 'COURSE 0 · ORIENTATION',
    description: 'Build the root map before opening an individual text: authority, genre, textual layer, tradition, language, and historical reception.',
    promise: 'Leave with a mental map you can redraw—and a reliable way to locate any later lesson.',
    tone: 'saffron',
  },
  {
    id: 'upanishads',
    order: 1,
    shortTitle: 'Principal Upaniṣads',
    title: 'Thirteen Upaniṣadic Questions',
    eyebrow: 'COURSE 1 · PRINCIPAL UPANIṢADS',
    description: 'Study thirteen widely taught early and middle Upaniṣads through their own questions, images, arguments, and disagreements in later interpretation.',
    promise: 'Recognize each work by its central inquiry without flattening the texts into one doctrine.',
    tone: 'indigo',
  },
  ...widerSections,
]

export const courseLessons: CourseLesson[] = [foundationLesson, ...upanishads, ...widerLessons]

export const lessonDetails: Record<string, LessonDetail> = {
  'course-0': {
    id: 'course-0',
    locate: {
      corpus: 'South Asian textual worlds → Veda-oriented, Buddhist, Jain, and other lineages → many texts, genres, and schools',
      placement: 'This orientation comes before Kena because “Where does this text belong?” must be answered in more than one way.',
      context: 'There is no single ancient table of contents for all Indian thought. Modern labels such as Hinduism gather many historical communities, and every classification reflects a particular purpose and perspective.',
    },
    read: {
      anchorLabel: 'Connection map',
      anchor: 'authority × genre × tradition or school',
      paraphrase: 'Śruti and Smṛti primarily describe authority within Veda-oriented traditions. Itihāsa and Purāṇa describe kinds of literature. Darśana names a viewpoint or intellectual lineage. One text can therefore occupy all three maps at once.',
      readingNote: 'Treat Saṃhitā → Brāhmaṇa → Āraṇyaka → Upaniṣad as a progression of emphasis, not four perfectly separate shelves. The layers overlap, vary by Vedic school, and continue to contain ritual, cosmology, and philosophical inquiry.',
    },
    concepts: [
      { term: 'Śruti', meaning: '“Heard” Vedic authority: the four Vedas and their school-specific textual layers. Its lived authority varies among communities.' },
      { term: 'Smṛti', meaning: '“Remembered” tradition, including epics, Purāṇas, Dharma literature, and many later works. It is an authority category, not one book.' },
      { term: 'Genre', meaning: 'What kind of work a text is—for example Itihāsa, Purāṇa, Upaniṣad, Sūtra, or Śāstra.' },
      { term: 'Darśana', meaning: 'A viewpoint or intellectual lineage, not a scripture tier. Here āstika means Veda-recognizing, not necessarily belief in a creator god.' },
      { term: 'Textual world', meaning: 'The communities, languages, practices, debates, and commentaries through which a work is preserved and understood.' },
    ],
    lenses: [
      { name: 'Authority lens', reading: 'Ask how a community regards a work. Śruti and Smṛti are especially internal classifications of Veda-oriented traditions, not labels for every Indian text.' },
      { name: 'Genre lens', reading: 'Ask what kind of writing it is. The Bhagavad Gītā is Smṛti by authority and part of an Itihāsa—the Mahābhārata—by genre and location.' },
      { name: 'Reception lens', reading: 'Ask who interprets it and how. The Gītā became foundational to several Vedānta traditions without itself becoming a Darśana.' },
      { name: 'Wider landscape', reading: 'Brahmanical-Hindu, Buddhist, and Jain traditions developed in exchange and disagreement. Tamil and other language spheres cross those boundaries.' },
    ],
    reflection: 'Rebuild the map in three or four plain sentences: why is there no single canon, what three questions locate a text, and where do the Upaniṣads sit inside the Vedic family?',
    quiz: {
      question: 'Why should Śruti, Purāṇa, and Darśana not appear as three equivalent branches?',
      choices: [
        'They were written in three unrelated countries',
        'Only Darśana is an ancient category',
        'They answer different questions: authority, genre, and interpretive school',
        'Purāṇas are always older than the Vedas',
      ],
      correct: 2,
      explanation: 'Śruti denotes authority, Purāṇa denotes genre, and Darśana denotes a philosophical viewpoint or lineage. A text may need all three coordinates to be located accurately.',
    },
    sourceLinks: [
      { label: 'IEP overview of Hindu philosophy', url: 'https://iep.utm.edu/hindu-ph/' },
      { label: 'Harvard Pluralism Project: Veda, scripture, and authority', url: 'https://pluralism.org/veda-scripture-and-authority' },
      { label: 'Vedic Heritage Portal: Upaniṣads', url: 'https://vedicheritage.gov.in/upanishads/' },
      { label: 'Stanford Encyclopedia: Buddhist Abhidharma collections', url: 'https://plato.stanford.edu/entries/abhidharma/' },
      { label: 'JAINpedia: sacred writings and differing canons', url: 'https://jainpedia.org/themes/principles/sacred-writings/' },
    ],
  },
  kena: {
    id: 'kena',
    locate: {
      corpus: 'Sāmaveda → Talavakāra / Jaiminīya tradition → Kena Upaniṣad',
      placement: 'An early principal Upaniṣad whose title comes from its opening question, kena—“by whom?” Its manuscript placement and unit numbering vary across editions.',
      context: 'The course follows a 35-unit convention: 9 + 5 metrical mantras, then 12 + 9 prose paragraphs. Some editions combine two early units and therefore count 34.',
    },
    read: {
      anchor: 'Kena 1.1–4.9 · 35 learning units',
      paraphrase: 'The text asks what impels mind, speech, breath, sight, and hearing. It complicates any claim to know their ground as an ordinary object, then stages that lesson in a story: an unknown presence defeats the gods’ certainty before Umā identifies the source of their victory.',
      readingNote: 'Sanskrit, IAST, word-by-word literal senses with grammar and sandhi cues, course paraphrase, teaching note, vocabulary, and selected textual notes are shown as separate layers. Sections III–IV are prose and should not all be called ślokas.',
    },
    concepts: [
      { term: 'Kena', meaning: '“By whom?”—the question that opens the inquiry.' },
      { term: 'Brahman', meaning: 'Here, the enabling reality that exceeds ordinary sensory and conceptual grasp.' },
      { term: 'Vidyā', meaning: 'Knowledge or understanding; the text complicates what it means to “know.”' },
      { term: 'Yakṣa', meaning: 'The mysterious, awe-inspiring presence before whom Agni and Vāyu discover the limits of their power.' },
    ],
    lenses: [
      { name: 'Epistemic lens', reading: 'The point is not anti-intellectualism. It is a warning that the conditions of knowing are not captured like ordinary objects.' },
      { name: 'Narrative lens', reading: 'The Yakṣa story converts abstraction into an ethical lesson: insight and power do not justify pride.' },
      { name: 'Vedānta reception', reading: 'Later schools explain the relation between awareness, self, and Brahman differently; the base text should be encountered before choosing one synthesis.' },
      { name: 'Textual lens', reading: 'Numbering and readings such as daharam/dabhram vary among printed and electronic editions. A responsible reader makes such seams visible rather than manufacturing a single frictionless text.' },
    ],
    reflection: 'Think of something you understand well. What makes that understanding possible, yet is difficult to turn into an object of the same understanding?',
    quiz: {
      question: 'What is the Kena Upaniṣad primarily doing when it asks what directs mind and speech?',
      choices: ['Naming a new sense organ', 'Pointing toward the enabling ground of cognition', 'Rejecting every kind of learning', 'Offering a ritual calendar'],
      correct: 1,
      explanation: 'The text redirects attention from objects we know toward what makes knowing possible, while refusing to reduce that ground to another ordinary object.',
    },
    sourceLinks: [
      { label: 'Sanskrit Wikisource: Kena Upaniṣad', url: 'https://sa.wikisource.org/wiki/केनोपनिषद्' },
      { label: 'Max Müller, Talavakāra Upaniṣad (1879)', url: 'https://en.wikisource.org/wiki/Sacred_Books_of_the_East/Volume_1/Talavakâra-upanishad' },
      { label: 'Hume, Thirteen Principal Upanishads (1921)', url: 'https://commons.wikimedia.org/wiki/File:The_Thirteen_Principal_Upanishads_(IA_bwb_T5-AQK-009).pdf' },
      { label: 'IEP overview of the Upaniṣads', url: 'https://iep.utm.edu/upanisad/' },
    ],
  },
  katha: {
    id: 'katha',
    locate: {
      corpus: 'Kṛṣṇa Yajurveda → Kaṭha / Kāṭhaka school → Kaṭha Upaniṣad',
      placement: 'A principal Upaniṣad arranged in two adhyāyas, each containing three vallīs. This edition presents all 119 numbered units: 29 + 25 + 17 + 15 + 15 + 18.',
      context: 'The dialogue between Naciketas and Yama moves from Vedic gift and fire teachings into questions of death, choice, Self, disciplined attention, yoga, and release. Later schools interpret its compressed images differently.',
    },
    read: {
      anchor: 'Kaṭha 1.1.1–2.3.18 · 119 numbered units',
      anchorLabel: 'Complete reading layer',
      paraphrase: 'Naciketas first protects a difficult question against every attractive substitute. Yama then teaches discrimination, the limits of second-hand knowing, the coordinated chariot of the person, an inward turn of attention, one reality appearing through many forms, and a steadiness in which binding desires and heart-knots loosen.',
      readingNote: 'This is a complete study edition, not a modern translation pasted onto Sanskrit. Devanagari, generated IAST, word-by-word literal senses with grammar and sandhi cues, original course paraphrase, teaching explanation, and consequential variants stay visibly separate.',
    },
    concepts: [
      { term: 'Śreyas', meaning: 'The genuinely good or beneficial, especially over a longer horizon.' },
      { term: 'Preyas', meaning: 'What is immediately pleasant, attractive, or gratifying.' },
      { term: 'Ātman', meaning: 'Self; the text uses layered images whose precise relation is interpreted differently by later traditions.' },
      { term: 'Nāciketa agni', meaning: 'The fire teaching given as the second boon; a genuine ritual and cosmic teaching, not merely a psychological symbol.' },
      { term: 'Yoga', meaning: 'In Kaṭha 2.3.10–11, the stable holding of senses and faculties together with vigilance.' },
    ],
    lenses: [
      { name: 'Ethical lens', reading: 'Freedom begins in the quality of choice: which desire deserves authority over the others?' },
      { name: 'Disciplinary lens', reading: 'The chariot image models coordination among sensation, attention, judgment, and a deeper center of identity without reducing them to modern anatomy.' },
      { name: 'Mortality lens', reading: 'Death is not merely an enemy in the dialogue; it becomes the boundary that makes Naciketas’ question unavoidable.' },
      { name: 'Interpretive lens', reading: 'Nondual, qualified-nondual, dualist, devotional, yogic, and philological readings illuminate different features; none should be silently substituted for the base wording.' },
    ],
    reflection: 'Which question in your life is too important to trade for an attractive substitute? What usually persuades you to stop asking it?',
    quiz: {
      question: 'Which sequence best reconstructs the full movement of the Kaṭha Upaniṣad?',
      choices: ['Ritual → rejection of the body → silence → escape', 'Question → discriminating choice → coordinated faculties → inward turn → one-in-many recognition → release', 'Pleasure → punishment → reward → rebirth', 'Speech → breath → dream → social duty'],
      correct: 1,
      explanation: 'The dialogue protects an existential question, names the quality of choice, trains the person through the chariot image, turns attention inward, develops unity through diverse forms, and closes with vigilant steadiness and release.',
    },
    sourceLinks: [
      { label: 'Sanskrit Wikisource: Kaṭha I.1', url: 'https://sa.wikisource.org/wiki/कठोपनिषत्/प्रथमोध्यायः/प्रथमवल्ली' },
      { label: 'Vedic Heritage Portal: Kathopanishad', url: 'https://vedicheritage.gov.in/hi/upanishads/kathopanishad/' },
      { label: 'Max Müller, Kaṭha Upaniṣad (1884)', url: 'https://en.wikisource.org/wiki/Sacred_Books_of_the_East/Volume_15/Katha-upanishad' },
      { label: 'Dominik Haas, Vom Feueraltar zum Yoga (2024)', url: 'https://hasp.ub.uni-heidelberg.de/catalog/book/1329' },
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
  mundaka: {
    id: 'mundaka',
    locate: {
      corpus: 'Atharvaveda → Muṇḍaka Upaniṣad → three muṇḍakas, each in two sections',
      placement: 'Traditionally associated with the Atharvaveda and conventionally counted among the principal Upaniṣads.',
      context: 'Śaunaka asks Aṅgiras what must be known for everything to become known. The metrical teaching then re-ranks inherited Vedic learning and ritual from within a Vedic setting.',
    },
    read: {
      anchor: 'Muṇḍaka 1.1.4–5 and 3.1.1–2',
      paraphrase: 'The text distinguishes learned textual and ritual disciplines from the knowledge through which the imperishable is apprehended. Its image of two birds on one tree contrasts participation in experience with an awareness that does not consume the fruit. The passage itself does not settle whether the birds are ultimately identical or remain distinct.',
      readingNote: 'Aparā vidyā includes respected Vedic study; the text does not call such learning worthless. Advaita commonly reads the birds as empirical and witnessing self, while theistic and dualist Vedānta traditions can preserve a real relation or distinction. Those are later lenses, not words supplied by the base text.',
    },
    concepts: [
      { term: 'Aparā vidyā', meaning: '“Lower” or derivative learning here, including the four Vedas and their supporting disciplines. The hierarchy concerns the aim of knowledge, not whether study has value.' },
      { term: 'Parā vidyā', meaning: 'Knowledge directed toward the imperishable; closer to transformative realization than to acquiring another set of facts.' },
      { term: 'Akṣara', meaning: 'The imperishable or undecaying. Its relation to brahman and self must be read in context.' },
      { term: 'Brahmavidyā', meaning: 'Knowledge concerning brahman or the deepest ground of reality, not merely religious information.' },
    ],
    lenses: [
      { name: 'Ritual-historical lens', reading: 'The distinction is an internal Vedic re-ranking: ritual and textual expertise remain recognized but cannot by themselves produce what is unproduced.' },
      { name: 'Advaita lens', reading: 'The eating bird can represent the self under misidentification and the observing bird the witnessing Self, with knowledge disclosing non-difference.' },
      { name: 'Relational lens', reading: 'The birds can remain individual and supreme reality in a relation of dependence, proximity, or difference rather than immediate identity.' },
    ],
    reflection: 'What is one kind of knowledge that adds information, and one that changes the knower? What evidence would show that the second kind has occurred?',
    quiz: {
      question: 'What does Muṇḍaka 1.1.4–5 itself include under aparā vidyā?',
      choices: ['Only forbidden teachings', 'The four Vedas and their supporting disciplines', 'Only household duties', 'Direct knowledge of the imperishable'],
      correct: 1,
      explanation: 'The striking move is that revered Vedic learning is included in aparā vidyā. Parā vidyā is distinguished by its object and transformative aim: the imperishable.',
    },
    sourceLinks: [
      { label: 'Vedic Heritage Portal: Muṇḍakopaniṣad', url: 'https://vedicheritage.gov.in/upanishads/mundakopanishad/' },
      { label: 'Sacred Books of the East: Muṇḍaka 1.1', url: 'https://sacred-texts.com/hin/sbe15/sbe15016.htm' },
      { label: 'Sacred Books of the East: the two birds', url: 'https://sacred-texts.com/hin/sbe15/sbe15020.htm' },
    ],
  },
  taittiriya: {
    id: 'taittiriya',
    locate: {
      corpus: 'Kṛṣṇa Yajurveda → Taittirīya Āraṇyaka 7–9 → Taittirīya Upaniṣad',
      placement: 'Part of the Taittirīya recension, transmitted in three vallīs concerned with education, brahman, the person, and Bhṛgu’s staged inquiry.',
      context: 'The work binds recitation and ethical formation to layered reflection on food, breath, mind, understanding, and bliss. Its sections should not be reduced to one modern self-help diagram.',
    },
    read: {
      anchor: 'Taittirīya 1.11 and 2.1–5',
      paraphrase: 'Education is incomplete if it produces reciters without truthfulness, responsibility, hospitality, continuing study, and thoughtful generosity. The next teaching loosens the habit of equating the whole self with any one dimension: body nourished by food, vital functioning, thought, discernment, and joy each disclose something important without exhausting the inquiry.',
      readingNote: 'The base text repeatedly describes successively more inward persons using anna-maya, prāṇa-maya, mano-maya, vijñāna-maya, and ānanda-maya. It does not present the familiar modern five-ring diagram or consistently call these five items kośas. The pañca-kośa or “five sheaths” model is an influential later Vedānta systematization.',
    },
    concepts: [
      { term: 'Svādhyāya', meaning: 'Sustained recitation and study; in 1.11 it is paired with continued teaching or exposition.' },
      { term: 'Ātman', meaning: 'Self, person, or an inner organizing reality depending on context—not automatically the modern ego.' },
      { term: '-maya', meaning: 'A suffix that can indicate being made of, consisting of, or pervaded by something; translating every occurrence as “illusory” is misleading here.' },
      { term: 'Ānanda', meaning: 'Bliss, fullness, or deep well-being within a graded inquiry, not simply a passing pleasant emotion.' },
    ],
    lenses: [
      { name: 'Educational-ethical lens', reading: 'Learning, conduct, relationships, study, and transmission remain inseparable in the student’s closing instruction.' },
      { name: 'Embodied-cosmic lens', reading: 'Food, breath, mind, understanding, and bliss link the person to wider natural and cosmic processes.' },
      { name: 'Later Vedānta lens', reading: 'The five-sheath model tests successive identifications, but the polished framework must be marked as later reception.' },
    ],
    reflection: 'Which dimension—body, vitality, thought, discernment, or happiness—do you most readily mistake for the whole of yourself? What does that identification omit?',
    quiz: {
      question: 'Which statement is a later Vedānta systematization rather than the literal presentation of Taittirīya 2.1–5?',
      choices: ['The teaching moves through food, breath, mind, understanding, and bliss', 'Each account opens onto a more inward one', 'The text supplies a fixed five-ring chart explicitly titled pañca-kośa', 'The inquiry links person and wider reality'],
      correct: 2,
      explanation: 'The Upaniṣad supplies the sequence. The standardized “five sheaths” chart and its technical use are products of later Vedānta interpretation.',
    },
    sourceLinks: [
      { label: 'Vedic Heritage Portal: Taittirīya Āraṇyaka', url: 'https://vedicheritage.gov.in/aranyakas/taittiriya-aranyaka/' },
      { label: 'Vedic Heritage Portal: Taittirīya Upaniṣad', url: 'https://vedicheritage.gov.in/upanishads/taittiriya-upanishads/' },
      { label: 'Sacred Books of the East: Taittirīya', url: 'https://sacred-texts.com/hin/sbe15/index.htm' },
    ],
  },
  chandogya: {
    id: 'chandogya',
    locate: {
      corpus: 'Sāmaveda → Chāndogya Brāhmaṇa → final eight chapters → Chāndogya Upaniṣad',
      placement: 'A large composite prose work associated especially with the Kauthuma transmission of the Sāmaveda.',
      context: 'Chant and ritual interpretation, cosmology, teaching stories, debates, and several accounts of self and reality sit beside one another. The work should not be forced into a single seamless system.',
    },
    read: {
      anchor: 'Chāndogya 6.8.7–6.16; especially 6.12–13',
      paraphrase: 'Uddālaka teaches Śvetaketu that absence from sight is not the same as nonexistence: the unseen interior of a seed and salt dispersed through water point toward a subtle reality present throughout living things. The repeated tat tvam asi connects that reality with Śvetaketu, but the precise relation—identity, participation, dependence, or something else—still requires interpretation.',
      readingNote: 'Chapter 6 speaks of sat, subtle essence, and ātman; it does not use brahman in this particular instruction. Śaṅkara reads tat tvam asi as deepest identity, while Viśiṣṭādvaita, Dvaita, and other traditions explain the relation differently. Even a short English rendering makes interpretive choices.',
    },
    concepts: [
      { term: 'Sat', meaning: 'Being, what is, or existent reality—the starting point for an account of how plurality emerges.' },
      { term: 'Ātman', meaning: 'Here, a subtle life-bearing self or essence; elsewhere in the same Upaniṣad the term can function differently.' },
      { term: 'Aṇiman', meaning: 'Fineness or subtle essence, invoked through the seed and salt teachings.' },
      { term: 'Tat tvam asi', meaning: 'A repeated pedagogical refrain often rendered “you are that,” with a long and contested grammatical and metaphysical history.' },
    ],
    lenses: [
      { name: 'Textual-historical lens', reading: 'Follow Uddālaka’s own vocabulary of being, transformation, life, and subtle essence before importing a later system.' },
      { name: 'Advaita lens', reading: 'The refrain can disclose an identity obscured by mistaken identification with limited name and form.' },
      { name: 'Relational lens', reading: 'Śvetaketu can be inseparable from, dependent upon, or belonging to ultimate reality without erasing every distinction.' },
    ],
    reflection: 'The salt is invisible but testable by taste. What does the analogy legitimately support, and what larger conclusion would still require another argument?',
    quiz: {
      question: 'Which is the most source-conscious description of tat tvam asi in Chāndogya 6?',
      choices: ['It states every later Advaita doctrine unambiguously', 'It says the ordinary personality is an all-powerful creator', 'It is a repeated refrain whose metaphysical force is interpreted differently', 'It rejects all distinctions without examples'],
      correct: 2,
      explanation: 'The refrain is central, but a responsible reading distinguishes the base dialogue from later, internally diverse Vedānta interpretations.',
    },
    sourceLinks: [
      { label: 'Vedic Heritage Portal: Chāndogya Brāhmaṇa', url: 'https://vedicheritage.gov.in/brahmanas/chandogyopanishad-brahmana/' },
      { label: 'Sacred Books of the East: the salt teaching', url: 'https://sacred-texts.com/hin/sbe01/sbe01131.htm' },
      { label: 'IEP: The Upaniṣads', url: 'https://iep.utm.edu/upanisad/' },
    ],
  },
  brihadaranyaka: {
    id: 'brihadaranyaka',
    locate: {
      corpus: 'Śukla Yajurveda → Śatapatha Brāhmaṇa → Bṛhadāraṇyaka Upaniṣad',
      placement: 'One of the oldest and largest Upaniṣads, surviving in Mādhyandina and Kāṇva recensions whose arrangement and wording are not identical.',
      context: 'The composite work combines ritual correspondences, creation accounts, court debates, household conversations, and teachings associated especially with Yājñavalkya.',
    },
    read: {
      anchor: 'Bṛhadāraṇyaka 2.3.6 and 2.4.5–14',
      paraphrase: 'Neti neti guards against mistaking any finite predicate or object for an exhaustive account of reality. In the Maitreyi dialogue, Yājñavalkya distinguishes wealth from immortality and redirects inquiry toward the condition that makes knowing and valuing possible. This does not simply claim that people or relationships are unreal.',
      readingNote: 'The Maitreyi dialogue appears again, with differences, at 4.5, and numbering varies by recension. Śaṅkara’s nondual reading is influential, but this composite Upaniṣad contains ritual concerns and other voices. Later traditions also read the negation as removing finite limitations while preserving qualities, dependence, or difference.',
    },
    concepts: [
      { term: 'Neti neti', meaning: '“Not this, not this”: denying that any available finite characterization is exhaustive—not automatically a claim that nothing exists.' },
      { term: 'Ātman', meaning: 'Self or the condition of subjectivity, often not reducible to an object among other objects.' },
      { term: 'Amṛtatva', meaning: 'Immortality or deathlessness, not necessarily endless continuation of the ordinary personality.' },
      { term: 'Vijñātṛ', meaning: 'The knower; the dialogue asks how that by which knowing occurs could be known in an ordinary subject-object manner.' },
    ],
    lenses: [
      { name: 'Dialogical lens', reading: 'Read the questions, social setting, repeated versions, and changes of argument before extracting a single doctrine.' },
      { name: 'Apophatic lens', reading: 'Neti neti becomes intellectual discipline: every proposed description is tested for limits rather than converted into nihilism.' },
      { name: 'Vedānta comparison', reading: 'Compare nondual identity readings with traditions that preserve real qualities, dependence, or difference.' },
    ],
    reflection: 'Can the knower be placed before itself as an ordinary object? If not, what kinds of evidence or inquiry remain available?',
    quiz: {
      question: 'Which reading best avoids turning neti neti into a slogan the passage does not require?',
      choices: ['Nothing whatsoever exists', 'Every word is useless', 'No finite description exhausts the reality under inquiry', 'Only material objects are real'],
      correct: 2,
      explanation: 'The double negation limits objectifying descriptions. Later schools disagree about what positive account, if any, should accompany it.',
    },
    sourceLinks: [
      { label: 'Vedic Heritage Portal: Bṛhadāraṇyakopaniṣad', url: 'https://vedicheritage.gov.in/upanishads/brihadaranyakopanishad/' },
      { label: 'Sacred Books of the East: Maitreyi dialogue', url: 'https://sacred-texts.com/hin/sbe15/sbe15061.htm' },
      { label: 'UT Austin: Early Upaniṣads', url: 'https://sites.utexas.edu/sanskrit/resources/early-upanisads-olivelle-edition/' },
    ],
  },
  mandukya: {
    id: 'mandukya',
    locate: {
      corpus: 'Atharvaveda → Māṇḍūkya Upaniṣad → twelve prose mantras',
      placement: 'Traditionally associated with the Atharvaveda; its unusually compact base text became especially important in later Advaita.',
      context: 'The work coordinates waking, dreaming, deep sleep, a difficult “fourth,” and the syllable Oṃ. Its later commentary tradition is far more extensive than the base text.',
    },
    read: {
      anchor: 'Māṇḍūkya 2–7 and 8–12',
      paraphrase: 'Waking, dream, and deep sleep reveal different organizations of experience; none alone exhausts what the text calls ātman. The “fourth” is not simply another ordinary episode, and Oṃ offers an audible and contemplative schema for the whole inquiry. This is a philosophical and liturgical map, not an ancient neuroscience chart.',
      readingNote: 'The base Upaniṣad contains twelve prose mantras. Gauḍapāda’s Kārikā and Śaṅkara’s bhāṣya are often printed with it, but developed arguments about non-origination and systematic Advaita metaphysics belong especially to later reception.',
    },
    concepts: [
      { term: 'Oṃ / akṣara', meaning: 'Oṃ considered as the imperishable syllable and contemplative designation of the whole; akṣara can mean both “syllable” and “imperishable.”' },
      { term: 'Pāda', meaning: 'A quarter, aspect, or footing—not necessarily four physically separate pieces of a self.' },
      { term: 'Turīya', meaning: '“The fourth,” named after waking, dream, and deep sleep but not casually reducible to a measurable fourth sleep state.' },
      { term: 'Prapañcopaśama', meaning: 'The calming or cessation of phenomenal proliferation, with stronger implications developed differently by later interpreters.' },
    ],
    lenses: [
      { name: 'Phenomenological lens', reading: 'Compare structures of experience without turning the categories into modern clinical sleep stages.' },
      { name: 'Contemplative lens', reading: 'Attend to how A–U–M, what is not confined to a spoken component, recitation, and reflection work together.' },
      { name: 'Later Advaita lens', reading: 'Study Gauḍapāda’s non-origination arguments as a powerful later development with the source boundary visible.' },
    ],
    reflection: 'Across waking, dreaming, and deep sleep, what changes and what allows us to speak of continuity? Which part of your answer comes from experience, and which from inference?',
    quiz: {
      question: 'Which teaching belongs primarily to Gauḍapāda’s later Kārikā rather than the twelve-mantra base Upaniṣad?',
      choices: ['The four pādas', 'A–U–M coordinated with the first three pādas', 'A developed doctrine of non-origination', 'The fourth resisting ordinary predicates'],
      correct: 2,
      explanation: 'The base text supplies the fourfold and Oṃ framework. Gauḍapāda builds an extensive philosophical argument for non-origination around it.',
    },
    sourceLinks: [
      { label: 'Vedic Heritage Portal: Māṇḍūkyopaniṣad', url: 'https://vedicheritage.gov.in/upanishads/mandukyopanishad/' },
      { label: 'GRETIL: Gauḍapāda’s Māṇḍūkya Kārikā', url: 'https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/1_veda/4_upa/gmandk_u.htm' },
      { label: 'UPenn: Hume’s principal Upaniṣads', url: 'https://onlinebooks.library.upenn.edu/webbin/book/lookupid?key=olbp42350' },
    ],
  },
  aitareya: {
    id: 'aitareya',
    locate: {
      corpus: 'Ṛgveda → Aitareya Āraṇyaka II.4–6 → Aitareya Upaniṣad',
      placement: 'The fourth through sixth chapters of the Aitareya Āraṇyaka’s second book, often presented as three internal chapters.',
      context: 'This early prose work moves from a creation-and-embodiment account to birth, identity, and the activity of knowing. Relative chronology is clearer than any exact date.',
    },
    read: {
      anchorLabel: 'Creation and knowing',
      anchor: 'Aitareya 1.1.1–1.3.14 and 3.1.1–3',
      paraphrase: 'The work begins with ātman as the sole prior reality and narrates worlds, powers, bodily faculties, food, and the self’s entry into embodied life. Its third chapter asks which self is being sought, gathering seeing, hearing, understanding, remembering, desiring, and related activities under prajñāna.',
      readingNote: 'Later Vedānta treats prajñānam brahma as a mahāvākya or “great saying.” First read it inside the base text’s catalogue of cognitive activities and preceding cosmology. Prajñāna should not automatically be equated with one modern neurological theory of consciousness.',
    },
    concepts: [
      { term: 'Ātman', meaning: 'Self; here both the reality present before narrated creation and that which enters embodied existence.' },
      { term: 'Prajñāna', meaning: 'Knowing, intelligent awareness, or cognition. “Consciousness” is useful but carries modern assumptions the Sanskrit does not specify.' },
      { term: 'Brahman', meaning: 'Expansive or ultimate reality, placed in a particularly close relation with prajñāna at 3.1.3.' },
      { term: 'Anna', meaning: 'Food, both as what sustains embodied life and as a category in the creation sequence.' },
    ],
    lenses: [
      { name: 'Cosmological lens', reading: 'Read creation as an ordered reflection on dependence and embodiment, not as a rival to a modern scientific timeline.' },
      { name: 'Epistemic lens', reading: 'Chapter 3 redirects attention from things known toward the activities through which anything becomes known.' },
      { name: 'Vedānta reception', reading: 'Advaita and other traditions develop the closing formula differently; those arguments are later interpretations.' },
    ],
    reflection: 'If seeing, remembering, judging, and desiring are different activities, what allows you to recognize them as experiences belonging to one life?',
    quiz: {
      question: 'What major movement connects Aitareya’s first and third chapters?',
      choices: ['It replaces self-inquiry with a sacrifice calendar', 'It connects creation and embodiment with inquiry into knowing', 'It declares food irrelevant', 'It ranks sight as the only knowledge'],
      correct: 1,
      explanation: 'The text first situates faculties and food within embodied creation, then asks what underlies seeing, hearing, remembering, and understanding.',
    },
    sourceLinks: [
      { label: 'Vedic Heritage Portal: Aitareya Upaniṣad', url: 'https://vedicheritage.gov.in/upanishads/aitareyopanishad/' },
      { label: 'TITUS: Aitareya chapter 3', url: 'https://titus.fkidg1.uni-frankfurt.de/texte/etcd/ind/aind/ved/rv/upanisad/aitup/aitup003.htm' },
      { label: 'UPenn: Hume’s principal Upaniṣads', url: 'https://onlinebooks.library.upenn.edu/webbin/book/lookupid?key=olbp42350' },
    ],
  },
  kaushitaki: {
    id: 'kaushitaki',
    locate: {
      corpus: 'Ṛgveda → Kauṣītaki / Śāṅkhāyana tradition → Kauṣītaki Upaniṣad',
      placement: 'The received work has four chapters and also appears as chapters 3–6 of the Śāṅkhāyana Āraṇyaka, so outer numbering and titles vary by edition.',
      context: 'Dialogues and after-death itineraries reinterpret Vedic concerns through vital life, awareness, selfhood, and the person who knows.',
    },
    read: {
      anchorLabel: 'Vital life and the knower',
      anchor: 'Kauṣītaki 3.2–4 and 3.8',
      paraphrase: 'In the dialogue with Pratardana, Indra directs attention to prāṇa and the prajñātman rather than isolated sensory powers. Speech, sight, hearing, and mind function within a living, knowing unity. The teaching turns from a sound, sight, or thought toward the speaker, seer, hearer, and thinker who knows it.',
      readingNote: 'Prāṇa is broader than inhaled air, and prajñā is broader than discursive thought. The chapter links them closely, but translations differ over whether particular sentences state identity, mutual dependence, or coordinated aspects. Later Vedānta should not silently settle that ambiguity.',
    },
    concepts: [
      { term: 'Prāṇa', meaning: 'Vital life or life-function; breath is one expression of it, not an exhaustive definition.' },
      { term: 'Prajñā / prajñātman', meaning: 'Knowing awareness, or a self characterized by knowing; its relation to prāṇa is a central interpretive difficulty.' },
      { term: 'Ātman', meaning: 'Self or living center of identity, with a scope that changes across dialogue, sleep, death, and ritual reinterpretation.' },
      { term: 'Devayāna', meaning: 'The “path of the gods” in an after-death teaching—a ritual cosmography, not physical geography.' },
    ],
    lenses: [
      { name: 'Embodied-knowing lens', reading: 'The passage resists treating life, awareness, and the senses as entirely independent modules.' },
      { name: 'Dialogical lens', reading: 'Indra’s unusual teaching to Pratardana is staged; the speaker and dramatic setting matter.' },
      { name: 'Ritual-afterlife lens', reading: 'The Upaniṣad redirects earlier ritual and postmortem imagery toward knowledge of the person rather than simply abandoning it.' },
    ],
    reflection: 'When you say “I see” or “I understand,” what belongs to the eye or mind, and what do you attribute to the living person as a whole?',
    quiz: {
      question: 'What does Kauṣītaki chapter 3 ask the reader to reconsider?',
      choices: ['Whether each sense is an independent knower', 'Whether breathing should stop during thought', 'Whether only ritualists possess prāṇa', 'Whether awareness exists only after death'],
      correct: 0,
      explanation: 'The dialogue places individual faculties within the coordinated life of prāṇa and prajñā, then redirects attention toward the person who knows.',
    },
    sourceLinks: [
      { label: 'Vedic Heritage Portal: Śāṅkhāyana Āraṇyaka', url: 'https://vedicheritage.gov.in/aranyakas/sankhyayana-aranyaka/' },
      { label: 'TITUS: Kauṣītaki chapter 3', url: 'https://titus.fkidg1.uni-frankfurt.de/texte/etcs/ind/aind/ved/rv/upanisad/kausup/kausu003.htm' },
      { label: 'UPenn: Hume’s principal Upaniṣads', url: 'https://onlinebooks.library.upenn.edu/webbin/book/lookupid?key=olbp42350' },
    ],
  },
  prashna: {
    id: 'prashna',
    locate: {
      corpus: 'Atharvaveda → Praśna Upaniṣad → six questions to Pippalāda',
      placement: 'A principal Upaniṣad organized as six questions. Its Atharvavedic affiliation is traditional; its precise compositional growth remains debated.',
      context: 'The questions move through origins, the powers supporting a person, prāṇa, sleep and dreaming, Oṃ, and a person described through sixteen parts.',
    },
    read: {
      anchorLabel: 'The discipline of asking',
      anchor: 'Praśna 1.1–2 and 2.1–13',
      paraphrase: 'Six seekers approach Pippalāda as serious students. Before answering, he asks them to remain for a year in disciplined effort, studently restraint, and trustful commitment. In the second question, bodily and cognitive powers dispute their importance; prāṇa demonstrates that their functioning depends on a coordinating vital power.',
      readingNote: 'The text speaks through ritual, cosmological, and embodied correspondences rather than modern physiology. Prāṇa is not simply oxygen, and the teaching should not automatically become a manual of later haṭhayoga.',
    },
    concepts: [
      { term: 'Tapas', meaning: 'Sustained discipline or formative effort that prepares the learner rather than merely producing an answer.' },
      { term: 'Brahmacarya', meaning: 'Disciplined studently or ascetic conduct; celibacy may be included in later settings but does not exhaust the term.' },
      { term: 'Śraddhā', meaning: 'Trustful commitment sufficient to sustain inquiry, not a substitute for questioning.' },
      { term: 'Prāṇa', meaning: 'The organizing vital power of embodied life, expressed through several functions and linked with cosmic processes.' },
    ],
    lenses: [
      { name: 'Pedagogical lens', reading: 'The learner’s preparation is part of knowledge: asking a serious question requires formation, patience, and accountability.' },
      { name: 'Systems lens', reading: 'The contest among faculties dramatizes interdependence; a living person cannot be understood by isolating one capacity.' },
      { name: 'Cosmological lens', reading: 'Sun, fire, breath, senses, and life relate analogically and ritually, not as equations in a laboratory model.' },
    ],
    reflection: 'What question matters enough that you would prepare for it for a year? What habits might make your eventual answer more trustworthy?',
    quiz: {
      question: 'What does Praśna 1.1–2 make part of serious inquiry?',
      choices: ['Immediate acceptance', 'A year of disciplined preparation', 'Rejection of inherited practice', 'Proving the conclusion in advance'],
      correct: 1,
      explanation: 'Pippalāda asks the seekers to undertake tapas, brahmacarya, and śraddhā before he promises to answer what he knows.',
    },
    sourceLinks: [
      { label: 'Vedic Heritage Portal: Praśna Upaniṣad', url: 'https://vedicheritage.gov.in/upanishads/prashnopanishad/' },
      { label: 'UT Austin: Early Upaniṣads', url: 'https://sites.utexas.edu/sanskrit/resources/early-upanisads-olivelle-edition/' },
      { label: 'UPenn: Hume’s principal Upaniṣads', url: 'https://onlinebooks.library.upenn.edu/webbin/book/lookupid?key=olbp42350' },
    ],
  },
  shvetashvatara: {
    id: 'shvetashvatara',
    locate: {
      corpus: 'Kṛṣṇa Yajurveda (traditional affiliation) → Śvetāśvatara Upaniṣad',
      placement: 'A six-chapter metrical work generally treated as later than the earliest prose Upaniṣads. Its exact date and school attachment should remain broad.',
      context: 'The text joins causal inquiry with contemplative practice, Sāṃkhya- and Yoga-like vocabulary, and increasingly explicit language about a supreme deva and Rudra.',
    },
    read: {
      anchorLabel: 'Causal inquiry becomes practice',
      anchor: 'Śvetāśvatara 1.1–3 and 2.8–15',
      paraphrase: 'The opening asks whether time, inherent nature, necessity, chance, elements, or a person can explain the world when taken separately. Contemplative discipline reveals a divine power connected with self and hidden within changing qualities. Chapter 2 makes inquiry embodied through steadiness, regulated breathing, gathered senses, a suitable setting, and sustained meditation.',
      readingNote: 'Chapter 2 presents an Upaniṣadic yoga sequence, not a disguised copy of Patañjali’s later eight-limbed system. Rudra language later mattered greatly to Śaiva and Vedānta readers, but developed Śaiva theologies should not be projected wholesale into every verse.',
    },
    concepts: [
      { term: 'Yoga', meaning: 'Disciplined integration and contemplative practice involving body, breath, senses, and mind in this text’s own context.' },
      { term: 'Devātmaśakti', meaning: 'A difficult compound often understood as divine power connected with self; its grammar and philosophical force permit several readings.' },
      { term: 'Rudra', meaning: 'A Vedic deity named as sole ruler in chapter 3, supporting the work’s theistic voice and later Śaiva reception.' },
      { term: 'Māyā / māyin', meaning: 'A form-producing power and its possessor in 4.9–10; later schools develop māyā differently, so “illusion” alone is too narrow.' },
    ],
    lenses: [
      { name: 'Contemplative lens', reading: 'Causal inquiry is transformed by disciplined attention rather than solved through speculation alone.' },
      { name: 'Theological lens', reading: 'The single supreme deva and Rudra are more explicit than in many early Upaniṣads, alongside self and brahman vocabulary.' },
      { name: 'Historical-synthesis lens', reading: 'Older Vedic images and emerging contemplative vocabulary meet without necessarily reproducing any later system in finished form.' },
    ],
    reflection: 'Which explanation—time, nature, chance, necessity, or agency—do you instinctively treat as sufficient? What might disciplined attention add to argument?',
    quiz: {
      question: 'Why should Śvetāśvatara 2.8–15 not simply be labeled “Patañjali’s yoga”?',
      choices: ['It rejects breath and meditation', 'It presents its own Upaniṣadic sequence before the later system', 'It is a royal ritual', 'It promises perfect bodily health'],
      correct: 1,
      explanation: 'The passage has its own vocabulary and aims. Comparison with later yoga traditions is useful only after its Upaniṣadic setting is understood.',
    },
    sourceLinks: [
      { label: 'Vedic Heritage Portal: Śvetāśvatara', url: 'https://vedicheritage.gov.in/upanishads/shwetashwataropanishad/' },
      { label: 'TITUS: Śvetāśvatara chapter 2', url: 'https://titus.fkidg1.uni-frankfurt.de/texte/etcs/ind/aind/ved/yvs/upanisad/svetup/svetu002.htm' },
      { label: 'UPenn: Hume’s principal Upaniṣads', url: 'https://onlinebooks.library.upenn.edu/webbin/book/lookupid?key=olbp42350' },
    ],
  },
  maitri: {
    id: 'maitri',
    locate: {
      corpus: 'Kṛṣṇa Yajurveda → Maitrāyaṇīya tradition → Maitrī Upaniṣad',
      placement: 'The received text has seven prapāṭhakas. Titles vary across manuscripts and editions, and much later material is widely treated as supplementary or layered.',
      context: 'King Bṛhadratha turns from power toward mortality and self-knowledge. Later sections expand through mind, time, qualities, solar symbolism, Oṃ, and yoga.',
    },
    read: {
      anchorLabel: 'Mortality and sixfold yoga',
      anchor: 'Maitrī 1.3–4 and 6.18',
      paraphrase: 'Bṛhadratha confronts bodily decay, emotional disturbance, repeated loss, and the impermanence even of great rulers and cosmic beings. That recognition drives his request for knowledge not exhausted by passing pleasures. The transmitted sixth chapter coordinates breath, senses, meditation, fixed attention, inquiry, and absorption.',
      readingNote: 'The received Upaniṣad is layered: chapter 6 should not automatically be assigned to the same compositional moment as the opening dialogue. Several editions treat chapters 6–7, or portions of them, as supplementary. Older editions may also print Rāmatīrtha’s much later commentary with the root text.',
    },
    concepts: [
      { term: 'Ātman', meaning: 'Self, differentiated from conditioned embodied and psychological identity, though the layered vocabulary is not uniform.' },
      { term: 'Manas', meaning: 'Mind as an organizing but unstable inner faculty whose training becomes central to bondage and release.' },
      { term: 'Guṇa', meaning: 'A quality or constituent tendency used to explain conditioned personality; later Sāṃkhya systematizes three guṇas more fully.' },
      { term: 'Ṣaḍaṅga-yoga', meaning: 'The six-limbed yoga of 6.18: breath regulation, sensory withdrawal, meditation, fixed attention, inquiry, and absorption.' },
    ],
    lenses: [
      { name: 'Existential lens', reading: 'The king’s account of decay asks whether power and pleasure can answer mortality, not merely whether the body is unpleasant.' },
      { name: 'Psychological lens', reading: 'The work examines how an unsteady mind becomes entangled and how disciplined attention reorganizes experience.' },
      { name: 'Textual-growth lens', reading: 'Differences between the opening and later yoga material reveal a transmitted, expanding text rather than one timeless lecture.' },
    ],
    reflection: 'Does awareness of impermanence make ordinary commitments meaningless, or can it clarify which commitments deserve your limited time?',
    quiz: {
      question: 'Why is Maitrī 6.18 important in studying yoga’s history?',
      choices: ['It lists athletic postures', 'It records a six-limbed scheme rather than assuming all yoga has eight limbs', 'It rejects meditation', 'It says the mind cannot be trained'],
      correct: 1,
      explanation: 'Its six limbs are breath regulation, sensory withdrawal, meditation, fixed attention, inquiry, and absorption. Compare it with, rather than collapse it into, later systems.',
    },
    sourceLinks: [
      { label: 'Vedic Heritage Portal: Maitrāyaṇīya', url: 'https://vedicheritage.gov.in/upanishads/maitrayani-upanishad/' },
      { label: 'Open Library: Cowell’s Maitrī edition', url: 'https://openlibrary.org/works/OL16844021W/Maitryupaniat' },
      { label: 'UPenn: Hume’s principal Upaniṣads', url: 'https://onlinebooks.library.upenn.edu/webbin/book/lookupid?key=olbp42350' },
    ],
  },
  ...widerLessonDetails,
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
    id: 'plural', eyebrow: 'Traditions and language spheres', title: 'Many voices', tone: 'leaf',
    description: 'Veda-oriented, Buddhist, and Jain traditions developed in exchange and disagreement. Texts in Tamil and other regional languages cross those boundaries.',
    nodes: ['Buddhist lineages', 'Jain textual histories', 'Tamil literary sphere', 'Materialist voices'],
    subnodes: ['Pāli & beyond', 'Śvetāmbara / Digambara', 'Hindu, Jain, Buddhist & more', 'Cārvāka fragments'],
    note: 'No single branch contains the whole Indian textual landscape, and language is not the same kind of category as religious tradition.',
  },
]

const coreReferenceSources = [
  { label: 'Internet Encyclopedia of Philosophy: Upaniṣads', url: 'https://iep.utm.edu/upanisad/', use: 'Academic overview, chronology, themes, and bibliography' },
  { label: 'Government of India: Vedic Heritage Portal', url: 'https://vedicheritage.gov.in/upanishads/', use: 'Vedic affiliations and textual orientation' },
  { label: 'UT Austin Sanskrit: Early Upaniṣads', url: 'https://sites.utexas.edu/sanskrit/resources/early-upanisads-olivelle-edition/', use: 'Searchable Roman-script transcriptions; translation remains copyrighted' },
  { label: 'UPenn: Hume’s Thirteen Principal Upanishads', url: 'https://onlinebooks.library.upenn.edu/webbin/book/lookupid?key=olbp42350', use: 'Stable access to a public-domain translation' },
  { label: 'GRETIL, University of Göttingen', url: 'https://gretil.sub.uni-goettingen.de/gretil.html', use: 'Electronic Sanskrit, Pāli, and Prakrit texts' },
]

export const referenceSources = [...coreReferenceSources, ...widerReferenceSources]
  .filter((source, index, sources) => sources.findIndex((candidate) => candidate.url === source.url) === index)
