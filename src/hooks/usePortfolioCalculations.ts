// src/hooks/usePortfolioCalculations.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Investment, 
  Portfolio, 
  Transaction,
  PACPlan,
  PerformanceMetrics, 
  PerformanceHistory,
  AssetAllocation,
  SectorAllocation,
  GeographicAllocation,
  AssetClass 
} from '../utils/AssetTypes';
import { 
  calculatePerformanceMetrics,
  calculateAssetAllocation,
  calculateSectorAllocation,
  calculateTotalReturn,
  calculateRiskLevel,
  calculateCorrelation,
  suggestRebalancing,
  formatCurrency,
  formatPercentage
} from '../utils/InvestmentUtils';

interface PortfolioAnalytics {
  // Performance
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  totalReturnPercent: number;
  
  // Daily changes
  dayChange: number;
  dayChangePercent: number;
  
  // Performance metrics
  performanceMetrics: PerformanceMetrics;
  
  // Allocations
  assetAllocation: AssetAllocation[];
  sectorAllocation: SectorAllocation[];
  geographicAllocation: GeographicAllocation[];
  
  // Risk analysis
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number;
  riskBreakdown: { category: string; weight: number; risk: number }[];
  
  // Top performers
  topPerformers: Investment[];
  worstPerformers: Investment[];
  
  // PAC analysis
  pacSummary: {
    totalPlans: number;
    activePlans: number;
    monthlyAmount: number;
    totalInvested: number;
    projectedAnnual: number;
  };
}

interface RebalancingAnalysis {
  needsRebalancing: boolean;
  maxDeviation: number;
  suggestions: {
    assetClass: AssetClass;
    currentPercent: number;
    targetPercent: number;
    deviation: number;
    action: 'BUY' | 'SELL' | 'HOLD';
    amount: number;
  }[];
  estimatedCost: number;
  estimatedTime: string;
}

interface DiversificationAnalysis {
  score: number; // 0-100
  level: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  recommendations: string[];
  concentrationRisk: {
    singleAsset: number; // % del portafoglio nel singolo asset più grande
    topFive: number; // % del portafoglio nei top 5 asset
    singleSector: number;
    singleCountry: number;
  };
}

interface UsePortfolioCalculationsReturn {
  // Analytics
  analytics: PortfolioAnalytics | null;
  rebalancingAnalysis: RebalancingAnalysis | null;
  diversificationAnalysis: DiversificationAnalysis | null;
  
  // Performance tracking
  performanceHistory: PerformanceHistory[];
  monthlyReturns: { month: string; return: number; invested: number }[];
  
  // Comparisons
  benchmarkComparison: {
    portfolio: number;
    benchmark: number;
    outperformance: number;
    periods: { period: string; portfolio: number; benchmark: number }[];
  } | null;
  
  // Loading state
  calculating: boolean;
  
  // Actions
  updateAnalytics: () => void;
  setTargetAllocation: (allocation: { assetClass: AssetClass; targetPercent: number }[]) => void;
  setBenchmark: (benchmark: string) => void;
  
  // Utilities
  getAssetClassReturn: (assetClass: AssetClass) => number;
  getSectorReturn: (sector: string) => number;
  getMonthlyContributions: () => number;
  getProjectedValue: (months: number, monthlyContribution?: number) => number;
}

