import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.verify'));
    };

    return (
        <GuestLayout>
            <Head title="Mot de passe oublié" />
            
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-blue-600 mb-2">ONESSTA</h1>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Mot de passe oublié
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
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
                            {processing ? 'Envoi en cours...' : 'Envoyer le lien'}
                        </button>

                        <div className="text-center mt-4">
                            <a
                                href={route('login')}
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Retour à la connexion
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
