// src/components/statistics/AdvancedFiltersDashboard.tsx
import React, { useState } from 'react';
import { Filter, Calendar, Target, TrendingUp, Activity, MapPin, Settings, X, RotateCcw } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'global' | 'expense' | 'trends' | 'area' | 'heatmap' | 'goals'>('global');

  if (!isOpen) return null;

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-3xl w-full max-w-6xl h-[80vh] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Dashboard Filtri Avanzati
              </h2>
              <p className="text-gray-400 text-sm">Configura ogni grafico individualmente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-gray-900/50 border-r border-gray-700/50 p-4">
            <div className="space-y-2">
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
                  className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300'
                      : 'hover:bg-gray-700/30 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-5 h-5" />
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
          <div className="flex-1 p-6 overflow-y-auto">
            
            {/* Global Filters */}
            {activeTab === 'global' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Filtri Globali</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">Periodo Predefinito</label>
                    <div className="grid grid-cols-5 gap-2">
                      {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
                        <button
                          key={period}
                          onClick={() => updateFilter('globalPeriod', period)}
                          className={`p-3 rounded-lg text-sm transition ${
                            filters.globalPeriod === period
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">Range Personalizzato</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                        placeholder="Data inizio"
                      />
                      <input
                        type="date"
                        className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                        placeholder="Data fine"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expense Filters */}
            {activeTab === 'expense' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Filtri Grafico Spese</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">Categorie</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Casa', 'Cibo', 'Trasporti', 'Shopping', 'Salute', 'Altro'].map((category) => (
                        <button
                          key={category}
                          onClick={() => updateFilter('expenseCategories', toggleArrayItem(filters.expenseCategories, category))}
                          className={`p-2 rounded-lg text-sm transition ${
                            filters.expenseCategories.includes(category)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">Tipo Visualizzazione</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateFilter('expenseChartType', 'pie')}
                        className={`p-3 rounded-lg transition ${
                          filters.expenseChartType === 'pie'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        🍰 Torta
                      </button>
                      <button
                        onClick={() => updateFilter('expenseChartType', 'bar')}
                        className={`p-3 rounded-lg transition ${
                          filters.expenseChartType === 'bar'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        📊 Barre
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">Range Importi</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400">Minimo (€)</label>
                      <input
                        type="number"
                        value={filters.expenseMinAmount}
                        onChange={(e) => updateFilter('expenseMinAmount', Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Massimo (€)</label>
                      <input
                        type="number"
                        value={filters.expenseMaxAmount}
                        onChange={(e) => updateFilter('expenseMaxAmount', Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Goals Filters */}
            {activeTab === 'goals' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Filtri Obiettivi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">Priorità</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['alta', 'media', 'bassa'] as const).map((priority) => (
                        <button
                          key={priority}
                          onClick={() => updateFilter('goalsPriority', toggleArrayItem(filters.goalsPriority, priority))}
                          className={`p-2 rounded-lg text-sm transition ${
                            filters.goalsPriority.includes(priority)
                              ? priority === 'alta' ? 'bg-red-600 text-white'
                                : priority === 'media' ? 'bg-yellow-600 text-white'
                                : 'bg-green-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {priority.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">Stato</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['onTrack', 'delayed'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateFilter('goalsStatus', toggleArrayItem(filters.goalsStatus, status))}
                          className={`p-2 rounded-lg text-sm transition ${
                            filters.goalsStatus.includes(status)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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

            {/* Altri tab simili per trends, area, heatmap... */}
            
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700/50">
          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Tutto
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all"
            >
              Annulla
            </button>
            <button
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg"
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