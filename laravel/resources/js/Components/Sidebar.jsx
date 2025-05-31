import React from 'react';

export default function Sidebar({ user, roleLabel, permissions, selectedFeature, onFeatureClick }) {
    const FEATURES = [
        {
            label: 'Consulter son dashboard',
            permission: 'view_dashboard',
            roles: ['admin', 'leader', 'employee']
        },
        {
            label: 'Demander un congé',
            permission: 'request_leave',
            roles: ['admin', 'leader', 'employee']
        },
        {
            label: 'Gérer tous les employés',
            permission: 'manage_employees',
            roles: ['admin']
        },
        {
            label: 'Modifier son département',
            permission: 'edit_department',
            roles: ['admin']
        },
        {
            label: 'Valider les congés',
            permission: 'validate_leaves',
            roles: ['admin', 'leader']
        },
        {
            label: 'Importer des données biométriques',
            permission: 'import_biometrics',
            roles: ['admin', 'leader']
        },
        {
            label: 'Envoyer des notifications',
            permission: 'send_notifications',
            roles: ['admin', 'leader']
        }
    ];

    const userRole = user?.roles?.[0]?.name || 'employee';

    const displayedFeatures = FEATURES.filter(feature => 
        feature.roles.includes(userRole) && (!permissions || permissions.includes(feature.permission))
    );

    return (
        <aside className="sidebar">
            <div className="user-name">{user?.name}</div>
            <div className="role">{roleLabel}</div>
            <div className="perm-title">Fonctionnalités</div>
            <ul>
                {displayedFeatures.length > 0 ? (
                    displayedFeatures.map((feature) => (
                        <li
                            key={feature.permission}
                            onClick={() => onFeatureClick(feature)}
                            className={selectedFeature?.permission === feature.permission ? 'active' : ''}
                        >
                            {feature.label}
                        </li>
                    ))
                ) : (
                    <li style={{ color: '#aaa' }}>Aucune fonctionnalité disponible</li>
                )}
            </ul>
        </aside>
    );
} 