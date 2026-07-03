<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import api from '../services/api'
import EtiquetaBadge from '../components/ui/EtiquetaBadge.vue'
import AppButton     from '../components/ui/AppButton.vue'
import BotonAccion   from '../components/ui/BotonAccion.vue'

const props = defineProps({
  kpi: { type: Object, required: true },
})
const emit = defineEmits(['guardado', 'cancelar'])

const { proxy } = getCurrentInstance()
const capturas = ref([])

onMounted(async () => {
  const res = await api.get(`/kpi-records?kpi_id=${props.kpi.id}`)
  capturas.value = res.data
})

const form = ref({
  period_start: '',
  value:        '',
  notes:        '',
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
 //funcion para guardar los datos en la base real 
 
async function guardarMetrica() {
  if (!form.value.period_start) {
    errorMensaje.value = 'La fecha de corte es obligatoria.'
    return
  }
  if (form.value.value === '' || isNaN(Number(form.value.value))) {
    errorMensaje.value = 'El valor registrado debe ser un número.'
    return
  }

  try {
    const res = await api.post('/kpi-records', {
      kpi_id:       props.kpi.id,
      value:        Number(form.value.value),
      period_start: form.value.period_start,
      notes:        form.value.notes || null,
    })
    capturas.value.unshift(res.data)
    proxy.$notify.success(`Métrica registrada para "${props.kpi.nombre}"`, 'Guardado')
    form.value = { period_start: '', value: '', notes: '' }
    errorMensaje.value = ''
    emit('guardado')
  } catch {
    errorMensaje.value = 'Error al guardar. Intenta de nuevo.'
  }
}
</script>

<template>
  <div class="w-full mt-6">

    <AppButton variant="secondary" class="mb-4 flex items-center gap-2" @click="emit('cancelar')">
      ← Volver a mis KPIs
    </AppButton>

    <div class="rounded-xl shadow-md overflow-hidden"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">

      <div class="p-4 flex items-center justify-between"
        style="background: var(--tabla-header-bg); border-bottom: 1px solid var(--tabla-borde);">
        <div>
          <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">Registrar Métrica</h2>
          <p class="text-[10px] mt-0.5" style="color: var(--card-text-hint);">Captura el valor medido para el periodo correspondiente</p>
        </div>
        <BotonAccion variante="close" titulo="Cerrar" @click="emit('cancelar')" />
      </div>

      <div class="p-6 space-y-6">

        <div class="rounded-xl p-4" style="background: var(--tabla-header-bg); border: 1px solid var(--tabla-borde);">
          <p class="text-[10px] font-bold uppercase tracking-wider mb-2" style="color: var(--tabla-header-text);">
            KPI a Registrar
          </p>
          <p class="text-sm font-bold" style="color: var(--text-general);">{{ kpi.nombre }}</p>
          <p class="text-[11px] mt-0.5" style="color: var(--subtext-general);">{{ kpi.formula }}</p>

          <div class="flex flex-wrap gap-2 mt-3">
            <EtiquetaBadge clase="flex items-center gap-1">
              <i class="fi fi-sr-calendar text-[9px]"></i>
              {{ kpi.periodicidad }}
            </EtiquetaBadge>
            <EtiquetaBadge clase="flex items-center gap-1">
              <i class="fi fi-sr-stats text-[9px]"></i>
              {{ kpi.tipoMetrica }}
            </EtiquetaBadge>
            <EtiquetaBadge clase="flex items-center gap-1">
              <i class="fi fi-sr-target text-[9px]"></i>
              Meta: {{ kpi.meta }}
            </EtiquetaBadge>
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
                v-model="form.period_start"
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
                v-model="form.value"
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
              v-model="form.notes"
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
            <AppButton variant="ghost" type="button" @click="emit('cancelar')">Cancelar</AppButton>
            <AppButton variant="primary" type="submit">Guardar Registro</AppButton>
          </div>

        </form>
      </div>
    </div>

    <div v-if="capturas.length > 0"
      class="rounded-xl shadow-md mt-4 overflow-hidden"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">
      <div class="p-4" style="background: var(--tabla-header-bg); border-bottom: 1px solid var(--tabla-borde);">
        <h3 class="text-xs font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">
          Capturas anteriores de este KPI
        </h3>
      </div>
      <div>
        <div
          v-for="captura in capturas"
          :key="captura.id"
          class="flex items-center justify-between px-4 py-3 transition-colors"
          style="border-bottom: 1px solid var(--tabla-borde);"
          @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
          @mouseleave="$event.currentTarget.style.background='transparent'"
        >
          <div>
            <p class="text-xs font-bold" style="color: var(--text-general);">{{ captura.period_start }}</p>
            <p class="text-[10px]" style="color: var(--subtext-general);">{{ captura.notes || 'Sin observaciones' }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-black" style="color: var(--sidebar-bg);">{{ captura.value }}</p>
            <p class="text-[10px]" style="color: var(--subtext-general);">{{ kpi.periodicidad }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
