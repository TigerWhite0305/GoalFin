import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Calendar, TrendingDown } from "lucide-react";

interface Category {
  name: string;
  value: number;
  color: string;
}

export const ExpensesPieChart: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("Settembre");
  
  const categories: Category[] = [
    { name: "Affitto", value: 350, color: "#4C6FFF" },
    { name: "Cibo", value: 200, color: "#FF6B6B" },
    { name: "Trasporti", value: 100, color: "#FFD93D" },
    { name: "Intrattenimento", value: 150, color: "#6BCB77" },
    { name: "Salute", value: 100, color: "#FF9F1C" },
    { name: "Altro", value: 124, color: "#9B5DE5" },
  ];

  const total = categories.reduce((acc, cat) => acc + cat.value, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Tooltip personalizzato
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-gray-900 bg-opacity-95 backdrop-blur-md border border-gray-600 rounded-xl p-3 shadow-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="text-white font-medium">{data.name}</span>
          </div>
          <div className="text-white text-sm">
            <div className="font-bold">{formatCurrency(data.value)}</div>
            <div className="text-gray-300">{percentage}% del totale</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 lg:p-6 rounded-3xl bg-gray-900 h-full shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center gap-3">
          <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
          Grafico Uscite
        </h2>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-sm sm:text-lg font-medium transition flex items-center gap-2 border border-gray-700 w-full sm:w-auto justify-center sm:justify-start">
          <Calendar className="w-4 h-4" />
          {selectedMonth}
        </button>
      </div>

      {/* Contenuto principale */}
      <div className="flex flex-col lg:flex-row h-full gap-6 lg:gap-8 items-center">
        {/* Grafico ad anello */}
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex-shrink-0 mx-auto lg:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="100%"
                innerRadius="65%"
                paddingAngle={3}
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

          {/* Totale al centro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <span className="text-sm sm:text-lg text-gray-400 mb-1">Totale Spese</span>
            <span className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              {formatCurrency(total)}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 mt-1">{selectedMonth} 2025</span>
          </div>
        </div>

        {/* Tabella categorie responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 flex-1 w-full">
          {categories.map((cat) => {
            const perc = ((cat.value / total) * 100).toFixed(0);
            return (
              <div key={cat.name} className="flex flex-col items-start text-white hover:bg-gray-800 p-3 sm:p-4 rounded-xl transition-colors cursor-pointer group">
                {/* Nome categoria */}
                <span className="mb-2 text-gray-300 text-base sm:text-lg group-hover:text-white transition-colors">
                  {cat.name}
                </span>

                {/* Riga con barra verticale e dettagli */}
                <div className="flex items-center gap-3 w-full">
                  {/* Barra verticale */}
                  <div 
                    className="w-1 h-8 sm:h-10 rounded-full group-hover:w-2 transition-all" 
                    style={{ backgroundColor: cat.color }} 
                  />

                  {/* Dettagli */}
                  <div className="flex flex-col">
                    <span className="font-bold text-xl sm:text-2xl">{perc}%</span>
                    <span className="text-xs sm:text-sm text-gray-400">
                      {formatCurrency(cat.value)}
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