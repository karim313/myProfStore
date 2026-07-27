import axios from 'axios';
import type {
  Product,
  ProductsResponse,
  ProductRequest,
  ProductReviewsResponse,
  AddReviewRequest,
} from '../interface';

export const BASE_URL = 'http://newproject.runasp.net';

// Centralized Axios Instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach Auth Token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== Auth ====================

// Register
export async function register(data: { userName?: string; name?: string; email: string; password: string }) {
  try {
    const payload = {
      userName: data.userName || data.name,
      email: data.email,
      password: data.password,
    };
    const res = await api.post('/api/Auth/register', payload);
    return res.data;
  } catch (error) {
    console.error('Failed to register:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Login
export async function login(data: { email: string; password: string }) {
  try {
    const res = await api.post('/api/Auth/login', data);
    return res.data;
  } catch (error) {
    console.error('Failed to login:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Logout
export async function logout() {
  try {
    const res = await api.post('/api/Auth/logout');
    return res.data;
  } catch (error) {
    console.error('Failed to logout:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Get Current User (Me)
export async function getCurrentUser() {
  try {
    const res = await api.get('/api/Auth/me');
    return res.data;
  } catch (error) {
    console.error('Failed to get current user:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// ==================== Users ====================

// Get All Users
export async function getUsers() {
  try {
    const res = await api.get('/api/Users');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch users:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Get User by ID
export async function getUserById(userId: number) {
  try {
    const res = await api.get(`/api/Users/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch user:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Update User
export async function updateUser(userId: number, data: { name: string; email: string }) {
  try {
    const res = await api.put(`/api/Users/${userId}`, data);
    return res.data;
  } catch (error) {
    console.error('Failed to update user:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Delete User
export async function deleteUser(userId: number) {
  try {
    const res = await api.delete(`/api/Users/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to delete user:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// ==================== Categories ====================

// Get all categories
export async function getCategories() {
  try {
    const res = await api.get('/api/Categories');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Get category by ID
export async function getCategoryById(categoryId: number) {
  try {
    const res = await api.get(`/api/Categories/${categoryId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch category:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Create category
export async function createCategory(data: { name: string; description?: string }) {
  try {
    const res = await api.post('/api/Categories', data);
    return res.data;
  } catch (error) {
    console.error('Failed to create category:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Update category
export async function updateCategory(categoryId: number, data: { name: string }) {
  try {
    const res = await api.put(`/api/Categories/${categoryId}`, data);
    return res.data;
  } catch (error) {
    console.error('Failed to update category:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Delete category
export async function deleteCategory(categoryId: number) {
  try {
    const res = await api.delete(`/api/Categories/${categoryId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to delete category:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// ==================== Products ====================

// Get all products
export async function getProducts(): Promise<ProductsResponse> {
  try {
    const res = await api.get('/api/Products');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch products:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Get product by ID
export async function getProductById(productId: number): Promise<Product> {
  try {
    const res = await api.get(`/api/Products/${productId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch product:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Create product
export async function createProduct(product: ProductRequest | { name: string; description: string; price: number; stock?: number; stockQuantity?: number; categoryId: number }) {
  try {
    const payload = {
      ...product,
      stockQuantity: (product as any).stockQuantity ?? (product as any).stock ?? 0,
    };
    const res = await api.post('/api/Products', payload);
    return res.data;
  } catch (error) {
    console.error('Failed to create product:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Update product
export async function updateProduct(
  productId: number,
  product: Partial<ProductRequest> | { name: string; price: number; stock?: number; stockQuantity?: number }
) {
  try {
    const payload = {
      ...product,
      stockQuantity: (product as any).stockQuantity ?? (product as any).stock ?? 0,
    };
    const res = await api.put(`/api/Products/${productId}`, payload);
    return res.data;
  } catch (error) {
    console.error('Failed to update product:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Delete product
export async function deleteProduct(productId: number) {
  try {
    const res = await api.delete(`/api/Products/${productId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to delete product:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Upload image to a product
export async function uploadProductImage(productId: number, formData: FormData) {
  try {
    const response = await api.post(`/api/Products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload product image:', error);
    throw error;
  }
}

// Upload image URL to a product (/api/Products/{id}/images/url)
export async function uploadProductImageUrl(productId: number, payload: { imageUrl: string; isMain: boolean }) {
  try {
    const response = await api.post(`/api/Products/${productId}/images/url`, payload);
    return response.data;
  } catch (error) {
    console.error('Failed to upload product image url:', error);
    throw error;
  }
}

// Update product images
export async function updateProductImage(productId: number, formData: FormData) {
  try {
    const response = await api.put(`/api/Products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update product image:', error);
    throw error;
  }
}

// Delete product image
export async function deleteProductImage(imageId: string) {
  try {
    const response = await api.delete(`/api/Products/images/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete product image:', error);
    throw error;
  }
}

// Set image as main
export async function setProductImageAsMain(imageId: string) {
  try {
    const response = await api.put(`/api/Products/images/${imageId}/main`);
    return response.data;
  } catch (error) {
    console.error('Failed to set image as main:', error);
    throw error;
  }
}

// Add video to product
export async function addProductVideo(productId: number, formData: FormData) {
  try {
    const response = await api.post(`/api/Products/${productId}/videos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add product video:', error);
    throw error;
  }
}

// Get product videos
export async function getProductVideos(productId: number) {
  try {
    const response = await api.get(`/api/Products/${productId}/videos`);
    return response.data;
  } catch (error) {
    console.error('Failed to get product videos:', error);
    throw error;
  }
}

// Set video as main
export async function setProductVideoAsMain(videoId: string) {
  try {
    const response = await api.put(`/api/Products/videos/${videoId}/main`);
    return response.data;
  } catch (error) {
    console.error('Failed to set video as main:', error);
    throw error;
  }
}

export async function mainProductVideo(videoId: string) {
  return setProductVideoAsMain(videoId);
}

// Delete video
export async function deleteProductVideo(videoId: string) {
  try {
    const response = await api.delete(`/api/Products/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete product video:', error);
    throw error;
  }
}

// ==================== Orders ====================

// Get All Orders
export async function getOrders() {
  try {
    const res = await api.get('/api/Orders');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Get Order by ID
export async function getOrderById(orderId: number) {
  try {
    const res = await api.get(`/api/Orders/${orderId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch order:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Create Order
export async function createOrder(data: {
  items: Array<{ productId: number; quantity: number }>;
  shippingAddress: string;
}) {
  try {
    const res = await api.post('/api/Orders', data);
    return res.data;
  } catch (error) {
    console.error('Failed to create order:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Update Order Status
export async function updateOrderStatus(orderId: number, data: { status: string }) {
  try {
    const res = await api.put(`/api/Orders/${orderId}/status`, data);
    return res.data;
  } catch (error) {
    console.error('Failed to update order status:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Cancel Order
export async function cancelOrder(orderId: number) {
  try {
    const res = await api.delete(`/api/Orders/${orderId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to cancel order:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// ==================== Cart ====================

// Get Cart
export async function getCart() {
  try {
    const res = await api.get('/api/Cart');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch cart:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Add to Cart
export async function addToCart(data: { productId: number; quantity: number }) {
  try {
    const res = await api.post('/api/Cart', data);
    return res.data;
  } catch (error) {
    console.error('Failed to add to cart:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Update Cart Item
export async function updateCartItem(cartItemId: number, data: { quantity: number }) {
  try {
    const res = await api.put(`/api/Cart/${cartItemId}`, data);
    return res.data;
  } catch (error) {
    console.error('Failed to update cart item:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Remove from Cart
export async function removeFromCart(cartItemId: number) {
  try {
    const res = await api.delete(`/api/Cart/${cartItemId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to remove from cart:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Clear Cart
export async function clearCart() {
  try {
    const res = await api.delete('/api/Cart');
    return res.data;
  } catch (error) {
    console.error('Failed to clear cart:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// ==================== Wishlist ====================

// Get Wishlist
export async function getWishlist() {
  try {
    const res = await api.get('/api/Wishlist');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch wishlist:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Add to Wishlist
export async function addToWishlist(productId: number) {
  try {
    const res = await api.post(`/api/Wishlist/${productId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to add to wishlist:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Remove from Wishlist
export async function removeFromWishlist(productId: number) {
  try {
    const res = await api.delete(`/api/Wishlist/${productId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to remove from wishlist:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Check Wishlist Item
export async function checkWishlistItem(productId?: number) {
  try {
    const url = productId ? `/api/Wishlist/check/${productId}` : '/api/Wishlist/check';
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.error('Failed to check wishlist item:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// ==================== Reviews ====================

export async function addReview(productId: number, review: AddReviewRequest) {
  try {
    const { data } = await api.post(`/api/Products/${productId}/reviews`, review);
    return data;
  } catch (error) {
    console.error('Failed to add review:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function getProductReview(productId: number): Promise<ProductReviewsResponse> {
  try {
    const res = await api.get(`/api/Products/${productId}/reviews`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Status:', error.response?.status);
      console.log('Response:', error.response?.data);
    } else {
      console.error(error);
    }
    throw error;
  }
}

// ==================== Chat ====================

export async function sendChatMessage(message: string, history: Array<{ role: string; text: string }> = []) {
  const endpoints = [
    '/api/Chat',
    '/api/Chat/ask',
    '/api/chat',
    '/api/assistant',
    '/api/AI/Chat',
  ];

  const payload = { message, history };
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const res = await api.post(endpoint, payload, { timeout: 20000 });
      const data = res?.data;

      return {
        response: data?.response ?? data?.message ?? data?.reply ?? data?.answer ?? data?.result ?? 'عذراً، لم أتمكن من الرد في الوقت الحالي.',
        data,
      };
    } catch (error) {
      lastError = error;
    }
  }

  console.error('Failed to send chat message:', lastError);
  throw lastError;
}
