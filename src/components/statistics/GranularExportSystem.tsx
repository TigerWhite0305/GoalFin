// src/components/statistics/GranularExportSystem.tsx
import React, { useState } from 'react';
import { Download, FileText, Image, Database, Printer, Share2, Settings, X, Check } from 'lucide-react';

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

  const updateOption = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const isImageFormat = ['PNG', 'SVG', 'PDF'].includes(selectedFormat);
  const isDataFormat = ['CSV', 'JSON', 'Excel'].includes(selectedFormat);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PNG': case 'SVG': return <Image className="w-4 h-4" />;
      case 'PDF': return <Printer className="w-4 h-4" />;
      case 'CSV': case 'Excel': return <FileText className="w-4 h-4" />;
      case 'JSON': return <Database className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-3xl w-full max-w-2xl shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Esporta Grafico</h3>
              <p className="text-gray-400 text-sm">{exportConfig.chartName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">Formato di Export</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {exportConfig.availableFormats.map((format) => (
                <button
                  key={format}
                  onClick={() => {
                    setSelectedFormat(format);
                    updateOption('format', format);
                  }}
                  className={`p-4 rounded-xl transition-all duration-200 border ${
                    selectedFormat === format
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50 text-blue-300'
                      : 'bg-gray-700/30 border-gray-600/50 text-gray-300 hover:bg-gray-600/40 hover:border-gray-500/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {getFormatIcon(format)}
                    <span className="font-semibold text-sm">{format}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-2">{getFormatDescription(selectedFormat)}</p>
          </div>

          {/* File Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Nome File</label>
            <input
              type="text"
              value={options.fileName}
              onChange={(e) => updateOption('fileName', e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              placeholder="nome_file"
            />
          </div>

          {/* Image-specific options */}
          {isImageFormat && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Qualità</label>
                <select
                  value={options.quality}
                  onChange={(e) => updateOption('quality', e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white"
                >
                  <option value="low">Bassa (veloce)</option>
                  <option value="medium">Media (bilanciata)</option>
                  <option value="high">Alta (migliore)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Sfondo</label>
                <select
                  value={options.backgroundColor}
                  onChange={(e) => updateOption('backgroundColor', e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Dati da Includere</label>
                <select
                  value={options.dataRange}
                  onChange={(e) => updateOption('dataRange', e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600/50 text-white"
                >
                  <option value="visible">Solo dati visibili</option>
                  <option value="filtered">Dati filtrati</option>
                  <option value="all">Tutti i dati</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-7">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.compression}
                    onChange={(e) => updateOption('compression', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 text-sm">Comprimi file</span>
                </label>
              </div>
            </div>
          )}

          {/* Common Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeHeader}
                onChange={(e) => updateOption('includeHeader', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-300 text-sm">Includi intestazione</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeTimestamp}
                onChange={(e) => updateOption('includeTimestamp', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-300 text-sm">Aggiungi timestamp</span>
            </label>
          </div>

          {/* Preview Info */}
          <div className="bg-gray-700/20 rounded-xl p-4 border border-gray-600/20">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Anteprima Export
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Formato:</span>
                <span className="text-white ml-2">{selectedFormat}</span>
              </div>
              <div>
                <span className="text-gray-400">Qualità:</span>
                <span className="text-white ml-2">{options.quality}</span>
              </div>
              <div>
                <span className="text-gray-400">Nome file:</span>
                <span className="text-white ml-2">{options.fileName}.{selectedFormat.toLowerCase()}</span>
              </div>
              <div>
                <span className="text-gray-400">Dimensione stimata:</span>
                <span className="text-white ml-2">~2.5 MB</span>
              </div>
            </div>
          </div>

          {/* Quick Export Buttons */}
          <div className="border-t border-gray-700/50 pt-4">
            <h4 className="text-white font-medium mb-3">Export Rapido</h4>
            <div className="flex gap-2">
              <button
                onClick={() => onExport('PNG', { ...options, format: 'PNG', quality: 'high' })}
                className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm transition flex items-center gap-1"
              >
                <Image className="w-3 h-3" />
                PNG HD
              </button>
              <button
                onClick={() => onExport('CSV', { ...options, format: 'CSV' })}
                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                CSV Dati
              </button>
              <button
                onClick={() => onExport('PDF', { ...options, format: 'PDF' })}
                className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm transition flex items-center gap-1"
              >
                <Printer className="w-3 h-3" />
                PDF Print
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Share2 className="w-3 h-3" />
            <span>L'export includerà solo i dati del grafico selezionato</span>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all"
            >
              Annulla
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Esporta {selectedFormat}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GranularExportSystem;