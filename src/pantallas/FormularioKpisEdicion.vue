<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useKpiStore } from '../stores/kpiStore'
import { useAuthStore } from '../stores/authStore'
import api from '../services/api'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import FormField from '@/components/ui/FormField.vue'
import FormContenedor from '@/components/ui/FormContenedor.vue'
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'

const router = useRouter()
const route = useRoute()
const store = useKpiStore()
const { proxy } = getCurrentInstance()
const auth = useAuthStore()
const departamentosApi = ref([])
const equiposApi       = ref([])
const usuariosApi      = ref([])
const cargando = ref(true)

const kpiId = ref(route.params.id)

const kpiEdicion = ref({
  nombre:          '',
  subtitulo:       '',
  formula:         '',
  departamento_id: null,
  equipo_id:       null,
  usuario_id:      null,
  goal:            '',
  unit:            '%',
  tipoMetrica:     'Porcentaje',
  periodicidad:    'Mensual',
})

onMounted(async () => {
  try {
    const [resDepts, resEquipos, resUsuarios] = await Promise.all([
      api.get('/departments'),
      api.get('/teams'),
      api.get('/users'),
    ])
    departamentosApi.value = resDepts.data
    equiposApi.value       = resEquipos.data
    usuariosApi.value      = resUsuarios.data

    // Cargar el KPI a editar
    const resKpi = await api.get(`/kpis/${kpiId.value}`)
    const k = resKpi.data

    // Mapeo inverso API → Display
    const tipoReverseMap = {
      'percentage': 'Porcentaje',
      'money': 'Monetario',
      'time': 'Tiempo',
      'absolute': 'Puntaje',
      'custom': 'Puntaje',
    }

    const frecuenciaReverseMap = {
      'daily': 'Diario',
      'weekly': 'Semanal',
      'monthly': 'Mensual',
      'quarterly': 'Trimestral',
      'annual': 'Anual',
    }

    kpiEdicion.value = {
      nombre:          k.name,
      subtitulo:       k.subtitle || k.name,
      formula:         k.formula || '',
      departamento_id: k.department_id,
      equipo_id:       k.team_id ?? null,
      usuario_id:      k.created_by,
      goal:            k.goal || '',
      unit:            k.unit || '%',
      tipoMetrica:     tipoReverseMap[k.type]        || 'Porcentaje',
      periodicidad:    frecuenciaReverseMap[k.frequency] || 'Mensual',
    }
    cargando.value = false
  } catch (error) {
    console.error('Error cargando KPI:', error)
    proxy.$notify.error('Error al cargar el KPI', 'Error')
    cargando.value = false
  }
})

const opcionesDepartamentos = computed(() =>
  departamentosApi.value.map(d => ({ value: d.id, label: d.name }))
)

const opcionesEquipos = computed(() => {
  if (!kpiEdicion.value.departamento_id) return []
  const deptId = Number(kpiEdicion.value.departamento_id)
  return equiposApi.value
    .filter(e => e.department_id === deptId)
    .map(e => ({ value: e.id, label: e.name }))
})

const opcionesResponsable = computed(() => {
  const deptId   = kpiEdicion.value.departamento_id ? Number(kpiEdicion.value.departamento_id) : null
  const equipoId = kpiEdicion.value.equipo_id       ? Number(kpiEdicion.value.equipo_id)       : null
  return usuariosApi.value
    .filter(u => {
      if (equipoId) return u.team_id       === equipoId
      if (deptId)   return u.department_id === deptId
      return true
    })
    .map(u => ({ value: u.id, label: `${u.name} ${u.paternal ?? ''}`.trim() }))
})

function onDepartamentoChange() {
  kpiEdicion.value.equipo_id  = null
  kpiEdicion.value.usuario_id = null
}
function onEquipoChange() {
  kpiEdicion.value.usuario_id = null
}

const unidadPorTipo = {
  'Porcentaje': '%',
  'Monetario': '$',
  'Tiempo': 'ms',
  'Puntaje': 'pts',
}

watch(() => kpiEdicion.value.tipoMetrica, (tipo) => {
  kpiEdicion.value.unit = unidadPorTipo[tipo] ?? '%'
})

