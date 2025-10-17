// src/components/ui/portfolio/hooks/useAccountOperations.ts
import { useState } from 'react';
import type { Account } from './usePortfolioData';

export const useAccountOperations = () => {
  // Modal States
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isBalanceAdjustModalOpen, setIsBalanceAdjustModalOpen] = useState(false);
  
  // Editing States
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();
  const [adjustingAccount, setAdjustingAccount] = useState<Account | undefined>();
  
  // UI States
  const [showBalance, setShowBalance] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Account Modal Actions
  const openAccountModal = (account?: Account) => {
    setEditingAccount(account);
    setIsAccountModalOpen(true);
    setOpenMenuId(null);
  };

  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
    setEditingAccount(undefined);
  };

  // Transfer Modal Actions
  const openTransferModal = () => {
    setIsTransferModalOpen(true);
    setOpenMenuId(null);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  // Balance Adjust Modal Actions
  const openBalanceAdjustModal = (account: Account) => {
    setAdjustingAccount(account);
    setIsBalanceAdjustModalOpen(true);
    setOpenMenuId(null);
  };

  const closeBalanceAdjustModal = () => {
    setIsBalanceAdjustModalOpen(false);
    setAdjustingAccount(undefined);
  };

  // UI Helpers
  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const toggleMenu = (menuId: string | null) => {
    setOpenMenuId(openMenuId === menuId ? null : menuId);
  };

  const closeAllMenus = () => {
    setOpenMenuId(null);
  };

  return {
    // Modal States
    isAccountModalOpen,
    isTransferModalOpen,
    isBalanceAdjustModalOpen,
    
    // Editing States
    editingAccount,
    adjustingAccount,
    
    // UI States
    showBalance,
    openMenuId,
    
    // Modal Actions
    openAccountModal,
    closeAccountModal,
    openTransferModal,
    closeTransferModal,
    openBalanceAdjustModal,
    closeBalanceAdjustModal,
    
    // UI Actions
    toggleBalanceVisibility,
    toggleMenu,
    closeAllMenus,
  };
};