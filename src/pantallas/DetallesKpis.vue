<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePanelStore } from '../stores/panelStore'
import GraficaKpiEspecifica from '../components/GraficaKpiEspecifica.vue'

const route = useRoute()
const router = useRouter()
const store = usePanelStore()

const idKpi = Number(route.params.id)
const kpi = computed(() => store.indicadores.find(i => i.id === idKpi))
const tipoSeleccionado = ref(kpi.value?.graficasCompatibles?.[0] ?? 'linea')

// ── REGISTROS DEL HISTORIAL ──────────────────────────────────────────────
// Cada registro tiene una fecha en formato 'YYYY-MM-DD'.
// El filtro usará esta fecha para agrupar por día, semana, mes o trimestre
// dependiendo de la periodicidad del KPI.
const registros = ref([
  { id: 1, titulo: 'Medición registrada',         desc: 'Valor capturado según periodicidad del KPI.',   fecha: '2024-01-08', autor: 'Sistema' },
  { id: 2, titulo: 'Actualización de Meta SLA',   desc: 'El umbral de Óptimo se elevó al nivel actual.', fecha: '2024-01-15', autor: 'Carlos M.' },
  { id: 3, titulo: 'Medición registrada',         desc: 'Valor capturado según periodicidad del KPI.',   fecha: '2024-02-05', autor: 'Sistema' },
  { id: 4, titulo: 'Nuevo Responsable',           desc: 'Asignación del equipo SRE-A al indicador.',     fecha: '2024-02-20', autor: 'Admin' },
  { id: 5, titulo: 'Medición registrada',         desc: 'Valor capturado según periodicidad del KPI.',   fecha: '2024-03-10', autor: 'Sistema' },
  { id: 6, titulo: 'Ajuste de Fórmula',           desc: 'Se corrigió el cálculo base del indicador.',    fecha: '2024-03-25', autor: 'Usuario' },
  { id: 7, titulo: 'Medición registrada',         desc: 'Valor capturado según periodicidad del KPI.',   fecha: '2024-04-03', autor: 'Sistema' },
  { id: 8, titulo: 'Medición registrada',         desc: 'Valor capturado según periodicidad del KPI.',   fecha: '2024-05-14', autor: 'Sistema' },
  { id: 9, titulo: 'Cambio de Periodicidad',      desc: 'Se ajustó la frecuencia de medición.',          fecha: '2024-06-01', autor: 'Admin' },
  { id: 10, titulo: 'Medición registrada',        desc: 'Valor capturado según periodicidad del KPI.',   fecha: '2024-06-18', autor: 'Sistema' },
])

// ── OPCIONES DE FILTRO SEGÚN PERIODICIDAD ────────────────────────────────
// Este computed genera las opciones del selector dinámicamente.
// Si el KPI es "Mensual" → muestra meses.
// Si es "Trimestral" → muestra Q1, Q2, Q3, Q4.
// Si es "Semanal" o "Diario" → muestra semanas del año.
const opcionesFiltro = computed(() => {
  if (!kpi.value) return []

  const periodicidad = kpi.value.periodicidad

  if (periodicidad === 'Mensual') {
    return [
      { label: 'Todos los meses', valor: 'todos' },
      { label: 'Enero',      valor: '2024-01' },
      { label: 'Febrero',    valor: '2024-02' },
      { label: 'Marzo',      valor: '2024-03' },
      { label: 'Abril',      valor: '2024-04' },
      { label: 'Mayo',       valor: '2024-05' },
      { label: 'Junio',      valor: '2024-06' },
      { label: 'Julio',      valor: '2024-07' },
      { label: 'Agosto',     valor: '2024-08' },
      { label: 'Septiembre', valor: '2024-09' },
      { label: 'Octubre',    valor: '2024-10' },
      { label: 'Noviembre',  valor: '2024-11' },
      { label: 'Diciembre',  valor: '2024-12' },
    ]
  }

  if (periodicidad === 'Trimestral') {
    return [
      { label: 'Todos los trimestres', valor: 'todos' },
      { label: 'Q1 (Ene–Mar)', valor: 'Q1' },
      { label: 'Q2 (Abr–Jun)', valor: 'Q2' },
      { label: 'Q3 (Jul–Sep)', valor: 'Q3' },
      { label: 'Q4 (Oct–Dic)', valor: 'Q4' },
    ]
  }

  if (periodicidad === 'Semanal' || periodicidad === 'Diario') {
    return [
      { label: 'Todos los registros', valor: 'todos' },
      { label: 'Semana 1  (1–7)',    valor: 'sem-1' },
      { label: 'Semana 2  (8–14)',   valor: 'sem-2' },
      { label: 'Semana 3  (15–21)',  valor: 'sem-3' },
      { label: 'Semana 4  (22–31)',  valor: 'sem-4' },
    ]
  }

  // Fallback para cualquier otra periodicidad
  return [{ label: 'Todos los registros', valor: 'todos' }]
})

// El valor activo del filtro — inicia en 'todos'
const filtroActivo = ref('todos')

