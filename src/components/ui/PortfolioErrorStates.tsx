// src/components/ui/PortfolioErrorStates.tsx
import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Database, Shield, TrendingDown, X, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export type ErrorType = 'network' | 'server' | 'validation' | 'security' | 'balance' | 'sync' | 'general';
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface PortfolioError {
  id: string;
  type: ErrorType;
  title: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: Date;
  dismissible?: boolean;
  actionable?: boolean;
  details?: string;
}

interface PortfolioErrorStateProps {
  error: PortfolioError;
  onRetry?: () => void;
  onDismiss?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  className?: string;
  compact?: boolean;
}

const PortfolioErrorState: React.FC<PortfolioErrorStateProps> = ({
  error,
  onRetry,
  onDismiss,
  onViewDetails,
  className = '',
  compact = false
}) => {
  const { isDarkMode } = useTheme();

  const getIcon = () => {
    const iconClass = `w-5 h-5 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`;
    switch (error.type) {
      case 'network':
        return <WifiOff className={`${iconClass} ${getSeverityIconColor()}`} />;
      case 'server':
        return <Database className={`${iconClass} ${getSeverityIconColor()}`} />;
      case 'validation':
        return <AlertTriangle className={`${iconClass} ${getSeverityIconColor()}`} />;
      case 'security':
        return <Shield className={`${iconClass} ${getSeverityIconColor()}`} />;
      case 'balance':
        return <TrendingDown className={`${iconClass} ${getSeverityIconColor()}`} />;
      case 'sync':
        return <RefreshCw className={`${iconClass} ${getSeverityIconColor()}`} />;
      default:
        return <AlertCircle className={`${iconClass} ${getSeverityIconColor()}`} />;
    }
  };

  const getSeverityIconColor = () => {
    switch (error.severity) {
      case 'low':
        return 'text-blue-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-orange-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSeverityColors = () => {
    const base = isDarkMode ? 'dark:' : '';
    switch (error.severity) {
      case 'low':
        return `bg-blue-50 ${base}bg-blue-900/20 border-blue-200 ${base}border-blue-800/30 text-blue-800 ${base}text-blue-200`;
      case 'medium':
        return `bg-yellow-50 ${base}bg-yellow-900/20 border-yellow-200 ${base}border-yellow-800/30 text-yellow-800 ${base}text-yellow-200`;
      case 'high':
        return `bg-orange-50 ${base}bg-orange-900/20 border-orange-200 ${base}border-orange-800/30 text-orange-800 ${base}text-orange-200`;
      case 'critical':
        return `bg-red-50 ${base}bg-red-900/20 border-red-200 ${base}border-red-800/30 text-red-800 ${base}text-red-200`;
      default:
        return `bg-gray-50 ${base}bg-gray-900/20 border-gray-200 ${base}border-gray-800/30 text-gray-800 ${base}text-gray-200`;
    }
  };

  const getTypeLabel = () => {
    switch (error.type) {
      case 'network':
        return 'Connessione';
      case 'server':
        return 'Server';
      case 'validation':
        return 'Validazione';
      case 'security':
        return 'Sicurezza';
      case 'balance':
        return 'Saldo';
      case 'sync':
        return 'Sincronizzazione';
      default:
        return 'Errore';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Adesso';
    if (diffMins < 60) return `${diffMins}m fa`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h fa`;
    return timestamp.toLocaleDateString('it-IT');
  };

  return (
    <div className={`
      ${compact ? 'p-3' : 'p-4'} rounded-xl border-2 ${getSeverityColors()}
      transition-all duration-200 hover:shadow-lg
      ${className}
    `}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>
              {error.title}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10`}>
              {getTypeLabel()}
            </span>
          </div>
          
          <p className={`${compact ? 'text-xs' : 'text-sm'} leading-relaxed mb-2`}>
            {error.message}
          </p>
          
          {!compact && error.details && (
            <p className="text-xs opacity-75 mb-2">
              {error.details}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs opacity-60">
              {formatTimestamp(error.timestamp)}
            </span>
            
            <div className="flex gap-2">
              {error.actionable && onRetry && (
                <button
                  onClick={onRetry}
                  className={`
                    px-3 py-1 rounded-lg border transition-all text-xs font-medium
                    hover:bg-black/5 dark:hover:bg-white/5
                    border-current/20 hover:border-current/40
                  `}
                >
                  <RefreshCw className="w-3 h-3 inline mr-1" />
                  Riprova
                </button>
              )}
              
              {error.details && onViewDetails && (
                <button
                  onClick={() => onViewDetails(error.id)}
                  className={`
                    px-3 py-1 rounded-lg border transition-all text-xs font-medium
                    hover:bg-black/5 dark:hover:bg-white/5
                    border-current/20 hover:border-current/40
                  `}
                >
                  Dettagli
                </button>
              )}
              
              {error.dismissible && onDismiss && (
                <button
                  onClick={() => onDismiss(error.id)}
                  className="opacity-70 hover:opacity-100 transition-opacity p-1"
                  aria-label="Chiudi errore"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente per lista di errori
interface PortfolioErrorListProps {
  errors: PortfolioError[];
  onRetry?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
  compact?: boolean;
  maxVisible?: number;
}

export const PortfolioErrorList: React.FC<PortfolioErrorListProps> = ({
  errors,
  onRetry,
  onDismiss,
  onViewDetails,
  onClearAll,
  className = '',
  compact = false,
  maxVisible = 5
}) => {
  const { isDarkMode } = useTheme();
  
  if (errors.length === 0) return null;

  const visibleErrors = errors.slice(0, maxVisible);
  const hasMore = errors.length > maxVisible;

  // Raggruppa per gravità
  const groupedErrors = visibleErrors.reduce((acc, error) => {
    if (!acc[error.severity]) acc[error.severity] = [];
    acc[error.severity].push(error);
    return acc;
  }, {} as Record<ErrorSeverity, PortfolioError[]>);

  // Ordine di priorità per visualizzazione
  const severityOrder: ErrorSeverity[] = ['critical', 'high', 'medium', 'low'];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header con stats e azioni */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {errors.length} {errors.length === 1 ? 'errore' : 'errori'} attivo{errors.length === 1 ? '' : 'i'}
          </span>
          {hasMore && (
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              (+{errors.length - maxVisible} nascosti)
            </span>
          )}
        </div>
        
        {onClearAll && (
          <button
            onClick={onClearAll}
            className={`text-xs px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Cancella tutto
          </button>
        )}
      </div>
      
      {/* Lista errori raggruppati per gravità */}
      <div className="space-y-2">
        {severityOrder.map(severity => {
          const severityErrors = groupedErrors[severity];
          if (!severityErrors) return null;
          
          return (
            <div key={severity} className="space-y-2">
              {severityErrors.map(error => (
                <PortfolioErrorState
                  key={error.id}
                  error={error}
                  onRetry={onRetry ? () => onRetry(error.id) : undefined}
                  onDismiss={onDismiss}
                  onViewDetails={onViewDetails}
                  compact={compact}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Hook per gestire errori del portafoglio
export const usePortfolioErrors = () => {
  const [errors, setErrors] = React.useState<PortfolioError[]>([]);

  const addError = React.useCallback((
    type: ErrorType,
    title: string,
    message: string,
    severity: ErrorSeverity = 'medium',
    options: Partial<Pick<PortfolioError, 'dismissible' | 'actionable' | 'details'>> = {}
  ): string => {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const error: PortfolioError = {
      id,
      type,
      title,
      message,
      severity,
      timestamp: new Date(),
      dismissible: options.dismissible ?? true,
      actionable: options.actionable ?? true,
      details: options.details
    };
    
    setErrors(prev => [error, ...prev]);
    return id;
  }, []);

  const removeError = React.useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearErrors = React.useCallback((type?: ErrorType) => {
    if (type) {
      setErrors(prev => prev.filter(error => error.type !== type));
    } else {
      setErrors([]);
    }
  }, []);

  const retryError = React.useCallback((id: string, retryFn?: () => Promise<void>) => {
    const error = errors.find(e => e.id === id);
    if (!error || !retryFn) return;

    removeError(id);
    retryFn().catch(() => {
      // Se il retry fallisce, aggiungi di nuovo l'errore
      setErrors(prev => [error, ...prev]);
    });
  }, [errors, removeError]);

  const getErrorsByType = React.useCallback((type: ErrorType) => {
    return errors.filter(error => error.type === type);
  }, [errors]);

  const getErrorsBySeverity = React.useCallback((severity: ErrorSeverity) => {
    return errors.filter(error => error.severity === severity);
  }, [errors]);

  const hasErrors = React.useMemo(() => errors.length > 0, [errors]);
  const hasCriticalErrors = React.useMemo(() => 
    errors.some(error => error.severity === 'critical'), [errors]
  );

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    retryError,
    getErrorsByType,
    getErrorsBySeverity,
    hasErrors,
    hasCriticalErrors
  };
};

export default PortfolioErrorState;