import React from 'react';
import { FaTachometerAlt, FaUsers, FaBuilding, FaCalendarPlus, FaCalendarCheck, FaPlaneDeparture, FaClipboardCheck } from 'react-icons/fa';

export default function Sidebar({ user, roleLabel, permissions, selectedFeature, onFeatureClick }) {
    const FEATURES = [
        {
            label: 'Dashboard',
            permission: 'view_dashboard',
            roles: ['admin'],
            icon: <FaTachometerAlt className="sidebar-icon" />
        },
        
       
        {
            label: 'Employé',
            permission: 'manage_employees',
            roles: ['admin'],
            icon: <FaUsers className="sidebar-icon" />
        },
        {
            label: 'Département',
            permission: 'edit_department',
            roles: ['admin'],
            icon: <FaBuilding className="sidebar-icon" />
        },
        {
            label: 'Demander une absence',
            permission: 'request_absence',
            roles: ['employee', 'leader'],
            icon: <FaCalendarPlus className="sidebar-icon" />
        },
        {
            label: 'Absences',
            permission: 'manage_absences',
            roles: ['admin', 'leader'],
            icon: <FaCalendarCheck className="sidebar-icon" />
        },
        {
            label: 'Demander un congé',
            permission: 'request_leave',
            roles: [ 'leader', 'employee'],
            icon: <FaPlaneDeparture className="sidebar-icon" />
        },
        {
            label: 'Congés',
            permission: 'validate_leaves',
            roles: ['admin', 'leader'],
            icon: <FaClipboardCheck className="sidebar-icon" />
        }
        // ,
        // {
        //     label: 'Importer des données biométriques',
        //     permission: 'import_biometrics',
        //     roles: ['admin', 'leader']
        // },
        // {
        //     label: 'Envoyer des notifications',
        //     permission: 'send_notifications',
        //     roles: ['admin', 'leader']
        // }
    ];

    const userRole = user?.roles?.[0]?.name || 'employee';

    const displayedFeatures = FEATURES.filter(feature => 
        feature.roles.includes(userRole) && (
            !permissions || 
            permissions.includes(feature.permission) || 
            feature.permission === 'request_absence'
        )
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
                            onClick={() => onFeatureClick(feature.permission)}
                            className={selectedFeature === feature.permission ? 'active' : ''}
                        >
                            <span style={{marginRight: '10px', display: 'inline-flex', alignItems: 'center'}}>{feature.icon}</span>
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

<style jsx>{`
.sidebar-icon {
  font-size: 1.1em;
  vertical-align: middle;
}
`}</style> 