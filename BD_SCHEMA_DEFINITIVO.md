# Schema Definitivo — GestiónKPI
> Referencia para migraciones de Laravel. Basado en el LDM `BD_GESTIONKPI.ldm` con 5 correcciones aplicadas.

---

## Correcciones aplicadas al LDM original

| # | Tabla | Corrección |
|---|-------|-----------|
| 1 | `companies` | Añadir columna `plan ENUM('basic','professional','enterprise')` |
| 2 | `kpis` | Añadir columna `subtitle VARCHAR(120) NULL` |
| 3 | `kpis` | Añadir `'quarterly'` al ENUM de `frequency` |
| 4 | `users` | Añadir `'absent'` al ENUM de `status` |
| 5 | `dashboard_widgets` | Renombrar columna `WITH` → `WIDTH` (typo en LDM) |

---

## Convenciones Laravel usadas en todas las migraciones

- `$table->id()` — bigint unsigned auto-increment (PK)
- `$table->timestamps()` — `created_at` + `updated_at`
- `$table->softDeletes()` — `deleted_at` (solo en entidades principales)
- `$table->foreignId('x_id')->constrained('tabla')->...` — FK con constraint
- Columnas nullable llevan `->nullable()`
- ENUMs usan `$table->enum('col', [...])`

---

## Tablas

### 1. `companies`
```php
Schema::create('companies', function (Blueprint $table) {
    $table->id();
    $table->string('name', 80);
    $table->string('legal_name', 150)->nullable();
    $table->string('tax_id', 13)->nullable();          // RFC
    $table->text('address')->nullable();
    $table->string('phone', 15)->nullable();
    $table->string('email', 150)->nullable();
    $table->string('logo', 400)->nullable();
    $table->enum('plan', ['basic', 'professional', 'enterprise'])->default('basic'); // ← AÑADIDO
    $table->enum('status', ['active', 'inactive'])->default('active');
    $table->timestamps();
    $table->softDeletes();
});
```
**Store:** `orgStore.empresas` — campo `plan` añadido ✓

---

### 2. `departments`
```php
Schema::create('departments', function (Blueprint $table) {
    $table->id();
    $table->string('name', 50);
    $table->text('description')->nullable();
    $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
    $table->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamps();
    $table->softDeletes();
});
```

---

### 3. `teams`
```php
Schema::create('teams', function (Blueprint $table) {
    $table->id();
    $table->string('name', 60);
    $table->text('description')->nullable();
    $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
    $table->foreignId('leader_id')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamps();
    $table->softDeletes();
});
```

---

