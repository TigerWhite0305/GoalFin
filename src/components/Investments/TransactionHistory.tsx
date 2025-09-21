import React, { useState } from "react";
import { History, Calendar, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Filter, Download, Search, MoreVertical, Trash2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export interface Transaction {
  id: string;
  investmentId: string;
  investmentName: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'PAC_PAYMENT' | 'SPLIT' | 'FEE';
  shares: number;
  price: number;
  amount: number;
  fees: number;
  date: string;
  accountId?: string;
  notes?: string;
  currency: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  showValues: boolean;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction?: (transaction: Transaction) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  showValues,
  onDeleteTransaction,
  onEditTransaction
}) => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<Transaction['type'] | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Theme colors
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: {
          card: "bg-gray-800",
          menu: "bg-gray-700",
          input: "bg-gray-700/50"
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
          input: "bg-white"
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

  // Transaction type configuration
  const getTransactionConfig = (type: Transaction['type']) => {
    const configs = {
      'BUY': { 
        label: 'Acquisto', 
        color: 'text-emerald-400', 
        bgColor: 'bg-emerald-500/10', 
        borderColor: 'border-emerald-500/30',
        icon: ArrowUpRight 
      },
      'SELL': { 
        label: 'Vendita', 
        color: 'text-red-400', 
        bgColor: 'bg-red-500/10', 
        borderColor: 'border-red-500/30',
        icon: ArrowDownLeft 
      },
      'DIVIDEND': { 
        label: 'Dividendo', 
        color: 'text-blue-400', 
        bgColor: 'bg-blue-500/10', 
        borderColor: 'border-blue-500/30',
        icon: DollarSign 
      },
      'PAC_PAYMENT': { 
        label: 'PAC', 
        color: 'text-purple-400', 
        bgColor: 'bg-purple-500/10', 
        borderColor: 'border-purple-500/30',
        icon: Calendar 
      },
      'SPLIT': { 
        label: 'Split', 
        color: 'text-amber-400', 
        bgColor: 'bg-amber-500/10', 
        borderColor: 'border-amber-500/30',
        icon: TrendingUp 
      },
      'FEE': { 
        label: 'Commissione', 
        color: 'text-gray-400', 
        bgColor: 'bg-gray-500/10', 
        borderColor: 'border-gray-500/30',
        icon: TrendingDown 
      }
    };
    return configs[type];
  };

  const formatCurrency = (amount: number, currency = 'EUR') => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch = tx.investmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tx.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tx.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'ALL' || tx.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Calculate summary stats
  const totalBuy = filteredTransactions.filter(tx => tx.type === 'BUY' || tx.type === 'PAC_PAYMENT')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalSell = filteredTransactions.filter(tx => tx.type === 'SELL')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalDividends = filteredTransactions.filter(tx => tx.type === 'DIVIDEND')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalFees = filteredTransactions.filter(tx => tx.type === 'FEE')
    .reduce((sum, tx) => sum + tx.fees, 0);

  const transactionTypes: (Transaction['type'] | 'ALL')[] = ['ALL', 'BUY', 'SELL', 'DIVIDEND', 'PAC_PAYMENT', 'SPLIT', 'FEE'];

  return (
    <div className={`${theme.background.card} ${theme.border.main} border rounded-xl shadow-lg transition-all duration-300`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-700/30 dark:border-gray-700/30 light:border-gray-200/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg shadow-amber-500/25">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>
                Storico Transazioni
              </h3>
              <div className={`${theme.text.muted} text-sm`}>
                {filteredTransactions.length} operazioni
              </div>
            </div>
          </div>
          
          <button className={`p-2 ${theme.text.muted} hover:text-gray-50 dark:hover:text-gray-50 light:hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-200/50`}>
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.text.muted}`} />
            <input
              type="text"
              placeholder="Cerca transazioni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 ${theme.background.input} ${theme.border.main} border rounded-lg ${theme.text.primary} placeholder-gray-400 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm`}
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className={`px-3 py-2 ${theme.background.input} ${theme.border.main} border rounded-lg ${theme.text.primary} focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm`}
          >
            {transactionTypes.map(type => (
              <option key={type} value={type}>
                {type === 'ALL' ? 'Tutti i tipi' : getTransactionConfig(type as Transaction['type']).label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy as 'date' | 'amount');
              setSortOrder(newSortOrder as 'asc' | 'desc');
            }}
            className={`px-3 py-2 ${theme.background.input} ${theme.border.main} border rounded-lg ${theme.text.primary} focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm`}
          >
            <option value="date-desc">Data (più recenti)</option>
            <option value="date-asc">Data (più vecchie)</option>
            <option value="amount-desc">Importo (maggiore)</option>
            <option value="amount-asc">Importo (minore)</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 border-b border-gray-700/30 dark:border-gray-700/30 light:border-gray-200/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className={`${theme.text.muted} block`}>Acquisti</span>
            <span className={`${theme.text.primary} font-semibold text-emerald-400`}>
              {showValues ? formatCurrency(totalBuy) : "••••••"}
            </span>
          </div>
          <div>
            <span className={`${theme.text.muted} block`}>Vendite</span>
            <span className={`${theme.text.primary} font-semibold text-red-400`}>
              {showValues ? formatCurrency(totalSell) : "••••••"}
            </span>
          </div>
          <div>
            <span className={`${theme.text.muted} block`}>Dividendi</span>
            <span className={`${theme.text.primary} font-semibold text-blue-400`}>
              {showValues ? formatCurrency(totalDividends) : "••••••"}
            </span>
          </div>
          <div>
            <span className={`${theme.text.muted} block`}>Commissioni</span>
            <span className={`${theme.text.primary} font-semibold text-gray-400`}>
              {showValues ? formatCurrency(totalFees) : "••••••"}
            </span>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <History className={`w-12 h-12 ${theme.text.muted} mx-auto mb-3`} />
            <h4 className={`${theme.text.primary} font-semibold mb-2`}>Nessuna transazione trovata</h4>
            <p className={`${theme.text.muted} text-sm`}>
              {searchTerm || selectedType !== 'ALL' 
                ? 'Prova a modificare i filtri di ricerca'
                : 'Le tue transazioni appariranno qui non appena effettui operazioni'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredTransactions.map((transaction) => {
              const config = getTransactionConfig(transaction.type);
              const IconComponent = config.icon;
              
              return (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 dark:hover:bg-gray-700/30 light:hover:bg-gray-100/50 transition-colors group relative`}
                >
                  {/* Transaction Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
                      <IconComponent className={`w-4 h-4 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`${theme.text.primary} font-medium text-sm`}>
                          {transaction.investmentName}
                        </span>
                        <span className={`${theme.text.muted} text-xs`}>
                          {transaction.symbol}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bgColor} ${config.borderColor} border`}>
                          {config.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`${theme.text.muted}`}>
                          {formatDate(transaction.date)}
                        </span>
                        <span className={`${theme.text.muted}`}>•</span>
                        <span className={`${theme.text.muted}`}>
                          {formatTime(transaction.date)}
                        </span>
                        {transaction.shares !== 0 && (
                          <>
                            <span className={`${theme.text.muted}`}>•</span>
                            <span className={`${theme.text.muted}`}>
                              {transaction.shares.toFixed(transaction.type === 'PAC_PAYMENT' ? 6 : 2)} azioni
                            </span>
                          </>
                        )}
                      </div>
                      
                      {transaction.notes && (
                        <div className={`${theme.text.muted} text-xs mt-1`}>
                          {transaction.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`font-semibold text-sm ${config.color}`}>
                        {transaction.type === 'SELL' || transaction.type === 'DIVIDEND' ? '+' : transaction.type === 'FEE' ? '-' : ''}
                        {showValues ? formatCurrency(transaction.amount, transaction.currency) : "••••••"}
                      </div>
                      {transaction.fees > 0 && (
                        <div className={`${theme.text.muted} text-xs`}>
                          Comm: {showValues ? formatCurrency(transaction.fees, transaction.currency) : "••••"}
                        </div>
                      )}
                    </div>

                    {/* Menu */}
                    <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === transaction.id ? null : transaction.id)}
                        className={`p-1 ${theme.text.muted} hover:text-gray-50 dark:hover:text-gray-50 light:hover:text-gray-900 transition-colors rounded`}
                      >
                        <MoreVertical className="w-3 h-3" />
                      </button>
                      
                      {openMenuId === transaction.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                          <div className={`absolute top-6 right-0 z-50 w-32 ${theme.background.menu} ${theme.border.menu} border rounded-lg shadow-xl overflow-hidden`}>
                            {onEditTransaction && (
                              <button
                                onClick={() => {
                                  onEditTransaction(transaction);
                                  setOpenMenuId(null);
                                }}
                                className={`w-full px-3 py-2 text-left text-blue-400 hover:bg-gray-600/50 dark:hover:bg-gray-600/50 light:hover:bg-gray-200/50 transition-colors text-sm`}
                              >
                                Modifica
                              </button>
                            )}
                            <button
                              onClick={() => {
                                onDeleteTransaction(transaction.id);
                                setOpenMenuId(null);
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;