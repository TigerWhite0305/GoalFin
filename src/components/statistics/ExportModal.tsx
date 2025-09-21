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

  // Theme-aware colors seguendo il design system
  const getThemeColors = () => ({
    background: {
      backdrop: isDarkMode ? "bg-gray-900/80" : "bg-gray-900/60",
      modal: isDarkMode ? "bg-gray-800" : "bg-white",
      card: isDarkMode ? "bg-gray-700/30" : "bg-gray-100/50",
      input: isDarkMode ? "bg-gray-700/50" : "bg-white",
      gradient: "from-indigo-500 via-purple-500 to-teal-400"
    },
    text: {
      primary: isDarkMode ? "text-gray-50" : "text-gray-900",
      secondary: isDarkMode ? "text-gray-300" : "text-gray-700",
      muted: isDarkMode ? "text-gray-400" : "text-gray-600",
      white: "text-white"
    },
    border: isDarkMode ? "border-gray-700/50" : "border-gray-200",
    accent: {
      selected: isDarkMode 
        ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-400/50" 
        : "bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-400",
      hover: isDarkMode ? "hover:bg-gray-600/40" : "hover:bg-gray-200/60",
      checkbox: isDarkMode ? "border-gray-500 group-hover:border-gray-400" : "border-gray-400 group-hover:border-gray-300"
    }
  });

  const colors = getThemeColors();

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
      case 'CSV': return <FileText className="w-3 h-3 md:w-4 md:h-4" />;
      case 'JSON': return <Database className="w-3 h-3 md:w-4 md:h-4" />;
      case 'Excel': return <FileText className="w-3 h-3 md:w-4 md:h-4" />;
      default: return <FileText className="w-3 h-3 md:w-4 md:h-4" />;
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
    <div className={`fixed inset-0 ${colors.background.backdrop} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`${colors.background.modal} border ${colors.border} rounded-2xl md:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden transition-all duration-300`}>
        
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${colors.background.gradient} p-4 md:p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30`}>
                <Download className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-white">
                  Esporta Dashboard
                </h3>
                <p className="text-white/80 text-xs md:text-sm">Configura le opzioni di esportazione</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 hover:bg-white/20 rounded-lg md:rounded-xl text-white/80 hover:text-white transition-all duration-200"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Content - Layout orizzontale */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            
            {/* Colonna sinistra - Format Selection */}
            <div>
              <label className={`block text-base md:text-lg font-semibold mb-3 md:mb-4 ${colors.text.primary}`}>
                Formato di esportazione
              </label>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {(['CSV', 'JSON', 'Excel'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => updateFormat(format)}
                    className={`p-3 md:p-4 rounded-xl md:rounded-2xl text-xs md:text-sm transition-all duration-200 flex flex-col items-center justify-center gap-2 md:gap-3 border-2 group hover:scale-105 ${
                      exportSettings.format === format
                        ? `${colors.accent.selected} shadow-lg shadow-indigo-500/20`
                        : `${colors.background.card} border-gray-600/40 ${colors.accent.hover} hover:border-gray-500/60`
                    }`}
                  >
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-200 ${
                      exportSettings.format === format 
                        ? (isDarkMode ? 'bg-indigo-500/30 text-indigo-300' : 'bg-indigo-200 text-indigo-700')
                        : (isDarkMode ? 'bg-gray-600/50 text-gray-400 group-hover:text-gray-300' : 'bg-gray-200/50 text-gray-600 group-hover:text-gray-700')
                    }`}>
                      {getFormatIcon(format)}
                    </div>
                    <div className="text-center">
                      <span className={`font-semibold block ${
                        exportSettings.format === format 
                          ? (isDarkMode ? 'text-indigo-300' : 'text-indigo-700') 
                          : colors.text.secondary
                      }`}>
                        {format}
                      </span>
                      <span className={`text-xs ${
                        exportSettings.format === format 
                          ? (isDarkMode ? 'text-indigo-400/80' : 'text-indigo-600/80') 
                          : colors.text.muted
                      }`}>
                        {getFormatDescription(format)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colonna destra - Options e Date Range */}
            <div className="space-y-4 md:space-y-6">
              
              {/* Options */}
              <div>
                <label className={`block text-base md:text-lg font-semibold mb-3 md:mb-4 ${colors.text.primary}`}>
                  Opzioni aggiuntive
                </label>
                
                <div className={`${colors.background.card} rounded-xl md:rounded-2xl p-3 md:p-4 border ${colors.border}`}>
                  <label className="flex items-center gap-3 md:gap-4 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={exportSettings.includeCharts}
                        onChange={(e) => updateIncludeCharts(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                        exportSettings.includeCharts
                          ? 'bg-indigo-500 border-indigo-500'
                          : colors.accent.checkbox
                      }`}>
                        {exportSettings.includeCharts && (
                          <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <Settings className={`w-4 h-4 md:w-5 md:h-5 ${colors.text.muted}`} />
                      <div>
                        <span className={`${colors.text.primary} font-medium text-sm md:text-base`}>Includi grafici</span>
                        <p className={`${colors.text.muted} text-xs md:text-sm`}>Se supportato dal formato</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className={`flex items-center gap-2 text-base md:text-lg font-semibold mb-3 md:mb-4 ${colors.text.primary}`}>
                  <Calendar className={`w-4 h-4 md:w-5 md:h-5 ${colors.text.muted}`} />
                  Periodo di esportazione
                </label>
                <select
                  value={exportSettings.dateRange}
                  onChange={(e) => updateDateRange(e.target.value)}
                  className={`w-full ${colors.background.input} border-2 ${colors.border} rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 ${colors.text.primary} focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-sm md:text-base`}
                >
                  <option value="1M">Ultimo mese</option>
                  <option value="3M">Ultimi 3 mesi</option>
                  <option value="6M">Ultimi 6 mesi</option>
                  <option value="1Y">Ultimo anno</option>
                  <option value="ALL">Tutti i dati</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Preview Info */}
          <div className={`mt-4 md:mt-6 ${isDarkMode ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'} rounded-xl md:rounded-2xl p-3 md:p-4`}>
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className={`w-2 h-2 ${isDarkMode ? 'bg-indigo-400' : 'bg-indigo-600'} rounded-full`}></div>
              <span className={`text-sm md:text-base font-semibold ${colors.text.primary}`}>Anteprima export</span>
            </div>
            <div className={`text-xs md:text-sm ${colors.text.secondary} grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4`}>
              <div className="flex justify-between md:flex-col md:justify-start">
                <span>Formato:</span>
                <span className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} font-medium`}>{exportSettings.format}</span>
              </div>
              <div className="flex justify-between md:flex-col md:justify-start">
                <span>Periodo:</span>
                <span className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} font-medium`}>{getDateRangeLabel(exportSettings.dateRange)}</span>
              </div>
              <div className="flex justify-between md:flex-col md:justify-start">
                <span>Grafici inclusi:</span>
                <span className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} font-medium`}>{exportSettings.includeCharts ? 'Sì' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 md:gap-4 p-4 md:p-6 border-t ${colors.border} ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
          <button
            onClick={onClose}
            className={`flex-1 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl ${isDarkMode ? 'bg-gray-700/50 border-2 border-gray-600/50 text-gray-300 hover:bg-gray-600/50 hover:text-white hover:border-gray-500/60' : 'bg-gray-200/50 border-2 border-gray-300/50 text-gray-700 hover:bg-gray-300/50 hover:text-gray-900 hover:border-gray-400/60'} font-semibold transition-all duration-200 text-sm md:text-base`}
          >
            Annulla
          </button>
          <button
            onClick={onExport}
            className={`flex-1 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r ${colors.background.gradient} text-white font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-teal-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105 text-sm md:text-base`}
          >
            <Download className="w-3 h-3 md:w-4 md:h-4" />
            Esporta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;