// src/components/SearchBar.tsx
import React from "react";

const SearchBar: React.FC = () => {
  return (
    <div>
      <input type="text" placeholder="Search..." />
      <button>🔍</button>
    </div>
  );
};

export default SearchBar;
