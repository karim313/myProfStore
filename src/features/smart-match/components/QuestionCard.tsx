import React from 'react';
import ChatMessage from './ChatMessage';
import OptionButton from './OptionButton';

interface QuestionCardProps {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
}

export default function QuestionCard({ question, options, onSelect }: QuestionCardProps) {
  return (
    <div className="mb-4">
      <ChatMessage text={question} isAi={true} />
      <div className="flex flex-col gap-2 pl-10 pr-2">
        {options.map((opt, i) => (
          <OptionButton key={i} label={opt} onClick={() => onSelect(opt)} />
        ))}
      </div>
    </div>
  );
}
