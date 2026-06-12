<script setup>
defineProps({
  modelValue:  { type: [String, Number], default: '' },
  options:     { type: Array, required: true },
  placeholder: { type: String, default: 'Selecciona...' },
  required:    { type: Boolean, default: false },
  disabled:    { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

function normalizar(opt) {
  if (typeof opt === 'object' && opt !== null) return opt
  return { value: opt, label: opt }
}
</script>

<template>
  <select
    class="app-select"
    :value="modelValue"
    :required="required"
    :disabled="disabled"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option value="" disabled>{{ placeholder }}</option>
    <option
      v-for="opt in options.map(normalizar)"
      :key="opt.value"
      :value="opt.value"
    >
      {{ opt.label }}
    </option>
  </select>
</template>