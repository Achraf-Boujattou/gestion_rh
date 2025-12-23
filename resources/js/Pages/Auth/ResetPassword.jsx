import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (password.match(/[A-Z]/)) strength += 1;
        if (password.match(/[a-z]/)) strength += 1;
        if (password.match(/[0-9]/)) strength += 1;
        if (password.match(/[^A-Za-z0-9]/)) strength += 1;
        return strength;
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = () => {
        if (passwordStrength <= 2) return 'Faible';
        if (passwordStrength <= 3) return 'Moyen';
        return 'Fort';
    };

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setData('password', newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <GuestLayout>
            <Head title="Réinitialiser le mot de passe" />

            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-blue-600 mb-2">ONESSTA</h1>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Réinitialiser le mot de passe
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Pour votre sécurité, veuillez créer un mot de passe fort qui :
                            <ul className="list-disc text-left mt-2 ml-4">
                                <li>Contient au moins 8 caractères</li>
                                <li>Inclut des lettres majuscules et minuscules</li>
                                <li>Contient des chiffres</li>
                                <li>Inclut des caractères spéciaux</li>
                            </ul>
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                onChange={(e) => setData('email', e.target.value)}
                        required
                                disabled
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
                        <input
                        id="password"
                                    type={showPassword ? "text" : "password"}
                        value={data.password}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    onChange={handlePasswordChange}
                                    required
                        autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? 'Masquer' : 'Afficher'}
                                </button>
                            </div>
                            {data.password && (
                                <div className="mt-2">
                                    <div className="flex items-center">
                                        <div className="flex-1 h-2 bg-gray-200 rounded">
                                            <div
                                                className={`h-full rounded ${getStrengthColor()}`}
                                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600">
                                            {getStrengthText()}
                                        </span>
                                    </div>
                                </div>
                            )}
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
                            <div className="relative">
                        <input
                        id="password_confirmation"
                                    type={showPassword ? "text" : "password"}
                        value={data.password_confirmation}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                        autoComplete="new-password"
                                />
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.password_confirmation}
                                </p>
                            )}
                </div>

                        <button
                            type="submit"
                            disabled={processing || passwordStrength < 3}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
