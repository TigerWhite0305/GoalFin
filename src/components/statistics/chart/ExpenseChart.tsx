// src/components/statistics/chart/ExpenseChart.tsx
import React, { forwardRef } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown } from "lucide-react";
import ChartHoverExport from "../ChartHoverExport";
import useAdvancedCharts from "../../../hooks/useAdvancedCharts";

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
  // ✅ Usa l'hook direttamente nel componente
  const { quickExport, openExportModal } = useAdvancedCharts();

  // ✅ Configura l'export per questo specifico grafico
  const getExportConfig = () => ({
    chartId: 'expense-chart',
    chartName: 'Grafico Spese',
    availableFormats: ['PNG', 'CSV', 'JSON', 'PDF'] as const,
    data: data,
    chartRef: ref as React.RefObject<HTMLElement>
  });

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-700/50" ref={ref}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Spese per Categoria
            </h3>
            <p className="text-gray-400 text-sm">Distribuzione mensile</p>
          </div>
          {/* ✅ Ora usa le funzioni dell'hook locale */}
          <div>
            <ChartHoverExport
              chartId="expense-chart"
              chartName="Grafico Spese"
              availableFormats={['PNG', 'CSV', 'JSON', 'PDF']}
              onQuickExport={(format) => quickExport('expense-chart', format)}
              onAdvancedExport={() => openExportModal(getExportConfig())}
            />
          </div>
        </div>
        <div className="text-right bg-gray-900/50 p-4 rounded-2xl border border-gray-600/30">
          <p className="text-gray-400 text-sm">Totale periodo</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            {formatCurrency(getTotalExpenses())}
          </p>
        </div>
      </div>
      
      <div className="relative bg-gray-900/30 rounded-2xl p-6 border border-gray-600/20">
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={150}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
                label={({ name, value }) => {
                  const numValue = typeof value === 'number' ? value : 0;
                  const total = getTotalExpenses();
                  const percentage = total > 0 ? ((numValue / total) * 100).toFixed(1) : 0;
                  return `${name}: ${percentage}%`;
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
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                {data.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.4}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
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
        
        {/* Chart Type Toggle */}
        <div className="absolute top-4 right-4">
          <div className="flex gap-1 bg-gray-800/80 backdrop-blur-sm rounded-xl p-1 border border-gray-600/30">
            <button
              onClick={() => onChartTypeChange('pie')}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                chartType === 'pie' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🍰 Torta
            </button>
            <button
              onClick={() => onChartTypeChange('bar')}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                chartType === 'bar' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              📊 Barre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ExpenseChart.displayName = 'ExpenseChart';

export default ExpenseChart;