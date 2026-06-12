<script setup>
import { ref, computed } from 'vue'
import { useRouter }     from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useKpiStore } from '../stores/kpiStore'

const props = defineProps({
  kpi: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['guardado', 'cancelar'])

const store  = useKpiStore()
const router = useRouter()
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
  const unidad = unidades[props.kpi.tipoMetrica] ?? ''
  return `Valor Registrado ${unidad}`
})

const placeholderValor = computed(() => {
  return `Meta: ${props.kpi.meta}`
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
    usuario_id:    store.usuarioActual.id,
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
      class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2"
    >
      ← Volver a mis KPIs
    </button>

    <div class="bg-white rounded-xl border border-[#beaed8]/60 shadow-md overflow-hidden">

      <div class="p-4 bg-gray-50/50 border-b border-[#beaed8]/30 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Registrar Métrica</h2>
          <p class="text-[10px] text-gray-400 mt-0.5">Captura el valor medido para el periodo correspondiente</p>
        </div>
        <button
          type="button"
          @click="emit('cancelar')"
          class="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
        >
          <i class="fi fi-sr-cross text-xs"></i>
        </button>
      </div>

      <div class="p-6 space-y-6">

        <div class="bg-[#3f2a52]/5 border border-[#beaed8]/60 rounded-xl p-4">
          <p class="text-[10px] font-bold text-[#3f2a52] uppercase tracking-wider mb-2">
            KPI a Registrar
          </p>
          <p class="text-sm font-bold text-gray-900">{{ kpi.nombre }}</p>
          <p class="text-[11px] text-gray-500 mt-0.5">{{ kpi.formula }}</p>

          <div class="flex flex-wrap gap-2 mt-3">
            <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#3f2a52]/10 text-[#3f2a52] uppercase tracking-wide">
              <i class="fi fi-sr-calendar text-[9px]"></i>
              {{ kpi.periodicidad }}
            </span>
            <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wide">
              <i class="fi fi-sr-stats text-[9px]"></i>
              {{ kpi.tipoMetrica }}
            </span>
            <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wide">
              <i class="fi fi-sr-target text-[9px]"></i>
              Meta: {{ kpi.meta }}
            </span>
          </div>
        </div>
        <form @submit.prevent="guardarMetrica" class="space-y-5">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Fecha de Corte
              </label>
              <p class="text-[10px] text-[#77a9d4] leading-relaxed">{{ textoAyudaFecha }}</p>
              <input
                v-model="form.fechaCorte"
                type="date"
                class="class= bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
                required
              />
            </div>
            <div class="flex flex-col gap-1.5">

              <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {{ labelValor }}
              </label>
              <p class="text-[10px] text-gray-400 leading-relaxed">
                Valor actual del KPI: <strong class="text-gray-600">{{ kpi.progreso }}</strong>
              </p>
              <input
                v-model="form.valor"
                type="number"
                step="0.01"
                class="class=bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
                :placeholder="placeholderValor"
                required
              />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Observaciones
              <span class="text-gray-400 normal-case font-normal ml-1">(opcional)</span>
            </label>
            <textarea
              v-model="form.observaciones"
              rows="2"
              placeholder="Notas adicionales sobre este registro..."
              class="class=bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#3f2a52] focus:ring-2 focus:ring-[#3f2a52]/20 transition-colors"
            ></textarea>
          </div>

          <div
            v-if="errorMensaje"
            class="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"
          >
            {{ errorMensaje }}
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              @click="emit('cancelar')"
              class="text-gray-500 hover:text-gray-800 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="bg-[#3f2a52] hover:bg-[#77a9d4] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all duration-300 shadow-sm"
            >
              Guardar Registro
            </button>
          </div>

        </form>
      </div>
    </div>
    <div
      v-if="store.capturasPorKpi(kpi.id).length > 0"
      class="bg-white rounded-xl border border-[#beaed8]/60 shadow-md mt-4 overflow-hidden"
    >
      <div class="p-4 bg-gray-50/50 border-b border-[#beaed8]/30">
        <h3 class="text-xs font-bold text-gray-600 uppercase tracking-wider">
          Capturas anteriores de este KPI
        </h3>
      </div>
      <div class="divide-y divide-gray-100">
        <div
          v-for="captura in store.capturasPorKpi(kpi.id).slice().reverse()"
          :key="captura.id"
          class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <div>
            <p class="text-xs font-bold text-gray-700">{{ captura.fechaCorte }}</p>
            <p class="text-[10px] text-gray-400">{{ captura.observaciones || 'Sin observaciones' }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-black text-[#3f2a52]">{{ captura.valor }}</p>
            <p class="text-[10px] text-gray-400">{{ captura.periodicidad }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>