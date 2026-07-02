<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useKpiStore } from '../stores/kpiStore'
import { useOrgStore } from '../stores/orgStore'
import { useAuthStore } from '../stores/authStore'
import AppButton          from '@/components/ui/AppButton.vue'
import AppInput           from '@/components/ui/AppInput.vue'
import AppSelect          from '@/components/ui/AppSelect.vue'
import FormField          from '@/components/ui/FormField.vue'
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'

const router   = useRouter()
const store    = useKpiStore()
const { proxy } = getCurrentInstance()
const orgStore = useOrgStore()
const auth = useAuthStore()
const departamentosApi = ref([])
const usuariosApi      = ref([])

onMounted(async () => {
  const headers = { 'Authorization': `Bearer ${auth.token}` }
  const [resDepts, resUsuarios] = await Promise.all([
    fetch('http://127.0.0.1:8000/api/departments', { headers }),
    fetch('http://127.0.0.1:8000/api/users',       { headers }),
  ])
  departamentosApi.value = await resDepts.json()
  usuariosApi.value      = await resUsuarios.json()
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
  meta:            '',       // texto display: ej. '> 95%'
  goal:            null,     // BD: valor numérico de la meta
  unit:            '%',      // BD: unidad de medida
  minimum:         null,
  maximum:         null,
  weight:          1.00,
  tipoMetrica:     'Porcentaje',
  status:          'active',
  company_id:      1,
})

// Departamentos desde la API
const opcionesDepartamentos = computed(() =>
  departamentosApi.value.map(d => ({ value: d.id, label: d.name }))
)

// Equipos filtrados por departamento seleccionado
const opcionesEquipos = computed(() => {
  if (!nuevoKpi.value.departamento_id) return []
  const deptId = Number(nuevoKpi.value.departamento_id)
  return usuariosApi.value
    .filter(u => u.team_id && u.department_id === deptId)
    .map(u => ({ value: u.team_id, label: `Equipo ${u.team_id}` }))
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
    goal:          nuevoKpi.value.goal    ? Number(nuevoKpi.value.goal)    : null,
    minimum:       nuevoKpi.value.minimum ? Number(nuevoKpi.value.minimum) : null,
    maximum:       nuevoKpi.value.maximum ? Number(nuevoKpi.value.maximum) : null,
    unit:          nuevoKpi.value.unit,
    weight:        Number(nuevoKpi.value.weight),
    status:        'active',
    company_id:    auth.user.company_id,
    department_id: nuevoKpi.value.departamento_id ? Number(nuevoKpi.value.departamento_id) : null,
    created_by:    auth.user.id,
  }

  const res = await fetch('http://127.0.0.1:8000/api/kpis', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(payload),
  })

  const kpiCreado = await res.json()

  if (!res.ok) {
    proxy.$notify.error('Error al guardar el KPI', 'Error')
    return
  }

  // Si hay valor inicial, guardarlo como primer registro
  if (nuevoKpi.value.progreso > 0) {
    await fetch('http://127.0.0.1:8000/api/kpi-records', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type':  'application/json',
    },
      body: JSON.stringify({
        kpi_id:       kpiCreado.id,
        value:        Number(nuevoKpi.value.progreso),
        period_start: new Date().toISOString().split('T')[0],
        captured_by:  auth.user.id,
      }),
    })
  }
  proxy.$notify.success('KPI registrado correctamente', 'Éxito')
  router.push('/kpis')
}

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

    <form
      @submit.prevent="guardarKpi"
      class="rounded-xl shadow-md border overflow-hidden max-w-4xl"
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

        <FormField
          label="Valor Inicial (0-100)"
          hint="define el estado automáticamente"
          required
        >
          <AppInput
            v-model="nuevoKpi.progreso"
            type="number"
            :min="0"
            :max="100"
            placeholder="Ej. 85"
            required
          />
          <p class="text-[10px] mt-1" :class="{
            'text-emerald-600': nuevoKpi.progreso >= 80,
            'text-amber-500':   nuevoKpi.progreso >= 50 && nuevoKpi.progreso < 80,
            'text-rose-500':    nuevoKpi.progreso < 50,
          }">
            <span v-if="nuevoKpi.progreso >= 80">● Estado: Saludable</span>
            <span v-else-if="nuevoKpi.progreso >= 50">● Estado: En riesgo</span>
            <span v-else-if="nuevoKpi.progreso > 0">● Estado: Crítico</span>
          </p>
        </FormField>

        <FormField label="Meta / Objetivo" required :col-span="2">
          <AppInput
            v-model="nuevoKpi.meta"
            placeholder="Ej. > 95%  o  < 200ms  o  $5,000 USD"
            required
          />
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
  </div>
</template>