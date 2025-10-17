// src/components/ui/SwipeableAccountCard.tsx - Enhanced con checkbox per bulk operations
import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, DollarSign, ArrowLeftRight, CheckSquare, Square } from 'lucide-react';

interface SwipeableAccountCardProps {
  account: any;
  IconComponent: React.ComponentType<any>;
  accountColor: string;
  isHighlighted: boolean;
  showBalance: boolean;
  theme: any;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onEdit: (account: any) => void;
  onDelete: (accountId: string) => void;
  onAdjustBalance: (account: any) => void;
  onTransfer: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  getAccountTypeLabel: (type: string) => string;
  // Nuove props per bulk operations
  isSelected?: boolean;
  onSelectionChange?: (accountId: string, selected: boolean) => void;
  selectionMode?: boolean;
}

const SwipeableAccountCard: React.FC<SwipeableAccountCardProps> = ({
  account,
  IconComponent,
  accountColor,
  isHighlighted,
  showBalance,
  theme,
  openMenuId,
  setOpenMenuId,
  onEdit,
  onDelete,
  onAdjustBalance,
  onTransfer,
  formatCurrency,
  formatDate,
  getAccountTypeLabel,
  isSelected = false,
  onSelectionChange,
  selectionMode = false
}) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const SWIPE_LIMIT = 180;
  const TRIGGER_THRESHOLD = 60;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSwipeActive(false);
        setIsDragging(false);
        setCurrentX(0);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || selectionMode) return; // Disabilita swipe in selection mode
    setStartX(e.touches[0].clientX);
    setCurrentX(0);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isDragging || selectionMode) return;
    
    const touchX = e.touches[0].clientX;
    const diff = startX - touchX;
    
    if (diff > 0) {
      setCurrentX(-Math.min(diff, SWIPE_LIMIT));
      
      if (diff > 20) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || selectionMode) return;
    
    setIsDragging(false);
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (diff > TRIGGER_THRESHOLD) {
      setIsSwipeActive(true);
      setCurrentX(-SWIPE_LIMIT);
    } else {
      setIsSwipeActive(false);
      setCurrentX(0);
    }
  };

  const handleActionClick = (action: () => void) => {
    action();
    setIsSwipeActive(false);
    setCurrentX(0);
  };

  const resetSwipe = () => {
    setIsSwipeActive(false);
    setCurrentX(0);
    setIsDragging(false);
  };

  const handleCardClick = () => {
    if (selectionMode && onSelectionChange) {
      onSelectionChange(account.id, !isSelected);
    } else if (isMobile && isSwipeActive) {
      resetSwipe();
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectionChange) {
      onSelectionChange(account.id, !isSelected);
    }
  };

  return (
    <div 
      className="relative rounded-xl overflow-hidden"
      id={`account-${account.id}`}
    >
      {/* Actions background - Solo mobile e non in selection mode */}
      {isMobile && !selectionMode && (
        <div className={`absolute inset-0 bg-gradient-to-l from-red-500 to-orange-500 rounded-xl flex items-center justify-end px-3 gap-2 transition-opacity duration-200 ${
          isSwipeActive || currentX < -20 ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={() => handleActionClick(onTransfer)}
            className="p-2.5 bg-white/20 rounded-full active:scale-95 transition-transform flex-shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => handleActionClick(() => onEdit(account))}
            className="p-2.5 bg-white/20 rounded-full active:scale-95 transition-transform flex-shrink-0"
          >
            <Edit className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => handleActionClick(() => onAdjustBalance(account))}
            className="p-2.5 bg-white/20 rounded-full active:scale-95 transition-transform flex-shrink-0"
          >
            <DollarSign className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => handleActionClick(() => onDelete(account.id))}
            className="p-2.5 bg-red-600 rounded-full active:scale-95 transition-transform flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Card principale */}
      <div 
        ref={cardRef}
        className={`${theme.background.card} ${theme.border.card} ${theme.background.cardHover} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group relative ${
          isHighlighted 
            ? 'ring-4 ring-blue-500/50 shadow-blue-500/25 shadow-2xl scale-105 z-10' 
            : ''
        } ${
          isSelected 
            ? 'ring-2 ring-indigo-400/50 bg-indigo-500/5' 
            : ''
        } ${
          selectionMode 
            ? 'cursor-pointer' 
            : ''
        }`}
        style={{
          transform: isMobile && !selectionMode ? `translateX(${currentX}px)` : 'none',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        {/* Selection checkbox - Visibile solo in selection mode */}
        {selectionMode && (
          <div className="absolute top-3 left-3 z-20">
            <button
              onClick={handleCheckboxClick}
              className={`p-1 rounded-md transition-all ${
                isSelected 
                  ? 'bg-indigo-500 text-white' 
                  : `bg-gray-700/80 ${theme.text.muted} hover:text-indigo-400`
              }`}
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
          </div>
        )}

        {/* Highlight overlay */}
        {isHighlighted && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-pulse rounded-xl" />
        )}
        
        {/* Selection overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-indigo-500/5 rounded-xl" />
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
             style={{ background: `linear-gradient(135deg, ${accountColor}20, transparent)` }} />
        
        {/* Card Content */}
        <div className={`relative z-10 ${selectionMode ? 'pl-6' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <div 
              className="p-2 rounded-xl border shadow-sm"
              style={{ 
                backgroundColor: `${accountColor}15`, 
                borderColor: `${accountColor}30`,
                boxShadow: `0 2px 8px ${accountColor}15`
              }}
            >
              <IconComponent className="w-5 h-5" style={{ color: accountColor }} />
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-xs ${theme.text.muted} ${theme.background.secondary} px-2 py-1 rounded-full font-medium`}>
                {getAccountTypeLabel(account.type)}
              </span>
              
              {/* Menu 3 punti - Solo desktop e non in selection mode */}
              {!selectionMode && (
                <div className="relative hidden md:block">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === account.id ? null : account.id);
                    }}
                    className={`p-1 ${theme.text.muted} hover:text-gray-50 transition-colors rounded hover:bg-gray-700/50`}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {openMenuId === account.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                      <div className={`absolute top-6 right-0 z-50 w-44 ${theme.background.card} ${theme.border.card} border rounded-lg shadow-xl overflow-hidden`}>
                        <button
                          onClick={() => {
                            onEdit(account);
                            setOpenMenuId(null);
                          }}
                          className={`w-full px-3 py-2 text-left text-indigo-400 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm`}
                        >
                          <Edit className="w-3 h-3" />
                          Modifica Conto
                        </button>
                        <button
                          onClick={() => {
                            onAdjustBalance(account);
                            setOpenMenuId(null);
                          }}
                          className={`w-full px-3 py-2 text-left text-amber-400 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm`}
                        >
                          <DollarSign className="w-3 h-3" />
                          Correggi Saldo
                        </button>
                        <button
                          onClick={() => {
                            onDelete(account.id);
                            setOpenMenuId(null);
                          }}
                          className={`w-full px-3 py-2 text-left text-red-400 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm`}
                        >
                          <Trash2 className="w-3 h-3" />
                          Elimina Conto
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-3 space-y-1">
            <h3 className={`font-semibold text-base ${theme.text.primary} group-hover:text-indigo-400 transition-colors leading-tight`}>
              {account.name}
            </h3>
            {account.bank && <p className={`${theme.text.muted} text-sm`}>{account.bank}</p>}
          </div>
          
          <div className="mb-3">
            <div className="text-lg font-bold leading-tight" style={{ color: accountColor }}>
              {showBalance ? formatCurrency(account.balance) : "••••••"}
            </div>
          </div>
          
          {account.lastTransaction && (
            <div className={`text-xs ${theme.text.subtle}`}>
              Aggiornato: {formatDate(account.lastTransaction)}
            </div>
          )}
        </div>

        {/* Swipe progress indicator - Solo se non in selection mode */}
        {isMobile && isDragging && currentX < -10 && !selectionMode && (
          <div className="absolute top-2 left-2 flex items-center gap-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded-full">
            <ArrowLeftRight className="w-3 h-3" />
            <span>
              {Math.abs(currentX) >= TRIGGER_THRESHOLD ? "Rilascia!" : "Continua..."}
            </span>
          </div>
        )}

        {/* Swipe hint - Solo mobile quando non attivo e non in selection mode */}
        {isMobile && !isSwipeActive && !isDragging && !selectionMode && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 opacity-50">
            ← Scorri
          </div>
        )}

        {/* Selection mode indicator */}
        {selectionMode && (
          <div className="absolute bottom-2 right-2 text-xs text-indigo-400 opacity-70">
            Tocca per selezionare
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeableAccountCard;