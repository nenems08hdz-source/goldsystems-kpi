import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useKpiStore }  from './kpiStore'
import { useAuthStore } from './authStore'
import api from '../services/api'

const DEPTO_KEY = 'ui_departamento_activo'

// Factory para no mutar el mismo objeto al resetear
const widgetsBase = () => [
  { id: 'tarjetas', nombre: 'Tarjetas KPI',              icono: 'fi-sr-apps',            descripcion: 'Resumen rápido de los KPIs activos' },
  { id: 'graficas', nombre: 'Medidor y Progreso',         icono: 'fi-sr-stats',           descripcion: 'Gráfica circular y barras de progreso' },
  { id: 'criticos', nombre: 'KPIs Críticos y en Riesgo', icono: 'fi-sr-exclamation',     descripcion: 'Lista de indicadores que necesitan atención' },
  { id: 'detalle',  nombre: 'Métricas Detalladas',        icono: 'fi-sr-document-signed', descripcion: 'Tabla completa por departamento' },
]

export const useUiStore = defineStore('uiStore', () => {

  const kpiStore  = useKpiStore()
  const authStore = useAuthStore()

  // Persiste el departamento activo entre recargas de página
  const _storedDepto = sessionStorage.getItem(DEPTO_KEY)
  const departamentoActivo = ref(_storedDepto ? Number(_storedDepto) : null)

  watch(departamentoActivo, (val) => {
    if (val) sessionStorage.setItem(DEPTO_KEY, String(val))
    else     sessionStorage.removeItem(DEPTO_KEY)
  })

  const widgets = ref(widgetsBase())

  const kpisActivos            = ref([])
  const modoGrafica            = ref('general')
  const kpiSeleccionadoGrafica = ref(null)
  const tipoGraficaEspecifica  = ref('linea')

  const indicadoresActivos = computed(() =>
    kpiStore.indicadores.filter(i => kpisActivos.value.includes(i.id))
  )

  const kpiParaGrafica = computed(() =>
    kpiStore.indicadores.find(i => i.id === kpiSeleccionadoGrafica.value)
  )

  async function guardarConfig() {
    const config = {
      orden:                  widgets.value.map(w => ({ id: w.id })),
      kpisActivos:            kpisActivos.value,
      modoGrafica:            modoGrafica.value,
      kpiSeleccionadoGrafica: kpiSeleccionadoGrafica.value,
      tipoGraficaEspecifica:  tipoGraficaEspecifica.value,
    }
    console.log('[guardarConfig] enviando →', JSON.stringify({ department_id: departamentoActivo.value, config }))
    await api.post('/dashboard-config', {
      department_id: departamentoActivo.value,
      config,
    })
    console.log('[guardarConfig] guardado OK')
  }

  async function cargarConfig() {
    const qs = departamentoActivo.value
      ? `?department_id=${departamentoActivo.value}&_t=${Date.now()}`
      : `?_t=${Date.now()}`
    const { data } = await api.get(`/dashboard-config${qs}`)
    console.log('[cargarConfig] dept=', departamentoActivo.value, '→ data=', JSON.stringify(data))

    // ── Siempre resetear antes de aplicar la nueva config ───────────────
    // Esto evita que KPIs de otro departamento contaminen el contador
    widgets.value                = widgetsBase()
    kpisActivos.value            = []
    modoGrafica.value            = 'general'
    kpiSeleccionadoGrafica.value = null
    tipoGraficaEspecifica.value  = 'linea'
    // ────────────────────────────────────────────────────────────────────

    if (!data) return

    const base = {
      tarjetas: 'fi-sr-apps',
      graficas:  'fi-sr-stats',
      criticos:  'fi-sr-exclamation',
      detalle:   'fi-sr-document-signed',
    }
    const nombresBase = {
      tarjetas: 'Tarjetas KPI',
      graficas:  'Medidor y Progreso',
      criticos:  'KPIs Críticos y en Riesgo',
      detalle:   'Métricas Detalladas',
    }
    const descripcionesBase = {
      tarjetas: 'Resumen rápido de los KPIs activos',
      graficas:  'Gráfica circular y barras de progreso',
      criticos:  'Lista de indicadores que necesitan atención',
      detalle:   'Tabla completa por departamento',
    }

    if (data.orden) {
      widgets.value = data.orden.map(w => ({
        id:          w.id,
        icono:       base[w.id] ?? w.icono,
        nombre:      nombresBase[w.id] ?? w.id,
        descripcion: descripcionesBase[w.id] ?? '',
      }))
    }
    if (data.kpisActivos)            kpisActivos.value            = data.kpisActivos
    if (data.modoGrafica)            modoGrafica.value            = data.modoGrafica
    if (data.kpiSeleccionadoGrafica) kpiSeleccionadoGrafica.value = data.kpiSeleccionadoGrafica
    if (data.tipoGraficaEspecifica)  tipoGraficaEspecifica.value  = data.tipoGraficaEspecifica
  }

  // Compatibilidad con PersonalizarPantalla y PanelPrincipal
  function guardarOrden(nuevoOrden) { widgets.value = nuevoOrden }
  function guardarPreferencias()    { guardarConfig() }
  function cargarOrden()            {}
  function cargarPreferencias()     {}

  return {
    widgets,
    kpisActivos,
    modoGrafica,
    kpiSeleccionadoGrafica,
    tipoGraficaEspecifica,
    indicadoresActivos,
    kpiParaGrafica,
    departamentoActivo,
    guardarConfig,
    cargarConfig,
    guardarOrden,
    guardarPreferencias,
    cargarOrden,
    cargarPreferencias,
  }
})
