<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKpiStore } from '../stores/kpiStore'
import GraficaKpiEspecifica from '../components/GraficaKpiEspecifica.vue'
import StatusBadge from '../components/StatusBadge.vue'

const route  = useRoute()
const router = useRouter()
const store  = useKpiStore()

const idKpi = Number(route.params.id)
const kpi   = computed(() => store.indicadores.find(i => i.id === idKpi))
const tipoSeleccionado = ref(kpi.value?.graficasCompatibles?.[0] ?? 'linea')

const eventosBase = ref([
  { id: 'ev-1',  tipo: 'evento', titulo: 'Actualización de Meta SLA',   desc: 'El umbral de Óptimo se elevó al nivel actual.',  fecha: '2024-01-15', autor: 'Carlos M.' },
  { id: 'ev-2',  tipo: 'evento', titulo: 'Nuevo Responsable',           desc: 'Asignación del equipo SRE-A al indicador.',      fecha: '2024-02-20', autor: 'Admin'     },
  { id: 'ev-3',  tipo: 'evento', titulo: 'Ajuste de Fórmula',           desc: 'Se corrigió el cálculo base del indicador.',     fecha: '2024-03-25', autor: 'Usuario'   },
  { id: 'ev-4',  tipo: 'evento', titulo: 'Cambio de Periodicidad',      desc: 'Se ajustó la frecuencia de medición.',           fecha: '2024-06-01', autor: 'Admin'     },
])

const capturasReales = computed(() =>
  store.capturasPorKpi(idKpi).map(c => ({
    id:    `cap-${c.id}`,
    tipo:  'captura',
    titulo: 'Medición registrada',
    desc:  `Valor: ${c.valor} — ${c.observaciones || 'Sin observaciones'}`,
    fecha: c.fechaCorte,       
    autor: `Usuario #${c.usuario_id}`,
    valor: c.valor,
  }))
)

const registrosCombinados = computed(() => {
  const todos = [...eventosBase.value, ...capturasReales.value]
  return todos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
})

