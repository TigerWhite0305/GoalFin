import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, TrendingUp, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Validazione password in tempo reale
  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Tutti i campi sono obbligatori');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Inserisci un indirizzo email valido');
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError('La password non soddisfa tutti i requisiti');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Utente registrato:', {
        name: formData.name,
        email: formData.email
      });
      
      alert('Registrazione completata! (Implementare login e redirect)');
      
    } catch (err) {
      setError('Errore durante la registrazione. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && formData.name && formData.email && formData.password && formData.confirmPassword) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Crea il tuo Account
          </h1>
          <p className="text-slate-400">
            Inizia a gestire le tue finanze oggi stesso
          </p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-slate-300 font-medium mb-2 text-sm">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Mario Rossi"
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2 text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  placeholder="mario@esempio.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2 text-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordRequirements.minLength ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      {passwordRequirements.minLength && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-xs ${passwordRequirements.minLength ? 'text-emerald-400' : 'text-slate-400'}`}>
                      Almeno 8 caratteri
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordRequirements.hasUpperCase ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      {passwordRequirements.hasUpperCase && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-xs ${passwordRequirements.hasUpperCase ? 'text-emerald-400' : 'text-slate-400'}`}>
                      Una lettera maiuscola
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordRequirements.hasLowerCase ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      {passwordRequirements.hasLowerCase && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-xs ${passwordRequirements.hasLowerCase ? 'text-emerald-400' : 'text-slate-400'}`}>
                      Una lettera minuscola
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordRequirements.hasNumber ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      {passwordRequirements.hasNumber && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-xs ${passwordRequirements.hasNumber ? 'text-emerald-400' : 'text-slate-400'}`}>
                      Un numero
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2 text-sm">Conferma Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
              className="w-full bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Registrazione in corso...</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span>Crea Account</span>
                </>
              )}
            </button>

            <p className="text-slate-400 text-xs text-center">
              Registrandoti accetti i nostri{' '}
              <button className="text-indigo-400 hover:text-indigo-300 underline transition-colors">
                Termini di Servizio
              </button>{' '}
              e la{' '}
              <button className="text-indigo-400 hover:text-indigo-300 underline transition-colors">
                Privacy Policy
              </button>
            </p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800/60 text-slate-400">oppure</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Hai già un account?{' '}
              <button
                type="button"
                onClick={() => console.log('Vai al login')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Accedi
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;