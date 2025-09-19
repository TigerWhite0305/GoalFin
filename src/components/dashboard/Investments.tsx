import React, { useState } from "react";
import { TrendingUp, TrendingDown, Calendar, DollarSign, PieChart, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

  // Theme colors seguendo il design system GoalFin
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro (Design System GoalFin)
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
        colors: {
          indigo: "#6366F1", // Accent Primary: #6366F1
          emerald: "#10B981", // Accent Secondary: #10B981
          amber: "#F59E0B", // Accent: #F59E0B
          success: "#059669", // Success: #059669
          error: "#DC2626", // Error: #DC2626
          warning: "#D97706", // Warning: #D97706
          info: "#0284C7", // Info: #0284C7
          casa: "#7C3AED" // Casa: #7C3AED
        },
        border: "border-gray-700/30",
        accent: "from-indigo-500 via-purple-500 to-teal-400", // Gradient
        glow: "shadow-[0_0_20px_rgba(99,102,241,0.15)]",
        hover: "hover:bg-gray-700/40"
      };
    } else {
      return {
        // ☀️ Tema Chiaro (Design System GoalFin)
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
          subtle: "text-gray-500" // Per subtle usiamo muted nel tema chiaro
        },
        colors: {
          indigo: "#6366F1", // Accent Primary: #6366F1
          emerald: "#10B981", // Accent Secondary: #10B981
          amber: "#F59E0B", // Accent: #F59E0B
          success: "#059669", // Success: #059669
          error: "#DC2626", // Error: #DC2626
          warning: "#D97706", // Warning: #D97706
          info: "#0284C7", // Info: #0284C7
          casa: "#7C3AED" // Casa: #7C3AED
        },
        border: "border-gray-200/50",
        accent: "from-indigo-500 via-purple-500 to-teal-400", // Gradient
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
      case 'PAC_ETF': return 'bg-indigo-600 text-white'; // Indigo
      case 'ETF_SINGOLO': return 'bg-violet-600 text-white'; // Violet 
      case 'AZIONE': return 'bg-amber-500 text-white'; // Amber
    }
  };

  return (
    <div className={`${theme.background.primary} ${theme.text.primary} p-4 sm:p-6 transition-colors duration-300 rounded-2xl border ${theme.border} backdrop-blur-sm`}>
      {/* Header - h3 invece di h1 per componente */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h3 className={`text-lg md:text-xl font-semibold bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent flex items-center gap-3`}>
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" style={{color: theme.colors.emerald}} />
            <span className="hidden sm:inline">Portfolio Investimenti</span>
            <span className="sm:hidden">Portfolio</span>
          </h3>
          
          <Link 
            to="/investments" 
            className={`group flex items-center gap-1.5 ${theme.text.muted} hover:${theme.text.primary} text-sm font-medium transition-all duration-200 hover:scale-105`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="hidden sm:inline">Visualizza tutto</span>
            <span className="sm:hidden">Vedi tutto</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
        
        {/* View Toggle */}
        <div className={`flex gap-0 w-full sm:w-auto ${theme.background.card} ${theme.border} border rounded-lg p-1`}>
          <button 
            onClick={() => setSelectedView('overview')}
            className={`px-3 py-2 text-sm font-medium transition-all flex-1 sm:flex-initial rounded-md ${
              selectedView === 'overview' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : `${theme.text.secondary} ${theme.hover}`
            }`}
          >
            Panoramica
          </button>
          <button 
            onClick={() => setSelectedView('details')}
            className={`px-3 py-2 text-sm font-medium transition-all flex-1 sm:flex-initial rounded-md ${
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className={`${theme.background.card} ${theme.border} border rounded-xl p-4 backdrop-blur-sm relative group transition-all duration-300 ${theme.hover}`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className="p-1.5 rounded-lg" style={{backgroundColor: `${theme.colors.emerald}20`}}>
              <DollarSign className="w-4 h-4" style={{color: theme.colors.emerald}} />
            </div>
            <span className={`${theme.text.muted} text-xs font-medium`}>Valore Totale</span>
          </div>
          <div className={`text-base font-bold ${theme.text.primary} relative z-10`}>
            {formatCurrency(totalCurrentValue)}
          </div>
        </div>

        <div className={`${theme.background.card} ${theme.border} border rounded-xl p-4 backdrop-blur-sm relative group transition-all duration-300 ${theme.hover}`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-indigo-600/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className="p-1.5 rounded-lg" style={{backgroundColor: `${theme.colors.indigo}20`}}>
              <Target className="w-4 h-4" style={{color: theme.colors.indigo}} />
            </div>
            <span className={`${theme.text.muted} text-xs font-medium`}>Investito</span>
          </div>
          <div className={`text-base font-bold ${theme.text.primary} relative z-10`}>
            {formatCurrency(totalInvested)}
          </div>
        </div>

        <div className={`${theme.background.card} ${theme.border} border rounded-xl p-4 backdrop-blur-sm relative group transition-all duration-300 ${theme.hover}`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${totalProfit >= 0 ? 'from-emerald-500/5 to-emerald-600/5' : 'from-red-500/5 to-red-600/5'} rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className={`p-1.5 rounded-lg`} style={{backgroundColor: totalProfit >= 0 ? `${theme.colors.success}20` : `${theme.colors.error}20`}}>
              {totalProfit >= 0 ? (
                <TrendingUp className="w-4 h-4" style={{color: theme.colors.success}} />
              ) : (
                <TrendingDown className="w-4 h-4" style={{color: theme.colors.error}} />
              )}
            </div>
            <span className={`${theme.text.muted} text-xs font-medium`}>P&L Totale</span>
          </div>
          <div className={`text-base font-bold relative z-10`} style={{color: totalProfit >= 0 ? theme.colors.success : theme.colors.error}}>
            {formatCurrency(totalProfit)}
          </div>
          <div className={`text-xs font-medium relative z-10`} style={{color: totalProfit >= 0 ? theme.colors.success : theme.colors.error}}>
            {formatPercentage(totalReturnPercentage)}
          </div>
        </div>

        <div className={`${theme.background.card} ${theme.border} border rounded-xl p-4 backdrop-blur-sm relative group transition-all duration-300 ${theme.hover}`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-violet-500/5 to-violet-600/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className="p-1.5 rounded-lg" style={{backgroundColor: '#7C3AED20'}}>
              <Calendar className="w-4 h-4" style={{color: '#7C3AED'}} />
            </div>
            <span className={`${theme.text.muted} text-xs font-medium`}>PAC Mensile</span>
          </div>
          <div className="text-base font-bold relative z-10" style={{color: theme.colors.indigo}}>
            {formatCurrency(monthlyPACAmount)}
          </div>
          <div className={`text-xs font-medium ${theme.text.muted} relative z-10`}>
            {investments.filter(inv => inv.type === "PAC_ETF").length} attivi
          </div>
        </div>
      </div>

      {/* Lista investimenti */}
      <div className="space-y-3">
        {investments.map((investment) => {
          const isProfit = investment.totalReturn >= 0;
          const profitLoss = investment.currentValue - investment.totalInvested;
          
          return (
            <div key={investment.id} className={`${theme.background.card} ${theme.border} border rounded-xl p-4 backdrop-blur-sm ${theme.hover} transition-all duration-300 relative group`}>
              
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              {/* Mobile Layout */}
              <div className="block lg:hidden relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-md ${getTypeColor(investment.type)}`}>
                        {getTypeLabel(investment.type)}
                      </span>
                      {investment.ticker && (
                        <span className={`${theme.text.muted} text-xs font-medium ${theme.background.secondary} px-2 py-1 rounded-md ${theme.border} border`}>
                          ${investment.ticker}
                        </span>
                      )}
                    </div>
                    <h4 className={`text-sm font-semibold ${theme.text.primary} mb-2`}>{investment.name}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                    <span className={`${theme.text.muted} text-xs font-medium`}>Investito</span>
                    <div className={`text-sm font-bold ${theme.text.primary} mt-1`}>
                      {formatCurrency(investment.totalInvested)}
                    </div>
                  </div>
                  <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                    <span className={`${theme.text.muted} text-xs font-medium`}>Valore</span>
                    <div className={`text-sm font-bold ${theme.text.primary} mt-1`}>
                      {formatCurrency(investment.currentValue)}
                    </div>
                  </div>
                </div>

                <div className={`flex justify-between items-center border-t ${theme.border} pt-3`}>
                  <div>
                    <div className={`text-xs ${theme.text.muted} font-medium mb-1`}>Rendimento</div>
                    <div className={`text-sm font-bold`} style={{color: isProfit ? theme.colors.success : theme.colors.error}}>
                      {formatPercentage(investment.totalReturn)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs ${theme.text.muted} font-medium mb-1`}>Profitto</div>
                    <div className={`text-sm font-bold`} style={{color: isProfit ? theme.colors.success : theme.colors.error}}>
                      {formatCurrency(profitLoss)}
                    </div>
                  </div>
                </div>

                {investment.ytdReturn && (
                  <div className={`mt-2 text-xs ${theme.text.muted} font-medium`}>
                    YTD: <span className={`font-semibold`} style={{color: investment.ytdReturn >= 0 ? theme.colors.success : theme.colors.error}}>{formatPercentage(investment.ytdReturn)}</span>
                  </div>
                )}

                {selectedView === 'details' && (
                  <div className={`mt-4 pt-4 border-t ${theme.border}`}>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {investment.shares && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>Quantità</span>
                          <div className={`font-bold ${theme.text.primary} mt-1`}>{investment.shares.toFixed(2)}</div>
                        </div>
                      )}
                      {investment.avgBuyPrice && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>Prezzo Medio</span>
                          <div className={`font-bold ${theme.text.primary} mt-1`}>{formatCurrency(investment.avgBuyPrice)}</div>
                        </div>
                      )}
                      {investment.currentPrice && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>Prezzo Attuale</span>
                          <div className={`font-bold ${theme.text.primary} mt-1`}>{formatCurrency(investment.currentPrice)}</div>
                        </div>
                      )}
                      {investment.type === "PAC_ETF" && investment.monthlyAmount && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>PAC Mensile</span>
                          <div className={`font-bold mt-1`} style={{color: theme.colors.indigo}}>{formatCurrency(investment.monthlyAmount)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex lg:items-center lg:justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${getTypeColor(investment.type)}`}>
                      {getTypeLabel(investment.type)}
                    </span>
                    <h4 className={`text-base font-bold ${theme.text.primary}`}>{investment.name}</h4>
                    {investment.ticker && (
                      <span className={`${theme.text.muted} text-xs font-medium ${theme.background.secondary} px-3 py-1 rounded-lg ${theme.border} border`}>
                        ${investment.ticker}
                      </span>
                    )}
                  </div>
                  
                  {selectedView === 'details' && (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
                      <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                        <span className={`${theme.text.muted} text-xs font-medium`}>Investito</span>
                        <div className={`font-bold ${theme.text.primary} mt-1`}>{formatCurrency(investment.totalInvested)}</div>
                      </div>
                      <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                        <span className={`${theme.text.muted} text-xs font-medium`}>Valore</span>
                        <div className={`font-bold ${theme.text.primary} mt-1`}>{formatCurrency(investment.currentValue)}</div>
                      </div>
                      {investment.shares && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>Quantità</span>
                          <div className={`font-bold ${theme.text.primary} mt-1`}>{investment.shares.toFixed(2)}</div>
                        </div>
                      )}
                      {investment.avgBuyPrice && investment.currentPrice && (
                        <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                          <span className={`${theme.text.muted} text-xs font-medium`}>Prezzo M/A</span>
                          <div className={`font-bold ${theme.text.primary} text-xs mt-1`}>
                            {formatCurrency(investment.avgBuyPrice)} / {formatCurrency(investment.currentPrice)}
                          </div>
                        </div>
                      )}
                      
                      {investment.type === "PAC_ETF" && investment.monthlyAmount && (
                        <>
                          <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                            <span className={`${theme.text.muted} text-xs font-medium`}>PAC Mensile</span>
                            <div className="font-bold mt-1" style={{color: theme.colors.indigo}}>{formatCurrency(investment.monthlyAmount)}</div>
                          </div>
                          <div className={`${theme.background.secondary} ${theme.border} border rounded-lg p-3`}>
                            <span className={`${theme.text.muted} text-xs font-medium`}>Mesi Attivi</span>
                            <div className={`font-bold ${theme.text.primary} mt-1`}>{investment.totalMonths}</div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className={`text-right border-l ${theme.border} pl-6 ml-6`}>
                  <div className={`text-lg font-bold mb-1`} style={{color: isProfit ? theme.colors.success : theme.colors.error}}>
                    {formatPercentage(investment.totalReturn)}
                  </div>
                  <div className={`text-sm font-bold mb-2`} style={{color: isProfit ? theme.colors.success : theme.colors.error}}>
                    {formatCurrency(profitLoss)}
                  </div>
                  {investment.ytdReturn && (
                    <div className={`text-xs font-medium ${theme.text.muted}`}>
                      YTD: <span className={`font-semibold`} style={{color: investment.ytdReturn >= 0 ? theme.colors.success : theme.colors.error}}>{formatPercentage(investment.ytdReturn)}</span>
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

export default InvestmentsComponent;