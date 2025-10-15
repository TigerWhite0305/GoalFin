// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { checkAuthApi, getMeApi } from "../api";

type User = {
  id: string; // ← Cambiato da number a string (UUID)
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica autenticazione all'avvio
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Controlla se c'è un token in localStorage
        const token = localStorage.getItem('goalfintoken24') || localStorage.getItem('goalfintoken90');
        
        if (!token) {
          console.log('🔴 Nessun token trovato');
          setUser(null);
          setIsLoading(false);
          return;
        }

        console.log('🟢 Token trovato, verifica validità...');
        const userData = await getMeApi();
        setUser(userData);
        console.log('✅ Utente autenticato:', userData.name);
      } catch (error) {
        console.log('🔴 Token non valido o scaduto');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
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