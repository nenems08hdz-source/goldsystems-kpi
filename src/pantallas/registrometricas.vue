<script setup>
import { ref, computed } from 'vue'
import { getCurrentInstance } from 'vue'
import { useKpiStore } from '../stores/kpiStore'
import { useOrgStore } from '../stores/orgStore'

const props = defineProps({
  kpi: { type: Object, required: true },
})
const emit = defineEmits(['guardado', 'cancelar'])

const store    = useKpiStore()
const orgStore = useOrgStore()
const { proxy } = getCurrentInstance()

const form = ref({
  fechaCorte:    '',
  valor:         '',
  observaciones: '',
})

const errorMensaje = ref('')

const labelValor = computed(() => {
  const unidades = {
    'Porcentaje': '(%)',
    'Monetario':  '($)',
    'Tiempo':     '(ms / hrs)',
    'Puntaje':    '(pts)',
  }
  return `Valor Registrado ${unidades[props.kpi.tipoMetrica] ?? ''}`
})

const textoAyudaFecha = computed(() => {
  const textos = {
    'Diario':     'Ingresa la fecha exacta del día que estás reportando.',
    'Semanal':    'Ingresa el último día de la semana que reportas (domingo).',
    'Mensual':    'Ingresa el último día del mes que reportas.',
    'Trimestral': 'Ingresa el último día del trimestre (31 Mar / 30 Jun / 30 Sep / 31 Dic).',
  }
  return textos[props.kpi.periodicidad] ?? 'Selecciona la fecha de corte del registro.'
})

function guardarMetrica() {
  if (!form.value.fechaCorte) {
    errorMensaje.value = 'La fecha de corte es obligatoria.'
    return
  }
  if (form.value.valor === '' || isNaN(Number(form.value.valor))) {
    errorMensaje.value = 'El valor registrado debe ser un número.'
    return
  }

  store.registrarCaptura({
    kpi_id:        props.kpi.id,
    usuario_id:    orgStore.usuarioActual.id,
    nombre:        props.kpi.nombre,
    periodicidad:  props.kpi.periodicidad,
    fechaCorte:    form.value.fechaCorte,
    valor:         Number(form.value.valor),
    observaciones: form.value.observaciones,
  })

  proxy.$notify.success(`Métrica registrada para "${props.kpi.nombre}"`, 'Guardado')
  form.value = { fechaCorte: '', valor: '', observaciones: '' }
  errorMensaje.value = ''
  emit('guardado')
}
</script>

<template>
  <div class="w-full mt-6">

    <button
      @click="emit('cancelar')"
      type="button"
      class="mb-4 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);"
      @mouseover="$event.currentTarget.style.background='var(--tabla-header-bg)'"
      @mouseleave="$event.currentTarget.style.background='var(--card-bg)'"
    >
      ← Volver a mis KPIs
    </button>

    <div class="rounded-xl shadow-md overflow-hidden"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">

      <div class="p-4 flex items-center justify-between"
        style="background: var(--tabla-header-bg); border-bottom: 1px solid var(--tabla-borde);">
        <div>
          <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">Registrar Métrica</h2>
          <p class="text-[10px] mt-0.5" style="color: var(--card-text-hint);">Captura el valor medido para el periodo correspondiente</p>
        </div>
        <button
          type="button"
          @click="emit('cancelar')"
          class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style="background: var(--tabla-borde); color: var(--card-text-hint);"
          @mouseover="$event.currentTarget.style.color='#ef4444'; $event.currentTarget.style.background='rgba(239,68,68,0.1)'"
          @mouseleave="$event.currentTarget.style.color='var(--card-text-hint)'; $event.currentTarget.style.background='var(--tabla-borde)'"
        >
          <i class="fi fi-sr-cross text-xs"></i>
        </button>
      </div>

      <div class="p-6 space-y-6">

        <div class="rounded-xl p-4" style="background: var(--tabla-header-bg); border: 1px solid var(--tabla-borde);">
          <p class="text-[10px] font-bold uppercase tracking-wider mb-2" style="color: var(--tabla-header-text);">
            KPI a Registrar
          </p>
          <p class="text-sm font-bold" style="color: var(--text-general);">{{ kpi.nombre }}</p>
          <p class="text-[11px] mt-0.5" style="color: var(--subtext-general);">{{ kpi.formula }}</p>

          <div class="flex flex-wrap gap-2 mt-3">
            <span class="table-badge flex items-center gap-1">
              <i class="fi fi-sr-calendar text-[9px]"></i>
              {{ kpi.periodicidad }}
            </span>
            <span class="table-badge flex items-center gap-1">
              <i class="fi fi-sr-stats text-[9px]"></i>
              {{ kpi.tipoMetrica }}
            </span>
            <span class="table-badge flex items-center gap-1">
              <i class="fi fi-sr-target text-[9px]"></i>
              Meta: {{ kpi.meta }}
            </span>
          </div>
        </div>

        <form @submit.prevent="guardarMetrica" class="space-y-5">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">
                Fecha de Corte
              </label>
              <p class="text-[10px] leading-relaxed" style="color: var(--card-text-hint);">{{ textoAyudaFecha }}</p>
              <input
                v-model="form.fechaCorte"
                type="date"
                class="app-input"
                required
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">
                {{ labelValor }}
              </label>
              <p class="text-[10px] leading-relaxed" style="color: var(--card-text-hint);">
                Valor actual del KPI: <strong style="color: var(--text-general);">{{ kpi.progreso }}</strong>
              </p>
              <input
                v-model="form.valor"
                type="number"
                step="0.01"
                class="app-input"
                :placeholder="`Meta: ${kpi.meta}`"
                required
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">
              Observaciones
              <span class="normal-case font-normal ml-1" style="color: var(--card-text-hint);">(opcional)</span>
            </label>
            <textarea
              v-model="form.observaciones"
              rows="2"
              placeholder="Notas adicionales sobre este registro..."
              class="app-input resize-none"
            ></textarea>
          </div>

          <div v-if="errorMensaje"
            class="text-xs text-rose-600 rounded-lg p-3"
            style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3);">
            {{ errorMensaje }}
          </div>

          <div class="flex justify-end gap-3 pt-4" style="border-top: 1px solid var(--tabla-borde);">
            <button
              type="button"
              @click="emit('cancelar')"
              class="text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
              style="color: var(--subtext-general);"
              @mouseover="$event.currentTarget.style.color='var(--text-general)'"
              @mouseleave="$event.currentTarget.style.color='var(--subtext-general)'"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all duration-300 shadow-sm"
              style="background: var(--sidebar-bg);"
              @mouseover="$event.currentTarget.style.background='var(--sidebar-active-bg)'; $event.currentTarget.style.color='var(--sidebar-active-text)'"
              @mouseleave="$event.currentTarget.style.background='var(--sidebar-bg)'; $event.currentTarget.style.color='white'"
            >
              Guardar Registro
            </button>
          </div>

        </form>
      </div>
    </div>

    <div v-if="store.capturasPorKpi(kpi.id).length > 0"
      class="rounded-xl shadow-md mt-4 overflow-hidden"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">
      <div class="p-4" style="background: var(--tabla-header-bg); border-bottom: 1px solid var(--tabla-borde);">
        <h3 class="text-xs font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">
          Capturas anteriores de este KPI
        </h3>
      </div>
      <div>
        <div
          v-for="captura in store.capturasPorKpi(kpi.id).slice().reverse()"
          :key="captura.id"
          class="flex items-center justify-between px-4 py-3 transition-colors"
          style="border-bottom: 1px solid var(--tabla-borde);"
          @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
          @mouseleave="$event.currentTarget.style.background='transparent'"
        >
          <div>
            <p class="text-xs font-bold" style="color: var(--text-general);">{{ captura.fechaCorte }}</p>
            <p class="text-[10px]" style="color: var(--subtext-general);">{{ captura.observaciones || 'Sin observaciones' }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-black" style="color: var(--sidebar-bg);">{{ captura.valor }}</p>
            <p class="text-[10px]" style="color: var(--subtext-general);">{{ captura.periodicidad }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
