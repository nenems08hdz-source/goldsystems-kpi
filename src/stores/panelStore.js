import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePanelStore = defineStore('panelStore', () => {

  // Datos de los KPIs
  const indicadores = ref([
    {
      id: 1,
      departamento: 'Backend & API',
      subtitulo: 'Uptime & Latencia',
      icono: 'database',
      objetivo: '99.95%',
      progreso: 99.98,
      estado: 'saludable',
      estadoTipo: 'success',
      periodicidad: 'Trimestral',
      responsable: 'Carlos Méndez',
      historial: [99.91, 99.95, 100, 99.98, 99.97, 99.99, 99.98, 99.96], // Datos simulados para la gráfica específica
      etiquetasHistorial: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
      graficasCompatibles: ['linea', 'radial'],
    },
    {
      id: 2,
      departamento: 'Frontend Architecture',
      subtitulo: 'Web Vitals',
      icono: 'browser',
      objetivo: '85 pts',
      progreso: 78,
      estado: 'en riesgo',
      estadoTipo: 'warning',
      periodicidad: 'Mensual',
      responsable: 'Ana López',
      historial: [72, 74, 71, 75, 76, 73, 78, 77],
      etiquetasHistorial: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
      graficasCompatibles: ['barras', 'area'],
    },
    {
      id: 3,
      departamento: 'Ciberseguridad',
      subtitulo: 'Vulnerabilidades',
      icono: 'shield',
      objetivo: '0 Críticas',
      progreso: 45,
      estado: 'critico',
      estadoTipo: 'danger',
      periodicidad: 'Mensual',
      responsable: 'Roberto Díaz',
      historial: [8, 5, 7, 4, 6, 9, 3, 5],
      etiquetasHistorial: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
      graficasCompatibles: ['barras', 'linea'],
    },
    {
      id: 4,
      departamento: 'Cloud Infrastructure',
      subtitulo: 'Uso de CPU & Memoria',
      icono: 'server',
      objetivo: '< 75%',
      progreso: 88,
      estado: 'critico',
      estadoTipo: 'danger',
      periodicidad: 'Semanal',
      responsable: 'Laura Torres',
      historial: [70, 75, 80, 82, 85, 83, 88, 86],
      etiquetasHistorial: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
      graficasCompatibles: ['area', 'barras'],
    },
    {
      id: 5,
      departamento: 'DevOps & CI/CD',
      subtitulo: 'Despliegues Exitosos',
      icono: 'rocket',
      objetivo: '95%',
      progreso: 96.5,
      estado: 'saludable',
      estadoTipo: 'success',
      periodicidad: 'Diario',
      responsable: 'Miguel Ruiz',
      historial: [94, 95, 97, 96, 98, 96, 97, 96.5],
      etiquetasHistorial: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
      graficasCompatibles: ['linea', 'barras'],
    },
    {
      id: 6,
      departamento: 'Database Cluster',
      subtitulo: 'Optimización de Queries',
      icono: 'database-settings',
      objetivo: '< 200ms',
      progreso: 60,
      estado: 'en riesgo',
      estadoTipo: 'warning',
      periodicidad: 'Diario',
      responsable: 'Sofía Herrera',
      historial: [180, 190, 210, 200, 195, 220, 205, 198],
      etiquetasHistorial: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
      graficasCompatibles: ['linea', 'area'],
    },
    {
      id: 7,
      departamento: 'QA & Automation',
      subtitulo: 'Cobertura de Pruebas',
      icono: 'test-tube',
      objetivo: '> 80%',
      progreso: 84,
      estado: 'saludable',
      estadoTipo: 'success',
      periodicidad: 'Trimestral',
      responsable: 'Diego Vargas',
      historial: [75, 78, 79, 80, 81, 82, 83, 84],
      etiquetasHistorial: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4'],
      graficasCompatibles: ['area', 'barras'],
    },
    {
      id: 8,
      departamento: 'FinOps & Costos',
      subtitulo: 'Presupuesto Mensual',
      icono: 'credit-card',
      objetivo: '$5,000 USD',
      progreso: 92,
      estado: 'en riesgo',
      estadoTipo: 'warning',
      periodicidad: 'Mensual',
      responsable: 'Valeria Núñez',
      historial: [4200, 4500, 4800, 4600, 4900, 5000, 4850, 4600],
      etiquetasHistorial: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
      graficasCompatibles: ['barras', 'area'],
    },
  ])

  // ─── COMPUTED (igual que antes) ──────────────────────────────────────────
  const promedioSaludKpis = computed(() => {
    const saludables = indicadores.value.filter(i => i.estadoTipo === 'success').length
    return Math.round((saludables / indicadores.value.length) * 100 * 10) / 10
  })

  const datosParaGraficaBarras = computed(() => ({
    categorias: indicadores.value.map(i => i.departamento.split(' ')[0]),
    valores: indicadores.value.map(i => i.progreso)
  }))

  // Orden de widgets 
  const widgets = ref([
    { id: 'tarjetas', nombre: 'Tarjetas KPI',             icono: '', descripcion: 'Resumen rápido de los KPIs activos' },
    { id: 'graficas', nombre: 'Medidor y Progreso',        icono: '', descripcion: 'Gráfica circular y barras de progreso' },
    { id: 'criticos', nombre: 'KPIs Críticos y en Riesgo', icono: '', descripcion: 'Lista de indicadores que necesitan atención' },
    { id: 'detalle',  nombre: 'Métricas Detalladas',       icono: '', descripcion: 'Tabla completa por departamento' },
  ])

  // preferencias del usuario

  // ids de los KPIs que el usuario quiere ver en las tarjetas del panel.
  const kpisActivos = ref([1, 2, 3, 4])

  // Modo de las gráficas:
  // 'general' = MedidorKpi y ProgresoKpi (las que ya existen)
  // 'especifica' = GraficaKpiEspecifica con los datos del KPI seleccionado
  const modoGrafica = ref('general')

  // ID del KPI cuya gráfica específica se mostrará.
  // Solo importa cuando modoGrafica === 'especifica'
  const kpiSeleccionadoGrafica = ref(1)

  // Tipo de gráfica específica elegida ('linea', 'barras', 'area', 'radial')
  const tipoGraficaEspecifica = ref('linea')

  // ─── NUEVO: COMPUTED que filtra los KPIs activos ─────────────────────────
  // PanelPrincipal usará esto en lugar de slice(0,4)
  const indicadoresActivos = computed(() =>
    indicadores.value.filter(i => kpisActivos.value.includes(i.id))
  )

  // El KPI completo que está seleccionado para la gráfica específica
  const kpiParaGrafica = computed(() =>
    indicadores.value.find(i => i.id === kpiSeleccionadoGrafica.value)
  )

  // ─── FUNCIONES DE PERSISTENCIA ───────────────────────────────────────────
  function guardarOrden(nuevoOrden) {
    widgets.value = nuevoOrden
    localStorage.setItem('panelWidgetsOrden', JSON.stringify(nuevoOrden))
  }

  function cargarOrden() {
    const guardado = localStorage.getItem('panelWidgetsOrden')
    if (guardado) widgets.value = JSON.parse(guardado)
  }

  // ─── NUEVO: guardar y cargar las preferencias de KPIs y gráficas ─────────
  function guardarPreferencias() {
    const preferencias = {
      kpisActivos: kpisActivos.value,
      modoGrafica: modoGrafica.value,
      kpiSeleccionadoGrafica: kpiSeleccionadoGrafica.value,
      tipoGraficaEspecifica: tipoGraficaEspecifica.value,
    }
    localStorage.setItem('panelPreferencias', JSON.stringify(preferencias))
  }

  function cargarPreferencias() {
    const guardado = localStorage.getItem('panelPreferencias')
    if (guardado) {
      const p = JSON.parse(guardado)
      kpisActivos.value = p.kpisActivos
      modoGrafica.value = p.modoGrafica
      kpiSeleccionadoGrafica.value = p.kpiSeleccionadoGrafica
      tipoGraficaEspecifica.value = p.tipoGraficaEspecifica
    }
  }

  return {
    indicadores,
    indicadoresActivos,
    promedioSaludKpis,
    datosParaGraficaBarras,
    widgets,
    kpisActivos,
    modoGrafica,
    kpiSeleccionadoGrafica,
    tipoGraficaEspecifica,
    kpiParaGrafica,
    guardarOrden,
    cargarOrden,
    guardarPreferencias,
    cargarPreferencias,
  }
})