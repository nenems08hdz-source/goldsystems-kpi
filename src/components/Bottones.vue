<template>
  <button
    @click="handleClick"
    class="flex items-center gap-2 bg-[#3f2a52] hover:bg-[#beaed8] hover:text-[#3f2a52] text-white font-bold text-xs py-2 px-6 rounded-xl shadow-md transition-all duration-300"
  >
    <slot />
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';
const props = defineProps({ to: { type: String, default: null } });
const router = useRouter();
const handleClick = () => { if (props.to) router.push(props.to); };
</script>