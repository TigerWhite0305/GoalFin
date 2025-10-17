// src/components/ui/portfolio/components/DistributionChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { CustomTooltip } from './CustomTooltip';
import { calculateAccountPercentage, formatPercentage } from '../hooks/portfolioUtils';
import type { Account } from '../hooks/usePortfolioData';

interface DistributionChartProps {
  accounts: Account[];
  accountsChartData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  totalBalance: number;
  theme: any;
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  accounts,
  accountsChartData,
  totalBalance,
  theme
}) => {
  return (
    <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg shadow-purple-500/25">
          <PieChartIcon className="w-5 h-5 text-white" />
        </div>
        <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>Distribuzione Conti</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={accountsChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
            >
              {accountsChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip theme={theme} />} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="flex flex-col justify-center space-y-2">
          {accounts.map((account) => {
            const percentage = calculateAccountPercentage(account.balance, totalBalance);
            const accountColor = account.color || '#6366F1';
            
            return (
              <div key={account.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: accountColor }}
                  />
                  <span className={`${theme.text.secondary} truncate`}>
                    {account.name}
                  </span>
                </div>
                <span className={`font-semibold ${theme.text.primary} ml-2`}>
                  {formatPercentage(percentage)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DistributionChart;