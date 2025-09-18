// src/pages/Statistics.tsx
import React, { useRef } from "react";
import { Heart, Home, Car, Gamepad2, ShoppingCart, DollarSign } from "lucide-react";

// Import hook personalizzato e types
import useAdvancedCharts from "../hooks/useAdvancedCharts";

// Types locali per evitare import ciclici
interface ExportConfig {
  chartId: string;
  chartName: string;
  availableFormats: readonly ('PNG' | 'SVG' | 'PDF' | 'CSV' | 'JSON' | 'Excel')[];
  data: any;
  chartRef?: React.RefObject<HTMLElement | null>;
}

// Import componenti UI
import StatisticsHeader from "../components/statistics/StatisticsHeader";
import AdvancedFiltersDashboard from "../components/statistics/AdvancedFiltersDashboard";
import GranularExportSystem from "../components/statistics/GranularExportSystem";

// Import grafici
import ExpenseChart from "../components/statistics/chart/ExpenseChart";
import CategoryBreakdown from "../components/statistics/chart/CategoryBreakdown";
import TrendsLineChart from "../components/statistics/chart/TrendsLineChart";
import MonthlyAreaChart from "../components/statistics/chart/MonthlyAreaChart";
import SpendingHeatmap from "../components/statistics/chart/SpendingHeatmap";
import GoalsProgressChart from "../components/statistics/chart/GoalsProgressChart";
import ChartHoverExport from "../components/statistics/ChartHoverExport";

