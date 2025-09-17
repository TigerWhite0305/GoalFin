import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, Plus, Calendar, TrendingUp, TrendingDown, Repeat, X, CheckCircle2, DollarSign, Type, FileText, Clock } from "lucide-react";
import { useToast } from "../context/ToastContext";
import TransactionModal from '../components/transactions/TransactionModal';

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
    <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tutte le Transazioni
          </h1>
          <p className="text-gray-400 mt-1">Gestisci tutte le tue entrate e uscite</p>
        </div>
        
        <button
          onClick={() => {
            setModalTransaction(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Nuova Transazione
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Entrate Totali</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Uscite Totali</p>
              <p className="text-xl font-bold text-red-400">{formatCurrency(totalExpense)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Bilancio</p>
              <p className={`text-xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(totalIncome - totalExpense)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ricorrenti</p>
              <p className="text-xl font-bold text-purple-400">{recurringCount}</p>
            </div>
            <Repeat className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca transazioni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="all">Tutte le categorie</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="all">Tutte le date</option>
            <option value="today">Oggi</option>
            <option value="week">Ultima settimana</option>
            <option value="month">Ultimo mese</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "all" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
          }`}
        >
          Tutte ({allCount})
        </button>
        
        <button
          onClick={() => setActiveTab("income")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "income" 
              ? "bg-green-600 text-white" 
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Entrate ({incomeCount})
        </button>
        
        <button
          onClick={() => setActiveTab("expense")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "expense" 
              ? "bg-red-600 text-white" 
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Uscite ({expenseCount})
        </button>
        
        <button
          onClick={() => setActiveTab("recurring")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "recurring" 
              ? "bg-purple-600 text-white" 
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
          }`}
        >
          <Repeat className="w-4 h-4" />
          Ricorrenti ({recurringCount})
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-lg">Nessuna transazione trovata</p>
            <p className="text-gray-500 text-sm mt-2">Prova a modificare i filtri o aggiungi una nuova transazione</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${tx.color}, ${tx.color}cc)` }}
                  >
                    <span className="text-xl">{getCategoryIcon(tx.category)}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{tx.name}</h3>
                      {tx.isRecurring && (
                        <Repeat className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span>{formatTime(tx.date)}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{tx.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`font-bold text-lg ${
                      tx.type === "income" ? "text-green-400" : "text-red-400"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </div>
                    {tx.isRecurring && tx.recurringInfo && (
                      <div className="text-xs text-gray-400">
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
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                    >
                      <span className="text-xl">⋮</span>
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
            className="fixed z-50 w-40 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl overflow-hidden"
            style={{ top: menuCoords.top, left: menuCoords.left }}
          >
            <button
              onClick={() => {
                const tx = transactions.find(t => t.id === openMenuId);
                if (tx) handleEdit(tx);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <span className="text-blue-400">✏️</span>
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
              className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <span className="text-purple-400">📋</span>
              Duplica
            </button>
            <button
              onClick={() => {
                if (openMenuId) handleDelete(openMenuId);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center gap-2 text-red-400"
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