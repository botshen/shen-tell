import { useEffect, useState } from 'react';

interface CountdownCardProps {
  value: number;
  label: string;
  color: string;
}

const CountdownCard: React.FC<CountdownCardProps> = ({ value, label, color }) => {
  const displayValue = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-16">
        <div className={`w-full h-full rounded-lg ${color} flex items-center justify-center shadow-md`}>
          <span className="text-xl font-bold text-white">{displayValue}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
};

export default CountdownCard; 