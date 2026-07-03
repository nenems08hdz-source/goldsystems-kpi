import { createRouter, createWebHistory } from 'vue-router'
import Ajustes from '../components/Ajustes.vue'
import Auditoria from '../pantallas/Auditoria.vue'
import CapturasMetricas from '../pantallas/Capturasmetricas.vue'
import ConfiguracionNotificacion from '../pantallas/ConfiguracionNotificacion.vue'
import ConfiguracionSeguridad from '../pantallas/ConfiguracionSeguridad.vue'
import ControlOrganizacional from '../pantallas/ControlOrganizacional.vue'
import DetallesKpis from '../pantallas/DetallesKpis.vue'
import FormularioDepartamento from '@/pantallas/FormularioDepartamento.vue'
import FormularioEmpresa from '../pantallas/FormularioEmpresa.vue'
import FormularioEquipo from '../pantallas/FormularioEquipo.vue'
import FormularioKpis from '../pantallas/FormularioKpis.vue'
import FormularioUsuario from '../pantallas/FormularioUsuario.vue'
import GestionEmpresas from '../pantallas/GestionEmpresas.vue'
import GestionKpis from '../pantallas/GestionKpis.vue'
import PanelPrincipal from '../pantallas/PanelPrincipal.vue'
import PersonalizarPanel from '../pantallas/PersonalizarPantalla.vue'
import RegistroMetricas from '../pantallas/Registrometricas.vue'
import Login from '../pantallas/Login.vue'
import { useAuthStore } from '../stores/authStore'


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
      path: '/GestionEmpresas/nueva',
      name: 'nueva-empresa',
      component: FormularioEmpresa
  },
    {
      path: '/FormularioEquipo',
      name: 'FormularioEquipo',
      component: FormularioEquipo
  },
    {
      path: '/kpis/nuevo', 
      name: 'nuevo-kpi',
      component: FormularioKpis
  },
     {
      path: '/organizacion/nuevo',
      name: 'nuevo-usuario',
      component: FormularioUsuario
  },
    {
      path: '/GestionEmpresas',
      name: 'GestionEmpresas',
      component: GestionEmpresas
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
        component: PersonalizarPanel,
        meta: { fullWidth: true }
  },
    {
      path: '/registroMetricas',
      name: 'registroMetricas',
      component: RegistroMetricas
  },
  {
  path: '/login',
  name: 'Login',
  component: () => import('../pantallas/Login.vue'),
  meta: { hideNavbar: true } // Bandera para ocultar
}
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Si no hay token y no es la pantalla de login, redirige al login
  if (to.name !== 'Login' && !auth.token) {
    return { name: 'Login' }
  }

  // Si ya está logueado e intenta ir al login, redirige al panel principal
  if (to.name === 'Login' && auth.token) {
    return { name: 'principal' }
  }
})

export default router