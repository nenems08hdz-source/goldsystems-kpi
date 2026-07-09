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

const { can } = usePermissions()
const misEventos = ref([])

onMounted(async () => {
  const res  = await api.get('/audit-logs')
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
    fecha:   log.created_at ? new Date(log.created_at).toLocaleString('es-MX') : '—',
    estado:  'Exitosa',
    empresa: log.company?.name ?? '—',
    tipo_cambio: log.action ?? '—',
    valor_anterior: log.old_data ? JSON.stringify(log.old_data).substring(0, 50) + '...' : '—',
    valor_nuevo: log.new_data ? JSON.stringify(log.new_data).substring(0, 50) + '...' : '—',
  }))
})

</script>

<template>
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

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <tarjetasresumen
        titulo="Eventos Totales (24h)" valor="1,284" subtexto="Flujo de datos normal"
        icono="fi fi-sr-bolt" colorBarra="border-l-[#3f2a52]"
        badgeTexto="+12%" badgeColorClass="bg-emerald-50 text-emerald-600"
      />
      <tarjetasresumen
        titulo="Alertas Críticas" valor="0" subtexto="Sin amenazas activas"
        icono="fi fi-sr-exclamation" colorBarra="border-l-red-500"
        badgeTexto="Estable" badgeColorClass="bg-gray-100 text-gray-500"
      />
      <tarjetasresumen
        titulo="Usuarios Activos" valor="42" subtexto="Conexiones simultáneas"
        icono="fi fi-sr-user" colorBarra="border-l-amber-500"
        badgeTexto="Sesiones" badgeColorClass="bg-amber-50 text-amber-700"
      />
      <tarjetasresumen
        titulo="Estado del Sistema" valor="Estable" subtexto="Infraestructura íntegra"
        icono="fi fi-sr-shield-check" colorBarra="border-l-[#16a34a]"
      />
    </div>

    <plantillatabla
      titulo="Registro Histórico"
:encabezados="['Usuario', 'Acción', 'Fecha / Hora', 'Empresa', 'Tipo de Cambio', 'Valor Anterior', 'Valor Nuevo']"      :datos="misEventos"
    >
      <template #default="{ fila }">

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

        <td class="p-4 align-middle text-xs font-medium md:w-2/12 min-w-[130px]"
          style="color: var(--text-general);">
          {{ fila.accion }}
        </td>

        <td class="p-4 align-middle text-xs whitespace-nowrap md:w-1/12 min-w-[110px]"
          style="color: var(--subtext-general);">
          {{ fila.fecha }}
        </td>

        <td class="p-4 align-middle text-center md:w-1/12 min-w-[120px]">
          <EtiquetaBadge :texto="fila.modulo" />
        </td>

        <td class="p-4 align-middle text-xs max-w-xs truncate md:w-2/12 min-w-[150px]"
          style="color: var(--subtext-general);">
          {{ fila.detalle }}
        </td>

        <td class="p-4 align-middle text-center md:w-2/12 min-w-[110px]">
          <StatusBadge
            :tipo="fila.estado === 'Exitosa' ? 'exitosa' : 'revision'"
            :texto="fila.estado"
          />
        </td>
      </template>
    </plantillatabla>

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
            style="color: var(--card-text-hint);">Metas Editadas</span>
          <span class="text-2xl font-bold leading-none" style="color: var(--card-text);">24</span>
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
            style="color: var(--card-text-hint);">Cambios de Datos</span>
          <span class="text-2xl font-bold leading-none" style="color: var(--card-text);">112</span>
        </div>
        <div class="flex items-end gap-1 pb-1">
          <div class="w-1 h-6 rounded-sm" style="background: var(--card-text-hint);"></div>
          <div class="w-1 h-4 rounded-sm" style="background: var(--card-text-muted);"></div>
          <div class="w-1 h-8 bg-blue-400/70 rounded-sm"></div>
          <div class="w-1 h-5 bg-[#77a9d4] rounded-sm"></div>
        </div>
      </div>

      <div class="p-4 flex justify-between items-end h-20">
        <div class="flex flex-col justify-between h-full text-left">
          <span class="font-bold uppercase text-[10px] tracking-wider"
            style="color: var(--card-text-hint);">Cancelaciones</span>
          <span class="text-2xl font-bold leading-none" style="color: var(--card-text);">3</span>
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