/**
 * Questions Data
 *
 * This file defines all questions for the AI Shopping Assistant.
 * Each question is associated with a category and has options that filter products.
 *
 * Structure:
 * - id: Unique question identifier
 * - category: Which category this question belongs to
 * - text: The question text
 * - field: The spec field to filter on (e.g., "usage", "budget", "cpu")
 * - options: Available answers with their filter values
 *
 * This is static data that can later be replaced with API data without changing the architecture.
 */

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  nextQuestionId: string | null; // null means this is the last question
}

export interface Question {
  id: string;
  category: string;
  text: string;
  field: string;
  options: QuestionOption[];
}

export const questions: Question[] = [
  // Electronics Questions
  {
    id: "electronics-usage",
    category: "electronics",
    text: "ماذا ستستخدم هذا الجهاز؟",
    field: "usage",
    options: [
      { id: "e1", label: "ألعاب", value: "Gaming", nextQuestionId: "electronics-budget" },
      { id: "e2", label: "عمل", value: "Work", nextQuestionId: "electronics-budget" },
      { id: "e3", label: "دراسة", value: "Study", nextQuestionId: "electronics-budget" }
    ]
  },
  {
    id: "electronics-budget",
    category: "electronics",
    text: "ما هو نطاق ميزانيتك؟",
    field: "budget",
    options: [
      { id: "e4", label: "منخفض (أقل من 800$)", value: "Low", nextQuestionId: null },
      { id: "e5", label: "متوسط (800$ - 1500$)", value: "Medium", nextQuestionId: null },
      { id: "e6", label: "مرتفع (1500$+)", value: "High", nextQuestionId: null }
    ]
  },

  // Fashion Questions
  {
    id: "fashion-style",
    category: "fashion",
    text: "ما هو النمط الذي تبحث عنه؟",
    field: "style",
    options: [
      { id: "f1", label: "رياضي", value: "Sporty", nextQuestionId: "fashion-budget" },
      { id: "f2", label: "عادي", value: "Casual", nextQuestionId: "fashion-budget" },
      { id: "f3", label: "رسمي", value: "Formal", nextQuestionId: "fashion-budget" }
    ]
  },
  {
    id: "fashion-budget",
    category: "fashion",
    text: "ما هو نطاق ميزانيتك؟",
    field: "budget",
    options: [
      { id: "f4", label: "منخفض (أقل من 100$)", value: "Low", nextQuestionId: null },
      { id: "f5", label: "متوسط (100$ - 150$)", value: "Medium", nextQuestionId: null },
      { id: "f6", label: "مرتفع (150$+)", value: "High", nextQuestionId: null }
    ]
  },

  // Home & Kitchen Questions
  {
    id: "home-usage",
    category: "home-kitchen",
    text: "ماذا ستستخدم هذا؟",
    field: "usage",
    options: [
      { id: "h1", label: "عمل", value: "Work", nextQuestionId: "home-budget" },
      { id: "h2", label: "مطبخ", value: "Kitchen", nextQuestionId: "home-budget" }
    ]
  },
  {
    id: "home-budget",
    category: "home-kitchen",
    text: "ما هو نطاق ميزانيتك؟",
    field: "budget",
    options: [
      { id: "h3", label: "منخفض (أقل من 300$)", value: "Low", nextQuestionId: null },
      { id: "h4", label: "متوسط (300$ - 800$)", value: "Medium", nextQuestionId: null },
      { id: "h5", label: "مرتفع (800$+)", value: "High", nextQuestionId: null }
    ]
  },

  // Gaming Questions
  {
    id: "gaming-platform",
    category: "gaming",
    text: "ما هي المنصة التي تفضلها؟",
    field: "platform",
    options: [
      { id: "g1", label: "كونسول", value: "Console", nextQuestionId: "gaming-budget" },
      { id: "g2", label: "كمبيوتر", value: "PC", nextQuestionId: "gaming-budget" }
    ]
  },
  {
    id: "gaming-budget",
    category: "gaming",
    text: "ما هو نطاق ميزانيتك؟",
    field: "budget",
    options: [
      { id: "g3", label: "منخفض (أقل من 150$)", value: "Low", nextQuestionId: null },
      { id: "g4", label: "متوسط (150$ - 300$)", value: "Medium", nextQuestionId: null },
      { id: "g5", label: "مرتفع (300$+)", value: "High", nextQuestionId: null }
    ]
  },

  // Sports Questions
  {
    id: "sports-activity",
    category: "sports",
    text: "ما هي النشاط الذي تهتم به؟",
    field: "activity",
    options: [
      { id: "s1", label: "كارديو", value: "Cardio", nextQuestionId: "sports-budget" },
      { id: "s2", label: "قوة", value: "Strength", nextQuestionId: "sports-budget" },
      { id: "s3", label: "يوغا", value: "Yoga", nextQuestionId: "sports-budget" }
    ]
  },
  {
    id: "sports-budget",
    category: "sports",
    text: "ما هو نطاق ميزانيتك؟",
    field: "budget",
    options: [
      { id: "s4", label: "منخفض (أقل من 100$)", value: "Low", nextQuestionId: null },
      { id: "s5", label: "متوسط (100$ - 300$)", value: "Medium", nextQuestionId: null },
      { id: "s6", label: "مرتفع (300$+)", value: "High", nextQuestionId: null }
    ]
  }
];

/**
 * Get the first question for a category
 */
export function getFirstQuestionForCategory(categoryId: string): Question | undefined {
  return questions.find(q => q.category === categoryId);
}

/**
 * Get a question by ID
 */
export function getQuestionById(questionId: string): Question | undefined {
  return questions.find(q => q.id === questionId);
}
