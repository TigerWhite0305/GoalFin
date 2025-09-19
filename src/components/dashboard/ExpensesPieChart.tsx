import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Calendar, TrendingDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface Category {
  name: string;
  value: number;
  color: string;
}

export const ExpensesPieChart: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("Settembre");
  const { isDarkMode } = useTheme();
  
  const categories: Category[] = [
    { name: "Affitto", value: 350, color: "#4C6FFF" },
    { name: "Cibo", value: 200, color: "#FF6B6B" },
    { name: "Trasporti", value: 100, color: "#FFD93D" },
    { name: "Intrattenimento", value: 150, color: "#6BCB77" },
    { name: "Salute", value: 100, color: "#FF9F1C" },
    { name: "Altro", value: 124, color: "#9B5DE5" },
  ];

  const total = categories.reduce((acc, cat) => acc + cat.value, 0);

  // Theme colors seguendo il design system GoalFin
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro
        background: "bg-gray-900",
        card: "bg-gray-800/40",
        text: {
          primary: "text-gray-50", // #F9FAFB
          secondary: "text-gray-300", // #D1D5DB
          muted: "text-gray-400", // #6B7280
          subtle: "text-gray-500" // #9CA3AF
        },
        border: "border-gray-700/30",
        hover: "hover:bg-gray-700/40"
      };
    } else {
      return {
        // ☀️ Tema Chiaro  
        background: "bg-white", // #FEFEFE
        card: "bg-gray-50/60", // #F8FAFC
        text: {
          primary: "text-gray-900", // #0F172A
          secondary: "text-gray-700", // #334155
          muted: "text-gray-600", // #64748B
          subtle: "text-gray-500"
        },
        border: "border-gray-200/50",
        hover: "hover:bg-gray-100/80"
      };
    }
  };

  const theme = getThemeColors();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Tooltip personalizzato con tema
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className={`${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-200'} bg-opacity-95 backdrop-blur-md border rounded-lg p-3 shadow-2xl`}>
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.payload.color }}
            />
            <span className={`${theme.text.primary} font-medium text-sm`}>{data.name}</span>
          </div>
          <div className={theme.text.primary}>
            <div className="font-semibold text-sm">{formatCurrency(data.value)}</div>
            <div className={`${theme.text.muted} text-xs`}>{percentage}% del totale</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${theme.background} ${theme.border} border rounded-2xl p-4 transition-colors duration-300 backdrop-blur-sm h-full flex flex-col`}>
      
      {/* Header compatto */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h3 className={`${theme.text.primary} text-base md:text-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent`}>
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          <span className="hidden sm:inline">Grafico Uscite</span>
          <span className="sm:hidden">Uscite</span>
        </h3>
        <button className={`${theme.card} ${theme.hover} ${theme.text.primary} px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 border ${theme.border} w-full sm:w-auto justify-center sm:justify-start`}>
          <Calendar className="w-3 h-3" />
          {selectedMonth}
        </button>
      </div>

      {/* Layout SEMPRE verticale - grafico sopra, categorie sotto */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Grafico responsive - sempre centrato */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 mx-auto flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="90%"
                innerRadius="65%"
                paddingAngle={2}
                strokeWidth={0}
              >
                {categories.map((entry) => (
                  <Cell 
                    key={entry.name} 
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Totale al centro responsive */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xs ${theme.text.muted} mb-0.5`}>Totale</span>
            <span className={`text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent`}>
              {formatCurrency(total).replace('.00', '')}
            </span>
            <span className={`text-xs ${theme.text.subtle}`}>{selectedMonth}</span>
          </div>
        </div>

        {/* Lista categorie - 2 colonne mobile, 3 colonne tablet+ */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {categories.map((cat) => {
            const perc = ((cat.value / total) * 100).toFixed(0);
            return (
              <div 
                key={cat.name} 
                className={`flex items-center gap-2 ${theme.hover} p-2 md:p-3 rounded-lg transition-colors cursor-pointer group`}
              >
                <div 
                  className="w-1 h-6 md:h-8 rounded-full flex-shrink-0 group-hover:w-1.5 transition-all" 
                  style={{ backgroundColor: cat.color }} 
                />
                <div className="min-w-0 flex-1">
                  <div className={`text-xs md:text-sm font-medium ${theme.text.secondary} truncate mb-0.5 group-hover:${theme.text.primary} transition-colors`}>
                    {cat.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`font-semibold text-sm md:text-base ${theme.text.primary}`}>{perc}%</span>
                    <span className={`text-xs ${theme.text.muted}`}>
                      {formatCurrency(cat.value).replace('.00', '')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};