import { router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Index({ employees }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredEmployees = employees
        .filter(employee => 
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.department.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const direction = sortDirection === 'asc' ? 1 : -1;
            return a[sortField] > b[sortField] ? direction : -direction;
        });

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

    return (
        <div className="employees-container">
            <style>{`
                .employees-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .search-box {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    width: 300px;
                    font-size: 14px;
                }
                .employees-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
                .action-btn {
                    padding: 6px 12px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    margin-right: 8px;
                    font-size: 14px;
                }
                .info-btn {
                    background: #6c757d;
                    color: white;
                }
                .edit-btn {
                    background: #007bff;
                    color: white;
                }
                .delete-btn {
                    background: #dc3545;
                    color: white;
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
            `}</style>

            <div className="header">
                <h1>Liste des Employés</h1>
                <input
                    type="text"
                    className="search-box"
                    placeholder="Rechercher un employé..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table className="employees-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>Nom</th>
                        <th onClick={() => handleSort('email')}>Email</th>
                        <th onClick={() => handleSort('role')}>Rôle</th>
                        <th onClick={() => handleSort('department')}>Département</th>
                        <th onClick={() => handleSort('salary')}>Salaire</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>
                                <span className={`role-badge role-${employee.role}`}>
                                    {employee.role}
                                </span>
                            </td>
                            <td>{employee.department}</td>
                            <td>{employee.salary} €</td>
                            <td>
                                <button className="action-btn info-btn" onClick={() => handleShowInfo(employee)}>Afficher détails</button>
                                <button className="action-btn edit-btn" onClick={() => handleEdit(employee)}>Modifier</button>
                                <button className="action-btn delete-btn" onClick={() => handleDelete(employee)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 