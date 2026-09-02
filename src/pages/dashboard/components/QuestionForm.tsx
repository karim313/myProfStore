interface Category {
  id: number;
  name: string;
}

interface Question {
  id: number;
  categoryId: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuestionFormProps {
  questionForm: { categoryId: string; question: string; options: string[]; correctAnswer: number };
  editingQuestion: Question | null;
  categories: Category[];
  onFormChange: (form: { categoryId: string; question: string; options: string[]; correctAnswer: number }) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function QuestionForm({ questionForm, editingQuestion, categories, onFormChange, onSubmit, onCancel }: QuestionFormProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={questionForm.categoryId}
            onChange={(e) => onFormChange({ ...questionForm, categoryId: e.target.value })}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent text-sm"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={questionForm.correctAnswer}
            onChange={(e) => onFormChange({ ...questionForm, correctAnswer: parseInt(e.target.value) })}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent text-sm"
          >
            <option value={0}>Correct: Option 1</option>
            <option value={1}>Correct: Option 2</option>
            <option value={2}>Correct: Option 3</option>
            <option value={3}>Correct: Option 4</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Enter your question"
          value={questionForm.question}
          onChange={(e) => onFormChange({ ...questionForm, question: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent text-sm"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionForm.options.map((option, index) => (
            <div key={index} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">#{index + 1}</span>
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...questionForm.options];
                  newOptions[index] = e.target.value;
                  onFormChange({ ...questionForm, options: newOptions });
                }}
                className={`w-full pl-8 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent text-sm ${questionForm.correctAnswer === index ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200'}`}
              />
              {questionForm.correctAnswer === index && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600">✓ Correct</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={onSubmit} className="px-6 py-2.5 bg-[#00342B] text-white rounded-xl font-medium hover:bg-emerald-800 transition-colors shadow-md shadow-emerald-900/20">
          {editingQuestion ? 'Update Question' : 'Add Question'}
        </button>
        {editingQuestion && (
          <button onClick={onCancel} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
