<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { useUiStore }  from '../stores/uiStore'
import { useKpiStore } from '../stores/kpiStore'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'
import Bottones from '../components/Bottones.vue'

const router = useRouter()
const store    = useUiStore()
const kpiStore = useKpiStore()

const listaLocal          = ref([])
const kpisActivosLocal    = ref([])
const modoGraficaLocal    = ref('general')
const kpiSeleccionadoLocal = ref(1)
const tipoGraficaLocal    = ref('linea')
const filtroBusqueda      = ref('')
const filtroEstado        = ref('todos')

onMounted(() => {
  store.cargarOrden()
  store.cargarPreferencias()
  listaLocal.value          = JSON.parse(JSON.stringify(store.widgets))
  kpisActivosLocal.value    = [...store.kpisActivos]
  modoGraficaLocal.value    = store.modoGrafica
  kpiSeleccionadoLocal.value = store.kpiSeleccionadoGrafica
  tipoGraficaLocal.value    = store.tipoGraficaEspecifica
})

const indicadoresFiltrados = computed(() =>
  kpiStore.indicadores.filter(ind => {
    const coincideTexto  = ind.nombre.toLowerCase().includes(filtroBusqueda.value.toLowerCase())
    const coincideEstado = filtroEstado.value === 'todos' || ind.estadoTipo === filtroEstado.value
    return coincideTexto && coincideEstado
  })
)

const kpiSeleccionadoCompleto = computed(() =>
  kpiStore.indicadores.find(i => i.id === kpiSeleccionadoLocal.value)
)

function toggleKpi(id) {
  const index = kpisActivosLocal.value.indexOf(id)
  if (index === -1) {
    if (kpisActivosLocal.value.length < 4) kpisActivosLocal.value.push(id)
  } else {
    if (kpisActivosLocal.value.length > 1) kpisActivosLocal.value.splice(index, 1)
  }
}

