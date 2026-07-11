<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/composables/useI18n.js'
import questionsData from '@/data/questions_new_format.json'
import { WHATSAPP_URL } from '@/constants/contact.js'

const { lang, t } = useI18n()

// ─── CONFIG (easy to change) ─────────────────────────────────────────────────
const QUESTIONS_PER_CATEGORY = 10
const TOTAL_QUESTIONS = QUESTIONS_PER_CATEGORY * 3

// ─── STATE ───────────────────────────────────────────────────────────────────
const phase = ref('setup')
const selectedLicense = ref(null)
const questions = ref([])
const currentIndex = ref(0)
const answers = ref({})

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function normalizeLicenseType(value) {
  const normalized = String(value || '').trim().toLowerCase()
  if (['car', 'private', 'private car', 'vehicle'].includes(normalized)) return 'car'
  if (['motorcycle', 'moto', 'motorbike', 'bike'].includes(normalized)) return 'motorcycle'
  return normalized
}

function normalizeCategory(value) {
  const normalized = String(value || '').trim().toLowerCase()
  if (['legal', 'law', 'laws', 'juridique', 'juridical'].includes(normalized)) return 'law'
  if (['safety', 'securite', 'security'].includes(normalized)) return 'safety'
  if (['sign', 'signs', 'panneaux', 'panel', 'road sign'].includes(normalized)) return 'signs'
  return normalized || 'law'
}

function getTranslatedQuestion(q) {
  const locale = lang.value
  return q?.translations?.[locale] || q?.translations?.en || null
}

