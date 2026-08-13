<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useKpiStore } from '../stores/kpiStore'
import { useAuthStore } from '../stores/authStore'
import { useOrgStore }  from '../stores/orgStore'
import api from '../services/api'
import AppButton          from '@/components/ui/AppButton.vue'
import AppInput           from '@/components/ui/AppInput.vue'
import AppSelect          from '@/components/ui/AppSelect.vue'
import FormField          from '@/components/ui/FormField.vue'
import FormContenedor from '@/components/ui/FormContenedor.vue'
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'

const router   = useRouter()
const store    = useKpiStore()
const { proxy } = getCurrentInstance()
const auth = useAuthStore()
const org  = useOrgStore()
const departamentosApi = ref([])
const equiposApi       = ref([])
const usuariosApi      = ref([])

onMounted(async () => {
  const [resDepts, resEquipos, resUsuarios] = await Promise.all([
    api.get('/departments'),
    api.get('/teams'),
    api.get('/users'),
    // Los KPIs existentes son los que se pueden usar como operandos de una fórmula
    store.cargarIndicadores(),
  ])
  departamentosApi.value = resDepts.data
  equiposApi.value       = resEquipos.data
  usuariosApi.value      = resUsuarios.data
})

const nuevoKpi = ref({
  nombre:          '',
  subtitulo:       '',
  formula:         '',
  departamento_id: null,
  equipo_id:       null,
  usuario_id:      null,
  progreso:        0,
  periodicidad:    'Mensual',
  goal:            '',
  unit:            '%',
  minimum:         null,
  maximum:         null,
  weight:          1.00,
  tipoMetrica:     'Porcentaje',
  status:          'active',
  // ── KPI calculado (compuesto) ──────────────────────────────────
  esCalculado:     false,
  operacion:       'division',
  kpiA:            null,
  kpiB:            null,
  multiplicador:   1,
})

// ── Fórmula: catálogo de operaciones y KPIs elegibles ────────────
const opcionesOperacion = [
  { value: 'suma',           label: '+  (suma)' },
  { value: 'resta',          label: '−  (resta)' },
  { value: 'multiplicacion', label: '×  (multiplicación)' },
  { value: 'division',       label: '÷  (división)' },
]

const simboloOperacion = { suma: '+', resta: '−', multiplicacion: '×', division: '÷' }

// Solo se pueden usar KPIs capturados de la misma periodicidad.
// Excluir los calculados es lo que hace imposible una referencia circular.
const kpisElegibles = computed(() =>
  store.indicadores.filter(k =>
    !k.is_calculated && k.periodicidad === nuevoKpi.value.periodicidad
  )
)

const opcionesKpiA = computed(() =>
  kpisElegibles.value
    .filter(k => k.id !== nuevoKpi.value.kpiB)
    .map(k => ({ value: k.id, label: k.nombre }))
)

const opcionesKpiB = computed(() =>
  kpisElegibles.value
    .filter(k => k.id !== nuevoKpi.value.kpiA)
    .map(k => ({ value: k.id, label: k.nombre }))
)

// Vista previa en vivo con los últimos valores capturados de cada KPI
const vistaPrevia = computed(() => {
  const a = store.indicadores.find(k => k.id === nuevoKpi.value.kpiA)
  const b = store.indicadores.find(k => k.id === nuevoKpi.value.kpiB)
  if (!a || !b) return null

  const va = Number(a.progreso)
  const vb = Number(b.progreso)
  const mult = Number(nuevoKpi.value.multiplicador) || 1

  let bruto = null
  if (nuevoKpi.value.operacion === 'suma')           bruto = va + vb
  if (nuevoKpi.value.operacion === 'resta')          bruto = va - vb
  if (nuevoKpi.value.operacion === 'multiplicacion') bruto = va * vb
  if (nuevoKpi.value.operacion === 'division')       bruto = vb === 0 ? null : va / vb

  return {
    nombreA: a.nombre, nombreB: b.nombre,
    valorA: va, valorB: vb,
    simbolo: simboloOperacion[nuevoKpi.value.operacion],
    multiplicador: mult,
    resultado: bruto === null ? null : Math.round(bruto * mult * 100) / 100,
  }
})

