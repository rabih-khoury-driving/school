<script setup>
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n.js'

const { t, lang, setLang } = useI18n()
const menuOpen = ref(false)
const BASE_URL = import.meta.env.BASE_URL

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'ع' },
]

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="navbar">
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
        <a href="#home" @click="closeMenu">{{ t.nav.home }}</a>
        <a href="#about" @click="closeMenu">{{ t.nav.about }}</a>
        <a href="#services" @click="closeMenu">{{ t.nav.resources }}</a>
        <a href="#contact" @click="closeMenu">{{ t.nav.contact }}</a>
        <a href="#exam" class="nav-cta" @click="closeMenu">{{ t.nav.exam }}</a>
      </nav>

      <!-- Right side: lang switcher + hamburger -->
      <div class="nav-right">
        <div class="lang-switcher">
          <button
            v-for="l in languages"
            :key="l.code"
            :class="['lang-btn', { active: lang === l.code }]"
            @click="setLang(l.code)"
          >
            {{ l.label }}
          </button>
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
  background: rgba(10, 10, 10, 0.95);
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
  width: 48px;
  height: 48px;
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
  font-size: 1.15rem;
  letter-spacing: 0.06em;
  color: #ffc800;
}

.brand-sub {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.55);
  font-family: 'Segoe UI', sans-serif;
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
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s, background 0.2s;
}

.nav-links a:hover {
  color: #ffc800;
  background: rgba(255, 200, 0, 0.08);
}

.nav-links .nav-cta {
  background: #ffc800;
  color: #0a0a0a;
  font-weight: 700;
  margin-left: 0.5rem;
}

.nav-links .nav-cta:hover {
  background: #ffd740;
  color: #0a0a0a;
}

/* Right side */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* Language switcher */
.lang-switcher {
  display: flex;
  gap: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 3px;
}

.lang-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  transition: all 0.2s;
  letter-spacing: 0.04em;
}

.lang-btn.active {
  background: #ffc800;
  color: #0a0a0a;
}

.lang-btn:hover:not(.active) {
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
    background: rgba(10, 10, 10, 0.98);
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 0.25rem;
    border-bottom: 1px solid rgba(255, 200, 0, 0.1);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links a {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }

  .nav-links .nav-cta {
    text-align: center;
    margin-left: 0;
    margin-top: 0.5rem;
  }

  .brand-sub {
    display: none;
  }
}

/* RTL adjustments */
[dir='rtl'] .nav-links .nav-cta {
  margin-left: 0;
  margin-right: 0.5rem;
}
</style>
