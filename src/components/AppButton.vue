<!-- Re-export del componente canónico -->
<script setup>
import AppButtonUi from './ui/AppButton.vue'
defineProps({ variant: String, size: String, type: String, disabled: Boolean })
</script>
<template>
  <AppButtonUi v-bind="$props"><slot /></AppButtonUi>
</template>