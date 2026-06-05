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

// ─── DATOS ORGANIZACIONALES ──────────────────────────────────────────────

// Simulador del usuario actual — cuando llegue el login,
// estos datos vendrán del backend. Por ahora los simulamos aquí.
// Cambia 'rol' para probar cómo ve cada quien la app:
// 'developer' | 'admin' | 'gerente' | 'lider' | 'empleado' | 'auditor'
const usuarioActual = ref({
  id: 1,
  nombre: 'Admin Demo',
  email: 'admin@kpi360.com',
  rol: 'admin',       // ← cambia esto para simular roles
  empresa_id: 1,
})

// La empresa activa — lo que el Admin ve como "su empresa"
const empresaActiva = ref({
  id: 1,
  nombre: 'KPI360 Corp',
  razonSocial: 'KPI360 Corporation S.A. de C.V.',
  rfc: 'KPI2024010101',
  email: 'contacto@kpi360.com',
  telefono: '+52 999 000 0001',
  estado: 'activo',
})

// Jerarquía completa: Empresa → Departamento → Equipo
const estructuraOrganizacional = ref([
  {
    id: 1,
    nombre: 'KPI360 Corp',
    tipo: 'empresa',
    nivel: 0,
    abierto: true,
  },
  {
    id: 2,
    nombre: 'Tecnología',
    tipo: 'departamento',
    nivel: 1,
    padre_id: 1,
    abierto: true,
    responsable: 'Carlos Méndez',
  },
  {
    id: 3,
    nombre: 'Equipo Backend',
    tipo: 'equipo',
    nivel: 2,
    padre_id: 2,
    abierto: false,
    lider: 'Miguel Ruiz',
  },
  {
    id: 4,
    nombre: 'Equipo Frontend',
    tipo: 'equipo',
    nivel: 2,
    padre_id: 2,
    abierto: false,
    lider: 'Ana López',
  },
  {
    id: 5,
    nombre: 'Operaciones',
    tipo: 'departamento',
    nivel: 1,
    padre_id: 1,
    abierto: true,
    responsable: 'Laura Torres',
  },
  {
    id: 6,
    nombre: 'Equipo Infraestructura',
    tipo: 'equipo',
    nivel: 2,
    padre_id: 5,
    abierto: false,
    lider: 'Roberto Díaz',
  },
  {
    id: 7,
    nombre: 'Calidad',
    tipo: 'departamento',
    nivel: 1,
    padre_id: 1,
    abierto: false,
    responsable: 'Diego Vargas',
  },
  {
    id: 8,
    nombre: 'Equipo QA',
    tipo: 'equipo',
    nivel: 2,
    padre_id: 7,
    abierto: false,
    lider: 'Diego Vargas',
  },
  {
    id: 9,
    nombre: 'Finanzas',
    tipo: 'departamento',
    nivel: 1,
    padre_id: 1,
    abierto: false,
    responsable: 'Valeria Núñez',
  },
])

// Los 6 roles según el documento del asesor
// Los marcados con 'eliminable: false' no se pueden borrar
const rolesDisponibles = ref([
  { id: 1, codigo: 'developer', nombre: 'Developer',      descripcion: 'Control total del sistema',          eliminable: false },
  { id: 2, codigo: 'admin',     nombre: 'Admin',           descripcion: 'Gestiona una empresa completa',      eliminable: false },
  { id: 3, codigo: 'gerente',   nombre: 'Gerente',         descripcion: 'Gestiona departamentos',             eliminable: true  },
  { id: 4, codigo: 'lider',     nombre: 'Líder de Equipo', descripcion: 'Gestiona KPIs de su equipo',         eliminable: true  },
  { id: 5, codigo: 'empleado',  nombre: 'Empleado',        descripcion: 'Visualiza y captura KPIs',           eliminable: true  },
  { id: 6, codigo: 'auditor',   nombre: 'Auditor',         descripcion: 'Solo lectura y auditoría',           eliminable: true  },
])

