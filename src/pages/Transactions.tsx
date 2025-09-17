import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, Plus, Calendar, TrendingUp, TrendingDown, Repeat, X, CheckCircle2, DollarSign, Type, FileText, Clock } from "lucide-react";
import { useToast } from "../context/ToastContext";


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

  // Funzione delete aggiornata con toast
  const handleDelete = (id: number) => {
    const transactionName = transactions.find(tx => tx.id === id)?.name || 'Transazione';
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    setOpenMenuId(null);
    setMenuCoords(null);
    addToast(`"${transactionName}" eliminata con successo`, 'success');
  };

  // Funzione save aggiornata con toast
  const handleSave = (tx: Transaction) => {
    const exists = transactions.find(t => t.id === tx.id);
    
    setTransactions(prev => {
      if (exists) {
        return prev.map(t => t.id === tx.id ? tx : t);
      } else {
        return [{ ...tx, id: Date.now() }, ...prev];
      }
    });
    
    // Toast fuori dal setter
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
          {/* Search */}
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

          {/* Category Filter */}
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

          {/* Date Filter */}
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
                  {/* Category Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${tx.color}, ${tx.color}cc)` }}
                  >
                    <span className="text-xl">{getCategoryIcon(tx.category)}</span>
                  </div>

                  {/* Transaction Info */}
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
                  {/* Amount */}
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

                  {/* Actions */}
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
            {/* Bottone Duplica aggiornato con toast */}
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

// Modal Component rimane uguale
const TransactionModal: React.FC<{
  transaction?: Transaction;
  isNew: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
}> = ({ transaction, isNew, onClose, onSave }) => {
  const [name, setName] = useState(transaction?.name ?? "");
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [date, setDate] = useState(transaction?.date ?? new Date().toISOString().slice(0, 16));
  const [amount, setAmount] = useState(transaction?.amount ?? 0);
  const [type, setType] = useState<Transaction["type"]>(transaction?.type ?? "expense");
  const [selectedColor, setSelectedColor] = useState(transaction?.color ?? "#6366f1");
  const [isRecurring, setIsRecurring] = useState(transaction?.isRecurring ?? false);
  const [frequency, setFrequency] = useState(transaction?.recurringInfo?.frequency ?? 1);
  const [duration, setDuration] = useState<string>(transaction?.recurringInfo?.duration ?? "1");

  const categoryOptions = {
    expense: [
      { name: "Casa", icon: "🏠", color: "#4C6FFF" },
      { name: "Cibo", icon: "🍽️", color: "#FF6B6B" },
      { name: "Trasporti", icon: "🚗", color: "#FFD93D" },
      { name: "Intrattenimento", icon: "🎬", color: "#6BCB77" },
      { name: "Salute", icon: "🏥", color: "#FF9F1C" },
      { name: "Shopping", icon: "🛍️", color: "#9B5DE5" },
      { name: "Viaggio", icon: "✈️", color: "#06D6A0" },
      { name: "Altro", icon: "💰", color: "#8B5CF6" },
    ],
    income: [
      { name: "Lavoro", icon: "💼", color: "#16A34A" },
      { name: "Freelance", icon: "💻", color: "#8B5CF6" },
      { name: "Investimenti", icon: "📈", color: "#06B6D4" },
      { name: "Bonus", icon: "🎯", color: "#F59E0B" },
      { name: "Vendite", icon: "🛒", color: "#10B981" },
      { name: "Altro", icon: "💰", color: "#6366F1" },
    ]
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }
    
    const newTx: Transaction = {
      id: isNew ? Date.now() : transaction!.id,
      name,
      category,
      description,
      date,
      amount,
      type,
      color: selectedColor,
      isRecurring,
      recurringInfo: isRecurring ? { frequency, duration } : undefined,
    };

    onSave(newTx); // Solo questo, il toast è già in handleSave
  };

  const handleCategorySelect = (cat: any) => {
    setCategory(cat.name);
    setSelectedColor(cat.color);
  };

  const currentCategories = categoryOptions[type];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              {isNew ? <Plus className="w-6 h-6 text-white" /> : <FileText className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-white text-xl sm:text-2xl font-bold">
                {isNew ? "Nuova" : "Modifica"} Transazione
              </h2>
              <p className="text-slate-400 text-sm hidden sm:block">
                {isNew ? "Aggiungi una nuova transazione" : "Modifica i dettagli della transazione"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Type Toggle */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-slate-400" />
              Tipo Transazione
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 p-4 rounded-xl transition-all ${
                  type === "expense" 
                    ? "bg-red-500/20 border-2 border-red-500/50 text-red-300" 
                    : "bg-slate-800/50 border-2 border-slate-700/50 text-slate-400 hover:border-slate-600"
                }`}
              >
                <span className="font-medium">💸 Uscita</span>
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 p-4 rounded-xl transition-all ${
                  type === "income" 
                    ? "bg-green-500/20 border-2 border-green-500/50 text-green-300" 
                    : "bg-slate-800/50 border-2 border-slate-700/50 text-slate-400 hover:border-slate-600"
                }`}
              >
                <span className="font-medium">💰 Entrata</span>
              </button>
            </div>
          </div>

          {/* Nome */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold flex items-center gap-2">
              <Type className="w-5 h-5 text-slate-400" />
              Nome
            </label>
            <input
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Es. Spesa supermercato"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full border-2 border-white/20"
                style={{ backgroundColor: selectedColor }}
              />
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {currentCategories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    category === cat.name
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                      : "border-slate-700/50 bg-slate-800/30 text-slate-300 hover:border-slate-600 hover:bg-slate-700/50"
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Importo e Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-slate-400" />
                Importo (€)
              </label>
              <input
                type="number"
                step="0.01"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="0.00"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                Data e Ora
              </label>
              <input
                type="datetime-local"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Descrizione */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Descrizione
            </label>
            <textarea
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              placeholder="Dettagli aggiuntivi (opzionale)"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Checkbox pagamento ricorrente */}
          <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl">
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="recurring" className="text-white font-medium flex items-center gap-2">
              <Repeat className="w-5 h-5 text-slate-400" />
              Pagamento ricorrente
            </label>
          </div>

          {/* Opzioni ricorrenza */}
          {isRecurring && (
            <div className="space-y-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-blue-300">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Impostazioni ricorrenza</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-300 font-medium">Frequenza</label>
                  <select
                    className="p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                  >
                    <option value={1}>Ogni mese</option>
                    <option value={2}>Ogni 2 mesi</option>
                    <option value={3}>Ogni 3 mesi</option>
                    <option value={6}>Ogni 6 mesi</option>
                    <option value={12}>Ogni anno</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-slate-300 font-medium">Durata</label>
                  <select
                    className="p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="1">1 anno</option>
                    <option value="2">2 anni</option>
                    <option value="5">5 anni</option>
                    <option value="forever">Indefinita</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con bottoni fisso in basso */}
        <div className="p-4 sm:p-6 border-t border-slate-700/50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-slate-300 font-semibold hover:bg-slate-600/50 hover:text-white transition-all"
              onClick={onClose}
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
              onClick={handleSubmit}
            >
              <CheckCircle2 className="w-5 h-5" />
              {isNew ? "Crea Transazione" : "Aggiorna"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;