const opcionesFiltro = computed(() => {
  if (!kpi.value) return []
  const p = kpi.value.periodicidad

  if (p === 'Mensual') return [
    { label: 'Todos los meses', valor: 'todos' },
    ...['Enero','Febrero','Marzo','Abril','Mayo','Junio',
        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
      .map((label, i) => ({ label, valor: `2024-${String(i+1).padStart(2,'0')}` }))
  ]
  if (p === 'Trimestral') return [
    { label: 'Todos los trimestres', valor: 'todos' },
    { label: 'Q1 (Ene-Mar)', valor: 'Q1' },
    { label: 'Q2 (Abr-Jun)', valor: 'Q2' },
    { label: 'Q3 (Jul-Sep)', valor: 'Q3' },
    { label: 'Q4 (Oct-Dic)', valor: 'Q4' },
  ]
  if (p === 'Semanal' || p === 'Diario') return [
    { label: 'Todos los registros', valor: 'todos' },
    { label: 'Semana 1 (1-7)',   valor: 'sem-1' },
    { label: 'Semana 2 (8-14)',  valor: 'sem-2' },
    { label: 'Semana 3 (15-21)', valor: 'sem-3' },
    { label: 'Semana 4 (22-31)', valor: 'sem-4' },
  ]
  return [{ label: 'Todos los registros', valor: 'todos' }]
})

const filtroActivo = ref('todos')

const registrosFiltrados = computed(() => {
  if (filtroActivo.value === 'todos') return registrosCombinados.value

  const p = kpi.value?.periodicidad

  return registrosCombinados.value.filter(r => {
    const fecha = new Date(r.fecha + 'T00:00:00')
    const mes   = fecha.getMonth()
    const dia   = fecha.getDate()

    if (p === 'Mensual')     return r.fecha.startsWith(filtroActivo.value)
    if (p === 'Trimestral') {
      if (filtroActivo.value === 'Q1') return mes >= 0  && mes <= 2
      if (filtroActivo.value === 'Q2') return mes >= 3  && mes <= 5
      if (filtroActivo.value === 'Q3') return mes >= 6  && mes <= 8
      if (filtroActivo.value === 'Q4') return mes >= 9  && mes <= 11
    }
    if (p === 'Semanal' || p === 'Diario') {
      if (filtroActivo.value === 'sem-1') return dia >= 1  && dia <= 7
      if (filtroActivo.value === 'sem-2') return dia >= 8  && dia <= 14
      if (filtroActivo.value === 'sem-3') return dia >= 15 && dia <= 21
      if (filtroActivo.value === 'sem-4') return dia >= 22 && dia <= 31
    }
    return true
  })
})

</script>

<template>
  <div class="flex flex-col gap-6 w-full px-6 py-4">

    <button
      @click="router.push('/kpis')"
      class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2 w-fit"
    >
      ← Volver al Listado
    </button>

    <div v-if="!kpi" class="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <p class="text-gray-400 text-sm">No se encontró el KPI solicitado.</p>
      <button @click="router.push('/kpis')" class="mt-4 text-[#3f2a52] text-xs font-bold underline">
        Volver al listado
      </button>
    </div>

    <template v-if="kpi">

      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div class="flex justify-between items-start flex-wrap gap-4">
          <div>
            <span class="text-[10px] font-bold bg-[#3f2a52]/10 text-[#3f2a52] px-2 py-0.5 rounded border border-[#3f2a52]/20 uppercase tracking-wider">
              {{ kpi.departamento }}
            </span>
            <h1 class="text-xl font-bold text-gray-900 mt-2">{{ kpi.nombre }}</h1>
            <p class="text-xs text-gray-400 mt-0.5">{{ kpi.formula }}</p>
            <div class="flex items-center gap-2 mt-3 flex-wrap">
              <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 uppercase">{{ kpi.tipoMetrica }}</span>
              <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 uppercase">{{ kpi.periodicidad }}</span>
              <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 uppercase">Resp: {{ kpi.responsable }}</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <StatusBadge :tipo="kpi.estadoTipo" :texto="kpi.estado" />
            <p class="text-xs text-gray-500 text-right">
              Valor actual: <strong class="text-gray-800">{{ kpi.progreso }}</strong>
            </p>
            <p class="text-xs text-gray-500 text-right">
              Meta: <strong class="text-gray-800">{{ kpi.meta }}</strong>
            </p>
          </div>
        </div>
      </div>

      <div class="bg-[#3f2a52] border border-[#beaed8]/70 rounded-2xl p-6 shadow-lg">
        <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
          <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">Registro de Mediciones</p>
          <div class="flex gap-2">
            <button
              v-for="tipo in kpi.graficasCompatibles"
              :key="tipo"
              @click="tipoSeleccionado = tipo"
              class="text-[10px] font-bold uppercase px-3 py-1 rounded-full transition-all border capitalize"
              :class="tipoSeleccionado === tipo
                ? 'bg-[#beaed8] text-[#3f2a52] border-[#beaed8]'
                : 'text-[#beaed8] border-[#beaed8]/40 hover:border-[#beaed8]'"
            >
              {{ tipo }}
            </button>
          </div>
        </div>
        <GraficaKpiEspecifica :kpi="kpi" :tipo="tipoSeleccionado" />
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

        <div class="mb-6 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h2 class="text-lg font-bold text-black">Historial de Registros</h2>
            <p class="text-xs text-gray-500">
              Capturas y eventos de auditoría —
              <strong class="text-[#3f2a52]">Periodicidad {{ kpi.periodicidad }}</strong>
              ·
              
              <span class="text-[#3f2a52]">{{ capturasReales.length }} captura(s) registrada(s)</span>
            </p>
          </div>

          <select
            v-model="filtroActivo"
            class="text-white bg-[#3f2a52] px-4 py-2 rounded-lg hover:bg-[#5a3f73] transition-colors cursor-pointer outline-none text-xs"
          >
            <option v-for="opcion in opcionesFiltro" :key="opcion.valor" :value="opcion.valor">
              {{ opcion.label }}
            </option>
          </select>
        </div>

        <div class="space-y-3">
          <div
            v-for="r in registrosFiltrados"
            :key="r.id"
            class="p-4 rounded-lg border transition-colors"
            :class="r.tipo === 'captura'
              ? 'border-[#beaed8]/60 bg-[#3f2a52]/3 hover:bg-[#3f2a52]/5'
              : 'border-gray-100 hover:bg-gray-50'"
          >
            <div class="flex justify-between items-start gap-4">
              <div class="flex gap-4 flex-grow">
               
                <div
                  class="p-2 rounded-lg text-sm flex-shrink-0"
                  :class="r.tipo === 'captura'
                    ? 'bg-[#3f2a52]/10 text-[#3f2a52]'
                    : 'bg-gray-100 text-gray-600'"
                >
                  <i :class="r.tipo === 'captura' ? 'fi fi-sr-stats' : 'fi fi-rr-pencil'"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-bold text-black">{{ r.titulo }}</p>
  
                    <span
                      v-if="r.tipo === 'captura'"
                      class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#3f2a52]/10 text-[#3f2a52] uppercase tracking-wide"
                    >
                      CAPTURA
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 mt-1">{{ r.desc }}</p>
                  <p class="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
                    Por: {{ r.autor }}
                  </p>
                </div>
              </div>
              <span class="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                {{ r.fecha }}
              </span>
            </div>
          </div>

          <div v-if="registrosFiltrados.length === 0" class="text-center py-8">
            <p class="text-gray-400 text-sm">No hay registros en este periodo.</p>
            <p class="text-xs text-gray-300 mt-1">
              Las capturas guardadas desde "Captura de Métricas" aparecerán aquí.
            </p>
          </div>
        </div>

      </div>

    </template>
  </div>
</template>