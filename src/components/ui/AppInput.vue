<script setup>
defineProps({
  modelValue:  { type: [String, Number], default: '' },
  type:        { type: String,  default: 'text' },
  placeholder: { type: String,  default: '' },
  required:    { type: Boolean, default: false },
  disabled:    { type: Boolean, default: false },
  min:         { type: [String, Number], default: undefined },
  max:         { type: [String, Number], default: undefined },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <input
    class="app-input"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :min="min"
    :max="max"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
