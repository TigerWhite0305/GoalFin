// src/components/statistics/AdvancedFiltersDashboard.tsx
import React, { useState } from 'react';
import { Filter, Calendar, Target, TrendingUp, Activity, MapPin, Settings, X, RotateCcw } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext";

interface FilterState {
  // Filtri globali
  globalPeriod: '1M' | '3M' | '6M' | '1Y' | 'ALL';
  dateRange: { start: string; end: string } | null;
  
  // Filtri per ExpenseChart
  expenseCategories: string[];
  expenseChartType: 'pie' | 'bar';
  expenseMinAmount: number;
  expenseMaxAmount: number;
  
  // Filtri per TrendsLineChart
  trendsMetrics: ('entrate' | 'uscite' | 'bilancio' | 'risparmio')[];
  trendsSmoothing: boolean;
  
  // Filtri per MonthlyAreaChart
  areaChartComponents: ('conti' | 'investimenti' | 'obiettivo')[];
  areaChartView: 'cumulative' | 'monthly';
  
  // Filtri per SpendingHeatmap
  heatmapMonth: string;
  heatmapIntensity: 'low' | 'medium' | 'high' | 'all';
  
  // Filtri per GoalsProgressChart
  goalsPriority: ('alta' | 'media' | 'bassa')[];
  goalsStatus: ('completed' | 'onTrack' | 'delayed' | 'all')[];
  goalsCategory: string[];
  
  // Filtri per CategoryBreakdown
  categoryView: 'percentage' | 'amount';
  categoryLimit: number;
}

