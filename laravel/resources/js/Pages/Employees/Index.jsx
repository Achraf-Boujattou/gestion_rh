import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '@/Components/Sidebar';

export default function Index({ employees = [], departments = [], roles = [], meta = null, links = null, filters = {} }) {
    const { flash = {}, permissions, auth, user } = usePage().props;
    const mainRole = user?.roles?.[0]?.name || 'employee';
    const roleLabel = mainRole.charAt(0).toUpperCase() + mainRole.slice(1);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sortField, setSortField] = useState(filters.sort_field || 'name');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);
    const [perPage] = useState(meta?.per_page || 10);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        Salaire_base: '',
        department_id: ''
    });

    // Avatar initials
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const handleFeatureClick = (feature) => {
        if (!feature) return;
        if (feature.permission === 'manage_employees') {
            router.get('/employees');
        } else if (feature.permission === 'edit_department') {
            router.get('/departments');
        }
    };

    // Affichage des notifications de succès/erreur depuis Laravel (flash)
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash.success, flash.error]);

    // Gestion du tri
    const handleSort = (field) => {
        const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get('/employees', { 
            search: searchTerm, 
            sort_field: field, 
            sort_direction: direction 
        }, { preserveState: true });
    };

    // Gestion de la recherche
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        router.get('/employees', { 
            search: e.target.value,
            sort_field: sortField,
            sort_direction: sortDirection
        }, { preserveState: true });
    };

    // Ajout d'un employé
    const handleAdd = (e) => {
        e.preventDefault();
        router.post('/employees', formData, {
            onSuccess: () => {
                setShowAddModal(false);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    Salaire_base: '',
                    department_id: '',
                });
                toast.success('Employé ajouté avec succès !');
            },
            onError: (errors) => {
                Object.values(errors).forEach(err => toast.error(err));
            }
        });
    };

    // Modification d'un employé
    const handleUpdate = (e) => {
        e.preventDefault();
        router.put(`/employees/${editingEmployee.id}`, formData, {
            onSuccess: () => {
                setEditingEmployee(null);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    Salaire_base: '',
                    department_id: '',
                });
                toast.success('Employé modifié avec succès !');
            },
            onError: (errors) => {
                Object.values(errors).forEach(err => toast.error(err));
            }
        });
    };

    // Suppression d'un employé
    const handleDelete = (employee) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
            router.delete(`/employees/${employee.id}`, {
                onSuccess: () => toast.success('Employé supprimé avec succès !'),
                onError: (errors) => {
                    Object.values(errors).forEach(err => toast.error(err));
                }
            });
        }
    };

    const handlePageChange = (page) => {
        router.get('/employees', {
            search: searchTerm,
            sort_field: sortField,
            sort_direction: sortDirection,
            page
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setCurrentPage(page);
            }
        });
    };

    const renderPagination = () => {
        if (!meta || !links) return null;

        const totalPages = Math.ceil(meta.total / perPage);
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                    disabled={currentPage === i}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ←
                </button>
                {pages}
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    →
                </button>
                <span className="pagination-info">
                    Page {currentPage} sur {totalPages} ({meta.total} employés)
                </span>
            </div>
        );
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
                    height: 64px;
                    background: #fff;
                    color: #232946;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding: 0 40px;
                    box-sizing: border-box;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 100;
                    box-shadow: 0 2px 16px rgba(80,80,180,0.07);
                }
                .navbar .profile-menu {
                    position: relative;
                    margin-left: 20px;
                    display: flex;
                    align-items: center;
                }
                .navbar .avatar {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #a7c7e7 60%, #1563ff 100%);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 1.1em;
                    margin-right: 10px;
                }
                .navbar .profile-btn {
                    background: none;
                    border: none;
                    color: #232946;
                    font-weight: bold;
                    font-size: 1.05em;
                    cursor: pointer;
                    padding: 8px 16px;
                    border-radius: 20px;
                    transition: background 0.2s;
                }
                .navbar .profile-btn:hover {
                    background: #eaf0fa;
                }
                .navbar .dropdown {
                    position: absolute;
                    right: 0;
                    top: 110%;
                    background: #fff;
                    color: #232946;
                    border-radius: 12px;
                    box-shadow: 0 4px 24px rgba(80,80,180,0.13);
                    min-width: 170px;
                    overflow: hidden;
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(-10px);
                    transition: all 0.25s;
                }
                .navbar .profile-menu.open .dropdown {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateY(0);
                }
                .navbar .dropdown a, .navbar .dropdown button {
                    display: block;
                    width: 100%;
                    padding: 12px 20px;
                    background: none;
                    border: none;
                    text-align: left;
                    color: #232946;
                    font-size: 1em;
                    cursor: pointer;
                    transition: background 0.18s;
                }
                .navbar .dropdown a:hover, .navbar .dropdown button:hover {
                    background: #eaf0fa;
                }
                .sidebar {
                    position: fixed;
                    top: 64px;
                    left: 0;
                    width: 240px;
                    height: calc(100vh - 64px);
                    background: #fff;
                    color: #232946;
                    padding: 36px 18px 24px 18px;
                    box-shadow: 2px 0 24px rgba(80,80,180,0.08);
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    border-right: 1px solid #e0e7ff;
                    border-radius: 0 18px 18px 0;
                }
                .main-content {
                    margin-left: 240px;
                    padding: 90px 40px 40px 40px;
                    min-height: 100vh;
                }
                @media (max-width: 900px) {
                    .sidebar { display: none; }
                    .main-content { margin-left: 0; }
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

            {/* Sidebar */}
            <Sidebar 
                user={user}
                roleLabel={roleLabel}
                permissions={permissions}
                selectedFeature={{ permission: 'manage_employees' }}
                onFeatureClick={handleFeatureClick}
            />

            {/* Main Content */}
            <main className="main-content">
                <Toaster position="top-right" />
                <div className="modern-container fade-in">
                    <div className="modern-header">
                        <h1 className="modern-title">Gestion des Employés</h1>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="modern-input"
                                style={{ width: '300px' }}
                            />
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="modern-button modern-button-primary"
                            >
                                Ajouter un employé
                            </button>
                        </div>
                    </div>

                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                                    Nom {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('Salaire_base')} style={{ cursor: 'pointer' }}>
                                    Salaire {sortField === 'Salaire_base' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th>Département</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td>{emp.name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.Salaire_base} €</td>
                                    <td>{departments.find(dep => dep.id === emp.department_id)?.name || ''}</td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                setEditingEmployee(emp);
                                                setFormData({
                                                    name: emp.name,
                                                    email: emp.email,
                                                    Salaire_base: emp.Salaire_base,
                                                    department_id: emp.department_id,
                                                });
                                            }}
                                            className="modern-button modern-button-success"
                                            style={{ marginRight: '0.5rem' }}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(emp)}
                                            className="modern-button modern-button-danger"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {renderPagination()}

                    {/* Modal d'ajout */}
                    {showAddModal && (
                        <div className="modern-modal-overlay">
                            <div className="modern-modal slide-in">
                                <div className="modern-modal-header">
                                    <h3 className="modern-modal-title">Ajouter un employé</h3>
                                </div>
                                <form onSubmit={handleAdd}>
                                    <div className="modern-form-group">
                                        <label className="modern-label">Nom</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            className="modern-input"
                                            required
                                        />
                                    </div>
                                    <div className="modern-form-group">
                                        <label className="modern-label">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="modern-input"
                                            required
                                        />
                                    </div>
                                    <div className="modern-form-group">
                                        <label className="modern-label">Mot de passe</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                            className="modern-input"
                                            required
                                        />
                                    </div>
                                    <div className="modern-form-group">
                                        <label className="modern-label">Salaire</label>
                                        <input
                                            type="number"
                                            value={formData.Salaire_base}
                                            onChange={e => {
                                                const value = parseFloat(e.target.value);
                                                if (value >= 0 && value <= 99999999.99) {
                                                    setFormData({...formData, Salaire_base: value});
                                                }
                                            }}
                                            className="modern-input"
                                            required
                                            min="0"
                                            max="99999999.99"
                                            step="0.01"
                                        />
                                        <small className="modern-input-help" style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                            Maximum: 99,999,999.99
                                        </small>
                                    </div>
                                    <div className="modern-form-group">
                                        <label className="modern-label">Département</label>
                                        <select
                                            value={formData.department_id}
                                            onChange={e => setFormData({...formData, department_id: e.target.value})}
                                            className="modern-select"
                                            required
                                        >
                                            <option value="">Sélectionner un département</option>
                                            {departments.map(dep => (
                                                <option key={dep.id} value={dep.id}>{dep.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modern-modal-footer">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="modern-button"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="modern-button modern-button-primary"
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Modal de modification */}
                    {editingEmployee && (
                        <div className="modern-modal-overlay">
                            <div className="modern-modal slide-in">
                                <div className="modern-modal-header">
                                    <h3 className="modern-modal-title">Modifier l'employé</h3>
                                </div>
                                <form onSubmit={handleUpdate}>
                                    <div className="modern-form-group">
                                        <label className="modern-label">Nom</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            className="modern-input"
                                            required
                                        />
                                    </div>
                                    <div className="modern-form-group">
                                        <label className="modern-label">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="modern-input"
                                            required
                                        />
                                    </div>
                                    <div className="modern-form-group">
                                        <label className="modern-label">Salaire</label>
                                        <input
                                            type="number"
                                            value={formData.Salaire_base}
                                            onChange={e => {
                                                const value = parseFloat(e.target.value);
                                                if (value >= 0 && value <= 99999999.99) {
                                                    setFormData({...formData, Salaire_base: value});
                                                }
                                            }}
                                            className="modern-input"
                                            required
                                            min="0"
                                            max="99999999.99"
                                            step="0.01"
                                        />
                                        <small className="modern-input-help" style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                            Maximum: 99,999,999.99
                                        </small>
                                    </div>
                                    <div className="modern-form-group">
                                        <label className="modern-label">Département</label>
                                        <select
                                            value={formData.department_id}
                                            onChange={e => setFormData({...formData, department_id: e.target.value})}
                                            className="modern-select"
                                            required
                                        >
                                            <option value="">Sélectionner un département</option>
                                            {departments.map(dep => (
                                                <option key={dep.id} value={dep.id}>{dep.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modern-modal-footer">
                                        <button
                                            type="button"
                                            onClick={() => setEditingEmployee(null)}
                                            className="modern-button"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="modern-button modern-button-primary"
                                        >
                                            Modifier
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}