import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import AbsenceRequestForm from './AbsenceRequestForm';

export default function EmployeeAbsenceList() {
    const [absences, setAbsences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [selectedAbsence, setSelectedAbsence] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Récupérer les absences de l'utilisateur depuis l'API Laravel
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

    const handleSubmitRequest = async (formData) => {
        try {
            const response = await fetch('/absences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setShowRequestForm(false);
                fetchAbsences();
            } else {
                const data = await response.json();
                alert('Erreur : ' + (data.message || 'Vérifiez les champs'));
            }
        } catch (error) {
            alert('Erreur réseau');
        }
    };

    const handleViewDetails = (absence) => {
        setSelectedAbsence(absence);
        setShowDetailsModal(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Mes demandes d'absence</h2>
                <PrimaryButton onClick={() => setShowRequestForm(true)}>
                    Nouvelle demande
                </PrimaryButton>
            </div>

            {loading ? (
                <div>Chargement...</div>
            ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
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
                                    <PrimaryButton
                                        onClick={() => handleViewDetails(absence)}
                                        className="text-sm"
                                    >
                                        Détails
                                    </PrimaryButton>
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
                    <h3 className="text-lg font-medium mb-4">Détails de la demande</h3>
                    {selectedAbsence && (
                        <div className="space-y-4">
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

            {/* Modal pour le formulaire de demande */}
            <AbsenceRequestForm
                show={showRequestForm}
                onClose={() => setShowRequestForm(false)}
                onSubmit={handleSubmitRequest}
            />
        </div>
    );
} 