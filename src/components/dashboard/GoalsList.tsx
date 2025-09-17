import React, { useState } from "react";
import { Target, Calendar, TrendingUp, CheckCircle, Clock, Euro, Plus, Edit, Trash2, DollarSign, Maximize2, X, Filter } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import GoalModal, { Goal } from "../transactions/GoalModal";

interface GoalsProps {
  dashboardMode?: boolean;
}

export const Goals: React.FC<GoalsProps> = ({ dashboardMode = true }) => {
  const [selectedFilter, setSelectedFilter] = useState<'tutti' | 'attivi' | 'completati'>('attivi');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();
  
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
      case 'alta': return 'bg-red-600';
      case 'media': return 'bg-yellow-600'; 
      case 'bassa': return 'bg-green-600';
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
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Funzioni per gestire le azioni con toast
  const handleAddGoal = () => {
    setEditingGoal(undefined);
    setIsModalOpen(true);
    // Se siamo in fullscreen, chiudiamo prima
    if (isFullscreenOpen) {
      setIsFullscreenOpen(false);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
    // Se siamo in fullscreen, chiudiamo prima
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
    
    // Assicurati che isCompleted sia aggiornato
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
            isCompleted: (goal.current + amount) >= goal.target // Aggiorna isCompleted
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

  // Goals da mostrare: se dashboard mode, solo 2
  const displayGoals = dashboardMode ? filteredGoals.slice(0, 2) : filteredGoals;
  const hiddenGoalsCount = dashboardMode ? Math.max(0, filteredGoals.length - 2) : 0;

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
    const remaining = goal.target - goal.current;
    const monthsToDeadline = goal.deadline ? getMonthsToDeadline(goal.deadline) : null;
    const neededMonthly = goal.deadline && remaining > 0 && monthsToDeadline && monthsToDeadline > 0 
      ? remaining / monthsToDeadline 
      : null;

    return (
      <div className={`bg-gray-800 p-4 sm:p-5 rounded-xl border-l-4 ${
        goal.isCompleted ? 'border-green-500' : 'border-blue-500'
      } hover:bg-gray-750 transition`}>
        
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          
          {/* Info principale */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap flex-1">
                <span className="text-xl sm:text-2xl">{getCategoryIcon(goal.category)}</span>
                <h3 className="text-lg sm:text-xl font-semibold">{goal.name}</h3>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)} text-white`}>
                  {goal.priority}
                </span>
                
                {goal.isCompleted && (
                  <span className="flex items-center gap-1 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Completato</span>
                    <span className="sm:hidden">✓</span>
                  </span>
                )}

                {/* Menu azioni - SEMPRE VISIBILI */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg"
                    title="Modifica"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg"
                    title="Elimina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAddContribution(goal.id, 100)}
                    className="p-2 text-gray-400 hover:text-green-400 transition-colors rounded-lg"
                    title="Aggiungi €100"
                  >
                    <DollarSign className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {goal.description && (
              <p className="text-gray-400 text-sm mb-3">{goal.description}</p>
            )}

            {/* Barra di progresso */}
            <div className="w-full h-2 sm:h-3 bg-gray-700 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getProgressColor(percentage)}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Dettagli finanziari */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-500 text-xs sm:text-sm">Risparmiato:</span>
                <div className="font-semibold text-green-400">{formatCurrency(goal.current)}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs sm:text-sm">Obiettivo:</span>
                <div className="font-semibold">{formatCurrency(goal.target)}</div>
              </div>
              {!goal.isCompleted && (
                <div>
                  <span className="text-gray-500 text-xs sm:text-sm">Mancano:</span>
                  <div className="font-semibold text-orange-400">{formatCurrency(remaining)}</div>
                </div>
              )}
              {goal.monthlyContribution && !goal.isCompleted && (
                <div>
                  <span className="text-gray-500 text-xs sm:text-sm">Mensile:</span>
                  <div className="font-semibold text-blue-400">{formatCurrency(goal.monthlyContribution)}</div>
                </div>
              )}
            </div>

            {/* Info temporali */}
            {goal.deadline && !goal.isCompleted && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Scadenza: {formatDate(goal.deadline)}</span>
                  <span className="sm:hidden">{formatDate(goal.deadline)}</span>
                </div>
                {monthsToDeadline && monthsToDeadline > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{monthsToDeadline} mesi rimasti</span>
                  </div>
                )}
                {neededMonthly && (
                  <div className={`font-medium ${
                    neededMonthly > (goal.monthlyContribution || 0) * 1.2 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    <span className="hidden sm:inline">Servono: </span>{formatCurrency(neededMonthly)}/mese
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Percentuale grande */}
          <div className="flex flex-row xl:flex-col justify-between xl:justify-start items-center xl:items-end border-t xl:border-t-0 xl:border-l border-gray-700 pt-3 xl:pt-0 xl:pl-4">
            <div className={`text-2xl sm:text-3xl font-bold ${
              goal.isCompleted ? 'text-green-400' : 
              percentage >= 75 ? 'text-blue-400' : 
              percentage >= 50 ? 'text-yellow-400' : 'text-orange-400'
            }`}>
              {percentage}%
            </div>
            {!goal.isCompleted && goal.deadline && monthsToDeadline !== null && (
              <div className={`text-sm xl:text-right ${monthsToDeadline <= 3 ? 'text-red-400' : 'text-gray-400'}`}>
                {monthsToDeadline <= 0 ? 'Scaduto!' : `${monthsToDeadline} mesi`}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isFullscreenOpen) {
    return (
      <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-screen p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header fullscreen */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Tutti gli Obiettivi
                </h1>
                <p className="text-gray-400 mt-1">Gestisci tutti i tuoi obiettivi di risparmio</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleAddGoal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Nuovo Obiettivo
                </button>
                <button
                  onClick={() => setIsFullscreenOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Filtri */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedFilter("tutti")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter === "tutti" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                Tutti ({goals.length})
              </button>
              <button
                onClick={() => setSelectedFilter("attivi")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter === "attivi" 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Attivi ({goals.filter(g => !g.isCompleted).length})
              </button>
              <button
                onClick={() => setSelectedFilter("completati")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter === "completati" 
                    ? "bg-purple-600 text-white" 
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Completati ({goals.filter(g => g.isCompleted).length})
              </button>
            </div>

            {/* Lista obiettivi */}
            <div className="space-y-4">
              {filteredGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-3 sm:p-4 lg:p-6 rounded-2xl shadow-2xl h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <Target className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
          <span className="hidden sm:inline">Obiettivi Finanziari</span>
          <span className="sm:hidden">Obiettivi</span>
        </h2>
        <button 
          onClick={handleAddGoal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-medium transition flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Nuovo Obiettivo</span>
          <span className="sm:hidden">Nuovo</span>
        </button>
      </div>

      {/* Lista obiettivi (limitata) */}
      <div className="space-y-3 sm:space-y-4">
        {displayGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {/* Bottone "Vedi tutti" se siamo in dashboard mode e ci sono goals nascosti */}
      {dashboardMode && hiddenGoalsCount > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsFullscreenOpen(true)}
            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 mx-auto transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
            Vedi tutti i {goals.length} obiettivi
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <GoalModal
          goal={editingGoal}
          isNew={!editingGoal}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGoal(undefined);
          }}
          onSave={handleSaveGoal}
        />
      )}
    </div>
  );
};