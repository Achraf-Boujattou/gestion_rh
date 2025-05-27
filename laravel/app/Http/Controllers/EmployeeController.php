<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\Department;
use Spatie\Permission\Models\Role;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->with(['roles', 'department'])
            ->whereDoesntHave('roles', function($q) {
                $q->where('name', 'admin');
            });

        // Recherche
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        // Tri
        $sortField = $request->sort_field ?? 'name';
        $sortDirection = $request->sort_direction ?? 'asc';
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $employees = $query->paginate(10);
        $departments = Department::all(['id', 'name']);
        $roles = Role::where('name', '!=', 'admin')->get(['id', 'name']);

        $response = [
            'employees' => $employees->items(),
            'departments' => $departments,
            'roles' => $roles,
            'filters' => [
                'search' => $request->search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
            'meta' => [
                'current_page' => $employees->currentPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
                'last_page' => $employees->lastPage(),
            ],
            'links' => [
                'prev' => $employees->previousPageUrl(),
                'next' => $employees->nextPageUrl(),
            ]
        ];

        if ($request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json($response);
        }

        return Inertia::render('Dashboard', array_merge($response, [
            'mainContent' => 'employees'
        ]));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'Salaire_base' => 'required|numeric|min:0|max:99999999.99',
            'department_id' => 'required|exists:departments,id'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'Salaire_base' => $validated['Salaire_base'],
            'department_id' => $validated['department_id']
        ]);

        $user->assignRole('employee');

        if ($request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'message' => 'Employé ajouté avec succès',
                'user' => $user
            ]);
        }

        return redirect()->back()->with('success', 'Employé ajouté avec succès');
    }

    public function update(Request $request, User $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($employee->id)],
            'Salaire_base' => 'required|numeric|min:0|max:99999999.99',
            'department_id' => 'nullable|exists:departments,id'
        ]);

        $employee->update($validated);

        if ($request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'message' => 'Employé modifié avec succès',
                'user' => $employee
            ]);
        }

        return redirect()->back()->with('success', 'Employé modifié avec succès');
    }

    public function destroy(User $employee)
    {
        $employee->delete();

        if (request()->wantsJson() || request()->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'message' => 'Employé supprimé avec succès'
            ]);
        }

        return redirect()->back()->with('success', 'Employé supprimé avec succès');
    }
}