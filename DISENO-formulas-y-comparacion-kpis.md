# Fórmulas, línea de meta y comparación de KPIs

Documento de diseño — propuesta técnica antes de implementar.

---

## 0. Punto de partida: lo que ya existe

Antes de proponer nada conviene saber qué hay. La base de datos **ya fue diseñada para esto**, pero la lógica nunca se implementó.

**Tabla `kpis`** — columnas que existen y hoy no se usan para calcular:

| Columna | Tipo | Estado actual |
|---|---|---|
| `formula` | TEXT | Se guarda, nunca se lee |
| `minimum` | decimal(12,4) | Se guarda, nunca se usa |
| `maximum` | decimal(12,4) | Se guarda, nunca se usa |
| `weight` | decimal(4,2) | Se guarda, nunca se usa |
| `goal` | decimal(12,4) | Se muestra, pero no entra en el cálculo del semáforo |
| `type` | enum | percentage, money, time, boolean, absolute, custom |

**Tabla `kpi_results`** — existe completa y está vacía:

```
kpi_id, kpi_record_id, completion_percentage, traffic_light,
period_start, period_end, calculated_at
```

Esa tabla es exactamente el lugar donde debe vivir el resultado de la fórmula. Quien diseñó el esquema ya había previsto este problema.

**Lo que hace el sistema hoy** (`kpiStore.js`):

```js
function calcularEstado(progreso) {
  if (progreso >= 80) return 'saludable'
  if (progreso >= 50) return 'en riesgo'
  return 'critico'
}
```

Recibe el **valor crudo** de la última captura, no un porcentaje de cumplimiento. Ignora la meta por completo.

Consecuencia práctica:

- KPI "Tiempo de respuesta", meta 5 min, valor real 45 min → sale **verde** (45 ≥ 80 es falso... sale rojo por accidente, pero por la razón equivocada)
- KPI "Satisfacción", meta 10 pts, valor real 9 pts → sale **rojo** (9 < 50), cuando es 90% de cumplimiento
- KPI "Ventas", meta 100 000, valor 12 000 → sale **verde** (12 000 ≥ 80), cuando es 12% de la meta

Solo funciona por casualidad cuando el KPI es porcentaje con meta 100.

---

## 1. Qué significa "fórmula" (son dos cosas distintas)

Esta es la confusión que hay que resolver primero, porque llevan nombres parecidos y se implementan de forma completamente diferente.

### 1.a. Fórmula de captura — *cómo se obtiene el número*

> "Ventas cerradas ÷ oportunidades totales × 100"

Esto **no lo calcula el sistema**. Es una instrucción para la persona que captura, o para el área que extrae el dato de otro sistema. Es documentación.

Para esto sirve la columna `formula` que ya existe. Solo hay que mostrarla en la pantalla de captura, como ayuda: *"Recuerda: este KPI se calcula como ventas cerradas ÷ oportunidades × 100"*.

**Recomendación: no construir un motor de fórmulas.** Interpretar expresiones escritas por el usuario (`(a+b)/c*100`) significa escribir un parser, o peor, usar `eval()`. Es mucho trabajo, es un riesgo de seguridad real, y el cliente no lo necesita: quien captura ya conoce su fórmula y captura el resultado.

### 1.b. Fórmula de evaluación — *cómo se compara contra la meta*

> "¿Este valor es bueno o malo respecto a la meta?"

**Esto sí lo debe calcular el sistema**, y es lo que falta. Convierte el valor crudo en un **porcentaje de cumplimiento** (0–100%) y de ahí sale el semáforo.

Todo lo que sigue en este documento trata sobre esta segunda fórmula.

---

## 2. La pieza que falta: la dirección del KPI

No existe una sola fórmula de cumplimiento. Existen tres, y cuál aplica depende de algo que **hoy no se guarda en ninguna parte**: si para ese KPI *más es mejor* o *menos es mejor*.

### Los tres casos

**Caso 1 — Mayor es mejor** (ventas, satisfacción, producción, clientes nuevos)

```
cumplimiento = (valor / meta) × 100
```

Meta 100 000, valor 90 000 → 90% → verde.

**Caso 2 — Menor es mejor** (tiempo de respuesta, defectos, quejas, rotación de personal, costos)

```
cumplimiento = (meta / valor) × 100
```

Meta 5 min, valor 4 min → 125% (superó la meta) → verde.
Meta 5 min, valor 45 min → 11% → rojo.

Es la fórmula invertida. Sin esto, todos los KPIs de "reducir algo" quedan mal evaluados, y son la mitad de los KPIs de cualquier empresa.

**Caso 3 — Rango óptimo** (nivel de inventario, temperatura, porcentaje de ocupación)

Ni mucho ni poco. Aquí se usan `minimum` y `maximum`, que ya existen en la tabla:

```
si minimum ≤ valor ≤ maximum  →  100%
si valor < minimum            →  (valor / minimum) × 100
si valor > maximum            →  (maximum / valor) × 100
```

### La solución: una columna

```php
$table->enum('direction', ['higher_better', 'lower_better', 'range'])
      ->default('higher_better');
```

