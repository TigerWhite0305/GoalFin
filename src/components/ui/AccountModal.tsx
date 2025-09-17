import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Plus, Edit, Wallet, CreditCard, PiggyBank, Building, Landmark } from "lucide-react";

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
  const [name, setName] = useState(account?.name ?? "");
  const [type, setType] = useState(account?.type ?? "checking");
  const [bank, setBank] = useState(account?.bank ?? "");
  const [balance, setBalance] = useState(account?.balance?.toString() ?? "");

  const accountTypes = [
    { value: "checking", label: "Conto Corrente", icon: Landmark, color: "#4C6FFF" },
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              {isNew ? <Plus className="w-6 h-6 text-white" /> : <Edit className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-white text-xl sm:text-2xl font-bold">
                {isNew ? "Aggiungi Nuovo" : "Modifica"} Conto
              </h2>
              <p className="text-slate-400 text-sm">
                {isNew ? "Inserisci i dettagli del tuo nuovo conto" : "Modifica i dettagli del conto"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Tipo Conto */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold">Tipo di Conto</label>
            <div className="grid grid-cols-2 gap-3">
              {accountTypes.map((accountType) => {
                const IconComponent = accountType.icon;
                return (
                  <button
                    key={accountType.value}
                    type="button"
                    onClick={() => setType(accountType.value)}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      type === accountType.value
                        ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                        : "border-slate-700/50 bg-slate-800/30 text-slate-300 hover:border-slate-600 hover:bg-slate-700/50"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: accountType.color }} />
                    <span className="font-medium">{accountType.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nome Conto */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-slate-400" />
              Nome del Conto
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Conto Corrente Principale"
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
            />
          </div>

          {/* Banca */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold">Banca</label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
            >
              <option value="">Seleziona una banca</option>
              {banks.map((bankName) => (
                <option key={bankName} value={bankName}>{bankName}</option>
              ))}
            </select>
          </div>

          {/* Saldo */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold">
              {isNew ? "Saldo Iniziale (€)" : "Saldo Attuale (€)"}
            </label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0.00"
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Preview */}
          {name && selectedType && (
            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <p className="text-slate-300 text-sm mb-3">Anteprima del conto:</p>
              <div className="flex items-center gap-3">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${selectedType.color}20`, border: `1px solid ${selectedType.color}40` }}
                >
                  <selectedType.icon className="w-6 h-6" style={{ color: selectedType.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{name}</h3>
                  <p className="text-slate-400 text-sm">{bank || "Banca non selezionata"}</p>
                  <p className="font-bold" style={{ color: selectedType.color }}>
                    {balance ? `€${parseFloat(balance).toFixed(2)}` : "€0.00"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-slate-300 font-semibold hover:bg-slate-600/50 hover:text-white transition-all"
            >
              Annulla
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name || !bank}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-5 h-5" />
              {isNew ? "Aggiungi" : "Aggiorna"} Conto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;