const Statistics: React.FC = () => {
  // Refs per i grafici - corretti per HTMLElement
  const expenseChartRef = useRef<HTMLElement>(null);
  const trendsChartRef = useRef<HTMLElement>(null);
  const areaChartRef = useRef<HTMLElement>(null);
  const heatmapRef = useRef<HTMLElement>(null);
  const goalsChartRef = useRef<HTMLElement>(null);
  const categoryRef = useRef<HTMLElement>(null);

  // Hook sistema avanzato
  const {
    filters,
    showAdvancedFilters,
    showExportModal,
    currentExportConfig,
    updateFilters,
    resetFilters,
    applyFilters,
    setShowAdvancedFilters,
    openExportModal,
    quickExport,
    advancedExport,
    setShowExportModal,
    registerChartRef,
    getFilteredExpenseData,
    getFilteredTrendsData,
    getFilteredGoalsData
  } = useAdvancedCharts();

  // Registra i ref dei grafici
  React.useEffect(() => {
    registerChartRef('expense-chart', expenseChartRef);
    registerChartRef('trends-chart', trendsChartRef);
    registerChartRef('area-chart', areaChartRef);
    registerChartRef('heatmap-chart', heatmapRef);
    registerChartRef('goals-chart', goalsChartRef);
    registerChartRef('category-breakdown', categoryRef);
  }, [registerChartRef]);

  // Dati dinamici basati sui filtri
  const getFilteredData = () => {
    const baseExpenseData = [
      { name: "Casa", value: 1200, color: "#4C6FFF", icon: Home },
      { name: "Cibo", value: 650, color: "#FF6B6B", icon: DollarSign },
      { name: "Trasporti", value: 420, color: "#FFD93D", icon: Car },
      { name: "Intrattenimento", value: 380, color: "#6BCB77", icon: Gamepad2 },
      { name: "Salute", value: 280, color: "#FF9F1C", icon: Heart },
      { name: "Shopping", value: 320, color: "#9B5DE5", icon: ShoppingCart },
      { name: "Altro", value: 150, color: "#06D6A0", icon: DollarSign },
    ];

    // Applica filtri del sistema avanzato
    let filteredData = baseExpenseData;

    // Filtra per categorie se specificate
    if (filters.expenseCategories.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.expenseCategories.includes(item.name)
      );
    }

    // Filtra per range importi
    filteredData = filteredData.filter(item => 
      item.value >= filters.expenseMinAmount && 
      item.value <= filters.expenseMaxAmount
    );

    // Applica moltiplicatore periodo
    const periodMultiplier = filters.globalPeriod === '1M' ? 0.5 : 
                            filters.globalPeriod === '3M' ? 0.8 : 
                            filters.globalPeriod === '6M' ? 1 : 
                            filters.globalPeriod === '1Y' ? 1.5 : 2;

    const processedData = filteredData.map(item => ({
      ...item,
      value: Math.round(item.value * periodMultiplier)
    }));

    const total = processedData.reduce((sum, item) => sum + item.value, 0);
    return processedData.map(item => ({
      ...item,
      percentage: total > 0 ? parseFloat(((item.value / total) * 100).toFixed(1)) : 0
    }));
  };

  const expenseData = getFilteredData();

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTotalExpenses = () => expenseData.reduce((sum, item) => sum + item.value, 0);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = getTotalExpenses();
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-gray-800/95 border border-gray-600 rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
            <p className="text-white font-semibold">{data.name}</p>
          </div>
          <p className="text-gray-300">
            Importo: <span className="text-white font-bold">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-gray-300">
            Percentuale: <span className="text-white font-bold">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Configurazioni export per ogni grafico
  const getExportConfig = (chartId: string, chartName: string): ExportConfig => ({
    chartId,
    chartName,
    availableFormats: ['PNG', 'CSV', 'JSON', 'PDF'] as const,
    data: expenseData, // Qui dovresti passare i dati specifici del grafico
    chartRef: expenseChartRef // Qui il ref specifico del grafico
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="w-full p-4 lg:p-6">
        
        {/* Header con sistema avanzato */}
        <div className="mb-8">
          <StatisticsHeader
            selectedPeriod={filters.globalPeriod}
            onPeriodChange={(period) => updateFilters({ globalPeriod: period })}
            onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            onToggleSettings={() => {/* Mantieni logica settings esistente se necessaria */}}
            onShowExportModal={() => openExportModal(getExportConfig('global', 'Dashboard Completa'))}
          />
        </div>

        {/* Charts Grid Layout con Export Hover */}
        <div className="space-y-12">
          
          {/* Sezione 1: Grafici Principali Spese */}
          <section className="w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">Analisi Spese</h2>
            </div>
            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6 w-full items-start">
              <div className="2xl:col-span-2 w-full relative">
                {/* Hover Export per ExpenseChart */}
                <ChartHoverExport
                  chartId="expense-chart"
                  chartName="Grafico Spese"
                  availableFormats={['PNG', 'CSV', 'JSON', 'PDF']}
                  onQuickExport={(format) => quickExport('expense-chart', format)}
                  onAdvancedExport={() => openExportModal(getExportConfig('expense-chart', 'Grafico Spese'))}
                />
                
                <ExpenseChart
                  ref={expenseChartRef}
                  data={expenseData}
                  chartType={filters.expenseChartType}
                  onChartTypeChange={(type) => updateFilters({ expenseChartType: type })}
                  formatCurrency={formatCurrency}
                  getTotalExpenses={getTotalExpenses}
                  customTooltip={CustomTooltip}
                />
              </div>
              
              <div className="2xl:col-span-1 w-full relative">
                {/* Hover Export per CategoryBreakdown */}
                <ChartHoverExport
                  chartId="category-breakdown"
                  chartName="Dettaglio Categorie"
                  availableFormats={['PNG', 'CSV', 'JSON']}
                  onQuickExport={(format) => quickExport('category-breakdown', format)}
                  onAdvancedExport={() => openExportModal(getExportConfig('category-breakdown', 'Dettaglio Categorie'))}
                />
                
                <CategoryBreakdown
                  ref={categoryRef}
                  data={expenseData}
                  formatCurrency={formatCurrency}
                  getTotalExpenses={getTotalExpenses}
                  selectedPeriod={filters.globalPeriod}
                />
              </div>
            </div>
          </section>

          {/* Sezione 2: Trend e Crescita */}
          <section className="w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">Trend e Crescita</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full items-start">
              <div className="w-full relative">
                <ChartHoverExport
                  chartId="trends-chart"
                  chartName="Trend Finanziario"
                  availableFormats={['PNG', 'CSV', 'JSON']}
                  onQuickExport={(format) => quickExport('trends-chart', format)}
                  onAdvancedExport={() => openExportModal(getExportConfig('trends-chart', 'Trend Finanziario'))}
                />
                
                <TrendsLineChart
                  ref={trendsChartRef}
                  formatCurrency={formatCurrency}
                  selectedPeriod={filters.globalPeriod}
                />
              </div>
              
              <div className="w-full relative">
                <ChartHoverExport
                  chartId="area-chart"
                  chartName="Crescita Patrimonio"
                  availableFormats={['PNG', 'CSV', 'JSON']}
                  onQuickExport={(format) => quickExport('area-chart', format)}
                  onAdvancedExport={() => openExportModal(getExportConfig('area-chart', 'Crescita Patrimonio'))}
                />
                
                <MonthlyAreaChart
                  ref={areaChartRef}
                  formatCurrency={formatCurrency}
                />
              </div>
            </div>
          </section>

          {/* Sezione 3: Analisi Avanzate */}
          <section className="w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">Analisi Avanzate</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full items-start">
              <div className="w-full relative">
                <ChartHoverExport
                  chartId="heatmap-chart"
                  chartName="Calendario Spese"
                  availableFormats={['PNG', 'CSV', 'JSON']}
                  onQuickExport={(format) => quickExport('heatmap-chart', format)}
                  onAdvancedExport={() => openExportModal(getExportConfig('heatmap-chart', 'Calendario Spese'))}
                />
                
                <SpendingHeatmap
                  ref={heatmapRef}
                  formatCurrency={formatCurrency}
                />
              </div>
              
              <div className="w-full relative">
                <ChartHoverExport
                  chartId="goals-chart"
                  chartName="Progresso Obiettivi"
                  availableFormats={['PNG', 'CSV', 'JSON', 'PDF']}
                  onQuickExport={(format) => quickExport('goals-chart', format)}
                  onAdvancedExport={() => openExportModal(getExportConfig('goals-chart', 'Progresso Obiettivi'))}
                />
                
                <GoalsProgressChart
                  ref={goalsChartRef}
                  formatCurrency={formatCurrency}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Dashboard Filtri Avanzati */}
        <AdvancedFiltersDashboard
          isOpen={showAdvancedFilters}
          onClose={() => setShowAdvancedFilters(false)}
          filters={filters}
          onFiltersChange={updateFilters}
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
        />

        {/* Sistema Export Granulare */}
        {currentExportConfig && (
          <GranularExportSystem
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            exportConfig={currentExportConfig}
            onExport={advancedExport}
          />
        )}
      </div>
    </div>
  );
};

export default Statistics;