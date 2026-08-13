# Catálogo de fórmulas de KPI y diseño de KPIs compuestos

Material de referencia para definir el módulo de fórmulas.

---

## Parte 1 — Los dos tipos de KPI

### KPI capturado (simple)

Alguien registra el valor cada periodo. El sistema solo lo guarda.

> *Ventas del mes: 850 000*

Es lo único que el sistema soporta hoy.

### KPI compuesto (derivado)

Su valor **no se captura**: se calcula a partir de otros KPIs del mismo periodo.

> *Margen = Ingresos − Costos*

Nadie lo escribe. El sistema lo recalcula cada vez que cambian sus componentes.

### Por qué importa la distinción

| | Capturado | Compuesto |
|---|---|---|
| ¿Quién pone el valor? | Una persona | El sistema |
| ¿Puede quedar desactualizado? | Sí | No |
| ¿Puede contradecir a otros KPIs? | Sí | Nunca |
| ¿Aparece en la pantalla de captura? | Sí | No |

El beneficio real de los compuestos es la **consistencia**. Si el margen se captura a mano, tarde o temprano no va a cuadrar con la resta de ingresos menos costos. Si lo calcula el sistema, es imposible que esté mal.

---

## Parte 2 — Catálogo de indicadores estándar

Estos son indicadores de uso común, organizados por área. La columna **Dir.** indica la dirección: ↑ *más es mejor*, ↓ *menos es mejor*.

Los marcados como **Compuesto** se calculan a partir de otros KPIs; los demás se capturan.

### Ventas

| Indicador | Fórmula | Tipo | Unidad | Dir. | Compuesto |
|---|---|---|---|---|---|
| Tasa de conversión | (Ventas cerradas ÷ Oportunidades) × 100 | percentage | % | ↑ | Sí |
| Cumplimiento de cuota | (Ventas reales ÷ Cuota) × 100 | percentage | % | ↑ | Sí |
| Ticket promedio | Ingresos ÷ Número de ventas | money | MXN | ↑ | Sí |
| Ciclo de venta | Días acumulados ÷ Ventas cerradas | time | días | ↓ | Sí |
| Clientes nuevos | Conteo del periodo | absolute | clientes | ↑ | No |

### Finanzas

| Indicador | Fórmula | Tipo | Unidad | Dir. | Compuesto |
|---|---|---|---|---|---|
| Margen bruto | ((Ingresos − Costos) ÷ Ingresos) × 100 | percentage | % | ↑ | Sí |
| Utilidad neta | Ingresos − Costos − Gastos | money | MXN | ↑ | Sí |
| ROI | ((Ganancia − Inversión) ÷ Inversión) × 100 | percentage | % | ↑ | Sí |
| Días de cobranza (DSO) | (Cuentas por cobrar ÷ Ventas a crédito) × 30 | time | días | ↓ | Sí |
| Gasto operativo | Suma del periodo | money | MXN | ↓ | No |

### Recursos Humanos

| Indicador | Fórmula | Tipo | Unidad | Dir. | Compuesto |
|---|---|---|---|---|---|
| Rotación de personal | (Bajas ÷ Plantilla promedio) × 100 | percentage | % | ↓ | Sí |
| Ausentismo | (Horas de ausencia ÷ Horas programadas) × 100 | percentage | % | ↓ | Sí |
| Tiempo de contratación | Días entre vacante y contratación | time | días | ↓ | No |
| Horas de capacitación | Horas totales ÷ Número de empleados | absolute | horas | ↑ | Sí |
| Satisfacción del empleado | Promedio de encuesta | absolute | puntos | ↑ | No |

### Producción y Operaciones

| Indicador | Fórmula | Tipo | Unidad | Dir. | Compuesto |
|---|---|---|---|---|---|
| Tasa de defectos | (Unidades defectuosas ÷ Total producido) × 100 | percentage | % | ↓ | Sí |
| Entregas a tiempo | (Entregas puntuales ÷ Total de entregas) × 100 | percentage | % | ↑ | Sí |
| Merma de material | (Material desperdiciado ÷ Material usado) × 100 | percentage | % | ↓ | Sí |
| Nivel de inventario | Unidades en almacén | absolute | unidades | rango | No |
| Tiempo de ciclo | Minutos por unidad producida | time | minutos | ↓ | No |

### Servicio y Soporte

| Indicador | Fórmula | Tipo | Unidad | Dir. | Compuesto |
|---|---|---|---|---|---|
| Tiempo de primera respuesta | Promedio de minutos hasta responder | time | minutos | ↓ | No |
| Resolución en primer contacto | (Resueltos al primer contacto ÷ Total) × 100 | percentage | % | ↑ | Sí |
| CSAT (satisfacción) | (Clientes satisfechos ÷ Encuestados) × 100 | percentage | % | ↑ | Sí |
| Tickets reabiertos | (Tickets reabiertos ÷ Tickets cerrados) × 100 | percentage | % | ↓ | Sí |

### Observaciones sobre el catálogo

**"Nivel de inventario" usa dirección de rango.** Ni mucho ni poco: demasiado inventario es capital detenido, muy poco es riesgo de desabasto. Es el caso que justifica las columnas `minimum` y `maximum` que ya existen en la tabla.

**Muchos compuestos comparten componentes.** "Ventas cerradas" alimenta tanto la tasa de conversión como el ticket promedio y el ciclo de venta. Eso es normal y es justamente la ventaja: se captura una vez y sirve para tres indicadores.

**Este catálogo es un punto de partida, no una lista cerrada.** Conviene presentárselo al coordinador para que marque cuáles aplican a cada área y cuáles faltan.

