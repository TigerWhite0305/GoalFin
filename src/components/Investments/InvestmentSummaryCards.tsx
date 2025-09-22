import React from "react";
import { Wallet, TrendingUp, TrendingDown, History, Target, Eye, EyeOff, Calendar, DollarSign } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Investment } from "../../utils/AssetTypes";

interface SummaryData {
  totalPortfolioValue: number;
  totalInvested: number;
  totalProfit: number;
  totalReturnPercent: number;
  activePACs: number;
  monthlyPACAmount: number;
  dayChange: number;
  dayChangePercent: number;
  nextPACPayment?: string;
}

interface InvestmentSummaryCardsProps {
  data: SummaryData;
  showValues: boolean;
  onToggleValues: () => void;
  investment: Investment;
  viewMode: "overview" | "detailed" | "transactions"; // aggiungi questa riga
  onEdit: (investment: Investment) => void;
  onDelete: (investment: Investment) => void;
  onQuickAction: (action: 'buy' | 'sell' | 'details') => void;
  
}

const InvestmentSummaryCards: React.FC<InvestmentSummaryCardsProps> = ({ 
  data, 
  showValues, 
  onToggleValues 
}) => {
  const { isDarkMode } = useTheme();

  // Theme colors matching the design system
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: {
          card: "bg-gray-800",
          cardHover: "hover:bg-gray-700",
          gradient: {
            positive: "from-emerald-600 to-emerald-700",
            negative: "from-red-600 to-red-700",
            neutral: "from-blue-600 to-blue-700",
            pac: "from-purple-600 to-purple-700"
          }
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
          cardHover: "hover:bg-gray-50",
          gradient: {
            positive: "from-emerald-500 to-emerald-600",
            negative: "from-red-500 to-red-600",
            neutral: "from-blue-500 to-blue-600",
            pac: "from-purple-500 to-purple-600"
          }
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const cards = [
    {
      id: 'portfolio',
      title: 'Valore Portafoglio',
      icon: Wallet,
      value: showValues ? formatCurrency(data.totalPortfolioValue) : "••••••",
      subtitle: `${formatPercentage(data.totalReturnPercent)}`,
      subtitleColor: data.totalReturnPercent >= 0 ? 'text-emerald-400' : 'text-red-400',
      gradient: data.totalReturnPercent >= 0 ? theme.background.gradient.positive : theme.background.gradient.negative,
      iconColor: data.totalReturnPercent >= 0 ? 'text-emerald-200' : 'text-red-200',
      extra: showValues ? formatCurrency(data.dayChange) : "••••",
      extraColor: data.dayChange >= 0 ? 'text-emerald-300' : 'text-red-300'
    },
    {
      id: 'invested',
      title: 'Capitale Investito',
      icon: Target,
      value: showValues ? formatCurrency(data.totalInvested) : "••••••",
      subtitle: 'Totale versato',
      subtitleColor: theme.text.secondary,
      gradient: theme.background.gradient.neutral,
      iconColor: 'text-blue-200'
    },
    {
      id: 'profit',
      title: 'Profitto/Perdita',
      icon: data.totalProfit >= 0 ? TrendingUp : TrendingDown,
      value: showValues ? formatCurrency(data.totalProfit) : "••••••",
      subtitle: `${formatPercentage(data.totalReturnPercent)}`,
      subtitleColor: data.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400',
      gradient: data.totalProfit >= 0 ? theme.background.gradient.positive : theme.background.gradient.negative,
      iconColor: data.totalProfit >= 0 ? 'text-emerald-200' : 'text-red-200'
    },
    {
      id: 'pac',
      title: 'PAC Mensili',
      icon: Calendar,
      value: showValues ? formatCurrency(data.monthlyPACAmount) : "••••••",
      subtitle: `${data.activePACs} piani attivi`,
      subtitleColor: 'text-purple-300',
      gradient: theme.background.gradient.pac,
      iconColor: 'text-purple-200',
      extra: data.nextPACPayment ? `Prossimo: ${formatDate(data.nextPACPayment)}` : undefined,
      extraColor: 'text-purple-300'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={card.id}
            className={`bg-gradient-to-br ${card.gradient} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 relative group`}
          >
            {/* Privacy Toggle - Only on first card */}
            {card.id === 'portfolio' && (
              <button
                onClick={onToggleValues}
                className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                {showValues ? (
                  <Eye className="w-4 h-4 text-white" />
                ) : (
                  <EyeOff className="w-4 h-4 text-white" />
                )}
              </button>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${card.iconColor}`} />
              <span className="text-white/80 text-xs font-medium">
                {card.title}
              </span>
            </div>

            {/* Main Value */}
            <div className="space-y-1">
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">
                {card.value}
              </div>
              
              {/* Subtitle */}
              <div className={`text-xs md:text-sm ${card.subtitleColor} font-medium`}>
                {card.subtitle}
              </div>

              {/* Extra Info */}
              {card.extra && (
                <div className={`text-xs ${card.extraColor} mt-1`}>
                  {card.extra}
                </div>
              )}
            </div>

            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
};

export default InvestmentSummaryCards;
