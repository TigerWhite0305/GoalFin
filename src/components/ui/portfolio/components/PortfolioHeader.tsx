// src/components/ui/portfolio/components/PortfolioHeader.tsx
import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

interface PortfolioHeaderProps {
  theme: any;
  selectionMode: boolean;
  onToggleSelectionMode: () => void;
  hasAccounts: boolean;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  theme,
  selectionMode,
  onToggleSelectionMode,
  hasAccounts
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 bg-clip-text text-transparent leading-tight">
          Il Mio Portafoglio
        </h1>
        <p className={`${theme.text.muted} text-sm leading-relaxed`}>
          Panoramica completa dei tuoi conti e disponibilità
        </p>
      </div>
      
      {hasAccounts && (
        <button 
          onClick={onToggleSelectionMode}
          className={`${
            selectionMode 
              ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30 hover:border-amber-500/50 text-amber-400 hover:text-amber-300' 
              : 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30 hover:border-purple-500/50 text-purple-400 hover:text-purple-300'
          } border px-3 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 text-sm`}
        >
          {selectionMode ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
          {selectionMode ? 'Annulla Selezione' : 'Selezione Multipla'}
        </button>
      )}
    </div>
  );
};

export default PortfolioHeader;