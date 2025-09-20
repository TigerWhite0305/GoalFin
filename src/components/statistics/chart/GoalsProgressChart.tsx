// src/components/statistics/GoalsProgressChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Target, Calendar, TrendingUp, Award, Clock } from "lucide-react";
import ChartHoverExport from "../ChartHoverExport";
import useAdvancedCharts from "../../../hooks/useAdvancedCharts";
import { useTheme } from "../../../context/ThemeContext";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  deadline: string;
  priority: 'alta' | 'media' | 'bassa';
  category: string;
  monthlyContribution: number;
  color: string;
  icon: React.ComponentType<any>;
}

interface GoalsProgressChartProps {
  formatCurrency: (amount: number) => string;
}

const GoalsProgressChart: React.FC<GoalsProgressChartProps> = ({ formatCurrency }) => {
  const { isDarkMode } = useTheme();

  const goals: Goal[] = [
    {
      id: '1',
      name: 'Vacanza Giappone',
      current: 3800,
      target: 4500,
      deadline: '2025-12-31',
      priority: 'alta',
      category: 'viaggio',
      monthlyContribution: 300,
      color: '#3B82F6',
      icon: Target
    },
    {
      id: '2',
      name: 'MacBook Pro',
      current: 1650,
      target: 2500,
      deadline: '2025-11-30',
      priority: 'media',
      category: 'tecnologia',
      monthlyContribution: 200,
      color: '#8B5CF6',
      icon: Target
    },
    {
      id: '3',
      name: 'Fondo Emergenza',
      current: 2200,
      target: 5000,
      deadline: '2026-06-30',
      priority: 'alta',
      category: 'emergenze',
      monthlyContribution: 400,
      color: '#10B981',
      icon: Target
    },
    {
      id: '4',
      name: 'Auto Nuova',
      current: 8500,
      target: 15000,
      deadline: '2026-03-31',
      priority: 'bassa',
      category: 'auto',
      monthlyContribution: 500,
      color: '#F59E0B',
      icon: Target
    }
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
      purple: '#8B5CF6',
      blue: '#3B82F6',
      success: '#059669',
      error: '#DC2626',
      warning: '#D97706',
      info: '#0284C7'
    }
  });

  const colors = getThemeColors();

  // Calcola dati per il grafico
  const chartData = goals.map(goal => {
    const percentage = (goal.current / goal.target) * 100;
    const remaining = goal.target - goal.current;
    const monthsToDeadline = Math.ceil(
      (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const onTrack = remaining <= (goal.monthlyContribution * monthsToDeadline);
    
    return {
      ...goal,
      percentage: Math.round(percentage),
      remaining,
      monthsToDeadline,
      onTrack,
      displayName: goal.name.length > 12 ? goal.name.substring(0, 12) + '...' : goal.name
    };
  });

  const { quickExport, openExportModal } = useAdvancedCharts();
  const getExportConfig = () => ({
    chartId: 'goals-chart',
    chartName: 'Progresso Obiettivi',
    availableFormats: ['PNG', 'CSV', 'JSON', 'PDF'] as const,
    data: chartData,
    chartRef: undefined
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`${isDarkMode ? 'bg-gray-800/95 border-gray-600/50' : 'bg-white/95 border-gray-200/50'} border rounded-xl p-4 shadow-2xl backdrop-blur-sm min-w-[280px]`}>
          <div className={`flex items-center gap-3 mb-4 border-b ${isDarkMode ? 'border-gray-600/30' : 'border-gray-200/30'} pb-3`}>
            <div 
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${data.color}20`, border: `1px solid ${data.color}40` }}
            >
              <data.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: data.color }} />
            </div>
            <div>
              <p className={`${colors.text.primary} font-bold text-sm md:text-base`}>{data.name}</p>
              <p className={`${colors.text.muted} text-xs md:text-sm capitalize`}>{data.category}</p>
            </div>
          </div>
          
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between">
              <span className={`${colors.text.secondary} text-xs md:text-sm`}>Progresso:</span>
              <span className="font-bold text-xs md:text-sm" style={{ color: data.color }}>
                {data.percentage}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className={`${colors.text.secondary} text-xs md:text-sm`}>Attuale:</span>
              <span className={`${colors.text.primary} font-medium text-xs md:text-sm`}>{formatCurrency(data.current)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className={`${colors.text.secondary} text-xs md:text-sm`}>Obiettivo:</span>
              <span className={`${colors.text.primary} font-medium text-xs md:text-sm`}>{formatCurrency(data.target)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className={`${colors.text.secondary} text-xs md:text-sm`}>Mancante:</span>
              <span className={`${isDarkMode ? 'text-red-300' : 'text-red-600'} font-medium text-xs md:text-sm`}>{formatCurrency(data.remaining)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className={`${colors.text.secondary} text-xs md:text-sm`}>Scadenza:</span>
              <span className={`${colors.text.primary} text-xs md:text-sm`}>{new Date(data.deadline).toLocaleDateString('it-IT')}</span>
            </div>
            
            <div className="flex justify-between">
              <span className={`${colors.text.secondary} text-xs md:text-sm`}>Mensile:</span>
              <span className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'} text-xs md:text-sm`}>{formatCurrency(data.monthlyContribution)}</span>
            </div>
            
            <div className={`pt-2 border-t ${isDarkMode ? 'border-gray-600/30' : 'border-gray-200/30'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${data.onTrack ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`text-xs md:text-sm font-medium ${data.onTrack ? 'text-green-400' : 'text-red-400'}`}>
                  {data.onTrack ? 'In linea con obiettivo' : 'Ritardo sul programma'}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getPriorityColor = (priority: string) => {
    if (isDarkMode) {
      switch (priority) {
        case 'alta': return 'bg-red-500/20 text-red-300 border-red-500/30';
        case 'media': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
        case 'bassa': return 'bg-green-500/20 text-green-300 border-green-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      }
    } else {
      switch (priority) {
        case 'alta': return 'bg-red-50 text-red-700 border-red-200';
        case 'media': return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'bassa': return 'bg-green-50 text-green-700 border-green-200';
        default: return 'bg-gray-50 text-gray-700 border-gray-200';
      }
    }
  };

  // Statistiche generali
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalMonthly = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;
  const goalsOnTrack = chartData.filter(goal => goal.onTrack).length;

  return (
    <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'} p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl ${isDarkMode ? 'border border-gray-700/50' : 'border border-slate-200/50'} transition-all duration-300`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gradient-to-r from-emerald-600 to-cyan-600'} flex items-center justify-center`}>
            <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-emerald-400 via-cyan-500 to-teal-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent'}`}>
              Progresso Obiettivi
            </h3>
            <p className={`${colors.text.muted} text-xs md:text-sm`}>
              Stato avanzamento risparmi
            </p>
          </div>
          
          {/* Export Button - Sempre visibile */}
          <ChartHoverExport
            chartId="goals-chart"
            chartName="Progresso Obiettivi"
            availableFormats={['PNG', 'CSV', 'JSON', 'PDF']}
            onQuickExport={(format) => quickExport('goals-chart', format)}
            onAdvancedExport={() => openExportModal(getExportConfig())}
            position="inline"
          />
        </div>
        
        {/* Indicatore progresso */}
        <div className={`text-center md:text-right ${isDarkMode ? 'bg-gray-900/50 border border-gray-600/30' : 'bg-white/50 border border-slate-200/50'} p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-sm`}>
          <p className={`${colors.text.muted} text-xs`}>
            Progresso complessivo
          </p>
          <p className={`text-lg md:text-2xl font-bold ${isDarkMode ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent'}`}>
            {overallProgress.toFixed(1)}%
          </p>
          <p className={`${colors.text.secondary} text-xs`}>
            {goalsOnTrack}/{goals.length} obiettivi in linea
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className={`relative ${isDarkMode ? 'bg-gray-900/30 border border-gray-600/20' : 'bg-white/30 border border-slate-200/20'} rounded-xl md:rounded-2xl p-3 md:p-6 backdrop-blur-sm`}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 20, right: 15, left: 5, bottom: 60 }}>
            <defs>
              {chartData.map((goal, index) => (
                <linearGradient key={`gradient-${index}`} id={`goalGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={goal.color} stopOpacity={0.9}/>
                  <stop offset="100%" stopColor={goal.color} stopOpacity={0.4}/>
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={colors.chart.grid} 
              opacity={0.3} 
            />
            <XAxis 
              dataKey="displayName" 
              stroke={colors.chart.axis}
              fontSize={10}
              tick={{ fill: colors.chart.axis, fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke={colors.chart.axis}
              fontSize={11}
              tick={{ fill: colors.chart.axis, fontSize: 11 }}
              domain={[0, 100]}
              label={{ 
                value: 'Progresso (%)', 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fill: colors.chart.axis, fontSize: 11 } 
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar 
              dataKey="percentage" 
              radius={[6, 6, 0, 0]}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#goalGradient-${index})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lista obiettivi con dettagli */}
      <div className="mt-4 md:mt-6">
        <h4 className={`text-base md:text-lg font-bold ${colors.text.primary} mb-3 md:mb-4`}>
          Dettaglio Obiettivi
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3">
          {chartData.map((goal) => (
            <div key={goal.id} className={`${isDarkMode ? 'bg-gray-800/50 border border-gray-600/30' : 'bg-white/50 border border-slate-200/30'} rounded-lg md:rounded-xl p-3 backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 md:w-6 md:h-6 rounded-md md:rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${goal.color}20`, border: `1px solid ${goal.color}40` }}
                  >
                    <goal.icon className="w-2.5 h-2.5 md:w-3 md:h-3" style={{ color: goal.color }} />
                  </div>
                  <div>
                    <h5 className={`${colors.text.primary} font-semibold text-xs md:text-sm`}>
                      {goal.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-xs border ${getPriorityColor(goal.priority)}`}>
                        {goal.priority.toUpperCase()}
                      </span>
                      <div className={`flex items-center gap-1 ${colors.text.muted} text-xs`}>
                        <Calendar className="w-2 h-2 md:w-2.5 md:h-2.5" />
                        <span>{goal.monthsToDeadline}m</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm md:text-base font-bold" style={{ color: goal.color }}>
                    {goal.percentage}%
                  </p>
                  <p className={`${colors.text.muted} text-xs`}>
                    {formatCurrency(goal.current)}
                  </p>
                </div>
              </div>
              
              {/* Progress bar compatta */}
              <div className="mb-2">
                <div className={`h-1.5 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'} rounded-full overflow-hidden`}>
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${goal.percentage}%`,
                      backgroundColor: goal.color,
                      boxShadow: `0 0 8px ${goal.color}60`
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className={`${colors.text.muted}`}>
                    Target: <span className={`${colors.text.primary}`}>{formatCurrency(goal.target)}</span>
                  </span>
                  <span className={`${colors.text.muted} hidden md:inline`}>
                    Mensile: <span className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>{formatCurrency(goal.monthlyContribution)}</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${goal.onTrack ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className={`text-xs ${goal.onTrack ? 'text-green-400' : 'text-red-400'}`}>
                    {goal.onTrack ? 'OK' : 'Ritardo'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiche finali */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
        <div className={`${isDarkMode ? 'bg-gray-900/60 border border-gray-600/30' : 'bg-white/60 border border-slate-200/30'} rounded-xl md:rounded-2xl p-3 md:p-4 text-center backdrop-blur-sm`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className={`${colors.text.secondary} text-xs md:text-sm font-medium`}>
              Totale Risparmiato
            </span>
          </div>
          <p className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} text-lg md:text-2xl font-bold`}>
            {formatCurrency(totalSaved)}
          </p>
          <p className={`${colors.text.muted} text-xs mt-1`}>
            su {formatCurrency(totalTarget)}
          </p>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-900/60 border border-gray-600/30' : 'bg-white/60 border border-slate-200/30'} rounded-xl md:rounded-2xl p-3 md:p-4 text-center backdrop-blur-sm`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`${colors.text.secondary} text-xs md:text-sm font-medium`}>
              Impegno Mensile
            </span>
          </div>
          <p className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-lg md:text-2xl font-bold`}>
            {formatCurrency(totalMonthly)}
          </p>
          <p className={`${colors.text.muted} text-xs mt-1`}>
            verso tutti gli obiettivi
          </p>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-900/60 border border-gray-600/30' : 'bg-white/60 border border-slate-200/30'} rounded-xl md:rounded-2xl p-3 md:p-4 text-center backdrop-blur-sm`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            <span className={`${colors.text.secondary} text-xs md:text-sm font-medium`}>
              In Linea
            </span>
          </div>
          <p className={`${isDarkMode ? 'text-amber-400' : 'text-amber-600'} text-lg md:text-2xl font-bold`}>
            {goalsOnTrack}/{goals.length}
          </p>
          <p className={`${colors.text.muted} text-xs mt-1`}>
            obiettivi raggiungibili
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoalsProgressChart;