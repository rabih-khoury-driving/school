<script setup>
import { useI18n } from '@/composables/useI18n.js'
const { t } = useI18n()
</script>

<template>
  <section id="contact" class="contact section">
    <div class="container">
      <p class="section-eyebrow">{{ t.nav.contact }}</p>
      <h2 class="section-title">{{ t.contact.title }}</h2>

      <div class="contact-grid">
        <!-- Info cards -->
        <div class="contact-info">
          <div class="info-card">
            <div class="info-icon">📍</div>
            <div>
              <div class="info-label">{{ t.contact.title }}</div>
              <div class="info-value">{{ t.contact.address }}</div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">📞</div>
            <div>
              <div class="info-label">{{ t.contact.phone }}</div>
              <a href="tel:+96170123456" class="info-value phone">+961 70 123 456</a>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">🕐</div>
            <div>
              <div class="info-label">{{ t.contact.hours }}</div>
              <div class="info-value">{{ t.contact.hours_val }}</div>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=Dekwaneh,+Lebanon"
            target="_blank"
            rel="noopener"
            class="directions-btn"
          >
            {{ t.contact.get_directions }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>

        <!-- Map embed -->
        <div class="map-wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.5!2d35.5616!3d33.8869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17c3c1c3c3c3%3A0x0!2sDekwaneh%2C+Lebanon!5e0!3m2!1sen!2slb!4v1700000000000"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Rabih Driving School location"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  background: #111;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
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
  margin: 0 0 3rem;
  line-height: 1.1;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 2rem;
  align-items: start;
}

/* Info cards */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: border-color 0.2s;
}

.info-card:hover {
  border-color: rgba(255, 200, 0, 0.25);
}

.info-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.3rem;
}

.info-value {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
}

.info-value.phone {
  color: #ffc800;
  font-weight: 700;
  font-size: 1.05rem;
}

.info-value.phone:hover {
  text-decoration: underline;
}

.directions-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffc800;
  color: #0a0a0a;
  padding: 0.85rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  transition: background 0.2s, transform 0.2s;
  align-self: flex-start;
  margin-top: 0.5rem;
}

.directions-btn:hover {
  background: #ffd740;
  transform: translateY(-2px);
}

/* Map */
.map-wrapper {
  border-radius: 16px;
  overflow: hidden;
  height: 380px;
  border: 1px solid rgba(255, 255, 255, 0.07);
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .map-wrapper {
    height: 280px;
  }
}

[dir='rtl'] .section-title {
  font-family: 'Tajawal', 'Cairo', sans-serif;
  letter-spacing: 0;
}
</style>
