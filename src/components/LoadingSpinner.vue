<template>
  <!-- ← EDICIÓN: Dos modos - fullPage o esquina pequeña -->
  <div v-if="isActive" :class="{ 'loading-overlay': fullPage, 'loading-corner': !fullPage }">
    <div :class="{ 'spinner': fullPage, 'spinner-small': !fullPage }">
      <div :class="{ 'spinner-ring': fullPage, 'spinner-ring-small': !fullPage }"></div>
      <div v-if="fullPage" class="spinner-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isActive: { type: Boolean, default: false },
  text: { type: String, default: 'Cargando...' },
  fullPage: { type: Boolean, default: false }
})
</script>

<style scoped>
/* MODO PANTALLA COMPLETA */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner-ring {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* MODO ESQUINA (navbar) */
.loading-corner {
  position: fixed;
  top: 12px;
  right: 60px;
  z-index: 1000;
  display: flex;
  align-items: center;
}

.spinner-small {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-ring-small {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  color: var(--navbar-icon);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner-text {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
}
</style>
