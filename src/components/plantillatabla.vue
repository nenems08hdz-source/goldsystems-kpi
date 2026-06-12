<script setup>
defineProps({
  titulo: String,
  icon: String,
  encabezados: Array,
  datos: Array,
  mostrarAcciones: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="rounded-xl shadow-md mt-6 overflow-hidden"
    style="background: var(--tabla-bg); border: 1px solid var(--tabla-borde);">

    <div class="p-4 border-b"
      style="background: var(--tabla-header-bg); border-color: var(--tabla-borde);">
      <h2 class="text-xl font-bold tracking-tight" style="color: var(--text-general);">
        <i v-if="icon" :class="`fi ${icon}`"></i>
        {{ titulo }}
      </h2>
    </div>

    <div class="overflow-x-auto max-h-[450px] overflow-y-auto">
      <table class="w-full text-left border-collapse table-auto">
        <thead style="background: var(--tabla-header-bg); border-bottom: 1px solid var(--tabla-borde);">
          <tr class="sticky top-0 z-10" style="background: var(--tabla-header-bg);">
            <th v-for="header in encabezados" :key="header"
              class="p-4 text-[11px] font-bold uppercase tracking-wider"
              style="color: var(--tabla-header-text);">
              {{ header }}
            </th>
            <th v-if="mostrarAcciones"
              class="p-4 text-xs font-bold uppercase tracking-wider text-right pr-6 w-24"
              style="color: var(--tabla-header-text);">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in datos" :key="index"
            class="transition-colors duration-200"
            style="border-bottom: 1px solid var(--tabla-borde);"
            @mouseover="$event.currentTarget.style.background = 'var(--tabla-hover)'"
            @mouseleave="$event.currentTarget.style.background = 'transparent'">
            <slot :fila="item"></slot>
            <td v-if="mostrarAcciones" class="p-4 text-right align-middle pr-6 w-24">
              <div class="flex items-center justify-end gap-2">
                <slot name="iconos-acciones" :item="item">
                  <button class="font-bold px-1" style="color: var(--card-text-muted);">⋮</button>
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>