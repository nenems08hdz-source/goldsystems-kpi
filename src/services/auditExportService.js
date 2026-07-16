/**
 * Servicio para exportar datos de auditoría
 *
 * Maneja las llamadas a los endpoints de exportación y descarga de archivos.
 * Soporta Excel (.xlsx) y PDF.
 *
 * @author Keila Olivia Platas Sanchez <platassanchezkelly@gmail.com>
 */

import api from './api'

const auditExportService = {
  async exportToExcel(filters = {}) {
    try {
      console.log('Iniciando descarga Excel...')
      const response = await api.get('/audit-logs/export/excel', {
        params: this._limpiarFiltros(filters),
        responseType: 'blob',
      })
      console.log('Response recibido:', response)
      console.log('Blob size:', response.data.size)
      this._descargarArchivo(response.data, `auditoria_${this._obtenerFecha()}.xlsx`)
    } catch (error) {
      console.error('Error Excel:', error)
      throw error
    }
  },

  async exportToPdf(filters = {}) {
    try {
      const response = await api.get('/audit-logs/export/pdf', {
        params: this._limpiarFiltros(filters),
        responseType: 'blob',
      })
      this._descargarArchivo(response.data, `auditoria_${this._obtenerFecha()}.pdf`)
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

  _descargarArchivo(blob, filename) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
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