// src/contexts/FinanceContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Transaction {
  id: string;
  name: string;
  category: string;
  description: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  color?: string;
  isRecurring?: boolean;
  recurringInfo?: {
    frequency: number;
    duration: string;
  };
}

export interface Account {
  id: string;
  name: string;
  type: string;
  bank: string;
  balance: number;
  currency: string;
  color: string;
  lastTransaction: string;
}

export interface Investment {
  id: string;
  name: string;
  type: "PAC_ETF" | "ETF_SINGOLO" | "AZIONE";
  monthlyAmount?: number;
  startDate?: string;
  totalMonths?: number;
  totalInvested: number;
  currentValue: number;
  shares?: number;
  avgBuyPrice?: number;
  currentPrice?: number;
  ytdReturn?: number;
  totalReturn: number;
  isin?: string;
  sector?: string;
  ticker?: string;
}

export interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  deadline?: string;
  priority: "alta" | "media" | "bassa";
  category: "viaggio" | "tecnologia" | "emergenze" | "casa" | "auto" | "altro";
  monthlyContribution?: number;
  description?: string;
  isCompleted?: boolean;
}

interface FinanceState {
  transactions: Transaction[];
  accounts: Account[];
  investments: Investment[];
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
}

type FinanceAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: Investment }
  | { type: 'DELETE_INVESTMENT'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'LOAD_DATA'; payload: Partial<FinanceState> };

const initialState: FinanceState = {
  transactions: [],
  accounts: [],
  investments: [],
  goals: [],
  isLoading: false,
  error: null,
};

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [action.payload, ...state.transactions] 
      };
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };
    
    case 'ADD_ACCOUNT':
      return { 
        ...state, 
        accounts: [...state.accounts, action.payload] 
      };
    
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(a => 
          a.id === action.payload.id ? action.payload : a
        )
      };
    
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(a => a.id !== action.payload)
      };
    
    case 'ADD_INVESTMENT':
      return { 
        ...state, 
        investments: [...state.investments, action.payload] 
      };
    
    case 'UPDATE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.map(i => 
          i.id === action.payload.id ? action.payload : i
        )
      };
    
    case 'DELETE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.filter(i => i.id !== action.payload)
      };
    
    case 'ADD_GOAL':
      return { 
        ...state, 
        goals: [...state.goals, action.payload] 
      };
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => 
          g.id === action.payload.id ? action.payload : g
        )
      };
    
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload)
      };
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

interface FinanceContextType {
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  
  // Helper functions
  addTransaction: (transaction: Omit<Transaction, 'id'> | Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  updateInvestment: (investment: Investment) => void;
  deleteInvestment: (id: string) => void;
  
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  
  // Computed values
  getTotalBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getInvestmentValue: () => number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Helper functions
  const addTransaction = (transaction: Omit<Transaction, 'id'> | Transaction) => {
    let newTransaction: Transaction;
    
    if ('id' in transaction && transaction.id) {
      // Se ha già un ID valido, usalo
      newTransaction = transaction as Transaction;
    } else {
      // Genera nuovo ID
      newTransaction = {
        ...transaction,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
    }
    
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
  };

  const updateAccount = (account: Account) => {
    dispatch({ type: 'UPDATE_ACCOUNT', payload: account });
  };

  const deleteAccount = (id: string) => {
    dispatch({ type: 'DELETE_ACCOUNT', payload: id });
  };

  const addInvestment = (investment: Omit<Investment, 'id'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    dispatch({ type: 'ADD_INVESTMENT', payload: newInvestment });
  };

  const updateInvestment = (investment: Investment) => {
    dispatch({ type: 'UPDATE_INVESTMENT', payload: investment });
  };

  const deleteInvestment = (id: string) => {
    dispatch({ type: 'DELETE_INVESTMENT', payload: id });
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
  };

  const updateGoal = (goal: Goal) => {
    dispatch({ type: 'UPDATE_GOAL', payload: goal });
  };

  const deleteGoal = (id: string) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
  };

  // Computed values
  const getTotalBalance = () => {
    return state.accounts.reduce((total, account) => total + account.balance, 0);
  };

  const getTotalIncome = () => {
    return state.transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return state.transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getInvestmentValue = () => {
    return state.investments.reduce((total, inv) => total + inv.currentValue, 0);
  };

  const value: FinanceContextType = {
    state,
    dispatch,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addGoal,
    updateGoal,
    deleteGoal,
    getTotalBalance,
    getTotalIncome,
    getTotalExpenses,
    getInvestmentValue,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}