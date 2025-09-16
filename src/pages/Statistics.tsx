import React, { useState } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, ComposedChart } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, Activity, ArrowUpRight, ArrowDownRight, Download, RefreshCw, BarChart3, Zap, PiggyBank, Clock, Users, ShoppingCart, Home, Car, Utensils, Heart, Gamepad2 } from "lucide-react";

const Statistics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M');

  // Dati per il grafico delle entrate/uscite nel tempo
  const cashFlowData = [
    { month: 'Gen', income: 2800, expenses: 2100, net: 700, savings: 650 },
    { month: 'Feb', income: 3200, expenses: 2400, net: 800, savings: 750 },
    { month: 'Mar', income: 2900, expenses: 2200, net: 700, savings: 680 },
    { month: 'Apr', income: 3400, expenses: 2600, net: 800, savings: 780 },
    { month: 'Mag', income: 3100, expenses: 2300, net: 800, savings: 820 },
    { month: 'Giu', income: 3300, expenses: 2500, net: 800, savings: 900 },
    { month: 'Lug', income: 3600, expenses: 2800, net: 800, savings: 950 },
    { month: 'Ago', income: 3200, expenses: 2400, net: 800, savings: 880 },
    { month: 'Set', income: 3800, expenses: 2900, net: 900, savings: 1020 },
  ];

  // Dati spese per categoria
  const categoryData = [
    { name: "Casa", value: 1200, color: "#4C6FFF", percentage: 35.3, icon: Home },
    { name: "Cibo", value: 650, color: "#FF6B6B", percentage: 19.1, icon: Utensils },
    { name: "Trasporti", value: 420, color: "#FFD93D", percentage: 12.4, icon: Car },
    { name: "Intrattenimento", value: 380, color: "#6BCB77", percentage: 11.2, icon: Gamepad2 },
    { name: "Salute", value: 280, color: "#FF9F1C", percentage: 8.2, icon: Heart },
    { name: "Shopping", value: 320, color: "#9B5DE5", percentage: 9.4, icon: ShoppingCart },
    { name: "Altro", value: 150, color: "#06D6A0", percentage: 4.4, icon: DollarSign },
  ];

  // Trend mensili per categoria
  const categoryTrends = [
    { month: 'Gen', Casa: 1100, Cibo: 580, Trasporti: 380, Intrattenimento: 320, Salute: 250, Shopping: 280 },
    { month: 'Feb', Casa: 1150, Cibo: 620, Trasporti: 400, Intrattenimento: 360, Salute: 280, Shopping: 300 },
    { month: 'Mar', Casa: 1200, Cibo: 590, Trasporti: 420, Intrattenimento: 340, Salute: 260, Shopping: 290 },
    { month: 'Apr', Casa: 1180, Cibo: 640, Trasporti: 450, Intrattenimento: 380, Salute: 300, Shopping: 350 },
    { month: 'Mag', Casa: 1220, Cibo: 610, Trasporti: 410, Intrattenimento: 370, Salute: 270, Shopping: 310 },
    { month: 'Giu', Casa: 1200, Cibo: 650, Trasporti: 420, Intrattenimento: 380, Salute: 280, Shopping: 320 },
  ];

  // Dati obiettivi di risparmio
  const savingsGoalData = [
    { name: "Vacanza Giappone", current: 3800, target: 4500, fill: "#4C6FFF" },
    { name: "MacBook Pro", current: 1650, target: 2500, fill: "#FF6B6B" },
    { name: "Fondo Emergenza", current: 2200, target: 5000, fill: "#6BCB77" },
  ];

  // Dati performance investimenti
  const investmentData = [
    { month: 'Gen', portfolio: 12000, sp500: 11800, bonds: 11900 },
    { month: 'Feb', portfolio: 12400, sp500: 12100, bonds: 12000 },
    { month: 'Mar', portfolio: 12800, sp500: 12600, bonds: 12100 },
    { month: 'Apr', portfolio: 13200, sp500: 12900, bonds: 12200 },
    { month: 'Mag', portfolio: 13600, sp500: 13300, bonds: 12300 },
    { month: 'Giu', portfolio: 14200, sp500: 13800, bonds: 12400 },
  ];

  // Pagamenti ricorrenti
  const recurringPayments = [
    { name: "Netflix", amount: 15.99, date: "15", category: "Intrattenimento", color: "#EF4444" },
    { name: "Spotify", amount: 9.99, date: "20", category: "Intrattenimento", color: "#10B981" },
    { name: "Palestra", amount: 45, date: "1", category: "Salute", color: "#F59E0B" },
    { name: "Telefono", amount: 25, date: "5", category: "Utilities", color: "#8B5CF6" },
    { name: "Assicurazione", amount: 85, date: "10", category: "Casa", color: "#06B6D4" },
  ];

  // Top merchants
  const topMerchants = [
    { name: "Conad", amount: 340, transactions: 12, color: "#10B981" },
    { name: "Eni Station", amount: 280, transactions: 8, color: "#F59E0B" },
    { name: "Amazon", amount: 450, transactions: 15, color: "#FF6B6B" },
    { name: "McDonald's", amount: 120, transactions: 6, color: "#8B5CF6" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calcoli per le metriche principali
  const currentMonth = cashFlowData[cashFlowData.length - 1];
  const previousMonth = cashFlowData[cashFlowData.length - 2];
  const incomeGrowth = ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100;
  const expenseGrowth = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100;
  const savingsRate = (currentMonth.savings / currentMonth.income) * 100;
  
  const totalIncome = cashFlowData.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = cashFlowData.reduce((sum, month) => sum + month.expenses, 0);
  const totalSavings = cashFlowData.reduce((sum, month) => sum + month.savings, 0);

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
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Statistiche Avanzate
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-lg lg:text-xl">Dashboard completo delle tue finanze personali</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex gap-2">
            {['1M', '3M', '6M', '1Y', 'ALL'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as any)}
                className={`px-3 py-2 rounded-lg text-sm transition ${
                  selectedPeriod === period 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-blue-200" />
            <div className={`flex items-center gap-1 text-sm ${incomeGrowth >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {incomeGrowth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(incomeGrowth).toFixed(1)}%
            </div>
          </div>
          <div>
            <p className="text-blue-200 text-sm sm:text-lg">Entrate Totali</p>
            <p className="text-xl sm:text-3xl lg:text-5xl font-bold text-white">{formatCurrency(totalIncome)}</p>
            <p className="text-blue-200 text-sm sm:text-base lg:text-lg mt-1">Questo mese: {formatCurrency(currentMonth.income)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-700 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown className="w-7 h-7 sm:w-8 sm:h-8 text-red-200" />
            <div className={`flex items-center gap-1 text-sm ${expenseGrowth <= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {expenseGrowth <= 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              {Math.abs(expenseGrowth).toFixed(1)}%
            </div>
          </div>
          <div>
            <p className="text-red-200 text-sm sm:text-lg">Uscite Totali</p>
            <p className="text-xl sm:text-3xl lg:text-5xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
            <p className="text-red-200 text-sm sm:text-base lg:text-lg mt-1">Questo mese: {formatCurrency(currentMonth.expenses)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-7 h-7 sm:w-8 sm:h-8 text-green-200" />
            <div className="text-green-200 text-sm font-medium">{savingsRate.toFixed(1)}%</div>
          </div>
          <div>
            <p className="text-green-200 text-sm sm:text-lg">Risparmi Totali</p>
            <p className="text-xl sm:text-3xl lg:text-5xl font-bold text-white">{formatCurrency(totalSavings)}</p>
            <p className="text-green-200 text-sm sm:text-base lg:text-lg mt-1">Tasso risparmio mensile</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-purple-200" />
            <div className="text-purple-200 text-sm font-medium">+12.4%</div>
          </div>
          <div>
            <p className="text-purple-200 text-sm sm:text-lg">Patrimonio Netto</p>
            <p className="text-xl sm:text-3xl lg:text-5xl font-bold text-white">{formatCurrency(totalSavings + 14200)}</p>
            <p className="text-purple-200 text-sm sm:text-base lg:text-lg mt-1">Investimenti inclusi</p>
          </div>
        </div>
      </div>

      {/* Grafici Principali */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Cash Flow Chart */}
        <div className="xl:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl sm:text-3xl font-bold">Flusso di Cassa Mensile</h3>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Entrate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300">Uscite</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">Risparmi</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#10B981" name="Entrate" />
              <Bar dataKey="expenses" fill="#EF4444" name="Uscite" />
              <Line type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={3} name="Risparmi" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl sm:text-3xl font-bold">Distribuzione Spese</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-3">
            {categoryData.slice(0, 4).map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <category.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 font-medium">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{category.percentage}%</div>
                  <div className="text-gray-400 text-sm">{formatCurrency(category.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grafici Secondari */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Investment Performance */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-2xl sm:text-3xl font-bold">Performance Investimenti</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={investmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="portfolio" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="Il tuo Portfolio" />
              <Area type="monotone" dataKey="sp500" stroke="#06B6D4" fill="transparent" strokeWidth={2} name="S&P 500" />
              <Area type="monotone" dataKey="bonds" stroke="#F59E0B" fill="transparent" strokeWidth={2} name="Obbligazioni" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Savings Goals Progress */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold">Progresso Obiettivi</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart 
              innerRadius="30%" 
              outerRadius="80%" 
              data={savingsGoalData.map(goal => ({
                ...goal,
                percentage: (goal.current / goal.target) * 100
              }))}
            >
              <RadialBar 
                dataKey="percentage" 
                cornerRadius={10}
                fill="#8884d8"
              />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="space-y-4">
            {savingsGoalData.map((goal, index) => {
              const percentage = (goal.current / goal.target) * 100;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: goal.fill }}></div>
                    <span className="text-gray-300 font-medium">{goal.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">{percentage.toFixed(1)}%</div>
                    <div className="text-gray-400 text-sm">{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sezione Ricorrenti e Top Merchants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pagamenti Ricorrenti */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-orange-400" />
            <h3 className="text-2xl sm:text-3xl font-bold">Pagamenti Ricorrenti</h3>
          </div>
          <div className="space-y-4">
            {recurringPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700/70 transition">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payment.color }}></div>
                  <div>
                    <div className="text-white font-semibold text-lg">{payment.name}</div>
                    <div className="text-gray-400">Il {payment.date} del mese • {payment.category}</div>
                  </div>
                </div>
                <div className="text-red-400 font-bold text-lg">{formatCurrency(payment.amount)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Totale mensile</span>
              <span className="text-white font-bold text-xl">
                {formatCurrency(recurringPayments.reduce((sum, p) => sum + p.amount, 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Top Merchants */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-green-400" />
            <h3 className="text-2xl sm:text-3xl font-bold">Top Merchants</h3>
          </div>
          <div className="space-y-4">
            {topMerchants.map((merchant, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700/70 transition">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: merchant.color }}></div>
                  <div>
                    <div className="text-white font-semibold text-lg">{merchant.name}</div>
                    <div className="text-gray-400">{merchant.transactions} transazioni questo mese</div>
                  </div>
                </div>
                <div className="text-white font-bold text-lg">{formatCurrency(merchant.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-orange-400" />
                      <h3 className="text-2xl sm:text-3xl font-bold">Analisi Trend per Categoria</h3>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={categoryTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="Casa" stroke="#4C6FFF" strokeWidth={3} />
            <Line type="monotone" dataKey="Cibo" stroke="#FF6B6B" strokeWidth={3} />
            <Line type="monotone" dataKey="Trasporti" stroke="#FFD93D" strokeWidth={3} />
            <Line type="monotone" dataKey="Intrattenimento" stroke="#6BCB77" strokeWidth={3} />
            <Line type="monotone" dataKey="Shopping" stroke="#9B5DE5" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;