// Usuarios con campos completos según el documento
const usuarios = ref([
  {
    id: 1,
    nombre: 'Ana',
    apellidoPaterno: 'López',
    apellidoMaterno: 'Martínez',
    email: 'ana.lopez@kpi360.com',
    telefono: '+52 999 111 2233',
    rol: 'empleado',
    departamento_id: 2,
    equipo_id: 4,
    kpis: 12,
    estado: 'activo',
    ultimoLogin: '2025-08-05',
  },
  {
    id: 2,
    nombre: 'Carlos',
    apellidoPaterno: 'Ruiz',
    apellidoMaterno: 'Sánchez',
    email: 'carlos.ruiz@kpi360.com',
    telefono: '+52 999 222 3344',
    rol: 'lider',
    departamento_id: 2,
    equipo_id: 3,
    kpis: 8,
    estado: 'activo',
    ultimoLogin: '2025-08-04',
  },
  {
    id: 3,
    nombre: 'Sofía',
    apellidoPaterno: 'Martínez',
    apellidoMaterno: 'García',
    email: 'sofia.m@kpi360.com',
    telefono: '+52 999 333 4455',
    rol: 'empleado',
    departamento_id: 5,
    equipo_id: 6,
    kpis: 5,
    estado: 'ausente',
    ultimoLogin: '2025-07-30',
  },
  {
    id: 4,
    nombre: 'Jorge',
    apellidoPaterno: 'Rivas',
    apellidoMaterno: 'Torres',
    email: 'jorge.rivas@kpi360.com',
    telefono: null,
    rol: 'empleado',
    departamento_id: 5,
    equipo_id: 6,
    kpis: 0,
    estado: 'bloqueado',
    ultimoLogin: '2025-07-15',
  },
  {
    id: 5,
    nombre: 'Pablo',
    apellidoPaterno: 'Chable',
    apellidoMaterno: 'Dzul',
    email: 'pablo.chable@kpi360.com',
    telefono: '+52 999 555 6677',
    rol: 'empleado',
    departamento_id: 2,
    equipo_id: 3,
    kpis: 12,
    estado: 'activo',
    ultimoLogin: '2025-08-05',
  },
  {
    id: 6,
    nombre: 'Arantxa',
    apellidoPaterno: 'Sánchez',
    apellidoMaterno: 'Pérez',
    email: 'arantxa.sanchez@kpi360.com',
    telefono: '+52 999 666 7788',
    rol: 'gerente',
    departamento_id: 2,
    equipo_id: null,
    kpis: 8,
    estado: 'activo',
    ultimoLogin: '2025-08-05',
  },
  {
    id: 7,
    nombre: 'Christo',
    apellidoPaterno: 'Ajelo',
    apellidoMaterno: 'Moo',
    email: 'crhisto.a@kpi360.com',
    telefono: '+52 999 777 8899',
    rol: 'empleado',
    departamento_id: 7,
    equipo_id: 8,
    kpis: 5,
    estado: 'ausente',
    ultimoLogin: '2025-07-28',
  },
  {
    id: 8,
    nombre: 'Jorge',
    apellidoPaterno: 'Hernández',
    apellidoMaterno: 'Balam',
    email: 'jorge.hernandez@kpi360.com',
    telefono: '+52 999 888 9900',
    rol: 'auditor',
    departamento_id: null,
    equipo_id: null,
    kpis: 0,
    estado: 'activo',
    ultimoLogin: '2025-08-03',
  },
])

// Computed: nombre completo del usuario
const nombreCompleto = (usuario) =>
  `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`

// Computed: color por rol para las badges
const colorPorRol = (rol) => {
  const colores = {
    developer: 'bg-violet-100 text-violet-700 border-violet-200',
    admin:     'bg-[#3f2a52]/10 text-[#3f2a52] border-[#3f2a52]/20',
    gerente:   'bg-emerald-100 text-emerald-700 border-emerald-200',
    lider:     'bg-blue-100 text-blue-700 border-blue-200',
    empleado:  'bg-gray-100 text-gray-600 border-gray-200',
    auditor:   'bg-amber-100 text-amber-700 border-amber-200',
  }
  return colores[rol] ?? 'bg-gray-100 text-gray-500'
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
    usuarioActual,
    empresaActiva,
    estructuraOrganizacional,
    rolesDisponibles,
    usuarios,
    nombreCompleto,
    colorPorRol,
    
  }
})