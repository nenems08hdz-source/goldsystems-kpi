import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// ── Imports de pantallas ───────────────────────────────────────────────────────
import Ajustes                  from '../components/Ajustes.vue'
import Auditoria                from '../pantallas/Auditoria.vue'
import CapturasMetricas         from '../pantallas/Capturasmetricas.vue'
import ConfiguracionNotificacion from '../pantallas/ConfiguracionNotificacion.vue'
import ConfiguracionSeguridad   from '../pantallas/ConfiguracionSeguridad.vue'
import ControlOrganizacional    from '../pantallas/ControlOrganizacional.vue'
import DetallesKpis             from '../pantallas/DetallesKpis.vue'
import FormularioDepartamento   from '@/pantallas/FormularioDepartamento.vue'
import FormularioEmpresa        from '../pantallas/FormularioEmpresa.vue'
import FormularioEquipo         from '../pantallas/FormularioEquipo.vue'
import FormularioKpis           from '../pantallas/FormularioKpis.vue'
import GestionRoles             from '../pantallas/GestionRoles.vue'
import FormularioUsuario        from '../pantallas/FormularioUsuario.vue'
import GestionEmpresas          from '../pantallas/GestionEmpresas.vue'
import GestionKpis              from '../pantallas/GestionKpis.vue'
import PanelPrincipal           from '../pantallas/PanelPrincipal.vue'
import PersonalizarPanel        from '../pantallas/PersonalizarPantalla.vue'
import RegistroMetricas         from '../pantallas/Registrometricas.vue'
import Login                    from '../pantallas/Login.vue'

// ── Definición de rutas ────────────────────────────────────────────────────────
//
// meta.permission    → el usuario debe tener ESE permiso exacto
// meta.anyPermission → el usuario debe tener AL MENOS UNO de la lista
// Si no cumple → redirige al panel principal (no se le dice qué ruta intentó)
//
const routes = [
  // ── Pública ──────────────────────────────────────────────────────────────────
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true, hideNavbar: true },
  },

  // ── Panel principal (todos los roles autenticados) ────────────────────────────
  {
    path: '/',
    name: 'principal',
    component: PanelPrincipal,
  },

  // ── Ajustes y perfil (todos los roles) ───────────────────────────────────────
  {
    path: '/ajustes',
    name: 'ajustes',
    component: Ajustes,
  },
  {
    path: '/personalizar',
    name: 'personalizar',
    component: PersonalizarPanel,
    meta: { fullWidth: true },
  },
  {
    path: '/ConfiguracionNotificacion',
    name: 'ConfiguracionNotificacion',
    component: ConfiguracionNotificacion,
  },
  {
    path: '/ConfiguracionSeguridad',
    name: 'ConfiguracionSeguridad',
    component: ConfiguracionSeguridad,
  },

  // ── KPIs ─────────────────────────────────────────────────────────────────────
  {
    path: '/kpis',
    name: 'gestion-kpis',
    component: GestionKpis,
    meta: { permission: 'kpis.index' },
  },
  {
    path: '/kpis/nuevo',
    name: 'nuevo-kpi',
    component: FormularioKpis,
    meta: { permission: 'kpis.store' },
  },
  {
    path: '/kpis/editar/:id',
    name: 'EditarKpi',
    component: () => import('../pantallas/FormularioKpisEdicion.vue'),
    meta: { permission: 'kpis.update' },
  },
  {
    path: '/kpis/detalle/:id',
    name: 'detalles-kpi',
    component: DetallesKpis,
    meta: { permission: 'kpis.index' },
  },

  // ── Métricas ──────────────────────────────────────────────────────────────────
  {
    path: '/capturasmetricas',
    name: 'capturas',
    component: CapturasMetricas,
    meta: { permission: 'kpi-records.store' },
  },
  {
    path: '/registroMetricas',
    name: 'registroMetricas',
    component: RegistroMetricas,
    meta: { permission: 'kpi-records.index' },
  },

  // ── Auditoría (solo quienes tienen audit.view_movements) ─────────────────────
  {
    path: '/auditoria',
    name: 'centro-auditoria',
    component: Auditoria,
    meta: { permission: 'audit-logs.index' },
  },

  // ── Control organizacional (árbol o tabla de usuarios) ───────────────────────
  {
    path: '/ControlOrganizacional',
    name: 'control-organizacional',
    component: ControlOrganizacional,
    meta: { permission: 'users.index' },
  },
  {
    path: '/organizacion/nuevo',
    name: 'nuevo-usuario',
    component: FormularioUsuario,
    meta: { permission: 'users.store' },
  },
  {
    path: '/organizacion/editar/:id',
    name: 'editar-usuario',
    component: () => import('../pantallas/FormularioUsuarioEdicion.vue'),
    meta: { permission: 'users.update' },
  },
  {
    path: '/FormularioDepartamento',
    name: 'FormularioDepartamento',
    component: FormularioDepartamento,
    meta: { permission: 'departments.store' },
  },
  {
    path: '/departamentos/editar/:id',
    name: 'editar-departamento',
    component: () => import('../pantallas/FormularioDepartamentoEdicion.vue'),
    meta: { permission: 'departments.update' },
  },
  {
    path: '/FormularioEquipo',
    name: 'FormularioEquipo',
    component: FormularioEquipo,
    meta: { permission: 'teams.store' },
  },
  {
    path: '/equipos/editar/:id',
    name: 'editar-equipo',
    component: () => import('../pantallas/FormularioEquipoEdicion.vue'),
    meta: { permission: 'teams.update' },
  },

  // ── Roles y permisos (solo admin y developer) ─────────────────────────────────
  {
    path: '/roles',
    name: 'gestion-roles',
    component: GestionRoles,
    meta: { permission: 'roles.index' },
  },

  // ── Gestión de empresas (solo developer) ──────────────────────────────────────
  {
    path: '/GestionEmpresas',
    name: 'GestionEmpresas',
    component: GestionEmpresas,
    meta: { permission: 'companies.store' },
  },
  {
    path: '/GestionEmpresas/nueva',
    name: 'nueva-empresa',
    component: FormularioEmpresa,
    meta: { permission: 'companies.store' },
  },
  {
    path: '/GestionEmpresas/editar/:id',
    name: 'editar-empresa',
    component: () => import('../pantallas/FormularioEmpresaEdicion.vue'),
    meta: { permission: 'companies.update' },
  },
]

// ── Creación del router ────────────────────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes,
})

// ── Guard global ──────────────────────────────────────────────────────────────
//
// Orden de verificación:
// 1. Inicializar sesión (llama /api/me una sola vez por sesión)
// 2. Ruta pública → dejar pasar o redirigir si ya está logueado
// 3. Sin token → login
// 4. Verificar permission o anyPermission de la ruta
//
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // 1. Cargar user/role/permisos desde el backend si aún no se ha hecho.
  //    init() es idempotente: solo ejecuta la petición la primera vez.
  await auth.init()

  // 2. Ruta pública (login)
  if (to.meta.public) {
    return auth.token ? { name: 'principal' } : true
  }

  // 3. No autenticado
  if (!auth.token) {
    return { name: 'Login' }
  }

  // 4. Verificar permiso único requerido
  if (to.meta.permission && !auth.permisos.includes(to.meta.permission)) {
    return { name: 'principal' }
  }

  // 5. Verificar que tenga al menos uno de los permisos requeridos
  if (to.meta.anyPermission && !to.meta.anyPermission.some(p => auth.permisos.includes(p))) {
    return { name: 'principal' }
  }
})

export default router
