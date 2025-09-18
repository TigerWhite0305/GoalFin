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

  // Theme colors - seguendo il nostro design system
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro
        background: "bg-gray-900",
        card: "bg-gray-800",
        text: {
          primary: "text-gray-50",
          secondary: "text-gray-300", 
          muted: "text-gray-400",
          subtle: "text-gray-500"
        },
        border: "border-gray-700",
        hover: "hover:bg-gray-800"
      };
    } else {
      return {
        // ☀️ Tema Chiaro  
        background: "bg-white",
        card: "bg-gray-50",
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-700",
          muted: "text-gray-600",
          subtle: "text-gray-500"
        },
        border: "border-gray-200",
        hover: "hover:bg-gray-100"
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
    <div className={`${theme.background} flex flex-col gap-3 p-4 rounded-2xl h-full shadow-2xl`}>
      
      {/* Header */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
        <h2 className={`${theme.text.primary} text-lg font-bold flex items-center gap-2`}>
          <TrendingDown className="w-5 h-5 text-red-500" />
          Grafico Uscite
        </h2>
        <button className={`${theme.card} ${theme.hover} ${theme.text.primary} px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 border ${theme.border} w-full xs:w-auto justify-center xs:justify-start`}>
          <Calendar className="w-3 h-3" />
          {selectedMonth}
        </button>
      </div>

      {/* Contenuto principale - Responsive layout */}
      <div className="flex flex-col lg:flex-row h-full gap-4 items-center">
        
        {/* Grafico ad anello - Responsive size */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 flex-shrink-0 mx-auto lg:mx-0">
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

          {/* Totale al centro - Responsive text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xs sm:text-sm ${theme.text.muted} mb-1`}>Totale Spese</span>
            <span className={`text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent`}>
              {formatCurrency(total).replace('.00', '')}
            </span>
            <span className={`text-xs ${theme.text.subtle} mt-0.5`}>{selectedMonth} 2025</span>
          </div>
        </div>

        {/* Lista categorie - Ultra responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 flex-1 w-full">
          {categories.map((cat) => {
            const perc = ((cat.value / total) * 100).toFixed(0);
            return (
              <div 
                key={cat.name} 
                className={`flex flex-col items-start ${theme.hover} p-2 sm:p-3 rounded-lg transition-colors cursor-pointer group min-w-0`}
              >
                {/* Nome categoria - Truncate long names */}
                <span className={`mb-1.5 ${theme.text.secondary} text-sm font-medium group-hover:${theme.text.primary} transition-colors truncate w-full`}>
                  {cat.name}
                </span>

                {/* Riga con barra e dettagli */}
                <div className="flex items-center gap-2 w-full min-w-0">
                  {/* Barra verticale compatta */}
                  <div 
                    className="w-1 h-6 sm:h-8 rounded-full group-hover:w-1.5 transition-all flex-shrink-0" 
                    style={{ backgroundColor: cat.color }} 
                  />

                  {/* Dettagli */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className={`font-bold text-base sm:text-lg ${theme.text.primary}`}>{perc}%</span>
                    <span className={`text-xs ${theme.text.muted} truncate`}>
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