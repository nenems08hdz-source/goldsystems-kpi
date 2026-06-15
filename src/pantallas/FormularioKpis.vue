<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { useKpiStore } from '../stores/kpiStore'
import { useOrgStore } from '../stores/orgStore'
import AppButton          from '@/components/ui/AppButton.vue'
import AppInput            from '@/components/ui/AppInput.vue'
import AppSelect           from '@/components/ui/AppSelect.vue'
import FormField           from '@/components/ui/FormField.vue'
import EncabezadoPantalla  from '@/components/EncabezadoPantalla.vue'

const router   = useRouter()
const store    = useKpiStore()
const orgStore = useOrgStore()
const { proxy } = getCurrentInstance()

const nuevoKpi = ref({
  nombre:          '',
  formula:         '',
  departamento_id: null,
  equipo_id:       null,
  usuario_id:      null,
  progreso:        0,
  periodicidad:    'Mensual',
  meta:            '',
  subtitulo:       '',
  tipoMetrica:     'Porcentaje',
})

const opcionesDepartamentos = orgStore.estructuraOrganizacional
  .filter(n => n.tipo === 'departamento')
  .map(d => ({ value: d.id, label: d.nombre }))

const opcionesEquipos = computed(() => {
  if (!nuevoKpi.value.departamento_id) return []
  const deptId = Number(nuevoKpi.value.departamento_id)
  return orgStore.estructuraOrganizacional
    .filter(n => n.tipo === 'equipo' && n.padre_id === deptId)
    .map(e => ({ value: e.id, label: e.nombre }))
})

const opcionesResponsable = computed(() => {
  const deptId   = nuevoKpi.value.departamento_id ? Number(nuevoKpi.value.departamento_id) : null
  const equipoId = nuevoKpi.value.equipo_id       ? Number(nuevoKpi.value.equipo_id)       : null

  return orgStore.usuarios
    .filter(u => {
      if (equipoId) return u.equipo_id   === equipoId
      if (deptId)   return u.departamento_id === deptId
      return true
    })
    .map(u => ({ value: u.id, label: orgStore.nombreCompleto(u) }))
})

function onDepartamentoChange() {
  nuevoKpi.value.equipo_id  = null
  nuevoKpi.value.usuario_id = null
}
function onEquipoChange() {
  nuevoKpi.value.usuario_id = null
}

function guardarKpi() {
  const obtenerEstado = (progreso) => {
    if (progreso >= 80) return { estado: 'saludable', estadoTipo: 'success' }
    if (progreso >= 50) return { estado: 'en riesgo', estadoTipo: 'warning' }
    return { estado: 'critico', estadoTipo: 'danger' }
  }

  const { estado, estadoTipo } = obtenerEstado(nuevoKpi.value.progreso)

  const deptNombre = orgStore.estructuraOrganizacional
    .find(n => n.id === Number(nuevoKpi.value.departamento_id))?.nombre ?? ''

  const uidNum         = Number(nuevoKpi.value.usuario_id)
  const usuarioElegido = orgStore.usuarios.find(u => u.id === uidNum)

  const kpiNuevo = {
    id:                  store.indicadores.length + 1,
    nombre:              nuevoKpi.value.nombre,
    formula:             nuevoKpi.value.formula,
    departamento:        deptNombre,
    subtitulo:           nuevoKpi.value.subtitulo || nuevoKpi.value.nombre,
    responsable:         usuarioElegido ? orgStore.nombreCompleto(usuarioElegido) : '',
    progreso:            Number(nuevoKpi.value.progreso),
    periodicidad:        nuevoKpi.value.periodicidad,
    meta:                nuevoKpi.value.meta,
    objetivo:            nuevoKpi.value.meta,
    tipoMetrica:         nuevoKpi.value.tipoMetrica,
    estado,
    estadoTipo,
    tendencia:           'estable',
    ultimaActualizacion: new Date().toISOString().split('T')[0],
    historial:           [Number(nuevoKpi.value.progreso)],
    etiquetasHistorial:  ['Inicio'],
    graficasCompatibles: ['linea', 'barras'],
  }

  store.indicadores.push(kpiNuevo)

  if (uidNum) {
    store.kpisAsignados.push({
      usuario_id:      uidNum,
      kpi_id:          kpiNuevo.id,
      fechaAsignacion: new Date().toISOString().split('T')[0],
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
