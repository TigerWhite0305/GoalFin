import React from 'react';
import { Download, Filter, Settings } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface StatisticsHeaderProps {
  selectedPeriod: '1M' | '3M' | '6M' | '1Y' | 'ALL';
  onPeriodChange: (period: '1M' | '3M' | '6M' | '1Y' | 'ALL') => void;
  onToggleFilters: () => void;
  onToggleSettings: () => void;
  onShowExportModal: () => void;
}

const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({
  selectedPeriod,
  onPeriodChange,
  onToggleFilters,
  onToggleSettings,
  onShowExportModal
}) => {
  const { isDarkMode } = useTheme();

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

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div>
        <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent mb-2`}>
          Statistiche Dettagliate
        </h1>
        <p className={`${theme.text.muted} text-sm md:text-base`}>
          Analisi completa delle tue finanze
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Period Selector */}
        <div className={`flex gap-1 ${theme.background.card} ${theme.border} border rounded-lg p-1`}>
          {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : `${theme.text.secondary} ${theme.hover}`
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Filters Button */}
        <button
          onClick={onToggleFilters}
          className={`${theme.background.card} ${theme.border} border ${theme.hover} px-4 py-2 rounded-lg ${theme.text.secondary} hover:${theme.text.primary} font-medium transition-colors flex items-center gap-2`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filtri</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onShowExportModal}
          className={`bg-gradient-to-r ${theme.accent} text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2`}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Esporta</span>
        </button>
      </div>
    </div>
  );
};

export default StatisticsHeader;