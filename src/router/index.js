import { createRouter, createWebHistory } from 'vue-router'
import kpis from '../pantallas/kpis.vue'
import principal from '../pantallas/principal.vue'
import capturasmetricas from '../pantallas/capturasmetricas.vue'
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
      path: '/capturasmetricas',
      name: 'capturasmetricas',
      component: capturasmetricas
    },
  ],
})

export default router
