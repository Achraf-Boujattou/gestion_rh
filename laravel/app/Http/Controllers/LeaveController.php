<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaveController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:Congé Maladie,Congé Annuel,Congé Spécial',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|min:10',
        ]);

        try {
            $leave = Leave::create([
                'user_id' => Auth::id(),
                'type' => $validated['type'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'reason' => $validated['reason'],
                'status' => 'pending'
            ]);

            return redirect()->back()->with('success', 'Votre demande de congé a été soumise avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Une erreur est survenue lors de la soumission de votre demande.']);
        }
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Leave::with(['user', 'user.department'])
            ->orderBy('created_at', 'desc');

        // If user is a leader, only show their department's requests
        if ($user->hasRole('leader')) {
            $query->whereHas('user', function($q) use ($user) {
                $q->where('department_id', $user->department_id);
            });
        }
        // Admin sees all requests
        
        $leaves = $query->get();

        return inertia('Leave/Index', [
            'leaves' => $leaves->map(function($leave) {
                return [
                    'id' => $leave->id,
                    'user' => [
                        'name' => $leave->user->name,
                        'department' => $leave->user->department->name
                    ],
                    'type' => $leave->type,
                    'start_date' => $leave->start_date->format('Y-m-d'),
                    'end_date' => $leave->end_date->format('Y-m-d'),
                    'reason' => $leave->reason,
                    'status' => $leave->status,
                    'created_at' => $leave->created_at->format('Y-m-d H:i'),
                ];
            })
        ]);
    }

    public function updateStatus(Request $request, Leave $leave)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'response_comment' => 'nullable|string'
        ]);

        $leave->update([
            'status' => $validated['status'],
            'response_comment' => $validated['response_comment'],
            'approved_by' => auth()->id(),
            'approved_at' => now()
        ]);

        return redirect()->back()->with('success', 'Leave request status updated successfully.');
    }
}
