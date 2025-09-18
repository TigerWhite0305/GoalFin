// src/components/statistics/TrendsLineChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

interface TrendData {
  month: string;
  entrate: number;
  uscite: number;
  bilancio: number;
  risparmio: number;
}

interface TrendsLineChartProps {
  formatCurrency: (amount: number) => string;
  selectedPeriod: string;
}

const TrendsLineChart: React.FC<TrendsLineChartProps> = ({
  formatCurrency,
  selectedPeriod
}) => {
  // Dati di esempio per i trend
  const trendData: TrendData[] = [
    { month: 'Gen', entrate: 3200, uscite: 2400, bilancio: 800, risparmio: 600 },
    { month: 'Feb', entrate: 3400, uscite: 2600, bilancio: 800, risparmio: 650 },
    { month: 'Mar', entrate: 3100, uscite: 2800, bilancio: 300, risparmio: 400 },
    { month: 'Apr', entrate: 3600, uscite: 2500, bilancio: 1100, risparmio: 800 },
    { month: 'Mag', entrate: 3300, uscite: 2700, bilancio: 600, risparmio: 550 },
    { month: 'Giu', entrate: 3500, uscite: 2450, bilancio: 1050, risparmio: 750 },
    { month: 'Lug', entrate: 3400, uscite: 2650, bilancio: 750, risparmio: 650 },
    { month: 'Ago', entrate: 3200, uscite: 2800, bilancio: 400, risparmio: 500 },
    { month: 'Set', entrate: 3700, uscite: 2400, bilancio: 1300, risparmio: 900 },
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 border border-gray-600/50 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-white font-bold mb-3 text-center border-b border-gray-600/30 pb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-gray-300 text-sm capitalize">{entry.dataKey}</span>
                </div>
                <span 
                  className="font-bold text-sm"
                  style={{ color: entry.color }}
                >
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calcola statistiche
  const latestData = trendData[trendData.length - 1];
  const previousData = trendData[trendData.length - 2];
  const bilancioChange = latestData.bilancio - previousData.bilancio;
  const isPositive = bilancioChange >= 0;

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-700/50 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Trend Finanziario
            </h3>
            <p className="text-gray-400 text-sm">Andamento entrate vs uscite</p>
          </div>
        </div>
        
        {/* Indicatore bilancio */}
        <div className="text-right bg-gray-900/50 p-4 rounded-2xl border border-gray-600/30">
          <p className="text-gray-400 text-sm">Bilancio corrente</p>
          <p className={`text-2xl font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(latestData.bilancio)}
          </p>
          <p className={`text-sm ${isPositive ? 'text-emerald-300' : 'text-red-300'}`}>
            {isPositive ? '+' : ''}{formatCurrency(bilancioChange)} vs mese scorso
          </p>
        </div>
      </div>

      <div className="relative bg-gray-900/30 rounded-2xl p-6 border border-gray-600/20">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="entrateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="usciteGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="bilancioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="month" 
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
            
            {/* Linee principali */}
            <Line 
              type="monotone" 
              dataKey="entrate" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
              name="Entrate"
            />
            <Line 
              type="monotone" 
              dataKey="uscite" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#EF4444', stroke: '#fff', strokeWidth: 2 }}
              name="Uscite"
            />
            <Line 
              type="monotone" 
              dataKey="bilancio" 
              stroke="#3B82F6" 
              strokeWidth={4}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 8 }}
              activeDot={{ r: 10, fill: '#3B82F6', stroke: '#fff', strokeWidth: 3 }}
              name="Bilancio"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Legenda personalizzata */}
        <div className="flex justify-center mt-4 gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg"></div>
            <span className="text-emerald-300 text-sm font-medium">Entrate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg"></div>
            <span className="text-red-300 text-sm font-medium">Uscite</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500 shadow-lg" style={{ clipPath: 'polygon(0 0, 60% 0, 100% 100%, 40% 100%)' }}></div>
            <span className="text-blue-300 text-sm font-medium">Bilancio</span>
          </div>
        </div>
      </div>

      {/* Mini statistiche */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
          <p className="text-emerald-400 text-lg font-bold">{formatCurrency(latestData.entrate)}</p>
          <p className="text-emerald-300 text-xs">Entrate correnti</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
          <p className="text-red-400 text-lg font-bold">{formatCurrency(latestData.uscite)}</p>
          <p className="text-red-300 text-xs">Uscite correnti</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-center">
          <p className="text-blue-400 text-lg font-bold">{formatCurrency(latestData.risparmio)}</p>
          <p className="text-blue-300 text-xs">Risparmio mensile</p>
        </div>
      </div>
    </div>
  );
};

export default TrendsLineChart;