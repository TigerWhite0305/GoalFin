import React from "react";
import { Filter, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { AssetClass } from "../../utils/AssetTypes";

interface AssetClassCounts {
  [key: string]: number;
}

interface AssetClassFilterProps {
  selectedAssetClass: AssetClass | 'ALL';
  assetClassCounts: AssetClassCounts;
  onFilterChange: (assetClass: AssetClass | 'ALL') => void;
  totalInvestments: number;
}

const AssetClassFilter: React.FC<AssetClassFilterProps> = ({
  selectedAssetClass,
  assetClassCounts,
  onFilterChange,
  totalInvestments
}) => {
  const { isDarkMode } = useTheme();

  // Theme colors
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: {
          card: "bg-gray-800",
          active: "text-white",
          inactive: "bg-gray-800"
        },
        text: {
          primary: "text-gray-50",
          secondary: "text-gray-300",
          muted: "text-gray-400"
        },
        border: {
          main: "border-gray-700"
        },
        hover: "hover:bg-gray-700/50"
      };
    } else {
      return {
        background: {
          card: "bg-white",
          active: "text-white",
          inactive: "bg-white"
        },
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-700",
          muted: "text-gray-600"
        },
        border: {
          main: "border-gray-200"
        },
        hover: "hover:bg-gray-100/50"
      };
    }
  };

  const theme = getThemeColors();

  // Asset class configuration
  const assetClassConfigs = [
    {
      key: 'ALL' as const,
      label: 'Tutti',
      color: '#6B7280',
      icon: '📊',
      count: totalInvestments
    },
    {
      key: 'STOCKS' as const,
      label: 'Azioni',
      color: '#6366F1',
      icon: '📈',
      count: assetClassCounts['STOCKS'] || 0
    },
    {
      key: 'ETF' as const,
      label: 'ETF',
      color: '#10B981',
      icon: '📊',
      count: assetClassCounts['ETF'] || 0
    },
    {
      key: 'BONDS' as const,
      label: 'Obbligazioni',
      color: '#F59E0B',
      icon: '🏛️',
      count: assetClassCounts['BONDS'] || 0
    },
    {
      key: 'COMMODITIES' as const,
      label: 'Materie Prime',
      color: '#EF4444',
      icon: '🥇',
      count: assetClassCounts['COMMODITIES'] || 0
    },
    {
      key: 'REAL_ESTATE' as const,
      label: 'Immobiliare',
      color: '#8B5CF6',
      icon: '🏠',
      count: assetClassCounts['REAL_ESTATE'] || 0
    },
    {
      key: 'CRYPTO' as const,
      label: 'Crypto',
      color: '#F97316',
      icon: '₿',
      count: assetClassCounts['CRYPTO'] || 0
    },
    {
      key: 'ALTERNATIVE' as const,
      label: 'Alternativi',
      color: '#06B6D4',
      icon: '🔬',
      count: assetClassCounts['ALTERNATIVE'] || 0
    }
  ];

    // Filter out categories with 0 investments (except ALL)
    const availableFilters = assetClassConfigs.filter(config => 
      config.key === 'ALL' || config.count > 0
    );
  
    return (
      <div className={`p-4 ${theme.background.card} ${theme.border.main}`}>
        {availableFilters.map(filter => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key as AssetClass | 'ALL')}
            className={`flex items-center p-2 m-1 rounded ${theme.hover}`}
            style={{ backgroundColor: filter.key !== 'ALL' ? filter.color : undefined }}
          >
            <span>{filter.icon}</span>
            <span className="ml-2">{filter.label}</span>
            <span className="ml-auto">{filter.count}</span>
          </button>
        ))}
      </div>
    );
  };