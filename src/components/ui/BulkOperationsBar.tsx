// src/components/ui/BulkOperationsBar.tsx - Toolbar per operazioni multiple (FIXED)
import React, { useState } from 'react';
import { Trash2, Palette, Download, CheckSquare, Square, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface BulkOperationsBarProps {
  selectedAccountIds: string[];
  accounts: any[];
  onDeselectAll: () => void;
  onSelectAll: () => void;
  onBulkDelete: (accountIds: string[]) => void;
  onBulkColorChange: (accountIds: string[], color: string) => void;
  onBulkExport: (accountIds: string[]) => void;
}

const BulkOperationsBar: React.FC<BulkOperationsBarProps> = ({
  selectedAccountIds,
  accounts,
  onDeselectAll,
  onSelectAll,
  onBulkDelete,
  onBulkColorChange,
  onBulkExport
}) => {
  const { isDarkMode } = useTheme(); // ✅ FIX: Usa isDarkMode invece di theme
  const [showColorPicker, setShowColorPicker] = useState(false);

  const selectedCount = selectedAccountIds.length;
  const totalCount = accounts.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  if (selectedCount === 0) return null;

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16',
    '#EC4899', '#6B7280'
  ];

  // ✅ FIX: Crea theme object corretto basato su isDarkMode
  const theme = {
    background: {
      card: isDarkMode ? 'bg-slate-800' : 'bg-white',
    },
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    },
    border: {
      card: isDarkMode ? 'border-slate-700' : 'border-gray-200',
    }
  };

  return (
    <div className={`${theme.background.card} ${theme.border.card} border rounded-xl p-4 shadow-lg mb-6 transition-all duration-200`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Selection Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className={`p-2 rounded-lg ${theme.text.muted} hover:text-indigo-400 transition-colors`}
          >
            {isAllSelected ? (
              <CheckSquare className="w-5 h-5 text-indigo-400" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>
          
          <div>
            <span className={`${theme.text.primary} font-semibold`}>
              {selectedCount} di {totalCount} {selectedCount === 1 ? 'conto selezionato' : 'conti selezionati'}
            </span>
            <div className={`${theme.text.muted} text-sm`}>
              Seleziona i conti per eseguire operazioni multiple
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Color Change */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 hover:border-amber-500/50 rounded-lg text-amber-400 hover:text-amber-300 transition-all flex items-center gap-2 text-sm"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Colore</span>
            </button>

            {showColorPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
                <div className={`absolute top-12 right-0 z-50 ${theme.background.card} ${theme.border.card} border rounded-lg shadow-xl p-3`}>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          onBulkColorChange(selectedAccountIds, color);
                          setShowColorPicker(false);
                        }}
                        className={`w-8 h-8 rounded-lg border-2 transition-colors ${
                          isDarkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-400 hover:border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Export */}
          <button
            onClick={() => onBulkExport(selectedAccountIds)}
            className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-blue-400 hover:text-blue-300 transition-all flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Esporta</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => onBulkDelete(selectedAccountIds)}
            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all flex items-center gap-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Elimina</span>
            <span className="sm:hidden">({selectedCount})</span>
          </button>

          {/* Deselect All */}
          <button
            onClick={onDeselectAll}
            className={`p-2 rounded-lg ${theme.text.muted} hover:text-red-400 transition-colors`}
            title="Deseleziona tutto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsBar;