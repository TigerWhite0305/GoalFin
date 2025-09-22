// src/utils/InvestmentUtils.ts

import { 
  Investment, 
  Transaction, 
  PACPlan, 
  Portfolio, 
  PerformanceMetrics, 
  PerformanceHistory,
  AssetAllocation,
  SectorAllocation,
  Currency,
  CURRENCY_SYMBOLS,
  PERFORMANCE_COLORS,
  AssetClass,
  TransactionType
} from './AssetTypes';

// ==================== FORMATTERS ====================

/**
 * Formatta una valuta con simbolo e localizzazione italiana
 */
export const formatCurrency = (
  amount: number, 
  currency: Currency = Currency.EUR, 
  decimals: number = 2
): string => {
  const symbol = CURRENCY_SYMBOLS[currency];
  
  if (currency === Currency.EUR) {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(amount);
  }
  
  return `${symbol}${amount.toLocaleString('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
};

/**
 * Formatta una percentuale con colore
 */
export const formatPercentage = (
  percentage: number, 
  decimals: number = 2, 
  withColor: boolean = false
): string => {
  const formatted = `${percentage >= 0 ? '+' : ''}${percentage.toFixed(decimals)}%`;
  
  if (!withColor) return formatted;
  
  const color = percentage > 0 
    ? PERFORMANCE_COLORS.positive 
    : percentage < 0 
      ? PERFORMANCE_COLORS.negative 
      : PERFORMANCE_COLORS.neutral;
      
  return `<span style="color: ${color}">${formatted}</span>`;
};

/**
 * Formatta un numero con separatori migliaia
 */
export const formatNumber = (
  number: number, 
  decimals: number = 2,
  compact: boolean = false
): string => {
  if (compact && Math.abs(number) >= 1000) {
    if (Math.abs(number) >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(number) >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
  }
  
  return number.toLocaleString('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formatta le azioni con decimali appropriati
 */
export const formatShares = (shares: number): string => {
  // ETF e alcuni titoli possono avere decimali
  if (shares % 1 === 0) {
    return shares.toString();
  }
  return shares.toFixed(6).replace(/\.?0+$/, '');
};

/**
 * Formatta una data in formato italiano
 */
export const formatDate = (
  date: string | Date, 
  format: 'short' | 'long' | 'relative' = 'short'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'relative':
      const now = new Date();
      const diffTime = now.getTime() - dateObj.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Oggi';
      if (diffDays === 1) return 'Ieri';
      if (diffDays < 7) return `${diffDays} giorni fa`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} settimane fa`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} mesi fa`;
      return `${Math.floor(diffDays / 365)} anni fa`;
    default:
      return dateObj.toLocaleDateString('it-IT');
  }
};

// ==================== CALCULATION FUNCTIONS ====================

/**
 * Calcola il rendimento totale di un investimento
 */
export const calculateTotalReturn = (
  currentValue: number, 
  totalInvested: number
): { absolute: number; percentage: number } => {
  const absolute = currentValue - totalInvested;
  const percentage = totalInvested > 0 ? (absolute / totalInvested) * 100 : 0;
  
  return { absolute, percentage };
};

/**
 * Calcola il prezzo medio di acquisto
 */
export const calculateAveragePrice = (transactions: Transaction[]): number => {
  const buyTransactions = transactions.filter(t => 
    t.type === TransactionType.BUY || t.type === TransactionType.PAC_PAYMENT
  );
  
  if (buyTransactions.length === 0) return 0;
  
  const totalAmount = buyTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalShares = buyTransactions.reduce((sum, t) => sum + t.shares, 0);
  
  return totalShares > 0 ? totalAmount / totalShares : 0;
};

/**
 * Calcola le metriche di performance
 */
export const calculatePerformanceMetrics = (
  history: PerformanceHistory[]
): PerformanceMetrics => {
  if (history.length === 0) {
    return {
      totalReturn: 0,
      totalReturnPercent: 0,
      annualizedReturn: 0,
      volatility: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      winRate: 0,
      ytdReturn: 0,
      oneMonthReturn: 0,
      threeMonthReturn: 0,
      sixMonthReturn: 0,
      oneYearReturn: 0,
      threeYearReturn: 0,
      fiveYearReturn: 0
    };
  }

  const latest = history[history.length - 1];
  const totalReturn = latest.returns;
  const totalReturnPercent = latest.returnsPercent;
  
  // Calcola rendimenti per periodo
  const now = new Date();
  const ytdStart = new Date(now.getFullYear(), 0, 1);
  
  const ytdReturn = calculatePeriodReturn(history, ytdStart);
  const oneMonthReturn = calculatePeriodReturn(history, subDays(now, 30));
  const threeMonthReturn = calculatePeriodReturn(history, subDays(now, 90));
  const sixMonthReturn = calculatePeriodReturn(history, subDays(now, 180));
  const oneYearReturn = calculatePeriodReturn(history, subDays(now, 365));
  const threeYearReturn = calculatePeriodReturn(history, subDays(now, 1095));
  const fiveYearReturn = calculatePeriodReturn(history, subDays(now, 1825));
  
  // Calcola volatilità (deviazione standard dei rendimenti giornalieri)
  const dailyReturns = history.slice(1).map((point, index) => {
    const prev = history[index];
    return prev.value > 0 ? ((point.value - prev.value) / prev.value) * 100 : 0;
  });
  
  const volatility = calculateStandardDeviation(dailyReturns) * Math.sqrt(252); // Annualizzata
  
  // Calcola Sharpe Ratio (assumendo risk-free rate del 2%)
  const riskFreeRate = 2;
  const excessReturn = totalReturnPercent - riskFreeRate;
  const sharpeRatio = volatility > 0 ? excessReturn / volatility : 0;
  
  // Calcola Max Drawdown
  const maxDrawdown = calculateMaxDrawdown(history);
  
  // Calcola Win Rate
  const winRate = dailyReturns.length > 0 
    ? (dailyReturns.filter(r => r > 0).length / dailyReturns.length) * 100 
    : 0;
  
  // Calcola rendimento annualizzato
  const daysDiff = Math.max(1, (new Date(latest.date).getTime() - new Date(history[0].date).getTime()) / (1000 * 60 * 60 * 24));
  const yearsHeld = daysDiff / 365.25;
  const annualizedReturn = yearsHeld > 0 
    ? (Math.pow(1 + totalReturnPercent / 100, 1 / yearsHeld) - 1) * 100 
    : totalReturnPercent;

  return {
    totalReturn,
    totalReturnPercent,
    annualizedReturn,
    volatility,
    sharpeRatio,
    maxDrawdown,
    winRate,
    ytdReturn,
    oneMonthReturn,
    threeMonthReturn,
    sixMonthReturn,
    oneYearReturn,
    threeYearReturn,
    fiveYearReturn
  };
};

/**
 * Calcola l'allocazione per asset class
 */
export const calculateAssetAllocation = (investments: Investment[]): AssetAllocation[] => {
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  
  const allocation = new Map<AssetClass, number>();
  
  investments.forEach(inv => {
    const current = allocation.get(inv.assetClass) || 0;
    allocation.set(inv.assetClass, current + inv.currentValue);
  });
  
  return Array.from(allocation.entries()).map(([assetClass, value]) => ({
    assetClass,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
  }));
};

/**
 * Calcola l'allocazione per settore
 */
export const calculateSectorAllocation = (investments: Investment[]): SectorAllocation[] => {
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  
  const allocation = new Map<string, { value: number; investments: string[] }>();
  
  investments.forEach(inv => {
    const sector = inv.sector || 'Non Specificato';
    const current = allocation.get(sector) || { value: 0, investments: [] };
    
    allocation.set(sector, {
      value: current.value + inv.currentValue,
      investments: [...current.investments, inv.id]
    });
  });
  
  return Array.from(allocation.entries()).map(([sector, data]) => ({
    sector,
    value: data.value,
    percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
    investments: data.investments
  }));
};

/**
 * Calcola il peso di un investimento nel portafoglio
 */
export const calculatePortfolioWeight = (
  investmentValue: number, 
  totalPortfolioValue: number
): number => {
  return totalPortfolioValue > 0 ? (investmentValue / totalPortfolioValue) * 100 : 0;
};

/**
 * Aggiorna le metriche di un investimento
 */
export const updateInvestmentMetrics = (
  investment: Investment, 
  transactions: Transaction[],
  totalPortfolioValue: number
): Investment => {
  const buyTransactions = transactions.filter(t => 
    t.investmentId === investment.id && 
    (t.type === TransactionType.BUY || t.type === TransactionType.PAC_PAYMENT)
  );
  
  const sellTransactions = transactions.filter(t => 
    t.investmentId === investment.id && 
    t.type === TransactionType.SELL
  );
  
  // Calcola shares totali
  const boughtShares = buyTransactions.reduce((sum, t) => sum + t.shares, 0);
  const soldShares = sellTransactions.reduce((sum, t) => sum + t.shares, 0);
  const currentShares = boughtShares - soldShares;
  
  // Calcola totale investito
  const totalInvested = buyTransactions.reduce((sum, t) => sum + t.totalAmount, 0) -
                       sellTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
  
  // Calcola prezzo medio
  const avgBuyPrice = calculateAveragePrice(buyTransactions);
  
  // Calcola valore corrente
  const currentValue = currentShares * investment.currentPrice;
  
  // Calcola rendimenti
  const { absolute: totalReturn, percentage: totalReturnPercent } = 
    calculateTotalReturn(currentValue, totalInvested);
  
  // Calcola peso nel portafoglio
  const portfolioWeight = calculatePortfolioWeight(currentValue, totalPortfolioValue);
  
  return {
    ...investment,
    shares: currentShares,
    avgBuyPrice,
    totalInvested,
    currentValue,
    totalReturn,
    totalReturnPercent,
    portfolioWeight,
    updatedAt: new Date().toISOString()
  };
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Calcola il rendimento per un periodo specifico
 */
const calculatePeriodReturn = (
  history: PerformanceHistory[], 
  startDate: Date
): number => {
  const startPoint = history.find(h => new Date(h.date) >= startDate);
  const endPoint = history[history.length - 1];
  
  if (!startPoint || !endPoint || startPoint.value === 0) return 0;
  
  return ((endPoint.value - startPoint.value) / startPoint.value) * 100;
};

/**
 * Sottrae giorni da una data
 */
const subDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

/**
 * Calcola la deviazione standard
 */
const calculateStandardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  
  return Math.sqrt(variance);
};

/**
 * Calcola il massimo drawdown
 */
const calculateMaxDrawdown = (history: PerformanceHistory[]): number => {
  if (history.length === 0) return 0;
  
  let maxDrawdown = 0;
  let peak = history[0].value;
  
  for (const point of history) {
    if (point.value > peak) {
      peak = point.value;
    }
    
    const drawdown = peak > 0 ? ((peak - point.value) / peak) * 100 : 0;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  }
  
  return maxDrawdown;
};

// ==================== PAC UTILITIES ====================

/**
 * Calcola la prossima data di pagamento PAC
 */
export const calculateNextPACPayment = (
  plan: PACPlan, 
  lastPayment?: string
): string => {
  const startDate = lastPayment ? new Date(lastPayment) : new Date(plan.startDate);
  const nextDate = new Date(startDate);
  
  switch (plan.frequency) {
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'biannual':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
  }
  
  // Imposta il giorno del mese
  nextDate.setDate(plan.dayOfMonth);
  
  return nextDate.toISOString().split('T')[0];
};

/**
 * Calcola se un PAC deve essere eseguito
 */
export const shouldExecutePAC = (plan: PACPlan): boolean => {
  if (!plan.isActive || plan.isPaused) return false;
  
  const today = new Date();
  const nextPayment = new Date(plan.nextPaymentDate);
  
  return today >= nextPayment;
};

/**
 * Calcola le proiezioni di un PAC
 */
export const calculatePACProjections = (
  plan: PACPlan,
  targetAmount?: number,
  endDate?: string
): {
  projectedMonths: number;
  projectedTotal: number;
  projectedShares: number;
  estimatedValue: number;
} => {
  const monthsPerYear = plan.frequency === 'monthly' ? 12 : plan.frequency === 'quarterly' ? 4 : 2;
  
  let projectedMonths = 0;
  
  if (targetAmount) {
    const remainingAmount = targetAmount - plan.totalInvested;
    projectedMonths = Math.ceil(remainingAmount / plan.monthlyAmount);
  } else if (endDate) {
    const end = new Date(endDate);
    const start = new Date();
    projectedMonths = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
  }
  
  const projectedTotal = plan.totalInvested + (projectedMonths * plan.monthlyAmount);
  
  // Stima basata sul prezzo corrente (semplificata)
  const estimatedShares = projectedTotal / plan.avgBuyPrice || 1;
  const estimatedValue = projectedTotal * 1.05; // Crescita stimata del 5%
  
  return {
    projectedMonths,
    projectedTotal,
    projectedShares: estimatedShares,
    estimatedValue
  };
};

// ==================== RISK METRICS ====================

/**
 * Calcola il livello di rischio del portafoglio
 */
export const calculateRiskLevel = (investments: Investment[]): {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number;
  breakdown: { category: string; weight: number; risk: number }[];
} => {
  if (investments.length === 0) {
    return { level: 'LOW', score: 1, breakdown: [] };
  }

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  
  // Risk scores per asset class (1-10)
  const assetRiskScores: Record<string, number> = {
    'BONDS': 2,
    'ETF': 4,
    'STOCKS': 6,
    'REAL_ESTATE': 5,
    'COMMODITIES': 7,
    'CRYPTO': 9,
    'ALTERNATIVE': 8
  };

  const breakdown = investments.map(inv => {
    const weight = totalValue > 0 ? (inv.currentValue / totalValue) * 100 : 0;
    const risk = assetRiskScores[inv.assetClass] || 5;
    
    return {
      category: inv.assetClass,
      weight,
      risk
    };
  });

  // Calcola score pesato
  const weightedScore = breakdown.reduce((sum, item) => 
    sum + (item.weight * item.risk / 100), 0
  );

  const level = weightedScore <= 3 ? 'LOW' : weightedScore <= 6 ? 'MEDIUM' : 'HIGH';

  return { level, score: Math.round(weightedScore * 10) / 10, breakdown };
};

/**
 * Calcola la correlazione tra investimenti
 */
export const calculateCorrelation = (
  history1: PerformanceHistory[],
  history2: PerformanceHistory[]
): number => {
  if (history1.length < 2 || history2.length < 2) return 0;

  // Allinea le date e calcola i rendimenti
  const returns1: number[] = [];
  const returns2: number[] = [];

  for (let i = 1; i < Math.min(history1.length, history2.length); i++) {
    const ret1 = (history1[i].value - history1[i-1].value) / history1[i-1].value;
    const ret2 = (history2[i].value - history2[i-1].value) / history2[i-1].value;
    
    returns1.push(ret1);
    returns2.push(ret2);
  }

  if (returns1.length === 0) return 0;

  const mean1 = returns1.reduce((sum, val) => sum + val, 0) / returns1.length;
  const mean2 = returns2.reduce((sum, val) => sum + val, 0) / returns2.length;

  let numerator = 0;
  let sumSq1 = 0;
  let sumSq2 = 0;

  for (let i = 0; i < returns1.length; i++) {
    const diff1 = returns1[i] - mean1;
    const diff2 = returns2[i] - mean2;
    
    numerator += diff1 * diff2;
    sumSq1 += diff1 * diff1;
    sumSq2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(sumSq1 * sumSq2);
  return denominator === 0 ? 0 : numerator / denominator;
};

// ==================== PORTFOLIO REBALANCING ====================

/**
 * Suggerisce ribilanciamenti del portafoglio
 */
export const suggestRebalancing = (
  investments: Investment[],
  targetAllocation: { assetClass: AssetClass; targetPercent: number }[]
): {
  suggestions: {
    assetClass: AssetClass;
    currentPercent: number;
    targetPercent: number;
    deviation: number;
    action: 'BUY' | 'SELL' | 'HOLD';
    amount: number;
  }[];
  needsRebalancing: boolean;
} => {
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const currentAllocation = calculateAssetAllocation(investments);

  const suggestions = targetAllocation.map(target => {
    const current = currentAllocation.find(c => c.assetClass === target.assetClass);
    const currentPercent = current?.percentage || 0;
    const deviation = currentPercent - target.targetPercent;
    
    const action: 'BUY' | 'SELL' | 'HOLD' = 
      Math.abs(deviation) < 5 ? 'HOLD' :
      deviation > 0 ? 'SELL' : 'BUY';
    
    const targetValue = (target.targetPercent / 100) * totalValue;
    const currentValue = current?.value || 0;
    const amount = Math.abs(targetValue - currentValue);

    return {
      assetClass: target.assetClass,
      currentPercent,
      targetPercent: target.targetPercent,
      deviation,
      action,
      amount
    };
  });

  const needsRebalancing = suggestions.some(s => Math.abs(s.deviation) >= 5);

  return { suggestions, needsRebalancing };
};

// ==================== VALIDATION UTILITIES ====================

/**
 * Valida i dati di un investimento
 */
export const validateInvestment = (investment: Partial<Investment>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!investment.name || investment.name.trim().length === 0) {
    errors.push('Il nome è obbligatorio');
  }

  if (!investment.symbol || investment.symbol.trim().length === 0) {
    errors.push('Il simbolo è obbligatorio');
  }

  if (!investment.assetClass) {
    errors.push('La classe di asset è obbligatoria');
  }

  if (!investment.type) {
    errors.push('Il tipo di investimento è obbligatorio');
  }

  if (typeof investment.currentPrice !== 'number' || investment.currentPrice <= 0) {
    errors.push('Il prezzo corrente deve essere maggiore di 0');
  }

  if (typeof investment.shares !== 'number' || investment.shares < 0) {
    errors.push('Il numero di azioni deve essere >= 0');
  }

  if (typeof investment.totalInvested !== 'number' || investment.totalInvested < 0) {
    errors.push('Il totale investito deve essere >= 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida i dati di una transazione
 */
export const validateTransaction = (transaction: Partial<Transaction>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!transaction.investmentId) {
    errors.push('ID investimento obbligatorio');
  }

  if (!transaction.type) {
    errors.push('Tipo transazione obbligatorio');
  }

  if (typeof transaction.shares !== 'number' || transaction.shares <= 0) {
    errors.push('Numero azioni deve essere > 0');
  }

  if (typeof transaction.price !== 'number' || transaction.price <= 0) {
    errors.push('Prezzo deve essere > 0');
  }

  if (!transaction.date || !isValidDate(transaction.date)) {
    errors.push('Data non valida');
  }

  if (typeof transaction.fees !== 'number' || transaction.fees < 0) {
    errors.push('Commissioni devono essere >= 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Verifica se una stringa è una data valida
 */
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// ==================== EXPORT UTILITIES ====================

/**
 * Converte i dati del portafoglio in formato CSV
 */
export const exportToCSV = (investments: Investment[]): string => {
  const headers = [
    'Nome',
    'Simbolo', 
    'Classe Asset',
    'Tipo',
    'Azioni',
    'Prezzo Medio',
    'Prezzo Corrente',
    'Totale Investito',
    'Valore Corrente',
    'Rendimento €',
    'Rendimento %',
    'Peso Portafoglio %'
  ];

  const rows = investments.map(inv => [
    inv.name,
    inv.symbol,
    inv.assetClass,
    inv.type,
    formatShares(inv.shares),
    formatCurrency(inv.avgBuyPrice),
    formatCurrency(inv.currentPrice),
    formatCurrency(inv.totalInvested),
    formatCurrency(inv.currentValue),
    formatCurrency(inv.totalReturn),
    formatPercentage(inv.totalReturnPercent),
    formatPercentage(inv.portfolioWeight)
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

/**
 * Genera un report completo del portafoglio
 */
export const generatePortfolioReport = (
  portfolio: Portfolio,
  investments: Investment[],
  transactions: Transaction[]
): {
  summary: string;
  performance: string;
  allocation: string;
  risk: string;
} => {
  const metrics = calculatePerformanceMetrics([]); // Richiede dati storici
  const risk = calculateRiskLevel(investments);
  const allocation = calculateAssetAllocation(investments);

  const summary = `