function resolveImagePath(value) {
  if (!value || typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed

  // vite.config.js sets base: '/rabih-khoury-driving-school/', so assets under
  // /public must be prefixed with BASE_URL rather than assumed to live at the
  // domain root — otherwise they 404 once deployed (e.g. on GitHub Pages).
  const base = import.meta.env.BASE_URL || '/'
  const cleanPath = trimmed.replace(/^\.?\//, '')
  return `${base}${cleanPath}`.replace(/([^:])\/{2,}/g, '$1/')
}

function normalizeQuestion(q, forcedCategory = null) {
  const translated = getTranslatedQuestion(q)
  const options = translated?.answers
    ? Object.entries(translated.answers).map(([letter, text]) => ({ letter, text }))
    : []
  const answerIndex = options.findIndex((option) => option.letter === q.correct_answer)

  return {
    id: q.id,
    _category: normalizeCategory(forcedCategory || q.question_category),
    image: resolveImagePath(q.image),
    questionText: translated?.question || '',
    options,
    answerIndex: answerIndex >= 0 ? answerIndex : null,
  }
}

function pickQuestions(licenseType) {
  const selectedLicenseType = normalizeLicenseType(licenseType)
  const categories = ['law', 'safety', 'signs']
  let picked = []

  for (const cat of categories) {
    const pool = questionsData.filter((q) => {
      const matchesCategory = normalizeCategory(q.question_category) === cat
      if (!matchesCategory) return false

      if (cat === 'signs') return true

      const hasExplicitLicense = Boolean(q.license_category)
      if (!hasExplicitLicense) return true

      return normalizeLicenseType(q.license_category) === selectedLicenseType
    })

    const selected = shuffle(pool).slice(0, QUESTIONS_PER_CATEGORY)
    picked = picked.concat(selected.map((q) => normalizeQuestion(q, cat)))
  }

  return picked
}

// ─── ACTIONS ─────────────────────────────────────────────────────────────────
function startExam(license) {
  selectedLicense.value = normalizeLicenseType(license)
  questions.value = pickQuestions(selectedLicense.value)
  answers.value = {}
  currentIndex.value = 0
  phase.value = 'exam'
}

function selectAnswer(questionId, optionIndex) {
  if (answers.value[questionId] !== undefined) return
  answers.value[questionId] = optionIndex
}

function goTo(index) {
  currentIndex.value = index
}

function finishExam() {
  phase.value = 'result'
}

function restart() {
  selectedLicense.value = null
  questions.value = []
  phase.value = 'setup'
}

// ─── COMPUTED ────────────────────────────────────────────────────────────────
const currentQ = computed(() => questions.value[currentIndex.value])

function qText(q) {
  return {
    question: q?.questionText || '',
    options: q?.options || [],
    answer: q?.answerIndex ?? null,
  }
}

const answeredCount = computed(() => Object.keys(answers.value).length)

const score = computed(() => {
  let correct = 0
  for (const q of questions.value) {
    const chosen = answers.value[q.id]
    if (chosen !== undefined && chosen === q.answerIndex) correct++
  }
  return correct
})

const categoryScores = computed(() => {
  const cats = ['law', 'safety', 'signs']
  return cats.map((cat) => {
    const catQs = questions.value.filter((q) => q._category === cat)
    const correct = catQs.filter((q) => answers.value[q.id] === q.answerIndex).length
    return { cat, correct, total: catQs.length }
  })
})

const isPassed = computed(() => score.value >= Math.ceil(TOTAL_QUESTIONS * 0.7))

// ─── I18N LABELS (inline to avoid polluting existing locale files now) ───────
const ui = computed(() => {
  const labels = {
    en: {
      examTitle: 'Exam Simulator',
      chooseLicense: 'Choose Your License Category',
      car: 'Car',
      motorcycle: 'Motorcycle',
      catA: 'Category A',
      catB: 'Category B',
      startExam: 'Start Exam',
      question: 'Question',
      questionsPlural: 'questions',
      of: 'of',
      legal: 'Law',
      safety: 'Safety',
      signs: 'Signs',
      finish: 'Finish Exam',
      next: 'Next',
      prev: 'Previous',
      results: 'Your Results',
      passed: 'Passed ✓',
      failed: 'Failed ✗',
      yourScore: 'Your Score',
      breakdown: 'Category Breakdown',
      tryAgain: 'Try Again',
      unanswered: 'Unanswered',
      correct: 'Correct',
      wrong: 'Wrong',
      answered: 'answered',
    },
    fr: {
      examTitle: "Simulateur d'examen",
      chooseLicense: 'Choisissez votre catégorie de permis',
      car: 'Voiture',
      motorcycle: 'Moto',
      catA: 'Catégorie A',
      catB: 'Catégorie B',
      startExam: "Commencer l'examen",
      question: 'Question',
      questionsPlural: 'questions',
      of: 'sur',
      legal: 'Loi',
      safety: 'Sécurité',
      signs: 'Panneaux',
      finish: "Terminer l'examen",
      next: 'Suivant',
      prev: 'Précédent',
      results: 'Vos résultats',
      passed: 'Réussi ✓',
      failed: 'Échoué ✗',
      yourScore: 'Votre score',
      breakdown: 'Détail par catégorie',
      tryAgain: 'Réessayer',
      unanswered: 'Sans réponse',
      correct: 'Correct',
      wrong: 'Incorrect',
      answered: 'répondu(es)',
    },
    ar: {
      examTitle: 'محاكي الامتحان',
      chooseLicense: 'اختر فئة رخصتك',
      car: 'سيارة',
      motorcycle: 'دراجة نارية',
      catA: 'الفئة أ',
      catB: 'الفئة ب',
      startExam: 'ابدأ الامتحان',
      question: 'سؤال',
      questionsPlural: 'سؤالاً',
      of: 'من',
      legal: 'قانون',
      safety: 'السلامة',
      signs: 'الإشارات',
      finish: 'إنهاء الامتحان',
      next: 'التالي',
      prev: 'السابق',
      results: 'نتائجك',
      passed: 'ناجح ✓',
      failed: 'راسب ✗',
      yourScore: 'علامتك',
      breakdown: 'التفصيل حسب الفئة',
      tryAgain: 'حاول مجدداً',
      unanswered: 'بدون إجابة',
      correct: 'صحيح',
      wrong: 'خطأ',
      answered: 'مجاب',
    },
  }
  return labels[lang.value] || labels.en
})

const catLabel = computed(() => ({
  law: ui.value.legal,
  safety: ui.value.safety,
  signs: ui.value.signs,
}))

function questionStatus(q) {
  const answered = answers.value[q.id] !== undefined
  if (!answered) return 'unanswered'
  return answers.value[q.id] === q.answerIndex ? 'correct' : 'wrong'
}
</script>

<template>
  <section id="home" class="exam-section" :class="{ 'is-landing': phase === 'setup' }">

    <!-- ══════════════════════════════════════════════════════════════
         PHASE: SETUP — this doubles as the homepage landing view
    ══════════════════════════════════════════════════════════════ -->
    <div v-if="phase === 'setup'" class="landing-hero">
      <div class="hero-bg"><div class="road-lines"></div></div>

      <div class="container hero-inner">
        <p class="hero-eyebrow">{{ t.landing.eyebrow }}</p>
        <h1 class="hero-title">{{ t.landing.title }}</h1>
        <p class="hero-subtitle">{{ t.landing.subtitle }}</p>

        <div class="license-cards">
          <button class="license-card" @click="startExam('car')">
            <span class="plate-badge">B</span>
            <div class="license-icon" aria-hidden="true">🚗</div>
            <div class="license-info">
              <span class="license-name">{{ t.landing.car }}</span>
              <span class="license-sub">{{ t.landing.car_sub }}</span>
            </div>
            <span class="license-cta">
              {{ t.landing.start }}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </button>

          <button class="license-card" @click="startExam('motorcycle')">
            <span class="plate-badge">A</span>
            <div class="license-icon" aria-hidden="true">🏍️</div>
            <div class="license-info">
              <span class="license-name">{{ t.landing.motorcycle }}</span>
              <span class="license-sub">{{ t.landing.motorcycle_sub }}</span>
            </div>
            <span class="license-cta">
              {{ t.landing.start }}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </button>
        </div>

        <p class="hero-note">{{ TOTAL_QUESTIONS }} {{ ui.questionsPlural }} · {{ QUESTIONS_PER_CATEGORY }} {{ ui.legal }} · {{ QUESTIONS_PER_CATEGORY }} {{ ui.safety }} · {{ QUESTIONS_PER_CATEGORY }} {{ ui.signs }}</p>

        <div class="hero-footer-row">
          <p class="hero-trust">{{ t.landing.trust }}</p>
          <a :href="WHATSAPP_URL" target="_blank" rel="noopener" class="hero-whatsapp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.2h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2m0 1.67c2.24 0 4.35.87 5.94 2.46a8.23 8.23 0 012.42 5.85c0 4.56-3.71 8.27-8.37 8.27a8.3 8.3 0 01-4.22-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.27-4.4c0-4.56 3.72-8.32 8.29-8.32M8.53 6.9c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.13.16 1.76 2.83 4.38 3.86 2.17.86 2.61.69 3.08.65.47-.05 1.52-.62 1.73-1.22.22-.6.22-1.11.15-1.22-.06-.1-.23-.16-.48-.29-.25-.12-1.52-.75-1.75-.84-.24-.09-.41-.13-.58.13-.17.25-.66.83-.81 1-.15.17-.3.19-.55.06-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.44-.06-.12-.58-1.42-.81-1.94-.2-.5-.42-.44-.58-.45-.15 0-.32-.01-.49-.01Z"/>
            </svg>
            {{ t.landing.whatsapp_cta }}
          </a>
        </div>
      </div>

      <a href="#contact" class="scroll-hint" :aria-label="t.nav.contact">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </a>
    </div>

    <div v-else class="container exam-wrap">

    <!-- ── EYEBROW ── -->
    <p class="section-eyebrow">{{ ui.examTitle }}</p>

      <!-- ══════════════════════════════════════════════════════════════
           PHASE: EXAM
      ══════════════════════════════════════════════════════════════ -->
      <div v-if="phase === 'exam'" class="exam-panel">

        <!-- Progress bar + meta -->
        <div class="exam-meta">
          <span class="exam-counter">{{ ui.question }} {{ currentIndex + 1 }} {{ ui.of }} {{ TOTAL_QUESTIONS }}</span>
          <span class="exam-cat-badge" :class="currentQ._category">{{ catLabel[currentQ._category] }}</span>
          <span class="exam-answered">{{ answeredCount }} / {{ TOTAL_QUESTIONS }} {{ ui.answered }}</span>
        </div>

        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: (answeredCount / TOTAL_QUESTIONS * 100) + '%' }"></div>
        </div>

        <!-- Question card -->
        <div class="question-card" v-if="currentQ">
          <!-- Optional sign image -->
          <div v-if="currentQ.image" class="sign-image-wrapper">
            <img :src="currentQ.image" :alt="ui.signs" class="sign-image" loading="lazy" />
          </div>

          <p class="question-text">{{ qText(currentQ).question }}</p>

          <!-- Options -->
          <div class="options-list">
            <button
              v-for="(option, idx) in qText(currentQ).options"
              :key="`${currentQ.id}-${option.letter}`"
              class="option-btn"
              :class="{
                selected: answers[currentQ.id] === idx,
                correct: answers[currentQ.id] !== undefined && idx === qText(currentQ).answer,
                wrong: answers[currentQ.id] === idx && idx !== qText(currentQ).answer,
                disabled: answers[currentQ.id] !== undefined,
              }"
              @click="selectAnswer(currentQ.id, idx)"
            >
              <span class="option-letter">{{ option.letter }}</span>
              <span class="option-text">{{ option.text }}</span>
              <span v-if="answers[currentQ.id] !== undefined && idx === qText(currentQ).answer" class="option-icon">✓</span>
              <span v-else-if="answers[currentQ.id] === idx && idx !== qText(currentQ).answer" class="option-icon">✗</span>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="exam-nav">
          <button class="nav-btn secondary" :disabled="currentIndex === 0" @click="goTo(currentIndex - 1)">
            ← {{ ui.prev }}
          </button>

          <div class="question-dots">
            <button
              v-for="(q, i) in questions"
              :key="q.id"
              class="dot"
              :class="[questionStatus(q), { active: i === currentIndex }]"
              @click="goTo(i)"
              :title="`Q${i + 1}`"
            ></button>
          </div>

          <button
            v-if="currentIndex < TOTAL_QUESTIONS - 1"
            class="nav-btn primary"
            @click="goTo(currentIndex + 1)"
          >
            {{ ui.next }} →
          </button>
          <button
            v-else
            class="nav-btn finish"
            @click="finishExam"
          >
            {{ ui.finish }}
          </button>
        </div>

      </div>

      <!-- ══════════════════════════════════════════════════════════════
           PHASE: RESULT
      ══════════════════════════════════════════════════════════════ -->
      <div v-else-if="phase === 'result'" class="result-panel">
        <h2 class="section-title">{{ ui.results }}</h2>

        <div class="score-circle" :class="isPassed ? 'passed' : 'failed'">
          <span class="score-num">{{ score }}</span>
          <span class="score-denom">/ {{ TOTAL_QUESTIONS }}</span>
          <span class="score-label">{{ isPassed ? ui.passed : ui.failed }}</span>
        </div>

        <div class="breakdown">
          <h3 class="breakdown-title">{{ ui.breakdown }}</h3>
          <div class="breakdown-grid">
            <div v-for="cs in categoryScores" :key="cs.cat" class="breakdown-item">
              <span class="breakdown-cat">{{ catLabel[cs.cat] }}</span>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar" :style="{ width: (cs.correct / cs.total * 100) + '%' }"></div>
              </div>
              <span class="breakdown-score">{{ cs.correct }} / {{ cs.total }}</span>
            </div>
          </div>
        </div>

        <!-- Per-question review -->
        <div class="review-list">
          <div
            v-for="(q, i) in questions"
            :key="q.id"
            class="review-item"
            :class="answers[q.id] === qText(q).answer ? 'review-correct' : 'review-wrong'"
          >
            <span class="review-num">{{ i + 1 }}</span>
            <span class="review-cat-dot" :class="q._category"></span>
            <span class="review-q">{{ q.questionText.slice(0, 70) }}{{ q.questionText.length > 70 ? '…' : '' }}</span>
            <span class="review-icon">{{ answers[q.id] === q.answerIndex ? '✓' : '✗' }}</span>
          </div>
        </div>

        <button class="restart-btn" @click="restart">{{ ui.tryAgain }}</button>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ── Section wrapper ─────────────────────────────────────────────── */
