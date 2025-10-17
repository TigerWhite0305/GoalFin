// src/components/ui/portfolio/hooks/usePortfolioData.ts
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../../../../context/ToastContext';
import {
  getAccountsApi,
  createAccountApi,
  updateAccountApi,
  deleteAccountApi,
  transferBetweenAccountsApi,
  adjustAccountBalanceApi,
} from '../../../../api/accountsApi';

export type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  bank?: string;
  lastTransaction?: string;
};

export type ActivityHistoryItem = {
  id: number;
  type: 'account_created' | 'account_edited' | 'account_deleted' | 'balance_adjusted' | 'transfer' | 'bulk_operation';
  timestamp: string;
  description: string;
  icon: any;
  color: string;
  amount?: number;
};

export const usePortfolioData = () => {
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Core States
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedAccountId, setHighlightedAccountId] = useState<string | null>(null);
  
  // Activity History
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryItem[]>([]);
  
  // Load accounts from API
  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const apiAccounts = await getAccountsApi();
      
      const formattedAccounts: Account[] = apiAccounts.map(acc => ({
        id: acc.id,
        name: acc.name,
        type: acc.type,
        balance: acc.balance,
        currency: acc.currency,
        color: acc.color || getDefaultColorForType(acc.type),
        icon: acc.icon || acc.type,
        isActive: acc.isActive,
        userId: acc.userId,
        createdAt: acc.createdAt,
        updatedAt: acc.updatedAt,
        bank: '',
        lastTransaction: acc.updatedAt
      }));
      
      setAccounts(formattedAccounts);
    } catch (error: any) {
      console.error('❌ Errore caricamento conti:', error);
      addToast('Errore nel caricare i conti', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Utility function for default colors
  const getDefaultColorForType = (type: string): string => {
    switch (type) {
      case 'checking': return '#6366F1';
      case 'savings': return '#10B981';
      case 'prepaid':
      case 'card':
      case 'credit_card': return '#F59E0B';
      case 'business':
      case 'investment': return '#8B5CF6';
      case 'cash': return '#EC4899';
      default: return '#6366F1';
    }
  };

  // Add activity to history
  const addActivity = (activity: Omit<ActivityHistoryItem, 'id' | 'timestamp'>) => {
    setActivityHistory(prev => [{
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...activity
    }, ...prev]);
  };

  // Remove activity from history
  const removeActivity = (activityId: number) => {
    const activity = activityHistory.find(act => act.id === activityId);
    setActivityHistory(prev => prev.filter(act => act.id !== activityId));
    if (activity) {
      addToast(`Attività "${activity.description}" rimossa dal log`, 'success');
    }
  };

  // Create new account
  const createAccount = async (accountData: any) => {
    try {
      const created = await createAccountApi({
        name: accountData.name,
        type: accountData.type,
        balance: parseFloat(accountData.balance) || 0,
        currency: accountData.currency || 'EUR',
        color: accountData.color || getDefaultColorForType(accountData.type),
        icon: accountData.icon || accountData.type
      });
      
      const newAccount: Account = {
        ...created,
        bank: accountData.bank || '',
        lastTransaction: created.createdAt,
        color: created.color || getDefaultColorForType(created.type),
        icon: created.icon || created.type
      };
      
      setAccounts(prev => [...prev, newAccount]);
      
      addActivity({
        type: 'account_created',
        description: `Conto "${accountData.name}" creato`,
        icon: 'Plus', // Will be replaced with actual icon in component
        color: '#10B981'
      });
      
      addToast(`Conto "${accountData.name}" aggiunto con successo`, 'success');
      return newAccount;
    } catch (error: any) {
      console.error('❌ Errore creazione conto:', error);
      addToast(error.message || 'Errore durante la creazione', 'error');
      throw error;
    }
  };

  // Update account
  const updateAccount = async (accountId: string, accountData: any) => {
    try {
      const updated = await updateAccountApi(accountId, {
        name: accountData.name,
        type: accountData.type,
        balance: parseFloat(accountData.balance) || 0,
        currency: accountData.currency || 'EUR',
        color: accountData.color || getDefaultColorForType(accountData.type),
        icon: accountData.icon || accountData.type
      });
      
      const updatedAccount: Account = {
        ...updated,
        bank: accountData.bank || '',
        lastTransaction: updated.updatedAt,
        color: updated.color || getDefaultColorForType(updated.type),
        icon: updated.icon || updated.type
      };
      
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId ? updatedAccount : acc
      ));
      
      addActivity({
        type: 'account_edited',
        description: `Conto "${accountData.name}" modificato`,
        icon: 'Edit',
        color: '#F59E0B'
      });
      
      addToast(`Conto "${accountData.name}" modificato con successo`, 'success');
      return updatedAccount;
    } catch (error: any) {
      console.error('❌ Errore aggiornamento conto:', error);
      addToast(error.message || 'Errore durante l\'aggiornamento', 'error');
      throw error;
    }
  };

  // Delete account
  const deleteAccount = async (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;

    if (!window.confirm(`Sei sicuro di voler eliminare "${account.name}"?`)) {
      return;
    }

    try {
      await deleteAccountApi(accountId);
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
      
      addActivity({
        type: 'account_deleted',
        description: `Conto "${account.name}" eliminato`,
        icon: 'Trash2',
        color: '#EF4444'
      });
      
      addToast(`Conto "${account.name}" eliminato con successo`, 'success');
      return true;
    } catch (error: any) {
      console.error('❌ Errore eliminazione:', error);
      addToast('Errore durante l\'eliminazione', 'error');
      return false;
    }
  };

  // Transfer between accounts
  const transferBetweenAccounts = async (
    fromAccountId: string, 
    toAccountId: string, 
    amount: number, 
    description?: string
  ) => {
    const fromAccount = accounts.find(acc => acc.id === fromAccountId);
    const toAccount = accounts.find(acc => acc.id === toAccountId);
    
    if (!fromAccount || !toAccount) {
      addToast('Conti non trovati', 'error');
      return false;
    }

    if (fromAccount.balance < amount) {
      addToast('Fondi insufficienti', 'error');
      return false;
    }

    try {
      await transferBetweenAccountsApi(fromAccountId, toAccountId, amount, description);
      
      setAccounts(prev => prev.map(acc => {
        if (acc.id === fromAccountId) {
          return { ...acc, balance: acc.balance - amount, lastTransaction: new Date().toISOString() };
        }
        if (acc.id === toAccountId) {
          return { ...acc, balance: acc.balance + amount, lastTransaction: new Date().toISOString() };
        }
        return acc;
      }));
      
      addActivity({
        type: 'transfer',
        description: `Trasferimento di €${amount.toFixed(2)} da "${fromAccount.name}" a "${toAccount.name}"${description ? ` - ${description}` : ''}`,
        icon: 'ArrowLeftRight',
        color: '#6366F1',
        amount: amount
      });
      
      addToast(`Trasferiti €${amount.toFixed(2)} da "${fromAccount.name}" a "${toAccount.name}"`, 'success');
      return true;
    } catch (error: any) {
      console.error('❌ Errore trasferimento:', error);
      addToast(error.message || 'Errore durante il trasferimento', 'error');
      return false;
    }
  };

  // Adjust account balance
  const adjustAccountBalance = async (accountId: string, newBalance: number, reason: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return false;
    
    const oldBalance = account.balance;
    const difference = newBalance - oldBalance;

    try {
      await adjustAccountBalanceApi(accountId, newBalance, reason);
      
      setAccounts(prev => prev.map(acc =>
        acc.id === accountId 
          ? { ...acc, balance: newBalance, lastTransaction: new Date().toISOString() }
          : acc
      ));
      
      addActivity({
        type: 'balance_adjusted',
        description: `Saldo di "${account.name}" ${difference >= 0 ? 'aumentato' : 'diminuito'} di €${Math.abs(difference).toFixed(2)} - ${reason}`,
        icon: 'DollarSign',
        color: difference >= 0 ? '#10B981' : '#EF4444',
        amount: Math.abs(difference)
      });
      
      addToast(`Saldo di "${account.name}" aggiornato a €${newBalance.toFixed(2)}`, 'success');
      return true;
    } catch (error: any) {
      console.error('❌ Errore aggiustamento saldo:', error);
      addToast(error.message || 'Errore durante l\'aggiustamento', 'error');
      return false;
    }
  };

  // Handle URL highlighting effect
  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    if (highlightId && accounts.length > 0) {
      setHighlightedAccountId(highlightId);
      
      const timer = setTimeout(() => {
        setHighlightedAccountId(null);
        setSearchParams({});
      }, 3000);
      
      setTimeout(() => {
        const accountElement = document.getElementById(`account-${highlightId}`);
        if (accountElement) {
          accountElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams, accounts]);

  // Load accounts on mount
  useEffect(() => {
    loadAccounts();
  }, []);

  // Computed values
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  const accountsChartData = accounts.map(account => ({
    name: account.name,
    value: account.balance,
    color: account.color || getDefaultColorForType(account.type)
  }));

  return {
    // Data
    accounts,
    isLoading,
    highlightedAccountId,
    activityHistory,
    totalBalance,
    accountsChartData,
    
    // Actions
    loadAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    transferBetweenAccounts,
    adjustAccountBalance,
    addActivity,
    removeActivity,
    
    // Utilities
    getDefaultColorForType,
  };
};