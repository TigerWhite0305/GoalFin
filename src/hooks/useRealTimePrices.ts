// src/hooks/useRealTimePrices.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import { 
  Investment, 
  MarketDataResponse, 
  AssetClass,
  Currency 
} from '../utils/AssetTypes';
import { formatCurrency, formatPercentage } from '../utils/InvestmentUtils';

interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  timestamp: string;
}

interface MarketStatus {
  isOpen: boolean;
  nextOpen?: string;
  nextClose?: string;
  timezone: string;
}

interface UseRealTimePricesReturn {
  // State
  prices: Map<string, PriceUpdate>;
  marketStatus: MarketStatus;
  isConnected: boolean;
  lastUpdate: string | null;
  error: string | null;
  
  // Actions
  subscribeTo: (symbols: string[]) => void;
  unsubscribeFrom: (symbols: string[]) => void;
  forceUpdate: (symbols?: string[]) => Promise<void>;
  startRealTime: () => void;
  stopRealTime: () => void;
  
  // Utilities
  getPriceForSymbol: (symbol: string) => PriceUpdate | null;
  getMarketDataForSymbol: (symbol: string) => MarketDataResponse | null;
  isMarketOpen: (symbol: string) => boolean;
  getUpdateFrequency: () => number;
}

interface MarketHours {
  [key: string]: {
    open: string;
    close: string;
    timezone: string;
    days: number[]; // 0 = Sunday, 1 = Monday, etc.
  };
}

// Orari di mercato per diverse borse
const MARKET_HOURS: MarketHours = {
  // Borse Europee (CET/CEST)
  'DE': { open: '09:00', close: '17:30', timezone: 'Europe/Berlin', days: [1, 2, 3, 4, 5] },
  'MI': { open: '09:00', close: '17:30', timezone: 'Europe/Rome', days: [1, 2, 3, 4, 5] },
  'PA': { open: '09:00', close: '17:30', timezone: 'Europe/Paris', days: [1, 2, 3, 4, 5] },
  'L': { open: '08:00', close: '16:30', timezone: 'Europe/London', days: [1, 2, 3, 4, 5] },
  
  // Borsa USA (EST/EDT)
  'US': { open: '09:30', close: '16:00', timezone: 'America/New_York', days: [1, 2, 3, 4, 5] },
  
  // Crypto (24/7)
  'CRYPTO': { open: '00:00', close: '23:59', timezone: 'UTC', days: [0, 1, 2, 3, 4, 5, 6] },
  
  // Forex (24/5)
  'FX': { open: '00:00', close: '23:59', timezone: 'UTC', days: [1, 2, 3, 4, 5] }
};

