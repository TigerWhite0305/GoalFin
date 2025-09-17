// src/utils/formatters.ts

// Formatta una data in italiano (gg/mm/yyyy hh:mm)
export const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  const date = d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
};

// Formatta un numero come valuta in euro
export const formatCurrency = (amount: number) => {
  return amount.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
};

// Formatta percentuali
export const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};
