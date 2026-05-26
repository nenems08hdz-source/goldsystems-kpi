import { createRouter, createWebHistory } from 'vue-router'
import kpis from '../pantallas/GestionKpis.vue'
import principal from '../pantallas/PanelPrincipal.vue'
import capturasmetricas from '../pantallas/capturasmetricas.vue'
import auditoria from '../pantallas/auditoria.vue'
import formulariokpi from '../pantallas/FormularioKpis.vue'
import control from '../pantallas/ControlOrganizacional.vue'
import FormularioUsuario from '../pantallas/FormularioUsuario.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/kpis',
      name: 'gestion-kpis',
      component: kpis
    },
    {
      path: '/',
      name: 'principal',
      component: principal
    },
     {
      path: '/auditoria',
      name: 'centro-auditoria',
      component: auditoria
    },
    {
      path: '/kpis/nuevo', 
      name: 'nuevo-kpi',
      component: formulariokpi
    },
    {
      path: '/control', 
      name: 'control-organizacional',
      component: control
    },
    {
      path: '/organizacion/nuevo',
      name: 'nuevo-usuario',
      component: FormularioUsuario
    }
  ],
})

export default router
