import React from "react";
import { Wallet, TrendingUp, PiggyBank, Calendar, ArrowUpRight } from "lucide-react";

export const TotalBalanceCard: React.FC = () => {
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
    <div className="h-full bg-gradient-to-br from-blue-900 via-cyan-800 to-emerald-700 rounded-3xl shadow-2xl p-6 flex flex-col justify-between border border-blue-700/20 hover:shadow-blue-900/20 transition-all duration-300 relative overflow-hidden">
      
      {/* Effetto di sfondo decorativo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl"></div>

      {/* Header migliorato */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm border border-white/20">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Bilancio Totale
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-cyan-200" />
              <span className="text-cyan-200 text-sm font-medium">{currentMonth} 2025</span>
            </div>
          </div>
        </div>

        {/* Badge trend */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-400/90 text-green-950 font-bold backdrop-blur-sm border border-green-300/30 shadow-lg">
          <TrendingUp className="w-4 h-4" />
          <span>+{percentageChange}%</span>
        </div>
      </div>

      {/* Sezione centrale - Bilancio principale */}
      <div className="relative z-10 my-6">
        <div className="mb-4">
          <p className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-none">
            {formatCurrency(balance).replace('€', '')}
            <span className="text-3xl md:text-4xl text-cyan-200 ml-2">€</span>
          </p>
        </div>

        {/* Dettagli crescita */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowUpRight className="w-5 h-5 text-green-300" />
            <span className="text-green-300 font-semibold text-lg">
              +{formatCurrency(monthlyGrowth)}
            </span>
            <span className="text-cyan-200 text-sm">
              rispetto al mese scorso
            </span>
          </div>
        </div>
      </div>

      {/* Footer con statistiche aggiuntive */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-4 h-4 text-emerald-300" />
            <span className="text-gray-300 text-sm">Crescita Mensile</span>
          </div>
          <div className="text-emerald-300 font-bold text-xl">
            {formatCurrency(monthlyGrowth)}
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-300" />
            <span className="text-gray-300 text-sm">Mese Precedente</span>
          </div>
          <div className="text-blue-300 font-bold text-xl">
            {formatCurrency(previousBalance)}
          </div>
        </div>
      </div>

      {/* Indicatore visivo di progresso */}
      <div className="mt-4 relative z-10">
        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(percentageChange * 15, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-cyan-200 mt-2">
          <span>Obiettivo crescita: +2%</span>
          <span className="text-green-300 font-medium">Raggiunto! 🎉</span>
        </div>
      </div>
    </div>
  );
};