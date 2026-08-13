<script setup>
import { computed }       from 'vue'
import { useOrgStore }    from '../stores/orgStore'
import { usePermissions } from '../composables/usePermissions'

defineProps({
  saludables: { type: Number, default: 0 },
  alerta:     { type: Number, default: 0 },
  criticos:   { type: Number, default: 0 },
  eficiencia: { type: Number, default: 0 }
})

const { can }  = usePermissions()
const orgStore = useOrgStore()
const nombreEmpresa = computed(() => orgStore.empresaActiva?.name ?? 'Mi Empresa')
</script>

<template>
  <div :class="['grid grid-cols-1 md:grid-cols-2 gap-6 p-1', can('dashboard.view_advanced') ? 'lg:grid-cols-4' : 'lg:grid-cols-3']">
    
    <!-- Tarjeta 1: KPIs Saludables -->
    <div class=" rounded-xl shadow-lg p-5 border flex flex-col justify-between"
    style="background: var(--card2-bg);">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold tracking-wider text-[#beaed8] uppercase"
        style="color: var(--card2-text);">KPIs Saludables</span>
        <i class="fi fi-sr-checkbox text-emerald-400 text-base"></i>
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight text-white">
          {{ saludables < 10 ? '0' + saludables : saludables }}
        </span>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Estado: Óptimo</span>
      </div>
    </div>

    <!-- Tarjeta 2: KPIs en Alerta -->
    <div class=" rounded-xl shadow-lg p-5 border flex flex-col justify-between"
    style="background: var(--card2-bg);">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold tracking-wider text-[#beaed8] uppercase"
        style="color: var(--card2-text);">KPIs en alerta</span>
        <i class="fi fi-sr-exclamation text-yellow-400 text-base"></i>
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight text-white">
          {{ alerta < 10 ? '0' + alerta : alerta }}
        </span>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
        <span class="text-[11px] font-bold text-yellow-400 uppercase tracking-wide">Estado: En riesgo</span>
      </div>
    </div>

    <!-- Tarjeta 3: KPIs Críticos -->
    <div class=" rounded-xl p-5 shadow-lg border flex flex-col justify-between"
    style="background: var(--card2-bg);">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold tracking-wider text-[#beaed8] uppercase"
        style="color: var(--card2-text);">KPIs críticos</span>
        <i class="fi fi-sr-cross-circle text-red-400 text-base"></i>
      </div>
      <div class="my-2">
        <span class="text-4xl font-extrabold tracking-tight text-white">
          {{ criticos < 10 ? '0' + criticos : criticos }}
        </span>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
        <span class="text-[11px] font-bold text-red-400 uppercase tracking-wide">Estado: crítico</span>
      </div>
    </div>

    <div
      v-if="can('dashboard.view_advanced')"
      class="rounded-xl shadow-lg p-5 border flex flex-col justify-between h-full transition-colors duration-300"
      style="background: var(--card-bg);"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center"
            style="background: rgba(190,174,216,0.2); color: var(--sidebar-bg);"
          >
            <i class="fi fi-sr-building text-sm"></i>
          </div>
          <div class="flex flex-col">
            <span
              class="text-[10px] font-bold uppercase tracking-wider"
              style="color: var(--card-text-hint);"
            >Empresa</span>
            <span
              class="text-sm font-bold mt-0.5"
              style="color: var(--card-text);"
            >{{ nombreEmpresa }}</span>
          </div>
        </div>
      </div>

      <div class="my-3 pt-3" style="border-top: 1px solid var(--card-border);">
        <div class="text-[11px] flex justify-between items-center mb-1">
          <span
            class="font-bold uppercase tracking-wider text-[9px]"
            style="color: var(--card-text-muted);"
          >Eficiencia General</span>
          <span class="font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {{ eficiencia }}%
          </span>
        </div>

        <div
          class="w-full h-2 rounded-full overflow-hidden"
          style="background: var(--card-border);"
        >
          <div
            class="h-full bg-emerald-500 rounded-full transition-all duration-500"
            :style="{ width: eficiencia + '%' }"
          ></div>
        </div>

        <p class="text-[10px] mt-2 font-medium flex items-center gap-1"
          style="color: var(--card-text-hint);">
          <i class="fi fi-sr-info text-[9px]"></i>
          Cumplimiento:
          <span class="font-bold" style="color: var(--card-text);">
            {{ saludables }} de {{ saludables + alerta + criticos }}
          </span> KPIs óptimos.
        </p>
      </div>
    </div>

  </div>
</template>