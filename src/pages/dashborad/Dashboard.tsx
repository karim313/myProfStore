import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import StatsCard from './components/StatsCard';
import CategoryForm from './components/CategoryForm';
import CategoryTable from './components/CategoryTable';
import ProductForm from './components/ProductForm';
import ProductTable from './components/ProductTable';
import QuestionForm from './components/QuestionForm';
import QuestionTable from './components/QuestionTable';
import ProductDescriptionBuilder from './components/ProductDescriptionBuilder';
import { getCategories, createCategory, updateCategory as apiUpdateCategory, deleteCategory as apiDeleteCategory } from '../../api/axios';
import { getProducts, createProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct, getProductById } from '../../api/axios';

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

interface Question {
  id: number;
  categoryId: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  imageUrl: string;
  categoryId: string;
};

const normalizeArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const nested = record.data ?? record.items ?? record.result ?? record.products ?? record.categories;

    if (Array.isArray(nested)) {
      return nested as T[];
    }

    if (nested && typeof nested === 'object') {
      const nestedArray = (nested as Record<string, unknown>).data ?? (nested as Record<string, unknown>).items ?? (nested as Record<string, unknown>).result;
      if (Array.isArray(nestedArray)) {
        return nestedArray as T[];
      }
    }
  }

  return [];
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [productForm, setProductForm] = useState<ProductFormState>({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [builderCategoryId, setBuilderCategoryId] = useState<string | null>(null);

  const [questionForm, setQuestionForm] = useState({ categoryId: '', question: '', options: ['', '', '', ''], correctAnswer: 0 });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [notificationCount] = useState(3);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts()
      ]);
      setCategories(normalizeArray<Category>(categoriesData));
      setProducts(normalizeArray<Product>(productsData));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) return;
    try {
      if (editingCategory) {
        await apiUpdateCategory(editingCategory.id, categoryForm.name);
        setCategories((prev) => prev.map((c) => c.id === editingCategory.id ? { ...c, name: categoryForm.name } : c));
        setEditingCategory(null);
      } else {
        const newCategory = await createCategory(categoryForm.name);
        setCategories((prev) => [...prev, newCategory]);
      }
      setCategoryForm({ name: '' });
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Check console for details.');
    }
  };

  const handleEditCategory = (cat: Category) => {
    setCategoryForm({ name: cat.name });
    setEditingCategory(cat);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await apiDeleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category. Check console for details.');
    }
  };

  const handleAddProduct = async () => {
    if (!productForm.name.trim() || !productForm.categoryId) return;
    try {
     const productData = {
  name: productForm.name,
  description: productForm.description,
  price: Number(productForm.price),
  stockQuantity: Number(productForm.stockQuantity),
  imageUrl: productForm.imageUrl,
  categoryId: Number(productForm.categoryId),
};
      if (editingProduct) {
  await apiUpdateProduct(editingProduct.id, productData);
} else {
  await createProduct(productData);
}
      setProductForm({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' });
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Check console for details.');
    }
  };

  const handleEditProduct = async (prod: Product) => {
    console.log('handleEditProduct called', prod);
    setActiveSection('products');
    try {
      const productData = await getProductById(prod.id);
      console.log('Fetched product data:', productData);
      setProductForm({
        name: productData.name ?? '',
        description: productData.description ?? '',
        price: String(productData.price ?? ''),
        stockQuantity: String(productData.stockQuantity ?? ''),
        imageUrl: productData.imageUrl ?? '',
        categoryId: String(productData.categoryId ?? ''),
      });
      setEditingProduct(productData);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      alert('Failed to fetch product details. Using local data instead.');
      setProductForm({
        name: prod.name ?? '',
        description: prod.description ?? '',
        price: String(prod.price ?? ''),
        stockQuantity: String(prod.stockQuantity ?? ''),
        imageUrl: prod.imageUrl ?? '',
        categoryId: String(prod.categoryId ?? ''),
      });
      setEditingProduct(prod);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await apiDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleAddQuestion = () => {
    if (!questionForm.question.trim() || !questionForm.categoryId) return;
    const questionData = {
      ...questionForm,
      categoryId: parseInt(questionForm.categoryId, 10),
      options: questionForm.options.filter((o) => o.trim()),
    };
    if (editingQuestion) {
      setQuestions((prev) => prev.map((q) => q.id === editingQuestion.id ? { ...q, ...questionData } : q));
      setEditingQuestion(null);
    } else {
      setQuestions((prev) => [...prev, { id: Date.now(), ...questionData }]);
    }
    setQuestionForm({ categoryId: '', question: '', options: ['', '', '', ''], correctAnswer: 0 });
  };

  const handleEditQuestion = (q: Question) => {
    setQuestionForm({
      categoryId: q.categoryId.toString(),
      question: q.question,
      options: [...q.options, '', '', '', ''].slice(0, 4),
      correctAnswer: q.correctAnswer,
    });
    setEditingQuestion(q);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const getCategoryName = (categoryName: string) => categoryName || 'Unknown';

  const getBuilderCategoryId = (categoryName?: string) => {
    const normalized = categoryName?.toLowerCase() ?? '';

    if (normalized.includes('elect')) return 'electronics';
    if (normalized.includes('fashion') || normalized.includes('cloth') || normalized.includes('apparel')) return 'fashion';
    if (normalized.includes('home') || normalized.includes('kitchen')) return 'home-kitchen';
    if (normalized.includes('game')) return 'gaming';
    if (normalized.includes('sport')) return 'sports';

    return null;
  };

  const handleOpenDescriptionBuilder = (categoryId: string) => {
    const selectedCategory = categories.find((cat) => cat.id.toString() === categoryId);
    setBuilderCategoryId(getBuilderCategoryId(selectedCategory?.name) ?? null);
    setActiveSection('description-builder');
  };

  const handleApplyDescription = (description: string) => {
    setProductForm((prev) => ({ ...prev, description }));
    setActiveSection('products');
  };

  const getStock = (product: Product) => product.stockQuantity ?? 0;

  const stats = [
    { label: 'Total Products', value: products.length, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Categories', value: categories.length, icon: 'M4 6h16M4 12h16M4 18h16', color: 'bg-blue-100 text-blue-700' },
    { label: 'AI Questions', value: questions.length, icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-purple-100 text-purple-700' },
    { label: 'Low Stock Items', value: products.filter(p => getStock(p) < 20).length, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'bg-amber-100 text-amber-700' },
  ];

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredQuestions = questions.filter(q => q.question.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        activeSection={activeSection}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notificationCount={notificationCount}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#00342B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading...</p>
              </div>
            </div>
          ) : (
            <>
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <StatsCard key={i} label={stat.label} value={stat.value} icon={stat.icon} color={stat.color} />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Products</h3>
                  <div className="space-y-3">
                    {products.slice(0, 5).map(product => {
                      const stock = getStock(product);
                      return (
                        <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                          <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 text-sm">{product.name}</div>
                            <div className="text-xs text-gray-500">{getCategoryName(product.categoryId)}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#00342B]">${product.price}</div>
                            <div className={`text-xs ${stock < 20 ? 'text-red-500' : 'text-emerald-600'}`}>{stock} in stock</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Category Distribution</h3>
                  <div className="space-y-4">
                    {categories.map(cat => {
                      const count = products.filter(p => p.categoryId === cat.id).length;
                      const percentage = products.length > 0 ? (count / products.length) * 100 : 0;
                      return (
                        <div key={cat.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{cat.name}</span>
                            <span className="text-gray-500">{count} products</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div className="bg-[#00342B] h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories Section */}
          {activeSection === 'categories' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                <p className="text-gray-500 mt-1">Manage your product categories</p>
              </div>
              <CategoryForm
                categoryForm={categoryForm}
                editingCategory={editingCategory}
                onFormChange={setCategoryForm}
                onSubmit={handleAddCategory}
                onCancel={() => { setEditingCategory(null); setCategoryForm({ name: '' }); }}
              />
              <CategoryTable
                categories={filteredCategories}
                productsCount={(id) => products.filter(p => p.categoryId === id).length}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            </div>
          )}

          {/* Products Section */}
          {activeSection === 'products' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <p className="text-gray-500 mt-1">Manage your product inventory</p>
              </div>
              <ProductForm
                productForm={productForm}
                editingProduct={editingProduct}
                categories={categories}
                onFormChange={setProductForm}
                onSubmit={handleAddProduct}
                onCancel={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' }); }}
                onOpenDescriptionBuilder={handleOpenDescriptionBuilder}
              />
              <ProductTable
                products={filteredProducts}
                getCategoryName={getCategoryName}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            </div>
          )}

          {/* Product Description Builder Section */}
          {activeSection === 'description-builder' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Product Description Builder</h1>
                <p className="text-gray-500 mt-1">Create structured, AI-parsable descriptions for your catalog.</p>
              </div>
              <ProductDescriptionBuilder
                initialCategoryId={builderCategoryId ?? undefined}
                onApplyDescription={handleApplyDescription}
              />
            </div>
          )}

          {/* AI Questions Section */}
          {activeSection === 'ai-questions' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">AI Questions</h1>
                <p className="text-gray-500 mt-1">Manage AI-generated questions by category</p>
              </div>
              <QuestionForm
                questionForm={questionForm}
                editingQuestion={editingQuestion}
                categories={categories}
                onFormChange={setQuestionForm}
                onSubmit={handleAddQuestion}
                onCancel={() => { setEditingQuestion(null); setQuestionForm({ categoryId: '', question: '', options: ['', '', '', ''], correctAnswer: 0 }); }}
              />
              <QuestionTable
                questions={filteredQuestions}
                getCategoryName={getCategoryName}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
              />
            </div>
          )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;