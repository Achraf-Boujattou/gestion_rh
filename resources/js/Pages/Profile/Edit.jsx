import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="profile-container">
                <style>{`
                    .profile-container {
                        padding: 2.5rem 0;
                        background: linear-gradient(135deg, #eaf0fa 60%, #fff 100%);
                        min-height: calc(100vh - 65px);
                    }

                    .profile-content {
                        max-width: 1100px;
                        margin: 0 auto;
                        display: grid;
                        gap: 2.5rem;
                        grid-template-columns: 1fr;
                        animation: fadeIn 0.5s ease-out;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .profile-card {
                        background: white;
                        border-radius: 22px;
                        padding: 2.5rem 2rem;
                        box-shadow: 0 6px 32px rgba(80,80,180,0.13);
                        transition: all 0.3s cubic-bezier(.4,2,.3,1);
                        border: 1px solid rgba(226, 232, 255, 0.8);
                        position: relative;
                    }

                    .profile-card:hover {
                        transform: translateY(-7px) scale(1.01);
                        box-shadow: 0 12px 48px rgba(80,80,180,0.18);
                    }

                    .profile-card h3 {
                        color: #1563ff;
                        font-size: 1.7rem;
                        font-weight: 700;
                        margin-bottom: 1.7rem;
                        display: flex;
                        align-items: center;
                        gap: 0.9rem;
                        letter-spacing: 0.5px;
                    }

                    .profile-card h3 svg {
                        width: 28px;
                        height: 28px;
                        stroke: currentColor;
                    }

                    .form-section {
                        margin-bottom: 1.5rem;
                        padding-bottom: 1.5rem;
                        border-bottom: 1px solid #e5e7eb;
                    }

                    .form-section:last-child {
                        margin-bottom: 0;
                        padding-bottom: 0;
                        border-bottom: none;
                    }

                    .delete-section {
                        background: #fff5f5;
                        border: 1px solid #feb2b2;
                    }

                    .delete-section h3 {
                        color: #e53e3e;
                    }

                    @media (max-width: 900px) {
                        .profile-content {
                            gap: 1.5rem;
                        }
                        .profile-card {
                            padding: 1.5rem 0.7rem;
                        }
                    }
                    @media (max-width: 600px) {
                        .profile-container {
                            padding: 0.5rem;
                        }
                        .profile-content {
                            gap: 1rem;
                        }
                        .profile-card {
                            padding: 1rem 0.3rem;
                        }
                        .profile-card h3 {
                            font-size: 1.1rem;
                        }
                    }
                `}</style>

                <div className="profile-content">
                    <div className="profile-card">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Informations du Profil
                        </h3>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="profile-card">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Modifier le Mot de Passe
                        </h3>
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="profile-card delete-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Supprimer le Compte
                        </h3>
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
