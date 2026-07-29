import { useState, useEffect } from 'react';
import { register } from '../../api/axios';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import StatsCard from './components/StatsCard';
import CategoryForm from './components/CategoryForm';
import CategoryTable from './components/CategoryTable';
import ProductForm, { type ProductFormState } from './components/ProductForm';
import ProductTable from './components/ProductTable';
import QuestionForm from './components/QuestionForm';
import QuestionTable from './components/QuestionTable';
import ProductDescriptionBuilder from './components/ProductDescriptionBuilder';
import { getCategories, createCategory, updateCategory as apiUpdateCategory, deleteCategory as apiDeleteCategory } from '../../api/axios';
import { getProducts, createProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct, getProductById, uploadProductImage, uploadProductImageUrl, deleteProductImage, setProductImageAsMain, addProductVideo, uploadProductVideoUrl, setProductVideoAsMain, deleteProductVideo, createOffer } from '../../api/axios';
import { getUsers, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from '../../api/axios';
import { getPrimaryImage, type ProductMedia } from '../../lib/productMedia';
import { getOrders, updateOrderStatus, cancelOrder } from '../../api/axios';

interface Category {
  id: number;
  name: string;
}

interface Product extends ProductMedia {}

interface Question {
  id: number;
  categoryId: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
}

const emptyProductForm: ProductFormState = {
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  mainImage: '',
  mainVideo: '',
  videos: [],
  images: [],
  category: '',
  discountPercentage: '',
  offerStartDate: '',
  offerEndDate: '',
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
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [builderCategoryId, setBuilderCategoryId] = useState<string | null>(null);

  // States to keep track of files selected for a new product (before creation)
  const [pendingMainImageFile, setPendingMainImageFile] = useState<File | null>(null);
  const [pendingAdditionalImageFiles, setPendingAdditionalImageFiles] = useState<File[]>([]);
  const [pendingMainVideoFile, setPendingMainVideoFile] = useState<File | null>(null);
  const [pendingAdditionalVideoFiles, setPendingAdditionalVideoFiles] = useState<File[]>([]);

  // Offer modal state
  const [offerModal, setOfferModal] = useState<{ productId: number; productName: string } | null>(null);
  const [offerForm, setOfferForm] = useState({ discountPercentage: '', startDate: '', endDate: '' });
  const [offerLoading, setOfferLoading] = useState(false);

  const clearPendingMedia = () => {
    setPendingMainImageFile(null);
    setPendingAdditionalImageFiles([]);
    setPendingMainVideoFile(null);
    setPendingAdditionalVideoFiles([]);
  };

  const [questionForm, setQuestionForm] = useState({ categoryId: '', question: '', options: ['', '', '', ''], correctAnswer: 0 });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [userForm, setUserForm] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState('');

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
      
      // Try to fetch users and orders, but don't fail if they're not available
      try {
        const usersData = await getUsers();
        setUsers(normalizeArray<User>(usersData));
      } catch (error) {
        console.warn('Users endpoint not available:', error);
        setUsers([]);
      }
      
      try {
        const ordersData = await getOrders();
        setOrders(normalizeArray<Order>(ordersData));
      } catch (error) {
        console.warn('Orders endpoint not available or requires auth:', error);
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch core data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) return;
    try {
      if (editingCategory) {
        await apiUpdateCategory(editingCategory.id, { name: categoryForm.name });
        setCategories((prev) => prev.map((c) => c.id === editingCategory.id ? { ...c, name: categoryForm.name } : c));
        setEditingCategory(null);
      } else {
        const newCategory = await createCategory({ name: categoryForm.name, description: '' });
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
    if (!productForm.name.trim() || !productForm.category) return;
    try {
      const originalPrice = Number(productForm.price);
      const discountPercentage = Number(productForm.discountPercentage) || 0;

      const categoryId = categories.find((category) => category.name === productForm.category)?.id || 0;
      const productDetails = {
        name: productForm.name.trim(),
        description: productForm.description,
        price: originalPrice,
        stock: Number(productForm.stockQuantity),
        categoryId,
      };

      const savedProduct = editingProduct
        ? await apiUpdateProduct(editingProduct.id, productDetails)
        : await createProduct(productDetails);

      // Try every possible response shape to extract the product id
      let productId: number | undefined =
        savedProduct?.id ??
        savedProduct?.data?.id ??
        savedProduct?.product?.id ??
        editingProduct?.id;

      // Last resort for new products: re-fetch product list and match by name
      if (!editingProduct && !productId) {
        try {
          const res = await getProducts();
          const all = normalizeArray<any>(res?.data ?? res);
          const match = all.find((p: any) => p.name === productForm.name.trim());
          productId = match?.id;
        } catch (_) { /* ignore */ }
      }

      if (!editingProduct && productId) {
        console.log('Uploading pending media for product', productId);

        // Upload main image URL if provided as text string
        if (productForm.mainImage && typeof productForm.mainImage === 'string' && productForm.mainImage.trim() && !pendingMainImageFile) {
          try {
            await uploadProductImageUrl(productId, { imageUrl: productForm.mainImage.trim(), isMain: true });
            console.log('Main image URL uploaded successfully');
          } catch (error) {
            console.error('Failed to upload main image URL:', error);
          }
        }

        // Upload additional image URLs if provided as text strings
        if (Array.isArray(productForm.images)) {
          for (const imgItem of productForm.images) {
            const imgUrl = typeof imgItem === 'string' ? imgItem : imgItem?.imageUrl || imgItem?.url;
            if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim() && imgUrl !== productForm.mainImage) {
              try {
                await uploadProductImageUrl(productId, { imageUrl: imgUrl.trim(), isMain: false });
                console.log('Additional image URL uploaded successfully');
              } catch (error) {
                console.error('Failed to upload additional image URL:', error);
              }
            }
          }
        }

        // Upload pending main image file
        if (pendingMainImageFile) {
          try {
            const result = await uploadProductImage(productId, pendingMainImageFile);
            console.log('Main image upload result:', result);
            const imgId = result?.id ?? result?.imageId ?? result?.data?.id;
            if (imgId) {
              await setProductImageAsMain(String(imgId));
            }
          } catch (error) {
            console.error('Failed to upload main image file:', error);
          }
        }

        // Upload pending additional image files
        for (const file of pendingAdditionalImageFiles) {
          try {
            const result = await uploadProductImage(productId, file);
            console.log('Additional image upload result:', result);
          } catch (error) {
            console.error('Failed to upload additional image file:', error);
          }
        }

        // Upload main video URL if provided as text string
        if (productForm.mainVideo && typeof productForm.mainVideo === 'string' && productForm.mainVideo.trim() && !pendingMainVideoFile) {
          try {
            await uploadProductVideoUrl(productId, { videoUrl: productForm.mainVideo.trim(), isMain: true });
            console.log('Main video URL uploaded successfully');
          } catch (error) {
            console.error('Failed to upload main video URL:', error);
          }
        }

        // Upload additional video URLs if provided as text strings
        if (Array.isArray(productForm.videos)) {
          for (const vidUrl of productForm.videos) {
            if (vidUrl && typeof vidUrl === 'string' && vidUrl.trim() && vidUrl !== productForm.mainVideo) {
              try {
                await uploadProductVideoUrl(productId, { videoUrl: vidUrl.trim(), isMain: false });
                console.log('Additional video URL uploaded successfully');
              } catch (error) {
                console.error('Failed to upload additional video URL:', error);
              }
            }
          }
        }

        // Upload pending main video
        if (pendingMainVideoFile) {
          try {
            const result = await addProductVideo(productId, pendingMainVideoFile);
            console.log('Main video upload result:', result);
            const vidId = result?.id ?? result?.videoId ?? result?.data?.id;
            if (vidId) {
              await setProductVideoAsMain(String(vidId));
            }
          } catch (error) {
            console.error('Failed to upload main video:', error);
          }
        }

        // Upload pending additional videos
        for (const file of pendingAdditionalVideoFiles) {
          try {
            const result = await addProductVideo(productId, file);
            console.log('Additional video upload result:', result);
          } catch (error) {
            console.error('Failed to upload additional video:', error);
          }
        }
      }

      // Also upload pending video files when editing (files picked before saving)
      if (editingProduct && productId) {
        // Upload main video URL if provided as text string
        if (productForm.mainVideo && typeof productForm.mainVideo === 'string' && productForm.mainVideo.trim() && !pendingMainVideoFile) {
          try {
            await uploadProductVideoUrl(productId, { videoUrl: productForm.mainVideo.trim(), isMain: true });
            console.log('Edit — main video URL uploaded successfully');
          } catch (error) {
            console.error('Failed to upload main video URL (edit):', error);
          }
        }

        // Upload additional video URLs if provided as text strings
        if (Array.isArray(productForm.videos)) {
          for (const vidUrl of productForm.videos) {
            if (vidUrl && typeof vidUrl === 'string' && vidUrl.trim() && vidUrl !== productForm.mainVideo) {
              try {
                await uploadProductVideoUrl(productId, { videoUrl: vidUrl.trim(), isMain: false });
                console.log('Edit — additional video URL uploaded successfully');
              } catch (error) {
                console.error('Failed to upload additional video URL (edit):', error);
              }
            }
          }
        }

        if (pendingMainVideoFile) {
          try {
            const result = await addProductVideo(productId, pendingMainVideoFile);
            console.log('Edit — main video upload result:', result);
            const vidId = result?.id ?? result?.videoId ?? result?.data?.id;
            if (vidId) {
              await setProductVideoAsMain(String(vidId));
            }
          } catch (error) {
            console.error('Failed to upload main video (edit):', error);
          }
        }

        for (const file of pendingAdditionalVideoFiles) {
          try {
            const result = await addProductVideo(productId, file);
            console.log('Edit — additional video upload result:', result);
          } catch (error) {
            console.error('Failed to upload additional video (edit):', error);
          }
        }
      }

      if (discountPercentage > 0 && productId) {
        try {
          const startDate = productForm.offerStartDate
            ? new Date(productForm.offerStartDate).toISOString()
            : new Date().toISOString();
          const endDate = productForm.offerEndDate
            ? new Date(productForm.offerEndDate).toISOString()
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
          await createOffer({ productId, discountPercentage, startDate, endDate });
          alert(`✅ Offer of ${discountPercentage}% applied successfully!`);
        } catch (error: any) {
          const msg = error?.response?.data?.message ?? error?.message ?? 'Unknown error';
          alert(`❌ Failed to create offer: ${msg}`);
        }
      } else if (discountPercentage > 0 && !productId) {
        alert('⚠️ Product was saved but offer could not be applied: product ID was not returned by the server. Please use the 🏷️ Offer button in the product table to apply the offer manually.');
      }

      setProductForm(emptyProductForm);
      setEditingProduct(null);
      clearPendingMedia();
      await fetchData();
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
        price: String(productData.originalPrice ?? productData.finalPrice ?? ''),
        stockQuantity: String(productData.stockQuantity ?? ''),
        mainImage: productData.mainImage ?? '',
        mainVideo: productData.mainVideo ?? '',
        videos: Array.isArray(productData.videos) ? productData.videos : [],
        images: Array.isArray(productData.images) ? productData.images : [],
        category: productData.category ?? '',
        discountPercentage: String(productData.discountPercentage ?? ''),
        offerStartDate: productData.offerStartDate ? String(productData.offerStartDate).slice(0, 16) : '',
        offerEndDate: productData.offerEndDate ? String(productData.offerEndDate).slice(0, 16) : '',
      });
      setEditingProduct(productData);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      alert('Failed to fetch product details. Using local data instead.');
      setProductForm({
        name: prod.name ?? '',
        description: prod.description ?? '',
        price: String(prod.originalPrice ?? prod.finalPrice ?? ''),
        stockQuantity: String(prod.stockQuantity ?? ''),
        mainImage: prod.mainImage ?? '',
        mainVideo: prod.mainVideo ?? '',
        videos: Array.isArray(prod.videos) ? prod.videos : [],
        images: Array.isArray(prod.images) ? prod.images : [],
        category: prod.category ?? '',
        discountPercentage: String(prod.discountPercentage ?? ''),
        offerStartDate: '',
        offerEndDate: '',
      });
      setEditingProduct(prod);
    }
  };

  // Media upload handlers for ProductForm
  const handleUploadMainImage = async (file: File): Promise<string> => {
    if (!editingProduct) {
      setPendingMainImageFile(file);
      return URL.createObjectURL(file);
    }
    // Pass File directly — uploadProductImage now builds FormData with correct 'Images' field
    const result = await uploadProductImage(editingProduct.id, file);
    const imgId = result?.id ?? result?.imageId ?? result?.data?.id;
    if (imgId) {
      await setProductImageAsMain(String(imgId));
    }
    return result?.url ?? result?.imageUrl ?? result?.data?.url ?? '';
  };

  const handleUploadAdditionalImages = async (files: File[]): Promise<string[]> => {
    if (!editingProduct) {
      setPendingAdditionalImageFiles((prev) => [...prev, ...files]);
      return files.map(f => URL.createObjectURL(f));
    }
    // Pass File directly — uploadProductImage now builds FormData with correct 'Images' field
    const results = await Promise.all(files.map(file => uploadProductImage(editingProduct.id, file)));
    return results.map(r => r?.url ?? r?.imageUrl ?? r?.data?.url ?? '');
  };

  const handleUploadMainVideo = async (file: File): Promise<string> => {
    if (!editingProduct) {
      setPendingMainVideoFile(file);
      return URL.createObjectURL(file);
    }
    // Pass File directly — addProductVideo will use the correct "video" field name
    const result = await addProductVideo(editingProduct.id, file);
    // Try all possible response shapes the API might return
    const vidId = result?.id ?? result?.videoId ?? result?.data?.id;
    if (vidId) {
      await setProductVideoAsMain(String(vidId));
    }
    return result?.url ?? result?.videoUrl ?? result?.data?.url ?? result?.data?.videoUrl ?? '';
  };

  const handleUploadAdditionalVideos = async (files: File[]): Promise<string[]> => {
    if (!editingProduct) {
      setPendingAdditionalVideoFiles((prev) => [...prev, ...files]);
      return files.map(f => URL.createObjectURL(f));
    }
    // Pass File directly — addProductVideo will use the correct "video" field name
    const results = await Promise.all(files.map(file => addProductVideo(editingProduct.id, file)));
    return results.map(r => r?.url ?? r?.videoUrl ?? r?.data?.url ?? r?.data?.videoUrl ?? '');
  };

  const handleDeleteImage = async (imageId: string): Promise<void> => {
    if (!editingProduct) return;
    await deleteProductImage(imageId);
  };

  const handleSetImageAsMain = async (imageId: string): Promise<void> => {
    await setProductImageAsMain(imageId);
  };

  const handleDeleteVideo = async (videoId: string): Promise<void> => {
    await deleteProductVideo(videoId);
  };

  const handleSetVideoAsMain = async (videoId: string): Promise<void> => {
    await setProductVideoAsMain(videoId);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await apiDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  // Standalone offer handler — used by the 🏷️ button in ProductTable
  const handleOpenOfferModal = (product: Product) => {
    setOfferModal({ productId: product.id, productName: product.name });
    setOfferForm({ discountPercentage: '', startDate: '', endDate: '' });
  };

  const handleSubmitOffer = async () => {
    if (!offerModal) return;
    const discountPercentage = Number(offerForm.discountPercentage);
    if (!discountPercentage || discountPercentage < 1 || discountPercentage > 100) {
      alert('Please enter a discount between 1 and 100.');
      return;
    }
    if (!offerForm.startDate || !offerForm.endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    setOfferLoading(true);
    try {
      await createOffer({
        productId: offerModal.productId,
        discountPercentage,
        startDate: new Date(offerForm.startDate).toISOString(),
        endDate: new Date(offerForm.endDate).toISOString(),
      });
      alert(`✅ Offer of ${discountPercentage}% applied to "${offerModal.productName}" successfully!`);
      setOfferModal(null);
      await fetchData();
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? error?.message ?? 'Unknown error';
      alert(`❌ Failed to apply offer: ${msg}`);
    } finally {
      setOfferLoading(false);
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

  const handleAddUser = async () => {
    if (!userForm.name.trim() || !userForm.email.trim()) return;
    try {
      if (editingUser) {
        await apiUpdateUser(editingUser.id, userForm);
        setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, ...userForm } : u));
        setEditingUser(null);
      } else {
        const newUser = await register({ ...userForm, password: 'tempPassword123' });
        setUsers((prev) => [...prev, newUser]);
      }
      setUserForm({ name: '', email: '' });
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('Failed to save user. Check console for details.');
    }
  };

  const handleEditUser = (user: User) => {
    setUserForm({ name: user.name, email: user.email });
    setEditingUser(user);
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await apiDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Check console for details.');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, { status });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      setEditingOrder(null);
      setOrderStatus('');
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Check console for details.');
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      await cancelOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order. Check console for details.');
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setOrderStatus(order.status);
  };

  const getCategoryName = (categoryId: number | string) => {
    if (typeof categoryId === 'string') {
      return categoryId || 'Unknown';
    }
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getBuilderCategoryId = (categoryName?: string) => {
    const normalized = categoryName?.toLowerCase() ?? '';

    if (normalized.includes('elect')) return 'electronics';
    if (normalized.includes('fashion') || normalized.includes('cloth') || normalized.includes('apparel')) return 'fashion';
    if (normalized.includes('home') || normalized.includes('kitchen')) return 'home-kitchen';
    if (normalized.includes('game')) return 'gaming';
    if (normalized.includes('sport')) return 'sports';

    return null;
  };

  const handleOpenDescriptionBuilder = (categoryName: string) => {
    setBuilderCategoryId(getBuilderCategoryId(categoryName) ?? null);
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
    { label: 'Orders', value: orders.length, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'bg-purple-100 text-purple-700' },
    { label: 'Users', value: users.length, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'bg-amber-100 text-amber-700' },
  ];

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredQuestions = questions.filter(q => q.question.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredOrders = orders.filter(o => o.id.toString().includes(searchQuery) || o.status.toLowerCase().includes(searchQuery.toLowerCase()));

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
                          <img src={getPrimaryImage(product)} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 text-sm">{product.name}</div>
                            <div className="text-xs text-gray-500">{getCategoryName(product.category)}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#00342B]">${product.finalPrice}</div>
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
                      const count = products.filter(p => p.category === cat.name).length;
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
                productsCount={(id) => products.filter(p => categories.find(c => c.id === id)?.name === p.category).length}
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
                onCancel={() => { setEditingProduct(null); setProductForm(emptyProductForm); clearPendingMedia(); }}
                onOpenDescriptionBuilder={handleOpenDescriptionBuilder}
                onUploadMainImage={handleUploadMainImage}
                onUploadAdditionalImages={handleUploadAdditionalImages}
                onUploadMainVideo={handleUploadMainVideo}
                onUploadAdditionalVideos={handleUploadAdditionalVideos}
                onDeleteImage={handleDeleteImage}
                onSetImageAsMain={handleSetImageAsMain}
                onDeleteVideo={handleDeleteVideo}
                onSetVideoAsMain={handleSetVideoAsMain}
              />
              <ProductTable
                products={filteredProducts}
                getCategoryName={getCategoryName}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onOffer={handleOpenOfferModal}
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

          {/* Users Section */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Users</h1>
                <p className="text-gray-500 mt-1">Manage user accounts</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent transition-all text-sm"
                      placeholder="Enter user name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent transition-all text-sm"
                      placeholder="Enter user email"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddUser}
                    className="px-6 py-2.5 bg-[#00342B] text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium text-sm"
                  >
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                  {editingUser && (
                    <button
                      onClick={() => { setEditingUser(null); setUserForm({ name: '', email: '' }); }}
                      className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">All Users</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">{user.id}</td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">{user.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Section */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
                <p className="text-gray-500 mt-1">Manage customer orders</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">All Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">User ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">#{order.id}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{order.userId}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">${order.totalAmount}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditOrder(order)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {editingOrder && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Update Order Status - #{editingOrder.id}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent transition-all text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleUpdateOrderStatus(editingOrder.id, orderStatus)}
                      className="px-6 py-2.5 bg-[#00342B] text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium text-sm"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => { setEditingOrder(null); setOrderStatus(''); }}
                      className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Offer Modal */}
          {offerModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Add Offer</h3>
                  <button
                    onClick={() => setOfferModal(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                    <input
                      type="text"
                      value={offerModal.productName}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={offerForm.discountPercentage}
                      onChange={(e) => setOfferForm({ ...offerForm, discountPercentage: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent transition-all text-sm"
                      placeholder="Enter discount (1-100)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="datetime-local"
                      value={offerForm.startDate}
                      onChange={(e) => setOfferForm({ ...offerForm, startDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="datetime-local"
                      value={offerForm.endDate}
                      onChange={(e) => setOfferForm({ ...offerForm, endDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSubmitOffer}
                      disabled={offerLoading}
                      className="flex-1 px-6 py-2.5 bg-[#00342B] text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {offerLoading ? 'Creating...' : 'Create Offer'}
                    </button>
                    <button
                      onClick={() => setOfferModal(null)}
                      className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
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