.exam-section {
  background: #0d0d0d;
}

.exam-section.is-landing {
  background: #0a0a0a;
}

.exam-wrap {
  padding: 5rem 0;
}

.section-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ffc800;
  margin: 0 0 0.75rem;
  text-align: center;
}

.section-title {
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  color: #fff;
  margin: 0 0 2.5rem;
  text-align: center;
}

/* ── LANDING HERO (setup phase) ─────────────────────────────────── */
.landing-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-top: 72px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.road-lines {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 30px,
      rgba(255, 255, 255, 0.035) 30px,
      rgba(255, 255, 255, 0.035) 60px
    ),
    radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255, 200, 0, 0.07) 0%, transparent 70%);
}

.hero-inner {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 760px;
  padding: 2.5rem 0 3.5rem;
}

.hero-eyebrow {
  display: inline-block;
  background: rgba(255, 200, 0, 0.1);
  border: 1px solid rgba(255, 200, 0, 0.3);
  color: #ffc800;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  margin-bottom: 1.75rem;
  text-transform: uppercase;
}

.hero-title {
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: clamp(2.6rem, 6.5vw, 4.75rem);
  color: #fff;
  line-height: 1.05;
  letter-spacing: 0.01em;
  margin: 0 0 1.1rem;
}

.hero-title::first-letter {
  color: #ffc800;
}