// Si cambia la periodicidad, los KPIs elegidos pueden dejar de ser válidos
watch(() => nuevoKpi.value.periodicidad, () => {
  const validos = kpisElegibles.value.map(k => k.id)
  if (!validos.includes(nuevoKpi.value.kpiA)) nuevoKpi.value.kpiA = null
  if (!validos.includes(nuevoKpi.value.kpiB)) nuevoKpi.value.kpiB = null
})

// Departamentos desde la API
const opcionesDepartamentos = computed(() =>
  departamentosApi.value.map(d => ({ value: d.id, label: d.name }))
)

// Equipos filtrados por departamento seleccionado
const opcionesEquipos = computed(() => {
  if (!nuevoKpi.value.departamento_id) return []
  const deptId = Number(nuevoKpi.value.departamento_id)
  return equiposApi.value
    .filter(e => e.department_id === deptId)
    .map(e => ({ value: e.id, label: e.name }))
})

// Responsables filtrados por departamento/equipo seleccionado
const opcionesResponsable = computed(() => {
  const deptId   = nuevoKpi.value.departamento_id ? Number(nuevoKpi.value.departamento_id) : null
  const equipoId = nuevoKpi.value.equipo_id       ? Number(nuevoKpi.value.equipo_id)       : null

  return usuariosApi.value
    .filter(u => {
      if (equipoId) return u.team_id       === equipoId
      if (deptId)   return u.department_id === deptId
      return true
    })
    .map(u => ({ value: u.id, label: `${u.name} ${u.paternal ?? ''}`.trim() }))
})

function onDepartamentoChange() {
  nuevoKpi.value.equipo_id  = null
  nuevoKpi.value.usuario_id = null
}
function onEquipoChange() {
  nuevoKpi.value.usuario_id = null
}

// Unidad por tipo de métrica (para el campo unit de la BD)
const unidadPorTipo = {
  'Porcentaje': '%',
  'Monetario':  '$',
  'Tiempo':     'time',
  'Puntaje':    'pts',
}

// Actualiza la unidad automáticamente al cambiar el tipo
watch(() => nuevoKpi.value.tipoMetrica, (tipo) => {
  nuevoKpi.value.unit = unidadPorTipo[tipo] ?? '%'
})

async function guardarKpi() {
  // Mapeo de valores display → valores que acepta la API
  const tipoApiMap = {
    'Porcentaje': 'percentage',
    'Monetario':  'money',
    'Tiempo':     'time',
    'Puntaje':    'absolute',
  }

  const frecuenciaApiMap = {
    'Diario':     'daily',
    'Semanal':    'weekly',
    'Mensual':    'monthly',
    'Trimestral': 'quarterly',
    'Anual':      'annual',
  }

  // Objeto con los campos que espera la API
  const payload = {
    name:          nuevoKpi.value.nombre,
    subtitle:      nuevoKpi.value.subtitulo || nuevoKpi.value.nombre,
    formula:       nuevoKpi.value.formula,
    type:          tipoApiMap[nuevoKpi.value.tipoMetrica],
    frequency:     frecuenciaApiMap[nuevoKpi.value.periodicidad],
    goal:          nuevoKpi.value.goal !== '' ? Number(nuevoKpi.value.goal) : null,
    minimum:       nuevoKpi.value.minimum ? Number(nuevoKpi.value.minimum) : null,
    maximum:       nuevoKpi.value.maximum ? Number(nuevoKpi.value.maximum) : null,
    unit:          nuevoKpi.value.unit,
    weight:        Number(nuevoKpi.value.weight),
    status:        'active',
    company_id:    org.empresaActiva?.id ?? auth.user.company_id,
    department_id: nuevoKpi.value.departamento_id ? Number(nuevoKpi.value.departamento_id) : null,
    created_by:    nuevoKpi.value.usuario_id ? Number(nuevoKpi.value.usuario_id) : auth.user.id,

    // Campos de KPI calculado. Si no lo es, van en null para no dejar basura.
    is_calculated:      nuevoKpi.value.esCalculado,
    initial_value:      nuevoKpi.value.esCalculado ? 0 : Number(nuevoKpi.value.progreso || 0),
    formula_operation:  nuevoKpi.value.esCalculado ? nuevoKpi.value.operacion : null,
    formula_kpi_a_id:   nuevoKpi.value.esCalculado ? Number(nuevoKpi.value.kpiA) : null,
    formula_kpi_b_id:   nuevoKpi.value.esCalculado ? Number(nuevoKpi.value.kpiB) : null,
    formula_multiplier: nuevoKpi.value.esCalculado ? Number(nuevoKpi.value.multiplicador || 1) : 1,
  }

  try {
    const resKpi = await api.post('/kpis', payload)
    const kpiCreado = resKpi.data

    // Crear asignación para el responsable seleccionado
    const responsableId = nuevoKpi.value.usuario_id ? Number(nuevoKpi.value.usuario_id) : auth.user.id
    await api.post('/kpi-assignments', {
      kpi_id:     kpiCreado.id,
      user_id:    responsableId,
      start_date: new Date().toISOString().split('T')[0],
      status:     'active',
    })

    // Un KPI calculado no lleva captura inicial: su valor sale de la fórmula
    if (!nuevoKpi.value.esCalculado && nuevoKpi.value.progreso > 0) {
      await api.post('/kpi-records', {
        kpi_id:       kpiCreado.id,
        value:        Number(nuevoKpi.value.progreso),
        period_start: new Date().toISOString().split('T')[0],
        captured_by:  auth.user.id,
      })
    }

      const estado = store.calcularEstado(nuevoKpi.value.progreso)
    store.indicadores.push({
      id:                   kpiCreado.id,
      nombre:               nuevoKpi.value.nombre,
      subtitulo:            nuevoKpi.value.subtitulo || nuevoKpi.value.nombre,
      departamento:         departamentosApi.value.find(d => d.id === nuevoKpi.value.departamento_id)?.name || '',
      responsable:          usuariosApi.value.find(u => u.id === nuevoKpi.value.usuario_id)?.name || '',
      progreso:             Number(nuevoKpi.value.progreso),
      goal:                 nuevoKpi.value.goal,
      unit:                 nuevoKpi.value.unit,
      estadoTipo:           estado.estadoTipo,
      estado:               estado.estado,
      traffic_light:        estado.traffic_light,
      historial:            [Number(nuevoKpi.value.progreso)],
      etiquetasHistorial:   ['Hoy'],
      ultimaActualizacion:  new Date().toISOString().split('T')[0],
      graficasCompatibles:  ['linea', 'barras'],
      periodicidad:         nuevoKpi.value.periodicidad,
      tipoMetrica:          nuevoKpi.value.tipoMetrica,
    })

    proxy.$notify.success('KPI registrado correctamente', 'Éxito')
    router.push('/kpis')
  } catch (err) {
    // El backend valida las reglas de la fórmula y devuelve el motivo exacto
    const msg = err?.response?.data?.message || 'Error al guardar el KPI'
    proxy.$notify.error(msg, 'Error')
    console.error('[guardarKpi]', err?.response?.data ?? err)
  }
}

// Cumplimiento respecto a la meta, tomando el valor inicial como punto de partida.
// Misma fórmula que usa el backend, para que el estado que ve el usuario coincida.
const cumplimiento = computed(() => {
  const val  = Number(nuevoKpi.value.progreso)
  const meta = Number(nuevoKpi.value.goal)
  if (nuevoKpi.value.goal === '' || isNaN(meta)) return null
  // Al crear, el valor inicial ES el progreso, así que se mide contra cero
  if (meta === 0) return null
  return (val / meta) * 100
})

const semaforo = computed(() => {
  const c = cumplimiento.value
  if (c === null) return null
  if (c >= 80) return { clase: 'text-emerald-600', texto: 'Saludable' }
  if (c >= 50) return { clase: 'text-amber-500',   texto: 'En riesgo' }
  return         { clase: 'text-rose-500',     texto: 'Crítico'   }
})

/* Opciones estáticas */
const opcionesPeriodicidad = ['Diario', 'Semanal', 'Mensual', 'Trimestral', 'Anual']
const opcionesTipoMetrica  = [
  { value: 'Porcentaje', label: 'Porcentaje (%)' },
  { value: 'Monetario',  label: 'Monetario ($)'  },
  { value: 'Tiempo',     label: 'Tiempo (hrs)' },
  { value: 'Puntaje',    label: 'Puntaje (pts)'  },
]
</script>

<template>
  <div class="p-3 min-h-screen">

    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <EncabezadoPantalla
        titulo="Nuevo Indicador"
        descripcion="Registra un nuevo KPI definiendo sus metas y responsable."
      />
      <AppButton variant="secondary" class="flex-shrink-0" @click="router.push('/kpis')">
        ← Volver al Listado
      </AppButton>
    </div>

    <FormContenedor>
      <form
      @submit.prevent="guardarKpi"
      class="w-full rounded-xl shadow-md border overflow-hidden"
      style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);"
    >

      <div class="p-4 border-b" style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
        <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-general);">
          Configuración General del KPI
        </h2>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

        <FormField label="Nombre del KPI" required>
          <AppInput
            v-model="nuevoKpi.nombre"
            placeholder="Ej. Uptime de Servidores"
            required
          />
        </FormField>

        <FormField label="Departamento" required>
          <AppSelect
            v-model="nuevoKpi.departamento_id"
            :options="opcionesDepartamentos"
            placeholder="Selecciona un departamento"
            required
            @change="onDepartamentoChange"
          />
        </FormField>

        <FormField
          v-if="nuevoKpi.departamento_id"
          label="Equipo"
          hint="opcional"
        >
          <AppSelect
            v-model="nuevoKpi.equipo_id"
            :options="[{ value: null, label: 'Sin equipo específico' }, ...opcionesEquipos]"
            placeholder="Sin equipo específico"
            @change="onEquipoChange"
          />
        </FormField>

        <FormField label="Responsable" required>
          <AppSelect
            v-model="nuevoKpi.usuario_id"
            :options="opcionesResponsable"
            :placeholder="nuevoKpi.departamento_id ? 'Selecciona un responsable' : 'Selecciona departamento primero'"
            :disabled="!nuevoKpi.departamento_id"
            required
          />
          <p v-if="nuevoKpi.departamento_id && opcionesResponsable.length === 0"
            class="text-[10px] mt-1 text-amber-500">
            No hay usuarios en este departamento/equipo.
          </p>
        </FormField>

        <!-- ── KPI calculado ────────────────────────────────────────── -->
        <FormField label="¿Es un KPI calculado?" :col-span="2">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" v-model="nuevoKpi.esCalculado" class="w-4 h-4 accent-[#7c5fb8] cursor-pointer" />
            <span class="text-sm" style="color: var(--text-general);">
              Sí, este KPI se calcula a partir de otros dos KPIs
            </span>
          </label>
          <p class="text-[10px] mt-1" style="color: var(--card-text-hint);">
            Un KPI calculado no se captura: su valor lo obtiene el sistema.
          </p>
        </FormField>

        <div v-if="nuevoKpi.esCalculado" class="col-span-2 rounded-xl p-4"
          style="background: var(--grafics-bg); border: 1px solid var(--color-kpi-morado);">

          <p class="text-[11px] font-bold uppercase tracking-wider mb-3" style="color: var(--color-kpi-morado);">
            Fórmula del KPI <span class="text-rose-500">*</span>
          </p>

          <div v-if="kpisElegibles.length < 2"
            class="text-xs rounded-lg px-3 py-2 mb-3"
            style="background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.3); color: #d97706;">
            Necesitas al menos dos KPIs capturados con periodicidad
            <strong>{{ nuevoKpi.periodicidad }}</strong> para poder armar una fórmula.
          </div>

          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-end mb-3">
              <div>
                <p class="text-[10px] mb-1" style="color: var(--subtext-general);">Primer KPI</p>
                <AppSelect v-model="nuevoKpi.kpiA" :options="opcionesKpiA" placeholder="Selecciona un KPI" />
              </div>
              <div class="md:w-36">
                <p class="text-[10px] mb-1" style="color: var(--subtext-general);">Operación</p>
                <AppSelect v-model="nuevoKpi.operacion" :options="opcionesOperacion" />
              </div>
              <div>
                <p class="text-[10px] mb-1" style="color: var(--subtext-general);">Segundo KPI</p>
                <AppSelect v-model="nuevoKpi.kpiB" :options="opcionesKpiB" placeholder="Selecciona un KPI" />
              </div>
            </div>

            <div class="flex items-center gap-3 flex-wrap mb-3">
              <span class="text-xs" style="color: var(--subtext-general);">Multiplicar el resultado por</span>
              <AppInput v-model="nuevoKpi.multiplicador" type="number" step="0.01" class="!w-24" />
              <span class="text-[10px]" style="color: var(--card-text-hint);">usa 1 si no aplica, 100 para porcentajes</span>
            </div>

            <div v-if="vistaPrevia" class="rounded-lg p-3"
              style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.3);">
              <p class="text-[10px] font-bold uppercase tracking-wider mb-1.5" style="color: #10b981;">
                Vista previa con los últimos datos capturados
              </p>
              <p class="text-sm font-mono" style="color: var(--text-general);">
                ( {{ vistaPrevia.valorA }} {{ vistaPrevia.simbolo }} {{ vistaPrevia.valorB }} ) × {{ vistaPrevia.multiplicador }} =
                <strong v-if="vistaPrevia.resultado !== null" style="color: #10b981;">{{ vistaPrevia.resultado }}</strong>
                <strong v-else style="color: var(--subtext-general);">sin dato</strong>
              </p>
              <p class="text-[10px] mt-1.5" style="color: var(--subtext-general);">
                {{ vistaPrevia.nombreA }}: {{ vistaPrevia.valorA }} · {{ vistaPrevia.nombreB }}: {{ vistaPrevia.valorB }}
              </p>
            </div>
            <p v-else class="text-[11px]" style="color: var(--subtext-general);">
              Elige los dos KPIs para ver la vista previa del cálculo.
            </p>
          </div>
        </div>

        <FormField
          label="Descripción corta"
          hint="texto corto que aparece debajo del nombre en las tarjetas"
          :col-span="2"
        >
          <AppInput
            v-model="nuevoKpi.subtitulo"
            placeholder="Ej. Disponibilidad de servidores en producción"
          />
        </FormField>

        <FormField label="Periodicidad" required>
          <AppSelect v-model="nuevoKpi.periodicidad" :options="opcionesPeriodicidad" />
        </FormField>

        <FormField label="Tipo de Métrica" required>
          <AppSelect v-model="nuevoKpi.tipoMetrica" :options="opcionesTipoMetrica" />
        </FormField>

        <FormField label="Meta / Objetivo" hint="valor numérico" required :col-span="2">
          <AppInput
            v-model="nuevoKpi.goal"
            type="number"
            step="0.01"
            placeholder="Ej. 95  o  200  o  5000"
            required
          />
        </FormField>

        <!-- Un KPI calculado no tiene valor inicial: su valor sale de la fórmula -->
        <FormField
          v-if="!nuevoKpi.esCalculado"
          label="Valor Inicial"
          hint="punto de partida — define el estado vs la meta"
          required
        >
          <AppInput
            v-model="nuevoKpi.progreso"
            type="number"
            step="0.01"
            placeholder="Ej. 85, 5000, 920..."
            required
          />
          <p v-if="semaforo" class="text-[10px] mt-1" :class="semaforo.clase">
            ● Estado: {{ semaforo.texto }}
            <span class="opacity-60">({{ cumplimiento.toFixed(1) }}% de la meta)</span>
          </p>
          <p v-else-if="nuevoKpi.progreso && !nuevoKpi.goal" class="text-[10px] mt-1 text-amber-400">
            Ingresa la meta primero para calcular el estado.
          </p>
          <p class="text-[10px] mt-1" style="color: var(--card-text-hint);">
            Si la meta es menor que este valor, el sistema entiende que "menos es mejor".
          </p>
        </FormField>

      </div>

      <div
        class="p-4 border-t flex justify-end gap-3"
        style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.2);"
      >
        <AppButton variant="secondary" @click="router.push('/kpis')">
          Cancelar
        </AppButton>
        <AppButton type="submit">
          Guardar KPI
        </AppButton>
      </div>

      </form>
    </FormContenedor>
  </div>
</template>