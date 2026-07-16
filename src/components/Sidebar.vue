<script setup>
import { RouterLink } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useOrgStore }  from '../stores/orgStore'
import { usePermissions } from '../composables/usePermissions'

const layout = useLayoutStore()
const auth   = useAuthStore()
const org    = useOrgStore()
const router = useRouter()
const { can, canAny } = usePermissions()

function salirDeEmpresa() {
  org.salirDeEmpresa()
  router.push('/GestionEmpresas')
}

function cerrarSesion() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <aside
    :class="[
      'h-full border-r flex flex-col justify-between p-4 transition-all duration-300',
      layout.isSidebarOpen ? 'w-64' : 'w-20'
    ]"
    style="
      background-color: var(--sidebar-bg);
      color: var(--sidebar-text);
      border-color: var(--sidebar-active-bg);
    "
  >
    <div class="overflow-hidden">
      <div class="h-16 flex items-center px-2 mb-2">
        <span class="text-xl font-bold tracking-wide whitespace-nowrap flex items-center gap-3"
          style="color: var(--sidebar-text);">
          <i class="fi fi-sr-speedometer-kpi w-5 text-center"></i>
          <span v-if="layout.isSidebarOpen">KPI360 Enterprise</span>
        </span>
      </div>

      <!-- Chip de empresa activa — solo visible para developer con empresa seleccionada -->
      <div v-if="org.empresaActiva && can('companies.store')"
        class="mx-2 mb-4 rounded-lg overflow-hidden"
        style="border: 1px solid rgba(255,255,255,0.15);">

        <!-- Sidebar abierto: muestra nombre + botón salir -->
        <div v-if="layout.isSidebarOpen"
          class="flex items-center justify-between px-3 py-2 gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <i class="fi fi-sr-building text-xs flex-shrink-0" style="color: #beaed8;"></i>
            <span class="text-[11px] font-bold truncate" style="color: #fff;">
              {{ org.empresaActiva.name }}
            </span>
            <i v-if="org.empresaFijadaId === org.empresaActiva.id"
              class="fi fi-sr-thumbtack text-[9px] flex-shrink-0" style="color: #beaed8;" title="Fijada"></i>
          </div>
          <button @click="salirDeEmpresa"
            class="flex-shrink-0 text-[10px] px-2 py-0.5 rounded font-bold transition-colors"
            style="background: rgba(255,255,255,0.1); color: #beaed8;"
            title="Salir de esta empresa">
            Salir
          </button>
        </div>

        <!-- Sidebar cerrado: solo ícono con punto indicador -->
        <div v-else class="flex justify-center py-2">
          <div class="relative">
            <i class="fi fi-sr-building text-sm" style="color: #beaed8;"></i>
            <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
        </div>
      </div>

      <nav>
        <ul class="flex flex-col gap-1">

          <!-- Panel Principal — todos los roles -->
          <li>
            <RouterLink to="/"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-apps w-5 text-center"></i>
              <span v-if="layout.isSidebarOpen">Panel Principal</span>
            </RouterLink>
          </li>

          <!-- Gestión de KPIs — todos los roles con kpis.index -->
          <li v-if="can('kpis.index')">
            <RouterLink to="/kpis"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-chart-histogram w-5 text-center"></i>
              <span v-if="layout.isSidebarOpen">Gestión de KPIs</span>
            </RouterLink>
          </li>

          <!-- Captura de Métricas — quien pueda registrar métricas -->
          <li v-if="can('kpi-records.store')">
            <RouterLink to="/capturasmetricas"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-document-signed w-5 text-center"></i>
              <span v-if="layout.isSidebarOpen">Captura de Métricas</span>
            </RouterLink>
          </li>

          <!-- Auditoría — quien tenga acceso al módulo de auditoría -->
          <li v-if="can('audit-logs.index')">
            <RouterLink to="/auditoria"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-shield-check w-5 text-center"></i>
              <span v-if="layout.isSidebarOpen">Auditoría y Resumen</span>
            </RouterLink>
          </li>

          <!-- Control Empresarial — quien pueda ver usuarios -->
          <li v-if="can('users.index')">
            <RouterLink to="/ControlOrganizacional"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-building w-5 text-center"></i>
              <span v-if="layout.isSidebarOpen">Control Empresarial</span>
            </RouterLink>
          </li>

          <!-- Gestión de Empresas — solo developer (companies.store) -->
          <li v-if="can('companies.store')">
            <RouterLink to="/GestionEmpresas"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-globe w-5 text-center"></i>
              <span v-if="layout.isSidebarOpen">Gestión de Empresas</span>
            </RouterLink>
          </li>

        </ul>
      </nav>
    </div>

    <div :class="{'flex flex-col items-center': !layout.isSidebarOpen}">
      <RouterLink to="/Ajustes"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link mb-1"
        :class="{'justify-center': !layout.isSidebarOpen}">
        <i class="fi fi-sr-settings w-5 text-center"></i>
        <span v-if="layout.isSidebarOpen">Ajustes</span>
      </RouterLink>

      <button @click="cerrarSesion"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors font-medium w-full"
        :class="{'justify-center': !layout.isSidebarOpen}">
        <i class="fi fi-sr-exit w-5 text-center"></i>
        <span v-if="layout.isSidebarOpen">Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>
