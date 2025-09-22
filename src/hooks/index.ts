// src/hooks/index.ts

// Investment hooks
export { useInvestmentData } from './useInvestmentData';
export { useRealTimePrices } from './useRealTimePrices';
export { 
  usePortfolioCalculations, 
  usePerformanceComparison, 
  useCorrelationAnalysis, 
  usePortfolioGoals 
} from './usePortfolioCalculations';

// Other existing hooks (if any)
export { default as useAdvancedCharts } from './useAdvancedCharts'; // ✅ CORRETTO - default export