export const useRealTimePrices = (): UseRealTimePricesReturn => {
  const { addToast } = useToast();
  
  // State
  const [prices, setPrices] = useState<Map<string, PriceUpdate>>(new Map());
  const [marketStatus, setMarketStatus] = useState<MarketStatus>({
    isOpen: false,
    timezone: 'Europe/Rome'
  });
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const subscribedSymbols = useRef<Set<string>>(new Set());
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const updateFrequencyRef = useRef<number>(30000); // 30 secondi default

  // ==================== MARKET STATUS ====================

  const getMarketInfoForSymbol = (symbol: string): { exchange: string; hours: typeof MARKET_HOURS[string] } => {
    // Determina la borsa dal simbolo
    if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('CRYPTO')) {
      return { exchange: 'CRYPTO', hours: MARKET_HOURS.CRYPTO };
    }
    
    if (symbol.includes('.DE') || symbol.includes('XETRA')) {
      return { exchange: 'DE', hours: MARKET_HOURS.DE };
    }
    
    if (symbol.includes('.MI') || symbol.includes('BORSA')) {
      return { exchange: 'MI', hours: MARKET_HOURS.MI };
    }
    
    if (symbol.includes('.PA') || symbol.includes('EURONEXT')) {
      return { exchange: 'PA', hours: MARKET_HOURS.PA };
    }
    
    if (symbol.includes('.L') || symbol.includes('LSE')) {
      return { exchange: 'L', hours: MARKET_HOURS.L };
    }
    
    // Default a USA per simboli senza suffisso
    return { exchange: 'US', hours: MARKET_HOURS.US };
  };

  const isMarketOpen = useCallback((symbol: string): boolean => {
    const { hours } = getMarketInfoForSymbol(symbol);
    const now = new Date();
    const currentDay = now.getDay();
    
    // Controlla se oggi è un giorno di trading
    if (!hours.days.includes(currentDay)) {
      return false;
    }
    
    // Per crypto e forex, sempre aperti nei giorni specificati
    if (hours.open === '00:00' && hours.close === '23:59') {
      return true;
    }
    
    // Controlla orari specifici
    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMin;
    const openTimeInMinutes = openHour * 60 + openMin;
    const closeTimeInMinutes = closeHour * 60 + closeMin;
    
    return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
  }, []);

  const updateMarketStatus = useCallback(() => {
    // Determina lo status generale del mercato basato sui simboli sottoscritti
    const symbols = Array.from(subscribedSymbols.current);
    const openMarkets = symbols.filter(symbol => isMarketOpen(symbol));
    
    setMarketStatus({
      isOpen: openMarkets.length > 0,
      timezone: 'Europe/Rome'
    });
  }, [isMarketOpen]);

  // ==================== PRICE SIMULATION ====================

  const generatePriceUpdate = (symbol: string, currentPrice?: number): PriceUpdate => {
    // Simula variazioni realistiche dei prezzi
    const basePrice = currentPrice || getBasePrice(symbol);
    
    // Volatilità per tipo di asset
    const volatility = getVolatilityForSymbol(symbol);
    
    // Genera variazione casuale con bias leggermente positivo
    const randomChange = (Math.random() - 0.45) * volatility;
    const newPrice = basePrice * (1 + randomChange / 100);
    
    const change = newPrice - basePrice;
    const changePercent = basePrice > 0 ? (change / basePrice) * 100 : 0;
    
    // Simula volume
    const baseVolume = getBaseVolume(symbol);
    const volumeVariation = Math.random() * 0.4 + 0.8; // 80% - 120% del volume base
    const volume = Math.floor(baseVolume * volumeVariation);

    return {
      symbol,
      price: Number(newPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume,
      timestamp: new Date().toISOString()
    };
  };

  const getBasePrice = (symbol: string): number => {
    // Prezzi base realistici per diversi asset
    const basePrices: { [key: string]: number } = {
      'VWCE.DE': 108.45,
      'SWDA.MI': 89.12,
      'AAPL': 195.67,
      'MSFT': 420.15,
      'GOOGL': 2850.30,
      'TSLA': 245.80,
      'VECP.DE': 52.34,
      'BTC-EUR': 58750.25,
      'ETH-EUR': 3420.80,
      'EURUSD': 1.0875
    };
    
    return basePrices[symbol] || 100;
  };

  const getVolatilityForSymbol = (symbol: string): number => {
    // Volatilità giornaliera tipica per tipo di asset (in %)
    if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('CRYPTO')) {
      return 5.0; // Crypto molto volatile
    }
    
    if (symbol.includes('TSLA') || symbol.includes('NVDA')) {
      return 3.0; // Tech stocks volatili
    }
    
    if (symbol.includes('AAPL') || symbol.includes('MSFT') || symbol.includes('GOOGL')) {
      return 2.0; // Large cap stocks
    }
    
    if (symbol.includes('ETF') || symbol.includes('.DE') || symbol.includes('.MI')) {
      return 1.0; // ETF meno volatili
    }
    
    if (symbol.includes('BOND') || symbol.includes('VECP')) {
      return 0.3; // Obbligazioni molto stabili
    }
    
    if (symbol.includes('USD') || symbol.includes('EUR')) {
      return 0.5; // Forex
    }
    
    return 1.5; // Default
  };

  const getBaseVolume = (symbol: string): number => {
    // Volume base per tipo di asset
    const baseVolumes: { [key: string]: number } = {
      'VWCE.DE': 250000,
      'SWDA.MI': 180000,
      'AAPL': 45000000,
      'MSFT': 25000000,
      'GOOGL': 1200000,
      'TSLA': 35000000,
      'VECP.DE': 12000,
      'BTC-EUR': 1500000000,
      'ETH-EUR': 800000000
    };
    
    return baseVolumes[symbol] || 100000;
  };

  // ==================== DATA FETCHING ====================

  const fetchPriceUpdates = useCallback(async (symbols: string[]): Promise<void> => {
    try {
      setError(null);
      
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      const updates = new Map<string, PriceUpdate>();
      
      symbols.forEach(symbol => {
        const currentPrice = prices.get(symbol)?.price;
        const update = generatePriceUpdate(symbol, currentPrice);
        updates.set(symbol, update);
      });
      
      setPrices(prev => {
        const newPrices = new Map(prev);
        updates.forEach((update, symbol) => {
          newPrices.set(symbol, update);
        });
        return newPrices;
      });
      
      setLastUpdate(new Date().toISOString());
      setIsConnected(true);
      
    } catch (err) {
      setError('Errore nel recupero dei prezzi');
      setIsConnected(false);
      
      // Retry con backoff esponenziale
      const retryDelay = Math.min(1000 * Math.pow(2, Math.random() * 3), 10000);
      retryTimeoutRef.current = setTimeout(() => {
        fetchPriceUpdates(symbols);
      }, retryDelay);
    }
  }, [prices]);

  // ==================== SUBSCRIPTION MANAGEMENT ====================

  const subscribeTo = useCallback((symbols: string[]) => {
    symbols.forEach(symbol => {
      subscribedSymbols.current.add(symbol);
    });
    
    // Fetch immediato per i nuovi simboli
    fetchPriceUpdates(symbols);
    updateMarketStatus();
  }, [fetchPriceUpdates, updateMarketStatus]);

  const unsubscribeFrom = useCallback((symbols: string[]) => {
    symbols.forEach(symbol => {
      subscribedSymbols.current.delete(symbol);
    });
    
    // Rimuovi prezzi per simboli non più sottoscritti
    setPrices(prev => {
      const newPrices = new Map(prev);
      symbols.forEach(symbol => {
        newPrices.delete(symbol);
      });
      return newPrices;
    });
    
    updateMarketStatus();
  }, [updateMarketStatus]);

  const forceUpdate = useCallback(async (symbols?: string[]): Promise<void> => {
    const targetSymbols = symbols || Array.from(subscribedSymbols.current);
    if (targetSymbols.length > 0) {
      await fetchPriceUpdates(targetSymbols);
    }
  }, [fetchPriceUpdates]);

  // ==================== REAL-TIME CONTROL ====================

  const startRealTime = useCallback(() => {
    if (intervalRef.current) return;

    // Aggiorna frequenza basata sullo stato del mercato
    const updateFrequency = () => {
      const symbols = Array.from(subscribedSymbols.current);
      const hasOpenMarkets = symbols.some(symbol => isMarketOpen(symbol));
      
      // Più frequente durante le ore di mercato
      return hasOpenMarkets ? 15000 : 60000; // 15s vs 60s
    };

    const runUpdate = () => {
      const symbols = Array.from(subscribedSymbols.current);
      if (symbols.length > 0) {
        fetchPriceUpdates(symbols);
      }
      updateMarketStatus();
      
      // Schedula prossimo update con frequenza dinamica
      updateFrequencyRef.current = updateFrequency();
      intervalRef.current = setTimeout(runUpdate, updateFrequencyRef.current);
    };

    runUpdate();
    setIsConnected(true);
  }, [fetchPriceUpdates, updateMarketStatus, isMarketOpen]);

  const stopRealTime = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    setIsConnected(false);
  }, []);

  // ==================== UTILITY FUNCTIONS ====================

  const getPriceForSymbol = useCallback((symbol: string): PriceUpdate | null => {
    return prices.get(symbol) || null;
  }, [prices]);

  const getMarketDataForSymbol = useCallback((symbol: string): MarketDataResponse | null => {
    const priceUpdate = prices.get(symbol);
    if (!priceUpdate) return null;

    return {
      symbol,
      name: symbol, // In una implementazione reale, mapperesti il nome
      price: priceUpdate.price,
      previousClose: priceUpdate.price - priceUpdate.change,
      change: priceUpdate.change,
      changePercent: priceUpdate.changePercent,
      currency: 'EUR', // Default, dovrebbe essere determinato dal simbolo
      timestamp: priceUpdate.timestamp,
      volume: priceUpdate.volume
    };
  }, [prices]);

  const getUpdateFrequency = useCallback((): number => {
    return updateFrequencyRef.current;
  }, []);

  // ==================== EFFECTS ====================

  // Auto-start quando ci sono simboli sottoscritti
  useEffect(() => {
    if (subscribedSymbols.current.size > 0 && !intervalRef.current) {
      startRealTime();
    } else if (subscribedSymbols.current.size === 0 && intervalRef.current) {
      stopRealTime();
    }
    
    return () => {
      stopRealTime();
    };
  }, [startRealTime, stopRealTime]);

  // Aggiorna status mercato ogni minuto
  useEffect(() => {
    const marketStatusInterval = setInterval(updateMarketStatus, 60000);
    updateMarketStatus(); // Chiamata iniziale
    
    return () => clearInterval(marketStatusInterval);
  }, [updateMarketStatus]);

  // Notifica toast per grandi variazioni
  useEffect(() => {
    prices.forEach((update, symbol) => {
      if (Math.abs(update.changePercent) > 5) {
        const direction = update.changePercent > 0 ? 'aumentato' : 'diminuito';
        const color = update.changePercent > 0 ? 'success' : 'warning';
        
        addToast(
          `${symbol} ${direction} del ${formatPercentage(Math.abs(update.changePercent))}`,
          color
        );
      }
    });
  }, [prices, addToast]);

  // ==================== CLEANUP ====================

  useEffect(() => {
    return () => {
      stopRealTime();
    };
  }, [stopRealTime]);

  // ==================== RETURN ====================

  return {
    // State
    prices,
    marketStatus,
    isConnected,
    lastUpdate,
    error,
    
    // Actions
    subscribeTo,
    unsubscribeFrom,
    forceUpdate,
    startRealTime,
    stopRealTime,
    
    // Utilities
    getPriceForSymbol,
    getMarketDataForSymbol,
    isMarketOpen,
    getUpdateFrequency
  };
};