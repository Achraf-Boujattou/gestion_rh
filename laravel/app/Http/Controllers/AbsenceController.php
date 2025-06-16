<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AbsenceController extends Controller
{
    // Liste des absences (admin/leader : toutes, employé : les siennes)
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->hasRole('admin')) {
            // Admin voit tout
            $absences = Absence::with('user')->latest()->get();
        } elseif ($user->hasRole('leader')) {
            // Leader : absences des employés de son département
            $departmentId = $user->department_id;
            $absences = Absence::with('user')
                ->whereHas('user', function($query) use ($departmentId) {
                    $query->where('department_id', $departmentId);
                })
                ->latest()
                ->get();
        } else {
            // Employé : seulement ses propres absences
            $absences = Absence::with('user')->where('user_id', $user->id)->latest()->get();
        }

        return response()->json($absences);
    }

    // Créer une demande d'absence (employé)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:255',
            'description' => 'required|string',
        ]);
        $absence = Absence::create([
            'user_id' => Auth::id(),
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'reason' => $validated['reason'],
            'description' => $validated['description'],
            'status' => 'pending',
        ]);
        return response()->json($absence, 201);
    }

    // Voir une absence
    public function show($id)
    {
        $absence = Absence::with('user')->findOrFail($id);
        $user = Auth::user();
        if ($user->hasRole(['admin', 'leader']) || $absence->user_id == $user->id) {
            return response()->json($absence);
        }
        abort(403);
    }

    // Accepter une absence (admin/leader)
    public function approve($id)
    {
        $absence = Absence::findOrFail($id);
        $absence->status = 'approved';
        $absence->rejection_reason = null;
        $absence->save();
        return response()->json($absence);
    }

    // Refuser une absence (admin/leader)
    public function reject(Request $request, $id)
    {
        $request->validate(['rejection_reason' => 'required|string|max:255']);
        $absence = Absence::findOrFail($id);
        $absence->status = 'rejected';
        $absence->rejection_reason = $request->rejection_reason;
        $absence->save();
        return response()->json($absence);
    }

    // Supprimer une absence (optionnel, admin seulement)
    public function destroy($id)
    {
        $absence = Absence::findOrFail($id);
        $absence->delete();
        return response()->json(['message' => 'Absence supprimée']);
    }
}