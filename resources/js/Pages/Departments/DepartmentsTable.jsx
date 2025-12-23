//DepartemetsTable.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

export default function DepartmentsTable({ departments: initialDepartments, links = null, meta = null }) {
    const [departments, setDepartments] = useState(initialDepartments);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ id: null, name: '', description: '', leader_id: '' });
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedDepartmentEmployees, setSelectedDepartmentEmployees] = useState([]);
    const [showEmployees, setShowEmployees] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    useEffect(() => {
        setDepartments(initialDepartments);
    }, [initialDepartments]);

    useEffect(() => {
        console.log("Données initiales (props):", initialDepartments);
        console.log("State departments:", departments);
        // Add detailed logging for leader information
        departments.forEach(dept => {
            console.log(`Department ${dept.name} leader info:`, {
                hasLeader: !!dept.leader,
                leaderData: dept.leader,
                leaderName: dept?.leader?.name
            });
        });
    }, [initialDepartments, departments]);

    const fetchUsers = async (departmentId = null) => {
        try {
            const url = departmentId 
                ? `/departments/users?department_id=${departmentId}`
                : '/departments/users';
            const res = await fetch(url);
            const data = await res.json();
            setUsers(data.users);
        } catch (error) {
            toast.error('Erreur lors du chargement des utilisateurs');
        }
    };

    const handleAdd = () => {
        setForm({ id: null, name: '', description: '', leader_id: '' });
        setIsEdit(false);
        setShowForm(true);
        fetchUsers();
    };

    const handleEdit = async (dept) => {
        setForm({
            id: dept.id,
            name: dept.name,
            description: dept.description || '',
            leader_id: dept.leader ? dept.leader.id : ''
        });
        setIsEdit(true);
        setShowForm(true);
        fetchUsers(dept.id);
        
        try {
            const response = await fetch(`/departments/${dept.id}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.employees) {
                    setSelectedDepartmentEmployees(data.employees);
                    setShowEmployees(true);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des employés:', error);
        }
    };

    const handleDelete = async (dept) => {
        if (!dept.id) {
            toast.error("Impossible de supprimer : identifiant du département manquant.");
            return;
        }
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) return;

        setLoading(true);
        router.delete(`/departments/${dept.id}`, {
            onSuccess: () => {
                toast.success('Département supprimé avec succès');
                refreshDepartments();
            },
            onError: (errors) => {
                toast.error('Erreur lors de la suppression du département');
                console.error('Erreur de suppression:', errors);
            },
            onFinish: () => setLoading(false)
        });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
                    name: form.name,
                    description: form.description,
                    leader_id: form.leader_id || null
        };

        if (isEdit && form.id) {
            router.put(`/departments/${form.id}`, data, {
                onSuccess: () => {
                    setShowForm(false);
                    toast.success('Département modifié avec succès');
                    refreshDepartments();
                },
                onError: (errors) => {
                    toast.error('Erreur lors de la modification: ' + Object.values(errors).join('\n'));
                },
                onFinish: () => setLoading(false)
            });
        } else {
            router.post('/departments', data, {
                onSuccess: () => {
            setShowForm(false);
                    toast.success('Département créé avec succès');
                    refreshDepartments();
                },
                onError: (errors) => {
                    toast.error('Erreur lors de la création: ' + Object.values(errors).join('\n'));
                },
                onFinish: () => setLoading(false)
            });
        }
    };

    const refreshDepartments = async () => {
        router.reload({ only: ['departments'] });
    };

    const handlePageChange = async (page) => {
        try {
            const res = await fetch(`/departments?page=${page}`);
            const data = await res.json();
            setDepartments(data.departments);
            setCurrentPage(page);
        } catch (error) {
            toast.error('Erreur lors du chargement des départements');
        }
    };

    const handleSort = (field) => {
        const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);
        
        fetch(`/departments?sort_field=${field}&sort_direction=${newDirection}&page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setDepartments(data.departments);
            })
            .catch(error => {
                toast.error('Erreur lors du tri des départements');
            });
    };

    // Fonction debounce pour éviter trop de requêtes
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const performSearch = async (value) => {
        if (value.trim() === '') {
            setDepartments(initialDepartments);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`/departments?search=${encodeURIComponent(value)}&sort_field=${sortField}&sort_direction=${sortDirection}&page=1`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erreur réseau');
            }

            const data = await response.json();
            setDepartments(data.departments);
            setCurrentPage(1);
        } catch (error) {
            console.error('Erreur de recherche:', error);
            toast.error('Erreur lors de la recherche des départements');
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce la fonction de recherche
    const debouncedSearch = React.useCallback(
        debounce((value) => performSearch(value), 300),
        [sortField, sortDirection]
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleViewDetails = async (dept) => {
        setSelectedDepartment(dept);
        setShowDetailsModal(true);
        try {
            const response = await fetch(`/departments/${dept.id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setSelectedDepartmentEmployees(data.employees || []);
        } catch (error) {
            toast.error("Erreur lors de la récupération des détails du département.");
        }
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
                    className="pagination-button"
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #e5e7eb',
                        background: currentPage === i ? '#4f46e5' : 'white',
                        color: currentPage === i ? 'white' : '#374151',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        minWidth: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem'
                    }}
                    disabled={currentPage === i}
                >
                    {i}
                </button>
            );
        }

        return (
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
                {pages}
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        color: '#374151',
                        borderRadius: '8px',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        opacity: currentPage === totalPages ? 0.5 : 1,
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
                    Page {currentPage} sur {totalPages} ({meta.total} départements)
                </span>
            </div>
        );
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
            <div className="modern-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="modern-title" style={{ fontSize: '2rem', color: '#1e3a8a', fontWeight: '600' }}>Liste des Départements</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Rechercher un département..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="modern-input"
                            style={{
                                padding: '0.75rem 1rem',
                                paddingRight: isSearching ? '2.5rem' : '1rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                width: '300px',
                                fontSize: '0.875rem'
                            }}
                            disabled={isSearching}
                        />
                        {isSearching && (
                            <div style={{
                                position: 'absolute',
                                right: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '1.25rem',
                                height: '1.25rem',
                                border: '2px solid #4f46e5',
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                        )}
                    </div>
                    <button 
                        onClick={handleAdd} 
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
                        Ajouter un département
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="modern-modal-overlay">
                    <div className="modern-modal slide-in">
                        <div className="modern-modal-header">
                            <h3 className="modern-modal-title">
                                {isEdit ? 'Modifier le département' : 'Ajouter un département'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modern-form-group">
                                <label className="modern-label">Nom</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="modern-input"
                                />
                            </div>
                            <div className="modern-form-group">
                                <label className="modern-label">Description</label>
                                <input
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="modern-input"
                                />
                            </div>
                            {isEdit && (
                                <div className="modern-form-group">
                                    <label className="modern-label">Leader</label>
                                    <select
                                        name="leader_id"
                                        value={form.leader_id || ''}
                                        onChange={handleChange}
                                        className="modern-select"
                                    >
                                        <option value="">Aucun leader</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                            )}
                            <div className="modern-modal-footer">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="modern-button"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="modern-button modern-button-primary"
                                >
                                    {isEdit ? 'Modifier' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                        }} onClick={() => handleSort('description')}>
                            DESCRIPTION {sortField === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ 
                            background: '#4f46e5', 
                            color: 'white', 
                            padding: '1rem', 
                            textAlign: 'left',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }} onClick={() => handleSort('leader_id')}>
                            LEADER {sortField === 'leader_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ 
                            background: '#4f46e5', 
                            color: 'white', 
                            padding: '1rem', 
                            textAlign: 'left',
                            fontWeight: '600'
                        }}>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((dept) => (
                        <tr key={dept.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '1rem', color: '#374151' }}>{dept.name}</td>
                            <td style={{ padding: '1rem', color: '#374151' }}>{dept.description || '-'}</td>
                            <td style={{ padding: '1rem', color: '#374151' }}>
                                {dept.leader && dept.leader.name ? (
                                    <span style={{
                                        backgroundColor: '#EEF2FF',
                                        color: '#4F46E5',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        display: 'inline-block'
                                    }}>
                                        {dept.leader.name}
                                    </span>
                                ) : (
                                    <span style={{
                                        color: '#9CA3AF',
                                        fontSize: '0.875rem'
                                    }}>
                                        Non assigné
                                    </span>
                                )}
                            </td>
                            <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleViewDetails(dept)}
                                        className="action-icon details"
                                        title="Détails"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(dept)}
                                        className="action-icon edit"
                                        title="Modifier"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dept)}
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

            {renderPagination()}

            {showDetailsModal && selectedDepartment && (
                <div className="modern-modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modern-modal" onClick={e => e.stopPropagation()}>
                        <div className="modern-modal-header">
                            <h3 className="modern-modal-title">Détails du département</h3>
                        </div>
                        <div style={{ lineHeight: '1.8', padding: '1rem 0' }}>
                            <p><strong>Nom:</strong> {selectedDepartment.name}</p>
                            <p><strong>Description:</strong> {selectedDepartment.description || '-'}</p>
                            <p><strong>Leader:</strong> {selectedDepartment.leader?.name || 'Non assigné'}</p>
                            <h4 style={{ fontWeight: '600', marginTop: '1rem', marginBottom: '0.5rem' }}>Employés:</h4>
                            {selectedDepartmentEmployees.length > 0 ? (
                                <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                                    {selectedDepartmentEmployees.map(emp => <li key={emp.id}>{emp.name}</li>)}
                                </ul>
                            ) : (
                                <p>Aucun employé dans ce département.</p>
                            )}
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