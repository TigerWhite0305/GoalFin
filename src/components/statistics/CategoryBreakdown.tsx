// src/components/statistics/CategoryBreakdown.tsx
import React from 'react';
import { Activity, DollarSign } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  icon: React.ComponentType<any>;
}

interface CategoryBreakdownProps {
  data: ChartData[];
  formatCurrency: (amount: number) => string;
  getTotalExpenses: () => number;
  selectedPeriod: string;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  data,
  formatCurrency,
  getTotalExpenses,
  selectedPeriod
}) => {
  return (
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
        {data.map((expense, index) => {
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
  );
};

export default CategoryBreakdown;