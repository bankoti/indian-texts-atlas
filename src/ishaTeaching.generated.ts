// Generated course-original teaching layer; sources and editorial guidance live in ishaData.ts.

export type IshaTeaching = {
  id: string
  title: string
  gloss: string
  explanation: string
  terms: { term: string; meaning: string }[]
  textNote?: string
}

export type IshaMovement = {
  id: string
  label: string
  verses: number[]
  title: string
  form: string
  question: string
  summary: string
  recap: string
  checkpoint: { question: string; choices: string[]; correct: number; explanation: string }
}

export type IshaSession = {
  id: string
  movementId: string
  order: number
  title: string
  verses: number[]
  recall: string
  nextQuestion: string
}

export type IshaFinalSynthesis = {
  statement: string
  question: string
  choices: string[]
  correct: number
  explanation: string
  reflectionPrompt: string
  retrievalPrompt: string
}

export const ishaTeaching: IshaTeaching[] = [
  {
    "id": "1",
    "title": "The world as the Lord’s dwelling",
    "gloss": "All this—whatever moving thing moves in the world—is to be inhabited by the Lord. Therefore sustain yourself with what has been relinquished; do not covet: whose, indeed, is wealth?",
    "explanation": "The opening alters the learner’s posture before it supplies a theory. If the world is the Lord’s dwelling, possession cannot mean absolute ownership. Receiving what is given or relinquished becomes compatible with use, while grasping is refused.",
    "terms": [
      {
        "term": "īśā",
        "meaning": "by or with the Lord/ruler"
      },
      {
        "term": "āvāsyam / vāsyam",
        "meaning": "to be inhabited, clothed, covered, or pervaded; the derivation is disputed"
      },
      {
        "term": "tyaktena",
        "meaning": "with what is relinquished, abandoned, or allotted"
      },
      {
        "term": "bhuñjīthā",
        "meaning": "sustain or enjoy yourself; traditionally also interpreted as protect"
      },
      {
        "term": "mā gṛdhaḥ",
        "meaning": "do not covet or grasp after"
      }
    ],
    "textNote": "This mantra resists a single seamless English sentence. Śaṅkara reads the world as covered by the Lord and tena tyaktena through renunciation; other commentarial and modern philological readings take the world as the Lord’s dwelling and what is enjoyed as what has been ceded or left. The course gloss foregrounds the latter philological reading while displaying the major alternative here."
  },
  {
    "id": "2",
    "title": "A whole life of action",
    "gloss": "Doing actions here, one should wish to live a hundred years. Thus it is for you—not otherwise than this: action does not cling to a person.",
    "explanation": "‘A hundred years’ signifies a full human lifetime, not a longevity guarantee. The mantra refuses the easy equation of insight with inactivity: action can fill a life without becoming a stain or adhesive identity. Exactly what makes action non-binding is supplied differently by later readings.",
    "terms": [
      {
        "term": "karmāṇi",
        "meaning": "actions or deeds; often read here as prescribed rites"
      },
      {
        "term": "jijīviṣet",
        "meaning": "one should desire to live"
      },
      {
        "term": "śataṃ samāḥ",
        "meaning": "a hundred years; a complete lifespan"
      },
      {
        "term": "lipyate",
        "meaning": "is smeared, stained, or made to cling"
      }
    ],
    "textNote": "Interpretations differ on whether verse 2 addresses the same learner as verse 1 or a person not ready for renunciation, and whether karman means Vedic rites specifically or action more broadly. The transmitted final half also has metrical and syntactic difficulties; modern scholars have proposed emendations, but this edition preserves the received Kāṇva text."
  },
  {
    "id": "3",
    "title": "Losing the Self",
    "gloss": "Those worlds called asuryā are covered by blinding darkness. After death, whoever are ‘killers of the Self’ go to them.",
    "explanation": "The terrifying image names a life that nullifies its own deepest dimension. ‘Killer of the Self’ is best taught as spiritual self-loss or failure to recognize the Self—not as a label to weaponize against people and not as a literal account of harming an immortal Self.",
    "terms": [
      {
        "term": "asuryāḥ / asūryāḥ",
        "meaning": "asuric/demonic or sunless; the reading and accent affect the sense"
      },
      {
        "term": "andhena tamasā",
        "meaning": "with blind or blinding darkness"
      },
      {
        "term": "pretya",
        "meaning": "having died; after departing"
      },
      {
        "term": "ātma-hanaḥ",
        "meaning": "killers of the Self; a deliberately paradoxical compound"
      }
    ],
    "textNote": "The accentless form asuryā can conceal a choice often rendered either ‘asuric/demonic’ or ‘sunless.’ Commentators also differ on which ignorance or conduct makes someone an ātmahan. The course keeps the threat within the mantra’s religious imagery rather than turning it into a modern clinical claim."
  },
  {
    "id": "4",
    "title": "Stillness faster than thought",
    "gloss": "Unmoving, the One is swifter than the mind. The deities/senses did not reach it, for it went before them. Standing, it outstrips others as they run. In it Mātariśvan establishes the waters—or activities.",
    "explanation": "The One is not another fast object racing the mind. Mind and sensory powers already operate within what the verse points toward, so they cannot get outside it and catch it. Mātariśvan, associated with wind or life-breath, introduces ordered activity within the unmoving ground.",
    "terms": [
      {
        "term": "anejat",
        "meaning": "unmoving, unstirring"
      },
      {
        "term": "ekam",
        "meaning": "the One"
      },
      {
        "term": "devāḥ",
        "meaning": "deities; often interpreted here as the sensory powers"
      },
      {
        "term": "Mātariśvan",
        "meaning": "a Vedic name associated with wind, breath, or the power moving in the atmosphere"
      },
      {
        "term": "apaḥ / apas",
        "meaning": "waters in the accented Vedic text; also interpreted as works or activities"
      }
    ],
    "textNote": "The Vājasaneyi Saṃhitā’s accent supports ‘waters’ for apas, while a long commentarial line reads ‘works/activities.’ Neither should be silently erased. ‘Deities’ becoming ‘senses’ is also an interpretation, though a well-established one."
  },
  {
    "id": "5",
    "title": "Near and far, within and beyond",
    "gloss": "It moves, and it does not move. It is far away, and it is near. It is within all this, and it is also outside all this.",
    "explanation": "The paired statements block any attempt to localize the One. It is intimate without being confined inside, transcendent without being absent, and the condition of movement without becoming merely one moving thing.",
    "terms": [
      {
        "term": "ejati",
        "meaning": "moves, stirs, or trembles"
      },
      {
        "term": "na ejati",
        "meaning": "does not move or stir"
      },
      {
        "term": "antike",
        "meaning": "near, close at hand"
      },
      {
        "term": "antar / bāhyataḥ",
        "meaning": "within / on the outside"
      }
    ]
  },
  {
    "id": "6",
    "title": "Every being in the Self",
    "gloss": "But one who sees all beings precisely in the Self, and the Self in all beings, does not then recoil from it.",
    "explanation": "The verse turns cosmic description into a discipline of seeing. Other beings are not disposable outsiders, yet neither are they reduced to the learner’s ego. The result is a loosening of recoil, concealment, contempt, or defensive separation.",
    "terms": [
      {
        "term": "sarvāṇi bhūtāni",
        "meaning": "all beings or all that has come to be"
      },
      {
        "term": "ātmani",
        "meaning": "in the Self"
      },
      {
        "term": "anupaśyati",
        "meaning": "sees along with, beholds, or recognizes"
      },
      {
        "term": "vijugupsate",
        "meaning": "recoils, shuns, despises, or seeks to hide; exact nuance is debated"
      }
    ],
    "textNote": "Translations of vijugupsate range from ‘does not shrink away’ to ‘does not hate/despise’ and ‘does not wish to conceal.’ The course uses ‘recoil’ as a broad contextual aid, not an exhaustive dictionary equivalence."
  },
  {
    "id": "7",
    "title": "What room remains for delusion?",
    "gloss": "When, for the discerning person, all beings have become the Self itself, what delusion, what sorrow can there be for one who sees oneness?",
    "explanation": "The questions describe the horizon of transformed vision; they are not an instruction to suppress ordinary grief or shame mourners. ‘Oneness’ challenges the delusion of absolute separation while later traditions disagree about whether it means strict identity, unity-in-difference, or dependence on one Lord.",
    "terms": [
      {
        "term": "vijānataḥ",
        "meaning": "for the one who discerns or knows"
      },
      {
        "term": "moha",
        "meaning": "delusion, bewilderment"
      },
      {
        "term": "śoka",
        "meaning": "sorrow or grief"
      },
      {
        "term": "ekatvam",
        "meaning": "oneness or unity"
      }
    ],
    "textNote": "Yasmin is formally locative and can be read temporally (‘when’) or relationally (‘in whom’ or ‘in that Self’). The course gloss foregrounds the temporal turn while keeping the locative reading visible here. The mantra states a unity-vision but does not by itself settle the later Vedāntic debate over identity and difference. The pedagogical distinction between delusive separateness and normal bereavement is an ethical clarification, not a new claim attributed to the Sanskrit."
  },
  {
    "id": "8",
    "title": "A luminous, incorporeal order",
    "gloss": "That one has gone all around: radiant, bodiless, unwounded, without sinews, pure, unpierced by evil; a seer, thinker, all-surpassing, self-existent, who apportioned things according to how they truly are for enduring years.",
    "explanation": "A cascade of terms refuses to make the highest reality into a vulnerable physical object, yet ends in intelligence and ordered differentiation rather than vacancy. ‘According to how they truly are’ joins transcendence to a world whose things receive their places or purposes.",
    "terms": [
      {
        "term": "śukram",
        "meaning": "bright, radiant, or pure"
      },
      {
        "term": "akāyam",
        "meaning": "bodiless, without a material body"
      },
      {
        "term": "apāpa-viddham",
        "meaning": "not pierced or touched by evil"
      },
      {
        "term": "kaviḥ / manīṣī",
        "meaning": "seer / thinker or wise intelligence"
      },
      {
        "term": "yāthātathyataḥ",
        "meaning": "in accordance with actuality; as things truly are"
      }
    ],
    "textNote": "The syntax is exceptionally compressed. Śaṅkara coordinates the descriptions with the Self; another grammatical reading takes the accusative adjectives as what the seer or knower reaches. The referent and force of vyadadhāt (‘apportioned/ordered’) also vary. The course gloss offers a readable coordination without claiming that the syntax is uncontested."
  },
  {
    "id": "9",
    "title": "The darkness of either exclusive path",
    "gloss": "Into blind darkness enter those who worship avidyā; into a darkness greater, as it were, those who are devoted to vidyā.",
    "explanation": "The shock is deliberate: a positive-sounding term does not receive automatic praise. The target is exclusive devotion, but the verse does not yet define either pole. A careful learner should hold the Sanskrit terms open until verses 10–11 complete the pattern.",
    "terms": [
      {
        "term": "avidyā",
        "meaning": "non-knowledge; interpreted variously as ignorance, ritual action, or another limited discipline"
      },
      {
        "term": "vidyā",
        "meaning": "knowledge; interpreted variously as deity-meditation, higher knowledge, or a particular contemplative discipline"
      },
      {
        "term": "upāsate",
        "meaning": "worship, attend upon, or cultivate"
      },
      {
        "term": "ratāḥ",
        "meaning": "delighting in, devoted to, absorbed in"
      },
      {
        "term": "iva",
        "meaning": "as if, as it were; a qualifying particle that should not disappear"
      }
    ],
    "textNote": "Do not gloss avidyā simply as ‘science/worldly knowledge’ or vidyā simply as ‘spirituality’ in the literal layer. Śaṅkara reads them here as rites and knowledge/meditation concerning deities—not ultimate Brahman-knowledge—while other commentarial, Vedāntic, and modern scholarly readings construe them differently."
  },
  {
    "id": "10",
    "title": "Different outcomes, received from teachers",
    "gloss": "One outcome, they say, comes from vidyā, and another from avidyā. So we have heard from the discerning people who explained this to us.",
    "explanation": "The voice appeals to a teaching lineage rather than pretending the terms are self-evident. The verse contributes one firm claim: the two have different results. It does not say that the labels are interchangeable or that one vague ‘balance’ is enough.",
    "terms": [
      {
        "term": "anyat … anyat",
        "meaning": "one thing … another; distinct outcomes"
      },
      {
        "term": "śuśruma",
        "meaning": "we have heard; a perfect form with present relevance"
      },
      {
        "term": "dhīrāṇām",
        "meaning": "of the discerning, steadfast, or wise"
      },
      {
        "term": "vicacakṣire",
        "meaning": "they explained or made clear"
      }
    ],
    "textNote": "The Kāṇva transmission has instrumental vidyayā/avidyayā (‘by/from’); the Mādhyaṃdina recension supplies ablative forms. English must often add ‘result’ or ‘outcome,’ which is understood rather than stated as a separate Sanskrit noun."
  },
  {
    "id": "11",
    "title": "Know both—do not blur them",
    "gloss": "Whoever knows vidyā and avidyā—both together—crosses death by avidyā and reaches or enjoys immortality by vidyā.",
    "explanation": "Togetherness does not erase function: one side is instrumental in crossing death and the other in attaining immortality. Nor does the verse by itself explain whether these are sequential stages, simultaneous disciplines, or relative ritual/cosmic attainments. The responsible first reading maps the grammar before adopting a doctrine.",
    "terms": [
      {
        "term": "ubhayam saha",
        "meaning": "both together"
      },
      {
        "term": "veda",
        "meaning": "knows or understands"
      },
      {
        "term": "mṛtyuṃ tīrtvā",
        "meaning": "having crossed death, as one crosses a stream"
      },
      {
        "term": "amṛtam aśnute",
        "meaning": "reaches, partakes of, or enjoys the immortal"
      }
    ],
    "textNote": "The identity of the two disciplines and the scope of amṛta are contested. In Śaṅkara’s reading the pair concerns ritual action and deity-knowledge with limited results, not a combination of action with liberating Brahman-knowledge. Other commentarial and modern readings make a stronger synthesis of action and knowledge. Present those as named lenses, not as the literal translation."
  },
  {
    "id": "12",
    "title": "A second warning against exclusivity",
    "gloss": "Into blind darkness enter those who worship asambhūti; into a darkness greater, as it were, those who are devoted to sambhūti.",
    "explanation": "The second triad deliberately echoes verse 9 but changes its vocabulary. At a minimum, sambhūti concerns coming into being or origination and asambhūti its negation. Later ‘manifest/unmanifest,’ ‘effect/cause,’ and theological identifications are interpretive developments, not transparent dictionary replacements.",
    "terms": [
      {
        "term": "sambhūti",
        "meaning": "coming into being, origination, production, or a being produced"
      },
      {
        "term": "asambhūti",
        "meaning": "non-origination or non-coming-to-be; later interpreted in several ways"
      },
      {
        "term": "upāsate",
        "meaning": "worship, attend upon, or cultivate"
      },
      {
        "term": "bhūyaḥ iva",
        "meaning": "greater, as it were"
      }
    ],
    "textNote": "Śaṅkara associates asambhūti with unmanifest prakṛti and sambhūti with the produced Hiraṇyagarbha; other readers use unmanifest/manifest, cause/effect, non-becoming/becoming, dissolution/origination, or distinct devotional referents. The course does not canonize one equation."
  },
  {
    "id": "13",
    "title": "Different outcomes—again",
    "gloss": "One outcome, they say, comes from sambhava, and another from asambhava. So we have heard from the discerning people who explained this to us.",
    "explanation": "The repetition teaches method: do not rush past the distinction of results. It also teaches textual attentiveness, because the nouns shift from sambhūti/asambhūti in verse 12 to sambhava/asambhava here.",
    "terms": [
      {
        "term": "sambhava",
        "meaning": "coming into existence, origin, or birth"
      },
      {
        "term": "asambhava",
        "meaning": "non-origin or non-coming-into-existence"
      },
      {
        "term": "āhuḥ",
        "meaning": "they say"
      },
      {
        "term": "śuśruma",
        "meaning": "we have heard"
      }
    ],
    "textNote": "Sambhava/asambhava are morphologically related to but not identical with sambhūti/asambhūti. Many interpretations treat them as equivalent within the triad; the literal learning layer should still preserve the lexical change."
  },
  {
    "id": "14",
    "title": "Origination beside destruction",
    "gloss": "Whoever knows sambhūti and destruction—both together—crosses death by destruction and reaches or enjoys immortality by sambhūti.",
    "explanation": "The triad resolves structurally but not lexically: verse 14 pairs sambhūti with vināśa rather than simply repeating asambhūti. The learner should see that rough edge. ‘Together’ again means differentiated cooperation, because the two sides are assigned different effects.",
    "terms": [
      {
        "term": "sambhūtim",
        "meaning": "origination, coming-to-be, or what is produced"
      },
      {
        "term": "vināśam",
        "meaning": "destruction, dissolution, or the perishable"
      },
      {
        "term": "ubhayam saha",
        "meaning": "both together"
      },
      {
        "term": "tīrtvā",
        "meaning": "having crossed over"
      },
      {
        "term": "amṛtam",
        "meaning": "the immortal, deathlessness, or a relative immortality depending on the reading"
      }
    ],
    "textNote": "The shift to vināśa is one of the text’s hardest problems. The received Kāṇva wording is positive sambhūtiṃ in the opening pair and sambhūtyā in the result clause. Śaṅkara takes the first as asambhūtiṃ by positing initial a-loss; in the result clause he construes tīrtvā sambhūtyā as sandhied tīrtvā asambhūtyā. Other readers retain the transmitted forms or align vināśa with a perishable effect, body, or another stage. The course prints and translates the received wording before presenting those solutions."
  },
  {
    "id": "15",
    "title": "The golden cover",
    "gloss": "The face of truth is covered by a golden vessel. Pūṣan, uncover that for one whose commitment is to truth, so that it may be seen.",
    "explanation": "Radiance can reveal and conceal. The speaker does not reject the sun; the prayer asks the nourishing solar power to open its brilliant surface so truth may be seen through it. What appears most splendid may still be a threshold rather than the final object of vision.",
    "terms": [
      {
        "term": "hiraṇmayena pātreṇa",
        "meaning": "by a golden vessel, bowl, lid, or disk"
      },
      {
        "term": "satyasya mukham",
        "meaning": "the face or foremost form of truth/the real"
      },
      {
        "term": "Pūṣan",
        "meaning": "the Nourisher, a Vedic solar deity and guide"
      },
      {
        "term": "satya-dharmāya",
        "meaning": "for one whose law, commitment, or nature is truth; grammatically and interpretively difficult"
      },
      {
        "term": "dṛṣṭaye",
        "meaning": "for seeing, so that it may be seen"
      }
    ],
    "textNote": "‘Golden vessel’ is often interpreted as the sun’s disk or dazzling rays, but the image itself should appear before that explanation. Satya-dharma may describe the seeker, truth, or the deity depending on how the syntax is construed."
  },
  {
    "id": "16",
    "title": "The Person in the sun",
    "gloss": "Pūṣan, sole seer, controller, Sun, child of Prajāpati: draw apart your rays; gather your brilliance. Your most beautiful form—that I see. That Person who is yonder—he am I.",
    "explanation": "The prayer moves through multiple solar names toward a person beyond the glare. Its final identity statement is among the text’s boldest, yet it arrives as received vision, not self-inflation. Later schools read the relation between speaker, solar Person, and Lord differently.",
    "terms": [
      {
        "term": "ekarṣe",
        "meaning": "sole seer or solitary sage"
      },
      {
        "term": "yama",
        "meaning": "controller or restrainer; also the divine name Yama"
      },
      {
        "term": "prājāpatya",
        "meaning": "descendant or child of Prajāpati"
      },
      {
        "term": "vyūha / samūha",
        "meaning": "draw apart or arrange / draw together or gather"
      },
      {
        "term": "so ’ham asmi",
        "meaning": "he am I; I am that person"
      }
    ],
    "textNote": "Whether so ’ham asmi declares unqualified identity, unity-in-dependence, likeness, or an intimate relation is a major reception question. The close translation should remain ‘he am I’ and let named interpretive lenses explain the alternatives."
  },
  {
    "id": "17",
    "title": "Breath, ashes, remembrance",
    "gloss": "Breath—to the immortal wind; then this body ends in ashes. Oṃ. O resolve, remember; remember what was done. O resolve, remember; remember what was done.",
    "explanation": "Mortality is faced without euphemism: breath returns to wind and the body to ash. Yet the repeated call to remember refuses erasure. Deeds remain morally and ritually significant at the threshold where bodily components disperse.",
    "terms": [
      {
        "term": "vāyuḥ / anilam",
        "meaning": "breath or wind / to the wind"
      },
      {
        "term": "amṛtam",
        "meaning": "immortal or deathless"
      },
      {
        "term": "bhasmāntam śarīram",
        "meaning": "the body whose end is ash"
      },
      {
        "term": "krato",
        "meaning": "O resolve, will, intention, intelligence, or sacrificial purpose"
      },
      {
        "term": "kṛtam smara",
        "meaning": "remember what has been done"
      }
    ],
    "textNote": "Kratu can be construed as the speaker’s will/mind, sacrificial intention, or an address associated with Agni; translations therefore disagree over who remembers whom. The verse is commonly situated at death or in a funeral setting, a context supported by its imagery and parallels but not narrated inside the isolated mantra."
  },
  {
    "id": "18",
    "title": "Lead us by the good path",
    "gloss": "Agni, lead us by a good path toward well-being, O god who knows all the courses. Remove from us the crookedly turning wrong; to you may we offer our fullest words of homage.",
    "explanation": "The final request is communal—‘lead us’—and moral orientation matters as much as destination. Agni knows the routes and is asked both to guide and to separate the travelers from crooked fault. The short Upaniṣad ends in humble direction rather than a claim of finished mastery.",
    "terms": [
      {
        "term": "Agne",
        "meaning": "O Agni, fire as deity and guide"
      },
      {
        "term": "supathā",
        "meaning": "by a good, auspicious, or fitting path"
      },
      {
        "term": "rāye",
        "meaning": "toward wealth, prosperity, welfare, or blessed attainment"
      },
      {
        "term": "vayunāni",
        "meaning": "ways, courses, insights, or guiding knowledge"
      },
      {
        "term": "juhurāṇam enaḥ",
        "meaning": "crookedly turning wrong, fault, or sin"
      },
      {
        "term": "nama-uktim",
        "meaning": "an utterance of homage or reverence"
      }
    ],
    "textNote": "This mantra is also Ṛgveda 1.189.1. Rāye need not mean merely material wealth, and vayunāni has a wider Vedic range than ordinary ‘paths.’ The course uses ‘well-being’ and ‘courses’ while retaining the alternatives in the vocabulary note."
  }
]