Una sola columna nueva y el semáforo queda correcto para todos los KPIs de la empresa. Es el cambio de mayor impacto de todo este documento.

En el formulario de KPIs sería un campo obligatorio, con etiquetas en lenguaje claro:

- *"Entre más alto, mejor"* (ventas, satisfacción)
- *"Entre más bajo, mejor"* (tiempo, defectos, costos)
- *"Debe mantenerse en un rango"* (inventario, ocupación)

### Casos borde que hay que resolver

Estos son los que rompen el sistema en producción si no se contemplan:

| Situación | Qué pasa | Qué hacer |
|---|---|---|
| `meta = 0` | División entre cero | Devolver cumplimiento `null`, semáforo gris "sin meta" |
| `valor = 0` en *menor es mejor* | División entre cero | Es el caso ideal (cero defectos) → 100% |
| `valor` negativo | Porcentaje sin sentido | Rechazar en validación, o tratar como 0 |
| Cumplimiento > 100% | Superó la meta | Guardarlo real (útil saber que rindió 130%), pero topar la **barra visual** en 100% |
| KPI tipo `boolean` | Solo 0 o 1 | 0 → 0%, 1 → 100%. Sin fórmula |

### Umbrales configurables

Hoy el 80 y el 50 están escritos a mano en el código. Distintas empresas —y distintos departamentos— manejan criterios distintos.

Dos opciones:

- **Por empresa** (`companies.threshold_green`, `threshold_yellow`): simple, cubre el 90% de los casos.
- **Por KPI** (mismas columnas en `kpis`, nullable, y si están vacías se usa el de la empresa): más flexible, más campos en el formulario.

Recomiendo empezar por empresa. Es menos trabajo y se puede extender después sin migrar datos.

---

## 3. Dónde calcular: backend, no frontend

Hoy el cálculo vive en Vue (`kpiStore.js`) y se recalcula cada vez que se pinta la pantalla. Debe moverse al backend y **guardarse** en `kpi_results` en el momento en que se captura una métrica.

### Por qué esto importa (la razón de peso)

**Las metas cambian con el tiempo.** Si en enero la meta de ventas era 100 000 y en julio la suben a 150 000, con el cálculo al vuelo *todo el historial de enero a junio se re-evalúa contra la meta nueva* y meses que fueron verdes se vuelven rojos retroactivamente.

Eso es inaceptable en un sistema que la empresa va a usar para evaluar desempeño. El cumplimiento de un periodo debe quedar congelado con la meta que estaba vigente en ese momento.

Guardar en `kpi_results` resuelve esto: se calcula una vez, al capturar, y ahí queda.

### Razones secundarias

- Las exportaciones a PDF y Excel hoy no pueden mostrar el semáforo, porque la lógica está en el navegador.
- Si mañana hay una app móvil o un reporte automático, tendrían que reimplementar la misma fórmula.
- Comparar y graficar cumplimiento se vuelve una consulta simple en vez de un cálculo en el cliente.

### Cómo quedaría

Un servicio dedicado, `KpiEvaluationService`, con un método:

```php
public function evaluar(Kpi $kpi, float $valor): array
{
    // devuelve ['completion_percentage' => 92.5, 'traffic_light' => 'green']
}
```

Se llama desde `KpiRecordController::store()` justo después de guardar la captura, y se escribe la fila en `kpi_results`.

Ventaja de aislarlo en un servicio: toda la lógica de negocio queda en **un solo archivo**, testeable, y quien mantenga el proyecto después sabe exactamente dónde buscar.

El frontend deja de calcular y solo lee `completion_percentage` y `traffic_light` que ya vienen de la API.

---

## 4. Línea de meta en las gráficas

La parte más sencilla de todo el documento.

El proyecto usa **ApexCharts** (`vue3-apexcharts`), que tiene soporte nativo para líneas de referencia. No hace falta instalar nada:

```js
annotations: {
  yaxis: [{
    y: kpi.goal,
    borderColor: '#16a34a',
    strokeDashArray: 4,
    label: {
      text: `Meta: ${kpi.goal} ${kpi.unit ?? ''}`,
      style: { background: '#16a34a', color: '#fff' }
    }
  }]
}
```

Se agrega a `chartOptions` en `GraficaKpiEspecifica.vue`.

**Un detalle de diseño:** cuando la dirección es *menor es mejor*, conviene invertir el color del área o al menos la etiqueta, porque estar *por encima* de la línea es malo. Si no, el usuario lee la gráfica al revés. Una etiqueta que diga "Meta: máx. 5 min" en vez de solo "Meta: 5" ya lo resuelve sin complicar el código.

---

## 5. Comparar varios KPIs en una gráfica

Tu observación es correcta y es el corazón del problema: no se pueden poner pesos y porcentajes en el mismo eje. Pero hay una solución mejor que restringir por unidad.

### Opción A — Comparar por % de cumplimiento (la recomendada)

En lugar de graficar los valores crudos, graficar el **porcentaje de cumplimiento** de cada KPI.

Esto funciona porque:

