// src/types/common.types.ts

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: number;
  name: string;
  category: string;
  description: string;
  date: string; // ISO string
  amount: number;
  type: TransactionType;
  color?: string;
};

// Per eventuali notifiche
export type Notification = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  duration?: number; // in ms
};

// Eventuali filtri sulle transazioni
export type TransactionFilter = {
  category?: string;
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
};
