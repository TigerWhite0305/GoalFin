// src/context/TransactionsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipo Transaction base
export type Transaction = {
  id: number;
  name: string;
  category: string;
  description: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  color?: string;
};

// Context Type
type TransactionsContextType = {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: number) => void;
};

// Context
const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// Provider Props
type TransactionsProviderProps = {
  children: ReactNode;
};

// Provider
export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [...prev, tx]);
  };

  const updateTransaction = (tx: Transaction) => {
    setTransactions(prev => prev.map(t => (t.id === tx.id ? tx : t)));
  };

  const deleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

// Hook per usare il contesto
export const useTransactions = (): TransactionsContextType => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions deve essere usato all'interno di un TransactionsProvider");
  }
  return context;
};