function guardarCambios() {
  store.guardarOrden(listaLocal.value)
  store.kpisActivos             = kpisActivosLocal.value
  store.modoGrafica             = modoGraficaLocal.value
  store.kpiSeleccionadoGrafica  = kpiSeleccionadoLocal.value
  store.tipoGraficaEspecifica   = tipoGraficaLocal.value
  store.guardarPreferencias()
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen" style="background-color: var(--layout-bg);">

    <div class="flex-1 p-6 overflow-y-auto">

      <div class="flex justify-between items-center mb-8">
        <EncabezadoPantalla
          titulo="Personalizar Panel"
          descripcion="Arrastra los bloques y configura tus KPIs desde la barra lateral."
        />
        <div class="flex gap-3">
<<<<<<< HEAD
         <Bottones  @click="cancelar" > Cancelar </Bottones>

         <Bottones  @click="guardarCambios" >Guardar Cambios </Bottones>
          
          
=======
          <button
            @click="router.push('/')"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style="border: 1px solid var(--tabla-borde); color: var(--text-general); background: var(--card-bg);"
            @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
            @mouseleave="$event.currentTarget.style.background='var(--card-bg)'"
          >Cancelar</button>
          <button
            @click="guardarCambios"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style="background: var(--sidebar-bg);"
            @mouseover="$event.currentTarget.style.background='var(--sidebar-active-bg)'; $event.currentTarget.style.color='var(--sidebar-active-text)'"
            @mouseleave="$event.currentTarget.style.background='var(--sidebar-bg)'; $event.currentTarget.style.color='white'"
          >Guardar cambios</button>
>>>>>>> 6848967a5caccb711dd224e147d7a877adf1165c
        </div>
      </div>

      <div class="flex items-center gap-2 text-sm mb-5 rounded-xl px-4 py-3 shadow-sm w-fit"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--subtext-general);">
        <span>Arrastra desde <strong style="color: var(--text-general);">⠿⠿</strong> para cambiar el orden.</span>
      </div>

      <draggable
        v-model="listaLocal"
        item-key="id"
        tag="div"
        handle=".drag-handle"
        animation="200"
        class="flex flex-col gap-3"
      >
        <template #item="{ element, index }">
          <div class="flex items-center gap-4 rounded-xl p-4 shadow-sm transition-all cursor-default select-none"
            style="background: var(--grafics-bg); border: 1px solid var(--tabla-borde);">
            <span class="text-xs font-bold w-4 text-center" style="color: var(--subtext-general);">{{ index + 1 }}</span>
            <span class="drag-handle cursor-grab active:cursor-grabbing text-lg transition-colors"
              style="color: var(--subtext-general);">⠿⠿</span>
            <span class="text-2xl w-8 text-center">{{ element.icono }}</span>
            <div class="flex flex-col flex-1 min-w-0">
              <span class="text-sm font-bold" style="color: var(--sidebar-text);">{{ element.nombre }}</span>
              <span class="text-xs mt-0.5" style="color: var(--card-text-hint);">{{ element.descripcion }}</span>
            </div>
            <span class="table-badge flex-shrink-0">Posición {{ index + 1 }}</span>
          </div>
        </template>
      </draggable>

    </div>

    <div class="w-80 flex flex-col overflow-y-auto"
      style="background: var(--card-bg); border-left: 1px solid var(--tabla-borde);">

      <div class="p-4" style="background: var(--grafics-bg); border-bottom: 1px solid var(--tabla-borde);">
        <p class="text-xs font-bold uppercase tracking-wider" style="color: var(--color-kpi-morado);">Configuración del Panel</p>
        <p class="text-[10px] mt-0.5" style="color: var(--card-text-hint);">Máximo 4 KPIs activos al mismo tiempo</p>
      </div>

      <div class="p-4" style="border-bottom: 1px solid var(--tabla-borde);">
        <p class="text-xs font-bold uppercase tracking-wider mb-3" style="color: var(--tabla-header-text);">
          KPIs en el Panel
        </p>
        <input
          v-model="filtroBusqueda"
          type="text"
          placeholder="Buscar KPI..."
          class="app-input mb-2"
        />
        <select v-model="filtroEstado" class="app-select mb-3">
          <option value="todos">Todos los estados</option>
          <option value="success">Saludable</option>
          <option value="warning">En riesgo</option>
          <option value="danger">Crítico</option>
        </select>
        <p class="text-[10px] mb-2" style="color: var(--subtext-general);">
          {{ kpisActivosLocal.length }}/4 KPIs activos
        </p>

        <div class="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
          <div
            v-for="ind in indicadoresFiltrados"
            :key="ind.id"
            @click="toggleKpi(ind.id)"
            class="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all"
            :style="kpisActivosLocal.includes(ind.id)
              ? 'border: 1px solid var(--sidebar-bg); background: rgba(63,42,82,0.1);'
              : 'border: 1px solid var(--tabla-borde); background: transparent;'"
            @mouseover="!kpisActivosLocal.includes(ind.id) && ($event.currentTarget.style.background='var(--tabla-hover)')"
            @mouseleave="!kpisActivosLocal.includes(ind.id) && ($event.currentTarget.style.background='transparent')"
          >
            <div
              class="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
              :style="kpisActivosLocal.includes(ind.id)
                ? 'background: var(--sidebar-bg); border: 2px solid var(--sidebar-bg);'
                : 'border: 2px solid var(--tabla-borde); background: transparent;'"
            >
              <span v-if="kpisActivosLocal.includes(ind.id)" class="text-white text-[8px] font-bold">✓</span>
            </div>
            <div class="flex flex-col flex-1 min-w-0">
              <span class="text-xs font-semibold truncate" style="color: var(--text-general);">{{ ind.nombre }}</span>
              <span class="text-[10px] truncate" style="color: var(--subtext-general);">{{ ind.subtitulo }}</span>
            </div>
            <span class="w-2 h-2 rounded-full flex-shrink-0"
              :class="{
                'bg-emerald-500': ind.estadoTipo === 'success',
                'bg-amber-500':   ind.estadoTipo === 'warning',
                'bg-rose-500':    ind.estadoTipo === 'danger',
              }"></span>
          </div>
        </div>

        <p v-if="kpisActivosLocal.length >= 4"
          class="text-[10px] text-amber-600 mt-2 rounded-lg px-2 py-1.5"
          style="background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.3);">
          Límite alcanzado. Desactiva uno para activar otro.
        </p>
      </div>

      <div class="p-4">
        <p class="text-xs font-bold uppercase tracking-wider mb-3" style="color: var(--tabla-header-text);">
          Gráficas del Panel
        </p>

        <div
          v-for="(opt, i) in [
            { val: 'general',   label: 'Resumen general',              desc: 'Medidor de salud global y barras de progreso de todos los KPIs' },
            { val: 'especifica', label: 'Gráfica específica de un KPI', desc: 'Elige un KPI y el tipo de gráfica para ver su historial' }
          ]"
          :key="opt.val"
          @click="modoGraficaLocal = opt.val"
          class="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all mb-2"
          :style="modoGraficaLocal === opt.val
            ? 'border: 1px solid var(--sidebar-bg); background: rgba(63,42,82,0.1);'
            : 'border: 1px solid var(--tabla-borde); background: transparent;'"
          @mouseover="modoGraficaLocal !== opt.val && ($event.currentTarget.style.background='var(--tabla-hover)')"
          @mouseleave="modoGraficaLocal !== opt.val && ($event.currentTarget.style.background='transparent')"
        >
          <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
            :style="modoGraficaLocal === opt.val
              ? 'border-color: var(--sidebar-bg);'
              : 'border-color: var(--tabla-borde);'">
            <div v-if="modoGraficaLocal === opt.val" class="w-2 h-2 rounded-full"
              style="background: var(--sidebar-bg);"></div>
          </div>
          <div>
            <p class="text-xs font-semibold" style="color: var(--text-general);">{{ opt.label }}</p>
            <p class="text-[10px] mt-0.5" style="color: var(--subtext-general);">{{ opt.desc }}</p>
          </div>
        </div>

        <div v-if="modoGraficaLocal === 'especifica'" class="mt-3 pl-2 flex flex-col gap-2"
          style="border-left: 2px solid var(--color-kpi-morado);">
          <p class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">KPI a mostrar</p>
          <select v-model="kpiSeleccionadoLocal" class="app-select">
            <option v-for="id in kpisActivosLocal" :key="id" :value="id">
              {{ kpiStore.indicadores.find(i => i.id === id)?.nombre }}
            </option>
          </select>

          <p class="text-[10px] font-bold uppercase tracking-wider mt-1" style="color: var(--subtext-general);">Tipo de gráfica</p>
          <div class="flex flex-col gap-1">
            <div
              v-for="tipo in kpiSeleccionadoCompleto?.graficasCompatibles"
              :key="tipo"
              @click="tipoGraficaLocal = tipo"
              class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all text-xs capitalize"
              :style="tipoGraficaLocal === tipo
                ? 'border: 1px solid var(--sidebar-bg); background: rgba(63,42,82,0.1); color: var(--tabla-header-text); font-weight: 600;'
                : 'border: 1px solid var(--tabla-borde); background: transparent; color: var(--subtext-general);'"
              @mouseover="tipoGraficaLocal !== tipo && ($event.currentTarget.style.background='var(--tabla-hover)')"
              @mouseleave="tipoGraficaLocal !== tipo && ($event.currentTarget.style.background='transparent')"
            >
              <span>{{ tipo === 'linea' ? '📉' : tipo === 'barras' ? '📊' : tipo === 'area' ? '🏔️' : '🎯' }}</span>
              <span>{{ tipo }}</span>
              <span v-if="tipoGraficaLocal === tipo" class="ml-auto text-[10px]">✓</span>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
