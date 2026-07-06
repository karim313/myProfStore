import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmartMatchHeader from './SmartMatchHeader';
import QuestionCard from './QuestionCard';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import RecommendationList from './RecommendationList';
import { products } from '../../../data/products';
import type { Product } from '../../../data/products';

interface SmartMatchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartMatchDrawer({ isOpen, onClose }: SmartMatchDrawerProps) {
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [selections, setSelections] = useState<string[]>([]);
  const [results, setResults] = useState<Product[]>([]);

  const questions = [
    { text: 'عن إيه بتدور النهاردة؟', options: ['إلكترونيات', 'أزياء', 'المنزل'] },
    { text: 'إيه الميزانية المناسبة ليك؟', options: ['أقل من 1000', '1000 - 5000', 'أكثر من 5000'] }
  ];

  const handleSelect = (option: string) => {
    const newSelections = [...selections, option];
    setSelections(newSelections);
    
    if (step < questions.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setStep(step + 1);
      }, 800);
    } else {
      // Finish
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simple mock matching logic
        const categoryMatch = newSelections[0];
        const matched = products.filter(p => p.category === categoryMatch).slice(0, 3);
        setResults(matched.length ? matched : products.slice(0, 3));
      }, 1500);
    }
  };

  const progress = results.length > 0 ? 100 : (step / questions.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-gray-50 shadow-2xl z-[101] flex flex-col"
            dir="rtl"
          >
            <SmartMatchHeader onClose={onClose} progress={progress} />
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {/* Previous steps */}
              {questions.slice(0, step).map((q, i) => (
                <React.Fragment key={i}>
                  <ChatMessage text={q.text} isAi={true} />
                  <ChatMessage text={selections[i]} isAi={false} />
                </React.Fragment>
              ))}

              {/* Current step or Results */}
              {isTyping ? (
                <TypingIndicator />
              ) : results.length > 0 ? (
                <>
                  <ChatMessage text="ممتاز! بناءً على اختياراتك، دي أفضل المنتجات المناسبة ليك:" isAi={true} />
                  <RecommendationList products={results} />
                </>
              ) : (
                <QuestionCard 
                  question={questions[step].text}
                  options={questions[step].options}
                  onSelect={handleSelect}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
