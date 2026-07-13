import ChatMessage from './ChatMessage';
import OptionButton from './OptionButton';
import type { QuestionOption } from '../../data/questions';

interface QuestionCardProps {
  question: string;
  field: string;
  options: QuestionOption[];
  onSelect: (option: QuestionOption, field: string) => void;
}

export default function QuestionCard({ question, field, options, onSelect }: QuestionCardProps) {
  return (
    <div className="mb-4">
      <ChatMessage text={question} isAi={true} />
      <div className="flex flex-col gap-2 pl-10 pr-2">
        {options.map((opt) => (
          <OptionButton key={opt.id} label={opt.label} onClick={() => onSelect(opt, field)} />
        ))}
      </div>
    </div>
  );
}