interface AdvancedFiltersDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const AdvancedFiltersDashboard: React.FC<AdvancedFiltersDashboardProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters
}) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'global' | 'expense' | 'trends' | 'area' | 'heatmap' | 'goals'>('global');

  if (!isOpen) return null;

  // Theme colors seguendo il design system GoalFin
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro
        background: {
          backdrop: "bg-gray-900/80",
          modal: "bg-gray-800",
          card: "bg-gray-700/30",
          sidebar: "bg-gray-900/50",
          input: "bg-gray-700/50",
          gradient: "from-indigo-500 via-purple-500 to-teal-400"
        },
        text: {
          primary: "text-gray-50", // #F9FAFB
          secondary: "text-gray-300", // #D1D5DB
          muted: "text-gray-400", // #6B7280
          white: "text-white"
        },
        border: "border-gray-700/50",
        accent: {
          primary: "bg-indigo-500",
          hover: "hover:bg-gray-700/30",
          selected: "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300"
        }
      };
    } else {
      return {
        // ☀️ Tema Chiaro
        background: {
          backdrop: "bg-gray-900/60",
          modal: "bg-white",
          card: "bg-gray-100/50",
          sidebar: "bg-gray-50",
          input: "bg-white",
          gradient: "from-indigo-500 via-purple-500 to-teal-400"
        },
        text: {
          primary: "text-gray-900", // #0F172A
          secondary: "text-gray-700", // #334155
          muted: "text-gray-600", // #64748B
          white: "text-white"
        },
        border: "border-gray-200",
        accent: {
          primary: "bg-indigo-500",
          hover: "hover:bg-gray-200/60",
          selected: "bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-400 text-indigo-700"
        }
      };
    }
  };

  const theme = getThemeColors();

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <div className={`fixed inset-0 ${theme.background.backdrop} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`${theme.background.modal} border ${theme.border} rounded-3xl w-full max-w-5xl h-[75vh] shadow-2xl flex flex-col overflow-hidden`}>
        
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${theme.background.gradient} p-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Dashboard Filtri Avanzati
                </h2>
                <p className="text-white/80 text-xs">Configura ogni grafico individualmente</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className={`w-48 ${theme.background.sidebar} border-r ${theme.border} p-3`}>
            <div className="space-y-1">
              {[
                { id: 'global', icon: Calendar, label: 'Globali', desc: 'Periodo e data' },
                { id: 'expense', icon: Activity, label: 'Spese', desc: 'Categorie e tipo' },
                { id: 'trends', icon: TrendingUp, label: 'Trend', desc: 'Metriche e vista' },
                { id: 'area', icon: TrendingUp, label: 'Crescita', desc: 'Componenti' },
                { id: 'heatmap', icon: MapPin, label: 'Heatmap', desc: 'Mese e intensità' },
                { id: 'goals', icon: Target, label: 'Obiettivi', desc: 'Priorità e stato' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full p-2 rounded-lg text-left transition-all duration-200 text-xs ${
                    activeTab === tab.id
                      ? theme.accent.selected
                      : `${theme.accent.hover} ${theme.text.muted} hover:text-white`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <tab.icon className="w-3 h-3" />
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs opacity-70">{tab.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            
            {/* Global Filters */}
            {activeTab === 'global' && (
              <div className="space-y-4">
                <h3 className={`text-base font-semibold ${theme.text.primary} mb-3`}>Filtri Globali</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${theme.text.secondary}`}>Periodo Predefinito</label>
                    <div className="grid grid-cols-5 gap-1">
                      {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
                        <button
                          key={period}
                          onClick={() => updateFilter('globalPeriod', period)}
                          className={`p-2 rounded-lg text-xs transition ${
                            filters.globalPeriod === period
                              ? 'bg-indigo-600 text-white'
                              : `${theme.background.card} ${theme.text.secondary} hover:bg-gray-600`
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-2 ${theme.text.secondary}`}>Range Personalizzato</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        className={`p-2 rounded-lg ${theme.background.input} border ${theme.border} ${theme.text.primary} text-xs`}
                        placeholder="Data inizio"
                      />
                      <input
                        type="date"
                        className={`p-2 rounded-lg ${theme.background.input} border ${theme.border} ${theme.text.primary} text-xs`}
                        placeholder="Data fine"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expense Filters */}
            {activeTab === 'expense' && (
              <div className="space-y-4">
                <h3 className={`text-base font-semibold ${theme.text.primary} mb-3`}>Filtri Grafico Spese</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${theme.text.secondary}`}>Categorie</label>
                    <div className="grid grid-cols-2 gap-1">
                      {['Casa', 'Cibo', 'Trasporti', 'Shopping', 'Salute', 'Altro'].map((category) => (
                        <button
                          key={category}
                          onClick={() => updateFilter('expenseCategories', toggleArrayItem(filters.expenseCategories, category))}
                          className={`p-2 rounded-lg text-xs transition ${
                            filters.expenseCategories.includes(category)
                              ? 'bg-blue-600 text-white'
                              : `${theme.background.card} ${theme.text.secondary} hover:bg-gray-600`
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-2 ${theme.text.secondary}`}>Tipo Visualizzazione</label>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => updateFilter('expenseChartType', 'pie')}
                        className={`p-2 rounded-lg transition text-xs ${
                          filters.expenseChartType === 'pie'
                            ? 'bg-purple-600 text-white'
                            : `${theme.background.card} ${theme.text.secondary} hover:bg-gray-600`
                        }`}
                      >
                        🍰 Torta
                      </button>
                      <button
                        onClick={() => updateFilter('expenseChartType', 'bar')}
                        className={`p-2 rounded-lg transition text-xs ${
                          filters.expenseChartType === 'bar'
                            ? 'bg-purple-600 text-white'
                            : `${theme.background.card} ${theme.text.secondary} hover:bg-gray-600`
                        }`}
                      >
                        📊 Barre
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-2 ${theme.text.secondary}`}>Range Importi</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`text-xs ${theme.text.muted}`}>Minimo (€)</label>
                      <input
                        type="number"
                        value={filters.expenseMinAmount}
                        onChange={(e) => updateFilter('expenseMinAmount', Number(e.target.value))}
                        className={`w-full p-1.5 rounded-lg ${theme.background.input} border ${theme.border} ${theme.text.primary} text-xs`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs ${theme.text.muted}`}>Massimo (€)</label>
                      <input
                        type="number"
                        value={filters.expenseMaxAmount}
                        onChange={(e) => updateFilter('expenseMaxAmount', Number(e.target.value))}
                        className={`w-full p-1.5 rounded-lg ${theme.background.input} border ${theme.border} ${theme.text.primary} text-xs`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trends Filters */}
            {activeTab === 'trends' && (
              <div className="space-y-4">
                <h3 className={`text-base font-semibold ${theme.text.primary} mb-3`}>Filtri Trend Finanziario</h3>
                
                <div>
                  <label className={`block text-xs font-medium mb-2 ${theme.text.secondary}`}>Metriche da Mostrare</label>
                  <div className="grid grid-cols-2 gap-1">
                    {(['entrate', 'uscite', 'bilancio', 'risparmio'] as const).map((metric) => (
                      <button
                        key={metric}
                        onClick={() => updateFilter('trendsMetrics', toggleArrayItem(filters.trendsMetrics, metric))}
                        className={`p-2 rounded-lg text-xs transition capitalize ${
                          filters.trendsMetrics.includes(metric)
                            ? 'bg-emerald-600 text-white'
                            : `${theme.background.card} ${theme.text.secondary} hover:bg-gray-600`
                        }`}
                      >
                        {metric}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Goals Filters */}
            {activeTab === 'goals' && (
              <div className="space-y-4">
                <h3 className={`text-base font-semibold ${theme.text.primary} mb-3`}>Filtri Obiettivi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${theme.text.secondary}`}>Priorità</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['alta', 'media', 'bassa'] as const).map((priority) => (
                        <button
                          key={priority}
                          onClick={() => updateFilter('goalsPriority', toggleArrayItem(filters.goalsPriority, priority))}
                          className={`p-2 rounded-lg text-xs transition ${
                            filters.goalsPriority.includes(priority)
                              ? priority === 'alta' ? 'bg-red-600 text-white'
                                : priority === 'media' ? 'bg-yellow-600 text-white'
                                : 'bg-green-600 text-white'
                              : `${theme.background.card} ${theme.text.secondary} hover:bg-gray-600`
                          }`}
                        >
                          {priority.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-2 ${theme.text.secondary}`}>Stato</label>
                    <div className="grid grid-cols-2 gap-1">
                      {(['onTrack', 'delayed'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateFilter('goalsStatus', toggleArrayItem(filters.goalsStatus, status))}
                          className={`p-2 rounded-lg text-xs transition ${
                            filters.goalsStatus.includes(status)
                              ? 'bg-blue-600 text-white'
                              : `${theme.background.card} ${theme.text.secondary} hover:bg-gray-600`
                          }`}
                        >
                          {status === 'onTrack' ? 'In Linea' : 'In Ritardo'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Area Chart Filters */}
            {activeTab === 'area' && (
              <div className="space-y-4">
                <h3 className={`text-base font-semibold ${theme.text.primary} mb-3`}>Filtri Crescita Patrimonio</h3>
                
                <div>
                  <label className={`block text-xs font-medium mb-2 ${theme.text.secondary}`}>Componenti</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['conti', 'investimenti', 'obiettivo'] as const).map((component) => (
                      <button
                        key={component}
                        onClick={() => updateFilter('areaChartComponents', toggleArrayItem(filters.areaChartComponents, component))}
                        className={`p-2 rounded-lg text-xs transition capitalize ${
                          filters.areaChartComponents.includes(component)
                            ? 'bg-purple-600 text-white'
                            : `${theme.background.card} ${theme.text.secondary} hover:bg-gray-600`
                        }`}
                      >
                        {component}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Heatmap Filters */}
            {activeTab === 'heatmap' && (
              <div className="space-y-4">
                <h3 className={`text-base font-semibold ${theme.text.primary} mb-3`}>Filtri Calendario Spese</h3>
                
                <div>
                  <label className={`block text-xs font-medium mb-2 ${theme.text.secondary}`}>Intensità</label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['low', 'medium', 'high', 'all'] as const).map((intensity) => (
                      <button
                        key={intensity}
                        onClick={() => updateFilter('heatmapIntensity', intensity)}
                        className={`p-2 rounded-lg text-xs transition capitalize ${
                          filters.heatmapIntensity === intensity
                            ? 'bg-orange-600 text-white'
                            : `${theme.background.card} ${theme.text.secondary} hover:bg-gray-600`
                        }`}
                      >
                        {intensity === 'all' ? 'Tutte' : intensity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-3 border-t ${theme.border} ${theme.background.card}`}>
          <button
            onClick={onResetFilters}
            className={`px-3 py-2 rounded-lg ${theme.background.card} border ${theme.border} ${theme.text.secondary} hover:text-white transition-all flex items-center gap-2 text-xs`}
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${theme.background.card} border ${theme.border} ${theme.text.secondary} hover:text-white transition-all text-xs`}
            >
              Annulla
            </button>
            <button
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              className={`px-4 py-2 rounded-lg bg-gradient-to-r ${theme.background.gradient} text-white hover:from-purple-600 hover:to-indigo-600 transition-all text-xs`}
            >
              Applica Filtri
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersDashboard;