<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LeaveController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// =========================
// ROUTES PUBLIQUES
// =========================
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// =========================
// ROUTES AUTHENTIFIÉES
// =========================
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard (accessible à tous les utilisateurs authentifiés)
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $departments = \App\Models\Department::with('leader')->get();
        $employees = \App\Models\User::with(['roles', 'department'])
            ->whereDoesntHave('roles', function($q) {
                $q->where('name', 'admin');
            })
            ->get();
        
        // Récupérer les congés selon le rôle
        $leavesQuery = \App\Models\Leave::with(['user', 'user.department'])
            ->orderBy('created_at', 'desc');

        if ($user->hasRole('leader')) {
            $leavesQuery->whereHas('user', function($q) use ($user) {
                $q->where('department_id', $user->department_id);
            });
        }

        $leaves = $leavesQuery->get();
        
        return Inertia::render('Dashboard', [
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'departments' => $departments,
            'employees' => $employees,
            'leaves' => $leaves,
            'meta' => [
                'current_page' => 1,
                'per_page' => 10,
                'total' => $employees->count(),
                'last_page' => ceil($employees->count() / 10)
            ],
            'links' => [
                'prev' => null,
                'next' => null
            ]
        ]);
    })->name('dashboard');

    // =========================
    // ADMIN
    // =========================
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/users', function () {
            return Inertia::render('Admin/Users');
        })->name('admin.users');
        Route::get('/admin/roles', function () {
            return Inertia::render('Admin/Roles');
        })->name('admin.roles');
    });

    // =========================
    // LEADER
    // =========================
    Route::middleware(['role:leader'])->group(function () {
        Route::get('/leader/team', function () {
            return Inertia::render('Leader/Team');
        })->name('leader.team');
        Route::get('/leader/reports', function () {
            return Inertia::render('Leader/Reports');
        })->name('leader.reports');
    });

    // =========================
    // EMPLOYEE
    // =========================
    Route::middleware(['role:employee'])->group(function () {
        Route::get('/employee/requests', function () {
            return Inertia::render('Employee/Requests');
        })->name('employee.requests');
        Route::get('/employee/reports', function () {
            return Inertia::render('Employee/Reports');
        })->name('employee.reports');
    });

    // =========================
    // PERMISSIONS SPATIE
    // =========================

    // Employés (admin ou toute personne ayant la permission)


    Route::prefix('employees')->name('employees')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('index');
        Route::post('/', [EmployeeController::class, 'store'])->name('store');
        Route::put('/{employee}', [EmployeeController::class, 'update'])->name('update');
        Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->name('destroy');
    });
    


    // Départements (admin ou toute personne ayant la permission)

    // Route::middleware(['permission:edit_department'])->group(function () {
    //     Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
    //     Route::post('/departments', [DepartmentController::class, 'store']);
    //     Route::put('/departments/{department}', [DepartmentController::class, 'update']);
    //     Route::delete('/departments/{department}', [DepartmentController::class, 'destroy']);
    //     Route::get('/departments/users', [DepartmentController::class, 'users']);
    // });
    Route::middleware(['auth'])->prefix('departments')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('departments.index');
        Route::get('/users', [DepartmentController::class, 'users']);
        Route::post('/', [DepartmentController::class, 'store']);
        Route::get('/{department}', [DepartmentController::class, 'show']);
        Route::put('/{department}', [DepartmentController::class, 'update']);
        Route::delete('/{department}', [DepartmentController::class, 'destroy']);
    });
    
    // Route::prefix('departments')->group(function () {
    //     Route::get('/', [DepartmentController::class, 'index'])->name('departments.index');
    //     Route::post('/', [DepartmentController::class, 'store']);
    //     Route::put('/{department}', [DepartmentController::class, 'update']);
    //     Route::delete('/{department}', [DepartmentController::class, 'destroy']);
    //     Route::get('/users', [DepartmentController::class, 'users']);
    // });
    

    // =========================
    // PROFIL UTILISATEUR
    // =========================
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/leaves', [LeaveController::class, 'store'])->name('leaves.store');
    
    // Modifier cette partie pour les routes de gestion des congés
    Route::middleware(['auth'])->group(function () {
        Route::get('/leaves/manage', [LeaveController::class, 'index'])
            ->middleware('can:validate_leaves')
            ->name('leaves.index');
        Route::post('/leaves/{leave}/status', [LeaveController::class, 'updateStatus'])
            ->middleware('can:validate_leaves')
            ->name('leaves.update-status');
    });
});

require __DIR__.'/auth.php';
