<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKpiStore } from '../stores/kpiStore'
import GraficaKpiEspecifica from '../components/GraficaKpiEspecifica.vue'
import StatusBadge          from '../components/StatusBadge.vue'
import EtiquetaBadge        from '../components/ui/EtiquetaBadge.vue'
import AppButton            from '../components/ui/AppButton.vue'

const route  = useRoute()
const router = useRouter()
const store  = useKpiStore()

const idKpi = Number(route.params.id)
const kpi   = computed(() => store.indicadores.find(i => i.id === idKpi))
const tipoSeleccionado = ref(kpi.value?.graficasCompatibles?.[0] ?? 'linea')

const eventosBase = ref([
  { id: 'ev-1', tipo: 'evento', titulo: 'Actualización de Meta SLA',   desc: 'El umbral de Óptimo se elevó al nivel actual.',  fecha: '2024-01-15', autor: 'Carlos M.' },
  { id: 'ev-2', tipo: 'evento', titulo: 'Nuevo Responsable',           desc: 'Asignación del equipo SRE-A al indicador.',      fecha: '2024-02-20', autor: 'Admin'     },
  { id: 'ev-3', tipo: 'evento', titulo: 'Ajuste de Fórmula',           desc: 'Se corrigió el cálculo base del indicador.',     fecha: '2024-03-25', autor: 'Usuario'   },
  { id: 'ev-4', tipo: 'evento', titulo: 'Cambio de Periodicidad',      desc: 'Se ajustó la frecuencia de medición.',           fecha: '2024-06-01', autor: 'Admin'     },
])

const capturasReales = computed(() =>
  store.capturasPorKpi(idKpi).map(c => ({
    id:     `cap-${c.id}`,
    tipo:   'captura',
    titulo: 'Medición registrada',
    desc:   `Valor: ${c.value} — ${c.notes || 'Sin observaciones'}`,
    fecha:  c.period_start,
    autor:  `Usuario #${c.captured_by}`,
    valor:  c.value,
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
    if (p === 'Mensual')    return r.fecha.startsWith(filtroActivo.value)
    if (p === 'Trimestral') {
      if (filtroActivo.value === 'Q1') return mes >= 0 && mes <= 2
      if (filtroActivo.value === 'Q2') return mes >= 3 && mes <= 5
      if (filtroActivo.value === 'Q3') return mes >= 6 && mes <= 8
      if (filtroActivo.value === 'Q4') return mes >= 9 && mes <= 11
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

    <AppButton variant="secondary" class="flex items-center gap-2 w-fit" @click="router.push('/kpis')">
      ← Volver al Listado
    </AppButton>

    <div v-if="!kpi" class="rounded-xl p-8 text-center"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">
      <p class="text-sm" style="color: var(--subtext-general);">No se encontró el KPI solicitado.</p>
      <button @click="router.push('/kpis')" class="mt-4 text-xs font-bold underline"
        style="color: var(--sidebar-bg);">
        Volver al listado
      </button>
    </div>

    <template v-if="kpi">

      <div class="rounded-xl shadow-sm p-5"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">
        <div class="flex justify-between items-start flex-wrap gap-4">
          <div>
            <EtiquetaBadge :texto="kpi.departamento" />
            <h1 class="text-xl font-bold mt-2" style="color: var(--text-general);">{{ kpi.nombre }}</h1>
            <p class="text-xs mt-0.5" style="color: var(--subtext-general);">{{ kpi.formula }}</p>
            <div class="flex items-center gap-2 mt-3 flex-wrap">
              <EtiquetaBadge :texto="kpi.tipoMetrica" />
              <EtiquetaBadge :texto="kpi.periodicidad" />
              <EtiquetaBadge :texto="`Resp: ${kpi.responsable}`" />
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <StatusBadge :tipo="kpi.estadoTipo" :texto="kpi.estado" />
            <p class="text-xs text-right" style="color: var(--subtext-general);">
              Valor actual: <strong style="color: var(--text-general);">{{ kpi.progreso }}</strong>
            </p>
            <p class="text-xs text-right" style="color: var(--subtext-general);">
              Meta: <strong style="color: var(--text-general);">{{ kpi.meta }}</strong>
            </p>
          </div>
        </div>
      </div>

      <div class="border border-[#beaed8]/70 rounded-2xl p-6 shadow-lg" style="background: var(--grafics-bg);">
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

      <div class="p-6 rounded-xl shadow-sm"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">

        <div class="mb-6 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h2 class="text-lg font-bold" style="color: var(--text-general);">Historial de Registros</h2>
            <p class="text-xs" style="color: var(--subtext-general);">
              Capturas y eventos de auditoría —
              <strong style="color: var(--tabla-header-text);">Periodicidad {{ kpi.periodicidad }}</strong>
              ·
              <span style="color: var(--tabla-header-text);">{{ capturasReales.length }} captura(s) registrada(s)</span>
            </p>
          </div>

          <select
            v-model="filtroActivo"
            class="app-select w-auto"
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
            class="p-4 rounded-lg transition-colors"
            :style="r.tipo === 'captura'
              ? 'border: 1px solid var(--tabla-borde); background: transparent;'
              : 'border: 1px solid var(--tabla-borde); background: transparent;'"
            @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
            @mouseleave="$event.currentTarget.style.background='transparent'"
          >
            <div class="flex justify-between items-start gap-4">
              <div class="flex gap-4 flex-grow">
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-bold" style="color: var(--text-general);">{{ r.titulo }}</p>
                    <span
                      v-if="r.tipo === 'captura'"
                      class="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                      style="background: rgba(63,42,82,0.1); color: var(--tabla-header-text);"
                    >
                      CAPTURA
                    </span>
                  </div>
                  <p class="text-xs mt-1" style="color: var(--subtext-general);">{{ r.desc }}</p>
                  <p class="text-[10px] mt-2 font-bold uppercase tracking-wider" style="color: var(--card-text-hint);">
                    Por: {{ r.autor }}
                  </p>
                </div>
              </div>
              <span class="text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap"
                style="background: var(--tabla-header-bg); color: var(--subtext-general);">
                {{ r.fecha }}
              </span>
            </div>
          </div>

          <div v-if="registrosFiltrados.length === 0" class="text-center py-8">
            <p class="text-sm" style="color: var(--subtext-general);">No hay registros en este periodo.</p>
            <p class="text-xs mt-1" style="color: var(--card-text-hint);">
              Las capturas guardadas desde "Captura de Métricas" aparecerán aquí.
            </p>
          </div>
        </div>

      </div>

    </template>
  </div>
</template>
