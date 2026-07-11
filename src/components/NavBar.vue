<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from '@/composables/useI18n.js'
import { WHATSAPP_URL } from '@/constants/contact.js'

const { t, lang, setLang } = useI18n()
const menuOpen = ref(false)
const langOpen = ref(false)
const navRoot = ref(null)
const BASE_URL = import.meta.env.BASE_URL

// Language names are always written in their own script, regardless of the
// currently active language — so someone who can't read the current UI
// language can still recognize and pick their own.
const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
]

const currentLangLabel = () => languages.find((l) => l.code === lang.value)?.label || 'English'

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  langOpen.value = false
}

function closeMenu() {
  menuOpen.value = false
}

function toggleLang() {
  langOpen.value = !langOpen.value
}

function chooseLang(code) {
  setLang(code)
  langOpen.value = false
  menuOpen.value = false
}

function handleClickOutside(e) {
  if (navRoot.value && !navRoot.value.contains(e.target)) {
    langOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <header class="navbar" ref="navRoot">
    <div class="navbar-inner container">
      <!-- Logo + Name -->
      <a href="#home" class="brand" @click="closeMenu">
        <img :src="`${BASE_URL}logo.png`" alt="Rabih Driving School Logo" class="brand-logo" />
        <div class="brand-text">
          <span class="brand-name">Rabih Driving School</span>
          <span class="brand-sub">مدرسة ربيع الخوري</span>
        </div>
      </a>

      <!-- Desktop Nav -->
      <nav class="nav-links" :class="{ open: menuOpen }">
        <a href="#home" @click="closeMenu">{{ t.nav.exam }}</a>
        <a href="#contact" @click="closeMenu">{{ t.nav.contact }}</a>

        <a dir="ltr" :href="WHATSAPP_URL" target="_blank" rel="noopener" class="nav-whatsapp" @click="closeMenu">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.2h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2m0 1.67c2.24 0 4.35.87 5.94 2.46a8.23 8.23 0 012.42 5.85c0 4.56-3.71 8.27-8.37 8.27a8.3 8.3 0 01-4.22-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.27-4.4c0-4.56 3.72-8.32 8.29-8.32M8.53 6.9c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.13.16 1.76 2.83 4.38 3.86 2.17.86 2.61.69 3.08.65.47-.05 1.52-.62 1.73-1.22.22-.6.22-1.11.15-1.22-.06-.1-.23-.16-.48-.29-.25-.12-1.52-.75-1.75-.84-.24-.09-.41-.13-.58.13-.17.25-.66.83-.81 1-.15.17-.3.19-.55.06-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.44-.06-.12-.58-1.42-.81-1.94-.2-.5-.42-.44-.58-.45-.15 0-.32-.01-.49-.01Z"/>
          </svg>
          {{ t.contact.phone_display }}
        </a>
      </nav>

      <!-- Right side: lang switcher + hamburger -->
      <div class="nav-right">
        <div class="lang-switcher">
          <button
            type="button"
            class="lang-current"
            @click.stop="toggleLang"
            :aria-expanded="langOpen"
            aria-haspopup="listbox"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9"/>
              <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z"/>
            </svg>
            <span>{{ currentLangLabel() }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="chevron" :class="{ open: langOpen }">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          <ul class="lang-menu" v-show="langOpen" role="listbox">
            <li v-for="l in languages" :key="l.code">
              <button
                type="button"
                class="lang-option"
                :class="{ active: lang === l.code }"
                role="option"
                :aria-selected="lang === l.code"
                @click="chooseLang(l.code)"
              >
                {{ l.label }}
                <svg v-if="lang === l.code" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <button class="hamburger" @click="toggleMenu" :aria-label="menuOpen ? 'Close menu' : 'Open menu'">
          <span :class="{ open: menuOpen }"></span>
          <span :class="{ open: menuOpen }"></span>
          <span :class="{ open: menuOpen }"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(11, 12, 14, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 200, 0, 0.15);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 1rem;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 6px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-name {
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: 1.1rem;
  letter-spacing: 0.06em;
  color: #ffc800;
}

.brand-sub {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Tajawal', 'Segoe UI', sans-serif;
}

/* Nav links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: color 0.2s, background 0.2s;
}

.nav-links a:hover {
  color: #ffc800;
  background: rgba(255, 200, 0, 0.08);
}

.nav-whatsapp {
  display: inline-flex !important;
  align-items: center;
  gap: 0.45rem;
  background: rgba(37, 211, 102, 0.12) !important;
  color: #4ade80 !important;
  margin-inline-start: 0.35rem;
  font-weight: 700 !important;
}

.nav-whatsapp:hover {
  background: rgba(37, 211, 102, 0.22) !important;
  color: #6ee7a0 !important;
}

/* Right side */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
  position: relative;
}

/* Language switcher — deliberately larger and more legible than a tiny
   EN/FR code toggle, using each language's own native name so it is
   self-explanatory no matter which language is currently active. */
.lang-switcher {
  position: relative;
}

.lang-current {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.lang-current:hover {
  border-color: #ffc800;
  background: rgba(255, 200, 0, 0.08);
}

.lang-current svg:first-child {
  color: #ffc800;
  flex-shrink: 0;
}

.chevron {
  transition: transform 0.2s;
  flex-shrink: 0;
}

.chevron.open {
  transform: rotate(180deg);
}

.lang-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 168px;
  background: #17181c;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 0.4rem;
  list-style: none;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
}

[dir='rtl'] .lang-menu {
  right: auto;
  left: 0;
}

.lang-option {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  padding: 0.6rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.lang-option:hover {
  background: rgba(255, 200, 0, 0.1);
  color: #fff;
}

.lang-option.active {
  color: #ffc800;
  background: rgba(255, 200, 0, 0.08);
}

.lang-option svg {
  flex-shrink: 0;
  color: #ffc800;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: transform 0.25s, opacity 0.25s;
  transform-origin: center;
}

.hamburger span.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger span.open:nth-child(2) { opacity: 0; }
.hamburger span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    background: rgba(11, 12, 14, 0.98);
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 0.3rem;
    border-bottom: 1px solid rgba(255, 200, 0, 0.1);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links a {
    padding: 0.85rem 1rem;
    font-size: 1rem;
  }

  .nav-whatsapp {
    margin-inline-start: 0;
    justify-content: center;
  }

  .brand-sub {
    display: none;
  }

  .lang-current span {
    display: none;
  }

  .lang-current {
    padding: 0.5rem 0.6rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chevron, .hamburger span {
    transition: none;
  }
}
</style>
