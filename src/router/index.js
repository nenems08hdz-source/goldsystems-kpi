import { createRouter, createWebHistory } from 'vue-router'
import kpis from '../pantallas/kpis.vue'
import principal from '../pantallas/principal.vue'
import capturasmetricas from '../pantallas/capturasmetricas.vue'
import auditoria from '../pantallas/auditoria.vue'
import formulariokpi from '../pantallas/formulariokpi.vue'
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
  ],
})

export default router
