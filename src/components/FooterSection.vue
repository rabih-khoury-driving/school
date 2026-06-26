<script setup>
import { useI18n } from '@/composables/useI18n.js'
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <img src="/logo.png" alt="Logo" class="footer-logo" />
        <span class="footer-name">Rabih Driving School</span>
      </div>

      <p class="footer-copy">
        &copy; {{ year }} Rabih Driving School. {{ t.footer.rights }}
      </p>

      <div class="footer-phone">
        <a href="tel:+96170123456">+961 70 123 456</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #000;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2rem 0;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.footer-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}

.footer-name {
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: 1rem;
  color: #ffc800;
  letter-spacing: 0.05em;
}

.footer-copy {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.8rem;
  margin: 0;
}

.footer-phone a {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-phone a:hover {
  color: #ffc800;
}

@media (max-width: 640px) {
  .footer-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
