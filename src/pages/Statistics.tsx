import React, { useState, useRef } from "react";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Heart, Home, Car, Gamepad2, ShoppingCart, Activity, Download, Filter, Settings, Calendar, FileText, Image, Database, X, Check } from "lucide-react";
import { useToast } from "../context/ToastContext";

// Types
interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  icon: React.ComponentType<any>;
}

interface FilterSettings {
  period: '1M' | '3M' | '6M' | '1Y' | 'ALL';
  categories: string[];
  chartType: 'pie' | 'bar' | 'line';
}

interface ExportSettings {
  format: 'CSV' | 'JSON' | 'Excel';
  includeCharts: boolean;
  dateRange: string;
}

const Statistics: React.FC = () => {
  const { addToast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);

  // Estados
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M');
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  // Filter & Export Settings
  const [filters, setFilters] = useState<FilterSettings>({
    period: '6M',
    categories: [],
    chartType: 'pie'
  });

  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'CSV',
    includeCharts: false,
    dateRange: '6M'
  });

  // Dati dinamici basati sui filtri
  const getFilteredData = () => {
    // Base data
    const baseExpenseData = [
      { name: "Casa", value: 1200, color: "#4C6FFF", icon: Home },
      { name: "Cibo", value: 650, color: "#FF6B6B", icon: DollarSign },
      { name: "Trasporti", value: 420, color: "#FFD93D", icon: Car },
      { name: "Intrattenimento", value: 380, color: "#6BCB77", icon: Gamepad2 },
      { name: "Salute", value: 280, color: "#FF9F1C", icon: Heart },
      { name: "Shopping", value: 320, color: "#9B5DE5", icon: ShoppingCart },
      { name: "Altro", value: 150, color: "#06D6A0", icon: DollarSign },
    ];

    // Filtra per periodo (simulazione)
    const periodMultiplier = selectedPeriod === '1M' ? 0.5 : 
                            selectedPeriod === '3M' ? 0.8 : 
                            selectedPeriod === '6M' ? 1 : 
                            selectedPeriod === '1Y' ? 1.5 : 2;

    const filteredData = baseExpenseData.map(item => ({
      ...item,
      value: Math.round(item.value * periodMultiplier)
    }));

    // Calcola le percentuali
    const total = filteredData.reduce((sum, item) => sum + item.value, 0);
    return filteredData.map(item => ({
      ...item,
      percentage: total > 0 ? parseFloat(((item.value / total) * 100).toFixed(1)) : 0
    }));
  };

  const expenseData = getFilteredData();

  // Handler Functions
  const handlePeriodChange = (newPeriod: typeof selectedPeriod) => {
    setSelectedPeriod(newPeriod);
    addToast(`Periodo cambiato a ${newPeriod}`, 'info');
  };

  const handleCategoryFilter = (category: string) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories.filter(c => c !== 'all'), category];
      
      setSelectedCategories(newCategories.length === 0 ? ['all'] : newCategories);
    }
    addToast(`Filtri categoria aggiornati`, 'info');
  };

  const handleChartTypeChange = (type: 'pie' | 'bar') => {
    setChartType(type);
    addToast(`Vista cambiata a ${type === 'pie' ? 'Torta' : 'Barre'}`, 'info');
  };

  // Export Functions
  const exportToCSV = () => {
    const csvContent = [
      ['Categoria', 'Importo', 'Percentuale'],
      ...expenseData.map(item => [item.name, item.value, `${item.percentage}%`])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statistiche_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    addToast('File CSV scaricato con successo!', 'success');
  };

  const exportToJSON = () => {
    const jsonData = {
      period: selectedPeriod,
      exportDate: new Date().toISOString(),
      expenses: expenseData,
      summary: {
        total: expenseData.reduce((sum, item) => sum + item.value, 0),
        categories: expenseData.length
      }
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statistiche_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    addToast('File JSON scaricato con successo!', 'success');
  };

  const exportChart = async () => {
    if (!chartRef.current) return;
    
    try {
      // Importa html2canvas dinamicamente
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(chartRef.current);
      const url = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `grafico_statistiche_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.png`;
      link.click();
      
      addToast('Grafico esportato come PNG!', 'success');
    } catch (error) {
      addToast('Errore nell\'esportazione del grafico', 'error');
    }
  };

  const handleExport = () => {
    switch (exportSettings.format) {
      case 'CSV':
        exportToCSV();
        break;
      case 'JSON':
        exportToJSON();
        break;
      case 'Excel':
        addToast('Export Excel in sviluppo...', 'info');
        break;
    }
    setShowExportModal(false);
  };

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTotalExpenses = () => expenseData.reduce((sum, item) => sum + item.value, 0);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = getTotalExpenses();
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-gray-800/95 border border-gray-600 rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
            <p className="text-white font-semibold">{data.name}</p>
          </div>
          <p className="text-gray-300">
            Importo: <span className="text-white font-bold">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-gray-300">
            Percentuale: <span className="text-white font-bold">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-6 space-y-6">
      
      {/* Header con controlli */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Statistiche Dettagliate
          </h1>
          <p className="text-gray-400 mt-1">Analisi completa delle tue finanze</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Period Selector */}
          <div className="flex gap-1 bg-gray-800 rounded-xl p-1">
            {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  selectedPeriod === period
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtri
          </button>

          {/* Export Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Esporta
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Impostazioni
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Filtri Avanzati</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chart Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Tipo Grafico</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleChartTypeChange('pie')}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    chartType === 'pie' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Torta
                </button>
                <button
                  onClick={() => handleChartTypeChange('bar')}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    chartType === 'bar' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Barre
                </button>
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Categorie</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'Casa', 'Cibo', 'Trasporti', 'Shopping'].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-3 py-1 rounded-lg text-xs transition ${
                      selectedCategories.includes(category)
                        ? 'bg-purple-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {category === 'all' ? 'Tutte' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <label className="block text-sm font-medium mb-2">Azioni Rapide</label>
              <div className="flex gap-2">
                <button
                  onClick={exportChart}
                  className="px-3 py-2 rounded-lg text-sm bg-green-600 hover:bg-green-700 transition flex items-center gap-1"
                >
                  <Image className="w-4 h-4" />
                  PNG
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-3 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" />
                  CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Impostazioni</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Formato Valuta</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2">
                <option>EUR (€)</option>
                <option>USD ($)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Colori Grafici</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2">
                <option>Colorato</option>
                <option>Monocromatico</option>
                <option>Alto Contrasto</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Expense Chart */}
        <div className="xl:col-span-2 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-700/50" ref={chartRef}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  Spese per Categoria
                </h3>
                <p className="text-gray-400 text-sm">Distribuzione mensile</p>
              </div>
            </div>
            <div className="text-right bg-gray-900/50 p-4 rounded-2xl border border-gray-600/30">
              <p className="text-gray-400 text-sm">Totale periodo</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                {formatCurrency(getTotalExpenses())}
              </p>
            </div>
          </div>
          
          <div className="relative bg-gray-900/30 rounded-2xl p-6 border border-gray-600/20">
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={1}
                    label={({ name, value }) => {
                      const numValue = typeof value === 'number' ? value : 0;
                      const total = getTotalExpenses();
                      const percentage = total > 0 ? ((numValue / total) * 100).toFixed(1) : 0;
                      return `${name}: ${percentage}%`;
                    }}
                    labelLine={false}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              ) : (
                <BarChart data={expenseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    {expenseData.map((entry, index) => (
                      <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.4}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                    stroke="none"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#gradient-${index})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
            
            {/* Chart Type Toggle */}
            <div className="absolute top-4 right-4">
              <div className="flex gap-1 bg-gray-800/80 backdrop-blur-sm rounded-xl p-1 border border-gray-600/30">
                <button
                  onClick={() => handleChartTypeChange('pie')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    chartType === 'pie' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  🍰 Torta
                </button>
                <button
                  onClick={() => handleChartTypeChange('bar')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    chartType === 'bar' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  📊 Barre
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Dettaglio Categorie
              </h3>
              <p className="text-gray-400 text-sm">Analisi per categoria</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {expenseData.map((expense, index) => {
              const IconComponent = expense.icon;
              return (
                <div 
                  key={expense.name} 
                  className="group relative overflow-hidden bg-gradient-to-r from-gray-700/30 to-gray-700/10 p-4 rounded-2xl hover:from-gray-700/50 hover:to-gray-700/20 transition-all duration-300 border border-gray-600/20 hover:border-gray-500/30"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Background glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl"
                    style={{ backgroundColor: expense.color }}
                  ></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-gray-600/30"
                        style={{ 
                          backgroundColor: `${expense.color}20`,
                          boxShadow: `0 0 20px ${expense.color}30`
                        }}
                      >
                        <IconComponent 
                          className="w-5 h-5" 
                          style={{ color: expense.color }} 
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-white text-lg">{expense.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div 
                            className="w-3 h-3 rounded-full shadow-sm"
                            style={{ 
                              backgroundColor: expense.color,
                              boxShadow: `0 0 8px ${expense.color}60`
                            }}
                          ></div>
                          <span className="text-gray-400 text-sm">{expense.percentage}% del totale</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div 
                        className="font-bold text-xl"
                        style={{ color: expense.color }}
                      >
                        {formatCurrency(expense.value)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {expense.percentage}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ 
                        width: `${expense.percentage}%`,
                        backgroundColor: expense.color,
                        boxShadow: `0 0 10px ${expense.color}60`
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Summary Card */}
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-900/60 to-gray-800/60 rounded-2xl border border-gray-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Totale Spese</p>
                  <p className="text-white font-bold text-lg">{formatCurrency(getTotalExpenses())}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Periodo</p>
                <p className="text-white font-semibold">{selectedPeriod}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Esporta Dati</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Formato</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CSV', 'JSON', 'Excel'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setExportSettings(prev => ({ ...prev, format }))}
                      className={`p-3 rounded-lg text-sm transition flex items-center justify-center gap-2 ${
                        exportSettings.format === format
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {format === 'CSV' && <FileText className="w-4 h-4" />}
                      {format === 'JSON' && <Database className="w-4 h-4" />}
                      {format === 'Excel' && <FileText className="w-4 h-4" />}
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeCharts}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, includeCharts: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Includi grafici (se supportato)</span>
                </label>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Periodo</label>
                <select
                  value={exportSettings.dateRange}
                  onChange={(e) => setExportSettings(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                >
                  <option value="1M">Ultimo mese</option>
                  <option value="3M">Ultimi 3 mesi</option>
                  <option value="6M">Ultimi 6 mesi</option>
                  <option value="1Y">Ultimo anno</option>
                  <option value="ALL">Tutto</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
              >
                Annulla
              </button>
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Esporta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;