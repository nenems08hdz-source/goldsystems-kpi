import api from './api'

const auditExportService = {
 async exportToExcel(filters = {}) {
  try {
    const params = new URLSearchParams()
    const cleaned = this._limpiarFiltros(filters)
    Object.entries(cleaned).forEach(([key, value]) => params.append(key, value))

    const baseUrl = api.defaults.baseURL || ''
    const url = `${baseUrl}/audit-logs/export/excel${params.toString() ? '?' + params.toString() : ''}`
    window.location.href = url
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

    const baseUrl = api.defaults.baseURL || ''
    const url = `${baseUrl}/audit-logs/export/pdf${params.toString() ? '?' + params.toString() : ''}`
    window.location.href = url
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