// src/utils/validations.ts - NUOVO FILE
import { Account } from "../components/ui/portfolio/AccountModal";

// Configurazione saldi minimi per tipo conto
export const ACCOUNT_MIN_BALANCES = {
  checking: -1000,    // Conto corrente: scoperto fino a 1000€
  savings: 0,         // Conto risparmio: sempre positivo
  card: 0,           // Carta/Prepagata: sempre positivo
  investment: 0      // Investimenti: sempre positivo
} as const;

// Limiti trasferimenti
export const TRANSFER_LIMITS = {
  daily: 10000,      // Limite giornaliero
  single: 5000,      // Limite singolo trasferimento
  minimum: 0.01      // Importo minimo
} as const;

// Interface per risultato validazione
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Controlla se un nome conto è duplicato
 */
export function checkDuplicateName(
  name: string, 
  existingAccounts: Account[], 
  excludeId?: string
): ValidationResult {
  const normalizedName = name.trim().toLowerCase();
  
  const duplicate = existingAccounts.find(account => 
    account.name.toLowerCase() === normalizedName && 
    account.id !== excludeId
  );

  if (duplicate) {
    return {
      isValid: false,
      errors: [`Esiste già un conto chiamato "${duplicate.name}"`],
      warnings: []
    };
  }

  // Controllo nomi simili (warning)
  const similarAccounts = existingAccounts.filter(account => {
    if (account.id === excludeId) return false;
    
    const similarity = calculateSimilarity(normalizedName, account.name.toLowerCase());
    return similarity > 0.8 && similarity < 1; // Simile ma non identico
  });

  const warnings = similarAccounts.map(acc => 
    `Nome simile a "${acc.name}" esistente`
  );

  return {
    isValid: true,
    errors: [],
    warnings
  };
}

/**
 * Calcola similarità tra due stringhe (semplificato)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Distanza di Levenshtein semplificata
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Valida il saldo in base al tipo di conto
 */
export function validateAccountBalance(
  balance: number, 
  accountType: keyof typeof ACCOUNT_MIN_BALANCES
): ValidationResult {
  const minBalance = ACCOUNT_MIN_BALANCES[accountType];
  const errors: string[] = [];
  const warnings: string[] = [];

  if (balance < minBalance) {
    errors.push(
      `Il saldo minimo per ${getAccountTypeLabel(accountType)} è ${formatCurrency(minBalance)}`
    );
  }

  // Warning per saldi bassi
  if (accountType === 'checking' && balance < 0) {
    warnings.push(`Attenzione: conto in scoperto di ${formatCurrency(Math.abs(balance))}`);
  } else if (accountType !== 'checking' && balance < 10) {
    warnings.push('Saldo molto basso');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Valida un trasferimento
 */
export function validateTransfer(
  fromAccount: Account,
  toAccount: Account,
  amount: number
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Controlli base
  if (amount <= 0) {
    errors.push('L\'importo deve essere maggiore di zero');
  }

  if (amount < TRANSFER_LIMITS.minimum) {
    errors.push(`L'importo minimo è ${formatCurrency(TRANSFER_LIMITS.minimum)}`);
  }

  if (amount > TRANSFER_LIMITS.single) {
    errors.push(`L'importo massimo per trasferimento è ${formatCurrency(TRANSFER_LIMITS.single)}`);
  }

  if (fromAccount.id === toAccount.id) {
    errors.push('Non puoi trasferire sullo stesso conto');
  }

  if (fromAccount.currency !== toAccount.currency) {
    errors.push(`Valute diverse: ${fromAccount.currency} → ${toAccount.currency}`);
  }

  // Controllo saldo risultante
  const newBalance = fromAccount.balance - amount;
  const minBalance = ACCOUNT_MIN_BALANCES[fromAccount.type as keyof typeof ACCOUNT_MIN_BALANCES];
  
  if (newBalance < minBalance) {
    errors.push(
      `Saldo insufficiente. Il saldo risultante (${formatCurrency(newBalance)}) sarebbe sotto il minimo (${formatCurrency(minBalance)})`
    );
  }

  // Warning per trasferimenti elevati
  const percentageOfBalance = (amount / fromAccount.balance) * 100;
  if (percentageOfBalance > 80) {
    warnings.push(`Trasferisci ${percentageOfBalance.toFixed(0)}% del saldo disponibile`);
  }

  if (amount > 1000) {
    warnings.push('Trasferimento di importo elevato');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Valida nome account
 */
export function validateAccountName(name: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!name.trim()) {
    errors.push('Il nome è obbligatorio');
  } else if (name.trim().length < 2) {
    errors.push('Il nome deve essere almeno 2 caratteri');
  } else if (name.trim().length > 50) {
    errors.push('Il nome non può superare 50 caratteri');
  }

  // Controllo caratteri speciali
  const invalidChars = /[<>]/;
  if (invalidChars.test(name)) {
    errors.push('Il nome contiene caratteri non validi');
  }

  // Nomi riservati
  const reservedNames = ['admin', 'system', 'test', 'default'];
  if (reservedNames.includes(name.toLowerCase().trim())) {
    errors.push('Questo nome è riservato');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validazione completa account
 */
export function validateCompleteAccount(
  name: string,
  type: string,
  balance: string,
  currency: string,
  color: string,
  existingAccounts: Account[] = [],
  excludeId?: string,
  isInitialLoad = false // Nuovo parametro per indicare il caricamento iniziale
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Non validare se è il caricamento iniziale e i campi sono vuoti
  if (isInitialLoad && !name.trim() && !balance.trim()) {
    return {
      isValid: true,
      errors: [],
      warnings: []
    };
  }

  // Validazione nome - solo se l'utente ha iniziato a digitare
  if (name.trim() || !isInitialLoad) {
    const nameValidation = validateAccountName(name);
    errors.push(...nameValidation.errors);
    warnings.push(...nameValidation.warnings);
  }

  // Validazione duplicati - solo se c'è un nome
  if (name.trim()) {
    const duplicateValidation = checkDuplicateName(name, existingAccounts, excludeId);
    errors.push(...duplicateValidation.errors);
    warnings.push(...duplicateValidation.warnings);
  }

  // Validazione tipo
  if (!type) {
    errors.push('Il tipo di conto è obbligatorio');
  }

  // Validazione saldo - solo se l'utente ha inserito qualcosa
  if (balance.trim()) {
    const numBalance = parseFloat(balance);
    if (isNaN(numBalance)) {
      errors.push('Il saldo deve essere un numero valido');
    } else {
      const minBalance = ACCOUNT_MIN_BALANCES[type as keyof typeof ACCOUNT_MIN_BALANCES] ?? 0;
      if (numBalance < minBalance) {
        errors.push(`Il saldo non può essere inferiore a ${formatCurrency(minBalance)}`);
      }
    }
  }

  // Validazione valuta
  if (!currency) {
    errors.push('La valuta è obbligatoria');
  }

  // Validazione colore - solo warning
  if (!color) {
    warnings.push('Nessun colore selezionato, verrà usato quello predefinito');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Utility functions
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function getAccountTypeLabel(type: string): string {
  const labels = {
    checking: 'Conto Corrente',
    savings: 'Conto Risparmio', 
    card: 'Carta/Prepagata',
    investment: 'Investimenti'
  };
  return labels[type as keyof typeof labels] || type;
}

export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

export function isColorTooLight(hexColor: string): boolean {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.8;
}