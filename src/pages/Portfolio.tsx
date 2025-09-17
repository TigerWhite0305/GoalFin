import React, { useState } from "react";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Wallet, CreditCard, PiggyBank, TrendingUp, TrendingDown, Eye, EyeOff, ArrowUpRight, ArrowDownRight, Plus, History, DollarSign, Building, Landmark, MoreVertical, Edit, Trash2, ArrowLeftRight } from "lucide-react";
import { useToast } from "../context/ToastContext";
import AccountModal, { Account } from "../components/ui/AccountModal";
import TransferModal from "../components/ui/TransferModal";
import BalanceAdjustModal from "../components/ui/BalanceAdjustModal";

const Portfolio: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isBalanceAdjustModalOpen, setIsBalanceAdjustModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();
  const [adjustingAccount, setAdjustingAccount] = useState<Account | undefined>();
  
  const { addToast } = useToast();

  // Stato per i conti
  const [accounts, setAccounts] = useState<Account[]>([
    { 
      id: 1, 
      name: "Conto Corrente Principale", 
      type: "checking", 
      bank: "UniCredit", 
      balance: 3250.80, 
      currency: "EUR", 
      color: "#4C6FFF",
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
      color: "#10B981",
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
      color: "#F59E0B",
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
      color: "#8B5CF6",
      icon: Building,
      lastTransaction: "2025-09-14T11:45:00"
    },
  ]);

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
    addToast(`Conto "${account?.name}" eliminato con successo`, 'success');
  };

  const handleSaveAccount = (accountData: any) => {
    if (editingAccount) {
      // UPDATE esistente
      const accountTypes = {
        checking: { icon: Landmark, color: "#4C6FFF" },
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
      addToast(`Conto "${accountData.name}" modificato con successo`, 'success');
    } else {
      // CREATE nuovo
      const accountTypes = {
        checking: { icon: Landmark, color: "#4C6FFF" },
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
    
    setAccounts(prev => prev.map(acc =>
      acc.id === accountId 
        ? { ...acc, balance: newBalance, lastTransaction: new Date().toISOString() }
        : acc
    ));
    
    addToast(`Saldo di "${account.name}" aggiornato a ${formatCurrency(newBalance)}`, 'success');
    setIsBalanceAdjustModalOpen(false);
    setAdjustingAccount(undefined);
  };

  // Storico disponibilità (ultimi 6 mesi)
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

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const currentMonth = balanceHistory[balanceHistory.length - 1];
  const previousMonth = balanceHistory[balanceHistory.length - 2];
  const monthlyChange = currentMonth.total - previousMonth.total;
  const monthlyChangePercent = ((monthlyChange / previousMonth.total) * 100);

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

  // Dati per il grafico a torta
  const accountsChartData = accounts.map(account => ({
    name: account.name,
    value: account.balance,
    color: account.color
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-4 lg:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Il Mio Portafoglio
          </h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Panoramica completa dei tuoi conti e disponibilità</p>
        </div>
        
        <div className="flex gap-2">
          {['1M', '3M', '6M', '1Y'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as any)}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                selectedPeriod === period ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Saldo Totale */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 sm:p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-blue-200" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Saldo Totale</h2>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {showBalance ? <Eye className="w-6 h-6 text-blue-200" /> : <EyeOff className="w-6 h-6 text-blue-200" />}
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              {showBalance ? formatCurrency(totalBalance) : "••••••"}
            </div>
            <div className="flex items-center gap-2">
              {monthlyChange >= 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-300" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-300" />
              )}
              <span className={`font-semibold ${monthlyChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {monthlyChange >= 0 ? '+' : ''}{formatCurrency(monthlyChange)} ({monthlyChangePercent.toFixed(1)}%)
              </span>
              <span className="text-blue-200 text-sm">rispetto al mese scorso</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsTransferModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Trasferisci
            </button>
            <button 
              onClick={handleAddAccount}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Aggiungi Conto
            </button>
          </div>
        </div>
      </div>

      {/* Conti */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {accounts.map((account) => {
          const IconComponent = account.icon;
          return (
            <div key={account.id} className="bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all group relative">
              
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: `${account.color}20`, border: `1px solid ${account.color}40` }}
                >
                  <IconComponent className="w-6 h-6" style={{ color: account.color }} />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                    {getAccountTypeLabel(account.type)}
                  </span>
                  
                  {/* Menu button */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === account.id ? null : account.id)}
                      className="p-1 text-gray-400 hover:text-white transition-colors rounded"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown menu */}
                    {openMenuId === account.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                        <div className="absolute top-8 right-0 z-50 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-xl">
                          <button
                            onClick={() => handleEditAccount(account)}
                            className="w-full px-4 py-2 text-left text-blue-400 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Modifica Conto
                          </button>
                          <button
                            onClick={() => handleAdjustBalance(account)}
                            className="w-full px-4 py-2 text-left text-yellow-400 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <DollarSign className="w-4 h-4" />
                            Correggi Saldo
                          </button>
                          <button
                            onClick={() => handleDeleteAccount(account.id)}
                            className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Elimina Conto
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {account.name}
                </h3>
                <p className="text-gray-400 text-sm">{account.bank}</p>
              </div>
              
              <div className="mb-3">
                <div className="text-2xl font-bold" style={{ color: account.color }}>
                  {showBalance ? formatCurrency(account.balance) : "••••••"}
                </div>
              </div>
              
              <div className="text-xs text-gray-400">
                Ultimo movimento: {formatDate(account.lastTransaction)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grafici */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Storico Disponibilità */}
        <div className="xl:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-xl sm:text-2xl font-bold">Storico Disponibilità</h3>
            </div>
            <div className="text-sm text-gray-400">
              Ultimi 6 mesi
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={balanceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Totale" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuzione Conti */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl sm:text-2xl font-bold">Distribuzione</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={accountsChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
              >
                {accountsChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {accounts.map((account) => {
              const percentage = ((account.balance / totalBalance) * 100).toFixed(1);
              return (
                <div key={account.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: account.color }}></div>
                    <span className="text-gray-300">{account.name}</span>
                  </div>
                  <span className="font-medium text-white">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dettaglio per Conto */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <BarChart className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl sm:text-2xl font-bold">Dettaglio per Conto</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={balanceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="checking" fill="#4C6FFF" name="Conto Corrente" />
            <Bar dataKey="savings" fill="#10B981" name="Risparmio" />
            <Bar dataKey="prepaid" fill="#F59E0B" name="Prepagata" />
            <Bar dataKey="business" fill="#8B5CF6" name="Business" />
          </BarChart>
        </ResponsiveContainer>
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