# Indian Texts Atlas

A mobile-first interactive course for learning how ancient Indian textual traditions relate, where the principal Upaniṣads belong, and what questions representative texts ask.

## Curriculum

- An interactive root map separating authority, genre, school, and parallel traditions
- A thirteen-text Upaniṣad learning path
- A complete Kena Upaniṣad depth edition: 35 mantra/prose units plus the peace invocation, with Sanskrit, IAST, word-by-word literal meanings and grammar/sandhi cues, original course paraphrases, visual models, checkpoints, and device-local reading progress
- Kena opens with plain-English orientation, four interactive question examples, Sanskrit pattern lessons and optional practice for 1.1–1.4. Word meanings are shown by default, with grammar available on demand. The main reading action records progress, and final review links directly to unfinished work.
- A complete Kaṭha Upaniṣad depth edition: 119 numbered units plus the peace invocation, across two adhyāyas and six vallīs, paced into 18 sessions with a word-by-word Sanskrit-learning layer, visual models, recall pauses, checkpoints, and a final synthesis
- A complete Īśā Upaniṣad depth edition: all 18 Kāṇva mantras plus the peace invocation, paced into six sessions across three learning movements, with a word-by-word Sanskrit-learning layer, textual cautions, visual models, recall pauses, checkpoints, and a final synthesis
- A prerequisite Course 0 explaining how authority, genre, textual layer, and interpretive school connect
- Nine wider paths through Vedic foundations, the epics, Purāṇic and devotional traditions, philosophical schools, Buddhist and Jain libraries, social thought, technical sciences, and regional literatures
- 75 taught lessons across 11 connected paths: Course 0, three complete depth editions, ten Upaniṣad key-teaching courses, and 61 wider-text courses
- Each of the 71 key-teaching courses has three distinct teaching movements, a tappable relationship diagram, a worked example, contextual vocabulary, an application exercise, and two cross-course connections
- Fourteen additional sourced Sanskrit excerpts with original English translations, IAST, every learning word explained, and optional grammar; prose sūtras and partial verses are explicitly labelled
- A six-step lesson rhythm: Locate → Read → Unpack → Compare → Reflect → Remember
- Browser-local notes, quiz answers, and completion progress
- Refreshable step URLs (including Course 0) and a resumable seven-part final review connecting the whole curriculum
- An editorial reference desk with public scholarly sources and interpretive guardrails
- Responsive navigation and touch-friendly learning surfaces

The completed curriculum is a curated course of key teachings, not an exhaustive archive. Kena, Kaṭha, and Īśā are available passage by passage in full; the other courses teach selected passages and representative text clusters. The traditional 108-Upaniṣad catalogue, complete editions of every other text, and a standalone Sanskrit language curriculum are outside this edition. Later medieval and early-modern reception is included explicitly as reception, not labelled ancient composition.

## Learning and editorial approach

Begin at `#lesson/course-0`. The path page shows a next unfinished lesson and the final review. The curriculum is complete when every lesson is marked complete (including all reading units and correct checkpoint and final-check answers in the three depth editions) and every final-review question is answered correctly. For Course 0 and key-teaching lessons, answer the understanding check correctly, then select the completion button. Reflections are private and optional; the review assesses textual understanding, not adherence to a religious belief.

Notes and progress remain in the browser on the current device; there is no account or automatic cross-device sync. If saving fails, a warning explains that progress remains available for the current visit but could not be saved for later. Old notes, depth reading records, and historical completion records are preserved. Rewritten wider-course quizzes use a new assessment version; retake these checks to restore their current completion status. A learner can retake a check without losing their reflection.

The content separates original course explanations, labelled modern illustrations, paraphrased textual scenes, source quotations, and later interpretations. Sanskrit glosses are contextual learning aids, not a claim that each word always has one English equivalent. Non-Sanskrit traditions are not presented as Sanskrit texts. Historical medical and social prescriptions are studied critically, not offered as present-day advice.

The key-teaching content lives in [upanishadGuides.ts](src/upanishadGuides.ts), [vedicEpicGuides.json](src/vedicEpicGuides.json), [philosophyGuides.json](src/philosophyGuides.json), and [cultureGuides.json](src/cultureGuides.json). The full-text editions retain their locked textual/word-study audits.

## Develop locally

```bash
npm install
npm run dev
```

## Validate

```bash
npm run verify
```

Verification includes every guided lesson's step renderings, Sanskrit excerpt coverage, valid cross-course links, quiz distinctness, progress migration, full-edition completion, and final-review routing; [the course-learning checks](scripts/test-course-learning.mjs) own the coverage assertions. It runs alongside the existing full-text curriculum audits and Kena regression tests. This is automated source/rendered-output verification, not browser screenshot testing or a substitute for specialist scholarly review.

An optional live link audit is separate from CI because external sites may block automated requests:

```bash
npm run check:sources
```

The audit distinguishes definite missing pages from requests that require manual review. Public source pages may change independently of this project.

Pull requests run the same verification without deploying. The site deploys automatically to GitHub Pages when changes reach `main`.
