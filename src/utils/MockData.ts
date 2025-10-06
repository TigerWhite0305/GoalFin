// src/utils/MockData.ts

/**
 * Mock Data per Finanza Personale
 * Contiene dati di esempio per conti, transazioni, obiettivi e budget
 */

// Nota: Questo file può essere utilizzato per dati mock temporanei
// Una volta implementato il backend, questi dati verranno sostituiti con chiamate API reali

// ==================== MOCK ACCOUNTS ====================

export interface Account {
  id: string;
  name: string;
  bank: string;
  balance: number;
  type: 'checking' | 'savings' | 'card';
  currency: string;
  lastUpdate: string;
}

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Conto Corrente',
    bank: 'UniCredit',
    balance: 3250.50,
    type: 'checking',
    currency: 'EUR',
    lastUpdate: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Conto Risparmio',
    bank: 'Intesa Sanpaolo',
    balance: 8500.00,
    type: 'savings',
    currency: 'EUR',
    lastUpdate: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Carta Revolut',
    bank: 'Revolut',
    balance: 450.75,
    type: 'card',
    currency: 'EUR',
    lastUpdate: new Date().toISOString()
  }
];

// ==================== MOCK TRANSACTIONS ====================

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  accountId: string;
  notes?: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Stipendio Settembre',
    amount: 2500.00,
    category: 'Lavoro',
    type: 'income',
    date: '2025-09-01',
    accountId: '1',
    notes: 'Stipendio mensile'
  },
  {
    id: '2',
    description: 'Affitto',
    amount: 850.00,
    category: 'Casa',
    type: 'expense',
    date: '2025-09-05',
    accountId: '1'
  },
  {
    id: '3',
    description: 'Spesa Supermercato',
    amount: 125.50,
    category: 'Cibo',
    type: 'expense',
    date: '2025-09-10',
    accountId: '1'
  },
  {
    id: '4',
    description: 'Netflix',
    amount: 15.99,
    category: 'Intrattenimento',
    type: 'expense',
    date: '2025-09-15',
    accountId: '3'
  },
  {
    id: '5',
    description: 'Freelance Web Design',
    amount: 800.00,
    category: 'Lavoro Extra',
    type: 'income',
    date: '2025-09-20',
    accountId: '1'
  }
];

// ==================== MOCK GOALS ====================

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Vacanza Giappone',
    target: 4500.00,
    current: 3200.00,
    deadline: '2026-06-01',
    category: 'Viaggi',
    priority: 'high'
  },
  {
    id: '2',
    name: 'MacBook Pro M4',
    target: 2500.00,
    current: 1650.00,
    deadline: '2025-12-31',
    category: 'Tecnologia',
    priority: 'medium'
  },
  {
    id: '3',
    name: 'Fondo Emergenza',
    target: 10000.00,
    current: 5500.00,
    category: 'Risparmio',
    priority: 'high'
  }
];

// ==================== MOCK CATEGORIES ====================

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

export const mockCategories: Category[] = [
  // Income categories
  { id: '1', name: 'Lavoro', type: 'income', icon: '💼', color: '#10B981' },
  { id: '2', name: 'Lavoro Extra', type: 'income', icon: '💰', color: '#059669' },
  { id: '3', name: 'Investimenti', type: 'income', icon: '📈', color: '#3B82F6' },
  
  // Expense categories
  { id: '4', name: 'Casa', type: 'expense', icon: '🏠', color: '#EF4444' },
  { id: '5', name: 'Cibo', type: 'expense', icon: '🍕', color: '#F59E0B' },
  { id: '6', name: 'Trasporti', type: 'expense', icon: '🚗', color: '#8B5CF6' },
  { id: '7', name: 'Intrattenimento', type: 'expense', icon: '🎮', color: '#EC4899' },
  { id: '8', name: 'Shopping', type: 'expense', icon: '🛍️', color: '#F97316' },
  { id: '9', name: 'Salute', type: 'expense', icon: '⚕️', color: '#06B6D4' },
  { id: '10', name: 'Altro', type: 'expense', icon: '📌', color: '#6B7280' }
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Calcola il totale delle entrate
 */
export const getTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calcola il totale delle uscite
 */
export const getTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calcola il bilancio netto
 */
export const getNetBalance = (transactions: Transaction[]): number => {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
};

/**
 * Calcola il totale di tutti i conti
 */
export const getTotalBalance = (accounts: Account[]): number => {
  return accounts.reduce((sum, account) => sum + account.balance, 0);
};

/**
 * Ottiene transazioni per categoria
 */
export const getTransactionsByCategory = (
  transactions: Transaction[],
  category: string
): Transaction[] => {
  return transactions.filter(t => t.category === category);
};

/**
 * Filtra transazioni per periodo
 */
export const getTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: string,
  endDate: string
): Transaction[] => {
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });
};

// Export default con tutti i dati mock
export default {
  accounts: mockAccounts,
  transactions: mockTransactions,
  goals: mockGoals,
  categories: mockCategories,
  // Utility functions
  getTotalIncome,
  getTotalExpenses,
  getNetBalance,
  getTotalBalance,
  getTransactionsByCategory,
  getTransactionsByDateRange
};