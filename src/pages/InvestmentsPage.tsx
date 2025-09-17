import React, { useState } from "react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target, Plus, Filter, MoreVertical, Trash2, Eye, EyeOff, BarChart3, Edit } from "lucide-react";
import { useToast } from "../context/ToastContext";
import InvestmentModal, { Investment } from "../components/ui/InvestmentModal";

export const InvestmentsPage: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'overview' | 'details'>('overview');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'PAC_ETF' | 'ETF_SINGOLO' | 'AZIONE'>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showValues, setShowValues] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | undefined>();
  
  const { addToast } = useToast();

  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: "1",
      name: "VWCE - Vanguard FTSE All-World",
      type: "PAC_ETF",
      monthlyAmount: 300,
      startDate: "2023-01-01",
      totalMonths: 20,
      totalInvested: 6000,
      currentValue: 6750,
      shares: 75.5,
      avgBuyPrice: 79.47,
      currentPrice: 89.40,
      ytdReturn: 8.2,
      totalReturn: 12.5,
      isin: "IE00BK5BQT80",
      ticker: "VWCE"
    },
    {
      id: "2", 
      name: "SWDA - iShares Core MSCI World",
      type: "PAC_ETF",
      monthlyAmount: 200,
      startDate: "2023-06-01",
      totalMonths: 15,
      totalInvested: 3000,
      currentValue: 3240,
      shares: 42.1,
      avgBuyPrice: 71.26,
      currentPrice: 76.95,
      ytdReturn: 6.8,
      totalReturn: 8.0,
      isin: "IE00B4L5Y983",
      ticker: "SWDA"
    },
    {
      id: "3",
      name: "Tesla Inc",
      type: "AZIONE",
      totalInvested: 2500,
      currentValue: 2180,
      shares: 12,
      avgBuyPrice: 208.33,
      currentPrice: 181.67,
      ytdReturn: -15.2,
      totalReturn: -12.8,
      ticker: "TSLA",
      sector: "Technology"
    },
    {
      id: "4",
      name: "CSPX - iShares Core S&P 500",
      type: "ETF_SINGOLO",
      totalInvested: 1500,
      currentValue: 1680,
      shares: 3.2,
      avgBuyPrice: 468.75,
      currentPrice: 525.00,
      ytdReturn: 11.5,
      totalReturn: 12.0,
      isin: "IE00B5BMR087",
      ticker: "CSPX"
    },
    {
      id: "5",
      name: "Apple Inc",
      type: "AZIONE",
      totalInvested: 1800,
      currentValue: 2150,
      shares: 15,
      avgBuyPrice: 120.00,
      currentPrice: 143.33,
      ytdReturn: 18.5,
      totalReturn: 19.4,
      ticker: "AAPL",
      sector: "Technology"
    },
    {
      id: "6",
      name: "VUSA - Vanguard S&P 500",
      type: "PAC_ETF",
      monthlyAmount: 150,
      startDate: "2024-01-01",
      totalMonths: 9,
      totalInvested: 1350,
      currentValue: 1485,
      shares: 20.8,
      avgBuyPrice: 64.90,
      currentPrice: 71.39,
      ytdReturn: 12.1,
      totalReturn: 10.0,
      isin: "IE00B3XXRP09",
      ticker: "VUSA"
    }
  ]);

  // Performance data per il grafico
  const performanceData = [
    { month: 'Gen', value: 12000 },
    { month: 'Feb', value: 12400 },
    { month: 'Mar', value: 11800 },
    { month: 'Apr', value: 13200 },
    { month: 'Mag', value: 13600 },
    { month: 'Giu', value: 14200 },
    { month: 'Lug', value: 14800 },
    { month: 'Ago', value: 14100 },
    { month: 'Set', value: 15305 },
  ];

  // Handler functions
  const handleAddInvestment = () => {
    setEditingInvestment(undefined);
    setIsModalOpen(true);
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteInvestment = (id: string) => {
    const investment = investments.find(inv => inv.id === id);
    setInvestments(prev => prev.filter(inv => inv.id !== id));
    setOpenMenuId(null);
    addToast(`"${investment?.name}" eliminato con successo`, 'success');
  };

  const handleSaveInvestment = (investment: Investment) => {
    const exists = investments.find(inv => inv.id === investment.id);
    
    setInvestments(prev => {
      if (exists) {
        return prev.map(inv => inv.id === investment.id ? investment : inv);
      } else {
        return [...prev, investment];
      }
    });
    
    if (exists) {
      addToast(`"${investment.name}" aggiornato con successo`, 'success');
    } else {
      addToast(`"${investment.name}" aggiunto con successo`, 'success');
    }
    
    setIsModalOpen(false);
    setEditingInvestment(undefined);
  };

  // Computed values
  const filteredInvestments = selectedFilter === 'all' 
    ? investments 
    : investments.filter(inv => inv.type === selectedFilter);

  const totalInvested = filteredInvestments.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const totalCurrentValue = filteredInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfit = totalCurrentValue - totalInvested;
  const totalReturnPercentage = totalInvested > 0 ? ((totalProfit / totalInvested) * 100) : 0;
  
  const monthlyPACAmount = filteredInvestments
    .filter(inv => inv.type === "PAC_ETF")
    .reduce((sum, inv) => sum + (inv.monthlyAmount || 0), 0);

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getTypeLabel = (type: Investment["type"]) => {
    switch(type) {
      case 'PAC_ETF': return 'PAC ETF';
      case 'ETF_SINGOLO': return 'ETF';
      case 'AZIONE': return 'Azione';
    }
  };

  const getTypeColor = (type: Investment["type"]) => {
    switch(type) {
      case 'PAC_ETF': return 'bg-blue-600';
      case 'ETF_SINGOLO': return 'bg-purple-600';
      case 'AZIONE': return 'bg-orange-600';
    }
  };

  // Chart data
  const pieData = filteredInvestments.map(inv => ({
    name: inv.name.split(' - ')[0] || inv.name,
    value: inv.currentValue,
    color: inv.type === 'PAC_ETF' ? '#3B82F6' : inv.type === 'ETF_SINGOLO' ? '#8B5CF6' : '#F59E0B'
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 border border-gray-600 rounded-xl p-3 shadow-xl">
          <p className="text-gray-300 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white font-medium" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-4 lg:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Portfolio Investimenti
          </h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Gestisci e monitora i tuoi investimenti</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowValues(!showValues)}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {showValues ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
          <button 
            onClick={handleAddInvestment}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-4 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Nuovo Investimento</span>
            <span className="sm:hidden">Nuovo</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
            <div className="text-green-200 text-xs sm:text-sm font-medium">
              {formatPercentage(totalReturnPercentage)}
            </div>
          </div>
          <div>
            <p className="text-green-200 text-xs sm:text-sm">Valore Totale</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              {showValues ? formatCurrency(totalCurrentValue) : "••••••"}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
          </div>
          <div>
            <p className="text-blue-200 text-xs sm:text-sm">Investito</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              {showValues ? formatCurrency(totalInvested) : "••••••"}
            </p>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${totalProfit >= 0 ? 'from-green-600 to-green-700' : 'from-red-600 to-red-700'} p-4 sm:p-6 rounded-2xl shadow-xl`}>
          <div className="flex items-center justify-between mb-2">
            {totalProfit >= 0 ? (
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
            ) : (
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-200" />
            )}
          </div>
          <div>
            <p className={`text-xs sm:text-sm ${totalProfit >= 0 ? 'text-green-200' : 'text-red-200'}`}>P&L Totale</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              {showValues ? formatCurrency(totalProfit) : "••••••"}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
          </div>
          <div>
            <p className="text-purple-200 text-xs sm:text-sm">PAC Mensile</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              {showValues ? formatCurrency(monthlyPACAmount) : "••••••"}
            </p>
            <p className="text-purple-200 text-xs mt-1">
              {investments.filter(inv => inv.type === "PAC_ETF").length} attivi
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setSelectedView('overview')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition flex-1 sm:flex-initial ${
              selectedView === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Panoramica
          </button>
          <button 
            onClick={() => setSelectedView('details')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition flex-1 sm:flex-initial ${
              selectedView === 'details' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Dettagli
          </button>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm transition ${
              selectedFilter === 'all' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Tutti ({investments.length})
          </button>
          <button
            onClick={() => setSelectedFilter('PAC_ETF')}
            className={`px-3 py-2 rounded-lg text-sm transition ${
              selectedFilter === 'PAC_ETF' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            PAC ({investments.filter(i => i.type === 'PAC_ETF').length})
          </button>
          <button
            onClick={() => setSelectedFilter('ETF_SINGOLO')}
            className={`px-3 py-2 rounded-lg text-sm transition ${
              selectedFilter === 'ETF_SINGOLO' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            ETF ({investments.filter(i => i.type === 'ETF_SINGOLO').length})
          </button>
          <button
            onClick={() => setSelectedFilter('AZIONE')}
            className={`px-3 py-2 rounded-lg text-sm transition ${
              selectedFilter === 'AZIONE' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Azioni ({investments.filter(i => i.type === 'AZIONE').length})
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Performance Chart */}
        <div className="xl:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-green-400" />
            <h3 className="text-xl sm:text-2xl font-bold">Performance Portfolio</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Valore Portfolio" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Allocation */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl sm:text-2xl font-bold">Asset Allocation</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Investments List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredInvestments.map((investment) => {
          const isProfit = investment.totalReturn >= 0;
          
          return (
            <div key={investment.id} className="bg-gray-800 p-4 sm:p-5 rounded-xl hover:bg-gray-750 transition border border-gray-700 relative">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                
                {/* Info principale */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(investment.type)} text-white`}>
                        {getTypeLabel(investment.type)}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold">{investment.name}</h3>
                      {investment.ticker && (
                        <span className="text-gray-400 text-sm">${investment.ticker}</span>
                      )}
                    </div>
                    
                    {/* Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === investment.id ? null : investment.id)}
                        className="p-1 text-gray-400 hover:text-white transition-colors rounded"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openMenuId === investment.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute top-8 right-0 z-50 w-40 bg-gray-700 border border-gray-600 rounded-lg shadow-xl">
                            <button
                              onClick={() => handleEditInvestment(investment)}
                              className="w-full px-4 py-2 text-left text-blue-400 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Modifica
                            </button>
                            <button
                              onClick={() => handleDeleteInvestment(investment.id)}
                              className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Elimina
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {selectedView === 'details' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-500">Investito:</span><br />
                        <span className="font-medium">{showValues ? formatCurrency(investment.totalInvested) : "••••••"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Valore Attuale:</span><br />
                        <span className="font-medium">{showValues ? formatCurrency(investment.currentValue) : "••••••"}</span>
                      </div>
                      {investment.shares && (
                        <div>
                          <span className="text-gray-500">Quantità:</span><br />
                          <span className="font-medium">{investment.shares.toFixed(2)}</span>
                        </div>
                      )}
                      {investment.avgBuyPrice && investment.currentPrice && (
                        <div>
                          <span className="text-gray-500">Prezzo Medio/Attuale:</span><br />
                          <span className="font-medium">
                            {showValues ? `${formatCurrency(investment.avgBuyPrice)} / ${formatCurrency(investment.currentPrice)}` : "•••• / ••••"}
                          </span>
                        </div>
                      )}
                      
                      {/* Informazioni specifiche per PAC */}
                      {investment.type === "PAC_ETF" && investment.monthlyAmount && (
                        <>
                          <div>
                            <span className="text-gray-500">Importo Mensile:</span><br />
                            <span className="font-medium text-blue-400">{showValues ? formatCurrency(investment.monthlyAmount) : "••••••"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Mesi Attivi:</span><br />
                            <span className="font-medium">{investment.totalMonths}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Performance */}
                <div className="flex flex-row lg:flex-col justify-between lg:justify-start items-start lg:items-end gap-1 border-t lg:border-t-0 lg:border-l border-gray-700 pt-3 lg:pt-0 lg:pl-4">
                  <div className="lg:text-right">
                    <div className={`text-lg sm:text-xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercentage(investment.totalReturn)}
                    </div>
                    <div className={`text-sm ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      {showValues ? formatCurrency(investment.currentValue - investment.totalInvested) : "••••••"}
                    </div>
                  </div>
                  {investment.ytdReturn && (
                    <div className="text-xs text-gray-400 lg:text-right">
                      YTD: {formatPercentage(investment.ytdReturn)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <InvestmentModal
          investment={editingInvestment}
          isNew={!editingInvestment}
          onClose={() => {
            setIsModalOpen(false);
            setEditingInvestment(undefined);
          }}
          onSave={handleSaveInvestment}
        />
      )}
    </div>
  );
};