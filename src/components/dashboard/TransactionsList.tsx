import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Plus, ArrowRight, MoreVertical, Edit, Copy, Trash2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import TransactionModal from "../ui/TransactionModal";

// Definizione del tipo Transaction per TypeScript
export type Transaction = {
  id: number;
  name: string;
  category: string;
  description: string;
  date: string; // ISO string
  amount: number;
  type: "income" | "expense";
  color?: string;
};

const sampleTransactions: Transaction[] = [
  { id: 1, name: "Affitto", category: "Casa", description: "Pagamento mensile affitto appartamento", date: "2025-09-01T09:15:00", amount: 350, type: "expense", color: "#4C6FFF" },
  { id: 2, name: "Stipendio", category: "Lavoro", description: "Pagamento stipendio mensile", date: "2025-09-05T18:00:00", amount: 2000, type: "income", color: "#16A34A" },
  { id: 3, name: "Spesa Supermercato", category: "Cibo", description: "Spesa settimanale supermercato", date: "2025-09-07T12:45:00", amount: 120, type: "expense", color: "#F59E0B" },
  { id: 4, name: "Freelance", category: "Lavoro", description: "Progetto web development", date: "2025-09-10T14:30:00", amount: 800, type: "income", color: "#8B5CF6" },
  { id: 5, name: "Ristorante", category: "Cibo", description: "Cena con amici", date: "2025-09-12T20:00:00", amount: 85, type: "expense", color: "#EF4444" },
  { id: 6, name: "Benzina", category: "Trasporti", description: "Rifornimento auto", date: "2025-09-14T08:15:00", amount: 65, type: "expense", color: "#F97316" },
];

