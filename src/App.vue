<script setup>
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import HomePage from '@/pages/HomePage.vue'
import { useI18n } from '@/composables/useI18n.js'

const { isRTL } = useI18n()
</script>

<template>
  <div :class="{ rtl: isRTL }">
    <NavBar />
    <HomePage />
    <FooterSection />
  </div>
</template>

<style>
/* ── Global reset & base ─────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  background: #0a0a0a;
  color: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Container */
.container {
  width: min(1160px, 100% - 2.5rem);
  margin-inline: auto;
}

/* Section spacing */
.section {
  padding: 5rem 0;
}

[dir='rtl'] body {
  font-family: 'Tajawal', 'Cairo', 'Segoe UI', system-ui, sans-serif;
}
</style>
