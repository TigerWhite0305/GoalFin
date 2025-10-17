// src/components/ui/portfolio/portfolioUtils.ts
import { 
  Wallet, CreditCard, PiggyBank, Building, Landmark 
} from "lucide-react";
import type { Account } from './usePortfolioData';

// ==========================================
// ICON UTILITIES
// ==========================================

// Icon mapping for account types
export const getIconForType = (type: string) => {
  switch (type) {
    case 'checking': return Landmark;
    case 'savings': return PiggyBank;
    case 'prepaid': 
    case 'card':
    case 'credit_card': return CreditCard;
    case 'business':
    case 'investment': return Building;
    case 'cash': return Wallet;
    default: return Wallet;
  }
};

// Render account icon with fallback
export const renderAccountIcon = (account: Account) => {
  const IconComponent = getIconForType(account.icon || account.type);
  return IconComponent;
};

// ==========================================
// COLOR UTILITIES
// ==========================================

// Default color mapping for account types
export const getDefaultColorForType = (type: string): string => {
  switch (type) {
    case 'checking': return '#6366F1';
    case 'savings': return '#10B981';
    case 'prepaid':
    case 'card':
    case 'credit_card': return '#F59E0B';
    case 'business':
    case 'investment': return '#8B5CF6';
    case 'cash': return '#EC4899';
    default: return '#6366F1';
  }
};

// ==========================================
// FORMATTING UTILITIES
// ==========================================

// Currency formatting
export const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Date formatting
export const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString("it-IT", { 
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric" 
  });
};

// Time formatting
export const formatTime = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleTimeString("it-IT", { 
    hour: "2-digit", 
    minute: "2-digit" 
  });
};

// Percentage formatting
export const formatPercentage = (percentage: number, decimals: number = 1) => {
  return percentage.toFixed(decimals);
};

// ==========================================
// LABEL UTILITIES
// ==========================================

// Account type labels for display
export const getAccountTypeLabel = (type: string) => {
  switch (type) {
    case 'checking': return 'Conto Corrente';
    case 'savings': return 'Conto Risparmio';
    case 'prepaid': 
    case 'card':
    case 'credit_card': return 'Carta';
    case 'business': 
    case 'investment': return 'Business';
    case 'cash': return 'Contanti';
    default: return 'Altro';
  }
};

// ==========================================
// THEME UTILITIES
// ==========================================

// Theme configuration
export const getThemeColors = (isDarkMode: boolean) => {
  if (isDarkMode) {
    return {
      background: {
        primary: "bg-gray-900",
        card: "bg-gray-800",
        cardHover: "hover:bg-gray-700",
        secondary: "bg-gray-700",
        glass: "bg-gray-800/60 backdrop-blur-sm"
      },
      text: {
        primary: "text-gray-50",
        secondary: "text-gray-300",
        muted: "text-gray-400",
        subtle: "text-gray-500"
      },
      border: {
        main: "border-gray-700",
        card: "border-gray-700",
        cardHover: "hover:border-gray-600"
      }
    };
  } else {
    return {
      background: {
        primary: "bg-white",
        card: "bg-white",
        cardHover: "hover:bg-gray-50",
        secondary: "bg-gray-100",
        glass: "bg-white/60 backdrop-blur-sm"
      },
      text: {
        primary: "text-gray-900",
        secondary: "text-gray-700",
        muted: "text-gray-600",
        subtle: "text-gray-500"
      },
      border: {
        main: "border-gray-200",
        card: "border-gray-200",
        cardHover: "hover:border-gray-300"
      }
    };
  }
};

// ==========================================
// CALCULATION UTILITIES
// ==========================================

// Calculate total balance
export const calculateTotalBalance = (accounts: Account[]) => {
  return accounts.reduce((sum, account) => sum + account.balance, 0);
};

// Calculate percentage of account balance relative to total
export const calculateAccountPercentage = (accountBalance: number, totalBalance: number) => {
  if (totalBalance === 0) return 0;
  return ((accountBalance / totalBalance) * 100);
};

