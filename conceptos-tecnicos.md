# Conceptos Técnicos — Sistema de Gestión de KPIs

---

## KPI — Key Performance Indicator

**Indicador Clave de Desempeño.**  
Es una métrica que mide si un objetivo de negocio se está cumpliendo.

**Ejemplo en el sistema:**  
- KPI: "Cobertura de pruebas"  
- Meta: 85%  
- Valor actual: 92.8% → Estado: **Saludable** ✅

---

## Array

Un **array** (o arreglo) es una lista ordenada de elementos.

```js
// Array de KPIs
const kpis = ['Cobertura', 'Tiempo de respuesta', 'Satisfacción']

// Array de números
const valores = [92.8, 300, 4.5]
```

En el sistema se usan arrays para guardar listas de KPIs, departamentos, usuarios, etc.

---

## JSON — JavaScript Object Notation

Formato de texto para organizar y enviar datos entre el frontend y el backend.  
Es como un formulario con campos y valores.

```json
{
  "nombre": "Cobertura de pruebas",
  "meta": 85,
  "valor_actual": 92.8,
  "estado": "saludable"
}
```

Cuando el frontend pide un KPI al backend, el backend responde con JSON.

---

## API — Application Programming Interface

**Interfaz de Programación de Aplicaciones.**  
Es el canal de comunicación entre dos sistemas.

**Analogía:** Es como un mesero en un restaurante.  
- Tú (el frontend) haces un pedido.  
- El mesero (API) lo lleva a la cocina (backend).  
- La cocina prepara la respuesta y el mesero te la trae.

En el sistema: Vue.js (frontend) le pide datos a Laravel (backend) a través de la API.

---

## API REST — Representational State Transfer

Es un tipo específico de API que usa URLs y verbos HTTP para hacer operaciones:

| Verbo   | Acción       | Ejemplo en el sistema         |
|---------|-------------|-------------------------------|
| GET     | Obtener datos | `GET /api/kpis` → lista de KPIs |
| POST    | Crear        | `POST /api/kpis` → nuevo KPI    |
| PUT     | Editar       | `PUT /api/kpis/1` → editar KPI  |
| DELETE  | Eliminar     | `DELETE /api/kpis/1` → borrar   |

---

## Framework

Es una **base de código preescrita** con estructura y herramientas listas para usar.  
En lugar de construir todo desde cero, el framework te da el esqueleto y tú solo pones el contenido.

**Comparación:** Es como construir una casa en un terreno con cimientos ya puestos, en lugar de empezar desde la roca.

| Framework     | Rol en el sistema          |
|---------------|---------------------------|
| **Vue.js**    | Frontend (lo que ve el usuario) |
| **Laravel**   | Backend (lógica y base de datos) |
| **Tailwind**  | Estilos (cómo se ve la interfaz) |

---

*GoldSystems — 2026*
