import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, TrendingUp, Calendar, Euro, FileText, Plus } from "lucide-react";

type InvestmentType = "PAC_ETF" | "ETF_SINGOLO" | "AZIONE";

export type Investment = {
  id: string;
  name: string;
  type: InvestmentType;
  monthlyAmount?: number;
  startDate?: string;
  totalMonths?: number;
  totalInvested: number;
  currentValue: number;
  shares?: number;
  avgBuyPrice?: number;
  currentPrice?: number;
  ytdReturn?: number;
  totalReturn: number;
  isin?: string;
  sector?: string;
  ticker?: string;
};

interface InvestmentModalProps {
  investment?: Investment;
  isNew: boolean;
  onClose: () => void;
  onSave: (investment: Investment) => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ 
  investment, 
  isNew, 
  onClose, 
  onSave 
}) => {
  const [name, setName] = useState(investment?.name ?? "");
  const [type, setType] = useState<InvestmentType>(investment?.type ?? "PAC_ETF");
  const [totalInvested, setTotalInvested] = useState(investment?.totalInvested ?? 0);
  const [currentValue, setCurrentValue] = useState(investment?.currentValue ?? 0);
  const [monthlyAmount, setMonthlyAmount] = useState(investment?.monthlyAmount ?? 0);
  const [startDate, setStartDate] = useState(investment?.startDate ?? "");
  const [totalMonths, setTotalMonths] = useState(investment?.totalMonths ?? 0);
  const [shares, setShares] = useState(investment?.shares ?? 0);
  const [avgBuyPrice, setAvgBuyPrice] = useState(investment?.avgBuyPrice ?? 0);
  const [currentPrice, setCurrentPrice] = useState(investment?.currentPrice ?? 0);
  const [ytdReturn, setYtdReturn] = useState(investment?.ytdReturn ?? 0);
  const [totalReturn, setTotalReturn] = useState(investment?.totalReturn ?? 0);
  const [isin, setIsin] = useState(investment?.isin ?? "");
  const [sector, setSector] = useState(investment?.sector ?? "");
  const [ticker, setTicker] = useState(investment?.ticker ?? "");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !totalInvested) {
      return;
    }
    
    const investmentData: Investment = {
      id: isNew ? Date.now().toString() : investment!.id,
      name,
      type,
      totalInvested,
      currentValue: currentValue || totalInvested,
      monthlyAmount: monthlyAmount || undefined,
      startDate: startDate || undefined,
      totalMonths: totalMonths || undefined,
      shares: shares || undefined,
      avgBuyPrice: avgBuyPrice || undefined,
      currentPrice: currentPrice || undefined,
      ytdReturn: ytdReturn || undefined,
      totalReturn,
      isin: isin || undefined,
      sector: sector || undefined,
      ticker: ticker || undefined,
    };

    onSave(investmentData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
              {isNew ? <Plus className="w-6 h-6 text-white" /> : <TrendingUp className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold">
                {isNew ? "Nuovo" : "Modifica"} Investimento
              </h2>
              <p className="text-slate-400 text-sm">
                {isNew ? "Aggiungi un nuovo investimento al tuo portfolio" : "Modifica i dettagli del tuo investimento"}
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

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Nome e Tipo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-400" />
                Nome Investimento *
              </label>
              <input
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="es. VWCE - Vanguard FTSE All-World"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">Tipo Investimento *</label>
              <select
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                value={type}
                onChange={(e) => setType(e.target.value as InvestmentType)}
              >
                <option value="PAC_ETF">PAC ETF</option>
                <option value="ETF_SINGOLO">ETF</option>
                <option value="AZIONE">Azione</option>
              </select>
            </div>
          </div>

          {/* Ticker e ISIN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">Ticker</label>
              <input
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="es. VWCE"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">ISIN</label>
              <input
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="es. IE00BK5BQT80"
                value={isin}
                onChange={(e) => setIsin(e.target.value)}
              />
            </div>
          </div>

          {/* Campi specifici per PAC ETF */}
          {type === 'PAC_ETF' && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 space-y-4">
              <h3 className="text-blue-300 font-semibold text-lg">Dettagli PAC</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-3">
                  <label className="text-white font-semibold flex items-center gap-2">
                    <Euro className="w-5 h-5 text-slate-400" />
                    Importo Mensile (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="300"
                    value={monthlyAmount || ""}
                    onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-white font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    Data Inizio
                  </label>
                  <input
                    type="date"
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-white font-semibold">Mesi Totali</label>
                  <input
                    type="number"
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="12"
                    value={totalMonths || ""}
                    onChange={(e) => setTotalMonths(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Campo settore per azioni */}
          {type === 'AZIONE' && (
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">Settore</label>
              <input
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="es. Technology"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              />
            </div>
          )}

          {/* Importi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold flex items-center gap-2">
                <Euro className="w-5 h-5 text-slate-400" />
                Totale Investito (€) *
              </label>
              <input
                type="number"
                step="0.01"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="1000"
                value={totalInvested || ""}
                onChange={(e) => setTotalInvested(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold flex items-center gap-2">
                <Euro className="w-5 h-5 text-slate-400" />
                Valore Attuale (€)
              </label>
              <input
                type="number"
                step="0.01"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="1100"
                value={currentValue || ""}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Quote e Prezzi */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">Quantità</label>
              <input
                type="number"
                step="0.01"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="12.5"
                value={shares || ""}
                onChange={(e) => setShares(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">Prezzo Medio (€)</label>
              <input
                type="number"
                step="0.01"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="80"
                value={avgBuyPrice || ""}
                onChange={(e) => setAvgBuyPrice(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">Prezzo Attuale (€)</label>
              <input
                type="number"
                step="0.01"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="88"
                value={currentPrice || ""}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Rendimenti */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">Rendimento YTD (%)</label>
              <input
                type="number"
                step="0.01"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="8.5"
                value={ytdReturn || ""}
                onChange={(e) => setYtdReturn(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-white font-semibold">Rendimento Totale (%)</label>
              <input
                type="number"
                step="0.01"
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-lg placeholder-slate-400 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="10"
                value={totalReturn || ""}
                onChange={(e) => setTotalReturn(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-slate-300 font-semibold hover:bg-slate-600/50 hover:text-white transition-all"
              onClick={onClose}
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
              onClick={handleSubmit}
            >
              <CheckCircle2 className="w-5 h-5" />
              {isNew ? "Crea Investimento" : "Aggiorna"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;