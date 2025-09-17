// src/utils/constants.ts

// Colori di default per categorie o tipologie
export const CATEGORY_COLORS: Record<string, string> = {
  Casa: "#4C6FFF",
  Lavoro: "#16A34A",
  Cibo: "#F59E0B",
  Trasporti: "#F97316",
  Intrattenimento: "#8B5CF6",
  Salute: "#EF4444",
  Shopping: "#10B981",
  Viaggio: "#F43F5E",
};

// Tipologie di transazioni
export const TRANSACTION_TYPES = ["income", "expense"] as const;

// Valori dummy per paginazione o limiti
export const DEFAULT_PAGE_SIZE = 10;