// ── COMPUTED: registros filtrados según periodicidad ─────────────────────
const registrosFiltrados = computed(() => {
  if (filtroActivo.value === 'todos') return registros.value

  const periodicidad = kpi.value?.periodicidad

  return registros.value.filter(r => {
    const fecha = new Date(r.fecha)
    const mes = fecha.getMonth() // 0=Enero, 11=Diciembre
    const dia = fecha.getDate()

    // Filtro mensual: comparamos el inicio de la fecha con 'YYYY-MM'
    if (periodicidad === 'Mensual') {
      return r.fecha.startsWith(filtroActivo.value)
    }

    // Filtro trimestral: agrupamos los meses en bloques de 3
    if (periodicidad === 'Trimestral') {
      if (filtroActivo.value === 'Q1') return mes >= 0 && mes <= 2   // Ene-Mar
      if (filtroActivo.value === 'Q2') return mes >= 3 && mes <= 5   // Abr-Jun
      if (filtroActivo.value === 'Q3') return mes >= 6 && mes <= 8   // Jul-Sep
      if (filtroActivo.value === 'Q4') return mes >= 9 && mes <= 11  // Oct-Dic
    }

    // Filtro semanal/diario: agrupamos por rango de días del mes
    if (periodicidad === 'Semanal' || periodicidad === 'Diario') {
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

      <!-- Encabezado -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div class="flex justify-between items-start flex-wrap gap-4">
          <div>
            <span class="text-[10px] font-bold bg-[#3f2a52]/10 text-[#3f2a52] px-2 py-0.5 rounded border border-[#3f2a52]/20 uppercase tracking-wider">
              {{ kpi.departamento }}
            </span>
            <h1 class="text-xl font-bold text-gray-900 mt-2">{{ kpi.nombre }}</h1>
            <p class="text-xs text-gray-400 mt-0.5">{{ kpi.formula }}</p>
            <div class="flex items-center gap-2 mt-3 flex-wrap">
              <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 uppercase">
                {{ kpi.tipoMetrica }}
              </span>
              <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 uppercase">
                {{ kpi.periodicidad }}
              </span>
              <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 uppercase">
                Resp: {{ kpi.responsable }}
              </span>
            </div>
          </div>

          <div class="flex flex-col items-end gap-2">
            <span
              class="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 border"
              :class="{
                'bg-emerald-50 text-emerald-700 border-emerald-200': kpi.estadoTipo === 'success',
                'bg-amber-50 text-amber-700 border-amber-200':       kpi.estadoTipo === 'warning',
                'bg-rose-50 text-rose-700 border-rose-200':          kpi.estadoTipo === 'danger',
              }"
            >
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="bgEstado(kpi.estadoTipo)"></span>
              {{ kpi.estado }}
            </span>
            <p class="text-xs text-gray-500 text-right">
              Valor actual: <strong class="text-gray-800">{{ kpi.progreso }}%</strong>
            </p>
            <p class="text-xs text-gray-500 text-right">
              Meta: <strong class="text-gray-800">{{ kpi.meta }}</strong>
            </p>
          </div>
        </div>
      </div>

      <!-- Gráfica -->
      <div class="bg-[#3f2a52] border border-[#beaed8]/70 rounded-2xl p-6 shadow-lg">
        <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
          <p class="text-[11px] font-bold text-[#beaed8] uppercase tracking-wider">
            Registro de Mediciones
          </p>
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

      <!-- Historial con filtro dinámico -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

        <div class="mb-6 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h2 class="text-lg font-bold text-black">Historial de Registros</h2>
            <!--
              El subtítulo muestra la periodicidad del KPI.
              Así el usuario sabe con qué frecuencia se registran datos.
            -->
            <p class="text-xs text-gray-500">
              Registros de métricas —
              <strong class="text-[#3f2a52]">Periodicidad {{ kpi.periodicidad }}</strong>
            </p>
          </div>

          <!--
            El select se genera dinámicamente con opcionesFiltro.
            Si el KPI es Mensual → muestra meses.
            Si es Trimestral → muestra Q1, Q2, Q3, Q4.
            Si es Semanal/Diario → muestra rangos de semana.
            Así el filtro siempre tiene sentido para ese KPI específico.
          -->
          <select
            v-model="filtroActivo"
            class="text-white bg-[#3f2a52] px-4 py-2 rounded-lg hover:bg-[#5a3f73] transition-colors cursor-pointer outline-none text-xs"
          >
            <option
              v-for="opcion in opcionesFiltro"
              :key="opcion.valor"
              :value="opcion.valor"
            >
              {{ opcion.label }}
            </option>
          </select>
        </div>

        <div class="space-y-4">
          <div
            v-for="r in registrosFiltrados"
            :key="r.id"
            class="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start gap-4">
              <div class="flex gap-4 flex-grow">
                <div class="p-2 bg-gray-100 rounded-lg text-gray-600 flex-shrink-0">
                  <i class="fi fi-rr-pencil text-sm"></i>
                </div>
                <div>
                  <p class="text-sm font-bold text-black">{{ r.titulo }}</p>
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

          <p v-if="registrosFiltrados.length === 0" class="text-center text-gray-400 py-4 text-sm">
            No hay registros en este periodo.
          </p>
        </div>

      </div>

    </template>
  </div>
</template>