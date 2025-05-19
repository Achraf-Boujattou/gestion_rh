<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $departments = Department::with('leader')->orderBy('name')->get();
        // SUPPRIME cette condition :
        // if ($request->ajax() || $request->wantsJson() || $request->query('inertia') === 'false') {
        //     return response()->json(['departments' => $departments]);
        // }
        // Garde uniquement :
        return Inertia::render('Departments/Index', [
            'departments' => $departments
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'leader_id' => 'nullable|exists:users,id',
        ]);
        $department = Department::create($validated);
        return response()->json(['department' => $department->load('leader')], 201);
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'leader_id' => 'nullable|exists:users,id',
        ]);
        $department->update($validated);
        return response()->json(['department' => $department->load('leader')]);
    }

    public function destroy(Department $department)
    {
        $department->delete();
        return response()->json(['success' => true]);
    }

    public function users()
    {
        $users = \App\Models\User::select('id', 'name')->orderBy('name')->get();
        return response()->json(['users' => $users]);
    }
} 