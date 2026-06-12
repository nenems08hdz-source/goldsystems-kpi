<script setup>
import { ref } from 'vue'
import { getCurrentInstance } from 'vue'
import plantillatabla from '../components/PlantillaTabla.vue'
import EncabezadoPantalla from '../components/EncabezadoPantalla.vue'

const canales = ref([
  { nombre: 'Correo Electrónico',    descripcion: 'Reportes detallados y alertas críticas.',    activo: true  },
  { nombre: 'Notificaciones Push',   descripcion: 'Alertas inmediatas en tiempo real.',          activo: true  },
  { nombre: 'Slack Integration',     descripcion: 'Sincroniza eventos de infraestructura.',      activo: false },
])

const encabezados = ['Métrica / KPI', 'Crítico', 'Advertencia', 'Informativo']

const kpisIniciales = [
  { nombre: 'Latencia de API (p99)',       critico: true,  advertencia: true,  informativo: false },
  { nombre: 'Error Rate (%)',              critico: true,  advertencia: true,  informativo: true  },
  { nombre: 'Uptime de Infraestructura',   critico: true,  advertencia: false, informativo: false },
  { nombre: 'Deployments Fallidos',        critico: true,  advertencia: true,  informativo: false },
]

const kpis = ref(JSON.parse(JSON.stringify(kpisIniciales)))
const frecuenciaSeleccionada = ref('Semanal')

const { proxy } = getCurrentInstance()

const guardarNotificacion = async () => {
  try {
    proxy.$notify.success('Los cambios han sido guardados correctamente', 'Éxito')
  } catch (error) {
    proxy.$notify.error('Hubo un error al guardar', 'Error')
  }
}

const descartarCambios = () => {
  kpis.value = JSON.parse(JSON.stringify(kpisIniciales))
}

const horarioSilencio = ref({ inicio: '22:00', fin: '08:00' })

const guardarcambios = () => {
  proxy.$notify.success('Horario de silencio actualizado', 'Éxito')
}
</script>

<template>
  <div class="w-full px-8 min-h-screen flex flex-col" style="background-color: var(--layout-bg);">

    <header class="mb-8">
      <EncabezadoPantalla
        titulo="Configuración de Notificaciones"
        descripcion="Gestione sus preferencias de alertas y reportes de rendimiento."
      />
    </header>

    <div class="max-w-5xl w-full flex-grow">

      <section class="mb-8">
        <h2 class="text-sm font-bold mb-4 flex items-center gap-2" style="color: var(--tabla-header-text);">
          <i class="fi fi-sr-link-alt text-base"></i>
          Canales de Notificación
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            v-for="canal in canales"
            :key="canal.nombre"
            @click="canal.activo = !canal.activo"
            class="p-4 rounded-xl cursor-pointer transition-all duration-300"
            :style="canal.activo
              ? 'background: var(--sidebar-active-bg); color: var(--sidebar-active-text); border: 1px solid var(--sidebar-active-bg);'
              : 'background: var(--card-bg); color: var(--text-general); border: 1px solid var(--tabla-borde);'"
          >
            <div class="flex justify-between items-start mb-2">
              <p class="font-bold text-sm">{{ canal.nombre }}</p>
              <div class="w-10 h-5 rounded-full relative transition-colors"
                :style="canal.activo ? 'background: rgba(255,255,255,0.3)' : 'background: var(--tabla-borde)'">
                <div class="absolute top-1 w-3 h-3 rounded-full transition-all"
                  :style="canal.activo ? 'right: 4px; background: white;' : 'left: 4px; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.2);'">
                </div>
              </div>
            </div>
            <p class="text-[11px] leading-tight"
              :style="canal.activo ? 'opacity: 0.8;' : 'color: var(--subtext-general);'">
              {{ canal.descripcion }}
            </p>
          </div>
        </div>
      </section>

      <plantillatabla titulo="Alertas de KPI" :encabezados="encabezados" :datos="kpis">
        <template #default="{ fila }">
          <td class="p-4 font-semibold text-sm" style="color: var(--text-general);">{{ fila.nombre }}</td>
          <td class="p-4 text-center"><input type="checkbox" v-model="fila.critico"      class="accent-[#3f2a52] w-4 h-4 cursor-pointer" /></td>
          <td class="p-4 text-center"><input type="checkbox" v-model="fila.advertencia"  class="accent-[#3f2a52] w-4 h-4 cursor-pointer" /></td>
          <td class="p-4 text-center"><input type="checkbox" v-model="fila.informativo"  class="accent-[#3f2a52] w-4 h-4 cursor-pointer" /></td>
        </template>
      </plantillatabla>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        <section class="mb-8">
          <h2 class="text-sm font-bold mb-4 flex items-center gap-2" style="color: var(--tabla-header-text);">
            <i class="fi fi-sr-document"></i>
            Frecuencia de Resúmenes
          </h2>
          <div class="flex flex-col gap-2">
            <button
              v-for="opc in ['Diario', 'Semanal', 'Mensual']"
              :key="opc"
              @click="frecuenciaSeleccionada = opc"
              class="w-full p-3 text-left text-sm rounded-lg transition-all"
              :style="frecuenciaSeleccionada === opc
                ? 'border: 1px solid var(--sidebar-active-bg); background: rgba(63,42,82,0.1); color: var(--text-general); font-weight: 700;'
                : 'border: 1px solid var(--tabla-borde); background: transparent; color: var(--text-general);'"
            >{{ opc }}</button>
          </div>
        </section>

        <section class="p-5 rounded-xl" style="background: var(--grafics-bg);">
          <h2 class="text-sm font-bold mb-4 flex items-center gap-2" style="color: var(--sidebar-text);">
            <i class="fi fi-sr-circle-xmark"></i>
            Silenciar Notificaciones
          </h2>
          <div class="flex gap-4 mb-3">
            <div class="flex-1">
              <label class="text-[10px] uppercase" style="color: var(--card-text-hint);">Inicio</label>
              <input type="time" v-model="horarioSilencio.inicio"
                class="w-full p-2 mt-1 rounded-lg text-sm outline-none transition-all"
                style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: var(--sidebar-text);" />
            </div>
            <div class="flex-1">
              <label class="text-[10px] uppercase" style="color: var(--card-text-hint);">Fin</label>
              <input type="time" v-model="horarioSilencio.fin"
                class="w-full p-2 mt-1 rounded-lg text-sm outline-none transition-all"
                style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: var(--sidebar-text);" />
            </div>
          </div>
          <p class="text-[10px]" style="color: var(--card-text-hint);">Solo alertas críticas durante este periodo.</p>
          <div class="flex justify-end gap-3 mt-6">
            <button
              class="px-5 py-2.5 text-xs font-bold rounded-xl transition-colors"
              style="background: rgba(255,255,255,0.1); color: var(--sidebar-text); border: 1px solid rgba(255,255,255,0.2);"
              @mouseover="$event.currentTarget.style.background='rgba(255,255,255,0.2)'"
              @mouseleave="$event.currentTarget.style.background='rgba(255,255,255,0.1)'"
            >Cancelar</button>
            <button @click="guardarcambios"
              class="px-6 py-2.5 text-xs font-bold rounded-xl transition-all"
              style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text);"
              @mouseover="$event.currentTarget.style.opacity='0.85'"
              @mouseleave="$event.currentTarget.style.opacity='1'"
            >Guardar</button>
          </div>
        </section>

      </div>
    </div>

    <div class="max-w-5xl w-full flex justify-end gap-3 pt-6 mt-8">
      <button
        class="px-5 py-2 text-sm font-bold rounded-lg transition-colors"
        style="background: var(--card-bg); border: 1px solid var(--tabla-borde); color: var(--text-general);"
        @click="descartarCambios"
        @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
        @mouseleave="$event.currentTarget.style.background='var(--card-bg)'"
      >Descartar</button>
      <button @click="guardarNotificacion"
        class="px-5 py-2 text-sm font-bold rounded-lg transition-all"
        style="background: var(--sidebar-active-bg); color: var(--sidebar-active-text);"
        @mouseover="$event.currentTarget.style.opacity='0.85'"
        @mouseleave="$event.currentTarget.style.opacity='1'"
      >Guardar Cambios</button>
    </div>

  </div>
</template>
