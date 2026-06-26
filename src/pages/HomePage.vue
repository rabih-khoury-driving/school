<script setup>
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import ContactSection from '@/components/ContactSection.vue'
</script>

<template>
  <main>
    <HeroSection />
    <AboutSection />
    <ServicesSection />

    <!-- Exam simulator placeholder — will be built next -->
    <section id="exam" class="exam-placeholder section">
      <div class="container">
        <p class="section-eyebrow">Coming soon</p>
        <h2 class="section-title">Exam Simulator</h2>
        <p class="placeholder-text">
          The interactive exam simulator is under construction. It will let you
          practice 30 MCQ questions per license category in English, French, or
          Arabic.
        </p>
      </div>
    </section>

    <ContactSection />
  </main>
</template>

<style scoped>
/* Exam placeholder */
.exam-placeholder {
  background: #0a0a0a;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
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
  margin: 0 0 1rem;
}

.placeholder-text {
  color: rgba(255, 255, 255, 0.45);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.7;
  font-size: 0.95rem;
}
</style>
