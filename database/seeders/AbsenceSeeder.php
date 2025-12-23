<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Absence;
use App\Models\User;

class AbsenceSeeder extends Seeder
{
    public function run()
    {
        $user = User::first();
        Absence::create([
            'user_id' => $user->id,
            'start_date' => now(),
            'end_date' => now()->addDays(2),
            'reason' => 'Maladie',
            'description' => 'Grippe',
            'status' => 'pending',
        ]);
    }
}