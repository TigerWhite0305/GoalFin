// src/components/Card.tsx
import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;