export const usePortfolioCalculations = (
  investments: Investment[],
  transactions: Transaction[],
  pacPlans: PACPlan[],
  performanceData?: PerformanceHistory[]
): UsePortfolioCalculationsReturn => {
  
  // State
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [rebalancingAnalysis, setRebalancingAnalysis] = useState<RebalancingAnalysis | null>(null);
  const [diversificationAnalysis, setDiversificationAnalysis] = useState<DiversificationAnalysis | null>(null);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceHistory[]>([]);
  const [calculating, setCalculating] = useState(false);
  
  // Configuration
  const [targetAllocation, setTargetAllocationState] = useState<{ assetClass: AssetClass; targetPercent: number }[]>([
    { assetClass: AssetClass.ETF, targetPercent: 60 },
    { assetClass: AssetClass.STOCKS, targetPercent: 25 },
    { assetClass: AssetClass.BONDS, targetPercent: 10 },
    { assetClass: AssetClass.ALTERNATIVE, targetPercent: 5 }
  ]);
  const [benchmark, setBenchmarkState] = useState('MSCI_WORLD');

  // ==================== MAIN CALCULATIONS ====================

  const calculateAnalytics = useCallback(async (): Promise<PortfolioAnalytics> => {
    // Totali portfolio
    const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
    const { absolute: totalReturn, percentage: totalReturnPercent } = calculateTotalReturn(totalValue, totalInvested);
    
    // Calcola variazioni giornaliere
    const dayChange = investments.reduce((sum, inv) => {
      const dayValue = inv.shares * inv.dayChange;
      return sum + dayValue;
    }, 0);
    const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0;
    
    // Performance metrics
    const performanceMetrics = calculatePerformanceMetrics(performanceHistory);
    
    // Allocations
    const assetAllocation = calculateAssetAllocation(investments);
    const sectorAllocation = calculateSectorAllocation(investments);
    const geographicAllocation = calculateGeographicAllocation(investments);
    
    // Risk analysis
    const riskAnalysis = calculateRiskLevel(investments);
    
    // Top/worst performers
    const sortedByReturn = [...investments].sort((a, b) => b.totalReturnPercent - a.totalReturnPercent);
    const topPerformers = sortedByReturn.slice(0, 3);
    const worstPerformers = sortedByReturn.slice(-3).reverse();
    
    // PAC analysis
    const pacSummary = calculatePACAnalysis(pacPlans);
    
    return {
      totalValue,
      totalInvested,
      totalReturn,
      totalReturnPercent,
      dayChange,
      dayChangePercent,
      performanceMetrics,
      assetAllocation,
      sectorAllocation,
      geographicAllocation,
      riskLevel: riskAnalysis.level,
      riskScore: riskAnalysis.score,
      riskBreakdown: riskAnalysis.breakdown,
      topPerformers,
      worstPerformers,
      pacSummary
    };
  }, [investments, performanceHistory, pacPlans]);

  const calculateGeographicAllocation = (investments: Investment[]): GeographicAllocation[] => {
    const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const allocation = new Map<string, { value: number; investments: string[]; region: string }>();
    
    investments.forEach(inv => {
      const country = inv.country || 'Non Specificato';
      const region = getRegionForCountry(country);
      const current = allocation.get(country) || { value: 0, investments: [], region };
      
      allocation.set(country, {
        value: current.value + inv.currentValue,
        investments: [...current.investments, inv.id],
        region
      });
    });
    
    return Array.from(allocation.entries()).map(([country, data]) => ({
      country,
      region: data.region,
      value: data.value,
      percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
      investments: data.investments
    }));
  };

  const getRegionForCountry = (country: string): string => {
    const regionMap: { [key: string]: string } = {
      'USA': 'Nord America',
      'Canada': 'Nord America',
      'UK': 'Europa',
      'Germania': 'Europa',
      'Francia': 'Europa',
      'Italia': 'Europa',
      'Spagna': 'Europa',
      'Svizzera': 'Europa',
      'Giappone': 'Asia',
      'Cina': 'Asia',
      'India': 'Asia',
      'Australia': 'Oceania',
      'Brasile': 'Sud America',
      'Globale': 'Mondo'
    };
    
    return regionMap[country] || 'Altro';
  };

  const calculatePACAnalysis = (pacPlans: PACPlan[]) => {
    const activePlans = pacPlans.filter(p => p.isActive && !p.isPaused);
    const monthlyAmount = activePlans.reduce((sum, p) => {
      const multiplier = p.frequency === 'monthly' ? 1 : p.frequency === 'quarterly' ? 0.33 : 0.17;
      return sum + (p.monthlyAmount * multiplier);
    }, 0);
    
    return {
      totalPlans: pacPlans.length,
      activePlans: activePlans.length,
      monthlyAmount,
      totalInvested: pacPlans.reduce((sum, p) => sum + p.totalInvested, 0),
      projectedAnnual: monthlyAmount * 12
    };
  };

  // ==================== REBALANCING ANALYSIS ====================

  const calculateRebalancingAnalysis = useCallback((): RebalancingAnalysis => {
    const rebalancing = suggestRebalancing(investments, targetAllocation);
    const maxDeviation = Math.max(...rebalancing.suggestions.map(s => Math.abs(s.deviation)));
    
    // Stima costi di rebalancing (commissioni simulate)
    const estimatedCost = rebalancing.suggestions
      .filter(s => s.action !== 'HOLD')
      .reduce((sum, s) => sum + Math.max(s.amount * 0.001, 2.95), 0); // 0.1% o min €2.95
    
    // Stima tempo necessario
    const tradesNeeded = rebalancing.suggestions.filter(s => s.action !== 'HOLD').length;
    const estimatedTime = tradesNeeded <= 2 ? '1 giorno' : tradesNeeded <= 5 ? '2-3 giorni' : '1 settimana';
    
    return {
      needsRebalancing: rebalancing.needsRebalancing,
      maxDeviation,
      suggestions: rebalancing.suggestions,
      estimatedCost,
      estimatedTime
    };
  }, [investments, targetAllocation]);

  // ==================== DIVERSIFICATION ANALYSIS ====================

  const calculateDiversificationAnalysis = useCallback((): DiversificationAnalysis => {
    const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    
    // Concentrazione per singolo asset
    const sortedByValue = [...investments].sort((a, b) => b.currentValue - a.currentValue);
    const singleAsset = totalValue > 0 ? (sortedByValue[0]?.currentValue / totalValue) * 100 : 0;
    const topFive = totalValue > 0 ? 
      (sortedByValue.slice(0, 5).reduce((sum, inv) => sum + inv.currentValue, 0) / totalValue) * 100 : 0;
    
    // Concentrazione per settore
    const sectorAllocation = calculateSectorAllocation(investments);
    const singleSector = Math.max(...sectorAllocation.map(s => s.percentage));
    
    // Concentrazione geografica
    const geoAllocation = calculateGeographicAllocation(investments);
    const singleCountry = Math.max(...geoAllocation.map(g => g.percentage));
    
    // Score di diversificazione (0-100)
    let score = 100;
    if (singleAsset > 40) score -= 30;
    else if (singleAsset > 25) score -= 20;
    else if (singleAsset > 15) score -= 10;
    
    if (singleSector > 50) score -= 25;
    else if (singleSector > 35) score -= 15;
    else if (singleSector > 25) score -= 5;
    
    if (singleCountry > 70) score -= 20;
    else if (singleCountry > 50) score -= 10;
    
    if (investments.length < 3) score -= 25;
    else if (investments.length < 5) score -= 10;
    
    // Livello di diversificazione
    const level = score >= 85 ? 'EXCELLENT' : score >= 70 ? 'GOOD' : score >= 50 ? 'FAIR' : 'POOR';
    
    // Raccomandazioni
    const recommendations: string[] = [];
    if (singleAsset > 25) {
      recommendations.push(`Riduci l'esposizione del singolo asset maggiore (${singleAsset.toFixed(1)}%)`);
    }
    if (singleSector > 35) {
      recommendations.push(`Diversifica dal settore principale (${singleSector.toFixed(1)}%)`);
    }
    if (singleCountry > 60) {
      recommendations.push(`Aggiungi esposizione geografica internazionale`);
    }
    if (investments.length < 5) {
      recommendations.push(`Aumenta il numero di posizioni (attualmente ${investments.length})`);
    }
    
    return {
      score: Math.max(0, score),
      level,
      recommendations,
      concentrationRisk: {
        singleAsset,
        topFive,
        singleSector,
        singleCountry
      }
    };
  }, [investments]);

  // ==================== BENCHMARK COMPARISON ====================

  const benchmarkComparison = useMemo(() => {
    // Simula performance benchmark
    const benchmarkReturns: { [key: string]: number } = {
      'MSCI_WORLD': 9.5,
      'S&P_500': 11.2,
      'FTSE_ALL_WORLD': 8.8,
      'EURO_STOXX_600': 7.3
    };
    
    if (!analytics) return null;
    
    const benchmarkReturn = benchmarkReturns[benchmark] || 8.0;
    const outperformance = analytics.totalReturnPercent - benchmarkReturn;
    
    return {
      portfolio: analytics.totalReturnPercent,
      benchmark: benchmarkReturn,
      outperformance,
      periods: [
        { period: '1M', portfolio: 2.1, benchmark: 1.8 },
        { period: '3M', portfolio: 5.7, benchmark: 4.9 },
        { period: '6M', portfolio: 8.3, benchmark: 7.1 },
        { period: '1Y', portfolio: analytics.totalReturnPercent, benchmark: benchmarkReturn }
      ]
    };
  }, [analytics, benchmark]);

  // ==================== MONTHLY RETURNS ====================

  const monthlyReturns = useMemo(() => {
    // Calcola rendimenti mensili basati sui dati storici
    const months: { month: string; return: number; invested: number }[] = [];
    
    for (let i = 1; i < performanceHistory.length; i++) {
      const current = performanceHistory[i];
      const previous = performanceHistory[i - 1];
      
      const monthReturn = previous.value > 0 ? 
        ((current.value - previous.value) / previous.value) * 100 : 0;
      
      const date = new Date(current.date);
      const monthName = date.toLocaleDateString('it-IT', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      months.push({
        month: monthName,
        return: monthReturn,
        invested: current.invested
      });
    }
    
    return months.slice(-12); // Ultimi 12 mesi
  }, [performanceHistory]);

  // ==================== ACTIONS ====================

  const updateAnalytics = useCallback(async () => {
    if (investments.length === 0) return;
    
    setCalculating(true);
    
    try {
      // Simula calcolo complesso
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAnalytics = await calculateAnalytics();
      const newRebalancing = calculateRebalancingAnalysis();
      const newDiversification = calculateDiversificationAnalysis();
      
      setAnalytics(newAnalytics);
      setRebalancingAnalysis(newRebalancing);
      setDiversificationAnalysis(newDiversification);
      
    } finally {
      setCalculating(false);
    }
  }, [calculateAnalytics, calculateRebalancingAnalysis, calculateDiversificationAnalysis, investments]);

  const setTargetAllocation = useCallback((allocation: { assetClass: AssetClass; targetPercent: number }[]) => {
    setTargetAllocationState(allocation);
  }, []);

  const setBenchmark = useCallback((newBenchmark: string) => {
    setBenchmarkState(newBenchmark);
  }, []);

  // ==================== UTILITY FUNCTIONS ====================

  const getAssetClassReturn = useCallback((assetClass: AssetClass): number => {
    const assetInvestments = investments.filter(inv => inv.assetClass === assetClass);
    if (assetInvestments.length === 0) return 0;
    
    const totalValue = assetInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalInvested = assetInvestments.reduce((sum, inv) => sum + inv.totalInvested, 0);
    
    return totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;
  }, [investments]);

  const getSectorReturn = useCallback((sector: string): number => {
    const sectorInvestments = investments.filter(inv => inv.sector === sector);
    if (sectorInvestments.length === 0) return 0;
    
    const totalValue = sectorInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalInvested = sectorInvestments.reduce((sum, inv) => sum + inv.totalInvested, 0);
    
    return totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;
  }, [investments]);

  const getMonthlyContributions = useCallback((): number => {
    return analytics?.pacSummary.monthlyAmount || 0;
  }, [analytics]);

  const getProjectedValue = useCallback((months: number, monthlyContribution?: number): number => {
    if (!analytics) return 0;
    
    const currentValue = analytics.totalValue;
    const contribution = monthlyContribution || analytics.pacSummary.monthlyAmount;
    
    // Proiezione semplificata con crescita media del 7% annuo
    const monthlyGrowthRate = 0.07 / 12;
    const totalContributions = contribution * months;
    
    // Formula del valore futuro con contributi mensili
    const futureValueCurrent = currentValue * Math.pow(1 + monthlyGrowthRate, months);
    const futureValueContributions = contribution * 
      ((Math.pow(1 + monthlyGrowthRate, months) - 1) / monthlyGrowthRate);
    
    return futureValueCurrent + futureValueContributions;
  }, [analytics]);

  // ==================== EFFECTS ====================

  // Auto-update analytics when data changes
  useEffect(() => {
    if (investments.length > 0) {
      updateAnalytics();
    }
  }, [investments, transactions, pacPlans, updateAnalytics]);

  // Update performance history when provided
  useEffect(() => {
    if (performanceData && performanceData.length > 0) {
      setPerformanceHistory(performanceData);
    }
  }, [performanceData]);

  // ==================== RETURN ====================

  return {
    // Analytics
    analytics,
    rebalancingAnalysis,
    diversificationAnalysis,
    
    // Performance tracking
    performanceHistory,
    monthlyReturns,
    
    // Comparisons
    benchmarkComparison,
    
    // Loading state
    calculating,
    
    // Actions
    updateAnalytics,
    setTargetAllocation,
    setBenchmark,
    
    // Utilities
    getAssetClassReturn,
    getSectorReturn,
    getMonthlyContributions,
    getProjectedValue
  };
};

// ==================== ADDITIONAL UTILITY HOOKS ====================

/**
 * Hook specializzato per calcoli di performance comparison
 */
export const usePerformanceComparison = (
  investments: Investment[],
  benchmark: string = 'MSCI_WORLD'
) => {
  const [comparison, setComparison] = useState<{
    periods: { name: string; portfolio: number; benchmark: number; difference: number }[];
    outperformancePeriods: number;
    averageOutperformance: number;
  } | null>(null);

  useEffect(() => {
    if (investments.length === 0) return;

    // Simula dati di benchmark per diversi periodi
    const benchmarkData: { [key: string]: { [period: string]: number } } = {
      'MSCI_WORLD': {
        '1W': 0.5,
        '1M': 1.8,
        '3M': 4.9,
        '6M': 7.1,
        '1Y': 9.5,
        '3Y': 7.2,
        '5Y': 8.8
      },
      'S&P_500': {
        '1W': 0.7,
        '1M': 2.1,
        '3M': 5.5,
        '6M': 8.3,
        '1Y': 11.2,
        '3Y': 9.1,
        '5Y': 10.4
      }
    };

    const portfolioData = {
      '1W': 0.8,
      '1M': 2.1,
      '3M': 5.7,
      '6M': 8.3,
      '1Y': investments.reduce((sum, inv) => sum + inv.totalReturnPercent, 0) / investments.length,
      '3Y': 8.5,
      '5Y': 9.2
    };

    const benchmarkReturns = benchmarkData[benchmark] || benchmarkData['MSCI_WORLD'];
    
    const periods = Object.keys(portfolioData).map(period => {
      const portfolio = portfolioData[period as keyof typeof portfolioData];
      const benchmarkReturn = benchmarkReturns[period];
      const difference = portfolio - benchmarkReturn;
      
      return {
        name: period,
        portfolio,
        benchmark: benchmarkReturn,
        difference
      };
    });

    const outperformancePeriods = periods.filter(p => p.difference > 0).length;
    const averageOutperformance = periods.reduce((sum, p) => sum + p.difference, 0) / periods.length;

    setComparison({
      periods,
      outperformancePeriods,
      averageOutperformance
    });

  }, [investments, benchmark]);

  return comparison;
};

/**
 * Hook per analisi di correlazione tra investimenti
 */
export const useCorrelationAnalysis = (investments: Investment[]) => {
  const [correlationMatrix, setCorrelationMatrix] = useState<{
    [key: string]: { [key: string]: number };
  }>({});

  const [diversificationBenefit, setDiversificationBenefit] = useState<{
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    if (investments.length < 2) return;

    // Simula correlazioni realistiche tra asset
    const correlations: { [key: string]: { [key: string]: number } } = {};
    
    investments.forEach(inv1 => {
      correlations[inv1.symbol] = {};
      
      investments.forEach(inv2 => {
        if (inv1.symbol === inv2.symbol) {
          correlations[inv1.symbol][inv2.symbol] = 1.0;
        } else {
          // Simula correlazioni basate su asset class
          let correlation = 0.3; // Default bassa correlazione
          
          if (inv1.assetClass === inv2.assetClass) {
            correlation = 0.7; // Stessa asset class
          }
          
          if (inv1.sector === inv2.sector && inv1.sector) {
            correlation = Math.max(correlation, 0.8); // Stesso settore
          }
          
          if (inv1.country === inv2.country && inv1.country !== 'Globale') {
            correlation = Math.max(correlation, 0.6); // Stesso paese
          }
          
          // Aggiungi rumore casuale
          correlation += (Math.random() - 0.5) * 0.2;
          correlation = Math.max(-1, Math.min(1, correlation));
          
          correlations[inv1.symbol][inv2.symbol] = Number(correlation.toFixed(2));
        }
      });
    });

    setCorrelationMatrix(correlations);

    // Calcola beneficio diversificazione
    const avgCorrelation = investments.length > 1 ? 
      investments.reduce((sum, inv1, i) => {
        return sum + investments.slice(i + 1).reduce((innerSum, inv2) => {
          return innerSum + Math.abs(correlations[inv1.symbol][inv2.symbol]);
        }, 0);
      }, 0) / (investments.length * (investments.length - 1) / 2) : 0;

    const score = Math.max(0, Math.min(100, (1 - avgCorrelation) * 100));
    const level = score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
    
    const recommendations: string[] = [];
    if (avgCorrelation > 0.7) {
      recommendations.push('Riduci la correlazione aggiungendo asset di classi diverse');
    }
    if (avgCorrelation > 0.8) {
      recommendations.push('Considera investimenti geograficamente diversificati');
    }
    if (score < 50) {
      recommendations.push('Aumenta la diversificazione per ridurre il rischio');
    }

    setDiversificationBenefit({ score, level, recommendations });

  }, [investments]);

  return {
    correlationMatrix,
    diversificationBenefit,
    getCorrelation: (symbol1: string, symbol2: string) => 
      correlationMatrix[symbol1]?.[symbol2] || 0
  };
};

