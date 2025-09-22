import React from "react";
import { useTheme } from "../../context/ThemeContext";
import InvestmentCard from "./InvestmentSummaryCards";
import { Investment, AssetClass } from "../../utils/AssetTypes";

interface InvestmentsListProps {
  investments: Investment[];
  selectedAssetClass: AssetClass | 'ALL';
  selectedView: 'overview' | 'detailed' | 'transactions';
  showValues: boolean;
  onEditInvestment: (investment: Investment) => void;
  onDeleteInvestment: (id: string) => void;
  onQuickAction: (id: string, action: 'buy' | 'sell' | 'details') => void;
}

const InvestmentsList: React.FC<InvestmentsListProps> = ({
  investments,
  selectedAssetClass,
  selectedView,
  showValues,
  onEditInvestment,
  onDeleteInvestment,
  onQuickAction
}) => {
  const { isDarkMode } = useTheme();

  // Theme colors
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: {
          card: "bg-gray-800",
          empty: "bg-gray-800"
        },
        text: {
          primary: "text-gray-50",
          secondary: "text-gray-300",
          muted: "text-gray-400"
        },
        border: {
          main: "border-gray-700"
        }
      };
    } else {
      return {
        background: {
          card: "bg-white",
          empty: "bg-white"
        },
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-700",
          muted: "text-gray-600"
        },
        border: {
          main: "border-gray-200"
        }
      };
    }
  };

  const theme = getThemeColors();

  // Filter investments
  const filteredInvestments = selectedAssetClass === 'ALL' 
    ? investments 
    : investments.filter(inv => inv.assetClass === selectedAssetClass);

  // Sort investments by value (descending)
  const sortedInvestments = [...filteredInvestments].sort((a, b) => b.currentValue - a.currentValue);

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

  // Calculate summary stats for filtered investments
  const totalValue = filteredInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvested = filteredInvestments.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const totalProfit = totalValue - totalInvested;
  const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

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

  if (sortedInvestments.length === 0) {
    return (
      <div className={`${theme.background.empty} ${theme.border.main} border rounded-xl p-8 text-center shadow-lg`}>
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-700/30 dark:bg-gray-700/30 light:bg-gray-200/50 flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h3 className={`${theme.text.primary} text-lg font-semibold mb-2`}>
              {selectedAssetClass === 'ALL' ? 'Nessun investimento' : `Nessun investimento in ${getAssetClassLabel(selectedAssetClass)}`}
            </h3>
            <p className={`${theme.text.muted} text-sm`}>
              {selectedAssetClass === 'ALL' 
                ? 'Inizia aggiungendo il tuo primo investimento per costruire il tuo portfolio'
                : `Non hai ancora investimenti nella categoria ${getAssetClassLabel(selectedAssetClass)}. Aggiungi il tuo primo investimento per iniziare.`
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Summary Header for filtered view */}
      {selectedAssetClass !== 'ALL' && (
        <div className={`${theme.background.card} ${theme.border.main} border rounded-xl p-4 shadow-lg`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className={`${theme.text.primary} font-semibold text-lg`}>
                {getAssetClassLabel(selectedAssetClass)}
              </h3>
              <p className={`${theme.text.muted} text-sm`}>
                {filteredInvestments.length} investimenti in questa categoria
              </p>
            </div>
            
            <div className="flex flex-col sm:items-end gap-1">
              <div className={`text-xl font-bold ${theme.text.primary}`}>
                {showValues ? formatCurrency(totalValue) : "••••••"}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'} font-medium`}>
                  {formatPercentage(profitPercentage)}
                </span>
                <span className={`${theme.text.muted}`}>
                  ({showValues ? formatCurrency(totalProfit) : "••••"})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investments Grid/List */}
      <div className="space-y-3">
        {sortedInvestments.map((investment: Investment) => (
          <InvestmentCard
            key={investment.id}
            investment={investment}
            data={{
              ...investment,
              totalPortfolioValue: investment.currentValue,
              totalProfit: investment.currentValue - investment.totalInvested,
              activePACs: investment.type === 'PAC' ? 1 : 0,
              monthlyPACAmount: investment.type === 'PAC' ? investment.totalInvested / 12 : 0
            }}
            viewMode={selectedView}
            showValues={showValues}
            onEdit={() => onEditInvestment(investment)}
            onDelete={() => onDeleteInvestment(investment.id)}
            onQuickAction={(action: 'buy' | 'sell' | 'details') => onQuickAction(investment.id, action)}
            onToggleValues={() => {}}
          />
        ))}
      </div>

      {/* Performance Summary */}
      {selectedAssetClass === 'ALL' && sortedInvestments.length > 1 && (
        <div className={`${theme.background.card} ${theme.border.main} border rounded-xl p-4 shadow-lg`}>
          <h4 className={`${theme.text.primary} font-semibold mb-3`}>
            Riepilogo Performance
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className={`${theme.text.muted} block`}>Migliore Performance</span>
              <span className={`${theme.text.primary} font-medium`}>
                {(() => {
                  const best = sortedInvestments.reduce((prev, current) => 
                    (prev.totalReturnPercent > current.totalReturnPercent) ? prev : current
                  );
                  return `${best.name.split(' ')[0]} (${formatPercentage(best.totalReturnPercent)})`;
                })()}
              </span>
            </div>
            <div>
              <span className={`${theme.text.muted} block`}>Peggiore Performance</span>
              <span className={`${theme.text.primary} font-medium`}>
                {(() => {
                  const worst = sortedInvestments.reduce((prev, current) => 
                    (prev.totalReturnPercent < current.totalReturnPercent) ? prev : current
                  );
                  return `${worst.name.split(' ')[0]} (${formatPercentage(worst.totalReturnPercent)})`;
                })()}
              </span>
            </div>
            <div>
              <span className={`${theme.text.muted} block`}>PAC Attivi</span>
              <span className={`${theme.text.primary} font-medium`}>
                {sortedInvestments.filter(inv => inv.type === 'PAC').length} / {sortedInvestments.length}
              </span>
            </div>
            <div>
              <span className={`${theme.text.muted} block`}>Asset Classes</span>
              <span className={`${theme.text.primary} font-medium`}>
                {new Set(sortedInvestments.map(inv => inv.assetClass)).size} / 7
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentsList;