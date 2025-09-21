import React, { useState } from "react";
import { MoreVertical, Edit, Trash2, TrendingUp, TrendingDown, Calendar, Target, ShoppingCart, DollarSign, Info } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Investment, AssetClass } from "../types/InvestmentTypes";

interface InvestmentCardProps {
  investment: Investment;
  viewMode: 'overview' | 'detailed' | 'transactions';
  showValues: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onQuickAction: (action: 'buy' | 'sell' | 'details') => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  viewMode,
  showValues,
  onEdit,
  onDelete,
  onQuickAction
}) => {
  const { isDarkMode } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  // Theme colors
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: {
          card: "bg-gray-800",
          menu: "bg-gray-700",
          badge: "bg-gray-700/50"
        },
        text: {
          primary: "text-gray-50",
          secondary: "text-gray-300",
          muted: "text-gray-400"
        },
        border: {
          main: "border-gray-700",
          menu: "border-gray-600"
        }
      };
    } else {
      return {
        background: {
          card: "bg-white",
          menu: "bg-gray-50",
          badge: "bg-gray-100"
        },
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-700",
          muted: "text-gray-600"
        },
        border: {
          main: "border-gray-200",
          menu: "border-gray-300"
        }
      };
    }
  };

  const theme = getThemeColors();

  // Asset class configuration
  const getAssetClassConfig = (assetClass: AssetClass) => {
    const configs = {
      'STOCKS': { label: 'Azione', color: '#6366F1', icon: '📈' },
      'ETF': { label: 'ETF', color: '#10B981', icon: '📊' },
      'BONDS': { label: 'Obbligazione', color: '#F59E0B', icon: '🏛️' },
      'COMMODITIES': { label: 'Materia Prima', color: '#EF4444', icon: '🥇' },
      'REAL_ESTATE': { label: 'Immobiliare', color: '#8B5CF6', icon: '🏠' },
      'CRYPTO': { label: 'Crypto', color: '#F97316', icon: '₿' },
      'ALTERNATIVE': { label: 'Alternativo', color: '#06B6D4', icon: '🔬' }
    };
    return configs[assetClass];
  };

  const assetConfig = getAssetClassConfig(investment.assetClass);

  const formatCurrency = (amount: number, currency = 'EUR') => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'EUR' ? 2 : 4,
      maximumFractionDigits: currency === 'EUR' ? 2 : 6
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const getInvestmentTypeLabel = (type: Investment['type']) => {
    const labels = {
      'SINGLE_PURCHASE': 'Acquisto',
      'PAC': 'PAC',
      'DIVIDEND_STOCK': 'Dividendi',
      'BOND': 'Obbligazione',
      'REIT': 'REIT',
      'CRYPTO': 'Crypto'
    };
    return labels[type];
  };

  const isProfit = investment.totalReturnPercent >= 0;
  const dayChangePositive = investment.dayChangePercent >= 0;

  return (
    <div className={`${theme.background.card} ${theme.border.main} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group relative`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {/* Asset Class Badge */}
            <div 
              className="px-2 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1"
              style={{ backgroundColor: assetConfig.color }}
            >
              <span>{assetConfig.icon}</span>
              <span>{assetConfig.label}</span>
            </div>
            
            {/* Investment Type Badge */}
            {investment.type === 'PAC' && (
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                PAC
              </div>
            )}
            
            {investment.type === 'DIVIDEND_STOCK' && (
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                DIV
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className={`${theme.text.primary} font-semibold text-base md:text-lg leading-tight`}>
              {investment.name}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className={`${theme.text.muted}`}>{investment.symbol}</span>
              {investment.sector && (
                <>
                  <span className={`${theme.text.muted}`}>•</span>
                  <span className={`${theme.text.muted}`}>{investment.sector}</span>
                </>
              )}
              {investment.country && (
                <>
                  <span className={`${theme.text.muted}`}>•</span>
                  <span className={`${theme.text.muted}`}>{investment.country}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-1.5 ${theme.text.muted} hover:text-gray-50 dark:hover:text-gray-50 light:hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-200/50 opacity-0 group-hover:opacity-100`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className={`absolute top-8 right-0 z-50 w-36 ${theme.background.menu} ${theme.border.menu} border rounded-lg shadow-xl overflow-hidden`}>
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-blue-400 hover:bg-gray-600/50 dark:hover:bg-gray-600/50 light:hover:bg-gray-200/50 transition-colors flex items-center gap-2 text-sm`}
                >
                  <Edit className="w-3 h-3" />
                  Modifica
                </button>
                <button
                  onClick={() => {
                    onQuickAction('details');
                    setShowMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left ${theme.text.secondary} hover:bg-gray-600/50 dark:hover:bg-gray-600/50 light:hover:bg-gray-200/50 transition-colors flex items-center gap-2 text-sm`}
                >
                  <Info className="w-3 h-3" />
                  Dettagli
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-red-400 hover:bg-gray-600/50 dark:hover:bg-gray-600/50 light:hover:bg-gray-200/50 transition-colors flex items-center gap-2 text-sm`}
                >
                  <Trash2 className="w-3 h-3" />
                  Elimina
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Price and Change Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div>
            <div className={`${theme.text.primary} font-bold text-lg`}>
              {showValues ? formatCurrency(investment.currentPrice, investment.currency) : "••••••"}
            </div>
            <div className={`text-xs ${theme.text.muted}`}>
              Prezzo attuale
            </div>
          </div>
          <div className={`flex items-center gap-1 text-sm ${dayChangePositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {dayChangePositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-medium">
              {formatPercentage(investment.dayChangePercent)}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-xs ${theme.text.muted} mb-1`}>Peso Portfolio</div>
          <div className={`${theme.text.primary} font-semibold`}>
            {investment.portfolioWeight.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Detailed View */}
      {viewMode === 'detailed' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
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
            <span className={`${theme.text.muted} block`}>Investito</span>
            <span className={`${theme.text.primary} font-medium`}>
              {showValues ? formatCurrency(investment.totalInvested) : "••••••"}
            </span>
          </div>
          <div>
            <span className={`${theme.text.muted} block`}>Ultimo Agg.</span>
            <span className={`${theme.text.primary} font-medium`}>
              {formatDate(investment.lastUpdated)}
            </span>
          </div>
          
          {/* PAC specific info */}
          {investment.type === 'PAC' && investment.monthlyAmount && (
            <>
              <div>
                <span className={`${theme.text.muted} block`}>PAC Mensile</span>
                <span className="font-medium text-blue-400">
                  {showValues ? formatCurrency(investment.monthlyAmount) : "••••"}
                </span>
              </div>
              {investment.nextPayment && (
                <div>
                  <span className={`${theme.text.muted} block`}>Prossimo Vers.</span>
                  <span className={`${theme.text.primary} font-medium`}>
                    {formatDate(investment.nextPayment)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Performance Section */}
      <div className="flex justify-between items-end border-t border-gray-700/30 dark:border-gray-700/30 light:border-gray-200/30 pt-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs ${theme.text.muted}`}>Performance Totale</span>
            {isProfit ? (
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-400" />
            )}
          </div>
          <div className={`text-lg font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatPercentage(investment.totalReturnPercent)}
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-xl font-bold ${theme.text.primary} mb-1`}>
            {showValues ? formatCurrency(investment.currentValue) : "••••••"}
          </div>
          <div className={`text-sm ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
            {showValues ? formatCurrency(investment.totalReturn) : "••••"}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onQuickAction('buy')}
          className="flex-1 px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1"
        >
          <ShoppingCart className="w-3 h-3" />
          Compra
        </button>
        <button
          onClick={() => onQuickAction('sell')}
          className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1"
        >
          <Target className="w-3 h-3" />
          Vendi
        </button>
      </div>
    </div>
  );
};

export default InvestmentCard;