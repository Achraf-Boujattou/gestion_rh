import React, { useState } from 'react';
import Modal from './Modal';
import InputLabel from './InputLabel';
import TextInput from './TextInput';
import InputError from './InputError';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export default function AbsenceRequestForm({ show, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        start_date: '',
        end_date: '',
        reason: '',
        description: ''
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            console.log('Status:', response.status);
            if (response.ok) {
                alert('Demande enregistrée avec succès !');
                onClose();
            } else {
                const data = await response.json();
                alert('Erreur : ' + (data.message || 'Vérifiez les champs'));
            }
        } catch (error) {
            alert('Erreur réseau');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Demande d'absence
                </h2>

                <div className="mb-4">
                    <InputLabel htmlFor="start_date" value="Date de début" />
                    <TextInput
                        id="start_date"
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.start_date} className="mt-2" />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="end_date" value="Date de fin" />
                    <TextInput
                        id="end_date"
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.end_date} className="mt-2" />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="reason" value="Motif de l'absence" />
                    <TextInput
                        id="reason"
                        type="text"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.reason} className="mt-2" />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="description" value="Description détaillée" />
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        rows="4"
                        required
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose} className="mr-3">
                        Annuler
                    </SecondaryButton>
                    <PrimaryButton type="submit">
                        Soumettre la demande
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
} 