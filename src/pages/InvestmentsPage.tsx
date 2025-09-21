import React, { useState } from "react";
import { TrendingUp, TrendingDown, Plus, Filter, BarChart3, PieChart, History, Wallet } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

// Types
export type AssetClass = 'STOCKS' | 'ETF' | 'BONDS' | 'COMMODITIES' | 'REAL_ESTATE' | 'CRYPTO' | 'ALTERNATIVE';
export type InvestmentType = 'SINGLE_PURCHASE' | 'PAC' | 'DIVIDEND_STOCK' | 'BOND' | 'REIT' | 'CRYPTO';

export interface Investment {
  id: string;
  name: string;
  symbol: string;
  assetClass: AssetClass;
  type: InvestmentType;
  
  // Market data (from backend/investpy)
  currentPrice: number;
  previousClose: number;
  dayChange: number;
  dayChangePercent: number;
  currency: string;
  lastUpdated: string;
  
  // User portfolio data
  shares: number;
  avgBuyPrice: number;
  totalInvested: number;
  currentValue: number;
  
  // PAC specific
  monthlyAmount?: number;
  nextPayment?: string;
  
  // Additional info
  sector?: string;
  country?: string;
  isin?: string;
  
  // Calculated fields
  totalReturn: number;
  totalReturnPercent: number;
  portfolioWeight: number;
}

export interface Transaction {
  id: string;
  investmentId: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'PAC_PAYMENT';
  shares: number;
  price: number;
  amount: number;
  fees: number;
  date: string;
  accountId?: string; // Link to Portfolio accounts
}

const InvestmentsPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { addToast } = useToast();

  // States
  const [selectedAssetClass, setSelectedAssetClass] = useState<AssetClass | 'ALL'>('ALL');
  const [showValues, setShowValues] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed' | 'transactions'>('overview');

  // Theme colors matching other pages
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: {
          primary: "bg-gray-900",
          card: "bg-gray-800",
          cardHover: "hover:bg-gray-700",
          secondary: "bg-gray-700",
          glass: "bg-gray-800/60 backdrop-blur-sm"
        },
        text: {
          primary: "text-gray-50",
          secondary: "text-gray-300",
          muted: "text-gray-400",
          subtle: "text-gray-500"
        },
        border: {
          main: "border-gray-700",
          card: "border-gray-700",
          cardHover: "hover:border-gray-600"
        },
        accent: {
          primary: "#6366F1",
          secondary: "#10B981", 
          amber: "#F59E0B",
          gradient: "from-indigo-500 via-purple-500 to-teal-400"
        }
      };
    } else {
      return {
        background: {
          primary: "bg-white",
          card: "bg-white",
          cardHover: "hover:bg-gray-50",
          secondary: "bg-gray-100",
          glass: "bg-white/60 backdrop-blur-sm"
        },
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-700",
          muted: "text-gray-600",
          subtle: "text-gray-500"
        },
        border: {
          main: "border-gray-200",
          card: "border-gray-200",
          cardHover: "hover:border-gray-300"
        },
        accent: {
          primary: "#6366F1",
          secondary: "#10B981",
          amber: "#F59E0B",
          gradient: "from-indigo-500 via-purple-500 to-teal-400"
        }
      };
    }
  };

  const theme = getThemeColors();

  // Mock data - realistic investment portfolio
  const [investments] = useState<Investment[]>([
    {
      id: "1",
      name: "VWCE - Vanguard FTSE All-World",
      symbol: "VWCE.DE",
      assetClass: "ETF",
      type: "PAC",
      currentPrice: 89.45,
      previousClose: 88.92,
      dayChange: 0.53,
      dayChangePercent: 0.60,
      currency: "EUR",
      lastUpdated: new Date().toISOString(),
      shares: 84.2,
      avgBuyPrice: 78.50,
      totalInvested: 6610,
      currentValue: 7534,
      monthlyAmount: 300,
      nextPayment: "2025-10-01",
      country: "Global",
      isin: "IE00BK5BQT80",
      totalReturn: 924,
      totalReturnPercent: 13.98,
      portfolioWeight: 45.2
    },
    {
      id: "2",
      name: "Apple Inc",
      symbol: "AAPL",
      assetClass: "STOCKS",
      type: "SINGLE_PURCHASE",
      currentPrice: 175.43,
      previousClose: 174.20,
      dayChange: 1.23,
      dayChangePercent: 0.71,
      currency: "USD",
      lastUpdated: new Date().toISOString(),
      shares: 15,
      avgBuyPrice: 158.30,
      totalInvested: 2374.50,
      currentValue: 2631.45,
      sector: "Technology",
      country: "USA",
      totalReturn: 256.95,
      totalReturnPercent: 10.83,
      portfolioWeight: 15.8
    },
    {
      id: "3",
      name: "iShares Core Global Aggregate Bond",
      symbol: "AGGH.L",
      assetClass: "BONDS",
      type: "SINGLE_PURCHASE",
      currentPrice: 52.80,
      previousClose: 52.75,
      dayChange: 0.05,
      dayChangePercent: 0.09,
      currency: "GBP",
      lastUpdated: new Date().toISOString(),
      shares: 45,
      avgBuyPrice: 54.20,
      totalInvested: 2439,
      currentValue: 2376,
      country: "Global",
      isin: "IE00B3F81409",
      totalReturn: -63,
      totalReturnPercent: -2.58,
      portfolioWeight: 14.3
    },
    {
      id: "4",
      name: "SPDR Gold Trust",
      symbol: "GLD",
      assetClass: "COMMODITIES",
      type: "SINGLE_PURCHASE",
      currentPrice: 185.20,
      previousClose: 184.85,
      dayChange: 0.35,
      dayChangePercent: 0.19,
      currency: "USD",
      lastUpdated: new Date().toISOString(),
      shares: 8,
      avgBuyPrice: 178.45,
      totalInvested: 1427.60,
      currentValue: 1481.60,
      country: "Global",
      totalReturn: 54,
      totalReturnPercent: 3.78,
      portfolioWeight: 8.9
    },
    {
      id: "5",
      name: "Realty Income Corporation",
      symbol: "O",
      assetClass: "REAL_ESTATE",
      type: "DIVIDEND_STOCK",
      currentPrice: 58.75,
      previousClose: 58.90,
      dayChange: -0.15,
      dayChangePercent: -0.25,
      currency: "USD",
      lastUpdated: new Date().toISOString(),
      shares: 35,
      avgBuyPrice: 55.20,
      totalInvested: 1932,
      currentValue: 2056.25,
      sector: "Real Estate",
      country: "USA",
      totalReturn: 124.25,
      totalReturnPercent: 6.43,
      portfolioWeight: 12.4
    },
    {
      id: "6",
      name: "Bitcoin",
      symbol: "BTC-USD",
      assetClass: "CRYPTO",
      type: "SINGLE_PURCHASE",
      currentPrice: 42350,
      previousClose: 41890,
      dayChange: 460,
      dayChangePercent: 1.10,
      currency: "USD",
      lastUpdated: new Date().toISOString(),
      shares: 0.075,
      avgBuyPrice: 38200,
      totalInvested: 2865,
      currentValue: 3176.25,
      country: "Global",
      totalReturn: 311.25,
      totalReturnPercent: 10.86,
      portfolioWeight: 3.4
    }
  ]);

  // Calculated totals
  const totalPortfolioValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const totalProfit = totalPortfolioValue - totalInvested;
  const totalReturnPercent = (totalProfit / totalInvested) * 100;
  const activePACs = investments.filter(inv => inv.type === 'PAC').length;
  const monthlyPACAmount = investments.filter(inv => inv.type === 'PAC').reduce((sum, inv) => sum + (inv.monthlyAmount || 0), 0);

  // Asset class breakdown
  const assetBreakdown = investments.reduce((acc, inv) => {
    acc[inv.assetClass] = (acc[inv.assetClass] || 0) + inv.currentValue;
    return acc;
  }, {} as Record<AssetClass, number>);

  // Utility functions
  const formatCurrency = (amount: number, currency = 'EUR') => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getAssetClassLabel = (assetClass: AssetClass) => {
    const labels = {
      'STOCKS': 'Azioni',
      'ETF': 'ETF',
      'BONDS': 'Obbligazioni',
      'COMMODITIES': 'Materie Prime',
      'REAL_ESTATE': 'Immobiliare',
      'CRYPTO': 'Criptovalute',
      'ALTERNATIVE': 'Alternativi'
    };
    return labels[assetClass];
  };

  const getAssetClassColor = (assetClass: AssetClass) => {
    const colors = {
      'STOCKS': '#6366F1',
      'ETF': '#10B981', 
      'BONDS': '#F59E0B',
      'COMMODITIES': '#EF4444',
      'REAL_ESTATE': '#8B5CF6',
      'CRYPTO': '#F97316',
      'ALTERNATIVE': '#06B6D4'
    };
    return colors[assetClass];
  };

  const filteredInvestments = selectedAssetClass === 'ALL' 
    ? investments 
    : investments.filter(inv => inv.assetClass === selectedAssetClass);

  return (
    <div className={`min-h-screen ${theme.background.primary} ${theme.text.primary} transition-colors duration-300`}>
      <div className="w-full h-full p-4 md:p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              Portfolio Investimenti
            </h1>
            <p className={`${theme.text.muted} text-sm leading-relaxed`}>
              Gestisci e monitora tutti i tuoi investimenti
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowValues(!showValues)}
              className={`p-2 ${theme.background.card} ${theme.border.card} border rounded-lg ${theme.cardHover} transition-all`}
            >
              {showValues ? '👁️' : '🙈'}
            </button>
            <button className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 px-4 py-2 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Nuovo Investimento
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <span className={`text-xs ${theme.text.muted} font-medium`}>Portafoglio</span>
            </div>
            <div className="space-y-1">
              <div className={`text-lg md:text-xl font-bold ${theme.text.primary}`}>
                {showValues ? formatCurrency(totalPortfolioValue) : "••••••"}
              </div>
              <div className={`text-xs ${totalReturnPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatPercentage(totalReturnPercent)}
              </div>
            </div>
          </div>

          <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className={`text-xs ${theme.text.muted} font-medium`}>Investito</span>
            </div>
            <div className="space-y-1">
              <div className={`text-lg md:text-xl font-bold ${theme.text.primary}`}>
                {showValues ? formatCurrency(totalInvested) : "••••••"}
              </div>
            </div>
          </div>

          <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
              {totalProfit >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <span className={`text-xs ${theme.text.muted} font-medium`}>P&L</span>
            </div>
            <div className="space-y-1">
              <div className={`text-lg md:text-xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {showValues ? formatCurrency(totalProfit) : "••••••"}
              </div>
            </div>
          </div>

          <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
              <History className="w-5 h-5 text-purple-400" />
              <span className={`text-xs ${theme.text.muted} font-medium`}>PAC Attivi</span>
            </div>
            <div className="space-y-1">
              <div className={`text-lg md:text-xl font-bold ${theme.text.primary}`}>
                {showValues ? formatCurrency(monthlyPACAmount) : "••••••"}
              </div>
              <div className={`text-xs ${theme.text.muted}`}>
                {activePACs} piani attivi
              </div>
            </div>
          </div>
        </div>

        {/* View Toggles */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2">
            {['overview', 'detailed', 'transactions'].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedView === view 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : `${theme.background.card} ${theme.text.secondary} hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-200/50`
                }`}
              >
                {view === 'overview' ? 'Panoramica' : view === 'detailed' ? 'Dettagli' : 'Transazioni'}
              </button>
            ))}
          </div>

          {/* Asset Class Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedAssetClass('ALL')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedAssetClass === 'ALL' 
                  ? 'bg-gray-600 text-white' 
                  : `${theme.background.card} ${theme.text.muted} hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-200/50`
              }`}
            >
              Tutti ({investments.length})
            </button>
            {Object.keys(assetBreakdown).map((assetClass) => (
              <button
                key={assetClass}
                onClick={() => setSelectedAssetClass(assetClass as AssetClass)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedAssetClass === assetClass 
                    ? 'text-white' 
                    : `${theme.background.card} ${theme.text.muted} hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-200/50`
                }`}
                style={{
                  backgroundColor: selectedAssetClass === assetClass ? getAssetClassColor(assetClass as AssetClass) : undefined
                }}
              >
                {getAssetClassLabel(assetClass as AssetClass)} ({investments.filter(inv => inv.assetClass === assetClass).length})
              </button>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Performance Chart Placeholder */}
          <div className={`xl:col-span-2 ${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/25">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>Performance Portfolio</h3>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
              <p className={`${theme.text.muted} text-sm`}>Grafico Performance (Coming Soon)</p>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg shadow-purple-500/25">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>Asset Allocation</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(assetBreakdown).map(([assetClass, value]) => {
                const percentage = ((value / totalPortfolioValue) * 100).toFixed(1);
                return (
                  <div key={assetClass} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: getAssetClassColor(assetClass as AssetClass) }}
                      ></div>
                      <span className={`${theme.text.secondary} text-sm`}>
                        {getAssetClassLabel(assetClass as AssetClass)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`${theme.text.primary} font-semibold text-sm`}>{percentage}%</div>
                      <div className={`${theme.text.muted} text-xs`}>
                        {showValues ? formatCurrency(value) : "••••"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Investments List */}
        <div className="space-y-3">
          {filteredInvestments.map((investment) => (
            <div 
              key={investment.id} 
              className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                
                {/* Investment Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getAssetClassColor(investment.assetClass) }}
                    >
                      {getAssetClassLabel(investment.assetClass)}
                    </div>
                    {investment.type === 'PAC' && (
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        PAC
                      </div>
                    )}
                    <h3 className={`font-semibold ${theme.text.primary}`}>
                      {investment.name}
                    </h3>
                    <span className={`${theme.text.muted} text-sm`}>
                      {investment.symbol}
                    </span>
                  </div>
                  
                  {selectedView === 'detailed' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                      <div>
                        <span className={`${theme.text.muted} block`}>Quantità</span>
                        <span className={`${theme.text.primary} font-medium`}>
                          {investment.shares.toFixed(investment.assetClass === 'CRYPTO' ? 6 : 2)}
                        </span>
                      </div>
                      <div>
                        <span className={`${theme.text.muted} block`}>Prezzo Medio</span>
                        <span className={`${theme.text.primary} font-medium`}>
                          {showValues ? formatCurrency(investment.avgBuyPrice, investment.currency) : "••••"}
                        </span>
                      </div>
                      <div>
                        <span className={`${theme.text.muted} block`}>Prezzo Attuale</span>
                        <span className={`${theme.text.primary} font-medium`}>
                          {showValues ? formatCurrency(investment.currentPrice, investment.currency) : "••••"}
                        </span>
                      </div>
                      <div>
                        <span className={`${theme.text.muted} block`}>Peso Portfolio</span>
                        <span className={`${theme.text.primary} font-medium`}>
                          {investment.portfolioWeight.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance */}
                <div className="flex justify-between lg:flex-col lg:items-end gap-2 lg:gap-1 border-t lg:border-t-0 lg:border-l border-gray-700 pt-3 lg:pt-0 lg:pl-4">
                  <div className="lg:text-right">
                    <div className={`text-lg font-bold ${investment.totalReturnPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatPercentage(investment.totalReturnPercent)}
                    </div>
                    <div className={`text-sm ${investment.totalReturnPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {showValues ? formatCurrency(investment.totalReturn) : "••••"}
                    </div>
                  </div>
                  <div className="lg:text-right">
                    <div className={`text-sm ${theme.text.primary} font-semibold`}>
                      {showValues ? formatCurrency(investment.currentValue) : "••••••"}
                    </div>
                    <div className={`text-xs ${theme.text.muted}`}>
                      su {showValues ? formatCurrency(investment.totalInvested) : "••••"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInvestments.length === 0 && (
          <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-8 text-center`}>
            <div className={`${theme.text.muted} text-lg mb-2`}>Nessun investimento trovato</div>
            <div className={`${theme.text.subtle} text-sm`}>
              {selectedAssetClass === 'ALL' 
                ? 'Inizia aggiungendo il tuo primo investimento' 
                : `Nessun investimento nella categoria ${getAssetClassLabel(selectedAssetClass as AssetClass)}`
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentsPage;