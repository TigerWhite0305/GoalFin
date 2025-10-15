// frontend/src/api/accountsApi.ts
import apiClient from './axiosConfig';

// ==========================================
// TYPES / INTERFACES
// ==========================================

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: string; // 'checking', 'savings', 'investment', 'cash'
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountData {
  name: string;
  type: string;
  balance?: number;
  currency?: string;
  color?: string;
  icon?: string;
}

export interface UpdateAccountData {
  name?: string;
  type?: string;
  balance?: number;
  currency?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export interface AccountsSummary {
  totalBalance: number;
  totalAccounts: number;
  byType: Record<string, { count: number; balance: number }>;
  accounts: Account[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ==========================================
// API CALLS
// ==========================================

/**
 * Crea nuovo conto
 */
export const createAccountApi = async (data: CreateAccountData): Promise<Account> => {
  try {
    const response = await apiClient.post<ApiResponse<Account>>('/accounts', data);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { 
      success: false, 
      message: 'Errore durante la creazione del conto' 
    };
  }
};

/**
 * Ottieni tutti i conti
 */
export const getAccountsApi = async (): Promise<Account[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Account[]>>('/accounts');
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { 
      success: false, 
      message: 'Errore nel recuperare i conti' 
    };
  }
};

/**
 * Ottieni singolo conto
 */
export const getAccountByIdApi = async (id: string): Promise<Account> => {
  try {
    const response = await apiClient.get<ApiResponse<Account>>(`/accounts/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { 
      success: false, 
      message: 'Errore nel recuperare il conto' 
    };
  }
};

/**
 * Aggiorna conto
 */
export const updateAccountApi = async (
  id: string, 
  data: UpdateAccountData
): Promise<Account> => {
  try {
    const response = await apiClient.put<ApiResponse<Account>>(`/accounts/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { 
      success: false, 
      message: 'Errore durante l\'aggiornamento del conto' 
    };
  }
};

/**
 * Elimina conto
 */
export const deleteAccountApi = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/accounts/${id}`);
  } catch (error: any) {
    throw error.response?.data || { 
      success: false, 
      message: 'Errore durante l\'eliminazione del conto' 
    };
  }
};

/**
 * Ottieni riepilogo conti
 */
export const getAccountsSummaryApi = async (): Promise<AccountsSummary> => {
  try {
    const response = await apiClient.get<ApiResponse<AccountsSummary>>('/accounts/summary');
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || { 
      success: false, 
      message: 'Errore nel recuperare il riepilogo' 
    };
  }
};