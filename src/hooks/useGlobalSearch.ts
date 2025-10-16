// src/hooks/useGlobalSearch.ts - POTENZIATO CON ACCOUNT REALI
import { useState, useMemo, useEffect } from 'react';
import { getAccountsApi } from '../api/accountsApi';

export type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: 'transaction' | 'portfolio' | 'goal' | 'account'; // ✅ Aggiunto 'account'
  url: string;
  icon: string;
  amount?: number;
  accountId?: string; // ✅ Per navigazione diretta al conto
  relevance?: number;
};

// Type per Account compatibile
type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  color?: string;
  bank?: string;
  isActive?: boolean;
};

export const useGlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  // Carica gli account reali dal backend
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setIsLoadingAccounts(true);
        const apiAccounts = await getAccountsApi();
        
        // Formatta gli account per la ricerca
        const formattedAccounts: Account[] = apiAccounts.map(acc => ({
          id: acc.id,
          name: acc.name,
          type: acc.type,
          balance: acc.balance,
          currency: acc.currency,
          color: acc.color,
          bank: '', // Non viene dal backend, lo impostiamo vuoto
          isActive: acc.isActive
        }));
        
        setAccounts(formattedAccounts.filter(acc => acc.isActive !== false));
      } catch (error) {
        console.error('Errore caricamento account per ricerca:', error);
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    loadAccounts();
  }, []);

  // Mock data per transazioni e goals (da sostituire quando avremo le API)
  const allData = {
    transactions: [
      { id: 1, name: "Stipendio", category: "Lavoro", amount: 2500, type: "income" },
      { id: 2, name: "Affitto", category: "Casa", amount: 800, type: "expense" },
      { id: 3, name: "Netflix", category: "Intrattenimento", amount: 15.99, type: "expense" },
      { id: 4, name: "Spesa Supermercato", category: "Cibo", amount: 85, type: "expense" },
      { id: 5, name: "Freelance", category: "Lavoro", amount: 1200, type: "income" },
    ],
    goals: [
      { id: 1, name: "Vacanza Giappone", target: 4500, current: 3800 },
      { id: 2, name: "MacBook Pro", target: 2500, current: 1650 },
      { id: 3, name: "Fondo Emergenza", target: 5000, current: 2200 },
    ]
  };

  // Funzione per ottenere l'icona del tipo di conto
  const getAccountTypeIcon = (type: string): string => {
    switch (type) {
      case 'checking': return '🏛️';
      case 'savings': return '🐷';
      case 'card':
      case 'prepaid': return '💳';
      case 'investment': 
      case 'business': return '🏢';
      case 'cash': return '💰';
      default: return '🏦';
    }
  };

  // Funzione per ottenere l'etichetta del tipo di conto
  const getAccountTypeLabel = (type: string): string => {
    switch (type) {
      case 'checking': return 'Conto Corrente';
      case 'savings': return 'Conto Risparmio';
      case 'card':
      case 'prepaid': return 'Carta';
      case 'investment': return 'Investimenti';
      case 'business': return 'Business';
      case 'cash': return 'Contanti';
      default: return 'Altro';
    }
  };

  // Logica di ricerca potenziata
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const results: SearchResult[] = [];
    const term = searchTerm.toLowerCase();

    // ✅ RICERCA NEGLI ACCOUNT REALI (priorità alta)
    accounts.forEach(account => {
      const accountTypeLabel = getAccountTypeLabel(account.type);
      const matchesName = account.name.toLowerCase().includes(term);
      const matchesType = account.type.toLowerCase().includes(term) || 
                         accountTypeLabel.toLowerCase().includes(term);
      const matchesBank = account.bank?.toLowerCase().includes(term);
      
      // Ricerca per termini comuni
      const matchesCommonTerms = (
        (term === 'conto' && (account.type === 'checking' || account.type === 'savings')) ||
        (term === 'carta' && (account.type === 'card' || account.type === 'prepaid')) ||
        (term === 'risparmio' && account.type === 'savings') ||
        (term === 'corrente' && account.type === 'checking') ||
        (term === 'business' && account.type === 'business')
      );

      if (matchesName || matchesType || matchesBank || matchesCommonTerms) {
        // Calcola rilevanza per ordinamento
        let relevance = 0;
        if (matchesName) relevance += 10;
        if (matchesType) relevance += 5;
        if (matchesBank) relevance += 3;
        if (matchesCommonTerms) relevance += 7;

        results.push({
          id: `account-${account.id}`,
          title: account.name,
          subtitle: `${accountTypeLabel} • ${account.currency === 'EUR' ? '€' : account.currency}${account.balance.toLocaleString()}`,
          type: 'account',
          url: `/portfolio?highlight=${account.id}`, // ✅ URL con highlight
          icon: getAccountTypeIcon(account.type),
          amount: account.balance,
          accountId: account.id,
          relevance // Per ordinamento interno
        } as SearchResult & { relevance: number });
      }
    });

    // Cerca nelle transazioni
    allData.transactions.forEach(tx => {
      if (tx.name.toLowerCase().includes(term) || 
          tx.category.toLowerCase().includes(term)) {
        results.push({
          id: `tx-${tx.id}`,
          title: tx.name,
          subtitle: `${tx.category} • €${tx.amount}`,
          type: 'transaction',
          url: '/transactions',
          icon: tx.type === 'income' ? '💰' : '💸',
          amount: tx.amount,
          relevance: tx.name.toLowerCase().includes(term) ? 8 : 4
        } as SearchResult & { relevance: number });
      }
    });

    // Cerca negli obiettivi
    allData.goals.forEach(goal => {
      if (goal.name.toLowerCase().includes(term)) {
        results.push({
          id: `goal-${goal.id}`,
          title: goal.name,
          subtitle: `€${goal.current.toLocaleString()} / €${goal.target.toLocaleString()}`,
          type: 'goal',
          url: '/',
          icon: '🎯',
          relevance: 6
        } as SearchResult & { relevance: number });
      }
    });

    // ✅ ORDINA PER RILEVANZA E TIPO
    const sortedResults = results
      .sort((a, b) => {
        const aRel = (a as any).relevance || 0;
        const bRel = (b as any).relevance || 0;
        
        // Prima per rilevanza, poi per tipo (account hanno priorità)
        if (aRel !== bRel) return bRel - aRel;
        if (a.type === 'account' && b.type !== 'account') return -1;
        if (b.type === 'account' && a.type !== 'account') return 1;
        return 0;
      })
      .map(({ relevance, ...result }) => result) // Rimuovi campo relevance
      .slice(0, 8); // Limite a 8 risultati

    return sortedResults;
  }, [searchTerm, accounts]);

  return {
    searchTerm,
    setSearchTerm,
    isOpen,
    setIsOpen,
    searchResults,
    hasResults: searchResults.length > 0,
    isLoadingAccounts
  };
};