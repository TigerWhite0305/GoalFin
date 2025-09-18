import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Target, Calendar, TrendingUp, CheckCircle, Clock, Euro, Plus, Edit, Trash2, DollarSign, Maximize2, X, Filter } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import GoalModal, { Goal } from "../ui/GoalModal";

interface GoalsProps {
  dashboardMode?: boolean;
}

export const Goals: React.FC<GoalsProps> = ({ dashboardMode = true }) => {
  const [selectedFilter, setSelectedFilter] = useState<'tutti' | 'attivi' | 'completati'>('attivi');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();
  const { isDarkMode } = useTheme();
  // Theme viene dal ThemeContext - rimuovo stato locale
  
  // Hook per i toast
  const { addToast } = useToast();

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "Vacanza in Giappone",
      current: 3800,
      target: 4500,
      deadline: "2025-11-15",
      priority: "alta",
      category: "viaggio",
      monthlyContribution: 300,
      description: "Viaggio di 2 settimane Tokyo-Kyoto"
    },
    {
      id: "2", 
      name: "MacBook Pro M4",
      current: 1650,
      target: 2500,
      deadline: "2025-03-01",
      priority: "bassa",
      category: "tecnologia",
      monthlyContribution: 200,
      description: "Upgrade per lavoro freelance"
    },
    {
      id: "3", 
      name: "Fondo Emergenza",
      current: 2200,
      target: 5000,
      deadline: "2025-12-31",
      priority: "alta",
      category: "emergenze",
      monthlyContribution: 250,
      description: "Fondo per imprevisti e sicurezza finanziaria"
    }
  ]);

  // Theme colors - seguendo il nostro design system
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro
        background: {
          primary: "bg-gray-900", // #0A0B0F
          card: "bg-gray-800", // #161920
          secondary: "bg-gray-700" // #1F2937
        },
        text: {
          primary: "text-gray-50", // #F9FAFB
          secondary: "text-gray-300", // #D1D5DB
          muted: "text-gray-400", // #6B7280
          subtle: "text-gray-500" // #9CA3AF
        },
        accent: {
          primary: "text-indigo-400 bg-indigo-600", // #6366F1
          secondary: "text-emerald-400 bg-emerald-600", // #10B981
          accent: "text-amber-400 bg-amber-600" // #F59E0B
        },
        status: {
          success: "text-emerald-400 bg-emerald-600", // #059669
          error: "text-red-400 bg-red-600", // #DC2626
          warning: "text-amber-400 bg-amber-600", // #D97706
          info: "text-blue-400 bg-blue-600" // #0284C7
        },
        border: "border-gray-700",
        hover: "hover:bg-gray-750"
      };
    } else {
      return {
        // ☀️ Tema Chiaro
        background: {
          primary: "bg-white", // #FEFEFE
          card: "bg-gray-50", // #F8FAFC
          secondary: "bg-gray-100" // #F1F5F9
        },
        text: {
          primary: "text-gray-900", // #0F172A
          secondary: "text-gray-700", // #334155
          muted: "text-gray-600", // #64748B
          subtle: "text-gray-500"
        },
        accent: {
          primary: "text-indigo-700 bg-indigo-600", // #6366F1
          secondary: "text-emerald-700 bg-emerald-600", // #10B981
          accent: "text-amber-700 bg-amber-600" // #F59E0B
        },
        status: {
          success: "text-emerald-700 bg-emerald-600", // #059669
          error: "text-red-700 bg-red-600", // #DC2626
          warning: "text-amber-700 bg-amber-600", // #D97706
          info: "text-blue-700 bg-blue-600" // #0284C7
        },
        border: "border-gray-200",
        hover: "hover:bg-gray-100"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      month: 'short',
      year: 'numeric'
    });
  };

  const getMonthsToDeadline = (deadline: string) => {
    const now = new Date();
    const target = new Date(deadline);
    const months = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months;
  };

  const getPriorityColor = (priority: Goal["priority"]) => {
    switch(priority) {
      case 'alta': return 'bg-red-600 text-white';
      case 'media': return 'bg-amber-500 text-white'; 
      case 'bassa': return 'bg-emerald-600 text-white';
    }
  };

  const getCategoryIcon = (category: Goal["category"]) => {
    switch(category) {
      case 'viaggio': return '✈️';
      case 'tecnologia': return '💻';
      case 'emergenze': return '🛡️';
      case 'casa': return '🏠';
      case 'auto': return '🚗';
      case 'altro': return '🎯';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-emerald-500';
    if (percentage >= 75) return 'bg-indigo-500';
    if (percentage >= 50) return 'bg-amber-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Funzioni per gestire le azioni con toast
  const handleAddGoal = () => {
    setEditingGoal(undefined);
    setIsModalOpen(true);
    if (isFullscreenOpen) {
      setIsFullscreenOpen(false);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
    if (isFullscreenOpen) {
      setIsFullscreenOpen(false);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    setGoals(prev => prev.filter(g => g.id !== goalId));
    addToast(`Obiettivo "${goal?.name}" eliminato con successo`, 'success');
  };

  const handleSaveGoal = (goal: Goal) => {
    const exists = goals.find(g => g.id === goal.id);
    
    const updatedGoal = {
      ...goal,
      isCompleted: goal.current >= goal.target
    };
    
    setGoals(prev => {
      if (exists) {
        return prev.map(g => g.id === goal.id ? updatedGoal : g);
      } else {
        return [...prev, updatedGoal];
      }
    });
    
    if (exists) {
      addToast(`Obiettivo "${goal.name}" aggiornato con successo`, 'success');
    } else {
      addToast(`Obiettivo "${goal.name}" creato con successo`, 'success');
    }
    
    setIsModalOpen(false);
    setEditingGoal(undefined);
  };

  const handleAddContribution = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            current: Math.min(goal.current + amount, goal.target),
            isCompleted: (goal.current + amount) >= goal.target
          }
        : goal
    ));
    const goal = goals.find(g => g.id === goalId);
    addToast(`Aggiunto €${amount} a "${goal?.name}"`, 'success');
  };

  const filteredGoals = goals.filter(goal => {
    if (selectedFilter === 'completati') return goal.isCompleted;
    if (selectedFilter === 'attivi') return !goal.isCompleted;
    return true;
  });

  const displayGoals = dashboardMode ? filteredGoals.slice(0, 1) : filteredGoals;
  const hiddenGoalsCount = dashboardMode ? Math.max(0, filteredGoals.length - 1) : 0;

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
    const remaining = goal.target - goal.current;
    const monthsToDeadline = goal.deadline ? getMonthsToDeadline(goal.deadline) : null;
    const neededMonthly = goal.deadline && remaining > 0 && monthsToDeadline && monthsToDeadline > 0 
      ? remaining / monthsToDeadline 
      : null;

    return (
      <div className={`${theme.background.card} p-6 rounded-xl border-l-4 ${
        goal.isCompleted ? 'border-emerald-500' : 'border-indigo-500'
      } ${theme.hover} transition-all duration-300 ${theme.border}`}>
        
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          
          {/* Info principale */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xl">{getCategoryIcon(goal.category)}</span>
                <h3 className={`text-lg font-semibold ${theme.text.primary}`}>{goal.name}</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </span>
                
                {goal.isCompleted && (
                  <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Completato</span>
                    <span className="sm:hidden">✓</span>
                  </span>
                )}

                {/* Menu azioni */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className={`p-2 ${theme.text.muted} hover:text-indigo-600 transition-colors rounded-lg`}
                    title="Modifica"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className={`p-2 ${theme.text.muted} hover:text-red-600 transition-colors rounded-lg`}
                    title="Elimina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAddContribution(goal.id, 100)}
                    className={`p-2 ${theme.text.muted} hover:text-emerald-600 transition-colors rounded-lg`}
                    title="Aggiungi €100"
                  >
                    <DollarSign className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {goal.description && (
              <p className={`${theme.text.muted} text-sm mb-3`}>{goal.description}</p>
            )}

            {/* Barra di progresso */}
            <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden mb-3`}>
              <div
                className={`h-full rounded-full transition-all duration-700 ${getProgressColor(percentage)}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Dettagli finanziari - Font Size secondo Design System */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div>
                <span className={`${theme.text.muted} text-xs`}>Risparmiato:</span>
                <div className="font-semibold text-emerald-600">{formatCurrency(goal.current)}</div>
              </div>
              <div>
                <span className={`${theme.text.muted} text-xs`}>Obiettivo:</span>
                <div className={`font-semibold ${theme.text.secondary}`}>{formatCurrency(goal.target)}</div>
              </div>
              {!goal.isCompleted && (
                <div>
                  <span className={`${theme.text.muted} text-xs`}>Mancano:</span>
                  <div className="font-semibold text-amber-600">{formatCurrency(remaining)}</div>
                </div>
              )}
              {goal.monthlyContribution && !goal.isCompleted && (
                <div>
                  <span className={`${theme.text.muted} text-xs`}>Mensile:</span>
                  <div className="font-semibold text-indigo-600">{formatCurrency(goal.monthlyContribution)}</div>
                </div>
              )}
            </div>

            {/* Info temporali */}
            {goal.deadline && !goal.isCompleted && (
              <div className={`flex flex-col sm:flex-row sm:items-center gap-2 mt-3 text-sm ${theme.text.secondary}`}>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Scadenza: {formatDate(goal.deadline)}</span>
                  <span className="sm:hidden">{formatDate(goal.deadline)}</span>
                </div>
                {monthsToDeadline && monthsToDeadline > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{monthsToDeadline} mesi rimasti</span>
                  </div>
                )}
                {neededMonthly && (
                  <div className={`font-medium ${
                    neededMonthly > (goal.monthlyContribution || 0) * 1.2 ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    <span className="hidden sm:inline">Servono: </span>{formatCurrency(neededMonthly)}/mese
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Percentuale grande */}
          <div className={`flex flex-row xl:flex-col justify-between xl:justify-start items-center xl:items-end border-t xl:border-t-0 xl:border-l ${theme.border} pt-3 xl:pt-0 xl:pl-4`}>
            <div className={`text-2xl font-bold ${
              goal.isCompleted ? 'text-emerald-600' : 
              percentage >= 75 ? 'text-indigo-600' : 
              percentage >= 50 ? 'text-amber-600' : 'text-orange-600'
            }`}>
              {percentage}%
            </div>
            {!goal.isCompleted && goal.deadline && monthsToDeadline !== null && (
              <div className={`text-sm xl:text-right ${monthsToDeadline <= 3 ? 'text-red-600' : theme.text.muted}`}>
                {monthsToDeadline <= 0 ? 'Scaduto!' : `${monthsToDeadline} mesi`}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isFullscreenOpen) {
    return createPortal(
      <div className={`fixed inset-0 ${isDarkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'} backdrop-blur-sm z-[100] overflow-y-auto`}>
        <div className="min-h-screen p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header fullscreen */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-400 bg-clip-text text-transparent">
                  Tutti gli Obiettivi
                </h1>
                <p className={`${theme.text.muted} mt-1 text-sm`}>Gestisci tutti i tuoi obiettivi di risparmio</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleAddGoal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Nuovo Obiettivo
                </button>
                <button
                  onClick={() => setIsFullscreenOpen(false)}
                  className={`p-2 ${theme.text.muted} hover:${theme.text.primary} transition-colors rounded-lg`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filtri */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedFilter("tutti")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                  selectedFilter === "tutti" 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" 
                    : `${theme.background.card} ${theme.text.secondary} ${theme.hover} ${theme.border} border`
                }`}
              >
                Tutti ({goals.length})
              </button>
              <button
                onClick={() => setSelectedFilter("attivi")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                  selectedFilter === "attivi" 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25" 
                    : `${theme.background.card} ${theme.text.secondary} ${theme.hover} ${theme.border} border`
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Attivi ({goals.filter(g => !g.isCompleted).length})
              </button>
              <button
                onClick={() => setSelectedFilter("completati")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                  selectedFilter === "completati" 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25" 
                    : `${theme.background.card} ${theme.text.secondary} ${theme.hover} ${theme.border} border`
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Completati ({goals.filter(g => g.isCompleted).length})
              </button>
            </div>

            {/* Lista obiettivi */}
            <div className="space-y-3">
              {filteredGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div className={`${theme.background.primary} p-4 lg:p-6 rounded-2xl shadow-2xl h-full`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-3">
        <div className="flex items-center gap-3">
          <h2 className={`text-xl lg:text-2xl font-bold flex items-center gap-3 ${theme.text.primary}`}>
            <Target className="w-6 lg:w-7 h-6 lg:h-7 text-indigo-600" />
            <span className="hidden sm:inline">Obiettivi Finanziari</span>
            <span className="sm:hidden">Obiettivi</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAddGoal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 lg:w-5 h-4 lg:h-5" />
            <span className="hidden sm:inline">Nuovo Obiettivo</span>
            <span className="sm:hidden">Nuovo</span>
          </button>
        </div>
      </div>

      {/* Lista obiettivi (limitata) */}
      <div className="space-y-3 lg:space-y-4">
        {displayGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {/* Bottone "Vedi tutti" */}
      {dashboardMode && hiddenGoalsCount > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsFullscreenOpen(true)}
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 mx-auto transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
            Vedi tutti i {goals.length} obiettivi
          </button>
        </div>
      )}

      {/* Modal - Renderizzato con Portal */}
      {isModalOpen && createPortal(
        <GoalModal
          goal={editingGoal}
          isNew={!editingGoal}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGoal(undefined);
          }}
          onSave={handleSaveGoal}
        />,
        document.body
      )}
    </div>
  );
};