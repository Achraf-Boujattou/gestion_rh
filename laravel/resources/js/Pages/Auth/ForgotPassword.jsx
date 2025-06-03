<<<<<<< HEAD
import { useForm, Link } from '@inertiajs/react';
import React, { useState } from 'react';
=======
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
>>>>>>> ad028a9bdf55b89b5bbc742d4232ba4343b39752

export default function ForgotPassword({ flash }) {
    const [emailExists, setEmailExists] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
<<<<<<< HEAD
        password_confirmation: '',
=======
        password_confirmation: ''
>>>>>>> ad028a9bdf55b89b5bbc742d4232ba4343b39752
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setEmailExists(true);
            setShowResetForm(true);
        }
    }, [flash]);

    const verifyEmail = (e) => {
        e.preventDefault();
<<<<<<< HEAD
        if (!showPasswordFields) {
            // First step: validate email
            setShowPasswordFields(true);
        } else {
            // Second step: reset password using POST to the correct endpoint
            post(route('password.request.update'));
        }
    };

    return (
        <div className="auth-bg">
            <style>{`
                .auth-bg {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #eaf0fa 60%, #fff 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .auth-card {
                    background: #fff;
                    border-radius: 18px;
                    box-shadow: 0 4px 32px rgba(80,80,180,0.10);
                    padding: 38px 32px 32px 32px;
                    min-width: 340px;
                    max-width: 380px;
                    width: 100%;
                    text-align: center;
                }
                .logo-container {
                    margin-bottom: 24px;
                    perspective: 1000px;
                }
                .auth-title {
                    color: #1563ff;
                    font-size: 2.2em;
                    font-weight: bold;
                    letter-spacing: 2px;
                    position: relative;
                    display: inline-block;
                    animation: logoEntrance 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    text-shadow: 2px 2px 8px rgba(21, 99, 255, 0.2);
                }
                .auth-title::after {
                    content: '';
                    position: absolute;
                    bottom: -6px;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: linear-gradient(90deg, #1563ff, #54a0ff);
                    transform: scaleX(0);
                    transform-origin: left;
                    animation: underlineSlide 0.8s ease-out 0.8s forwards;
                    border-radius: 2px;
                }
                @keyframes logoEntrance {
                    0% {
                        opacity: 0;
                        transform: translateY(-40px) rotateX(30deg);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) rotateX(0);
                    }
                }
                @keyframes underlineSlide {
                    0% {
                        transform: scaleX(0);
                    }
                    100% {
                        transform: scaleX(1);
                    }
                }
                .logo-shine {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.6),
                        transparent
                    );
                    animation: shine 3s infinite;
                }
                @keyframes shine {
                    0% {
                        left: -100%;
                    }
                    20% {
                        left: 100%;
                    }
                    100% {
                        left: 100%;
                    }
                }
                .auth-subtitle {
                    font-size: 1.25em;
                    font-weight: 600;
                    margin-bottom: 6px;
                }
                .auth-desc {
                    color: #555;
                    font-size: 1em;
                    margin-bottom: 22px;
                }
                .auth-label {
                    display: block;
                    text-align: left;
                    margin-bottom: 6px;
                    font-weight: 500;
                }
                .auth-input {
                    width: 100%;
                    padding: 12px 14px;
                    border-radius: 10px;
                    border: 1px solid #e0e7ff;
                    background: #f4f7ff;
                    margin-bottom: 16px;
                    font-size: 1em;
                    transition: border 0.2s;
                }
                .auth-input:focus {
                    border: 1.5px solid #1563ff;
                    outline: none;
                }
                .auth-btn {
                    width: 100%;
                    background: #1563ff;
                    color: #fff;
                    border: none;
                    border-radius: 10px;
                    padding: 12px 0;
                    font-size: 1.1em;
                    font-weight: bold;
                    cursor: pointer;
                    margin-top: 8px;
                    margin-bottom: 10px;
                    box-shadow: 0 2px 8px #1563ff22;
                    transition: background 0.18s, box-shadow 0.18s;
                }
                .auth-btn:hover {
                    background: #0039a6;
                    box-shadow: 0 4px 16px #1563ff33;
                }
                .auth-footer {
                    margin-top: 18px;
                    color: #888;
                    font-size: 0.98em;
                }
                .auth-footer .auth-link {
                    font-weight: 600;
                }
                .auth-link {
                    color: #1563ff;
                    text-decoration: none;
                    font-size: 0.98em;
                }
                .auth-link:hover {
                    text-decoration: underline;
                }
                .input-group {
                    position: relative;
                }
                .show-password {
                    position: absolute;
                    right: 18px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #1563ff;
                    cursor: pointer;
                    font-size: 0.98em;
                }
            `}</style>
            <form className="auth-card" onSubmit={submit}>
                <div className="logo-container">
                    <div className="auth-title">
                        ONESSTA
                        <div className="logo-shine"></div>
=======
        post(route('password.verify'), {
            preserveScroll: true,
            onSuccess: () => {
                setEmailExists(true);
                setShowResetForm(true);
            },
            onError: () => {
                setEmailExists(false);
                setShowResetForm(false);
            }
        });
    };

    const resetPassword = (e) => {
        e.preventDefault();
        post(route('password.update.new'), {
            onSuccess: () => {
                reset();
                window.location.href = route('login') + '?reset=success';
            },
            onError: (errors) => {
                console.error('Erreurs:', errors);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">ONESSTA</h1>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Mot de passe oublié ?
                    </h2>
                    <p className="text-gray-600 mb-8">
                        {!showResetForm 
                            ? "Entrez votre adresse e-mail pour réinitialiser votre mot de passe."
                            : "Veuillez saisir votre nouveau mot de passe."
                        }
                    </p>
                </div>

                {flash?.success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {flash.success}
>>>>>>> ad028a9bdf55b89b5bbc742d4232ba4343b39752
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {flash.error}
                    </div>
                )}

                {!showResetForm ? (
                    <form onSubmit={verifyEmail} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {processing ? 'Vérification...' : 'Vérifier'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={resetPassword} className="space-y-6">
                        <input type="hidden" name="email" value={data.email} />
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nouveau mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {processing ? 'Réinitialisation...' : 'Changer le mot de passe'}
                        </button>
                    </form>
                )}

                <div className="text-center mt-4">
                    <a
                        href={route('login')}
                        className="text-sm text-blue-600 hover:text-blue-500"
                    >
                        Retour à la connexion
                    </a>
                </div>
<<<<<<< HEAD
                <div className="auth-subtitle">Réinitialiser le mot de passe</div>
                <div className="auth-desc">
                    {!showPasswordFields 
                        ? "Entrez votre adresse e-mail pour réinitialiser votre mot de passe."
                        : "Choisissez votre nouveau mot de passe."}
                </div>
                {status && <div style={{ color: '#1563ff', marginBottom: 12 }}>{status}</div>}
                
                <label className="auth-label" htmlFor="email">E-mail</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="auth-input"
                    autoComplete="username"
                    onChange={e => setData('email', e.target.value)}
                    required
                    disabled={showPasswordFields}
                />
                {errors.email && <div style={{ color: 'red', marginBottom: 8 }}>{errors.email}</div>}

                {showPasswordFields && (
                    <>
                        <label className="auth-label" htmlFor="password">Nouveau mot de passe</label>
                        <div className="input-group">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="auth-input"
                                autoComplete="new-password"
                                onChange={e => setData('password', e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="show-password" 
                                onClick={() => setShowPassword(v => !v)}
                            >
                                {showPassword ? 'Masquer' : 'Afficher'}
                            </button>
                        </div>
                        {errors.password && <div style={{ color: 'red', marginBottom: 8 }}>{errors.password}</div>}

                        <label className="auth-label" htmlFor="password_confirmation">Confirmer le mot de passe</label>
                        <div className="input-group">
                            <input
                                id="password_confirmation"
                                type={showPasswordConfirm ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="auth-input"
                                autoComplete="new-password"
                                onChange={e => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="show-password" 
                                onClick={() => setShowPasswordConfirm(v => !v)}
                            >
                                {showPasswordConfirm ? 'Masquer' : 'Afficher'}
                            </button>
                        </div>
                        {errors.password_confirmation && <div style={{ color: 'red', marginBottom: 8 }}>{errors.password_confirmation}</div>}
                    </>
                )}

                <button className="auth-btn" disabled={processing}>
                    {!showPasswordFields ? 'Réinitialiser' : 'Confirmer'}
                </button>
                <div className="auth-footer">
                    <Link href={route('login')} className="auth-link">Retour à la connexion</Link>
                </div>
            </form>
=======
            </div>
>>>>>>> ad028a9bdf55b89b5bbc742d4232ba4343b39752
        </div>
    );
}
