<script setup>
import { ref, onMounted } from 'vue'
import api               from '../services/api'
import { usePermissions } from '../composables/usePermissions'
import plantillatabla     from '../components/PlantillaTabla.vue'
import tarjetasresumen    from '../components/TarjetasResumen.vue'
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import EtiquetaBadge      from '../components/ui/EtiquetaBadge.vue'
import StatusBadge        from '../components/StatusBadge.vue'
import AppButton          from '../components/ui/AppButton.vue'
import BotonAccion        from '../components/ui/BotonAccion.vue'
import { useLoading } from '@/composables/useLoading' // ← EDICIÓN: Composable de loading
import LoadingSpinner from '../components/LoadingSpinner.vue' // ← EDICIÓN: Componente personalizado

const { can } = usePermissions()
const { isLoading, cargarConDelay } = useLoading() // ← EDICIÓN: Usar loading
const misEventos = ref([])
// ← EDICIÓN: Variables reactivas para tarjetas
const totalEventos = ref(0)
const editados = ref(0)
const creados = ref(0)
const eliminados = ref(0)

// ← EDICIÓN: Mostrar solo el "value" (dato principal editado)
function obtenerValorAnterior(oldData, newData) {
  if (!oldData || !newData) return '—'
  if (JSON.stringify(oldData.value) !== JSON.stringify(newData.value)) {
    return String(oldData.value)
  }
  return '—'
}

function obtenerValorNuevo(oldData, newData) {
  if (!oldData || !newData) return '—'
  if (JSON.stringify(oldData.value) !== JSON.stringify(newData.value)) {
    return String(newData.value)
  }
  return '—'
}

onMounted(async () => {
  // ← EDICIÓN: Usar cargarConDelay para mostrar loading
  const res = await cargarConDelay(() => api.get('/audit-logs'))
  const data = res.data
  const raw  = Array.isArray(data) ? data : (data.data ?? [])

  // Transformar campos de la API al formato que espera el template
  misEventos.value = raw.map(log => ({
    id:      log.id,
    usuario: log.user ? `${log.user.name} ${log.user.paternal ?? ''}`.trim() : `Usuario #${log.user_id}`,
    correo:  log.user?.email ?? '—',
    accion:  log.action,
    modulo:  log.module,
    detalle: log.entity_type ? `${log.entity_type} #${log.entity_id}` : '—',
    // ← EDICIÓN: Formato dd/mm/aa hh:mm am/pm (zona horaria México)
    fecha:   log.created_at ? (() => {
      const d = new Date(log.created_at)
      const opciones = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Mexico_City'
      }
      return new Intl.DateTimeFormat('es-MX', opciones).format(d)
    })() : '—',
    estado:  'Exitosa',
    empresa: log.company?.name ?? '—',
    tipo_cambio: log.action ?? '—',
    // ← EDICIÓN: Mostrar solo el "value" si es Editar
    valor_anterior: log.action === 'Editar' ? obtenerValorAnterior(log.old_data, log.new_data) : '—',
    valor_nuevo: log.action === 'Editar' ? obtenerValorNuevo(log.old_data, log.new_data) : '—',
  }))

  // ← EDICIÓN: Calcular estadísticas dinámicamente
  totalEventos.value = raw.length
  editados.value = raw.filter(log => log.action === 'Editar').length
  creados.value = raw.filter(log => log.action === 'Crear').length
  eliminados.value = raw.filter(log => log.action === 'Eliminar').length
})

</script>