[dir='rtl'] .hero-title {
  font-family: 'Tajawal', 'Cairo', sans-serif;
  letter-spacing: 0;
}

[dir='rtl'] .hero-title::first-letter {
  color: #fff;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: rgba(255, 255, 255, 0.62);
  margin: 0 auto 2.5rem;
  max-width: 520px;
  line-height: 1.65;
}

/* License selector — styled like a small vehicle-category plate: the
   letter badge mirrors the real A/B category markings used on Lebanese
   driving licenses, so the control reads as "this school's" rather than
   a generic card grid. */
.license-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.1rem;
  margin-bottom: 1.5rem;
  max-width: 560px;
  margin-inline: auto;
}

.license-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 1.4rem 1.25rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.15s, box-shadow 0.2s;
  color: #fff;
  text-align: left;
}

[dir='rtl'] .license-card { text-align: right; }

.license-card:hover,
.license-card:focus-visible {
  border-color: #ffc800;
  background: rgba(255, 200, 0, 0.07);
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35);
}

.license-card:focus-visible {
  outline: 2px solid #ffc800;
  outline-offset: 3px;
}

.plate-badge {
  position: absolute;
  top: -10px;
  inset-inline-start: -10px;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #ffc800;
  color: #0a0a0a;
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
  border: 2px solid #0a0a0a;
}

