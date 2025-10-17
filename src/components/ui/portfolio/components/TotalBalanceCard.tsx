// src/components/ui/portfolio/components/TotalBalanceCard.tsx
import React from 'react';
import { Wallet, Eye, EyeOff, ArrowLeftRight, Plus } from 'lucide-react';
import { formatCurrency } from '../hooks/portfolioUtils';

interface TotalBalanceCardProps {
  theme: any;
  totalBalance: number;
  accountsCount: number;
  showBalance: boolean;
  onToggleBalanceVisibility: () => void;
  onOpenTransferModal: () => void;
  onAddAccount: () => void;
  canTransfer: boolean;
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({
  theme,
  totalBalance,
  accountsCount,
  showBalance,
  onToggleBalanceVisibility,
  onOpenTransferModal,
  onAddAccount,
  canTransfer
}) => {
  return (
    <div className={`relative ${theme.background.card} ${theme.border.card} border rounded-2xl p-4 md:p-6 shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl`}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-teal-500/10 opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-lg md:text-xl font-bold ${theme.text.primary}`}>Saldo Totale</h2>
          </div>
          
          <button
            onClick={onToggleBalanceVisibility}
            className={`p-2 ${theme.background.glass} ${theme.border.card} border rounded-lg hover:bg-gray-700/50 transition-all duration-200`}
          >
            {showBalance ? 
              <Eye className="w-4 h-4 text-indigo-400" /> : 
              <EyeOff className="w-4 h-4 text-indigo-400" />
            }
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-2">
            <div className={`text-2xl md:text-3xl font-bold ${theme.text.primary} tracking-tight`}>
              {showBalance ? formatCurrency(totalBalance) : "••••••"}
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`${theme.text.muted} text-sm`}>
                {accountsCount} {accountsCount === 1 ? 'conto' : 'conti'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={onOpenTransferModal}
              disabled={!canTransfer}
              className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 hover:border-indigo-500/50 px-3 py-2 rounded-xl font-semibold text-indigo-400 hover:text-indigo-300 transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Trasferisci
            </button>
            <button 
              onClick={onAddAccount}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 px-3 py-2 rounded-xl font-semibold text-emerald-400 hover:text-emerald-300 transition-all duration-200 flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Aggiungi Conto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalBalanceCard;