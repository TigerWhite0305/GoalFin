// src/hooks/useAdvancedCharts.ts
import { useState, useCallback, useRef } from 'react';
import { useToast } from '../context/ToastContext';

interface FilterState {
  globalPeriod: '1M' | '3M' | '6M' | '1Y' | 'ALL';
  dateRange: { start: string; end: string } | null;
  expenseCategories: string[];
  expenseChartType: 'pie' | 'bar';
  expenseMinAmount: number;
  expenseMaxAmount: number;
  trendsMetrics: ('entrate' | 'uscite' | 'bilancio' | 'risparmio')[];
  trendsSmoothing: boolean;
  areaChartComponents: ('conti' | 'investimenti' | 'obiettivo')[];
  areaChartView: 'cumulative' | 'monthly';
  heatmapMonth: string;
  heatmapIntensity: 'low' | 'medium' | 'high' | 'all';
  goalsPriority: ('alta' | 'media' | 'bassa')[];
  goalsStatus: ('completed' | 'onTrack' | 'delayed' | 'all')[];
  goalsCategory: string[];
  categoryView: 'percentage' | 'amount';
  categoryLimit: number;
}

interface ExportConfig {
  chartId: string;
  chartName: string;
  availableFormats: readonly ('PNG' | 'SVG' | 'PDF' | 'CSV' | 'JSON' | 'Excel')[];
  data: any;
  chartRef?: React.RefObject<HTMLElement | null>;
}

interface ExportOptions {
  format: string;
  fileName: string;
  includeHeader: boolean;
  includeTimestamp: boolean;
  quality: 'low' | 'medium' | 'high';
  backgroundColor: 'transparent' | 'white' | 'dark';
  dimensions: { width: number; height: number } | 'auto';
  dataRange: 'visible' | 'all' | 'filtered';
  compression: boolean;
}

const useAdvancedCharts = () => {
  const { addToast } = useToast();
  
  // State per filtri
  const [filters, setFilters] = useState<FilterState>({
    globalPeriod: '6M',
    dateRange: null,
    expenseCategories: ['Casa', 'Cibo', 'Trasporti', 'Shopping', 'Salute', 'Altro'],
    expenseChartType: 'pie',
    expenseMinAmount: 0,
    expenseMaxAmount: 10000,
    trendsMetrics: ['entrate', 'uscite', 'bilancio', 'risparmio'],
    trendsSmoothing: false,
    areaChartComponents: ['conti', 'investimenti', 'obiettivo'],
    areaChartView: 'cumulative',
    heatmapMonth: new Date().toISOString().slice(0, 7),
    heatmapIntensity: 'all',
    goalsPriority: ['alta', 'media', 'bassa'],
    goalsStatus: ['onTrack', 'delayed'],
    goalsCategory: [],
    categoryView: 'percentage',
    categoryLimit: 6
  });

  // State per modali
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentExportConfig, setCurrentExportConfig] = useState<ExportConfig | null>(null);

  // Refs per i grafici - tipo più flessibile
  const chartRefs = useRef<Record<string, React.RefObject<HTMLElement | null>>>({});

  // Funzioni per filtri
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    addToast('Filtri aggiornati', 'info');
  }, [addToast]);

  const resetFilters = useCallback(() => {
    setFilters({
      globalPeriod: '6M',
      dateRange: null,
      expenseCategories: ['Casa', 'Cibo', 'Trasporti', 'Shopping', 'Salute', 'Altro'],
      expenseChartType: 'pie',
      expenseMinAmount: 0,
      expenseMaxAmount: 10000,
      trendsMetrics: ['entrate', 'uscite', 'bilancio', 'risparmio'],
      trendsSmoothing: false,
      areaChartComponents: ['conti', 'investimenti', 'obiettivo'],
      areaChartView: 'cumulative',
      heatmapMonth: new Date().toISOString().slice(0, 7),
      heatmapIntensity: 'all',
      goalsPriority: ['alta', 'media', 'bassa'],
      goalsStatus: ['onTrack', 'delayed'],
      goalsCategory: [],
      categoryView: 'percentage',
      categoryLimit: 6
    });
    addToast('Filtri ripristinati ai valori predefiniti', 'success');
  }, [addToast]);

  const applyFilters = useCallback(() => {
    // Qui implementerai la logica per applicare i filtri ai dati
    addToast('Filtri applicati con successo', 'success');
  }, [addToast]);

  // Funzioni per export
  const openExportModal = useCallback((config: ExportConfig) => {
    setCurrentExportConfig(config);
    setShowExportModal(true);
  }, []);

  const quickExport = useCallback(async (chartId: string, format: string) => {
    try {
      const chartRef = chartRefs.current[chartId];
      
      switch (format) {
        case 'PNG':
          await exportToPNG(chartRef, chartId);
          break;
        case 'CSV':
          await exportToCSV(chartId);
          break;
        case 'JSON':
          await exportToJSON(chartId);
          break;
        case 'PDF':
          await exportToPDF(chartRef, chartId);
          break;
        default:
          throw new Error(`Formato ${format} non supportato`);
      }
      
      addToast(`Esportazione ${format} completata!`, 'success');
    } catch (error) {
      addToast(`Errore durante l'esportazione: ${error}`, 'error');
    }
  }, [addToast]);

  const advancedExport = useCallback(async (format: string, options: ExportOptions) => {
    try {
      const chartId = currentExportConfig?.chartId;
      if (!chartId) throw new Error('Configurazione export non trovata');

      switch (format) {
        case 'PNG':
        case 'SVG':
        case 'PDF':
          await exportImage(chartId, format, options);
          break;
        case 'CSV':
        case 'JSON':
        case 'Excel':
          await exportData(chartId, format, options);
          break;
        default:
          throw new Error(`Formato ${format} non supportato`);
      }
      
      addToast(`Export ${format} completato: ${options.fileName}`, 'success');
      setShowExportModal(false);
    } catch (error) {
      addToast(`Errore durante l'export avanzato: ${error}`, 'error');
    }
  }, [currentExportConfig, addToast]);

  // Funzioni di export specifiche
  const exportToPNG = async (chartRef: React.RefObject<HTMLElement> | undefined, chartId: string) => {
    if (!chartRef?.current) throw new Error('Riferimento al grafico non trovato');
    
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true
    });
    
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chartId}_${new Date().toISOString().split('T')[0]}.png`;
    link.click();
  };

  const exportToCSV = async (chartId: string) => {
    // Implementa logica specifica per ogni grafico
    const data = getChartData(chartId);
    const csvContent = convertToCSV(data);
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chartId}_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = async (chartId: string) => {
    const data = getChartData(chartId);
    const jsonData = {
      chartId,
      exportDate: new Date().toISOString(),
      filters: filters,
      data: data
    };
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chartId}_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = async (chartRef: React.RefObject<HTMLElement> | undefined, chartId: string) => {
    // Implementa export PDF con jsPDF o similar
    throw new Error('Export PDF non ancora implementato');
  };

  const exportImage = async (chartId: string, format: string, options: ExportOptions) => {
    // Implementa export immagini avanzato
    const chartRef = chartRefs.current[chartId];
    if (!chartRef?.current) throw new Error('Riferimento al grafico non trovato');
    
    // Implementa logica basata su options (qualità, dimensioni, sfondo, etc.)
    await exportToPNG(chartRef, chartId);
  };

  const exportData = async (chartId: string, format: string, options: ExportOptions) => {
    // Implementa export dati avanzato
    switch (format) {
      case 'CSV':
        await exportToCSV(chartId);
        break;
      case 'JSON':
        await exportToJSON(chartId);
        break;
      case 'Excel':
        // Implementa export Excel
        throw new Error('Export Excel non ancora implementato');
      default:
        throw new Error(`Formato dati ${format} non supportato`);
    }
  };

  // Utility functions
  const getChartData = (chartId: string) => {
    // Implementa logica per ottenere dati specifici del grafico
    // Questa funzione dovrebbe restituire i dati filtrati per il grafico specifico
    switch (chartId) {
      case 'expense-chart':
        return getFilteredExpenseData();
      case 'trends-chart':
        return getFilteredTrendsData();
      case 'goals-chart':
        return getFilteredGoalsData();
      // ... altri casi
      default:
        return [];
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    return csvContent;
  };

  const getFilteredExpenseData = () => {
    // Implementa logica per filtrare dati spese
    return [];
  };

  const getFilteredTrendsData = () => {
    // Implementa logica per filtrare dati trend
    return [];
  };

  const getFilteredGoalsData = () => {
    // Implementa logica per filtrare dati obiettivi
    return [];
  };

  // Register chart ref - corretto per accettare tipi più flessibili
  const registerChartRef = useCallback((chartId: string, ref: React.RefObject<HTMLElement | null>) => {
    chartRefs.current[chartId] = ref as React.RefObject<HTMLElement>;
  }, []);

  return {
    // State
    filters,
    showAdvancedFilters,
    showExportModal,
    currentExportConfig,
    
    // Filter functions
    updateFilters,
    resetFilters,
    applyFilters,
    setShowAdvancedFilters,
    
    // Export functions
    openExportModal,
    quickExport,
    advancedExport,
    setShowExportModal,
    
    // Utility
    registerChartRef,
    
    // Data getters (con filtri applicati)
    getFilteredExpenseData,
    getFilteredTrendsData,
    getFilteredGoalsData
  };
};

export default useAdvancedCharts;