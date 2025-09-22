import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PieChart as PieChartIcon, BarChart3, Target, MoreVertical } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export type AssetClass = 'STOCKS' | 'ETF' | 'BONDS' | 'COMMODITIES' | 'REAL_ESTATE' | 'CRYPTO' | 'ALTERNATIVE';

interface AssetAllocation {
  assetClass: AssetClass;
  value: number;
  percentage: number;
  targetPercentage?: number;
  count: number; // Number of investments in this category
}

interface AssetAllocationChartProps {
  data: AssetAllocation[];
  totalValue: number;
  showTargets?: boolean;
  showValues: boolean;
  currency?: string;
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({
  data,
  totalValue,
  showTargets = false,
  showValues,
  currency = "EUR"
}) => {
  const { isDarkMode } = useTheme();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [showMenu, setShowMenu] = useState(false);

  // ✅ THEME COLORS - Design System GoalFin Corretto
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        // 🌙 Tema Scuro (Design System GoalFin)
        background: {
          card: "bg-gray-800/40", // #161920 con opacity
          menu: "bg-gray-700", // #1F2937
          secondary: "bg-gray-700/30"
        },
        text: {
          primary: "text-gray-50", // #F9FAFB
          secondary: "text-gray-300", // #D1D5DB
          muted: "text-gray-400" // #6B7280
        },
        border: {
          main: "border-gray-700/30",
          menu: "border-gray-600/30"
        },
        hover: {
          menu: "hover:bg-gray-600/50",
          card: "hover:bg-gray-700/30"
        },
        chart: {
          grid: "#374151",
          axis: "#9CA3AF"
        }
      };
    } else {
      return {
        // ☀️ Tema Chiaro
        background: {
          card: "bg-gray-50/60", // #F8FAFC con opacity
          menu: "bg-white",
          secondary: "bg-gray-100/50"
        },
        text: {
          primary: "text-gray-900", // #0F172A
          secondary: "text-gray-700", // #334155
          muted: "text-gray-600" // #64748B
        },
        border: {
          main: "border-gray-200/50",
          menu: "border-gray-300/50"
        },
        hover: {
          menu: "hover:bg-gray-100/50",
          card: "hover:bg-gray-200/50"
        },
        chart: {
          grid: "#E5E7EB",
          axis: "#6B7280"
        }
      };
    }
  };

  const theme = getThemeColors();

  // Asset class configuration
  const getAssetClassConfig = (assetClass: AssetClass) => {
    const configs = {
      'STOCKS': { 
        label: 'Azioni', 
        color: '#6366F1', 
        icon: '📈',
        description: 'Azioni singole'
      },
      'ETF': { 
        label: 'ETF', 
        color: '#10B981', 
        icon: '📊',
        description: 'Exchange Traded Funds'
      },
      'BONDS': { 
        label: 'Obbligazioni', 
        color: '#F59E0B', 
        icon: '🏛️',
        description: 'Titoli di stato e corporate'
      },
      'COMMODITIES': { 
        label: 'Materie Prime', 
        color: '#EF4444', 
        icon: '🥇',
        description: 'Oro, petrolio, etc.'
      },
      'REAL_ESTATE': { 
        label: 'Immobiliare', 
        color: '#8B5CF6', 
        icon: '🏠',
        description: 'REIT e immobiliare'
      },
      'CRYPTO': { 
        label: 'Criptovalute', 
        color: '#F97316', 
        icon: '₿',
        description: 'Bitcoin, Ethereum, etc.'
      },
      'ALTERNATIVE': { 
        label: 'Alternativi', 
        color: '#06B6D4', 
        icon: '🔬',
        description: 'P2P, Private Equity, etc.'
      }
    };
    return configs[assetClass];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Prepare chart data
  const chartData = data.map(item => {
    const config = getAssetClassConfig(item.assetClass);
    return {
      ...item,
      name: config.label,
      color: config.color,
      icon: config.icon,
      description: config.description
    };
  });

  // Calculate risk metrics
  const diversificationScore = Math.min(100, (data.length / 7) * 100); // 7 is max asset classes
  const concentrationRisk = Math.max(...data.map(d => d.percentage));
  const riskLevel = concentrationRisk > 50 ? 'Alto' : concentrationRisk > 30 ? 'Medio' : 'Basso';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`${theme.background.card} border ${theme.border.main} rounded-xl p-3 shadow-xl backdrop-blur-sm`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{data.icon}</span>
            <span className={`${theme.text.primary} font-medium`}>{data.name}</span>
          </div>
          <div className="space-y-1 text-sm">
            <p className={`${theme.text.secondary}`}>
              Valore: {showValues ? formatCurrency(data.value) : "••••••"}
            </p>
            <p className={`${theme.text.secondary}`}>
              Percentuale: {formatPercentage(data.percentage)}
            </p>
            <p className={`${theme.text.muted}`}>
              Investimenti: {data.count}
            </p>
            {showTargets && data.targetPercentage && (
              <p className={`${theme.text.muted}`}>
                Target: {formatPercentage(data.targetPercentage)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${theme.background.card} border ${theme.border.main} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg shadow-purple-500/25">
            <PieChartIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>
              Asset Allocation
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs ${theme.text.muted}`}>
                Rischio concentrazione: {riskLevel}
              </span>
              <span className={`text-xs ${theme.text.muted}`}>
                • Diversificazione: {diversificationScore.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Chart Type Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 ${theme.text.muted} ${theme.text.primary} transition-colors rounded-lg ${theme.hover.card}`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className={`absolute top-10 right-0 z-50 w-36 ${theme.background.menu} border ${theme.border.menu} rounded-lg shadow-xl overflow-hidden backdrop-blur-sm`}>
                <button
                  onClick={() => {
                    setChartType('pie');
                    setShowMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left ${theme.text.secondary} ${theme.hover.menu} transition-colors text-sm flex items-center gap-2`}
                >
                  <PieChartIcon className="w-4 h-4" />
                  Grafico Torta
                </button>
                <button
                  onClick={() => {
                    setChartType('bar');
                    setShowMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left ${theme.text.secondary} ${theme.hover.menu} transition-colors text-sm flex items-center gap-2`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Grafico Barre
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 md:h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={chartType === 'pie' ? "80%" : 60}
                innerRadius={chartType === 'pie' ? "50%" : 30}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis 
                dataKey="name" 
                stroke={theme.chart.axis} 
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke={theme.chart.axis} 
                fontSize={11}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="percentage" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Asset List */}
      <div className="space-y-2">
        {chartData.map((asset, index) => {
          const deviation = showTargets && asset.targetPercentage 
            ? asset.percentage - asset.targetPercentage 
            : null;
          
          return (
            <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${theme.hover.card} transition-colors`}>
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-lg">{asset.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`${theme.text.primary} font-medium text-sm`}>
                      {asset.name}
                    </span>
                    <span className={`${theme.text.muted} text-xs`}>
                      ({asset.count})
                    </span>
                  </div>
                  {showTargets && asset.targetPercentage && (
                    <div className={`text-xs ${theme.text.muted}`}>
                      Target: {formatPercentage(asset.targetPercentage)}
                      {deviation && (
                        <span className={`ml-1 ${deviation > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          ({deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right flex-shrink-0">
                <div className={`${theme.text.primary} font-semibold text-sm`}>
                  {formatPercentage(asset.percentage)}
                </div>
                <div className={`${theme.text.muted} text-xs`}>
                  {showValues ? formatCurrency(asset.value) : "••••••"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Summary */}
      <div className={`mt-4 pt-3 border-t ${theme.border.main}`}>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className={`${theme.text.muted} block`}>Asset Classes</span>
            <span className={`${theme.text.primary} font-medium`}>
              {data.length} / 7
            </span>
          </div>
          <div>
            <span className={`${theme.text.muted} block`}>Max Concentrazione</span>
            <span className={`${theme.text.primary} font-medium ${concentrationRisk > 50 ? 'text-red-400' : concentrationRisk > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {formatPercentage(concentrationRisk)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationChart;