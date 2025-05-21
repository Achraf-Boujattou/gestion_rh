import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function DepartmentsTable({ departments: initialDepartments }) {
    const [departments, setDepartments] = useState(initialDepartments);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ id: null, name: '', description: '', leader_id: '' });
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setDepartments(initialDepartments);
    }, [initialDepartments]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/departments/users');
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

    const handleEdit = (dept) => {
        setForm({
            id: dept.id,
            name: dept.name,
            description: dept.description || '',
            leader_id: dept.leader ? dept.leader.id : ''
        });
        setIsEdit(true);
        setShowForm(true);
        fetchUsers();
    };

    const handleDelete = async (dept) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) return;
        
        setLoading(true);
        try {
            const response = await fetch(`/departments/${dept.id}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });
            
            if (!response.ok) throw new Error('Erreur lors de la suppression');
            
            await refreshDepartments();
            toast.success('Département supprimé avec succès');
        } catch (error) {
            toast.error('Erreur lors de la suppression du département');
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
            const method = isEdit ? 'PUT' : 'POST';
            const url = isEdit ? `/departments/${form.id}` : '/departments';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    leader_id: form.leader_id || null
                })
            });

            if (!response.ok) throw new Error('Erreur lors de l\'opération');

            const data = await response.json();
            setShowForm(false);
            await refreshDepartments();
            toast.success(isEdit ? 'Département modifié avec succès' : 'Département créé avec succès');
        } catch (error) {
            toast.error('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const refreshDepartments = async () => {
        try {
            const res = await fetch('/departments?inertia=false');
            const data = await res.json();
            setDepartments(data.departments);
        } catch (error) {
            toast.error('Erreur lors du rafraîchissement des départements');
        }
    };

    return (
        <div>
            <h1>Liste des Départements</h1>
            <button onClick={handleAdd} style={{marginBottom: 16, padding: '8px 18px', borderRadius: 8, background: '#1563ff', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '1em', cursor: 'pointer'}}>Ajouter un département</button>
            {showForm && (
                <form onSubmit={handleSubmit} style={{marginBottom: 24, background: '#f8faff', padding: 18, borderRadius: 12, boxShadow: '0 2px 8px #1563ff11', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto'}}>
                    <div style={{marginBottom: 12}}>
                        <input name="name" value={form.name} onChange={handleChange} required placeholder="Nom" style={{width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc'}} />
                    </div>
                    <div style={{marginBottom: 12}}>
                        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" style={{width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc'}} />
                    </div>
                    <div style={{marginBottom: 12}}>
                        <select name="leader_id" value={form.leader_id || ''} onChange={handleChange} style={{width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc'}}>
                            <option value="">Aucun leader</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" disabled={loading} style={{background: '#1563ff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: '1em', cursor: 'pointer', marginRight: 8}}>
                        {isEdit ? 'Modifier' : 'Ajouter'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} style={{background: '#eee', color: '#232946', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: '1em', cursor: 'pointer'}}>Annuler</button>
                </form>
            )}
            <table className="departments-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Leader</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((dept) => (
                        <tr key={dept.id}>
                            <td>{dept.name}</td>
                            <td>{dept.description || '-'}</td>
                            <td>{dept.leader ? dept.leader.name : 'Non assigné'}</td>
                            <td>
                                <button onClick={() => handleEdit(dept)} style={{marginRight: 8, background: '#ffc107', color: '#232946', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer'}}>Modifier</button>
                                <button onClick={() => handleDelete(dept)} style={{background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer'}}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 