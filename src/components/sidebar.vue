<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <aside class="bg-[#3f2a52] text-white min-h-screen w-64 border-r border-gray-800 flex flex-col justify-between p-4">
    
    <div>
      <div class="h-16 flex items-center px-2 mb-6">
        <span class="text-xl font-bold tracking-wide text-white">KPI360 Enterprise</span>
      </div>

      <nav>
        <ul class="flex flex-col gap-1">
          <li>
            <RouterLink to="/" active-class="bg-[#beaed8] text-[#3f2a52]" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-200 hover:bg-[#beaed8] hover:text-[#3f2a52] transition-colors font-medium">
              <i class="fi fi-sr-apps w-5 text-center flex items-center justify-center"></i> 
              Panel Principal
            </RouterLink>
          </li>
          
          <li>
            <RouterLink to="/kpis" active-class="bg-[#beaed8] text-[#3f2a52]" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-200 hover:bg-[#beaed8] hover:text-[#3f2a52] transition-colors font-medium">
              <i class="fi fi-sr-chart-histogram w-5 text-center flex items-center justify-center"></i> 
              Gestión de KPIs
            </RouterLink>
          </li>
          
          <li>
            <RouterLink to="/capturasmetricas" active-class="bg-[#beaed8] text-[#3f2a52]" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-200 hover:bg-[#beaed8] hover:text-[#3f2a52] transition-colors font-medium">
              <i class="fi fi-sr-document-signed w-5 text-center flex items-center justify-center"></i> 
              Captura de Métricas
            </RouterLink>
          </li>
          
          <li>
            <RouterLink to="/auditoria" active-class="bg-[#beaed8] text-[#3f2a52]" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-200 hover:bg-[#beaed8] hover:text-[#3f2a52] transition-colors font-medium">
              <i class="fi fi-sr-shield-check w-5 text-center flex items-center justify-center"></i> 
              Auditoría y Resumen
            </RouterLink>
          </li>

            <li>
            <RouterLink to="/control" active-class="bg-[#beaed8] text-[#3f2a52]" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-200 hover:bg-[#beaed8] hover:text-[#3f2a52] transition-colors font-medium">
              <i class="fi fi-sr-building w-5 text-center flex items-center justify-center"></i> 
              Control Empresarial
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>

      <div>
        <RouterLink to= "/Ajustes" active-class="bg-[#beaed8] text-[#3f2a52]" class= "flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-200 hover:bg-[#beaed8] hover:text-[#3f2a52] transition-colors font-medium">
          <i class="fi fi-sr-settings w-5 text-center flex items-center justify-center"></i> 
          Ajustes
        </RouterLink>
      
      
      <RouterLink class= "flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors font-medium">
        <i class="fi fi-sr-exit w-5 text-center flex items-center justify-center"></i> 
        Cerrar Sesión
      </RouterLink>
    </div>

  </aside>
</template>