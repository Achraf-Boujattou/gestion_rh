<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AbsenceController;
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
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

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

    Route::middleware(['auth'])->group(function () {
        Route::get('/absences', [AbsenceController::class, 'index']);
        Route::post('/absences', [AbsenceController::class, 'store']);
        Route::get('/absences/{id}', [AbsenceController::class, 'show']);
        Route::post('/absences/{id}/approve', [AbsenceController::class, 'approve']);
        Route::post('/absences/{id}/reject', [AbsenceController::class, 'reject']);
        Route::delete('/absences/{id}', [AbsenceController::class, 'destroy']);
    });

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
});

Route::middleware('guest')->group(function () {
    Route::get('forgot-password', function () {
        return Inertia::render('Auth/ForgotPassword');
    })->name('password.request');

    Route::post('forgot-password/verify', [PasswordResetController::class, 'verifyEmail'])
        ->name('password.verify');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

require __DIR__.'/auth.php';
