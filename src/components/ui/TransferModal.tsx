import React, { useState, useEffect } from 'react';
import { X, ArrowLeftRight, AlertCircle, Euro } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
              <ArrowLeftRight className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl sm:text-2xl font-bold">Trasferisci Fondi</h2>
              <p className="text-slate-400 text-sm">Sposta denaro tra i tuoi conti</p>
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
          
          {/* Conti */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Da */}
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">Da</label>
              <select
                value={fromAccountId}
                onChange={(e) => setFromAccountId(Number(e.target.value))}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
              {fromAccount && (
                <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <fromAccount.icon className="w-5 h-5" style={{ color: fromAccount.color }} />
                    <div>
                      <p className="text-white font-medium">{fromAccount.name}</p>
                      <p className="text-slate-400 text-sm">Disponibile: {formatCurrency(fromAccount.balance)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* A */}
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">A</label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(Number(e.target.value))}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                {accounts.filter(acc => acc.id !== fromAccountId).map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
              {toAccount && (
                <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <toAccount.icon className="w-5 h-5" style={{ color: toAccount.color }} />
                    <div>
                      <p className="text-white font-medium">{toAccount.name}</p>
                      <p className="text-slate-400 text-sm">Saldo: {formatCurrency(toAccount.balance)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Importo */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold flex items-center gap-2">
              <Euro className="w-5 h-5 text-slate-400" />
              Importo da trasferire (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
              required
            />
            {fromAccount && transferAmount > fromAccount.balance && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Fondi insufficienti
              </p>
            )}
          </div>

          {/* Descrizione */}
          <div className="flex flex-col gap-3">
            <label className="text-white font-semibold">Descrizione (opzionale)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Es. Trasferimento per spese mensili"
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
            />
          </div>

          {/* Riepilogo */}
          {transferAmount > 0 && fromAccount && toAccount && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <h3 className="text-green-300 font-semibold mb-2">Riepilogo Trasferimento</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Da:</span>
                  <span className="text-white">{fromAccount.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">A:</span>
                  <span className="text-white">{toAccount.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Importo:</span>
                  <span className="text-white font-bold">{formatCurrency(transferAmount)}</span>
                </div>
                <div className="border-t border-green-500/30 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Nuovo saldo {fromAccount.name}:</span>
                    <span className="text-white">{formatCurrency(fromAccount.balance - transferAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Nuovo saldo {toAccount.name}:</span>
                    <span className="text-white">{formatCurrency(toAccount.balance + transferAmount)}</span>
                  </div>
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
              disabled={!transferAmount || !fromAccount || !toAccount || transferAmount > fromAccount.balance || fromAccount.id === toAccount.id}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftRight className="w-5 h-5" />
              Trasferisci Fondi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;