import React, { useState } from "react";
import { TrendingUp, TrendingDown, Calendar, DollarSign, PieChart, Target } from "lucide-react";

type InvestmentType = "PAC_ETF" | "ETF_SINGOLO" | "AZIONE";

type Investment = {
  id: string;
  name: string;
  type: InvestmentType;
  // Per PAC
  monthlyAmount?: number;
  startDate?: string;
  totalMonths?: number;
  // Valori generali
  totalInvested: number;
  currentValue: number;
  shares?: number;
  avgBuyPrice?: number;
  currentPrice?: number;
  // Performance
  ytdReturn?: number;
  totalReturn: number;
  // Info aggiuntive
  isin?: string;
  sector?: string;
  ticker?: string;
};

export default function Investments() {
  const [selectedView, setSelectedView] = useState<'overview' | 'details'>('overview');

  // Dati di esempio più realistici per i tuoi investimenti
  const investments: Investment[] = [
    {
      id: "1",
      name: "VWCE - Vanguard FTSE All-World",
      type: "PAC_ETF",
      monthlyAmount: 300,
      startDate: "2023-01-01",
      totalMonths: 20,
      totalInvested: 6000,
      currentValue: 6750,
      shares: 75.5,
      avgBuyPrice: 79.47,
      currentPrice: 89.40,
      ytdReturn: 8.2,
      totalReturn: 12.5,
      isin: "IE00BK5BQT80",
      ticker: "VWCE"
    },
    {
      id: "2", 
      name: "SWDA - iShares Core MSCI World",
      type: "PAC_ETF",
      monthlyAmount: 200,
      startDate: "2023-06-01",
      totalMonths: 15,
      totalInvested: 3000,
      currentValue: 3240,
      shares: 42.1,
      avgBuyPrice: 71.26,
      currentPrice: 76.95,
      ytdReturn: 6.8,
      totalReturn: 8.0,
      isin: "IE00B4L5Y983",
      ticker: "SWDA"
    },
    {
      id: "3",
      name: "Tesla Inc",
      type: "AZIONE",
      totalInvested: 2500,
      currentValue: 2180,
      shares: 12,
      avgBuyPrice: 208.33,
      currentPrice: 181.67,
      ytdReturn: -15.2,
      totalReturn: -12.8,
      ticker: "TSLA",
      sector: "Technology"
    },
    {
      id: "4",
      name: "CSPX - iShares Core S&P 500",
      type: "ETF_SINGOLO",
      totalInvested: 1500,
      currentValue: 1680,
      shares: 3.2,
      avgBuyPrice: 468.75,
      currentPrice: 525.00,
      ytdReturn: 11.5,
      totalReturn: 12.0,
      isin: "IE00B5BMR087",
      ticker: "CSPX"
    }
  ];

  const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfit = totalCurrentValue - totalInvested;
  const totalReturnPercentage = ((totalProfit / totalInvested) * 100);
  
  const monthlyPACAmount = investments
    .filter(inv => inv.type === "PAC_ETF")
    .reduce((sum, inv) => sum + (inv.monthlyAmount || 0), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getTypeLabel = (type: InvestmentType) => {
    switch(type) {
      case 'PAC_ETF': return 'PAC ETF';
      case 'ETF_SINGOLO': return 'ETF';
      case 'AZIONE': return 'Azione';
    }
  };

  const getTypeColor = (type: InvestmentType) => {
    switch(type) {
      case 'PAC_ETF': return 'bg-blue-600';
      case 'ETF_SINGOLO': return 'bg-purple-600';
      case 'AZIONE': return 'bg-orange-600';
    }
  };

  return (
    <div className="bg-gray-900 text-white p-3 sm:p-4 lg:p-6 rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
          <span className="hidden sm:inline">Portfolio Investimenti</span>
          <span className="sm:hidden">Portfolio</span>
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setSelectedView('overview')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition flex-1 sm:flex-initial ${
              selectedView === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Panoramica
          </button>
          <button 
            onClick={() => setSelectedView('details')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition flex-1 sm:flex-initial ${
              selectedView === 'details' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Dettagli
          </button>
        </div>
      </div>

      {/* Statistiche principali */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gray-800 p-3 sm:p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <span className="text-gray-400 text-xs sm:text-sm">Valore Totale</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-green-400">
            {formatCurrency(totalCurrentValue)}
          </div>
        </div>

        <div className="bg-gray-800 p-3 sm:p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <span className="text-gray-400 text-xs sm:text-sm">Investito</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold">
            {formatCurrency(totalInvested)}
          </div>
        </div>

        <div className="bg-gray-800 p-3 sm:p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            {totalProfit >= 0 ? (
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            )}
            <span className="text-gray-400 text-xs sm:text-sm">P&L Totale</span>
          </div>
          <div className={`text-lg sm:text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(totalProfit)}
          </div>
          <div className={`text-xs sm:text-sm ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPercentage(totalReturnPercentage)}
          </div>
        </div>

        <div className="bg-gray-800 p-3 sm:p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <span className="text-gray-400 text-xs sm:text-sm">PAC Mensile</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-blue-400">
            {formatCurrency(monthlyPACAmount)}
          </div>
          <div className="text-xs sm:text-sm text-gray-400">
            {investments.filter(inv => inv.type === "PAC_ETF").length} attivi
          </div>
        </div>
      </div>

      {/* Lista investimenti */}
      <div className="space-y-3 sm:space-y-4">
        {investments.map((investment) => {
          const isProfit = investment.totalReturn >= 0;
          
          return (
            <div key={investment.id} className="bg-gray-800 p-4 sm:p-5 rounded-xl hover:bg-gray-750 transition">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                
                {/* Info principale */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(investment.type)} text-white`}>
                        {getTypeLabel(investment.type)}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold">{investment.name}</h3>
                    </div>
                    {investment.ticker && (
                      <span className="text-gray-400 text-sm">${investment.ticker}</span>
                    )}
                  </div>
                  
                  {selectedView === 'details' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-500">Investito:</span><br />
                        <span className="font-medium">{formatCurrency(investment.totalInvested)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Valore Attuale:</span><br />
                        <span className="font-medium">{formatCurrency(investment.currentValue)}</span>
                      </div>
                      {investment.shares && (
                        <div>
                          <span className="text-gray-500">Quantità:</span><br />
                          <span className="font-medium">{investment.shares.toFixed(2)}</span>
                        </div>
                      )}
                      {investment.avgBuyPrice && investment.currentPrice && (
                        <div>
                          <span className="text-gray-500">Prezzo Medio/Attuale:</span><br />
                          <span className="font-medium">
                            {formatCurrency(investment.avgBuyPrice)} / {formatCurrency(investment.currentPrice)}
                          </span>
                        </div>
                      )}
                      
                      {/* Informazioni specifiche per PAC */}
                      {investment.type === "PAC_ETF" && investment.monthlyAmount && (
                        <>
                          <div>
                            <span className="text-gray-500">Importo Mensile:</span><br />
                            <span className="font-medium text-blue-400">{formatCurrency(investment.monthlyAmount)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Mesi Attivi:</span><br />
                            <span className="font-medium">{investment.totalMonths}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Performance */}
                <div className="flex flex-row lg:flex-col justify-between lg:justify-start items-start lg:items-end gap-1 lg:gap-1 border-t lg:border-t-0 lg:border-l border-gray-700 pt-3 lg:pt-0 lg:pl-4">
                  <div className="lg:text-right">
                    <div className={`text-lg sm:text-xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercentage(investment.totalReturn)}
                    </div>
                    <div className={`text-sm ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(investment.currentValue - investment.totalInvested)}
                    </div>
                  </div>
                  {investment.ytdReturn && (
                    <div className="text-xs text-gray-400 lg:text-right">
                      YTD: {formatPercentage(investment.ytdReturn)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}