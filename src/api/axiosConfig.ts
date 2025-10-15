// src/api/axiosConfig.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, clearAuth } from '../utils/tokenStorage';

// URL del backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Istanza Axios configurata
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secondi
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor per le richieste
 * Aggiunge automaticamente il token JWT all'header Authorization
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor per le risposte
 * Gestisce errori comuni (401, 403, 500, ecc.)
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Token scaduto o non valido
    if (error.response?.status === 401) {
      // Controlla se siamo già nella pagina di login per evitare loop
      const isLoginPage = window.location.pathname === '/login';
      const isRegisterPage = window.location.pathname === '/register';
      
      if (!isLoginPage && !isRegisterPage) {
        clearAuth();
        console.log('🔴 Token scaduto o invalido - Redirect a login');
        window.location.href = '/login';
      }
    }
    
    // Accesso negato
    if (error.response?.status === 403) {
      console.error('❌ Accesso negato');
    }
    
    // Errore server
    if (error.response?.status === 500) {
      console.error('❌ Errore del server');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;