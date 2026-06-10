<script setup>
import { ref } from 'vue'
import { getCurrentInstance } from 'vue'
import plantillatabla from '../components/PlantillaTabla.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import ModalConfirmacion from '../components/ModalConfirmacion.vue'

const vistaActual = ref('tabla')
const nuevaMetrica = ref({ nombre: '', fechaCorte: '', valor: '' })

const metricasAsignadas = ref([
  { id: 1, nombre: "Métrica de Latencia API Gateway", info: "Hace 2 días | Ing. Arantxa",
    estado: "RETRASADA", claseEstado: "text-red-600 bg-red-50 border-red-200", icono: "fi fi-sr-stats" },
  { id: 2, nombre: "Uso de Memoria (Production Node A)", info: "En 4 horas | Servidor-PRD",
    estado: "POR VENCER", claseEstado: "text-amber-600 bg-amber-50 border-amber-200", icono: "fi fi-sr-computer" },
  { id: 3, nombre: "Tasa de Error HTTP 5xx", info: "Hoy, 18:00 | Monitoring Lab",
    estado: "A TIEMPO", claseEstado: "text-emerald-600 bg-emerald-50 border-emerald-200", icono: "fi fi-sr-shield-check" }
])

const { proxy } = getCurrentInstance()
const showModal = ref(false)
const kpiAEliminar = ref(null)

const irAFormulario = () => vistaActual.value = 'formulario'
const regresarATabla = () => vistaActual.value = 'tabla'
const guardarMetrica = () => { console.log("Datos:", nuevaMetrica.value); regresarATabla() }

const prepararEliminacion = (kpi) => { kpiAEliminar.value = kpi; showModal.value = true }
const eliminarMetrica = () => {
  if (kpiAEliminar.value) {
    metricasAsignadas.value = metricasAsignadas.value.filter(i => i.id !== kpiAEliminar.value.id)
    proxy.$notify.success('El KPI ha sido eliminado', 'Éxito')
    showModal.value = false
  }
}
</script>

