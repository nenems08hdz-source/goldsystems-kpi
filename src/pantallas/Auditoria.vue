<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api                from '../services/api'
import { usePermissions } from '../composables/usePermissions'
import EncabezadoPantalla from '@/components/EncabezadoPantalla.vue'
import EtiquetaBadge      from '../components/ui/EtiquetaBadge.vue'
import AppButton          from '../components/ui/AppButton.vue'
import tarjetasresumen    from '../components/TarjetasResumen.vue'
import auditExportService from '../services/auditExportService'

const { can } = usePermissions()

// ── Estado ──────────────────────────────────────────────────────────────────
const logs        = ref([])
const cargando    = ref(false)
const paginacion  = ref({ current_page: 1, last_page: 1, total: 0 })
const logDetalle  = ref(null)   // log seleccionado para modal

// ── Filtros ──────────────────────────────────────────────────────────────────
const filtroModulo    = ref('')
const filtroAccion    = ref('')
const filtroDesde     = ref('')
const filtroHasta     = ref('')
const paginaActual    = ref(1)
const exportando = ref(false)

const modulos  = ['KPIs', 'Capturas de Métricas', 'Usuarios', 'Empresas', 'Departamentos', 'Roles', 'Asignaciones KPI', 'Autenticación']
const acciones = ['Crear', 'Editar', 'Eliminar', 'Editar permisos', 'Inicio de sesión', 'Cierre de sesión', 'Cambio de contraseña']

// ── Tarjetas resumen (conteos globales del backend) ──────────────────────────
const totalEventos = computed(() => paginacion.value.total)
const creados      = ref(0)
const editados     = ref(0)
const eliminados   = ref(0)

// ── Carga con filtros ────────────────────────────────────────────────────────
async function cargar() {
  cargando.value = true
  try {
    const params = { page: paginaActual.value }
    if (filtroModulo.value)  params.module    = filtroModulo.value
    if (filtroAccion.value)  params.action    = filtroAccion.value
    if (filtroDesde.value)   params.date_from = filtroDesde.value
    if (filtroHasta.value)   params.date_to   = filtroHasta.value

    const res  = await api.get('/audit-logs', { params })
    const data = res.data
    paginacion.value = {
      current_page: data.current_page,
      last_page:    data.last_page,
      total:        data.total,
    }
    creados.value   = data.resumen?.creados    ?? 0
    editados.value  = data.resumen?.editados   ?? 0
    eliminados.value = data.resumen?.eliminados ?? 0
    logs.value = data.data.map(mapearLog)
  } catch (e) {
    console.error('Error cargando auditoría:', e)
  } finally {
    cargando.value = false
  }
}

function limpiarFiltros() {
  filtroModulo.value = ''
  filtroAccion.value = ''
  filtroDesde.value  = ''
  filtroHasta.value  = ''
  paginaActual.value = 1
  cargar()
}

function irPagina(n) {
  paginaActual.value = n
  cargar()
}

// ── Mapeo de log de la API al formato del template ────────────────────────────
function mapearLog(log) {
  return {
    id:          log.id,
    usuario:     log.user ? `${log.user.name} ${log.user.paternal ?? ''}`.trim() : `#${log.user_id}`,
    correo:      log.user?.email ?? '—',
    modulo:      log.module ?? '—',
    accion:      log.action ?? '—',
    entidad:     extraerNombreEntidad(log),
    entity_type: log.entity_type,
    entity_id:   log.entity_id,
    ip:          log.ip_address ?? '—',
    user_agent:  log.user_agent ?? '—',
    fecha:       formatearFecha(log.created_at),
    old_data:    log.old_data,
    new_data:    log.new_data,
  }
}

function formatearFecha(iso) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('es-MX', {
    year: '2-digit', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'America/Mexico_City',
  }).format(new Date(iso))
}

const tiposEntidad = {
  Kpi:           'KPI',
  KpiRecord:     'Registro de Métrica',
  KpiAssignment: 'Asignación de KPI',
  Company:       'Empresa',
  User:          'Usuario',
  Department:    'Departamento',
  Role:          'Rol',
}

function extraerNombreEntidad(log) {
  const tipo = tiposEntidad[log.entity_type] ?? log.entity_type ?? ''
  return tipo && log.entity_id ? `${tipo} #${log.entity_id}` : (tipo || '—')
}

// ── Badge de acción ──────────────────────────────────────────────────────────
function colorAccion(accion) {
  if (accion === 'Crear')              return 'bg-emerald-100 text-emerald-700'
  if (accion === 'Editar')             return 'bg-blue-100 text-blue-700'
  if (accion === 'Editar permisos')    return 'bg-indigo-100 text-indigo-700'
  if (accion === 'Eliminar')           return 'bg-rose-100 text-rose-700'
  if (accion === 'Inicio de sesión')   return 'bg-purple-100 text-purple-700'
  if (accion === 'Cierre de sesión')   return 'bg-gray-100 text-gray-600'
  return 'bg-gray-100 text-gray-600'
}

