import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar } from "lucide-react";

export const RevenueChart: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="rounded-3xl p-3 sm:p-4 lg:p-6 flex flex-col relative h-full bg-gradient-to-br from-purple-900 via-purple-800 to-gray-900 shadow-2xl border border-purple-700/20">
      
      {/* Header migliorato */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
          </div>
          <h3 className="text-white text-xl sm:text-2xl font-bold">Grafico Entrate</h3>
        </div>

        {/* Indicatore trend migliorato */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-black/20 px-2 sm:px-3 py-1 rounded-full">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
            <span className="text-xs sm:text-sm text-gray-300 font-medium">Ultimi 6 mesi</span>
          </div>
          
          <div className={`flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-2xl backdrop-blur-sm border shadow-lg ${
            trend 
              ? 'bg-green-400/90 text-green-950 border-green-300/30' 
              : 'bg-red-400/90 text-red-950 border-red-300/30'
          }`}>
            {trend ? (
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="font-bold text-sm sm:text-base">{trend ? '+' : '-'}{trendPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-black/20 p-2 sm:p-3 rounded-xl">
          <div className="text-gray-400 text-xs">Mese Corrente</div>
          <div className="text-white font-bold text-base sm:text-lg">{formatCurrency(currentMonth.value)}</div>
        </div>
        <div className="bg-black/20 p-2 sm:p-3 rounded-xl">
          <div className="text-gray-400 text-xs">Media 6 Mesi</div>
          <div className="text-white font-bold text-base sm:text-lg">
            {formatCurrency(data.reduce((sum, d) => sum + d.value, 0) / data.length)}
          </div>
        </div>
        <div className="bg-black/20 p-2 sm:p-3 rounded-xl">
          <div className="text-gray-400 text-xs">Miglior Mese</div>
          <div className="text-white font-bold text-base sm:text-lg">{formatCurrency(maxValue)}</div>
        </div>
      </div>

      {/* Chart migliorato */}
      <div className="relative flex-1 flex items-end pt-4 gap-1 sm:gap-2 lg:gap-3">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-1 min-w-[35px] sm:min-w-[45px] lg:min-w-[50px] relative">
            {/* Bar con gradiente */}
            <motion.div
              className="w-full rounded-xl sm:rounded-2xl flex flex-col justify-end items-center relative overflow-hidden cursor-pointer"
              style={{
                background: hovered === i 
                  ? "linear-gradient(180deg, #E879F9 0%, #A855F7 100%)"
                  : "linear-gradient(180deg, #8B5CF6 0%, #6366F1 100%)",
                boxShadow: hovered === i 
                  ? "0 0 20px rgba(232, 121, 249, 0.5)" 
                  : "0 4px 15px rgba(0,0,0,0.3)",
              }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / maxValue) * 220}px` }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
              whileHover={{ scaleY: 1.05, scaleX: 1.1 }}
            >
              {/* Highlight effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
              
              <span className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 relative z-10 text-center px-1 ${
                hovered === i ? "text-white" : "text-purple-100"
              }`}>
                {formatCurrency(d.value).replace('€', '€')}
              </span>
            </motion.div>

            {/* Tooltip migliorato */}
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    left: mousePos.x + 10,
                    top: mousePos.y - 80,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl pointer-events-none z-50 border border-purple-400/30 max-w-[250px] sm:max-w-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(99, 102, 241, 0.95) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* Header tooltip */}
                  <div className="text-purple-200 text-xs mb-1">{d.fullMonth} 2024</div>
                  
                  {/* Importo principale */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-bold text-lg sm:text-xl">{formatCurrency(d.value)}</div>
                    {i > 0 && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        d.value >= data[i - 1].value 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {d.value >= data[i - 1].value ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        <span>
                          {Math.abs(((d.value - data[i - 1].value) / data[i - 1].value) * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info aggiuntiva */}
                  <div className="text-purple-200 text-xs">
                    {i === data.length - 1 ? "Mese corrente" : `${data.length - 1 - i} mesi fa`}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Month label migliorato */}
            <span className={`text-xs sm:text-sm mt-2 sm:mt-3 font-medium transition-colors ${
              hovered === i ? "text-purple-300" : "text-gray-400"
            }`}>
              {d.month}
            </span>
          </div>
        ))}
      </div>

      {/* Footer con insights */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-purple-700/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm gap-2 sm:gap-0">
          <div className="text-gray-400">
            {trend ? "📈 Trend positivo" : "📉 Trend negativo"} rispetto al mese scorso
          </div>
          <div className="text-purple-300 font-medium">
            Totale periodo: {formatCurrency(data.reduce((sum, d) => sum + d.value, 0))}
          </div>
        </div>
      </div>
    </div>
  );
};