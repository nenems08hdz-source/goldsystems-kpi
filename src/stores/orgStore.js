import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import { useAuthStore } from './authStore'

export const useOrgStore = defineStore('orgStore', () => {

  // ── Estado vacío (se llena desde el API) ─────────────
  const empresas      = ref([])
  const usuarios      = ref([])
  const departamentos = ref([])
  const equipos       = ref([])
  const cargando      = ref(false)

  // Los roles son fijos del sistema, no necesitan API
  const rolesDisponibles = ref([
    { codigo: 'developer',   nombre: 'Developer'    },
    { codigo: 'admin',       nombre: 'Adminstrador'        },
    { codigo: 'manager',     nombre: 'Gerente'      },
    { codigo: 'team_leader', nombre: 'Lider de Equipo'  },
    { codigo: 'employee',    nombre: 'Empleado'     },
    { codigo: 'auditor',     nombre: 'Auditor'      },
  ])

  // Primera empresa activa (la que está usando el sistema)
  const empresaActiva = computed(() => empresas.value[0] ?? null)

  // Árbol organizacional construido desde los datos reales
  const estructuraOrganizacional = computed(() => {
    const nodos = []
    departamentos.value.forEach(dep => {
      nodos.push({
        uid:         `dep-${dep.id}`,
        id:          dep.id,
        nombre:      dep.name,
        tipo:        'departamento',
        nivel:       1,
        abierto:     true,
        responsable: dep.manager?.name ?? null,
      })
      equipos.value
        .filter(eq => eq.department_id === dep.id)
        .forEach(eq => {
          nodos.push({
            uid:      `eq-${eq.id}`,
            id:       eq.id,
            nombre:   eq.name,
            tipo:     'equipo',
            nivel:    2,
            padre_id: dep.id,
            abierto:  false,
            lider:    eq.leader?.name ?? null,
          })
        })
    })
    return nodos
  })

  // ── Actions (llamadas al API) ─────────────────────────

  function tienePermiso(perm) {
    return useAuthStore().permisos.includes(perm)
  }

  async function cargarEmpresas() {
    if (!tienePermiso('companies.index')) return
    try {
      const res = await api.get('/companies')
      empresas.value = res.data
    } catch { empresas.value = [] }
  }

  async function cargarUsuarios() {
    if (!tienePermiso('users.index')) return
    try {
      const res = await api.get('/users')
      usuarios.value = res.data
    } catch { usuarios.value = [] }
  }

  async function cargarDepartamentos() {
    if (!tienePermiso('departments.index')) return
    try {
      const res = await api.get('/departments')
      departamentos.value = res.data
    } catch { departamentos.value = [] }
  }

  async function cargarEquipos() {
    if (!tienePermiso('teams.index')) return
    try {
      const res = await api.get('/teams')
      equipos.value = res.data
    } catch { equipos.value = [] }
  }

  // Carga todo a la vez (para usarlo al entrar a una pantalla)
  async function cargarTodo() {
    cargando.value = true
    try {
      await Promise.all([
        cargarEmpresas(),
        cargarUsuarios(),
        cargarDepartamentos(),
        cargarEquipos(),
      ])
    } finally {
      cargando.value = false
    }
  }

  // ── Helpers ───────────────────────────────────────────

  function nombreCompleto(usuario) {
    return `${usuario.name} ${usuario.paternal ?? ''} ${usuario.maternal ?? ''}`.trim()
  }

  function colorPorRol(rol) {
    const colores = {
      developer:   'bg-violet-100 text-violet-700 border-violet-200',
      admin:       'bg-[#3f2a52]/10 text-[#3f2a52] border-[#3f2a52]/20',
      manager:     'bg-emerald-100 text-emerald-700 border-emerald-200',
      team_leader: 'bg-blue-100 text-blue-700 border-blue-200',
      employee:    'bg-gray-100 text-gray-600 border-gray-200',
      auditor:     'bg-amber-100 text-amber-700 border-amber-200',
    }
    return colores[rol] ?? 'bg-gray-100 text-gray-500'
  }

  return {
    empresas,
    empresaActiva,
    usuarios,
    departamentos,
    equipos,
    rolesDisponibles,
    estructuraOrganizacional,
    cargando,
    cargarEmpresas,
    cargarUsuarios,
    cargarDepartamentos,
    cargarEquipos,
    cargarTodo,
    nombreCompleto,
    colorPorRol,
  }
})
