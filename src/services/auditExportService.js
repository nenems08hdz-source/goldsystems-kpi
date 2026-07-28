import api from './api'
import { useAuthStore } from '../stores/authStore'

const auditExportService = {

  _resolverCompanyId() {
    const activa = sessionStorage.getItem('active_company_id')
    if (activa) return activa
    const authStore = useAuthStore()
    return authStore.user?.company_id ?? null
  },

  async exportToExcel(filters = {}) {
    try {
      const params = new URLSearchParams()
      const cleaned = this._limpiarFiltros(filters)
      Object.entries(cleaned).forEach(([key, value]) => params.append(key, value))

      const response = await api.get(
        `/audit-logs/export/excel?${params.toString()}`,
        { responseType: 'blob' }
      )
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `auditoria_${this._obtenerFecha()}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error Excel:', error)
      throw error
    }
  },

  async exportToPdf(filters = {}) {
    try {
      const params = new URLSearchParams()
      const cleaned = this._limpiarFiltros(filters)
      Object.entries(cleaned).forEach(([key, value]) => params.append(key, value))

      const response = await api.get(
        `/audit-logs/export/pdf?${params.toString()}`,
        { responseType: 'blob' }
      )
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `auditoria_${this._obtenerFecha()}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error PDF:', error)
      throw error
    }
  },

  _limpiarFiltros(filters) {
    const filtrosLimpios = {}
    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== '' && value !== null && value !== undefined) {
        filtrosLimpios[key] = value
      }
    }
    return filtrosLimpios
  },

  _obtenerFecha() {
    const ahora = new Date()
    const año = ahora.getFullYear()
    const mes = String(ahora.getMonth() + 1).padStart(2, '0')
    const día = String(ahora.getDate()).padStart(2, '0')
    return `${año}-${mes}-${día}`
  },
}

export default auditExportService