---

## Parte 3 — Cómo se guarda una fórmula compuesta

### El problema con el texto libre

La tentación es guardar la fórmula como texto (`"(a + b) / c * 100"`) e interpretarla. Eso implica escribir un parser o usar `eval()`.

**No se recomienda**, por tres razones:

- `eval()` sobre texto que viene del usuario es una de las vulnerabilidades más graves que existen: permite ejecutar código arbitrario en el servidor.
- Un parser propio es varios días de trabajo y una fuente constante de errores.
- No aporta nada: nadie necesita expresiones complejas para un KPI.

### La alternativa: fórmula estructurada

Se guarda como JSON con una forma fija y validable:

```json
{
  "operacion": "division",
  "operandos": [
    { "kpi_id": 12 },
    { "kpi_id": 13 }
  ],
  "multiplicador": 100
}
```

Operaciones soportadas: `suma`, `resta`, `multiplicacion`, `division`.

Ejemplos del catálogo traducidos:

**Tasa de conversión** = (Ventas cerradas ÷ Oportunidades) × 100

```json
{ "operacion": "division", "operandos": [{"kpi_id": 12}, {"kpi_id": 13}], "multiplicador": 100 }
```

**Utilidad neta** = Ingresos − Costos − Gastos

```json
{ "operacion": "resta", "operandos": [{"kpi_id": 20}, {"kpi_id": 21}, {"kpi_id": 22}] }
```

La resta y la suma aceptan más de dos operandos; la división se limita a dos.

**Margen bruto** = ((Ingresos − Costos) ÷ Ingresos) × 100 requiere dos operaciones anidadas. Dos caminos:

- Crear primero un KPI compuesto "Utilidad bruta" (Ingresos − Costos) y luego dividirlo entre Ingresos. Encadenar compuestos cubre casi todos los casos y mantiene el formato simple.
- O permitir que un operando sea a su vez una fórmula. Más flexible, pero complica la interfaz.

Recomendación: empezar encadenando. Si aparece un caso que no se puede resolver así, se evalúa después.

### En la interfaz

El usuario nunca ve el JSON. Ve selectores:

```
Este KPI se calcula automáticamente:

  [ Ventas cerradas  ▾ ]   [ ÷ ▾ ]   [ Oportunidades  ▾ ]

  Multiplicar el resultado por: [ 100 ]

  Vista previa con datos de este mes:  (45 ÷ 300) × 100 = 15%
```

La vista previa es importante: deja ver de inmediato si la fórmula quedó al revés.

### Validaciones necesarias

| Riesgo | Qué hacer |
|---|---|
| KPI de otra empresa como operando | Validar que todos sean de la misma `company_id` |
| División entre cero | Devolver `null` y mostrar "sin dato", no error |
| Referencia circular (A usa B, B usa A) | Detectar antes de guardar y rechazar |
| Frecuencias distintas entre operandos | Exigir la misma `frequency` en todos |
| Falta la captura de un componente | El compuesto queda pendiente hasta que estén todos |

La **referencia circular** es la más importante. Sin esa validación, el cálculo entra en un bucle infinito y tumba el servidor. Se detecta recorriendo el árbol de dependencias antes de guardar.

### Cuándo se recalcula

Cuando se guarda una captura de un KPI, el sistema busca qué compuestos dependen de él y los recalcula en cascada. Es el mismo momento en que se calcularía el porcentaje de cumplimiento.

---

## Parte 4 — El catálogo como plantillas

### La idea

Una tabla `kpi_templates` con los indicadores estándar ya definidos. Al crear un KPI, el usuario elige de una lista y el formulario se rellena solo: nombre, tipo, unidad, frecuencia, dirección y descripción de la fórmula.

### Tres niveles de uso

1. **Elegir del catálogo** — el caso normal. Rellena todo, solo se ajusta la meta.
2. **Elegir y modificar** — parte de la plantilla y cambia lo que necesite.
3. **Crear personalizado** — desde cero. Opcionalmente se guarda como plantilla propia de esa empresa.

### Plantillas globales y por empresa

```php
$table->foreignId('company_id')->nullable();
// null  → plantilla del sistema, visible para todas las empresas
// valor → plantilla propia de esa empresa
```

Con el sistema creciendo a varias empresas, esto permite que cada una arme su propio catálogo sin ensuciar el de las demás.

### Regla de diseño importante

**La plantilla solo rellena el formulario. El KPI guarda su propia copia de todo.**

Si el KPI guardara una referencia a la plantilla, editar la plantilla cambiaría indicadores ya en uso en todas las empresas —y con ellos, el histórico de evaluaciones. La plantilla es un punto de partida, no una fuente de verdad permanente.

---

## Parte 5 — Cómo encaja con lo demás

Las tres piezas del sistema de fórmulas, en orden de dependencia:

| Pieza | Qué resuelve | Requiere |
|---|---|---|
| **Dirección** (`direction`) | Que el semáforo sea correcto | Nada |
| **Cumplimiento** (`kpi_results`) | Comparar KPIs entre sí, histórico congelado | Dirección |
| **Compuestos** (fórmulas entre KPIs) | No capturar datos derivados | Nada, pero conviene después |

Los compuestos son independientes de los otros dos: un KPI compuesto produce un valor, y ese valor se evalúa contra su meta igual que cualquier otro.

Por eso pueden implementarse al final sin bloquear nada, tal como planteó el asesor. Lo urgente sigue siendo la dirección, porque hoy el semáforo está mal para la mayoría de los indicadores.
