// src/components/statistics/SpendingHeatmap.tsx
import React, { useState } from 'react';
import { Calendar, Activity, TrendingDown, DollarSign } from "lucide-react";

interface DayData {
  day: number;
  amount: number;
  transactions: number;
  date: string;
}

interface SpendingHeatmapProps {
  formatCurrency: (amount: number) => string;
}

const SpendingHeatmap: React.FC<SpendingHeatmapProps> = ({ formatCurrency }) => {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  // Genera dati casuali per il mese corrente
  const generateMonthData = (): DayData[] => {
    const daysInMonth = 30;
    const data: DayData[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isWeekend = day % 7 === 0 || day % 7 === 6;
      const baseAmount = isWeekend ? 150 : 80;
      const variation = Math.random() * 200;
      const amount = Math.round(baseAmount + variation);
      const transactions = Math.floor(Math.random() * 8) + 1;
      
      data.push({
        day,
        amount,
        transactions,
        date: `2025-09-${day.toString().padStart(2, '0')}`
      });
    }
    
    return data;
  };

  const monthData = generateMonthData();
  
  // Calcola intensità colore basata sull'importo
  const getIntensity = (amount: number): number => {
    const maxAmount = Math.max(...monthData.map(d => d.amount));
    return (amount / maxAmount) * 100;
  };

  const getColorClass = (intensity: number): string => {
    if (intensity < 20) return 'bg-gray-700/30 border-gray-600/20';
    if (intensity < 40) return 'bg-yellow-500/20 border-yellow-500/30';
    if (intensity < 60) return 'bg-orange-500/30 border-orange-500/40';
    if (intensity < 80) return 'bg-red-500/40 border-red-500/50';
    return 'bg-red-600/60 border-red-600/70';
  };

  const getTextColor = (intensity: number): string => {
    if (intensity < 20) return 'text-gray-400';
    if (intensity < 40) return 'text-yellow-300';
    if (intensity < 60) return 'text-orange-300';
    if (intensity < 80) return 'text-red-300';
    return 'text-red-200';
  };

  // Statistiche del mese
  const totalSpent = monthData.reduce((sum, day) => sum + day.amount, 0);
  const avgDaily = totalSpent / monthData.length;
  const maxDay = monthData.reduce((max, day) => day.amount > max.amount ? day : max);
  const totalTransactions = monthData.reduce((sum, day) => sum + day.transactions, 0);

  // Giorni della settimana
  const weekDays = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-700/50 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Calendario Spese
            </h3>
            <p className="text-gray-400 text-sm">Heatmap giornaliera</p>
          </div>
        </div>
        
        <div className="text-right bg-gray-900/50 p-4 rounded-2xl border border-gray-600/30">
          <p className="text-gray-400 text-sm">Media giornaliera</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            {formatCurrency(avgDaily)}
          </p>
          <p className="text-gray-300 text-sm">{totalTransactions} transazioni</p>
        </div>
      </div>

      <div className="relative bg-gray-900/30 rounded-2xl p-6 border border-gray-600/20">
        
        {/* Header giorni settimana */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center text-gray-400 text-sm font-medium p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Griglia calendario */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {monthData.map((dayData) => {
            const intensity = getIntensity(dayData.amount);
            const isSelected = selectedDay?.day === dayData.day;
            
            return (
              <div
                key={dayData.day}
                onClick={() => setSelectedDay(dayData)}
                className={`
                  relative h-16 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  flex flex-col items-center justify-center
                  hover:scale-105 hover:shadow-lg
                  ${getColorClass(intensity)}
                  ${isSelected ? 'ring-2 ring-blue-400 ring-opacity-75' : ''}
                `}
                style={{
                  boxShadow: intensity > 60 ? `0 0 15px rgba(239, 68, 68, ${intensity / 200})` : undefined
                }}
              >
                <span className={`text-lg font-bold ${getTextColor(intensity)}`}>
                  {dayData.day}
                </span>
                <span className="text-xs text-gray-400">
                  {formatCurrency(dayData.amount).replace('€', '').replace(',00', '')}€
                </span>
                
                {/* Indicatore transazioni */}
                <div className="absolute top-1 right-1">
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(dayData.transactions, 3) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white/40"
                      ></div>
                    ))}
                    {dayData.transactions > 3 && (
                      <span className="text-xs text-white/60 ml-1">+</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legenda intensità */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-gray-400 text-sm">Meno</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-gray-700/30 border border-gray-600/20"></div>
            <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30"></div>
            <div className="w-4 h-4 rounded bg-orange-500/30 border border-orange-500/40"></div>
            <div className="w-4 h-4 rounded bg-red-500/40 border border-red-500/50"></div>
            <div className="w-4 h-4 rounded bg-red-600/60 border border-red-600/70"></div>
          </div>
          <span className="text-gray-400 text-sm">Più</span>
        </div>

        {/* Dettagli giorno selezionato */}
        {selectedDay && (
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-600/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-white">
                {selectedDay.day} Settembre 2025
              </h4>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 text-sm font-medium">Spese totali</span>
                </div>
                <p className="text-red-400 text-xl font-bold">{formatCurrency(selectedDay.amount)}</p>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 text-sm font-medium">Transazioni</span>
                </div>
                <p className="text-blue-400 text-xl font-bold">{selectedDay.transactions}</p>
              </div>
            </div>
            
            <div className="mt-3 text-center">
              <span className="text-gray-400 text-sm">
                Media per transazione: <span className="text-white font-medium">
                  {formatCurrency(selectedDay.amount / selectedDay.transactions)}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Statistiche mensili */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-600/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <span className="text-gray-300 text-sm font-medium">Totale Mese</span>
          </div>
          <p className="text-red-400 text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          <p className="text-gray-400 text-xs mt-1">in {monthData.length} giorni</p>
        </div>
        
        <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-600/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-orange-400" />
            <span className="text-gray-300 text-sm font-medium">Giorno Max</span>
          </div>
          <p className="text-orange-400 text-2xl font-bold">{formatCurrency(maxDay.amount)}</p>
          <p className="text-gray-400 text-xs mt-1">il {maxDay.day} Settembre</p>
        </div>
        
        <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-600/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300 text-sm font-medium">Media/Giorno</span>
          </div>
          <p className="text-blue-400 text-2xl font-bold">{formatCurrency(avgDaily)}</p>
          <p className="text-gray-400 text-xs mt-1">{(totalTransactions / monthData.length).toFixed(1)} transazioni</p>
        </div>
      </div>
    </div>
  );
};

export default SpendingHeatmap;