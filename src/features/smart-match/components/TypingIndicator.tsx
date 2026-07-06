import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center p-2">
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
    </div>
  );
}
