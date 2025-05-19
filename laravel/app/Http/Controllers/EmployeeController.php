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

        $employees = $query->get();
        $departments = Department::all(['id', 'name']);
        $roles = Role::where('name', '!=', 'admin')->get(['id', 'name']);

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'roles' => $roles,
            'filters' => $request->all(['search', 'sort_field', 'sort_direction'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'Salaire_base' => 'required|numeric',
            'department_id' => 'required|exists:departments,id',
            'role' => 'required|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'Salaire_base' => $validated['Salaire_base'],
            'department_id' => $validated['department_id']
        ]);

        $user->assignRole($validated['role']);

        return redirect()->back()->with('success', 'Employé ajouté avec succès');
    }

    public function update(Request $request, User $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($employee->id)],
            'Salaire_base' => 'required|numeric',
            'department_id' => 'nullable|exists:departments,id'
        ]);

        $employee->update($validated);

        return redirect()->back()->with('success', 'Employé modifié avec succès');
    }

    public function destroy(User $employee)
    {
        $employee->delete();
        return redirect()->back()->with('success', 'Employé supprimé avec succès');
    }
}