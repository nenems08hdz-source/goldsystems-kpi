# Contexto del Proyecto — GestiónKPI

## Stack
- **Frontend:** Vue.js + Pinia + Tailwind CSS → `C:\Users\nenem\goldsystems-kpi`
- **Backend:** Laravel 13 (API pura) → `C:\laragon\www\gestionkpi-api`
- **BD:** MariaDB/MySQL via Laragon (puerto 3306, user: root, pass: vacío)
- **BD name:** `gestionkpi`

## Estado actual
- Frontend completo con datos mock en stores
- Backend creado con `laravel new gestionkpi-api --no-interaction`
- `.env` ya configurado con DB_CONNECTION=mysql, DB_DATABASE=gestionkpi
- Migraciones base creadas y pusheadas a GitHub
- `php artisan migrate` da error en `teams` por typo `foreignnId` (doble n)

## GitHub
- Frontend: `https://github.com/nenems08hdz-source/goldsystems-kpi` (privado)
- Backend: `https://github.com/nenems08hdz-source/gestionkpi-api` (privado)
- Colaboradora: Kelly (`C:\Users\Kelly\ProyectoKpis\`)

## Migraciones creadas (en orden)
| # | Archivo | Estado |
|---|---------|--------|
| 01 | create_companies_table | ✅ OK |
| 02 | create_departments_table | ✅ OK (sin manager_id por FK circular) |
| 03 | create_teams_table | ❌ ERROR — `foreignnId` typo, corregir a `foreignId` |
| 04 | create_users_table | ✅ OK |
| 05 | create_roles_table | ✅ OK |
| 06 | create_permissions_table | ✅ OK |
| 07 | create_role_permissions_table | ✅ OK |
| 08 | create_user_roles_table | ✅ OK |
| 18 | add_manager_leader_fks | ✅ OK (añade manager_id y leader_id al final) |

## Migraciones pendientes (las hace Kelly)
- 09 create_kpis_table
- 10 create_kpi_assignments_table
- 11 create_kpi_records_table
- 12 create_kpi_results_table
- 13 create_dashboards_table
- 14 create_dashboard_widgets_table
- 15 create_notifications_table
- 16 create_audit_logs_table
- 17 create_password_resets_table

## Schema de BD (resumido)
Ver `BD_SCHEMA_DEFINITIVO.md` en `C:\Users\nenem\goldsystems-kpi\` para el código completo de cada migración.

### Tablas principales
- `companies` → plan ENUM omitido (no es app de pago)
- `departments` → sin manager_id en migración (se añade en mig 18)
- `teams` → sin leader_id en migración (se añade en mig 18)
- `users` → status ENUM('active','inactive','blocked','absent'), tiene FKs a companies/departments/teams
- `roles` → code UNIQUE, sin softDeletes
- `permissions` → code UNIQUE, solo created_at
- `role_permissions` → pivot, PK compuesta (role_id, permission_id), sin id ni timestamps
- `user_roles` → pivot con company_id, UNIQUE(user_id, role_id, company_id)
- `kpis` → type ENUM, frequency ENUM (incluye quarterly), subtitle añadido
- `kpi_records` → captured_by FK→users, value decimal
- `kpi_results` → traffic_light ENUM('green','yellow','red'), completion_percentage
- `dashboard_widgets` → width (no WITH, era typo en LDM)

### FK circular resuelta
departments.manager_id → users y teams.leader_id → users
Se añaden en migración 18 (add_manager_leader_fks) después de crear users.

## Mapa Store Vue ↔ BD
| Store | Campo store | Columna BD | Tabla |
|-------|-------------|-----------|-------|
| kpiStore | nombre | name | kpis |
| kpiStore | subtitulo | subtitle | kpis |
| kpiStore | tipoMetrica | type | kpis |
| kpiStore | periodicidad | frequency | kpis |
| kpiStore | goal | goal | kpis |
| kpiStore | unit | unit | kpis |
| kpiStore | traffic_light | traffic_light | kpi_results |
| kpiStore | progreso | completion_percentage | kpi_results |
| kpiStore (capturas) | value | value | kpi_records |
| kpiStore (capturas) | period_start | period_start | kpi_records |
| kpiStore (capturas) | notes | notes | kpi_records |
| kpiStore (capturas) | captured_by | captured_by | kpi_records |
| kpiStore (kpisAsignados) | user_id | user_id | kpi_assignments |
| kpiStore (kpisAsignados) | start_date | start_date | kpi_assignments |
| orgStore | empresas[].plan | plan | companies |

## División de trabajo
- **Tú:** migraciones base (01-08 + 18) + modelos + controladores de companies/departments/teams/users/roles
- **Kelly:** migraciones 09-17 + modelos + controladores de kpis/assignments/records/results/dashboards/notifications

## Siguiente paso inmediato
1. Corregir typo en `create_teams_table.php`: `foreignnId` → `foreignId`
2. Kelly hace `git pull` y crea sus migraciones (09-17)
3. Cuando Kelly termina: tú haces `git pull` y corres `php artisan migrate`
4. Después: Modelos → Seeders → Controladores → Rutas API → Conectar frontend

## Comandos útiles
```bash
# Correr backend
cd C:\laragon\www\gestionkpi-api
php artisan serve

# Correr frontend
cd C:\Users\nenem\goldsystems-kpi
npm run dev

# Migraciones
php artisan migrate           # correr pendientes
php artisan migrate:rollback  # deshacer última tanda
php artisan migrate:fresh     # borrar todo y re-correr (solo desarrollo)

# Crear modelo + migración
php artisan make:model NombreModelo -m

# Crear solo migración
php artisan make:migration nombre_migracion
```

## Estructura frontend relevante
```
src/
  stores/
    kpiStore.js    → indicadores, capturas, kpisAsignados
    orgStore.js    → usuarios, empresas, roles, estructura organizacional
  pantallas/
    GestionKpis.vue, FormularioKpis.vue, DetallesKpis.vue
    RegistroMetricas.vue (= CapturasMetricas.vue)
    ControlOrganizacional.vue, GestionEmpresas.vue
    FormularioUsuario.vue, FormularioDepartamento.vue, FormularioEquipo.vue
```
