<script setup>
import { ref } from 'vue'
import plantillatabla from '../components/plantillatabla.vue'
import tarjetasresumen from '../components/TarjetasResumen.vue'

const misEventos = ref([
  {
    id: 1,
    usuario: "Alejandro Ruiz",
    correo: "a.ruiz@kpi360.com",
    accion: "Modificar Umbral KPI",
    modulo: "FINANZAS",
    detalle: "Cambio de 12.5% a 15.0% en margen o...",
    fecha: "24 May 2026, 14:32:10",
    estado: "Exitosa"
  },
  {
    id: 2,
    usuario: "Maria Castro",
    correo: "m.castro@kpi360.com",
    accion: "Acceso al Sistema",
    modulo: "SEGURIDAD",
    detalle: "Inicio de sesión desde entorno web institucional",
    fecha: "24 May 2026, 14:15:04",
    estado: "Exitosa"
  },
  {
    id: 3,
    usuario: "Santi Moreno",
    correo: "s.moreno@kpi360.com",
    accion: "Exportación Masiva",
    modulo: "INFORMES",
    detalle: "Descarga de 5,000 registros de ventas trimestrales",
    fecha: "24 May 2026, 13:58:22",
    estado: "Revisión"
  },
  {
    id: 4,
    usuario: "Jordi Valls",
    correo: "j.valls@kpi360.com",
    accion: "Crear Nuevo Usuario",
    modulo: "GESTIÓN",
    detalle: "Asignación de rol 'Analista Junior' a cuenta nueva",
    fecha: "24 May 2026, 13:22:45",
    estado: "Exitosa"
  },
])
</script>

<template>
  <div class="p-3 min-h-screen">
    
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-4xl font-bold text-[#3f2a52] tracking-tight">Centro de Auditoría</h1>
        <p class="text-xs text-gray-500 mt-1">Supervisión en tiempo real de la integridad del sistema y actividad del usuario.</p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2">
          <i class="fi fi-sr-file-pdf"></i> Exportar PDF
        </button>
        <button class="px-4 py-2 bg-[#3f2a52] text-white rounded-lg text-xs font-semibold hover:bg-[#15803d] shadow-sm transition-colors flex items-center gap-2">
          <i class="fi fi-sr-file-excel"></i> Exportar Excel
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      
      <tarjetasresumen 
        titulo="Eventos Totales (24h)"
        valor="1,284"
        subtexto="Flujo de datos normal"
        icono="fi fi-sr-bolt"
        colorBarra="border-l-[#3f2a52]"
        badgeTexto="+12%"
        badgeColorClass="bg-emerald-50 text-emerald-600"
      />

      <tarjetasresumen 
        titulo="Alertas Críticas"
        valor="0"
        subtexto="Sin amenazas activas"
        icono="fi fi-sr-exclamation"
        colorBarra="border-l-red-500"
        badgeTexto="Estable"
        badgeColorClass="bg-gray-100 text-gray-500"
      />

      <tarjetasresumen 
        titulo="Usuarios Activos"
        valor="42"
        subtexto="Conexiones simultáneas"
        icono="fi fi-sr-user"
        colorBarra="border-l-amber-500"
        badgeTexto="Sesiones"
        badgeColorClass="bg-amber-50 text-amber-700"
      />

      <tarjetasresumen 
        titulo="Estado del Sistema"
        valor="Estable"
        subtexto="Infraestructura íntegra"
        icono="fi fi-sr-shield-check"
        colorBarra="border-l-[#16a34a]"
      />

    </div>

   <plantillatabla 
  titulo="Registro Histórico"
  :encabezados="['Usuario', 'Acción', 'Fecha / Hora', 'Departamento', 'Detalle', 'Estado', 'Acciones']"
  :datos="misEventos"
>
  <template #default="{ fila }">
    
    <td class="p-4 align-middle md:w-3/12 min-w-[200px]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-[#3f2a52] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs uppercase">
          {{ fila.usuario.charAt(0) }}
        </div>
        <div>
          <div class="font-bold text-gray-800 text-xs">{{ fila.usuario }}</div>
          <div class="text-[11px] text-gray-400">{{ fila.correo }}</div>
        </div>
      </div>
    </td>
    
    <td class="p-4 align-middle text-gray-800 text-xs font-medium md:w-2/12 min-w-[130px]">
      {{ fila.accion }}
    </td>
    
    <td class="p-4 align-middle text-gray-500 text-xs whitespace-nowrap md:w-1/12 min-w-[110px]">
      {{ fila.fecha }}
    </td>

    <td class="p-4 align-middle md:w-1/12 min-w-[120px]">
      <span class="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 uppercase tracking-wide inline-block">
        {{ fila.modulo }}
      </span>
    </td>
    
    <td class="p-4 align-middle text-gray-500 text-xs max-w-xs truncate md:w-2/12 min-w-[150px]">
      {{ fila.detalle }}
    </td>
    
    <td class="p-4 align-middle md:w-2/12 min-w-[110px]">
      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1 w-fit"
            :class="{
              'bg-emerald-50 text-emerald-700 border border-emerald-200': fila.estado === 'Exitosa',
              'bg-amber-50 text-amber-700 border border-amber-200': fila.estado === 'Revisión'
            }">
        <span class="w-1.5 h-1.5 rounded-full" 
              :class="{
                'bg-emerald-500': fila.estado === 'Exitosa',
                'bg-amber-500': fila.estado === 'Revisión'
              }"></span>
        {{ fila.estado }}
      </span>
    </td>
    
    <td class="p-4 align-middle text-center md:w-1/12 min-w-[70px]">
      <button class="text-gray-400 hover:text-[#3f2a52] font-bold px-2 text-base transition-colors">⋮</button>
    </td>
  </template>
