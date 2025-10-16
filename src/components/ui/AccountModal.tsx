// src/components/ui/AccountModal.tsx - CON VALIDAZIONI MIGLIORATE (SENZA ValidationMessage)
import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle2, Plus, Edit, Wallet, CreditCard, PiggyBank, Building, Landmark, Loader2, Palette, AlertTriangle, AlertCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { validateCompleteAccount, ACCOUNT_MIN_BALANCES, formatCurrency } from "../../utils/validations.";

// Tipo Account compatibile con backend
export type Account = {
  id: string;
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
  bank?: string;
  lastTransaction?: string;
};

interface AccountModalProps {
  account?: Account;
  isNew: boolean;
  onClose: () => void;
  onSave: (account: any) => Promise<void>;
  existingAccounts?: Account[]; // Aggiunto per controllo duplicati
}

const AccountModal: React.FC<AccountModalProps> = ({ 
  account, 
  isNew, 
  onClose, 
  onSave,
  existingAccounts = []
}) => {
  const { isDarkMode } = useTheme();
  
  // Stati del form
  const [name, setName] = useState(account?.name ?? "");
  const [type, setType] = useState(account?.type ?? "checking");
  const [balance, setBalance] = useState(account?.balance?.toString() ?? "");
  const [currency, setCurrency] = useState(account?.currency ?? "EUR");
  const [color, setColor] = useState(account?.color ?? "");
  const [icon, setIcon] = useState(account?.icon ?? "");
  
  // Stati UI con validazioni migliorate
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState(account?.color ?? "#6366F1");

  // Palette colori predefiniti (8 colori)
  const predefinedColors = [
    "#6366F1", // Indigo
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#EF4444", // Red
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#F97316", // Orange
  ];

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

  const accountTypes = [
    { 
      value: "checking", 
      label: "Conto Corrente", 
      icon: Landmark, 
      color: "#6366F1",
      minBalance: ACCOUNT_MIN_BALANCES.checking
    },
    { 
      value: "savings", 
      label: "Conto Risparmio", 
      icon: PiggyBank, 
      color: "#10B981",
      minBalance: ACCOUNT_MIN_BALANCES.savings
    },
    { 
      value: "card", 
      label: "Carta/Prepagata", 
      icon: CreditCard, 
      color: "#F59E0B",
      minBalance: ACCOUNT_MIN_BALANCES.card
    },
    { 
      value: "investment", 
      label: "Investimenti", 
      icon: Building, 
      color: "#8B5CF6",
      minBalance: ACCOUNT_MIN_BALANCES.investment
    },
  ];

  const currencies = [
    { value: "EUR", label: "€ Euro", flag: "🇪🇺" },
    { value: "USD", label: "$ Dollaro", flag: "🇺🇸" },
    { value: "GBP", label: "£ Sterlina", flag: "🇬🇧" },
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Auto-set default color when type changes
  useEffect(() => {
    if (!color || !account) {
      const defaultColor = accountTypes.find(t => t.value === type)?.color || "#6366F1";
      setColor(defaultColor);
      setCustomColor(defaultColor);
    }
  }, [type]);

  // Validazione in tempo reale con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateForm();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [name, type, balance, currency, color]);

  // Validazione form usando le utilities migliorate
  const validateForm = useCallback(() => {
    const validation = validateCompleteAccount(
      name,
      type,
      balance,
      currency,
      color,
      existingAccounts,
      account?.id
    );

    setValidationErrors(validation.errors);
    setValidationWarnings(validation.warnings);

    return validation.isValid;
  }, [name, type, balance, currency, color, existingAccounts, account?.id]);

  // Handle color selection
  const handleColorSelection = (selectedColor: string) => {
    setColor(selectedColor);
    setCustomColor(selectedColor);
  };

  // Handle custom color picker
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    handleColorSelection(newColor);
  };

  // Submit handler asincrono
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const accountData = {
        name: name.trim(),
        type,
        balance: balance ? parseFloat(balance) : 0,
        currency,
        color: color || accountTypes.find(t => t.value === type)?.color,
        icon: icon || type
      };

      await onSave(accountData);
      onClose();
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      setValidationErrors(['Errore durante il salvataggio. Riprova.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = accountTypes.find(t => t.value === type);
  const isPredefinedColor = predefinedColors.includes(color);
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

  return (
    <div className={`fixed inset-0 ${theme.background.backdrop} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`${theme.background.modal} ${theme.border.main} border rounded-2xl w-full max-w-3xl lg:max-w-5xl flex flex-col shadow-2xl transition-colors duration-300 max-h-[90vh] overflow-hidden`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 md:p-6 ${theme.border.card} border-b flex-shrink-0`}>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              {isNew ? <Plus className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <Edit className="w-5 h-5 md:w-6 md:h-6 text-white" />}
            </div>
            <div>
              <h2 className={`${theme.text.primary} text-lg md:text-xl font-bold`}>
                {isNew ? "Aggiungi Nuovo" : "Modifica"} Conto
              </h2>
              <p className={`${theme.text.muted} text-sm`}>
                {isNew ? "Inserisci i dettagli del tuo nuovo conto" : "Modifica i dettagli del conto"}
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
                
                {/* Tipo Conto con saldi minimi */}
                <div className="flex flex-col gap-2 md:gap-3">
                  <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                    Tipo di Conto *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {accountTypes.map((accountType) => {
                      const IconComponent = accountType.icon;
                      return (
                        <button
                          key={accountType.value}
                          type="button"
                          onClick={() => {
                            setType(accountType.value);
                            if (!icon) setIcon(accountType.value);
                          }}
                          disabled={isSubmitting}
                          className={`p-3 md:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 text-sm md:text-base relative ${
                            type === accountType.value
                              ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                              : `${theme.border.card} ${theme.background.card} ${theme.text.secondary} hover:border-gray-600 dark:hover:border-gray-600 light:hover:border-gray-400 hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-200/50`
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <IconComponent className="w-4 h-4 md:w-5 md:h-5" style={{ color: accountType.color }} />
                          <span className="font-medium text-center">{accountType.label}</span>
                          <span className={`text-xs ${theme.text.muted}`}>
                            Min: {formatCurrency(accountType.minBalance)}
                          </span>
                          {type === accountType.value && (
                            <CheckCircle2 className="w-4 h-4 text-blue-400 absolute top-1 right-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nome Conto */}
                <div className="flex flex-col gap-2 md:gap-3">
                  <label className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                    <Wallet className={`w-4 h-4 md:w-5 md:h-5 ${theme.text.muted}`} />
                    Nome del Conto *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Es. Conto Corrente Principale"
                    className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm md:text-base ${
                      hasErrors && validationErrors.some(e => e.toLowerCase().includes('nome')) ? 'border-red-400' : ''
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Saldo e Valuta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2 md:gap-3">
                    <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                      {isNew ? "Saldo Iniziale" : "Saldo Attuale"}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="0.00"
                        className={`w-full p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm md:text-base ${
                          hasErrors && validationErrors.some(e => e.toLowerCase().includes('saldo') || e.toLowerCase().includes('minimo')) ? 'border-red-400' : ''
                        }`}
                        disabled={isSubmitting}
                      />
                      {selectedType && (
                        <div className={`absolute right-3 top-3 text-xs ${theme.text.muted}`}>
                          Min: {formatCurrency(selectedType.minBalance)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:gap-3">
                    <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                      Valuta
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm md:text-base`}
                      disabled={isSubmitting}
                    >
                      {currencies.map((curr) => (
                        <option key={curr.value} value={curr.value}>
                          {curr.flag} {curr.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color Picker Avanzato */}
                <div className="flex flex-col gap-2 md:gap-3">
                  <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                    Colore del Conto
                  </label>
                  
                  {/* Griglia 3x3 (8 predefiniti + 1 custom) */}
                  <div className="grid grid-cols-3 gap-2 max-w-[120px]">
                    {predefinedColors.map((colorOption) => (
                      <button
                        key={colorOption}
                        type="button"
                        onClick={() => handleColorSelection(colorOption)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all relative ${
                          color === colorOption 
                            ? 'border-gray-300 scale-110' 
                            : 'border-gray-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: colorOption }}
                        disabled={isSubmitting}
                      >
                        {color === colorOption && (
                          <CheckCircle2 className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                        )}
                      </button>
                    ))}
                    
                    {/* Custom Color Picker */}
                    <div className="relative">
                      <input
                        type="color"
                        value={customColor}
                        onChange={handleCustomColorChange}
                        className="w-10 h-10 rounded-lg border-2 border-gray-600 hover:border-gray-400 transition-all cursor-pointer opacity-0 absolute inset-0"
                        disabled={isSubmitting}
                      />
                      <div 
                        className={`w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center ${
                          !isPredefinedColor && color === customColor
                            ? 'border-gray-300 scale-110' 
                            : 'border-gray-600 hover:scale-105'
                        }`}
                        style={{ 
                          backgroundColor: isPredefinedColor ? '#4B5563' : customColor 
                        }}
                      >
                        {isPredefinedColor ? (
                          <Palette className="w-4 h-4 text-gray-300" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-white drop-shadow-lg" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className={`${theme.text.muted} text-xs`}>
                    Clicca sui colori predefiniti o sull'icona palette per scegliere un colore personalizzato
                  </p>
                </div>
              </div>

              {/* Right Column - Preview */}
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
                      {hasErrors ? 'Errori da correggere' : 
                       hasWarnings ? 'Avvisi da controllare' : 
                       'Tutti i campi sono validi'}
                    </h4>
                  </div>
                  <div className={`text-xs ${theme.text.muted} space-y-1`}>
                    <p>• Controllo duplicati: {validationErrors.some(e => e.toLowerCase().includes('esiste già')) ? '❌' : '✅'}</p>
                    <p>• Saldi minimi: {validationErrors.some(e => e.toLowerCase().includes('minimo')) ? '❌' : '✅'}</p>
                    <p>• Validazione nome: {validationErrors.some(e => e.toLowerCase().includes('nome') || e.toLowerCase().includes('caratteri')) ? '❌' : '✅'}</p>
                    <p>• Validazione colore: {validationWarnings.some(w => w.toLowerCase().includes('colore')) ? '⚠️' : '✅'}</p>
                  </div>
                </div>

                {/* Preview */}
                {name && selectedType ? (
                  <div className={`p-4 md:p-6 ${theme.background.card} rounded-xl ${theme.border.card} border`}>
                    <h3 className={`${theme.text.primary} font-semibold mb-3 md:mb-4 text-sm md:text-base flex items-center gap-2`}>
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Anteprima del Conto
                    </h3>
                    <div className="flex items-center gap-3 md:gap-4">
                      <div 
                        className="p-3 md:p-4 rounded-xl border transition-all duration-200"
                        style={{ 
                          backgroundColor: `${color}15`, 
                          borderColor: `${color}40`,
                          boxShadow: `0 2px 8px ${color}15`
                        }}
                      >
                        <selectedType.icon 
                          className="w-5 h-5 md:w-6 md:h-6 transition-colors duration-200" 
                          style={{ color: color }} 
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${theme.text.primary} text-sm md:text-base`}>
                          {name}
                        </h4>
                        <p className={`${theme.text.muted} text-xs md:text-sm`}>
                          {selectedType.label}
                        </p>
                        <p 
                          className="font-bold text-sm md:text-base mt-1 transition-colors duration-200" 
                          style={{ color: color }}
                        >
                          {currency === 'EUR' && '€'}
                          {currency === 'USD' && '$'}
                          {currency === 'GBP' && '£'}
                          {balance ? parseFloat(balance).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 md:p-6 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                    <div className="text-center">
                      <Wallet className={`w-12 h-12 md:w-16 md:h-16 ${theme.text.muted} mx-auto mb-3 md:mb-4`} />
                      <h3 className={`${theme.text.primary} font-semibold mb-2 text-sm md:text-base`}>
                        Compila i Dettagli
                      </h3>
                      <p className={`${theme.text.muted} text-xs md:text-sm`}>
                        Inserisci nome e tipo di conto per vedere l'anteprima
                      </p>
                    </div>
                  </div>
                )}

                {/* Info Card Migliorata */}
                <div className={`p-4 md:p-6 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                  <h4 className={`${theme.text.primary} font-semibold mb-2 md:mb-3 text-sm md:text-base`}>
                    🔒 Validazioni Attive
                  </h4>
                  <ul className={`${theme.text.muted} text-xs md:text-sm space-y-2`}>
                    <li>• <strong>Anti-duplicati:</strong> Controllo nomi esistenti</li>
                    <li>• <strong>Saldi minimi:</strong> {selectedType ? `Min ${formatCurrency(selectedType.minBalance)}` : 'Per tipo conto'}</li>
                    <li>• <strong>Validazione real-time:</strong> Controlli automatici</li>
                    <li>• <strong>Colori accessibili:</strong> Contrasto automatico</li>
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
                disabled={!name || !type || isSubmitting || hasErrors}
                className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    {isNew ? "Creazione..." : "Aggiornamento..."}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                    {isNew ? "Aggiungi" : "Aggiorna"} Conto
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

export default AccountModal;