RIEPILOGO PORTAFOGLIO
Valore Totale: ${formatCurrency(portfolio.totalValue)}
Totale Investito: ${formatCurrency(portfolio.totalInvested)}
Rendimento: ${formatCurrency(portfolio.totalReturn)} (${formatPercentage(portfolio.totalReturnPercent)})
Numero Investimenti: ${investments.length}
Livello Rischio: ${risk.level} (${risk.score}/10)
  `.trim();

  const performance = `
PERFORMANCE
Rendimento Annualizzato: ${formatPercentage(metrics.annualizedReturn)}
Volatilità: ${formatPercentage(metrics.volatility)}
Sharpe Ratio: ${metrics.sharpeRatio.toFixed(2)}
Max Drawdown: ${formatPercentage(metrics.maxDrawdown)}
Win Rate: ${formatPercentage(metrics.winRate)}
  `.trim();

  const allocationText = allocation.map(a => 
    `${a.assetClass}: ${formatPercentage(a.percentage)}`
  ).join('\n');

  const riskText = `
Livello: ${risk.level}
Score: ${risk.score}/10
Breakdown:
${risk.breakdown.map(b => 
  `  ${b.category}: ${formatPercentage(b.weight)} (Rischio: ${b.risk}/10)`
).join('\n')}
  `.trim();

  return {
    summary,
    performance,
    allocation: `ALLOCAZIONE ASSET\n${allocationText}`,
    risk: `ANALISI RISCHIO\n${riskText}`
  };
};