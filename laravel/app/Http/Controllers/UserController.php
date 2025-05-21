<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\UsersExport;

class UserController extends Controller
{
    public function index()
    {
        return response()->json([
            'users' => User::select('id', 'name', 'email')->get()
        ]);
    }

    public function export($format)
    {
        if ($format === 'csv') {
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="users.csv"',
            ];
            $callback = function () {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['ID', 'Nom', 'Email']);
                foreach (User::select('id', 'name', 'email')->get() as $user) {
                    fputcsv($handle, [$user->id, $user->name, $user->email]);
                }
                fclose($handle);
            };
            return response()->stream($callback, 200, $headers);
        } elseif ($format === 'xlsx') {
            return Excel::download(new UsersExport, 'users.xlsx');
        }
        return response()->json(['error' => 'Format non supporté'], 400);
    }
} 