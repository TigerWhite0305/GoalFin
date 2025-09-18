// src/components/statistics/MonthlyAreaChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Wallet, Target } from "lucide-react";

interface PatrimonioData {
  month: string;
  conti: number;
  investimenti: number;
  totale: number;
  obiettivo: number;
}

interface MonthlyAreaChartProps {
  formatCurrency: (amount: number) => string;
}

const MonthlyAreaChart: React.FC<MonthlyAreaChartProps> = ({ formatCurrency }) => {
  const patrimonioData: PatrimonioData[] = [
    { month: 'Gen', conti: 15000, investimenti: 12000, totale: 27000, obiettivo: 30000 },
    { month: 'Feb', conti: 15800, investimenti: 12400, totale: 28200, obiettivo: 30000 },
    { month: 'Mar', conti: 16200, investimenti: 11800, totale: 28000, obiettivo: 30000 },
    { month: 'Apr', conti: 17100, investimenti: 13200, totale: 30300, obiettivo: 32000 },
    { month: 'Mag', conti: 17600, investimenti: 13600, totale: 31200, obiettivo: 32000 },
    { month: 'Giu', conti: 18131, investimenti: 14200, totale: 32331, obiettivo: 34000 },
    { month: 'Lug', conti: 18650, investimenti: 14800, totale: 33450, obiettivo: 34000 },
    { month: 'Ago', conti: 19100, investimenti: 14100, totale: 33200, obiettivo: 34000 },
    { month: 'Set', conti: 19580, investimenti: 15305, totale: 34885, obiettivo: 36000 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800/95 border border-gray-600/50 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
          <p className="text-white font-bold mb-3 text-center border-b border-gray-600/30 pb-2">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Conti</span>
              </div>
              <span className="font-bold text-blue-400">{formatCurrency(data.conti)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300 text-sm">Investimenti</span>
              </div>
              <span className="font-bold text-purple-400">{formatCurrency(data.investimenti)}</span>
            </div>
            <div className="border-t border-gray-600/30 pt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-medium">Totale</span>
                </div>
                <span className="font-bold text-emerald-400 text-lg">{formatCurrency(data.totale)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 text-xs">Obiettivo</span>
              <span className="text-gray-300 text-sm">{formatCurrency(data.obiettivo)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calcola crescita
  const latestData = patrimonioData[patrimonioData.length - 1];
  const firstData = patrimonioData[0];
  const crescitaTotale = latestData.totale - firstData.totale;
  const crescitaPercentuale = ((crescitaTotale / firstData.totale) * 100).toFixed(1);
  const progressoObiettivo = ((latestData.totale / latestData.obiettivo) * 100).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Crescita Patrimonio
            </h3>
            <p className="text-gray-400 text-sm">Evoluzione nel tempo</p>
          </div>
        </div>
        
        <div className="text-right bg-gray-900/50 p-4 rounded-2xl border border-gray-600/30">
          <p className="text-gray-400 text-sm">Patrimonio totale</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {formatCurrency(latestData.totale)}
          </p>
          <p className="text-emerald-300 text-sm">+{formatCurrency(crescitaTotale)} (+{crescitaPercentuale}%)</p>
        </div>
      </div>

      <div className="relative bg-gray-900/30 rounded-2xl p-6 border border-gray-600/20">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={patrimonioData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="contiAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="investimentiAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="totaleAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
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
              domain={['dataMin - 1000', 'dataMax + 2000']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="conti"
              stackId="1"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#contiAreaGradient)"
              name="Conti"
            />
            <Area
              type="monotone"
              dataKey="investimenti"
              stackId="1"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#investimentiAreaGradient)"
              name="Investimenti"
            />
            
            {/* Linea obiettivo */}
            <Area
              type="monotone"
              dataKey="obiettivo"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeDasharray="8 4"
              fill="none"
              name="Obiettivo"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Legenda */}
        <div className="flex justify-center mt-4 gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded shadow-lg"></div>
            <span className="text-blue-300 text-sm font-medium">Conti Correnti</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded shadow-lg"></div>
            <span className="text-purple-300 text-sm font-medium">Investimenti</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-yellow-500 rounded" style={{ clipPath: 'polygon(0 0, 80% 0, 100% 100%, 20% 100%)' }}></div>
            <span className="text-yellow-300 text-sm font-medium">Obiettivo</span>
          </div>
        </div>
      </div>

      {/* Progress bar verso obiettivo */}
      <div className="mt-6 bg-gray-900/60 rounded-2xl p-4 border border-gray-600/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Progresso verso obiettivo</span>
          </div>
          <span className="text-yellow-400 font-bold">{progressoObiettivo}%</span>
        </div>
        
        <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ 
              width: `${Math.min(parseFloat(progressoObiettivo), 100)}%`,
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
            }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{formatCurrency(latestData.totale)}</span>
          <span>{formatCurrency(latestData.obiettivo)}</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAreaChart;