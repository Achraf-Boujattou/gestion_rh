import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

export default function EmployeesTable({ employees: initialEmployees = [], departments = [], meta = null, links = null, filters = {} }) {
    const [employees, setEmployees] = useState(initialEmployees);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sortField, setSortField] = useState(filters.sort_field || 'name');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        Salaire_base: '',
        department_id: ''
    });

    // Gestion du tri
    const handleSort = async (field) => {
        const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        
        try {
            const response = await fetch(`/employees?sort_field=${field}&sort_direction=${direction}&page=${currentPage}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Erreur lors du tri');
            
            const data = await response.json();
            if (data.employees) {
                setEmployees(data.employees);
            }
        } catch (error) {
            toast.error('Erreur lors du tri des employés');
        }
    };

    // Gestion de la recherche
    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        try {
            const response = await fetch(`/employees?search=${encodeURIComponent(value)}&sort_field=${sortField}&sort_direction=${sortDirection}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Erreur lors de la recherche');
            
            const data = await response.json();
            if (data.employees) {
                setEmployees(data.employees);
            }
        } catch (error) {
            console.error('Erreur de recherche:', error);
            toast.error('Erreur lors de la recherche');
        }
    };

    // Ajout d'un employé
    const handleAdd = async (e) => {
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
                refreshEmployees();
            },
            onError: (errors) => {
                toast.error('Erreur lors de l\'ajout: ' + Object.values(errors).join('\n'));
            },
        });
    };

    // Modification d'un employé
    const handleUpdate = async (e) => {
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
                refreshEmployees();
            },
            onError: (errors) => {
                toast.error('Erreur lors de la modification: ' + Object.values(errors).join('\n'));
            },
        });
    };

    // Suppression d'un employé
    const handleDelete = async (employee) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) return;
        
        router.delete(`/employees/${employee.id}`, {}, {
            onSuccess: () => {
                refreshEmployees();
            },
            onError: (errors) => {
                toast.error('Erreur lors de la suppression: ' + Object.values(errors).join('\n'));
            },
        });
    };

    const refreshEmployees = async () => {
        try {
            const response = await fetch(`/employees?sort_field=${sortField}&sort_direction=${sortDirection}&page=${currentPage}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Erreur lors du rafraîchissement');
            
            const data = await response.json();
            if (data.employees) {
                setEmployees(data.employees);
            }
        } catch (error) {
            toast.error('Erreur lors du rafraîchissement des employés');
        }
    };

    const handlePageChange = async (page) => {
        try {
            const response = await fetch(`/employees?page=${page}&sort_field=${sortField}&sort_direction=${sortDirection}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Erreur lors du changement de page');
            
            const data = await response.json();
            if (data.employees) {
                setEmployees(data.employees);
                setCurrentPage(page);
            }
        } catch (error) {
            toast.error('Erreur lors du changement de page');
        }
    };

    const handleViewDetails = (emp) => {
        setSelectedEmployee(emp);
        setShowDetailsModal(true);
    };

    return (
        <div className="modern-container fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <style>{`
                .action-icon {
                    background: none;
                    border: none;
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                    transition: background 0.2s;
                }
                .action-icon.edit { color: #059669; }
                .action-icon.delete { color: #dc2626; }
                .action-icon.details { color: #2563eb; }
                .action-icon:hover { background: #f3f4f6; }
            `}</style>
            <Toaster position="top-right" />
            <div className="modern-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="modern-title" style={{ fontSize: '2rem', color: '#1e3a8a', fontWeight: '600' }}>Gestion des Employés</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Rechercher un employé..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="modern-input"
                            style={{
                                padding: '0.75rem 1rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                width: '300px',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)} 
                        className="modern-button modern-button-primary"
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            backgroundColor: '#4f46e5',
                            color: 'white',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Ajouter un employé
                    </button>
                </div>
            </div>

            <table className="modern-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <thead>
                    <tr>
                        <th style={{ 
                            background: '#4f46e5', 
                            color: 'white', 
                            padding: '1rem', 
                            textAlign: 'left',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }} onClick={() => handleSort('name')}>
                            NOM {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ 
                            background: '#4f46e5', 
                            color: 'white', 
                            padding: '1rem', 
                            textAlign: 'left',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }} onClick={() => handleSort('email')}>
                            EMAIL {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ 
                            background: '#4f46e5', 
                            color: 'white', 
                            padding: '1rem', 
                            textAlign: 'left',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }} onClick={() => handleSort('Salaire_base')}>
                            SALAIRE {sortField === 'Salaire_base' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ 
                            background: '#4f46e5', 
                            color: 'white', 
                            padding: '1rem', 
                            textAlign: 'left',
                            fontWeight: '600'
                        }}>
                            DÉPARTEMENT
                        </th>
                        <th style={{ 
                            background: '#4f46e5', 
                            color: 'white', 
                            padding: '1rem', 
                            textAlign: 'left',
                            fontWeight: '600'
                        }}>
                            ACTIONS
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {employees?.map(emp => (
                        <tr key={emp.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '1rem', color: '#374151' }}>{emp.name}</td>
                            <td style={{ padding: '1rem', color: '#374151' }}>{emp.email}</td>
                            <td style={{ padding: '1rem', color: '#374151' }}>{emp.Salaire_base} €</td>
                            <td style={{ padding: '1rem', color: '#374151' }}>{departments.find(dep => dep.id === emp.department_id)?.name || '-'}</td>
                            <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleViewDetails(emp)}
                                        className="action-icon details"
                                        title="Détails"
                                    >
                                        <FaEye />
                                    </button>
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
                                        className="action-icon edit"
                                        title="Modifier"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(emp)}
                                        className="action-icon delete"
                                        title="Supprimer"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {meta && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '2rem' 
                }}>
                    <button
                        className="pagination-button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #e5e7eb',
                            background: 'white',
                            color: '#374151',
                            borderRadius: '8px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 1 ? 0.5 : 1,
                            transition: 'all 0.2s',
                            fontSize: '0.875rem'
                        }}
                    >
                        ←
                    </button>
                    {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                            style={{
                                padding: '0.5rem 1rem',
                                border: '1px solid #e5e7eb',
                                background: currentPage === page ? '#4f46e5' : 'white',
                                color: currentPage === page ? 'white' : '#374151',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                minWidth: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem'
                            }}
                            disabled={currentPage === page}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className="pagination-button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === meta.last_page}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #e5e7eb',
                            background: 'white',
                            color: '#374151',
                            borderRadius: '8px',
                            cursor: currentPage === meta.last_page ? 'not-allowed' : 'pointer',
                            opacity: currentPage === meta.last_page ? 0.5 : 1,
                            transition: 'all 0.2s',
                            fontSize: '0.875rem'
                        }}
                    >
                        →
                    </button>
                    <span style={{ 
                        color: '#6b7280', 
                        fontSize: '0.875rem',
                        margin: '0 1rem'
                    }}>
                        Page {currentPage} sur {meta.last_page} ({meta.total} employés)
                    </span>
                </div>
            )}

            {/* Modal d'ajout */}
            {showAddModal && (
                <div className="modern-modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="modern-modal" style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div className="modern-modal-header" style={{ marginBottom: '1.5rem' }}>
                            <h3 className="modern-modal-title" style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#1a1a1a'
                            }}>Ajouter un employé</h3>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className="modern-form-group" style={{ marginBottom: '1rem' }}>
                                <label className="modern-label" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#4a5568'
                                }}>Nom</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="modern-input"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.375rem',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>
                            <div className="modern-form-group" style={{ marginBottom: '1rem' }}>
                                <label className="modern-label" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#4a5568'
                                }}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="modern-input"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.375rem',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>
                            <div className="modern-form-group" style={{ marginBottom: '1rem' }}>
                                <label className="modern-label" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#4a5568'
                                }}>Mot de passe</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    className="modern-input"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.375rem',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>
                            <div className="modern-form-group" style={{ marginBottom: '1rem' }}>
                                <label className="modern-label" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#4a5568'
                                }}>Salaire</label>
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
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.375rem',
                                        fontSize: '1rem'
                                    }}
                                    required
                                    min="0"
                                    max="99999999.99"
                                    step="0.01"
                                />
                            </div>
                            <div className="modern-form-group" style={{ marginBottom: '1rem' }}>
                                <label className="modern-label" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#4a5568'
                                }}>Département</label>
                                <select
                                    value={formData.department_id}
                                    onChange={e => setFormData({...formData, department_id: e.target.value})}
                                    className="modern-select"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.375rem',
                                        fontSize: '1rem',
                                        backgroundColor: 'white'
                                    }}
                                    required
                                >
                                    <option value="">Sélectionner un département</option>
                                    {departments.map(dep => (
                                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modern-modal-footer" style={{
                                marginTop: '2rem',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '1rem'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="modern-button"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.375rem',
                                        backgroundColor: '#f3f4f6',
                                        color: '#4b5563',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="modern-button modern-button-primary"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '0.375rem',
                                        backgroundColor: '#4f46e5',
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
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
                <div className="modern-modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="modern-modal" style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div className="modern-modal-header" style={{ marginBottom: '1.5rem' }}>
                            <h3 className="modern-modal-title" style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#1a1a1a'
                            }}>Modifier l'employé</h3>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className="modern-form-group" style={{ marginBottom: '1rem' }}>
                                <label className="modern-label" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#4a5568'
                                }}>Nom</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="modern-input"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.375rem',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>
                            <div className="modern-form-group" style={{ marginBottom: '1rem' }}>
                                <label className="modern-label" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#4a5568'
                                }}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="modern-input"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.375rem',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>
                            <div className="modern-form-group" style={{ marginBottom: '1rem' }}>
                                <label className="modern-label" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#4a5568'
                                }}>Salaire</label>
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
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.375rem',
                                        fontSize: '1rem'
                                    }}
                                    required
                                    min="0"
                                    max="99999999.99"
                                    step="0.01"
                                />
                            </div>
                            <div className="modern-form-group" style={{ marginBottom: '1rem' }}>
                                <label className="modern-label" style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#4a5568'
                                }}>Département</label>
                                <select
                                    value={formData.department_id}
                                    onChange={e => setFormData({...formData, department_id: e.target.value})}
                                    className="modern-select"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.375rem',
                                        fontSize: '1rem',
                                        backgroundColor: 'white'
                                    }}
                                    required
                                >
                                    <option value="">Sélectionner un département</option>
                                    {departments.map(dep => (
                                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modern-modal-footer" style={{
                                marginTop: '2rem',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '1rem'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setEditingEmployee(null)}
                                    className="modern-button"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.375rem',
                                        backgroundColor: '#f3f4f6',
                                        color: '#4b5563',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="modern-button modern-button-primary"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '0.375rem',
                                        backgroundColor: '#4f46e5',
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Modifier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDetailsModal && selectedEmployee && (
                 <div className="modern-modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }} onClick={() => setShowDetailsModal(false)}>
                    <div className="modern-modal" style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }} onClick={e => e.stopPropagation()}>
                        <div className="modern-modal-header">
                            <h3 className="modern-modal-title">Détails de l'employé</h3>
                        </div>
                        <div style={{ lineHeight: '1.8', padding: '1rem 0' }}>
                            <p><strong>Nom:</strong> {selectedEmployee.name}</p>
                            <p><strong>Email:</strong> {selectedEmployee.email}</p>
                            <p><strong>Salaire de base:</strong> {selectedEmployee.Salaire_base} €</p>
                            <p><strong>Département:</strong> {departments.find(dep => dep.id === selectedEmployee.department_id)?.name || '-'}</p>
                        </div>
                        <div className="modern-modal-footer">
                            <button
                                type="button"
                                onClick={() => setShowDetailsModal(false)}
                                className="modern-button"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 