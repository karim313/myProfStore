import React from 'react';
import AvatarOrb from './AvatarOrb';

export default function ChatMessage({ text, isAi = false }: { text: string; isAi?: boolean }) {
  return (
    <div className={`flex gap-2 mb-4 ${isAi ? '' : 'flex-row-reverse'}`}>
      <AvatarOrb isAi={isAi} />
      <div className={`p-3 rounded-xl max-w-[85%] text-sm ${
        isAi 
          ? 'bg-white border border-gray-100 text-gray-700 rounded-tr-none' 
          : 'bg-[#00342B] text-white rounded-tl-none'
      }`}>
        {text}
      </div>
    </div>
  );
}
