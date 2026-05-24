import { createRouter, createWebHistory } from 'vue-router'

// Usamos @/ para que busque directo desde la raíz de src sin importar los puntos
import Principal from '../pantallas/principal.vue'
import Kpis from '../pantallas/kpis.vue'
import Capturas from '../pantallas/capturasmetricas.vue'
import Registro from '../pantallas/registrometricas.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'principal',
      component: Principal
    },
    {
      path: '/kpis',
      name: 'kpis',
      component: Kpis
    },
    {
      path: '/capturas',
      name: 'capturas',
      component: Capturas
    },
    {
      path: '/registro',
      name: 'registro',
      component: Registro
    }
  ]
})

export default router