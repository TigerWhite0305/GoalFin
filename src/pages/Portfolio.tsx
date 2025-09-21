import React, { useState } from "react";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Wallet, CreditCard, PiggyBank, TrendingUp, TrendingDown, Eye, EyeOff, ArrowUpRight, ArrowDownRight, Plus, History, DollarSign, Building, Landmark, MoreVertical, Edit, Trash2, ArrowLeftRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import AccountModal, { Account } from "../components/ui/AccountModal";
import TransferModal from "../components/ui/TransferModal";
import BalanceAdjustModal from "../components/ui/BalanceAdjustModal";

const Portfolio: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { addToast } = useToast();

  // States
  const [showBalance, setShowBalance] = useState(true);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isBalanceAdjustModalOpen, setIsBalanceAdjustModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();
  const [adjustingAccount, setAdjustingAccount] = useState<Account | undefined>();

  // Accounts data with GoalFin colors
  const [accounts, setAccounts] = useState<Account[]>([
    { 
      id: 1, 
      name: "Conto Corrente Principale", 
      type: "checking", 
      bank: "UniCredit", 
      balance: 3250.80, 
      currency: "EUR", 
      color: "#6366F1", // Indigo
      icon: Landmark,
      lastTransaction: "2025-09-15T14:30:00"
    },
    { 
      id: 2, 
      name: "Conto Risparmio", 
      type: "savings", 
      bank: "Intesa Sanpaolo", 
      balance: 8750.00, 
      currency: "EUR", 
      color: "#10B981", // Emerald
      icon: PiggyBank,
      lastTransaction: "2025-09-12T09:15:00"
    },
    { 
      id: 3, 
      name: "Carta Prepagata", 
      type: "prepaid", 
      bank: "PostePay", 
      balance: 450.25, 
      currency: "EUR", 
      color: "#F59E0B", // Amber
      icon: CreditCard,
      lastTransaction: "2025-09-16T18:20:00"
    },
    { 
      id: 4, 
      name: "Conto Business", 
      type: "business", 
      bank: "BPER", 
      balance: 5680.40, 
      currency: "EUR", 
      color: "#8B5CF6", // Purple
      icon: Building,
      lastTransaction: "2025-09-14T11:45:00"
    },
  ]);

  // Aggiungi questo state dopo gli altri stati esistenti (riga ~18 circa):
  const [activityHistory, setActivityHistory] = useState<Array<{
    id: number;
    type: 'account_created' | 'account_edited' | 'account_deleted' | 'balance_adjusted' | 'transfer';
    timestamp: string;
    description: string;
    icon: any;
    color: string;
    amount?: number;
  }>>([
    {
      id: 1,
      type: 'account_created',
      timestamp: '2025-09-15T14:30:00',
      description: 'Conto "Conto Corrente Principale" creato',
      icon: Plus,
      color: '#10B981'
    },
    {
      id: 2,
      type: 'transfer',
      timestamp: '2025-09-14T11:45:00',
      description: 'Trasferimento di €200 da Conto Corrente a Conto Risparmio',
      icon: ArrowLeftRight,
      color: '#6366F1',
      amount: 200
    }
  ]);

  // Theme colors matching Transactions page style
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Dark Theme - matching Transactions page
        background: {
          primary: "bg-gray-900",
          card: "bg-gray-800",
          cardHover: "hover:bg-gray-700",
          secondary: "bg-gray-700",
          glass: "bg-gray-800/60 backdrop-blur-sm"
        },
        text: {
          primary: "text-gray-50",
          secondary: "text-gray-300",
          muted: "text-gray-400",
          subtle: "text-gray-500"
        },
        border: {
          main: "border-gray-700",
          card: "border-gray-700",
          cardHover: "hover:border-gray-600"
        },
        accent: {
          primary: "#6366F1", // Indigo
          secondary: "#10B981", // Emerald
          amber: "#F59E0B",
          gradient: "from-indigo-500 via-purple-500 to-teal-400"
        }
      };
    } else {
      return {
        // ☀️ Light Theme
        background: {
          primary: "bg-white",
          card: "bg-white",
          cardHover: "hover:bg-gray-50",
          secondary: "bg-gray-100",
          glass: "bg-white/60 backdrop-blur-sm"
        },
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-700",
          muted: "text-gray-600",
          subtle: "text-gray-500"
        },
        border: {
          main: "border-gray-200",
          card: "border-gray-200",
          cardHover: "hover:border-gray-300"
        },
        accent: {
          primary: "#6366F1",
          secondary: "#10B981",
          amber: "#F59E0B",
          gradient: "from-indigo-500 via-purple-500 to-teal-400"
        }
      };
    }
  };

  const theme = getThemeColors();

  // Handler functions
  const handleAddAccount = () => {
    setEditingAccount(undefined);
    setIsAccountModalOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsAccountModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteAccount = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId);
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    setOpenMenuId(null);
    
    // Add to activity history
    if (account) {
      setActivityHistory(prev => [{
        id: Date.now(),
        type: 'account_deleted',
        timestamp: new Date().toISOString(),
        description: `Conto "${account.name}" eliminato`,
        icon: Trash2,
        color: '#EF4444'
      }, ...prev]);
    }
    
    addToast(`Conto "${account?.name}" eliminato con successo`, 'success');
  };

  const handleSaveAccount = (accountData: any) => {
    if (editingAccount) {
      const accountTypes = {
        checking: { icon: Landmark, color: "#6366F1" },
        savings: { icon: PiggyBank, color: "#10B981" },
        prepaid: { icon: CreditCard, color: "#F59E0B" },
        business: { icon: Building, color: "#8B5CF6" },
      };
      
      const typeConfig = accountTypes[accountData.type as keyof typeof accountTypes] || accountTypes.checking;
      
      const updatedAccount: Account = {
        ...editingAccount,
        name: accountData.name,
        type: accountData.type,
        bank: accountData.bank,
        balance: parseFloat(accountData.balance) || 0,
        color: typeConfig.color,
        icon: typeConfig.icon,
      };
      
      setAccounts(prev => prev.map(acc => 
        acc.id === editingAccount.id ? updatedAccount : acc
      ));
      
      // Add to activity history
      setActivityHistory(prev => [{
        id: Date.now(),
        type: 'account_edited',
        timestamp: new Date().toISOString(),
        description: `Conto "${accountData.name}" modificato`,
        icon: Edit,
        color: '#F59E0B'
      }, ...prev]);
      
      addToast(`Conto "${accountData.name}" modificato con successo`, 'success');
    } else {
      const accountTypes = {
        checking: { icon: Landmark, color: "#6366F1" },
        savings: { icon: PiggyBank, color: "#10B981" },
        prepaid: { icon: CreditCard, color: "#F59E0B" },
        business: { icon: Building, color: "#8B5CF6" },
      };
      
      const typeConfig = accountTypes[accountData.type as keyof typeof accountTypes] || accountTypes.checking;
      
      const account: Account = {
        id: Date.now(),
        name: accountData.name,
        type: accountData.type,
        bank: accountData.bank,
        balance: parseFloat(accountData.balance) || 0,
        currency: "EUR",
        color: typeConfig.color,
        icon: typeConfig.icon,
        lastTransaction: new Date().toISOString()
      };
      
      setAccounts(prev => [...prev, account]);
      
      // Add to activity history
      setActivityHistory(prev => [{
        id: Date.now(),
        type: 'account_created',
        timestamp: new Date().toISOString(),
        description: `Conto "${accountData.name}" creato`,
        icon: Plus,
        color: '#10B981'
      }, ...prev]);
      
      addToast(`Conto "${accountData.name}" aggiunto con successo`, 'success');
    }
    
    setEditingAccount(undefined);
    setIsAccountModalOpen(false);
  };

  const handleTransfer = (fromId: number, toId: number, amount: number, description?: string) => {
    const fromAccount = accounts.find(acc => acc.id === fromId);
    const toAccount = accounts.find(acc => acc.id === toId);
    
    if (!fromAccount || !toAccount || fromAccount.balance < amount) {
      addToast('Trasferimento non valido o fondi insufficienti', 'error');
      return;
    }
    
    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromId) {
        return { ...acc, balance: acc.balance - amount, lastTransaction: new Date().toISOString() };
      }
      if (acc.id === toId) {
        return { ...acc, balance: acc.balance + amount, lastTransaction: new Date().toISOString() };
      }
      return acc;
    }));
    
    // Add to activity history
    setActivityHistory(prev => [{
      id: Date.now(),
      type: 'transfer',
      timestamp: new Date().toISOString(),
      description: `Trasferimento di ${formatCurrency(amount)} da "${fromAccount.name}" a "${toAccount.name}"${description ? ` - ${description}` : ''}`,
      icon: ArrowLeftRight,
      color: '#6366F1',
      amount: amount
    }, ...prev]);
    
    addToast(`Trasferiti ${formatCurrency(amount)} da "${fromAccount.name}" a "${toAccount.name}"`, 'success');
    setIsTransferModalOpen(false);
  };

  const handleAdjustBalance = (account: Account) => {
    setAdjustingAccount(account);
    setIsBalanceAdjustModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveBalanceAdjustment = (accountId: number, newBalance: number, reason: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;
    
    const oldBalance = account.balance;
    const difference = newBalance - oldBalance;
    
    setAccounts(prev => prev.map(acc =>
      acc.id === accountId 
        ? { ...acc, balance: newBalance, lastTransaction: new Date().toISOString() }
        : acc
    ));
    
    // Add to activity history
    setActivityHistory(prev => [{
      id: Date.now(),
      type: 'balance_adjusted',
      timestamp: new Date().toISOString(),
      description: `Saldo di "${account.name}" ${difference >= 0 ? 'aumentato' : 'diminuito'} di ${formatCurrency(Math.abs(difference))} - ${reason}`,
      icon: DollarSign,
      color: difference >= 0 ? '#10B981' : '#EF4444',
      amount: Math.abs(difference)
    }, ...prev]);
    
    addToast(`Saldo di "${account.name}" aggiornato a ${formatCurrency(newBalance)}`, 'success');
    setIsBalanceAdjustModalOpen(false);
    setAdjustingAccount(undefined);
  };

  // Mock balance history data
  const balanceHistory = [
    { month: 'Apr', total: 16800, checking: 2800, savings: 8200, prepaid: 300, business: 5500 },
    { month: 'Mag', total: 17200, checking: 3100, savings: 8300, prepaid: 350, business: 5450 },
    { month: 'Giu', total: 17650, checking: 3200, savings: 8500, prepaid: 400, business: 5550 },
    { month: 'Lug', total: 18100, checking: 3300, savings: 8600, prepaid: 420, business: 5780 },
    { month: 'Ago', total: 18350, checking: 3400, savings: 8700, prepaid: 380, business: 5870 },
    { month: 'Set', total: 18131, checking: 3251, savings: 8750, prepaid: 450, business: 5680 },
  ];

  // Utility functions
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

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const currentMonth = balanceHistory[balanceHistory.length - 1];
  const previousMonth = balanceHistory[balanceHistory.length - 2];
  const monthlyChange = currentMonth.total - previousMonth.total;
  const monthlyChangePercent = ((monthlyChange / previousMonth.total) * 100);

  const handleDeleteActivity = (activityId: number) => {
  const activity = activityHistory.find(act => act.id === activityId);
  setActivityHistory(prev => prev.filter(act => act.id !== activityId));
  setOpenMenuId(null);
  addToast(`Attività "${activity?.description}" rimossa dal log`, 'success');
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking': return 'Conto Corrente';
      case 'savings': return 'Conto Risparmio';
      case 'prepaid': return 'Carta Prepagata';
      case 'business': return 'Conto Business';
      default: return 'Altro';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-3 shadow-xl backdrop-blur-sm`}>
          <p className={`${theme.text.muted} text-sm mb-2`}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className={`${theme.text.primary} font-medium`} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Chart data
  const accountsChartData = accounts.map(account => ({
    name: account.name,
    value: account.balance,
    color: account.color
  }));

  return (
    <div className={`min-h-screen ${theme.background.primary} ${theme.text.primary} transition-colors duration-300`}>
      {/* Container with full width */}
      <div className="w-full h-full p-4 md:p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 bg-clip-text text-transparent leading-tight">
              Il Mio Portafoglio
            </h1>
            <p className={`${theme.text.muted} text-sm leading-relaxed`}>
              Panoramica completa dei tuoi conti e disponibilità
            </p>
          </div>
        </div>

        {/* Total Balance Card - Compact version */}
        <div className={`relative ${theme.background.card} ${theme.border.card} border rounded-2xl p-4 md:p-6 shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl`}>
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-teal-500/10 opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <h2 className={`text-lg md:text-xl font-bold ${theme.text.primary}`}>Saldo Totale</h2>
              </div>
              
              <button
                onClick={() => setShowBalance(!showBalance)}
                className={`p-2 ${theme.background.glass} ${theme.border.card} border rounded-lg hover:bg-gray-700/50 transition-all duration-200`}
              >
                {showBalance ? 
                  <Eye className="w-4 h-4 text-indigo-400" /> : 
                  <EyeOff className="w-4 h-4 text-indigo-400" />
                }
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="space-y-2">
                <div className={`text-2xl md:text-3xl font-bold ${theme.text.primary} tracking-tight`}>
                  {showBalance ? formatCurrency(totalBalance) : "••••••"}
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {monthlyChange >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <span className={`font-semibold text-sm ${monthlyChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {monthlyChange >= 0 ? '+' : ''}{formatCurrency(monthlyChange)} ({monthlyChangePercent.toFixed(1)}%)
                  </span>
                  <span className={`${theme.text.muted} text-sm`}>rispetto al mese scorso</span>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => setIsTransferModalOpen(true)}
                  className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 hover:border-indigo-500/50 px-3 py-2 rounded-xl font-semibold text-indigo-400 hover:text-indigo-300 transition-all duration-200 flex items-center gap-2 text-sm"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Trasferisci
                </button>
                <button 
                  onClick={handleAddAccount}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 px-3 py-2 rounded-xl font-semibold text-emerald-400 hover:text-emerald-300 transition-all duration-200 flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Aggiungi Conto
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Grid - Compact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {accounts.map((account) => {
            const IconComponent = account.icon;
            return (
              <div 
                key={account.id} 
                className={`${theme.background.card} ${theme.border.card} ${theme.background.cardHover} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                     style={{ background: `linear-gradient(135deg, ${account.color}20, transparent)` }} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="p-2 rounded-xl border shadow-sm"
                      style={{ 
                        backgroundColor: `${account.color}15`, 
                        borderColor: `${account.color}30`,
                        boxShadow: `0 2px 8px ${account.color}15`
                      }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: account.color }} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${theme.text.muted} ${theme.background.secondary} px-2 py-1 rounded-full font-medium`}>
                        {getAccountTypeLabel(account.type)}
                      </span>
                      
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === account.id ? null : account.id)}
                          className={`p-1 ${theme.text.muted} hover:text-gray-50 transition-colors rounded hover:bg-gray-700/50`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {openMenuId === account.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                            <div className={`absolute top-6 right-0 z-50 w-44 ${theme.background.card} ${theme.border.card} border rounded-lg shadow-xl overflow-hidden`}>
                              <button
                                onClick={() => handleEditAccount(account)}
                                className={`w-full px-3 py-2 text-left text-indigo-400 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm`}
                              >
                                <Edit className="w-3 h-3" />
                                Modifica Conto
                              </button>
                              <button
                                onClick={() => handleAdjustBalance(account)}
                                className={`w-full px-3 py-2 text-left text-amber-400 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm`}
                              >
                                <DollarSign className="w-3 h-3" />
                                Correggi Saldo
                              </button>
                              <button
                                onClick={() => handleDeleteAccount(account.id)}
                                className={`w-full px-3 py-2 text-left text-red-400 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm`}
                              >
                                <Trash2 className="w-3 h-3" />
                                Elimina Conto
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3 space-y-1">
                    <h3 className={`font-semibold text-base ${theme.text.primary} group-hover:text-indigo-400 transition-colors leading-tight`}>
                      {account.name}
                    </h3>
                    <p className={`${theme.text.muted} text-sm`}>{account.bank}</p>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-lg font-bold leading-tight" style={{ color: account.color }}>
                      {showBalance ? formatCurrency(account.balance) : "••••••"}
                    </div>
                  </div>
                  
                  <div className={`text-xs ${theme.text.subtle}`}>
                    Ultimo movimento: {formatDate(account.lastTransaction)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section - Responsive Grid with compact size */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          
          {/* Balance History Chart */}
          <div className={`xl:col-span-2 ${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/25">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>Storico Disponibilità</h3>
              </div>
              <div className={`text-sm ${theme.text.muted} font-medium`}>
                Ultimi 6 mesi
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={balanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                <XAxis dataKey="month" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={11} />
                <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#6366F1" 
                  fill="url(#colorGradient)" 
                  strokeWidth={2}
                  name="Totale" 
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Account Distribution */}
          <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg shadow-purple-500/25">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>Distribuzione</h3>
            </div>
            
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={accountsChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  innerRadius={30}
                  paddingAngle={2}
                >
                  {accountsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-3 space-y-2">
              {accounts.map((account) => {
                const percentage = ((account.balance / totalBalance) * 100).toFixed(1);
                return (
                  <div key={account.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: account.color }}></div>
                      <span className={`${theme.text.secondary} truncate text-xs`}>{account.name}</span>
                    </div>
                    <span className={`font-semibold ${theme.text.primary} ml-2 text-xs`}>{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Account Details Bar Chart - Compact version */}
        <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg shadow-blue-500/25">
              <BarChart className="w-5 h-5 text-white" />
            </div>
            <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>Dettaglio per Conto</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={balanceHistory} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
              <XAxis dataKey="month" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={11} />
              <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="checking" fill="#6366F1" name="Conto Corrente" radius={[0, 0, 0, 0]} />
              <Bar dataKey="savings" fill="#10B981" name="Risparmio" radius={[0, 0, 0, 0]} />
              <Bar dataKey="prepaid" fill="#F59E0B" name="Prepagata" radius={[0, 0, 0, 0]} />
              <Bar dataKey="business" fill="#8B5CF6" name="Business" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity History Section */}
        <div className={`${theme.background.card} ${theme.border.card} border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
          {/* Header fisso */}
          <div className="p-4 border-b border-gray-700/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg shadow-amber-500/25">
                <History className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>Storico Attività</h3>
            </div>
          </div>
          
          {/* Contenuto scrollabile */}
          <div className="h-80 overflow-y-auto p-4">
            <div className="space-y-3">
              {activityHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className={`w-12 h-12 ${theme.text.muted} mx-auto mb-3`} />
                  <p className={`${theme.text.muted} text-sm`}>Nessuna attività registrata</p>
                </div>
              ) : (
              // Nel codice delle activity cards, sostituisci il div esistente con questo:
              activityHistory.slice(0, 20).map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-3 p-3 ${theme.background.secondary}/30 rounded-lg hover:bg-gray-700/30 dark:hover:bg-gray-700/30 light:hover:bg-gray-100/50 transition-colors group`}
                  >
                    <div 
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ 
                        backgroundColor: `${activity.color}20`, 
                        borderColor: `${activity.color}40`,
                      }}
                    >
                      <IconComponent className="w-4 h-4" style={{ color: activity.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${theme.text.primary} text-sm font-medium leading-tight`}>
                        {activity.description}
                      </p>
                      <p className={`${theme.text.muted} text-xs mt-1`}>
                        {formatDate(activity.timestamp)} alle {formatTime(activity.timestamp)}
                      </p>
                    </div>
                    {activity.amount && (
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0`} 
                          style={{ backgroundColor: `${activity.color}20`, color: activity.color }}>
                        {formatCurrency(activity.amount)}
                      </div>
                    )}
                    
                    {/* Menu tre puntini */}
                    <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === activity.id ? null : activity.id)}
                        className={`p-1 ${theme.text.muted} hover:text-gray-50 transition-colors rounded hover:bg-gray-700/50`}
                      >
                        <MoreVertical className="w-3 h-3" />
                      </button>
                      
                      {openMenuId === activity.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                          <div className={`absolute top-6 right-0 z-50 w-36 ${theme.background.card} ${theme.border.card} border rounded-lg shadow-xl overflow-hidden`}>
                            <button
                              onClick={() => handleDeleteActivity(activity.id)}
                              className={`w-full px-3 py-2 text-left text-red-400 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm`}
                            >
                              <Trash2 className="w-3 h-3" />
                              Elimina Log
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              }))}
            </div>
          </div>
          
          {/* Footer fisso se necessario */}
          {activityHistory.length > 20 && (
            <div className="p-4 border-t border-gray-700/30 text-center">
              <button className={`text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors`}>
                Mostra tutte le attività ({activityHistory.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isAccountModalOpen && (
        <AccountModal
          account={editingAccount}
          isNew={!editingAccount}
          onClose={() => {
            setIsAccountModalOpen(false);
            setEditingAccount(undefined);
          }}
          onSave={handleSaveAccount}
        />
      )}

      {isTransferModalOpen && (
        <TransferModal
          accounts={accounts}
          onClose={() => setIsTransferModalOpen(false)}
          onTransfer={handleTransfer}
        />
      )}

      {isBalanceAdjustModalOpen && adjustingAccount && (
        <BalanceAdjustModal
          account={adjustingAccount}
          onClose={() => {
            setIsBalanceAdjustModalOpen(false);
            setAdjustingAccount(undefined);
          }}
          onAdjust={handleSaveBalanceAdjustment}
        />
      )}
    </div>
  );
};

export default Portfolio;