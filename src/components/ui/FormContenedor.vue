<script setup>
defineProps({
  ancho: {
    type: String,
    default: 'max-w-6xl'
  }
})
</script>

<template>
  <div :class="['w-full', 'mx-auto', ancho]">
    <slot />
  </div>
</template>
