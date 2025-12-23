<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Créer les permissions
        $permissions = [
            'validate_leaves',
            'request_leave',
            'manage_employees',
            'edit_department'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Créer les rôles
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $leaderRole = Role::firstOrCreate(['name' => 'leader', 'guard_name' => 'web']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee', 'guard_name' => 'web']);

        // Assigner les permissions aux rôles
        $adminRole->givePermissionTo($permissions);
        $leaderRole->givePermissionTo(['validate_leaves', 'request_leave']);
        $employeeRole->givePermissionTo('request_leave');

        // Assigner le rôle admin au premier utilisateur
        $adminUser = User::first();
        if ($adminUser) {
            $adminUser->syncRoles(['admin']);
        }
    }
} 