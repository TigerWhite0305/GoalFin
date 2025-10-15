// src/api/authApi.ts
import apiClient from './axiosConfig';
import { saveToken, saveUser, clearAuth } from '../utils/tokenStorage';

// ==========================================
// TYPES / INTERFACES
// ==========================================

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean; // ← AGGIUNTO
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

// ==========================================
// API CALLS
// ==========================================

/**
 * Registra un nuovo utente
 * @param data Dati registrazione (name, email, password)
 * @returns Promise con user e token
 */
export const registerApi = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Salva token e user nel localStorage
    if (response.data.success) {
      saveToken(response.data.data.token);
      saveUser(response.data.data.user);
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { 
      success: false, 
      message: 'Errore durante la registrazione' 
    };
  }
};

/**
 * Login utente con supporto "Ricordami"
 * @param data Dati login (email, password, rememberMe)
 * @returns Promise con user e token
 */
export const loginApi = async (data: LoginData): Promise<AuthResponse> => {
  try {
    // Invia rememberMe al backend
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe || false // ← Default false
    });
    
    // Salva token e user nel localStorage
    if (response.data.success) {
      saveToken(response.data.data.token);
      saveUser(response.data.data.user);
      
      // Log durata token (rimuovere in production)
      console.log(`🔐 Token salvato - Durata: ${data.rememberMe ? '90 giorni' : '24 ore'}`);
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { 
      success: false, 
      message: 'Errore durante il login' 
    };
  }
};

/**
 * Logout utente
 * Rimuove token e dati utente dal localStorage
 */
export const logoutApi = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Errore durante il logout:', error);
  } finally {
    // Pulisce sempre i dati locali
    clearAuth();
  }
};

/**
 * Ottieni profilo utente corrente
 * @returns Promise con dati utente
 */
export const getMeApi = async (): Promise<User> => {
  try {
    const response = await apiClient.get<UserResponse>('/auth/me');
    
    // Aggiorna user nel localStorage
    if (response.data.success) {
      saveUser(response.data.data);
    }
    
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { 
      success: false, 
      message: 'Errore nel recuperare il profilo' 
    };
  }
};

/**
 * Verifica se l'utente è autenticato
 * Controlla token e validità con il server
 */
export const checkAuthApi = async (): Promise<boolean> => {
  try {
    await getMeApi();
    return true;
  } catch (error) {
    clearAuth();
    return false;
  }
};