// Check if account has sufficient funds for transfer
export const hasInsufficientFunds = (account: Account, amount: number) => {
  return account.balance < amount;
};

// ==========================================
// CHART UTILITIES
// ==========================================

// Chart data preparation
export const prepareChartData = (accounts: Account[]) => {
  return accounts.map(account => ({
    name: account.name,
    value: account.balance,
    color: account.color || getDefaultColorForType(account.type)
  }));
};

// ==========================================
// VALIDATION UTILITIES
// ==========================================

// Validation helpers
export const validateAccountData = (accountData: any) => {
  const errors: string[] = [];
  
  if (!accountData.name?.trim()) {
    errors.push('Il nome del conto è obbligatorio');
  }
  
  if (!accountData.type) {
    errors.push('Il tipo di conto è obbligatorio');
  }
  
  if (accountData.balance && isNaN(parseFloat(accountData.balance))) {
    errors.push('Il saldo deve essere un numero valido');
  }
  
  if (accountData.balance && parseFloat(accountData.balance) < 0) {
    errors.push('Il saldo non può essere negativo');
  }
  
  return errors;
};

// Validate transfer data
export const validateTransferData = (fromAccountId: string, toAccountId: string, amount: number, accounts: Account[]) => {
  const errors: string[] = [];
  
  if (!fromAccountId) {
    errors.push('Seleziona il conto di origine');
  }
  
  if (!toAccountId) {
    errors.push('Seleziona il conto di destinazione');
  }
  
  if (fromAccountId === toAccountId) {
    errors.push('I conti di origine e destinazione devono essere diversi');
  }
  
  if (!amount || amount <= 0) {
    errors.push('L\'importo deve essere maggiore di zero');
  }
  
  const fromAccount = accounts.find(acc => acc.id === fromAccountId);
  if (fromAccount && hasInsufficientFunds(fromAccount, amount)) {
    errors.push('Fondi insufficienti nel conto di origine');
  }
  
  return errors;
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Generate unique ID for activity items
export const generateActivityId = () => {
  return Date.now() + Math.random();
};

// Debounce function for search/filtering
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Sort accounts by different criteria
export const sortAccounts = (accounts: Account[], sortBy: 'name' | 'balance' | 'type' | 'date', ascending: boolean = true) => {
  const sorted = [...accounts].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'balance':
        comparison = a.balance - b.balance;
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'date':
        comparison = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        break;
    }
    
    return ascending ? comparison : -comparison;
  });
  
  return sorted;
};

// Filter accounts by type
export const filterAccountsByType = (accounts: Account[], type: string) => {
  if (type === 'all') return accounts;
  return accounts.filter(account => account.type === type);
};

// Search accounts by name
export const searchAccounts = (accounts: Account[], searchTerm: string) => {
  if (!searchTerm.trim()) return accounts;
  
  const term = searchTerm.toLowerCase();
  return accounts.filter(account => 
    account.name.toLowerCase().includes(term) ||
    getAccountTypeLabel(account.type).toLowerCase().includes(term)
  );
};

// Export accounts data to different formats
export const exportAccountsData = (accounts: Account[], format: 'json' | 'csv') => {
  const data = accounts.map(account => ({
    name: account.name,
    type: getAccountTypeLabel(account.type),
    balance: account.balance,
    currency: account.currency,
    bank: account.bank || '',
    createdAt: account.createdAt
  }));
  
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  } else if (format === 'csv') {
    const headers = ['Nome', 'Tipo', 'Saldo', 'Valuta', 'Banca', 'Data Creazione'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.name}"`,
        `"${row.type}"`,
        row.balance,
        `"${row.currency}"`,
        `"${row.bank}"`,
        `"${formatDate(row.createdAt || '')}"`
      ].join(','))
    ].join('\n');
    
    return csvContent;
  }
  
  return '';
};

// Download file helper
export const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};