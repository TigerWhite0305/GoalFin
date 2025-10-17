// src/components/ui/portfolio/hooks/useBulkOperations.ts
import { useState } from 'react';
import { useToast } from '../../../../context/ToastContext';
import { updateAccountApi, deleteAccountApi } from '../../../../api/accountsApi';
import type { Account, ActivityHistoryItem } from './usePortfolioData';

export type BulkOperationType = 'delete' | 'colorChange' | 'export' | null;

export const useBulkOperations = (
  accounts: Account[],
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>,
  addActivity: (activity: Omit<ActivityHistoryItem, 'id' | 'timestamp'>) => void
) => {
  const { addToast } = useToast();
  
  // Selection States
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  
  // Bulk Operation States
  const [bulkOperation, setBulkOperation] = useState<BulkOperationType>(null);
  const [isBulkConfirmationOpen, setIsBulkConfirmationOpen] = useState(false);
  const [pendingBulkColor, setPendingBulkColor] = useState<string>('');

  // Selection Handlers
  const handleSelectionChange = (accountId: string, selected: boolean) => {
    setSelectedAccountIds(prev => 
      selected 
        ? [...prev, accountId]
        : prev.filter(id => id !== accountId)
    );
  };

  const handleSelectAll = () => {
    setSelectedAccountIds(accounts.map(acc => acc.id));
  };

  const handleDeselectAll = () => {
    setSelectedAccountIds([]);
    setSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedAccountIds([]);
  };

  // Bulk Operation Triggers
  const handleBulkDelete = async (accountIds: string[]) => {
    setBulkOperation('delete');
    setIsBulkConfirmationOpen(true);
  };

  const handleBulkColorChange = async (accountIds: string[], color: string) => {
    setPendingBulkColor(color);
    setBulkOperation('colorChange');
    setIsBulkConfirmationOpen(true);
  };

  const handleBulkExport = async (accountIds: string[]) => {
    setBulkOperation('export');
    setIsBulkConfirmationOpen(true);
  };

  // Execute Bulk Operations
  const executeBulkOperation = async () => {
    const selectedAccounts = accounts.filter(acc => selectedAccountIds.includes(acc.id));
    
    try {
      switch (bulkOperation) {
        case 'delete':
          // Delete all selected accounts
          for (const accountId of selectedAccountIds) {
            await deleteAccountApi(accountId);
          }
          
          setAccounts(prev => prev.filter(acc => !selectedAccountIds.includes(acc.id)));
          
          addActivity({
            type: 'bulk_operation',
            description: `Eliminati ${selectedAccountIds.length} conti in blocco`,
            icon: 'Trash2',
            color: '#EF4444'
          });
          
          addToast(`${selectedAccountIds.length} conti eliminati con successo`, 'success');
          break;

        case 'colorChange':
          // Update color for all selected accounts
          const updatePromises = selectedAccountIds.map(accountId => {
            const account = accounts.find(acc => acc.id === accountId);
            if (account) {
              return updateAccountApi(accountId, { ...account, color: pendingBulkColor });
            }
            return Promise.resolve();
          });
          
          await Promise.all(updatePromises);
          
          setAccounts(prev => prev.map(acc => 
            selectedAccountIds.includes(acc.id) 
              ? { ...acc, color: pendingBulkColor }
              : acc
          ));
          
          addActivity({
            type: 'bulk_operation',
            description: `Cambiato colore di ${selectedAccountIds.length} conti`,
            icon: 'Edit',
            color: pendingBulkColor
          });
          
          addToast(`Colore aggiornato per ${selectedAccountIds.length} conti`, 'success');
          break;

        case 'export':
          // Export selected accounts data
          const exportData = selectedAccounts.map(account => ({
            name: account.name,
            type: account.type,
            balance: account.balance,
            currency: account.currency,
            bank: account.bank || '',
            createdAt: account.createdAt
          }));
          
          const dataStr = JSON.stringify(exportData, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `conti-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          addActivity({
            type: 'bulk_operation',
            description: `Esportati ${selectedAccountIds.length} conti`,
            icon: 'ArrowUpRight',
            color: '#3B82F6'
          });
          
          addToast(`${selectedAccountIds.length} conti esportati con successo`, 'success');
          break;
      }
      
      // Reset states after successful operation
      resetBulkOperationStates();
      
    } catch (error: any) {
      console.error('❌ Errore operazione bulk:', error);
      addToast('Errore durante l\'operazione multipla', 'error');
    }
  };

  // Reset all bulk operation states
  const resetBulkOperationStates = () => {
    setSelectedAccountIds([]);
    setSelectionMode(false);
    setIsBulkConfirmationOpen(false);
    setBulkOperation(null);
    setPendingBulkColor('');
  };

  // Cancel bulk operation
  const cancelBulkOperation = () => {
    setIsBulkConfirmationOpen(false);
    setBulkOperation(null);
    setPendingBulkColor('');
  };

  // Computed values
  const hasSelectedAccounts = selectedAccountIds.length > 0;
  const selectedAccountsCount = selectedAccountIds.length;
  const allAccountsSelected = selectedAccountIds.length === accounts.length && accounts.length > 0;

  return {
    // Selection States
    selectionMode,
    selectedAccountIds,
    hasSelectedAccounts,
    selectedAccountsCount,
    allAccountsSelected,
    
    // Bulk Operation States
    bulkOperation,
    isBulkConfirmationOpen,
    pendingBulkColor,
    
    // Selection Actions
    handleSelectionChange,
    handleSelectAll,
    handleDeselectAll,
    toggleSelectionMode,
    
    // Bulk Operation Actions
    handleBulkDelete,
    handleBulkColorChange,
    handleBulkExport,
    executeBulkOperation,
    cancelBulkOperation,
    resetBulkOperationStates,
  };
};