function iconoAccion(accion) {
  if (accion === 'Crear')              return 'fi-sr-plus'
  if (accion === 'Editar')             return 'fi-sr-pencil'
  if (accion === 'Editar permisos')    return 'fi-sr-lock'
  if (accion === 'Eliminar')           return 'fi-sr-trash'
  if (accion === 'Inicio de sesión')    return 'fi-sr-enter'
  if (accion === 'Cierre de sesión')    return 'fi-sr-exit'
  if (accion === 'Cambio de contraseña') return 'fi-sr-lock'
  return 'fi-sr-bolt'
}

// ── Diff de cambios ──────────────────────────────────────────────────────────
const camposIgnorar  = new Set(['id','created_at','updated_at','deleted_at','password','remember_token'])
const nombresCampo   = {
  // Campos en inglés (registros anteriores)
  name: 'Nombre', subtitle: 'Descripción corta', description: 'Descripción',
  type: 'Tipo', unit: 'Unidad', frequency: 'Frecuencia', goal: 'Meta',
  minimum: 'Mínimo', maximum: 'Máximo', weight: 'Peso', status: 'Estado',
  value: 'Valor', notes: 'Observaciones',
  period_start: 'Inicio período', period_end: 'Fin período',
  kpi_id: 'KPI', captured_by: 'Capturado por',
  email: 'Email', phone: 'Teléfono', address: 'Dirección',
  legal_name: 'Razón social', tax_id: 'RFC',
  company_id: 'Empresa', department_id: 'Departamento',
  permissions: 'Permisos', formula: 'Fórmula',
  role_id: 'Rol', user_id: 'Usuario',
  leader_id: 'Líder', manager_id: 'Responsable',
  created_by: 'Responsable', paternal: 'Apellido paterno',
  start_date: 'Fecha de inicio', end_date: 'Fecha de fin',
  // Campos en español (registros nuevos — ya vienen bien, se muestran tal cual)
}

function formatearValor(valor) {
  if (valor === null || valor === undefined) return '—'
  if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(valor)) {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true,
      timeZone: 'America/Mexico_City',
    }).format(new Date(valor))
  }
  if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [y, m, d] = valor.split('-')
    return `${d}/${m}/${y}`
  }
  return valor
}

function calcularDiff(old_data, new_data) {
  if (!old_data && !new_data) return []
  if (!old_data) return [{ campo: 'Registro', anterior: '—', nuevo: 'Creado' }]
  if (!new_data || Object.keys(new_data).length === 0) return [{ campo: 'Registro', anterior: 'Existía', nuevo: 'Eliminado' }]

  const diff = []
  const todasLasClaves = new Set([...Object.keys(old_data), ...Object.keys(new_data)])
  for (const key of todasLasClaves) {
    if (camposIgnorar.has(key)) continue
    if (JSON.stringify(old_data[key]) === JSON.stringify(new_data[key])) continue
    diff.push({
      campo:    nombresCampo[key] ?? key,
      anterior: formatearValor(old_data[key]),
      nuevo:    formatearValor(new_data[key]),
    })
  }
  return diff
}

