// src/components/statistics/StatisticsHeader.tsx
import React from 'react';
import { Download, Filter, Settings } from "lucide-react";

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
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
          Statistiche Dettagliate
        </h1>
        <p className="text-gray-400 mt-1">Analisi completa delle tue finanze</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Period Selector */}
        <div className="flex gap-1 bg-gray-800 rounded-xl p-1">
          {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                selectedPeriod === period
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Filters Button */}
        <button
          onClick={onToggleFilters}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtri
        </button>

        {/* Export Button */}
        <button
          onClick={onShowExportModal}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Esporta
        </button>

        {/* Settings Button */}
        <button
          onClick={onToggleSettings}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Impostazioni
        </button>
      </div>
    </div>
  );
};

export default StatisticsHeader;