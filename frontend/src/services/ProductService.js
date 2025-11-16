import { mockProducts } from '../data/mockProducts';

let products = [...mockProducts];

const simulateDelay = (result, delay = 250) =>
  new Promise((resolve) => setTimeout(() => resolve(result), delay));

const generateId = () => `prod-${Math.random().toString(36).slice(2, 8)}`;

const normalizeSort = (sortBy) => {
  const allowed = ['name', 'price', 'createdAt', 'rating'];
  return allowed.includes(sortBy) ? sortBy : 'createdAt';
};

const applySort = (list, sortBy, sortDirection) => {
  const direction = sortDirection === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name) * direction;
    }
    if (sortBy === 'price' || sortBy === 'rating') {
      return (a[sortBy] - b[sortBy]) * direction;
    }
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return (dateA - dateB) * direction;
  });
};

const filterProducts = (list, { searchTerm, category }) => {
  let filtered = [...list];

  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(lower) ||
        product.description.toLowerCase().includes(lower) ||
        product.tags.some((tag) => tag.toLowerCase().includes(lower))
    );
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((product) => product.category === category);
  }

  return filtered;
};

export const productService = {
  async getProducts(options = {}) {
    const {
      searchTerm = '',
      category = 'All',
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = options;

    const normalizedSort = normalizeSort(sortBy);
    const filtered = filterProducts(products, { searchTerm, category });
    const sorted = applySort(filtered, normalizedSort, sortDirection);
    return simulateDelay(sorted);
  },

  async getProductById(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return simulateDelay(product);
  },

  async createProduct(data) {
    const id = generateId();
    const timestamp = new Date().toISOString();
    const newProduct = {
      ...data,
      id,
      createdAt: timestamp,
      images: data.images?.length ? data.images : ['https://picsum.photos/seed/newproduct/400/300'],
      rating: data.rating ?? 0,
    };
    products = [newProduct, ...products];
    return simulateDelay(newProduct);
  },

  async updateProduct(productId, updates) {
    const index = products.findIndex((product) => product.id === productId);
    if (index === -1) {
      throw new Error('Product not found');
    }
    const updatedProduct = {
      ...products[index],
      ...updates,
    };
    products[index] = updatedProduct;
    return simulateDelay(updatedProduct);
  },

  async deleteProduct(productId) {
    const exists = products.some((product) => product.id === productId);
    if (!exists) {
      throw new Error('Product not found');
    }
    products = products.filter((product) => product.id !== productId);
    return simulateDelay({ success: true });
  },

  async resetProducts() {
    products = [...mockProducts];
    return simulateDelay(products);
  },
};

export default productService;

