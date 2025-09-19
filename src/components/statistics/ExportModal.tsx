// src/components/statistics/ExportModal.tsx
import React from 'react';
import { X, FileText, Database, Download, Calendar, Settings } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface ExportSettings {
  format: 'CSV' | 'JSON' | 'Excel';
  includeCharts: boolean;
  dateRange: string;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportSettings: ExportSettings;
  onUpdateSettings: (settings: ExportSettings) => void;
  onExport: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  exportSettings,
  onUpdateSettings,
  onExport
}) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  // Theme colors seguendo il design system GoalFin
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro
        background: {
          backdrop: "bg-gray-900/80",
          modal: "bg-gray-800",
          card: "bg-gray-700/30",
          input: "bg-gray-700/50",
          gradient: "from-indigo-500 via-purple-500 to-teal-400"
        },
        text: {
          primary: "text-gray-50", // #F9FAFB
          secondary: "text-gray-300", // #D1D5DB
          muted: "text-gray-400", // #6B7280
          white: "text-white",
          onGradient: "text-white"
        },
        border: "border-gray-700/50",
        accent: {
          primary: "bg-indigo-500",
          hover: "hover:bg-gray-600/40",
          selected: "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-400/50"
        }
      };
    } else {
      return {
        // ☀️ Tema Chiaro
        background: {
          backdrop: "bg-gray-900/60",
          modal: "bg-white",
          card: "bg-gray-100/50",
          input: "bg-white",
          gradient: "from-indigo-500 via-purple-500 to-teal-400"
        },
        text: {
          primary: "text-gray-900", // #0F172A
          secondary: "text-gray-700", // #334155
          muted: "text-gray-600", // #64748B
          white: "text-white",
          onGradient: "text-white"
        },
        border: "border-gray-200",
        accent: {
          primary: "bg-indigo-500",
          hover: "hover:bg-gray-200/60",
          selected: "bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-400"
        }
      };
    }
  };

  const theme = getThemeColors();

  const updateFormat = (format: 'CSV' | 'JSON' | 'Excel') => {
    onUpdateSettings({ ...exportSettings, format });
  };

  const updateIncludeCharts = (includeCharts: boolean) => {
    onUpdateSettings({ ...exportSettings, includeCharts });
  };

  const updateDateRange = (dateRange: string) => {
    onUpdateSettings({ ...exportSettings, dateRange });
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'CSV': return <FileText className="w-4 h-4" />;
      case 'JSON': return <Database className="w-4 h-4" />;
      case 'Excel': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'CSV': return 'Tabelle compatibili';
      case 'JSON': return 'Dati strutturati';
      case 'Excel': return 'Fogli di calcolo';
      default: return 'Formato dati';
    }
  };

  const getDateRangeLabel = (range: string) => {
    const labels = {
      '1M': 'Ultimo mese',
      '3M': 'Ultimi 3 mesi', 
      '6M': 'Ultimi 6 mesi',
      '1Y': 'Ultimo anno',
      'ALL': 'Tutti i dati'
    };
    return labels[range as keyof typeof labels] || range;
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Esporta Dati
                </h3>
                <p className="text-white/80 text-sm">Configura le opzioni di esportazione</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl text-white/80 hover:text-white transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Format Selection */}
          <div>
            <label className="block text-lg font-semibold mb-4 text-gray-100">
              Formato di esportazione
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['CSV', 'JSON', 'Excel'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => updateFormat(format)}
                  className={`p-4 rounded-2xl text-sm transition-all duration-200 flex flex-col items-center justify-center gap-3 border-2 group hover:scale-105 ${
                    exportSettings.format === format
                      ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-400/50 shadow-lg shadow-indigo-500/20'
                      : 'bg-gray-700/30 border-gray-600/40 hover:bg-gray-600/40 hover:border-gray-500/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    exportSettings.format === format 
                      ? 'bg-indigo-500/30 text-indigo-300' 
                      : 'bg-gray-600/50 text-gray-400 group-hover:text-gray-300'
                  }`}>
                    {getFormatIcon(format)}
                  </div>
                  <div className="text-center">
                    <span className={`font-semibold block ${
                      exportSettings.format === format ? 'text-indigo-300' : 'text-gray-300'
                    }`}>
                      {format}
                    </span>
                    <span className={`text-xs ${
                      exportSettings.format === format ? 'text-indigo-400/80' : 'text-gray-500'
                    }`}>
                      {getFormatDescription(format)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-100">
              Opzioni aggiuntive
            </label>
            
            <div className="bg-gray-700/30 rounded-2xl p-4 border border-gray-600/30">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeCharts}
                    onChange={(e) => updateIncludeCharts(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                    exportSettings.includeCharts
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'border-gray-500 group-hover:border-gray-400'
                  }`}>
                    {exportSettings.includeCharts && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-gray-100 font-medium">Includi grafici</span>
                    <p className="text-gray-400 text-sm">Se supportato dal formato selezionato</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-lg font-semibold mb-4 text-gray-100 items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              Periodo di esportazione
            </label>
            <select
              value={exportSettings.dateRange}
              onChange={(e) => updateDateRange(e.target.value)}
              className="w-full bg-gray-700/50 border-2 border-gray-600/50 rounded-2xl px-4 py-3 text-gray-100 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-base"
            >
              <option value="1M">Ultimo mese</option>
              <option value="3M">Ultimi 3 mesi</option>
              <option value="6M">Ultimi 6 mesi</option>
              <option value="1Y">Ultimo anno</option>
              <option value="ALL">Tutti i dati</option>
            </select>
          </div>
          
          {/* Preview Info */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-4 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <span className="text-base font-semibold text-gray-100">Anteprima export</span>
            </div>
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex justify-between">
                <span>Formato:</span>
                <span className="text-indigo-300 font-medium">{exportSettings.format}</span>
              </div>
              <div className="flex justify-between">
                <span>Periodo:</span>
                <span className="text-indigo-300 font-medium">{getDateRangeLabel(exportSettings.dateRange)}</span>
              </div>
              <div className="flex justify-between">
                <span>Grafici inclusi:</span>
                <span className="text-indigo-300 font-medium">{exportSettings.includeCharts ? 'Sì' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t border-gray-700/50 bg-gray-800/50">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-2xl bg-gray-700/50 border-2 border-gray-600/50 text-gray-300 font-semibold hover:bg-gray-600/50 hover:text-white hover:border-gray-500/60 transition-all duration-200"
          >
            Annulla
          </button>
          <button
            onClick={onExport}
            className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 text-white font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-teal-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105"
          >
            <Download className="w-4 h-4" />
            Esporta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;