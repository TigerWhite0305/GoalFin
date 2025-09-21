import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Account } from "./AccountModal";

interface BalanceAdjustModalProps {
  account: Account;
  onClose: () => void;
  onAdjust: (accountId: number, newBalance: number, reason: string) => void;
}

const BalanceAdjustModal: React.FC<BalanceAdjustModalProps> = ({ 
  account, 
  onClose, 
  onAdjust 
}) => {
  const { isDarkMode } = useTheme();
  const [newBalance, setNewBalance] = useState(account.balance.toString());
  const [reason, setReason] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Theme colors matching Transactions and Portfolio pages
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: {
          backdrop: "bg-black/60",
          modal: "bg-gray-800",
          card: "bg-gray-700/30",
          input: "bg-gray-700/50"
        },
        text: {
          primary: "text-gray-50",
          secondary: "text-gray-300",
          muted: "text-gray-400"
        },
        border: {
          main: "border-gray-700",
          card: "border-gray-700/50",
          input: "border-gray-700/50"
        }
      };
    } else {
      return {
        background: {
          backdrop: "bg-black/40",
          modal: "bg-white",
          card: "bg-gray-100/50",
          input: "bg-white"
        },
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-700",
          muted: "text-gray-600"
        },
        border: {
          main: "border-gray-200",
          card: "border-gray-200/50",
          input: "border-gray-300"
        }
      };
    }
  };

  const theme = getThemeColors();

  const balanceAmount = parseFloat(newBalance) || 0;
  const difference = balanceAmount - account.balance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    
    onAdjust(account.id, balanceAmount, reason);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className={`fixed inset-0 ${theme.background.backdrop} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`${theme.background.modal} ${theme.border.main} border rounded-2xl w-full max-w-2xl lg:max-w-4xl flex flex-col shadow-2xl transition-colors duration-300 max-h-[90vh] overflow-hidden`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 md:p-6 ${theme.border.card} border-b flex-shrink-0`}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className={`${theme.text.primary} text-lg md:text-xl font-bold`}>Correggi Saldo</h2>
              <p className={`${theme.text.muted} text-sm`}>{account.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-100/50 rounded-lg ${theme.text.muted} hover:text-gray-50 dark:hover:text-gray-50 light:hover:text-gray-900 transition-all`}
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            
            {/* Left Column */}
            <div className="space-y-4 md:space-y-6">
              
              {/* Saldo Attuale */}
              <div className={`p-4 ${theme.background.card} rounded-xl ${theme.border.card} border`}>
                <div className="flex items-center gap-3">
                  <account.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: account.color }} />
                  <div className="flex-1">
                    <h3 className={`${theme.text.primary} font-semibold text-sm md:text-base`}>{account.name}</h3>
                    <p className={`${theme.text.muted} text-sm`}>{account.bank}</p>
                  </div>
                  <div className="text-right">
                    <p className={`${theme.text.muted} text-xs md:text-sm`}>Saldo attuale</p>
                    <p className="text-xl md:text-2xl font-bold" style={{ color: account.color }}>
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nuovo Saldo */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                  <DollarSign className={`w-4 h-4 md:w-5 md:h-5 ${theme.text.muted}`} />
                  Nuovo Saldo (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} placeholder-gray-400 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all text-sm md:text-base`}
                  required
                />
              </div>

              {/* Differenza */}
              {difference !== 0 && (
                <div className={`p-3 md:p-4 rounded-xl border ${
                  difference > 0 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-center gap-3">
                    {difference > 0 ? (
                      <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                    )}
                    <div>
                      <p className={`font-semibold text-sm md:text-base ${difference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {difference > 0 ? 'Incremento' : 'Decremento'}: {formatCurrency(Math.abs(difference))}
                      </p>
                      <p className={`${theme.text.secondary} text-xs md:text-sm`}>
                        {difference > 0 ? 'Il saldo aumenterà' : 'Il saldo diminuirà'} di {formatCurrency(Math.abs(difference))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4 md:space-y-6">
              
              {/* Motivo */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>Motivo della correzione *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Es. Correzione per commissioni non registrate, aggiornamento manuale del saldo..."
                  className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} placeholder-gray-400 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all resize-none text-sm md:text-base h-32 md:h-40`}
                  required
                />
              </div>

              {/* Warning */}
              <div className="p-3 md:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-yellow-300 text-xs md:text-sm">
                  <strong>Attenzione:</strong> Questa operazione modificherà direttamente il saldo del conto. 
                  Assicurati che la correzione sia necessaria e accurata.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 md:p-6 ${theme.border.card} border-t flex-shrink-0`}>
          <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-xl ${theme.background.card} ${theme.border.input} border ${theme.text.secondary} font-semibold hover:bg-gray-600/50 dark:hover:bg-gray-600/50 light:hover:bg-gray-200/50 hover:text-gray-50 dark:hover:text-gray-50 light:hover:text-gray-900 transition-all text-sm md:text-base`}
            >
              Annulla
            </button>
            <button
              onClick={handleSubmit}
              disabled={!reason.trim() || difference === 0}
              className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
              Conferma Correzione
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceAdjustModal;