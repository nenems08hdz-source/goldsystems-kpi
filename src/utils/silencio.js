

/**
 * Verifica si la hora actual está dentro del horario de silencio.
 *  true si estamos en silencio, false si no
 */
export function estaEnSilencio() {

  const silencio = JSON.parse(localStorage.getItem('silencio'))
  if (!silencio) return false                                   //este lee el horario que se a guardado en el navegador

  const ahora  = new Date()
  const hora   = ahora.getHours() * 60 + ahora.getMinutes()  //obtiene la hora actual y la comvierte a minutos para que sea mas facil comparar las horas 

  const [hInicio, mInicio] = silencio.inicio.split(':').map(Number)
  const [hFin,    mFin]    = silencio.fin.split(':').map(Number)  

  const inicio = hInicio * 60 + mInicio
  const fin    = hFin    * 60 + mFin  //convierte el inico y fin tambien a minutos totales para poder comparar con la hora actual 

  // Si el horario cruza medianoche (ej: 22:00 - 08:00)
  if (inicio > fin) {
    return hora >= inicio || hora < fin
  }

  return hora >= inicio && hora < fin //este verifica si la hora actual estre entre la hora de inicio y el fin 
}