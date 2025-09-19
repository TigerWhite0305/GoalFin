// src/components/statistics/GranularExportSystem.tsx
import React, { useState } from 'react';
import { Download, FileText, Image, Database, Printer, Share2, Settings, X, Check } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext";

interface ExportConfig {
  chartId: string;
  chartName: string;
  availableFormats: readonly ('PNG' | 'SVG' | 'PDF' | 'CSV' | 'JSON' | 'Excel')[];
  data: any;
  chartRef?: React.RefObject<HTMLElement | null>;
}

interface GranularExportSystemProps {
  isOpen: boolean;
  onClose: () => void;
  exportConfig: ExportConfig;
  onExport: (format: string, options: ExportOptions) => void;
}

interface ExportOptions {
  format: string;
  fileName: string;
  includeHeader: boolean;
  includeTimestamp: boolean;
  quality: 'low' | 'medium' | 'high';
  backgroundColor: 'transparent' | 'white' | 'dark';
  dimensions: { width: number; height: number } | 'auto';
  dataRange: 'visible' | 'all' | 'filtered';
  compression: boolean;
}

const GranularExportSystem: React.FC<GranularExportSystemProps> = ({
  isOpen,
  onClose,
  exportConfig,
  onExport
}) => {
  const { isDarkMode } = useTheme();
  const [selectedFormat, setSelectedFormat] = useState<string>(exportConfig.availableFormats[0] || 'PNG');
  const [options, setOptions] = useState<ExportOptions>({
    format: selectedFormat,
    fileName: `${exportConfig.chartName}_${new Date().toISOString().split('T')[0]}`,
    includeHeader: true,
    includeTimestamp: true,
    quality: 'high',
    backgroundColor: 'transparent',
    dimensions: 'auto',
    dataRange: 'visible',
    compression: false
  });

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
          white: "text-white"
        },
        border: "border-gray-700/50",
        accent: {
          primary: "bg-indigo-500",
          hover: "hover:bg-gray-600/40",
          selected: "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/50 text-indigo-300"
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
          white: "text-white"
        },
        border: "border-gray-200",
        accent: {
          primary: "bg-indigo-500",
          hover: "hover:bg-gray-200/60",
          selected: "bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-400 text-indigo-700"
        }
      };
    }
  };

  const theme = getThemeColors();

  const updateOption = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const isImageFormat = ['PNG', 'SVG', 'PDF'].includes(selectedFormat);
  const isDataFormat = ['CSV', 'JSON', 'Excel'].includes(selectedFormat);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PNG': case 'SVG': return <Image className="w-3 h-3" />;
      case 'PDF': return <Printer className="w-3 h-3" />;
      case 'CSV': case 'Excel': return <FileText className="w-3 h-3" />;
      case 'JSON': return <Database className="w-3 h-3" />;
      default: return <Download className="w-3 h-3" />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'PNG': return 'Immagine ad alta qualità, perfetta per presentazioni';
      case 'SVG': return 'Grafico vettoriale scalabile, ideale per stampa';
      case 'PDF': return 'Documento professionale con layout preservato';
      case 'CSV': return 'Dati tabellari compatibili con Excel e fogli di calcolo';
      case 'JSON': return 'Dati strutturati per sviluppatori e API';
      case 'Excel': return 'Foglio di calcolo nativo con formattazione avanzata';
      default: return 'Formato di esportazione standard';
    }
  };

  const handleExport = () => {
    onExport(selectedFormat, { ...options, format: selectedFormat });
  };

  return (
    <div className={`fixed inset-0 ${theme.background.backdrop} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`${theme.background.modal} border ${theme.border} rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden`}>
        
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${theme.background.gradient} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Download className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Esporta Grafico</h3>
                <p className="text-white/80 text-xs">{exportConfig.chartName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          
          {/* Format Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}>Formato di Export</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {exportConfig.availableFormats.map((format) => (
                <button
                  key={format}
                  onClick={() => {
                    setSelectedFormat(format);
                    updateOption('format', format);
                  }}
                  className={`p-3 rounded-xl transition-all duration-200 border text-xs ${
                    selectedFormat === format
                      ? theme.accent.selected
                      : `${theme.background.card} ${theme.border} ${theme.text.secondary} ${theme.accent.hover} hover:border-gray-500/50`
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    {getFormatIcon(format)}
                    <span className="font-medium">{format}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className={`${theme.text.muted} text-xs mt-1`}>{getFormatDescription(selectedFormat)}</p>
          </div>

          {/* File Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}>Nome File</label>
            <input
              type="text"
              value={options.fileName}
              onChange={(e) => updateOption('fileName', e.target.value)}
              className={`w-full p-2 rounded-xl ${theme.background.input} border ${theme.border} ${theme.text.primary} placeholder-gray-400 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 text-sm`}
              placeholder="nome_file"
            />
          </div>

          {/* Image-specific options */}
          {isImageFormat && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}>Qualità</label>
                <select
                  value={options.quality}
                  onChange={(e) => updateOption('quality', e.target.value)}
                  className={`w-full p-2 rounded-xl ${theme.background.input} border ${theme.border} ${theme.text.primary} text-sm`}
                >
                  <option value="low">Bassa (veloce)</option>
                  <option value="medium">Media (bilanciata)</option>
                  <option value="high">Alta (migliore)</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}>Sfondo</label>
                <select
                  value={options.backgroundColor}
                  onChange={(e) => updateOption('backgroundColor', e.target.value)}
                  className={`w-full p-2 rounded-xl ${theme.background.input} border ${theme.border} ${theme.text.primary} text-sm`}
                >
                  <option value="transparent">Trasparente</option>
                  <option value="white">Bianco</option>
                  <option value="dark">Scuro</option>
                </select>
              </div>
            </div>
          )}

          {/* Data-specific options */}
          {isDataFormat && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}>Dati da Includere</label>
                <select
                  value={options.dataRange}
                  onChange={(e) => updateOption('dataRange', e.target.value)}
                  className={`w-full p-2 rounded-xl ${theme.background.input} border ${theme.border} ${theme.text.primary} text-sm`}
                >
                  <option value="visible">Solo dati visibili</option>
                  <option value="filtered">Dati filtrati</option>
                  <option value="all">Tutti i dati</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.compression}
                    onChange={(e) => updateOption('compression', e.target.checked)}
                    className="w-3 h-3 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={`${theme.text.secondary} text-xs`}>Comprimi file</span>
                </label>
              </div>
            </div>
          )}

          {/* Common Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeHeader}
                onChange={(e) => updateOption('includeHeader', e.target.checked)}
                className="w-3 h-3 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
              />
              <span className={`${theme.text.secondary} text-xs`}>Includi intestazione</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeTimestamp}
                onChange={(e) => updateOption('includeTimestamp', e.target.checked)}
                className="w-3 h-3 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
              />
              <span className={`${theme.text.secondary} text-xs`}>Aggiungi timestamp</span>
            </label>
          </div>

          {/* Preview Info */}
          <div className={`${theme.background.card} rounded-xl p-3 border ${theme.border}`}>
            <h4 className={`${theme.text.primary} font-medium mb-2 flex items-center gap-2 text-sm`}>
              <Settings className="w-3 h-3" />
              Anteprima Export
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className={theme.text.muted}>Formato:</span>
                <span className={`${theme.text.primary} ml-2`}>{selectedFormat}</span>
              </div>
              <div>
                <span className={theme.text.muted}>Qualità:</span>
                <span className={`${theme.text.primary} ml-2`}>{options.quality}</span>
              </div>
              <div>
                <span className={theme.text.muted}>Nome file:</span>
                <span className={`${theme.text.primary} ml-2`}>{options.fileName}.{selectedFormat.toLowerCase()}</span>
              </div>
              <div>
                <span className={theme.text.muted}>Dimensione stimata:</span>
                <span className={`${theme.text.primary} ml-2`}>~2.5 MB</span>
              </div>
            </div>
          </div>

          {/* Quick Export Buttons */}
          <div className={`border-t ${theme.border} pt-3`}>
            <h4 className={`${theme.text.primary} font-medium mb-2 text-sm`}>Export Rapido</h4>
            <div className="flex gap-2">
              <button
                onClick={() => onExport('PNG', { ...options, format: 'PNG', quality: 'high' })}
                className="px-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs transition flex items-center gap-1"
              >
                <Image className="w-3 h-3" />
                PNG HD
              </button>
              <button
                onClick={() => onExport('CSV', { ...options, format: 'CSV' })}
                className="px-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs transition flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                CSV Dati
              </button>
              <button
                onClick={() => onExport('PDF', { ...options, format: 'PDF' })}
                className="px-2 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs transition flex items-center gap-1"
              >
                <Printer className="w-3 h-3" />
                PDF Print
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-4 border-t ${theme.border} ${theme.background.card}`}>
          <div className={`flex items-center gap-2 ${theme.text.muted} text-xs`}>
            <Share2 className="w-3 h-3" />
            <span>L'export includerà solo i dati del grafico selezionato</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`px-3 py-2 rounded-xl ${theme.background.card} border ${theme.border} ${theme.text.secondary} ${theme.accent.hover} transition-all text-xs`}
            >
              Annulla
            </button>
            <button
              onClick={handleExport}
              className={`px-4 py-2 rounded-xl bg-gradient-to-r ${theme.background.gradient} text-white hover:from-indigo-600 hover:via-purple-600 hover:to-teal-500 transition-all shadow-md flex items-center gap-2 text-xs`}
            >
              <Download className="w-3 h-3" />
              Esporta {selectedFormat}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GranularExportSystem;