import { useForm, Link } from '@inertiajs/react';
import React from 'react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
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
            `}</style>
            <form className="auth-card" onSubmit={submit}>
                <div className="auth-title">ONSSTA</div>
                <div className="auth-subtitle">Mot de passe oublié ?</div>
                <div className="auth-desc">Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.</div>
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
                />
                {errors.email && <div style={{ color: 'red', marginBottom: 8 }}>{errors.email}</div>}
                <button className="auth-btn" disabled={processing}>Envoyer le lien</button>
                <div className="auth-footer">
                    <Link href={route('login')} className="auth-link">Retour à la connexion</Link>
                </div>
            </form>
        </div>
    );
}
