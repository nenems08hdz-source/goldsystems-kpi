import { createRouter, createWebHistory } from 'vue-router'
<<<<<<< HEAD
import kpis from '../pantallas/GestionKpis.vue'
import principal from '../pantallas/PanelPrincipal.vue'
import CapturasMetricas from '../pantallas/capturasmetricas.vue'
import Auditoria from '../pantallas/Auditoria.vue'
import FormularioKpis from '../pantallas/FormularioKpis.vue'
import ControlOrganizacional from '../pantallas/ControlOrganizacional.vue'
import FormularioUsuario from '../pantallas/FormularioUsuario.vue'
import RegistroMetricas from '../pantallas/RegistroMetricas.vue'
=======
>>>>>>> c9d30085856b891b3116cab209e4704d1136f9ac
import Ajustes from '../components/Ajustes.vue'
import Auditoria from '../pantallas/Auditoria.vue'
import CapturasMetricas from '../pantallas/CapturasMetricas.vue'
import ConfiguracionNotificacion from '../pantallas/ConfiguracionNotificacion.vue'
import ConfiguracionSeguridad from '../pantallas/ConfiguracionSeguridad.vue'
import ControlOrganizacional from '../pantallas/ControlOrganizacional.vue'
import DetallesKpis from '../pantallas/DetallesKpis.vue'
import FormularioDepartamento from '@/pantallas/FormularioDepartamento.vue'
import FormularioKpis from '../pantallas/FormularioKpis.vue'
import FormularioUsuario from '../pantallas/FormularioUsuario.vue'
import GestionKpis from '../pantallas/GestionKpis.vue'
import PanelPrincipal from '../pantallas/PanelPrincipal.vue'
import PersonalizarPanel from '../pantallas/PersonalizarPantalla.vue'
<<<<<<< HEAD
import DetallesKpis from '../pantallas/DetallesKpis.vue'
import FormularioDepartamento from '../pantallas/FormularioDepartamento.vue'
=======
import RegistroMetricas from '../pantallas/RegistroMetricas.vue'
>>>>>>> c9d30085856b891b3116cab209e4704d1136f9ac


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/ajustes',
      name: 'ajustes',
      component: Ajustes 
  },
    {
      path: '/auditoria',
      name: 'centro-auditoria',
      component: Auditoria
  },
    {
      path: '/capturasmetricas',
      name: 'capturas',
      component: CapturasMetricas
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
      path: '/ControlOrganizacional', 
      name: 'control-organizacional',
      component: ControlOrganizacional
  },
    {
      path: '/kpis/detalle/:id',
      name: 'detalles-kpi',
      component: DetallesKpis
  },
    {
      path: '/FormularioDepartamento',
      name: 'FormularioDepartamento',
      component: FormularioDepartamento
  },
    {
      path: '/kpis/nuevo', 
      name: 'nuevo-kpi',
      component: FormularioKpis
<<<<<<< HEAD
    },
    {
      path: '/ControlOrganizacional', 
      name: 'control-organizacional',
      component: ControlOrganizacional
    },
    {
=======
  },
     {
>>>>>>> c9d30085856b891b3116cab209e4704d1136f9ac
      path: '/organizacion/nuevo',
      name: 'nuevo-usuario',
      component: FormularioUsuario
  },
    {
      path: '/kpis',
      name: 'gestion-kpis',
      component: GestionKpis
  },
    {
      path: '/',
      name: 'principal',
      component: PanelPrincipal
  }, 
     {
        path: '/personalizar',
        name: 'personalizar',
        component: PersonalizarPanel
  },
    {
      path: '/registroMetricas',
      name: 'registroMetricas',
      component: RegistroMetricas
  }
  ],
})

export default router