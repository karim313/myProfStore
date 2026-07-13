import axios from 'axios';

const BASE_URL = 'http://myprojectapp.runasp.net';

// ==================== Categories ====================

// Get all categories
export async function getCategories() {
  try {
    const res = await axios.get(`${BASE_URL}/api/Categories`);
    return res;
  } catch (error) {
    console.error("Failed to fetch categories:", error instanceof Error ? error.message : error);
    throw error;
  }
}

// Get category by ID
export async function getCategoryById(id: number) {
  try {
    const res = await axios.get(`${BASE_URL}/api/Categories/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch category:", error instanceof Error ? error.message : error);
    throw error;
  }
}

// Create category
export async function createCategory(name: string) {
  try {
    const res = await axios.post(`${BASE_URL}/api/Categories`, { name });
    return res.data;
  } catch (error) {
    console.error("Failed to create category:", error instanceof Error ? error.message : error);
    throw error;
  }
}

// Update category
export async function updateCategory(id: number, name: string) {
  try {
    const res = await axios.put(`${BASE_URL}/api/Categories/${id}`, { name });
    return res.data;
  } catch (error) {
    console.error("Failed to update category:", error instanceof Error ? error.message : error);
    throw error;
  }
}

// Delete category
export async function deleteCategory(id: number) {
  try {
    const res = await axios.delete(`${BASE_URL}/api/Categories/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete category:", error instanceof Error ? error.message : error);
    throw error;
  }
}

// ==================== Products ====================

// Get all products
export async function getProducts() {
  try {
    const res = await axios.get(`${BASE_URL}/api/Products?pageSize=1000`);
    return res;
  } catch (error) {
    console.error("Failed to fetch products:", error instanceof Error ? error.message : error);
    throw error;
  }
}

// Get product by ID
export async function getProductById(id: number) {
  try {
    const res = await axios.get(`${BASE_URL}/api/Products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch product:", error instanceof Error ? error.message : error);
    throw error;
  }
}

// Create product
export async function createProduct(product: {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
}) {
  const res = await axios.post(`${BASE_URL}/api/Products`, product);
  return res.data;
}
// Update product
export async function updateProduct(
  id: number,
  product: {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    categoryId: number;
  }
) {
  const res = await axios.put(`${BASE_URL}/api/Products/${id}`, product);
  return res.data;
}

// Delete product
export async function deleteProduct(id: number) {
  try {
    const res = await axios.delete(`${BASE_URL}/api/Products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete product:", error instanceof Error ? error.message : error);
    throw error;
  }
}

// ===================== add reviews ===================

export async function addReview(review: {
  productId: number;
  rating: number;
  comment: string;
}) {
  try {
    const res = await axios.post(`${BASE_URL}/api/Reviews`, review);
    return res.data;
  } catch (error) {
    console.error("Failed to add review:", error instanceof Error ? error.message : error);
    throw error;
  }
}


// get product reviews
// /api/products/{productId}/reviews

export async function getProductReview(productId: number) {
  try {
    const res = await axios.get(`${BASE_URL}/api/products/${productId}/reviews`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch product reviews:", error instanceof Error ? error.message : error);
    throw error;
  }
}








// ==================== Chat ====================

export async function sendChatMessage(message: string, history: Array<{ role: string; text: string }> = []) {
  const endpoints = [
    `${BASE_URL}/api/Chat`,
    `${BASE_URL}/api/Chat/ask`,
    `${BASE_URL}/api/chat`,
    `${BASE_URL}/api/assistant`,
    `${BASE_URL}/api/AI/Chat`,
  ];

  const payload = { message, history };
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const res = await axios.post(endpoint, payload, { timeout: 20000 });
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