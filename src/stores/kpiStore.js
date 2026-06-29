import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─────────────────────────────────────────────────────────────────────────────
// MAPA DE CAMPOS  store ↔ BD
//
//  Store (indicadores)   BD (kpis)
//  nombre                name
//  subtitulo             subtitle
//  tipoMetrica           type  ('percentage'|'money'|'time'|'absolute'|'custom')
//  periodicidad          frequency ('daily'|'weekly'|'quarterly'|'monthly'|'annual')
//  goal                  goal  (decimal numérico de la meta)
//  unit                  unit  ('%', 'ms', '$', 'pts')
//  meta                  campo display = goal + unit (no se guarda en BD)
//  minimum/maximum       minimum / maximum
//  weight                weight
//  status                status ('active'|'inactive')
//  department_id         department_id FK→departments
//  departamento          display; vendrá de department.name en la API
//  user_id               created_by FK→users
//  responsable           display; vendrá de user.name en la API
//  company_id            company_id FK→companies
//  traffic_light         calculado: 'green'|'yellow'|'red'
//  estadoTipo            alias UI: 'success'|'warning'|'danger'
//  estado                alias UI: 'saludable'|'en riesgo'|'critico'
//  progreso              último value de kpi_records
//  historial             array values de kpi_records (mock; vendrá de la API)
//  etiquetasHistorial    labels de periodos (mock)
//  ultimaActualizacion   period_start del último kpi_record
//  graficasCompatibles   preferencia UI (no existe en BD)
//
//  Store (capturas)      BD (kpi_records)
//  kpi_id                kpi_id
//  kpi_assignment_id     kpi_assignment_id (nullable)
//  captured_by           captured_by FK→users
//  value                 value (decimal)
//  period_start          period_start (date)
//  period_end            period_end (date, nullable)
//  notes                 notes
//  created_at            created_at
//
//  Store (kpisAsignados) BD (kpi_assignments)
//  kpi_id                kpi_id
//  user_id               user_id (nullable)
//  department_id         department_id (nullable)
//  team_id               team_id (nullable)
//  start_date            start_date
//  end_date              end_date (nullable)
//  status                status ('active'|'inactive')
// ─────────────────────────────────────────────────────────────────────────────

