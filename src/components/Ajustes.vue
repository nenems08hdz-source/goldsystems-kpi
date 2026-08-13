<script setup>
import { ref } from 'vue'
import AjustesPerfil           from '../pantallas/AjustesPerfil.vue'
import ConfiguracionNotificacion from '../pantallas/ConfiguracionNotificacion.vue'
import ConfiguracionSeguridad  from '../pantallas/ConfiguracionSeguridad.vue'
import EncabezadoPantalla      from '../components/EncabezadoPantalla.vue'

const categoriaActiva = ref('perfil')

const categorias = [
  { id: 'perfil',         nombre: 'Perfil',         icono: 'fi-sr-user-pen'                         },
  { id: 'seguridad',      nombre: 'Seguridad',       icono: 'fi-sr-shield-check'                     },
  //{ id: 'notificaciones', nombre: 'Notificaciones',  icono: 'fi-sr-bell-notification-social-media'   },
]
</script>

<template>
  <div class="p-6 min-h-screen w-full flex flex-col gap-6" style="background-color: var(--layout-bg); transition: background-color 300ms ease;">
    <div class="grid gap-2 grid-cols-1 lg:grid-cols-4">

      <div class="lg:col-span-1 w-full">
        <EncabezadoPantalla
          titulo="Ajustes"
          descripcion="Gestione las preferencias y la configuración general de su cuenta."
        />

        <div class="flex flex-col gap-1 w-full text-left p-1 mt-4">
          <span class="text-[10px] font-black uppercase tracking-widest px-3 mb-2 block"
            style="color: var(--subtext-general);">
            Categorías
          </span>
          <button
            v-for="cat in categorias"
            :key="cat.id"
            @click="categoriaActiva = cat.id"
            type="button"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 w-full text-left"
            :style="categoriaActiva === cat.id
              ? 'background: var(--sidebar-active-bg); color: var(--sidebar-active-text);'
              : 'background: var(--sidebar-bg); color: var(--sidebar-text);'"
            @mouseover="categoriaActiva !== cat.id && ($event.currentTarget.style.opacity='0.85')"
            @mouseleave="categoriaActiva !== cat.id && ($event.currentTarget.style.opacity='1')"
          >
            <i :class="['fi', cat.icono, 'w-5 text-center flex items-center justify-center']"></i>
            {{ cat.nombre }}
          </button>
        </div>
      </div>

      <div class="lg:col-span-3 w-full items-start mt-2">
        <div class="w-full">
          <div v-if="categoriaActiva === 'perfil'"         class="animate-fade-in w-full"><AjustesPerfil /></div>
          <!--<div v-if="categoriaActiva === 'notificaciones'" class="animate-fade-in w-full"><ConfiguracionNotificacion /></div>-->
          <div v-if="categoriaActiva === 'seguridad'"      class="animate-fade-in w-full"><ConfiguracionSeguridad /></div>   
           </div>
      </div>

    </div>
  </div>
</template>