<template>
  <!-- ← EDICIÓN: Componente personalizado -->
  <LoadingSpinner :isActive="isLoading" text="Cargando auditoría..." />

  <div class="p-3 min-h-screen" style="background: transparent;">

    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
      <EncabezadoPantalla
        titulo="Centro de Auditoría"
        descripcion="Supervisión en tiempo real de la integridad del sistema y actividad del usuario."
      />
      <div v-if="can('audit.export')" class="flex gap-3 flex-shrink-0">
        <AppButton variant="primary" class="flex items-center gap-2">
          <i class="fi fi-sr-file-pdf"></i> Exportar PDF
        </AppButton>
        <AppButton variant="primary" class="flex items-center gap-2">
          <i class="fi fi-sr-file-excel"></i> Exportar Excel
        </AppButton>
      </div>
    </div>

    <!-- ← EDICIÓN: Tarjetas dinámicas conectadas a misEventos -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <tarjetasresumen
        :titulo="`Eventos Totales`" :valor="`${totalEventos}`" subtexto="Registros de auditoría"
        icono="fi fi-sr-bolt" colorBarra="border-l-[#3f2a52]"
        :badgeTexto="`${creados} creados`" badgeColorClass="bg-emerald-50 text-emerald-600"
      />
      <tarjetasresumen
        :titulo="`Registros Editados`" :valor="`${editados}`" subtexto="Cambios de datos"
        icono="fi fi-sr-pencil" colorBarra="border-l-blue-500"
        badgeTexto="Cambios" badgeColorClass="bg-blue-50 text-blue-600"
      />
      <tarjetasresumen
        :titulo="`Registros Eliminados`" :valor="`${eliminados}`" subtexto="Borrados del sistema"
        icono="fi fi-sr-trash" colorBarra="border-l-red-500"
        badgeTexto="Eliminados" badgeColorClass="bg-red-50 text-red-600"
      />
      <tarjetasresumen
        titulo="Estado del Sistema" valor="Estable" subtexto="Integridad completa"
        icono="fi fi-sr-shield-check" colorBarra="border-l-[#16a34a]"
        badgeTexto="OK" badgeColorClass="bg-emerald-50 text-emerald-600"
      />
    </div>

    <plantillatabla
      titulo="Registro Histórico"
      :encabezados="['Usuario', 'Acción', 'Fecha / Hora', 'Empresa', 'Tipo de Cambio', 'Valor Anterior', 'Valor Nuevo']"
      :datos="misEventos"
    >
      <template #default="{ fila }">

        <!-- Usuario -->
        <td class="p-4 text-left">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-[#3f2a52] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs uppercase">
              {{ fila.usuario.charAt(0) }}
            </div>
            <div>
              <div class="font-bold text-xs" style="color: var(--text-general);">{{ fila.usuario }}</div>
              <div class="text-[11px]" style="color: var(--subtext-general);">{{ fila.correo }}</div>
            </div>
          </div>
        </td>

        <!-- Acción -->
        <td class="p-4 align-middle text-xs font-medium md:w-2/12 min-w-[130px]"
          style="color: var(--text-general);">
          {{ fila.accion }}
        </td>

        <!-- Fecha/Hora -->
        <td class="p-4 align-middle text-xs whitespace-nowrap md:w-1/12 min-w-[110px]"
          style="color: var(--subtext-general);">
          {{ fila.fecha }}
        </td>

        <!-- Empresa -->
        <td class="p-4 align-middle text-center md:w-1/12 min-w-[120px]">
          <EtiquetaBadge :texto="fila.empresa" />
        </td>

        <!-- Tipo de Cambio -->
        <td class="p-4 align-middle text-xs max-w-xs truncate md:w-2/12 min-w-[150px]"
          style="color: var(--subtext-general);">
          {{ fila.tipo_cambio }}
        </td>

        <!-- Valor Anterior -->
        <td class="p-4 align-middle text-xs max-w-xs truncate md:w-2/12 min-w-[150px]"
          style="color: var(--subtext-general);">
          {{ fila.valor_anterior }}
        </td>

        <!-- Valor Nuevo -->
        <td class="p-4 align-middle text-xs max-w-xs truncate md:w-2/12 min-w-[150px]"
          style="color: var(--subtext-general);">
          {{ fila.valor_nuevo }}
        </td>

      </template>
    </plantillatabla>

    <!-- ← EDICIÓN: Resumen de cambios dinámico -->
    <div class="flex items-center gap-4 w-full mb-4 my-4">
      <h2 class="text-xl font-bold tracking-tight whitespace-nowrap"
        style="color: var(--text-encabezado);">
        Resumen de Cambios Operativos
      </h2>
      <div class="h-[1.5px] flex-grow mt-1" style="background: var(--tabla-borde);"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 rounded-xl mt-5 overflow-hidden shadow-lg"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">

      <div class="p-4 flex justify-between items-end h-20"
        style="border-bottom: 1px solid var(--card-border);">
        <div class="flex flex-col justify-between h-full text-left">
          <span class="font-bold uppercase text-[10px] tracking-wider"
            style="color: var(--card-text-hint);">Registros Editados</span>
          <span class="text-2xl font-bold leading-none" style="color: var(--card-text);">{{ editados }}</span>
        </div>
        <div class="flex items-end gap-1 pb-1">
          <div class="w-1 h-3 rounded-sm" style="background: var(--card-text-hint);"></div>
          <div class="w-1 h-5 rounded-sm" style="background: var(--card-text-muted);"></div>
          <div class="w-1 h-7 bg-blue-400/70 rounded-sm"></div>
          <div class="w-1 h-9 bg-[#77a9d4] rounded-sm"></div>
        </div>
      </div>

      <div class="p-4 flex justify-between items-end h-20"
        style="border-bottom: 1px solid var(--card-border); border-left: 1px solid var(--card-border); border-right: 1px solid var(--card-border);">
        <div class="flex flex-col justify-between h-full text-left">
          <span class="font-bold uppercase text-[10px] tracking-wider"
            style="color: var(--card-text-hint);">Registros Creados</span>
          <span class="text-2xl font-bold leading-none" style="color: var(--card-text);">{{ creados }}</span>
        </div>
        <div class="flex items-end gap-1 pb-1">
          <div class="w-1 h-6 rounded-sm" style="background: var(--card-text-hint);"></div>
          <div class="w-1 h-4 rounded-sm" style="background: var(--card-text-muted);"></div>
          <div class="w-1 h-8 bg-emerald-400/70 rounded-sm"></div>
          <div class="w-1 h-5 bg-emerald-500 rounded-sm"></div>
        </div>
      </div>

      <div class="p-4 flex justify-between items-end h-20">
        <div class="flex flex-col justify-between h-full text-left">
          <span class="font-bold uppercase text-[10px] tracking-wider"
            style="color: var(--card-text-hint);">Registros Eliminados</span>
          <span class="text-2xl font-bold leading-none" style="color: var(--card-text);">{{ eliminados }}</span>
        </div>
        <div class="flex items-end gap-1 pb-1">
          <div class="w-1 h-2 rounded-sm" style="background: var(--card-text-hint);"></div>
          <div class="w-1 h-3 rounded-sm" style="background: var(--card-text-muted);"></div>
          <div class="w-1 h-1 rounded-sm" style="background: var(--card-text-muted);"></div>
          <div class="w-1 h-4 bg-red-400/60 rounded-sm"></div>
        </div>
      </div>

    </div>
  </div>
</template>