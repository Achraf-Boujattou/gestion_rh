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
        $mainRole = $user->roles->first()->name ?? 'employee';

        // Different views based on role
        $viewData = [
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'meta' => [
                'current_page' => 1,
                'per_page' => 10,
            ],
            'links' => [
                'prev' => null,
                'next' => null
            ]
        ];

        // Common data for all roles
        $departments = Department::with('leader')
            ->withCount('employees')
            ->get()
            ->map(function ($department) {
                return [
                    'id' => $department->id,
                    'name' => $department->name,
                    'description' => $department->description,
                    'employees_count' => $department->employees_count,
                    'leader' => $department->leader 
                        ? ['id' => $department->leader->id, 'name' => $department->leader->name]
                        : null,
                ];
            });

        if ($mainRole === 'leader') {
            // Leader specific data
            $departmentEmployees = User::where('department_id', $user->department_id)
                ->whereDoesntHave('roles', function($q) {
                    $q->where('name', 'admin');
                })->get();

            $departmentLeaves = Leave::whereHas('user', function($q) use ($user) {
                $q->where('department_id', $user->department_id);
            })->with(['user', 'user.department'])->get();

            return Inertia::render('Dashboard', array_merge($viewData, [
                'employees' => $departmentEmployees,
                'departments' => $departments,
                'leaves' => $departmentLeaves,
                'statistics' => [
                    'totalEmployees' => $departmentEmployees->count(),
                    'departmentsCount' => 1,
                    'leaveStats' => $this->getLeaveStats($departmentLeaves),
                    'departmentStats' => [
                        'labels' => [$user->department->name],
                        'data' => [$departmentEmployees->count()]
                    ],
                ],
            ]));
        } else {
            // Admin and employee view
            $employees = User::whereDoesntHave('roles', function($q) {
                $q->where('name', 'admin');
            })->get();

            $leaves = Leave::with(['user', 'user.department'])->get();

            return Inertia::render('Dashboard', array_merge($viewData, [
                'employees' => $employees,
                'departments' => $departments,
                'leaves' => $leaves,
                'statistics' => [
                    'totalEmployees' => $employees->count(),
                    'departmentsCount' => $departments->count(),
                    'leaveStats' => $this->getLeaveStats($leaves),
                    'departmentStats' => [
                        'labels' => $departments->pluck('name')->toArray(),
                        'data' => $departments->pluck('employees_count')->toArray(),
                    ],
                ],
            ]));
        }
    }

    private function getLeaveStats($leaves)
    {
        $leavesByMonth = $leaves->groupBy(function($leave) {
            return Carbon::parse($leave->start_date)->format('n');
        })->map->count();

        return [
            'active' => $leaves->where('status', 'approved')
                ->where('start_date', '<=', Carbon::now())
                ->where('end_date', '>=', Carbon::now())
                ->count(),
            'pending' => $leaves->where('status', 'pending')->count(),
            'monthly_data' => array_values(array_replace(
                array_fill(1, 12, 0),
                $leavesByMonth->toArray()
            )),
            'monthly_employees' => array_values(array_fill(1, 12, 0)), // Placeholder for employee stats
        ];
    }
} 