<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Biometric;
use Maatwebsite\Excel\Facades\Excel;

class BiometricImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'format' => 'required|in:csv,xlsx,json',
            'file' => 'required|file',
        ]);

        $format = $request->input('format');
        $file = $request->file('file');

        if ($format === 'csv' || $format === 'xlsx') {
            $data = Excel::toArray([], $file)[0];
            foreach ($data as $row) {
                if (isset($row[0], $row[1])) {
                    Biometric::create([
                        'employee_id' => $row[0],
                        'biometric_data' => $row[1],
                    ]);
                }
            }
        } elseif ($format === 'json') {
            $json = json_decode(file_get_contents($file), true);
            foreach ($json as $row) {
                if (isset($row['employee_id'], $row['biometric_data'])) {
                    Biometric::create([
                        'employee_id' => $row['employee_id'],
                        'biometric_data' => $row['biometric_data'],
                    ]);
                }
            }
        }

        return response()->json(['success' => true]);
    }
} 