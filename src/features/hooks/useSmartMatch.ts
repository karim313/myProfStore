/**
 * useSmartMatch Hook
 *
 * This hook manages the AI Shopping Assistant state and logic.
 * It handles:
 * - Category selection
 * - Question navigation
 * - Answer storage
 * - Product filtering based on answers
 * - Back navigation
 *
 * The filtering logic is simple: each answer filters products by a specific field.
 * When all questions are answered, the remaining products are shown as recommendations.
 */

import { useState, useCallback, useEffect } from 'react';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { getFirstQuestionForCategory, getQuestionById, type Question, type QuestionOption } from '../data/questions';
import type { Product } from '../data/products';

export interface ChatMessage {
  id: string;
  text: string;
  isAi: boolean;
}

export function useSmartMatch() {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [questionHistory, setQuestionHistory] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, { field: string; value: string }>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  /**
   * Initialize the chat with welcome message
   */
  const initChat = useCallback(() => {
    setMessages([]);
    setFilteredProducts([]);
    setProgress(0);
    setQuestionHistory([]);
    setAnswers({});
    setSelectedCategory(null);
    setCurrentQuestion(null);
    
    // Add welcome message
    const welcomeMsg: ChatMessage = {
      id: Date.now().toString(),
      text: "مرحباً 👋\nماذا تبحث عن اليوم؟",
      isAi: true
    };
    setMessages([welcomeMsg]);
  }, []);

  /**
   * Add a message to the chat
   */
  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  /**
   * Handle category selection
   */
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Add user message
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      addMessage({
        id: Date.now().toString(),
        text: category.name,
        isAi: false
      });
    }

    // Get first question for this category
    const firstQuestion = getFirstQuestionForCategory(categoryId);
    if (firstQuestion) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentQuestion(firstQuestion);
        setProgress(25);
      }, 500);
    }
  }, [addMessage]);

  /**
   * Handle answer selection
   */
  const handleAnswer = useCallback((option: QuestionOption, field: string) => {
    if (!currentQuestion) return;

    // Save the answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { field, value: option.value }
    }));

    // Add user message
    addMessage({
      id: Date.now().toString(),
      text: option.label,
      isAi: false
    });

    // Store current question in history for back navigation
    setQuestionHistory(prev => [...prev, currentQuestion]);

    setIsTyping(true);
    setCurrentQuestion(null);

    setTimeout(() => {
      setIsTyping(false);

      if (option.nextQuestionId === null) {
        // This is the last question - filter and show products
        setProgress(100);
        filterProducts();
      } else {
        // Move to next question
        const nextQuestion = getQuestionById(option.nextQuestionId);
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
          setProgress(prev => Math.min(prev + 25, 90));
        }
      }
    }, 500);
  }, [currentQuestion, addMessage]);

  /**
   * Filter products based on all answers
   */
  const filterProducts = useCallback(() => {
    let result = [...products];

    // Filter by category first
    if (selectedCategory) {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Apply all answer filters
    Object.values(answers).forEach(({ field, value }) => {
      result = result.filter(product => {
        const specValue = product.specs[field as keyof typeof product.specs];
        return specValue === value;
      });
    });

    setFilteredProducts(result);
  }, [selectedCategory, answers]);

  /**
   * Go back to previous question
   */
  const goBack = useCallback(() => {
    if (questionHistory.length === 0) {
      // If no question history, go back to category selection
      setSelectedCategory(null);
      setCurrentQuestion(null);
      setAnswers({});
      setFilteredProducts([]);
      setProgress(0);
      setMessages(prev => prev.slice(0, 1)); // Keep only welcome message
      return;
    }

    // Remove last question from history
    setQuestionHistory(prev => {
      const newHistory = [...prev];
      const previousQuestion = newHistory.pop();

      if (previousQuestion) {
        setCurrentQuestion(previousQuestion);
        // Remove the last answer
        setAnswers(prevAnswers => {
          const newAnswers = { ...prevAnswers };
          delete newAnswers[previousQuestion.id];
          return newAnswers;
        });
        // Remove last user message
        setMessages(prev => prev.slice(0, -1));
        // Adjust progress
        setProgress(prev => Math.max(prev - 25, 0));
      }

      return newHistory;
    });
  }, [questionHistory]);

  /**
   * Check if user can go back
   */
  const canGoBack = questionHistory.length > 0 || selectedCategory !== null;

  /**
   * Reset and start over
   */
  const reset = useCallback(() => {
    initChat();
  }, [initChat]);

  // Initialize on mount
  useEffect(() => {
    initChat();
  }, [initChat]);

  return {
    // State
    messages,
    currentQuestion,
    isTyping,
    filteredProducts,
    progress,
    categories,
    selectedCategory,
    
    // Actions
    handleCategorySelect,
    handleAnswer,
    goBack,
    reset,
    
    // Computed
    canGoBack
  };
}
