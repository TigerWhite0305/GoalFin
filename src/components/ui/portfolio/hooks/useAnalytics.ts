// src/components/ui/portfolio/hooks/useAnalytics.ts
import { useState, useEffect, useRef } from 'react';
import { useToast } from '../../../../context/ToastContext';
import { getToken } from '../../../../utils/tokenStorage'; // Importa la funzione corretta

export interface TrendData {
  date: string;
  total: number;
  accounts: Record<string, number>;
}

export interface VariationData {
  hasData: boolean;
  currentTotal: number;
  lastMonthTotal: number;
  totalVariation?: number; // Reso opzionale
  variationsByType?: Record<string, {
    type: string;
    currentTotal: number;
    lastMonthTotal: number;
    variation: number;
    accountCount: number;
  }>; // Reso opzionale
  period: {
    current: string;
    previous: string;
  };
}

export interface CurrencyData {
  currencies: Array<{
    currency: string;
    totalBalance: number;
    accountCount: number;
    percentage: number;
    accounts: Array<{
      id: string;
      name: string;
      balance: number;
      type: string;
    }>;
  }>;
  totalValue: number;
  currencyCount: number;
}

export interface AnalyticsData {
  trends: {
    hasData: boolean;
    trends: TrendData[];
    accounts: Array<{
      id: string;
      name: string;
      color: string;
      type: string;
    }>;
    isDemo?: boolean;
  };
  variations: VariationData;
  currencies: CurrencyData;
  lastUpdated: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minuti

export const useAnalytics = (autoRefresh: boolean = true) => {
  const { addToast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);

  // States
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // API base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch analytics data
  const fetchAnalytics = async (showToast: boolean = false) => {
    const now = Date.now();
    
    // Check cache
    if (data && (now - lastFetchRef.current) < CACHE_DURATION) {
      return data;
    }

    try {
      if (!data) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      setError(null);

      const token = getToken(); // Usa la funzione del tuo sistema
      console.log('Token found:', token ? 'Yes' : 'No'); // Debug log
      
      if (!token) {
        throw new Error('Token di autenticazione mancante');
      }

      const response = await fetch(`${API_BASE}/analytics/overview`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessione scaduta');
        }
        throw new Error(`Errore ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Errore durante il caricamento analytics');
      }

      setData(result.data);
      lastFetchRef.current = now;
      
      if (showToast) {
        addToast('Analytics aggiornate', 'success');
      }

      return result.data;

    } catch (err: any) {
      console.error('Analytics fetch error:', err);
      setError(err.message);
      
      if (showToast) {
        addToast(`Errore: ${err.message}`, 'error');
      }
      
      throw err;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Manual refresh
  const refresh = async () => {
    lastFetchRef.current = 0; // Force refresh
    return await fetchAnalytics(true);
  };

  // Fetch individual endpoints (per ottimizzazioni future)
  const fetchTrends = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/analytics/trends`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Errore trends');
      
      const result = await response.json();
      return result.data;
    } catch (err: any) {
      console.error('Trends fetch error:', err);
      throw err;
    }
  };

  const fetchVariations = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/analytics/variations`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Errore variazioni');
      
      const result = await response.json();
      return result.data;
    } catch (err: any) {
      console.error('Variations fetch error:', err);
      throw err;
    }
  };

  const fetchCurrencies = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/analytics/currencies`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Errore valute');
      
      const result = await response.json();
      return result.data;
    } catch (err: any) {
      console.error('Currencies fetch error:', err);
      throw err;
    }
  };

  // Setup auto refresh
  useEffect(() => {
    if (autoRefresh && data) {
      intervalRef.current = setInterval(() => {
        fetchAnalytics(false); // Refresh silenzioso
      }, REFRESH_INTERVAL);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, data]);

  // Initial load
  useEffect(() => {
    fetchAnalytics(false);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Computed values
  const hasData = data && (
    data.trends.hasData || 
    data.variations.hasData || 
    data.currencies.currencies.length > 0
  );

  const isEmpty = data && (
    !data.trends.hasData && 
    !data.variations.hasData && 
    data.currencies.currencies.length === 0
  );

  const isDemo = data?.trends.isDemo || false;

  // Cache status
  const isCacheValid = data && (Date.now() - lastFetchRef.current) < CACHE_DURATION;
  const cacheAge = data ? Math.floor((Date.now() - lastFetchRef.current) / 1000) : 0;

  return {
    // Data
    data,
    hasData,
    isEmpty,
    isDemo,
    
    // Loading states
    isLoading,
    isRefreshing,
    error,
    
    // Cache info
    isCacheValid,
    cacheAge,
    lastUpdated: data?.lastUpdated,
    
    // Actions
    refresh,
    fetchAnalytics,
    
    // Individual fetchers
    fetchTrends,
    fetchVariations,
    fetchCurrencies,
  };
};