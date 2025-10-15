// src/pages/Portfolio.tsx - SOLO DATI REALI
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Wallet, CreditCard, PiggyBank, TrendingUp, Eye, EyeOff, ArrowUpRight, ArrowDownRight, Plus, History, DollarSign, Building, Landmark, MoreVertical, Edit, Trash2, ArrowLeftRight, RefreshCw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import AccountModal from "../components/ui/AccountModal";
import TransferModal from "../components/ui/TransferModal";
import BalanceAdjustModal from "../components/ui/BalanceAdjustModal";
import {
  getAccountsApi,
  createAccountApi,
  updateAccountApi,
  deleteAccountApi,
  transferBetweenAccountsApi,
  adjustAccountBalanceApi,
} from "../api/accountsApi";

// Type per Account compatibile con componenti esistenti
export type Account = {
  id: string;
  name: string;
  type: string;
  bank?: string;
  balance: number;
  currency: string;
  color: string;
  icon: any;
  lastTransaction?: string;
};

const Portfolio: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { addToast } = useToast();

  // States
  const [showBalance, setShowBalance] = useState(true);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isBalanceAdjustModalOpen, setIsBalanceAdjustModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();
  const [adjustingAccount, setAdjustingAccount] = useState<Account | undefined>();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Activity History
  const [activityHistory, setActivityHistory] = useState<Array<{
    id: number;
    type: 'account_created' | 'account_edited' | 'account_deleted' | 'balance_adjusted' | 'transfer';
    timestamp: string;
    description: string;
    icon: any;
    color: string;
    amount?: number;
  }>>([]);

  // Carica conti all'avvio
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const apiAccounts = await getAccountsApi();
      
      const formattedAccounts: Account[] = apiAccounts.map(acc => ({
        id: acc.id,
        name: acc.name,
        type: acc.type,
        bank: '',
        balance: acc.balance,
        currency: acc.currency,
        color: acc.color || getDefaultColorForType(acc.type),
        icon: getIconForType(acc.type),
        lastTransaction: acc.updatedAt
      }));
      
      setAccounts(formattedAccounts);
      console.log('✅ Conti caricati:', formattedAccounts);
    } catch (error: any) {
      console.error('❌ Errore caricamento conti:', error);
      addToast('Errore nel caricare i conti', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'checking': return Landmark;
      case 'savings': return PiggyBank;
      case 'prepaid': 
      case 'credit_card': return CreditCard;
      case 'business':
      case 'investment': return Building;
      case 'cash': return Wallet;
      default: return Wallet;
    }
  };

  const getDefaultColorForType = (type: string): string => {
    switch (type) {
      case 'checking': return '#6366F1';
      case 'savings': return '#10B981';
      case 'prepaid':
      case 'credit_card': return '#F59E0B';
      case 'business':
      case 'investment': return '#8B5CF6';
      case 'cash': return '#EC4899';
      default: return '#6366F1';
    }
  };

  const getThemeColors = () => {
    if (isDarkMode) {
      return {
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
        }
      };
    } else {
      return {
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
        }
      };
    }
  };

  const theme = getThemeColors();

  // Handlers
  const handleAddAccount = () => {
    setEditingAccount(undefined);
    setIsAccountModalOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsAccountModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteAccount = async (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;

    if (!window.confirm(`Sei sicuro di voler eliminare "${account.name}"?`)) {
      return;
    }

    try {
      await deleteAccountApi(accountId);
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
      setOpenMenuId(null);
      
      setActivityHistory(prev => [{
        id: Date.now(),
        type: 'account_deleted',
        timestamp: new Date().toISOString(),
        description: `Conto "${account.name}" eliminato`,
        icon: Trash2,
        color: '#EF4444'
      }, ...prev]);
      
      addToast(`Conto "${account.name}" eliminato con successo`, 'success');
    } catch (error: any) {
      console.error('❌ Errore eliminazione:', error);
      addToast('Errore durante l\'eliminazione', 'error');
    }
  };

  const handleSaveAccount = async (accountData: any) => {
    try {
      if (editingAccount) {
        const updated = await updateAccountApi(editingAccount.id, {
          name: accountData.name,
          type: accountData.type,
          balance: parseFloat(accountData.balance) || 0,
          color: accountData.color || getDefaultColorForType(accountData.type)
        });
        
        const updatedAccount: Account = {
          id: updated.id,
          name: updated.name,
          type: updated.type,
          bank: accountData.bank || '',
          balance: updated.balance,
          currency: updated.currency,
          color: updated.color || getDefaultColorForType(updated.type),
          icon: getIconForType(updated.type),
          lastTransaction: updated.updatedAt
        };
        
        setAccounts(prev => prev.map(acc => 
          acc.id === editingAccount.id ? updatedAccount : acc
        ));
        
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
        const created = await createAccountApi({
          name: accountData.name,
          type: accountData.type,
          balance: parseFloat(accountData.balance) || 0,
          currency: 'EUR',
          color: accountData.color || getDefaultColorForType(accountData.type)
        });
        
        const newAccount: Account = {
          id: created.id,
          name: created.name,
          type: created.type,
          bank: accountData.bank || '',
          balance: created.balance,
          currency: created.currency,
          color: created.color || getDefaultColorForType(created.type),
          icon: getIconForType(created.type),
          lastTransaction: created.createdAt
        };
        
        setAccounts(prev => [...prev, newAccount]);
        
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
    } catch (error: any) {
      console.error('❌ Errore salvataggio conto:', error);
      addToast(error.message || 'Errore durante il salvataggio', 'error');
    }
  };

  const handleTransfer = async (fromId: string, toId: string, amount: number, description?: string) => {
    const fromAccount = accounts.find(acc => acc.id === fromId);
    const toAccount = accounts.find(acc => acc.id === toId);
    
    if (!fromAccount || !toAccount) {
      addToast('Conti non trovati', 'error');
      return;
    }

    if (fromAccount.balance < amount) {
      addToast('Fondi insufficienti', 'error');
      return;
    }

    try {
      await transferBetweenAccountsApi(fromId, toId, amount, description);
      
      setAccounts(prev => prev.map(acc => {
        if (acc.id === fromId) {
          return { ...acc, balance: acc.balance - amount, lastTransaction: new Date().toISOString() };
        }
        if (acc.id === toId) {
          return { ...acc, balance: acc.balance + amount, lastTransaction: new Date().toISOString() };
        }
        return acc;
      }));
      
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
    } catch (error: any) {
      console.error('❌ Errore trasferimento:', error);
      addToast(error.message || 'Errore durante il trasferimento', 'error');
    }
  };

  const handleAdjustBalance = (account: Account) => {
    setAdjustingAccount(account);
    setIsBalanceAdjustModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveBalanceAdjustment = async (accountId: string, newBalance: number, reason: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;
    
    const oldBalance = account.balance;
    const difference = newBalance - oldBalance;

    try {
      await adjustAccountBalanceApi(accountId, newBalance, reason);
      
      setAccounts(prev => prev.map(acc =>
        acc.id === accountId 
          ? { ...acc, balance: newBalance, lastTransaction: new Date().toISOString() }
          : acc
      ));
      
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
    } catch (error: any) {
      console.error('❌ Errore aggiustamento saldo:', error);
      addToast(error.message || 'Errore durante l\'aggiustamento', 'error');
    }
  };

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
      case 'prepaid': 
      case 'credit_card': return 'Carta';
      case 'business': 
      case 'investment': return 'Business';
      case 'cash': return 'Contanti';
      default: return 'Altro';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-3 shadow-xl backdrop-blur-sm`}>
          {payload.map((entry: any, index: number) => (
            <p key={index} className={`${theme.text.primary} font-medium text-sm`} style={{ color: entry.payload.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const accountsChartData = accounts.map(account => ({
    name: account.name,
    value: account.balance,
    color: account.color
  }));

  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme.background.primary} flex items-center justify-center`}>
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className={theme.text.muted}>Caricamento portafoglio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background.primary} ${theme.text.primary} transition-colors duration-300`}>
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

        {/* Total Balance Card */}
        <div className={`relative ${theme.background.card} ${theme.border.card} border rounded-2xl p-4 md:p-6 shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl`}>
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
                
                <div className="flex items-center gap-2">
                  <span className={`${theme.text.muted} text-sm`}>
                    {accounts.length} {accounts.length === 1 ? 'conto' : 'conti'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => setIsTransferModalOpen(true)}
                  disabled={accounts.length < 2}
                  className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 hover:border-indigo-500/50 px-3 py-2 rounded-xl font-semibold text-indigo-400 hover:text-indigo-300 transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Accounts Grid o Empty State */}
        {accounts.length === 0 ? (
          <div className={`${theme.background.card} ${theme.border.card} border rounded-2xl p-12 text-center shadow-lg`}>
            <Wallet className={`w-16 h-16 ${theme.text.muted} mx-auto mb-4`} />
            <h3 className={`text-xl font-bold ${theme.text.primary} mb-2`}>Nessun conto</h3>
            <p className={`${theme.text.muted} mb-6`}>Crea il tuo primo conto per iniziare a gestire il tuo portafoglio</p>
            <button
              onClick={handleAddAccount}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Crea Primo Conto
            </button>
          </div>
        ) : (
          <>
            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {accounts.map((account) => {
                const IconComponent = account.icon;
                return (
                  <div 
                    key={account.id} 
                    className={`${theme.background.card} ${theme.border.card} ${theme.background.cardHover} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
                  >
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
                        {account.bank && <p className={`${theme.text.muted} text-sm`}>{account.bank}</p>}
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-lg font-bold leading-tight" style={{ color: account.color }}>
                          {showBalance ? formatCurrency(account.balance) : "••••••"}
                        </div>
                      </div>
                      
                      {account.lastTransaction && (
                        <div className={`text-xs ${theme.text.subtle}`}>
                          Aggiornato: {formatDate(account.lastTransaction)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Account Distribution Chart */}
            {accounts.length > 1 && (
              <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg shadow-purple-500/25">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>Distribuzione Conti</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={accountsChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                      >
                        {accountsChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="flex flex-col justify-center space-y-2">
                    {accounts.map((account) => {
                      const percentage = ((account.balance / totalBalance) * 100).toFixed(1);
                      return (
                        <div key={account.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: account.color }}></div>
                            <span className={`${theme.text.secondary} truncate`}>{account.name}</span>
                          </div>
                          <span className={`font-semibold ${theme.text.primary} ml-2`}>{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Activity History */}
            <div className={`${theme.background.card} ${theme.border.card} border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
              <div className="p-4 border-b border-gray-700/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg shadow-amber-500/25">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>Storico Attività</h3>
                </div>
              </div>
              
              <div className="h-80 overflow-y-auto p-4">
                <div className="space-y-3">
                  {activityHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <History className={`w-12 h-12 ${theme.text.muted} mx-auto mb-3`} />
                      <p className={`${theme.text.muted} text-sm`}>Nessuna attività registrata</p>
                    </div>
                  ) : (
                    activityHistory.slice(0, 20).map((activity) => {
                      const IconComponent = activity.icon;
                      return (
                        <div
                          key={activity.id}
                          className={`flex items-start gap-3 p-3 ${theme.background.secondary}/30 rounded-lg hover:bg-gray-700/30 transition-colors group`}
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
                          
                          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === activity.id.toString() ? null : activity.id.toString())}
                              className={`p-1 ${theme.text.muted} hover:text-gray-50 transition-colors rounded hover:bg-gray-700/50`}
                            >
                              <MoreVertical className="w-3 h-3" />
                            </button>
                            
                            {openMenuId === activity.id.toString() && (
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
                    })
                  )}
                </div>
              </div>
              
              {activityHistory.length > 20 && (
                <div className="p-4 border-t border-gray-700/30 text-center">
                  <button className={`text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors`}>
                    Mostra tutte le attività ({activityHistory.length})
                  </button>
                </div>
              )}
            </div>
          </>
        )}
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