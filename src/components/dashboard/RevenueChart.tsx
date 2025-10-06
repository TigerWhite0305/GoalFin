import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const RevenueChart: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  // Ultimi 6 mesi
  const data = [
    { month: "Apr", value: 1300, fullMonth: "Aprile" },
    { month: "Mag", value: 700, fullMonth: "Maggio" },
    { month: "Giu", value: 1100, fullMonth: "Giugno" },
    { month: "Lug", value: 1400, fullMonth: "Luglio" },
    { month: "Ago", value: 1250, fullMonth: "Agosto" },
    { month: "Set", value: 950, fullMonth: "Settembre" },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  const trend = currentMonth.value >= previousMonth.value;
  const trendPercentage = Math.abs(((currentMonth.value - previousMonth.value) / previousMonth.value) * 100).toFixed(1);

  // Theme colors
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: "bg-gradient-to-br from-purple-900 via-purple-800 to-gray-900",
        card: "bg-gray-800/40",
        text: {
          primary: "text-gray-50",
          secondary: "text-gray-300", 
          muted: "text-gray-400"
        },
        border: "border-purple-700/30",
        accent: "bg-purple-500/20"
      };
    } else {
      return {
        background: "bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600",
        card: "bg-white/20",
        text: {
          primary: "text-white",
          secondary: "text-purple-100",
          muted: "text-purple-200"
        },
        border: "border-purple-300/30", 
        accent: "bg-white/10"
      };
    }
  };

  const theme = getThemeColors();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Gestione posizione del mouse (coordinate assolute della pagina)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Tooltip Component da renderizzare con Portal
  const tooltipContent = hovered !== null && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className={`fixed text-white px-3 py-2 rounded-lg shadow-2xl pointer-events-none border ${
        isDarkMode ? 'border-purple-400/30' : 'border-blue-400/30'
      } w-[180px] sm:w-[200px]`}
      style={{
        left: `${mousePos.x + 15}px`,
        top: `${mousePos.y - 80}px`,
        zIndex: 99999,
        background: isDarkMode 
          ? "linear-gradient(135deg, rgba(139, 92, 246, 0.98) 0%, rgba(99, 102, 241, 0.98) 100%)"
          : "linear-gradient(135deg, rgba(59, 130, 246, 0.98) 0%, rgba(29, 78, 216, 0.98) 100%)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Header tooltip */}
      <div className={`${isDarkMode ? 'text-purple-200' : 'text-blue-200'} text-xs mb-1`}>
        {data[hovered].fullMonth} 2024
      </div>
      
      {/* Importo principale */}
      <div className="flex items-center gap-2 mb-1">
        <div className="font-semibold text-base">{formatCurrency(data[hovered].value)}</div>
        {hovered > 0 && (
          <div className={`flex items-center gap-0.5 px-1 py-0.5 rounded-full text-xs ${
            data[hovered].value >= data[hovered - 1].value 
              ? 'bg-emerald-500/20 text-emerald-300' 
              : 'bg-red-500/20 text-red-300'
          }`}>
            {data[hovered].value >= data[hovered - 1].value ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>
              {Math.abs(((data[hovered].value - data[hovered - 1].value) / data[hovered - 1].value) * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Info aggiuntiva */}
      <div className={`${isDarkMode ? 'text-purple-200' : 'text-blue-200'} text-xs`}>
        {hovered === data.length - 1 ? "Mese corrente" : `${data.length - 1 - hovered} mesi fa`}
      </div>
    </motion.div>
  );

  return (
    <div 
      ref={containerRef}
      className={`${theme.background} rounded-2xl p-4 flex flex-col relative h-full shadow-2xl border ${theme.border}`}
    >
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 sm:p-2 ${theme.accent} rounded-lg`}>
              <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.text.secondary}`} />
            </div>
            <h3 className={`${theme.text.primary} text-base sm:text-lg font-bold`}>Grafico Entrate</h3>
          </div>

          {/* Indicatore trend */}
          <div className="flex items-center gap-1.5 w-full xs:w-auto">
            <div className={`flex items-center gap-1.5 ${theme.card} px-2 py-1 rounded-full flex-shrink-0`}>
              <Calendar className={`w-3 h-3 ${theme.text.muted}`} />
              <span className={`text-xs ${theme.text.muted} font-medium`}>6 mesi</span>
            </div>
            
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg backdrop-blur-sm border shadow-lg flex-shrink-0 ${
              trend 
                ? 'bg-emerald-500/90 text-emerald-950 border-emerald-300/30' 
                : 'bg-red-500/90 text-red-950 border-red-300/30'
            }`}>
              {trend ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span className="font-semibold text-xs">{trend ? '+' : '-'}{trendPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <div className={`${theme.card} p-2 sm:p-3 rounded-lg`}>
          <div className={`${theme.text.muted} text-[10px] sm:text-xs`}>Corrente</div>
          <div className={`${theme.text.primary} font-semibold text-xs sm:text-sm`}>
            {formatCurrency(currentMonth.value).replace('.00', '')}
          </div>
        </div>
        <div className={`${theme.card} p-2 sm:p-3 rounded-lg`}>
          <div className={`${theme.text.muted} text-[10px] sm:text-xs`}>Media</div>
          <div className={`${theme.text.primary} font-semibold text-xs sm:text-sm`}>
            {formatCurrency(data.reduce((sum, d) => sum + d.value, 0) / data.length).replace('.00', '')}
          </div>
        </div>
        <div className={`${theme.card} p-2 sm:p-3 rounded-lg`}>
          <div className={`${theme.text.muted} text-[10px] sm:text-xs`}>Max</div>
          <div className={`${theme.text.primary} font-semibold text-xs sm:text-sm`}>
            {formatCurrency(maxValue).replace('.00', '')}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div 
        className="relative flex-1 flex items-end pt-2 sm:pt-4 gap-1 sm:gap-2 min-h-[120px] sm:min-h-[150px]"
        onMouseMove={handleMouseMove}
      >
        {data.map((d, i) => {
          // Calcola l'altezza della barra in pixel
          const containerHeight = 140;
          const barHeightPx = (d.value / maxValue) * containerHeight;
          
          return (
            <div key={i} className="flex flex-col items-center flex-1 min-w-[30px] sm:min-w-[40px] relative">

              {/* Bar */}
              <motion.div
                className="w-full rounded-md sm:rounded-lg flex flex-col justify-end items-center relative overflow-hidden cursor-pointer"
                style={{
                  background: hovered === i 
                    ? isDarkMode 
                      ? "linear-gradient(180deg, #E879F9 0%, #A855F7 100%)"
                      : "linear-gradient(180deg, #FBBF24 0%, #F59E0B 100%)"
                    : isDarkMode
                      ? "linear-gradient(180deg, #8B5CF6 0%, #6366F1 100%)" 
                      : "linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)",
                  boxShadow: hovered === i 
                    ? isDarkMode
                      ? "0 0 15px rgba(232, 121, 249, 0.4)" 
                      : "0 0 15px rgba(251, 191, 36, 0.4)"
                    : "0 2px 8px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                initial={{ height: 0 }}
                animate={{ height: barHeightPx }}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
                whileHover={{ scaleY: 1.02, scaleX: 1.05 }}
              >
                {/* Highlight effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                
                {/* Value label */}
                <span className={`text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 relative z-10 text-center px-0.5 leading-tight ${
                  hovered === i ? "text-white" : isDarkMode ? "text-purple-100" : "text-blue-100"
                }`}>
                  {formatCurrency(d.value).replace('.00', '')}
                </span>
              </motion.div>

              {/* Month label */}
              <span className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium transition-colors ${
                hovered === i 
                  ? isDarkMode ? "text-purple-300" : "text-blue-200"
                  : theme.text.muted
              }`}>
                {d.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer con insights */}
      <div className={`mt-2 sm:mt-3 pt-2 sm:pt-3 border-t ${theme.border}`}>
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center text-[10px] sm:text-xs">
          <div className={theme.text.muted}>
            {trend ? "📈 Trend positivo" : "📉 Trend negativo"}
          </div>
          <div className={`${theme.text.secondary} font-medium`}>
            Totale: {formatCurrency(data.reduce((sum, d) => sum + d.value, 0)).replace('.00', '')}
          </div>
        </div>
      </div>

      {/* Tooltip renderizzato con Portal fuori dal DOM del componente */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {tooltipContent}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};