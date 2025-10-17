// src/components/ui/portfolio/components/AnalyticsOverview.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, ArrowUp, ArrowDown, 
  BarChart3, RefreshCw, AlertCircle, Calendar, Coins
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrency } from '../hooks/portfolioUtils';

interface AnalyticsOverviewProps {
  theme: any;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ theme }) => {
  const { data, isLoading, error, isDemo, refresh, isRefreshing, hasData } = useAnalytics();

  if (isLoading) {
    return (
      <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-6 shadow-lg`}>
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className={`ml-3 ${theme.text.muted}`}>Caricamento analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-6 shadow-lg`}>
        <div className="flex items-center justify-center h-48 text-center">
          <div>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className={`${theme.text.primary} font-medium mb-2`}>Errore caricamento analytics</p>
            <p className={`${theme.text.muted} text-sm mb-4`}>{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Riprova
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-6 shadow-lg`}>
        <div className="text-center py-8">
          <BarChart3 className={`w-16 h-16 ${theme.text.muted} mx-auto mb-4`} />
          <h3 className={`text-xl font-bold ${theme.text.primary} mb-2`}>Nessun dato analytics</h3>
          <p className={`${theme.text.muted} mb-6`}>
            Inizia a usare l'app per vedere i trend e le statistiche dei tuoi conti
          </p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Aggiorna
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/25">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>
              Analytics Overview
            </h3>
            {isDemo && (
              <p className={`${theme.text.muted} text-xs`}>
                Dati demo • Usa l'app per dati reali
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className={`p-2 ${theme.background.glass} ${theme.border.card} border rounded-lg hover:bg-gray-700/50 transition-all duration-200 disabled:opacity-50`}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''} text-indigo-400`} />
        </button>
      </div>

      {/* Cards indicatori principali */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Variazione totale */}
        <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className={`${theme.text.secondary} text-sm font-medium`}>
                Variazione Mensile
              </span>
            </div>
            {(data?.variations?.totalVariation || 0) >= 0 ? (
              <ArrowUp className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500" />
            )}
          </div>
          
          <div className="flex items-end gap-2">
            <span className={`text-2xl font-bold ${theme.text.primary}`}>
              {data?.variations?.totalVariation?.toFixed(1) || '0.0'}%
            </span>
            <span className={`${theme.text.muted} text-sm mb-1`}>
              vs mese scorso
            </span>
          </div>
          
          <div className={`${theme.text.muted} text-xs mt-2`}>
            {formatCurrency(data?.variations?.currentTotal || 0)} → {formatCurrency(data?.variations?.lastMonthTotal || 0)}
          </div>
        </div>

        {/* Numero valute */}
        <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className={`${theme.text.secondary} text-sm font-medium`}>
                Valute
              </span>
            </div>
          </div>
          
          <div className="flex items-end gap-2">
            <span className={`text-2xl font-bold ${theme.text.primary}`}>
              {data?.currencies.currencyCount || 1}
            </span>
            <span className={`${theme.text.muted} text-sm mb-1`}>
              attive
            </span>
          </div>
          
          <div className={`${theme.text.muted} text-xs mt-2`}>
            Valore totale: {formatCurrency(data?.currencies.totalValue || 0)}
          </div>
        </div>

        {/* Conti più performanti */}
        <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
          {data?.variations?.variationsByType && Object.keys(data.variations.variationsByType).length > 0 ? (
            (() => {
              const bestType = Object.values(data.variations.variationsByType)
                .sort((a, b) => b.variation - a.variation)[0];
              
              const isPositive = bestType.variation >= 0;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`${theme.text.secondary} text-sm font-medium`}>
                        {isPositive ? 'Migliore Performance' : 'Performance Meno Negativa'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <span className={`text-2xl font-bold ${isPositive ? theme.text.primary : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{bestType.variation.toFixed(1)}%
                    </span>
                  </div>
                  <div className={`${theme.text.muted} text-xs mt-2 capitalize`}>
                    {bestType.type} ({bestType.accountCount} conti)
                  </div>
                </>
              );
            })()
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className={`${theme.text.secondary} text-sm font-medium`}>
                    Performance
                  </span>
                </div>
              </div>
              
              <div className={`${theme.text.muted} text-sm`}>
                Dati insufficienti
              </div>
            </>
          )}
        </div>
      </div>

      {/* Grafico trend */}
      <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg shadow-lg shadow-green-500/25">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h4 className={`text-base font-bold ${theme.text.primary}`}>
            Trend Saldi Ultimi 3 Mesi
          </h4>
        </div>
        
        {data?.trends.trends && data.trends.trends.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.trends.trends}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: theme.background.card.includes('gray-800') ? '#D1D5DB' : '#374151', 
                  fontSize: 12 
                }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: theme.background.card.includes('gray-800') ? '#D1D5DB' : '#374151', 
                  fontSize: 12 
                }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme.background.card.includes('gray-800') ? '#1f2937' : '#ffffff',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: theme.background.card.includes('gray-800') ? '#ffffff' : '#000000'
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString('it-IT')}
                formatter={(value: number) => [formatCurrency(value), 'Totale']}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-60">
            <div className="text-center">
              <TrendingUp className={`w-12 h-12 ${theme.text.muted} mx-auto mb-3`} />
              <p className={`${theme.text.muted} text-sm`}>
                Dati trend non disponibili
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Breakdown valute */}
      {data?.currencies.currencies && data.currencies.currencies.length > 1 && (
        <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg shadow-amber-500/25">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <h4 className={`text-base font-bold ${theme.text.primary}`}>
              Breakdown per Valuta
            </h4>
          </div>
          
          <div className="space-y-3">
            {data.currencies.currencies.map((currency) => (
              <div key={currency.currency} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {currency.currency}
                    </span>
                  </div>
                  <div>
                    <p className={`${theme.text.primary} font-medium`}>
                      {formatCurrency(currency.totalBalance, currency.currency)}
                    </p>
                    <p className={`${theme.text.muted} text-xs`}>
                      {currency.accountCount} {currency.accountCount === 1 ? 'conto' : 'conti'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${theme.text.primary} font-semibold`}>
                    {currency.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsOverview;