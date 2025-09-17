// src/components/statistics/ExportModal.tsx
import React from 'react';
import { X, FileText, Database, Download } from "lucide-react";

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
  if (!isOpen) return null;

  const updateFormat = (format: 'CSV' | 'JSON' | 'Excel') => {
    onUpdateSettings({ ...exportSettings, format });
  };

  const updateIncludeCharts = (includeCharts: boolean) => {
    onUpdateSettings({ ...exportSettings, includeCharts });
  };

  const updateDateRange = (dateRange: string) => {
    onUpdateSettings({ ...exportSettings, dateRange });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl w-full max-w-md shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Esporta Dati
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Formato di esportazione
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['CSV', 'JSON', 'Excel'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => updateFormat(format)}
                  className={`p-4 rounded-xl text-sm transition-all duration-200 flex flex-col items-center justify-center gap-2 border ${
                    exportSettings.format === format
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50 text-blue-300 shadow-lg'
                      : 'bg-gray-700/30 border-gray-600/50 text-gray-300 hover:bg-gray-600/40 hover:border-gray-500/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    exportSettings.format === format 
                      ? 'bg-blue-500/30' 
                      : 'bg-gray-600/50'
                  }`}>
                    {format === 'CSV' && <FileText className="w-4 h-4" />}
                    {format === 'JSON' && <Database className="w-4 h-4" />}
                    {format === 'Excel' && <FileText className="w-4 h-4" />}
                  </div>
                  <span className="font-medium">{format}</span>
                  <span className="text-xs opacity-70">
                    {format === 'CSV' && 'Tabelle'}
                    {format === 'JSON' && 'Dati strutturati'}
                    {format === 'Excel' && 'Fogli di calcolo'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Opzioni aggiuntive
            </label>
            
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeCharts}
                    onChange={(e) => updateIncludeCharts(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                    exportSettings.includeCharts
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-500 group-hover:border-gray-400'
                  }`}>
                    {exportSettings.includeCharts && (
                      <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-gray-200 font-medium">Includi grafici</span>
                  <p className="text-gray-400 text-xs">Se supportato dal formato selezionato</p>
                </div>
              </label>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Periodo di esportazione
            </label>
            <select
              value={exportSettings.dateRange}
              onChange={(e) => updateDateRange(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="1M">Ultimo mese</option>
              <option value="3M">Ultimi 3 mesi</option>
              <option value="6M">Ultimi 6 mesi</option>
              <option value="1Y">Ultimo anno</option>
              <option value="ALL">Tutti i dati</option>
            </select>
          </div>
          
          {/* Preview Info */}
          <div className="bg-gray-700/20 rounded-xl p-4 border border-gray-600/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-300">Anteprima export</span>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Formato: <span className="text-blue-300">{exportSettings.format}</span></p>
              <p>• Periodo: <span className="text-blue-300">{exportSettings.dateRange}</span></p>
              <p>• Grafici inclusi: <span className="text-blue-300">{exportSettings.includeCharts ? 'Sì' : 'No'}</span></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-700/50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-gray-300 font-semibold hover:bg-gray-600/50 hover:text-white transition-all"
          >
            Annulla
          </button>
          <button
            onClick={onExport}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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