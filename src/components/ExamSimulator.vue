<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/composables/useI18n.js'
import questionsData from '@/data/questions_new_format.json'

const { lang } = useI18n()

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
  if (trimmed.startsWith('/')) return trimmed

  return `/${trimmed.replace(/^\.?\//, '')}`
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
  <section id="exam" class="exam-section section">
    <div class="container">

      <!-- ── EYEBROW ── -->
      <p class="section-eyebrow">{{ ui.examTitle }}</p>

      <!-- ══════════════════════════════════════════════════════════════
           PHASE: SETUP
      ══════════════════════════════════════════════════════════════ -->
      <div v-if="phase === 'setup'" class="setup-panel">
        <h2 class="section-title">{{ ui.chooseLicense }}</h2>

        <div class="license-cards">
          <button class="license-card" @click="startExam('car')">
            <div class="license-icon">🚗</div>
            <div class="license-info">
              <span class="license-name">{{ ui.car }}</span>
              <span class="license-sub">{{ ui.catB }}</span>
            </div>
          </button>

          <button class="license-card" @click="startExam('motorcycle')">
            <div class="license-icon">🏍️</div>
            <div class="license-info">
              <span class="license-name">{{ ui.motorcycle }}</span>
              <span class="license-sub">{{ ui.catA }}</span>
            </div>
          </button>
        </div>

        <p class="setup-note">{{ TOTAL_QUESTIONS }} questions · {{ QUESTIONS_PER_CATEGORY }} {{ ui.legal }} · {{ QUESTIONS_PER_CATEGORY }} {{ ui.safety }} · {{ QUESTIONS_PER_CATEGORY }} {{ ui.signs }}</p>
      </div>

      <!-- ══════════════════════════════════════════════════════════════
           PHASE: EXAM
      ══════════════════════════════════════════════════════════════ -->
      <div v-else-if="phase === 'exam'" class="exam-panel">

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
  border-top: 1px solid rgba(255, 255, 255, 0.05);
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

/* ── SETUP ───────────────────────────────────────────────────────── */
.setup-panel {
  max-width: 740px;
  margin: 0 auto;
}

.license-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.license-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 1.5rem 1.25rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
  color: #fff;
  text-align: left;
}

[dir='rtl'] .license-card { text-align: right; }

.license-card:hover {
  border-color: #ffc800;
  background: rgba(255, 200, 0, 0.06);
  transform: translateY(-2px);
}

.license-icon {
  font-size: 2.25rem;
  flex-shrink: 0;
}

.license-name {
  display: block;
  font-weight: 700;
  font-size: 1rem;
}

.license-sub {
  display: block;
  font-size: 0.78rem;
  color: #ffc800;
  margin-top: 0.2rem;
}

.setup-note {
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.82rem;
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
