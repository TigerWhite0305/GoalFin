// src/components/ui/portfolio/components/EmptyPortfolioState.tsx
import React from 'react';
import { Wallet } from 'lucide-react';

interface EmptyPortfolioStateProps {
  theme: any;
  onAddAccount: () => void;
}

const EmptyPortfolioState: React.FC<EmptyPortfolioStateProps> = ({
  theme,
  onAddAccount
}) => {
  return (
    <div className={`${theme.background.card} ${theme.border.card} border rounded-2xl p-12 text-center shadow-lg`}>
      <Wallet className={`w-16 h-16 ${theme.text.muted} mx-auto mb-4`} />
      <h3 className={`text-xl font-bold ${theme.text.primary} mb-2`}>Nessun conto</h3>
      <p className={`${theme.text.muted} mb-6`}>
        Crea il tuo primo conto per iniziare a gestire il tuo portafoglio
      </p>
      <button
        onClick={onAddAccount}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
      >
        Crea Primo Conto
      </button>
    </div>
  );
};

export default EmptyPortfolioState;