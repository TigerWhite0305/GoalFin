import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Account } from './AccountModal';

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
  const [newBalance, setNewBalance] = useState(account.balance.toString());
  const [reason, setReason] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-xl flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">Correggi Saldo</h2>
              <p className="text-slate-400 text-sm">{account.name}</p>
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
          
          {/* Saldo Attuale */}
          <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3">
              <account.icon className="w-6 h-6" style={{ color: account.color }} />
              <div className="flex-1">
                <h3 className="text-white font-semibold">{account.name}</h3>
                <p className="text-slate-400 text-sm">{account.bank}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Saldo attuale</p>
                <p className="text-2xl font-bold" style={{ color: account.color }}>
                  {formatCurrency(account.balance)}
                </p>
              </div>
            </div>
          </div>

          {/* Nuovo Saldo */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-slate-400" />
              Nuovo Saldo (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
              required
            />
          </div>

          {/* Differenza */}
          {difference !== 0 && (
            <div className={`p-4 rounded-xl border ${
              difference > 0 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center gap-3">
                {difference > 0 ? (
                  <ArrowUpRight className="w-5 h-5 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <p className={`font-semibold ${difference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {difference > 0 ? 'Incremento' : 'Decremento'}: {formatCurrency(Math.abs(difference))}
                  </p>
                  <p className="text-slate-300 text-sm">
                    {difference > 0 ? 'Il saldo aumenterà' : 'Il saldo diminuirà'} di {formatCurrency(Math.abs(difference))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Motivo */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold">Motivo della correzione *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Es. Correzione per commissioni non registrate, aggiornamento manuale del saldo..."
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all resize-none"
              rows={3}
              required
            />
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-300 text-sm">
              <strong>Attenzione:</strong> Questa operazione modificherà direttamente il saldo del conto. 
              Assicurati che la correzione sia necessaria e accurata.
            </p>
          </div>
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
              disabled={!reason.trim() || difference === 0}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-5 h-5" />
              Conferma Correzione
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceAdjustModal;