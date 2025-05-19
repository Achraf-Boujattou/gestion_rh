<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProfileController;
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
        return Inertia::render('Dashboard', [
            'permissions' => $user->getAllPermissions()->pluck('name'),
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
    Route::middleware(['permission:manage_employees'])->group(function () {
        Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
        Route::get('/employees/{user}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
        Route::put('/employees/{user}', [EmployeeController::class, 'update'])->name('employees.update');
        Route::delete('/employees/{user}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
    });

    // Départements (admin ou toute personne ayant la permission)
    // Route::middleware(['permission:edit_department'])->group(function () {
    //     Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
    //     Route::post('/departments', [DepartmentController::class, 'store']);
    //     Route::put('/departments/{department}', [DepartmentController::class, 'update']);
    //     Route::delete('/departments/{department}', [DepartmentController::class, 'destroy']);
    //     Route::get('/departments/users', [DepartmentController::class, 'users']);
    // });
    Route::prefix('departments')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('departments.index');
        Route::post('/', [DepartmentController::class, 'store']);
        Route::put('/{department}', [DepartmentController::class, 'update']);
        Route::delete('/{department}', [DepartmentController::class, 'destroy']);
        Route::get('/users', [DepartmentController::class, 'users']);
    });
    

    // =========================
    // PROFIL UTILISATEUR
    // =========================
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
