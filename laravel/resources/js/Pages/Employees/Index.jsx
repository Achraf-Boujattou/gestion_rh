import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function Index() {
    const { employees, departments = [], roles = [], filters } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sortField, setSortField] = useState(filters.sort_field || 'name');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        Salaire_base: '',
        department_id: '',
        role: '',
    });

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
                    role: '',
                });
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
                    role: '',
                });
            }
        });
    };

    // Suppression d'un employé
    const handleDelete = (employee) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
            router.delete(`/employees/${employee.id}`);
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                        width: 300
                    }}
                />
                <button
                    onClick={() => {
                        console.log('Clic sur Ajouter un employé');
                        setShowAddModal(true);
                    }}
                    style={{
                        padding: '8px 16px',
                        background: '#1563ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer'
                    }}
                >
                    Ajouter un employé
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr>
                        <th 
                            onClick={() => handleSort('name')}
                            style={{ padding: 12, cursor: 'pointer' }}
                        >
                            Nom {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                            onClick={() => handleSort('email')}
                            style={{ padding: 12, cursor: 'pointer' }}
                        >
                            Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                            onClick={() => handleSort('Salaire_base')}
                            style={{ padding: 12, cursor: 'pointer' }}
                        >
                            Salaire {sortField === 'Salaire_base' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ padding: 12 }}>Département</th>
                        <th style={{ padding: 12 }}>Rôle</th>
                        <th style={{ padding: 12 }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id} style={{ borderTop: '1px solid #eee' }}>
                            <td style={{ padding: 12 }}>{emp.name}</td>
                            <td style={{ padding: 12 }}>{emp.email}</td>
                            <td style={{ padding: 12 }}>{emp.Salaire_base} €</td>
                            <td style={{ padding: 12 }}>{departments.find(dep => dep.id === emp.department_id)?.name || ''}</td>
                            <td style={{ padding: 12 }}>{emp.roles && emp.roles.length > 0 ? emp.roles[0].name : ''}</td>
                            <td style={{ padding: 12 }}>
                                <button
                                    onClick={() => {
                                        setEditingEmployee(emp);
                                        setFormData({
                                            name: emp.name,
                                            email: emp.email,
                                            Salaire_base: emp.Salaire_base,
                                            department_id: emp.department_id,
                                            role: emp.role,
                                        });
                                    }}
                                    style={{
                                        marginRight: 8,
                                        padding: '4px 8px',
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 4,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(emp)}
                                    style={{
                                        padding: '4px 8px',
                                        background: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 4,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal d'ajout */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: 'white',
                        padding: 24,
                        borderRadius: 8,
                        width: 400
                    }}>
                        <h3>Ajouter un employé</h3>
                        <form onSubmit={handleAdd}>
                            <div style={{ marginBottom: 16 }}>
                                <label>Nom</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Salaire</label>
                                <input
                                    type="number"
                                    value={formData.Salaire_base}
                                    onChange={e => setFormData({...formData, Salaire_base: e.target.value})}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Département</label>
                                <select
                                    value={formData.department_id}
                                    onChange={e => setFormData({...formData, department_id: e.target.value})}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                    required
                                >
                                    <option value="">Sélectionner un département</option>
                                    {departments.map(dep => (
                                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Rôle</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({...formData, role: e.target.value})}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                    required
                                >
                                    <option value="">Sélectionner un rôle</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.name}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 4,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '8px 16px',
                                        background: '#1563ff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 4,
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
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        padding: 24,
                        borderRadius: 8,
                        width: 400
                    }}>
                        <h3>Modifier l'employé</h3>
                        <form onSubmit={handleUpdate}>
                            <div style={{ marginBottom: 16 }}>
                                <label>Nom</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Salaire</label>
                                <input
                                    type="number"
                                    value={formData.Salaire_base}
                                    onChange={e => setFormData({...formData, Salaire_base: e.target.value})}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                <button
                                    type="button"
                                    onClick={() => setEditingEmployee(null)}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 4,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '8px 16px',
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 4,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Test minimal modal */}
            <button onClick={() => setShowAddModal(true)}>Test Modal</button>
            {showAddModal && <div style={{background: 'red', color: 'white', padding: 20}}>MODAL TEST</div>}
        </div>
    );
}