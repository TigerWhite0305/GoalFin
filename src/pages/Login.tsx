import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
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
      // CREDENZIALI DI TEST (rimuovere in produzione)
      const TEST_EMAIL = 'test@esempio.com';
      const TEST_PASSWORD = 'password123';
      
      // Simulazione chiamata API (rimuovere in produzione)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verifica credenziali di test
      if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        // Login riuscito
        const userData = {
          id: 1,
          name: 'Mario Rossi',
          email: email
        };
        
        login(userData);
        navigate('/');
      } else {
        // Credenziali errate
        setError('Email o password non valide. Prova con test@esempio.com / password123');
      }
      
    } catch (err) {
      setError('Errore durante il login. Riprova.');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Pattern di sfondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bentornato!
          </h1>
          <p className="text-slate-400">
            Accedi per gestire le tue finanze
          </p>
          {/* Credenziali di test */}
          <div className="mt-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3">
            <p className="text-indigo-300 text-xs font-medium mb-1">🔑 Credenziali di Test:</p>
            <p className="text-indigo-200 text-xs">Email: <span className="font-mono">test@esempio.com</span></p>
            <p className="text-indigo-200 text-xs">Password: <span className="font-mono">password123</span></p>
          </div>
        </div>

        {/* Card di Login */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="mario@esempio.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-indigo-500 focus:ring-indigo-500/20 focus:ring-2"
                />
                <span className="text-slate-400 text-sm">Ricordami</span>
              </label>
              <button
                type="button"
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
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
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800/60 text-slate-400">oppure</span>
            </div>
          </div>

          {/* Link Registrazione */}
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Non hai un account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Registrati
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Accedendo accetti i nostri{' '}
          <button className="text-slate-400 hover:text-slate-300 underline transition-colors">
            Termini di Servizio
          </button>{' '}
          e la{' '}
          <button className="text-slate-400 hover:text-slate-300 underline transition-colors">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;