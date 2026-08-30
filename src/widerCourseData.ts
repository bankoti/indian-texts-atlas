import type { CourseLesson, CourseSection, LessonDetail } from './courseData'

type SectionSource = { label: string; url: string; use: string }

type WiderLessonSeed = {
  id: string
  title: string
  texts: string
  question: string
  insight: string
  minutes?: number
}

type WiderSectionSeed = CourseSection & {
  guardrails: Array<{ name: string; reading: string }>
  sources: SectionSource[]
  lessons: WiderLessonSeed[]
}

const sectionSeeds: WiderSectionSeed[] = [
  {
    id: 'vedic-foundations', order: 2, shortTitle: 'Vedic foundations', title: 'Before Vedānta: Hymn, Ritual, and Vedic Knowledge', eyebrow: 'COURSE 2 · VEDIC FOUNDATIONS', tone: 'saffron',
    description: 'The Vedas as layered oral, poetic, ritual, domestic, and technical archives—not a single book of doctrine.',
    promise: 'Hear how hymn, melody, formula, ritual explanation, household practice, and technical discipline create a textual world.',
    guardrails: [
      { name: 'Oral-performance lens', reading: 'Accent, melody, sequence, teacher, and embodied performance belong to the text’s history alongside written wording.' },
      { name: 'Layered-corpus lens', reading: 'Saṃhitā, Brāhmaṇa, Āraṇyaka, and Sūtra materials overlap and vary by school rather than forming one universal shelf.' },
      { name: 'Historical lens', reading: 'Ritual prescriptions disclose arguments and ideals; they are not a complete documentary record of how every community lived.' },
    ],
    sources: [
      { label: 'Vedic Heritage Portal: Introduction', url: 'https://vedicheritage.gov.in/introduction/', use: 'Institutional orientation to Vedic transmission and textual categories' },
      { label: 'Vedic Heritage Portal: Saṃhitās', url: 'https://vedicheritage.gov.in/samhitas/', use: 'Textual organization and Vedic affiliations' },
      { label: 'IEP: Upaniṣads and Vedic layers', url: 'https://iep.utm.edu/upanisad/', use: 'Academic context for the transition from ritual exegesis to Upaniṣadic inquiry' },
    ],
    lessons: [
      { id: 'rigveda-hymns', title: 'Ṛgveda: Praise, Dialogue, and Speculation', texts: 'Selected hymns including Ṛgveda 1.164, 10.90, 10.125, and 10.129', question: 'How can praise poetry also investigate language, society, and creation?', insight: 'The Ṛgveda is a multivocal anthology; its hymns do not present one systematic creed.', minutes: 14 },
      { id: 'samaveda-song', title: 'Sāmaveda: A Text Made to Be Heard', texts: 'Sāmaveda song collections and selected Ṛgvedic source verses', question: 'What changes when a verse becomes a scored ritual performance?', insight: 'Vedic meaning depends on melody, accent, sequence, and specialist performance as well as words.' },
      { id: 'yajurveda-ritual', title: 'Yajurveda and the Architecture of Sacrifice', texts: 'Vājasaneyi and Taittirīya Saṃhitā selections; Śrautasūtra examples', question: 'How do formula, gesture, object, and officiant jointly produce ritual order?', insight: 'Yajurvedic traditions coordinate speech and action; the mantra alone is not the complete rite.' },
      { id: 'atharvaveda-life', title: 'Atharvaveda: Household, Healing, and Kingship', texts: 'Selections on illness, protection, reconciliation, royal power, and cosmology', question: 'Whose anxieties and aspirations count as Vedic concerns?', insight: 'The Atharvaveda expands the archive beyond grand sacrifice into domestic, political, and therapeutic life.' },
      { id: 'brahmanas-exegesis', title: 'Brāhmaṇas: Why Does the Rite Work?', texts: 'Śatapatha, Aitareya, and Jaiminīya Brāhmaṇa selections', question: 'How do narrative analogy and etymology explain ritual efficacy?', insight: 'Brāhmaṇa prose is argumentative ritual exegesis, not merely a procedural manual.' },
      { id: 'aranyakas-reframing', title: 'Āraṇyakas: Reframing the Ritual', texts: 'Non-Upaniṣadic selections from Aitareya, Taittirīya, and Kauṣītaki Āraṇyakas', question: 'What happens when sacrifice is reimagined through body, breath, and contemplation?', insight: 'Āraṇyakas continue and transform ritual reasoning; they are not a simple rejection of ritual.' },
      { id: 'vedangas-sutras', title: 'Vedāṅgas and Domestic Sūtras', texts: 'Śikṣā, Chandas, Nirukta, Kalpa, Jyotiṣa; Gṛhya and early Dharma sūtra samples', question: 'What technical disciplines keep an oral corpus usable across generations?', insight: 'Phonetics, meter, interpretation, calendrics, and household procedure helped constitute Vedic tradition.' },
    ],
  },
  {
    id: 'epic-worlds', order: 3, shortTitle: 'Epics and Gītā', title: 'Epics as Arguments: Rāmāyaṇa, Mahābhārata, and Gītā', eyebrow: 'COURSE 3 · EPIC WORLDS', tone: 'rose',
    description: 'Layered debates over kinship, kingship, violence, gender, and dharma—and the communities that keep remaking them.',
    promise: 'Read narrative conflict before extracting moral slogans, and keep critical editions, living variants, commentary, and modern appropriation distinct.',
    guardrails: [
      { name: 'Textual-growth lens', reading: 'The epics grew through recensions, interpolation, and performance; a critical edition is a scholarly reconstruction, not the only real epic.' },
      { name: 'Ethical-conflict lens', reading: 'Dharma becomes difficult when legitimate obligations collide; character action should not automatically become universal command.' },
      { name: 'Reception lens', reading: 'Regional retellings and commentaries make new arguments rather than merely translating a fixed original.' },
    ],
    sources: [
      { label: 'UCLA MANAS: Rāmāyaṇa', url: 'https://southasia.ucla.edu/culture/literature/ramayana/', use: 'Orientation to textual growth and cultural reception' },
      { label: 'Harvard South Asia Institute: Many Mahābhāratas', url: 'https://mittalsouthasiainstitute.harvard.edu/2021/11/mahabharatas/', use: 'Scholarly discussion of epic plurality' },
      { label: 'IEP: Bhagavad Gītā', url: 'https://iep.utm.edu/bhagavad-gita/', use: 'Academic overview of the dialogue and major interpretive problems' },
      { label: 'Oxford archive: spread of the Rāma narrative', url: 'https://ora.ox.ac.uk/objects/uuid%3A8df9647a-8002-45ff-b37e-7effb669768b', use: 'Research on narrative development and circulation' },
    ],
    lessons: [
      { id: 'epic-texts', title: 'What Is an Epic Text?', texts: 'Rāmāyaṇa and Mahābhārata frames; critical-edition examples', question: 'Is a critical edition the original, the best version, or a scholarly reconstruction?', insight: 'The epics grew through recensions and performance; a reconstructed archetype does not invalidate living variants.' },
      { id: 'ramayana-exile', title: 'Rāmāyaṇa: Exile and Competing Duties', texts: 'Ayodhyā and Araṇya Kāṇḍa clusters', question: 'What should happen when royal, filial, marital, and personal obligations collide?', insight: 'The narrative generates moral conflict rather than supplying one frictionless model of dharma.' },
      { id: 'ramayana-war', title: 'Rāmāyaṇa: War, Sītā, and the Cost of Kingship', texts: 'Yuddha and Uttara Kāṇḍa clusters', question: 'Whose suffering makes exemplary kingship possible?', insight: 'Gender, public reputation, and royal authority make the epic’s ending ethically contested.' },
      { id: 'many-ramayanas', title: 'Many Rāmāyaṇas', texts: 'Kampaṉ, Tulsīdās, Jain and Buddhist tellings, performance and folk-song samples', question: 'When does translation become a new argument about the story?', insight: 'Regional and sectarian tellings change plot, character, theology, and moral emphasis rather than merely changing language.' },
      { id: 'mahabharata-war', title: 'Mahābhārata: Dice, Exile, and Catastrophic War', texts: 'Sabhā, Vana, Udyoga, Bhīṣma, and Strī Parvan clusters', question: 'Can a war pursued as justice remain just?', insight: 'The epic repeatedly exposes dharma as subtle, contextual, and damaged by power.' },
      { id: 'mahabharata-aftermath', title: 'After Victory: Rule, Renunciation, and Grief', texts: 'Śānti, Anuśāsana, and Mokṣadharma selections', question: 'Why does the epic answer victory with debates about governance and escape?', insight: 'Narrative aftermath becomes a forum for competing normative programs; later didactic layers must be distinguished from the war story.' },
      { id: 'gita-afterlives', title: 'Bhagavad Gītā and Its Afterlives', texts: 'Gītā; Śaṅkara, Rāmānuja, Madhva; Tilak, Gandhi, and Aurobindo selections', question: 'How can one act fully without being possessed by action’s results?', insight: 'The base dialogue coordinates action, knowledge, and devotion, while commentaries and modern appropriations make distinct arguments.', minutes: 16 },
    ],
  },
  {
    id: 'puranic-devotional', order: 4, shortTitle: 'Purāṇa and bhakti', title: 'Purāṇic and Devotional Constellations', eyebrow: 'COURSE 4 · NARRATIVE THEOLOGIES', tone: 'leaf',
    description: 'Narrative theology across Sanskrit Purāṇas, regional poetry, ritual, performance, and distinct devotional publics.',
    promise: 'Follow how texts become living worlds without flattening Vaiṣṇava, Śaiva, Goddess, Tamil, and regional traditions into one generic bhakti story.',
    guardrails: [
      { name: 'Genre lens', reading: 'Purāṇa, Āgama, lyric, hagiography, ritual manual, and performance are related but different textual forms.' },
      { name: 'Sectarian-plurality lens', reading: 'Devotional traditions share stories and practices while sustaining real theological and institutional differences.' },
      { name: 'Reception lens', reading: 'Manuscript, commentary, pilgrimage, performance, print, and screen adaptation are separate stages of textual life.' },
    ],
    sources: [
      { label: 'UCLA MANAS: Purāṇas', url: 'https://southasia.ucla.edu/religions/texts/puranas/', use: 'Overview of Purāṇic genre and cultural function' },
      { label: 'Oxford Centre for Hindu Studies: Purāṇas', url: 'https://ochsonline.org/course/puranas/', use: 'Scholarly orientation to the layered corpora' },
      { label: 'OCHS: Bhāgavata Purāṇa Research Project', url: 'https://ochs.org.uk/bhagavata-purana-research-project/', use: 'Current research resources on a major Vaiṣṇava text' },
      { label: 'Sahapedia: Bhakti and Sufi traditions', url: 'https://www.sahapedia.org/bhakti-sufi-traditions', use: 'Public humanities context for regional devotional networks' },
    ],
    lessons: [
      { id: 'purana-genre', title: 'How a Purāṇa Works', texts: 'Selections on creation, dissolution, genealogy, cosmic periods, and sacred places', question: 'What holds together texts that continually absorb new material?', insight: 'Purāṇas are layered, revisable genres with sectarian and regional recensions—not eighteen uniform books.' },
      { id: 'vaishnava-puranas', title: 'Vaiṣṇava Narrative Theologies', texts: 'Harivaṃśa, Viṣṇu Purāṇa, and Bhāgavata Purāṇa selections', question: 'How does an avatāra narrative turn cosmic order into intimate devotion?', insight: 'Kṛṣṇa and other avatāra traditions develop differently across epic appendices, Purāṇas, commentaries, and performance.' },
      { id: 'shaiva-worlds', title: 'Śaiva Worlds and Adjacent Āgamas', texts: 'Śiva, Liṅga, and Skanda Purāṇas; selected Śaiva Āgamic passages', question: 'How do story, theology, ritual prescription, and sacred place reinforce one another?', insight: 'Purāṇas and Āgamas are related but distinct genres; neither directly records all temple practice.' },
      { id: 'goddess-worlds', title: 'The Goddess as Supreme', texts: 'Devī Māhātmya and Devī Bhāgavata Purāṇa selections', question: 'How does a narrative corpus make feminine power the ground of the cosmos?', insight: 'Goddess traditions contain distinct theological formations and cannot be reduced to one generic cult.' },
      { id: 'tamil-devotion', title: 'Tamil Devotional Canons', texts: 'Tēvāram, Nālāyira Divya Prabandham, and Āṇṭāḷ', question: 'What changes when devotion speaks through Tamil place, body, and lyric voice?', insight: 'Tamil Śaiva and Vaiṣṇava corpora formed separate canons and institutions while interacting with Sanskrit traditions.' },
      { id: 'regional-bhakti', title: 'Regional Bhakti Networks', texts: 'Jayadeva, Kabīr, Sūrdās, Mīrābāī, Tukārām, and Caitanya hagiography', question: 'Was bhakti one movement, or many partially connected regional projects?', insight: 'Devotional poetry varies by language, sect, caste, gender, patronage, and theology; the label “movement” can conceal difference.' },
      { id: 'text-performance', title: 'Text in Performance and Public Memory', texts: 'Kathā, recitation, pilgrimage, dance, painting, print, and screen adaptations', question: 'Where does a text end when audiences continually perform and remake it?', insight: 'Reception is productive history; manuscript, commentary, ritual, performance, and mass media should be tracked separately.' },
    ],
  },
  {
    id: 'darsanas-dissent', order: 5, shortTitle: 'Philosophies', title: 'Darśanas and Dissent: Reasoning Across Schools', eyebrow: 'COURSE 5 · PHILOSOPHICAL DEBATE', tone: 'indigo',
    description: 'Six conventional Veda-recognizing systems alongside materialist, skeptical, and other critics in a shared culture of debate.',
    promise: 'Learn positions through their arguments, opponents, sūtras, and commentaries—not through a tidy six-box chart.',
    guardrails: [
      { name: 'Debate lens', reading: 'Indian philosophical works develop intertextually; a school’s account of its opponent must be checked against the opponent’s own sources.' },
      { name: 'Text-and-commentary lens', reading: 'Aphoristic sūtra and later bhāṣya may be separated by centuries and should never be silently fused.' },
      { name: 'Category lens', reading: 'Āstika here means Veda-recognizing, not simply theistic; nāstika does not name one unified atheist school.' },
    ],
    sources: [
      { label: 'IEP: Hindu Philosophy', url: 'https://iep.utm.edu/hindu-ph/', use: 'Academic map of major schools and categories' },
      { label: 'IEP: Yoga', url: 'https://iep.utm.edu/yoga/', use: 'Classical Yoga text and philosophical context' },
      { label: 'IEP: Lokāyata / Cārvāka', url: 'https://iep.utm.edu/indmat/', use: 'Evidence and reconstruction problems for materialist traditions' },
      { label: 'SEP: Analytic philosophy in early modern India', url: 'https://plato.stanford.edu/entries/early-modern-india/', use: 'Later debate, Navya-Nyāya, and intellectual method' },
    ],
    lessons: [
      { id: 'sutra-debate', title: 'The Shared Arena: Sūtra, Commentary, and Debate', texts: 'Sūtra–bhāṣya examples; pramāṇa and debate taxonomies', question: 'Why do philosophical schools devote so much space to opponents?', insight: 'Indian philosophy developed intertextually; āstika here means Veda-recognizing, not simply “theistic.”' },
      { id: 'nyaya-vaisheshika', title: 'Nyāya and Vaiśeṣika', texts: 'Nyāyasūtra, Vaiśeṣikasūtra, Praśastapāda, and later Navya-Nyāya samples', question: 'What makes a cognition trustworthy, and what kinds of things exist?', insight: 'Nyāya foregrounds knowledge and argument; Vaiśeṣika foregrounds categories and ontology, with later traditions converging.' },
      { id: 'samkhya', title: 'Sāṃkhya', texts: 'Īśvarakṛṣṇa’s Sāṃkhyakārikā and commentarial samples', question: 'How can discriminating awareness from material nature end suffering?', insight: 'Sāṃkhya explains experience through plural consciousnesses and evolving prakṛti without requiring a creator god.' },
      { id: 'classical-yoga', title: 'Classical Yoga', texts: 'Pātañjalayogaśāstra: Yoga Sūtra with Bhāṣya', question: 'Can disciplined attention stop the processes that bind awareness?', insight: 'Classical Yoga shares Sāṃkhya’s framework but adds a detailed psychology of practice; it is not identical with later Haṭha or global posture yoga.' },
      { id: 'mimamsa', title: 'Pūrva Mīmāṃsā', texts: 'Mīmāṃsāsūtra, Śabara, Kumārila, and Prabhākara selections', question: 'How can language disclose a duty that perception cannot?', insight: 'Mīmāṃsā joins ritual hermeneutics to major theories of language, knowledge, action, and Vedic authority.' },
      { id: 'vedanta-schools', title: 'Vedānta After the Upaniṣad Course', texts: 'Brahmasūtra; Śaṅkara, Rāmānuja, and Madhva commentarial clusters', question: 'How can one aphoristic base support nondual, qualified-nondual, and dualist systems?', insight: 'Vedānta is a contested commentarial field, not one doctrine; root text and later schools must remain distinct.' },
      { id: 'materialists-skeptics', title: 'Materialists, Skeptics, and Lost Voices', texts: 'Cārvāka fragments; Jayarāśi; reports on Ajñāna and Ājīvika currents', question: 'How do we reconstruct a position preserved mainly by its opponents?', insight: 'Materialist and skeptical evidence is fragmentary and often hostile; dissenting currents were diverse rather than one atheist canon.' },
    ],
  },
  {
    id: 'buddhist-libraries', order: 6, shortTitle: 'Buddhist libraries', title: 'Buddhist Libraries of India', eyebrow: 'COURSE 6 · BUDDHIST TEXTUAL WORLDS', tone: 'saffron',
    description: 'Early discourses and monastic law, Abhidharma, Mahāyāna sūtras, and major Indian philosophical debates.',
    promise: 'Move across Pāli, Sanskrit, Chinese, and Tibetan witnesses without treating one surviving collection as the whole Buddhist canon.',
    guardrails: [
      { name: 'Canon-plurality lens', reading: 'Pāli Nikāyas, Chinese Āgamas, Sanskrit fragments, and Tibetan witnesses preserve overlapping but non-identical libraries.' },
      { name: 'Historical-development lens', reading: 'Early Buddhism, Abhidharma, Mahāyāna, and later philosophy overlap historically; one did not simply replace another overnight.' },
      { name: 'Practice lens', reading: 'Doctrinal claims appear within monastic, ethical, contemplative, scholastic, and ritual contexts that should remain visible.' },
    ],
    sources: [
      { label: 'SuttaCentral: Early texts and parallels', url: 'https://suttacentral.net/introduction', use: 'Open access to early Buddhist texts and parallel collections' },
      { label: 'SEP: Madhyamaka', url: 'https://plato.stanford.edu/entries/madhyamaka/', use: 'Academic overview of Nāgārjuna and later Madhyamaka debate' },
      { label: 'SEP: Yogācāra', url: 'https://plato.stanford.edu/entries/yogacara/', use: 'Academic overview of Yogācāra texts and contested interpretations' },
      { label: '84000: Kangyur and Tengyur', url: 'https://scholar.84000.co/article/facts-and-figures-about-the-kangyur-and-tengyur', use: 'Orientation to Tibetan canonical collections' },
    ],
    lessons: [
      { id: 'buddhist-canons', title: 'No Single Buddhist Canon', texts: 'Pāli Nikāyas, parallel Āgamas, Sanskrit fragments, Chinese and Tibetan witnesses', question: 'Why do related teachings survive in several languages and collections?', insight: 'Pāli is one crucial transmission, not the language of all early Buddhism; comparison across canons reveals plurality.' },
      { id: 'discourses-vinaya', title: 'Early Discourses and Discipline', texts: 'Suttanipāta, Dhammapada, Nikāya/Āgama parallels, and Vinaya case clusters', question: 'How do dialogue and case law turn teachings into paths and communities?', insight: 'Doctrine and discipline are contextual; Vinaya prescriptions are not a complete record of monastic life.' },
      { id: 'abhidharma', title: 'Abhidharma: Mapping Experience', texts: 'Dhammasaṅgaṇī, Kathāvatthu, and Vasubandhu’s Abhidharmakośabhāṣya', question: 'What is gained—and disputed—when experience is decomposed into precise categories?', insight: 'Abhidharma produced competing scholastic systems; Vasubandhu both preserves and critiques them.' },
      { id: 'mahayana-sutras', title: 'Mahāyāna Sūtra Constellations', texts: 'Prajñāpāramitā, Lotus, Vimalakīrti, Pure Land, Avataṃsaka, and tathāgatagarbha samples', question: 'How do new sūtra families expand buddhahood, the bodhisattva path, and authority?', insight: 'Mahāyāna is a plurality of textual projects, not one moment that simply replaced earlier Buddhism.' },
      { id: 'madhyamaka', title: 'Madhyamaka', texts: 'Nāgārjuna’s Mūlamadhyamakakārikā and Vigrahavyāvartanī; Āryadeva and Candrakīrti', question: 'How can emptiness avoid both eternalism and nihilism?', insight: 'Emptiness means absence of independent nature and is argued through dependent arising—not that nothing exists conventionally.' },
      { id: 'yogacara', title: 'Yogācāra', texts: 'Saṃdhinirmocana, Asaṅga’s Mahāyānasaṃgraha, Vasubandhu’s Viṃśikā and Triṃśikā', question: 'How do habits of consciousness construct the world we experience?', insight: 'Yogācāra offers contested models of cognition, store consciousness, and three natures; calling it simply “idealism” is insufficient.' },
      { id: 'buddhist-reason-compassion', title: 'Knowledge and Bodhisattva Practice', texts: 'Dignāga, Dharmakīrti, and Śāntideva’s Bodhicaryāvatāra', question: 'How are valid reasoning and compassionate formation made accountable practices?', insight: 'Later Indian Buddhist thought joins rigorous epistemology with disciplined ethical and contemplative transformation.' },
    ],
  },
  {
    id: 'jain-libraries', order: 7, shortTitle: 'Jain libraries', title: 'Jain Libraries: Canon, Conduct, and Many-Sided Knowing', eyebrow: 'COURSE 7 · JAIN TEXTUAL WORLDS', tone: 'leaf',
    description: 'Distinct Śvetāmbara and Digambara libraries on nonviolence, narrative, karma, liberation, and philosophical pluralism.',
    promise: 'Learn how disagreement about what was lost shaped different canons while shared ethical and philosophical problems continued across sectarian lines.',
    guardrails: [
      { name: 'Sectarian-history lens', reading: 'Śvetāmbara and Digambara communities preserve different authoritative corpora and accounts of transmission.' },
      { name: 'Norm-and-life lens', reading: 'Mendicant and lay prescriptions articulate graded ideals; they do not describe every Jain life without remainder.' },
      { name: 'Standpoint lens', reading: 'Anekāntavāda and syādvāda discipline claims by standpoint and condition; they are not unrestricted relativism.' },
    ],
    sources: [
      { label: 'JAINpedia: Sacred writings', url: 'https://jainpedia.org/themes/principles/sacred-writings/', use: 'Overview of Jain canons and transmission differences' },
      { label: 'JAINpedia: Śvetāmbara Aṅgas', url: 'https://jainpedia.org/themes/principles/sacred-writings/svetambara-canon/angas/', use: 'Detailed guide to a major canonical division' },
      { label: 'SEP: Jaina Philosophy', url: 'https://plato.stanford.edu/entries/jaina-philosophy/', use: 'Academic orientation to ontology, knowledge, and many-sidedness' },
      { label: 'IEP: Jain Philosophy', url: 'https://iep.utm.edu/jain/', use: 'Public academic overview and bibliography' },
    ],
    lessons: [
      { id: 'jain-canons', title: 'Āgamas and Sectarian Canons', texts: 'Ācārāṅga, Sūtrakṛtāṅga, Uttarādhyayana, Bhagavatī; Ṣaṭkhaṇḍāgama and Kaṣāyapāhuḍa', question: 'What counts as scripture when communities disagree about what was lost?', insight: 'Śvetāmbaras and Digambaras preserve different authoritative corpora and different accounts of transmission.' },
      { id: 'jain-ethics', title: 'Renunciant and Lay Ethics', texts: 'Ācārāṅga, Uttarādhyayana, Ratnakaraṇḍa Śrāvakācāra, and Hemacandra’s Yogaśāstra', question: 'How can nonviolence guide lives with radically different capacities and obligations?', insight: 'Great and limited vows distinguish mendicant from lay discipline; normative ideals do not describe every Jain’s lived practice.' },
      { id: 'jain-narratives', title: 'Narrative as Ethical Counterworld', texts: 'Kalpasūtra, Paumacariya, and Triṣaṣṭiśalākāpuruṣacaritra', question: 'How can retelling a shared epic redefine heroism and violence?', insight: 'Jain narrative teaches through exemplary lives and rewrites pan-Indian stories from distinct ethical standpoints.' },
      { id: 'tattvarthasutra', title: 'Tattvārthasūtra: A Shared Systematic Map', texts: 'Tattvārthasūtra with Śvetāmbara and Digambara commentarial samples', question: 'How do soul, karmic matter, knowledge, conduct, and cosmos form one path?', insight: 'The text is authoritative across major sects, but versions and commentaries preserve real differences.' },
      { id: 'kundakunda', title: 'Kundakunda and the Standpoint of the Self', texts: 'Samayasāra and Pravacanasāra; Pūjyapāda’s Sarvārthasiddhi', question: 'How do conventional and ultimate standpoints alter what can be said about the self?', insight: 'Digambara traditions distinguish levels of description without making ethical conduct irrelevant.' },
      { id: 'anekantavada', title: 'Anekāntavāda and Conditional Predication', texts: 'Siddhasena, Akalaṅka, Haribhadra, and Hemacandra selections', question: 'Does many-sidedness imply that every claim is equally true?', insight: 'Naya and syādvāda discipline claims by standpoint and condition; they are not unrestricted relativism.' },
    ],
  },
  {
    id: 'dharma-artha-kama', order: 8, shortTitle: 'Norms and power', title: 'Dharma, Artha, and Kāma: Norms, Power, and Pleasure', eyebrow: 'COURSE 8 · SOCIAL THOUGHT', tone: 'rose',
    description: 'Competing textual sciences of obligation, government, and cultivated enjoyment—without treating prescription as social fact.',
    promise: 'Compare what texts authorize with commentary, custom, institutions, and the historical lives they cannot fully document.',
    guardrails: [
      { name: 'Normative-text lens', reading: 'Dharma, artha, and kāma treatises prescribe, rank, and debate ideals; they are not transparent social surveys.' },
      { name: 'Historical-layer lens', reading: 'Root text, commentary, regional usage, court practice, and colonial legal reception must remain separate.' },
      { name: 'Power lens', reading: 'Caste, gender, household, kingship, punishment, and elite leisure require explicit ethical and historical scrutiny.' },
    ],
    sources: [
      { label: 'St Andrews: Dharmaśāstra', url: 'https://www.saet.ac.uk/Hinduism/LawandReligioninBrahmanism', use: 'Academic overview of law, religion, and textual authority' },
      { label: 'IEP: Hindu philosophy and puruṣārthas', url: 'https://iep.utm.edu/hindu-ph/', use: 'Context for the human-goal framework' },
      { label: 'UCLA MANAS: Kauṭilya and Arthaśāstra', url: 'https://southasia.ucla.edu/history-politics/ancient-india/kautilya-and-arthashastra/', use: 'Historical orientation to polity and the treatise' },
      { label: 'Columbia: Kāma reading overview', url: 'https://indiantraditions.columbia.edu/1_10_kama.html', use: 'Teaching context for pleasure, genre, and elite life' },
    ],
    lessons: [
      { id: 'purusharthas', title: 'The Puruṣārtha Problem', texts: 'Mahābhārata and Kāmasūtra frames; later summaries of dharma, artha, kāma, and mokṣa', question: 'Can legitimate human goals conflict without one erasing the others?', insight: 'The four-goal scheme is a debated heuristic, not a timeless consensus shared identically by every tradition.' },
      { id: 'dharmasutras', title: 'Dharmasūtras: School, Custom, and Household', texts: 'Āpastamba, Gautama, Baudhāyana, and Vasiṣṭha Dharmasūtras', question: 'How do early normative authors negotiate Vedic authority and recognized custom?', insight: 'The sūtras preserve disagreement and school-specific ideals rather than one uniform legal code.' },
      { id: 'dharmashastra', title: 'Dharmaśāstra and Social Order', texts: 'Manusmṛti, Yājñavalkyasmṛti, and Nāradasmṛti selections', question: 'Whose social world do these texts prescribe and authorize?', insight: 'These are normative interventions into caste, gender, household, kingship, and adjudication—not transparent descriptions of everyday history.' },
      { id: 'dharma-reception', title: 'Commentary, Custom, and Colonial Reception', texts: 'Medhātithi, Mitākṣarā, Dāyabhāga, regional digests, and colonial legal excerpts', question: 'How does interpretation turn an old text into a new legal authority?', insight: 'Root text, commentary, regional usage, court practice, and colonial “Hindu law” are distinct historical layers.' },
      { id: 'arthashastra-niti', title: 'Arthaśāstra and Nīti', texts: 'Kauṭilīya Arthaśāstra, Pañcatantra, and Kāmandakīya Nītisāra', question: 'How do administration, diplomacy, coercion, and practical wisdom relate to moral order?', insight: 'The Arthaśāstra is a layered normative treatise, not a documentary handbook of one Mauryan government.' },
      { id: 'kamasutra', title: 'Kāmasūtra and the Educated Urban Life', texts: 'Vātsyāyana’s Kāmasūtra and selected later kāma commentaries', question: 'How are pleasure, courtship, social skill, gender, and power made teachable?', insight: 'The Kāmasūtra is broader than sexual technique, while its elite assumptions require historical and ethical critique.' },
    ],
  },
  {
    id: 'technical-shastras', order: 9, shortTitle: 'Technical śāstras', title: 'Technical Śāstras: Language, Medicine, Number, and Art', eyebrow: 'COURSE 9 · KNOWLEDGE DISCIPLINES', tone: 'indigo',
    description: 'Disciplined knowledge-making without dismissal as superstition or triumphalist equation with modern science.',
    promise: 'Study historical systems on their own terms, then compare evidence, method, pedagogy, material practice, and modern claims carefully.',
    guardrails: [
      { name: 'Historical-science lens', reading: 'Premodern categories and explanations should not be mocked or relabeled as modern science without evidence.' },
      { name: 'Text-practice lens', reading: 'A written rule system may prescribe, summarize, or idealize workshop and clinical practice rather than documenting it directly.' },
      { name: 'Commentary lens', reading: 'Compact root texts rely on oral pedagogy, metarules, examples, and commentarial traditions for their operation.' },
    ],
    sources: [
      { label: 'SEP: Language and testimony in India', url: 'https://plato.stanford.edu/entries/language-india/', use: 'Academic guide to grammar, language, meaning, and testimony' },
      { label: 'Delhi AYUSH: Ayurveda overview', url: 'https://ayush.delhi.gov.in/ayush/ayurveda', use: 'Institutional orientation to major classical compendia' },
      { label: 'St Andrews: Indian mathematics', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Indian_mathematics/', use: 'Historical overview of mathematical traditions' },
      { label: 'INFLIBNET: Nāṭyaśāstra', url: 'https://ebooks.inflibnet.ac.in/icp05/chapter/na%E1%B9%ADyasastra/', use: 'Public academic introduction to performance theory' },
    ],
    lessons: [
      { id: 'paninian-grammar', title: 'Grammar as a Generative System', texts: 'Pāṇini’s Aṣṭādhyāyī, Kātyāyana’s Vārttikas, and Patañjali’s Mahābhāṣya', question: 'How can a compact rule system generate and evaluate linguistic forms?', insight: 'Pāṇinian grammar is inseparable from metarules, oral pedagogy, and an expanding commentarial tradition.' },
      { id: 'language-poetics', title: 'Meaning, Sentence, and Poetic Suggestion', texts: 'Bhartṛhari’s Vākyapadīya, Ānandavardhana’s Dhvanyāloka, and Abhinavagupta', question: 'Does meaning reside in words, sentences, speakers, or what a poem suggests?', insight: 'Grammar, philosophy of language, and poetics share arguments rather than forming sealed disciplines.' },
      { id: 'classical-medicine', title: 'Classical Medicine', texts: 'Caraka Saṃhitā, Suśruta Saṃhitā, and Vāgbhaṭa’s Aṣṭāṅgahṛdaya', question: 'How do theory, observation, regimen, diagnosis, and intervention form a medical system?', insight: 'These evolving corpora combine empirical practice and premodern theory; they are historical sources, not modern clinical guidance.', minutes: 15 },
      { id: 'mathematics-astronomy', title: 'Mathematics and Astronomy', texts: 'Śulbasūtras, Āryabhaṭīya, Brahmasphuṭasiddhānta, and Līlāvatī', question: 'Why encode algorithms and astronomical models in compressed verse?', insight: 'Calculation developed through ritual geometry, calendrics, astronomy, commentary, and teaching—not a modern discipline called STEM.' },
      { id: 'architecture-workshops', title: 'Architecture and Workshop Knowledge', texts: 'Mānasāra, Mayamata, Samarāṅgaṇasūtradhāra, and Viṣṇudharmottara selections', question: 'How do textual proportions relate to buildings and objects made by workshops?', insight: 'Vāstu and śilpa texts prescribe ideal systems; surviving material practice may adapt, ignore, or predate those rules.' },
      { id: 'performance-rasa', title: 'Performance and Rasa', texts: 'Nāṭyaśāstra, Abhinavabhāratī, and Daśarūpaka', question: 'How do staged cues produce an aesthetic experience shared by an audience?', insight: 'Rasa theory centers transformed audience experience, and later commentary substantially reframes the root treatise.' },
      { id: 'encyclopedic-knowledge', title: 'Encyclopedic Knowledge', texts: 'Varāhamihira’s Bṛhatsaṃhitā, Mānasollāsa, and horticultural or animal-care treatises', question: 'Why do weather, astronomy, omens, plants, animals, cuisine, and arts appear together?', insight: 'Premodern classifications crossed modern disciplinary boundaries; textual presence does not prove universal practice.' },
    ],
  },
  {
    id: 'regional-literatures', order: 10, shortTitle: 'Regional classics', title: 'Tamil and Multilingual Literary Worlds', eyebrow: 'COURSE 10 · LANGUAGE ECOLOGIES', tone: 'leaf',
    description: 'Literary languages as interacting ecologies—never simple containers for one religion, ethnicity, or modern region.',
    promise: 'Move from Old Tamil poetics through southern, northern, eastern, Persianate, Sikh, and multilingual crossings without turning language into religious identity.',
    guardrails: [
      { name: 'Language-is-not-religion lens', reading: 'Every major literary language carries works from multiple communities, genres, courts, and social locations.' },
      { name: 'Boundary lens', reading: 'Modern language and state borders cannot be projected unchanged onto premodern manuscript, pilgrimage, and performance routes.' },
      { name: 'Translation lens', reading: 'Retelling and translation can create new canon, audience, theology, and political meaning rather than secondary copies.' },
    ],
    sources: [
      { label: 'Murty Classical Library of India', url: 'https://www.murtylibrary.com/', use: 'Multilingual editions and translations across Indian literary traditions' },
      { label: 'Harvard: India’s multilingual classics', url: 'https://news.harvard.edu/gazette/story/2010/04/murty-classical-library-of-india-series-established/', use: 'Orientation to the multilingual archive' },
      { label: 'IGNOU: Sangam and post-Sangam literature', url: 'https://egyankosh.ac.in/bitstream/123456789/103487/1/Block-3.pdf', use: 'Open educational overview of Old Tamil literature' },
      { label: 'Sahapedia: Bhakti and Sufi traditions', url: 'https://www.sahapedia.org/bhakti-sufi-traditions', use: 'Public humanities material on regional literary networks' },
    ],
    lessons: [
      { id: 'old-tamil-poetics', title: 'Old Tamil Poetics and Anthologies', texts: 'Tolkāppiyam, Eṭṭuttokai, and Pattuppāṭṭu', question: 'How do akam, puṟam, and tiṇai connect emotion, action, and landscape?', insight: 'Classical Tamil formed a mature literary system parallel to, and interacting with, Sanskrit traditions.' },
      { id: 'tamil-ethics-epics', title: 'Tamil Ethics and Multi-Religious Epics', texts: 'Tirukkuṟaḷ, Cilappatikāram, Maṇimēkalai, and Cīvaka Cintāmaṇi', question: 'How can one language sustain texts associated with Jain, Buddhist, and other ethical worlds?', insight: 'Language is not religion; authorship, dating, and sectarian attribution must be evaluated text by text.' },
      { id: 'tamil-devotion-epic', title: 'Tamil Devotion and Epic Reinvention', texts: 'Tēvāram, Divya Prabandham, Periyapurāṇam, and Kampaṉ’s Irāmāvatāram', question: 'How does Tamilization create new scripture, place, and literary authority?', insight: 'These works are new canons and arguments, not secondary copies of Sanskrit originals.' },
      { id: 'southern-cosmopolitanisms', title: 'Kannada, Telugu, and Malayalam Cosmopolitanisms', texts: 'Kavirājamārga and Pampa; Vachanas; Andhra Mahābhāratamu, Pōtana; Maṇipravāḷam and Eḻuttacchan', question: 'How do courts, mendicants, devotees, and translators build distinct southern classics?', insight: 'Each language hosts multiple religious and political projects while adapting Sanskrit, Prakrit, and local forms.' },
      { id: 'northern-vernaculars', title: 'Western and Northern Vernacular Publics', texts: 'Jñāneśvarī, Tukārām, Narsinh Mehta, Kabīr, Sūrdās, Mīrābāī, and Rāmcaritmānas', question: 'When does vernacular authorship create a new audience and authority?', insight: 'Marathi, Gujarati, Braj, and Awadhi works differ in theology, social location, genre, and reception despite a shared bhakti label.' },
      { id: 'eastern-routes', title: 'Eastern Routes and Retellings', texts: 'Caryāpadas, Vidyāpati, Kṛttivāsī Rāmāyaṇa, Maṅgalkāvyas, Sarala Mahābhārata, and Śaṅkaradeva', question: 'How do texts travel across Bengali, Maithili, Odia, Assamese, and shifting regional borders?', insight: 'Modern language and state boundaries cannot be projected unchanged onto premodern manuscript circulation.' },
      { id: 'multilingual-crossings', title: 'Persianate, Sikh, and Other Multilingual Crossings', texts: 'Amīr Khusrau, Razmnāma, Dārā Shikōh, Guru Granth Sahib, Bulleh Shah, Waris Shah, and selected Kashmiri or Sindhi poetry', question: 'What becomes visible when Persian, Sanskritic, Punjabi, Hindavi, Sindhi, and Kashmiri worlds are studied together?', insight: 'No major Indian literary language belongs to one religion; translation, shared genres, and multilingual authorship reshape every boundary.' },
    ],
  },
]

export const widerSections: CourseSection[] = sectionSeeds.map(({ guardrails: _guardrails, sources: _sources, lessons: _lessons, ...section }) => section)

export const widerLessons: CourseLesson[] = sectionSeeds.flatMap((section) =>
  section.lessons.map((lesson, index) => ({
    id: lesson.id,
    sectionId: section.id,
    order: index + 1,
    title: lesson.title,
    plainTitle: lesson.title,
    veda: section.shortTitle,
    form: 'Guided text cluster',
    question: lesson.question,
    insight: lesson.insight,
    status: 'available' as const,
    minutes: lesson.minutes ?? 12,
    references: [lesson.texts],
  })),
)

function createLessonDetail(section: WiderSectionSeed, lesson: WiderLessonSeed): LessonDetail {
  return {
    id: lesson.id,
    locate: {
      corpus: `South Asian textual worlds → ${section.title} → ${lesson.title}`,
      placement: `This lesson studies a curated cluster: ${lesson.texts}.`,
      context: section.promise,
    },
    read: {
      anchorLabel: 'Text cluster',
      anchor: lesson.texts,
      paraphrase: `${lesson.insight} The guiding question is: ${lesson.question}`,
      readingNote: 'This is a course orientation, not a translation. Treat each root text, recension, commentary, performance, and modern interpretation as a distinct historical layer; follow the linked sources before making passage-level claims.',
    },
    concepts: [
      { term: 'Guiding question', meaning: lesson.question },
      { term: 'Crucial learning', meaning: lesson.insight },
      { term: 'Source boundary', meaning: `The cluster includes ${lesson.texts}. Similar titles or later retellings should not be silently merged.` },
    ],
    lenses: section.guardrails,
    reflection: `${lesson.question} Write a provisional answer, then name which text or historical layer you would need to inspect before trusting it.`,
    quiz: {
      question: `Which takeaway best fits “${lesson.title}”?`,
      choices: [
        lesson.insight,
        'All works in the cluster teach one identical doctrine in the same historical setting.',
        'Later commentary can be read as though it were part of the earliest recoverable base text.',
        'A prescriptive text directly records how every community actually lived.',
      ],
      correct: 0,
      explanation: `${lesson.insight} The other choices erase textual plurality, historical layers, or the difference between prescription and lived history.`,
    },
    sourceLinks: section.sources.map(({ label, url }) => ({ label, url })),
  }
}

export const widerLessonDetails: Record<string, LessonDetail> = Object.fromEntries(
  sectionSeeds.flatMap((section) => section.lessons.map((lesson) => [lesson.id, createLessonDetail(section, lesson)])),
)

const seenSourceUrls = new Set<string>()
export const widerReferenceSources = sectionSeeds.flatMap((section) => section.sources).filter((source) => {
  if (seenSourceUrls.has(source.url)) return false
  seenSourceUrls.add(source.url)
  return true
})

