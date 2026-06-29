# Modelos de Referencia — GestiónKPI

Usa este archivo como guía. Intenta hacerlos tú primero y solo copia aquí si algo está muy mal.

---

## 1. Company.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'legal_name',
        'tax_id',
        'address',
        'phone',
        'email',
        'logo',
        'status',
    ];

    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function kpis()
    {
        return $this->hasMany(Kpi::class);
    }
}
```

---

## 2. Department.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'company_id',
        'manager_id',
    ];

    // Pertenece a una empresa
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Su manager es un usuario
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    // Tiene muchos equipos
    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    // Tiene muchos usuarios
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
```

> **Nota:** En `manager()` se pasa `'manager_id'` como segundo parámetro porque el nombre de la FK no sigue la convención automática de Laravel (`department_id`).

---

## 3. Team.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'department_id',
        'leader_id',
    ];

    // Pertenece a un departamento
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // Su líder es un usuario
    public function leader()
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    // Tiene muchos usuarios
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
```

---

## 4. User.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'paternal',
        'maternal',
        'email',
        'password',
        'phone',
        'status',
        'last_login',
        'company_id',
        'department_id',
        'team_id',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password'   => 'hashed',
        'last_login' => 'datetime',
    ];

    // Pertenece a una empresa
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Pertenece a un departamento
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // Pertenece a un equipo
    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    // Tiene muchos roles (tabla pivot user_roles)
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles')
                    ->withPivot('company_id');
    }

    // KPIs que creó
    public function kpis()
    {
        return $this->hasMany(Kpi::class, 'created_by');
    }

    // KPIs asignados
    public function kpiAssignments()
    {
        return $this->hasMany(KpiAssignment::class);
    }
}
```

> **Nota:** `User` extiende `Authenticatable` en vez de `Model` — es lo que permite el login. No lo cambies.

---

## 5. Role.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'is_system',
    ];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    // Tiene muchos permisos (tabla pivot role_permissions)
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permissions');
    }

    // Tiene muchos usuarios (tabla pivot user_roles)
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles')
                    ->withPivot('company_id');
    }
}
```

---

## 6. Permission.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    public $timestamps = false; // solo tiene created_at, no updated_at

    protected $fillable = [
        'name',
        'code',
        'module',
        'description',
    ];

    // Tiene muchos roles
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permissions');
    }
}
```

---

## 7. Kpi.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kpi extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'subtitle',
        'description',
        'type',
        'unit',
        'formula',
        'frequency',
        'goal',
        'minimum',
        'maximum',
        'weight',
        'status',
        'company_id',
        'created_by',
    ];

    protected $casts = [
        'goal'    => 'decimal:4',
        'minimum' => 'decimal:4',
        'maximum' => 'decimal:4',
        'weight'  => 'decimal:2',
    ];

    // Pertenece a una empresa
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Fue creado por un usuario
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Tiene muchas asignaciones
    public function assignments()
    {
        return $this->hasMany(KpiAssignment::class);
    }

    // Tiene muchos registros de captura
    public function records()
    {
        return $this->hasMany(KpiRecord::class);
    }

    // Tiene muchos resultados
    public function results()
    {
        return $this->hasMany(KpiResult::class);
    }

    // El resultado más reciente (para traffic_light y progreso)
    public function latestResult()
    {
        return $this->hasOne(KpiResult::class)->latestOfMany('calculated_at');
    }
}
```

---

## 8. KpiAssignment.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KpiAssignment extends Model
{
    protected $fillable = [
        'kpi_id',
        'user_id',
        'department_id',
        'team_id',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    public function kpi()
    {
        return $this->belongsTo(Kpi::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function records()
    {
        return $this->hasMany(KpiRecord::class);
    }
}
```

---

## 9. KpiRecord.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KpiRecord extends Model
{
    protected $fillable = [
        'kpi_id',
        'kpi_assignment_id',
        'captured_by',
        'value',
        'period_start',
        'period_end',
        'notes',
    ];

    protected $casts = [
        'value'        => 'decimal:4',
        'period_start' => 'date',
        'period_end'   => 'date',
    ];

    public function kpi()
    {
        return $this->belongsTo(Kpi::class);
    }

    public function assignment()
    {
        return $this->belongsTo(KpiAssignment::class, 'kpi_assignment_id');
    }

    public function capturedBy()
    {
        return $this->belongsTo(User::class, 'captured_by');
    }

    public function result()
    {
        return $this->hasOne(KpiResult::class);
    }
}
```

---

## 10. KpiResult.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KpiResult extends Model
{
    public $timestamps = false; // solo tiene calculated_at

    protected $fillable = [
        'kpi_id',
        'kpi_record_id',
        'completion_percentage',
        'traffic_light',
        'period_start',
        'period_end',
    ];

    protected $casts = [
        'completion_percentage' => 'decimal:4',
        'period_start'          => 'date',
        'period_end'            => 'date',
        'calculated_at'         => 'datetime',
    ];

    public function kpi()
    {
        return $this->belongsTo(Kpi::class);
    }

    public function record()
    {
        return $this->belongsTo(KpiRecord::class, 'kpi_record_id');
    }
}
```

---

## 11. Dashboard.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dashboard extends Model
{
    protected $fillable = [
        'name',
        'is_public',
        'settings',
        'user_id',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'settings'  => 'array', // guarda JSON, lo convierte a array automáticamente
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function widgets()
    {
        return $this->hasMany(DashboardWidget::class);
    }
}
```

---

## 12. DashboardWidget.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DashboardWidget extends Model
{
    protected $fillable = [
        'dashboard_id',
        'kpi_id',
        'type',
        'title',
        'settings',
        'position_x',
        'position_y',
        'width',
        'height',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public function dashboard()
    {
        return $this->belongsTo(Dashboard::class);
    }

    public function kpi()
    {
        return $this->belongsTo(Kpi::class);
    }
}
```

---

## 13. Notification.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    public $timestamps = false; // solo tiene created_at

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'read',
        'read_at',
        'reference_type',
        'reference_id',
    ];

    protected $casts = [
        'read'       => 'boolean',
        'read_at'    => 'datetime',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

---

## 14. AuditLog.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = false; // solo tiene created_at

    protected $fillable = [
        'user_id',
        'company_id',
        'module',
        'action',
        'entity_type',
        'entity_id',
        'old_data',
        'new_data',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_data'   => 'array',
        'new_data'   => 'array',
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
```

---

## 15. PasswordReset.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'user_id';

    protected $fillable = [
        'user_id',
        'email',
        'token',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```
