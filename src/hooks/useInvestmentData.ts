// src/hooks/useInvestmentData.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '../context/ToastContext';
import { 
  Investment, 
  Transaction, 
  PACPlan, 
  Portfolio,
  InvestmentFilters,
  SortOption,
  AssetClass,
  InvestmentType,
  TransactionType,
  PACPlanCreate
} from '../utils/AssetTypes';
import { 
  updateInvestmentMetrics,
  calculateAssetAllocation,
  calculateSectorAllocation,
  calculateTotalReturn,
  validateInvestment,
  validateTransaction,
  calculateNextPACPayment,
  shouldExecutePAC
} from '../utils/InvestmentUtils';
import mockData from '../utils/MockData';

interface UseInvestmentDataReturn {
  // State
  investments: Investment[];
  transactions: Transaction[];
  pacPlans: PACPlan[];
  portfolio: Portfolio;
  loading: boolean;
  error: string | null;
  
  // Filters & Sorting
  filters: InvestmentFilters;
  sortOption: SortOption;
  filteredInvestments: Investment[];
  
  // Actions - Investments
  addInvestment: (investment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateInvestment: (id: string, updates: Partial<Investment>) => Promise<boolean>;
  deleteInvestment: (id: string) => Promise<boolean>;
  
  // Actions - Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  
  // Actions - PAC Plans
  createPACPlan: (plan: PACPlanCreate) => Promise<boolean>;
  updatePACPlan: (id: string, updates: Partial<PACPlan>) => Promise<boolean>;
  pausePACPlan: (id: string) => Promise<boolean>;
  resumePACPlan: (id: string) => Promise<boolean>;
  deletePACPlan: (id: string) => Promise<boolean>;
  executePACPayment: (planId: string) => Promise<boolean>;
  
  // Actions - Filters
  setFilters: (filters: Partial<InvestmentFilters>) => void;
  setSortOption: (option: SortOption) => void;
  resetFilters: () => void;
  
  // Utilities
  refreshData: () => Promise<void>;
  exportData: () => string;
  getInvestmentById: (id: string) => Investment | undefined;
  getTransactionsByInvestment: (investmentId: string) => Transaction[];
}

const DEFAULT_FILTERS: InvestmentFilters = {
  assetClasses: [],
  investmentTypes: [],
  sectors: [],
  countries: [],
  showPacOnly: false,
  showActiveOnly: true
};

const DEFAULT_SORT: SortOption = {
  field: 'currentValue',
  direction: 'desc',
  label: 'Valore (Maggiore)'
};

export const useInvestmentData = (): UseInvestmentDataReturn => {
  const { addToast } = useToast();
  
  // Core State
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pacPlans, setPacPlans] = useState<PACPlan[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter State
  const [filters, setFiltersState] = useState<InvestmentFilters>(DEFAULT_FILTERS);
  const [sortOption, setSortOptionState] = useState<SortOption>(DEFAULT_SORT);

  // ==================== INITIALIZATION ====================
  
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simula caricamento API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Carica dati mock
      const mockDataSet = mockData.generateMockData();
      setInvestments(mockDataSet.investments);
      setTransactions(mockDataSet.transactions);
      setPacPlans(mockDataSet.pacPlans);
      setPortfolio(mockDataSet.portfolio);
      
      // Rimosso toast di caricamento - non necessario
    } catch (err) {
      setError('Errore nel caricamento dei dati');
      addToast('Errore nel caricamento dei dati', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==================== COMPUTED VALUES ====================

  // Filtra e ordina investimenti
  const filteredInvestments = useMemo(() => {
    let filtered = [...investments];

    // Applica filtri
    if (filters.assetClasses.length > 0) {
      filtered = filtered.filter(inv => filters.assetClasses.includes(inv.assetClass));
    }
    
    if (filters.investmentTypes.length > 0) {
      filtered = filtered.filter(inv => filters.investmentTypes.includes(inv.type));
    }
    
    if (filters.sectors.length > 0) {
      filtered = filtered.filter(inv => inv.sector && filters.sectors.includes(inv.sector));
    }
    
    if (filters.countries.length > 0) {
      filtered = filtered.filter(inv => inv.country && filters.countries.includes(inv.country));
    }
    
    if (filters.minValue) {
      filtered = filtered.filter(inv => inv.currentValue >= filters.minValue!);
    }
    
    if (filters.maxValue) {
      filtered = filtered.filter(inv => inv.currentValue <= filters.maxValue!);
    }
    
    if (filters.minReturn) {
      filtered = filtered.filter(inv => inv.totalReturnPercent >= filters.minReturn!);
    }
    
    if (filters.maxReturn) {
      filtered = filtered.filter(inv => inv.totalReturnPercent <= filters.maxReturn!);
    }
    
    if (filters.showPacOnly) {
      filtered = filtered.filter(inv => inv.type === InvestmentType.PAC);
    }
    
    if (filters.showActiveOnly) {
      filtered = filtered.filter(inv => inv.isActive);
    }

    // Applica ordinamento
    filtered.sort((a, b) => {
      const aVal = a[sortOption.field] as any;
      const bVal = b[sortOption.field] as any;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOption.direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOption.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

    return filtered;
  }, [investments, filters, sortOption]);

  // Ricalcola portfolio quando cambiano investimenti
  useEffect(() => {
    if (investments.length > 0 && portfolio) {
      updatePortfolioMetrics();
    }
  }, [investments]);

  // ==================== INVESTMENT ACTIONS ====================

  const addInvestment = useCallback(async (
    newInvestment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    try {
      const validation = validateInvestment(newInvestment);
      if (!validation.isValid) {
        addToast(`Errore: ${validation.errors[0]}`, 'error');
        return false;
      }

      const investment: Investment = {
        ...newInvestment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setInvestments(prev => [...prev, investment]);
      addToast(`Investimento "${investment.name}" aggiunto con successo`, 'success');
      return true;
    } catch (err) {
      addToast('Errore nell\'aggiunta dell\'investimento', 'error');
      return false;
    }
  }, [addToast]);

  const updateInvestment = useCallback(async (
    id: string, 
    updates: Partial<Investment>
  ): Promise<boolean> => {
    try {
      setInvestments(prev => prev.map(inv => 
        inv.id === id 
          ? { ...inv, ...updates, updatedAt: new Date().toISOString() }
          : inv
      ));
      
      const investment = investments.find(inv => inv.id === id);
      addToast(`Investimento "${investment?.name}" aggiornato con successo`, 'success');
      return true;
    } catch (err) {
      addToast('Errore nell\'aggiornamento dell\'investimento', 'error');
      return false;
    }
  }, [investments, addToast]);

  const deleteInvestment = useCallback(async (id: string): Promise<boolean> => {
    try {
      const investment = investments.find(inv => inv.id === id);
      if (!investment) {
        addToast('Investimento non trovato', 'error');
        return false;
      }

      // Controlla se ci sono transazioni collegate
      const relatedTransactions = transactions.filter(t => t.investmentId === id);
      if (relatedTransactions.length > 0) {
        addToast('Impossibile eliminare: ci sono transazioni collegate', 'warning');
        return false;
      }

      setInvestments(prev => prev.filter(inv => inv.id !== id));
      addToast(`Investimento "${investment.name}" eliminato con successo`, 'success');
      return true;
    } catch (err) {
      addToast('Errore nell\'eliminazione dell\'investimento', 'error');
      return false;
    }
  }, [investments, transactions, addToast]);

  // ==================== TRANSACTION ACTIONS ====================

  const addTransaction = useCallback(async (
    newTransaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    try {
      const validation = validateTransaction(newTransaction);
      if (!validation.isValid) {
        addToast(`Errore: ${validation.errors[0]}`, 'error');
        return false;
      }

      const transaction: Transaction = {
        ...newTransaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTransactions(prev => [...prev, transaction]);
      
      // Aggiorna metriche investimento
      await updateInvestmentFromTransaction(transaction);
      
      addToast('Transazione registrata con successo', 'success');
      return true;
    } catch (err) {
      addToast('Errore nella registrazione della transazione', 'error');
      return false;
    }
  }, [addToast]);

  const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
    try {
      const transaction = transactions.find(t => t.id === id);
      if (!transaction) {
        addToast('Transazione non trovata', 'error');
        return false;
      }

      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Ricalcola metriche investimento
      const investmentTransactions = transactions.filter(t => 
        t.investmentId === transaction.investmentId && t.id !== id
      );
      await recalculateInvestmentMetrics(transaction.investmentId, investmentTransactions);
      
      addToast('Transazione eliminata con successo', 'success');
      return true;
    } catch (err) {
      addToast('Errore nell\'eliminazione della transazione', 'error');
      return false;
    }
  }, [transactions, addToast]);

  // ==================== PAC ACTIONS ====================

  const createPACPlan = useCallback(async (plan: PACPlanCreate): Promise<boolean> => {
    try {
      const newPlan: PACPlan = {
        ...plan,
        id: Date.now().toString(),
        executedPayments: 0,
        totalInvested: 0,
        currentValue: 0,
        totalReturn: 0,
        totalReturnPercent: 0,
        avgBuyPrice: 0,
        nextPaymentDate: calculateNextPACPayment({ ...plan, id: '', executedPayments: 0, totalInvested: 0, currentValue: 0, totalReturn: 0, totalReturnPercent: 0, avgBuyPrice: 0, createdAt: '', updatedAt: '' }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setPacPlans(prev => [...prev, newPlan]);
      addToast(`PAC "${plan.name}" creato con successo`, 'success');
      return true;
    } catch (err) {
      addToast('Errore nella creazione del PAC', 'error');
      return false;
    }
  }, [addToast]);

  const updatePACPlan = useCallback(async (
    id: string, 
    updates: Partial<PACPlan>
  ): Promise<boolean> => {
    try {
      setPacPlans(prev => prev.map(plan => 
        plan.id === id 
          ? { ...plan, ...updates, updatedAt: new Date().toISOString() }
          : plan
      ));
      
      const plan = pacPlans.find(p => p.id === id);
      addToast(`PAC "${plan?.name}" aggiornato con successo`, 'success');
      return true;
    } catch (err) {
      addToast('Errore nell\'aggiornamento del PAC', 'error');
      return false;
    }
  }, [pacPlans, addToast]);

  const pausePACPlan = useCallback(async (id: string): Promise<boolean> => {
    try {
      await updatePACPlan(id, { isPaused: true });
      const plan = pacPlans.find(p => p.id === id);
      addToast(`PAC "${plan?.name}" messo in pausa`, 'info');
      return true;
    } catch (err) {
      addToast('Errore nella pausa del PAC', 'error');
      return false;
    }
  }, [updatePACPlan, pacPlans, addToast]);

  const resumePACPlan = useCallback(async (id: string): Promise<boolean> => {
    try {
      await updatePACPlan(id, { isPaused: false });
      const plan = pacPlans.find(p => p.id === id);
      addToast(`PAC "${plan?.name}" riattivato`, 'success');
      return true;
    } catch (err) {
      addToast('Errore nella riattivazione del PAC', 'error');
      return false;
    }
  }, [updatePACPlan, pacPlans, addToast]);

  const deletePACPlan = useCallback(async (id: string): Promise<boolean> => {
    try {
      const plan = pacPlans.find(p => p.id === id);
      if (!plan) {
        addToast('PAC non trovato', 'error');
        return false;
      }

      setPacPlans(prev => prev.filter(p => p.id !== id));
      addToast(`PAC "${plan.name}" eliminato con successo`, 'success');
      return true;
    } catch (err) {
      addToast('Errore nell\'eliminazione del PAC', 'error');
      return false;
    }
  }, [pacPlans, addToast]);

  const executePACPayment = useCallback(async (planId: string): Promise<boolean> => {
    try {
      const plan = pacPlans.find(p => p.id === planId);
      if (!plan || !shouldExecutePAC(plan)) {
        return false;
      }

      const investment = investments.find(inv => inv.id === plan.investmentId);
      if (!investment) {
        addToast('Investimento collegato non trovato', 'error');
        return false;
      }

      // Crea transazione PAC
      const shares = plan.monthlyAmount / investment.currentPrice;
      const transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
        investmentId: plan.investmentId,
        investmentName: plan.investmentName,
        investmentSymbol: plan.investmentSymbol,
        type: TransactionType.PAC_PAYMENT,
        shares,
        price: investment.currentPrice,
        amount: plan.monthlyAmount,
        fees: 0,
        totalAmount: plan.monthlyAmount,
        date: new Date().toISOString().split('T')[0],
        currency: investment.currency,
        isPacTransaction: true,
        pacPlanId: planId
      };

      await addTransaction(transaction);

      // Aggiorna PAC plan
      const nextPayment = calculateNextPACPayment(plan, new Date().toISOString().split('T')[0]);
      await updatePACPlan(planId, {
        executedPayments: plan.executedPayments + 1,
        totalInvested: plan.totalInvested + plan.monthlyAmount,
        nextPaymentDate: nextPayment,
        lastPaymentDate: new Date().toISOString().split('T')[0]
      });

      addToast(`Versamento PAC "${plan.name}" eseguito con successo`, 'success');
      return true;
    } catch (err) {
      addToast('Errore nell\'esecuzione del versamento PAC', 'error');
      return false;
    }
  }, [pacPlans, investments, addTransaction, updatePACPlan, addToast]);

  // ==================== HELPER FUNCTIONS ====================

  const updateInvestmentFromTransaction = async (transaction: Transaction) => {
    const investment = investments.find(inv => inv.id === transaction.investmentId);
    if (!investment) return;

    const relatedTransactions = [...transactions, transaction].filter(t => 
      t.investmentId === transaction.investmentId
    );

    const totalPortfolioValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const updatedInvestment = updateInvestmentMetrics(investment, relatedTransactions, totalPortfolioValue);
    
    setInvestments(prev => prev.map(inv => 
      inv.id === transaction.investmentId ? updatedInvestment : inv
    ));
  };

  const recalculateInvestmentMetrics = async (investmentId: string, updatedTransactions: Transaction[]) => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment) return;

    const totalPortfolioValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const updatedInvestment = updateInvestmentMetrics(investment, updatedTransactions, totalPortfolioValue);
    
    setInvestments(prev => prev.map(inv => 
      inv.id === investmentId ? updatedInvestment : inv
    ));
  };

  const updatePortfolioMetrics = () => {
    if (!portfolio) return;

    const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
    const { absolute: totalReturn, percentage: totalReturnPercent } = calculateTotalReturn(totalValue, totalInvested);
    
    const assetAllocation = calculateAssetAllocation(investments);
    const sectorAllocation = calculateSectorAllocation(investments);

    setPortfolio(prev => prev ? {
      ...prev,
      totalValue,
      totalInvested,
      totalReturn,
      totalReturnPercent,
      assetAllocation,
      sectorAllocation,
      updatedAt: new Date().toISOString()
    } : null);
  };

  // ==================== FILTER ACTIONS ====================

  const setFilters = useCallback((newFilters: Partial<InvestmentFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const setSortOption = useCallback((option: SortOption) => {
    setSortOptionState(option);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setSortOptionState(DEFAULT_SORT);
  }, []);

  // ==================== UTILITY FUNCTIONS ====================

  const refreshData = useCallback(async () => {
    await initializeData();
  }, []);

  const exportData = useCallback(() => {
    // Implementa export CSV
    const csvHeaders = ['Nome', 'Simbolo', 'Valore', 'Rendimento'];
    const csvRows = investments.map(inv => 
      [inv.name, inv.symbol, inv.currentValue.toString(), inv.totalReturnPercent.toString()]
    );
    
    return [csvHeaders, ...csvRows]
      .map(row => row.join(','))
      .join('\n');
  }, [investments]);

  const getInvestmentById = useCallback((id: string) => {
    return investments.find(inv => inv.id === id);
  }, [investments]);

  const getTransactionsByInvestment = useCallback((investmentId: string) => {
    return transactions.filter(t => t.investmentId === investmentId);
  }, [transactions]);

  // ==================== RETURN ====================

  return {
    // State
    investments,
    transactions,
    pacPlans,
    portfolio: portfolio!,
    loading,
    error,
    
    // Filtered Data
    filters,
    sortOption,
    filteredInvestments,
    
    // Investment Actions
    addInvestment,
    updateInvestment,
    deleteInvestment,
    
    // Transaction Actions
    addTransaction,
    deleteTransaction,
    
    // PAC Actions
    createPACPlan,
    updatePACPlan,
    pausePACPlan,
    resumePACPlan,
    deletePACPlan,
    executePACPayment,
    
    // Filter Actions
    setFilters,
    setSortOption,
    resetFilters,
    
    // Utilities
    refreshData,
    exportData,
    getInvestmentById,
    getTransactionsByInvestment
  };
};