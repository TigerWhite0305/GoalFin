// src/utils/MockData.ts

import { 
  Investment, 
  Transaction, 
  PACPlan, 
  Portfolio, 
  PerformanceHistory,
  AssetClass, 
  InvestmentType, 
  TransactionType, 
  Currency,
  PACFrequency
} from './AssetTypes';

// ==================== MOCK INVESTMENTS ====================

export const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'Vanguard FTSE All-World UCITS ETF',
    symbol: 'VWCE.DE',
    assetClass: AssetClass.ETF,
    type: InvestmentType.PAC,
    currentPrice: 108.45,
    previousClose: 107.89,
    dayChange: 0.56,
    dayChangePercent: 0.52,
    currency: Currency.EUR,
    lastUpdated: '2025-09-22T15:30:00Z',
    shares: 92.456,
    avgBuyPrice: 98.23,
    totalInvested: 9085.50,
    currentValue: 10028.91,
    monthlyAmount: 300,
    nextPayment: '2025-10-01',
    pacFrequency: PACFrequency.MONTHLY,
    sector: 'Diversificato',
    country: 'Globale',
    isin: 'IE00BK5BQT80',
    description: 'ETF azionario mondiale diversificato',
    totalReturn: 943.41,
    totalReturnPercent: 10.38,
    portfolioWeight: 45.2,
    ytdReturn: 8.75,
    oneYearReturn: 12.34,
    threeYearReturn: 7.89,
    volatility: 16.2,
    beta: 1.02,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-09-22T15:30:00Z'
  },
  {
    id: '2',
    name: 'iShares Core MSCI World UCITS ETF',
    symbol: 'SWDA.MI',
    assetClass: AssetClass.ETF,
    type: InvestmentType.SINGLE_PURCHASE,
    currentPrice: 89.12,
    previousClose: 88.76,
    dayChange: 0.36,
    dayChangePercent: 0.41,
    currency: Currency.EUR,
    lastUpdated: '2025-09-22T15:30:00Z',
    shares: 56.0,
    avgBuyPrice: 82.45,
    totalInvested: 4617.20,
    currentValue: 4990.72,
    sector: 'Diversificato',
    country: 'Globale',
    isin: 'IE00B4L5Y983',
    description: 'ETF azionario mercati sviluppati',
    totalReturn: 373.52,
    totalReturnPercent: 8.09,
    portfolioWeight: 22.5,
    ytdReturn: 6.82,
    oneYearReturn: 11.23,
    threeYearReturn: 6.45,
    volatility: 15.8,
    beta: 0.98,
    isActive: true,
    createdAt: '2024-03-10T14:30:00Z',
    updatedAt: '2025-09-22T15:30:00Z'
  },
  {
    id: '3',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    assetClass: AssetClass.STOCKS,
    type: InvestmentType.DIVIDEND_STOCK,
    currentPrice: 195.67,
    previousClose: 193.45,
    dayChange: 2.22,
    dayChangePercent: 1.15,
    currency: Currency.USD,
    lastUpdated: '2025-09-22T21:00:00Z',
    shares: 15.0,
    avgBuyPrice: 178.23,
    totalInvested: 2673.45,
    currentValue: 2935.05,
    sector: 'Technology',
    country: 'USA',
    isin: 'US0378331005',
    description: 'Produttore di dispositivi elettronici di consumo',
    totalReturn: 261.60,
    totalReturnPercent: 9.78,
    portfolioWeight: 13.2,
    ytdReturn: 15.67,
    oneYearReturn: 22.45,
    threeYearReturn: 8.23,
    volatility: 28.5,
    beta: 1.24,
    isActive: true,
    createdAt: '2024-06-15T16:20:00Z',
    updatedAt: '2025-09-22T21:00:00Z'
  },
  {
    id: '4',
    name: 'Vanguard EUR Corporate Bond UCITS ETF',
    symbol: 'VECP.DE',
    assetClass: AssetClass.BONDS,
    type: InvestmentType.SINGLE_PURCHASE,
    currentPrice: 52.34,
    previousClose: 52.28,
    dayChange: 0.06,
    dayChangePercent: 0.11,
    currency: Currency.EUR,
    lastUpdated: '2025-09-22T15:30:00Z',
    shares: 80.0,
    avgBuyPrice: 51.20,
    totalInvested: 4096.00,
    currentValue: 4187.20,
    sector: 'Obbligazionario',
    country: 'Europa',
    isin: 'IE00BZ163L38',
    description: 'ETF obbligazionario corporate europeo',
    totalReturn: 91.20,
    totalReturnPercent: 2.23,
    portfolioWeight: 18.9,
    ytdReturn: 1.85,
    oneYearReturn: 3.12,
    threeYearReturn: 1.89,
    volatility: 4.2,
    beta: 0.15,
    isActive: true,
    createdAt: '2024-02-20T11:45:00Z',
    updatedAt: '2025-09-22T15:30:00Z'
  },
  {
    id: '5',
    name: 'Bitcoin',
    symbol: 'BTC-EUR',
    assetClass: AssetClass.CRYPTO,
    type: InvestmentType.SINGLE_PURCHASE,
    currentPrice: 58750.25,
    previousClose: 57234.10,
    dayChange: 1516.15,
    dayChangePercent: 2.65,
    currency: Currency.EUR,
    lastUpdated: '2025-09-22T23:59:00Z',
    shares: 0.025,
    avgBuyPrice: 45230.50,
    totalInvested: 1130.76,
    currentValue: 1468.76,
    sector: 'Cryptocurrency',
    country: 'Globale',
    description: 'Criptovaluta decentralizzata',
    totalReturn: 338.00,
    totalReturnPercent: 29.88,
    portfolioWeight: 6.6,
    ytdReturn: 45.67,
    oneYearReturn: 89.23,
    volatility: 65.8,
    isActive: false, // Venduto parzialmente
    createdAt: '2024-08-05T09:15:00Z',
    updatedAt: '2025-09-22T23:59:00Z'
  }
];

// ==================== MOCK TRANSACTIONS ====================

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    investmentId: '1',
    investmentName: 'Vanguard FTSE All-World UCITS ETF',
    investmentSymbol: 'VWCE.DE',
    type: TransactionType.PAC_PAYMENT,
    shares: 3.056,
    price: 98.23,
    amount: 300.00,
    fees: 0.00,
    totalAmount: 300.00,
    date: '2025-09-01',
    currency: Currency.EUR,
    isPacTransaction: true,
    pacPlanId: 'pac-1',
    createdAt: '2025-09-01T08:00:00Z',
    updatedAt: '2025-09-01T08:00:00Z'
  },
  {
    id: '2',
    investmentId: '1',
    investmentName: 'Vanguard FTSE All-World UCITS ETF',
    investmentSymbol: 'VWCE.DE',
    type: TransactionType.PAC_PAYMENT,
    shares: 3.125,
    price: 96.00,
    amount: 300.00,
    fees: 0.00,
    totalAmount: 300.00,
    date: '2025-08-01',
    currency: Currency.EUR,
    isPacTransaction: true,
    pacPlanId: 'pac-1',
    createdAt: '2025-08-01T08:00:00Z',
    updatedAt: '2025-08-01T08:00:00Z'
  },
  {
    id: '3',
    investmentId: '2',
    investmentName: 'iShares Core MSCI World UCITS ETF',
    investmentSymbol: 'SWDA.MI',
    type: TransactionType.BUY,
    shares: 56.0,
    price: 82.45,
    amount: 4617.20,
    fees: 2.95,
    totalAmount: 4620.15,
    date: '2024-03-10',
    currency: Currency.EUR,
    notes: 'Acquisto iniziale ETF World',
    createdAt: '2024-03-10T14:30:00Z',
    updatedAt: '2024-03-10T14:30:00Z'
  },
  {
    id: '4',
    investmentId: '3',
    investmentName: 'Apple Inc.',
    investmentSymbol: 'AAPL',
    type: TransactionType.BUY,
    shares: 15.0,
    price: 178.23,
    amount: 2673.45,
    fees: 9.95,
    totalAmount: 2683.40,
    date: '2024-06-15',
    currency: Currency.USD,
    notes: 'Investimento in big tech',
    createdAt: '2024-06-15T16:20:00Z',
    updatedAt: '2024-06-15T16:20:00Z'
  },
  {
    id: '5',
    investmentId: '3',
    investmentName: 'Apple Inc.',
    investmentSymbol: 'AAPL',
    type: TransactionType.DIVIDEND,
    shares: 15.0,
    price: 0.24,
    amount: 3.60,
    fees: 0.00,
    totalAmount: 3.60,
    date: '2025-08-15',
    currency: Currency.USD,
    notes: 'Dividendo trimestrale Q3 2025',
    createdAt: '2025-08-15T12:00:00Z',
    updatedAt: '2025-08-15T12:00:00Z'
  },
  {
    id: '6',
    investmentId: '4',
    investmentName: 'Vanguard EUR Corporate Bond UCITS ETF',
    investmentSymbol: 'VECP.DE',
    type: TransactionType.BUY,
    shares: 80.0,
    price: 51.20,
    amount: 4096.00,
    fees: 1.95,
    totalAmount: 4097.95,
    date: '2024-02-20',
    currency: Currency.EUR,
    notes: 'Diversificazione obbligazionaria',
    createdAt: '2024-02-20T11:45:00Z',
    updatedAt: '2024-02-20T11:45:00Z'
  },
  {
    id: '7',
    investmentId: '5',
    investmentName: 'Bitcoin',
    investmentSymbol: 'BTC-EUR',
    type: TransactionType.BUY,
    shares: 0.05,
    price: 45230.50,
    amount: 2261.53,
    fees: 15.67,
    totalAmount: 2277.20,
    date: '2024-08-05',
    currency: Currency.EUR,
    notes: 'Esperimento crypto',
    createdAt: '2024-08-05T09:15:00Z',
    updatedAt: '2024-08-05T09:15:00Z'
  },
  {
    id: '8',
    investmentId: '5',
    investmentName: 'Bitcoin',
    investmentSymbol: 'BTC-EUR',
    type: TransactionType.SELL,
    shares: 0.025,
    price: 52340.80,
    amount: 1308.52,
    fees: 9.12,
    totalAmount: 1299.40,
    date: '2025-07-20',
    currency: Currency.EUR,
    notes: 'Realizzo parziale profitti',
    createdAt: '2025-07-20T14:30:00Z',
    updatedAt: '2025-07-20T14:30:00Z'
  }
];

// ==================== MOCK PAC PLANS ====================

export const mockPACPlans: PACPlan[] = [
  {
    id: 'pac-1',
    name: 'PAC ETF World Mensile',
    investmentId: '1',
    investmentSymbol: 'VWCE.DE',
    investmentName: 'Vanguard FTSE All-World UCITS ETF',
    monthlyAmount: 300,
    frequency: PACFrequency.MONTHLY,
    startDate: '2024-01-01',
    targetAmount: 15000,
    dayOfMonth: 1,
    isActive: true,
    isPaused: false,
    executedPayments: 21,
    totalInvested: 6300,
    currentValue: 7125.45,
    nextPaymentDate: '2025-10-01',
    lastPaymentDate: '2025-09-01',
    totalReturn: 825.45,
    totalReturnPercent: 13.11,
    avgBuyPrice: 97.85,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-09-22T15:30:00Z'
  },
  {
    id: 'pac-2',
    name: 'PAC Obbligazioni Trimestrale',
    investmentId: '4',
    investmentSymbol: 'VECP.DE',
    investmentName: 'Vanguard EUR Corporate Bond UCITS ETF',
    monthlyAmount: 500,
    frequency: PACFrequency.QUARTERLY,
    startDate: '2024-06-01',
    endDate: '2027-06-01',
    dayOfMonth: 15,
    isActive: true,
    isPaused: false,
    executedPayments: 5,
    totalInvested: 2500,
    currentValue: 2567.80,
    nextPaymentDate: '2025-12-15',
    lastPaymentDate: '2025-09-15',
    totalReturn: 67.80,
    totalReturnPercent: 2.71,
    avgBuyPrice: 51.15,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2025-09-22T15:30:00Z'
  },
  {
    id: 'pac-3',
    name: 'PAC Tech Stocks',
    investmentId: '3',
    investmentSymbol: 'AAPL',
    investmentName: 'Apple Inc.',
    monthlyAmount: 200,
    frequency: PACFrequency.MONTHLY,
    startDate: '2025-01-01',
    targetAmount: 5000,
    dayOfMonth: 5,
    isActive: false,
    isPaused: true,
    executedPayments: 8,
    totalInvested: 1600,
    currentValue: 1845.20,
    nextPaymentDate: '2025-10-05',
    lastPaymentDate: '2025-08-05',
    totalReturn: 245.20,
    totalReturnPercent: 15.33,
    avgBuyPrice: 185.67,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-08-30T10:00:00Z'
  }
];

