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
        $query = Department::with('leader');

        // Recherche
        if ($request->search) {
            $searchTerm = $request->search;
            $query->where('name', 'like', "%{$searchTerm}%");
        }

        // Tri
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');

        if ($sortField === 'leader_id') {
            $query->leftJoin('users', 'departments.leader_id', '=', 'users.id')
                  ->orderBy('users.name', $sortDirection)
                  ->select('departments.*');
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        // Pagination
        $departments = $query->paginate(10);

        if ($request->wantsJson() || $request->header('X-Inertia')) {
            $response = [
                'departments' => $departments->items(),
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

            if ($request->wantsJson()) {
                return response()->json($response);
            }

            return Inertia::render('Dashboard', $response);
        }

        return Inertia::render('Departments/Index', [
            'departments' => $departments->items(),
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