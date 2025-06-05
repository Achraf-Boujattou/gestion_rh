<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use App\Models\Leave;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Récupérer les employés (excluant les admins)
        $employees = User::whereDoesntHave('roles', function($q) {
            $q->where('name', 'admin');
        })->get();

        // Récupérer les départements avec le nombre d'employés
        $departments = Department::withCount('employees')->get();

        // Récupérer les congés
        $leaves = Leave::with(['user', 'user.department'])->get();

        // Calculer les statistiques des congés par mois pour l'année en cours
        $leavesByMonth = Leave::select(
            DB::raw('MONTH(start_date) as month'),
            DB::raw('COUNT(*) as count')
        )
        ->whereYear('start_date', Carbon::now()->year)
        ->groupBy('month')
        ->orderBy('month')
        ->get()
        ->pluck('count', 'month')
        ->toArray();

        // Remplir les mois manquants avec des zéros
        $monthlyLeaveData = array_replace(
            array_fill(1, 12, 0),
            $leavesByMonth
        );

        // Calculer les statistiques des employés ajoutés par mois
        $employeesByMonth = User::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as count')
        )
        ->whereYear('created_at', Carbon::now()->year)
        ->whereDoesntHave('roles', function($q) {
            $q->where('name', 'admin');
        })
        ->groupBy('month')
        ->orderBy('month')
        ->get()
        ->pluck('count', 'month')
        ->toArray();

        // Remplir les mois manquants avec des zéros pour les employés
        $monthlyEmployeeData = array_replace(
            array_fill(1, 12, 0),
            $employeesByMonth
        );

        // Statistiques des congés
        $leaveStats = [
            'active' => $leaves->where('status', 'approved')
                ->where('start_date', '<=', Carbon::now())
                ->where('end_date', '>=', Carbon::now())
                ->count(),
            'pending' => $leaves->where('status', 'pending')->count(),
            'monthly_data' => array_values($monthlyLeaveData),
            'monthly_employees' => array_values($monthlyEmployeeData),
        ];

        // Statistiques des départements
        $departmentStats = [
            'labels' => $departments->pluck('name')->toArray(),
            'data' => $departments->pluck('employees_count')->toArray(),
        ];

        return Inertia::render('Dashboard', [
            'statistics' => [
                'totalEmployees' => $employees->count(),
                'departmentsCount' => $departments->count(),
                'leaveStats' => $leaveStats,
                'departmentStats' => $departmentStats,
            ],
            'employees' => $employees,
            'departments' => $departments,
            'leaves' => $leaves,
            'permissions' => $user->getAllPermissions()->pluck('name'),
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
    }
} 