async function guardarEdicion() {
  const tipoApiMap = {
    'Porcentaje': 'percentage',
    'Monetario': 'money',
    'Tiempo': 'time',
    'Puntaje': 'absolute',
  }

  const frecuenciaApiMap = {
    'Diario': 'daily',
    'Semanal': 'weekly',
    'Mensual': 'monthly',
    'Trimestral': 'quarterly',
    'Anual': 'annual',
  }

  const payload = {
    name: kpiEdicion.value.nombre,
    subtitle: kpiEdicion.value.subtitulo || kpiEdicion.value.nombre,
    formula: kpiEdicion.value.formula,
    type: tipoApiMap[kpiEdicion.value.tipoMetrica],
    frequency: frecuenciaApiMap[kpiEdicion.value.periodicidad],
    goal: kpiEdicion.value.goal !== '' ? Number(kpiEdicion.value.goal) : null,
    unit: kpiEdicion.value.unit,
    department_id: kpiEdicion.value.departamento_id ? Number(kpiEdicion.value.departamento_id) : null,
    created_by: kpiEdicion.value.usuario_id ? Number(kpiEdicion.value.usuario_id) : auth.user.id,
  }

  try {
    await api.put(`/kpis/${kpiId.value}`, payload)

    // Recargar todos los KPIs desde la API para sincronizar completamente
    await new Promise(resolve => setTimeout(resolve, 300))
    await store.cargarIndicadores()

    proxy.$notify.success('KPI actualizado correctamente', 'Éxito')
    router.push('/kpis')
  } catch {
    proxy.$notify.error('Error al guardar el KPI', 'Error')
  }
}
</script>

<template>
  <div class="p-3 min-h-screen" v-if="!cargando">
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <EncabezadoPantalla
        titulo="Editar Indicador"
        descripcion="Modifica los datos del KPI."
      />
      <AppButton variant="secondary" class="flex-shrink-0" @click="router.push('/kpis')">
        ← Volver al Listado
      </AppButton>
    </div>

    <FormContenedor>
      <form
      @submit.prevent="guardarEdicion"
      class="w-full rounded-xl shadow-md border overflow-hidden"
      style="background: var(--card-bg); border-color: rgba(190,174,216,0.5);"
    >
      <div class="p-4 border-b" style="background: var(--tabla-header-bg); border-color: rgba(190,174,216,0.3);">
        <h2 class="text-sm font-bold uppercase tracking-wider" style="color: var(--text-general);">
          Configuración del KPI
        </h2>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Nombre del KPI" required>
          <AppInput v-model="kpiEdicion.nombre" required />
        </FormField>

        <FormField label="Departamento" required>
          <AppSelect
            v-model="kpiEdicion.departamento_id"
            :options="opcionesDepartamentos"
            required
            @change="onDepartamentoChange"
          />
        </FormField>

        <FormField v-if="kpiEdicion.departamento_id" label="Equipo" hint="opcional">
          <AppSelect
            v-model="kpiEdicion.equipo_id"
            :options="[{ value: null, label: 'Sin equipo específico' }, ...opcionesEquipos]"
            placeholder="Sin equipo específico"
            @change="onEquipoChange"
          />
        </FormField>

        <FormField label="Responsable" required>
          <AppSelect
            v-model="kpiEdicion.usuario_id"
            :options="opcionesResponsable"
            :placeholder="kpiEdicion.departamento_id ? 'Selecciona un responsable' : 'Selecciona departamento primero'"
            :disabled="!kpiEdicion.departamento_id"
            required
          />
          <p v-if="kpiEdicion.departamento_id && opcionesResponsable.length === 0"
            class="text-[10px] mt-1 text-amber-500">
            No hay usuarios en este departamento/equipo.
          </p>
        </FormField>

        <FormField label="Fórmula o Criterio de Cálculo" required>
          <AppInput v-model="kpiEdicion.formula" required />
        </FormField>

        <FormField label="Descripción corta" :col-span="2">
          <AppInput v-model="kpiEdicion.subtitulo" />
        </FormField>

        <FormField label="Periodicidad" required>
          <AppSelect v-model="kpiEdicion.periodicidad" :options="['Diario', 'Semanal', 'Mensual', 'Trimestral', 'Anual']" />
        </FormField>

        <FormField label="Tipo de Métrica" required>
          <AppSelect
            v-model="kpiEdicion.tipoMetrica"
            :options="[
              { value: 'Porcentaje', label: 'Porcentaje (%)' },
              { value: 'Monetario', label: 'Monetario ($)' },
              { value: 'Tiempo', label: 'Tiempo (ms, hrs)' },
              { value: 'Puntaje', label: 'Puntaje (pts)' },
            ]"
          />
        </FormField>

        <FormField label="Meta / Objetivo" required :col-span="2">
          <AppInput v-model="kpiEdicion.goal" type="number" step="0.01" required />
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
          Guardar Cambios
        </AppButton>
      </div>
      </form>
    </FormContenedor>
  </div>

  <div v-else class="p-3 min-h-screen flex items-center justify-center">
    <p style="color: var(--subtext-general);">Cargando...</p>
  </div>
</template>
