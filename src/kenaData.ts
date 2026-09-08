import { kenaInvocationWordStudy, kenaWordStudy } from './kenaWordStudy.generated'
import type { WordStudyWord } from './wordStudyTypes'

export type KenaTerm = {
  term: string
  meaning: string
}

export type KenaPassage = {
  id: string
  section: 1 | 2 | 3 | 4
  number: number
  kind: 'mantra' | 'prose paragraph'
  title: string
  devanagari: string
  iast: string
  gloss: string
  explanation: string
  terms: KenaTerm[]
  words: WordStudyWord[]
  textNote?: string
}

export type KenaSection = {
  id: 1 | 2 | 3 | 4
  roman: string
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

export const kenaInvocation = {
  devanagari: `ॐ आप्यायन्तु ममाङ्गानि वाक्प्राणश्चक्षुः श्रोत्रमथो बलमिन्द्रियाणि च सर्वाणि ।
सर्वं ब्रह्मौपनिषदं माऽहं ब्रह्म निराकुर्यां मा मा ब्रह्म निराकरोदनिराकरणमस्त्वनिराकरणं मेऽस्तु ।
तदात्मनि निरते य उपनिषत्सु धर्मास्ते मयि सन्तु ते मयि सन्तु । ॐ शान्तिः शान्तिः शान्तिः ॥`,
  iast: `oṃ āpyāyantu mamāṅgāni vāk prāṇaś cakṣuḥ śrotram atho balam indriyāṇi ca sarvāṇi |
sarvaṃ brahmaupaniṣadaṃ mā 'haṃ brahma nirākuryāṃ mā mā brahma nirākarod anirākaraṇam astv anirākaraṇaṃ me 'stu |
tadātmani nirate ya upaniṣatsu dharmās te mayi santu te mayi santu | oṃ śāntiḥ śāntiḥ śāntiḥ ||`,
  note: 'Traditional peace invocation. It frames study as a practice involving body, speech, breath, attention, and mutual non-rejection; it is not counted among the 35 numbered units.',
  words: kenaInvocationWordStudy.words,
}

export const kenaSections: KenaSection[] = [
  {
    id: 1,
    roman: 'I',
    title: 'What powers knowing?',
    form: '9 mantras · metrical teaching',
    question: 'If mind and senses are instruments, what enables them?',
    summary: 'The inquiry turns from things we hear, see, think, and say toward the condition that makes hearing, seeing, thinking, and speaking possible.',
    recap: 'Brahman is not introduced as a hidden object behind ordinary objects. The refrains point to an enabling ground that cannot be captured by the very faculties it enables.',
    checkpoint: {
      question: 'Why does the text call Brahman “the hearing of hearing” rather than a special sound?',
      choices: ['Because it is the loudest possible sound', 'Because it enables hearing without becoming one more heard object', 'Because only priests can hear it', 'Because the ear is unimportant'],
      correct: 1,
      explanation: 'The phrase redirects attention from what is heard to the condition of hearing. The same structure is repeated for speech, mind, sight, and breath.',
    },
  },
  {
    id: 2,
    roman: 'II',
    title: 'What does “knowing” mean?',
    form: '5 mantras · metrical teaching',
    question: 'Can the ground of knowing be possessed as an object of knowledge?',
    summary: 'A teacher interrupts premature certainty. The student learns to distinguish transformative recognition from the claim “I have comprehended it completely.”',
    recap: 'The paradox is not an attack on inquiry. It challenges possession-like certainty and locates recognition in every act of awareness and in every living being.',
    checkpoint: {
      question: 'What kind of knowing does Kena II criticize?',
      choices: ['Careful inquiry of every kind', 'Knowledge learned from a teacher', 'Treating Brahman as a fully possessed and bounded object', 'Recognition within present experience'],
      correct: 2,
      explanation: 'The student can neither claim ordinary object-knowledge nor collapse into simple ignorance. The text asks for a less possessive form of recognition.',
    },
  },
  {
    id: 3,
    roman: 'III',
    title: 'The gods meet the mystery',
    form: '12 prose paragraphs · Yakṣa narrative',
    question: 'What happens when borrowed power mistakes itself for the source?',
    summary: 'After a victory, the gods claim greatness as their own. An unknown Yakṣa defeats Agni and Vāyu with a blade of grass, then vanishes before Indra.',
    recap: 'The story turns abstraction into an ethical test. Power is real, yet dependent; pride begins when an instrument claims the achievement as independently its own.',
    checkpoint: {
      question: 'What does the blade of grass reveal?',
      choices: ['The Yakṣa prefers plants', 'Agni and Vāyu have no power at all', 'A limited power cannot explain or own the source of its power', 'Indra secretly defeated both gods'],
      correct: 2,
      explanation: 'Agni can burn and Vāyu can carry, but neither capacity is self-grounding or unlimited. The tiny test exposes their mistaken claim of independence.',
    },
  },
  {
    id: 4,
    roman: 'IV',
    title: 'Revelation and practice',
    form: '9 prose paragraphs · interpretation and close',
    question: 'How does recognition become a way of living?',
    summary: 'Umā identifies the Yakṣa as Brahman. The text then offers lightning, a blink, and recollection as analogies before naming tapas, restraint, karman, Vedic study, and truth.',
    recap: 'Recognition requires instruction and humility, but it does not end in an idea. The final paragraphs name tapas, restraint, karman (action, including ritual duty), the Vedas, and truth as its foundation, limbs, and abode.',
    checkpoint: {
      question: 'Why do discipline and truthfulness appear at the end?',
      choices: ['They replace the teaching about Brahman', 'They are practical supports and the dwelling of insight', 'They prove the gods were immoral', 'They are requirements for memorizing Sanskrit'],
      correct: 1,
      explanation: 'The text names tapas, restraint, and karman as supports, the Vedas as limbs, and truth as the teaching’s abode.',
    },
  },
]

const kenaPassageBase: Omit<KenaPassage, 'words'>[] = [
  {
    id: '1.1', section: 1, number: 1, kind: 'mantra', title: 'What lets us think, speak, and sense?',
    devanagari: `ॐ केनेषितं पतति प्रेषितं मनः
केन प्राणः प्रथमः प्रैति युक्तः ।
केनेषितां वाचमिमां वदन्ति
चक्षुः श्रोत्रं क उ देवो युनक्ति ॥ १॥`,
    iast: `oṃ keneṣitaṃ patati preṣitaṃ manaḥ
kena prāṇaḥ prathamaḥ praiti yuktaḥ |
keneṣitāṃ vācam imāṃ vadanti
cakṣuḥ śrotraṃ ka u devo yunakti || 1 ||`,
    gloss: 'Willed and directed by whom does the mind move? Joined by whom does the foremost breath proceed? Prompted by whom do people speak? Which god or deity yokes sight and hearing?',
    explanation: 'You hear sounds, see things, think thoughts, speak, and breathe. The student asks what enables these abilities to work at all. Start by noticing this shift: from what you hear or think to what makes hearing and thinking possible. The first verse opens the question; it does not yet give an answer.',
    terms: [
      { term: 'kena', meaning: 'by whom' }, { term: 'iṣita', meaning: 'willed or impelled' }, { term: 'preṣita', meaning: 'directed' },
      { term: 'prāṇa', meaning: 'vital breath' }, { term: 'deva', meaning: 'luminous power or deity' }, { term: 'yunakti', meaning: 'yokes or joins' },
    ],
  },
  {
    id: '1.2', section: 1, number: 2, kind: 'mantra', title: 'Hearing behind hearing',
    devanagari: `श्रोत्रस्य श्रोत्रं मनसो मनो यद्
वाचो ह वाचं स उ प्राणस्य प्राणः ।
चक्षुषश्चक्षुरतिमुच्य धीराः
प्रेत्यास्माल्लोकादमृता भवन्ति ॥ २॥`,
    iast: `śrotrasya śrotraṃ manaso mano yad
vāco ha vācaṃ sa u prāṇasya prāṇaḥ |
cakṣuṣaś cakṣur atimucya dhīrāḥ
pretyāsmāl lokād amṛtā bhavanti || 2 ||`,
    gloss: 'It is the hearing behind hearing, the mind behind mind, speech behind speech, the life of life, and the sight behind sight. The discerning, having gone beyond or released these faculties, become deathless after departing from this world.',
    explanation: 'A sound is something you hear. Hearing is the ability through which you hear it. The teacher’s phrase “hearing of hearing” directs attention to what enables that ability. The course calls this Brahman: the ultimate reality named later in the text. This is an interpretation of the phrase, which literally repeats “hearing” with the relationship “of.”',
    terms: [
      { term: 'śrotrasya śrotram', meaning: 'hearing of hearing' }, { term: 'prāṇasya prāṇaḥ', meaning: 'life of life' },
      { term: 'atimucya', meaning: 'having released or gone beyond' }, { term: 'dhīra', meaning: 'discerning' }, { term: 'amṛta', meaning: 'deathless' },
    ],
  },
  {
    id: '1.3', section: 1, number: 3, kind: 'mantra', title: 'Where the faculties do not reach',
    devanagari: `न तत्र चक्षुर्गच्छति न वाग्गच्छति नो मनः ।
न विद्मो न विजानीमो यथैतदनुशिष्यात् ॥ ३॥`,
    iast: `na tatra cakṣur gacchati na vāg gacchati no manaḥ |
na vidmo na vijānīmo yathaitad anuśiṣyāt || 3 ||`,
    gloss: 'Sight does not reach there; speech does not reach there, nor does mind. We do not know, and cannot determine, how one might teach this.',
    explanation: 'A teacher can point to a tree, describe its leaves, and help you recognize it. Here, the teacher says that seeing, speaking, and thinking do not reach what is being taught in that ordinary way. The course reads this as a difficulty in describing what enables experience. The teacher acknowledges the difficulty and continues the inquiry.',
    terms: [
      { term: 'tatra', meaning: 'there' }, { term: 'vāk', meaning: 'speech' }, { term: 'vidmaḥ', meaning: 'we know' },
      { term: 'vijānīmaḥ', meaning: 'we discern distinctly' }, { term: 'anuśiṣyāt', meaning: 'one might instruct' },
    ],
  },
  {
    id: '1.4', section: 1, number: 4, kind: 'mantra', title: 'Other than known and unknown',
    devanagari: `अन्यदेव तद्विदितादथो अविदितादधि ।
इति शुश्रुम पूर्वेषां ये नस्तद्व्याचचक्षिरे ॥ ४॥`,
    iast: `anyad eva tad viditād atho aviditād adhi |
iti śuśruma pūrveṣāṃ ye nas tad vyācacakṣire || 4 ||`,
    gloss: 'It is truly other than the known and beyond the unknown. So we have heard from earlier teachers who explained it to us.',
    explanation: 'Think of a place you know and a place you have never visited. Both could be objects of knowledge. The teacher says the subject here is other than the known and beyond the unknown. The course reads this as a challenge to treating Brahman as just another thing to discover. The teacher also credits earlier teachers for the teaching.',
    terms: [
      { term: 'anyat', meaning: 'other or different' }, { term: 'vidita', meaning: 'known' }, { term: 'avidita', meaning: 'unknown' },
      { term: 'adhi', meaning: 'above or beyond' }, { term: 'śuśruma', meaning: 'we have heard' }, { term: 'pūrveṣām', meaning: 'of predecessors' },
    ],
    textNote: 'This course counts this as 1.4. Some editions join 1.3 and 1.4 into one unit, so their following five refrains are numbered 1.4–1.8 and the whole work has 34 rather than 35 units.',
  },
  {
    id: '1.5', section: 1, number: 5, kind: 'mantra', title: 'The source of speech',
    devanagari: `यद्वाचाऽनभ्युदितं येन वागभ्युद्यते ।
तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥ ५॥`,
    iast: `yad vācā 'nabhyuditaṃ yena vāg abhyudyate |
tad eva brahma tvaṃ viddhi nedaṃ yad idam upāsate || 5 ||`,
    gloss: 'Know as Brahman precisely that which speech does not express, but by which speech itself is expressed—not this that people contemplate or worship here.',
    explanation: 'The refrain distinguishes the source from any named or indicated thing. Words can direct attention, but no spoken formula encloses what gives speaking its power.',
    terms: [
      { term: 'anabhyudita', meaning: 'not expressed' }, { term: 'abhyudyate', meaning: 'is brought forth' },
      { term: 'viddhi', meaning: 'know' }, { term: 'brahman', meaning: 'ultimate reality' }, { term: 'upāsate', meaning: 'people contemplate or worship' },
    ],
  },
  {
    id: '1.6', section: 1, number: 6, kind: 'mantra', title: 'The source of thought',
    devanagari: `यन्मनसा न मनुते येनाहुर्मनो मतम् ।
तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥ ६॥`,
    iast: `yan manasā na manute yenāhur mano matam |
tad eva brahma tvaṃ viddhi nedaṃ yad idam upāsate || 6 ||`,
    gloss: 'Know as Brahman that which mind does not think, but through which, they say, mind is able to think—not this that people contemplate or worship here.',
    explanation: 'A thought can represent another thought or an external object. The text asks whether the illuminating condition of thought can be represented in exactly the same way.',
    terms: [
      { term: 'manas', meaning: 'mind' }, { term: 'manute', meaning: 'thinks' }, { term: 'matam', meaning: 'thought or cognized' }, { term: 'yena', meaning: 'by which' },
    ],
    textNote: 'Some printed and electronic editions have manaso matam where this study text reads mano matam. The course preserves one reading and flags the alternative rather than silently combining them.',
  },
  {
    id: '1.7', section: 1, number: 7, kind: 'mantra', title: 'The source of sight',
    devanagari: `यच्चक्षुषा न पश्यति येन चक्षूँषि पश्यति ।
तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥ ७॥`,
    iast: `yac cakṣuṣā na paśyati yena cakṣūṃṣi paśyati |
tad eva brahma tvaṃ viddhi nedaṃ yad idam upāsate || 7 ||`,
    gloss: 'Know as Brahman that which the eye does not see, but by which acts of seeing occur—not this that people contemplate or worship here.',
    explanation: 'Sight reveals visible form. The source of seeing, the mantra insists, is not exhausted by any form that appears within the visual field.',
    terms: [
      { term: 'cakṣus', meaning: 'eye or sight' }, { term: 'paśyati', meaning: 'sees' }, { term: 'cakṣūṃṣi', meaning: 'the eyes or acts of sight' },
    ],
  },
  {
    id: '1.8', section: 1, number: 8, kind: 'mantra', title: 'The source of hearing',
    devanagari: `यच्छ्रोत्रेण न शृणोति येन श्रोत्रमिदं श्रुतम् ।
तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥ ८॥`,
    iast: `yac chrotreṇa na śṛṇoti yena śrotram idaṃ śrutam |
tad eva brahma tvaṃ viddhi nedaṃ yad idam upāsate || 8 ||`,
    gloss: 'Know as Brahman that which is not heard with the ear, but by which this ear is able to hear—not this that people contemplate or worship here.',
    explanation: 'Sounds come and go as objects of hearing. The mantra directs inquiry toward what remains presupposed through every such appearance and disappearance.',
    terms: [
      { term: 'śrotra', meaning: 'ear or hearing' }, { term: 'śṛṇoti', meaning: 'hears' }, { term: 'śrutam', meaning: 'heard or enabled to hear' },
    ],
  },
  {
    id: '1.9', section: 1, number: 9, kind: 'mantra', title: 'The source of breath',
    devanagari: `यत्प्राणेन न प्राणिति येन प्राणः प्रणीयते ।
तदेव ब्रह्म त्वं विद्धि नेदं यदिदमुपासते ॥ ९॥`,
    iast: `yat prāṇena na prāṇiti yena prāṇaḥ praṇīyate |
tad eva brahma tvaṃ viddhi nedaṃ yad idam upāsate || 9 ||`,
    gloss: 'Know as Brahman that which does not live or breathe through breath, but by which breath is moved—not this that people contemplate or worship here.',
    explanation: 'Even prāṇa, the vital power often treated as foundational, is presented as dependent. The first section ends by refusing to identify the ultimate source with any instrument, however subtle.',
    terms: [
      { term: 'prāṇa', meaning: 'breath or vital power' }, { term: 'prāṇiti', meaning: 'breathes or lives' }, { term: 'praṇīyate', meaning: 'is led or moved' },
    ],
  },
  {
    id: '2.1', section: 2, number: 1, kind: 'mantra', title: 'The teacher interrupts certainty',
    devanagari: `यदि मन्यसे सुवेदेति दहरमेवापि नूनं त्वं वेत्थ ब्रह्मणो रूपम् ।
यदस्य त्वं यदस्य देवेष्वथ नु मीमांस्यमेव ते मन्ये विदितम् ॥ १॥`,
    iast: `yadi manyase suvedeti daharam evāpi nūnaṃ tvaṃ vettha brahmaṇo rūpam |
yad asya tvaṃ yad asya deveṣv atha nu mīmāṃsyam eva te manye viditam || 1 ||`,
    gloss: 'If you think, “I know it well,” you surely know only a small form of Brahman—what of it is known in you and what of it is among the gods. It must still be investigated by you. [Student:] “I think it is known.”',
    explanation: 'The lesson restarts precisely when the learner feels finished. A formula about Brahman, even a correct one, can become a small and premature enclosure of the subject.',
    terms: [
      { term: 'suveda', meaning: 'knows well' }, { term: 'daharam', meaning: 'a small amount' }, { term: 'rūpa', meaning: 'form or appearance' },
      { term: 'deveṣu', meaning: 'among the gods' }, { term: 'mīmāṃsya', meaning: 'to be investigated' },
    ],
    textNote: 'Printed and electronic editions record both daharam (“small”) and dabhram (“slight” or “little”). The wording of the middle clause varies and is syntactically difficult, so the course does not present one reconstruction as beyond dispute.',
  },
  {
    id: '2.2', section: 2, number: 2, kind: 'mantra', title: 'Neither possession nor ignorance',
    devanagari: `नाहं मन्ये सुवेदेति नो न वेदेति वेद च ।
यो नस्तद्वेद तद्वेद नो न वेदेति वेद च ॥ २॥`,
    iast: `nāhaṃ manye suvedeti no na vedeti veda ca |
yo nas tad veda tad veda no na vedeti veda ca || 2 ||`,
    gloss: 'I do not think, “I know it well.” Yet I do not say that I do not know; in a different sense, I do know. Whoever among us understands this relation truly understands: it is neither simple not-knowing nor ordinary object-knowing.',
    explanation: 'The student avoids two easy answers: claiming complete conceptual possession and declaring the subject wholly inaccessible. The tension forces a distinction between knowing an object and recognizing the condition of knowing.',
    terms: [
      { term: 'nāhaṃ manye', meaning: 'I do not think' }, { term: 'veda', meaning: 'knows' }, { term: 'no na veda', meaning: 'not that one does not know' }, { term: 'nas', meaning: 'among us' },
    ],
  },
  {
    id: '2.3', section: 2, number: 3, kind: 'mantra', title: 'The paradox of non-possession',
    devanagari: `यस्यामतं तस्य मतं मतं यस्य न वेद सः ।
अविज्ञातं विजानतां विज्ञातमविजानताम् ॥ ३॥`,
    iast: `yasyāmataṃ tasya mataṃ mataṃ yasya na veda saḥ |
avijñātaṃ vijānatāṃ vijñātam avijānatām || 3 ||`,
    gloss: 'For whom it is not thought or known, for that person it is thought or known; whoever regards it as thought or known does not know. It is unknown to those who know and known to those who do not know.',
    explanation: 'One influential reading takes this paradox to reject object-like or possessive knowledge, not recognition itself. Other construals are possible, and the surface wording remains deliberately sharper than the course explanation.',
    terms: [
      { term: 'amata', meaning: 'not thought or understood' }, { term: 'mata', meaning: 'thought or understood' },
      { term: 'avijñāta', meaning: 'not distinctly known' }, { term: 'vijānatām', meaning: 'of those who know or discern' },
    ],
  },
  {
    id: '2.4', section: 2, number: 4, kind: 'mantra', title: 'Known in every awakening',
    devanagari: `प्रतिबोधविदितं मतममृतत्वं हि विन्दते ।
आत्मना विन्दते वीर्यं विद्यया विन्दतेऽमृतम् ॥ ४॥`,
    iast: `pratibodhaviditaṃ matam amṛtatvaṃ hi vindate |
ātmanā vindate vīryaṃ vidyayā vindate 'mṛtam || 4 ||`,
    gloss: 'It is rightly understood as known in and through every act of awareness; through the Self one finds strength, and through knowledge one finds the deathless.',
    explanation: 'A major Vedānta reading understands pratibodhaviditam as “known in every cognition”; the compact expression admits other construals. On that reading, the search turns toward what is present through seeing, remembering, doubting, and understanding alike.',
    terms: [
      { term: 'pratibodha', meaning: 'each cognition or awakening' }, { term: 'vidita', meaning: 'known' }, { term: 'ātman', meaning: 'Self' },
      { term: 'vīrya', meaning: 'strength' }, { term: 'vidyā', meaning: 'knowledge' }, { term: 'amṛta', meaning: 'the deathless' },
    ],
  },
  {
    id: '2.5', section: 2, number: 5, kind: 'mantra', title: 'The urgency of recognition',
    devanagari: `इह चेदवेदीदथ सत्यमस्ति
न चेदिहावेदीन्महती विनष्टिः ।
भूतेषु भूतेषु विचित्य धीराः
प्रेत्यास्माल्लोकादमृता भवन्ति ॥ ५॥`,
    iast: `iha ced avedīd atha satyam asti
na ced ihāvedīn mahatī vinaṣṭiḥ |
bhūteṣu bhūteṣu vicitya dhīrāḥ
pretyāsmāl lokād amṛtā bhavanti || 5 ||`,
    gloss: 'If one knows it here, then there is truth or fulfillment; if one does not know it here, the loss is great. Discerning it in each and every being, the wise become deathless after leaving this world.',
    explanation: '“Here” prevents the teaching from becoming a merely remote speculation. Recognition is tested in how one sees living beings now, even as the mantra also speaks in the inherited language of deathlessness.',
    terms: [
      { term: 'iha', meaning: 'here, in this life' }, { term: 'satyam', meaning: 'truth or fulfillment' }, { term: 'vinaṣṭi', meaning: 'loss' },
      { term: 'bhūteṣu bhūteṣu', meaning: 'in every being' }, { term: 'vicitya', meaning: 'having discerned' },
    ],
  },
  {
    id: '3.1', section: 3, number: 1, kind: 'prose paragraph', title: 'Whose victory?',
    devanagari: `ब्रह्म ह देवेभ्यो विजिग्ये तस्य ह ब्रह्मणो विजये देवा अमहीयन्त ॥ १॥`,
    iast: `brahma ha devebhyo vijigye tasya ha brahmaṇo vijaye devā amahīyanta || 1 ||`,
    gloss: 'Brahman won a victory for the gods. In Brahman’s victory, the gods exulted and became glorified.',
    explanation: 'The narrator gives the learner the decisive fact before the gods know it. Their genuine participation in victory is not denied, but its ultimate source is separated from its visible agents.',
    terms: [
      { term: 'deva', meaning: 'god or luminous power' }, { term: 'vijigye', meaning: 'won or conquered' }, { term: 'vijaya', meaning: 'victory' }, { term: 'amahīyanta', meaning: 'became great or celebrated' },
    ],
  },
  {
    id: '3.2', section: 3, number: 2, kind: 'prose paragraph', title: 'When participation becomes ownership',
    devanagari: `त ऐक्षन्तास्माकमेवायं विजयोऽस्माकमेवायं महिमेति ।
तद्धैषां विजज्ञौ तेभ्यो ह प्रादुर्बभूव तन्न व्यजानत किमिदं यक्षमिति ॥ २॥`,
    iast: `ta aikṣantāsmākam evāyaṃ vijayo 'smākam evāyaṃ mahimeti |
tad dhaiṣāṃ vijajñau tebhyo ha prādur babhūva tan na vyajānata kim idaṃ yakṣam iti || 2 ||`,
    gloss: 'They thought, “This victory is ours alone; this greatness is ours alone.” Brahman recognized their conceit and appeared before them, but they did not recognize it: “What is this mysterious presence?”',
    explanation: 'Pride is defined here as a failure of attribution. The Yakṣa does not arrive as an obvious label reading “Brahman”; the gods must learn how little their categories can initially recognize.',
    terms: [
      { term: 'aikṣanta', meaning: 'they considered' }, { term: 'asmākam', meaning: 'ours' }, { term: 'mahimā', meaning: 'greatness' },
      { term: 'prādur babhūva', meaning: 'appeared' }, { term: 'yakṣa', meaning: 'mysterious or awe-inspiring being' },
    ],
  },
  {
    id: '3.3', section: 3, number: 3, kind: 'prose paragraph', title: 'Agni is sent',
    devanagari: `तेऽग्निमब्रुवञ्जातवेद एतद्विजानीहि किमेतद्यक्षमिति तथेति ॥ ३॥`,
    iast: `te 'gnim abruvañ jātaveda etad vijānīhi kim etad yakṣam iti | tatheti || 3 ||`,
    gloss: 'They said to Agni, “Jātavedas, find out what this mysterious being is.” He answered, “So be it.”',
    explanation: 'The gods select a brilliant and knowledgeable power as their investigator. The title Jātavedas already carries reputation, which the next paragraphs will place under examination.',
    terms: [
      { term: 'Agni', meaning: 'Fire' }, { term: 'Jātavedas', meaning: '“knower of creatures or births,” an epithet of Agni' },
      { term: 'vijānīhi', meaning: 'find out or discern' }, { term: 'tathā', meaning: 'so be it' },
    ],
  },
  {
    id: '3.4', section: 3, number: 4, kind: 'prose paragraph', title: 'A title is not an answer',
    devanagari: `तदभ्यद्रवत्तमभ्यवदत्कोऽसीत्यग्निर्वा अहमस्मीत्यब्रवीज्जातवेदा वा अहमस्मीति ॥ ४॥`,
    iast: `tad abhyadravat tam abhyavadat ko 'sīty agnir vā aham asmīty abravīj jātavedā vā aham asmīti || 4 ||`,
    gloss: 'Agni rushed toward it. It asked him, “Who are you?” He replied, “I am Agni; I am Jātavedas.”',
    explanation: 'Agni responds with name and office. The Yakṣa’s simple question turns identity from a badge into something that must be demonstrated and understood.',
    terms: [
      { term: 'abhyadravat', meaning: 'rushed toward' }, { term: "ko 'si", meaning: 'who are you?' }, { term: 'aham asmi', meaning: 'I am' }, { term: 'abravīt', meaning: 'he said' },
    ],
  },
  {
    id: '3.5', section: 3, number: 5, kind: 'prose paragraph', title: 'The claim of unlimited power',
    devanagari: `तस्मिंस्त्वयि किं वीर्यमित्यपीदं सर्वं दहेयं यदिदं पृथिव्यामिति ॥ ५॥`,
    iast: `tasmiṃs tvayi kiṃ vīryam ity apīdaṃ sarvaṃ daheyaṃ yad idaṃ pṛthivyām iti || 5 ||`,
    gloss: 'It asked, “What power is in you?” Agni replied, “I could burn everything here on earth.”',
    explanation: 'A real capacity becomes an absolute claim: from “fire burns” to “I can burn everything.” The story isolates this leap before testing it.',
    terms: [
      { term: 'vīrya', meaning: 'power or capacity' }, { term: 'daheyaṃ', meaning: 'I could burn' }, { term: 'sarvam', meaning: 'everything' }, { term: 'pṛthivyām', meaning: 'on earth' },
    ],
  },
  {
    id: '3.6', section: 3, number: 6, kind: 'prose paragraph', title: 'The blade of grass',
    devanagari: `तस्मै तृणं निदधावेतद्दहेति ।
तदुपप्रेयाय सर्वजवेन तन्न शशाक दग्धुं स तत एव निववृते नैतदशकं विज्ञातुं यदेतद्यक्षमिति ॥ ६॥`,
    iast: `tasmai tṛṇaṃ nidadhāv etad daheti |
tad upapreyāya sarvajavena tan na śaśāka dagdhuṃ sa tata eva nivavṛte naitad aśakaṃ vijñātuṃ yad etad yakṣam iti || 6 ||`,
    gloss: 'It placed a blade of grass before him and said, “Burn this.” Agni approached with all his force but could not burn it. He returned, admitting that he could not discover what the presence was.',
    explanation: 'The scale of the test is the point: the smallest thing defeats the largest claim. Agni’s return is also a first movement toward honesty—he can report a limit that pride did not anticipate.',
    terms: [
      { term: 'tṛṇa', meaning: 'blade of grass' }, { term: 'daha', meaning: 'burn' }, { term: 'sarvajavena', meaning: 'with all speed or force' },
      { term: 'na śaśāka', meaning: 'was unable' }, { term: 'nivavṛte', meaning: 'turned back' },
    ],
  },
  {
    id: '3.7', section: 3, number: 7, kind: 'prose paragraph', title: 'Vāyu is sent',
    devanagari: `अथ वायुमब्रुवन्वायवेतद्विजानीहि किमेतद्यक्षमिति तथेति ॥ ७॥`,
    iast: `atha vāyum abruvan vāyav etad vijānīhi kim etad yakṣam iti | tatheti || 7 ||`,
    gloss: 'Then they said to Vāyu, “Vāyu, find out what this mysterious being is.” He answered, “So be it.”',
    explanation: 'The second attempt changes the faculty but not the strategy. The narrative’s repetition invites us to see a structural error rather than one god’s accidental weakness.',
    terms: [
      { term: 'atha', meaning: 'then' }, { term: 'Vāyu', meaning: 'Wind' }, { term: 'vāyav', meaning: 'O Vāyu, before a vowel' }, { term: 'vijānīhi', meaning: 'find out' },
    ],
  },
  {
    id: '3.8', section: 3, number: 8, kind: 'prose paragraph', title: 'Vāyu names himself',
    devanagari: `तदभ्यद्रवत्तमभ्यवदत्कोऽसीति वायुर्वा अहमस्मीत्यब्रवीन्मातरिश्वा वा अहमस्मीति ॥ ८॥`,
    iast: `tad abhyadravat tam abhyavadat ko 'sīti vāyur vā aham asmīty abravīn mātariśvā vā aham asmīti || 8 ||`,
    gloss: 'Vāyu rushed toward it. It asked, “Who are you?” He replied, “I am Vāyu; I am Mātariśvan.”',
    explanation: 'Like Agni, Vāyu presents a cosmic title. The repeated dialogue makes the learner anticipate the gap between a prestigious identity and a dependent capacity.',
    terms: [
      { term: 'Vāyu', meaning: 'Wind' }, { term: 'Mātariśvan', meaning: '“the one moving in the atmosphere,” an epithet of wind' }, { term: 'abhyavadat', meaning: 'addressed' },
    ],
  },
  {
    id: '3.9', section: 3, number: 9, kind: 'prose paragraph', title: 'The second absolute claim',
    devanagari: `तस्मिंस्त्वयि किं वीर्यमित्यपीदं सर्वमाददीय यदिदं पृथिव्यामिति ॥ ९॥`,
    iast: `tasmiṃs tvayi kiṃ vīryam ity apīdaṃ sarvam ādadīya yad idaṃ pṛthivyām iti || 9 ||`,
    gloss: 'It asked, “What power is in you?” Vāyu replied, “I could carry away everything here on earth.”',
    explanation: 'Motion now takes the place of fire, but the grammar of pride remains the same: a particular function is inflated into total independence.',
    terms: [
      { term: 'ādadīya', meaning: 'I could take or carry away' }, { term: 'vīrya', meaning: 'power' }, { term: 'pṛthivyām', meaning: 'on earth' },
    ],
  },
  {
    id: '3.10', section: 3, number: 10, kind: 'prose paragraph', title: 'Force cannot lift the source',
    devanagari: `तस्मै तृणं निदधावेतदादत्स्वेति ।
तदुपप्रेयाय सर्वजवेन तन्न शशाकादातुं स तत एव निववृते नैतदशकं विज्ञातुं यदेतद्यक्षमिति ॥ १०॥`,
    iast: `tasmai tṛṇaṃ nidadhāv etad ādatsveti |
tad upapreyāya sarvajavena tan na śaśākādātuṃ sa tata eva nivavṛte naitad aśakaṃ vijñātuṃ yad etad yakṣam iti || 10 ||`,
    gloss: 'It placed a blade of grass before him and said, “Take this.” Vāyu approached with all his force but could not lift it. He returned, admitting that he could not discover what the presence was.',
    explanation: 'The same blade defeats another universal claim. Fire and wind remain real powers, but neither can account for the condition under which its power operates.',
    terms: [
      { term: 'ādatsva', meaning: 'take it' }, { term: 'ādātum', meaning: 'to take up' }, { term: 'aśakam', meaning: 'I was unable' }, { term: 'vijñātum', meaning: 'to identify' },
    ],
  },
  {
    id: '3.11', section: 3, number: 11, kind: 'prose paragraph', title: 'The mystery withdraws',
    devanagari: `अथेन्द्रमब्रुवन्मघवन्नेतद्विजानीहि किमेतद्यक्षमिति तथेति ।
तदभ्यद्रवत्तस्मात्तिरोदधे ॥ ११॥`,
    iast: `athendram abruvan maghavann etad vijānīhi kim etad yakṣam iti | tatheti |
tad abhyadravat tasmāt tirodadhe || 11 ||`,
    gloss: 'Then they said to Indra, “Maghavan, find out what this mysterious being is.” He agreed and approached it, but it vanished from before him.',
    explanation: 'Indra receives no feat to perform. The object of investigation disappears, breaking the assumption that ultimate reality will remain available for inspection on the investigator’s terms.',
    terms: [
      { term: 'Indra', meaning: 'leader of the gods' }, { term: 'Maghavan', meaning: '“bountiful or powerful one,” an epithet of Indra' }, { term: 'tirodadhe', meaning: 'disappeared or concealed itself' },
    ],
  },
  {
    id: '3.12', section: 3, number: 12, kind: 'prose paragraph', title: 'Umā receives the question',
    devanagari: `स तस्मिन्नेवाकाशे स्त्रियमाजगाम बहुशोभमानामुमां हैमवतीं तां होवाच किमेतद्यक्षमिति ॥ १२॥`,
    iast: `sa tasminn evākāśe striyam ājagāma bahuśobhamānām umāṃ haimavatīṃ tāṃ hovāca kim etad yakṣam iti || 12 ||`,
    gloss: 'In that very space he encountered a woman of great radiance, Umā Haimavatī. He asked her, “What was that mysterious being?”',
    explanation: 'The answer comes neither from force nor from a god’s self-description. Indra remains with the question, and radiant Umā is the one he asks. Later interpreters often read her as a figure of revealed knowledge.',
    terms: [
      { term: 'ākāśa', meaning: 'space' }, { term: 'bahuśobhamānā', meaning: 'greatly radiant' }, { term: 'Umā Haimavatī', meaning: 'Umā, associated with Himavat' }, { term: 'ājagāma', meaning: 'encountered or came upon' },
    ],
  },
  {
    id: '4.1', section: 4, number: 1, kind: 'prose paragraph', title: 'Recognition requires instruction',
    devanagari: `सा ब्रह्मेति होवाच ब्रह्मणो वा एतद्विजये महीयध्वमिति ।
ततो हैव विदाञ्चकार ब्रह्मेति ॥ १॥`,
    iast: `sā brahmeti hovāca brahmaṇo vā etad vijaye mahīyadhvam iti |
tato haiva vidāṃ cakāra brahmeti || 1 ||`,
    gloss: 'She said, “It was Brahman. You became exalted through Brahman’s victory.” Only then did Indra understand that it was Brahman.',
    explanation: 'Umā supplies the missing identification and corrects the gods’ account of success. Indra’s distinction is not self-sufficiency: even he needs teaching.',
    terms: [
      { term: 'sā', meaning: 'she' }, { term: 'brahma iti', meaning: '“it was Brahman”' }, { term: 'mahīyadhvam', meaning: 'you became great' }, { term: 'vidāṃ cakāra', meaning: 'came to know' },
    ],
  },
  {
    id: '4.2', section: 4, number: 2, kind: 'prose paragraph', title: 'Nearness to the question',
    devanagari: `तस्माद्वा एते देवा अतितरामिवान्यान्देवान्यदग्निर्वायुरिन्द्रस्ते
ह्येनन्नेदिष्ठं पस्पर्शुस्ते ह्येनत्प्रथमो विदाञ्चकार ब्रह्मेति ॥ २॥`,
    iast: `tasmād vā ete devā atitarām ivānyān devān yad agnir vāyur indras te
hy enan nediṣṭhaṃ pasparśus te hy enat prathamo vidāṃ cakāra brahmeti || 2 ||`,
    gloss: 'Therefore Agni, Vāyu, and Indra are said to surpass the other gods, as it were, because they came nearest to the presence and were first connected with recognizing it as Brahman.',
    explanation: 'The cautious “as it were” matters. Their superiority lies in proximity to inquiry and recognition, not in proving that their original boast was correct.',
    terms: [
      { term: 'atitarām iva', meaning: 'as if surpassing greatly' }, { term: 'nediṣṭham', meaning: 'nearest' }, { term: 'pasparśuḥ', meaning: 'they touched or approached' }, { term: 'prathama', meaning: 'first' },
    ],
    textNote: 'This study text preserves plural te … pasparśuḥ followed by singular prathamo vidāṃ cakāra. Some editions regularize the final phrase as plural. The irregularity is left visible rather than silently repaired.',
  },
  {
    id: '4.3', section: 4, number: 3, kind: 'prose paragraph', title: 'Why Indra is singled out',
    devanagari: `तस्माद्वा इन्द्रोऽतितरामिवान्यान्देवान्स
ह्येनन्नेदिष्ठं पस्पर्श स ह्येनत्प्रथमो विदाञ्चकार ब्रह्मेति ॥ ३॥`,
    iast: `tasmād vā indro 'titarām ivānyān devān sa
hy enan nediṣṭhaṃ pasparśa sa hy enat prathamo vidāṃ cakāra brahmeti || 3 ||`,
    gloss: 'Therefore Indra is said to surpass the other gods, as it were: he came nearest and was the first to recognize it as Brahman.',
    explanation: 'Indra did not pass a stronger test. He came closest, experienced the disappearance, kept asking, and received instruction. Persistence and teachability redefine greatness.',
    terms: [
      { term: 'Indra', meaning: 'Indra' }, { term: 'nediṣṭham', meaning: 'nearest' }, { term: 'pasparśa', meaning: 'touched or approached' }, { term: 'vidāṃ cakāra', meaning: 'recognized' },
    ],
  },
  {
    id: '4.4', section: 4, number: 4, kind: 'prose paragraph', title: 'Lightning and the blink',
    devanagari: `तस्यैष आदेशो यदेतद्विद्युतो व्यद्युतदा३
इतीन् न्यमीमिषदा३ इत्यधिदैवतम् ॥ ४॥`,
    iast: `tasyaiṣa ādeśo yad etad vidyuto vyadyutad ā3
itīn nyamīmiṣad ā3 ity adhidaivatam || 4 ||`,
    gloss: 'This is an analogical indication of it on the cosmic level: it is like lightning that suddenly flashes, or like an eye that suddenly winks.',
    explanation: 'These are indications, not pictures of Brahman. The images chiefly convey a sudden or swift manifestation; the course reads that suddenness as disclosure without possession.',
    terms: [
      { term: 'ādeśa', meaning: 'indication or analogy' }, { term: 'vidyut', meaning: 'lightning' }, { term: 'vyadyutat', meaning: 'flashed' },
      { term: 'nyamīmiṣat', meaning: 'winked or closed the eye' }, { term: 'adhidaivatam', meaning: 'with reference to cosmic powers' },
    ],
    textNote: 'The 3 in ā3 marks an ancient three-mora (pluta) vowel. It is retained for textual study; this course is not a guide to Vedic pitch or recitation.',
  },
  {
    id: '4.5', section: 4, number: 5, kind: 'prose paragraph', title: 'The mind moves “as if”',
    devanagari: `अथाध्यात्मं यदेतद्गच्छतीव च मनोऽनेन
चैतदुपस्मरत्यभीक्ष्णं सङ्कल्पः ॥ ५॥`,
    iast: `athādhyātmaṃ yad etad gacchatīva ca mano 'nena
caitad upasmaraty abhīkṣṇaṃ saṅkalpaḥ || 5 ||`,
    gloss: 'Now the corresponding inner indication: the mind seems to go toward it, and intention (saṅkalpa), through the mind, repeatedly recollects it.',
    explanation: 'The text carefully says that mind goes toward Brahman “as if.” Saṅkalpa is the grammatical subject of the recollection here; recollection and sustained orientation can prepare recognition without turning Brahman into a mental picture.',
    terms: [
      { term: 'adhyātmam', meaning: 'with reference to the inner self' }, { term: 'gacchatīva', meaning: 'seems to go' },
      { term: 'upasmarati', meaning: 'recollects closely' }, { term: 'abhīkṣṇam', meaning: 'repeatedly' }, { term: 'saṅkalpa', meaning: 'resolve or directed thought' },
    ],
  },
  {
    id: '4.6', section: 4, number: 6, kind: 'prose paragraph', title: 'That which is deeply desired',
    devanagari: `तद्ध तद्वनं नाम तद्वनमित्युपासितव्यं स य एतदेवं वेदाभि
हैनं सर्वाणि भूतानि संवाञ्छन्ति ॥ ६॥`,
    iast: `tad dha tadvanaṃ nāma tadvanam ity upāsitavyaṃ sa ya etad evaṃ vedābhi
hainaṃ sarvāṇi bhūtāni saṃvāñchanti || 6 ||`,
    gloss: 'It bears the name Tadvanam—“That which is beloved or worthy of longing.” It should be contemplated under that name. All beings are drawn toward the person who understands it in this way.',
    explanation: 'The inquiry has an affective dimension: ultimate reality is not only the condition of cognition but also the deepest orientation of value and longing.',
    terms: [
      { term: 'tadvanam', meaning: '“That-beloved” or “That-desired,” an interpretive name' }, { term: 'upāsitavyam', meaning: 'to be contemplated' },
      { term: 'saṃvāñchanti', meaning: 'long for or seek' }, { term: 'bhūtāni', meaning: 'beings' },
    ],
  },
  {
    id: '4.7', section: 4, number: 7, kind: 'prose paragraph', title: 'Has the Upaniṣad been taught?',
    devanagari: `उपनिषदं भो ब्रूहीत्युक्ता त उपनिषद्ब्राह्मीं वाव त
उपनिषदमब्रूमेति ॥ ७॥`,
    iast: `upaniṣadaṃ bho brūhīty uktā ta upaniṣad brāhmīṃ vāva ta
upaniṣadam abrūmeti || 7 ||`,
    gloss: 'The student says, “Sir, teach me the Upaniṣad.” The teacher replies, “The Upaniṣad has been taught to you; indeed, we have taught you the Upaniṣad concerning Brahman.”',
    explanation: 'The learner’s request sounds surprising after the entire teaching. It creates the opening for the teacher to state what supports realization beyond hearing the doctrine.',
    terms: [
      { term: 'bhoḥ', meaning: 'sir or revered one' }, { term: 'brūhi', meaning: 'tell or teach' }, { term: 'uktā', meaning: 'has been spoken' },
      { term: 'brāhmī', meaning: 'concerning Brahman' }, { term: 'upaniṣad', meaning: 'Upaniṣad; here, the teaching concerning Brahman' },
    ],
  },
  {
    id: '4.8', section: 4, number: 8, kind: 'prose paragraph', title: 'The foundations of insight',
    devanagari: `तस्यै तपो दमः कर्मेति प्रतिष्ठा वेदाः सर्वाङ्गानि
सत्यमायतनम् ॥ ८॥`,
    iast: `tasyai tapo damaḥ karmeti pratiṣṭhā vedāḥ sarvāṅgāni
satyam āyatanam || 8 ||`,
    gloss: 'Discipline, self-restraint, and action or ritual work are its foundation; the Vedas are all its limbs, and truth is its dwelling place.',
    explanation: 'The closing refuses a split between insight and formation of life. Karman first names action or ritual work in an inherited Vedic setting; broader ethical application is an interpretive extension. Study has limbs, realization needs support, and truthfulness is its abode.',
    terms: [
      { term: 'tapas', meaning: 'discipline or concentrated effort' }, { term: 'dama', meaning: 'self-restraint' }, { term: 'karman', meaning: 'action or ritual duty' },
      { term: 'pratiṣṭhā', meaning: 'foundation' }, { term: 'satya', meaning: 'truthfulness' }, { term: 'āyatana', meaning: 'abode' },
    ],
  },
  {
    id: '4.9', section: 4, number: 9, kind: 'prose paragraph', title: 'Established, established',
    devanagari: `यो वा एतामेवं वेदापहत्य पाप्मानमनन्ते स्वर्गे
लोके ज्येये प्रतितिष्ठति प्रतितिष्ठति ॥ ९॥`,
    iast: `yo vā etām evaṃ vedāpahatya pāpmānam anante svarge
loke jyeye pratitiṣṭhati pratitiṣṭhati || 9 ||`,
    gloss: 'Whoever understands this in this way, having cast off evil, becomes firmly established in the endless and highest heavenly world—firmly established indeed.',
    explanation: 'The repeated final verb gives formal closure and emphasis. The surface language promises an enduring, excellent realm; later traditions interpret the soteriological force of that promise in different ways.',
    terms: [
      { term: 'veda', meaning: 'understands' }, { term: 'apahatya', meaning: 'having cast off' }, { term: 'pāpmānam', meaning: 'evil or fault' },
      { term: 'ananta', meaning: 'endless' }, { term: 'jyeya', meaning: 'higher or supreme' }, { term: 'pratitiṣṭhati', meaning: 'becomes established' },
    ],
    textNote: 'Svarge loke jyeye permits more than one rendering, including “highest heavenly world” and “excellent radiant realm.” Later accounts of liberation should be identified as interpretations rather than silently inserted into the line.',
  },
]

const kenaWordsById = new Map(kenaWordStudy.map((entry) => [entry.id, entry.words]))

export const kenaPassages: KenaPassage[] = kenaPassageBase.map((passage) => {
  const words = kenaWordsById.get(passage.id)
  if (!words) throw new Error(`Missing Kena word study for ${passage.id}`)
  return { ...passage, words }
})

export const kenaSources = [
  {
    label: 'Sanskrit Wikisource · Kena Upaniṣad',
    url: 'https://sa.wikisource.org/wiki/केनोपनिषद्',
    use: 'Base Sanskrit transcription adapted for this study text; normalization and resegmentation are identified in the editorial note.',
  },
  {
    label: 'TITUS · Kena Upaniṣad Roman text',
    url: 'https://titus.uni-frankfurt.de/texte/etcs/ind/aind/ved/sv/upanisad/kenup/kenupt.htm',
    use: 'Scholarly electronic collation aid for numbering and selected readings; linked for checking, not used as the republication source.',
  },
  {
    label: 'Vedic Heritage Portal · Kenopaniṣad',
    url: 'https://vedicheritage.gov.in/hi/upanishads/kenopanisad/',
    use: 'Government-hosted Sanskrit comparison for the received text and section boundaries.',
  },
  {
    label: 'Cologne Digital Sanskrit Dictionaries',
    url: 'https://www.sanskrit-lexicon.uni-koeln.de/',
    use: 'Lexical reference for the original word-by-word English senses; dictionary prose is not copied.',
  },
  {
    label: 'Sanskrit Heritage Engine · reference manual',
    url: 'https://sanskrit.uohyd.ac.in/SKT/manual.html',
    use: 'Morphology and sandhi reference used to check learning segmentations and grammatical labels.',
  },
  {
    label: 'Max Müller · Talavakāra Upaniṣad (1879)',
    url: 'https://en.wikisource.org/wiki/Sacred_Books_of_the_East/Volume_1/Talavakâra-upanishad',
    use: 'Public-domain historical translation and numbering comparison; its interpretive vocabulary reflects its period.',
  },
  {
    label: 'Robert Ernest Hume · Thirteen Principal Upanishads (1921)',
    url: 'https://commons.wikimedia.org/wiki/File:The_Thirteen_Principal_Upanishads_(IA_bwb_T5-AQK-009).pdf',
    use: 'Public-domain scan for historical comparison.',
  },
  {
    label: 'Internet Encyclopedia of Philosophy · Upaniṣads',
    url: 'https://iep.utm.edu/upanisad/',
    use: 'Modern academic orientation to the texts and their philosophical setting.',
  },
  {
    label: 'Creative Commons Attribution-ShareAlike 4.0',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    use: 'License terms for the adapted Sanskrit and corresponding IAST text layers.',
  },
]

export const kenaEditorialNote = 'This course uses one 35-learning-unit segmentation: 9 + 5 metrical mantras and 12 + 9 prose units. Other editions may combine two early units and count 34. The Sanskrit is normalized and unaccented for study, with the pluta marker retained at 4.4; it is not a chanting guide. The IAST follows this study text. Word-by-word entries are original, context-sensitive learning aids: they separate surface sandhi and compounds where useful, but they are not a canonical padapāṭha and another grammatical analysis may segment a phrase differently. Course paraphrases, teaching notes, diagrams, and checkpoints are original editorial work. Selected consequential variants are flagged.'

export function getKenaSection(id: number) {
  return kenaSections.find((section) => section.id === id)
}

export function getKenaPassagesForSection(id: number) {
  return kenaPassages.filter((passage) => passage.section === id)
}
