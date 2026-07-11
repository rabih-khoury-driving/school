import { ref, computed, readonly } from 'vue'
import en from '@/locales/en.js'
import fr from '@/locales/fr.js'
import ar from '@/locales/ar.js'

const locales = { en, fr, ar }

const savedLang = localStorage.getItem('rds_lang') || 'en'
const currentLang = ref(savedLang)

export function useI18n() {
  const t = computed(() => locales[currentLang.value] || locales.en)

  const isRTL = computed(() => currentLang.value === 'ar')

  function setLang(lang) {
    if (locales[lang]) {
      currentLang.value = lang
      localStorage.setItem('rds_lang', lang)
      document.documentElement.lang = lang
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    }
  }

  // Apply on first call
  document.documentElement.lang = currentLang.value
  document.documentElement.dir = currentLang.value === 'ar' ? 'rtl' : 'ltr'

  return {
    lang: readonly(currentLang),
    t,
    isRTL,
    setLang,
  }
}
