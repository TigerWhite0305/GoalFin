// src/api/index.ts

// Export client axios configurato
export { default as apiClient } from './axiosConfig';

// Export API autenticazione
export {
  registerApi,
  loginApi,
  logoutApi,
  getMeApi,
  checkAuthApi,
  type RegisterData,
  type LoginData,
  type User,
  type AuthResponse,
  type UserResponse,
} from './authApi';

// Export utility token
export {
  saveToken,
  getToken,
  removeToken,
  hasToken,
  saveUser,
  getUser,
  removeUser,
  clearAuth,
} from '../utils/tokenStorage';