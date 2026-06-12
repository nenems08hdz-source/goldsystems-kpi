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
    class="font-bold rounded-lg transition-all focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[
      /* Tamaños */
      size === 'sm' && 'text-xs px-3 py-1.5',
      size === 'md' && 'text-xs px-5 py-2',
      size === 'lg' && 'text-sm px-6 py-3',

      /* Variantes */
      variant === 'primary'   && 'bg-brand-purple text-white hover:bg-[#2c1d3a] focus-visible:ring-brand-purple/30 shadow-sm',
      variant === 'secondary' && 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50',
      variant === 'ghost'     && 'border border-brand-lavender text-brand-purple hover:bg-brand-lavender/20',
      variant === 'danger'    && 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/30',
    ]"
  >
    <slot />
  </button>
</template>