<script setup>
import { RouterLink } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import { usePanelStore } from '@/stores/panelStore' 

const layout = useLayoutStore()
const store = usePanelStore()  
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
      <div class="h-16 flex items-center px-2 mb-6">
        <span class="text-xl font-bold tracking-wide whitespace-nowrap flex items-center gap-3"
          style="color: var(--sidebar-text);">
          <i class="fi fi-sr-speedometer-kpi w-5 text-center"></i> 
          <span v-if="layout.isSidebarOpen">KPI360 Enterprise</span>
        </span>
      </div>

      <nav>
        <ul class="flex flex-col gap-1">
          <li>
            <RouterLink to="/" 
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-apps w-5 text-center"></i> 
              <span v-if="layout.isSidebarOpen">Panel Principal</span>
            </RouterLink>
          </li>
          
          <li>
            <RouterLink to="/kpis" 
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-chart-histogram w-5 text-center"></i> 
              <span v-if="layout.isSidebarOpen">Gestión de KPIs</span>
            </RouterLink>
          </li>
          
          <li>
            <RouterLink to="/capturasmetricas" 
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-document-signed w-5 text-center"></i> 
              <span v-if="layout.isSidebarOpen">Captura de Métricas</span>
            </RouterLink>
          </li>
          
          <li>
            <RouterLink to="/auditoria" 
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-shield-check w-5 text-center"></i> 
              <span v-if="layout.isSidebarOpen">Auditoría y Resumen</span>
            </RouterLink>
          </li>

          <li v-if="store.usuarioActual.rol === 'developer'">
            <RouterLink to="/GestionEmpresas" 
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-globe w-5 text-center"></i>
              <span v-if="layout.isSidebarOpen">Gestión de Empresas</span>
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/ControlOrganizacional" 
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium sidebar-link"
              :class="{'justify-center': !layout.isSidebarOpen}">
              <i class="fi fi-sr-building w-5 text-center"></i> 
              <span v-if="layout.isSidebarOpen">Control Empresarial</span>
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
      
      <RouterLink to="/" 
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium"
        style="color: #f87171;"  
        :class="{'justify-center': !layout.isSidebarOpen}">
        <i class="fi fi-sr-exit w-5 text-center"></i> 
        <span v-if="layout.isSidebarOpen">Cerrar Sesión</span>
      </RouterLink>
    </div>
  </aside>
</template>