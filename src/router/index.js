import { createRouter, createWebHistory } from 'vue-router'
import kpis from '../pantallas/GestionKpis.vue'
import principal from '../pantallas/PanelPrincipal.vue'
import CapturasMetricas from '../pantallas/CapturasMetricas.vue'
import Auditoria from '../pantallas/Auditoria.vue'
import FormularioKpis from '../pantallas/FormularioKpis.vue'
import ControlOrganizacional from '../pantallas/ControlOrganizacional.vue'
import FormularioUsuario from '../pantallas/FormularioUsuario.vue'
import RegistroMetricas from '../pantallas/RegistroMetricas.vue'
import Ajustes from '../components/Ajustes.vue'
import ConfiguracionNotificacion from '../pantallas/ConfiguracionNotificacion.vue'
import ConfiguracionSeguridad from '../pantallas/ConfiguracionSeguridad.vue'
import PersonalizarPanel from '../pantallas/PersonalizarPantalla.vue'
import DetallesKpis from '@/pantallas/DetallesKpis.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'principal',
      component: principal
    }, 
    {
      path: '/kpis',
      name: 'gestion-kpis',
      component: kpis
    },
    {
      path: '/capturasmetricas',
      name: 'capturas',
      component: CapturasMetricas
    },
    {
      path: '/registroMetricas',
      name: 'registroMetricas',
      component: RegistroMetricas
    },
     {
      path: '/auditoria',
      name: 'centro-auditoria',
      component: Auditoria
    },
    {
      path: '/kpis/nuevo', 
      name: 'nuevo-kpi',
      component: FormularioKpis
    },
    {
      path: '/control', 
      name: 'control-organizacional',
      component: ControlOrganizacional
    },
    {
      path: '/organizacion/nuevo',
      name: 'nuevo-usuario',
      component: FormularioUsuario
    },
    {
      path: '/ajustes',
      name: 'ajustes',
      component: Ajustes 
    },
    {
    path: '/ConfiguracionNotificacion', 
    name: 'ConfiguracionNotificacion',
    component: ConfiguracionNotificacion
  },
   {
    path: '/ConfiguracionSeguridad', 
    name: 'ConfiguracionSeguridad',
    component: ConfiguracionSeguridad
  },
  {
  path: '/personalizar',
  name: 'personalizar',
  component: PersonalizarPanel
},
{
  path: '/DetallesKpis',
  name: 'DetallesKpis',
  component: DetallesKpis
}

  ],
})

export default router