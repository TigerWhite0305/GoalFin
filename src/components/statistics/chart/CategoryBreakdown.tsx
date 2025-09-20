// src/components/statistics/chart/CategoryBreakdown.tsx
import React, { forwardRef } from 'react';
import { Activity, DollarSign } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import ChartHoverExport from "../ChartHoverExport";
import useAdvancedCharts from "../../../hooks/useAdvancedCharts";

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  icon: React.ComponentType<any>;
}

interface CategoryBreakdownProps {
  data: ChartData[];
  formatCurrency: (amount: number) => string;
  getTotalExpenses: () => number;
  selectedPeriod: string;
}

const CategoryBreakdown = forwardRef<HTMLDivElement, CategoryBreakdownProps>(({
  data,
  formatCurrency,
  getTotalExpenses,
  selectedPeriod
}, ref) => {
  const { isDarkMode } = useTheme();
  const { quickExport, openExportModal } = useAdvancedCharts();

  // Theme colors seguendo il design system GoalFin
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro
        background: {
          main: "bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900",
          card: "from-gray-700/30 to-gray-700/10",
          cardHover: "hover:from-gray-700/50 hover:to-gray-700/20",
          summary: "from-gray-900/60 to-gray-800/60",
          progress: "bg-gray-700/50"
        },
        text: {
          primary: "text-white",
          secondary: "text-gray-400", 
          muted: "text-gray-500"
        },
        border: {
          main: "border-gray-700/50",
          card: "border-gray-600/20",
          cardHover: "hover:border-gray-500/30",
          summary: "border-gray-600/30"
        },
        gradient: "from-purple-400 to-blue-400"
      };
    } else {
      return {
        // ☀️ Tema Chiaro
        background: {
          main: "bg-gradient-to-br from-white to-gray-50",
          card: "from-gray-100/50 to-gray-50/30",
          cardHover: "hover:from-gray-200/60 hover:to-gray-100/40",
          summary: "from-gray-100/80 to-gray-50/60",
          progress: "bg-gray-200/60"
        },
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-600",
          muted: "text-gray-500"
        },
        border: {
          main: "border-gray-200/50",
          card: "border-gray-300/30",
          cardHover: "hover:border-gray-400/50",
          summary: "border-gray-300/40"
        },
        gradient: "from-purple-600 to-blue-600"
      };
    }
  };

  const theme = getThemeColors();

  const getExportConfig = () => ({
    chartId: 'category-breakdown',
    chartName: 'Dettaglio Categorie',
    availableFormats: ['PNG', 'CSV', 'JSON'] as const,
    data: data,
    chartRef: ref as React.RefObject<HTMLElement>
  });

  return (
    <div className={`${theme.background.main} p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border ${theme.border.main} h-full flex flex-col`} ref={ref}>
      {/* Header - Responsive */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div>
                <h3 className={`text-lg md:text-xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  Dettaglio Categorie
                </h3>
                <p className={`${theme.text.secondary} text-xs md:text-sm`}>Analisi per categoria</p>
              </div>
              {/* Export button sempre a fianco del titolo */}
              <ChartHoverExport
                chartId="category-breakdown"
                chartName="Dettaglio Categorie"
                availableFormats={['PNG', 'CSV', 'JSON']}
                onQuickExport={(format) => quickExport('category-breakdown', format)}
                onAdvancedExport={() => openExportModal(getExportConfig())}
                position="inline"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Grid categorie - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 md:gap-3 flex-1 mb-3 md:mb-4">
        {data.slice(0, 6).map((expense, index) => {
          const IconComponent = expense.icon;
          return (
            <div 
              key={expense.name} 
              className={`group relative overflow-hidden bg-gradient-to-r ${theme.background.card} ${theme.background.cardHover} p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-300 border ${theme.border.card} ${theme.border.cardHover}`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Background glow effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg md:rounded-xl blur-xl"
                style={{ backgroundColor: expense.color }}
              ></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center shadow-md border ${isDarkMode ? 'border-gray-600/30' : 'border-gray-300/30'}`}
                      style={{ 
                        backgroundColor: `${expense.color}20`,
                        boxShadow: `0 0 10px ${expense.color}30`
                      }}
                    >
                      <IconComponent 
                        className="w-3 h-3 md:w-4 md:h-4" 
                        style={{ color: expense.color }} 
                      />
                    </div>
                    <div>
                      <span className={`font-semibold ${theme.text.primary} text-xs md:text-sm`}>{expense.name}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div 
                      className="font-bold text-sm md:text-base"
                      style={{ color: expense.color }}
                    >
                      {formatCurrency(expense.value)}
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className={`h-1 md:h-1.5 ${theme.background.progress} rounded-full overflow-hidden mb-1`}>
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ 
                      width: `${expense.percentage}%`,
                      backgroundColor: expense.color,
                      boxShadow: `0 0 6px ${expense.color}60`
                    }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shadow-sm"
                      style={{ 
                        backgroundColor: expense.color,
                        boxShadow: `0 0 4px ${expense.color}60`
                      }}
                    ></div>
                    <span className={`${theme.text.secondary} text-xs`}>{expense.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary Card - Responsive */}
      <div className={`p-2 md:p-3 bg-gradient-to-r ${theme.background.summary} rounded-lg md:rounded-xl border ${theme.border.summary}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
              <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </div>
            <div>
              <p className={`${theme.text.secondary} text-xs`}>Totale Spese</p>
              <p className={`${theme.text.primary} font-bold text-sm md:text-base`}>{formatCurrency(getTotalExpenses())}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`${theme.text.secondary} text-xs`}>Periodo</p>
            <p className={`${theme.text.primary} font-semibold text-sm md:text-base`}>{selectedPeriod}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

CategoryBreakdown.displayName = 'CategoryBreakdown';

export default CategoryBreakdown;