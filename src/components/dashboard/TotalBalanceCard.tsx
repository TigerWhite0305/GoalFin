import React from "react";
import { Wallet, TrendingUp, PiggyBank, Calendar, ArrowUpRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const TotalBalanceCard: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  // Dati definiti nel componente
  const balance = 33450.51;
  const percentageChange = 3.2;
  const previousBalance = balance / (1 + percentageChange / 100);
  const monthlyGrowth = balance - previousBalance;
  const currentMonth = "Settembre";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900' : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-teal-500'} rounded-2xl shadow-xl p-6 flex flex-col justify-between border ${isDarkMode ? 'border-indigo-800/30' : 'border-indigo-400/30'} hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
      
      {/* Effetti decorativi */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${isDarkMode ? 'bg-indigo-400/10' : 'bg-white/20'} rounded-full blur-2xl`}></div>
      <div className={`absolute bottom-0 left-0 w-20 h-20 ${isDarkMode ? 'bg-teal-400/10' : 'bg-white/15'} rounded-full blur-xl`}></div>

      {/* Header con dimensioni corrette */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} rounded-xl backdrop-blur-sm border ${isDarkMode ? 'border-white/10' : 'border-white/30'}`}>
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-white">
              Bilancio Totale
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-3 h-3 text-white/70" />
              <span className="text-white/70 text-xs md:text-sm font-medium">{currentMonth} 2025</span>
            </div>
          </div>
        </div>

        {/* Badge trend più piccolo */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/90 text-emerald-50 font-semibold backdrop-blur-sm border border-emerald-400/30 shadow-lg">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs md:text-sm">+{percentageChange}%</span>
        </div>
      </div>

      {/* Sezione centrale - Bilancio principale con dimensioni corrette */}
      <div className="relative z-10 my-4">
        <div className="mb-3">
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none">
            {formatCurrency(balance).replace('€', '')}
            <span className="text-lg md:text-xl text-white/80 ml-1">€</span>
          </p>
        </div>

        {/* Dettagli crescita */}
        <div className="flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-emerald-300" />
          <span className="text-emerald-300 font-semibold text-sm md:text-base">
            +{formatCurrency(monthlyGrowth)}
          </span>
          <span className="text-white/70 text-xs md:text-sm">
            rispetto al mese scorso
          </span>
        </div>
      </div>

      {/* Footer con statistiche - dimensioni corrette */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        <div className={`${isDarkMode ? 'bg-black/30' : 'bg-black/20'} backdrop-blur-sm p-3 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-white/10'}`}>
          <div className="flex items-center gap-2 mb-1">
            <PiggyBank className="w-3 h-3 text-emerald-300" />
            <span className="text-white/80 text-xs">Crescita Mensile</span>
          </div>
          <div className="text-emerald-300 font-semibold text-sm md:text-base">
            {formatCurrency(monthlyGrowth)}
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-black/30' : 'bg-black/20'} backdrop-blur-sm p-3 rounded-xl border ${isDarkMode ? 'border-white/5' : 'border-white/10'}`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3 h-3 text-indigo-300" />
            <span className="text-white/80 text-xs">Mese Precedente</span>
          </div>
          <div className="text-indigo-300 font-semibold text-sm md:text-base">
            {formatCurrency(previousBalance)}
          </div>
        </div>
      </div>

      {/* Indicatore progresso */}
      <div className="mt-3 relative z-10">
        <div className={`w-full h-1.5 ${isDarkMode ? 'bg-black/30' : 'bg-black/20'} rounded-full overflow-hidden`}>
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(percentageChange * 15, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/70 mt-1.5">
          <span>Obiettivo crescita: +2%</span>
          <span className="text-emerald-300 font-medium">Raggiunto!</span>
        </div>
      </div>
    </div>
  );
};