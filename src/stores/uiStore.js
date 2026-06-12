import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useKpiStore } from './kpiStore'

export const useUiStore = defineStore('uiStore', () => {

  const kpiStore = useKpiStore()

  const widgets = ref([
    { id: 'tarjetas', nombre: 'Tarjetas KPI',             iconoNombre: 'LayoutDashboard', descripcion: 'Resumen rápido de los KPIs activos' },
    { id: 'graficas', nombre: 'Medidor y Progreso',        iconoNombre: 'BarChart2',       descripcion: 'Gráfica circular y barras de progreso' },
    { id: 'criticos', nombre: 'KPIs Críticos y en Riesgo', iconoNombre: 'AlertTriangle',   descripcion: 'Lista de indicadores que necesitan atención' },
    { id: 'detalle',  nombre: 'Métricas Detalladas',       iconoNombre: 'ClipboardList',   descripcion: 'Tabla completa por departamento' },
  ])

  const kpisActivos            = ref([1, 2, 3, 4])
  const modoGrafica            = ref('general')
  const kpiSeleccionadoGrafica = ref(1)
  const tipoGraficaEspecifica  = ref('linea')

  const indicadoresActivos = computed(() =>
    kpiStore.indicadores.filter(i => kpisActivos.value.includes(i.id))
  )

  const kpiParaGrafica = computed(() =>
    kpiStore.indicadores.find(i => i.id === kpiSeleccionadoGrafica.value)
  )

  function guardarOrden(nuevoOrden) {
    widgets.value = nuevoOrden
    localStorage.setItem('panelWidgetsOrden', JSON.stringify(nuevoOrden))
  }

  function cargarOrden() {
    const guardado = localStorage.getItem('panelWidgetsOrden')
    if (guardado) widgets.value = JSON.parse(guardado)
  }

  function guardarPreferencias() {
    const p = {
      kpisActivos:            kpisActivos.value,
      modoGrafica:            modoGrafica.value,
      kpiSeleccionadoGrafica: kpiSeleccionadoGrafica.value,
      tipoGraficaEspecifica:  tipoGraficaEspecifica.value,
    }
    localStorage.setItem('panelPreferencias', JSON.stringify(p))
  }

  function cargarPreferencias() {
    const guardado = localStorage.getItem('panelPreferencias')
    if (guardado) {
      const p = JSON.parse(guardado)
      kpisActivos.value            = p.kpisActivos
      modoGrafica.value            = p.modoGrafica
      kpiSeleccionadoGrafica.value = p.kpiSeleccionadoGrafica
      tipoGraficaEspecifica.value  = p.tipoGraficaEspecifica
    }
  }

  return {
    widgets,
    kpisActivos,
    modoGrafica,
    kpiSeleccionadoGrafica,
    tipoGraficaEspecifica,
    indicadoresActivos,
    kpiParaGrafica,
    guardarOrden,
    cargarOrden,
    guardarPreferencias,
    cargarPreferencias,
  }
})
