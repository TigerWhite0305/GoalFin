// src/hooks/useSwipe.ts - Hook per gestire swipe gestures
import { useState, useRef, useEffect, RefObject } from 'react';

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  maxSwipe?: number;
  preventScrollOnSwipe?: boolean;
}

interface UseSwipeReturn {
  isDragging: boolean;
  dragX: number;
  showActions: boolean;
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  mouseHandlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
  };
  resetSwipe: () => void;
  setShowActions: (show: boolean) => void;
}

export const useSwipe = (
  elementRef: RefObject<HTMLElement>,
  options: UseSwipeOptions = {}
): UseSwipeReturn => {
  const {
    onSwipeLeft,
    onSwipeRight,
    threshold = 80,
    maxSwipe = 200,
    preventScrollOnSwipe = true
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [showActions, setShowActions] = useState(false);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    
    if (preventScrollOnSwipe) {
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    
    // Limita il movimento in base alla direzione
    let newDragX = 0;
    if (diffX < 0 && onSwipeLeft) {
      newDragX = Math.max(diffX, -maxSwipe);
    } else if (diffX > 0 && onSwipeRight) {
      newDragX = Math.min(diffX, maxSwipe);
    }
    
    setDragX(newDragX);
    
    if (preventScrollOnSwipe && Math.abs(diffX) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    const absDragX = Math.abs(dragX);
    
    if (absDragX > threshold) {
      if (dragX < 0 && onSwipeLeft) {
        onSwipeLeft();
        setShowActions(true);
        setDragX(-maxSwipe);
      } else if (dragX > 0 && onSwipeRight) {
        onSwipeRight();
        setShowActions(true);
        setDragX(maxSwipe);
      } else {
        resetToPosition();
      }
    } else {
      resetToPosition();
    }
  };

  // Mouse handlers per desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diffX = currentX - startX;
    
    let newDragX = 0;
    if (diffX < 0 && onSwipeLeft) {
      newDragX = Math.max(diffX, -maxSwipe);
    } else if (diffX > 0 && onSwipeRight) {
      newDragX = Math.min(diffX, maxSwipe);
    }
    
    setDragX(newDragX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const absDragX = Math.abs(dragX);
    
    if (absDragX > threshold) {
      if (dragX < 0 && onSwipeLeft) {
        onSwipeLeft();
        setShowActions(true);
        setDragX(-maxSwipe);
      } else if (dragX > 0 && onSwipeRight) {
        onSwipeRight();
        setShowActions(true);
        setDragX(maxSwipe);
      } else {
        resetToPosition();
      }
    } else {
      resetToPosition();
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const resetToPosition = () => {
    setShowActions(false);
    setDragX(0);
  };

  const resetSwipe = () => {
    setIsDragging(false);
    setShowActions(false);
    setDragX(0);
  };

  // Chiudi azioni quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
        resetSwipe();
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showActions, elementRef]);

  // Global mouse listeners quando si sta trascinando
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const currentX = e.clientX;
      const diffX = currentX - startX;
      
      let newDragX = 0;
      if (diffX < 0 && onSwipeLeft) {
        newDragX = Math.max(diffX, -maxSwipe);
      } else if (diffX > 0 && onSwipeRight) {
        newDragX = Math.min(diffX, maxSwipe);
      }
      
      setDragX(newDragX);
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startX, onSwipeLeft, onSwipeRight, maxSwipe, threshold]);

  return {
    isDragging,
    dragX,
    showActions,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    mouseHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
    resetSwipe,
    setShowActions,
  };
};