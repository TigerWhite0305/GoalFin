// src/utils/AssetTypes.ts

// ==================== ENUMS ====================

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  CHF = 'CHF'
}

export enum Priority {
  HIGH = 'alta',
  MEDIUM = 'media',
  LOW = 'bassa'
}

// ==================== CONSTANTS ====================

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.EUR]: '€',
  [Currency.USD]: '$',
  [Currency.GBP]: '£',
  [Currency.CHF]: 'CHF'
};

export const PERFORMANCE_COLORS = {
  positive: '#059669', // Success green
  negative: '#DC2626', // Error red
  neutral: '#6B7280'   // Muted gray
};