onMounted(cargar)
async function handleExportarExcel() {
  exportando.value = true
  try {
    await auditExportService.exportToExcel({
      module: filtroModulo.value,
      action: filtroAccion.value,
      date_from: filtroDesde.value,
      date_to: filtroHasta.value,
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    exportando.value = false
  }
}

async function handleExportarPdf() {
  exportando.value = true
  try {
    await auditExportService.exportToPdf({
      module: filtroModulo.value,
      action: filtroAccion.value,
      date_from: filtroDesde.value,
      date_to: filtroHasta.value,
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    exportando.value = false
  }
}
</script>

<template>
  <!-- ← EDICIÓN: Componente personalizado -->

  <div class="p-3 min-h-screen" style="background: transparent;">

    <!-- Encabezado -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
      <EncabezadoPantalla
        titulo="Centro de Auditoría"
        descripcion="Supervisión de la actividad del sistema — quién hizo qué, cuándo y desde dónde."
      />

      <div v-if="can('audit.export')" class="flex gap-3 flex-shrink-0">
        <AppButton
            variant="primary"
            class="flex items-center gap-2"
            :disabled="exportando"
            @click="handleExportarPdf"
  >
            <i :class="['fi', exportando ? 'fi-sr-spinner animate-spin' : 'fi-sr-file-pdf']"></i>
              {{ exportando ? 'Descargando...' : 'Exportar PDF' }}
        </AppButton>

        <AppButton
            variant="primary"
            class="flex items-center gap-2"
            :disabled="exportando"
            @click="handleExportarExcel"
            >
          <i :class="['fi', exportando ? 'fi-sr-spinner animate-spin' : 'fi-sr-file-excel']"></i>
          {{ exportando ? 'Descargando...' : 'Exportar Excel' }}
       </AppButton>
      </div>
    </div>

    <!-- Tarjetas resumen -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <tarjetasresumen
        titulo="Eventos Totales" :valor="`${totalEventos}`" subtexto="Registros de auditoría"
        icono="fi fi-sr-shield-check" colorBarra="border-l-[#3f2a52]"
        :badgeTexto="`${creados} creados`" badgeColorClass="bg-emerald-50 text-emerald-600"
      />
      <tarjetasresumen
        titulo="Registros Editados" :valor="`${editados}`" subtexto="Modificaciones de datos"
        icono="fi fi-sr-pencil" colorBarra="border-l-blue-500"
        badgeTexto="Cambios" badgeColorClass="bg-blue-50 text-blue-600"
      />
      <tarjetasresumen
        titulo="Registros Eliminados" :valor="`${eliminados}`" subtexto="Borrados del sistema"
        icono="fi fi-sr-trash" colorBarra="border-l-red-500"
        badgeTexto="Eliminados" badgeColorClass="bg-red-50 text-red-600"
      />
      <tarjetasresumen
        titulo="Página actual" :valor="`${paginacion.current_page} / ${paginacion.last_page}`"
        subtexto="Registros paginados"
        icono="fi fi-sr-document-signed" colorBarra="border-l-[#16a34a]"
        badgeTexto="50 por página" badgeColorClass="bg-emerald-50 text-emerald-600"
      />
    </div>

    <!-- Filtros -->
    <div class="rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-end"
      style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">

      <div class="flex flex-col gap-1 min-w-[160px]">
        <label class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">Módulo</label>
        <select v-model="filtroModulo" class="app-select">
          <option value="">Todos los módulos</option>
          <option v-for="m in modulos" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-1 min-w-[160px]">
        <label class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">Acción</label>
        <select v-model="filtroAccion" class="app-select">
          <option value="">Todas las acciones</option>
          <option v-for="a in acciones" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">Desde</label>
        <input v-model="filtroDesde" type="date" class="app-select" />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">Hasta</label>
        <input v-model="filtroHasta" type="date" class="app-select" />
      </div>

      <div class="flex gap-2">
        <AppButton variant="primary" @click="() => { paginaActual = 1; cargar() }" class="flex items-center gap-2">
          <i class="fi fi-sr-search text-xs"></i> Filtrar
        </AppButton>
        <AppButton variant="secondary" @click="limpiarFiltros" class="flex items-center gap-2">
          <i class="fi fi-sr-cross-circle text-xs"></i> Limpiar
        </AppButton>
      </div>
    </div>

    <!-- Tabla -->
    <div class="rounded-xl overflow-hidden shadow-sm" style="border: 1px solid var(--tabla-borde);">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr style="background: var(--tabla-header-bg);">
              <th class="p-4 text-left text-[10px] font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">Usuario</th>
              <th class="p-4 text-left text-[10px] font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">Módulo</th>
              <th class="p-4 text-left text-[10px] font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">Acción</th>
              <th class="p-4 text-left text-[10px] font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">Entidad</th>
              <th class="p-4 text-left text-[10px] font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">IP</th>
              <th class="p-4 text-left text-[10px] font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">Fecha / Hora</th>
              <th class="p-4 text-left text-[10px] font-bold uppercase tracking-wider" style="color: var(--tabla-header-text);">Cambios</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cargando">
              <td colspan="7" class="p-8 text-center text-sm" style="color: var(--subtext-general);">
                Cargando registros...
              </td>
            </tr>
            <tr v-else-if="logs.length === 0">
              <td colspan="7" class="p-8 text-center text-sm" style="color: var(--subtext-general);">
                No se encontraron registros con los filtros aplicados.
              </td>
            </tr>
            <tr
              v-for="log in logs"
              :key="log.id"
              style="border-top: 1px solid var(--tabla-borde); background: var(--card-bg);"
              @mouseover="$event.currentTarget.style.background='var(--tabla-hover)'"
              @mouseleave="$event.currentTarget.style.background='var(--card-bg)'"
            >
              <!-- Usuario -->
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-[#3f2a52] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs uppercase">
                    {{ log.usuario.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-xs" style="color: var(--text-general);">{{ log.usuario }}</div>
                    <div class="text-[10px]" style="color: var(--subtext-general);">{{ log.correo }}</div>
                  </div>
                </div>
              </td>

              <!-- Módulo -->
              <td class="p-4">
                <EtiquetaBadge :texto="log.modulo" />
              </td>

              <!-- Acción -->
              <td class="p-4">
                <span :class="`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full ${colorAccion(log.accion)}`">
                  <i :class="`fi ${iconoAccion(log.accion)} text-[10px]`"></i>
                  {{ log.accion }}
                </span>
              </td>

              <!-- Entidad -->
              <td class="p-4 text-xs max-w-[160px] truncate" style="color: var(--subtext-general);">
                {{ log.entidad }}
              </td>

              <!-- IP -->
              <td class="p-4 text-[10px] font-mono whitespace-nowrap" style="color: var(--subtext-general);">
                {{ log.ip }}
              </td>

              <!-- Fecha -->
              <td class="p-4 text-[10px] whitespace-nowrap" style="color: var(--subtext-general);">
                {{ log.fecha }}
              </td>

              <!-- Ver cambios -->
              <td class="p-4">
                <button
                  v-if="log.old_data || log.new_data"
                  @click="logDetalle = log"
                  class="text-[10px] font-bold px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                  style="color: var(--color-kpi-morado); border: 1px solid var(--tabla-borde);"
                >
                  <i class="fi fi-sr-eye text-[9px]"></i> Ver
                </button>
                <span v-else class="text-[10px]" style="color: var(--card-text-hint);">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div v-if="paginacion.last_page > 1"
        class="flex items-center justify-between px-4 py-3"
        style="border-top: 1px solid var(--tabla-borde); background: var(--tabla-header-bg);">
        <span class="text-[10px]" style="color: var(--subtext-general);">
          Página {{ paginacion.current_page }} de {{ paginacion.last_page }} · {{ paginacion.total }} registros
        </span>
        <div class="flex gap-2">
          <button
            :disabled="paginacion.current_page === 1"
            @click="irPagina(paginacion.current_page - 1)"
            class="text-[10px] font-bold px-3 py-1 rounded disabled:opacity-40"
            style="border: 1px solid var(--tabla-borde); color: var(--text-general);"
          >← Anterior</button>
          <button
            :disabled="paginacion.current_page === paginacion.last_page"
            @click="irPagina(paginacion.current_page + 1)"
            class="text-[10px] font-bold px-3 py-1 rounded disabled:opacity-40"
            style="border: 1px solid var(--tabla-borde); color: var(--text-general);"
          >Siguiente →</button>
        </div>
      </div>
    </div>

    <!-- Modal de detalle de cambios -->
    <Teleport to="body">
      <div
        v-if="logDetalle"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.6);"
        @click.self="logDetalle = null"
      >
        <div class="rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
          style="background: var(--card-bg); border: 1px solid var(--tabla-borde);">

          <!-- Header del modal -->
          <div class="flex items-center justify-between p-5"
            style="border-bottom: 1px solid var(--tabla-borde);">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--subtext-general);">
                {{ logDetalle.modulo }} · {{ logDetalle.entidad }}
              </p>
              <h3 class="text-sm font-bold mt-0.5" style="color: var(--text-general);">
                Detalle del cambio — {{ logDetalle.accion }}
              </h3>
              <p class="text-[10px] mt-1" style="color: var(--card-text-hint);">
                Por <strong>{{ logDetalle.usuario }}</strong> · {{ logDetalle.fecha }} · {{ logDetalle.ip }}
              </p>
            </div>
            <button @click="logDetalle = null"
              class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style="background: var(--tabla-header-bg); color: var(--subtext-general);">
              <i class="fi fi-sr-circle-xmark text-base"></i>
            </button>
          </div>

          <!-- Diff -->
          <div class="p-5">
            <div v-if="calcularDiff(logDetalle.old_data, logDetalle.new_data).length === 0"
              class="text-sm text-center py-4" style="color: var(--subtext-general);">
              No se detectaron cambios en los datos.
            </div>
            <div v-else class="flex flex-col gap-3">
              <div
                v-for="(cambio, i) in calcularDiff(logDetalle.old_data, logDetalle.new_data)"
                :key="i"
                class="rounded-lg p-3"
                style="background: var(--tabla-header-bg); border: 1px solid var(--tabla-borde);"
              >
                <p class="text-[10px] font-bold uppercase tracking-wider mb-2" style="color: var(--subtext-general);">
                  {{ cambio.campo }}
                </p>
                <div class="flex items-start gap-3">
                  <div class="flex-1 rounded p-2 text-xs" style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: var(--text-general);">
                    <span class="block text-[9px] font-bold text-rose-500 mb-1 uppercase">Anterior</span>
                    <span class="break-words">{{ cambio.anterior }}</span>
                  </div>
                  <i class="fi fi-sr-arrow-right text-xs mt-3 flex-shrink-0" style="color: var(--subtext-general);"></i>
                  <div class="flex-1 rounded p-2 text-xs" style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: var(--text-general);">
                    <span class="block text-[9px] font-bold text-emerald-600 mb-1 uppercase">Nuevo</span>
                    <span class="break-words">{{ cambio.nuevo }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>