export const ishaMovements: IshaMovement[] = [
  {
    "id": "1",
    "label": "MOVEMENT I",
    "verses": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
    ],
    "title": "Inhabit the world; see the One",
    "form": "8 mantras · orientation, paradox, transformed vision",
    "question": "How does a non-possessive way of living open into recognition of the One/Self in every being?",
    "summary": "The opening places every moving thing in relation to the Lord, restrains coveting, permits a whole life of action, and warns against losing the Self. Verses 4–8 then describe the One through paired opposites and trace the consequence of seeing all beings in the Self and the Self in all beings.",
    "recap": "Īśā moves from posture to perception: inhabit without seizure, act without being smeared by action, and do not live as though the deepest Self were absent. The paradoxes loosen object-like thinking, while mutual seeing changes one’s relation to living beings—recoil and delusive separation lose their ground.",
    "checkpoint": {
      "question": "Which sequence best follows the first movement’s development?",
      "choices": [
        "Reject the world, stop acting, and treat the Self as a distant object",
        "Claim the world, seek longevity, and overcome every physical difference",
        "Inhabit without grasping, act without adhesion, recognize the One beyond fixed opposites, and see Self and beings mutually",
        "Choose stillness over motion and the inside over the outside"
      ],
      "correct": 2,
      "explanation": "The movement links non-coveting and sustained action to a vision that cannot be confined to one side of a pair. It culminates in mutual seeing, not world-rejection or the denial of ordinary differences."
    }
  },
  {
    "id": "2",
    "label": "MOVEMENT II",
    "verses": [
      9,
      10,
      11,
      12,
      13,
      14
    ],
    "title": "Two pairs, neither alone",
    "form": "2 parallel triads · warning, testimony, conjunction",
    "question": "Why does the text criticize exclusive devotion to both sides of each pair, then tell us to know the pair together?",
    "summary": "Verses 9–11 pair vidyā with avidyā; verses 12–14 pair the vocabulary of sambhūti/asambhūti, sambhava/asambhava, and finally sambhūti/vināśa. Each triad warns against exclusivity, reports distinct outcomes, and assigns the two sides different roles in crossing death and reaching immortality.",
    "recap": "The secure textual claim is structural, not a one-line dictionary: neither pole may be absolutized; their outcomes differ; and both are to be understood together. The exact referents of the terms—and the kind of immortality promised—have been read differently by commentators and modern scholars.",
    "checkpoint": {
      "question": "What can we state confidently before choosing an interpretation of vidyā, avidyā, sambhūti, and asambhūti?",
      "choices": [
        "Avidyā always means modern science and vidyā always means religion",
        "The second triad simply repeats the first with identical dictionary meanings",
        "The text criticizes exclusive devotion, distinguishes outcomes, and asks that each pair be known together",
        "The text says all four terms produce exactly the same result"
      ],
      "correct": 2,
      "explanation": "That three-step pattern is explicit in both triads. Identifying the poles with ritual, deity-knowledge, Self-knowledge, manifestation, cause, or other categories belongs to an interpretive lens and must be labeled as such."
    }
  },
  {
    "id": "3",
    "label": "MOVEMENT III",
    "verses": [
      15,
      16,
      17,
      18
    ],
    "title": "At the threshold: uncover, remember, lead",
    "form": "4 mantras · solar and fire prayers",
    "question": "How does the teaching become prayer when the learner faces radiance, mortality, memory, and an unknown path?",
    "summary": "The speaker asks Pūṣan/Sūrya to uncover truth, recognizes a profound relation with the Person in the sun, returns breath and body to the elements, calls for remembrance, and finally asks Agni to lead us by a good path.",
    "recap": "The poem does not end with private certainty. Its verbs are petitions—uncover, gather, remember, lead, remove—and the final pronoun is plural. Insight remains dependent on guidance, truthful memory, and a path shared with others.",
    "checkpoint": {
      "question": "What is the most important change of voice in verses 15–18?",
      "choices": [
        "The text replaces philosophy with praise of sunlight as a physical object",
        "Statements about reality become direct requests for disclosure, remembrance, and guidance",
        "The speaker claims that deeds no longer matter",
        "The speaker abandons the community and asks only for a private reward"
      ],
      "correct": 1,
      "explanation": "The closing movement is prayer rather than detached description. Verse 17 remembers deeds, and verse 18 widens the request from an individual voice to ‘lead us.’"
    }
  }
]

