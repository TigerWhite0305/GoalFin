// src/components/ui/BulkConfirmationModal.tsx - Modal di conferma per operazioni multiple (FIXED)
import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, Palette, Download, Loader } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface BulkConfirmationModalProps {
  isOpen: boolean;
  operation: 'delete' | 'colorChange' | 'export';
  selectedAccountIds: string[];
  accounts: any[];
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  newColor?: string;
}

const BulkConfirmationModal: React.FC<BulkConfirmationModalProps> = ({
  isOpen,
  operation,
  selectedAccountIds,
  accounts,
  onConfirm,
  onCancel,
  newColor
}) => {
  const { isDarkMode } = useTheme(); // ✅ FIX: Usa isDarkMode invece di theme
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  if (!isOpen) return null;

  const selectedAccounts = accounts.filter(acc => selectedAccountIds.includes(acc.id));
  const selectedCount = selectedAccounts.length;

  // ✅ FIX: Crea theme object corretto basato su isDarkMode
  const theme = {
    background: {
      backdrop: isDarkMode ? 'bg-black/70' : 'bg-black/50',
      modal: isDarkMode ? 'bg-slate-800' : 'bg-white',
      secondary: isDarkMode ? 'bg-slate-700' : 'bg-gray-100',
    },
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    },
    border: {
      main: isDarkMode ? 'border-slate-600' : 'border-gray-200',
      card: isDarkMode ? 'border-slate-700' : 'border-gray-200',
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    setProcessedCount(0);

    try {
      // Simula progress per operazioni lunghe
      if (operation === 'delete' && selectedCount > 5) {
        for (let i = 0; i < selectedCount; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setProcessedCount(i + 1);
        }
      }

      await onConfirm();
    } catch (error) {
      console.error('Errore durante operazione bulk:', error);
    } finally {
      setIsProcessing(false);
      setProcessedCount(0);
    }
  };

  const getOperationConfig = () => {
    switch (operation) {
      case 'delete':
        return {
          title: 'Elimina Conti Selezionati',
          description: `Stai per eliminare ${selectedCount} ${selectedCount === 1 ? 'conto' : 'conti'}. Questa azione non può essere annullata.`,
          icon: Trash2,
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/20',
          confirmText: 'Elimina Tutto',
          confirmClass: 'bg-red-600 hover:bg-red-700',
          warning: true
        };
      case 'colorChange':
        return {
          title: 'Cambia Colore Conti',
          description: `Stai per cambiare il colore di ${selectedCount} ${selectedCount === 1 ? 'conto' : 'conti'}.`,
          icon: Palette,
          iconColor: 'text-amber-400',
          iconBg: 'bg-amber-500/20',
          confirmText: 'Cambia Colore',
          confirmClass: 'bg-amber-600 hover:bg-amber-700',
          warning: false
        };
      case 'export':
        return {
          title: 'Esporta Conti Selezionati',
          description: `Stai per esportare i dati di ${selectedCount} ${selectedCount === 1 ? 'conto' : 'conti'}.`,
          icon: Download,
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/20',
          confirmText: 'Esporta',
          confirmClass: 'bg-blue-600 hover:bg-blue-700',
          warning: false
        };
      default:
        return {
          title: 'Conferma Operazione',
          description: 'Conferma l\'operazione sui conti selezionati.',
          icon: AlertTriangle,
          iconColor: 'text-yellow-400',
          iconBg: 'bg-yellow-500/20',
          confirmText: 'Conferma',
          confirmClass: 'bg-indigo-600 hover:bg-indigo-700',
          warning: false
        };
    }
  };

  const config = getOperationConfig();
  const IconComponent = config.icon;

  return (
    <div className={`fixed inset-0 ${theme.background.backdrop} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`${theme.background.modal} ${theme.border.main} border rounded-2xl w-full max-w-lg shadow-2xl transition-colors duration-300`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 ${theme.border.card} border-b`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center`}>
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div>
              <h2 className={`${theme.text.primary} text-xl font-bold`}>
                {config.title}
              </h2>
              <p className={`${theme.text.muted} text-sm`}>
                {config.description}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className={`p-2 hover:bg-gray-700/50 rounded-lg ${theme.text.muted} hover:text-gray-50 transition-all disabled:opacity-50`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning per operazioni pericolose */}
          {config.warning && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Attenzione: questa operazione è irreversibile</span>
              </div>
            </div>
          )}

          {/* Color preview per cambio colore */}
          {operation === 'colorChange' && newColor && (
            <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`${theme.text.secondary} text-sm`}>Nuovo colore:</span>
                <div 
                  className={`w-6 h-6 rounded-lg border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}
                  style={{ backgroundColor: newColor }}
                />
              </div>
            </div>
          )}

          {/* Lista conti selezionati */}
          <div className="mb-4">
            <h3 className={`${theme.text.primary} font-semibold mb-2`}>
              Conti coinvolti ({selectedCount}):
            </h3>
            <div className={`max-h-32 overflow-y-auto ${theme.background.secondary} rounded-lg p-3`}>
              {selectedAccounts.map((account, index) => (
                <div key={account.id} className="flex items-center gap-2 py-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: account.color }}
                  />
                  <span className={`${theme.text.primary} text-sm`}>
                    {account.name}
                  </span>
                  <span className={`${theme.text.muted} text-xs ml-auto`}>
                    {account.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress indicator durante processing */}
          {isProcessing && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Loader className="w-4 h-4 animate-spin text-indigo-400" />
                <span className={`${theme.text.secondary} text-sm`}>
                  Elaborazione in corso... {processedCount}/{selectedCount}
                </span>
              </div>
              <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-2`}>
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(processedCount / selectedCount) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 p-6 ${theme.border.card} border-t`}>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-xl ${theme.text.muted} hover:text-gray-50 hover:bg-gray-700/50 transition-all disabled:opacity-50`}
          >
            Annulla
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`px-6 py-2 rounded-xl text-white font-semibold transition-all disabled:opacity-50 ${config.confirmClass} flex items-center gap-2`}
          >
            {isProcessing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Elaborando...
              </>
            ) : (
              <>
                <IconComponent className="w-4 h-4" />
                {config.confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkConfirmationModal;