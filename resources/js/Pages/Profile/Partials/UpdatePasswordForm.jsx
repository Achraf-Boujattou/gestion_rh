import { useState, useRef } from 'react';

// Composants simulés pour la démo
const InputError = ({ message, className }) => (
  message ? <p className={`text-red-500 text-sm ${className}`}>{message}</p> : null
);

const InputLabel = ({ htmlFor, value, className }) => (
  <label htmlFor={htmlFor} className={className}>{value}</label>
);

const TextInput = ({ className, type = 'text', ...props }) => (
  <input type={type} className={className} {...props} />
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

// Fonction pour calculer la force du mot de passe
const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  
  let score = 0;
  let feedback = [];
  
  // Longueur
  if (password.length >= 8) score += 1;
  else feedback.push('Au moins 8 caractères');
  
  // Majuscules
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Une majuscule');
  
  // Minuscules
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Une minuscule');
  
  // Chiffres
  if (/\d/.test(password)) score += 1;
  else feedback.push('Un chiffre');
  
  // Caractères spéciaux
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Un caractère spécial');
  
  const levels = [
    { score: 0, label: '', color: '', bgColor: '' },
    { score: 1, label: 'Très faible', color: 'text-red-600', bgColor: 'bg-red-500' },
    { score: 2, label: 'Faible', color: 'text-orange-600', bgColor: 'bg-orange-500' },
    { score: 3, label: 'Moyen', color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
    { score: 4, label: 'Fort', color: 'text-blue-600', bgColor: 'bg-blue-500' },
    { score: 5, label: 'Très fort', color: 'text-green-600', bgColor: 'bg-green-500' }
  ];
  
  return { ...levels[score], feedback };
};

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    
    const [data, setData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const passwordStrength = calculatePasswordStrength(data.password);

    const updatePassword = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        
        // Validation simple
        const newErrors = {};
        if (!data.current_password) newErrors.current_password = 'Le mot de passe actuel est requis';
        if (!data.password) newErrors.password = 'Le nouveau mot de passe est requis';
        if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
        }
        if (data.password && data.password.length < 8) {
            newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setProcessing(false);
            return;
        }
        
        // Simulation de l'envoi
        setTimeout(() => {
            setProcessing(false);
            setRecentlySuccessful(true);
            setData({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
            setTimeout(() => setRecentlySuccessful(false), 3000);
        }, 1500);
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const PasswordField = ({ 
        id, 
        label, 
        value, 
        onChange, 
        showPassword, 
        onToggleVisibility, 
        error, 
        placeholder,
        showStrength = false,
        inputRef = null
    }) => (
        <div className="group">
            <InputLabel 
                htmlFor={id} 
                value={label} 
                className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600" 
            />
            <div className="relative">
                <TextInput
                    id={id}
                    ref={inputRef}
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full px-4 py-4 pr-12 bg-gray-50/50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 ${focusedField === id ? 'shadow-lg scale-[1.02]' : 'hover:bg-gray-50'} ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocusedField(id)}
                    onBlur={() => setFocusedField('')}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>
            
            {/* Indicateur de force du mot de passe */}
            {showStrength && value && (
                <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            ></div>
                        </div>
                        <span className={`text-sm font-medium ${passwordStrength.color}`}>
                            {passwordStrength.label}
                        </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                        <div className="text-xs text-gray-600">
                            <span>Manque : </span>
                            {passwordStrength.feedback.join(', ')}
                        </div>
                    )}
                </div>
            )}
            
            <InputError className="mt-2" message={error} />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4">
            <div className="max-w-md mx-auto">
                {/* Card principale avec effet glassmorphism */}
                <div className="relative">
                    {/* Effet de fond flou */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"></div>
                    
                    {/* Contenu */}
                    <div className="relative p-8">
                        {/* Header avec animation */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
                                Modifier le mot de passe
                            </h2>
                            <p className="text-gray-600 font-medium">
                                Utilisez un mot de passe fort pour sécuriser votre compte
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Mot de passe actuel */}
                            <PasswordField
                                id="current_password"
                                label="Mot de passe actuel"
                                value={data.current_password}
                                onChange={(e) => setData({ ...data, current_password: e.target.value })}
                                showPassword={showPasswords.current}
                                onToggleVisibility={() => togglePasswordVisibility('current')}
                                error={errors.current_password}
                                placeholder="Entrez votre mot de passe actuel"
                                inputRef={currentPasswordInput}
                            />

                            {/* Nouveau mot de passe */}
                            <PasswordField
                                id="password"
                                label="Nouveau mot de passe"
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                showPassword={showPasswords.new}
                                onToggleVisibility={() => togglePasswordVisibility('new')}
                                error={errors.password}
                                placeholder="Entrez votre nouveau mot de passe"
                                showStrength={true}
                                inputRef={passwordInput}
                            />

                            {/* Confirmation du nouveau mot de passe */}
                            <PasswordField
                                id="password_confirmation"
                                label="Confirmer le nouveau mot de passe"
                                value={data.password_confirmation}
                                onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                                showPassword={showPasswords.confirm}
                                onToggleVisibility={() => togglePasswordVisibility('confirm')}
                                error={errors.password_confirmation}
                                placeholder="Confirmez votre nouveau mot de passe"
                            />

                            {/* Conseils de sécurité */}
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-blue-800 mb-1">Conseils pour un mot de passe sécurisé :</h4>
                                        <ul className="text-xs text-blue-700 space-y-1">
                                            <li>• Au moins 8 caractères</li>
                                            <li>• Mélange de majuscules et minuscules</li>
                                            <li>• Inclure des chiffres et caractères spéciaux</li>
                                            <li>• Éviter les mots courants</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Bouton de soumission */}
                            <div className="pt-4">
                                <PrimaryButton 
                                    disabled={processing} 
                                    onClick={updatePassword}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Mise à jour...</span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center justify-center space-x-2">
                                            <span>Modifier le mot de passe</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
                                            <span className="text-green-800 font-semibold">Mot de passe modifié avec succès !</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Décoration de fond */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-red-200 to-orange-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 w-24 h-24 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-20 blur-2xl"></div>
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