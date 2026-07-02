import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrgStore = defineStore('orgStore', () => {

  const usuarioActual = ref({
    id: 1,
    nombre: 'Admin Demo',
    email: 'admin@kpi360.com',
    rol: 'developer',
    empresa_id: 1,
  })

  const empresaActiva = ref({
    id: 1,
    nombre: 'KPI360 Corp',
    razonSocial: 'KPI360 Corporation S.A. de C.V.',
    rfc: 'KPI2024010101',
    email: 'contacto@kpi360.com',
    telefono: '+52 999 000 0001',
    estado: 'activo',
    logo: null, // ← agrega esta línea
  })

  const estructuraOrganizacional = ref([
    { id: 1, nombre: 'KPI360 Corp',           tipo: 'empresa',      nivel: 0, abierto: true  },
    { id: 2, nombre: 'Tecnología',             tipo: 'departamento', nivel: 1, padre_id: 1, abierto: true,  responsable: 'Carlos Méndez' },
    { id: 3, nombre: 'Equipo Backend',         tipo: 'equipo',       nivel: 2, padre_id: 2, abierto: false, lider: 'Miguel Ruiz'  },
    { id: 4, nombre: 'Equipo Frontend',        tipo: 'equipo',       nivel: 2, padre_id: 2, abierto: false, lider: 'Ana López'    },
    { id: 5, nombre: 'Operaciones',            tipo: 'departamento', nivel: 1, padre_id: 1, abierto: true,  responsable: 'Laura Torres' },
    { id: 6, nombre: 'Equipo Infraestructura', tipo: 'equipo',       nivel: 2, padre_id: 5, abierto: false, lider: 'Roberto Díaz' },
    { id: 7, nombre: 'Calidad',                tipo: 'departamento', nivel: 1, padre_id: 1, abierto: false, responsable: 'Diego Vargas' },
    { id: 8, nombre: 'Equipo QA',              tipo: 'equipo',       nivel: 2, padre_id: 7, abierto: false, lider: 'Diego Vargas' },
    { id: 9, nombre: 'Finanzas',               tipo: 'departamento', nivel: 1, padre_id: 1, abierto: false, responsable: 'Valeria Núñez' },
  ])

  const rolesDisponibles = ref([
    { id: 1, codigo: 'developer', nombre: 'Developer',      descripcion: 'Control total del sistema',     eliminable: false },
    { id: 2, codigo: 'admin',     nombre: 'Admin',           descripcion: 'Gestiona una empresa completa', eliminable: false },
    { id: 3, codigo: 'gerente',   nombre: 'Gerente',         descripcion: 'Gestiona departamentos',        eliminable: true  },
    { id: 4, codigo: 'lider',     nombre: 'Líder de Equipo', descripcion: 'Gestiona KPIs de su equipo',    eliminable: true  },
    { id: 5, codigo: 'empleado',  nombre: 'Empleado',        descripcion: 'Visualiza y captura KPIs',      eliminable: true  },
    { id: 6, codigo: 'auditor',   nombre: 'Auditor',         descripcion: 'Solo lectura y auditoría',      eliminable: true  },
  ])

  const usuarios = ref([
    { id: 1, nombre: 'Ana',     apellidoPaterno: 'López',     apellidoMaterno: 'Martínez', email: 'ana.lopez@kpi360.com',       telefono: '+52 999 111 2233', rol: 'empleado', departamento_id: 2, equipo_id: 4,    kpis: 12, estado: 'activo',    ultimoLogin: '2025-08-05' },
    { id: 2, nombre: 'Carlos',  apellidoPaterno: 'Ruiz',      apellidoMaterno: 'Sánchez',  email: 'carlos.ruiz@kpi360.com',     telefono: '+52 999 222 3344', rol: 'lider',    departamento_id: 2, equipo_id: 3,    kpis: 8,  estado: 'activo',    ultimoLogin: '2025-08-04' },
    { id: 3, nombre: 'Sofía',   apellidoPaterno: 'Martínez',  apellidoMaterno: 'García',   email: 'sofia.m@kpi360.com',         telefono: '+52 999 333 4455', rol: 'empleado', departamento_id: 5, equipo_id: 6,    kpis: 5,  estado: 'ausente',   ultimoLogin: '2025-07-30' },
    { id: 4, nombre: 'Jorge',   apellidoPaterno: 'Rivas',     apellidoMaterno: 'Torres',   email: 'jorge.rivas@kpi360.com',     telefono: null,               rol: 'empleado', departamento_id: 5, equipo_id: 6,    kpis: 0,  estado: 'bloqueado', ultimoLogin: '2025-07-15' },
    { id: 5, nombre: 'Pablo',   apellidoPaterno: 'Chable',    apellidoMaterno: 'Dzul',     email: 'pablo.chable@kpi360.com',    telefono: '+52 999 555 6677', rol: 'empleado', departamento_id: 2, equipo_id: 3,    kpis: 12, estado: 'activo',    ultimoLogin: '2025-08-05' },
    { id: 6, nombre: 'Arantxa', apellidoPaterno: 'Sánchez',   apellidoMaterno: 'Pérez',    email: 'arantxa.sanchez@kpi360.com', telefono: '+52 999 666 7788', rol: 'gerente',  departamento_id: 2, equipo_id: null, kpis: 8,  estado: 'activo',    ultimoLogin: '2025-08-05' },
    { id: 7, nombre: 'Christo', apellidoPaterno: 'Ajelo',     apellidoMaterno: 'Moo',      email: 'crhisto.a@kpi360.com',       telefono: '+52 999 777 8899', rol: 'empleado', departamento_id: 7, equipo_id: 8,    kpis: 5,  estado: 'ausente',   ultimoLogin: '2025-07-28' },
    { id: 8, nombre: 'Jorge',   apellidoPaterno: 'Hernández', apellidoMaterno: 'Balam',    email: 'jorge.hernandez@kpi360.com', telefono: '+52 999 888 9900', rol: 'auditor',  departamento_id: null, equipo_id: null, kpis: 0, estado: 'activo',  ultimoLogin: '2025-08-03' },
  ])

  // plan → BD: companies.plan ('basic'|'professional'|'enterprise')
  const empresas = ref([
    {
      id: 1,
      nombre: 'KPI360 Corp',
      razonSocial: 'KPI360 Corporation S.A. de C.V.',
      rfc: 'KPI2024010101',
      email: 'contacto@kpi360.com',
      telefono: '+52 999 000 0001',
      plan: 'enterprise',
      estado: 'activo',
      usuarios: 8,
      kpis: 8,
      fechaRegistro: '2024-01-15',
      logo: null, // ← agrega esta línea
    },
    {
      id: 2,
      nombre: 'TechSol SA',
      razonSocial: 'TechSol Soluciones S.A.',
      rfc: 'TSO2023050202',
      email: 'admin@techsol.com',
      telefono: '+52 55 000 0002',
      plan: 'professional',
      estado: 'activo',
      usuarios: 15,
      kpis: 22,
      fechaRegistro: '2024-03-10',
      logo: null, // ← agrega esta línea
    },
    {
      id: 3,
      nombre: 'Infranet',
      razonSocial: 'Infranet Servicios S.C.',
      rfc: 'INF2022080303',
      email: 'sistemas@infranet.mx',
      telefono: '+52 81 000 0003',
      plan: 'basic',
      estado: 'inactivo',
      usuarios: 3,
      kpis: 5,
      fechaRegistro: '2023-08-22',
      logo: null, // ← agrega esta línea
    },
  ])

  function guardarEmpresa(nuevaEmpresa) {
    empresas.value.push(nuevaEmpresa)
  }

  function nombreCompleto(usuario) {
    return `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`
  }

  function colorPorRol(rol) {
    const colores = {
      developer: 'bg-violet-100 text-violet-700 border-violet-200',
      admin:     'bg-[#3f2a52]/10 text-[#3f2a52] border-[#3f2a52]/20',
      gerente:   'bg-emerald-100 text-emerald-700 border-emerald-200',
      lider:     'bg-blue-100 text-blue-700 border-blue-200',
      empleado:  'bg-gray-100 text-gray-600 border-gray-200',
      auditor:   'bg-amber-100 text-amber-700 border-amber-200',
    }
    return colores[rol] ?? 'bg-gray-100 text-gray-500'
  }

  return {
    usuarioActual,
    empresaActiva,
    estructuraOrganizacional,
    rolesDisponibles,
    usuarios,
    empresas,
    guardarEmpresa,
    nombreCompleto,
    colorPorRol,
  }
})
