<script setup>
import { computed } from 'vue'
const props = defineProps({
  tipo:  { type: String, required: true },  
  texto: { type: String, default: '' },
})

/**
 * StatusBadge — badge semántico con punto pulsante.
 *
 * Fondos pasteles SIN prefijo dark: → siempre claros en ambos modos.
 * El texto usa el color semántico fuerte para contrastar sobre el fondo claro.
 *
 * tipo (KPI):       'success'   | 'warning'  | 'danger'
 * tipo (usuario):   'activo'    | 'ausente'  | 'bloqueado'
 * tipo (captura):   'aTiempo'   | 'porVencer'| 'retrasada'
 * tipo (auditoría): 'exitosa'   | 'revision'
 *
 * texto — sobreescribe la etiqueta por defecto.
 */
const config = {
  // ── Estados de KPI ──────────────────────────────────────────
  success:   { badge: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', label: 'Saludable'  },
  warning:   { badge: 'text-amber-700  bg-amber-50  border-amber-200',  dot: 'bg-amber-500',  label: 'En riesgo'  },
  danger:    { badge: 'text-rose-700   bg-rose-50   border-rose-200',   dot: 'bg-rose-500',   label: 'Crítico'    },
  // ── Estados de usuario ───────────────────────────────────────
  active:    { badge: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', label: 'Activo'     },
  inactive:   { badge: 'text-amber-700  bg-amber-50  border-amber-200',  dot: 'bg-amber-500',  label: 'Ausente'    },
  blocked: { badge: 'text-rose-700   bg-rose-50   border-rose-200',   dot: 'bg-rose-500',   label: 'Bloqueado'  },
  // ── Estados de captura de métrica ────────────────────────────
  aTiempo:   { badge: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', label: 'A Tiempo'   },
  porVencer: { badge: 'text-amber-700  bg-amber-50  border-amber-200',  dot: 'bg-amber-500',  label: 'Por Vencer' },
  retrasada: { badge: 'text-rose-700   bg-rose-50   border-rose-200',   dot: 'bg-rose-500',   label: 'Retrasada'  },
  // ── Estados de auditoría ─────────────────────────────────────
  exitosa:   { badge: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', label: 'Exitosa'    },
  revision:  { badge: 'text-amber-700  bg-amber-50  border-amber-200',  dot: 'bg-amber-500',  label: 'Revisión'   },
}

const current = computed(() => config[props.tipo] ?? config.danger)
const label   = computed(() => props.texto || current.value.label)
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide"
    :class="current.badge"
  >
    <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="current.dot" />
    {{ label }}
  </span>
</template>