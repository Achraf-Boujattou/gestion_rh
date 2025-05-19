<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Définir les permissions selon le tableau
        $permissions = [
            'view_dashboard',           // Consulter son dashboard
            'manage_employees',         // Gérer tous les employés
            'edit_department',          // Modifier son département
            'validate_leaves',          // Valider les congés
            'import_biometrics',        // Importer des données biométriques
            'send_notifications',       // Envoyer des notifications
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Créer les rôles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $leaderRole = Role::firstOrCreate(['name' => 'leader']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee']);

        // Attribuer les permissions selon le tableau
        $adminRole->syncPermissions($permissions);
        $leaderRole->syncPermissions([
            'view_dashboard',
            'validate_leaves',
            'import_biometrics',
            'send_notifications',
        ]);
        $employeeRole->syncPermissions([
            'view_dashboard',
        ]);
    }
} 