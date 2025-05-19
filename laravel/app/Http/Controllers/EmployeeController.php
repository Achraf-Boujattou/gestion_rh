<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        try {
            $employees = User::with(['roles', 'department'])
                ->whereDoesntHave('roles', function($q) {
                    $q->where('name', 'admin');
                })
                ->orderBy('name')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->roles->first()?->name ?? 'employee',
                        'department' => $user->department?->name ?? 'Non assigné',
                        'salary' => $user->Salaire_base,
                    ];
                });

            if ($request->ajax() || $request->wantsJson() || $request->query('inertia') === 'false') {
                return response()->json(['employees' => $employees]);
            }

            return Inertia::render('Employees/Index', [
                'employees' => $employees
            ]);
        } catch (\Throwable $e) {
            \Log::error('Erreur EmployeeController@index: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Erreur serveur: ' . $e->getMessage()], 500);
        }
    }

    public function edit(User $user)
    {
        return Inertia::render('Employees/Edit', [
            'employee' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()?->name ?? 'employee',
                'department' => $user->department?->name ?? 'Non assigné',
                'salary' => $user->Salaire_base,
            ]
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'Salaire_base' => 'required|numeric|min:0',
            'department_id' => 'nullable|exists:departments,id',
            'role' => 'required|in:admin,leader,employee'
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'Salaire_base' => $validated['Salaire_base'],
            'department_id' => $validated['department_id']
        ]);

        // Mettre à jour le rôle
        $user->syncRoles([$validated['role']]);

        return redirect()->route('employees.index')
            ->with('success', 'Employé mis à jour avec succès');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('employees.index')
            ->with('success', 'Employé supprimé avec succès');
    }
} 