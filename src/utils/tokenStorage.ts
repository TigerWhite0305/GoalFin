// src/utils/tokenStorage.ts

const TOKEN_KEY = 'goalfin_token';
const USER_KEY = 'goalfin_user';

/**
 * Salva il token JWT nel localStorage
 */
export const saveToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Errore nel salvare il token:', error);
  }
};

/**
 * Recupera il token JWT dal localStorage
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
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
    localStorage.removeItem(TOKEN_KEY);
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
};