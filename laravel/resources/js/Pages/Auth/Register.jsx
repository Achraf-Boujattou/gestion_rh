import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="auth-bg">
            <Head title="Register" />
            <style>{`
                .auth-bg {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #eaf0fa 60%, #fff 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
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
                    margin: 0 auto;
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
                .input-group {
                    position: relative;
                }
            `}</style>
            <form className="auth-card" onSubmit={submit}>
                <div className="logo-container">
                    <div className="auth-title">
                        ONESSTA
                        <div className="logo-shine"></div>
                    </div>
                </div>
                <div className="auth-subtitle">Créer un compte</div>
                <div className="auth-desc">Inscrivez-vous pour accéder à Onessta.</div>
                <label className="auth-label" htmlFor="name">Nom</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="auth-input"
                    autoComplete="name"
                    onChange={e => setData('name', e.target.value)}
                    required
                />
                {errors.name && <div style={{ color: 'red', marginBottom: 8, textAlign: 'left' }}>{errors.name}</div>}
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
                />
                {errors.email && <div style={{ color: 'red', marginBottom: 8, textAlign: 'left' }}>{errors.email}</div>}
                <label className="auth-label" htmlFor="password">Mot de passe</label>
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
                {errors.password && <div style={{ color: 'red', marginBottom: 8, textAlign: 'left' }}>{errors.password}</div>}
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
                {errors.password_confirmation && <div style={{ color: 'red', marginBottom: 8, textAlign: 'left' }}>{errors.password_confirmation}</div>}
                <button className="auth-btn" disabled={processing}>
                    S'inscrire
                </button>
                <div className="auth-footer">
                    Déjà inscrit ?{' '}
                    <Link href={route('login')} className="auth-link">Se connecter</Link>
                </div>
            </form>
        </div>
    );
}
