import React from 'react';

export default function OptionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full py-2 px-4 text-sm font-medium text-[#00342B] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
    >
      {label}
    </button>
  );
}
