import React, { useRef } from "react";
import { Heart, Home, Car, Gamepad2, ShoppingCart, DollarSign, TrendingUp, Calendar, Filter, Download, BarChart3 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Import hook personalizzato e types
import useAdvancedCharts from "../hooks/useAdvancedCharts";

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

// Interface corrette
interface ExportConfig {
  chartId: string;
  chartName: string;
  availableFormats: readonly ('PNG' | 'SVG' | 'PDF' | 'CSV' | 'JSON' | 'Excel')[];
  data: any;
  chartRef?: React.RefObject<HTMLElement>;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  icon: React.ComponentType<any>;
}

const Statistics: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  // Refs per i grafici
  const expenseChartRef = useRef<HTMLDivElement>(null);
  const trendsChartRef = useRef<HTMLDivElement>(null);
  const areaChartRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const goalsChartRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

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

  // useEffect per registrazione refs
  React.useEffect(() => {
    registerChartRef('expense-chart', expenseChartRef as React.RefObject<HTMLElement>);
    registerChartRef('trends-chart', trendsChartRef as React.RefObject<HTMLElement>);
    registerChartRef('area-chart', areaChartRef as React.RefObject<HTMLElement>);
    registerChartRef('heatmap-chart', heatmapRef as React.RefObject<HTMLElement>);
    registerChartRef('goals-chart', goalsChartRef as React.RefObject<HTMLElement>);
    registerChartRef('category-breakdown', categoryRef as React.RefObject<HTMLElement>);
  }, [registerChartRef]);

  // Theme colors seguendo il design system GoalFin
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro
        background: {
          primary: "bg-gray-900", // #0A0B0F
          card: "bg-gray-800/40", // #161920
          secondary: "bg-gray-700" // #1F2937
        },
        text: {
          primary: "text-gray-50", // #F9FAFB
          secondary: "text-gray-300", // #D1D5DB
          muted: "text-gray-400", // #6B7280
          subtle: "text-gray-500" // #9CA3AF
        },
        colors: {
          indigo: "#6366F1", // Accent Primary
          emerald: "#10B981", // Accent Secondary
          amber: "#F59E0B", // Accent
          success: "#059669", // Success
          error: "#DC2626", // Error
          warning: "#D97706", // Warning
          info: "#0284C7" // Info
        },
        border: "border-gray-700/30",
        accent: "from-indigo-500 via-purple-500 to-teal-400",
        hover: "hover:bg-gray-700/40"
      };
    } else {
      return {
        // ☀️ Tema Chiaro
        background: {
          primary: "bg-white", // #FEFEFE
          card: "bg-gray-50/60", // #F8FAFC
          secondary: "bg-gray-100" // #F1F5F9
        },
        text: {
          primary: "text-gray-900", // #0F172A
          secondary: "text-gray-700", // #334155
          muted: "text-gray-600", // #64748B
          subtle: "text-gray-500"
        },
        colors: {
          indigo: "#6366F1",
          emerald: "#10B981",
          amber: "#F59E0B",
          success: "#059669",
          error: "#DC2626",
          warning: "#D97706",
          info: "#0284C7"
        },
        border: "border-gray-200/50",
        accent: "from-indigo-500 via-purple-500 to-teal-400",
        hover: "hover:bg-gray-100/80"
      };
    }
  };

  const theme = getThemeColors();

  // Dati delle categorie con colori del design system GoalFin
  const getFilteredData = (): ChartData[] => {
    const baseExpenseData: ChartData[] = [
      { name: "Casa", value: 1200, color: "#7C3AED", icon: Home, percentage: 0 }, // Casa
      { name: "Cibo", value: 650, color: "#EA580C", icon: DollarSign, percentage: 0 }, // Cibo
      { name: "Trasporti", value: 420, color: "#0284C7", icon: Car, percentage: 0 }, // Trasporti
      { name: "Intrattenimento", value: 380, color: "#C026D3", icon: Gamepad2, percentage: 0 }, // Intrattenimento
      { name: "Salute", value: 280, color: "#16A34A", icon: Heart, percentage: 0 }, // Salute
      { name: "Shopping", value: 320, color: "#DC2626", icon: ShoppingCart, percentage: 0 }, // Shopping
      { name: "Viaggio", value: 150, color: "#0891B2", icon: DollarSign, percentage: 0 }, // Viaggio
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTotalExpenses = () => expenseData.reduce((sum, item) => sum + item.value, 0);
  const totalExpenses = getTotalExpenses();

  // Custom Tooltip Component con tema
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = getTotalExpenses();
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      
      return (
        <div className={`${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-200'} bg-opacity-95 backdrop-blur-md border rounded-xl p-4 shadow-xl`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
            <p className={`${theme.text.primary} font-semibold`}>{data.name}</p>
          </div>
          <p className={theme.text.secondary}>
            Importo: <span className={`${theme.text.primary} font-bold`}>{formatCurrency(data.value)}</span>
          </p>
          <p className={theme.text.secondary}>
            Percentuale: <span className={`${theme.text.primary} font-bold`}>{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Configurazioni export
  const getExportConfig = (chartId: string, chartName: string): ExportConfig => {
    const getChartRef = (id: string): React.RefObject<HTMLElement> => {
      switch (id) {
        case 'expense-chart': return expenseChartRef as React.RefObject<HTMLElement>;
        case 'trends-chart': return trendsChartRef as React.RefObject<HTMLElement>;
        case 'area-chart': return areaChartRef as React.RefObject<HTMLElement>;
        case 'heatmap-chart': return heatmapRef as React.RefObject<HTMLElement>;
        case 'goals-chart': return goalsChartRef as React.RefObject<HTMLElement>;
        case 'category-breakdown': return categoryRef as React.RefObject<HTMLElement>;
        default: return expenseChartRef as React.RefObject<HTMLElement>;
      }
    };

    return {
      chartId,
      chartName,
      availableFormats: ['PNG', 'CSV', 'JSON', 'PDF'] as const,
      data: expenseData,
      chartRef: getChartRef(chartId)
    };
  };

  return (
    <div className={`min-h-screen ${theme.background.primary} transition-colors duration-300`}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        
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
              <h2 className={`text-xl md:text-2xl font-bold ${theme.text.primary}`}>Analisi Spese</h2>
            </div>
            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6 w-full items-start">
              <div className="2xl:col-span-2 w-full relative">
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
                <div ref={categoryRef}>
                  <CategoryBreakdown
                    data={expenseData}
                    formatCurrency={formatCurrency}
                    getTotalExpenses={getTotalExpenses}
                    selectedPeriod={filters.globalPeriod}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sezione 2: Trend e Crescita */}
          <section className="w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></div>
              <h2 className={`text-xl md:text-2xl font-bold ${theme.text.primary}`}>Trend e Crescita</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full items-start">
              <div className="w-full relative">        
                <div ref={trendsChartRef}>
                  <TrendsLineChart
                    formatCurrency={formatCurrency}
                    selectedPeriod={filters.globalPeriod}
                  />
                </div>
              </div>
              
              <div className="w-full relative">
                <div ref={areaChartRef}>
                  <MonthlyAreaChart
                    formatCurrency={formatCurrency}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sezione 3: Analisi Avanzate */}
          <section className="w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></div>
              <h2 className={`text-xl md:text-2xl font-bold ${theme.text.primary}`}>Analisi Avanzate</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full items-start">
              <div className="w-full relative">
                <div ref={heatmapRef}>
                  <SpendingHeatmap
                    formatCurrency={formatCurrency}
                  />
                </div>
              </div>
              
              <div className="w-full relative">
                <div ref={goalsChartRef}>
                  <GoalsProgressChart
                    formatCurrency={formatCurrency}
                  />
                </div>
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