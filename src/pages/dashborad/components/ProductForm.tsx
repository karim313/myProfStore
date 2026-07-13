interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  stockQuantity: number;
  categoryId: number;
  price: number;
  finalPrice: number;
  offerEndDate: string | null;
}

interface ProductFormProps {
  productForm: { name: string; description: string; price: string; stockQuantity: string; imageUrl: string; categoryId: string };
  editingProduct: Product | null;
  categories: Category[];
  onFormChange: (form: { name: string; description: string; price: string; stockQuantity: string; imageUrl: string; categoryId: string }) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onOpenDescriptionBuilder: (categoryId: string) => void;
}

export default function ProductForm({ productForm, editingProduct, categories, onFormChange, onSubmit, onCancel, onOpenDescriptionBuilder }: ProductFormProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={productForm.name}
          onChange={(e) => onFormChange({ ...productForm, name: e.target.value })}
          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent text-sm"
        />
        <div className="md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Description"
              value={productForm.description}
              onChange={(e) => onFormChange({ ...productForm, description: e.target.value })}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent text-sm"
            />
            <button
              type="button"
              onClick={() => onOpenDescriptionBuilder(productForm.categoryId)}
              className="whitespace-nowrap rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-semibold text-[#00342B] transition hover:bg-emerald-100"
            >
              Build
            </button>
          </div>
        </div>
        <input
          type="number"
          placeholder="Price"
          value={productForm.price}
          onChange={(e) => onFormChange({ ...productForm, price: e.target.value })}
          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent text-sm"
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          value={productForm.stockQuantity}
          onChange={(e) => onFormChange({ ...productForm, stockQuantity: e.target.value })}
          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent text-sm"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={productForm.imageUrl}
          onChange={(e) => onFormChange({ ...productForm, imageUrl: e.target.value })}
          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent text-sm"
        />
        <select
          value={productForm.categoryId}
          onChange={(e) => onFormChange({ ...productForm, categoryId: e.target.value })}
          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent text-sm"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={onSubmit} className="px-6 py-2.5 bg-[#00342B] text-white rounded-xl font-medium hover:bg-emerald-800 transition-colors shadow-md shadow-emerald-900/20">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button onClick={onCancel} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
