// frontend/src/api/index.ts

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

// Export API accounts (Portfolio)
export {
  createAccountApi,
  getAccountsApi,
  getAccountByIdApi,
  updateAccountApi,
  deleteAccountApi,
  getAccountsSummaryApi,
  type Account,
  type CreateAccountData,
  type UpdateAccountData,
  type AccountsSummary,
} from './accountsApi';

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