.license-icon {
  font-size: 2.1rem;
  flex-shrink: 0;
}

.license-info {
  flex: 1;
  min-width: 0;
}

.license-name {
  display: block;
  font-weight: 700;
  font-size: 1.05rem;
}

.license-sub {
  display: block;
  font-size: 0.78rem;
  color: #ffc800;
  margin-top: 0.2rem;
}

.license-cta {
  display: none;
}

.license-card:hover .license-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: #ffc800;
  flex-shrink: 0;
}

.hero-note {
  text-align: center;
  color: rgba(255, 255, 255, 0.38);
  font-size: 0.82rem;
  margin-bottom: 2.25rem;
}

.hero-footer-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
}

.hero-trust {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.85rem;
  margin: 0;
}

.hero-whatsapp {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(37, 211, 102, 0.12);
  border: 1px solid rgba(37, 211, 102, 0.3);
  color: #4ade80;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.7rem 1.4rem;
  border-radius: 999px;
  transition: background 0.2s, transform 0.2s;
}

.hero-whatsapp:hover {
  background: rgba(37, 211, 102, 0.22);
  transform: translateY(-2px);
}

.scroll-hint {
  position: absolute;
  bottom: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.35);
  animation: bounce 2s infinite;
  z-index: 2;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-hint { animation: none; }
}

@media (max-width: 600px) {
  .landing-hero { padding-top: 88px; }
  .license-cards { grid-template-columns: 1fr; max-width: 380px; }
}

/* ── EXAM PANEL ──────────────────────────────────────────────────── */
.exam-panel {
  max-width: 740px;
  margin: 0 auto;
}

.exam-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.exam-counter {
  font-weight: 700;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.exam-cat-badge {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}

.exam-cat-badge.legal   { background: rgba(99,  102, 241, 0.25); color: #a5b4fc; }
.exam-cat-badge.safety  { background: rgba(234, 179,   8, 0.2);  color: #fde047; }
.exam-cat-badge.signs   { background: rgba(16,  185, 129, 0.2);  color: #6ee7b7; }

.exam-answered {
  margin-left: auto;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

[dir='rtl'] .exam-answered { margin-left: 0; margin-right: auto; }

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ffc800;
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Question card */
.question-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.sign-image-wrapper {
  text-align: center;
  margin-bottom: 1.25rem;
}

.sign-image {
  max-width: 140px;
  max-height: 140px;
  object-fit: contain;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.5rem;
}

.question-text {
  font-size: 1.05rem;
  line-height: 1.65;
  color: #fff;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

/* Options */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.92rem;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;
  width: 100%;
}

[dir='rtl'] .option-btn { text-align: right; }

.option-btn:hover:not(.disabled) {
  border-color: #ffc800;
  background: rgba(255, 200, 0, 0.06);
}

.option-btn.disabled { cursor: default; }

.option-btn.correct {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.12);
  color: #86efac;
}

.option-btn.wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
}

.option-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.6);
}

.option-btn.correct .option-letter { background: rgba(34, 197, 94, 0.2); color: #86efac; }
.option-btn.wrong   .option-letter { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }

.option-text { flex: 1; }

.option-icon {
  font-weight: 700;
  font-size: 1rem;
  margin-left: auto;
}
[dir='rtl'] .option-icon { margin-left: 0; margin-right: auto; }

/* Navigation */
.exam-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: background 0.15s;
  flex-shrink: 0;
}

.nav-btn.primary {
  background: rgba(255, 200, 0, 0.15);
  color: #ffc800;
}
.nav-btn.primary:hover { background: rgba(255, 200, 0, 0.25); }

.nav-btn.secondary {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.6);
}
.nav-btn.secondary:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); color: #fff; }
.nav-btn.secondary:disabled { opacity: 0.3; cursor: default; }