// ==================== MOCK PERFORMANCE HISTORY ====================

export const mockPerformanceHistory: PerformanceHistory[] = [
  { date: '2024-01-01', value: 10000, invested: 10000, returns: 0, returnsPercent: 0 },
  { date: '2024-01-31', value: 10150, invested: 10300, returns: -150, returnsPercent: -1.46 },
  { date: '2024-02-29', value: 10520, invested: 10600, returns: -80, returnsPercent: -0.75 },
  { date: '2024-03-31', value: 11200, invested: 11200, returns: 0, returnsPercent: 0 },
  { date: '2024-04-30', value: 11450, invested: 11500, returns: -50, returnsPercent: -0.43 },
  { date: '2024-05-31', value: 11890, invested: 11800, returns: 90, returnsPercent: 0.76 },
  { date: '2024-06-30', value: 12670, invested: 12400, returns: 270, returnsPercent: 2.18 },
  { date: '2024-07-31', value: 13120, invested: 12700, returns: 420, returnsPercent: 3.31 },
  { date: '2024-08-31', value: 13890, invested: 13300, returns: 590, returnsPercent: 4.44 },
  { date: '2024-09-30', value: 14230, invested: 13600, returns: 630, returnsPercent: 4.63 },
  { date: '2024-10-31', value: 15120, invested: 14200, returns: 920, returnsPercent: 6.48 },
  { date: '2024-11-30', value: 15890, invested: 14500, returns: 1390, returnsPercent: 9.59 },
  { date: '2024-12-31', value: 16450, invested: 15100, returns: 1350, returnsPercent: 8.94 },
  { date: '2025-01-31', value: 17200, invested: 15700, returns: 1500, returnsPercent: 9.55 },
  { date: '2025-02-28', value: 17890, invested: 16000, returns: 1890, returnsPercent: 11.81 },
  { date: '2025-03-31', value: 18560, invested: 16600, returns: 1960, returnsPercent: 11.81 },
  { date: '2025-04-30', value: 19200, invested: 16900, returns: 2300, returnsPercent: 13.61 },
  { date: '2025-05-31', value: 19850, invested: 17500, returns: 2350, returnsPercent: 13.43 },
  { date: '2025-06-30', value: 20670, invested: 18200, returns: 2470, returnsPercent: 13.57 },
  { date: '2025-07-31', value: 21230, invested: 18800, returns: 2430, returnsPercent: 12.93 },
  { date: '2025-08-31', value: 21890, invested: 19100, returns: 2790, returnsPercent: 14.61 },
  { date: '2025-09-22', value: 22180, invested: 19500, returns: 2680, returnsPercent: 13.74 }
];

// ==================== MOCK PORTFOLIO ====================

export const mockPortfolio: Portfolio = {
  id: 'portfolio-1',
  userId: 'user-1',
  name: 'Portfolio Principale',
  description: 'Portafoglio diversificato per obiettivi a lungo termine',
  totalValue: 22180.64,
  totalInvested: 19500.36,
  totalReturn: 2680.28,
  totalReturnPercent: 13.74,
  dayChange: 145.67,
  dayChangePercent: 0.66,
  assetAllocation: [
    { assetClass: AssetClass.ETF, value: 15019.63, percentage: 67.7 },
    { assetClass: AssetClass.STOCKS, value: 2935.05, percentage: 13.2 },
    { assetClass: AssetClass.BONDS, value: 4187.20, percentage: 18.9 },
    { assetClass: AssetClass.CRYPTO, value: 38.76, percentage: 0.2 }
  ],
  sectorAllocation: [
    { sector: 'Diversificato', value: 15019.63, percentage: 67.7, investments: ['1', '2'] },
    { sector: 'Technology', value: 2935.05, percentage: 13.2, investments: ['3'] },
    { sector: 'Obbligazionario', value: 4187.20, percentage: 18.9, investments: ['4'] },
    { sector: 'Cryptocurrency', value: 38.76, percentage: 0.2, investments: ['5'] }
  ],
  geographicAllocation: [
    { country: 'Globale', region: 'Mondo', value: 15488.39, percentage: 69.8, investments: ['1', '2', '5'] },
    { country: 'USA', region: 'Nord America', value: 2935.05, percentage: 13.2, investments: ['3'] },
    { country: 'Europa', region: 'Europa', value: 4187.20, percentage: 18.9, investments: ['4'] }
  ],
  investments: mockInvestments,
  pacPlans: mockPACPlans,
  ytdReturn: 11.25,
  oneYearReturn: 13.74,
  volatility: 18.5,
  sharpeRatio: 0.74,
  riskLevel: 'MEDIUM',
  riskScore: 5.2,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2025-09-22T15:30:00Z',
  lastRebalance: '2025-06-01T10:00:00Z'
};

// ==================== MOCK NEWS ====================

export const mockNews = [
  {
    id: '1',
    title: 'Fed mantiene tassi invariati, mercati reagiscono positivamente',
    summary: 'La Federal Reserve ha mantenuto i tassi di interesse al 5.25-5.50%, in linea con le aspettative degli analisti.',
    url: 'https://example.com/news/1',
    source: 'Reuters',
    publishedAt: '2025-09-22T14:30:00Z',
    sentiment: 'positive' as const,
    relevantSymbols: ['VWCE.DE', 'SWDA.MI', 'AAPL']
  },
  {
    id: '2',
    title: 'Apple presenta nuova gamma iPhone, titolo in rialzo',
    summary: 'Apple ha presentato la nuova gamma iPhone 16 con caratteristiche AI avanzate, spingendo il titolo oltre i $195.',
    url: 'https://example.com/news/2',
    source: 'Bloomberg',
    publishedAt: '2025-09-22T11:15:00Z',
    sentiment: 'positive' as const,
    relevantSymbols: ['AAPL']
  },
  {
    id: '3',
    title: 'ETF europei registrano afflussi record nel Q3 2025',
    summary: 'Gli ETF azionari europei hanno attirato oltre 15 miliardi di euro nel terzo trimestre.',
    url: 'https://example.com/news/3',
    source: 'Financial Times',
    publishedAt: '2025-09-21T16:45:00Z',
    sentiment: 'positive' as const,
    relevantSymbols: ['VWCE.DE', 'SWDA.MI']
  }
];

// ==================== MOCK MARKET DATA ====================

