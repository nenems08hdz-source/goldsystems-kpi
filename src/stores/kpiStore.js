import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useKpiStore = defineStore('kpiStore', () => {

  const indicadores = ref([
    {
      id: 1,
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
      tipoMetrica: 'Porcentaje',
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

  const kpisAsignados = ref([
    { usuario_id: 1, kpi_id: 2, fechaAsignacion: '2025-07-01' },
    { usuario_id: 1, kpi_id: 5, fechaAsignacion: '2025-07-01' },
    { usuario_id: 2, kpi_id: 1, fechaAsignacion: '2025-07-01' },
    { usuario_id: 2, kpi_id: 5, fechaAsignacion: '2025-07-10' },
    { usuario_id: 3, kpi_id: 4, fechaAsignacion: '2025-07-01' },
    { usuario_id: 3, kpi_id: 6, fechaAsignacion: '2025-07-01' },
    { usuario_id: 5, kpi_id: 1, fechaAsignacion: '2025-07-15' },
    { usuario_id: 5, kpi_id: 3, fechaAsignacion: '2025-07-15' },
    { usuario_id: 6, kpi_id: 2, fechaAsignacion: '2025-07-01' },
    { usuario_id: 6, kpi_id: 8, fechaAsignacion: '2025-07-01' },
    { usuario_id: 7, kpi_id: 7, fechaAsignacion: '2025-07-01' },
  ])

  const capturas = ref([])

  function capturasPorKpi(kpiId) {
    return capturas.value
      .filter(c => c.kpi_id === kpiId)
      .sort((a, b) => new Date(a.fechaCorte) - new Date(b.fechaCorte))
  }

  function etiquetaCaptura(periodicidad, fechaCorte) {
    const fecha = new Date(fechaCorte + 'T00:00:00')
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
    if (periodicidad === 'Mensual')    return meses[fecha.getMonth()]
    if (periodicidad === 'Trimestral') return `Q${Math.floor(fecha.getMonth() / 3) + 1}`
    if (periodicidad === 'Semanal') {
      const inicioAnio = new Date(fecha.getFullYear(), 0, 1)
      const semana = Math.ceil(((fecha - inicioAnio) / 86400000 + inicioAnio.getDay() + 1) / 7)
      return `Sem ${semana}`
    }
    if (periodicidad === 'Diario') {
      return `${String(fecha.getDate()).padStart(2, '0')} ${meses[fecha.getMonth()]}`
    }
    return fechaCorte
  }

  function registrarCaptura(nuevaCaptura) {
    capturas.value.push({ id: Date.now(), fechaRegistro: new Date().toISOString(), ...nuevaCaptura })
    const kpi = indicadores.value.find(k => k.id === nuevaCaptura.kpi_id)
    if (!kpi) return
    const etiqueta = etiquetaCaptura(kpi.periodicidad, nuevaCaptura.fechaCorte)
    kpi.historial.push(Number(nuevaCaptura.valor))
    kpi.etiquetasHistorial.push(etiqueta)
    kpi.progreso = Number(nuevaCaptura.valor)
    kpi.ultimaActualizacion = nuevaCaptura.fechaCorte
    if (kpi.progreso >= 80)      { kpi.estado = 'saludable'; kpi.estadoTipo = 'success' }
    else if (kpi.progreso >= 50) { kpi.estado = 'en riesgo'; kpi.estadoTipo = 'warning' }
    else                         { kpi.estado = 'critico';   kpi.estadoTipo = 'danger'  }
  }

  function kpisDeUsuario(userId) {
    return kpisAsignados.value
      .filter(a => a.usuario_id === userId)
      .map(a => indicadores.value.find(k => k.id === a.kpi_id))
      .filter(Boolean)
  }

  function estadoCaptura(kpi) {
    const intervaloDias = { 'Diario': 1, 'Semanal': 7, 'Mensual': 30, 'Trimestral': 90 }
    const dias = intervaloDias[kpi.periodicidad] ?? 30
    const ultimaFecha = new Date(kpi.ultimaActualizacion + 'T00:00:00')
    const vencimiento = new Date(ultimaFecha)
    vencimiento.setDate(vencimiento.getDate() + dias)
    const msHastaVencer = vencimiento - new Date()
    if (msHastaVencer < 0)                       return 'retrasada'
    if (msHastaVencer / (1000 * 60 * 60) <= 4)   return 'porVencer'
    return 'aTiempo'
  }

  const promedioSaludKpis = computed(() => {
    const saludables = indicadores.value.filter(i => i.estadoTipo === 'success').length
    return Math.round((saludables / indicadores.value.length) * 100 * 10) / 10
  })

  const datosParaGraficaBarras = computed(() => ({
    categorias: indicadores.value.map(i => i.departamento.split(' ')[0]),
    valores:    indicadores.value.map(i => i.progreso),
  }))

  const contadorEstados = computed(() => ({
    saludables: indicadores.value.filter(i => i.estadoTipo === 'success').length,
    alerta:     indicadores.value.filter(i => i.estadoTipo === 'warning').length,
    criticos:   indicadores.value.filter(i => i.estadoTipo === 'danger').length,
    total:      indicadores.value.length,
  }))

  const tiposMetrica   = computed(() => [...new Set(indicadores.value.map(i => i.tipoMetrica))])
  const departamentos  = computed(() => [...new Set(indicadores.value.map(i => i.departamento))])
  const periodicidades = computed(() => [...new Set(indicadores.value.map(i => i.periodicidad))])

  return {
    indicadores,
    capturas,
    kpisAsignados,
    promedioSaludKpis,
    datosParaGraficaBarras,
    contadorEstados,
    tiposMetrica,
    departamentos,
    periodicidades,
    kpisDeUsuario,
    estadoCaptura,
    registrarCaptura,
    capturasPorKpi,
    etiquetaCaptura,
  }
})
