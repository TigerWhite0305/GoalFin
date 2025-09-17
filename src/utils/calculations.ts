// src/utils/calculations.ts

import { Transaction } from "../types/transaction.types";

// Somma totale delle transazioni
export const getTotalAmount = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, tx) => {
    return tx.type === "income" ? sum + tx.amount : sum - tx.amount;
  }, 0);
};

// Filtra le transazioni per tipo
export const filterByType = (transactions: Transaction[], type: "income" | "expense") => {
  return transactions.filter(tx => tx.type === type);
};

// Filtra le transazioni per categoria
export const filterByCategory = (transactions: Transaction[], category: string) => {
  return transactions.filter(tx => tx.category === category);
};
