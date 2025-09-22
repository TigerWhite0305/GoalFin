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

  // ✅ THEME COLORS - Design System
  const getThemeColors = () => ({
    background: {
      primary: isDarkMode ? "bg-[#0A0B0F]" : "bg-[#FEFEFE]",
      card: isDarkMode ? "bg-[#161920]" : "bg-[#F8FAFC]", 
      secondary: isDarkMode ? "bg-[#1F2937]" : "bg-[#F1F5F9]"
    },
    text: {
      primary: isDarkMode ? "text-[#F9FAFB]" : "text-[#0F172A]",
      secondary: isDarkMode ? "text-[#D1D5DB]" : "text-[#334155]", 
      muted: isDarkMode ? "text-[#6B7280]" : "text-[#64748B]"
    },
    border: isDarkMode ? "border-[#374151]" : "border-[#E2E8F0]",
    hover: isDarkMode ? "hover:bg-[#1F2937]" : "hover:bg-[#F1F5F9]"
  });

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
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme.background.secondary}`}>
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:from-[#5B5BF7] hover:to-[#7C3AED] transition-all font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Acquista</span>
            </button>
            
            <button
              onClick={() => {
                setEditingPac(undefined);
                setIsPacModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-lg hover:from-[#059669] hover:to-[#047857] transition-all font-medium"
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
          <div className={`${theme.background.card} rounded-xl p-4 border ${theme.border}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-lg">
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

          <div className={`${theme.background.card} rounded-xl p-4 border ${theme.border}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-lg">
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

          <div className={`${theme.background.card} rounded-xl p-4 border ${theme.border}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-lg">
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

          <div className={`${theme.background.card} rounded-xl p-4 border ${theme.border}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#EF4444] to-[#DC2626] rounded-lg">
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
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
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
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
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
              className={`px-3 py-2 rounded-lg ${theme.background.secondary} ${theme.text.primary} border ${theme.border}`}
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
              <div key={investment.id} className={`${theme.background.card} rounded-xl p-4 border ${theme.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${theme.text.primary} font-semibold`}>{investment.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${theme.background.secondary} ${theme.text.muted}`}>
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
                          investment.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'
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
                <div key={pac.id} className={`${theme.background.card} rounded-xl p-4 border ${theme.border}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`${theme.text.primary} font-medium`}>{pac.name}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExecutePAC(pac.id)}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Esegui versamento"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePausePAC(pac.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                        title="Pausa PAC"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPac(pac);
                          setIsPacModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
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
                  <div key={pac.id} className={`${theme.background.card} rounded-xl p-4 border ${theme.border} opacity-75`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`${theme.text.primary} font-medium`}>{pac.name}</h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResumePAC(pac.id)}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Riprendi PAC"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePACPlan(pac.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
          <div className={`${theme.background.card} rounded-xl p-6 border ${theme.border}`}>
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
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="h-full bg-indigo-500 rounded-full" 
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
                      diversificationAnalysis.level === 'EXCELLENT' ? 'text-green-600' :
                      diversificationAnalysis.level === 'GOOD' ? 'text-blue-600' :
                      diversificationAnalysis.level === 'FAIR' ? 'text-yellow-600' : 'text-red-600'
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
            <div className={`${theme.background.card} rounded-xl p-6 border ${theme.border}`}>
              <h3 className={`${theme.text.primary} text-lg font-semibold mb-4`}>Suggerimenti Ribilanciamento</h3>
              <div className="space-y-3">
                {rebalancingAnalysis.suggestions
                  .filter(s => s.action !== 'HOLD')
                  .map(suggestion => (
                  <div key={suggestion.assetClass} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
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