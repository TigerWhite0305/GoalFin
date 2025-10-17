// src/components/ui/portfolio/components/AccountsGrid.tsx
import React from 'react';
import SwipeableAccountCard from '../SwipeableAccountCard';
import { renderAccountIcon, getDefaultColorForType, formatCurrency, formatDate, getAccountTypeLabel } from '../hooks/portfolioUtils';
import type { Account } from '../hooks/usePortfolioData';

interface AccountsGridProps {
  accounts: Account[];
  theme: any;
  showBalance: boolean;
  highlightedAccountId: string | null;
  selectedAccountIds: string[];
  selectionMode: boolean;
  openMenuId: string | null;
  onSelectionChange: (accountId: string, selected: boolean) => void;
  setOpenMenuId: (id: string | null) => void;
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
  onAdjustBalance: (account: Account) => void;
  onTransfer: () => void;
}

const AccountsGrid: React.FC<AccountsGridProps> = ({
  accounts,
  theme,
  showBalance,
  highlightedAccountId,
  selectedAccountIds,
  selectionMode,
  openMenuId,
  onSelectionChange,
  setOpenMenuId,
  onEdit,
  onDelete,
  onAdjustBalance,
  onTransfer
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {accounts.map((account) => {
        const IconComponent = renderAccountIcon(account);
        const accountColor = account.color || getDefaultColorForType(account.type);
        const isHighlighted = highlightedAccountId === account.id;
        const isSelected = selectedAccountIds.includes(account.id);
        
        return (
          <SwipeableAccountCard
            key={account.id}
            account={account}
            IconComponent={IconComponent}
            accountColor={accountColor}
            isHighlighted={isHighlighted}
            showBalance={showBalance}
            theme={theme}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            onEdit={onEdit}
            onDelete={onDelete}
            onAdjustBalance={onAdjustBalance}
            onTransfer={onTransfer}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            getAccountTypeLabel={getAccountTypeLabel}
            isSelected={isSelected}
            onSelectionChange={onSelectionChange}
            selectionMode={selectionMode}
          />
        );
      })}
    </div>
  );
};

export default AccountsGrid;