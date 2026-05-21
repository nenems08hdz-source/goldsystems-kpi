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
<<<<<<< HEAD
      path: '/',
      name: 'principal',
      component: principal
    },
     {
      path: '/capturasmetricas',
      name: 'capturasmetricas',
=======
      path: '/', 
      name: 'inicio',
      component: principal
    },
     {
      path: '/capturas', 
      name: 'capturas-metricas',
>>>>>>> 08968cb925e320c5a902d2fd04cd485d10b29954
      component: capturasmetricas
    },
  ],
})

export default router
