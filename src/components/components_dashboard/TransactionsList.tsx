import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TransactionModal } from "../TransactionModal";

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
  const listRef = useRef<HTMLDivElement | null>(null);

  // mappa id -> button element
  const buttonRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());

  const MENU_HEIGHT = 160;
  const MENU_WIDTH = 160;

  useEffect(() => {
    if (openMenuId != null && !transactions.some((t) => t.id === openMenuId)) {
      setOpenMenuId(null);
      setMenuCoords(null);
    }
  }, [transactions, openMenuId]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const date = d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
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

  // Calcola posizione del menu basandosi sul bounding rect del bottone
  const handleToggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    if (openMenuId === id) {
      setOpenMenuId(null);
      setMenuCoords(null);
      return;
    }

    const btn = buttonRefs.current.get(id);
    if (!btn) {
      // fallback: apri menu in alto a sinistra del container
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
      <div className="h-full bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-3xl p-3 sm:p-4 lg:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 flex-shrink-0 gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                <span className="sm:hidden">Transazioni</span>
                <span className="hidden sm:inline">Transazioni Recenti</span>
              </h2>
            </div>

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
              className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">+</span>
            </button>
          </div>

          <Link to="/transactions" className="group flex items-center gap-2 text-slate-300 hover:text-white text-sm sm:text-base lg:text-lg font-medium transition-all duration-300 hover:scale-105">
            <span className="hidden sm:inline">Visualizza tutte</span>
            <span className="sm:hidden">Vedi tutte</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div ref={listRef} className="flex flex-col gap-2 sm:gap-3 overflow-y-auto flex-1 pr-1 sm:pr-2 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 transparent' }}>
          {transactions.slice(0, 5).map((tx, index) => (
            <div
              key={tx.id}
              className={`group relative rounded-xl sm:rounded-2xl transition-all duration-500 transform hover:scale-[1.01] sm:hover:scale-[1.02] ${
                openMenuId === tx.id ? "bg-slate-800/80 shadow-xl ring-2 ring-blue-500/30" : "bg-slate-800/40 hover:bg-slate-700/60 shadow-lg hover:shadow-xl"
              }`}
              style={{ animationDelay: `${index * 100}ms`, animation: 'slideInUp 0.6s ease-out forwards' }}
            >
              <div className="relative flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 overflow-hidden flex-1">
                  <div className="relative">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                      style={{ background: `linear-gradient(135deg, ${tx.color ?? "#6366f1"}, ${tx.color ?? "#6366f1"}cc)` }}>
                      <span className="text-lg sm:text-xl lg:text-2xl">{getCategoryIcon(tx.category)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white text-base sm:text-lg lg:text-xl font-semibold truncate group-hover:text-blue-300 transition-colors duration-300">{tx.name}</h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <p className="text-slate-400 truncate">{tx.category}</p>
                        <span className="hidden sm:inline text-slate-500">•</span>
                        <p className="text-slate-300 sm:hidden">{formatDateShort(tx.date)}</p>
                      </div>
                    </div>

                    <div className="hidden sm:block min-w-0">
                      <p className="text-slate-300 text-sm font-medium">{formatDate(tx.date)}</p>
                    </div>

                    <div className="hidden lg:block flex-1 min-w-0">
                      <p className="text-slate-400 text-sm truncate">{tx.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  <div className="text-right">
                    <span className={`font-bold text-base sm:text-lg lg:text-xl ${tx.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString()}€
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      ref={(el) => {
                        buttonRefs.current.set(tx.id, el);
                      }}
                      onClick={(e) => handleToggleMenu(e, tx.id)}
                      className="group/btn relative p-2 sm:p-3 text-slate-400 hover:text-white transition-all duration-300 rounded-lg sm:rounded-xl hover:bg-slate-700/50"
                      aria-label="Azioni"
                    >
                      <span className="text-lg sm:text-xl transform group-hover/btn:scale-110 transition-transform duration-200">⋮</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-3xl">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* MENU GLOBALE posizionato FIXED (fuori dalle card, non viene più ritagliato) */}
      {openMenuId != null && menuCoords && (
        <>
          {/* overlay per chiudere */}
          <div className="fixed inset-0 z-40" onClick={() => { setOpenMenuId(null); setMenuCoords(null); }} />

          <div style={{ position: "fixed", top: menuCoords.top, left: menuCoords.left, width: MENU_WIDTH }} className="z-50">
            <div className="w-36 sm:w-40 bg-slate-800/95 backdrop-blur-xl border border-slate-600/30 text-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
              <button className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-slate-700/50 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  const txToEdit = transactions.find((t) => t.id === openMenuId);
                  if (txToEdit) setModalTx(txToEdit);
                  setOpenMenuId(null);
                  setMenuCoords(null);
                }}>
                <span className="text-blue-400">✏️</span>
                <span className="text-sm sm:text-base">Modifica</span>
              </button>

              <button className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-slate-700/50 transition-colors duration-200"
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
                <span className="text-purple-400">📋</span>
                <span className="text-sm sm:text-base">Duplica</span>
              </button>

              <button className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-slate-700/50 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  if (openMenuId != null) handleDelete(openMenuId);
                }}>
                <span className="text-red-400">🗑️</span>
                <span className="text-red-400 text-sm sm:text-base">Elimina</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {modalTx && (
        <TransactionModal
          transaction={modalTx}
          isNew={modalTx.id === 0}
          onClose={() => setModalTx(undefined)}
          onSave={handleSave}
        />
      )}

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(51,65,85,0.3); border-radius:3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71,85,105,0.8); border-radius:3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(71,85,105,1); }
      `}</style>
    </div>
  );
};