</plantillatabla>

    <div class="flex items-center gap-4 w-full mb-4 my-4 ">
      <h2 class="text-xl font-bold text-[#3f2a52] tracking-tight whitespace-nowrap">
        Resumen de Cambios Operativos
      </h2>
      <div class="h-[1.5px] bg-[#3f2a52] flex-grow mt-1"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 border border-[#beaed8] bg-white rounded-xl mt-5 divide-y md:divide-y-0 md:divide-x divide-[#beaed8]/20 overflow-hidden shadow-lg">
      
      <div class="p-4 flex justify-between items-end h-20 bg-transparent">
        <div class="flex flex-col justify-between h-full text-left">
          <span class="font-bold text-gray-400 uppercase text-[10px] tracking-wider">Metas Editadas</span>
          <span class="text-2xl font-bold text-black leading-none">24</span>
        </div>
        <div class="flex items-end gap-1 pb-1">
          <div class="w-1 h-3 bg-gray-600 rounded-sm"></div>
          <div class="w-1 h-5 bg-gray-500 rounded-sm"></div>
          <div class="w-1 h-7 bg-blue-400/70 rounded-sm"></div>
          <div class="w-1 h-9 bg-[#77a9d4] rounded-sm"></div>
        </div>
      </div>

      <div class="p-4 flex justify-between items-end h-20 bg-transparent">
        <div class="flex flex-col justify-between h-full text-left">
          <span class="font-bold text-gray-400 uppercase text-[10px] tracking-wider">Cambios de Datos</span>
          <span class="text-2xl font-bold text-black leading-none">112</span>
        </div>
        <div class="flex items-end gap-1 pb-1">
          <div class="w-1 h-6 bg-gray-600 rounded-sm"></div>
          <div class="w-1 h-4 bg-gray-500 rounded-sm"></div>
          <div class="w-1 h-8 bg-blue-400/70 rounded-sm"></div>
          <div class="w-1 h-5 bg-[#77a9d4] rounded-sm"></div>
        </div>
      </div>

      <div class="p-4 flex justify-between items-end h-20 bg-transparent">
        <div class="flex flex-col justify-between h-full text-left">
          <span class="font-bold text-gray-400 uppercase text-[10px] tracking-wider">Cancelaciones</span>
          <span class="text-2xl font-bold text-black leading-none">3</span>
        </div>
        <div class="flex items-end gap-1 pb-1">
          <div class="w-1 h-2 bg-gray-600 rounded-sm"></div>
          <div class="w-1 h-3 bg-gray-500 rounded-sm"></div>
          <div class="w-1 h-1 bg-gray-500 rounded-sm"></div>
          <div class="w-1 h-4 bg-red-400/60 rounded-sm"></div>
        </div>
      </div>

    </div>
  </div>
</template>