.nav-btn.finish {
  background: #ffc800;
  color: #0a0a0a;
}
.nav-btn.finish:hover { background: #ffd740; }

/* Question dots */
.question-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.12);
  transition: background 0.15s, transform 0.15s;
  padding: 0;
}
.dot.active       { transform: scale(1.4); background: #ffc800; }
.dot.correct      { background: #22c55e; }
.dot.wrong        { background: #ef4444; }
.dot.unanswered   { background: rgba(255, 255, 255, 0.15); }

/* ── RESULT PANEL ────────────────────────────────────────────────── */
.result-panel {
  max-width: 620px;
  margin: 0 auto;
  text-align: center;
}

.score-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 4px solid;
  margin: 0 auto 2.5rem;
}

.score-circle.passed { border-color: #22c55e; }
.score-circle.failed { border-color: #ef4444; }

.score-num {
  font-size: 2.8rem;
  font-weight: 900;
  line-height: 1;
}
.score-denom { font-size: 1rem; color: rgba(255,255,255,0.5); }
.score-label { font-size: 0.85rem; font-weight: 700; margin-top: 0.25rem; letter-spacing: 0.06em; }
.score-circle.passed .score-label { color: #22c55e; }
.score-circle.failed .score-label { color: #ef4444; }

/* Breakdown */
.breakdown { margin-bottom: 2rem; text-align: left; }
[dir='rtl'] .breakdown { text-align: right; }

.breakdown-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.75rem;
}

.breakdown-grid { display: flex; flex-direction: column; gap: 0.6rem; }

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.breakdown-cat {
  width: 70px;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  flex-shrink: 0;
}

.breakdown-bar-wrap {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  overflow: hidden;
}

.breakdown-bar {
  height: 100%;
  background: #ffc800;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.breakdown-score {
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  width: 40px;
  text-align: right;
}
[dir='rtl'] .breakdown-score { text-align: left; }

/* Review list */
.review-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 2rem;
  text-align: left;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}
[dir='rtl'] .review-list { text-align: right; padding-right: 0; padding-left: 4px; }

.review-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.82rem;
}

.review-correct { background: rgba(34, 197, 94, 0.08); }
.review-wrong   { background: rgba(239, 68, 68, 0.08); }

.review-num {
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255,255,255,0.3);
  width: 18px;
  flex-shrink: 0;
}

.review-cat-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.review-cat-dot.legal   { background: #a5b4fc; }
.review-cat-dot.safety  { background: #fde047; }
.review-cat-dot.signs   { background: #6ee7b7; }

.review-q { flex: 1; color: rgba(255,255,255,0.65); }

.review-icon {
  font-weight: 700;
  flex-shrink: 0;
}
.review-correct .review-icon { color: #22c55e; }
.review-wrong   .review-icon { color: #ef4444; }

.restart-btn {
  background: #ffc800;
  color: #0a0a0a;
  border: none;
  border-radius: 10px;
  padding: 0.85rem 2.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.restart-btn:hover { background: #ffd740; }

/* ── Scrollbar tint ──────────────────────────────────────────────── */
.review-list::-webkit-scrollbar       { width: 4px; }
.review-list::-webkit-scrollbar-track { background: transparent; }
.review-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

/* ── Mobile ──────────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .question-card { padding: 1.25rem; }
  .exam-nav { flex-wrap: wrap; justify-content: space-between; }
  .question-dots { order: 3; width: 100%; }
  .license-cards { grid-template-columns: 1fr; }
}
</style>
