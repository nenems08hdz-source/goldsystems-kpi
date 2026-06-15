<script setup>
defineProps({
  variant:  { type: String,  default: 'primary' },
  size:     { type: String,  default: 'md' },
  type:     { type: String,  default: 'button' },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="app-btn"
    :class="[
      variant === 'primary' ? 'app-btn-primary' : 'app-btn-ghost',
      size === 'sm' ? 'app-btn-sm' : size === 'lg' ? 'app-btn-lg' : 'app-btn-md',
    ]"
  >
    <slot />
  </button>
</template>
