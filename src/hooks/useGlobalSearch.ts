import { useState, useMemo } from 'react';

export type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: 'transaction' | 'portfolio' | 'goal'; // ✅ Rimosso 'investment'
  url: string;
  icon: string;
  amount?: number;
};

export const useGlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Mock data - poi sostituiremo con dati veri
  const allData = {
    transactions: [
      { id: 1, name: "Stipendio", category: "Lavoro", amount: 2500, type: "income" },
      { id: 2, name: "Affitto", category: "Casa", amount: 800, type: "expense" },
      { id: 3, name: "Netflix", category: "Intrattenimento", amount: 15.99, type: "expense" },
      { id: 4, name: "Spesa Supermercato", category: "Cibo", amount: 85, type: "expense" },
      { id: 5, name: "Freelance", category: "Lavoro", amount: 1200, type: "income" },
    ],
    portfolio: [
      { id: 1, name: "Conto Corrente", bank: "UniCredit", balance: 1500 },
      { id: 2, name: "Carta Prepagata", bank: "Revolut", balance: 250 },
      { id: 3, name: "Conto Risparmio", bank: "Intesa Sanpaolo", balance: 5000 },
    ],
    goals: [
      { id: 1, name: "Vacanza Giappone", target: 4500, current: 3800 },
      { id: 2, name: "MacBook Pro", target: 2500, current: 1650 },
      { id: 3, name: "Fondo Emergenza", target: 5000, current: 2200 },
    ]
  };

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const results: SearchResult[] = [];
    const term = searchTerm.toLowerCase();

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
          amount: tx.amount
        });
      }
    });

    // Cerca nel portfolio
    allData.portfolio.forEach(account => {
      if (account.name.toLowerCase().includes(term) || 
          account.bank.toLowerCase().includes(term)) {
        results.push({
          id: `portfolio-${account.id}`,
          title: account.name,
          subtitle: `${account.bank} • €${account.balance}`,
          type: 'portfolio',
          url: '/portfolio',
          icon: '🏦',
          amount: account.balance
        });
      }
    });

    // Cerca negli obiettivi
    allData.goals.forEach(goal => {
      if (goal.name.toLowerCase().includes(term)) {
        results.push({
          id: `goal-${goal.id}`,
          title: goal.name,
          subtitle: `€${goal.current} / €${goal.target}`,
          type: 'goal',
          url: '/',
          icon: '🎯'
        });
      }
    });

    return results.slice(0, 8); // Limite a 8 risultati
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    isOpen,
    setIsOpen,
    searchResults,
    hasResults: searchResults.length > 0
  };
};