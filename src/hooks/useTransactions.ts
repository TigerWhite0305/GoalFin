// src/hooks/useTransactions.ts
import { useState } from "react";
import { Transaction } from "../components/dashboard/TransactionsList";

export function useTransactions(initial: Transaction[] = []) {
  const [transactions, setTransactions] = useState<Transaction[]>(initial);

  const addTransaction = (tx: Transaction) => {
    const newId = Math.max(0, ...transactions.map(t => t.id)) + 1;
    setTransactions([{ ...tx, id: newId }, ...transactions]);
  };

  const updateTransaction = (tx: Transaction) => {
    setTransactions(prev => prev.map(t => (t.id === tx.id ? tx : t)));
  };

  const deleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return { transactions, addTransaction, updateTransaction, deleteTransaction, setTransactions };
}
