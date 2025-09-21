// src/components/statistics/chart/ExpenseChart.tsx
import React, { forwardRef } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import ChartHoverExport from "../ChartHoverExport";
import { useAdvancedChartsContext } from "../../../context/AdvancedChartsContext";


interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  icon: React.ComponentType<any>;
}

interface ExpenseChartProps {
  data: ChartData[];
  chartType: 'pie' | 'bar';
  onChartTypeChange: (type: 'pie' | 'bar') => void;
  formatCurrency: (amount: number) => string;
  getTotalExpenses: () => number;
  customTooltip: React.ComponentType<any>;
}

const ExpenseChart = forwardRef<HTMLDivElement, ExpenseChartProps>(({
  data,
  chartType,
  onChartTypeChange,
  formatCurrency,
  getTotalExpenses,
  customTooltip: CustomTooltip
}, ref) => {
  const { isDarkMode } = useTheme();
  const { quickExport, openExportModal } = useAdvancedChartsContext();
  // Theme colors seguendo il design system GoalFin
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro
        background: {
          main: "bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900",
          chart: "bg-gray-900/30",
          total: "bg-gray-900/50",
          toggle: "bg-gray-800/80"
        },
        text: {
          primary: "text-white",
          secondary: "text-gray-400",
          muted: "text-gray-500"
        },
        border: {
          main: "border-gray-700/50",
          chart: "border-gray-600/20",
          total: "border-gray-600/30",
          toggle: "border-gray-600/30"
        },
        gradient: "from-red-400 to-pink-400",
        chart: {
          grid: "#374151",
          axis: "#9CA3AF"
        }
      };
    } else {
      return {
        // ☀️ Tema Chiaro
        background: {
          main: "bg-gradient-to-br from-white to-gray-50",
          chart: "bg-gray-50/40",
          total: "bg-white/80",
          toggle: "bg-white/90"
        },
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-600",
          muted: "text-gray-500"
        },
        border: {
          main: "border-gray-200/50",
          chart: "border-gray-300/30",
          total: "border-gray-300/50",
          toggle: "border-gray-300/50"
        },
        gradient: "from-red-600 to-pink-600",
        chart: {
          grid: "#E5E7EB",
          axis: "#6B7280"
        }
      };
    }
  };

  const theme = getThemeColors();

  const getExportConfig = () => ({
    chartId: 'expense-chart',
    chartName: 'Grafico Spese',
    availableFormats: ['PNG', 'CSV', 'JSON', 'PDF'] as const,
    data: data,
    chartRef: ref as React.RefObject<HTMLElement>
  });

  return (
    <div className={`${theme.background.main} p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border ${theme.border.main}`} ref={ref}>
      
      {/* Header - Responsive Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 md:mb-6 gap-4 lg:gap-0">
        
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-xl md:rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div>
                <h3 className={`text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  Spese per Categoria
                </h3>
                <p className={`${theme.text.secondary} text-xs md:text-sm`}>Distribuzione mensile</p>
              </div>
              {/* Export button sempre a fianco del titolo */}
              <ChartHoverExport
                chartId="expense-chart"
                chartName="Grafico Spese"
                availableFormats={['PNG', 'CSV', 'JSON', 'PDF']}
                onQuickExport={(format) => quickExport('expense-chart', format)}
                onAdvancedExport={() => openExportModal(getExportConfig())}
                position="inline"
              />
            </div>
          </div>
        </div>

        {/* Total Card - Responsive */}
        <div className={`text-left lg:text-right ${theme.background.total} p-3 md:p-4 rounded-xl md:rounded-2xl border ${theme.border.total} min-w-0 lg:min-w-[200px]`}>
          <p className={`${theme.text.secondary} text-xs md:text-sm`}>Totale periodo</p>
          <p className={`text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent break-words`}>
            {formatCurrency(getTotalExpenses())}
          </p>
        </div>
      </div>
      
      {/* Chart Container - Responsive */}
      <div className={`relative ${theme.background.chart} rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 border ${theme.border.chart}`}>
        
        {/* Responsive Chart */}
        <div className="w-full" style={{ height: 'clamp(250px, 50vw, 400px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius="85%"
                  innerRadius="45%"
                  fill="#8884d8"
                  dataKey="value"
                  stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                  strokeWidth={1}
                  label={({ name, value }) => {
                    const numValue = typeof value === 'number' ? value : 0;
                    const total = getTotalExpenses();
                    const percentage = total > 0 ? ((numValue / total) * 100).toFixed(1) : 0;
                    // Responsive label - hide on small screens
                    return window.innerWidth > 640 ? `${name}: ${percentage}%` : `${percentage}%`;
                  }}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <BarChart data={data} margin={{ 
                top: 20, 
                right: window.innerWidth > 768 ? 30 : 10, 
                left: window.innerWidth > 768 ? 20 : 10, 
                bottom: window.innerWidth > 640 ? 5 : 40 
              }}>
                <defs>
                  {data.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.4}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke={theme.chart.axis}
                  fontSize={window.innerWidth > 640 ? 12 : 10}
                  tick={{ fill: theme.chart.axis }}
                  angle={window.innerWidth > 640 ? 0 : -45}
                  textAnchor={window.innerWidth > 640 ? 'middle' : 'end'}
                  height={window.innerWidth > 640 ? 30 : 60}
                />
                <YAxis 
                  stroke={theme.chart.axis}
                  fontSize={window.innerWidth > 640 ? 12 : 10}
                  tick={{ fill: theme.chart.axis }}
                  width={window.innerWidth > 640 ? 60 : 40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#gradient-${index})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Chart Type Toggle - Responsive Position */}
        <div className="absolute top-2 md:top-3 lg:top-4 right-2 md:right-3 lg:right-4">
          <div className={`flex gap-0.5 md:gap-1 ${theme.background.toggle} backdrop-blur-sm rounded-lg md:rounded-xl p-0.5 md:p-1 border ${theme.border.toggle}`}>
            <button
              onClick={() => onChartTypeChange('pie')}
              className={`px-2 md:px-3 py-1 md:py-2 rounded-md md:rounded-lg text-xs md:text-sm transition-all duration-300 ${
                chartType === 'pie' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                  : `${theme.text.secondary} hover:text-white hover:bg-gray-700/50`
              }`}
            >
              <span className="hidden sm:inline">🍰 Torta</span>
              <span className="sm:hidden">🍰</span>
            </button>
            <button
              onClick={() => onChartTypeChange('bar')}
              className={`px-2 md:px-3 py-1 md:py-2 rounded-md md:rounded-lg text-xs md:text-sm transition-all duration-300 ${
                chartType === 'bar' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                  : `${theme.text.secondary} hover:text-white hover:bg-gray-700/50`
              }`}
            >
              <span className="hidden sm:inline">📊 Barre</span>
              <span className="sm:hidden">📊</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ExpenseChart.displayName = 'ExpenseChart';

export default ExpenseChart;