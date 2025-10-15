// src/components/modals/TransferModal.tsx - AGGIORNATO PER BACKEND REALE
import React, { useState, useEffect } from 'react';
import { X, ArrowLeftRight, AlertCircle, Euro, Loader2, Wallet } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// ✅ TIPO AGGIORNATO per essere compatibile con il backend
export type Account = {
  id: string;          // ✅ string UUID (non number)
  name: string;
  type: string;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  // Campi opzionali per compatibilità frontend
  bank?: string;
  lastTransaction?: string;
};

interface TransferModalProps {
  accounts: Account[];
  onClose: () => void;
  onTransfer: (fromAccountId: string, toAccountId: string, amount: number, description?: string) => Promise<void>; // ✅ Ora è async con string IDs
}

const TransferModal: React.FC<TransferModalProps> = ({ 
  accounts, 
  onClose, 
  onTransfer 
}) => {
  const { isDarkMode } = useTheme();
  
  // ✅ Stati aggiornati con string IDs
  const [fromAccountId, setFromAccountId] = useState<string>(accounts[0]?.id || "");
  const [toAccountId, setToAccountId] = useState<string>(accounts[1]?.id || "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // ✅ Auto-select secondo account quando cambia il primo
  useEffect(() => {
    if (fromAccountId && toAccountId === fromAccountId) {
      const availableAccounts = accounts.filter(acc => acc.id !== fromAccountId);
      if (availableAccounts.length > 0) {
        setToAccountId(availableAccounts[0].id);
      }
    }
  }, [fromAccountId, accounts]);

  // Theme colors matching other modals
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

  // ✅ Trova accounts aggiornato per string IDs
  const fromAccount = accounts.find(acc => acc.id === fromAccountId);
  const toAccount = accounts.find(acc => acc.id === toAccountId);
  const transferAmount = parseFloat(amount) || 0;

  // ✅ Validazione form migliorata
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fromAccountId) {
      newErrors.fromAccount = "Seleziona il conto di origine";
    }

    if (!toAccountId) {
      newErrors.toAccount = "Seleziona il conto di destinazione";
    }

    if (fromAccountId === toAccountId) {
      newErrors.sameAccount = "Non puoi trasferire denaro sullo stesso conto";
    }

    if (!amount || transferAmount <= 0) {
      newErrors.amount = "Inserisci un importo valido maggiore di zero";
    }

    if (fromAccount && transferAmount > fromAccount.balance) {
      newErrors.amount = "Fondi insufficienti nel conto di origine";
    }

    // ✅ Verifica compatibilità valute
    if (fromAccount && toAccount && fromAccount.currency !== toAccount.currency) {
      newErrors.currency = `Non puoi trasferire tra valute diverse (${fromAccount.currency} → ${toAccount.currency})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler asincrono
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onTransfer(fromAccountId, toAccountId, transferAmount, description.trim() || undefined);
      onClose();
    } catch (error) {
      console.error('Errore nel trasferimento:', error);
      // Il toast error viene gestito nel componente parent
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Format currency con supporto multi-valuta
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    const currencySymbols: Record<string, string> = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£'
    };

    const locale = currency === 'EUR' ? 'it-IT' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // ✅ Icona dinamica per account
  const getAccountIcon = (account: Account) => {
    return Wallet; // Puoi espandere questa logica basandoti sul tipo
  };

  // ✅ Verifica che ci siano almeno 2 conti
  if (accounts.length < 2) {
    return (
      <div className={`fixed inset-0 ${theme.background.backdrop} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
        <div className={`${theme.background.modal} ${theme.border.main} border rounded-2xl w-full max-w-md p-6 shadow-2xl`}>
          <div className="text-center">
            <AlertCircle className={`w-12 h-12 text-yellow-400 mx-auto mb-4`} />
            <h3 className={`${theme.text.primary} font-semibold mb-2`}>
              Conti Insufficienti
            </h3>
            <p className={`${theme.text.muted} text-sm mb-4`}>
              Hai bisogno di almeno 2 conti per effettuare un trasferimento.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <h2 className={`${theme.text.primary} text-lg md:text-xl font-bold`}>
                Trasferisci Fondi
              </h2>
              <p className={`${theme.text.muted} text-sm`}>
                Sposta denaro tra i tuoi conti
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className={`p-2 hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-100/50 rounded-lg ${theme.text.muted} hover:text-gray-50 dark:hover:text-gray-50 light:hover:text-gray-900 transition-all disabled:opacity-50`}
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 md:p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              
              {/* Left Column */}
              <div className="space-y-4 md:space-y-6">
                
                {/* Conti */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Da */}
                  <div className="flex flex-col gap-2 md:gap-3">
                    <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                      Conto di Origine *
                    </label>
                    <select
                      value={fromAccountId}
                      onChange={(e) => setFromAccountId(e.target.value)}
                      className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-sm md:text-base ${
                        errors.fromAccount ? 'border-red-400' : ''
                      }`}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="">Seleziona conto di origine</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} - {formatCurrency(account.balance, account.currency)}
                        </option>
                      ))}
                    </select>
                    {errors.fromAccount && (
                      <p className="text-red-400 text-xs md:text-sm">{errors.fromAccount}</p>
                    )}
                    {fromAccount && (
                      <div className={`p-3 ${theme.background.card} rounded-lg ${theme.border.card} border`}>
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ 
                              backgroundColor: `${fromAccount.color || '#10B981'}15`,
                              border: `1px solid ${fromAccount.color || '#10B981'}40`
                            }}
                          >
                            <Wallet 
                              className="w-4 h-4 md:w-5 md:h-5" 
                              style={{ color: fromAccount.color || '#10B981' }} 
                            />
                          </div>
                          <div>
                            <p className={`${theme.text.primary} font-medium text-sm md:text-base`}>
                              {fromAccount.name}
                            </p>
                            <p className={`${theme.text.muted} text-xs md:text-sm`}>
                              Disponibile: {formatCurrency(fromAccount.balance, fromAccount.currency)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* A */}
                  <div className="flex flex-col gap-2 md:gap-3">
                    <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                      Conto di Destinazione *
                    </label>
                    <select
                      value={toAccountId}
                      onChange={(e) => setToAccountId(e.target.value)}
                      className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm md:text-base ${
                        errors.toAccount ? 'border-red-400' : ''
                      }`}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="">Seleziona conto di destinazione</option>
                      {accounts.filter(acc => acc.id !== fromAccountId).map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} - {formatCurrency(account.balance, account.currency)}
                        </option>
                      ))}
                    </select>
                    {errors.toAccount && (
                      <p className="text-red-400 text-xs md:text-sm">{errors.toAccount}</p>
                    )}
                    {toAccount && (
                      <div className={`p-3 ${theme.background.card} rounded-lg ${theme.border.card} border`}>
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ 
                              backgroundColor: `${toAccount.color || '#3B82F6'}15`,
                              border: `1px solid ${toAccount.color || '#3B82F6'}40`
                            }}
                          >
                            <Wallet 
                              className="w-4 h-4 md:w-5 md:h-5" 
                              style={{ color: toAccount.color || '#3B82F6' }} 
                            />
                          </div>
                          <div>
                            <p className={`${theme.text.primary} font-medium text-sm md:text-base`}>
                              {toAccount.name}
                            </p>
                            <p className={`${theme.text.muted} text-xs md:text-sm`}>
                              Saldo: {formatCurrency(toAccount.balance, toAccount.currency)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Errori generali */}
                {(errors.sameAccount || errors.currency) && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-xs md:text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.sameAccount || errors.currency}
                    </p>
                  </div>
                )}

                {/* Importo */}
                <div className="flex flex-col gap-2 md:gap-3">
                  <label className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                    <Euro className={`w-4 h-4 md:w-5 md:h-5 ${theme.text.muted}`} />
                    Importo da trasferire *
                    {fromAccount && (
                      <span className="text-xs font-normal text-gray-400">
                        ({fromAccount.currency})
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} placeholder-gray-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-sm md:text-base ${
                      errors.amount ? 'border-red-400' : ''
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.amount && (
                    <p className="text-red-400 text-xs md:text-sm flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                      {errors.amount}
                    </p>
                  )}
                </div>

                {/* Descrizione */}
                <div className="flex flex-col gap-2 md:gap-3">
                  <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                    Descrizione (opzionale)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Es. Trasferimento per spese mensili"
                    className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} placeholder-gray-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-sm md:text-base`}
                    disabled={isSubmitting}
                    maxLength={200}
                  />
                </div>
              </div>

              {/* Right Column - Riepilogo */}
              <div className="space-y-4 md:space-y-6">
                {transferAmount > 0 && fromAccount && toAccount && Object.keys(errors).length === 0 ? (
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
                        <span className={`${theme.text.primary} font-bold`}>
                          {formatCurrency(transferAmount, fromAccount.currency)}
                        </span>
                      </div>
                      {description && (
                        <div className="flex justify-between">
                          <span className={`${theme.text.secondary}`}>Descrizione:</span>
                          <span className={`${theme.text.primary} font-medium truncate ml-2`}>{description}</span>
                        </div>
                      )}
                      <div className={`border-t ${theme.border.card} pt-2 md:pt-3 mt-2 md:mt-3`}>
                        <div className="flex justify-between">
                          <span className={`${theme.text.secondary}`}>Nuovo saldo {fromAccount.name}:</span>
                          <span className={`${theme.text.primary}`}>
                            {formatCurrency(fromAccount.balance - transferAmount, fromAccount.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${theme.text.secondary}`}>Nuovo saldo {toAccount.name}:</span>
                          <span className={`${theme.text.primary}`}>
                            {formatCurrency(toAccount.balance + transferAmount, toAccount.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 md:p-6 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                    <div className="text-center">
                      <ArrowLeftRight className={`w-12 h-12 md:w-16 md:h-16 ${theme.text.muted} mx-auto mb-3 md:mb-4`} />
                      <h3 className={`${theme.text.primary} font-semibold mb-2 text-sm md:text-base`}>
                        Inserisci i dettagli
                      </h3>
                      <p className={`${theme.text.muted} text-xs md:text-sm`}>
                        Compila i campi per vedere il riepilogo del trasferimento
                      </p>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className={`p-3 md:p-4 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                  <h4 className={`${theme.text.primary} font-semibold mb-2 text-sm md:text-base`}>
                    💡 Note sul trasferimento:
                  </h4>
                  <ul className={`${theme.text.muted} text-xs md:text-sm space-y-1`}>
                    <li>• Il trasferimento è immediato tra i tuoi conti</li>
                    <li>• Non ci sono commissioni per trasferimenti interni</li>
                    <li>• I conti devono avere la stessa valuta</li>
                    <li>• L'operazione verrà registrata nella cronologia</li>
                  </ul>
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
                disabled={isSubmitting}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-xl ${theme.background.card} ${theme.border.input} border ${theme.text.secondary} font-semibold hover:bg-gray-600/50 dark:hover:bg-gray-600/50 light:hover:bg-gray-200/50 hover:text-gray-50 dark:hover:text-gray-50 light:hover:text-gray-900 transition-all text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={!transferAmount || !fromAccount || !toAccount || Object.keys(errors).length > 0 || isSubmitting}
                className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    Trasferimento in corso...
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5" />
                    Trasferisci Fondi
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;