/**
 * Hook per tracking degli obiettivi di portafoglio
 */
export const usePortfolioGoals = (
  currentValue: number,
  monthlyContribution: number = 0
) => {
  const [goals, setGoals] = useState<{
    target: number;
    timeline: number; // mesi
    probability: number;
    requiredReturn: number;
    timeToGoal: number;
    onTrack: boolean;
  }[]>([]);

  const addGoal = useCallback((target: number, timeline: number) => {
    const requiredMonthlyReturn = Math.pow(target / currentValue, 1 / timeline) - 1;
    const requiredAnnualReturn = (Math.pow(1 + requiredMonthlyReturn, 12) - 1) * 100;
    
    // Stima probabilità di successo (semplificata)
    const historicalReturn = 8; // 8% annuo storico
    const probability = Math.max(10, Math.min(90, 
      90 - Math.abs(requiredAnnualReturn - historicalReturn) * 2
    ));
    
    // Calcolo tempo stimato al goal attuale
    const currentMonthlyReturn = 0.07 / 12; // 7% annuo
    const timeToGoal = Math.log(target / currentValue) / Math.log(1 + currentMonthlyReturn);
    
    const newGoal = {
      target,
      timeline,
      probability,
      requiredReturn: requiredAnnualReturn,
      timeToGoal: Math.max(0, timeToGoal),
      onTrack: timeToGoal <= timeline * 1.1 // 10% tolleranza
    };

    setGoals(prev => [...prev, newGoal]);
  }, [currentValue]);

  const removeGoal = useCallback((index: number) => {
    setGoals(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    goals,
    addGoal,
    removeGoal
  };
};