// src/components/LoadingSpinner.tsx
import React from "react";

type LoadingSpinnerProps = {
  size?: number; // dimensione in px
  color?: string; // colore del bordo
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 32, color = "#3B82F6" }) => {
  return (
    <div
      className="animate-spin rounded-full border-4 border-t-transparent"
      style={{
        width: size,
        height: size,
        borderColor: `${color} transparent transparent transparent`,
      }}
    />
  );
};

export default LoadingSpinner;
