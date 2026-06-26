<script setup>
import { useI18n } from '@/composables/useI18n.js'
const { t } = useI18n()

const stats = [
  { key: 'years', value: '15+' },
  { key: 'students', value: '2000+' },
  { key: 'categories', value: '3' },
]
</script>

<template>
  <section id="about" class="about section">
    <div class="container">
      <div class="about-grid">
        <!-- Text -->
        <div class="about-text">
          <p class="section-eyebrow">{{ t.nav.about }}</p>
          <h2 class="section-title">{{ t.about.title }}</h2>
          <p class="about-desc">{{ t.about.description }}</p>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.key" class="stat-card">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ t.about[stat.key] }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background: #111;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.section-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ffc800;
  margin: 0 0 0.75rem;
}

.section-title {
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  color: #fff;
  margin: 0 0 1.25rem;
  line-height: 1.1;
}

.about-desc {
  color: rgba(255, 255, 255, 0.65);
  font-size: 1rem;
  line-height: 1.8;
  margin: 0;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: border-color 0.2s, background 0.2s;
}

.stat-card:hover {
  border-color: rgba(255, 200, 0, 0.3);
  background: rgba(255, 200, 0, 0.04);
}

.stat-value {
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: 2.5rem;
  color: #ffc800;
  line-height: 1;
  min-width: 80px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

[dir='rtl'] .section-title {
  font-family: 'Tajawal', 'Cairo', sans-serif;
  letter-spacing: 0;
}
</style>
