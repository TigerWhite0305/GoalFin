import React, { useState, useEffect } from 'react';
import { X, ArrowLeftRight, AlertCircle, Euro } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Account } from './AccountModal';

interface TransferModalProps {
  accounts: Account[];
  onClose: () => void;
  onTransfer: (fromId: number, toId: number, amount: number, description?: string) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ 
  accounts, 
  onClose, 
  onTransfer 
}) => {
  const { isDarkMode } = useTheme();
  const [fromAccountId, setFromAccountId] = useState<number>(accounts[0]?.id || 0);
  const [toAccountId, setToAccountId] = useState<number>(accounts[1]?.id || 0);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

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

  const fromAccount = accounts.find(acc => acc.id === fromAccountId);
  const toAccount = accounts.find(acc => acc.id === toAccountId);
  const transferAmount = parseFloat(amount) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccount || !toAccount || transferAmount <= 0 || fromAccount.id === toAccount.id) return;
    
    onTransfer(fromAccountId, toAccountId, transferAmount, description);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className={`fixed inset-0 ${theme.background.backdrop} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`${theme.background.modal} ${theme.border.main} border rounded-2xl w-full max-w-3xl lg:max-w-5xl flex flex-col shadow-2xl transition-colors duration-300 max-h-[90vh] overflow-hidden`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 md:p-6 ${theme.border.card} border-b flex-shrink-0`}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className={`${theme.text.primary} text-lg md:text-xl font-bold`}>Trasferisci Fondi</h2>
              <p className={`${theme.text.muted} text-sm`}>Sposta denaro tra i tuoi conti</p>
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            
            {/* Left Column */}
            <div className="space-y-4 md:space-y-6">
              
              {/* Conti */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Da */}
                <div className="flex flex-col gap-2 md:gap-3">
                  <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>Da</label>
                  <select
                    value={fromAccountId}
                    onChange={(e) => setFromAccountId(Number(e.target.value))}
                    className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-sm md:text-base`}
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} - {formatCurrency(account.balance)}
                      </option>
                    ))}
                  </select>
                  {fromAccount && (
                    <div className={`p-3 ${theme.background.card} rounded-lg ${theme.border.card} border`}>
                      <div className="flex items-center gap-3">
                        <fromAccount.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: fromAccount.color }} />
                        <div>
                          <p className={`${theme.text.primary} font-medium text-sm md:text-base`}>{fromAccount.name}</p>
                          <p className={`${theme.text.muted} text-xs md:text-sm`}>Disponibile: {formatCurrency(fromAccount.balance)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* A */}
                <div className="flex flex-col gap-2 md:gap-3">
                  <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>A</label>
                  <select
                    value={toAccountId}
                    onChange={(e) => setToAccountId(Number(e.target.value))}
                    className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm md:text-base`}
                  >
                    {accounts.filter(acc => acc.id !== fromAccountId).map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} - {formatCurrency(account.balance)}
                      </option>
                    ))}
                  </select>
                  {toAccount && (
                    <div className={`p-3 ${theme.background.card} rounded-lg ${theme.border.card} border`}>
                      <div className="flex items-center gap-3">
                        <toAccount.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: toAccount.color }} />
                        <div>
                          <p className={`${theme.text.primary} font-medium text-sm md:text-base`}>{toAccount.name}</p>
                          <p className={`${theme.text.muted} text-xs md:text-sm`}>Saldo: {formatCurrency(toAccount.balance)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Importo */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                  <Euro className={`w-4 h-4 md:w-5 md:h-5 ${theme.text.muted}`} />
                  Importo da trasferire (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} placeholder-gray-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-sm md:text-base`}
                  required
                />
                {fromAccount && transferAmount > fromAccount.balance && (
                  <p className="text-red-400 text-xs md:text-sm flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                    Fondi insufficienti
                  </p>
                )}
              </div>

              {/* Descrizione */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>Descrizione (opzionale)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Es. Trasferimento per spese mensili"
                  className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} placeholder-gray-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-sm md:text-base`}
                />
              </div>
            </div>

            {/* Right Column - Riepilogo */}
            <div className="space-y-4 md:space-y-6">
              {transferAmount > 0 && fromAccount && toAccount && (
                <div className={`p-4 md:p-6 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                  <h3 className={`${theme.text.primary} font-semibold mb-3 md:mb-4 text-sm md:text-base flex items-center gap-2`}>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Riepilogo Trasferimento
                  </h3>
                  <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                    <div className="flex justify-between">
                      <span className={`${theme.text.secondary}`}>Da:</span>
                      <span className={`${theme.text.primary} font-medium`}>{fromAccount.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.text.secondary}`}>A:</span>
                      <span className={`${theme.text.primary} font-medium`}>{toAccount.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.text.secondary}`}>Importo:</span>
                      <span className={`${theme.text.primary} font-bold`}>{formatCurrency(transferAmount)}</span>
                    </div>
                    {description && (
                      <div className="flex justify-between">
                        <span className={`${theme.text.secondary}`}>Descrizione:</span>
                        <span className={`${theme.text.primary} font-medium`}>{description}</span>
                      </div>
                    )}
                    <div className={`border-t ${theme.border.card} pt-2 md:pt-3 mt-2 md:mt-3`}>
                      <div className="flex justify-between">
                        <span className={`${theme.text.secondary}`}>Nuovo saldo {fromAccount.name}:</span>
                        <span className={`${theme.text.primary}`}>{formatCurrency(fromAccount.balance - transferAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme.text.secondary}`}>Nuovo saldo {toAccount.name}:</span>
                        <span className={`${theme.text.primary}`}>{formatCurrency(toAccount.balance + transferAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder quando non c'è riepilogo */}
              {(!transferAmount || !fromAccount || !toAccount) && (
                <div className={`p-4 md:p-6 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                  <div className="text-center">
                    <ArrowLeftRight className={`w-12 h-12 md:w-16 md:h-16 ${theme.text.muted} mx-auto mb-3 md:mb-4`} />
                    <h3 className={`${theme.text.primary} font-semibold mb-2 text-sm md:text-base`}>Inserisci i dettagli</h3>
                    <p className={`${theme.text.muted} text-xs md:text-sm`}>
                      Compila i campi per vedere il riepilogo del trasferimento
                    </p>
                  </div>
                </div>
              )}
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
              disabled={!transferAmount || !fromAccount || !toAccount || transferAmount > fromAccount.balance || fromAccount.id === toAccount.id}
              className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5" />
              Trasferisci Fondi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;