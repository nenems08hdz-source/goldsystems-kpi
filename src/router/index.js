import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useOrgStore }  from '../stores/orgStore'

// ── Imports de pantallas ───────────────────────────────────────────────────────
import Ajustes                  from '../components/Ajustes.vue'
import Auditoria                from '../pantallas/Auditoria.vue'
import CapturasMetricas         from '../pantallas/CapturasMetricas.vue'
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
import RegistroMetricas         from '../pantallas/RegistroMetricas.vue'
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
// Rutas que requieren empresa activa para el developer
const RUTAS_CON_EMPRESA = ['principal', 'gestion-kpis', 'nuevo-kpi', 'EditarKpi', 'detalles-kpi',
  'capturas', 'registroMetricas', 'control-organizacional', 'nuevo-usuario', 'editar-usuario',
  'FormularioDepartamento', 'editar-departamento', 'FormularioEquipo', 'editar-equipo',
  'gestion-roles', 'personalizar']

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  const org  = useOrgStore()

  // 1. Cargar user/role/permisos desde el backend si aún no se ha hecho.
  await auth.init()

  // 2. Ruta pública (login)
  if (to.meta.public) {
    return auth.token ? { name: 'principal' } : true
  }

  // 3. No autenticado
  if (!auth.token) return { name: 'Login' }

  // 4. Si es developer, cargar empresas y restaurar la fijada (solo la primera vez)
  const esDeveloper = auth.permisos.includes('companies.store')
  if (esDeveloper && org.empresas.length === 0) {
    await org.cargarEmpresas()
    org.restaurarEmpresaInicial()
  }

  // 5. Si es developer sin empresa activa intentando entrar a ruta con empresa → redirigir
  if (esDeveloper && !org.empresaActiva && RUTAS_CON_EMPRESA.includes(to.name)) {
    return { name: 'GestionEmpresas' }
  }

  // 6. Verificar permiso único requerido
  if (to.meta.permission && !auth.permisos.includes(to.meta.permission)) {
    return { name: 'principal' }
  }

  // 7. Verificar que tenga al menos uno de los permisos requeridos
  if (to.meta.anyPermission && !to.meta.anyPermission.some(p => auth.permisos.includes(p))) {
    return { name: 'principal' }
  }
})

export default router
