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

const listaLocal = ref([])
const kpisActivosLocal = ref([])
const modoGraficaLocal = ref('general')
const kpiSeleccionadoLocal = ref(1)
const tipoGraficaLocal = ref('linea')

const filtroBusqueda = ref('')
const filtroEstado = ref('todos')

onMounted(() => {
  store.cargarOrden()
  store.cargarPreferencias()
  listaLocal.value = JSON.parse(JSON.stringify(store.widgets))
  kpisActivosLocal.value = [...store.kpisActivos]
  modoGraficaLocal.value = store.modoGrafica
  kpiSeleccionadoLocal.value = store.kpiSeleccionadoGrafica
  tipoGraficaLocal.value = store.tipoGraficaEspecifica
})

const indicadoresFiltrados = computed(() => {
  return kpiStore.indicadores.filter(ind => {
    const coincideTexto = ind.nombre
      .toLowerCase()
      .includes(filtroBusqueda.value.toLowerCase())
    const coincideEstado =
      filtroEstado.value === 'todos' || ind.estadoTipo === filtroEstado.value
    return coincideTexto && coincideEstado
  })
})

const kpiSeleccionadoCompleto = computed(() =>
  kpiStore.indicadores.find(i => i.id === kpiSeleccionadoLocal.value)
)

function toggleKpi(id) {
  const index = kpisActivosLocal.value.indexOf(id)
  if (index === -1) {
    if (kpisActivosLocal.value.length < 4) {
      kpisActivosLocal.value.push(id)
    }
  } else {
    if (kpisActivosLocal.value.length > 1) {
      kpisActivosLocal.value.splice(index, 1)
    }
  }
}

function guardarCambios() {
  store.guardarOrden(listaLocal.value)
  store.kpisActivos = kpisActivosLocal.value
  store.modoGrafica = modoGraficaLocal.value
  store.kpiSeleccionadoGrafica = kpiSeleccionadoLocal.value
  store.tipoGraficaEspecifica = tipoGraficaLocal.value
  store.guardarPreferencias()
  router.push('/')
}

