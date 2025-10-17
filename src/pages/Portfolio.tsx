// src/pages/Portfolio.tsx - REFACTORED VERSION
import React from "react";
import { RefreshCw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { hasToken } from "../utils/tokenStorage"; // Importa hasToken

// Custom Hooks
import { usePortfolioData } from "../components/ui/portfolio/hooks/usePortfolioData";
import { useBulkOperations } from "../components/ui/portfolio/hooks/useBulkOperations";
import { useAccountOperations } from "../components/ui/portfolio/hooks/useAccountOperations";

// Components
import PortfolioHeader from "../components/ui/portfolio/components/PortfolioHeader";
import TotalBalanceCard from "../components/ui/portfolio/components/TotalBalanceCard";
import AnalyticsOverview from "../components/ui/portfolio/components/AnalyticsOverview";
import EmptyPortfolioState from "../components/ui/portfolio/components/EmptyPortfolioState";
import AccountsGrid from "../components/ui/portfolio/components/AccountsGrid";
import DistributionChart from "../components/ui/portfolio/components/DistributionChart";
import ActivityHistory from "../components/ui/portfolio/components/ActivityHistory";

// Modals and UI Components
import AccountModal from "../components/ui/portfolio/AccountModal";
import TransferModal from "../components/ui/portfolio/TransferModal";
import BalanceAdjustModal from "../components/ui/portfolio/BalanceAdjustModal";
import BulkOperationsBar from "../components/ui/portfolio/BulkOperationsBar";
import BulkConfirmationModal from "../components/ui/portfolio/BulkConfirmationModal";

// Utils
import { getThemeColors } from "../components/ui/portfolio/hooks/portfolioUtils";

const Portfolio: React.FC = () => {
  const { isDarkMode } = useTheme();
  const theme = getThemeColors(isDarkMode);

  // Portfolio Data Hook
  const {
    accounts,
    isLoading,
    highlightedAccountId,
    activityHistory,
    totalBalance,
    accountsChartData,
    createAccount,
    updateAccount,
    deleteAccount,
    transferBetweenAccounts,
    adjustAccountBalance,
    removeActivity,
  } = usePortfolioData();

  // Account Operations Hook
  const {
    isAccountModalOpen,
    isTransferModalOpen,
    isBalanceAdjustModalOpen,
    editingAccount,
    adjustingAccount,
    showBalance,
    openMenuId,
    openAccountModal,
    closeAccountModal,
    openTransferModal,
    closeTransferModal,
    openBalanceAdjustModal,
    closeBalanceAdjustModal,
    toggleBalanceVisibility,
    toggleMenu,
  } = useAccountOperations();

  // Bulk Operations Hook
  const {
    selectionMode,
    selectedAccountIds,
    bulkOperation,
    isBulkConfirmationOpen,
    pendingBulkColor,
    handleSelectionChange,
    handleSelectAll,
    handleDeselectAll,
    toggleSelectionMode,
    handleBulkDelete,
    handleBulkColorChange,
    handleBulkExport,
    executeBulkOperation,
    cancelBulkOperation,
  } = useBulkOperations(accounts, () => {}, () => {});

  // Account Handlers
  const handleAddAccount = () => {
    openAccountModal();
  };

  const handleEditAccount = (account: any) => {
    openAccountModal(account);
  };

  const handleSaveAccount = async (accountData: any) => {
    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, accountData);
      } else {
        await createAccount(accountData);
      }
      closeAccountModal();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    await deleteAccount(accountId);
  };

  const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number, description?: string) => {
    const success = await transferBetweenAccounts(fromAccountId, toAccountId, amount, description);
    if (success) {
      closeTransferModal();
    }
  };

  const handleAdjustBalance = (account: any) => {
    openBalanceAdjustModal(account);
  };

  const handleSaveBalanceAdjustment = async (accountId: string, newBalance: number, reason: string) => {
    const success = await adjustAccountBalance(accountId, newBalance, reason);
    if (success) {
      closeBalanceAdjustModal();
    }
  };

  const handleDeleteActivity = (activityId: number) => {
    removeActivity(activityId);
    toggleMenu(null);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme.background.primary} flex items-center justify-center`}>
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className={theme.text.muted}>Caricamento portafoglio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background.primary} ${theme.text.primary} transition-colors duration-300`}>
      <div className="w-full h-full p-4 md:p-6 space-y-6">
        
        {/* Header */}
        <PortfolioHeader
          theme={theme}
          selectionMode={selectionMode}
          onToggleSelectionMode={toggleSelectionMode}
          hasAccounts={accounts.length > 0}
        />

        {/* Bulk Operations Bar */}
        <BulkOperationsBar
          selectedAccountIds={selectedAccountIds}
          accounts={accounts}
          onDeselectAll={handleDeselectAll}
          onSelectAll={handleSelectAll}
          onBulkDelete={handleBulkDelete}
          onBulkColorChange={handleBulkColorChange}
          onBulkExport={handleBulkExport}
        />

        {/* Total Balance Card */}
        <TotalBalanceCard
          theme={theme}
          totalBalance={totalBalance}
          accountsCount={accounts.length}
          showBalance={showBalance}
          onToggleBalanceVisibility={toggleBalanceVisibility}
          onOpenTransferModal={openTransferModal}
          onAddAccount={handleAddAccount}
          canTransfer={accounts.length >= 2}
        />

        {/* Main Content */}
        {accounts.length === 0 ? (
          <EmptyPortfolioState
            theme={theme}
            onAddAccount={handleAddAccount}
          />
        ) : (
          <>
            {/* Accounts Grid */}
            <AccountsGrid
              accounts={accounts}
              theme={theme}
              showBalance={showBalance}
              highlightedAccountId={highlightedAccountId}
              selectedAccountIds={selectedAccountIds}
              selectionMode={selectionMode}
              openMenuId={openMenuId}
              onSelectionChange={handleSelectionChange}
              setOpenMenuId={toggleMenu}
              onEdit={handleEditAccount}
              onDelete={handleDeleteAccount}
              onAdjustBalance={handleAdjustBalance}
              onTransfer={openTransferModal}
            />

            {/* Analytics Overview - Dopo gli account */}
            <AnalyticsOverview theme={theme} />

            {/* Distribution Chart - Only if 2+ accounts */}
            {accounts.length > 1 && (
              <DistributionChart
                accounts={accounts}
                accountsChartData={accountsChartData}
                totalBalance={totalBalance}
                theme={theme}
              />
            )}

            {/* Activity History */}
            <ActivityHistory
              activityHistory={activityHistory}
              theme={theme}
              openMenuId={openMenuId}
              onToggleMenu={toggleMenu}
              onDeleteActivity={handleDeleteActivity}
            />
          </>
        )}
      </div>

      {/* Modals */}
      {isAccountModalOpen && (
        <AccountModal
          account={editingAccount}
          isNew={!editingAccount}
          onClose={closeAccountModal}
          onSave={handleSaveAccount}
        />
      )}

      {isTransferModalOpen && (
        <TransferModal
          accounts={accounts}
          onClose={closeTransferModal}
          onTransfer={handleTransfer}
        />
      )}

      {isBalanceAdjustModalOpen && adjustingAccount && (
        <BalanceAdjustModal
          account={adjustingAccount}
          onClose={closeBalanceAdjustModal}
          onAdjust={handleSaveBalanceAdjustment}
        />
      )}

      <BulkConfirmationModal
        isOpen={isBulkConfirmationOpen}
        operation={bulkOperation!}
        selectedAccountIds={selectedAccountIds}
        accounts={accounts}
        onConfirm={executeBulkOperation}
        onCancel={cancelBulkOperation}
        newColor={pendingBulkColor}
      />
    </div>
  );
};

export default Portfolio;