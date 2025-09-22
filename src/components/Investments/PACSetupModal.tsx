import React, { useState, useEffect } from 'react';
import { X, Calendar, Euro, Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

export interface PACPlan {
  id: string;
  name: string;
  investmentSymbol: string; // ISIN o ticker dell'ETF/azione
  investmentName: string;
  monthlyAmount: number;
  startDate: string;
  frequency: 'monthly' | 'quarterly' | 'biannual';
  dayOfMonth: number; // Giorno del mese per l'esecuzione
  isActive: boolean;
  targetAmount?: number;
  endDate?: string;
  executedPayments: number;
  totalInvested: number;
  currentValue: number;
  nextPaymentDate: string;
}

interface PACSetupModalProps {
  pac?: PACPlan;
  isNew: boolean;
  onClose: () => void;
  onSave: (pac: PACPlan) => void;
}

const PACSetupModal: React.FC<PACSetupModalProps> = ({ 
  pac, 
  isNew, 
  onClose, 
  onSave 
}) => {
  const { isDarkMode } = useTheme();
  const { addToast } = useToast();

  // 🎨 Design System Colors - seguendo le specifiche
  const getThemeColors = () => ({
    background: {
      primary: isDarkMode ? "bg-[#0A0B0F]" : "bg-[#FEFEFE]",
      card: isDarkMode ? "bg-[#161920]" : "bg-[#F8FAFC]", 
      secondary: isDarkMode ? "bg-[#1F2937]" : "bg-[#F1F5F9]"
    },
    text: {
      primary: isDarkMode ? "text-[#F9FAFB]" : "text-[#0F172A]",
      secondary: isDarkMode ? "text-[#D1D5DB]" : "text-[#334155]", 
      muted: isDarkMode ? "text-[#6B7280]" : "text-[#64748B]",
      subtle: isDarkMode ? "text-[#9CA3AF]" : "text-[#64748B]"
    },
    accent: {
      primary: "from-indigo-500 via-purple-500 to-teal-400",
      indigo: isDarkMode ? "border-[#6366F1]" : "border-[#6366F1]",
      emerald: isDarkMode ? "border-[#10B981]" : "border-[#10B981]",
      success: isDarkMode ? "text-[#059669]" : "text-[#059669]",
      warning: isDarkMode ? "text-[#D97706]" : "text-[#D97706]"
    },
    border: isDarkMode ? "border-[#374151]" : "border-[#E2E8F0]",
    hover: isDarkMode ? "hover:bg-[#1F2937]" : "hover:bg-[#F1F5F9]"
  });

  const theme = getThemeColors();
  const [name, setName] = useState(pac?.name || '');
  const [investmentSymbol, setInvestmentSymbol] = useState(pac?.investmentSymbol || '');
  const [investmentName, setInvestmentName] = useState(pac?.investmentName || '');
  const [monthlyAmount, setMonthlyAmount] = useState(pac?.monthlyAmount || 100);
  const [startDate, setStartDate] = useState(pac?.startDate || '');
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'biannual'>(pac?.frequency || 'monthly');
  const [dayOfMonth, setDayOfMonth] = useState(pac?.dayOfMonth || 1);
  const [hasTarget, setHasTarget] = useState(!!pac?.targetAmount);
  const [targetAmount, setTargetAmount] = useState(pac?.targetAmount || 10000);
  const [endDate, setEndDate] = useState(pac?.endDate || '');

  // Calcoli predittivi
  const [projectedMonths, setProjectedMonths] = useState(0);
  const [projectedTotal, setProjectedTotal] = useState(0);

  const frequencies = [
    { value: 'monthly', label: 'Mensile', multiplier: 12 },
    { value: 'quarterly', label: 'Trimestrale', multiplier: 4 },
    { value: 'biannual', label: 'Semestrale', multiplier: 2 }
  ];

  const popularETFs = [
    { symbol: 'VWCE.DE', name: 'Vanguard FTSE All-World UCITS ETF', type: 'Azionario Mondiale' },
    { symbol: 'SWDA.MI', name: 'iShares Core MSCI World UCITS ETF', type: 'Azionario Mondiale' },
    { symbol: 'EUNL.DE', name: 'iShares Core MSCI World UCITS ETF EUR', type: 'Azionario Mondiale' },
    { symbol: 'VAGF.DE', name: 'Vanguard Global Aggregate Bond UCITS ETF', type: 'Obbligazionario' },
    { symbol: 'VTWO.MI', name: 'Vanguard FTSE Developed Europe UCITS ETF', type: 'Azionario Europeo' }
  ];

  useEffect(() => {
    if (hasTarget && targetAmount && monthlyAmount) {
      const frequencyMultiplier = frequencies.find(f => f.value === frequency)?.multiplier || 12;
      const monthsToTarget = Math.ceil(targetAmount / (monthlyAmount * frequencyMultiplier / 12));
      setProjectedMonths(monthsToTarget);
      setProjectedTotal(monthsToTarget * (monthlyAmount * frequencyMultiplier / 12));
    } else if (endDate && startDate && monthlyAmount) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      setProjectedMonths(monthsDiff);
      const frequencyMultiplier = frequencies.find(f => f.value === frequency)?.multiplier || 12;
      setProjectedTotal(monthsDiff * (monthlyAmount * frequencyMultiplier / 12));
    }
  }, [hasTarget, targetAmount, monthlyAmount, frequency, endDate, startDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !investmentSymbol || !startDate || monthlyAmount <= 0) {
      addToast('Compila tutti i campi obbligatori', 'error');
      return;
    }

    const newPAC: PACPlan = {
      id: pac?.id || Date.now().toString(),
      name,
      investmentSymbol,
      investmentName,
      monthlyAmount,
      startDate,
      frequency,
      dayOfMonth,
      isActive: true,
      targetAmount: hasTarget ? targetAmount : undefined,
      endDate: hasTarget ? undefined : endDate,
      executedPayments: pac?.executedPayments || 0,
      totalInvested: pac?.totalInvested || 0,
      currentValue: pac?.currentValue || 0,
      nextPaymentDate: calculateNextPaymentDate(startDate, frequency, dayOfMonth)
    };

    onSave(newPAC);
    addToast(
      isNew ? `PAC "${name}" creato con successo` : `PAC "${name}" modificato con successo`,
      'success'
    );
  };

  const calculateNextPaymentDate = (start: string, freq: string, day: number): string => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let nextDate = new Date(currentYear, currentMonth, day);
    
    if (nextDate <= now) {
      switch (freq) {
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'quarterly':
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
        case 'biannual':
          nextDate.setMonth(nextDate.getMonth() + 6);
          break;
      }
    }
    
    return nextDate.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${theme.background.card} rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border ${theme.border}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme.border}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl shadow-lg">
              {isNew ? <Target className="w-6 h-6 text-white" /> : <Target className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className={`${theme.text.primary} text-xl md:text-2xl font-bold`}>
                {isNew ? "Nuovo" : "Modifica"} Piano di Accumulo
              </h2>
              <p className={`${theme.text.muted} text-sm`}>
                {isNew ? "Configura un nuovo PAC per investimenti ricorrenti" : "Modifica il tuo piano esistente"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${theme.hover} rounded-xl ${theme.text.muted} hover:${theme.text.primary} transition-all`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Nome PAC */}
          <div className="space-y-2">
            <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>Nome del Piano</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. PAC ETF World Mensile"
              className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:${theme.accent.indigo} focus:outline-none transition-colors text-sm md:text-base`}
              required
            />
          </div>

          {/* Selezione Investimento */}
          <div className="space-y-3">
            <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>Strumento di Investimento</label>
            
            {/* ETF Popolari */}
            <div className="grid grid-cols-1 gap-2">
              <p className={`${theme.text.muted} text-xs md:text-sm`}>ETF più popolari:</p>
              {popularETFs.map((etf) => (
                <button
                  key={etf.symbol}
                  type="button"
                  onClick={() => {
                    setInvestmentSymbol(etf.symbol);
                    setInvestmentName(etf.name);
                  }}
                  className={`p-3 text-left rounded-xl border transition-all text-sm md:text-base ${
                    investmentSymbol === etf.symbol
                      ? `${theme.accent.indigo} bg-[#6366F1]/10 ${theme.text.primary}`
                      : `${theme.border} ${theme.background.secondary} ${theme.text.secondary} ${theme.hover}`
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{etf.symbol}</p>
                      <p className={`text-xs md:text-sm ${theme.text.muted} truncate`}>{etf.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${theme.background.primary} ${theme.text.muted}`}>
                      {etf.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Input Manuale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={investmentSymbol}
                  onChange={(e) => setInvestmentSymbol(e.target.value)}
                  placeholder="ISIN o Ticker"
                  className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:${theme.accent.indigo} focus:outline-none transition-colors text-sm md:text-base`}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={investmentName}
                  onChange={(e) => setInvestmentName(e.target.value)}
                  placeholder="Nome strumento"
                  className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:${theme.accent.indigo} focus:outline-none transition-colors text-sm md:text-base`}
                />
              </div>
            </div>
          </div>

          {/* Parametri PAC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Importo */}
            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                <Euro className="w-4 h-4" />
                Importo per Versamento
              </label>
              <input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                min="1"
                step="1"
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:${theme.accent.indigo} focus:outline-none transition-colors text-sm md:text-base`}
                required
              />
            </div>

            {/* Frequenza */}
            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>Frequenza</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} focus:${theme.accent.indigo} focus:outline-none transition-colors text-sm md:text-base`}
              >
                {frequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Inizio */}
            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                <Calendar className="w-4 h-4" />
                Data Inizio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} focus:${theme.accent.indigo} focus:outline-none transition-colors text-sm md:text-base`}
                required
              />
            </div>

            {/* Giorno del Mese */}
            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>Giorno Esecuzione</label>
              <input
                type="number"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(Number(e.target.value))}
                min="1"
                max="28"
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} focus:${theme.accent.indigo} focus:outline-none transition-colors text-sm md:text-base`}
              />
              <p className={`${theme.text.muted} text-xs`}>Giorno del mese per l'esecuzione (1-28)</p>
            </div>
          </div>

          {/* Obiettivo o Durata */}
          <div className="space-y-4">
            <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>Criterio di Terminazione</label>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setHasTarget(true)}
                className={`flex-1 p-3 rounded-xl border-2 transition-all text-sm md:text-base ${
                  hasTarget
                    ? `${theme.accent.indigo} bg-[#6366F1]/10 ${theme.text.primary}`
                    : `${theme.border} ${theme.text.muted} ${theme.hover}`
                }`}
              >
                <Target className="w-5 h-5 mx-auto mb-1" />
                Importo Obiettivo
              </button>
              
              <button
                type="button"
                onClick={() => setHasTarget(false)}
                className={`flex-1 p-3 rounded-xl border-2 transition-all text-sm md:text-base ${
                  !hasTarget
                    ? `${theme.accent.indigo} bg-[#6366F1]/10 ${theme.text.primary}`
                    : `${theme.border} ${theme.text.muted} ${theme.hover}`
                }`}
              >
                <Calendar className="w-5 h-5 mx-auto mb-1" />
                Data Fine
              </button>
            </div>

            {hasTarget ? (
              <div>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  placeholder="Importo obiettivo"
                  min="1"
                  className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:${theme.accent.indigo} focus:outline-none transition-colors text-sm md:text-base`}
                />
              </div>
            ) : (
              <div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} focus:${theme.accent.indigo} focus:outline-none transition-colors text-sm md:text-base`}
                />
              </div>
            )}
          </div>

          {/* Proiezioni */}
          {projectedMonths > 0 && (
            <div className={`${theme.background.secondary}/50 rounded-xl p-4 space-y-3 border ${theme.border}`}>
              <h3 className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                <TrendingUp className="w-4 h-4" />
                Proiezione Piano
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
                <div>
                  <p className={theme.text.muted}>Durata Prevista</p>
                  <p className={`${theme.text.primary} font-medium`}>{projectedMonths} mesi</p>
                </div>
                <div>
                  <p className={theme.text.muted}>Investimento Totale</p>
                  <p className={`${theme.text.primary} font-medium`}>€{projectedTotal.toLocaleString()}</p>
                </div>
                <div>
                  <p className={theme.text.muted}>Versamenti Annui</p>
                  <p className={`${theme.text.primary} font-medium`}>
                    {frequencies.find(f => f.value === frequency)?.multiplier} versamenti
                  </p>
                </div>
                <div>
                  <p className={theme.text.muted}>Prossimo Versamento</p>
                  <p className={`${theme.text.primary} font-medium`}>
                    {new Date(calculateNextPaymentDate(startDate, frequency, dayOfMonth)).toLocaleDateString('it-IT')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Avviso */}
          <div className={`bg-[#0284C7]/10 border border-[#0284C7]/20 rounded-xl p-4 flex gap-3`}>
            <AlertCircle className="w-5 h-5 text-[#0284C7] flex-shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm">
              <p className="text-[#0284C7] font-medium">Informazioni Importanti</p>
              <p className={`${theme.text.secondary} mt-1 leading-relaxed`}>
                • I versamenti saranno automatici secondo la frequenza impostata<br />
                • Assicurati di avere fondi sufficienti nel conto collegato<br />
                • Puoi modificare o sospendere il PAC in qualsiasi momento
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 px-4 ${theme.background.secondary} ${theme.hover} ${theme.text.primary} rounded-xl transition-all font-medium text-sm md:text-base`}
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 text-sm md:text-base shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isNew ? "Crea PAC" : "Salva Modifiche"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );}

export default PACSetupModal;