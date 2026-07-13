import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmartMatchHeader from './SmartMatchHeader';
import CategoryCard from './CategoryCard';
import QuestionCard from './QuestionCard';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import RecommendationList from './RecommendationList';
import { useSmartMatch } from '../../hooks/useSmartMatch';

interface SmartMatchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartMatchDrawer({ isOpen, onClose }: SmartMatchDrawerProps) {
  const {
    messages,
    currentQuestion,
    isTyping,
    filteredProducts,
    progress,
    categories,
    selectedCategory,
    handleCategorySelect,
    handleAnswer,
    goBack,
    reset,
    canGoBack
  } = useSmartMatch();

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            <SmartMatchHeader onClose={onClose} progress={progress} onBack={goBack} canGoBack={canGoBack} />
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {/* Chat messages */}
              {messages.map((msg) => (
                <ChatMessage key={msg.id} text={msg.text} isAi={msg.isAi} />
              ))}

              {/* Current step */}
              {isTyping ? (
                <TypingIndicator />
              ) : filteredProducts.length > 0 ? (
                <>
                  <ChatMessage text="بناءً على تفضيلاتك، إليك أفضل الخيارات المناسبة لك:" isAi={true} />
                  <RecommendationList products={filteredProducts} />
                </>
              ) : currentQuestion ? (
                <QuestionCard
                  question={currentQuestion.text}
                  field={currentQuestion.field}
                  options={currentQuestion.options}
                  onSelect={handleAnswer}
                />
              ) : !selectedCategory ? (
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onSelect={handleCategorySelect}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
