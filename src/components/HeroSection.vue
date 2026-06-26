<script setup>
import { useI18n } from '@/composables/useI18n.js'
const { t } = useI18n()
</script>

<template>
  <section id="home" class="hero">
    <!-- Background grid overlay -->
    <div class="hero-bg">
      <div class="road-lines"></div>
    </div>

    <div class="container hero-content">
      <div class="hero-badge">🇱🇧 Dekwaneh, Lebanon</div>

      <h1 class="hero-title">{{ t.hero.tagline }}</h1>
      <p class="hero-subtitle">{{ t.hero.subtitle }}</p>

      <div class="hero-phone">
        <a href="tel:+96170123456" class="phone-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
          +961 70 123 456
        </a>
      </div>

      <div class="hero-actions">
        <a href="#exam" class="btn-primary">
          {{ t.hero.cta_exam }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="#contact" class="btn-secondary">
          {{ t.hero.cta_location }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-hint">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0a0a0a;
  padding-top: 72px;
}

/* Decorative background */
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.road-lines {
  position: absolute;
  inset: 0;
  background-image:
    /* Center dashed white line */
    repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 30px,
      rgba(255, 255, 255, 0.04) 30px,
      rgba(255, 255, 255, 0.04) 60px
    ),
    /* Radial glow */
    radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255, 200, 0, 0.06) 0%, transparent 70%);
}

/* Hero content */
.hero-content {
  text-align: center;
  position: relative;
  z-index: 2;
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 200, 0, 0.1);
  border: 1px solid rgba(255, 200, 0, 0.3);
  color: #ffc800;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  margin-bottom: 2rem;
  text-transform: uppercase;
}

.hero-title {
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: clamp(2.8rem, 7vw, 5.5rem);
  color: #fff;
  line-height: 1.05;
  letter-spacing: 0.02em;
  margin: 0 0 1.25rem;
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
}

.hero-title::first-letter {
  color: #ffc800;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.6);
  margin: 0 auto 2rem;
  max-width: 480px;
  line-height: 1.6;
}

/* Phone */
.hero-phone {
  margin-bottom: 2.5rem;
}

.phone-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffc800;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: opacity 0.2s;
}

.phone-link:hover {
  opacity: 0.8;
}

/* CTA buttons */
.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #ffc800;
  color: #0a0a0a;
}

.btn-primary:hover {
  background: #ffd740;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 200, 0, 0.35);
}

.btn-secondary {
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
}

.btn-secondary:hover {
  border-color: #ffc800;
  color: #ffc800;
  transform: translateY(-2px);
}

/* Scroll hint */
.scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.3);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

/* RTL */
[dir='rtl'] .hero-title {
  font-family: 'Tajawal', 'Cairo', sans-serif;
  letter-spacing: 0;
}
</style>
