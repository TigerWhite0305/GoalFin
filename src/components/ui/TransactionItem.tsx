// src/components/TransactionItem.tsx
import React from "react";

type TransactionItemProps = {
  title: string;
  amount: number;
  date: string;
};

const TransactionItem: React.FC<TransactionItemProps> = ({ title, amount, date }) => {
  return (
    <div className="flex justify-between items-center p-2 border-b border-gray-700">
      <div>
        <p className="text-white font-medium">{title}</p>
        <span className="text-sm text-gray-400">{date}</span>
      </div>
      <span className={`font-semibold ${amount >= 0 ? "text-green-400" : "text-red-400"}`}>
        {amount >= 0 ? `+${amount} €` : `${amount} €`}
      </span>
    </div>
  );
};

export default TransactionItem;
