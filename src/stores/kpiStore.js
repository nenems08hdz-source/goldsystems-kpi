import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

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
  ])

  // ── KPI ASSIGNMENTS (tabla: kpi_assignments) ─────────────────────────────
  const kpisAsignados = ref([
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

  async function cargarCapturasPorKpi(kpiId) {
    try {
      const api = (await import('../services/api')).default
      const res = await api.get(`/kpi-records?kpi_id=${kpiId}`)
      const registros = res.data // ya vienen ordenados por period_start asc

      // Reemplaza capturas de este KPI en el store
      capturas.value = capturas.value.filter(c => c.kpi_id !== kpiId)
      capturas.value.push(...registros)

      // Actualiza historial y etiquetas de la gráfica
      const kpi = indicadores.value.find(k => k.id === kpiId)
      if (kpi && registros.length > 0) {
        const soloFecha = s => (s ?? '').split('T')[0]
        kpi.historial          = registros.map(r => Number(r.value))
        kpi.etiquetasHistorial = registros.map(r => etiquetaCaptura(kpi.periodicidad, soloFecha(r.period_start)))

        const ultimo = registros[registros.length - 1]
        kpi.progreso = Number(ultimo.value)
        const estado = calcularEstado(kpi.progreso)
        kpi.estadoTipo    = estado.estadoTipo
        kpi.estado        = estado.estado
        kpi.traffic_light = estado.traffic_light
        kpi.ultimaActualizacion = ultimo.period_start
      }
    } catch (e) {
      console.error('Error cargando capturas del KPI:', e)
    }
  }

  // ← NUEVA FUNCIÓN: Carga historiales de TODOS los KPIs
async function cargarTodosLosHistoriales() {
  try {
    for (const kpi of indicadores.value) {
      await cargarCapturasPorKpi(kpi.id)
    }
  } catch (e) {
    console.error('Error cargando todos los historiales:', e)
  }
}

  async function cargarIndicadores() {
  try {
    const res = await api.get('/kpis')
    indicadores.value = res.data.map(kpi => {
      const progreso = kpi.latest_record?.value ?? 0
      const estado = calcularEstado(progreso)
      return {
        id: kpi.id,
        nombre: kpi.name,
        subtitulo: kpi.subtitle,
        departamento: kpi.department?.name || '',
        responsable: kpi.creator ? `${kpi.creator.name} ${kpi.creator.paternal ?? ''}`.trim() : '—',
        progreso: progreso,
        meta: kpi.goal ? `${parseFloat(kpi.goal)} ${kpi.unit ?? ''}`.trim() : '—',
        goal: kpi.goal,
        unit: kpi.unit,
        estadoTipo: estado.estadoTipo,
        estado: estado.estado,
        traffic_light: estado.traffic_light,
        historial: [progreso],
        etiquetasHistorial: ['Hoy'],
        ultimaActualizacion: new Date().toISOString().split('T')[0],
        graficasCompatibles: ['linea', 'barras'],
        periodicidad: {
          daily: 'Diario', weekly: 'Semanal', biweekly: 'Quincenal',
          monthly: 'Mensual', bimonthly: 'Bimestral', quarterly: 'Trimestral',
          semiannual: 'Semestral', annual: 'Anual'
        }[kpi.frequency] ?? kpi.frequency,
        tipo: kpi.type,
        tipoMetrica: {
          percentage: 'Porcentaje',
          money:      'Monetario',
          time:       'Tiempo',
          absolute:   'Puntaje',
          custom:     'Puntaje',
        }[kpi.type] ?? kpi.type,
      }
    })
  } catch (error) {
    console.error('Error cargando KPIs:', error)
  }
}
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
    cargarIndicadores,
    cargarCapturasPorKpi,
    cargarTodosLosHistoriales,
  }
})
