import { useAuthStore } from '@/stores/authStore'

/**
 * Composable para verificar permisos en el frontend.
 *
 * USO en cualquier componente:
 *   import { usePermissions } from '@/composables/usePermissions'
 *   const { can, canAny } = usePermissions()
 *
 * En el template:
 *   <div v-if="can('org.view_tree')"> ... </div>
 *   <button v-if="can('audit.export')">Exportar</button>
 *   <th v-if="can('kpis.view_targets')">Meta</th>
 */
export function usePermissions() {
  const auth = useAuthStore()

  /**
   * Verifica si el usuario tiene UN permiso específico.
   * @param {string} permiso - ej. 'org.view_tree'
   * @returns {boolean}
   */
  function can(permiso) {
    return auth.permisos.includes(permiso)
  }

  /**
   * Verifica si el usuario tiene AL MENOS UNO de los permisos.
   * Útil cuando una sección se muestra con cualquiera de varios permisos.
   * @param {string[]} permisos - ej. ['audit.view_movements', 'audit.export']
   * @returns {boolean}
   */
  function canAny(permisos) {
    return permisos.some(p => auth.permisos.includes(p))
  }

  /**
   * Verifica si el usuario tiene TODOS los permisos indicados.
   * @param {string[]} permisos
   * @returns {boolean}
   */
  function canAll(permisos) {
    return permisos.every(p => auth.permisos.includes(p))
  }

  return { can, canAny, canAll }
}
