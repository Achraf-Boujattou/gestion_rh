import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import InputLabel from './InputLabel';
import TextInput from './TextInput';
import InputError from './InputError';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import DangerButton from './DangerButton';
import { router } from '@inertiajs/react';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';

export default function AbsenceManagement() {
    const [absences, setAbsences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAbsence, setSelectedAbsence] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    // Récupérer les absences depuis l'API Laravel
    const fetchAbsences = async () => {
        setLoading(true);
        try {
            const response = await fetch('/absences', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin'
            });
            if (response.ok) {
                const data = await response.json();
                setAbsences(data);
            } else {
                setAbsences([]);
            }
        } catch (error) {
            console.error('Error fetching absences:', error);
            setAbsences([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbsences();
    }, []);

    const handleApprove = async (absenceId) => {
        router.post(`/absences/${absenceId}/approve`, {}, {
            onSuccess: () => {
                fetchAbsences();
            },
            onError: (errors) => {
                alert('Erreur lors de l\'approbation: ' + Object.values(errors).join('\n'));
            },
        });
    };

    const handleReject = async (absenceId) => {
        if (!rejectionReason) {
            alert('Veuillez fournir une raison pour le refus');
            return;
        }

        router.post(`/absences/${absenceId}/reject`, {
            rejection_reason: rejectionReason
        }, {
            onSuccess: () => {
                setShowDetailsModal(false);
                setRejectionReason('');
                fetchAbsences();
            },
            onError: (errors) => {
                alert('Erreur lors du refus: ' + Object.values(errors).join('\n'));
            },
        });
    };

    const handleViewDetails = (absence) => {
        setSelectedAbsence(absence);
        setShowDetailsModal(true);
    };

    return (
        <div className="leave-management-container">
            <style>{`
                .leave-management-container {
                    padding: 2rem;
                    width: 100%;
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
            <h2 className="text-2xl font-semibold mb-6">Gestion des absences</h2>
            {loading ? (
                <div>Chargement...</div>
            ) : (
            <div className="overflow-x-auto">
                <table className="leaves-table">
                  <thead>
                    <tr>
                      <th>EMPLOYÉ</th>
                      <th>HEURE DE DÉBUT</th>
                      <th>HEURE DE FIN</th>
                      <th>MOTIF</th>
                      <th>DATE DE DEMANDE</th>
                      <th>STATUT</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absences.map((absence) => (
                        <tr key={absence.id}>
                            <td>{absence.user?.name || ''}</td>
                            <td>{absence.start_time}</td>
                            <td>{absence.end_time}</td>
                            <td>{absence.reason}</td>
                            <td>{new Date(absence.created_at).toLocaleDateString()}</td>
                            <td>
                                <span className={`status-badge ${
                                    absence.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    absence.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {absence.status === 'approved' ? 'Approuvé' :
                                     absence.status === 'rejected' ? 'Refusé' :
                                     'En attente'}
                                </span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        className="action-icon"
                                        title="Détails"
                                        onClick={() => handleViewDetails(absence)}
                                    >
                                        <FaEye />
                                    </button>
                                    {absence.status === 'pending' && (
                                        <>
                                            <button
                                                className="action-icon accept"
                                                title="Accepter"
                                                onClick={() => handleApprove(absence.id)}
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                className="action-icon reject"
                                                title="Refuser"
                                                onClick={() => handleReject(absence.id)}
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
            </div>
            )}
            {/* Modal pour les détails */}
            <Modal show={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Détails de l'absence</h3>
                    {selectedAbsence && (
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium">Employé:</p>
                                <p>{selectedAbsence.user?.name || ''}</p>
                            </div>
                            <div>
                                <p className="font-medium">Période:</p>
                                <p>Du {selectedAbsence.start_time} à {selectedAbsence.end_time}</p>
                            </div>
                            <div>
                                <p className="font-medium">Motif:</p>
                                <p>{selectedAbsence.reason}</p>
                            </div>
                            <div>
                                <p className="font-medium">Description:</p>
                                <p>{selectedAbsence.description}</p>
                            </div>
                            {selectedAbsence.status === 'rejected' && (
                                <div>
                                    <p className="font-medium">Raison du refus:</p>
                                    <p className="text-red-600">{selectedAbsence.rejection_reason}</p>
                                </div>
                            )}
                            <div className="mt-4 flex justify-end">
                                <SecondaryButton onClick={() => setShowDetailsModal(false)}>
                                    Fermer
                                </SecondaryButton>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}