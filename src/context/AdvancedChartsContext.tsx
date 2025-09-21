// src/context/AdvancedChartsContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import useAdvancedCharts from '../hooks/useAdvancedCharts';

// Type per il context (usa il return type dell'hook)
type AdvancedChartsContextType = ReturnType<typeof useAdvancedCharts>;

// Crea il context
const AdvancedChartsContext = createContext<AdvancedChartsContextType | undefined>(undefined);

// Provider component
interface AdvancedChartsProviderProps {
  children: ReactNode;
}

export const AdvancedChartsProvider: React.FC<AdvancedChartsProviderProps> = ({ children }) => {
  // Usa l'hook una sola volta qui, tutti i componenti figli condivideranno questo stato
  const advancedChartsValue = useAdvancedCharts();
  
  return (
    <AdvancedChartsContext.Provider value={advancedChartsValue}>
      {children}
    </AdvancedChartsContext.Provider>
  );
};

// Hook personalizzato per usare il context
export const useAdvancedChartsContext = () => {
  const context = useContext(AdvancedChartsContext);
  
  if (context === undefined) {
    throw new Error('useAdvancedChartsContext must be used within an AdvancedChartsProvider');
  }
  
  return context;
};

// Esporta anche il context per casi avanzati (optional)
export { AdvancedChartsContext };