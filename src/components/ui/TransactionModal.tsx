import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, DollarSign, Type, FileText, Clock, Plus, Calendar, Repeat } from "lucide-react";
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

    onSave(newTx);
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

        {/* Footer */}
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

export default TransactionModal;