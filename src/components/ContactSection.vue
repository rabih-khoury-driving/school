<script setup>
import { useI18n } from '@/composables/useI18n.js'
import { PHONE_DISPLAY, WHATSAPP_URL } from '@/constants/contact.js'
const { t } = useI18n()
</script>

<template>
  <section id="contact" class="contact section">
    <div class="container">
      <p class="section-eyebrow">{{ t.contact.eyebrow }}</p>
      <h2 class="section-title">{{ t.contact.title }}</h2>

      <div class="contact-grid">
        <!-- Info cards -->
        <div class="contact-info">
          <div class="info-card">
            <div class="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <div class="info-label">{{ t.contact.address_label }}</div>
              <div class="info-value">{{ t.contact.address }}</div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon whatsapp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.2h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2m0 1.67c2.24 0 4.35.87 5.94 2.46a8.23 8.23 0 012.42 5.85c0 4.56-3.71 8.27-8.37 8.27a8.3 8.3 0 01-4.22-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.27-4.4c0-4.56 3.72-8.32 8.29-8.32M8.53 6.9c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.13.16 1.76 2.83 4.38 3.86 2.17.86 2.61.69 3.08.65.47-.05 1.52-.62 1.73-1.22.22-.6.22-1.11.15-1.22-.06-.1-.23-.16-.48-.29-.25-.12-1.52-.75-1.75-.84-.24-.09-.41-.13-.58.13-.17.25-.66.83-.81 1-.15.17-.3.19-.55.06-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.44-.06-.12-.58-1.42-.81-1.94-.2-.5-.42-.44-.58-.45-.15 0-.32-.01-.49-.01Z"/>
              </svg>
            </div>
            <div>
              <div class="info-label">{{ t.contact.phone_label }}</div>
              <a :href="WHATSAPP_URL" target="_blank" rel="noopener" class="info-value phone">{{ PHONE_DISPLAY }}</a>
              <div class="info-hint">{{ t.contact.whatsapp_hint }}</div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 7v5l3.5 2"/>
              </svg>
            </div>
            <div>
              <div class="info-label">{{ t.contact.hours_label }}</div>
              <div class="info-value">{{ t.contact.hours_val }}</div>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/1vDmK2W5r1KvgiYF8"
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
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d207.0341320144667!2d35.54779845550035!3d33.875586508701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDUyJzMyLjciTiAzNcKwMzInNTMuMCJF!5e0!3m2!1sen!2slb!4v1783794465911!5m2!1sen!2slb"
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
  flex-shrink: 0;
  margin-top: 2px;
  color: #ffc800;
  display: flex;
}

.info-icon.whatsapp {
  color: #4ade80;
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
  display: block;
}

.info-value.phone {
  color: #4ade80;
  font-weight: 700;
  font-size: 1.05rem;
}

.info-value.phone:hover {
  text-decoration: underline;
}

.info-hint {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.78rem;
  margin-top: 0.25rem;
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
