import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, Plus, Calendar, TrendingUp, TrendingDown, Repeat, X, CheckCircle2, DollarSign, Type, FileText, Clock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import TransactionModal from '../components/ui/TransactionModal';

// Types
export type Transaction = {
  id: number;
  name: string;
  category: string;
  description: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  color?: string;
  isRecurring?: boolean;
  recurringInfo?: {
    frequency: number;
    duration: string;
  };
};

type TabType = "all" | "income" | "expense" | "recurring";

const TransactionsPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTransaction, setModalTransaction] = useState<Transaction | undefined>();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number } | null>(null);

  // Hook per i toast
  const { addToast } = useToast();

  const buttonRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());

  // Theme-aware colors seguendo il design system
  const getThemeColors = () => ({
    background: {
      primary: isDarkMode ? "bg-gray-900" : "bg-white",
      card: isDarkMode ? "bg-gray-800" : "bg-white",
      secondary: isDarkMode ? "bg-gray-700" : "bg-gray-100",
      input: isDarkMode ? "bg-gray-700" : "bg-white"
    },
    text: {
      primary: isDarkMode ? "text-gray-50" : "text-gray-900",
      secondary: isDarkMode ? "text-gray-300" : "text-gray-700",
      muted: isDarkMode ? "text-gray-400" : "text-gray-600",
      subtle: isDarkMode ? "text-gray-500" : "text-gray-500"
    },
    border: isDarkMode ? "border-gray-700" : "border-gray-200",
    accent: {
      primary: "from-indigo-500 via-purple-500 to-teal-400",
      hover: isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
    }
  });

  const colors = getThemeColors();

  // Sample data con transazioni ricorrenti
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, name: "Stipendio", category: "Lavoro", description: "Stipendio mensile", date: "2025-09-01T09:00:00", amount: 2500, type: "income", color: "#16A34A" },
    { id: 2, name: "Affitto", category: "Casa", description: "Affitto appartamento", date: "2025-09-01T10:00:00", amount: 800, type: "expense", color: "#4C6FFF", isRecurring: true, recurringInfo: { frequency: 1, duration: "forever" } },
    { id: 3, name: "Spesa Supermercato", category: "Cibo", description: "Spesa settimanale", date: "2025-09-02T15:30:00", amount: 85, type: "expense", color: "#F59E0B" },
    { id: 4, name: "Freelance", category: "Lavoro", description: "Progetto sviluppo web", date: "2025-09-03T14:00:00", amount: 1200, type: "income", color: "#8B5CF6" },
    { id: 5, name: "Netflix", category: "Intrattenimento", description: "Abbonamento mensile", date: "2025-09-05T12:00:00", amount: 15.99, type: "expense", color: "#EF4444", isRecurring: true, recurringInfo: { frequency: 1, duration: "forever" } },
    { id: 6, name: "Benzina", category: "Trasporti", description: "Rifornimento auto", date: "2025-09-06T08:15:00", amount: 65, type: "expense", color: "#F97316" },
    { id: 7, name: "Bonus", category: "Lavoro", description: "Bonus trimestrale", date: "2025-09-07T16:00:00", amount: 500, type: "income", color: "#10B981" },
    { id: 8, name: "Palestra", category: "Salute", description: "Abbonamento mensile", date: "2025-09-08T07:00:00", amount: 45, type: "expense", color: "#06B6D4", isRecurring: true, recurringInfo: { frequency: 1, duration: "1" } },
    { id: 9, name: "Cena Ristorante", category: "Cibo", description: "Cena con amici", date: "2025-09-10T20:30:00", amount: 120, type: "expense", color: "#EC4899" },
    { id: 10, name: "Vendita Oggetti", category: "Altro", description: "Vendita online", date: "2025-09-12T11:00:00", amount: 180, type: "income", color: "#14B8A6" },
  ]);

  const categories = ["Casa", "Lavoro", "Cibo", "Trasporti", "Intrattenimento", "Salute", "Shopping", "Viaggio", "Altro"];

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Casa": "🏠",
      "Lavoro": "💼",
      "Cibo": "🍽️",
      "Trasporti": "🚗",
      "Intrattenimento": "🎬",
      "Salute": "🏥",
      "Shopping": "🛍️",
      "Viaggio": "✈️",
      "Altro": "💰"
    };
    return icons[category] || "💰";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  };

  // Filtri
  const filteredTransactions = transactions.filter((tx) => {
    const matchesTab = activeTab === "all" || 
                      activeTab === tx.type || 
                      (activeTab === "recurring" && tx.isRecurring);
    const matchesSearch = tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tx.category === selectedCategory;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const txDate = new Date(tx.date);
      const now = new Date();
      
      switch (dateFilter) {
        case "today":
          matchesDate = txDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = txDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = txDate >= monthAgo;
          break;
      }
    }

    return matchesTab && matchesSearch && matchesCategory && matchesDate;
  });

  const handleMenuToggle = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    
    if (openMenuId === id) {
      setOpenMenuId(null);
      setMenuCoords(null);
      return;
    }

    const btn = buttonRefs.current.get(id);
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setMenuCoords({ top: rect.bottom + 8, left: rect.right - 160 });
      setOpenMenuId(id);
    }
  };

  const handleEdit = (tx: Transaction) => {
    setModalTransaction(tx);
    setIsModalOpen(true);
    setOpenMenuId(null);
    setMenuCoords(null);
  };

  const handleDelete = (id: number) => {
    const transactionName = transactions.find(tx => tx.id === id)?.name || 'Transazione';
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    setOpenMenuId(null);
    setMenuCoords(null);
    addToast(`"${transactionName}" eliminata con successo`, 'success');
  };

  const handleSave = (tx: Transaction) => {
    const exists = transactions.find(t => t.id === tx.id);
    
    setTransactions(prev => {
      if (exists) {
        return prev.map(t => t.id === tx.id ? tx : t);
      } else {
        return [{ ...tx, id: Date.now() }, ...prev];
      }
    });
    
    if (exists) {
      addToast(`"${tx.name}" aggiornata con successo`, 'success');
    } else {
      addToast(`"${tx.name}" creata con successo`, 'success');
    }
    
    setIsModalOpen(false);
    setModalTransaction(undefined);
  };

  // Statistiche per le tabs
  const allCount = transactions.length;
  const incomeCount = transactions.filter(tx => tx.type === "income").length;
  const expenseCount = transactions.filter(tx => tx.type === "expense").length;
  const recurringCount = transactions.filter(tx => tx.isRecurring).length;

  const totalIncome = transactions.filter(tx => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions.filter(tx => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className={`min-h-screen ${colors.background.primary} ${colors.text.primary} p-3 sm:p-6 transition-colors duration-300`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <div>
          <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r ${colors.accent.primary} bg-clip-text text-transparent`}>
            Transazioni
          </h1>
          <p className={`${colors.text.muted} mt-1 text-sm md:text-base`}>Gestisci le tue entrate e uscite</p>
        </div>
        
        <button
          onClick={() => {
            setModalTransaction(undefined);
            setIsModalOpen(true);
          }}
          className={`flex items-center gap-2 bg-gradient-to-r ${colors.accent.primary} hover:from-indigo-600 hover:via-purple-600 hover:to-teal-500 px-3 md:px-4 py-2 rounded-lg md:rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl text-white text-sm md:text-base`}
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Nuova Transazione
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className={`${colors.background.card} p-3 md:p-4 rounded-lg md:rounded-xl border ${colors.border} backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${colors.text.muted} text-xs md:text-sm`}>Entrate</p>
              <p className={`text-base md:text-lg font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <TrendingUp className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
        </div>
        
        <div className={`${colors.background.card} p-3 md:p-4 rounded-lg md:rounded-xl border ${colors.border} backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${colors.text.muted} text-xs md:text-sm`}>Uscite</p>
              <p className={`text-base md:text-lg font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                {formatCurrency(totalExpense)}
              </p>
            </div>
            <TrendingDown className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
        </div>
        
        <div className={`${colors.background.card} p-3 md:p-4 rounded-lg md:rounded-xl border ${colors.border} backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${colors.text.muted} text-xs md:text-sm`}>Bilancio</p>
              <p className={`text-base md:text-lg font-bold ${totalIncome - totalExpense >= 0 ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                {formatCurrency(totalIncome - totalExpense)}
              </p>
            </div>
            <DollarSign className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
        </div>
        
        <div className={`${colors.background.card} p-3 md:p-4 rounded-lg md:rounded-xl border ${colors.border} backdrop-blur-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${colors.text.muted} text-xs md:text-sm`}>Ricorrenti</p>
              <p className={`text-base md:text-lg font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {recurringCount}
              </p>
            </div>
            <Repeat className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`${colors.background.card} rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6 border ${colors.border} backdrop-blur-sm`}>
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 ${colors.text.muted}`} />
            <input
              type="text"
              placeholder="Cerca transazioni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 md:pl-10 pr-4 py-2 ${colors.background.input} border ${colors.border} rounded-lg ${colors.text.primary} placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm md:text-base`}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-3 md:px-4 py-2 ${colors.background.input} border ${colors.border} rounded-lg ${colors.text.primary} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm md:text-base`}
          >
            <option value="all">Tutte le categorie</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={`px-3 md:px-4 py-2 ${colors.background.input} border ${colors.border} rounded-lg ${colors.text.primary} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm md:text-base`}
          >
            <option value="all">Tutte le date</option>
            <option value="today">Oggi</option>
            <option value="week">Ultima settimana</option>
            <option value="month">Ultimo mese</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
            activeTab === "all" 
              ? "bg-indigo-600 text-white" 
              : `${colors.background.card} ${colors.text.secondary} ${colors.accent.hover} border ${colors.border}`
          }`}
        >
          Tutte ({allCount})
        </button>
        
        <button
          onClick={() => setActiveTab("income")}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
            activeTab === "income" 
              ? `${isDarkMode ? 'bg-emerald-600' : 'bg-emerald-600'} text-white` 
              : `${colors.background.card} ${colors.text.secondary} ${colors.accent.hover} border ${colors.border}`
          }`}
        >
          <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
          Entrate ({incomeCount})
        </button>
        
        <button
          onClick={() => setActiveTab("expense")}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
            activeTab === "expense" 
              ? `${isDarkMode ? 'bg-red-600' : 'bg-red-600'} text-white` 
              : `${colors.background.card} ${colors.text.secondary} ${colors.accent.hover} border ${colors.border}`
          }`}
        >
          <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
          Uscite ({expenseCount})
        </button>
        
        <button
          onClick={() => setActiveTab("recurring")}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
            activeTab === "recurring" 
              ? `${isDarkMode ? 'bg-purple-600' : 'bg-purple-600'} text-white` 
              : `${colors.background.card} ${colors.text.secondary} ${colors.accent.hover} border ${colors.border}`
          }`}
        >
          <Repeat className="w-3 h-3 md:w-4 md:h-4" />
          Ricorrenti ({recurringCount})
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-2 md:space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className={`text-center py-8 md:py-12 ${colors.background.card} rounded-lg md:rounded-xl border ${colors.border} backdrop-blur-sm`}>
            <p className={`${colors.text.muted} text-base md:text-lg`}>Nessuna transazione trovata</p>
            <p className={`${colors.text.subtle} text-sm mt-2`}>Prova a modificare i filtri o aggiungi una nuova transazione</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`${colors.background.card} rounded-lg md:rounded-xl p-3 md:p-4 border ${colors.border} ${colors.accent.hover} transition-all group backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${tx.color}, ${tx.color}cc)` }}
                  >
                    <span className="text-sm md:text-base">{getCategoryIcon(tx.category)}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-sm md:text-base ${colors.text.primary}`}>{tx.name}</h3>
                      {tx.isRecurring && (
                        <Repeat className={`w-3 h-3 md:w-4 md:h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      )}
                    </div>
                    <div className={`flex items-center gap-2 md:gap-3 text-xs md:text-sm ${colors.text.muted}`}>
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span>{formatTime(tx.date)}</span>
                    </div>
                    <p className={`${colors.text.muted} text-xs md:text-sm mt-1`}>{tx.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-right">
                    <div className={`font-bold text-sm md:text-base ${
                      tx.type === "income" 
                        ? (isDarkMode ? "text-emerald-400" : "text-emerald-600")
                        : (isDarkMode ? "text-red-400" : "text-red-600")
                    }`}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </div>
                    {tx.isRecurring && tx.recurringInfo && (
                      <div className={`text-xs ${colors.text.subtle}`}>
                        Ogni {tx.recurringInfo.frequency} {tx.recurringInfo.frequency === 1 ? 'mese' : 'mesi'}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      ref={(el) => {
                        buttonRefs.current.set(tx.id, el);
                      }}
                      onClick={(e) => handleMenuToggle(e, tx.id)}
                      className={`p-1.5 md:p-2 ${colors.text.muted} hover:text-white transition-colors rounded-lg ${colors.accent.hover}`}
                    >
                      <span className="text-lg">⋮</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Context Menu */}
      {openMenuId && menuCoords && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setOpenMenuId(null);
              setMenuCoords(null);
            }}
          />
          <div
            className={`fixed z-50 w-32 md:w-40 ${colors.background.card} border ${colors.border} rounded-lg md:rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm`}
            style={{ top: menuCoords.top, left: menuCoords.left }}
          >
            <button
              onClick={() => {
                const tx = transactions.find(t => t.id === openMenuId);
                if (tx) handleEdit(tx);
              }}
              className={`w-full px-3 md:px-4 py-2 md:py-3 text-left ${colors.accent.hover} transition-colors flex items-center gap-2 text-sm md:text-base`}
            >
              <span className="text-indigo-400">✏️</span>
              Modifica
            </button>
            <button
              onClick={() => {
                const tx = transactions.find(t => t.id === openMenuId);
                if (tx) {
                  const newTx = { 
                    ...tx, 
                    id: Date.now(), 
                    name: tx.name + " (copia)",
                    date: new Date().toISOString()
                  };
                  setTransactions(prev => [newTx, ...prev]);
                  addToast(`"${tx.name}" duplicata con successo`, 'success');
                }
                setOpenMenuId(null);
                setMenuCoords(null);
              }}
              className={`w-full px-3 md:px-4 py-2 md:py-3 text-left ${colors.accent.hover} transition-colors flex items-center gap-2 text-sm md:text-base`}
            >
              <span className="text-purple-400">📋</span>
              Duplica
            </button>
            <button
              onClick={() => {
                if (openMenuId) handleDelete(openMenuId);
              }}
              className={`w-full px-3 md:px-4 py-2 md:py-3 text-left ${colors.accent.hover} transition-colors flex items-center gap-2 text-red-400 text-sm md:text-base`}
            >
              <span>🗑️</span>
              Elimina
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <TransactionModal
          transaction={modalTransaction}
          isNew={!modalTransaction}
          onClose={() => {
            setIsModalOpen(false);
            setModalTransaction(undefined);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default TransactionsPage;