<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Charger les leaders avec les départements
            $query = Department::with('leader');

            // Recherche éventuelle
            if ($request->search) {
                $query->where('name', 'like', "%{$request->search}%");
            }

            // Tri éventuel
            $sortField = $request->input('sort_field', 'name');
            $sortDirection = $request->input('sort_direction', 'asc');
            $query->orderBy($sortField, $sortDirection);

            // Pagination
            $departments = $query->paginate(10);

            // Transformation pour le frontend
            $departmentsTransformed = $departments->getCollection()->map(function ($department) {
                return [
                    'id' => $department->id,
                    'name' => $department->name,
                    'description' => $department->description,
                    'leader' => $department->leader
                        ? ['id' => $department->leader->id, 'name' => $department->leader->name]
                        : null,
                ];
            });

            $response = [
                'departments' => $departmentsTransformed,
                'meta' => [
                    'current_page' => $departments->currentPage(),
                    'per_page' => $departments->perPage(),
                    'total' => $departments->total(),
                    'last_page' => $departments->lastPage(),
                ],
                'links' => [
                    'prev' => $departments->previousPageUrl(),
                    'next' => $departments->nextPageUrl(),
                ]
            ];

            if ($request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
                return response()->json($response);
            }

            return Inertia::render('Departments/Index', [
                'departments' => $departmentsTransformed,
                'meta' => [
                    'current_page' => $departments->currentPage(),
                    'per_page' => $departments->perPage(),
                    'total' => $departments->total(),
                    'last_page' => $departments->lastPage(),
                ],
                'links' => [
                    'prev' => $departments->previousPageUrl(),
                    'next' => $departments->nextPageUrl(),
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in DepartmentController@index: ' . $e->getMessage());
            throw $e;
        }
    }

    public function store(Request $request)
    {
        Log::info('Début de la méthode store');
        Log::info('Données reçues:', $request->all());

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'leader_id' => 'nullable|exists:users,id',
            ]);
            
            Log::info('Données validées:', $validated);
            
            $department = Department::create($validated);
            Log::info('Département créé:', $department->toArray());
            
            if ($request->wantsJson()) {
                return response()->json(['department' => $department->load('leader')], 201);
            }
            
            return redirect()->back()->with('success', 'Département créé avec succès');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du département:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
            
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'leader_id' => 'nullable|exists:users,id',
        ]);

        // If leader is changing, update roles
        if ($department->leader_id !== $validated['leader_id']) {
            // Remove leader role from old leader if exists
            if ($department->leader) {
                // Only remove leader role if they're not leading any other department
                $otherDepartmentsLed = Department::where('leader_id', $department->leader_id)
                    ->where('id', '!=', $department->id)
                    ->count();
                
                if ($otherDepartmentsLed === 0) {
                    $department->leader->removeRole('leader');
                    $department->leader->assignRole('employee');
                }
            }
            
            // Assign leader role to new leader if exists
            if ($validated['leader_id']) {
                $newLeader = \App\Models\User::find($validated['leader_id']);
                if ($newLeader) {
                    $newLeader->syncRoles(['leader']);
                }
            }
        }

        $department->update($validated);
        
        if ($request->wantsJson()) {
            $department->load(['leader', 'employees']);
            return response()->json([
                'department' => $department,
                'employees' => $department->employees
            ]);
        }
        
        return redirect()->back()->with('success', 'Département modifié avec succès');
    }

    public function destroy(Department $department)
    {
        $department->delete();
        
        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }
        
        return redirect()->back()->with('success', 'Département supprimé avec succès');
    }

    public function users(Request $request)
    {
        $query = \App\Models\User::query()->select('id', 'name');
        
        // Si un département est spécifié, filtrer les utilisateurs de ce département
        if ($request->department_id) {
            $query->where('department_id', $request->department_id);
        }
        
        $users = $query->orderBy('name')->get();
        return response()->json(['users' => $users]);
    }

    public function show(Department $department)
    {
        $department->load(['leader', 'employees' => function($query) {
            $query->with('roles');
        }]);
        
        return response()->json([
            'department' => $department,
            'employees' => $department->employees
        ]);
    }
} 