function cancelar() {
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
         <Bottones  @click="cancelar" > Cancelar </Bottones>

         <Bottones  @click="guardarCambios" >Guardar Cambios </Bottones>
          
          
        </div>
      </div>

      <div class="flex items-center gap-2 text-sm text-slate-400 mb-5 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm w-fit"
      style="background: var(--card-bg); color: var(--text-general);">
        <span></span>
        <span>Arrastra desde <strong class="text-slate-600"style="color: var(--subtext-general);">⠿⠿</strong> para cambiar el orden.</span>
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
          <div class="flex items-center gap-4 bg-[#3f2a52] border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#beaed8] transition-all cursor-default select-none">
            <span class="text-xs font-bold text-slate-300 w-4 text-center">{{ index + 1 }}</span>
            <span class="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-[#3f2a52] transition-colors text-lg">⠿⠿</span>
            <span class="text-2xl w-8 text-center">{{ element.icono }}</span>
            <div class="flex flex-col flex-1 min-w-0">
              <span class="text-sm font-bold text-white">{{ element.nombre }}</span>
              <span class="text-xs text-slate-400 mt-0.5">{{ element.descripcion }}</span>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#3f2a52] bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full flex-shrink-0">
              Posición {{ index + 1 }}
            </span>
          </div>
        </template>
      </draggable>

    </div>
    <div class="w-80 bg-white border-l border-slate-200 flex flex-col overflow-y-auto" style="background-color: var(--card-bg); border-color: var(--tabla-borde);">
      <div class="p-4 border-b border-slate-100 bg-[#3f2a52]">
        <p class="text-xs font-bold text-[#beaed8] uppercase tracking-wider" style="color: var(--text-general);"> Configuración del Panel</p>
        <p class="text-[10px] text-[#beaed8]/60 mt-0.5">Máximo 4 KPIs activos al mismo tiempo</p>
      </div>
      <div class="p-4 border-b border-slate-100">
        <p class="text-xs font-bold uppercase tracking-wider mb-3" style="color: var(--text-general)">
           KPIs en el Panel
        </p>
        <input 
          v-model="filtroBusqueda"
          type="text"
          placeholder="Buscar KPI..."
          class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-[#3f2a52] transition-colors"
          style="color: var(--text-general);"
        />
        <select
          v-model="filtroEstado"
          class="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-[#3f2a52] transition-colors bg-white"
          style="background-color: var( --input-bg);"
        >
          <option value="todos">Todos los estados</option>
          <option value="success"> Saludable</option>
          <option value="warning"> En riesgo</option>
          <option value="danger"> Crítico</option>
        </select>
        <p class="text-[10px] text-slate-400 mb-2">
          {{ kpisActivosLocal.length }}/4 KPIs activos
        </p>
        <div class="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
          <div
            v-for="ind in indicadoresFiltrados"
            :key="ind.id"
            @click="toggleKpi(ind.id)"
            class="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all"
            :class="kpisActivosLocal.includes(ind.id)
              ? 'border-[#3f2a52] bg-purple-50'
              : 'border-slate-100 hover:border-slate-300 bg-white'"
          >
            <div
              class="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
              :class="kpisActivosLocal.includes(ind.id)
                ? 'bg-[#3f2a52] border-[#3f2a52]'
                : 'border-slate-300'"
            >
              <span v-if="kpisActivosLocal.includes(ind.id)" class="text-white text-[8px] font-bold">✓</span>
            </div>
            <div class="flex flex-col flex-1 min-w-0">
              <span class="text-xs font-semibold text-slate-700 truncate">{{ ind.nombre }}</span>
              <span class="text-[10px] text-slate-400 truncate">{{ ind.subtitulo }}</span>
            </div>
            <span
              class="w-2 h-2 rounded-full flex-shrink-0"
              :class="{
                'bg-emerald-500': ind.estadoTipo === 'success',
                'bg-amber-500':   ind.estadoTipo === 'warning',
                'bg-rose-500':    ind.estadoTipo === 'danger',
              }"
            ></span>
          </div>
        </div>
        <p
          v-if="kpisActivosLocal.length >= 4"
          class="text-[10px] text-amber-500 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5"
        >
           Límite alcanzado. Desactiva uno para activar otro.
        </p>
      </div>
      <div class="p-4">
        <p class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
           Gráficas del Panel
        </p>
        <div
          @click="modoGraficaLocal = 'general'"
          class="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all mb-2"
          :class="modoGraficaLocal === 'general'
            ? 'border-[#3f2a52] bg-purple-50'
            : 'border-slate-100 hover:border-slate-300'"
        >
          <div
            class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
            :class="modoGraficaLocal === 'general'
              ? 'border-[#3f2a52]'
              : 'border-slate-300'"
          >
            <div v-if="modoGraficaLocal === 'general'" class="w-2 h-2 rounded-full bg-[#3f2a52]"></div>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-700">Resumen general</p>
            <p class="text-[10px] text-slate-400 mt-0.5">Medidor de salud global y barras de progreso de todos los KPIs</p>
          </div>
        </div>
        <div
          @click="modoGraficaLocal = 'especifica'"
          class="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all"
          :class="modoGraficaLocal === 'especifica'
            ? 'border-[#3f2a52] bg-purple-50'
            : 'border-slate-100 hover:border-slate-300'"
        >
          <div
            class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
            :class="modoGraficaLocal === 'especifica'
              ? 'border-[#3f2a52]'
              : 'border-slate-300'"
          >
            <div v-if="modoGraficaLocal === 'especifica'" class="w-2 h-2 rounded-full bg-[#3f2a52]"></div>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-700">Gráfica específica de un KPI</p>
            <p class="text-[10px] text-slate-400 mt-0.5">Elige un KPI y el tipo de gráfica para ver su historial</p>
          </div>
        </div>

        <div v-if="modoGraficaLocal === 'especifica'" class="mt-3 pl-2 border-l-2 border-[#beaed8] flex flex-col gap-2">
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">KPI a mostrar</p>
          <select
            v-model="kpiSeleccionadoLocal"
            class="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#3f2a52] bg-white"
          >
          
            <option
              v-for="id in kpisActivosLocal"
              :key="id"
              :value="id"
            >
              {{ kpiStore.indicadores.find(i => i.id === id)?.nombre }}
            </option>
          </select>

          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Tipo de gráfica</p>
          <div class="flex flex-col gap-1">
            <div
              v-for="tipo in kpiSeleccionadoCompleto?.graficasCompatibles"
              :key="tipo"
              @click="tipoGraficaLocal = tipo"
              class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs"
              :class="tipoGraficaLocal === tipo
                ? 'border-[#3f2a52] bg-purple-50 text-[#3f2a52] font-semibold'
                : 'border-slate-100 hover:border-slate-300 text-slate-600'"
            >
              <span>
                {{ tipo === 'linea' ? '📉' : tipo === 'barras' ? '📊' : tipo === 'area' ? '🏔️' : '🎯' }}
              </span>
              <span class="capitalize">{{ tipo }}</span>
              <span v-if="tipoGraficaLocal === tipo" class="ml-auto text-[10px]">✓</span>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>
