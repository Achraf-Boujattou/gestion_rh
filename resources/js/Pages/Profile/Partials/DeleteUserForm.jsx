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

const DangerButton = ({ children, disabled, className, ...props }) => (
  <button 
    disabled={disabled} 
    className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
    {...props}
  >
    {children}
  </button>
);

const SecondaryButton = ({ children, className, ...props }) => (
  <button className={className} {...props}>
    {children}
  </button>
);

// Modal Component
const Modal = ({ show, onClose, children }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-3xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 animate-modal-enter">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({ password: '' });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1: warning, 2: confirmation
    const passwordInput = useRef();

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
        setStep(1);
    };

    const proceedToConfirmation = () => {
        setStep(2);
        setTimeout(() => {
            if (passwordInput.current) {
                passwordInput.current.focus();
            }
        }, 100);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        
        if (!data.password) {
            setErrors({ password: 'Le mot de passe est requis pour confirmer la suppression' });
            return;
        }
        
        setProcessing(true);
        setErrors({});
        
        // Simulation de la suppression
        setTimeout(() => {
            setProcessing(false);
            closeModal();
            // Ici normalement on redirigerait vers la page de connexion
            alert('Compte supprimé avec succès !');
        }, 2000);
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setData({ password: '' });
        setErrors({});
        setStep(1);
        setShowPassword(false);
    };

    const goBack = () => {
        setStep(1);
        setData({ password: '' });
        setErrors({});
    };

    return (
        <>
            {/* Section principale */}
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Card principale */}
                    <div className="relative">
                        {/* Effet de fond flou */}
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"></div>
                        
                        {/* Contenu */}
                        <div className="relative p-8">
                            {/* Header avec icône de danger */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-4 shadow-lg">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                    Supprimer le compte
                                </h2>
                                <p className="text-gray-600 font-medium">
                                    Action irréversible - Procédez avec précaution
                                </p>
                            </div>

                            {/* Avertissement principal */}
                            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-red-800 mb-2">
                                            ⚠️ Attention : Action définitive
                                        </h3>
                                        <p className="text-red-700 mb-4 leading-relaxed">
                                            Une fois votre compte supprimé, toutes vos données seront définitivement perdues. 
                                            Cette action ne peut pas être annulée.
                                        </p>
                                        
                                        <div className="bg-white/50 rounded-xl p-4 mb-4">
                                            <h4 className="font-semibold text-red-800 mb-2">Données qui seront supprimées :</h4>
                                            <ul className="text-sm text-red-700 space-y-1">
                                                <li className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                    <span>Informations personnelles et profil</span>
                                                </li>
                                                <li className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                    <span>Historique et contenus créés</span>
                                                </li>
                                                <li className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                    <span>Paramètres et préférences</span>
                                                </li>
                                                <li className="flex items-center space-x-2">
                                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                    <span>Accès à tous les services</span>
                                                </li>
                                            </ul>
                                        </div>
                                        
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-medium text-blue-800">
                                                    💡 Conseil : Téléchargez vos données importantes avant de continuer
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bouton de suppression */}
                            <div className="text-center">
                                <DangerButton 
                                    onClick={confirmUserDeletion}
                                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-200"
                                >
                                    <span className="flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Supprimer mon compte</span>
                                    </span>
                                </DangerButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmation */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                {step === 1 ? (
                    // Étape 1: Avertissement final
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Êtes-vous absolument sûr ?
                        </h3>
                        
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <p className="text-red-800 font-medium mb-2">
                                ⚠️ Cette action est irréversible !
                            </p>
                            <p className="text-sm text-red-700">
                                Toutes vos données seront définitivement supprimées dans les prochaines minutes.
                            </p>
                        </div>
                        
                        <div className="flex space-x-3">
                            <SecondaryButton 
                                onClick={closeModal}
                                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors"
                            >
                                Annuler
                            </SecondaryButton>
                            <DangerButton 
                                onClick={proceedToConfirmation}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                            >
                                Continuer
                            </DangerButton>
                        </div>
                    </div>
                ) : (
                    // Étape 2: Confirmation par mot de passe
                    <div>
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Confirmez avec votre mot de passe
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Entrez votre mot de passe pour confirmer la suppression définitive
                            </p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData({ password: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all"
                                    placeholder="Entrez votre mot de passe"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
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
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        
                        <div className="flex space-x-3">
                            <SecondaryButton 
                                onClick={goBack}
                                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors"
                            >
                                ← Retour
                            </SecondaryButton>
                            <SecondaryButton 
                                onClick={closeModal}
                                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors"
                            >
                                Annuler
                            </SecondaryButton>
                            <DangerButton 
                                onClick={deleteUser}
                                disabled={processing || !data.password}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Suppression...</span>
                                    </div>
                                ) : (
                                    'Supprimer définitivement'
                                )}
                            </DangerButton>
                        </div>
                    </div>
                )}
            </Modal>

            <style jsx>{`
                @keyframes modal-enter {
                    from { opacity: 0; transform: scale(0.95) translateY(-10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-modal-enter {
                    animation: modal-enter 0.2s ease-out;
                }
            `}</style>
        </>
    );
}