// src/components/statistics/ChartHoverExport.tsx
import React, { useState } from 'react';
import { Download, Image, FileText, Settings, MoreHorizontal } from 'lucide-react';

interface ChartHoverExportProps {
  chartId: string;
  chartName: string;
  availableFormats: readonly ('PNG' | 'CSV' | 'JSON' | 'PDF')[];
  onQuickExport: (format: string) => void;
  onAdvancedExport: () => void;
  className?: string;
  // ✅ Nuova prop per controllare il posizionamento
  position?: 'absolute' | 'inline';
}

const ChartHoverExport: React.FC<ChartHoverExportProps> = ({
  chartId,
  chartName,
  availableFormats,
  onQuickExport,
  onAdvancedExport,
  className = "",
  // ✅ Default absolute per retrocompatibilità
  position = 'absolute'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PNG': return <Image className="w-3 h-3" />;
      case 'CSV': case 'JSON': return <FileText className="w-3 h-3" />;
      case 'PDF': return <FileText className="w-3 h-3" />;
      default: return <Download className="w-3 h-3" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PNG': return 'hover:bg-green-600';
      case 'CSV': return 'hover:bg-blue-600';
      case 'JSON': return 'hover:bg-purple-600';
      case 'PDF': return 'hover:bg-red-600';
      default: return 'hover:bg-gray-600';
    }
  };

  return (
    <div className={className}>
      <div className="relative">
        {/* Main Export Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-10 h-10 rounded-xl bg-gray-800/60 backdrop-blur-sm border border-gray-600/30 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all duration-200 shadow-lg"
          title={`Esporta ${chartName}`}
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Expanded Menu */}
        {isExpanded && (
          <div 
            className={`absolute ${position === 'inline' ? 'top-12 left-0' : 'top-12 right-0'} bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-2xl shadow-2xl p-2 min-w-[180px] z-50`}
          >
            <div className="text-xs text-gray-400 px-3 py-2 border-b border-gray-600/30 mb-2">
              Esporta {chartName}
            </div>
            
            {/* Quick Export Options */}
            <div className="space-y-1 mb-2">
              {availableFormats.slice(0, 3).map((format) => (
                <button
                  key={format}
                  onClick={() => {
                    onQuickExport(format);
                    setIsExpanded(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200 ${getFormatColor(format)}`}
                >
                  {getFormatIcon(format)}
                  <span>Esporta {format}</span>
                </button>
              ))}
            </div>
            
            {/* Advanced Options */}
            <div className="border-t border-gray-600/30 pt-2">
              <button
                onClick={() => {
                  onAdvancedExport();
                  setIsExpanded(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-blue-600 transition-all duration-200"
              >
                <Settings className="w-3 h-3" />
                <span>Opzioni Avanzate</span>
              </button>
              
              {availableFormats.length > 3 && (
                <button
                  onClick={() => {
                    onAdvancedExport();
                    setIsExpanded(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-all duration-200"
                >
                  <MoreHorizontal className="w-3 h-3" />
                  <span>Altri Formati</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartHoverExport;