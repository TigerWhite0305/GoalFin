import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, TrendingUp, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loginApi } from '../api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validazione base
    if (!email || !password) {
      setError('Inserisci email e password');
      setIsLoading(false);
      return;
    }

    // Validazione formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Inserisci un indirizzo email valido');
      setIsLoading(false);
      return;
    }

    try {
      // Chiamata API al backend
      const response = await loginApi({ email, password });
      
      if (response.success) {
        // Salva utente nel context (AuthContext)
        const userData = {
          id: response.data.user.id, // Mantieni come string UUID
          name: response.data.user.name,
          email: response.data.user.email,
        };
        
        login(userData);
        
        // Redirect alla dashboard
        navigate('/');
      } else {
        setError(response.message || 'Errore durante il login');
      }
      
    } catch (err: any) {
      console.error('Errore login:', err);
      setError(err.message || 'Credenziali non valide. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && email && password) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} flex items-center justify-center p-4 transition-colors duration-300`}>
      {/* Pattern di sfondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-500/20'} rounded-full blur-3xl`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/20'} rounded-full blur-3xl`}></div>
      </div>

      {/* Toggle Tema - Posizione fissa in alto a destra */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 w-12 h-12 ${isDarkMode ? 'bg-slate-800/80 hover:bg-slate-700/80 text-amber-400 border-slate-700/50' : 'bg-white/80 hover:bg-slate-100/80 text-indigo-600 border-slate-200/50'} backdrop-blur-xl border rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-xl`}
        aria-label="Toggle tema"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="relative w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
            Bentornato!
          </h1>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Accedi per gestire le tue finanze
          </p>
        </div>

        {/* Card di Login */}
        <div className={`${isDarkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-slate-200/50'} backdrop-blur-xl border rounded-2xl p-8 shadow-2xl`}>
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className={`block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-medium mb-2 text-sm`}>
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="mario@esempio.com"
                  className={`w-full pl-12 pr-4 py-3 ${isDarkMode ? 'bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'} border rounded-xl focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none`}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-medium mb-2 text-sm`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Ricordami e Password dimenticata */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className={`w-4 h-4 rounded ${isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-300 bg-white'} text-indigo-500 focus:ring-indigo-500/20 focus:ring-2`}
                />
                <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-sm`}>Ricordami</span>
              </label>
              <button
                type="button"
                className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} text-sm font-medium transition-colors`}
              >
                Password dimenticata?
              </button>
            </div>

            {/* Messaggio di errore */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Pulsante Login */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Accesso in corso...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Accedi</span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDarkMode ? 'border-slate-700/50' : 'border-slate-300/50'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${isDarkMode ? 'bg-slate-800/60 text-slate-400' : 'bg-white/80 text-slate-600'}`}>oppure</span>
            </div>
          </div>

          {/* Link Registrazione */}
          <div className="text-center">
            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
              Non hai un account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} font-semibold transition-colors`}
              >
                Registrati
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className={`text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-600'} text-sm mt-8`}>
          Accedendo accetti i nostri{' '}
          <button className={`${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-700 hover:text-slate-900'} underline transition-colors`}>
            Termini di Servizio
          </button>{' '}
          e la{' '}
          <button className={`${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-700 hover:text-slate-900'} underline transition-colors`}>
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;