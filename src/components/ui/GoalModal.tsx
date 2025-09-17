import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Target, Calendar, Euro, FileText, Plus } from "lucide-react";

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

  const categoryOptions = [
    { name: "viaggio", icon: "✈️", label: "Viaggio" },
    { name: "tecnologia", icon: "💻", label: "Tecnologia" },
    { name: "emergenze", icon: "🛡️", label: "Emergenze" },
    { name: "casa", icon: "🏠", label: "Casa" },
    { name: "auto", icon: "🚗", label: "Auto" },
    { name: "altro", icon: "🎯", label: "Altro" },
  ] as const;

  const priorityOptions = [
    { value: "alta", label: "Alta", color: "bg-red-500" },
    { value: "media", label: "Media", color: "bg-yellow-500" },
    { value: "bassa", label: "Bassa", color: "bg-green-500" },
  ] as const;

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

  

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              {isNew ? <Plus className="w-6 h-6 text-white" /> : <Target className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold">
                {isNew ? "Nuovo" : "Modifica"} Obiettivo
              </h2>
              <p className="text-slate-400 text-sm">
                {isNew ? "Crea un nuovo obiettivo di risparmio" : "Modifica il tuo obiettivo"}
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

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Nome */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-slate-400" />
              Nome Obiettivo
            </label>
            <input
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Es. Vacanza in Giappone"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold">Categoria</label>
            <div className="grid grid-cols-3 gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name as GoalCategory)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    category === cat.name
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                      : "border-slate-700/50 bg-slate-800/30 text-slate-300 hover:border-slate-600 hover:bg-slate-700/50"
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Importi */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold flex items-center gap-2">
                <Euro className="w-5 h-5 text-slate-400" />
                Importo Obiettivo (€)
              </label>
              <input
                type="number"
                step="0.01"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="5000"
                value={target || ""}
                onChange={(e) => setTarget(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold flex items-center gap-2">
                <Euro className="w-5 h-5 text-slate-400" />
                Importo Attuale (€)
              </label>
              <input
                type="number"
                step="0.01"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="0"
                value={current || ""}
                onChange={(e) => setCurrent(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Contributo mensile e priorità */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">Contributo Mensile (€)</label>
              <input
                type="number"
                step="0.01"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="300"
                value={monthlyContribution || ""}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">Priorità</label>
              <select
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={priority}
                onChange={(e) => setPriority(e.target.value as GoalPriority)}
              >
                {priorityOptions.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Data scadenza */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              Scadenza (Opzionale)
            </label>
            <input
              type="date"
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Descrizione */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Descrizione (Opzionale)
            </label>
            <textarea
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              placeholder="Dettagli sul tuo obiettivo..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 flex-shrink-0">
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
              {isNew ? "Crea Obiettivo" : "Aggiorna"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;