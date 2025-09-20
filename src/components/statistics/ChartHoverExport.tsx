// src/components/statistics/ChartHoverExport.tsx
import React, { useState } from 'react';
import { Download, Image, FileText, Settings, MoreHorizontal } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext";

interface ChartHoverExportProps {
  chartId: string;
  chartName: string;
  availableFormats: readonly ('PNG' | 'CSV' | 'JSON' | 'PDF')[];
  onQuickExport: (format: string) => void;
  onAdvancedExport: () => void;
  className?: string;
  position?: 'absolute' | 'inline';
}

const ChartHoverExport: React.FC<ChartHoverExportProps> = ({
  chartId,
  chartName,
  availableFormats,
  onQuickExport,
  onAdvancedExport,
  className = "",
  position = 'absolute'
}) => {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Theme colors seguendo il design system GoalFin
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro
        button: {
          background: "bg-gray-800/60",
          hover: "hover:bg-gray-700/60",
          border: "border-gray-600/30",
          text: "text-gray-400",
          textHover: "hover:text-white"
        },
        menu: {
          background: "bg-gray-800/95",
          border: "border-gray-600/50",
          text: "text-gray-400",
          itemText: "text-gray-300",
          itemHover: "hover:text-white",
          divider: "border-gray-600/30"
        }
      };
    } else {
      return {
        // ☀️ Tema Chiaro
        button: {
          background: "bg-white/80",
          hover: "hover:bg-gray-100/80",
          border: "border-gray-300/50",
          text: "text-gray-600",
          textHover: "hover:text-gray-900"
        },
        menu: {
          background: "bg-white/95",
          border: "border-gray-200/50",
          text: "text-gray-600",
          itemText: "text-gray-700",
          itemHover: "hover:text-gray-900",
          divider: "border-gray-200/50"
        }
      };
    }
  };

  const theme = getThemeColors();

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
      case 'PNG': return 'hover:bg-emerald-600';
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
          className={`w-8 h-8 rounded-lg ${theme.button.background} backdrop-blur-sm border ${theme.button.border} flex items-center justify-center ${theme.button.text} ${theme.button.textHover} ${theme.button.hover} transition-all duration-200 shadow-sm`}
          title={`Esporta ${chartName}`}
        >
          <Download className="w-3 h-3" />
        </button>

        {/* Expanded Menu */}
        {isExpanded && (
          <div 
            className={`absolute ${position === 'inline' ? 'top-10 left-0' : 'top-10 right-0'} ${theme.menu.background} backdrop-blur-sm border ${theme.menu.border} rounded-xl shadow-xl p-2 min-w-[160px] z-50`}
          >
            <div className={`text-xs ${theme.menu.text} px-2 py-1 border-b ${theme.menu.divider} mb-1`}>
              Esporta {chartName}
            </div>
            
            {/* Quick Export Options */}
            <div className="space-y-0.5 mb-1">
              {availableFormats.slice(0, 3).map((format) => (
                <button
                  key={format}
                  onClick={() => {
                    onQuickExport(format);
                    setIsExpanded(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${theme.menu.itemText} ${theme.menu.itemHover} transition-all duration-200 ${getFormatColor(format)}`}
                >
                  {getFormatIcon(format)}
                  <span>Esporta {format}</span>
                </button>
              ))}
            </div>
            
            {/* Advanced Options */}
            <div className={`border-t ${theme.menu.divider} pt-1`}>
              <button
                onClick={() => {
                  onAdvancedExport();
                  setIsExpanded(false);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${theme.menu.itemText} ${theme.menu.itemHover} hover:bg-indigo-600 transition-all duration-200`}
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
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${theme.menu.itemText} ${theme.menu.itemHover} hover:bg-gray-600 transition-all duration-200`}
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