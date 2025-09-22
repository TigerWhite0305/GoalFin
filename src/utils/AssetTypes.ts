// src/utils/AssetTypes.ts

// ==================== ENUMS ====================
export enum AssetClass {
  STOCKS = 'STOCKS',
  ETF = 'ETF', 
  BONDS = 'BONDS',
  COMMODITIES = 'COMMODITIES',
  REAL_ESTATE = 'REAL_ESTATE',
  CRYPTO = 'CRYPTO',
  ALTERNATIVE = 'ALTERNATIVE'
}

export enum InvestmentType {
  SINGLE_PURCHASE = 'SINGLE_PURCHASE',
  PAC = 'PAC',
  DIVIDEND_STOCK = 'DIVIDEND_STOCK',
  BOND = 'BOND',
  REIT = 'REIT',
  CRYPTO = 'CRYPTO'
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL', 
  DIVIDEND = 'DIVIDEND',
  PAC_PAYMENT = 'PAC_PAYMENT',
  SPLIT = 'SPLIT',
  FEE = 'FEE'
}

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  CHF = 'CHF'
}

export enum PACFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly', 
  BIANNUAL = 'biannual'
}

export enum Priority {
  HIGH = 'alta',
  MEDIUM = 'media',
  LOW = 'bassa'
}

// ==================== CORE INTERFACES ====================

export interface Investment {
  id: string;
  name: string;
  symbol: string; // ISIN, ticker, etc.
  assetClass: AssetClass;
  type: InvestmentType;
  
  // Market data (from backend/API)
  currentPrice: number;
  previousClose: number;
  dayChange: number;
  dayChangePercent: number;
  currency: Currency;
  lastUpdated: string;
  
  // User portfolio data
  shares: number;
  avgBuyPrice: number;
  totalInvested: number;
  currentValue: number;
  
  // PAC specific
  monthlyAmount?: number;
  nextPayment?: string;
  pacFrequency?: PACFrequency;
  
  // Additional info
  sector?: string;
  country?: string;
  isin?: string;
  description?: string;
  
  // Calculated fields
  totalReturn: number;
  totalReturnPercent: number;
  portfolioWeight: number;
  
  // Performance metrics
  ytdReturn?: number;
  oneYearReturn?: number;
  threeYearReturn?: number;
  volatility?: number;
  beta?: number;
  
  // Status
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  investmentId: string;
  investmentName: string;
  investmentSymbol: string;
  type: TransactionType;
  shares: number;
  price: number;
  amount: number; // shares * price
  fees: number;
  totalAmount: number; // amount + fees
  date: string;
  currency: Currency;
  accountId?: string;
  notes?: string;
  
  // PAC specific
  isPacTransaction?: boolean;
  pacPlanId?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface PACPlan {
  id: string;
  name: string;
  investmentId: string;
  investmentSymbol: string;
  investmentName: string;
  
  // PAC Configuration
  monthlyAmount: number;
  frequency: PACFrequency;
  startDate: string;
  endDate?: string;
  targetAmount?: number;
  dayOfMonth: number; // 1-28
  
  // Status
  isActive: boolean;
  isPaused: boolean;
  
  // Execution tracking
  executedPayments: number;
  totalInvested: number;
  currentValue: number;
  nextPaymentDate: string;
  lastPaymentDate?: string;
  
  // Performance
  totalReturn: number;
  totalReturnPercent: number;
  avgBuyPrice: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  
  // Totals
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  totalReturnPercent: number;
  
  // Daily changes
  dayChange: number;
  dayChangePercent: number;
  
  // Allocation
  assetAllocation: AssetAllocation[];
  sectorAllocation: SectorAllocation[];
  geographicAllocation: GeographicAllocation[];
  
  // Investments
  investments: Investment[];
  pacPlans: PACPlan[];
  
  // Performance metrics
  ytdReturn: number;
  oneYearReturn: number;
  volatility: number;
  sharpeRatio?: number;
  
  // Risk metrics
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number; // 1-10
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastRebalance?: string;
}

// ==================== ALLOCATION INTERFACES ====================

export interface AssetAllocation {
  assetClass: AssetClass;
  value: number;
  percentage: number;
  targetPercentage?: number;
  deviation?: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
  investments: string[]; // investment IDs
}

export interface GeographicAllocation {
  country: string;
  region: string;
  value: number;
  percentage: number;
  investments: string[];
}

// ==================== PERFORMANCE INTERFACES ====================

export interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  
  // Time-based returns
  ytdReturn: number;
  oneMonthReturn: number;
  threeMonthReturn: number;
  sixMonthReturn: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
}

