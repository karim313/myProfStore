interface Category {
  id: number;
  name: string;
}

interface CategoryFormProps {
  categoryForm: { name: string };
  editingCategory: Category | null;
  onFormChange: (form: { name: string }) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ categoryForm, editingCategory, onFormChange, onSubmit, onCancel }: CategoryFormProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Category Name"
          value={categoryForm.name}
          onChange={(e) => onFormChange({ name: e.target.value })}
          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent text-sm"
        />
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={onSubmit} className="px-6 py-2.5 bg-[#00342B] text-white rounded-xl font-medium hover:bg-emerald-800 transition-colors shadow-md shadow-emerald-900/20">
          {editingCategory ? 'Update Category' : 'Add Category'}
        </button>
        {editingCategory && (
          <button onClick={onCancel} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
