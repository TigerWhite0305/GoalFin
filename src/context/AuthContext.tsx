// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUser, saveUser, clearAuth, hasToken } from "../utils/tokenStorage";
import { checkAuthApi } from "../api";

type User = {
  id: string; // Cambiato da number a string per supportare UUID
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Controlla se l'utente è già loggato al caricamento
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verifica se esiste un token
        if (hasToken()) {
          // Recupera utente dal localStorage
          const storedUser = getUser();
          
          if (storedUser) {
            // Verifica token con il backend
            const isValid = await checkAuthApi();
            
            if (isValid) {
              setUser(storedUser);
            } else {
              // Token non valido, pulisci tutto
              clearAuth();
            }
          }
        }
      } catch (error) {
        console.error('Errore verifica autenticazione:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    saveUser(userData);
  };

  const logout = () => {
    setUser(null);
    clearAuth();
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  // Non renderizzare i children finché non abbiamo verificato l'auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook per usare il contesto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve essere usato all'interno di un AuthProvider");
  }
  return context;
};