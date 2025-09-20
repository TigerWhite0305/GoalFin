// src/components/statistics/SpendingHeatmap.tsx
import React, { useState } from 'react';
import { Calendar, Activity, TrendingDown, DollarSign, X } from "lucide-react";
import ChartHoverExport from "../ChartHoverExport";
import useAdvancedCharts from "../../../hooks/useAdvancedCharts";
import { useTheme } from "../../../context/ThemeContext";

interface DayData {
  day: number;
  amount: number;
  transactions: number;
  date: string;
}

interface SpendingHeatmapProps {
  formatCurrency: (amount: number) => string;
}

const SpendingHeatmap: React.FC<SpendingHeatmapProps> = ({ formatCurrency }) => {
  const { isDarkMode } = useTheme();
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  // Genera dati casuali per il mese corrente
  const generateMonthData = (): DayData[] => {
    const daysInMonth = 30;
    const data: DayData[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isWeekend = day % 7 === 0 || day % 7 === 6;
      const baseAmount = isWeekend ? 150 : 80;
      const variation = Math.random() * 200;
      const amount = Math.round(baseAmount + variation);
      const transactions = Math.floor(Math.random() * 8) + 1;
      
      data.push({
        day,
        amount,
        transactions,
        date: `2025-09-${day.toString().padStart(2, '0')}`
      });
    }
    
    return data;
  };

  const monthData = generateMonthData();

  // Theme-aware colors seguendo il design system
  const getThemeColors = () => ({
    background: {
      card: isDarkMode ? '#161920' : '#F8FAFC',
      secondary: isDarkMode ? '#1F2937' : '#F1F5F9',
      accent: isDarkMode ? '#0A0B0F' : '#FEFEFE'
    },
    text: {
      primary: isDarkMode ? '#F9FAFB' : '#0F172A',
      secondary: isDarkMode ? '#D1D5DB' : '#334155',
      muted: isDarkMode ? '#6B7280' : '#64748B',
      subtle: isDarkMode ? '#9CA3AF' : '#64748B'
    },
    chart: {
      grid: isDarkMode ? '#374151' : '#E2E8F0',
      axis: isDarkMode ? '#9CA3AF' : '#64748B'
    },
    accent: {
      primary: '#6366F1', // Indigo
      secondary: '#10B981', // Emerald  
      amber: '#F59E0B',
      purple: '#8B5CF6',
      blue: '#3B82F6',
      success: '#059669',
      error: '#DC2626',
      warning: '#D97706',
      info: '#0284C7'
    }
  });

  const colors = getThemeColors();
  
  // Calcola intensità colore basata sull'importo
  const getIntensity = (amount: number): number => {
    const maxAmount = Math.max(...monthData.map(d => d.amount));
    return (amount / maxAmount) * 100;
  };

  const getColorClass = (intensity: number): string => {
    if (isDarkMode) {
      if (intensity < 20) return 'bg-gray-700/30 border-gray-600/20';
      if (intensity < 40) return 'bg-amber-500/20 border-amber-500/30';
      if (intensity < 60) return 'bg-orange-500/30 border-orange-500/40';
      if (intensity < 80) return 'bg-red-500/40 border-red-500/50';
      return 'bg-red-600/60 border-red-600/70';
    } else {
      if (intensity < 20) return 'bg-gray-200/50 border-gray-300/30';
      if (intensity < 40) return 'bg-amber-100/60 border-amber-300/40';
      if (intensity < 60) return 'bg-orange-200/70 border-orange-400/50';
      if (intensity < 80) return 'bg-red-200/80 border-red-400/60';
      return 'bg-red-300/90 border-red-500/70';
    }
  };

  const getTextColor = (intensity: number): string => {
    if (isDarkMode) {
      if (intensity < 20) return 'text-gray-400';
      if (intensity < 40) return 'text-amber-300';
      if (intensity < 60) return 'text-orange-300';
      if (intensity < 80) return 'text-red-300';
      return 'text-red-200';
    } else {
      if (intensity < 20) return 'text-gray-600';
      if (intensity < 40) return 'text-amber-700';
      if (intensity < 60) return 'text-orange-700';
      if (intensity < 80) return 'text-red-700';
      return 'text-red-800';
    }
  };

  // Statistiche del mese
  const totalSpent = monthData.reduce((sum, day) => sum + day.amount, 0);
  const avgDaily = totalSpent / monthData.length;
  const maxDay = monthData.reduce((max, day) => day.amount > max.amount ? day : max);
  const totalTransactions = monthData.reduce((sum, day) => sum + day.transactions, 0);
  
  const { quickExport, openExportModal } = useAdvancedCharts();

  const getExportConfig = () => ({
    chartId: 'heatmap-chart',
    chartName: 'Calendario Spese',
    availableFormats: ['PNG', 'CSV', 'JSON'] as const,
    data: monthData,
    chartRef: undefined
  });

  // Giorni della settimana
  const weekDays = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

  return (
    <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'} p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl ${isDarkMode ? 'border border-gray-700/50' : 'border border-slate-200/50'} h-full transition-all duration-300`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
            <Calendar className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <div>
            <h3 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-red-400 via-orange-500 to-amber-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent'}`}>
              Calendario Spese
            </h3>
            <p className={`${colors.text.muted} text-xs md:text-sm`}>
              Heatmap giornaliera
            </p>
          </div>
          
          {/* Export Button - Sempre visibile */}
          <ChartHoverExport
            chartId="heatmap-chart"
            chartName="Calendario Spese"
            availableFormats={['PNG', 'CSV', 'JSON']}
            onQuickExport={(format) => quickExport('heatmap-chart', format)}
            onAdvancedExport={() => openExportModal(getExportConfig())}
            position="inline"
          />
        </div>
        
        {/* Indicatore media */}
        <div className={`text-center md:text-right ${isDarkMode ? 'bg-gray-900/50 border border-gray-600/30' : 'bg-white/50 border border-slate-200/50'} p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-sm`}>
          <p className={`${colors.text.muted} text-xs`}>
            Media giornaliera
          </p>
          <p className={`text-lg md:text-2xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent'}`}>
            {formatCurrency(avgDaily)}
          </p>
          <p className={`${colors.text.secondary} text-xs`}>
            {totalTransactions} transazioni
          </p>
        </div>
      </div>

      {/* Calendar Container */}
      <div className={`relative ${isDarkMode ? 'bg-gray-900/30 border border-gray-600/20' : 'bg-white/30 border border-slate-200/20'} rounded-xl md:rounded-2xl p-3 md:p-6 backdrop-blur-sm`}>
        
        {/* Header giorni settimana */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-4">
          {weekDays.map((day, index) => (
            <div key={index} className={`text-center ${colors.text.muted} text-xs md:text-sm font-medium p-1 md:p-2`}>
              {day}
            </div>
          ))}
        </div>

        {/* Griglia calendario */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4 md:mb-6">
          {monthData.map((dayData) => {
            const intensity = getIntensity(dayData.amount);
            const isSelected = selectedDay?.day === dayData.day;
            
            return (
              <div
                key={dayData.day}
                onClick={() => setSelectedDay(dayData)}
                className={`
                  relative h-12 md:h-16 rounded-lg md:rounded-xl border-2 transition-all duration-200 cursor-pointer
                  flex flex-col items-center justify-center
                  hover:scale-105 hover:shadow-lg
                  ${getColorClass(intensity)}
                  ${isSelected ? (isDarkMode ? 'ring-2 ring-indigo-400 ring-opacity-75' : 'ring-2 ring-indigo-500 ring-opacity-75') : ''}
                `}
                style={{
                  boxShadow: intensity > 60 ? `0 0 15px ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}` : undefined
                }}
              >
                <span className={`text-sm md:text-lg font-bold ${getTextColor(intensity)}`}>
                  {dayData.day}
                </span>
                <span className={`text-xs ${colors.text.muted} hidden md:block`}>
                  {formatCurrency(dayData.amount).replace('€', '').replace(',00', '')}€
                </span>
                
                {/* Indicatore transazioni */}
                <div className="absolute top-0.5 md:top-1 right-0.5 md:right-1">
                  <div className="flex gap-0.5 md:gap-1">
                    {Array.from({ length: Math.min(dayData.transactions, 3) }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isDarkMode ? 'bg-white/40' : 'bg-gray-600/60'}`}
                      ></div>
                    ))}
                    {dayData.transactions > 3 && (
                      <span className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-gray-600/60'} ml-0.5 md:ml-1 hidden md:inline`}>+</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legenda intensità */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
          <span className={`${colors.text.muted} text-xs md:text-sm`}>Meno</span>
          <div className="flex gap-1">
            {isDarkMode ? (
              <>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-gray-700/30 border border-gray-600/20"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-amber-500/20 border border-amber-500/30"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-orange-500/30 border border-orange-500/40"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-red-500/40 border border-red-500/50"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-red-600/60 border border-red-600/70"></div>
              </>
            ) : (
              <>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-gray-200/50 border border-gray-300/30"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-amber-100/60 border border-amber-300/40"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-orange-200/70 border border-orange-400/50"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-red-200/80 border border-red-400/60"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-red-300/90 border border-red-500/70"></div>
              </>
            )}
          </div>
          <span className={`${colors.text.muted} text-xs md:text-sm`}>Più</span>
        </div>

        {/* Dettagli giorno selezionato */}
        {selectedDay && (
          <div className={`${isDarkMode ? 'bg-gray-800/50 border border-gray-600/30' : 'bg-white/50 border border-slate-200/30'} rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-base md:text-lg font-bold ${colors.text.primary}`}>
                {selectedDay.day} Settembre 2025
              </h4>
              <button
                onClick={() => setSelectedDay(null)}
                className={`${colors.text.muted} hover:text-red-400 transition-colors p-1`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className={`${isDarkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'} rounded-lg md:rounded-xl p-3`}>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className={`w-3 h-3 md:w-4 md:h-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                  <span className={`${isDarkMode ? 'text-red-300' : 'text-red-600'} text-xs md:text-sm font-medium`}>
                    Spese totali
                  </span>
                </div>
                <p className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-lg md:text-xl font-bold`}>
                  {formatCurrency(selectedDay.amount)}
                </p>
              </div>
              
              <div className={`${isDarkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'} rounded-lg md:rounded-xl p-3`}>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className={`w-3 h-3 md:w-4 md:h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'} text-xs md:text-sm font-medium`}>
                    Transazioni
                  </span>
                </div>
                <p className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-lg md:text-xl font-bold`}>
                  {selectedDay.transactions}
                </p>
              </div>
            </div>
            
            <div className="mt-3 text-center">
              <span className={`${colors.text.muted} text-xs md:text-sm`}>
                Media per transazione: <span className={`${colors.text.primary} font-medium`}>
                  {formatCurrency(selectedDay.amount / selectedDay.transactions)}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Statistiche mensili */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
        <div className={`${isDarkMode ? 'bg-gray-900/60 border border-gray-600/30' : 'bg-white/60 border border-slate-200/30'} rounded-xl md:rounded-2xl p-3 md:p-4 text-center backdrop-blur-sm`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingDown className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <span className={`${colors.text.secondary} text-xs md:text-sm font-medium`}>
              Totale Mese
            </span>
          </div>
          <p className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-lg md:text-2xl font-bold`}>
            {formatCurrency(totalSpent)}
          </p>
          <p className={`${colors.text.muted} text-xs mt-1`}>
            in {monthData.length} giorni
          </p>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-900/60 border border-gray-600/30' : 'bg-white/60 border border-slate-200/30'} rounded-xl md:rounded-2xl p-3 md:p-4 text-center backdrop-blur-sm`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            <span className={`${colors.text.secondary} text-xs md:text-sm font-medium`}>
              Giorno Max
            </span>
          </div>
          <p className={`${isDarkMode ? 'text-orange-400' : 'text-orange-600'} text-lg md:text-2xl font-bold`}>
            {formatCurrency(maxDay.amount)}
          </p>
          <p className={`${colors.text.muted} text-xs mt-1`}>
            il {maxDay.day} Settembre
          </p>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-900/60 border border-gray-600/30' : 'bg-white/60 border border-slate-200/30'} rounded-xl md:rounded-2xl p-3 md:p-4 text-center backdrop-blur-sm`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`${colors.text.secondary} text-xs md:text-sm font-medium`}>
              Media/Giorno
            </span>
          </div>
          <p className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-lg md:text-2xl font-bold`}>
            {formatCurrency(avgDaily)}
          </p>
          <p className={`${colors.text.muted} text-xs mt-1`}>
            {(totalTransactions / monthData.length).toFixed(1)} transazioni
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpendingHeatmap;