import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Plus, Filter, BarChart3, PieChart, History, Wallet, Target, Play, Pause, Trash2, Edit } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

// ✅ IMPORT CORRETTI - Nuovi hooks e utils
import { useInvestmentData } from "../hooks/useInvestmentData";
import { useRealTimePrices } from "../hooks/useRealTimePrices";
import { usePortfolioCalculations } from "../hooks/usePortfolioCalculations";

// ✅ IMPORT CORRETTI - Types e utils
import { 
  Investment, 
  PACPlan, 
  AssetClass, 
  InvestmentType,
  ASSET_CLASS_LABELS,
  INVESTMENT_TYPE_LABELS 
} from "../utils/AssetTypes";
import { 
  formatCurrency, 
  formatPercentage, 
  formatDate 
} from "../utils/InvestmentUtils";

// ✅ IMPORT CORRETTI - Components (percorso aggiornato)
import PACSetupModal from "../components/Investments/PACSetupModal";
import InvestmentModal from "../components/Investments/InvestmentModal"; // ✅ NUOVO

export const InvestmentsPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { addToast } = useToast();
  
  // ✅ UTILIZZO HOOKS - State management
  const {
    investments,
    transactions,
    pacPlans,
    portfolio,
    loading,
    filteredInvestments,
    addInvestment,
    createPACPlan,
    updatePACPlan,
    pausePACPlan,
    resumePACPlan,
    deletePACPlan,
    executePACPayment
  } = useInvestmentData();

  // ✅ UTILIZZO HOOKS - Real-time prices
  const {
    subscribeTo,
    getPriceForSymbol,
    isMarketOpen,
    marketStatus,
    isConnected
  } = useRealTimePrices();

  // ✅ UTILIZZO HOOKS - Portfolio calculations
  const {
    analytics,
    rebalancingAnalysis,
    diversificationAnalysis,
    calculating
  } = usePortfolioCalculations(investments, transactions, pacPlans);

  // Local state per UI
  const [selectedTab, setSelectedTab] = useState<'investments' | 'pac' | 'analytics'>('investments');
  const [filterAssetClass, setFilterAssetClass] = useState<AssetClass | 'ALL'>('ALL');
  const [isPacModalOpen, setIsPacModalOpen] = useState(false);
  const [editingPac, setEditingPac] = useState<PACPlan | undefined>();
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false); // ✅ NUOVO
  const [editingInvestment, setEditingInvestment] = useState<Investment | undefined>(); // ✅ NUOVO

  // ✅ THEME COLORS - Design System GoalFin Corretto
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro (Design System GoalFin)
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
          subtle: "text-gray-500" // #9CA3AF
        },
        colors: {
          indigo: "#6366F1", // Accent Primary: #6366F1
          emerald: "#10B981", // Accent Secondary: #10B981
          amber: "#F59E0B", // Accent: #F59E0B
          success: "#059669", // Success: #059669
          error: "#DC2626", // Error: #DC2626
          warning: "#D97706", // Warning: #D97706
          info: "#0284C7" // Info: #0284C7
        },
        border: "border-gray-700/30",
        hover: "hover:bg-gray-700/40"
      };
    } else {
      return {
        // ☀️ Tema Chiaro  
        background: {
          primary: "bg-white", // #FEFEFE
          card: "bg-gray-50/60", // #F8FAFC
          secondary: "bg-gray-100", // #F1F5F9
          input: "bg-white/80"
        },
        text: {
          primary: "text-gray-900", // #0F172A
          secondary: "text-gray-700", // #334155
          muted: "text-gray-600", // #64748B
          subtle: "text-gray-500" // #94A3B8
        },
        colors: {
          indigo: "#6366F1",
          emerald: "#10B981", 
          amber: "#F59E0B",
          success: "#059669",
          error: "#DC2626",
          warning: "#D97706",
          info: "#0284C7"
        },
        border: "border-gray-200/50",
        hover: "hover:bg-gray-100/50"
      };
    }
  };

  const theme = getThemeColors();

  // ✅ EFFETTI - Subscribe to price updates
  useEffect(() => {
    if (investments.length > 0) {
      const symbols = investments.map(inv => inv.symbol);
      subscribeTo(symbols);
    }
  }, [investments, subscribeTo]);

  // ✅ HANDLERS
  const handlePacSave = async (pac: PACPlan) => {
    // Assegna investmentId se non presente (per PAC nuovi)
    if (!pac.investmentId && pac.investmentSymbol) {
      const matchingInvestment = investments.find(inv => inv.symbol === pac.investmentSymbol);
      if (matchingInvestment) {
        pac.investmentId = matchingInvestment.id;
      }
    }
    
    const success = await createPACPlan(pac);
    if (success) {
      setIsPacModalOpen(false);
      setEditingPac(undefined);
    }
  };

  const handleInvestmentSave = async (investment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => { // ✅ NUOVO
    const success = await addInvestment(investment);
    if (success) {
      setIsInvestmentModalOpen(false);
      setEditingInvestment(undefined);
    }
  };

  const handleExecutePAC = async (planId: string) => {
    await executePACPayment(planId);
  };

  const handlePausePAC = async (planId: string) => {
    await pausePACPlan(planId);
  };

  const handleResumePAC = async (planId: string) => {
    await resumePACPlan(planId);
  };

  // ✅ FILTERED DATA
  const displayedInvestments = filterAssetClass === 'ALL' 
    ? filteredInvestments 
    : filteredInvestments.filter(inv => inv.assetClass === filterAssetClass);

  const activePacPlans = pacPlans.filter(pac => pac.isActive && !pac.isPaused);
  const pausedPacPlans = pacPlans.filter(pac => pac.isPaused);

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.background.primary} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={theme.text.muted}>Caricamento investimenti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background.primary} p-4 md:p-6`}>
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${theme.text.primary}`}>
              Investimenti
            </h1>
            <p className={`${theme.text.muted} text-sm md:text-base mt-1`}>
              Gestisci il tuo portafoglio e piani di accumulo
            </p>
          </div>

          {/* Market Status & Actions */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme.background.secondary} border ${theme.border}`}>
              <div className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`${theme.text.muted} text-sm`}>
                {marketStatus.isOpen ? 'Mercati Aperti' : 'Mercati Chiusi'}
              </span>
            </div>
            
            <button
              onClick={() => {
                setEditingInvestment(undefined);
                setIsInvestmentModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all font-medium shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Acquista</span>
            </button>
            
            <button
              onClick={() => {
                setEditingPac(undefined);
                setIsPacModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all font-medium shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuovo PAC</span>
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`${theme.background.card} rounded-xl p-4 border ${theme.border} backdrop-blur-sm`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`${theme.text.muted} text-sm`}>Valore Totale</p>
                <p className={`${theme.text.primary} text-lg font-semibold`}>
                  {formatCurrency(analytics.totalValue)}
                </p>
              </div>
            </div>
          </div>

          <div className={`${theme.background.card} rounded-xl p-4 border ${theme.border} backdrop-blur-sm`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`${theme.text.muted} text-sm`}>Rendimento Totale</p>
                <p className={`${theme.text.primary} text-lg font-semibold`}>
                  {formatPercentage(analytics.totalReturnPercent)}
                </p>
              </div>
            </div>
          </div>

          <div className={`${theme.background.card} rounded-xl p-4 border ${theme.border} backdrop-blur-sm`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`${theme.text.muted} text-sm`}>PAC Attivi</p>
                <p className={`${theme.text.primary} text-lg font-semibold`}>
                  {activePacPlans.length}
                </p>
              </div>
            </div>
          </div>

          <div className={`${theme.background.card} rounded-xl p-4 border ${theme.border} backdrop-blur-sm`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`${theme.text.muted} text-sm`}>Rischio Portfolio</p>
                <p className={`${theme.text.primary} text-lg font-semibold`}>
                  {analytics.riskLevel}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={`flex gap-1 mb-6 p-1 ${theme.background.secondary} rounded-lg border ${theme.border}`}>
        {[
          { key: 'investments', label: 'Investimenti', icon: TrendingUp },
          { key: 'pac', label: 'Piani PAC', icon: Target },
          { key: 'analytics', label: 'Analytics', icon: BarChart3 }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSelectedTab(key as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              selectedTab === key
                ? `${theme.background.card} text-indigo-500 shadow-sm border ${theme.border}`
                : `${theme.text.muted} ${theme.hover}`
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'investments' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterAssetClass}
              onChange={(e) => setFilterAssetClass(e.target.value as any)}
              className={`px-3 py-2 rounded-lg ${theme.background.input} ${theme.text.primary} border ${theme.border} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            >
              <option value="ALL">Tutte le Asset Class</option>
              {Object.values(AssetClass).map(assetClass => (
                <option key={assetClass} value={assetClass}>
                  {ASSET_CLASS_LABELS[assetClass]}
                </option>
              ))}
            </select>
          </div>

          {/* Investments List */}
          <div className="grid gap-4">
            {displayedInvestments.map(investment => (
              <div key={investment.id} className={`${theme.background.card} rounded-xl p-4 border ${theme.border} backdrop-blur-sm ${theme.hover} transition-all`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${theme.text.primary} font-semibold`}>{investment.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${theme.background.secondary} ${theme.text.muted} border ${theme.border}`}>
                        {investment.symbol}
                      </span>
                      {isMarketOpen(investment.symbol) && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-500">Live</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className={`${theme.text.muted} text-xs`}>Valore Corrente</p>
                        <p className={`${theme.text.primary} font-medium`}>
                          {formatCurrency(investment.currentValue)}
                        </p>
                      </div>
                      <div>
                        <p className={`${theme.text.muted} text-xs`}>Rendimento</p>
                        <p className={`font-medium ${
                          investment.totalReturnPercent >= 0 ? 'text-emerald-500' : 'text-red-500'
                        }`}>
                          {formatPercentage(investment.totalReturnPercent)}
                        </p>
                      </div>
                      <div>
                        <p className={`${theme.text.muted} text-xs`}>Prezzo</p>
                        <p className={`${theme.text.primary} font-medium`}>
                          {formatCurrency(investment.currentPrice, investment.currency)}
                        </p>
                      </div>
                      <div>
                        <p className={`${theme.text.muted} text-xs`}>Azioni</p>
                        <p className={`${theme.text.primary} font-medium`}>
                          {investment.shares.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'pac' && (
        <div className="space-y-6">
          {/* Active PACs */}
          <div>
            <h3 className={`${theme.text.primary} text-lg font-semibold mb-4`}>PAC Attivi</h3>
            <div className="grid gap-4">
              {activePacPlans.map(pac => (
                <div key={pac.id} className={`${theme.background.card} rounded-xl p-4 border ${theme.border} backdrop-blur-sm`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`${theme.text.primary} font-medium`}>{pac.name}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExecutePAC(pac.id)}
                        className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Esegui versamento"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePausePAC(pac.id)}
                        className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                        title="Pausa PAC"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPac(pac);
                          setIsPacModalOpen(true);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Modifica PAC"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className={`${theme.text.muted} text-xs`}>Importo Mensile</p>
                      <p className={`${theme.text.primary} font-medium`}>
                        {formatCurrency(pac.monthlyAmount)}
                      </p>
                    </div>
                    <div>
                      <p className={`${theme.text.muted} text-xs`}>Totale Investito</p>
                      <p className={`${theme.text.primary} font-medium`}>
                        {formatCurrency(pac.totalInvested)}
                      </p>
                    </div>
                    <div>
                      <p className={`${theme.text.muted} text-xs`}>Valore Corrente</p>
                      <p className={`${theme.text.primary} font-medium`}>
                        {formatCurrency(pac.currentValue)}
                      </p>
                    </div>
                    <div>
                      <p className={`${theme.text.muted} text-xs`}>Prossimo Versamento</p>
                      <p className={`${theme.text.primary} font-medium`}>
                        {formatDate(pac.nextPaymentDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paused PACs */}
          {pausedPacPlans.length > 0 && (
            <div>
              <h3 className={`${theme.text.primary} text-lg font-semibold mb-4`}>PAC in Pausa</h3>
              <div className="grid gap-4">
                {pausedPacPlans.map(pac => (
                  <div key={pac.id} className={`${theme.background.card} rounded-xl p-4 border ${theme.border} backdrop-blur-sm opacity-75`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`${theme.text.primary} font-medium`}>{pac.name}</h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResumePAC(pac.id)}
                          className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="Riprendi PAC"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePACPlan(pac.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Elimina PAC"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className={`${theme.text.muted} text-sm`}>
                      PAC in pausa - {formatCurrency(pac.totalInvested)} investiti
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* Portfolio Analytics */}
          <div className={`${theme.background.card} rounded-xl p-6 border ${theme.border} backdrop-blur-sm`}>
            <h3 className={`${theme.text.primary} text-lg font-semibold mb-4`}>Analisi Portfolio</h3>
            
            {/* Asset Allocation */}
            <div className="mb-6">
              <h4 className={`${theme.text.secondary} text-base font-medium mb-3`}>Allocazione Asset</h4>
              <div className="space-y-2">
                {analytics.assetAllocation.map(allocation => (
                  <div key={allocation.assetClass} className="flex items-center justify-between">
                    <span className={`${theme.text.primary} text-sm`}>
                      {ASSET_CLASS_LABELS[allocation.assetClass]}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`w-20 h-2 ${theme.background.secondary} rounded-full`}>
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                          style={{ width: `${allocation.percentage}%` }}
                        />
                      </div>
                      <span className={`${theme.text.muted} text-sm w-12 text-right`}>
                        {allocation.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Analysis */}
            {diversificationAnalysis && (
              <div>
                <h4 className={`${theme.text.secondary} text-base font-medium mb-3`}>Analisi Diversificazione</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={`${theme.text.muted} text-sm mb-1`}>Score Diversificazione</p>
                    <p className={`${theme.text.primary} text-2xl font-bold`}>
                      {diversificationAnalysis.score}/100
                    </p>
                    <p className={`text-sm ${
                      diversificationAnalysis.level === 'EXCELLENT' ? 'text-emerald-500' :
                      diversificationAnalysis.level === 'GOOD' ? 'text-blue-500' :
                      diversificationAnalysis.level === 'FAIR' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {diversificationAnalysis.level}
                    </p>
                  </div>
                  
                  <div>
                    <p className={`${theme.text.muted} text-sm mb-2`}>Raccomandazioni</p>
                    <ul className="space-y-1">
                      {diversificationAnalysis.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className={`${theme.text.primary} text-xs`}>
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rebalancing Analysis */}
          {rebalancingAnalysis && rebalancingAnalysis.needsRebalancing && (
            <div className={`${theme.background.card} rounded-xl p-6 border ${theme.border} backdrop-blur-sm`}>
              <h3 className={`${theme.text.primary} text-lg font-semibold mb-4`}>Suggerimenti Ribilanciamento</h3>
              <div className="space-y-3">
                {rebalancingAnalysis.suggestions
                  .filter(s => s.action !== 'HOLD')
                  .map(suggestion => (
                  <div key={suggestion.assetClass} className={`flex items-center justify-between p-3 ${
                    isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                  } rounded-lg`}>
                    <div>
                      <p className={`${theme.text.primary} font-medium`}>
                        {ASSET_CLASS_LABELS[suggestion.assetClass]}
                      </p>
                      <p className={`${theme.text.muted} text-sm`}>
                        {suggestion.action === 'BUY' ? 'Aumenta' : 'Riduci'} di {formatPercentage(Math.abs(suggestion.deviation))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`${theme.text.primary} font-medium`}>
                        {formatCurrency(suggestion.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Investment Modal */}
      {isInvestmentModalOpen && (
        <InvestmentModal
          investment={editingInvestment}
          isNew={!editingInvestment}
          onClose={() => {
            setIsInvestmentModalOpen(false);
            setEditingInvestment(undefined);
          }}
          onSave={handleInvestmentSave}
        />
      )}

      {/* PAC Setup Modal */}
      {isPacModalOpen && (
        <PACSetupModal
          pac={editingPac}
          isNew={!editingPac}
          onClose={() => {
            setIsPacModalOpen(false);
            setEditingPac(undefined);
          }}
          onSave={handlePacSave}
        />
      )}
    </div>
  );
};