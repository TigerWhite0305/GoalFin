// src/components/ui/portfolio/components/CustomTooltip.tsx
import React from 'react';
import { formatCurrency } from '../hooks/portfolioUtils';

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      color: string;
      name: string;
      value: number;
    };
  }>;
  label?: string;
}

interface CustomTooltipProps extends TooltipProps {
  theme: any;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  theme 
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-3 shadow-xl backdrop-blur-sm`}>
      {payload.map((entry, index) => (
        <p 
          key={index} 
          className={`${theme.text.primary} font-medium text-sm`} 
          style={{ color: entry.payload?.color || '#6366F1' }}
        >
          {`${entry.name}: ${formatCurrency(entry.value)}`}
        </p>
      ))}
    </div>
  );
};