export const useKpiStore = defineStore('kpiStore', () => {

  // ── INDICADORES (tabla: kpis) ────────────────────────────────────────────
  const indicadores = ref([
    {
      id: 1,
      nombre:       'Uptime & Latencia de Servidores',
      subtitulo:    'Uptime & Latencia',
      description:  null,
      formula:      '(Tiempo Activo / Tiempo Total) * 100',
      tipoMetrica:  'Porcentaje',
      periodicidad: 'Trimestral',
      goal:         99.95,
      unit:         '%',
      meta:         '99.95%',
      minimum:      99.00,
      maximum:      100.00,
      weight:       1.00,
      status:       'active',
      department_id: 2,
      company_id:   1,
      created_by:   2,
      user_id:      2,
      departamento:        'Tecnología',
      responsable:         'Carlos Méndez',
      progreso:            99.98,
      objetivo:            '99.95%',
      traffic_light:       'green',
      estado:              'saludable',
      estadoTipo:          'success',
      tendencia:           'subiendo',
      ultimaActualizacion: '2025-08-01',
      historial:           [99.91, 99.95, 100, 99.98, 99.97, 99.99, 99.98, 99.96],
      etiquetasHistorial:  ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'],
      graficasCompatibles: ['linea', 'radial'],
    },
    {
      id: 2,
      nombre:       'Rendimiento Web (Core Vitals)',
      subtitulo:    'Web Vitals',
      description:  null,
      formula:      'Puntuación compuesta de LCP + FID + CLS',
      tipoMetrica:  'Puntaje',
      periodicidad: 'Mensual',
      goal:         85,
      unit:         'pts',
      meta:         '85 pts',
      minimum:      70,
      maximum:      100,
      weight:       1.00,
      status:       'active',
      department_id: 2,
      company_id:   1,
      created_by:   1,
      user_id:      1,
      departamento:        'Tecnología',
      responsable:         'Ana López',
      progreso:            78,
      objetivo:            '85 pts',
      traffic_light:       'yellow',
      estado:              'en riesgo',
      estadoTipo:          'warning',
      tendencia:           'subiendo',
      ultimaActualizacion: '2025-08-03',
      historial:           [72, 74, 71, 75, 76, 73, 78, 77],
      etiquetasHistorial:  ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago'],
      graficasCompatibles: ['barras', 'area'],
    },
    {
      id: 3,
      nombre:       'Vulnerabilidades Críticas Detectadas',
      subtitulo:    'Vulnerabilidades',
      description:  null,
      formula:      'Total de CVEs críticos sin parchear / Total detectados',
      tipoMetrica:  'Porcentaje',
      periodicidad: 'Mensual',
      goal:         0,
      unit:         '%',
      meta:         '0 Críticas',
      minimum:      0,
      maximum:      100,
      weight:       1.50,
      status:       'active',
      department_id: 5,
      company_id:   1,
      created_by:   1,
      user_id:      3,
      departamento:        'Operaciones',
      responsable:         'Roberto Díaz',
      progreso:            45,
      objetivo:            '0 Críticas',
      traffic_light:       'red',
      estado:              'critico',
      estadoTipo:          'danger',
      tendencia:           'bajando',
      ultimaActualizacion: '2025-08-02',
      historial:           [8, 5, 7, 4, 6, 9, 3, 5],
      etiquetasHistorial:  ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago'],
      graficasCompatibles: ['barras', 'linea'],
    },
    {
      id: 4,
      nombre:       'Uso de Recursos Cloud (CPU & RAM)',
      subtitulo:    'Uso de CPU & Memoria',
      description:  null,
      formula:      '(CPU usado + RAM usada) / (CPU total + RAM total) * 100',
      tipoMetrica:  'Porcentaje',
      periodicidad: 'Semanal',
      goal:         75,
      unit:         '%',
      meta:         '< 75%',
      minimum:      0,
      maximum:      100,
      weight:       1.00,
      status:       'active',
      department_id: 5,
      company_id:   1,
      created_by:   1,
      user_id:      3,
      departamento:        'Operaciones',
      responsable:         'Laura Torres',
      progreso:            88,
      objetivo:            '< 75%',
      traffic_light:       'red',
      estado:              'critico',
      estadoTipo:          'danger',
      tendencia:           'subiendo',
      ultimaActualizacion: '2025-08-04',
      historial:           [70, 75, 80, 82, 85, 83, 88, 86],
      etiquetasHistorial:  ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'],
      graficasCompatibles: ['area', 'barras'],
    },
    {
      id: 5,
      nombre:       'Tasa de Despliegues Exitosos',
      subtitulo:    'Despliegues Exitosos',
      description:  null,
      formula:      'Despliegues exitosos / Total de despliegues * 100',
      tipoMetrica:  'Porcentaje',
      periodicidad: 'Diario',
      goal:         95,
      unit:         '%',
      meta:         '95%',
      minimum:      90,
      maximum:      100,
      weight:       1.00,
      status:       'active',
      department_id: 2,
      company_id:   1,
      created_by:   2,
      user_id:      2,
      departamento:        'Tecnología',
      responsable:         'Miguel Ruiz',
      progreso:            96.5,
      objetivo:            '95%',
      traffic_light:       'green',
      estado:              'saludable',
      estadoTipo:          'success',
      tendencia:           'estable',
      ultimaActualizacion: '2025-08-05',
      historial:           [94, 95, 97, 96, 98, 96, 97, 96.5],
      etiquetasHistorial:  ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'],
      graficasCompatibles: ['linea', 'barras'],
    },
    {
      id: 6,
      nombre:       'Tiempo de Respuesta de Queries',
      subtitulo:    'Optimización de Queries',
      description:  null,
      formula:      'Tiempo promedio de ejecución de queries críticas en ms',
      tipoMetrica:  'Tiempo',
      periodicidad: 'Diario',
      goal:         200,
      unit:         'ms',
      meta:         '< 200ms',
      minimum:      0,
      maximum:      1000,
      weight:       1.00,
      status:       'active',
      department_id: 5,
      company_id:   1,
      created_by:   1,
      user_id:      3,
      departamento:        'Operaciones',
      responsable:         'Sofía Herrera',
      progreso:            60,
      objetivo:            '< 200ms',
      traffic_light:       'yellow',
      estado:              'en riesgo',
      estadoTipo:          'warning',
      tendencia:           'bajando',
      ultimaActualizacion: '2025-08-03',
      historial:           [180, 190, 210, 200, 195, 220, 205, 198],
      etiquetasHistorial:  ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'],
      graficasCompatibles: ['linea', 'area'],
    },
    {
      id: 7,
      nombre:       'Cobertura de Pruebas Automatizadas',
      subtitulo:    'Cobertura de Pruebas',
      description:  null,
      formula:      'Líneas de código cubiertas / Total de líneas * 100',
      tipoMetrica:  'Porcentaje',
      periodicidad: 'Trimestral',
      goal:         80,
      unit:         '%',
      meta:         '> 80%',
      minimum:      70,
      maximum:      100,
      weight:       1.00,
      status:       'active',
      department_id: 7,
      company_id:   1,
      created_by:   1,
      user_id:      7,
      departamento:        'Calidad',
      responsable:         'Diego Vargas',
      progreso:            84,
      objetivo:            '> 80%',
      traffic_light:       'green',
      estado:              'saludable',
      estadoTipo:          'success',
      tendencia:           'subiendo',
      ultimaActualizacion: '2025-07-30',
      historial:           [75, 78, 79, 80, 81, 82, 83, 84],
      etiquetasHistorial:  ['Q1','Q2','Q3','Q4','Q1','Q2','Q3','Q4'],
      graficasCompatibles: ['area', 'barras'],
    },
    {
      id: 8,
      nombre:       'Ejecución de Presupuesto Mensual',
      subtitulo:    'Presupuesto Mensual',
      description:  null,
      formula:      'Gasto real del mes / Presupuesto asignado * 100',
      tipoMetrica:  'Monetario',
      periodicidad: 'Mensual',
      goal:         5000,
      unit:         '$',
      meta:         '$5,000 USD',
      minimum:      0,
      maximum:      6000,
      weight:       1.00,
      status:       'active',
      department_id: 9,
      company_id:   1,
      created_by:   1,
      user_id:      6,
      departamento:        'Finanzas',
      responsable:         'Valeria Núñez',
      progreso:            92,
      objetivo:            '$5,000 USD',
      traffic_light:       'yellow',
      estado:              'en riesgo',
      estadoTipo:          'warning',
      tendencia:           'estable',
      ultimaActualizacion: '2025-08-01',
      historial:           [4200, 4500, 4800, 4600, 4900, 5000, 4850, 4600],
      etiquetasHistorial:  ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago'],
      graficasCompatibles: ['barras', 'area'],
    },
  ])

  // ── KPI ASSIGNMENTS (tabla: kpi_assignments) ─────────────────────────────
  const kpisAsignados = ref([
    { id: 1,  kpi_id: 2, user_id: 1, department_id: null, team_id: null, start_date: '2025-07-01', end_date: null, status: 'active' },
    { id: 2,  kpi_id: 5, user_id: 1, department_id: null, team_id: null, start_date: '2025-07-01', end_date: null, status: 'active' },
    { id: 3,  kpi_id: 1, user_id: 2, department_id: null, team_id: null, start_date: '2025-07-01', end_date: null, status: 'active' },
    { id: 4,  kpi_id: 5, user_id: 2, department_id: null, team_id: null, start_date: '2025-07-10', end_date: null, status: 'active' },
    { id: 5,  kpi_id: 4, user_id: 3, department_id: null, team_id: null, start_date: '2025-07-01', end_date: null, status: 'active' },
    { id: 6,  kpi_id: 6, user_id: 3, department_id: null, team_id: null, start_date: '2025-07-01', end_date: null, status: 'active' },
    { id: 7,  kpi_id: 1, user_id: 5, department_id: null, team_id: null, start_date: '2025-07-15', end_date: null, status: 'active' },
    { id: 8,  kpi_id: 3, user_id: 5, department_id: null, team_id: null, start_date: '2025-07-15', end_date: null, status: 'active' },
    { id: 9,  kpi_id: 2, user_id: 6, department_id: null, team_id: null, start_date: '2025-07-01', end_date: null, status: 'active' },
    { id: 10, kpi_id: 8, user_id: 6, department_id: null, team_id: null, start_date: '2025-07-01', end_date: null, status: 'active' },
    { id: 11, kpi_id: 7, user_id: 7, department_id: null, team_id: null, start_date: '2025-07-01', end_date: null, status: 'active' },
  ])

  // ── KPI RECORDS (tabla: kpi_records) ────────────────────────────────────
  // Campos: id, kpi_id, kpi_assignment_id, captured_by, value,
  //         period_start, period_end, notes, created_at
  const capturas = ref([])

  // ─────────────────────────────────────────────────────────────────────────
  // FUNCIONES
  // ─────────────────────────────────────────────────────────────────────────

  function capturasPorKpi(kpiId) {
    return capturas.value
      .filter(c => c.kpi_id === kpiId)
      .sort((a, b) => new Date(a.period_start) - new Date(b.period_start))
  }

  function etiquetaCaptura(periodicidad, period_start) {
    const fecha = new Date(period_start + 'T00:00:00')
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
    if (periodicidad === 'Mensual')    return meses[fecha.getMonth()]
    if (periodicidad === 'Trimestral') return 'Q' + (Math.floor(fecha.getMonth() / 3) + 1)
    if (periodicidad === 'Semanal') {
      const inicioAnio = new Date(fecha.getFullYear(), 0, 1)
      const semana = Math.ceil(((fecha - inicioAnio) / 86400000 + inicioAnio.getDay() + 1) / 7)
      return 'Sem ' + semana
    }
    if (periodicidad === 'Diario') {
      return String(fecha.getDate()).padStart(2, '0') + ' ' + meses[fecha.getMonth()]
    }
    return period_start
  }

  // traffic_light + alias UI a partir del progreso
  function calcularEstado(progreso) {
    if (progreso >= 80) return { traffic_light: 'green',  estado: 'saludable', estadoTipo: 'success' }
    if (progreso >= 50) return { traffic_light: 'yellow', estado: 'en riesgo', estadoTipo: 'warning' }
    return               { traffic_light: 'red',    estado: 'critico',   estadoTipo: 'danger'  }
  }

  // Guarda un kpi_record y actualiza el indicador en memoria
  function registrarCaptura(nuevaCaptura) {
    capturas.value.push({
      id:                Date.now(),
      kpi_id:            nuevaCaptura.kpi_id,
      kpi_assignment_id: nuevaCaptura.kpi_assignment_id ?? null,
      captured_by:       nuevaCaptura.captured_by,
      value:             Number(nuevaCaptura.value),
      period_start:      nuevaCaptura.period_start,
      period_end:        nuevaCaptura.period_end ?? null,
      notes:             nuevaCaptura.notes ?? '',
      created_at:        new Date().toISOString(),
    })

    const kpi = indicadores.value.find(k => k.id === nuevaCaptura.kpi_id)
    if (!kpi) return

    const etiqueta = etiquetaCaptura(kpi.periodicidad, nuevaCaptura.period_start)
    kpi.historial.push(Number(nuevaCaptura.value))
    kpi.etiquetasHistorial.push(etiqueta)
    kpi.progreso            = Number(nuevaCaptura.value)
    kpi.ultimaActualizacion = nuevaCaptura.period_start

    const estado = calcularEstado(kpi.progreso)
    kpi.traffic_light = estado.traffic_light
    kpi.estado        = estado.estado
    kpi.estadoTipo    = estado.estadoTipo
  }

  function kpisDeUsuario(userId) {
    return kpisAsignados.value
      .filter(a => a.user_id === userId && a.status === 'active')
      .map(a => indicadores.value.find(k => k.id === a.kpi_id))
      .filter(Boolean)
  }

  function estadoCaptura(kpi) {
    const intervaloDias = { 'Diario': 1, 'Semanal': 7, 'Mensual': 30, 'Trimestral': 90 }
    const dias          = intervaloDias[kpi.periodicidad] ?? 30
    const ultimaFecha   = new Date(kpi.ultimaActualizacion + 'T00:00:00')
    const vencimiento   = new Date(ultimaFecha)
    vencimiento.setDate(vencimiento.getDate() + dias)
    const msHastaVencer = vencimiento - new Date()
    if (msHastaVencer < 0)                     return 'retrasada'
    if (msHastaVencer / (1000 * 60 * 60) <= 4) return 'porVencer'
    return 'aTiempo'
  }

  // ─────────────────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────────────────

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
    calcularEstado,
  }
})
