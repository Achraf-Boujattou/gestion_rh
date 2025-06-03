import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function ForgotPassword({ flash }) {
    const [emailExists, setEmailExists] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        password_confirmation: ''
    });

    useEffect(() => {
        if (flash?.success) {
            setEmailExists(true);
            setShowResetForm(true);
        }
    }, [flash]);

    const verifyEmail = (e) => {
        e.preventDefault();
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
            </div>
        </div>
    );
}
