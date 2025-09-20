// src/components/statistics/TrendsLineChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import ChartHoverExport from "../ChartHoverExport";
import useAdvancedCharts from "../../../hooks/useAdvancedCharts";
import { useTheme } from "../../../context/ThemeContext";

interface TrendData {
  month: string;
  entrate: number;
  uscite: number;
  bilancio: number;
  risparmio: number;
}

interface TrendsLineChartProps {
  formatCurrency: (amount: number) => string;
  selectedPeriod: string;
}

const TrendsLineChart: React.FC<TrendsLineChartProps> = ({
  formatCurrency,
  selectedPeriod
}) => {
  const { isDarkMode } = useTheme();

  // Dati di esempio per i trend
  const trendData: TrendData[] = [
    { month: 'Gen', entrate: 3200, uscite: 2400, bilancio: 800, risparmio: 600 },
    { month: 'Feb', entrate: 3400, uscite: 2600, bilancio: 800, risparmio: 650 },
    { month: 'Mar', entrate: 3100, uscite: 2800, bilancio: 300, risparmio: 400 },
    { month: 'Apr', entrate: 3600, uscite: 2500, bilancio: 1100, risparmio: 800 },
    { month: 'Mag', entrate: 3300, uscite: 2700, bilancio: 600, risparmio: 550 },
    { month: 'Giu', entrate: 3500, uscite: 2450, bilancio: 1050, risparmio: 750 },
    { month: 'Lug', entrate: 3400, uscite: 2650, bilancio: 750, risparmio: 650 },
    { month: 'Ago', entrate: 3200, uscite: 2800, bilancio: 400, risparmio: 500 },
    { month: 'Set', entrate: 3700, uscite: 2400, bilancio: 1300, risparmio: 900 },
  ];

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
      success: '#059669',
      error: '#DC2626',
      info: '#0284C7'
    }
  });

  const colors = getThemeColors();

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${isDarkMode ? 'bg-gray-800/95 border-gray-600/50' : 'bg-white/95 border-gray-200/50'} border rounded-xl p-4 shadow-2xl backdrop-blur-sm`}>
          <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold mb-3 text-center border-b ${isDarkMode ? 'border-gray-600/30' : 'border-gray-200/30'} pb-2 text-sm md:text-base`}>
            {label}
          </p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs md:text-sm capitalize`}>
                    {entry.dataKey}
                  </span>
                </div>
                <span 
                  className="font-bold text-xs md:text-sm"
                  style={{ color: entry.color }}
                >
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const { quickExport, openExportModal } = useAdvancedCharts();
  const getExportConfig = () => ({
    chartId: 'trends-chart',
    chartName: 'Trend Finanziario',
    availableFormats: ['PNG', 'CSV', 'JSON'] as const,
    data: trendData,
    chartRef: undefined
  });

  // Calcola statistiche
  const latestData = trendData[trendData.length - 1];
  const previousData = trendData[trendData.length - 2];
  const bilancioChange = latestData.bilancio - previousData.bilancio;
  const isPositive = bilancioChange >= 0;

  return (
    <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'} p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl ${isDarkMode ? 'border border-gray-700/50' : 'border border-slate-200/50'} h-full transition-all duration-300`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-indigo-50 border border-indigo-200'}`}>
            <TrendingUp className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <div>
            <h3 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-teal-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent'}`}>
              Trend Finanziario
            </h3>
            <p className={`${colors.text.muted} text-xs md:text-sm`}>
              Andamento entrate vs uscite
            </p>
          </div>
          
          {/* Export Button - Sempre visibile */}
          <ChartHoverExport
            chartId="trends-chart"
            chartName="Trend Finanziario"
            availableFormats={['PNG', 'CSV', 'JSON']}
            onQuickExport={(format) => quickExport('trends-chart', format)}
            onAdvancedExport={() => openExportModal(getExportConfig())}
            position="inline"
          />
        </div>
        
        {/* Indicatore bilancio */}
        <div className={`text-center md:text-right ${isDarkMode ? 'bg-gray-900/50 border border-gray-600/30' : 'bg-white/50 border border-slate-200/50'} p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-sm`}>
          <p className={`${colors.text.muted} text-xs`}>
            Bilancio corrente
          </p>
          <p className={`text-lg md:text-2xl font-bold ${isPositive ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
            {formatCurrency(latestData.bilancio)}
          </p>
          <p className={`text-xs ${isPositive ? (isDarkMode ? 'text-emerald-300' : 'text-emerald-500') : (isDarkMode ? 'text-red-300' : 'text-red-500')}`}>
            {isPositive ? '+' : ''}{formatCurrency(bilancioChange)} vs mese scorso
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className={`relative ${isDarkMode ? 'bg-gray-900/30 border border-gray-600/20' : 'bg-white/30 border border-slate-200/20'} rounded-xl md:rounded-2xl p-3 md:p-6 backdrop-blur-sm`}>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={trendData} margin={{ top: 20, right: 15, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="entrateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.accent.secondary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.accent.secondary} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="usciteGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.accent.error} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.accent.error} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="bilancioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.accent.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.accent.primary} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={colors.chart.grid} 
              opacity={0.3} 
            />
            <XAxis 
              dataKey="month" 
              stroke={colors.chart.axis}
              fontSize={11}
              tick={{ fill: colors.chart.axis, fontSize: 11 }}
            />
            <YAxis 
              stroke={colors.chart.axis}
              fontSize={11}
              tick={{ fill: colors.chart.axis, fontSize: 11 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Linee principali */}
            <Line 
              type="monotone" 
              dataKey="entrate" 
              stroke={colors.accent.secondary}
              strokeWidth={2.5}
              dot={{ fill: colors.accent.secondary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: colors.accent.secondary, stroke: isDarkMode ? '#fff' : '#000', strokeWidth: 2 }}
              name="Entrate"
            />
            <Line 
              type="monotone" 
              dataKey="uscite" 
              stroke={colors.accent.error}
              strokeWidth={2.5}
              dot={{ fill: colors.accent.error, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: colors.accent.error, stroke: isDarkMode ? '#fff' : '#000', strokeWidth: 2 }}
              name="Uscite"
            />
            <Line 
              type="monotone" 
              dataKey="bilancio" 
              stroke={colors.accent.primary}
              strokeWidth={3}
              dot={{ fill: colors.accent.primary, strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: colors.accent.primary, stroke: isDarkMode ? '#fff' : '#000', strokeWidth: 2 }}
              name="Bilancio"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Legenda personalizzata */}
        <div className="flex justify-center mt-3 md:mt-4 gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full shadow-sm`} style={{ backgroundColor: colors.accent.secondary }}></div>
            <span className={`${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'} text-xs md:text-sm font-medium`}>
              Entrate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full shadow-sm`} style={{ backgroundColor: colors.accent.error }}></div>
            <span className={`${isDarkMode ? 'text-red-300' : 'text-red-600'} text-xs md:text-sm font-medium`}>
              Uscite
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-1 md:w-5 md:h-1 shadow-sm`} style={{ backgroundColor: colors.accent.primary, clipPath: 'polygon(0 0, 60% 0, 100% 100%, 40% 100%)' }}></div>
            <span className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} text-xs md:text-sm font-medium`}>
              Bilancio
            </span>
          </div>
        </div>
      </div>

      {/* Mini statistiche */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
        <div className={`${isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'} rounded-lg md:rounded-xl p-2 md:p-3 text-center`}>
          <p className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} text-sm md:text-lg font-bold`}>
            {formatCurrency(latestData.entrate)}
          </p>
          <p className={`${isDarkMode ? 'text-emerald-300' : 'text-emerald-500'} text-xs`}>
            Entrate correnti
          </p>
        </div>
        <div className={`${isDarkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'} rounded-lg md:rounded-xl p-2 md:p-3 text-center`}>
          <p className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-sm md:text-lg font-bold`}>
            {formatCurrency(latestData.uscite)}
          </p>
          <p className={`${isDarkMode ? 'text-red-300' : 'text-red-500'} text-xs`}>
            Uscite correnti
          </p>
        </div>
        <div className={`${isDarkMode ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-indigo-50 border border-indigo-200'} rounded-lg md:rounded-xl p-2 md:p-3 text-center`}>
          <p className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} text-sm md:text-lg font-bold`}>
            {formatCurrency(latestData.risparmio)}
          </p>
          <p className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-500'} text-xs`}>
            Risparmio mensile
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendsLineChart;