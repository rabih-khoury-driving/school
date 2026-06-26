<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n.js'
const { t } = useI18n()

const categories = computed(() => [
  {
    icon: '🏍️',
    key: 'motorcycle',
    color: '#ff6b35',
  },
  {
    icon: '🚗',
    key: 'private',
    color: '#ffc800',
  },
  {
    icon: '🚌',
    key: 'public',
    color: '#4ade80',
  },
])
</script>

<template>
  <section id="services" class="services section">
    <div class="container">
      <p class="section-eyebrow">{{ t.nav.exam }}</p>
      <h2 class="section-title">{{ t.services.title }}</h2>

      <div class="categories-grid">
        <div
          v-for="cat in categories"
          :key="cat.key"
          class="cat-card"
          :style="{ '--accent': cat.color }"
        >
          <div class="cat-icon">{{ cat.icon }}</div>
          <h3 class="cat-name">{{ t.services[cat.key] }}</h3>
          <p class="cat-desc">{{ t.services[cat.key + '_desc'] }}</p>
          <a href="#exam" class="cat-link">
            {{ t.hero.cta_exam }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  background: #0a0a0a;
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
  margin: 0 0 3rem;
  line-height: 1.1;
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.cat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.cat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
  border-radius: 16px 16px 0 0;
  opacity: 0;
  transition: opacity 0.2s;
}

.cat-card:hover {
  border-color: var(--accent, rgba(255, 200, 0, 0.3));
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.cat-card:hover::before {
  opacity: 1;
}

.cat-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.cat-name {
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
  letter-spacing: 0.04em;
}

.cat-desc {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.cat-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--accent);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: gap 0.2s;
}

.cat-link:hover {
  gap: 0.7rem;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}

[dir='rtl'] .section-title,
[dir='rtl'] .cat-name {
  font-family: 'Tajawal', 'Cairo', sans-serif;
  letter-spacing: 0;
}

[dir='rtl'] .cat-link svg {
  transform: scaleX(-1);
}
</style>
