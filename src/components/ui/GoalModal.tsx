import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Target, Calendar, Euro, FileText, Plus, TrendingUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

type GoalPriority = "alta" | "media" | "bassa";
type GoalCategory = "viaggio" | "tecnologia" | "emergenze" | "casa" | "auto" | "altro";

export type Goal = {
  id: string;
  name: string;
  current: number;
  target: number;
  deadline?: string;
  priority: GoalPriority;
  category: GoalCategory;
  monthlyContribution?: number;
  description?: string;
  isCompleted?: boolean;
};

interface GoalModalProps {
  goal?: Goal;
  isNew: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
}

const GoalModal: React.FC<GoalModalProps> = ({ 
  goal, 
  isNew, 
  onClose, 
  onSave 
}) => {
  const [name, setName] = useState(goal?.name ?? "");
  const [target, setTarget] = useState(goal?.target ?? 0);
  const [current, setCurrent] = useState(goal?.current ?? 0);
  const [deadline, setDeadline] = useState(goal?.deadline ?? "");
  const [priority, setPriority] = useState<GoalPriority>(goal?.priority ?? "media");
  const [category, setCategory] = useState<GoalCategory>(goal?.category ?? "altro");
  const [monthlyContribution, setMonthlyContribution] = useState(goal?.monthlyContribution ?? 0);
  const [description, setDescription] = useState(goal?.description ?? "");

  const { isDarkMode } = useTheme();

  const categoryOptions = [
    { name: "viaggio", icon: "✈️", label: "Viaggio" },
    { name: "tecnologia", icon: "💻", label: "Tecnologia" },
    { name: "emergenze", icon: "🛡️", label: "Emergenze" },
    { name: "casa", icon: "🏠", label: "Casa" },
    { name: "auto", icon: "🚗", label: "Auto" },
    { name: "altro", icon: "🎯", label: "Altro" },
  ] as const;

  const priorityOptions = [
    { value: "alta", label: "Alta", color: "text-red-600" },
    { value: "media", label: "Media", color: "text-amber-600" },
    { value: "bassa", label: "Bassa", color: "text-emerald-600" },
  ] as const;

  // Theme colors - seguendo il nostro design system
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro
        background: {
          primary: "bg-gray-900", // #0A0B0F
          card: "bg-gray-800", // #161920
          secondary: "bg-gray-700", // #1F2937
          input: "bg-gray-800/50"
        },
        text: {
          primary: "text-gray-50", // #F9FAFB
          secondary: "text-gray-300", // #D1D5DB
          muted: "text-gray-400", // #6B7280
          placeholder: "placeholder-gray-400"
        },
        border: "border-gray-700/50",
        accent: "from-indigo-500 to-purple-600",
        backdrop: "bg-gray-900/80"
      };
    } else {
      return {
        // ☀️ Tema Chiaro
        background: {
          primary: "bg-white", // #FEFEFE
          card: "bg-gray-50", // #F8FAFC
          secondary: "bg-gray-100", // #F1F5F9
          input: "bg-white"
        },
        text: {
          primary: "text-gray-900", // #0F172A
          secondary: "text-gray-700", // #334155
          muted: "text-gray-600", // #64748B
          placeholder: "placeholder-gray-400"
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
    
    if (!name.trim() || target <= 0) {
      return;
    }
    
    const newGoal: Goal = {
      id: isNew ? Date.now().toString() : goal!.id,
      name,
      target,
      current,
      deadline: deadline || undefined,
      priority,
      category,
      monthlyContribution: monthlyContribution || undefined,
      description: description || undefined,
      isCompleted: current >= target,
    };

    onSave(newGoal);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 ${theme.backdrop} backdrop-blur-sm flex items-center justify-center z-[200] p-4`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`${theme.background.primary} border ${theme.border} rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${theme.border} flex-shrink-0`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${theme.accent} flex items-center justify-center shadow-lg`}>
              {isNew ? <Plus className="w-5 h-5 text-white" /> : <Target className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className={`${theme.text.primary} text-lg font-bold`}>
                {isNew ? "Nuovo" : "Modifica"} Obiettivo
              </h2>
              <p className={`${theme.text.muted} text-sm mt-0.5`}>
                {isNew ? "Crea un nuovo obiettivo di risparmio" : "Modifica il tuo obiettivo"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 hover:${theme.background.secondary} rounded-lg ${theme.text.muted} hover:${theme.text.primary} transition-all`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          
          {/* Nome Obiettivo */}
          <div className="flex flex-col gap-2">
            <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
              <Target className="w-4 h-4 text-indigo-600" />
              Nome Obiettivo
            </label>
            <input
              className={`p-3 rounded-lg ${theme.background.input} border ${theme.border} ${theme.text.primary} text-sm ${theme.text.placeholder} focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
              placeholder="Es. Vacanza in Giappone"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-2">
            <label className={`${theme.text.primary} font-medium text-sm`}>Categoria</label>
            <div className="grid grid-cols-3 gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1.5 ${
                    category === cat.name 
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25" 
                      : `${theme.background.input} ${theme.border} ${theme.text.secondary} hover:${theme.background.secondary} hover:border-indigo-300`
                  }`}
                  onClick={() => setCategory(cat.name)}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Importo obiettivo e corrente */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Obiettivo (€)
              </label>
              <input
                type="number"
                step="0.01"
                className={`p-3 rounded-lg ${theme.background.input} border ${theme.border} ${theme.text.primary} text-sm ${theme.text.placeholder} focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                placeholder="5000"
                value={target || ""}
                onChange={(e) => setTarget(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
                <Euro className="w-4 h-4 text-indigo-600" />
                Attuale (€)
              </label>
              <input
                type="number"
                step="0.01"
                className={`p-3 rounded-lg ${theme.background.input} border ${theme.border} ${theme.text.primary} text-sm ${theme.text.placeholder} focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                placeholder="1500"
                value={current || ""}
                onChange={(e) => setCurrent(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Contributo mensile e Priorità */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
                <Calendar className="w-4 h-4 text-amber-600" />
                Mensile (€)
              </label>
              <input
                type="number"
                step="0.01"
                className={`p-3 rounded-lg ${theme.background.input} border ${theme.border} ${theme.text.primary} text-sm ${theme.text.placeholder} focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                placeholder="300"
                value={monthlyContribution || ""}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${theme.text.primary} font-medium text-sm`}>Priorità</label>
              <select
                className={`p-3 rounded-lg ${theme.background.input} border ${theme.border} ${theme.text.primary} text-sm focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                value={priority}
                onChange={(e) => setPriority(e.target.value as GoalPriority)}
              >
                {priorityOptions.map((p) => (
                  <option key={p.value} value={p.value} className={`${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Data scadenza */}
          <div className="flex flex-col gap-2">
            <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
              <Calendar className="w-4 h-4 text-purple-600" />
              Scadenza (Opzionale)
            </label>
            <input
              type="date"
              className={`p-3 rounded-lg ${theme.background.input} border ${theme.border} ${theme.text.primary} text-sm focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Descrizione */}
          <div className="flex flex-col gap-2">
            <label className={`${theme.text.primary} font-medium text-sm flex items-center gap-2`}>
              <FileText className="w-4 h-4 text-teal-600" />
              Descrizione (Opzionale)
            </label>
            <textarea
              className={`p-3 rounded-lg ${theme.background.input} border ${theme.border} ${theme.text.primary} text-sm ${theme.text.placeholder} focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none`}
              placeholder="Dettagli sul tuo obiettivo..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${theme.border} flex-shrink-0`}>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg ${theme.background.secondary} border ${theme.border} ${theme.text.secondary} font-medium hover:${theme.text.primary} transition-all`}
              onClick={onClose}
            >
              Annulla
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg bg-gradient-to-r ${theme.accent} text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={handleSubmit}
              disabled={!name.trim() || target <= 0}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isNew ? "Crea Obiettivo" : "Aggiorna Obiettivo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;