export const ishaSessions: IshaSession[] = [
  {
    "id": "1",
    "movementId": "1",
    "order": 1,
    "title": "A world that is not mine",
    "verses": [
      1,
      2
    ],
    "recall": "Retell the opening using two verbs: inhabit and act. How does ‘do not covet’ change both?",
    "nextQuestion": "What is lost when a person acts as though the deepest Self were absent?"
  },
  {
    "id": "2",
    "movementId": "1",
    "order": 2,
    "title": "Self-loss and the unmoving One",
    "verses": [
      3,
      4,
      5
    ],
    "recall": "Connect verse 3’s self-loss with the four paradox pairs: still/moving, faster/standing, far/near, within/outside.",
    "nextQuestion": "What would such an account of reality change in one’s response to another being?"
  },
  {
    "id": "3",
    "movementId": "1",
    "order": 3,
    "title": "Seeing without recoil",
    "verses": [
      6,
      7,
      8
    ],
    "recall": "Trace the movement from seeing, to non-recoil, to the questions about delusion and sorrow, and finally to verse 8’s portrait.",
    "nextQuestion": "Can a single pursuit become a form of darkness even when its name sounds positive?"
  },
  {
    "id": "4",
    "movementId": "2",
    "order": 4,
    "title": "Vidyā and avidyā",
    "verses": [
      9,
      10,
      11
    ],
    "recall": "State only what the triad itself says: the danger of each exclusive path, the difference of results, and the two distinct functions when known together.",
    "nextQuestion": "Does the second triad repeat the same terms, or deliberately change its vocabulary?"
  },
  {
    "id": "5",
    "movementId": "2",
    "order": 5,
    "title": "Origination and dissolution",
    "verses": [
      12,
      13,
      14
    ],
    "recall": "List each term exactly as it changes: sambhūti/asambhūti, sambhava/asambhava, sambhūti/vināśa. Why should a learner resist smoothing those shifts away?",
    "nextQuestion": "What can prayer do that a proposition about truth cannot?"
  },
  {
    "id": "6",
    "movementId": "3",
    "order": 6,
    "title": "The golden cover and the good path",
    "verses": [
      15,
      16,
      17,
      18
    ],
    "recall": "Follow the closing verbs in order: uncover, arrange/gather, see, remember, lead, remove, offer homage.",
    "nextQuestion": "How does the final ‘lead us’ change your reading of the opening ‘do not covet’?"
  }
]

export const ishaFinalSynthesis: IshaFinalSynthesis = {
  "statement": "Īśā moves from a world no ego can own, through action that need not cling, into a vision in which Self and beings cannot be absolutely separated. It then disciplines the reader’s urge to absolutize one path, preserves two difficult pairs in differentiated relation, and closes at death with requests for disclosure, remembrance, moral guidance, and a good path shared by ‘us.’",
  "question": "Which sequence best represents the whole Upaniṣad without smoothing away its tensions?",
  "choices": [
    "Reject the world → reject action → reject all distinctions → escape alone",
    "See the world as divine dwelling → act without grasping → recognize Self in beings → hold paired disciplines without collapsing them → ask for remembrance and guidance",
    "Perform rites for one hundred years → worship the sun as a physical object → forget one’s deeds",
    "Choose knowledge over everything else → treat every form of non-knowledge as useless → declare oneself already complete"
  ],
  "correct": 1,
  "explanation": "That sequence preserves the poem’s turns: non-possession and action, paradox and relational vision, the two paired triads, and the closing prayers. It does not force disputed terms into a single later system.",
  "reflectionPrompt": "Choose one place where the text joins terms you normally oppose—renunciation and enjoyment, stillness and motion, Self and beings, vidyā and avidyā, origination and destruction. What changes when you preserve the distinction but refuse to absolutize either side?",
  "retrievalPrompt": "Without looking back, reconstruct the six sessions in one sentence each, then name one textual uncertainty that a responsible teacher should keep visible."
}