export interface PerformanceHistory {
  date: string;
  value: number;
  invested: number;
  returns: number;
  returnsPercent: number;
}

// ==================== FILTER & SORT INTERFACES ====================

export interface InvestmentFilters {
  assetClasses: AssetClass[];
  investmentTypes: InvestmentType[];
  sectors: string[];
  countries: string[];
  minValue?: number;
  maxValue?: number;
  minReturn?: number;
  maxReturn?: number;
  showPacOnly: boolean;
  showActiveOnly: boolean;
}

export interface SortOption {
  field: keyof Investment;
  direction: 'asc' | 'desc';
  label: string;
}

// ==================== API RESPONSE INTERFACES ====================

export interface MarketDataResponse {
  symbol: string;
  name: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  timestamp: string;
  
  // Extended data
  volume?: number;
  marketCap?: number;
  pe?: number;
  dividend?: number;
  dividendYield?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  relevantSymbols: string[];
}

// ==================== UTILITY TYPES ====================

export type InvestmentUpdate = Partial<Omit<Investment, 'id' | 'createdAt'>>;
export type TransactionCreate = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type PACPlanCreate = Omit<PACPlan, 'id' | 'createdAt' | 'updatedAt' | 'executedPayments' | 'totalInvested' | 'currentValue' | 'totalReturn' | 'totalReturnPercent' | 'avgBuyPrice'>;

// ==================== CONSTANTS ====================

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  [AssetClass.STOCKS]: 'Azioni',
  [AssetClass.ETF]: 'ETF',
  [AssetClass.BONDS]: 'Obbligazioni',
  [AssetClass.COMMODITIES]: 'Materie Prime',
  [AssetClass.REAL_ESTATE]: 'Immobiliare',
  [AssetClass.CRYPTO]: 'Criptovalute',
  [AssetClass.ALTERNATIVE]: 'Alternativi'
};

export const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  [InvestmentType.SINGLE_PURCHASE]: 'Acquisto Singolo',
  [InvestmentType.PAC]: 'Piano di Accumulo',
  [InvestmentType.DIVIDEND_STOCK]: 'Azione Dividendo',
  [InvestmentType.BOND]: 'Obbligazione',
  [InvestmentType.REIT]: 'REIT',
  [InvestmentType.CRYPTO]: 'Criptovaluta'
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.BUY]: 'Acquisto',
  [TransactionType.SELL]: 'Vendita',
  [TransactionType.DIVIDEND]: 'Dividendo',
  [TransactionType.PAC_PAYMENT]: 'Versamento PAC',
  [TransactionType.SPLIT]: 'Split',
  [TransactionType.FEE]: 'Commissione'
};

export const PAC_FREQUENCY_LABELS: Record<PACFrequency, string> = {
  [PACFrequency.MONTHLY]: 'Mensile',
  [PACFrequency.QUARTERLY]: 'Trimestrale',
  [PACFrequency.BIANNUAL]: 'Semestrale'
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.EUR]: '€',
  [Currency.USD]: '$',
  [Currency.GBP]: '£',
  [Currency.CHF]: 'CHF'
};

// Color mapping for categories (seguendo il Design System)
export const ASSET_CLASS_COLORS: Record<AssetClass, string> = {
  [AssetClass.STOCKS]: '#6366F1', // Indigo
  [AssetClass.ETF]: '#10B981', // Emerald 
  [AssetClass.BONDS]: '#F59E0B', // Amber
  [AssetClass.COMMODITIES]: '#EF4444', // Red
  [AssetClass.REAL_ESTATE]: '#8B5CF6', // Violet
  [AssetClass.CRYPTO]: '#F97316', // Orange
  [AssetClass.ALTERNATIVE]: '#06B6D4' // Cyan
};

export const PERFORMANCE_COLORS = {
  positive: '#059669', // Success green
  negative: '#DC2626', // Error red
  neutral: '#6B7280'   // Muted gray
};