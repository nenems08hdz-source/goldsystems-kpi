<script setup>
import { ref } from 'vue'

import plantillatabla from '../components/plantillatabla.vue'

const mostrarPanelKpis = ref(false)
const usuarioSeleccionado = ref(null)

const kpisSimulados = ref([
  { nombre: 'Eficiencia de Entrega (OTIF)', meta: '> 95%' },
  { nombre: 'Costo por Kilómetro Recorrido', meta: '< $12.50' },
  { nombre: 'Rotación de Inventario en Almacén', meta: '12 Veces/Año' }
])

const abrirPanelKpis = (usuario) => {
  usuarioSeleccionado.value = usuario
  mostrarPanelKpis.value = true
}

const abrirModificarRol = (usuario) => {
  alert(`Abrir modal para modificar el rol de: ${usuario.nombre}`)
}

const eliminarUsuarioVisual = (usuario) => {
  alert(`¿Seguro que deseas eliminar a: ${usuario.nombre}?`)
}

const departamentos = ref([
  { id: 1, nombre: 'Corporativo KPI360', abierto: true, nivel: 0 },
  { id: 2, nombre: 'Finanzas', abierto: true, nivel: 1 },
  { id: 3, nombre: 'Tesorería', abierto: false, nivel: 2 },
  { id: 4, nombre: 'Operaciones', abierto: true, nivel: 1, badge: 15 },
  { id: 5, nombre: 'Logística Global', seleccionado: true, nivel: 2 },
  { id: 6, nombre: 'Control de Calidad', abierto: false, nivel: 2 },
  { id: 7, nombre: 'Recursos Humanos', abierto: false, nivel: 1 },
])


const encabezadosTabla = ['Usuario', 'Rol', 'KPI Propios', 'Estado']


const usuarios = ref([
  { id: 1, nombre: 'Ana López', correo: 'ana.lopez@kpi360.com', rol: 'EMPLEADO', kpis: 12, estado: 'Activo', colorRol: 'bg-[#3f2a52]/10 text-[#3f2a52]' },
  { id: 2, nombre: 'Carlos Ruiz', correo: 'carlos.ruiz@kpi360.com', rol: 'LÍDER', kpis: 8, estado: 'Activo', colorRol: 'bg-emerald-100 text-emerald-700' },
  { id: 3, nombre: 'Sofía Martínez', correo: 'sofia.m@kpi360.com', rol: 'EMPLEADO', kpis: 5, estado: 'Ausente', colorRol: 'bg-blue-100 text-blue-700' },
  { id: 4, nombre: 'Jorge Rivas', correo: 'jorge.rivas@kpi360.com', rol: 'EMPLEADO', kpis: 0, estado: 'Bloqueado', colorRol: 'bg-gray-100 text-gray-500' },
  { id: 5, nombre: 'Pablo Chable', correo: 'pablo.chable@kpi360.com', rol: 'EMPLEADO', kpis: 12, estado: 'Activo', colorRol: 'bg-[#3f2a52]/10 text-[#3f2a52]' },
  { id: 6, nombre: 'Arantxa Sanchez', correo: 'arantxa.sanchez@kpi360.com', rol: 'GERENTE', kpis: 8, estado: 'Activo', colorRol: 'bg-emerald-100 text-emerald-700' },
  { id: 7, nombre: 'Christo Ajelo', correo: 'crhisto.a@kpi360.com', rol: 'EMPLEADO', kpis: 5, estado: 'Ausente', colorRol: 'bg-blue-100 text-blue-700' },
  { id: 8, nombre: 'Jorge Hernández', correo: 'jorge.hernandez@kpi360.com', rol: 'AUDITOR', kpis: 0, estado: 'Activo', colorRol: 'bg-gray-100 text-gray-500' }
])
</script>

