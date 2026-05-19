import { createRouter, createWebHistory } from 'vue-router'
import kpis from '../pantallas/kpis.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/kpis',
      name: 'gestion-kpis',
      component: kpis
    }
    
  ],
})

export default router