- Todos los KPIs quedan en la misma escala 0–100%, sin importar si son pesos, minutos, puntos o unidades.
- Hay **una sola línea de meta en 100%**, común a todos.
- Un KPI de "reducir defectos" y uno de "aumentar ventas" se pueden comparar directamente, porque ambos se leen como "qué tan cerca está de su objetivo".

Y responde exactamente la pregunta del coordinador: *"¿se están comportando igual?"*, *"¿uno depende de otro?"*. Eso se ve en la **forma de las curvas**, no en su magnitud absoluta.

**Lo importante:** esta opción solo es posible si primero se implementa la sección 2. El cálculo de cumplimiento resuelve el problema de comparación *de forma gratuita*. Por eso el orden de implementación importa.

### Opción B — Comparar valores crudos, restringido a la misma unidad

Útil cuando sí interesa la magnitud: comparar las ventas de tres sucursales en pesos.

Implementación: al elegir el primer KPI, el selector filtra los demás para que solo se puedan agregar KPIs con el mismo `type` **y** la misma `unit`. Si el usuario elige uno de tipo `money`, desaparecen de la lista los de tipo `percentage`.

Es la que tú planteaste, y es válida — pero como complemento de la A, no como reemplazo.

### Opción C — Doble eje Y

Dos KPIs de distinta unidad, cada uno con su propio eje. ApexCharts lo soporta.

**No la recomiendo como opción principal.** Con dos escalas distintas se puede hacer que dos series "parezcan" correlacionadas solo ajustando los ejes. Es una gráfica fácil de malinterpretar, y en un sistema de evaluación de desempeño eso es un riesgo. Si se incluye, que sea limitada a exactamente 2 series y con los ejes claramente etiquetados con colores.

### El problema de la periodicidad

Un punto que suele pasarse por alto: **no se pueden comparar directamente KPIs con frecuencias distintas.** Uno diario tiene 30 puntos al mes; uno mensual tiene 1.

Opciones:

- Permitir comparar solo KPIs con la misma `frequency` (simple, restrictivo).
- Agregar los datos a la frecuencia más gruesa de las seleccionadas — promediar los valores diarios para obtener el mensual (más flexible, más trabajo, y hay que decidir si se promedia o se suma según el KPI).

Para la primera versión recomiendo restringir por frecuencia. Es honesto y evita gráficas engañosas.

### Extra: detectar dependencia entre KPIs

El coordinador mencionó querer ver *"si alguno depende de otro"*. Eso se mide con el **coeficiente de correlación de Pearson**, un número entre -1 y 1:

- Cerca de **1**: cuando uno sube, el otro sube.
- Cerca de **-1**: cuando uno sube, el otro baja.
- Cerca de **0**: no hay relación aparente.

Se puede mostrar como un texto debajo de la gráfica: *"Correlación: 0.87 — estos KPIs se mueven juntos"*.

Es una función corta de implementar y de mucho valor percibido. Pero debe presentarse con cuidado: **correlación no es causalidad**, y conviene advertirlo en la interfaz para no inducir conclusiones equivocadas.

---

## 6. Orden de implementación sugerido

Cada paso deja el sistema funcionando y habilita el siguiente.

| # | Cambio | Alcance | Habilita |
|---|---|---|---|
| 1 | Columna `direction` + umbrales por empresa | Migración + formulario de KPIs | Base de todo |
| 2 | `KpiEvaluationService` + escribir en `kpi_results` | Backend | Semáforo correcto e histórico |
| 3 | Frontend lee cumplimiento de la API | `kpiStore.js` | Quitar el cálculo duplicado |
| 4 | Línea de meta en gráfica específica | `GraficaKpiEspecifica.vue` | Petición del asesor |
| 5 | Gráfica comparativa por % cumplimiento | Componente nuevo | Petición del coordinador |
| 6 | Comparación por valor crudo (misma unidad) | Filtro en el selector | Complemento |
| 7 | Correlación entre dos KPIs | Cálculo + texto | Extra de valor |

**Los pasos 1 a 3 son los importantes.** Corrigen un error de fondo: hoy el semáforo del sistema es incorrecto para la mayoría de los KPIs, y eso es más grave que cualquier funcionalidad que falte. Los pasos 4 en adelante son las peticiones nuevas, y salen mucho más fáciles una vez hecho lo anterior.

---

## 7. Qué mostrarle al coordinador

Un resumen en lenguaje no técnico, por si sirve para la siguiente presentación:

> El sistema ya guarda las metas de cada KPI, pero no las estaba usando para evaluar el resultado. Vamos a agregar un campo que indica si para cada indicador *"más es mejor"* o *"menos es mejor"*, porque no se evalúa igual un KPI de ventas que uno de tiempo de respuesta.
>
> Con eso, el sistema podrá calcular el **porcentaje de cumplimiento** de cada KPI y guardarlo mes con mes. Eso permite tres cosas: que el semáforo sea correcto, que la gráfica muestre la línea de meta, y —lo más importante para comparar— que cualquier par de KPIs se pueda poner en la misma gráfica, porque todos se miden en la misma escala de 0 a 100% de cumplimiento.
