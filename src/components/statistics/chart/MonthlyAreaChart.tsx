// src/components/statistics/chart/MonthlyAreaChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Wallet, Target } from "lucide-react";
import ChartHoverExport from "../ChartHoverExport";
import { useAdvancedChartsContext } from "../../../context/AdvancedChartsContext";
import { useTheme } from "../../../context/ThemeContext";

interface PatrimonioData {
  month: string;
  conti: number;
  totale: number;
  obiettivo: number;
}

interface MonthlyAreaChartProps {
  formatCurrency: (amount: number) => string;
}

const MonthlyAreaChart: React.FC<MonthlyAreaChartProps> = ({ formatCurrency }) => {
  const { isDarkMode } = useTheme();

  // ✅ Dati aggiornati - SOLO CONTI (rimosso investimenti)
  const patrimonioData: PatrimonioData[] = [
    { month: 'Gen', conti: 15000, totale: 15000, obiettivo: 20000 },
    { month: 'Feb', conti: 15800, totale: 15800, obiettivo: 20000 },
    { month: 'Mar', conti: 16200, totale: 16200, obiettivo: 22000 },
    { month: 'Apr', conti: 17100, totale: 17100, obiettivo: 22000 },
    { month: 'Mag', conti: 17600, totale: 17600, obiettivo: 24000 },
    { month: 'Giu', conti: 18131, totale: 18131, obiettivo: 24000 },
    { month: 'Lug', conti: 18650, totale: 18650, obiettivo: 26000 },
    { month: 'Ago', conti: 19100, totale: 19100, obiettivo: 26000 },
    { month: 'Set', conti: 19580, totale: 19580, obiettivo: 28000 },
  ];

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
      primary: '#6366F1',
      secondary: '#10B981',
      amber: '#F59E0B',
      purple: '#8B5CF6',
      blue: '#3B82F6',
      success: '#059669',
      error: '#DC2626',
      info: '#0284C7'
    }
  });

  const colors = getThemeColors();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`${isDarkMode ? 'bg-gray-800/95 border-gray-600/50' : 'bg-white/95 border-gray-200/50'} border rounded-xl p-4 shadow-2xl backdrop-blur-sm`}>
          <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold mb-3 text-center border-b ${isDarkMode ? 'border-gray-600/30' : 'border-gray-200/30'} pb-2 text-sm md:text-base`}>
            {label}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Wallet className={`w-3 h-3 md:w-4 md:h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs md:text-sm`}>
                  Conti
                </span>
              </div>
              <span className={`font-bold text-xs md:text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {formatCurrency(data.conti)}
              </span>
            </div>
            <div className={`border-t ${isDarkMode ? 'border-gray-600/30' : 'border-gray-200/30'} pt-2`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Target className={`w-3 h-3 md:w-4 md:h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium text-xs md:text-sm`}>
                    Totale
                  </span>
                </div>
                <span className={`font-bold text-sm md:text-lg ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {formatCurrency(data.totale)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className={`${colors.text.muted} text-xs`}>
                Obiettivo
              </span>
              <span className={`${colors.text.secondary} text-xs md:text-sm`}>
                {formatCurrency(data.obiettivo)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const latestData = patrimonioData[patrimonioData.length - 1];
  const firstData = patrimonioData[0];
  const crescitaTotale = latestData.totale - firstData.totale;
  const crescitaPercentuale = ((crescitaTotale / firstData.totale) * 100).toFixed(1);
  const progressoObiettivo = ((latestData.totale / latestData.obiettivo) * 100).toFixed(1);
  
  const { quickExport, openExportModal } = useAdvancedChartsContext();
  const getExportConfig = () => ({
    chartId: 'area-chart',
    chartName: 'Crescita Patrimonio',
    availableFormats: ['PNG', 'CSV', 'JSON'] as const,
    data: patrimonioData,
    chartRef: undefined
  });

  return (
    <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'} p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl ${isDarkMode ? 'border border-gray-700/50' : 'border border-slate-200/50'} transition-all duration-300`}>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
            <TrendingUp className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div>
            <h3 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-purple-400 via-indigo-500 to-teal-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent'}`}>
              Crescita Patrimonio
            </h3>
            <p className={`${colors.text.muted} text-xs md:text-sm`}>
              Evoluzione nel tempo
            </p>
          </div>
          
          <ChartHoverExport
            chartId="area-chart"
            chartName="Crescita Patrimonio"
            availableFormats={['PNG', 'CSV', 'JSON']}
            onQuickExport={(format) => quickExport('area-chart', format)}
            onAdvancedExport={() => openExportModal(getExportConfig())}
            position="inline"
          />
        </div>
        
        <div className={`text-center md:text-right ${isDarkMode ? 'bg-gray-900/50 border border-gray-600/30' : 'bg-white/50 border border-slate-200/50'} p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-sm`}>
          <p className={`${colors.text.muted} text-xs`}>
            Patrimonio totale
          </p>
          <p className={`text-lg md:text-2xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'}`}>
            {formatCurrency(latestData.totale)}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
            +{formatCurrency(crescitaTotale)} (+{crescitaPercentuale}%)
          </p>
        </div>
      </div>

      <div className={`relative ${isDarkMode ? 'bg-gray-900/30 border border-gray-600/20' : 'bg-white/30 border border-slate-200/20'} rounded-xl md:rounded-2xl p-3 md:p-6 backdrop-blur-sm`}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={patrimonioData} margin={{ top: 20, right: 15, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="contiAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.accent.blue} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.accent.blue} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke={colors.chart.grid} opacity={0.3} />
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
              domain={['dataMin - 1000', 'dataMax + 2000']}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* ✅ Solo area conti */}
            <Area
              type="monotone"
              dataKey="conti"
              stroke={colors.accent.blue}
              strokeWidth={2}
              fill="url(#contiAreaGradient)"
              name="Conti"
            />
            
            {/* Linea obiettivo */}
            <Area
              type="monotone"
              dataKey="obiettivo"
              stroke={colors.accent.amber}
              strokeWidth={2}
              strokeDasharray="8 4"
              fill="none"
              name="Obiettivo"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* ✅ Legenda aggiornata - rimosso investimenti */}
        <div className="flex justify-center mt-3 md:mt-4 gap-3 md:gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-2 md:w-4 md:h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded shadow-sm`}></div>
            <span className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'} text-xs md:text-sm font-medium`}>
              Conti Correnti
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-1 md:w-5 md:h-1 bg-amber-500 rounded`} style={{ clipPath: 'polygon(0 0, 80% 0, 100% 100%, 20% 100%)' }}></div>
            <span className={`${isDarkMode ? 'text-amber-300' : 'text-amber-600'} text-xs md:text-sm font-medium`}>
              Obiettivo
            </span>
          </div>
        </div>
      </div>

      <div className={`mt-4 md:mt-6 ${isDarkMode ? 'bg-gray-900/60 border border-gray-600/30' : 'bg-white/60 border border-slate-200/30'} rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            <span className={`${colors.text.primary} font-medium text-sm md:text-base`}>
              Progresso verso obiettivo
            </span>
          </div>
          <span className={`${isDarkMode ? 'text-amber-400' : 'text-amber-600'} font-bold text-sm md:text-base`}>
            {progressoObiettivo}%
          </span>
        </div>
        
        <div className={`h-2 md:h-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(100, parseFloat(progressoObiettivo))}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2">
          <span className={`${colors.text.muted} text-xs`}>
            Attuale: {formatCurrency(latestData.totale)}
          </span>
          <span className={`${colors.text.muted} text-xs`}>
            Target: {formatCurrency(latestData.obiettivo)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAreaChart;