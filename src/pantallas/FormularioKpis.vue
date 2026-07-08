<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useKpiStore } from '../stores/kpiStore'
import { useAuthStore } from '../stores/authStore'
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
const departamentosApi = ref([])
const equiposApi       = ref([])
const usuariosApi      = ref([])

onMounted(async () => {
  const [resDepts, resEquipos, resUsuarios] = await Promise.all([
    api.get('/departments'),
    api.get('/teams'),
    api.get('/users'),
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
  'Tiempo':     'ms',
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
    company_id:    auth.user.company_id,
    department_id: nuevoKpi.value.departamento_id ? Number(nuevoKpi.value.departamento_id) : null,
    created_by:    nuevoKpi.value.usuario_id ? Number(nuevoKpi.value.usuario_id) : auth.user.id,
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

    if (nuevoKpi.value.progreso > 0) {
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
  } catch {
    proxy.$notify.error('Error al guardar el KPI', 'Error')
  }
}

// Semáforo relativo a la meta (no asume porcentaje)
const cumplimiento = computed(() => {
  const val  = Number(nuevoKpi.value.progreso)
  const meta = Number(nuevoKpi.value.goal)
  if (!val || !meta || meta === 0) return null
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
  { value: 'Tiempo',     label: 'Tiempo (ms, hrs)' },
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

        <FormField label="Fórmula o Criterio de Cálculo" required :col-span="2">
          <AppInput
            v-model="nuevoKpi.formula"
            placeholder="Ej. (Tiempo Activo / Tiempo Total) * 100"
            required
          />
        </FormField>

        <FormField
          label="Descripción corta"
          hint="aparece en las tarjetas del panel"
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

        <FormField
          label="Valor Inicial"
          hint="define el estado vs la meta"
          required
        >
          <AppInput
            v-model="nuevoKpi.progreso"
            type="number"
            step="0.01"
            :min="0"
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