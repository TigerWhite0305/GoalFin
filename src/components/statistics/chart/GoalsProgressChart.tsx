// src/components/statistics/GoalsProgressChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Target, Calendar, TrendingUp, Award, Clock } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  deadline: string;
  priority: 'alta' | 'media' | 'bassa';
  category: string;
  monthlyContribution: number;
  color: string;
  icon: React.ComponentType<any>;
}

interface GoalsProgressChartProps {
  formatCurrency: (amount: number) => string;
}

const GoalsProgressChart: React.FC<GoalsProgressChartProps> = ({ formatCurrency }) => {
  const goals: Goal[] = [
    {
      id: '1',
      name: 'Vacanza Giappone',
      current: 3800,
      target: 4500,
      deadline: '2025-12-31',
      priority: 'alta',
      category: 'viaggio',
      monthlyContribution: 300,
      color: '#3B82F6',
      icon: Target
    },
    {
      id: '2',
      name: 'MacBook Pro',
      current: 1650,
      target: 2500,
      deadline: '2025-11-30',
      priority: 'media',
      category: 'tecnologia',
      monthlyContribution: 200,
      color: '#8B5CF6',
      icon: Target
    },
    {
      id: '3',
      name: 'Fondo Emergenza',
      current: 2200,
      target: 5000,
      deadline: '2026-06-30',
      priority: 'alta',
      category: 'emergenze',
      monthlyContribution: 400,
      color: '#10B981',
      icon: Target
    },
    {
      id: '4',
      name: 'Auto Nuova',
      current: 8500,
      target: 15000,
      deadline: '2026-03-31',
      priority: 'bassa',
      category: 'auto',
      monthlyContribution: 500,
      color: '#F59E0B',
      icon: Target
    }
  ];

  // Calcola dati per il grafico
  const chartData = goals.map(goal => {
    const percentage = (goal.current / goal.target) * 100;
    const remaining = goal.target - goal.current;
    const monthsToDeadline = Math.ceil(
      (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const onTrack = remaining <= (goal.monthlyContribution * monthsToDeadline);
    
    return {
      ...goal,
      percentage: Math.round(percentage),
      remaining,
      monthsToDeadline,
      onTrack,
      displayName: goal.name.length > 12 ? goal.name.substring(0, 12) + '...' : goal.name
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800/95 border border-gray-600/50 rounded-2xl p-5 shadow-2xl backdrop-blur-sm min-w-[280px]">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-600/30 pb-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${data.color}20`, border: `1px solid ${data.color}40` }}
            >
              <data.icon className="w-5 h-5" style={{ color: data.color }} />
            </div>
            <div>
              <p className="text-white font-bold">{data.name}</p>
              <p className="text-gray-400 text-sm capitalize">{data.category}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Progresso:</span>
              <span className="font-bold" style={{ color: data.color }}>
                {data.percentage}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Attuale:</span>
              <span className="text-white font-medium">{formatCurrency(data.current)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Obiettivo:</span>
              <span className="text-white font-medium">{formatCurrency(data.target)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Mancante:</span>
              <span className="text-red-300 font-medium">{formatCurrency(data.remaining)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Scadenza:</span>
              <span className="text-gray-200">{new Date(data.deadline).toLocaleDateString('it-IT')}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Mensile:</span>
              <span className="text-blue-300">{formatCurrency(data.monthlyContribution)}</span>
            </div>
            
            <div className="pt-2 border-t border-gray-600/30">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${data.onTrack ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`text-sm font-medium ${data.onTrack ? 'text-green-300' : 'text-red-300'}`}>
                  {data.onTrack ? 'In linea con obiettivo' : 'Ritardo sul programma'}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'media': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'bassa': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Statistiche generali
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalMonthly = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;
  const goalsOnTrack = chartData.filter(goal => goal.onTrack).length;

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Progresso Obiettivi
            </h3>
            <p className="text-gray-400 text-sm">Stato avanzamento risparmi</p>
          </div>
        </div>
        
        <div className="text-right bg-gray-900/50 p-4 rounded-2xl border border-gray-600/30">
          <p className="text-gray-400 text-sm">Progresso complessivo</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {overallProgress.toFixed(1)}%
          </p>
          <p className="text-gray-300 text-sm">{goalsOnTrack}/{goals.length} obiettivi in linea</p>
        </div>
      </div>

      <div className="relative bg-gray-900/30 rounded-2xl p-6 border border-gray-600/20">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              {chartData.map((goal, index) => (
                <linearGradient key={`gradient-${index}`} id={`goalGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={goal.color} stopOpacity={0.9}/>
                  <stop offset="100%" stopColor={goal.color} stopOpacity={0.4}/>
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="displayName" 
              stroke="#9CA3AF" 
              fontSize={11}
              tick={{ fill: '#9CA3AF' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={12}
              tick={{ fill: '#9CA3AF' }}
              domain={[0, 100]}
              label={{ value: 'Progresso (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar 
              dataKey="percentage" 
              radius={[8, 8, 0, 0]}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#goalGradient-${index})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lista obiettivi con dettagli - Layout a griglia */}
      <div className="mt-6">
        <h4 className="text-lg font-bold text-white mb-4">Dettaglio Obiettivi</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {chartData.map((goal) => (
            <div key={goal.id} className="bg-gray-800/50 rounded-xl p-3 border border-gray-600/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${goal.color}20`, border: `1px solid ${goal.color}40` }}
                  >
                    <goal.icon className="w-3 h-3" style={{ color: goal.color }} />
                  </div>
                  <div>
                    <h5 className="text-white font-semibold text-sm">{goal.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-xs border ${getPriorityColor(goal.priority)}`}>
                        {goal.priority.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{goal.monthsToDeadline}m</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-base font-bold" style={{ color: goal.color }}>
                    {goal.percentage}%
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatCurrency(goal.current)}
                  </p>
                </div>
              </div>
              
              {/* Progress bar compatta */}
              <div className="mb-2">
                <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${goal.percentage}%`,
                      backgroundColor: goal.color,
                      boxShadow: `0 0 8px ${goal.color}60`
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">
                    Target: <span className="text-white">{formatCurrency(goal.target)}</span>
                  </span>
                  <span className="text-gray-400">
                    Mensile: <span className="text-blue-300">{formatCurrency(goal.monthlyContribution)}</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${goal.onTrack ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className={`text-xs ${goal.onTrack ? 'text-green-300' : 'text-red-300'}`}>
                    {goal.onTrack ? 'OK' : 'Ritardo'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiche finali */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-600/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="text-gray-300 text-sm font-medium">Totale Risparmiato</span>
          </div>
          <p className="text-emerald-400 text-2xl font-bold">{formatCurrency(totalSaved)}</p>
          <p className="text-gray-400 text-xs mt-1">su {formatCurrency(totalTarget)}</p>
        </div>
        
        <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-600/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300 text-sm font-medium">Impegno Mensile</span>
          </div>
          <p className="text-blue-400 text-2xl font-bold">{formatCurrency(totalMonthly)}</p>
          <p className="text-gray-400 text-xs mt-1">verso tutti gli obiettivi</p>
        </div>
        
        <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-600/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-300 text-sm font-medium">In Linea</span>
          </div>
          <p className="text-yellow-400 text-2xl font-bold">{goalsOnTrack}/{goals.length}</p>
          <p className="text-gray-400 text-xs mt-1">obiettivi raggiungibili</p>
        </div>
      </div>
    </div>
  );
};

export default GoalsProgressChart;