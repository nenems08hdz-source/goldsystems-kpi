import { createRouter, createWebHistory } from 'vue-router'
import kpis from '../pantallas/kpis.vue'
import capturasmetricas from '../pantallas/capturasmetricas.vue'
import principal from '../pantallas/principal.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: principal
    },
    {
      path: '/kpis',
      name: 'gestion-kpis',
      component: kpis
    },
    {
      path: '/captura-kpis', 
      name: 'captura-metricas',
      component: capturasmetricas
    }
  ],
})

export default router