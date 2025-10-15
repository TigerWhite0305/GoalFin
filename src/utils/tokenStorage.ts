// src/utils/tokenStorage.ts

const TOKEN_24H_KEY = 'goalfintoken24';
const TOKEN_90D_KEY = 'goalfintoken90';
const USER_KEY = 'goalfin_user';

/**
 * Salva il token JWT nel localStorage con il nome corretto
 * @param token - JWT token string
 * @param rememberMe - Se true, salva come goalfintoken90, altrimenti goalfintoken24
 */
export const saveToken = (token: string, rememberMe: boolean = false): void => {
  try {
    const tokenKey = rememberMe ? TOKEN_90D_KEY : TOKEN_24H_KEY;
    
    // Rimuovi l'altro token se esiste
    const otherTokenKey = rememberMe ? TOKEN_24H_KEY : TOKEN_90D_KEY;
    localStorage.removeItem(otherTokenKey);
    
    // Salva il nuovo token
    localStorage.setItem(tokenKey, token);
    
    console.log(`🔐 Token salvato come: ${tokenKey}`);
  } catch (error) {
    console.error('Errore nel salvare il token:', error);
  }
};

/**
 * Recupera il token JWT dal localStorage
 * Cerca prima goalfintoken90, poi goalfintoken24
 */
export const getToken = (): string | null => {
  try {
    // Cerca prima il token a 90 giorni
    let token = localStorage.getItem(TOKEN_90D_KEY);
    if (token) {
      console.log('🔐 Token trovato: goalfintoken90');
      return token;
    }
    
    // Altrimenti cerca il token a 24 ore
    token = localStorage.getItem(TOKEN_24H_KEY);
    if (token) {
      console.log('🔐 Token trovato: goalfintoken24');
      return token;
    }
    
    return null;
  } catch (error) {
    console.error('Errore nel recuperare il token:', error);
    return null;
  }
};

/**
 * Rimuove il token JWT dal localStorage
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_24H_KEY);
    localStorage.removeItem(TOKEN_90D_KEY);
    console.log('🔐 Token rimossi');
  } catch (error) {
    console.error('Errore nel rimuovere il token:', error);
  }
};

/**
 * Verifica se esiste un token
 */
export const hasToken = (): boolean => {
  return !!getToken();
};

/**
 * Salva i dati utente nel localStorage
 */
export const saveUser = (user: any): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Errore nel salvare utente:', error);
  }
};

/**
 * Recupera i dati utente dal localStorage
 */
export const getUser = (): any | null => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Errore nel recuperare utente:', error);
    return null;
  }
};

/**
 * Rimuove i dati utente dal localStorage
 */
export const removeUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Errore nel rimuovere utente:', error);
  }
};

/**
 * Pulisce tutti i dati di autenticazione
 */
export const clearAuth = (): void => {
  removeToken();
  removeUser();
  console.log('🧹 Dati autenticazione puliti');
};