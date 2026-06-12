<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePanelStore } from '../stores/panelStore'
import GraficaKpiEspecifica from '../components/GraficaKpiEspecifica.vue'
import BotonesRegreso from '../components/BotonesRegreso.vue'

const route  = useRoute()
const router = useRouter()
const store  = usePanelStore()

const idKpi = Number(route.params.id)
const kpi   = computed(() => store.indicadores.find(i => i.id === idKpi))
const tipoSeleccionado = ref(kpi.value?.graficasCompatibles?.[0] ?? 'linea')

// ── EVENTOS BASE (auditoría fija, no viene del store) ─────────────────────
// Estos son registros de eventos históricos: cambios de meta, de responsable,
// de fórmula. NO son capturas de valor — son cambios de configuración del KPI.
// Se mantienen aquí porque en producción vendrían de una tabla separada
// tipo `kpi_eventos` o `audit_log`. Por ahora son datos fijos de demostración.
//
// CAMPO CLAVE: usan `fecha` (no `fechaCorte`) para distinguirlos de las
// capturas reales que tienen `fechaCorte`. El computed `registrosCombinados`
// normaliza ambos al mismo campo `fechaNormalizada` para ordenar y filtrar.
const eventosBase = ref([
  { id: 'ev-1',  tipo: 'evento', titulo: 'Actualización de Meta SLA',   desc: 'El umbral de Óptimo se elevó al nivel actual.',  fecha: '2024-01-15', autor: 'Carlos M.' },
  { id: 'ev-2',  tipo: 'evento', titulo: 'Nuevo Responsable',           desc: 'Asignación del equipo SRE-A al indicador.',      fecha: '2024-02-20', autor: 'Admin'     },
  { id: 'ev-3',  tipo: 'evento', titulo: 'Ajuste de Fórmula',           desc: 'Se corrigió el cálculo base del indicador.',     fecha: '2024-03-25', autor: 'Usuario'   },
  { id: 'ev-4',  tipo: 'evento', titulo: 'Cambio de Periodicidad',      desc: 'Se ajustó la frecuencia de medición.',           fecha: '2024-06-01', autor: 'Admin'     },
])

// ── CAPTURAS REALES desde el store ───────────────────────────────────────
// `store.capturasPorKpi(idKpi)` devuelve las capturas guardadas desde
// CapturaMetricas, ya ordenadas cronológicamente.
// Son reactivas: cuando el usuario guarda una nueva captura en
// CapturaMetricas, este computed se recalcula automáticamente y el
// historial aquí se actualiza sin recargar la página.
const capturasReales = computed(() =>
  store.capturasPorKpi(idKpi).map(c => ({
    // Normalizamos al mismo formato que eventosBase para poder combinarlos
    id:    `cap-${c.id}`,
    tipo:  'captura',
    titulo: 'Medición registrada',
    desc:  `Valor: ${c.valor} — ${c.observaciones || 'Sin observaciones'}`,
    fecha: c.fechaCorte,       // usamos fechaCorte como fecha de visualización
    autor: `Usuario #${c.usuario_id}`,
    valor: c.valor,
  }))
)

// ── REGISTROS COMBINADOS: eventos + capturas reales ───────────────────────
// Fusiona los eventos fijos y las capturas reales en un solo array,
// ordenado por fecha de más antiguo a más reciente.
// Así el historial siempre está en orden cronológico sin importar
// cuándo se guardó la captura.
const registrosCombinados = computed(() => {
  const todos = [...eventosBase.value, ...capturasReales.value]
  return todos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
})

// ── OPCIONES DE FILTRO (sin cambios respecto al original) ────────────────
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

// ── FILTRADO sobre registrosCombinados ───────────────────────────────────
// Misma lógica que antes, pero ahora filtra `registrosCombinados`
// (que incluye las capturas reales) en lugar del array local `registros`.
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

function bgEstado(estadoTipo) {
  if (estadoTipo === 'success') return 'bg-emerald-400'
  if (estadoTipo === 'warning') return 'bg-amber-400'
  return 'bg-rose-400'
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full px-6 py-4">

    <BotonesRegreso
      @click="router.push('/kpis')"
      class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2 w-fit"
    >
      ← Volver al Listado
    </BotonesRegreso>

    <div v-if="!kpi" class="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <p class="text-gray-400 text-sm">No se encontró el KPI solicitado.</p>
      <button @click="router.push('/kpis')" class="mt-4 text-[#3f2a52] text-xs font-bold underline">
        Volver al listado
      </button>
    </div>

    <template v-if="kpi">

      <!-- ── Encabezado (sin cambios — ya era reactivo al store) ───────── -->
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
            <span
              class="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 border"
              :class="{
                'bg-emerald-50 text-emerald-700 border-emerald-200': kpi.estadoTipo === 'success',
                'bg-amber-50  text-amber-700  border-amber-200':     kpi.estadoTipo === 'warning',
                'bg-rose-50   text-rose-700   border-rose-200':      kpi.estadoTipo === 'danger',
              }"
            >
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="bgEstado(kpi.estadoTipo)"></span>
              {{ kpi.estado }}
            </span>
            <p class="text-xs text-gray-500 text-right">
              Valor actual: <strong class="text-gray-800">{{ kpi.progreso }}</strong>
            </p>
            <p class="text-xs text-gray-500 text-right">
              Meta: <strong class="text-gray-800">{{ kpi.meta }}</strong>
            </p>
          </div>
        </div>
      </div>

      <!-- ── Gráfica (sin cambios — ya era reactiva a kpi.historial) ──── -->
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

      <!-- ── Historial de Registros ──────────────────────────────────── -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

        <div class="mb-6 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h2 class="text-lg font-bold text-black">Historial de Registros</h2>
            <p class="text-xs text-gray-500">
              Capturas y eventos de auditoría —
              <strong class="text-[#3f2a52]">Periodicidad {{ kpi.periodicidad }}</strong>
              ·
              <!--
                Contador reactivo: muestra cuántas capturas reales hay
                para este KPI en el store. Se actualiza automáticamente
                cuando se guarda una nueva captura desde CapturaMetricas.
              -->
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
                <!--
                  El ícono cambia según el tipo de registro:
                  - captura  → ícono de estadística (valor medido)
                  - evento   → ícono de lápiz (cambio de configuración)
                  Así el usuario puede distinguir visualmente ambos tipos.
                -->
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
                    <!--
                      Badge que diferencia visualmente capturas de eventos.
                      Las capturas tienen el valor registrado como badge.
                    -->
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

          <!-- Estado vacío -->
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