### 4. `users`
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name', 50);
    $table->string('paternal', 40)->nullable();
    $table->string('maternal', 40)->nullable();
    $table->string('email', 100)->unique();
    $table->string('password', 255);
    $table->string('phone', 15)->nullable();
    $table->enum('status', ['active', 'inactive', 'blocked', 'absent'])->default('active'); // 'absent' ← AÑADIDO
    $table->timestamp('last_login')->nullable();
    $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();
    $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
    $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
    $table->timestamps();
    $table->softDeletes();
});
```
> **Nota Laravel:** el campo `rol` que ves en el store es un dato calculado que viene de la relación `user_roles`. En el modelo User usa: `public function roles() { return $this->belongsToMany(Role::class, 'user_roles')->withPivot('company_id'); }`

---

### 5. `roles`
```php
Schema::create('roles', function (Blueprint $table) {
    $table->id();
    $table->string('code', 20)->unique();
    $table->string('name', 30);
    $table->text('description')->nullable();
    $table->boolean('is_system')->default(false);
    $table->timestamps();
});
```

---

### 6. `permissions`
```php
Schema::create('permissions', function (Blueprint $table) {
    $table->id();
    $table->string('name', 50);
    $table->string('code', 50)->unique();
    $table->string('module', 30);
    $table->text('description')->nullable();
    $table->timestamp('created_at')->useCurrent();
});
```

---

### 7. `role_permissions` (pivot)
```php
Schema::create('role_permissions', function (Blueprint $table) {
    $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
    $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
    $table->primary(['role_id', 'permission_id']);
});
```

---

### 8. `user_roles` (pivot con company_id)
```php
Schema::create('user_roles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
    $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
    $table->timestamp('created_at')->useCurrent();
    $table->unique(['user_id', 'role_id', 'company_id']);
});
```

---

### 9. `kpis`
```php
Schema::create('kpis', function (Blueprint $table) {
    $table->id();
    $table->string('name', 100);
    $table->string('subtitle', 120)->nullable();   // ← AÑADIDO (no estaba en LDM)
    $table->text('description')->nullable();
    $table->enum('type', ['percentage', 'money', 'time', 'boolean', 'absolute', 'custom']);
    $table->string('unit', 20)->nullable();         // '%', 'ms', '$', 'pts'
    $table->text('formula')->nullable();
    $table->enum('frequency', [
        'daily', 'weekly', 'biweekly', 'monthly',
        'bimonthly', 'quarterly', 'semiannual', 'annual' // 'quarterly' ← AÑADIDO
    ]);
    $table->decimal('goal', 12, 4)->nullable();
    $table->decimal('minimum', 12, 4)->nullable();
    $table->decimal('maximum', 12, 4)->nullable();
    $table->decimal('weight', 4, 2)->default(1.00);
    $table->enum('status', ['active', 'inactive'])->default('active');
    $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
    $table->foreignId('created_by')->constrained('users');
    $table->timestamps();
    $table->softDeletes();
});
```
**Mapa store → BD:**
| Store (kpiStore) | BD (kpis) |
|---|---|
| `nombre` | `name` |
| `subtitulo` | `subtitle` |
| — | `description` (no usado en UI aún) |
| `tipoMetrica` | `type` |
| `unit` | `unit` |
| `formula` | `formula` |
| `periodicidad` | `frequency` |
| `goal` | `goal` |
| `minimum` | `minimum` |
| `maximum` | `maximum` |
| `weight` | `weight` |
| `status` | `status` |
| `company_id` | `company_id` |
| `created_by` | `created_by` |
| `traffic_light` *(mock)* | *viene de `kpi_results` (ver abajo)* |
| `progreso` *(mock)* | *viene de `kpi_results.completion_percentage`* |

---

### 10. `kpi_assignments`
```php
Schema::create('kpi_assignments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('kpi_id')->constrained('kpis')->cascadeOnDelete();
    $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
    $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
    $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
    $table->date('start_date');
    $table->date('end_date')->nullable();
    $table->enum('status', ['active', 'inactive'])->default('active');
    $table->timestamps();
});
```

---

### 11. `kpi_records`
```php
Schema::create('kpi_records', function (Blueprint $table) {
    $table->id();
    $table->foreignId('kpi_id')->constrained('kpis')->cascadeOnDelete();
    $table->foreignId('kpi_assignment_id')->nullable()->constrained('kpi_assignments')->nullOnDelete();
    $table->foreignId('captured_by')->constrained('users');
    $table->decimal('value', 12, 4);
    $table->date('period_start');
    $table->date('period_end')->nullable();
    $table->text('notes')->nullable();
    $table->timestamps();
});
```
**Mapa store → BD:**
| Store (capturas) | BD (kpi_records) |
|---|---|
| `kpi_id` | `kpi_id` |
| `kpi_assignment_id` | `kpi_assignment_id` |
| `captured_by` | `captured_by` |
| `value` | `value` |
| `period_start` | `period_start` |
| `period_end` | `period_end` |
| `notes` | `notes` |
| `created_at` | `created_at` |

---

### 12. `kpi_results`
> Tabla calculada. Se genera automáticamente cuando se registra un `kpi_record`. Aquí vive `traffic_light`.
> En el store mock, `traffic_light` y `progreso` están directamente en cada KPI por conveniencia.
> En la API Laravel, se cargarán con: `$kpi->latestResult` (relación `hasOne` ordenada por `calculated_at` DESC).

```php
Schema::create('kpi_results', function (Blueprint $table) {
    $table->id();
    $table->foreignId('kpi_id')->constrained('kpis')->cascadeOnDelete();
    $table->foreignId('kpi_record_id')->constrained('kpi_records')->cascadeOnDelete();
    $table->decimal('completion_percentage', 8, 4);
    $table->enum('traffic_light', ['green', 'yellow', 'red']);
    $table->date('period_start');
    $table->date('period_end')->nullable();
    $table->timestamp('calculated_at')->useCurrent();
});
```

---

### 13. `dashboards`
```php
Schema::create('dashboards', function (Blueprint $table) {
    $table->id();
    $table->string('name', 60);
    $table->boolean('is_public')->default(false);
    $table->text('settings')->nullable();   // JSON de configuración
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();
});
```

---

### 14. `dashboard_widgets`
```php
Schema::create('dashboard_widgets', function (Blueprint $table) {
    $table->id();
    $table->foreignId('dashboard_id')->constrained('dashboards')->cascadeOnDelete();
    $table->foreignId('kpi_id')->nullable()->constrained('kpis')->nullOnDelete();
    $table->enum('type', ['card', 'line_chart', 'bar_chart', 'gauge', 'table', 'text']);
    $table->string('title', 60)->nullable();
    $table->text('settings')->nullable();   // JSON
    $table->tinyInteger('position_x')->default(0);
    $table->tinyInteger('position_y')->default(0);
    $table->tinyInteger('width')->default(1);  // ← corregido (LDM tenía 'WITH')
    $table->tinyInteger('height')->default(1);
    $table->timestamps();
});
```

---

### 15. `notifications`
```php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->enum('type', ['limit_alert', 'capture_reminder', 'report', 'system']);
    $table->string('title', 80);
    $table->text('message');
    $table->boolean('read')->default(false);
    $table->timestamp('read_at')->nullable();
    $table->string('reference_type', 30)->nullable();  // morphable
    $table->unsignedBigInteger('reference_id')->nullable();
    $table->timestamp('created_at')->useCurrent();
});
```

---

### 16. `audit_logs`
```php
Schema::create('audit_logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users');
    $table->foreignId('company_id')->constrained('companies');
    $table->string('module', 25);
    $table->string('action', 20);   // 'create','update','delete','login'
    $table->string('entity_type', 40)->nullable();
    $table->unsignedBigInteger('entity_id')->nullable();
    $table->text('old_data')->nullable();   // JSON
    $table->text('new_data')->nullable();   // JSON
    $table->string('ip_address', 45)->nullable();
    $table->text('user_agent')->nullable();
    $table->timestamp('created_at')->useCurrent();
});
```

---

### 17. `password_resets`
```php
Schema::create('password_resets', function (Blueprint $table) {
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->string('email', 100)->index();
    $table->string('token', 60);
    $table->timestamp('created_at')->useCurrent();
    $table->primary('user_id');
});
```

---

## Orden de migraciones (respeta FKs)

```
01  companies
02  departments          → companies
03  teams                → departments (users FK viene después, se añade con ->change())
04  users                → companies, departments, teams
05  roles
06  permissions
07  role_permissions     → roles, permissions
08  user_roles           → users, roles, companies
09  kpis                 → companies, users
10  kpi_assignments      → kpis, users, departments, teams
11  kpi_records          → kpis, kpi_assignments, users
12  kpi_results          → kpis, kpi_records
13  dashboards           → users
14  dashboard_widgets    → dashboards, kpis
15  notifications        → users
16  audit_logs           → users, companies
17  password_resets      → users

⚠ FK circular: departments.manager_id → users y users.department_id → departments
   Solución: crear departments sin manager_id, crear users, luego añadir la FK con una migración adicional.
```

---

## Notas de implementación Laravel

- **Soft deletes** en: `companies`, `departments`, `teams`, `users`, `kpis`
- **`traffic_light` en la API:** cargar con `$kpi->load('latestResult')` y exponer en el recurso JSON. El store de Vue lo tendrá precargado en la respuesta del endpoint `/api/kpis`.
- **Roles:** usar `spatie/laravel-permission` o la tabla `user_roles` custom (ya modelada). El campo `rol` del store viene de `user->roles->first()->code`.
- **`kpi_results`** se calcula en un Observer de `KpiRecord` al hacer `created`/`updated`.
- **ENUMs** en Laravel: si se necesita agregar valores en el futuro, usar `string` + validación en vez de ENUM para mayor flexibilidad en MySQL.
