import React, { useState } from "react";
import { TrendingUp, TrendingDown, Calendar, DollarSign, PieChart, Target } from "lucide-react";

// Importa il tuo ThemeContext esistente
import { useTheme } from "../../context/ThemeContext";

// Tipi
type InvestmentType = "PAC_ETF" | "ETF_SINGOLO" | "AZIONE";

type Investment = {
  id: string;
  name: string;
  type: InvestmentType;
  monthlyAmount?: number;
  startDate?: string;
  totalMonths?: number;
  totalInvested: number;
  currentValue: number;
  shares?: number;
  avgBuyPrice?: number;
  currentPrice?: number;
  ytdReturn?: number;
  totalReturn: number;
  isin?: string;
  sector?: string;
  ticker?: string;
};

const InvestmentsComponent: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'overview' | 'details'>('overview');
  const { isDarkMode } = useTheme();

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

  // Theme colors seguendo il design system
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro
        background: {
          primary: "bg-gray-900", // #0A0B0F
          card: "bg-gray-800/40", // #161920
          secondary: "bg-gray-700", // #1F2937
          input: "bg-gray-800/50"
        },
        text: {
          primary: "text-gray-50", // #F9FAFB
          secondary: "text-gray-300", // #D1D5DB
          muted: "text-gray-400", // #6B7280
          subtle: "text-gray-500" // #9CA3AF
        },
        border: "border-gray-700/30",
        accent: "from-indigo-500 via-purple-500 to-teal-400",
        glow: "shadow-[0_0_20px_rgba(99,102,241,0.15)]",
        hover: "hover:bg-gray-700/40"
      };
    } else {
      return {
        // ☀️ Tema Chiaro
        background: {
          primary: "bg-white", // #FEFEFE
          card: "bg-gray-50/60", // #F8FAFC
          secondary: "bg-gray-100", // #F1F5F9
          input: "bg-white"
        },
        text: {
          primary: "text-gray-900", // #0F172A
          secondary: "text-gray-700", // #334155
          muted: "text-gray-600", // #64748B
          subtle: "text-gray-500" // #94A3B8
        },
        border: "border-gray-200/50",
        accent: "from-indigo-500 via-purple-500 to-teal-400",
        glow: "shadow-[0_0_20px_rgba(99,102,241,0.08)]",
        hover: "hover:bg-gray-100/80"
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
      case 'PAC_ETF': return 'bg-indigo-600 text-white';
      case 'ETF_SINGOLO': return 'bg-violet-600 text-white';
      case 'AZIONE': return 'bg-amber-500 text-gray-900';
    }
  };

  return (
    <div className={`min-h-screen ${theme.background.primary} ${theme.text.primary} p-4 sm:p-6 transition-colors duration-300`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent flex items-center gap-3`}>
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
          <span className="hidden sm:inline">Portfolio Investimenti</span>
          <span className="sm:hidden">Portfolio</span>
        </h1>
        
        {/* View Toggle - il tema si cambia dalla navbar */}
        <div className={`flex gap-0 w-full sm:w-auto ${theme.background.card} ${theme.border} border rounded-lg p-1`}>
          <button 
            onClick={() => setSelectedView('overview')}
            className={`px-4 py-2 text-sm font-medium transition-all flex-1 sm:flex-initial rounded-md ${
              selectedView === 'overview' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : `${theme.text.secondary} ${theme.hover}`
            }`}
          >
            Panoramica
          </button>
          <button 
            onClick={() => setSelectedView('details')}
            className={`px-4 py-2 text-sm font-medium transition-all flex-1 sm:flex-initial rounded-md ${
              selectedView === 'details' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : `${theme.text.secondary} ${theme.hover}`
            }`}
          >
            Dettagli
          </button>
        </div>
      </div>

      {/* Statistiche principali */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`${theme.background.card} ${theme.border} border rounded-2xl p-6 backdrop-blur-sm relative group transition-all duration-300 ${theme.hover}`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <span className={`${theme.text.muted} text-sm font-medium`}>Valore Totale</span>
          </div>
          <div className={`text-xl font-bold ${theme.text.primary} relative z-10`}>
            {formatCurrency(totalCurrentValue)}
          </div>
        </div>

        <div className={`${theme.background.card} ${theme.border} border rounded-2xl p-6 backdrop-blur-sm relative group transition-all duration-300 ${theme.hover}`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-indigo-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Target className="w-5 h-5 text-indigo-500" />
            </div>
            <span className={`${theme.text.muted} text-sm font-medium`}>Investito</span>
          </div>
          <div className={`text-xl font-bold ${theme.text.primary} relative z-10`}>
            {formatCurrency(totalInvested)}
          </div>
        </div>

        <div className={`${theme.background.card} ${theme.border} border rounded-2xl p-6 backdrop-blur-sm relative group transition-all duration-300 ${theme.hover}`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${totalProfit >= 0 ? 'from-emerald-500/5 to-emerald-600/5' : 'from-red-500/5 to-red-600/5'} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className={`p-2 ${totalProfit >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'} rounded-lg`}>
              {totalProfit >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            <span className={`${theme.text.muted} text-sm font-medium`}>P&L Totale</span>
          </div>
          <div className={`text-xl font-bold relative z-10 ${totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {formatCurrency(totalProfit)}
          </div>
          <div className={`text-sm font-medium relative z-10 ${totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {formatPercentage(totalReturnPercentage)}
          </div>
        </div>

        <div className={`${theme.background.card} ${theme.border} border rounded-2xl p-6 backdrop-blur-sm relative group transition-all duration-300 ${theme.hover}`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-violet-500/5 to-violet-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-violet-500" />
            </div>
            <span className={`${theme.text.muted} text-sm font-medium`}>PAC Mensile</span>
          </div>
          <div className="text-xl font-bold text-indigo-500 relative z-10">
            {formatCurrency(monthlyPACAmount)}
          </div>
          <div className={`text-sm font-medium ${theme.text.muted} relative z-10`}>
            {investments.filter(inv => inv.type === "PAC_ETF").length} attivi
          </div>
        </div>
      </div>

      {/* Lista investimenti */}
      <div className="space-y-4">
        {investments.map((investment) => {
          const isProfit = investment.totalReturn >= 0;
          const profitLoss = investment.currentValue - investment.totalInvested;
          
          return (
            <div key={investment.id} className={`${theme.background.card} ${theme.border} border rounded-2xl p-6 backdrop-blur-sm ${theme.hover} transition-all duration-300 relative group`}>
              
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              {/* Mobile Layout */}
              <div className="block lg:hidden relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${getTypeColor(investment.type)}`}>
                        {getTypeLabel(investment.type)}
                      </span>
                      {investment.ticker && (
                        <span className={`${theme.text.muted} text-sm font-medium ${theme.background.secondary} px-3 py-1.5 rounded-lg ${theme.border} border`}>
                          ${investment.ticker}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>{investment.name}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                    <span className={`${theme.text.muted} text-sm font-medium`}>Investito</span>
                    <div className={`text-lg font-bold ${theme.text.primary} mt-1`}>
                      {formatCurrency(investment.totalInvested)}
                    </div>
                  </div>
                  <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                    <span className={`${theme.text.muted} text-sm font-medium`}>Valore</span>
                    <div className={`text-lg font-bold ${theme.text.primary} mt-1`}>
                      {formatCurrency(investment.currentValue)}
                    </div>
                  </div>
                </div>

                <div className={`flex justify-between items-center border-t ${theme.border} pt-4`}>
                  <div>
                    <div className={`text-sm ${theme.text.muted} font-medium mb-1`}>Rendimento</div>
                    <div className={`text-xl font-bold ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                      {formatPercentage(investment.totalReturn)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${theme.text.muted} font-medium mb-1`}>Profitto</div>
                    <div className={`text-xl font-bold ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                      {formatCurrency(profitLoss)}
                    </div>
                  </div>
                </div>

                {investment.ytdReturn && (
                  <div className={`mt-3 text-sm ${theme.text.muted} font-medium`}>
                    YTD: <span className={`font-semibold ${investment.ytdReturn >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatPercentage(investment.ytdReturn)}</span>
                  </div>
                )}

                {selectedView === 'details' && (
                  <div className={`mt-6 pt-6 border-t ${theme.border}`}>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {investment.shares && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>Quantità</span>
                          <div className={`font-bold ${theme.text.primary} mt-1`}>{investment.shares.toFixed(2)}</div>
                        </div>
                      )}
                      {investment.avgBuyPrice && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>Prezzo Medio</span>
                          <div className={`font-bold ${theme.text.primary} mt-1`}>{formatCurrency(investment.avgBuyPrice)}</div>
                        </div>
                      )}
                      {investment.currentPrice && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>Prezzo Attuale</span>
                          <div className={`font-bold ${theme.text.primary} mt-1`}>{formatCurrency(investment.currentPrice)}</div>
                        </div>
                      )}
                      {investment.type === "PAC_ETF" && investment.monthlyAmount && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>PAC Mensile</span>
                          <div className={`font-bold text-indigo-500 mt-1`}>{formatCurrency(investment.monthlyAmount)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex lg:items-center lg:justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-4 py-2 text-sm font-semibold rounded-lg ${getTypeColor(investment.type)}`}>
                      {getTypeLabel(investment.type)}
                    </span>
                    <h3 className={`text-xl font-bold ${theme.text.primary}`}>{investment.name}</h3>
                    {investment.ticker && (
                      <span className={`${theme.text.muted} text-sm font-medium ${theme.background.secondary} px-4 py-2 rounded-lg ${theme.border} border`}>
                        ${investment.ticker}
                      </span>
                    )}
                  </div>
                  
                  {selectedView === 'details' && (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                      <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                        <span className={`${theme.text.muted} text-xs font-medium`}>Investito</span>
                        <div className={`font-bold ${theme.text.primary} mt-2`}>{formatCurrency(investment.totalInvested)}</div>
                      </div>
                      <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                        <span className={`${theme.text.muted} text-xs font-medium`}>Valore</span>
                        <div className={`font-bold ${theme.text.primary} mt-2`}>{formatCurrency(investment.currentValue)}</div>
                      </div>
                      {investment.shares && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>Quantità</span>
                          <div className={`font-bold ${theme.text.primary} mt-2`}>{investment.shares.toFixed(2)}</div>
                        </div>
                      )}
                      {investment.avgBuyPrice && investment.currentPrice && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>Prezzo M/A</span>
                          <div className={`font-bold ${theme.text.primary} text-sm mt-2`}>
                            {formatCurrency(investment.avgBuyPrice)} / {formatCurrency(investment.currentPrice)}
                          </div>
                        </div>
                      )}
                      
                      {investment.type === "PAC_ETF" && investment.monthlyAmount && (
                        <>
                          <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                            <span className={`${theme.text.muted} text-xs font-medium`}>PAC Mensile</span>
                            <div className="font-bold text-indigo-500 mt-2">{formatCurrency(investment.monthlyAmount)}</div>
                          </div>
                          <div className={`${theme.background.secondary} ${theme.border} border rounded-xl p-4`}>
                            <span className={`${theme.text.muted} text-xs font-medium`}>Mesi Attivi</span>
                            <div className={`font-bold ${theme.text.primary} mt-2`}>{investment.totalMonths}</div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className={`text-right border-l ${theme.border} pl-8 ml-8`}>
                  <div className={`text-2xl font-bold mb-2 ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                    {formatPercentage(investment.totalReturn)}
                  </div>
                  <div className={`text-lg font-bold mb-3 ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                    {formatCurrency(profitLoss)}
                  </div>
                  {investment.ytdReturn && (
                    <div className={`text-sm font-medium ${theme.text.muted}`}>
                      YTD: <span className={`font-semibold ${investment.ytdReturn >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatPercentage(investment.ytdReturn)}</span>
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
};

export default function Investments() {
  return <InvestmentsComponent />;
}