import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Plus, Edit, Wallet, CreditCard, PiggyBank, Building, Landmark } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export type Account = {
  id: number;
  name: string;
  type: string;
  bank: string;
  balance: number;
  currency: string;
  color: string;
  icon: any;
  lastTransaction: string;
};

interface AccountModalProps {
  account?: Account;
  isNew: boolean;
  onClose: () => void;
  onSave: (account: any) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ 
  account, 
  isNew, 
  onClose, 
  onSave 
}) => {
  const { isDarkMode } = useTheme();
  const [name, setName] = useState(account?.name ?? "");
  const [type, setType] = useState(account?.type ?? "checking");
  const [bank, setBank] = useState(account?.bank ?? "");
  const [balance, setBalance] = useState(account?.balance?.toString() ?? "");

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

  const accountTypes = [
    { value: "checking", label: "Conto Corrente", icon: Landmark, color: "#6366F1" },
    { value: "savings", label: "Conto Risparmio", icon: PiggyBank, color: "#10B981" },
    { value: "prepaid", label: "Carta Prepagata", icon: CreditCard, color: "#F59E0B" },
    { value: "business", label: "Conto Business", icon: Building, color: "#8B5CF6" },
  ];

  const banks = [
    "UniCredit", "Intesa Sanpaolo", "BPER", "Banco BPM", "Crédit Agricole", 
    "UBI Banca", "PostePay", "N26", "Revolut", "Altro"
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !bank) {
      return;
    }
    
    onSave({
      name,
      type,
      bank,
      balance: balance || "0"
    });
  };

  const selectedType = accountTypes.find(t => t.value === type);

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
            className={`p-2 hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-100/50 rounded-lg ${theme.text.muted} hover:text-gray-50 dark:hover:text-gray-50 light:hover:text-gray-900 transition-all`}
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            
            {/* Left Column */}
            <div className="space-y-4 md:space-y-6">
              
              {/* Tipo Conto */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>Tipo di Conto</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {accountTypes.map((accountType) => {
                    const IconComponent = accountType.icon;
                    return (
                      <button
                        key={accountType.value}
                        type="button"
                        onClick={() => setType(accountType.value)}
                        className={`p-3 md:p-4 rounded-xl border-2 transition-all flex items-center gap-2 md:gap-3 text-sm md:text-base ${
                          type === accountType.value
                            ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                            : `${theme.border.card} ${theme.background.card} ${theme.text.secondary} hover:border-gray-600 dark:hover:border-gray-600 light:hover:border-gray-400 hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-200/50`
                        }`}
                      >
                        <IconComponent className="w-4 h-4 md:w-5 md:h-5" style={{ color: accountType.color }} />
                        <span className="font-medium">{accountType.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nome Conto */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                  <Wallet className={`w-4 h-4 md:w-5 md:h-5 ${theme.text.muted}`} />
                  Nome del Conto
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Es. Conto Corrente Principale"
                  className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm md:text-base`}
                  required
                />
              </div>

              {/* Banca */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>Banca</label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm md:text-base`}
                  required
                >
                  <option value="">Seleziona una banca</option>
                  {banks.map((bankName) => (
                    <option key={bankName} value={bankName}>{bankName}</option>
                  ))}
                </select>
              </div>

              {/* Saldo */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                  {isNew ? "Saldo Iniziale (€)" : "Saldo Attuale (€)"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="0.00"
                  className={`p-3 md:p-4 rounded-xl ${theme.background.input} ${theme.border.input} border ${theme.text.primary} placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm md:text-base`}
                />
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-4 md:space-y-6">
              {name && selectedType ? (
                <div className={`p-4 md:p-6 ${theme.background.card} rounded-xl ${theme.border.card} border`}>
                  <h3 className={`${theme.text.primary} font-semibold mb-3 md:mb-4 text-sm md:text-base flex items-center gap-2`}>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Anteprima del Conto
                  </h3>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div 
                      className="p-3 md:p-4 rounded-xl border"
                      style={{ 
                        backgroundColor: `${selectedType.color}15`, 
                        borderColor: `${selectedType.color}40`,
                        boxShadow: `0 2px 8px ${selectedType.color}15`
                      }}
                    >
                      <selectedType.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: selectedType.color }} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${theme.text.primary} text-sm md:text-base`}>{name}</h4>
                      <p className={`${theme.text.muted} text-xs md:text-sm`}>{bank || "Banca non selezionata"}</p>
                      <p className="font-bold text-sm md:text-base mt-1" style={{ color: selectedType.color }}>
                        {balance ? `€${parseFloat(balance).toFixed(2)}` : "€0.00"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`p-4 md:p-6 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                  <div className="text-center">
                    <Wallet className={`w-12 h-12 md:w-16 md:h-16 ${theme.text.muted} mx-auto mb-3 md:mb-4`} />
                    <h3 className={`${theme.text.primary} font-semibold mb-2 text-sm md:text-base`}>Compila i Dettagli</h3>
                    <p className={`${theme.text.muted} text-xs md:text-sm`}>
                      Inserisci nome e tipo di conto per vedere l'anteprima
                    </p>
                  </div>
                </div>
              )}

              {/* Info Card */}
              <div className={`p-4 md:p-6 ${theme.background.card} ${theme.border.card} border rounded-xl`}>
                <h4 className={`${theme.text.primary} font-semibold mb-2 md:mb-3 text-sm md:text-base`}>Suggerimenti</h4>
                <ul className={`${theme.text.muted} text-xs md:text-sm space-y-2`}>
                  <li>• Usa nomi descrittivi per identificare facilmente i tuoi conti</li>
                  <li>• Il saldo può essere aggiornato in qualsiasi momento</li>
                  <li>• Seleziona il tipo di conto più appropriato per una migliore organizzazione</li>
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
              className={`px-4 py-2 md:px-6 md:py-3 rounded-xl ${theme.background.card} ${theme.border.input} border ${theme.text.secondary} font-semibold hover:bg-gray-600/50 dark:hover:bg-gray-600/50 light:hover:bg-gray-200/50 hover:text-gray-50 dark:hover:text-gray-50 light:hover:text-gray-900 transition-all text-sm md:text-base`}
            >
              Annulla
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name || !bank}
              className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
              {isNew ? "Aggiungi" : "Aggiorna"} Conto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;