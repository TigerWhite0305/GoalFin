import React from "react";
import { TrendingUp, ArrowUpRight, Calendar } from "lucide-react";

export const IncomeCard: React.FC = () => {
  // Dati definiti nel componente
  const amount = 977.55;
  const percentage = 8.5;
  const previousMonth = 901.23;
  const currentMonth = "Settembre";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-800 via-green-800 to-green-900 rounded-3xl p-6 justify-between shadow-2xl border border-green-700/20 hover:shadow-green-900/20 transition-all duration-300">
      
      {/* Header con icona */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-300" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Entrate</h2>
        </div>
        
        {/* Indicatore mese */}
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
          <Calendar className="w-4 h-4 text-gray-300" />
          <span className="text-sm text-gray-300 font-medium">{currentMonth}</span>
        </div>
      </div>

      {/* Sezione centrale con importo principale */}
      <div className="flex flex-col gap-2 my-4">
        <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          +{formatCurrency(amount).replace('€', '')}
          <span className="text-2xl md:text-3xl text-green-200">€</span>
        </p>
        
        {/* Comparazione con mese precedente */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">vs mese precedente:</span>
          <span className="text-sm text-gray-400">{formatCurrency(previousMonth)}</span>
        </div>
      </div>

      {/* Footer con percentuale e dettagli */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-green-300" />
          <span className="text-sm text-green-200 font-medium">
            Aumento rispetto al mese scorso
          </span>
        </div>
        
        {/* Badge percentuale migliorato */}
        <div className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-green-400/90 text-green-950 font-bold backdrop-blur-sm border border-green-300/30 shadow-lg">
          <TrendingUp className="w-4 h-4" />
          <span className="text-lg">+{percentage}%</span>
        </div>
      </div>

      {/* Indicatore visivo sottile */}
      <div className="mt-3 w-full h-1 bg-black/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(percentage * 10, 100)}%` }}
        />
      </div>
    </div>
  );
};