import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import InputLabel from './InputLabel';
import TextInput from './TextInput';
import InputError from './InputError';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import DangerButton from './DangerButton';

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
            setAbsences([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbsences();
    }, []);

    const handleApprove = async (absenceId) => {
        try {
            const response = await fetch(`/absences/${absenceId}/approve`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                credentials: 'same-origin'
            });
            if (response.ok) {
                fetchAbsences();
            }
        } catch (error) {}
    };

    const handleReject = async (absenceId) => {
        if (!rejectionReason) {
            alert('Veuillez fournir une raison pour le refus');
            return;
        }
        try {
            const response = await fetch(`/absences/${absenceId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                credentials: 'same-origin',
                body: JSON.stringify({ rejection_reason: rejectionReason })
            });
            if (response.ok) {
                setShowDetailsModal(false);
                setRejectionReason('');
                fetchAbsences();
            }
        } catch (error) {}
    };

    const handleViewDetails = (absence) => {
        setSelectedAbsence(absence);
        setShowDetailsModal(true);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Gestion des absences</h2>
            {loading ? (
                <div>Chargement...</div>
            ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left">Employé</th>
                            <th className="px-6 py-3 text-left">Date de début</th>
                            <th className="px-6 py-3 text-left">Date de fin</th>
                            <th className="px-6 py-3 text-left">Motif</th>
                            <th className="px-6 py-3 text-left">Statut</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {absences.map((absence) => (
                            <tr key={absence.id} className="border-b">
                                <td className="px-6 py-4">{absence.user?.name || ''}</td>
                                <td className="px-6 py-4">{absence.start_date}</td>
                                <td className="px-6 py-4">{absence.end_date}</td>
                                <td className="px-6 py-4">{absence.reason}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded ${
                                        absence.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        absence.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {absence.status === 'approved' ? 'Approuvé' :
                                         absence.status === 'rejected' ? 'Refusé' :
                                         'En attente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <PrimaryButton
                                            onClick={() => handleViewDetails(absence)}
                                            className="text-sm"
                                        >
                                            Détails
                                        </PrimaryButton>
                                        {absence.status === 'pending' && (
                                            <>
                                                <PrimaryButton
                                                    onClick={() => handleApprove(absence.id)}
                                                    className="text-sm bg-green-600 hover:bg-green-700"
                                                >
                                                    Accepter
                                                </PrimaryButton>
                                                <DangerButton
                                                    onClick={() => handleViewDetails(absence)}
                                                    className="text-sm"
                                                >
                                                    Refuser
                                                </DangerButton>
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

            {/* Modal pour les détails et le refus */}
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
                                <p>Du {selectedAbsence.start_date} au {selectedAbsence.end_date}</p>
                            </div>
                            <div>
                                <p className="font-medium">Motif:</p>
                                <p>{selectedAbsence.reason}</p>
                            </div>
                            <div>
                                <p className="font-medium">Description:</p>
                                <p>{selectedAbsence.description}</p>
                            </div>
                            
                            {selectedAbsence.status === 'pending' && (
                                <div className="mt-4">
                                    <InputLabel htmlFor="rejection_reason" value="Raison du refus" />
                                    <TextInput
                                        id="rejection_reason"
                                        type="text"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <SecondaryButton onClick={() => setShowDetailsModal(false)}>
                                            Annuler
                                        </SecondaryButton>
                                        <DangerButton onClick={() => handleReject(selectedAbsence.id)}>
                                            Confirmer le refus
                                        </DangerButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
} 