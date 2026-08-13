# Recordatorio: cómo implementar las fórmulas

Resumen práctico de todo lo acordado. Para tener a la mano mientras se programa.

---

## 1. Hay dos tipos de KPI

**KPI capturado (simple).** Alguien escribe el valor cada periodo.
*Ventas de la semana: 190 000*

**KPI calculado (compuesto).** El sistema lo calcula a partir de otros dos KPIs. Nadie lo captura.
*Tasa de conversión = Ventas cerradas ÷ Oportunidades × 100*

La casilla **"¿Es un KPI calculado?"** del formulario es la que decide cuál es.

---

## 2. La fórmula tiene una sola estructura

```
( KPI_A   [ operación ]   KPI_B )   ×   constante
```

- Operaciones: `+`  `−`  `×`  `÷`
- Constante: por defecto **1**. Se usa 100 para porcentajes.
- Solo **dos** KPIs. Nada de tres o más por ahora.
- **El orden importa:** `A ÷ B` no es lo mismo que `B ÷ A`.

Con eso salen todas las fórmulas reales:

| KPI | Cómo se arma |
|---|---|
| Tasa de conversión | (Ventas cerradas ÷ Oportunidades) × 100 |
| Ticket promedio | (Ingresos ÷ Núm. de ventas) × 1 |
| Margen | (Ingresos − Costos) × 1 |
| Ventas totales | (Sucursal A + Sucursal B) × 1 |

**El usuario nunca escribe la fórmula a mano.** Elige de selectores. Texto libre significaría interpretar lo que escriban, y eso es riesgoso y se presta a errores.

---

## 3. Reglas para elegir los dos KPIs

El selector **solo** debe mostrar KPIs que cumplan las tres:

| Regla | Por qué |
|---|---|
| De la **misma empresa** | Nunca mezclar datos entre empresas |
| De la **misma periodicidad** | No se puede dividir un dato semanal entre uno mensual |
| Que **no tengan fórmula** (solo capturados) | Evita el bucle infinito |

La tercera regla es la más importante. Si un KPI calculado solo puede usar KPIs capturados, **es imposible crear una referencia circular**, y no hay que programar ninguna detección.

Sí pueden ser de **departamentos distintos** — de hecho los KPIs más valiosos de una empresa cruzan departamentos (margen usa Ventas y Producción, CAC usa Marketing y Ventas). En ese caso el KPI calculado se asigna al departamento del **responsable del resultado**, no al de los datos.

---

## 4. Qué cambia en cada pantalla

### Formulario de KPI

Cuando marcan "Es un KPI calculado":

- Aparece el bloque de fórmula con los tres selectores + la constante.
- Aparece la **vista previa en vivo**: `(45 ÷ 300) × 100 = 15%`
- **Se oculta el campo "Valor inicial"** — un KPI calculado no tiene valor inicial.
- La meta **sí se queda**. La tasa de conversión da 15%, y la meta puede ser 20%.

### Pantalla de captura de métricas

**Los KPIs calculados NO deben aparecer aquí.**

Si aparecen, alguien va a capturarles un valor a mano y habría dos números peleándose: el capturado y el calculado. Se filtran igual que en el selector: se excluyen los que tienen fórmula.

### Panel principal y tablas

Aquí sí aparecen normal, junto con los demás. Para quien los ve, un KPI calculado se comporta igual que cualquier otro: tiene valor, meta y semáforo.

---

## 5. Cómo se calcula el semáforo

Usando la **meta** y el **valor inicial** que ya están en el formulario:

```
cumplimiento = (valor_actual − valor_inicial) ÷ (meta − valor_inicial) × 100
```

Esta fórmula funciona **en los dos sentidos sin necesidad de un campo extra**:

| KPI | Inicial | Meta | Actual | Resultado |
|---|---|---|---|---|
| Ventas | 0 | 850 000 | 830 000 | 97.6% |
| Tiempo de respuesta | 45 min | 5 min | 10 min | 87.5% |
| Defectos | 10 | 0 | 4 | 60% |

Cuando la meta es **menor** que el inicial, arriba y abajo quedan negativos y el signo se cancela solo. El sistema deduce que "menos es mejor" sin que nadie se lo diga.

Después se aplica el semáforo:

```
≥ 80%  →  verde   (saludable)
≥ 50%  →  amarillo (en riesgo)
< 50%  →  rojo    (crítico)
```

**Casos borde que hay que cubrir:**

| Situación | Qué hacer |
|---|---|
| `meta == valor_inicial` | División entre cero → mostrar gris "sin meta" |
| Cumplimiento negativo | Topar en 0% |
| Cumplimiento mayor a 100% | Guardarlo real, pero la barra visual se topa en 100% |
| Un componente sin capturas | Mostrar "Sin datos" en gris, **nunca 0** (un 0 parece crítico y no lo es) |
| División entre cero en la fórmula | Mostrar "Sin datos", no un error |

---

## 6. Para qué sirve todo esto después: la gráfica comparativa

Esta es la parte que pidió el jefe de departamento, y sale casi sola una vez hecho lo anterior.

### El problema

No se pueden poner pesos y porcentajes en la misma gráfica. Un KPI de 850 000 y otro de 15% no caben en el mismo eje.

### La solución

Graficar el **porcentaje de cumplimiento** en vez del valor crudo.

Todos los KPIs quedan en escala 0–100%, sin importar si son pesos, minutos o puntos. Una sola línea de meta en 100%, común a todos. Y cualquier par de KPIs se vuelve comparable.

Eso responde exactamente lo que preguntó el jefe: *"¿se están comportando igual?"*, *"¿uno depende de otro?"*. Se ve en la **forma de las curvas**, no en su tamaño.

### La conexión

El paso 5 de este documento es lo que hace posible la gráfica comparativa. Sin el porcentaje de cumplimiento no hay forma de comparar KPIs de distinta unidad. **Al implementar el cálculo del semáforo se está construyendo también la base de la gráfica.**

### La línea de meta

El proyecto usa ApexCharts, que ya trae líneas de referencia. No hay que instalar nada:

```js
annotations: {
  yaxis: [{
    y: kpi.goal,
    borderColor: '#16a34a',
    strokeDashArray: 4,
    label: { text: `Meta: ${kpi.goal}` }
  }]
}
```

---

## 7. Orden sugerido

| # | Qué | Deja listo |
|---|---|---|
| 1 | Cumplimiento con meta y valor inicial | Semáforo correcto |
| 2 | Selectores de fórmula + vista previa | Lo que se presenta |
| 3 | Cálculo del KPI compuesto en backend | Que el número sea real |
| 4 | Ocultar calculados en captura de métricas | Evita datos duplicados |
| 5 | Línea de meta en la gráfica | Petición del asesor |
| 6 | Gráfica comparativa por % de cumplimiento | Petición del jefe |

Los pasos 1 a 4 son los de la entrega. El 5 y el 6 vienen después y ya no cuestan tanto.

---

## 8. Lo que quedó fuera a propósito

Para que quede claro que fue una decisión, no un olvido:

- **Fórmulas con más de dos KPIs.** Se resuelve encadenando: se crea un compuesto intermedio y se usa ese.
- **Detección de referencias circulares.** No hace falta mientras los operandos solo puedan ser KPIs capturados.
- **Motor de fórmulas con texto libre.** Riesgo de seguridad y de errores del usuario, sin beneficio real.
- **Consolidación del periodo** (sumar las capturas semanales para comparar contra una meta mensual). Es un tema aparte y conviene resolverlo con calma.
