import React, { useState } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, Calendar, TrendingUp, TrendingDown, MoreVertical } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface PerformanceDataPoint {
  date: string;
  portfolioValue: number;
  totalInvested: number;
  profit: number;
  profitPercent: number;
  benchmark?: number; // Optional benchmark comparison
}

interface PortfolioPerformanceChartProps {
  data: PerformanceDataPoint[];
  showBenchmark?: boolean;
  benchmarkName?: string;
  currency?: string;
}

const PortfolioPerformanceChart: React.FC<PortfolioPerformanceChartProps> = ({ 
  data, 
  showBenchmark = false,
  benchmarkName = "FTSE All-World",
  currency = "EUR"
}) => {
  const { isDarkMode } = useTheme();
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');
  const [showMenu, setShowMenu] = useState(false);

  // Theme colors
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: {
          card: "bg-gray-800",
          menu: "bg-gray-700"
        },
        text: {
          primary: "text-gray-50",
          secondary: "text-gray-300",
          muted: "text-gray-400"
        },
        border: {
          main: "border-gray-700",
          menu: "border-gray-600"
        },
        chart: {
          grid: "#374151",
          axis: "#9CA3AF",
          profit: "#10B981",
          loss: "#EF4444",
          invested: "#6366F1",
          benchmark: "#F59E0B"
        }
      };
    } else {
      return {
        background: {
          card: "bg-white",
          menu: "bg-gray-50"
        },
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-700",
          muted: "text-gray-600"
        },
        border: {
          main: "border-gray-200",
          menu: "border-gray-300"
        },
        chart: {
          grid: "#E5E7EB",
          axis: "#6B7280",
          profit: "#059669",
          loss: "#DC2626",
          invested: "#4F46E5",
          benchmark: "#D97706"
        }
      };
    }
  };

  const theme = getThemeColors();

  // Filter data based on time range
  const getFilteredData = () => {
    if (timeRange === 'ALL') return data;
    
    const now = new Date();
    const monthsBack = {
      '1M': 1,
      '3M': 3,
      '6M': 6,
      '1Y': 12
    }[timeRange];
    
    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate());
    
    return data.filter(point => new Date(point.date) >= cutoffDate);
  };

  const filteredData = getFilteredData();

  // Calculate statistics
  const latestData = filteredData[filteredData.length - 1];
  const firstData = filteredData[0];
  const totalReturn = latestData ? latestData.portfolioValue - firstData.portfolioValue : 0;
  const totalReturnPercent = firstData ? ((latestData.portfolioValue - firstData.portfolioValue) / firstData.portfolioValue) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { 
      month: 'short', 
      year: timeRange === '1M' ? undefined : '2-digit' 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`${theme.background.card} ${theme.border.main} border rounded-xl p-3 shadow-xl backdrop-blur-sm`}>
          <p className={`${theme.text.muted} text-sm mb-2`}>
            {new Date(label).toLocaleDateString('it-IT', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })}
          </p>
          <div className="space-y-1">
            <p className={`${theme.text.primary} font-medium text-sm`}>
              Valore: {formatCurrency(data.portfolioValue)}
            </p>
            <p className={`${theme.text.secondary} text-sm`}>
              Investito: {formatCurrency(data.totalInvested)}
            </p>
            <p className={`text-sm ${data.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              P&L: {formatCurrency(data.profit)} ({formatPercentage(data.profitPercent)})
            </p>
            {showBenchmark && data.benchmark && (
              <p className="text-amber-400 text-sm">
                {benchmarkName}: {formatPercentage(data.benchmark)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${theme.background.card} ${theme.border.main} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/25">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`text-base md:text-lg font-bold ${theme.text.primary}`}>
              Performance Portfolio
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm ${totalReturnPercent >= 0 ? 'text-emerald-400' : 'text-red-400'} font-medium`}>
                {formatPercentage(totalReturnPercent)}
              </span>
              <span className={`${theme.text.muted} text-xs`}>
                ({formatCurrency(totalReturn)})
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex bg-gray-200/20 dark:bg-gray-800/40 rounded-lg p-1">
            {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  timeRange === range 
                    ? 'bg-emerald-500 text-white shadow-sm' 
                    : `${theme.text.muted} hover:text-gray-300 dark:hover:text-gray-300 light:hover:text-gray-700 hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-200/50`
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Chart Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 ${theme.text.muted} hover:text-gray-50 dark:hover:text-gray-50 light:hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-200/50`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className={`absolute top-10 right-0 z-50 w-40 ${theme.background.menu} ${theme.border.menu} border rounded-lg shadow-xl overflow-hidden`}>
                  <button
                    onClick={() => {
                      setChartType(chartType === 'area' ? 'line' : 'area');
                      setShowMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left ${theme.text.secondary} hover:bg-gray-600/50 dark:hover:bg-gray-600/50 light:hover:bg-gray-200/50 transition-colors text-sm`}
                  >
                    {chartType === 'area' ? 'Vista Linea' : 'Vista Area'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis 
                dataKey="date" 
                stroke={theme.chart.axis} 
                fontSize={11}
                tickFormatter={formatDate}
              />
              <YAxis 
                stroke={theme.chart.axis} 
                fontSize={11}
                tickFormatter={(value) => formatCurrency(value).replace(',00', '')}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Portfolio Value Area */}
              <Area 
                type="monotone" 
                dataKey="portfolioValue" 
                stroke={theme.chart.profit}
                fill={theme.chart.profit}
                fillOpacity={0.1}
                strokeWidth={2}
                name="Valore Portfolio"
              />
              
              {/* Total Invested Line */}
              <Area 
                type="monotone" 
                dataKey="totalInvested" 
                stroke={theme.chart.invested}
                fill="transparent"
                strokeWidth={1}
                strokeDasharray="5 5"
                name="Capitale Investito"
              />

              {/* Benchmark if enabled */}
              {showBenchmark && (
                <Area 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke={theme.chart.benchmark}
                  fill="transparent"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  name={benchmarkName}
                />
              )}
            </AreaChart>
          ) : (
            <LineChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis 
                dataKey="date" 
                stroke={theme.chart.axis} 
                fontSize={11}
                tickFormatter={formatDate}
              />
              <YAxis 
                stroke={theme.chart.axis} 
                fontSize={11}
                tickFormatter={(value) => formatCurrency(value).replace(',00', '')}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line 
                type="monotone" 
                dataKey="portfolioValue" 
                stroke={theme.chart.profit}
                strokeWidth={2}
                dot={false}
                name="Valore Portfolio"
              />
              
              <Line 
                type="monotone" 
                dataKey="totalInvested" 
                stroke={theme.chart.invested}
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Capitale Investito"
              />

              {showBenchmark && (
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke={theme.chart.benchmark}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  name={benchmarkName}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-700/30 dark:border-gray-700/30 light:border-gray-200/30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.chart.profit }}></div>
          <span className={`${theme.text.muted} text-xs`}>Valore Portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 rounded" style={{ backgroundColor: theme.chart.invested }}></div>
          <span className={`${theme.text.muted} text-xs`}>Capitale Investito</span>
        </div>
        {showBenchmark && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded" style={{ backgroundColor: theme.chart.benchmark }}></div>
            <span className={`${theme.text.muted} text-xs`}>{benchmarkName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPerformanceChart;