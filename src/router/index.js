import { createRouter, createWebHistory } from 'vue-router'
import principal from '../pantallas/principal.vue'
import kpis from '../pantallas/kpis.vue'
import capturasmetricas from '../pantallas/capturasmetricas.vue'

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
      path: '/capturasmetricas', 
      name: 'capturasmetricas',
      component: () => import('../pantallas/capturasmetricas.vue')
    },
    {
      path: '/registrar-metrica',
      name: 'RegistrarMetrica',
      component: () => import('../pantallas/registrometricas.vue') 
    }
  ],
})

export default router