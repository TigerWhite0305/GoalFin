import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, DollarSign, Type, FileText, Clock, Plus, Calendar, Repeat } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Transaction } from '../../pages/Transactions';

interface TransactionModalProps {
  transaction?: Transaction;
  isNew: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  transaction, 
  isNew, 
  onClose, 
  onSave 
}) => {
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

  const { isDarkMode } = useTheme();

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

  // Theme colors - seguendo il nostro design system
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: "bg-gray-900",
        card: "bg-gray-800/50",
        input: "bg-gray-800/50 border-gray-700/50",
        text: {
          primary: "text-gray-50",
          secondary: "text-gray-300",
          muted: "text-gray-400"
        },
        border: "border-gray-700/50",
        accent: "from-indigo-500 to-purple-600",
        backdrop: "bg-gray-900/80"
      };
    } else {
      return {
        background: "bg-white",
        card: "bg-gray-50/50",
        input: "bg-white border-gray-200",
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-700",
          muted: "text-gray-600"
        },
        border: "border-gray-200",
        accent: "from-indigo-500 to-purple-600", 
        backdrop: "bg-gray-900/40"
      };
    }
  };

  const theme = getThemeColors();

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

    onSave(newTx);
  };

  const handleCategorySelect = (cat: any) => {
    setCategory(cat.name);
    setSelectedColor(cat.color);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentCategories = categoryOptions[type];

  return (
    <div 
      className={`fixed inset-0 ${theme.backdrop} backdrop-blur-sm flex items-center justify-center z-[200] p-4`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`${theme.background} border ${theme.border} rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${theme.border} flex-shrink-0`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${theme.accent} flex items-center justify-center`}>
              {isNew ? <Plus className="w-5 h-5 text-white" /> : <FileText className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className={`${theme.text.primary} text-lg font-bold`}>
                {isNew ? "Nuova" : "Modifica"} Transazione
              </h2>
              <p className={`${theme.text.muted} text-sm hidden sm:block`}>
                {isNew ? "Aggiungi una nuova transazione" : "Modifica i dettagli"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 hover:${theme.card} rounded-lg ${theme.text.muted} hover:${theme.text.primary} transition-all`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          
          {/* Type Toggle */}
          <div className="flex flex-col gap-2">
            <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
              <DollarSign className={`w-4 h-4 ${theme.text.muted}`} />
              Tipo Transazione
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 p-3 rounded-lg transition-all text-sm font-medium ${
                  type === "expense" 
                    ? "bg-red-500/20 border-2 border-red-500/50 text-red-600" 
                    : `${theme.card} border-2 ${theme.border} ${theme.text.muted} hover:border-gray-400`
                }`}
              >
                💸 Uscita
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 p-3 rounded-lg transition-all text-sm font-medium ${
                  type === "income" 
                    ? "bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-600" 
                    : `${theme.card} border-2 ${theme.border} ${theme.text.muted} hover:border-gray-400`
                }`}
              >
                💰 Entrata
              </button>
            </div>
          </div>

          {/* Nome */}
          <div className="flex flex-col gap-2">
            <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
              <Type className={`w-4 h-4 ${theme.text.muted}`} />
              Nome
            </label>
            <input
              className={`p-3 rounded-lg ${theme.input} ${theme.text.primary} text-sm placeholder-gray-400 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
              placeholder="Es. Spesa supermercato"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-2">
            <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
              <div 
                className={`w-4 h-4 rounded-full border-2 ${isDarkMode ? 'border-white/20' : 'border-gray-300'}`}
                style={{ backgroundColor: selectedColor }}
              />
              Categoria
            </label>
            <div className="grid grid-cols-4 gap-2">
              {currentCategories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                    category === cat.name
                      ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-600"
                      : `${theme.border} ${theme.card} ${theme.text.secondary} hover:border-gray-400`
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-xs font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Importo e Data */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
                <DollarSign className={`w-4 h-4 ${theme.text.muted}`} />
                Importo (€)
              </label>
              <input
                type="number"
                step="0.01"
                className={`p-3 rounded-lg ${theme.input} ${theme.text.primary} text-sm placeholder-gray-400 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                placeholder="0.00"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
                <Calendar className={`w-4 h-4 ${theme.text.muted}`} />
                Data e Ora
              </label>
              <input
                type="datetime-local"
                className={`p-3 rounded-lg ${theme.input} ${theme.text.primary} text-sm focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Descrizione */}
          <div className="flex flex-col gap-2">
            <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
              <FileText className={`w-4 h-4 ${theme.text.muted}`} />
              Descrizione (Opzionale)
            </label>
            <textarea
              className={`p-3 rounded-lg ${theme.input} ${theme.text.primary} text-sm placeholder-gray-400 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none`}
              placeholder="Dettagli aggiuntivi"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Checkbox pagamento ricorrente */}
          <div className={`flex items-center gap-3 p-3 ${theme.card} rounded-lg`}>
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
            />
            <label htmlFor="recurring" className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
              <Repeat className={`w-4 h-4 ${theme.text.muted}`} />
              Pagamento ricorrente
            </label>
          </div>

          {/* Opzioni ricorrenza */}
          {isRecurring && (
            <div className={`space-y-3 p-3 ${theme.card} rounded-lg border ${theme.border}`}>
              <div className={`flex items-center gap-2 text-indigo-600`}>
                <Clock className="w-4 h-4" />
                <span className="font-medium text-sm">Impostazioni ricorrenza</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={`${theme.text.secondary} font-medium text-sm`}>Frequenza</label>
                  <select
                    className={`p-2 rounded-lg ${theme.input} ${theme.text.primary} text-sm focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
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
                <div className="flex flex-col gap-1">
                  <label className={`${theme.text.secondary} font-medium text-sm`}>Durata</label>
                  <select
                    className={`p-2 rounded-lg ${theme.input} ${theme.text.primary} text-sm focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
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

        {/* Footer */}
        <div className={`p-4 border-t ${theme.border} flex-shrink-0`}>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg ${theme.card} border ${theme.border} ${theme.text.secondary} font-medium hover:${theme.text.primary} transition-all`}
              onClick={onClose}
            >
              Annulla
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg bg-gradient-to-r ${theme.accent} text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50`}
              onClick={handleSubmit}
              disabled={!name.trim() || !amount}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isNew ? "Crea" : "Aggiorna"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;