export const mockMarketData = {
  'VWCE.DE': {
    symbol: 'VWCE.DE',
    name: 'Vanguard FTSE All-World UCITS ETF',
    price: 108.45,
    previousClose: 107.89,
    change: 0.56,
    changePercent: 0.52,
    currency: 'EUR',
    timestamp: '2025-09-22T15:30:00Z',
    volume: 245000,
    marketCap: 8500000000,
    dividendYield: 1.8
  },
  'SWDA.MI': {
    symbol: 'SWDA.MI',
    name: 'iShares Core MSCI World UCITS ETF',
    price: 89.12,
    previousClose: 88.76,
    change: 0.36,
    changePercent: 0.41,
    currency: 'EUR',
    timestamp: '2025-09-22T15:30:00Z',
    volume: 180000,
    marketCap: 45000000000,
    dividendYield: 1.9
  },
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 195.67,
    previousClose: 193.45,
    change: 2.22,
    changePercent: 1.15,
    currency: 'USD',
    timestamp: '2025-09-22T21:00:00Z',
    volume: 45678900,
    marketCap: 3100000000000,
    pe: 28.5,
    dividend: 0.96,
    dividendYield: 0.49
  },
  'VECP.DE': {
    symbol: 'VECP.DE',
    name: 'Vanguard EUR Corporate Bond UCITS ETF',
    price: 52.34,
    previousClose: 52.28,
    change: 0.06,
    changePercent: 0.11,
    currency: 'EUR',
    timestamp: '2025-09-22T15:30:00Z',
    volume: 12000,
    marketCap: 2100000000,
    dividendYield: 3.2
  },
  'BTC-EUR': {
    symbol: 'BTC-EUR',
    name: 'Bitcoin',
    price: 58750.25,
    previousClose: 57234.10,
    change: 1516.15,
    changePercent: 2.65,
    currency: 'EUR',
    timestamp: '2025-09-22T23:59:00Z',
    volume: 1250000000
  }
};

// ==================== MOCK SECTORS DATA ====================

export const mockSectors = [
  { name: 'Technology', weight: 25.2, change: 1.45, color: '#6366F1' },
  { name: 'Healthcare', weight: 18.7, change: 0.89, color: '#10B981' },
  { name: 'Financial Services', weight: 15.3, change: -0.12, color: '#F59E0B' },
  { name: 'Consumer Cyclical', weight: 12.8, change: 2.34, color: '#EF4444' },
  { name: 'Industrials', weight: 10.5, change: 0.67, color: '#8B5CF6' },
  { name: 'Energy', weight: 8.9, change: -1.23, color: '#F97316' },
  { name: 'Materials', weight: 5.2, change: 0.45, color: '#06B6D4' },
  { name: 'Real Estate', weight: 3.4, change: -0.78, color: '#84CC16' }
];

// ==================== POPULAR ETFs FOR SEARCH ====================