<template>
  <div class="p-3 min-h-screen" style="background: transparent;">
    <div class="w-full">

      <!-- VISTA TABLA -->
      <div v-if="vistaActual === 'tabla'" class="space-y-6">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5"
          style="border-bottom: 1px solid var(--tabla-borde);">
          <EncabezadoPantalla
            titulo="Captura de Métricas"
            descripcion="Gestión de indicadores operativos del sistema y captura de datos en tiempo real."
          />
          <button @click="irAFormulario"
            class="text-white font-bold text-xs p-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 h-[38px] w-full sm:w-auto shadow-sm self-end"
            style="background: var(--sidebar-bg);"
            @mouseover="$event.currentTarget.style.background='var(--botton-on)'""
            @mouseleave="$event.currentTarget.style.background='var(--botton-off)'"
          >+ Registrar Nueva Métrica</button>
        </div>

        <plantillatabla
          titulo="KPIs ASIGNADAS"
          :encabezados="['Indicador Operativo', 'Estado', 'Acciones']"
          :datos="metricasAsignadas"
          class="mt-6 w-full"
        >
          <template #default="{ fila }">

            <td class="p-4 flex items-center gap-4 text-left md:w-7/12 min-w-[220px]">
              <!-- Ícono con fondo adaptable -->
              <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style="background: var(--tabla-header-bg);">
                <i :class="[fila.icono, 'text-base']"></i>
              </div>
              <div>
                <div class="font-bold text-m" style= "color: var(--text-general);">{{ fila.nombre }}</div>
                <div class="text-[11px] mt-xs" style="color: var(--text-general);">{{ fila.info }}</div>
              </div>
            </td>

            <td class="p-4 align-middle text-left md:w-3/12 min-w-[120px]">
              <!-- Badges de estado: semánticos, NO cambian -->
              <span class="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide inline-block"
                :class="fila.claseEstado">
                {{ fila.estado }}
              </span>
            </td>

            <td class="p-4 align-middle md:w-2/12 min-w-[100px]">
              <div class="flex items-center justify-center gap-3">
                <button @click="prepararEliminacion(fila)" title="Eliminar Métrica"
                  class="p-1.5 rounded-lg transition-colors text-sm"
                  style="color: var(--card-text-hint); background: var(--tabla-header-bg);"
                  @mouseover="$event.currentTarget.style.color='#ef4444'; $event.currentTarget.style.background='#fef2f2'"
                  @mouseleave="$event.currentTarget.style.color='var(--card-text-hint)'; $event.currentTarget.style.background='var(--tabla-header-bg)'"
                ><i class="fi fi-sr-trash"></i></button>
              </div>
            </td>
          </template>
        </plantillatabla>

        <ModalConfirmacion
          :isOpen="showModal"
          titulo="¿Estás seguro?"
          mensaje="Esta acción borrará el registro permanentemente."
          @confirmar="eliminarMetrica"
          @cancelar="showModal = false"
        />
      </div>

      <!-- VISTA FORMULARIO -->
      <div v-else class="p-8 rounded-xl shadow-md w-full mt-6"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">

        <div class="flex justify-between items-center mb-6 pb-4"
          style="border-bottom: 1px solid var(--card-border);">
          <div>
            <h2 class="text-lg font-black" style="color: var(--card-text);">Nueva Métrica</h2>
            <p class="text-[10px] uppercase font-bold tracking-widest mt-0.5"
              style="color: var(--card-text-hint);">Formulario de registro operativo</p>
          </div>
          <button @click="regresarATabla"
            class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style="background: var(--tabla-header-bg); color: var(--card-text-hint); border: 1px solid var(--card-border);"
            @mouseover="$event.currentTarget.style.background='#fef2f2'; $event.currentTarget.style.color='#ef4444'"
            @mouseleave="$event.currentTarget.style.background='var(--tabla-header-bg)'; $event.currentTarget.style.color='var(--card-text-hint)'"
          ><i class="fi fi-sr-cross text-xs"></i></button>
        </div>

        <!-- NOTA: formulario usa <form> con @submit.prevent, eso está correcto -->
        <form @submit.prevent="guardarMetrica" class="space-y-5">

          <div class="flex flex-col gap-1.5">
            <label class="text-[11px] font-bold uppercase tracking-wider"
              style="color: var(--card-text-muted);">Nombre del Indicador</label>
            <input v-model="nuevaMetrica.nombre" type="text"
              placeholder="Ej. Latencia en pasarela corporativa..."
              required
              class="w-full text-xs rounded-lg p-2.5 outline-none transition-all"
              style="background: var(--input-bg); color: var(--input-text); border: 1px solid var(--input-border);"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold uppercase tracking-wider"
                style="color: var(--card-text-muted);">Fecha de Corte</label>
              <input v-model="nuevaMetrica.fechaCorte" type="date"
                required
                class="w-full text-xs rounded-lg p-2.5 outline-none transition-all cursor-pointer"
                style="background: var(--input-bg); color: var(--input-text); border: 1px solid var(--input-border);"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold uppercase tracking-wider"
                style="color: var(--card-text-muted);">Valor Registrado</label>
              <input v-model="nuevaMetrica.valor" type="number" step="0.01"
                placeholder="0.00" required
                class="w-full text-xs rounded-lg p-2.5 outline-none transition-all"
                style="background: var(--input-bg); color: var(--input-text); border: 1px solid var(--input-border);"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-5 mt-8"
            style="border-top: 1px solid var(--card-border);">
            <button type="button" @click="regresarATabla"
              class="text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
              style="color: var(--card-text-muted);"
            >Cancelar</button>
            <button type="submit"
              class="text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all duration-300 shadow-sm h-[38px]"
              style="background: var(--sidebar-bg);"
              @mouseover="$event.currentTarget.style.background='#77a9d4'"
              @mouseleave="$event.currentTarget.style.background='var(--sidebar-bg)'"
            >Guardar Registro</button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>