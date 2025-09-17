// src/pages/Statistics.tsx
import React, { useState, useRef } from "react";
import { Heart, Home, Car, Gamepad2, ShoppingCart, DollarSign, FileText, Image } from "lucide-react";
import { useToast } from "../context/ToastContext";

// Import dei componenti separati
import StatisticsHeader from "../components/statistics/StatisticsHeader";
import ExpenseChart from "../components/statistics/ExpenseChart";
import CategoryBreakdown from "../components/statistics/CategoryBreakdown";
import ExportModal from "../components/statistics/ExportModal";

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
    const baseExpenseData = [
      { name: "Casa", value: 1200, color: "#4C6FFF", icon: Home },
      { name: "Cibo", value: 650, color: "#FF6B6B", icon: DollarSign },
      { name: "Trasporti", value: 420, color: "#FFD93D", icon: Car },
      { name: "Intrattenimento", value: 380, color: "#6BCB77", icon: Gamepad2 },
      { name: "Salute", value: 280, color: "#FF9F1C", icon: Heart },
      { name: "Shopping", value: 320, color: "#9B5DE5", icon: ShoppingCart },
      { name: "Altro", value: 150, color: "#06D6A0", icon: DollarSign },
    ];

    const periodMultiplier = selectedPeriod === '1M' ? 0.5 : 
                            selectedPeriod === '3M' ? 0.8 : 
                            selectedPeriod === '6M' ? 1 : 
                            selectedPeriod === '1Y' ? 1.5 : 2;

    const filteredData = baseExpenseData.map(item => ({
      ...item,
      value: Math.round(item.value * periodMultiplier)
    }));

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
      
      {/* Header */}
      <StatisticsHeader
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onShowExportModal={() => setShowExportModal(true)}
      />

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
        <ExpenseChart
          ref={chartRef}
          data={expenseData}
          chartType={chartType}
          onChartTypeChange={handleChartTypeChange}
          formatCurrency={formatCurrency}
          getTotalExpenses={getTotalExpenses}
          customTooltip={CustomTooltip}
        />

        <CategoryBreakdown
          data={expenseData}
          formatCurrency={formatCurrency}
          getTotalExpenses={getTotalExpenses}
          selectedPeriod={selectedPeriod}
        />
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        exportSettings={exportSettings}
        onUpdateSettings={setExportSettings}
        onExport={handleExport}
      />
    </div>
  );
};

export default Statistics;