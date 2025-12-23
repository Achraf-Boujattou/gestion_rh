import { usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import ImportBiometricsButton from '../components/ImportBiometricsButton';
import UserExportModal from '../components/UserExportModal';
import Sidebar from '@/Components/Sidebar';
import DepartmentsTable from './Departments/DepartmentsTable';
import EmployeesTable from './Employees/EmployeesTable';
import StatisticsView from './Dashboard/StatisticsView';
import LeaveIndex from './Leave/Index';
import { useForm } from '@inertiajs/react';
import { useTheme } from '@/Context/ThemeContext';
import EmployeeAbsenceList from '../components/EmployeeAbsenceList';
import AbsenceManagement from '../components/AbsenceManagement';

// FEATURES constant is now in Sidebar.jsx

export default function Dashboard({ 
    departments: initialDepartments = [], 
    employees: initialEmployees = [], 
    meta = null, 
    links = null,
    leaves = [],
    statistics = {}
}) {
    const { darkMode, toggleTheme } = useTheme();
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
    const [mainContent, setMainContent] = useState('view_dashboard');
    const [currentDepartments, setCurrentDepartments] = useState(initialDepartments);
    const [currentEmployees, setCurrentEmployees] = useState(initialEmployees);
    const [currentMeta, setCurrentMeta] = useState(meta);
    const [currentLinks, setCurrentLinks] = useState(links);
    const [showImportModal, setShowImportModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useForm({
        type: '',
        start_date: '',
        end_date: '',
        reason: ''
    });

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

    // Ajouter cette fonction pour gérer les clics en dehors du menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            const profileMenu = document.querySelector('.profile-menu');
            if (profileMenu && !profileMenu.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Define FEATURES here for now to pass to Sidebar, will be adjusted in Phase 2
    const FEATURES_DASHBOARD = [
        {
            label: 'Consulter son dashboard',
            permission: 'view_dashboard',
            admin: true,
            leader: true,
            employee: true,
        },
        {
            label: 'Demander un congé',
            permission: 'request_leave',
            admin: true,
            leader: true,
            employee: true,
            priority: 1
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

    // Filtrer les fonctionnalités selon le rôle de l'utilisateur
    const getFilteredFeatures = () => {
        const userRole = user?.roles?.[0]?.name || 'employee';
        return FEATURES_DASHBOARD
            .filter(feature => {
                if (userRole === 'admin') return feature.admin;
                if (userRole === 'leader') return feature.leader;
                if (userRole === 'employee') return feature.employee;
                return false;
            })
            .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const handleFeatureClick = (permission) => {
        setMainContent(permission);
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

    const handleLeaveSubmit = (e) => {
        e.preventDefault();
        form.post('/leaves', {
            onSuccess: () => {
                // Réinitialiser le formulaire
                form.reset();
                // Afficher un message de succès
                alert('Votre demande de congé a été soumise avec succès!');
            },
        });
    };

    const renderLeaveRequestForm = () => {
    return (
            <div className="leave-request-container">
                <style>{`
                    .leave-request-container {
                        background: white;
                        border-radius: 18px;
                        padding: 2rem;
                        box-shadow: 0 4px 32px rgba(80,80,180,0.1);
                        max-width: 800px;
                        width: 100%;
                        margin: 0 auto;
                    }
                    .leave-request-title {
                        color: #1563ff;
                        font-size: 1.8rem;
                        font-weight: 600;
                        margin-bottom: 1.5rem;
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                    }
                    .leave-request-form {
                        display: grid;
                        gap: 1.5rem;
                    }
                    .form-group {
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    .form-group label {
                        font-weight: 500;
                        color: #2B3674;
                        font-size: 1rem;
                    }
                    .form-group select, 
                    .form-group input, 
                    .form-group textarea {
                        padding: 0.75rem;
                        border: 1px solid #E0E5F2;
                        border-radius: 8px;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                        background: white;
                    }
                    .form-group select:focus, 
                    .form-group input:focus, 
                    .form-group textarea:focus {
                        outline: none;
                        border-color: #1563ff;
                        box-shadow: 0 0 0 3px rgba(21, 99, 255, 0.1);
                    }
                    .submit-button {
                        background: #1563ff;
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-top: 1rem;
                    }
                    .submit-button:hover {
                        background: #0047cc;
                        transform: translateY(-2px);
                    }
                    .submit-button:disabled {
                        background: #ccc;
                        cursor: not-allowed;
                        transform: none;
                    }
                    .error-message {
                        color: #dc2626;
                        font-size: 0.875rem;
                        margin-top: 0.25rem;
                    }
                `}</style>
                <div className="leave-request-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect x="3" y="6" width="18" height="16" rx="2"></rect>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                    </svg>
                    Demande de Congé
                </div>
                <form onSubmit={handleLeaveSubmit} className="leave-request-form">
                    <div className="form-group">
                        <label>Type de Congé</label>
                        <select
                            value={form.data.type}
                            onChange={e => form.setData('type', e.target.value)}
                            required
                        >
                            <option value="">Sélectionnez un type</option>
                            <option value="Congé Maladie">Congé Maladie</option>
                            <option value="Congé Annuel">Congé Annuel</option>
                            <option value="Congé Spécial">Congé Spécial</option>
                        </select>
                        {form.errors.type && <div className="error-message">{form.errors.type}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label>Date de Début</label>
                        <input
                            type="date"
                            value={form.data.start_date}
                            onChange={e => form.setData('start_date', e.target.value)}
                            required
                        />
                        {form.errors.start_date && <div className="error-message">{form.errors.start_date}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label>Date de Fin</label>
                        <input
                            type="date"
                            value={form.data.end_date}
                            onChange={e => form.setData('end_date', e.target.value)}
                            required
                        />
                        {form.errors.end_date && <div className="error-message">{form.errors.end_date}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label>Motif</label>
                        <textarea
                            rows="4"
                            value={form.data.reason}
                            onChange={e => form.setData('reason', e.target.value)}
                            placeholder="Décrivez la raison de votre demande..."
                            required
                        ></textarea>
                        {form.errors.reason && <div className="error-message">{form.errors.reason}</div>}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={form.processing}
                    >
                        {form.processing ? 'Envoi en cours...' : 'Soumettre la Demande'}
                    </button>
                </form>
            </div>
        );
    };

    // Render main content based on state
    const renderMainContent = () => {
        switch (mainContent) {
            case 'view_dashboard':
                return <StatisticsView statistics={statistics} />;
            case 'manage_employees':
                return <EmployeesTable employees={currentEmployees} departments={currentDepartments} meta={currentMeta} links={currentLinks} filters={{ search: searchTerm, sort_field: sortField, sort_direction: sortDirection }} />;
            case 'edit_department':
                return <DepartmentsTable departments={currentDepartments} meta={currentMeta} links={currentLinks} />;
            case 'request_absence':
                return <EmployeeAbsenceList />;
            case 'manage_absences':
                return <AbsenceManagement />;
            case 'request_leave':
                return renderLeaveRequestForm();
            case 'validate_leaves':
                return <LeaveIndex auth={{ user }} leaves={leaves} />;
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
        <div className={`dashboard-auth-root ${darkMode ? 'dark' : ''}`}>
            <style>{`
                .dashboard-auth-root {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #eaf0fa 60%, #fff 100%);
                    font-family: 'Segoe UI', Arial, sans-serif;
                    transition: all 0.3s ease;
                }
                .dashboard-auth-root.dark {
                    background: linear-gradient(135deg, #1a1f36 60%, #111827 100%);
                    color: #fff;
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
                    transition: all 0.3s ease;
                }
                .dark .navbar {
                    background: #1e293b;
                    color: #fff;
                    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
                }
                .theme-toggle {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #2B3674;
                    transition: all 0.3s ease;
                }
                .dark .theme-toggle {
                    color: #fff;
                }
                .theme-toggle:hover {
                    background: rgba(79, 70, 229, 0.1);
                }
                .dark .theme-toggle:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .navbar-logo span {
                    background: linear-gradient(135deg, #1563ff 0%, #54a0ff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .dark .navbar-logo span {
                    background: linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .dark .profile-menu {
                    background: #2d3748;
                }
                .dark .profile-name {
                    color: #fff;
                }
                .dark .profile-role {
                    color: #cbd5e0;
                }
                .dark .dropdown {
                    background: #2d3748;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }
                .dark .dropdown-item {
                    color: #fff;
                }
                .dark .dropdown-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .navbar-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 1.8em;
                    font-weight: bold;
                    color: #1563ff;
                    text-decoration: none;
                    position: relative;
                    padding-right: 32px;
                }
                .navbar-logo::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 1px;
                    height: 32px;
                    background: #e0e5f2;
                }
                .navbar-search {
                    position: relative;
                }
                .navbar-search::before {
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
                .navbar-actions {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .navbar-notification {
                    position: relative;
                    padding: 8px;
                    border-radius: 50%;
                    background: #f4f7fe;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .navbar-notification:hover {
                    background: #e9edf7;
                    transform: translateY(-2px);
                }
                .navbar-notification::after {
                    content: '';
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 8px;
                    height: 8px;
                    background: #1563ff;
                    border-radius: 50%;
                    border: 2px solid white;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(21, 99, 255, 0.4);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(21, 99, 255, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(21, 99, 255, 0);
                    }
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
                    width: 100%;
                    padding: 10px 16px 10px 40px;
                    border: 1px solid #E0E5F2;
                    border-radius: 30px;
                    font-size: 0.9em;
                    color: #2B3674;
                    background: #F4F7FE;
                    transition: all 0.3s ease;
                }
                .navbar .search-box:focus {
                    outline: none;
                    border-color: #1563ff;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(21, 99, 255, 0.1);
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
                    padding: 6px 12px;
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #F4F7FE;
                    z-index: 1000;
                }
                .navbar .profile-menu:hover {
                    background: #E9EDF7;
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
                .navbar .profile-btn {
                    background: none;
                    border: none;
                    padding: 4px;
                    cursor: pointer;
                    color: #2B3674;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .navbar .dropdown {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: 0;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(21, 99, 255, 0.1);
                    min-width: 200px;
                    padding: 8px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                    z-index: 1001;
                }
                .navbar .dropdown.open {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                .navbar .dropdown-item {
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
                    text-decoration: none;
                }
                .navbar .dropdown-item:hover {
                    background: #F4F7FE;
                    color: #1563ff;
                }
                .navbar .dropdown-item svg {
                    color: #A3AED0;
                    transition: color 0.2s ease;
                }
                .navbar .dropdown-item:hover svg {
                    color: #1563ff;
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
                    align-items: center;
                    justify-content: center;
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
                    width: 100%;
                    max-width: 600px;
                    text-align: center;
                    animation: fadeInWelcome 1.5s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
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
                    width: 100%;
                    text-align: center;
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
                    width: 100%;
                    padding: 10px 16px 10px 40px;
                    border: 1px solid #E0E5F2;
                    border-radius: 30px;
                    font-size: 0.9em;
                    color: #2B3674;
                    background: #F4F7FE;
                    transition: all 0.3s ease;
                }
                .search-box:focus {
                    outline: none;
                    border-color: #1563ff;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(21, 99, 255, 0.1);
                }
                .navbar-search {
                    position: relative;
                }
                .navbar-search::before {
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
                .profile-menu {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 6px 12px;
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #F4F7FE;
                    z-index: 1000;
                }
                .profile-menu:hover {
                    background: #E9EDF7;
                }
                .profile-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .profile-name {
                    font-weight: 600;
                    color: #2B3674;
                    font-size: 0.95em;
                }
                .profile-role {
                    color: #A3AED0;
                    font-size: 0.8em;
                }
                .profile-btn {
                    background: none;
                    border: none;
                    padding: 4px;
                    cursor: pointer;
                    color: #2B3674;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .dropdown {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: 0;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(21, 99, 255, 0.1);
                    min-width: 200px;
                    padding: 8px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                    z-index: 1001;
                }
                .dropdown.open {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                .dropdown-item {
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
                    text-decoration: none;
                }
                .dropdown-item:hover {
                    background: #F4F7FE;
                    color: #1563ff;
                }
                .dropdown-item svg {
                    color: #A3AED0;
                    transition: color 0.2s ease;
                }
                .dropdown-item:hover svg {
                    color: #1563ff;
                }
                @media (max-width: 900px) {
                    .main-content {
                        margin-left: 0;
                        width: 100%;
                        padding: 90px 20px 40px;
                    }
                }
                /* Dark mode styles */
                .dark {
                    background: #1a1f36;
                    color: #e0e7ff;
                }
                
                .dark .navbar {
                    background: #242b42;
                    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
                }
                
                .dark .navbar-logo {
                    color: #54a0ff;
                }
                
                .dark .profile-menu {
                    background: #2d3555;
                }
                
                .dark .profile-name {
                    color: #e0e7ff;
                }
                
                .dark .profile-role {
                    color: #8b9cc7;
                }
                
                .dark .dropdown {
                    background: #242b42;
                }
                
                .dark .dropdown-item {
                    color: #e0e7ff;
                }
                
                .dark .dropdown-item:hover {
                    background: #2d3555;
                }
                
                .dark .welcome-box {
                    background: #242b42;
                    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
                }
                
                .dark .welcome-box h1 {
                    color: #54a0ff;
                }
                
                .dark .welcome-box p {
                    color: #8b9cc7;
                }
                
                .dark .sidebar {
                    background: #242b42;
                    border-right-color: rgba(255, 255, 255, 0.1);
                }
                
                .dark .sidebar .user-name {
                    color: #e0e7ff;
                }
                
                .dark .sidebar li {
                    color: #8b9cc7;
                }
                
                .dark .sidebar li:hover {
                    background: rgba(84, 160, 255, 0.1);
                }
                
                /* Theme toggle button styles */
                .theme-toggle {
                    padding: 8px;
                    border-radius: 50%;
                    background: #f4f7fe;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-right: 16px;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .dark .theme-toggle {
                    background: #2d3555;
                }
                
                .theme-toggle:hover {
                    transform: translateY(-2px);
                }
                
                .dark .theme-toggle:hover {
                    background: #3a4674;
                }
            `}</style>
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-logo">
                    <span>ONESSTA</span>
                </div>
                <div className="navbar-actions">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {darkMode ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#54a0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"/>
                                <line x1="12" y1="1" x2="12" y2="3"/>
                                <line x1="12" y1="21" x2="12" y2="23"/>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                <line x1="1" y1="12" x2="3" y2="12"/>
                                <line x1="21" y1="12" x2="23" y2="12"/>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1563ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                        )}
                    </button>
                    <div className="navbar-notification">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </div>
                    <div className={`profile-menu${profileOpen ? ' open' : ''}`}>
                        <span className="avatar">{initials}</span>
                        <div className="profile-info">
                            <span className="profile-name">{user?.name}</span>
                            <span className="profile-role">{roleLabel}</span>
                        </div>
                        <button
                            className="profile-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setProfileOpen(!profileOpen);
                            }}
                            type="button"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9l6 6 6-6"/>
                            </svg>
                        </button>
                        <div className={`dropdown${profileOpen ? ' open' : ''}`}>
                            <a href="/profile" className="dropdown-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                Modifier profil
                            </a>
                            <form onSubmit={handleLogout}>
                                <button type="submit" className="dropdown-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Déconnexion
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Sidebar - Replaced with component */}
            <Sidebar
                user={user}
                roleLabel={roleLabel}
                permissions={[...(permissions || []), 'manage_absences']}
                selectedFeature={mainContent}
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
