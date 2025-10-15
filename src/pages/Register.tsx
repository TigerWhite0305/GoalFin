import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, TrendingUp, Check, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { registerApi } from '../api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
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

    // Validazione campi
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
      // Chiamata API al backend
      const response = await registerApi({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (response.success) {
        // Login automatico dopo registrazione
        const userData = {
          id: response.data.user.id, // Mantieni come string UUID
          name: response.data.user.name,
          email: response.data.user.email,
        };
        
        login(userData);
        
        // Redirect alla dashboard
        navigate('/');
      } else {
        setError(response.message || 'Errore durante la registrazione');
      }
      
    } catch (err: any) {
      console.error('Errore registrazione:', err);
      setError(err.message || 'Errore durante la registrazione. Riprova.');
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} flex items-center justify-center p-4 transition-colors duration-300`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-500/20'} rounded-full blur-3xl`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/20'} rounded-full blur-3xl`}></div>
      </div>

      {/* Toggle Tema */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 w-12 h-12 ${isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700/80 text-amber-400 border-slate-700/50' : 'bg-white/80 hover:bg-slate-100/80 text-indigo-600 border-slate-200/50'} backdrop-blur-xl border rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-xl`}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
            Crea il tuo Account
          </h1>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
            Inizia a gestire le tue finanze oggi stesso
          </p>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200/50'} backdrop-blur-xl border rounded-2xl p-8 shadow-2xl`}>
          <div className="space-y-5">
            <div>
              <label className={`block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-medium mb-2 text-sm`}>Nome Completo</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Mario Rossi"
                  className={`w-full pl-12 pr-4 py-3 ${isDarkMode ? 'bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'} border rounded-xl focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none`}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className={`block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-medium mb-2 text-sm`}>Email</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  placeholder="mario@esempio.com"
                  className={`w-full pl-12 pr-4 py-3 ${isDarkMode ? 'bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'} border rounded-xl focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none`}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className={`block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-medium mb-2 text-sm`}>Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 ${isDarkMode ? 'bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'} border rounded-xl focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3 space-y-2">
                  {[
                    { key: 'minLength', label: 'Almeno 8 caratteri' },
                    { key: 'hasUpperCase', label: 'Una lettera maiuscola' },
                    { key: 'hasLowerCase', label: 'Una lettera minuscola' },
                    { key: 'hasNumber', label: 'Un numero' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordRequirements[key as keyof typeof passwordRequirements] ? 'bg-emerald-500' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}>
                        {passwordRequirements[key as keyof typeof passwordRequirements] && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-xs ${passwordRequirements[key as keyof typeof passwordRequirements] ? 'text-emerald-400' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={`block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-medium mb-2 text-sm`}>Conferma Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 ${isDarkMode ? 'bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'} border rounded-xl focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
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

            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-xs text-center`}>
              Registrandoti accetti i nostri{' '}
              <button className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} underline transition-colors`}>
                Termini di Servizio
              </button>{' '}
              e la{' '}
              <button className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} underline transition-colors`}>
                Privacy Policy
              </button>
            </p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDarkMode ? 'border-slate-700/50' : 'border-slate-300/50'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${isDarkMode ? 'bg-slate-800/60 text-slate-400' : 'bg-white/80 text-slate-600'}`}>oppure</span>
            </div>
          </div>

          <div className="text-center">
            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
              Hai già un account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} font-semibold transition-colors`}
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