export const ishaInterpretiveLenses = [
  {
    "name": "Philological-historical lens",
    "reading": "Read the Kāṇva wording inside Vājasaneyi Saṃhitā 40 before systematizing it: preserve Vedic syntax, accent-sensitive terms, the parallel triads, recension differences, and the closing prayer’s older ritual-poetic setting."
  },
  {
    "name": "Advaita reception lens",
    "reading": "Śaṅkara foregrounds renunciation and recognition of the Self as non-dual reality; he construes verses 9–14 as ritual action joined with limited deity/cosmic meditation, not action combined with liberating Brahman-knowledge."
  },
  {
    "name": "Theistic Vedānta lens",
    "reading": "Theistic Vedānta readers can emphasize the world as the Lord’s dwelling or dependent reality, action devoted or subordinate to knowledge of the Lord, and ‘he am I’ as profound relation without requiring Śaṅkara’s unqualified identity."
  }
]

export const ishaVisualConcepts = [
  {
    "id": "whole-poem-route",
    "title": "From dwelling to guidance",
    "verses": "1–18",
    "format": "Three connected CSS cards on a horizontal desktop path and vertical mobile path",
    "content": [
      "1–8 · Inhabit / act / paradox / mutual seeing",
      "9–14 · Pair / distinguish / know together",
      "15–18 · Uncover / remember / lead us"
    ],
    "interaction": "Selecting a card expands its guiding question and jumps to the first unread verse in that movement.",
    "accessibility": "Use an ordered list in DOM order with visible verse ranges; arrows are decorative only and hidden from assistive technology."
  },
  {
    "id": "stewardship-cycle",
    "title": "Use without absolute ownership",
    "verses": "1–2",
    "format": "A circular four-step CSS flow",
    "content": [
      "Receive what is relinquished",
      "Use or sustain life",
      "Act through the full lifespan",
      "Release the claim ‘this is absolutely mine’"
    ],
    "interaction": "A ‘text / teaching’ toggle shows the Sanskrit anchors on one side and the course application on the other.",
    "accessibility": "Present the same sequence as an ordered list; never communicate the cycle through position or color alone."
  },
  {
    "id": "paradox-field",
    "title": "Not a choice between opposites",
    "verses": "4–5",
    "format": "Four paired rails around a stable center labeled ‘the One’",
    "content": [
      "unmoving ↔ swifter than mind",
      "standing ↔ outstrips runners",
      "far ↔ near",
      "within ↔ outside"
    ],
    "interaction": "Tapping either end highlights both ends and reveals: ‘The mantra asserts both.’",
    "accessibility": "Each pair is one text row with ‘and’ spoken by screen readers; animation respects prefers-reduced-motion."
  },
  {
    "id": "mutual-seeing",
    "title": "Self in beings · beings in Self",
    "verses": "6–7",
    "format": "Two overlapping outlined fields rendered in CSS, followed by a causal text chain",
    "content": [
      "all beings in the Self",
      "the Self in all beings",
      "less recoil",
      "what delusion? what sorrow?"
    ],
    "interaction": "A focusable slider changes the visual overlap while the caption warns that spatial overlap is only a teaching analogy.",
    "accessibility": "Provide the full claim and caveat as text; do not imply that empirical differences literally vanish."
  },
  {
    "id": "paired-triads",
    "title": "The pattern is certain; the labels remain debated",
    "verses": "9–14",
    "format": "Two parallel three-row grids with identical structural columns",
    "content": [
      "9 / 12 · exclusive A and exclusive B are each warned against",
      "10 / 13 · A and B have different outcomes",
      "11 / 14 · know both together; each has a different function"
    ],
    "interaction": "Lens tabs change only the proposed referent labels, while the Sanskrit-term row and structural claims remain fixed.",
    "accessibility": "Implement as two semantic tables with captions; label interpretations ‘Śaṅkara,’ ‘theistic Vedānta,’ and ‘philological/open’ rather than relying on color."
  },
  {
    "id": "closing-verbs",
    "title": "What the dying speaker asks",
    "verses": "15–18",
    "format": "A stepped CSS sequence of large verbs",
    "content": [
      "UNCOVER · 15",
      "GATHER & SEE · 16",
      "REMEMBER · 17",
      "LEAD US & REMOVE · 18"
    ],
    "interaction": "Each step opens the literal object of the verb and one interpretive caution.",
    "accessibility": "Use headings and buttons in verse order; the bright-to-quiet color shift is supplementary, with all states named in text."
  }
]
