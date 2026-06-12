<script setup>
defineProps({
  label:   { type: String,  default: '' },
  required:{ type: Boolean, default: false },
  hint:    { type: String,  default: '' },
  colSpan: { type: Number,  default: 1 },
})
</script>

<template>
  <div
    class="flex flex-col gap-1.5"
    :class="{ 'md:col-span-2': colSpan === 2 }"
  >
    <label
      v-if="label"
      class="text-[11px] font-bold uppercase tracking-wider"
      style="color: var(--subtext-general);"
    >
      {{ label }}
      <span v-if="required" class="text-rose-500 ml-0.5">*</span>
      <span v-if="hint" class="normal-case font-normal ml-1 text-gray-400">({{ hint }})</span>
    </label>

    <slot />
  </div>
</template>