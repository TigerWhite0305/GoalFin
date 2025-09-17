// src/types/transaction.types.ts

export type Transaction = {
  id: number;
  name: string;
  category: string;
  description?: string;
  date: string; // ISO string
  amount: number;
  type: "income" | "expense";
  color?: string;
};
