import { useState } from 'react';

// Composants simulés pour la démo
const InputError = ({ message, className }) => (
  message ? <p className={`text-red-500 text-sm ${className}`}>{message}</p> : null
);

const InputLabel = ({ htmlFor, value, className }) => (
  <label htmlFor={htmlFor} className={className}>{value}</label>
);

const TextInput = ({ className, ...props }) => (
  <input className={className} {...props} />
);

const PrimaryButton = ({ children, disabled, className, ...props }) => (
  <button 
    disabled={disabled} 
    className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
    {...props}
  >
    {children}
  </button>
);

export default function UpdateProfileInformation({
    mustVerifyEmail = true,
    status = '',
    className = '',
}) {
    // Simulation des données utilisateur
    const [data, setData] = useState({
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com'
    });
    
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [focusedField, setFocusedField] = useState('');

    const user = {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        email_verified_at: null
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        // Simulation de l'envoi
        setTimeout(() => {
            setProcessing(false);
            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 3000);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-md mx-auto">
                {/* Card principale avec effet glassmorphism */}
                <div className="relative">
                    {/* Effet de fond flou */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"></div>
                    
                    {/* Contenu */}
                    <div className="relative p-8">
                        {/* Header avec animation */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Modifier le profil
                            </h2>
                            <p className="text-gray-600 font-medium">
                                Mettez à jour vos informations personnelles
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Champ Nom */}
                            <div className="group">
                                <InputLabel 
                                    htmlFor="name" 
                                    value="Nom complet" 
                                    className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600" 
                                />
                                <div className="relative">
                                    <TextInput
                                        id="name"
                                        className={`w-full px-4 py-4 bg-gray-50/50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${focusedField === 'name' ? 'shadow-lg scale-[1.02]' : 'hover:bg-gray-50'}`}
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField('')}
                                        placeholder="Entrez votre nom complet"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-4 flex items-center">
                                        <svg className={`w-5 h-5 transition-colors ${focusedField === 'name' ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            {/* Champ Email */}
                            <div className="group">
                                <InputLabel 
                                    htmlFor="email" 
                                    value="Adresse e-mail" 
                                    className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600" 
                                />
                                <div className="relative">
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className={`w-full px-4 py-4 bg-gray-50/50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${focusedField === 'email' ? 'shadow-lg scale-[1.02]' : 'hover:bg-gray-50'}`}
                                        value={data.email}
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField('')}
                                        placeholder="votre@email.com"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-4 flex items-center">
                                        <svg className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            {/* Alerte de vérification email */}
                            {mustVerifyEmail && user.email_verified_at === null && (
                                <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-amber-800 font-medium">
                                                Votre adresse e-mail n'est pas vérifiée.
                                            </p>
                                            <button
                                                type="button"
                                                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-2 underline-offset-2 hover:decoration-indigo-800 transition-colors"
                                            >
                                                Renvoyer l'e-mail de vérification
                                            </button>
                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600 animate-fade-in">
                                                    ✓ Un nouveau lien de vérification a été envoyé
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bouton de soumission */}
                            <div className="pt-4">
                                <PrimaryButton 
                                    disabled={processing} 
                                    className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Enregistrement...</span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center justify-center space-x-2">
                                            <span>Enregistrer les modifications</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                    )}
                                </PrimaryButton>

                                {/* Message de succès */}
                                {recentlySuccessful && (
                                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl animate-fade-in">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-green-800 font-semibold">Profil modifié avec succès !</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Décoration de fond */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-2xl"></div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}