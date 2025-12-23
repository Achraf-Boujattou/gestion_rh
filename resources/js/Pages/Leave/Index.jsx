import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, Card, Badge } from '@/Components/ui/index';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';

export default function Index({ auth, leaves = [] }) {
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { data, setData, post, processing } = useForm({
        status: '',
        response_comment: ''
    });

    const handleStatusUpdate = (leave, status) => {
        setSelectedLeave(leave);
        setData({
            status: status,
            response_comment: ''
        });
    };

    const submitStatusUpdate = (leaveId) => {
        post(route('leaves.update-status', leaveId), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedLeave(null);
                setData({
                    status: '',
                    response_comment: ''
                });
            }
        });
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return (
            <Badge className={colors[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const filteredLeaves = leaves.filter(leave => 
        leave.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.user?.department?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!auth?.user) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="leave-management-container">
            <style>{`
                .leave-management-container {
                    padding: 2rem;
                    width: 100%;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .title {
                    font-size: 2rem;
                    font-weight: 600;
                    color: #1e3a8a;
                }
                .header-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .search-input {
                    width: 300px;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    color: #374151;
                    background: #fff;
                }
                .search-input:focus {
                    outline: none;
                    border-color: #4f46e5;
                    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
                }
                .add-button {
                    background: #4f46e5;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .add-button:hover {
                    background: #4338ca;
                }
                .leaves-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin-top: 1rem;
                    background: white;
                    border-radius: 0.5rem;
                    overflow: hidden;
                }
                .leaves-table th {
                    background: #4f46e5;
                    color: white;
                    padding: 1rem;
                    text-align: left;
                    font-weight: 500;
                    text-transform: uppercase;
                    font-size: 0.875rem;
                }
                .leaves-table td {
                    padding: 1rem;
                    border-bottom: 1px solid #f3f4f6;
                    color: #374151;
                }
                .leaves-table tr:hover td {
                    background: #f9fafb;
                }
                .leaves-table tr:last-child td {
                    border-bottom: none;
                }
                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                }
                .action-button {
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .modify-button {
                    background: #059669;
                    color: white;
                }
                .modify-button:hover {
                    background: #047857;
                }
                .delete-button {
                    background: #dc2626;
                    color: white;
                }
                .delete-button:hover {
                    background: #b91c1c;
                }
                .modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 2rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    width: 90%;
                    max-width: 500px;
                    z-index: 1000;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                .action-icon {
                    background: none;
                    border: none;
                    color: #2563eb;
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                    transition: background 0.2s;
                }
                .action-icon.accept { color: #059669; }
                .action-icon.reject { color: #dc2626; }
                .action-icon:hover { background: #f3f4f6; }
            `}</style>

            <div className="header">
                <h1 className="title">Gestion des Congés</h1>
                <div className="header-actions">
                    <input
                        type="text"
                        placeholder="Rechercher un employé..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <table className="leaves-table">
                <thead>
                    <tr>
                        <th>NOM ↑</th>
                        <th>TYPE</th>
                        <th>PÉRIODE</th>
                        <th>STATUT</th>
                        <th>DÉPARTEMENT</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLeaves.map((leave) => (
                        <tr key={leave.id}>
                            <td>{leave.user?.name}</td>
                            <td>{leave.type}</td>
                            <td>
                                {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                            </td>
                            <td>{getStatusBadge(leave.status)}</td>
                            <td>{leave.user?.department?.name}</td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        className="action-icon"
                                        title="Détails"
                                        onClick={() => setSelectedLeave({ ...leave, showDetails: true })}
                                    >
                                        <FaEye />
                                    </button>
                                    {leave.status === 'pending' && (
                                        <>
                                            <button
                                                className="action-icon accept"
                                                title="Approuver"
                                                onClick={() => handleStatusUpdate(leave, 'approved')}
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                className="action-icon reject"
                                                title="Rejeter"
                                                onClick={() => handleStatusUpdate(leave, 'rejected')}
                                            >
                                                <FaTimes />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {filteredLeaves.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    Aucune demande de congé à afficher
                </div>
            )}

            {selectedLeave && selectedLeave.showDetails && (
                <>
                    <div className="modal-overlay" onClick={() => setSelectedLeave(null)} />
                    <div className="modal">
                        <h3 className="text-lg font-semibold mb-4">Détails du congé</h3>
                        <div className="mb-2"><strong>Nom :</strong> {selectedLeave.user?.name}</div>
                        <div className="mb-2"><strong>Type :</strong> {selectedLeave.type}</div>
                        <div className="mb-2"><strong>Période :</strong> {new Date(selectedLeave.start_date).toLocaleDateString()} - {new Date(selectedLeave.end_date).toLocaleDateString()}</div>
                        <div className="mb-2"><strong>Statut :</strong> {getStatusBadge(selectedLeave.status)}</div>
                        <div className="mb-2"><strong>Département :</strong> {selectedLeave.user?.department?.name}</div>
                        <div className="mb-2"><strong>Motif :</strong> {selectedLeave.reason}</div>
                        {selectedLeave.status === 'pending' && (
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="action-button modify-button"
                                    onClick={() => {
                                        setSelectedLeave({ ...selectedLeave, showDetails: false });
                                        handleStatusUpdate(selectedLeave, 'approved');
                                    }}
                                >
                                    Approuver
                                </button>
                                <button
                                    className="action-button delete-button"
                                    onClick={() => {
                                        setSelectedLeave({ ...selectedLeave, showDetails: false });
                                        handleStatusUpdate(selectedLeave, 'rejected');
                                    }}
                                >
                                    Rejeter
                                </button>
                            </div>
                        )}
                        <div className="flex justify-end mt-4">
                            <button
                                className="action-button bg-gray-200 text-gray-700 hover:bg-gray-300"
                                onClick={() => setSelectedLeave(null)}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 