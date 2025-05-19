import { useForm, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />
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
                        max-width: 400px;
                        width: 100%;
                        text-align: center;
                    }
                    .auth-title {
                        color: #1563ff;
                        font-size: 2em;
                        font-weight: bold;
                        margin-bottom: 10px;
                        letter-spacing: 1px;
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
                    <div className="auth-title">ONSSTA</div>
                    <div className="auth-subtitle">Réinitialiser le mot de passe</div>
                    <div className="auth-desc">Choisissez un nouveau mot de passe pour votre compte.</div>
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
                    {errors.email && <div style={{ color: 'red', marginBottom: 8 }}>{errors.email}</div>}
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
                        <button type="button" className="show-password" onClick={() => setShowPassword(v => !v)}>{showPassword ? 'Hide' : 'Show'}</button>
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
                        <button type="button" className="show-password" onClick={() => setShowPasswordConfirm(v => !v)}>{showPasswordConfirm ? 'Hide' : 'Show'}</button>
                </div>
                    {errors.password_confirmation && <div style={{ color: 'red', marginBottom: 8 }}>{errors.password_confirmation}</div>}
                    <button className="auth-btn" disabled={processing}>Réinitialiser</button>
                    <div className="auth-footer">
                        <Link href={route('login')} className="auth-link">Retour à la connexion</Link>
                </div>
            </form>
            </div>
        </GuestLayout>
    );
}
