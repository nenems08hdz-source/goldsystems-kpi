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
      size === 'sm' && 'text-xs px-3 py-1.5',
      size === 'md' && 'text-xs px-5 py-2',
      size === 'lg' && 'text-sm px-6 py-3',
    ]"
    :style="
      variant === 'primary'   ? { background: 'var(--sidebar-active-bg)', color: 'var(--sidebar-active-text)' } :
      variant === 'secondary' ? { background: 'var(--card-bg)', border: '1px solid var(--tabla-borde)', color: 'var(--text-general)' } :
      variant === 'ghost'     ? { background: 'transparent', border: '1px solid var(--color-kpi-morado)', color: 'var(--sidebar-bg)' } :
      variant === 'danger'    ? { background: '#dc2626', color: 'white' } : {}
    "
    @mouseover="
      variant === 'primary'   ? ($event.currentTarget.style.opacity = '0.85') :
      variant === 'secondary' ? ($event.currentTarget.style.background = 'var(--tabla-hover)') :
      variant === 'ghost'     ? ($event.currentTarget.style.background = 'rgba(190,174,216,0.15)') :
      variant === 'danger'    ? ($event.currentTarget.style.background = '#b91c1c') : null
    "
    @mouseleave="
      variant === 'primary'   ? ($event.currentTarget.style.opacity = '1') :
      variant === 'secondary' ? ($event.currentTarget.style.background = 'var(--card-bg)') :
      variant === 'ghost'     ? ($event.currentTarget.style.background = 'transparent') :
      variant === 'danger'    ? ($event.currentTarget.style.background = '#dc2626') : null
    "
  >
    <slot />
  </button>
</template>
