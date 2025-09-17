// src/hooks/useSearch.ts
import { useState, useMemo } from "react";

export function useSearch<T>(items: T[], searchKeys: (keyof T)[]) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!query) return items;

    const lowerQuery = query.toLowerCase();

    return items.filter(item =>
      searchKeys.some(key => {
        const value = item[key];
        return typeof value === "string" && value.toLowerCase().includes(lowerQuery);
      })
    );
  }, [items, query, searchKeys]);

  return { query, setQuery, filteredItems };
}
