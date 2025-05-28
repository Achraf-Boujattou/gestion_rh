import { usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import ImportBiometricsButton from '../components/ImportBiometricsButton';
import UserExportModal from '../components/UserExportModal';
import Sidebar from '@/Components/Sidebar';
import DepartmentsTable from './Departments/DepartmentsTable';
import EmployeesTable from './Employees/EmployeesTable';
import StatisticsView from './Dashboard/StatisticsView';

// FEATURES constant is now in Sidebar.jsx

export default function Dashboard({ 
    departments: initialDepartments = [], 
    employees: initialEmployees = [], 
    meta = null, 
    links = null 
}) {
    const { permissions, auth } = usePage().props;
    const user = auth?.user;
    const mainRole = user?.roles?.[0]?.name || 'employee';
    const roleLabel = mainRole.charAt(0).toUpperCase() + mainRole.slice(1);
    const [profileOpen, setProfileOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [showEmployees, setShowEmployees] = useState(false);
    const [mainContent, setMainContent] = useState('welcome');
    const [currentDepartments, setCurrentDepartments] = useState(initialDepartments);
    const [currentEmployees, setCurrentEmployees] = useState(initialEmployees);
    const [currentMeta, setCurrentMeta] = useState(meta);
    const [currentLinks, setCurrentLinks] = useState(links);
    const [showImportModal, setShowImportModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Avatar initials
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    // Mettre à jour les données quand les props changent
    useEffect(() => {
        setCurrentDepartments(initialDepartments);
        setCurrentEmployees(initialEmployees);
        setCurrentMeta(meta);
        setCurrentLinks(links);
    }, [initialDepartments, initialEmployees, meta, links]);

    // Define FEATURES here for now to pass to Sidebar, will be adjusted in Phase 2
    // This is a temporary step. Ideally, FEATURES should live where it's most logically managed.
    const FEATURES_DASHBOARD = [
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
            label: 'Consulter son dashboard',
            permission: 'view_dashboard',
            admin: true,
            leader: true,
            employee: true,
        },
        {
            label: 'Envoyer des notifications',
            permission: 'send_notifications',
            admin: true,
            leader: 'son_dept',
            employee: false,
        },
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const handleFeatureClick = (feature) => {
        setSelectedFeature(feature);
        switch (feature.label) {
            case 'Gérer tous les employés':
                setMainContent('employees');
                break;
            case 'Modifier son département':
                setMainContent('departments');
                break;
            case 'Consulter son dashboard':
                setMainContent('statistics');
                break;
            default:
                setMainContent('welcome');
        }
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Pour savoir si l'utilisateur a la permission
    const hasPermission = (perm) => permissions && permissions.includes(perm);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await fetch('/employees', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des employés');
            }
            
            const data = await response.json();
            setCurrentEmployees(data.employees);
            setCurrentMeta(data.meta);
            setCurrentLinks(data.links);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowEmployees = () => {
        if (!showEmployees) {
            fetchEmployees();
        }
        setShowEmployees(!showEmployees);
    };

    const handleShowInfo = (emp) => {
        alert(
            `Nom: ${emp.name}\nEmail: ${emp.email}\nRôle: ${emp.role}\nDépartement: ${emp.department}\nSalaire: ${emp.salary} €`
        );
    };

    const handleEdit = (emp) => {
        router.visit(`/employees/${emp.id}/edit`);
    };

    const handleDelete = (emp) => {
        if (confirm(`Supprimer ${emp.name} ?`)) {
            router.delete(`/employees/${emp.id}`);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch('/departments', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des départements');
            }
            
            const data = await response.json();
            setCurrentDepartments(data.departments);
            setCurrentMeta(data.meta);
            setCurrentLinks(data.links);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Render main content based on state
    const renderMainContent = () => {
        switch (mainContent) {
            case 'departments':
                return (
                    <DepartmentsTable 
                        departments={currentDepartments}
                        meta={currentMeta}
                        links={currentLinks}
                    />
                );
            case 'employees':
                return (
                    <EmployeesTable 
                        employees={currentEmployees}
                        departments={currentDepartments}
                        meta={currentMeta}
                        links={currentLinks}
                        filters={{
                            search: searchTerm,
                            sort_field: sortField,
                            sort_direction: sortDirection
                        }}
                    />
                );
            case 'statistics':
                return <StatisticsView />;
            default:
                return (
                    <div className="welcome-box">
                        <h1>Bienvenue, {user?.name} !</h1>
                        <div className="role-badge">{roleLabel}</div>
                        <p>Vous êtes connecté en tant que <b>{roleLabel}</b>.<br />Profitez de votre espace personnalisé.</p>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-auth-root">
            <style>{`
                body { background: #eaf0fa; }
                .dashboard-auth-root {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #eaf0fa 60%, #fff 100%);
                    font-family: 'Segoe UI', Arial, sans-serif;
                }
                .navbar {
                    width: 100%;
                    height: 70px;
                    background: white;
                    color: #2B3674;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 30px;
                    box-sizing: border-box;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 100;
                    box-shadow: 0 2px 20px rgba(67, 24, 255, 0.08);
                    animation: navbarFadeIn 1s;
                }
                @keyframes navbarFadeIn {
                    from { opacity: 0; transform: translateY(-30px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .navbar .left-section {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }
                .navbar .search-box {
                    position: relative;
                    width: 300px;
                }
                .navbar .search-box input {
                    width: 100%;
                    padding: 10px 16px 10px 40px;
                    border: 1px solid #E0E5F2;
                    border-radius: 30px;
                    font-size: 0.9em;
                    color: #2B3674;
                    background: #F4F7FE;
                    transition: all 0.3s ease;
                }
                .navbar .search-box input:focus {
                    outline: none;
                    border-color: #4318FF;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(67, 24, 255, 0.1);
                }
                .navbar .search-box::before {
                    content: '';
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 14px;
                    height: 14px;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23A3AED0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E");
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .navbar .right-section {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .navbar .notifications {
                    position: relative;
                    padding: 8px;
                    border-radius: 50%;
                    background: #F4F7FE;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .navbar .notifications:hover {
                    background: #E9EDF7;
                }
                .navbar .notifications::after {
                    content: '';
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 8px;
                    height: 8px;
                    background: #4318FF;
                    border-radius: 50%;
                    border: 2px solid white;
                }
                .navbar .profile-menu {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 6px;
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .navbar .profile-menu:hover {
                    background: #F4F7FE;
                }
                .navbar .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4318FF 0%, #868CFF 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 1em;
                    box-shadow: 0 3px 10px rgba(67, 24, 255, 0.15);
                }
                .navbar .profile-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .navbar .profile-name {
                    font-weight: 600;
                    color: #2B3674;
                    font-size: 0.95em;
                }
                .navbar .profile-role {
                    color: #A3AED0;
                    font-size: 0.8em;
                }
                .navbar .profile-menu .dropdown {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: 0;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(67, 24, 255, 0.1);
                    min-width: 200px;
                    padding: 8px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }
                .navbar .profile-menu.open .dropdown {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                .navbar .dropdown a,
                .navbar .dropdown button {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px 16px;
                    border: none;
                    background: none;
                    color: #2B3674;
                    font-size: 0.9em;
                    text-align: left;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .navbar .dropdown a:hover,
                .navbar .dropdown button:hover {
                    background: #F4F7FE;
                    color: #4318FF;
                }
                .navbar .dropdown svg {
                    width: 18px;
                    height: 18px;
                    color: #A3AED0;
                }
                .navbar .dropdown a:hover svg,
                .navbar .dropdown button:hover svg {
                    color: #4318FF;
                }
                .sidebar {
                    position: fixed;
                    top: 64px;
                    left: 0;
                    width: 280px;
                    height: calc(100vh - 64px);
                    background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
                    color: #232946;
                    padding: 30px 24px;
                    box-shadow: 4px 0 24px rgba(80,80,180,0.06);
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    border-right: 1px solid rgba(226, 232, 255, 0.8);
                    animation: sidebarSlideIn 1.1s;
                    border-radius: 0 24px 24px 0;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                @keyframes sidebarSlideIn {
                    from { opacity: 0; transform: translateX(-40px);}
                    to { opacity: 1; transform: translateX(0);}
                }

                .sidebar .user-name {
                    font-size: 1.4em;
                    font-weight: 600;
                    margin-bottom: 6px;
                    color: #1a1f36;
                    letter-spacing: -0.5px;
                }

                .sidebar .role {
                    font-size: 1.05em;
                    color: #4f46e5;
                    margin-bottom: 32px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .sidebar .role::before {
                    content: '';
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background-color: #4f46e5;
                    border-radius: 50%;
                }

                .sidebar .perm-title {
                    font-size: 0.95em;
                    font-weight: 600;
                    margin-bottom: 16px;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                }

                .sidebar ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    width: 100%;
                }

                .sidebar li {
                    display: block;
                    background: transparent;
                    color: #475569;
                    margin: 0 0 12px 0;
                    padding: 12px 20px;
                    border-radius: 14px;
                    font-size: 1.02em;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid transparent;
                }

                .sidebar li:hover {
                    background: rgba(79, 70, 229, 0.05);
                    color: #4f46e5;
                    transform: translateX(6px);
                    border: 1px solid rgba(79, 70, 229, 0.1);
                }

                .sidebar li::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 0;
                    background: #4f46e5;
                    border-radius: 0 4px 4px 0;
                    transition: height 0.3s ease;
                }

                .sidebar li:hover::before {
                    height: 80%;
                }

                .sidebar li.active {
                    background: #4f46e5;
                    color: white;
                    font-weight: 500;
                    box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
                    transform: translateX(6px);
                }

                .sidebar li.active::before {
                    height: 80%;
                    background: white;
                }

                @media (max-width: 900px) {
                    .sidebar {
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                    }
                    .sidebar.open {
                        transform: translateX(0);
                    }
                }

                .main-content {
                    margin-left: 280px;
                    padding: 90px 40px 40px;
                    min-height: 100vh;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-start;
                    animation: fadeInMain 1.2s;
                    width: calc(100% - 280px);
                    box-sizing: border-box;
                }
                @keyframes fadeInMain {
                    from { opacity: 0; transform: scale(0.97);}
                    to { opacity: 1; transform: scale(1);}
                }
                .welcome-box {
                    background: #fff;
                    border-radius: 18px;
                    box-shadow: 0 4px 32px rgba(80,80,180,0.10);
                    padding: 48px 36px;
                    min-width: 320px;
                    max-width: 600px;
                    text-align: center;
                    animation: fadeInWelcome 1.5s;
                }
                @keyframes fadeInWelcome {
                    from { opacity: 0; transform: translateY(30px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .welcome-box h1 {
                    font-size: 2.1em;
                    margin-bottom: 12px;
                    color: #1563ff;
                    letter-spacing: 1px;
                }
                .welcome-box .role-badge {
                    display: inline-block;
                    background: #1563ff;
                    color: #fff;
                    border-radius: 12px;
                    padding: 5px 18px;
                    font-size: 1em;
                    margin-bottom: 20px;
                    font-weight: bold;
                    box-shadow: 0 1px 4px #1563ff33;
                    animation: fadeInBadge 1.7s;
                }
                @keyframes fadeInBadge {
                    from { opacity: 0; transform: scale(0.7);}
                    to { opacity: 1; transform: scale(1);}
                }
                .welcome-box p {
                    color: #555;
                    font-size: 1.13em;
                }
                .perm-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 32px;
                    background: #f8faff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 2px 12px #1563ff11;
                }
                .perm-table th, .perm-table td {
                    padding: 12px 10px;
                    text-align: center;
                    border-bottom: 1px solid #eaf0fa;
                }
                .perm-table th {
                    background: #1563ff;
                    color: #fff;
                    font-weight: 600;
                    font-size: 1.05em;
                }
                .perm-table tr:last-child td {
                    border-bottom: none;
                }
                .perm-table .check {
                    color: #18b84c;
                    font-size: 1.3em;
                    font-weight: bold;
                }
                .perm-table .cross {
                    color: #e74c3c;
                    font-size: 1.3em;
                    font-weight: bold;
                }
                .perm-table .info {
                    color: #1563ff;
                    font-size: 1.1em;
                }
                @media (max-width: 600px) {
                    .welcome-box { padding: 20px 5px; min-width: 0; }
                    .navbar { padding: 0 10px; }
                }
                .feature-link {
                    cursor: pointer;
                    color: #1563ff;
                    text-decoration: none;
                }
                .feature-link:hover {
                    text-decoration: underline;
                }
                .employees-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    margin-top: 20px;
                }
                .employees-table th {
                    background: #f8f9fa;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: #495057;
                    cursor: pointer;
                    user-select: none;
                }
                .employees-table th:hover {
                    background: #e9ecef;
                }
                .employees-table td {
                    padding: 12px;
                    border-top: 1px solid #dee2e6;
                }
                .employees-table tr:hover {
                    background: #f8f9fa;
                }
                .role-badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }
                .role-admin {
                    background: #dc3545;
                    color: white;
                }
                .role-leader {
                    background: #28a745;
                    color: white;
                }
                .role-employee {
                    background: #6c757d;
                    color: white;
                }
                .search-box {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    width: 300px;
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                @media (max-width: 900px) {
                    .main-content {
                        margin-left: 0;
                        width: 100%;
                        padding: 90px 20px 40px;
                    }
                }
            `}</style>
            {/* Navbar */}
            <nav className="navbar">
                <div className={`profile-menu${profileOpen ? ' open' : ''}`} onMouseLeave={() => setProfileOpen(false)}>
                    <span className="avatar">{initials}</span>
                    <button
                        className="profile-btn"
                        onClick={() => setProfileOpen((v) => !v)}
                        type="button"
                    >
                        {user?.name} &#x25BC;
                    </button>
                    <div className={`dropdown${profileOpen ? ' open' : ''}`}>
                        <a href="/profile">Modifier profil</a>
                        <form onSubmit={handleLogout}>
                            <button type="submit">Déconnexion</button>
                        </form>
                    </div>
                </div>
            </nav>
            {/* Sidebar - Replaced with component */}
            <Sidebar 
                user={user}
                roleLabel={roleLabel}
                permissions={permissions}
                featuresList={FEATURES_DASHBOARD} // Pass the FEATURES from Dashboard for now
                selectedFeature={selectedFeature}
                onFeatureClick={handleFeatureClick}
            />
            {/* Main Content */}
            <main className="main-content">
                {renderMainContent()}
            </main>
            <UserExportModal show={showImportModal} onClose={() => setShowImportModal(false)} />
        </div>
    );
}
