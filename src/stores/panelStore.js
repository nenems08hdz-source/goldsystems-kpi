import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePanelStore = defineStore('panelStore', () => {

const indicadores = ref([
  {
    id: 1,
    // ── Departamento ahora es un área de negocio real ──
    departamento: 'Tecnología',
    subtitulo: 'Uptime & Latencia',
    objetivo: '99.95%',
    progreso: 99.98,
    estado: 'saludable',
    estadoTipo: 'success',
    periodicidad: 'Trimestral',
    responsable: 'Carlos Méndez',
    historial: [99.91, 99.95, 100, 99.98, 99.97, 99.99, 99.98, 99.96],
    etiquetasHistorial: ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'],
    graficasCompatibles: ['linea', 'radial'],
    nombre: 'Uptime & Latencia de Servidores',
    formula: '(Tiempo Activo / Tiempo Total) * 100',
    tipoMetrica: 'Porcentaje',   // ← antes era 'categoria'
    meta: '99.95%',
    tendencia: 'subiendo',
    ultimaActualizacion: '2025-08-01',
  },
  {
    id: 2,
    departamento: 'Tecnología',
    subtitulo: 'Web Vitals',
    objetivo: '85 pts',
    progreso: 78,
    estado: 'en riesgo',
    estadoTipo: 'warning',
    periodicidad: 'Mensual',
    responsable: 'Ana López',
    historial: [72, 74, 71, 75, 76, 73, 78, 77],
    etiquetasHistorial: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago'],
    graficasCompatibles: ['barras', 'area'],
    nombre: 'Rendimiento Web (Core Vitals)',
    formula: 'Puntuación compuesta de LCP + FID + CLS',
    tipoMetrica: 'Puntaje',
    meta: '85 pts',
    tendencia: 'subiendo',
    ultimaActualizacion: '2025-08-03',
  },
  {
    id: 3,
    departamento: 'Operaciones',
    subtitulo: 'Vulnerabilidades',
    objetivo: '0 Críticas',
    progreso: 45,
    estado: 'critico',
    estadoTipo: 'danger',
    periodicidad: 'Mensual',
    responsable: 'Roberto Díaz',
    historial: [8, 5, 7, 4, 6, 9, 3, 5],
    etiquetasHistorial: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago'],
    graficasCompatibles: ['barras', 'linea'],
    nombre: 'Vulnerabilidades Críticas Detectadas',
    formula: 'Total de CVEs críticos sin parchear / Total detectados',
    tipoMetrica: 'Porcentaje',
    meta: '0 Críticas',
    tendencia: 'bajando',
    ultimaActualizacion: '2025-08-02',
  },
  {
    id: 4,
    departamento: 'Operaciones',
    subtitulo: 'Uso de CPU & Memoria',
    objetivo: '< 75%',
    progreso: 88,
    estado: 'critico',
    estadoTipo: 'danger',
    periodicidad: 'Semanal',
    responsable: 'Laura Torres',
    historial: [70, 75, 80, 82, 85, 83, 88, 86],
    etiquetasHistorial: ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'],
    graficasCompatibles: ['area', 'barras'],
    nombre: 'Uso de Recursos Cloud (CPU & RAM)',
    formula: '(CPU usado + RAM usada) / (CPU total + RAM total) * 100',
    tipoMetrica: 'Porcentaje',
    meta: '< 75%',
    tendencia: 'subiendo',
    ultimaActualizacion: '2025-08-04',
  },
  {
    id: 5,
    departamento: 'Tecnología',
    subtitulo: 'Despliegues Exitosos',
    objetivo: '95%',
    progreso: 96.5,
    estado: 'saludable',
    estadoTipo: 'success',
    periodicidad: 'Diario',
    responsable: 'Miguel Ruiz',
    historial: [94, 95, 97, 96, 98, 96, 97, 96.5],
    etiquetasHistorial: ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'],
    graficasCompatibles: ['linea', 'barras'],
    nombre: 'Tasa de Despliegues Exitosos',
    formula: 'Despliegues exitosos / Total de despliegues * 100',
    tipoMetrica: 'Porcentaje',
    meta: '95%',
    tendencia: 'estable',
    ultimaActualizacion: '2025-08-05',
  },
  {
    id: 6,
    departamento: 'Operaciones',
    subtitulo: 'Optimización de Queries',
    objetivo: '< 200ms',
    progreso: 60,
    estado: 'en riesgo',
    estadoTipo: 'warning',
    periodicidad: 'Diario',
    responsable: 'Sofía Herrera',
    historial: [180, 190, 210, 200, 195, 220, 205, 198],
    etiquetasHistorial: ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'],
    graficasCompatibles: ['linea', 'area'],
    nombre: 'Tiempo de Respuesta de Queries',
    formula: 'Tiempo promedio de ejecución de queries críticas en ms',
    tipoMetrica: 'Tiempo',
    meta: '< 200ms',
    tendencia: 'bajando',
    ultimaActualizacion: '2025-08-03',
  },
  {
    id: 7,
    departamento: 'Calidad',
    subtitulo: 'Cobertura de Pruebas',
    objetivo: '> 80%',
    progreso: 84,
    estado: 'saludable',
    estadoTipo: 'success',
    periodicidad: 'Trimestral',
    responsable: 'Diego Vargas',
    historial: [75, 78, 79, 80, 81, 82, 83, 84],
    etiquetasHistorial: ['Q1','Q2','Q3','Q4','Q1','Q2','Q3','Q4'],
    graficasCompatibles: ['area', 'barras'],
    nombre: 'Cobertura de Pruebas Automatizadas',
    formula: 'Líneas de código cubiertas / Total de líneas * 100',
    tipoMetrica: 'Porcentaje',
    meta: '> 80%',
    tendencia: 'subiendo',
    ultimaActualizacion: '2025-07-30',
  },
  {
    id: 8,
    departamento: 'Finanzas',
    subtitulo: 'Presupuesto Mensual',
    objetivo: '$5,000 USD',
    progreso: 92,
    estado: 'en riesgo',
    estadoTipo: 'warning',
    periodicidad: 'Mensual',
    responsable: 'Valeria Núñez',
    historial: [4200, 4500, 4800, 4600, 4900, 5000, 4850, 4600],
    etiquetasHistorial: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago'],
    graficasCompatibles: ['barras', 'area'],
    nombre: 'Ejecución de Presupuesto Mensual',
    formula: 'Gasto real del mes / Presupuesto asignado * 100',
    tipoMetrica: 'Monetario',
    meta: '$5,000 USD',
    tendencia: 'estable',
    ultimaActualizacion: '2025-08-01',
  },
])

  // ── Todo lo demás del store queda exactamente igual ──
  const promedioSaludKpis = computed(() => {
    const saludables = indicadores.value.filter(i => i.estadoTipo === 'success').length
    return Math.round((saludables / indicadores.value.length) * 100 * 10) / 10
  })

  const datosParaGraficaBarras = computed(() => ({
    categorias: indicadores.value.map(i => i.departamento.split(' ')[0]),
    valores: indicadores.value.map(i => i.progreso)
  }))

  // ── NUEVO: computed que calcula los contadores para tarjetasestado ──
  // Así GestionKpis no tiene que calcularlos manualmente
  const contadorEstados = computed(() => ({
    saludables: indicadores.value.filter(i => i.estadoTipo === 'success').length,
    alerta: indicadores.value.filter(i => i.estadoTipo === 'warning').length,
    criticos: indicadores.value.filter(i => i.estadoTipo === 'danger').length,
    total: indicadores.value.length,
  }))

  // ── Antes decía 'categorias', ahora dice 'tiposMetrica' ──
const tiposMetrica = computed(() =>
  [...new Set(indicadores.value.map(i => i.tipoMetrica))]
)

// Los departamentos únicos (ahora son solo 4)
const departamentos = computed(() =>
  [...new Set(indicadores.value.map(i => i.departamento))]
)

// Periodicidades únicas para el filtro nuevo
const periodicidades = computed(() =>
  [...new Set(indicadores.value.map(i => i.periodicidad))]
)

  const widgets = ref([
    { id: 'tarjetas', nombre: 'Tarjetas KPI',             iconoNombre: 'LayoutDashboard', descripcion: 'Resumen rápido de los KPIs activos' },
    { id: 'graficas', nombre: 'Medidor y Progreso',        iconoNombre: 'BarChart2',       descripcion: 'Gráfica circular y barras de progreso' },
    { id: 'criticos', nombre: 'KPIs Críticos y en Riesgo', iconoNombre: 'AlertTriangle',   descripcion: 'Lista de indicadores que necesitan atención' },
    { id: 'detalle',  nombre: 'Métricas Detalladas',       iconoNombre: 'ClipboardList',   descripcion: 'Tabla completa por departamento' },
  ])

  const kpisActivos = ref([1, 2, 3, 4])
  const modoGrafica = ref('general')
  const kpiSeleccionadoGrafica = ref(1)
  const tipoGraficaEspecifica = ref('linea')

  const indicadoresActivos = computed(() =>
    indicadores.value.filter(i => kpisActivos.value.includes(i.id))
  )

  const kpiParaGrafica = computed(() =>
    indicadores.value.find(i => i.id === kpiSeleccionadoGrafica.value)
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
    contadorEstados,
    widgets,
    kpisActivos,
    modoGrafica,
    kpiSeleccionadoGrafica,
    tipoGraficaEspecifica,
    kpiParaGrafica,
    tiposMetrica,      // ← nuevo nombre
    departamentos,     // ← nuevo nombre
    periodicidades, 
    guardarOrden,
    cargarOrden,
    guardarPreferencias,
    cargarPreferencias,
    
  }
})