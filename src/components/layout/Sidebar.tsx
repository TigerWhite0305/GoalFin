// src/components/Sidebar.tsx
import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside>
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Obiettivi</li>
          <li>Investimenti</li>
          <li>Impostazioni</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
