import React from 'react';

// FEATURES constant moved from Dashboard.jsx
const FEATURES = [
    {
        label: 'Consulter son dashboard',
        permission: 'view_dashboard',
        admin: true,
        leader: true,
        employee: true,
    },
    {
        label: 'Gérer tous les employés',
        permission: 'manage_employees',
        admin: true,
        leader: false,
        employee: false,
    },
    {
        label: 'Modifier son département',
        permission: 'edit_department',
        admin: true,
        leader: false,
        employee: false,
    },
    {
        label: 'Valider les congés',
        permission: 'validate_leaves',
        admin: true,
        leader: 'son_dept',
        employee: false,
    },
    {
        label: 'Importer des données biométriques',
        permission: 'import_biometrics',
        admin: true,
        leader: 'son_dept',
        employee: false,
    },
    
    {
        label: 'Envoyer des notifications',
        permission: 'send_notifications',
        admin: true,
        leader: 'son_dept',
        employee: false,
    },
];

export default function Sidebar({ user, roleLabel, permissions, selectedFeature, onFeatureClick }) {
    // Helper function to determine if a feature should be shown based on user role and permissions
    const canShowFeature = (feature) => {
        const userRole = user?.roles?.[0]?.name || 'employee';
        if (feature.admin && userRole === 'admin') return true;
        if (feature.leader && userRole === 'leader') {
            // Special handling for 'son_dept' or general leader permission
            return feature.leader === 'son_dept' ? permissions?.includes(feature.permission) : permissions?.includes(feature.permission);
        }
        if (feature.employee && userRole === 'employee') return permissions?.includes(feature.permission);
        
        // Fallback to direct permission check if role specific checks don't apply
        // This is useful if a feature isn't strictly role-based but permission-based
        return permissions?.includes(feature.permission);
    };

    const displayedFeatures = FEATURES.filter(canShowFeature);

    return (
        <aside className="sidebar">
            <div className="user-name">{user?.name}</div>
            <div className="role">{roleLabel}</div>
            <ul>
                {displayedFeatures.length > 0 ? (
                    displayedFeatures.map((feature) => (
                        <li
                            key={feature.permission} // Using permission as key, assuming it's unique
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