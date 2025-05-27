import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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

    useEffect(() => {
        setDepartments(initialDepartments);
    }, [initialDepartments]);

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
        try {
            const response = await fetch(`/departments/${dept.id}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (!response.ok) {
                let errorMsg = 'Erreur lors de la suppression';
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    if (errorData.errors) {
                        errorMsg = Object.values(errorData.errors).flat()[0];
                    } else if (errorData.message) {
                        errorMsg = errorData.message;
                    }
                }
                throw new Error(errorMsg);
            }

            await refreshDepartments();
            toast.success('Département supprimé avec succès');
        } catch (error) {
            console.error('Erreur de suppression:', error);
            toast.error(error.message || 'Erreur lors de la suppression du département');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let method, url;
            if (isEdit) {
                if (!form.id) {
                    toast.error("Aucun département sélectionné pour la modification.");
                    setLoading(false);
                    return;
                }
                method = 'PUT';
                url = `/departments/${form.id}`;
            } else {
                method = 'POST';
                url = '/departments';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    leader_id: form.leader_id || null
                })
            });

            if (!response.ok) {
                let errorMsg = 'Erreur lors de l\'opération';
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    if (errorData.errors) {
                        errorMsg = Object.values(errorData.errors).flat()[0];
                    } else if (errorData.message) {
                        errorMsg = errorData.message;
                    }
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            setShowForm(false);
            await refreshDepartments();
            toast.success(isEdit ? 'Département modifié avec succès' : 'Département créé avec succès');
        } catch (error) {
            toast.error(error.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const refreshDepartments = async () => {
        try {
            const res = await fetch(`/departments?sort_field=${sortField}&sort_direction=${sortDirection}&page=${currentPage}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (!res.ok) {
                throw new Error('Erreur lors du rafraîchissement des départements');
            }
            
            const data = await res.json();
            if (data.departments) {
                setDepartments(data.departments);
            }
        } catch (error) {
            console.error('Erreur de rafraîchissement:', error);
            toast.error('Erreur lors du rafraîchissement des départements');
        }
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
            // Si la recherche est vide, on réinitialise avec les données initiales
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
            // En cas d'erreur, on garde les données actuelles
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
                            <td style={{ padding: '1rem', color: '#374151' }}>{dept.leader ? dept.leader.name : 'Non assigné'}</td>
                            <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleEdit(dept)}
                                        className="modern-button modern-button-success"
                                        style={{ 
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.875rem',
                                            backgroundColor: '#059669',
                                            color: 'white',
                                            borderRadius: '0.375rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            flex: 1
                                        }}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dept)}
                                        className="modern-button modern-button-danger"
                                        style={{ 
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.875rem',
                                            backgroundColor: '#dc2626',
                                            color: 'white',
                                            borderRadius: '0.375rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            flex: 1
                                        }}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {renderPagination()}

            {showEmployees && selectedDepartmentEmployees.length > 0 && (
                <div className="fade-in" style={{ marginTop: '2rem' }}>
                    <h2 className="modern-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Employés du département
                    </h2>
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Salaire de base</th>
                                <th>Rôle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedDepartmentEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.Salaire_base} €</td>
                                    <td>{employee.roles && employee.roles.length > 0 ? employee.roles[0].name : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 