import React, { useState } from 'react';
import Modal from './Modal';
import InputLabel from './InputLabel';
import TextInput from './TextInput';
import InputError from './InputError';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { router } from '@inertiajs/react';

export default function AbsenceRequestForm({ show, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        start_time: '',
        end_time: '',
        reason: '',
        description: ''
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Use Inertia's router for form submission
        router.post('/absences', formData, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Demande enregistrée avec succès !');
                setFormData({
                    start_time: '',
                    end_time: '',
                    reason: '',
                    description: ''
                });
                onClose();
            },
            onError: (errors) => {
                setErrors(errors);
                alert('Erreur : ' + Object.values(errors).join('\n'));
            },
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear the error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Demande d'absence
                </h2>

                <div className="mb-4">
                    <InputLabel htmlFor="start_time" value="Heure de début" />
                    <TextInput
                        id="start_time"
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.start_time} className="mt-2" />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="end_time" value="Heure de fin" />
                    <TextInput
                        id="end_time"
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.end_time} className="mt-2" />
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