export const popularETFs = [
  {
    symbol: 'VWCE.DE',
    name: 'Vanguard FTSE All-World UCITS ETF',
    type: 'Azionario Mondiale',
    ter: '0.22%',
    aum: '8.5B EUR',
    description: 'ETF diversificato sui mercati azionari mondiali'
  },
  {
    symbol: 'SWDA.MI',
    name: 'iShares Core MSCI World UCITS ETF',
    type: 'Azionario Mondiale',
    ter: '0.20%',
    aum: '45B EUR',
    description: 'ETF sui mercati sviluppati mondiali'
  },
  {
    symbol: 'EUNL.DE',
    name: 'iShares Core MSCI World UCITS ETF EUR',
    type: 'Azionario Mondiale',
    ter: '0.20%',
    aum: '12B EUR',
    description: 'Versione EUR hedged del MSCI World'
  },
  {
    symbol: 'VAGF.DE',
    name: 'Vanguard Global Aggregate Bond UCITS ETF',
    type: 'Obbligazionario',
    ter: '0.10%',
    aum: '2.1B EUR',
    description: 'ETF obbligazionario globale diversificato'
  },
  {
    symbol: 'VTWO.MI',
    name: 'Vanguard FTSE Developed Europe UCITS ETF',
    type: 'Azionario Europeo',
    ter: '0.10%',
    aum: '5.8B EUR',
    description: 'ETF sui mercati sviluppati europei'
  },
  {
    symbol: 'VGEA.DE',
    name: 'Vanguard FTSE Emerging Markets UCITS ETF',
    type: 'Azionario Emergenti',
    ter: '0.22%',
    aum: '4.2B EUR',
    description: 'ETF sui mercati emergenti globali'
  }
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Genera dati mock per test e sviluppo
 */
export const generateMockData = () => ({
  investments: mockInvestments,
  transactions: mockTransactions,
  pacPlans: mockPACPlans,
  portfolio: mockPortfolio,
  performanceHistory: mockPerformanceHistory,
  news: mockNews,
  marketData: mockMarketData,
  sectors: mockSectors,
  popularETFs
});

/**
 * Simula aggiornamenti real-time dei prezzi
 */
export const simulateRealTimeUpdates = (investments: Investment[]): Investment[] => {
  return investments.map(inv => {
    // Simula variazioni casuali nei prezzi (-2% / +2%)
    const randomChange = (Math.random() - 0.5) * 0.04;
    const newPrice = inv.currentPrice * (1 + randomChange);
    const dayChange = newPrice - inv.previousClose;
    const dayChangePercent = (dayChange / inv.previousClose) * 100;
    
    return {
      ...inv,
      currentPrice: Number(newPrice.toFixed(2)),
      dayChange: Number(dayChange.toFixed(2)),
      dayChangePercent: Number(dayChangePercent.toFixed(2)),
      currentValue: Number((inv.shares * newPrice).toFixed(2)),
      lastUpdated: new Date().toISOString()
    };
  });
};

/**
 * Genera nuovi punti di performance history
 */
export const generateNewPerformancePoint = (
  lastPoint: PerformanceHistory,
  newInvestment: number = 0
): PerformanceHistory => {
  const today = new Date();
  const randomGrowth = (Math.random() - 0.4) * 0.02; // Bias positivo
  const newValue = lastPoint.value * (1 + randomGrowth);
  const newInvested = lastPoint.invested + newInvestment;
  const returns = newValue - newInvested;
  const returnsPercent = newInvested > 0 ? (returns / newInvested) * 100 : 0;
  
  return {
    date: today.toISOString().split('T')[0],
    value: Number(newValue.toFixed(2)),
    invested: Number(newInvested.toFixed(2)),
    returns: Number(returns.toFixed(2)),
    returnsPercent: Number(returnsPercent.toFixed(2))
  };
};

/**
 * Filtra investimenti per criteri specifici
 */
export const filterInvestments = (
  investments: Investment[],
  filters: {
    assetClass?: AssetClass;
    minValue?: number;
    maxValue?: number;
    search?: string;
    activeOnly?: boolean;
  }
): Investment[] => {
  return investments.filter(inv => {
    if (filters.assetClass && inv.assetClass !== filters.assetClass) return false;
    if (filters.minValue && inv.currentValue < filters.minValue) return false;
    if (filters.maxValue && inv.currentValue > filters.maxValue) return false;
    if (filters.activeOnly && !inv.isActive) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return inv.name.toLowerCase().includes(searchLower) ||
             inv.symbol.toLowerCase().includes(searchLower) ||
             (inv.sector && inv.sector.toLowerCase().includes(searchLower));
    }
    return true;
  });
};

/**
 * Ordina investimenti per criterio specifico
 */
export const sortInvestments = (
  investments: Investment[],
  sortBy: 'name' | 'value' | 'return' | 'weight',
  direction: 'asc' | 'desc' = 'desc'
): Investment[] => {
  const sorted = [...investments].sort((a, b) => {
    let aVal: any, bVal: any;
    
    switch (sortBy) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'value':
        aVal = a.currentValue;
        bVal = b.currentValue;
        break;
      case 'return':
        aVal = a.totalReturnPercent;
        bVal = b.totalReturnPercent;
        break;
      case 'weight':
        aVal = a.portfolioWeight;
        bVal = b.portfolioWeight;
        break;
      default:
        return 0;
    }
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

// Export default con tutti i dati mock
export default {
  investments: mockInvestments,
  transactions: mockTransactions,
  pacPlans: mockPACPlans,
  portfolio: mockPortfolio,
  performanceHistory: mockPerformanceHistory,
  news: mockNews,
  marketData: mockMarketData,
  sectors: mockSectors,
  popularETFs,
  generateMockData,
  simulateRealTimeUpdates,
  generateNewPerformancePoint,
  filterInvestments,
  sortInvestments
};