<template>
  <div class="p-3 min-h-screen">
    
    <div class="mb-6">
      <h1 class="text-4xl font-bold text-[#3f2a52] tracking-tight">
        Control Organizacional
      </h1>
      <p class="text-xs text-gray-500 mt-1">
        Estructura jerárquica de la planta, control de acceso por roles y asignación de usuarios del sistema.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white rounded-xl shadow-md border border-[#beaed8]/90 mt-8">
      
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Filtrar por Rol</label>
        <select class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 cursor-pointer transition-colors">
          <option value="">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="lider">Líder de Planta</option>
          <option value="auditor">Auditor</option>
        </select>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estado de Cuenta</label>
        <select class="bg-white text-gray-700 text-xs rounded-lg border border-[#beaed8]/80 p-2.5 outline-none focus:border-[#77a9d4] focus:ring-2 focus:ring-[#77a9d4]/30 cursor-pointer transition-colors">
          <option value="">Cualquier estado</option>
          <option value="activo">Activo</option>
          <option value="ausente">Ausente</option>
          <option value="bloqueado">Bloqueado</option>
        </select>
      </div>

      <div class="hidden lg:block"></div>

      <div class="flex items-end justify-end">
        <button 
          @click="$router.push('/organizacion/nuevo')"
          class="bg-[#3f2a52] hover:bg-[#77a9d4] text-white font-bold text-xs p-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 h-[38px] w-full sm:w-auto shadow-sm"
        >
          + Asignar Rol Colaborador
        </button>
      </div>

    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
      
      <div class="lg:col-span-4 bg-white rounded-xl shadow-md border border-[#beaed8]/90 mt-6 overflow-hidden flex flex-col h-fit">
        
        <div class="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-[#beaed8]/30 flex justify-between items-center">
          <div class="text-left">
            <h2 class="text-base font-bold text-[#3f2a52] tracking-tight">Estructura de la Planta</h2>
            <p class="text-[10px] text-gray-400 mt-0.5">Navega por las áreas y sucursales</p>
          </div>
          <span class="text-xs bg-[#3f2a52]/5 text-[#3f2a52] p-1.5 rounded-lg font-bold"></span>
        </div>
        
        <div class="p-4 flex flex-col gap-1 max-h-[400px] overflow-y-auto text-left">
          <div 
            v-for="dept in departamentos" 
            :key="dept.id"
            :style="{ paddingLeft: (dept.nivel * 18) + 'px' }"
            class="group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-300 relative"
            :class="dept.seleccionado 
              ? 'bg-[#3f2a52]/5 text-[#3f2a52] font-bold ring-1 ring-[#3f2a52]/20' 
              : 'hover:bg-gray-50 text-gray-600'"
          >
            <div v-if="dept.seleccionado" class="absolute left-0 top-2 bottom-2 w-1 bg-[#3f2a52] rounded-r-md"></div>

            <div class="flex items-center gap-2.5 text-xs tracking-wide">
              <span v-if="dept.nivel === 0" class="text-sm"><i class="fi fi-sr-globe"></i></span>
              <span v-else-if="dept.nivel === 1" class="text-[#77a9d4] text-xs"><i class="fi fi-sr-bullet"></i></span>
              <span v-else class="text-gray-300 text-[10px]">└─</span>
              
              <span :class="{ 'text-[#3f2a52] font-semibold': dept.nivel === 0 }">
                {{ dept.nombre }}
              </span>
            </div>

            <span v-if="dept.badge" class="bg-[#77a9d4]/10 text-[#77a9d4] text-[9px] px-2 py-0.5 rounded-md font-black tracking-wider">
              {{ dept.badge }} KPIs
            </span>
          </div>
        </div>

        <div class="p-3.5 border-t border-[#beaed8]/20 bg-gray-50/50 flex gap-2">
          <button class="flex-1 bg-white hover:bg-gray-50 text-[#3f2a52] border border-[#beaed8]/80 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm">
            <span class="text-xs text-[#77a9d4]">+</span> Añadir Área
          </button>
          <button class="bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 border border-gray-200 text-[10px] font-bold uppercase tracking-wider p-2 rounded-lg flex items-center justify-center transition-all shadow-sm" title="Añadir Raíz">
            +
          </button>
        </div>

      </div>

      <div class="lg:col-span-8">
        
        <plantillatabla 
          titulo="Usuarios: Logística Global"
          :encabezados="encabezadosTabla"
          :datos="usuarios"
          :mostrarAcciones="true"
        >
          <template #default="{ fila }">
            
            <td class="p-4 align-middle text-left">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-[#3f2a52] text-white flex items-center justify-center text-[10px] font-bold shadow-sm flex-shrink-0">
                  {{ fila.nombre.substring(0, 2).toUpperCase() }}
                </div>
                <div>
                  <div class="font-bold text-gray-800 text-xs leading-none">{{ fila.nombre }}</div>
                  <div class="text-[11px] text-gray-400 mt-1">Contacto: {{ fila.correo }}</div>
                </div>
              </div>
            </td>
            
            <td class="p-4 align-middle text-left">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200 uppercase tracking-wide" :class="fila.colorRol">
                {{ fila.rol }}
              </span>
            </td>

            <td class="p-4 align-middle text-left font-semibold text-gray-800 text-sm">
              <div class="flex items-center gap-1.5">
                <span>{{ fila.kpis }}</span>
                <span class="text-gray-400 text-xs">📋</span>
              </div>
            </td>

            <td class="p-4 align-middle text-left">
              <div class="flex items-center">
                <span class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1.5"
                      :class="{
                        'bg-emerald-50 text-emerald-700 border border-emerald-200': fila.estado === 'Activo',
                        'bg-yellow-50 text-yellow-700 border border-yellow-200': fila.estado === 'Ausente',
                        'bg-red-50 text-red-700 border border-red-200': fila.estado === 'Bloqueado'
                      }">
                  <span class="w-1.5 h-1.5 rounded-full animate-pulse" 
                        :class="{
                          'bg-emerald-500': fila.estado === 'Activo',
                          'bg-yellow-500': fila.estado === 'Ausente',
                          'bg-red-500': fila.estado === 'Bloqueado'
                        }"></span>
                  {{ fila.estado }}
                </span>
              </div>
            </td>

          </template>

          <template #iconos-acciones="{ item }">
            <button 
              @click="abrirModificarRol(item)" 
              title="Modificar Rol"
              class="text-gray-400 hover:text-[#3f2a52] bg-gray-50 hover:bg-[#3f2a52]/5 p-2 rounded-lg transition-all duration-200 text-sm"
            >
              <i class="fi fi-sr-pencil"></i>
            </button>
            
            <button 
              @click="abrirPanelKpis(item)" 
              title="Ver KPIs Asignados"
              class="text-gray-400 hover:text-[#77a9d4] bg-gray-50 hover:bg-[#77a9d4]/10 p-2 rounded-lg transition-all duration-200 text-sm"
            >
              <i class="fi fi-sr-stats"></i>
            </button>
            
            <button 
              @click="eliminarUsuarioVisual(item)" 
              title="Eliminar Colaborador"
              class="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 text-sm"
            >
              <i class="fi fi-sr-trash"></i>
            </button>
          </template>
        </plantillatabla>

      </div>

    </div>

    <div v-if="mostrarPanelKpis" class="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40 flex justify-end" @click="mostrarPanelKpis = false">
      <div class="bg-white w-full max-w-md h-full shadow-2xl border-l border-[#beaed8]/50 flex flex-col justify-between p-6 animate-slideLeft" @click.stop>
        
        <div>
          <div class="flex justify-between items-start border-b border-gray-100 pb-4 mb-6">
            <div class="text-left">
              <span class="text-[10px] font-black uppercase tracking-wider text-[#77a9d4]">Panel de Control</span>
              <h3 class="text-lg font-bold text-[#3f2a52] leading-tight">KPIs de {{ usuarioSeleccionado?.nombre }}</h3>
              <p class="text-xs text-gray-400 mt-0.5">{{ usuarioSeleccionado?.correo }}</p>
            </div>
            <button @click="mostrarPanelKpis = false" class="text-gray-400 hover:text-gray-600 bg-gray-100 p-1 px-2.5 rounded-lg text-sm font-bold">✕</button>
          </div>

          <div class="flex flex-col gap-3">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block text-left mb-1">Métricas en Seguimiento ({{ kpisSimulados.length }})</label>
            
            <div 
              v-for="(kpi, index) in kpisSimulados" 
              :key="index"
              class="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-2.5 text-left">
                <span class="text-base">📈</span>
                <div>
                  <div class="text-xs font-bold text-gray-700">{{ kpi.nombre }}</div>
                  <div class="text-[10px] text-gray-400">Meta: {{ kpi.meta }}</div>
                </div>
              </div>
              <button @click="kpisSimulados.splice(index, 1)" class="text-gray-400 hover:text-red-500 text-xs p-1 font-bold">
                ✕
              </button>
            </div>

            <div v-if="kpisSimulados.length === 0" class="text-center py-8 text-gray-400 text-xs border border-dashed border-gray-200 rounded-xl">
              Este usuario no tiene ningún KPI asignado todavía.
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4 bg-white">
          <p class="text-[10px] text-gray-400 text-center mb-3">La asignación oficial de nuevas métricas se realiza desde el módulo de KPIs.</p>
          <button 
            @click="$router.push('/kpis'); mostrarPanelKpis = false"
            class="w-full bg-[#3f2a52] hover:bg-[#77a9d4] text-white font-bold text-xs py-3 rounded-lg transition-all shadow-sm uppercase tracking-wider"
          >
            Ir a Gestión de KPIs
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes slideLeft {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slideLeft {
  animation: slideLeft 0.3s ease-out forwards;
}
</style>