import React, { useState, useEffect } from 'react';
import { X, TrendingUp, DollarSign, Hash, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { 
  Investment, 
  AssetClass, 
  InvestmentType, 
  Currency, 
  ASSET_CLASS_LABELS, 
  INVESTMENT_TYPE_LABELS,
  CURRENCY_SYMBOLS
} from '../../utils/AssetTypes';

interface InvestmentModalProps {
  investment?: Investment;
  isNew: boolean;
  onClose: () => void;
  onSave: (investment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ 
  investment, 
  isNew, 
  onClose, 
  onSave 
}) => {
  const { isDarkMode } = useTheme();
  const { addToast } = useToast();

  // Form state
  const [name, setName] = useState(investment?.name || '');
  const [symbol, setSymbol] = useState(investment?.symbol || '');
  const [assetClass, setAssetClass] = useState<AssetClass>(investment?.assetClass || AssetClass.STOCKS);
  const [type, setType] = useState<InvestmentType>(investment?.type || InvestmentType.SINGLE_PURCHASE);
  const [shares, setShares] = useState(investment?.shares || 0);
  const [buyPrice, setBuyPrice] = useState(investment?.avgBuyPrice || 0);
  const [currency, setCurrency] = useState<Currency>(investment?.currency || Currency.EUR);
  const [fees, setFees] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [sector, setSector] = useState(investment?.sector || '');
  const [country, setCountry] = useState(investment?.country || '');
  const [isin, setIsin] = useState(investment?.isin || '');
  const [description, setDescription] = useState(investment?.description || '');

  // Calculations
  const totalAmount = shares * buyPrice;
  const totalCost = totalAmount + fees;

  // Theme colors
  const getThemeColors = () => ({
    background: {
      primary: isDarkMode ? "bg-[#0A0B0F]" : "bg-[#FEFEFE]",
      card: isDarkMode ? "bg-[#161920]" : "bg-[#F8FAFC]", 
      secondary: isDarkMode ? "bg-[#1F2937]" : "bg-[#F1F5F9]"
    },
    text: {
      primary: isDarkMode ? "text-[#F9FAFB]" : "text-[#0F172A]",
      secondary: isDarkMode ? "text-[#D1D5DB]" : "text-[#334155]", 
      muted: isDarkMode ? "text-[#6B7280]" : "text-[#64748B]"
    },
    border: isDarkMode ? "border-[#374151]" : "border-[#E2E8F0]",
    hover: isDarkMode ? "hover:bg-[#1F2937]" : "hover:bg-[#F1F5F9]"
  });

  const theme = getThemeColors();

  // Popular instruments by asset class
  const getPopularInstruments = (assetClass: AssetClass) => {
    const instruments: Record<AssetClass, { symbol: string; name: string; sector: string }[]> = {
      [AssetClass.ETF]: [
        { symbol: 'VWCE.DE', name: 'Vanguard FTSE All-World UCITS ETF', sector: 'Diversificato' },
        { symbol: 'SWDA.MI', name: 'iShares Core MSCI World UCITS ETF', sector: 'Diversificato' },
        { symbol: 'EUNL.DE', name: 'iShares Core MSCI World UCITS ETF EUR', sector: 'Diversificato' }
      ],
      [AssetClass.STOCKS]: [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
        { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Consumer Cyclical' }
      ],
      [AssetClass.BONDS]: [
        { symbol: 'VECP.DE', name: 'Vanguard EUR Corporate Bond UCITS ETF', sector: 'Obbligazionario' },
        { symbol: 'VGEA.DE', name: 'Vanguard EUR Government Bond UCITS ETF', sector: 'Obbligazionario' }
      ],
      [AssetClass.CRYPTO]: [
        { symbol: 'BTC-EUR', name: 'Bitcoin', sector: 'Cryptocurrency' },
        { symbol: 'ETH-EUR', name: 'Ethereum', sector: 'Cryptocurrency' }
      ],
      [AssetClass.COMMODITIES]: [
        { symbol: 'GLD', name: 'SPDR Gold Shares', sector: 'Precious Metals' },
        { symbol: 'USO', name: 'United States Oil Fund', sector: 'Energy' },
        { symbol: 'DBA', name: 'Invesco DB Agriculture Fund', sector: 'Agriculture' }
      ],
      [AssetClass.REAL_ESTATE]: [
        { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', sector: 'Real Estate' },
        { symbol: 'REIT.MI', name: 'iShares European Property Yield UCITS ETF', sector: 'Real Estate' }
      ],
      [AssetClass.ALTERNATIVE]: [
        { symbol: 'IAU', name: 'iShares Gold Trust', sector: 'Precious Metals' },
        { symbol: 'PDBC', name: 'Invesco Optimum Yield Diversified Commodity', sector: 'Commodities' }
      ]
    };

    return instruments[assetClass] || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !symbol || shares <= 0 || buyPrice <= 0) {
      addToast('Compila tutti i campi obbligatori', 'error');
      return;
    }

    // Simula prezzo di mercato attuale (in realtà verrebbe da API)
    const simulatedCurrentPrice = buyPrice * (0.95 + Math.random() * 0.1); // ±5% dal prezzo di acquisto
    const dayChange = simulatedCurrentPrice - buyPrice;
    const dayChangePercent = (dayChange / buyPrice) * 100;

    const newInvestment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      symbol,
      assetClass,
      type,
      
      // Market data (simulate)
      currentPrice: simulatedCurrentPrice,
      previousClose: buyPrice,
      dayChange,
      dayChangePercent,
      currency,
      lastUpdated: new Date().toISOString(),
      
      // User portfolio data
      shares,
      avgBuyPrice: buyPrice,
      totalInvested: totalCost,
      currentValue: shares * simulatedCurrentPrice,
      
      // Additional info
      sector: sector || undefined,
      country: country || undefined,
      isin: isin || undefined,
      description: description || undefined,
      
      // Calculated fields
      totalReturn: (shares * simulatedCurrentPrice) - totalCost,
      totalReturnPercent: ((shares * simulatedCurrentPrice) - totalCost) / totalCost * 100,
      portfolioWeight: 0, // Will be calculated later
      
      // Status
      isActive: true
    };

    await onSave(newInvestment);
    addToast(
      isNew ? `Investimento "${name}" aggiunto con successo` : `Investimento "${name}" aggiornato`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${theme.background.card} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border ${theme.border}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme.border}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`${theme.text.primary} text-xl md:text-2xl font-bold`}>
                {isNew ? "Nuovo" : "Modifica"} Investimento
              </h2>
              <p className={`${theme.text.muted} text-sm`}>
                {isNew ? "Registra un nuovo acquisto nel tuo portfolio" : "Modifica i dettagli dell'investimento"}
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
          
          {/* Asset Class & Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                Classe di Asset
              </label>
              <select
                value={assetClass}
                onChange={(e) => {
                  setAssetClass(e.target.value as AssetClass);
                  // Reset fields when changing asset class
                  setSymbol('');
                  setName('');
                  setSector('');
                }}
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
              >
                {Object.values(AssetClass).map(ac => (
                  <option key={ac} value={ac}>
                    {ASSET_CLASS_LABELS[ac]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                Tipo Investimento
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InvestmentType)}
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
              >
                {Object.values(InvestmentType)
                  .filter(it => it !== InvestmentType.PAC) // PAC ha il suo modal
                  .map(it => (
                  <option key={it} value={it}>
                    {INVESTMENT_TYPE_LABELS[it]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Popular Instruments */}
          <div className="space-y-3">
            <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
              Strumenti Popolari
            </label>
            <div className="grid grid-cols-1 gap-2">
              {getPopularInstruments(assetClass).map((instrument) => (
                <button
                  key={instrument.symbol}
                  type="button"
                  onClick={() => {
                    setSymbol(instrument.symbol);
                    setName(instrument.name);
                    setSector(instrument.sector);
                  }}
                  className={`p-3 text-left rounded-xl border transition-all text-sm md:text-base ${
                    symbol === instrument.symbol
                      ? `border-[#6366F1] bg-[#6366F1]/10 ${theme.text.primary}`
                      : `${theme.border} ${theme.background.secondary} ${theme.text.secondary} ${theme.hover}`
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{instrument.symbol}</p>
                      <p className={`text-xs md:text-sm ${theme.text.muted} truncate`}>{instrument.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${theme.background.primary} ${theme.text.muted}`}>
                      {instrument.sector}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Instrument Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                Simbolo/Ticker
              </label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="es. AAPL, VWCE.DE"
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="es. Apple Inc."
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
                required
              />
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                <Hash className="w-4 h-4" />
                Quantità
              </label>
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                min="0.000001"
                step="0.000001"
                placeholder="100"
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                <DollarSign className="w-4 h-4" />
                Prezzo di Acquisto
              </label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                min="0.01"
                step="0.01"
                placeholder="150.00"
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                Valuta
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
              >
                {Object.values(Currency).map(curr => (
                  <option key={curr} value={curr}>
                    {curr} ({CURRENCY_SYMBOLS[curr]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                Commissioni
              </label>
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(Number(e.target.value))}
                min="0"
                step="0.01"
                placeholder="9.95"
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
              />
            </div>

            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                <Calendar className="w-4 h-4" />
                Data Acquisto
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
              />
            </div>
          </div>

          {/* Optional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                Settore (Opzionale)
              </label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Technology"
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
              />
            </div>

            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                Paese (Opzionale)
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="USA"
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
              />
            </div>

            <div className="space-y-2">
              <label className={`${theme.text.primary} font-semibold text-sm md:text-base`}>
                ISIN (Opzionale)
              </label>
              <input
                type="text"
                value={isin}
                onChange={(e) => setIsin(e.target.value.toUpperCase())}
                placeholder="US0378331005"
                className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
              <FileText className="w-4 h-4" />
              Note (Opzionale)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Note personali sull'investimento..."
              rows={2}
              className={`w-full p-3 ${theme.background.secondary} border ${theme.border} rounded-xl ${theme.text.primary} placeholder:${theme.text.muted} focus:border-[#6366F1] focus:outline-none transition-colors text-sm md:text-base resize-none`}
            />
          </div>

          {/* Summary */}
          {shares > 0 && buyPrice > 0 && (
            <div className={`${theme.background.secondary}/50 rounded-xl p-4 space-y-3 border ${theme.border}`}>
              <h3 className={`${theme.text.primary} font-semibold flex items-center gap-2 text-sm md:text-base`}>
                <DollarSign className="w-4 h-4" />
                Riepilogo Investimento
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm">
                <div>
                  <p className={theme.text.muted}>Valore Titoli</p>
                  <p className={`${theme.text.primary} font-medium`}>
                    {CURRENCY_SYMBOLS[currency]}{totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={theme.text.muted}>Commissioni</p>
                  <p className={`${theme.text.primary} font-medium`}>
                    {CURRENCY_SYMBOLS[currency]}{fees.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={theme.text.muted}>Costo Totale</p>
                  <p className={`${theme.text.primary} font-medium`}>
                    {CURRENCY_SYMBOLS[currency]}{totalCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={theme.text.muted}>Prezzo Medio</p>
                  <p className={`${theme.text.primary} font-medium`}>
                    {CURRENCY_SYMBOLS[currency]}{(totalCost / shares).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

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
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5BF7] hover:to-[#7C3AED] text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 text-sm md:text-base shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isNew ? "Aggiungi Investimento" : "Salva Modifiche"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default InvestmentModal;