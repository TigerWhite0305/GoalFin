import React from "react";
import { TrendingDown, ArrowDownRight, Calendar } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const ExpensesCard: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  // Dati definiti nel componente
  const amount = 1233.34;
  const percentage = 5.2;
  const previousMonth = 1172.89;
  const currentMonth = "Settembre";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-slate-800 via-red-900 to-red-800' : 'bg-gradient-to-br from-red-500 via-red-600 to-pink-600'} rounded-2xl px-6 py-4 justify-between shadow-xl border ${isDarkMode ? 'border-red-800/30' : 'border-red-400/30'} hover:shadow-2xl transition-all duration-300`}>
      
      {/* Header con icona - responsive */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 ${isDarkMode ? 'bg-red-500/20' : 'bg-red-500/30'} rounded-xl`}>
            <TrendingDown className="w-4 h-4 text-red-200" />
          </div>
          <h2 style={{fontSize: 'clamp(0.875rem, 2vw, 1rem)'}} className="font-semibold text-white">
            Uscite
          </h2>
        </div>
        
        {/* Indicatore mese */}
        <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-full">
          <Calendar className="w-3 h-3 text-white/70" />
          <span className="text-xs text-white/70 font-medium">{currentMonth}</span>
        </div>
      </div>

      {/* Sezione centrale con importo principale - clamp responsive */}
      <div className="flex flex-col gap-2 my-3">
        <p style={{fontSize: 'clamp(1.25rem, 4vw, 1.875rem)'}} className="font-bold text-white tracking-tight">
          -{formatCurrency(amount).replace('€', '')}
          <span style={{fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'}} className="text-red-200">€</span>
        </p>
        
        {/* Comparazione con mese precedente */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70">vs mese precedente:</span>
          <span className="text-xs text-white/60">{formatCurrency(previousMonth)}</span>
        </div>
      </div>

      {/* Footer con percentuale e dettagli */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowDownRight className="w-3 h-3 text-red-300" />
          <span className="text-xs text-red-200 font-medium">
            +{percentage}% vs scorso mese
          </span>
        </div>
        
      </div>

      {/* Indicatore visivo sottile */}
      <div className="mt-2 w-full h-1 bg-black/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-red-400 to-red-300 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(percentage * 10, 100)}%` }}
        />
      </div>
    </div>
  );
};