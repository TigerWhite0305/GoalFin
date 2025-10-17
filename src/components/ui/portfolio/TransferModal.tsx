// src/components/ui/TransferModal.tsx - CON VALIDAZIONI MIGLIORATE (SENZA ValidationMessage)
import React, { useState, useEffect, useCallback } from 'react';
import { X, ArrowLeftRight, AlertCircle, Euro, Loader2, Wallet, CheckCircle2, AlertTriangle, TrendingDown, Shield } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { validateTransfer, formatCurrency, TRANSFER_LIMITS } from "../../../utils/validations";

// Tipo Account compatibile con backend
export type Account = {
  id: string;          // string UUID (non number)
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
  onTransfer: (fromAccountId: string, toAccountId: string, amount: number, description?: string) => Promise<void>; // Ora è async con string IDs
}

const TransferModal: React.FC<TransferModalProps> = ({ 
  accounts, 
  onClose, 
  onTransfer 
}) => {
  const { isDarkMode } = useTheme();
  
  // Stati aggiornati con string IDs
  const [fromAccountId, setFromAccountId] = useState<string>(accounts[0]?.id || "");
  const [toAccountId, setToAccountId] = useState<string>(accounts[1]?.id || "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Stati per validazioni migliorate
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Auto-select secondo account quando cambia il primo
  useEffect(() => {
    if (fromAccountId && toAccountId === fromAccountId) {
      const availableAccounts = accounts.filter(acc => acc.id !== fromAccountId);
      if (availableAccounts.length > 0) {
        setToAccountId(availableAccounts[0].id);
      }
    }
  }, [fromAccountId, accounts]);

  // Validazione in tempo reale con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateTransferForm();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fromAccountId, toAccountId, amount, description]);

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

  // Trova accounts aggiornato per string IDs
  const fromAccount = accounts.find(acc => acc.id === fromAccountId);
  const toAccount = accounts.find(acc => acc.id === toAccountId);
  const transferAmount = parseFloat(amount) || 0;

  // Validazione form migliorata usando le utilities
  const validateTransferForm = useCallback(() => {
    if (!fromAccountId || !toAccountId || !amount) {
      setValidationErrors([]);
      setValidationWarnings([]);
      return false;
    }

    if (!fromAccount || !toAccount || isNaN(transferAmount)) {
      setValidationErrors(['Dati trasferimento non validi']);
      setValidationWarnings([]);
      return false;
    }

    const validation = validateTransfer(fromAccount, toAccount, transferAmount);
    setValidationErrors(validation.errors);
    setValidationWarnings(validation.warnings);

    return validation.isValid;
  }, [fromAccountId, toAccountId, amount, fromAccount, toAccount, transferAmount]);

  // Submit handler asincrono
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTransferForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onTransfer(fromAccountId, toAccountId, transferAmount, description.trim() || undefined);
      onClose();
    } catch (error) {
      console.error('Errore nel trasferimento:', error);
      setValidationErrors(['Errore durante il trasferimento. Riprova.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasErrors = validationErrors.length > 0;
  const hasWarnings = validationWarnings.length > 0;

  // Componente per messaggi inline
  const ValidationMessages = () => {
    if (!hasErrors && !hasWarnings) return null;

    return (
      <div className="space-y-2 mb-6">
        {validationErrors.map((error, index) => (
          <div key={`error-${index}`} className={`
            flex items-start gap-3 p-3 rounded-lg border text-sm
            ${isDarkMode 
              ? 'bg-red-900/20 border-red-800/30 text-red-200' 
              : 'bg-red-50 border-red-200 text-red-800'
            }
            transition-all duration-200
          `}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <p className="leading-tight">{error}</p>
          </div>
        ))}
        {validationWarnings.map((warning, index) => (
          <div key={`warning-${index}`} className={`
            flex items-start gap-3 p-3 rounded-lg border text-sm
            ${isDarkMode 
              ? 'bg-yellow-900/20 border-yellow-800/30 text-yellow-200' 
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
            }
            transition-all duration-200
          `}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-yellow-500" />
            <p className="leading-tight">{warning}</p>
          </div>
        ))}
      </div>
    );
  };

  // Controllo se non ci sono conti disponibili
  if (accounts.length < 2) {
    return (
      <div className={`fixed inset-0 ${theme.background.backdrop} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
        <div className={`${theme.background.modal} ${theme.border.main} border rounded-2xl p-6 max-w-md w-full shadow-2xl`}>
          <div className="text-center">
            <Wallet className={`w-16 h-16 ${theme.text.muted} mx-auto mb-4`} />
            <h3 className={`${theme.text.primary} text-xl font-bold mb-2`}>
              Conti insufficienti
            </h3>
            <p className={`${theme.text.muted} mb-6`}>
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
                Sposta denaro tra i tuoi conti con controlli di sicurezza
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
            
            {/* Messaggi di validazione */}
            <ValidationMessages />

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
                      className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-sm md:text-base`}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="">Seleziona origine</option>
                      {accounts.filter(acc => acc.id !== toAccountId).map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} - {formatCurrency(account.balance, account.currency)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* A */}
                  <div className="flex flex-col gap-2 md:gap-3">
                    <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                      Conto di Destinazione *
                    </label>
                    <select
                      value={toAccountId}
                      onChange={(e) => setToAccountId(e.target.value)}
                      className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-sm md:text-base`}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="">Seleziona destinazione</option>
                      {accounts.filter(acc => acc.id !== fromAccountId).map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} - {account.currency}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className={`w-full p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} placeholder-gray-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-sm md:text-base ${
                        hasErrors ? 'border-red-400' : ''
                      }`}
                      disabled={isSubmitting}
                      required
                    />
                    {fromAccount && (
                      <div className={`absolute right-3 top-3 md:top-4 text-sm ${theme.text.muted}`}>
                        {fromAccount.currency}
                      </div>
                    )}
                  </div>
                  
                  {/* Bottoni importo rapido */}
                  {fromAccount && fromAccount.balance > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { label: "25%", value: fromAccount.balance * 0.25 },
                        { label: "50%", value: fromAccount.balance * 0.5 },
                        { label: "75%", value: fromAccount.balance * 0.75 },
                        { label: "Max", value: fromAccount.balance }
                      ].map(({ label, value }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setAmount(value.toFixed(2))}
                          disabled={isSubmitting || value <= 0}
                          className={`px-3 py-1 text-xs rounded-lg ${theme.background.card} ${theme.border.input} border ${theme.text.muted} hover:bg-green-500/10 hover:border-green-400/50 hover:text-green-300 transition-all disabled:opacity-50`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
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

                {/* Info Limiti */}
                <div className={`p-4 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedInfo(!showAdvancedInfo)}
                    className={`flex items-center gap-2 ${theme.text.primary} font-semibold text-sm w-full`}
                  >
                    <Shield className="w-4 h-4" />
                    Limiti di Sicurezza
                    <div className={`ml-auto transition-transform ${showAdvancedInfo ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </button>
                  
                  {showAdvancedInfo && (
                    <div className={`mt-3 pt-3 border-t ${theme.border.card} space-y-2`}>
                      <div className="flex justify-between text-xs">
                        <span className={theme.text.muted}>Limite giornaliero:</span>
                        <span className={theme.text.secondary}>{formatCurrency(TRANSFER_LIMITS.daily)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={theme.text.muted}>Limite singolo trasferimento:</span>
                        <span className={theme.text.secondary}>{formatCurrency(TRANSFER_LIMITS.single)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={theme.text.muted}>Importo minimo:</span>
                        <span className={theme.text.secondary}>{formatCurrency(TRANSFER_LIMITS.minimum)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Riepilogo */}
              <div className="space-y-4 md:space-y-6">
                
                {/* Stato Validazione */}
                <div className={`p-4 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                  <div className="flex items-center gap-3 mb-3">
                    {hasErrors ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : hasWarnings ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    )}
                    <h4 className={`font-semibold text-sm ${
                      hasErrors ? 'text-red-400' : 
                      hasWarnings ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {hasErrors ? 'Controlli di sicurezza' : 
                       hasWarnings ? 'Avvertimenti attivi' : 
                       'Trasferimento verificato'}
                    </h4>
                  </div>
                  <div className={`text-xs ${theme.text.muted} space-y-1`}>
                    <p>• Saldi sufficienti: {hasErrors && validationErrors.some(e => e.toLowerCase().includes('saldo') || e.toLowerCase().includes('insufficien')) ? '❌' : '✅'}</p>
                    <p>• Limiti rispettati: {hasErrors && validationErrors.some(e => e.toLowerCase().includes('limite') || e.toLowerCase().includes('massimo')) ? '❌' : '✅'}</p>
                    <p>• Valute compatibili: {hasErrors && validationErrors.some(e => e.toLowerCase().includes('valute')) ? '❌' : '✅'}</p>
                    <p>• Conti diversi: {hasErrors && validationErrors.some(e => e.toLowerCase().includes('stesso')) ? '❌' : '✅'}</p>
                  </div>
                </div>

                {/* Preview Trasferimento */}
                {transferAmount > 0 && fromAccount && toAccount && !hasErrors ? (
                  <div className={`p-4 md:p-6 ${theme.background.card} rounded-xl ${theme.border.card} border`}>
                    <h3 className={`${theme.text.primary} font-semibold mb-4 text-sm md:text-base flex items-center gap-2`}>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Riepilogo Trasferimento
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Da */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: fromAccount.color || '#6366F1' }}
                          />
                          <div>
                            <p className={`${theme.text.primary} font-medium text-sm`}>
                              {fromAccount.name}
                            </p>
                            <p className={`${theme.text.muted} text-xs`}>
                              Saldo: {formatCurrency(fromAccount.balance, fromAccount.currency)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-red-400 font-semibold text-sm">
                            -{formatCurrency(transferAmount, fromAccount.currency)}
                          </p>
                          <p className={`${theme.text.muted} text-xs`}>
                            Nuovo: {formatCurrency(fromAccount.balance - transferAmount, fromAccount.currency)}
                          </p>
                        </div>
                      </div>

                      {/* Freccia */}
                      <div className="flex justify-center">
                        <TrendingDown className={`w-5 h-5 ${theme.text.muted} transform rotate-90`} />
                      </div>

                      {/* A */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: toAccount.color || '#10B981' }}
                          />
                          <div>
                            <p className={`${theme.text.primary} font-medium text-sm`}>
                              {toAccount.name}
                            </p>
                            <p className={`${theme.text.muted} text-xs`}>
                              Saldo: {formatCurrency(toAccount.balance, toAccount.currency)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-semibold text-sm">
                            +{formatCurrency(transferAmount, toAccount.currency)}
                          </p>
                          <p className={`${theme.text.muted} text-xs`}>
                            Nuovo: {formatCurrency(toAccount.balance + transferAmount, toAccount.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 md:p-6 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                    <div className="text-center">
                      <ArrowLeftRight className={`w-12 h-12 md:w-16 md:h-16 ${theme.text.muted} mx-auto mb-3 md:mb-4`} />
                      <h3 className={`${theme.text.primary} font-semibold mb-2 text-sm md:text-base`}>
                        Configura Trasferimento
                      </h3>
                      <p className={`${theme.text.muted} text-xs md:text-sm`}>
                        Seleziona conti e importo per vedere l'anteprima
                      </p>
                    </div>
                  </div>
                )}

                {/* Info Note */}
                <div className={`p-4 md:p-6 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                  <h4 className={`${theme.text.primary} font-semibold mb-2 md:mb-3 text-sm md:text-base`}>
                    💡 Note sul trasferimento:
                  </h4>
                  <ul className={`${theme.text.muted} text-xs md:text-sm space-y-1`}>
                    <li>• Il trasferimento è immediato tra i tuoi conti</li>
                    <li>• Non ci sono commissioni per trasferimenti interni</li>
                    <li>• I conti devono avere la stessa valuta</li>
                    <li>• L'operazione verrà registrata nella cronologia</li>
                    <li>• Controlli automatici di sicurezza attivi</li>
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
                disabled={!transferAmount || !fromAccount || !toAccount || hasErrors || isSubmitting}
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
                    Trasferisci {amount && formatCurrency(parseFloat(amount))}
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