export const TransactionsList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number; placement: "top" | "bottom" } | null>(null);
  const [modalTx, setModalTx] = useState<Transaction | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const listRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());

  const MENU_HEIGHT = 140;
  const MENU_WIDTH = 140;

  // Theme colors - seguendo il nostro design system
  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: "bg-gray-900",
        card: "bg-gray-800/40",
        cardHover: "bg-gray-700/60",
        text: {
          primary: "text-gray-50",
          secondary: "text-gray-300", 
          muted: "text-gray-400"
        },
        border: "border-gray-700/30",
        menu: "bg-gray-800/95 border-gray-600/30"
      };
    } else {
      return {
        background: "bg-white",
        card: "bg-gray-50/60",
        cardHover: "bg-gray-100/80",
        text: {
          primary: "text-gray-900",
          secondary: "text-gray-700",
          muted: "text-gray-600"
        },
        border: "border-gray-200/50",
        menu: "bg-white/95 border-gray-200/50"
      };
    }
  };

  const theme = getThemeColors();

  useEffect(() => {
    if (openMenuId != null && !transactions.some((t) => t.id === openMenuId)) {
      setOpenMenuId(null);
      setMenuCoords(null);
    }
  }, [transactions, openMenuId]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const date = d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });
    const time = d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
    return `${date} ${time}`;
  };

  const formatDateShort = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    setOpenMenuId(null);
    setMenuCoords(null);
    setIsLoading(false);
  };

  const handleToggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    if (openMenuId === id) {
      setOpenMenuId(null);
      setMenuCoords(null);
      return;
    }

    const btn = buttonRefs.current.get(id);
    if (!btn) {
      setOpenMenuId(id);
      setMenuCoords({ top: 80, left: 20, placement: "bottom" });
      return;
    }

    const rect = btn.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeTop = spaceBelow < MENU_HEIGHT;

    const left = Math.min(Math.max(rect.right - MENU_WIDTH, 8), window.innerWidth - MENU_WIDTH - 8);
    const top = placeTop ? rect.top - MENU_HEIGHT - 8 : rect.bottom + 8;

    setMenuCoords({ top, left, placement: placeTop ? "top" : "bottom" });
    setOpenMenuId(id);
  };

  const handleSave = (tx: Transaction) => {
    setTransactions((prev) => {
      const exists = prev.find((t) => t.id === tx.id);
      if (exists) return prev.map((t) => (t.id === tx.id ? tx : t));
      const newId = Math.max(0, ...prev.map((t) => t.id)) + 1;
      return [{ ...tx, id: newId }, ...prev];
    });
    setModalTx(undefined);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Casa": "🏠",
      "Lavoro": "💼", 
      "Cibo": "🍽️",
      "Trasporti": "🚗",
      "Intrattenimento": "🎬",
      "Salute": "🏥",
      "Shopping": "🛍️",
      "Viaggio": "✈️"
    };
    return icons[category] || "💰";
  };

  return (
    <div className="relative h-full">
      <div className={`h-full ${theme.background} ${theme.border} rounded-2xl p-4 shadow-2xl border`}>
        
        {/* Header */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-4 gap-3">
          <div className="flex items-center gap-3">
            <h2 className={`${theme.text.primary} text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-400 bg-clip-text text-transparent`}>
              <span className="sm:hidden">Transazioni</span>
              <span className="hidden sm:inline">Transazioni Recenti</span>
            </h2>

            <button
              onClick={() =>
                setModalTx({
                  id: 0,
                  name: "",
                  category: "",
                  description: "",
                  date: new Date().toISOString(),
                  amount: 0,
                  type: "expense",
                  color: "#6366f1",
                })
              }
              className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Link 
            to="/transactions" 
            className={`group flex items-center gap-1.5 ${theme.text.muted} hover:${theme.text.primary} text-sm font-medium transition-all duration-200 hover:scale-105`}
          >
            <span className="hidden sm:inline">Visualizza tutte</span>
            <span className="sm:hidden">Vedi tutte</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Lista transazioni */}
        <div 
          ref={listRef} 
          className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1 custom-scrollbar"
          style={{ scrollbarWidth: 'thin', scrollbarColor: isDarkMode ? '#475569 transparent' : '#d1d5db transparent' }}
        >
          {transactions.slice(0, 3).map((tx, index) => (
            <div
              key={tx.id}
              className={`group relative rounded-lg transition-all duration-300 transform hover:scale-[1.01] ${
                openMenuId === tx.id 
                  ? `${theme.cardHover} shadow-lg ring-2 ring-indigo-500/30` 
                  : `${theme.card} hover:${theme.cardHover} shadow-sm hover:shadow-md`
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative flex items-center justify-between gap-3 p-3">
                
                {/* Icona e info principale */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg shadow-sm transform group-hover:scale-105 transition-transform duration-200"
                    style={{ background: `linear-gradient(135deg, ${tx.color ?? "#6366f1"}, ${tx.color ?? "#6366f1"}cc)` }}>
                    <span className="text-base sm:text-lg">{getCategoryIcon(tx.category)}</span>
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`${theme.text.primary} text-sm font-semibold truncate group-hover:text-indigo-600 transition-colors duration-200`}>
                        {tx.name}
                      </h3>
                      <div className="flex-shrink-0">
                        <span className={`font-semibold text-sm ${tx.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                          {tx.type === "income" ? "+" : "-"}€{tx.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={theme.text.muted}>{tx.category}</span>
                        <span className={theme.text.muted}>•</span>
                        <span className={theme.text.muted}>{formatDateShort(tx.date)}</span>
                      </div>
                      
                      {/* Menu button */}
                      <button
                        ref={(el) => {
                          buttonRefs.current.set(tx.id, el);
                        }}
                        onClick={(e) => handleToggleMenu(e, tx.id)}
                        className={`p-1.5 ${theme.text.muted} hover:${theme.text.primary} transition-colors duration-200 rounded-md hover:bg-black/10`}
                        aria-label="Azioni"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Descrizione su desktop */}
                    <div className="hidden lg:block">
                      <p className={`${theme.text.muted} text-xs truncate`}>{tx.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm flex items-center justify-center rounded-2xl`}>
            <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Menu contestuale - Portal per evitare clipping */}
      {openMenuId != null && menuCoords && createPortal(
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => { setOpenMenuId(null); setMenuCoords(null); }} 
          />

          <div 
            style={{ 
              position: "fixed", 
              top: menuCoords.top, 
              left: menuCoords.left, 
              width: MENU_WIDTH 
            }} 
            className="z-50"
          >
            <div className={`w-36 ${theme.menu} backdrop-blur-xl border ${theme.text.primary} rounded-lg shadow-2xl overflow-hidden`}>
              <button 
                className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-black/10 transition-colors duration-200`}
                onClick={(e) => {
                  e.stopPropagation();
                  const txToEdit = transactions.find((t) => t.id === openMenuId);
                  if (txToEdit) setModalTx(txToEdit);
                  setOpenMenuId(null);
                  setMenuCoords(null);
                }}>
                <Edit className="w-4 h-4 text-indigo-500" />
                <span className="text-sm">Modifica</span>
              </button>

              <button 
                className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-black/10 transition-colors duration-200`}
                onClick={(e) => {
                  e.stopPropagation();
                  const original = transactions.find((t) => t.id === openMenuId);
                  if (original) {
                    const newId = Math.max(0, ...transactions.map((t) => t.id)) + 1;
                    const newTx = { ...original, id: newId, name: original.name + " (copia)" };
                    setTransactions((prev) => [newTx, ...prev]);
                  }
                  setOpenMenuId(null);
                  setMenuCoords(null);
                }}>
                <Copy className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Duplica</span>
              </button>

              <button 
                className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-black/10 transition-colors duration-200`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (openMenuId != null) handleDelete(openMenuId);
                }}>
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="text-red-500 text-sm">Elimina</span>
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Modal - Portal per centratura corretta */}
      {modalTx && createPortal(
        <TransactionModal
          transaction={modalTx}
          isNew={modalTx.id === 0}
          onClose={() => setModalTx(undefined)}
          onSave={handleSave}
        />,
        document.body
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { 
          background: ${isDarkMode ? 'rgba(51,65,85,0.3)' : 'rgba(229,231,235,0.3)'}; 
          border-radius: 2px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${isDarkMode ? 'rgba(71,85,105,0.8)' : 'rgba(156,163,175,0.8)'}; 
          border-radius: 2px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: ${isDarkMode ? 'rgba(71,85,105,1)' : 'rgba(156,163,175,1)'}; 
        }
      `}</style>
    </div>
  );
};