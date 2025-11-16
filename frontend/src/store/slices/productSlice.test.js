import { configureStore } from '@reduxjs/toolkit';
import productReducer, {
  clearSelectedProduct,
  createProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  setCategory,
  setSearchTerm,
  setSort,
  updateProduct,
} from './productSlice';
import { productService } from '../../services/ProductService';

jest.mock('../../services/ProductService', () => ({
  productService: {
    getProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  },
}));

const sampleProduct = {
  id: 'prod-test',
  name: 'Test Product',
  description: 'A sample product used for tests.',
  price: 99.99,
  stock: 10,
  rating: 4.2,
  category: 'Audio',
  tags: ['sample'],
  images: ['https://example.com/product.jpg'],
  createdAt: '2025-02-10T10:00:00Z',
};

const createStore = (preloadedState) =>
  configureStore({
    reducer: {
      products: productReducer,
    },
    preloadedState,
  });

describe('productSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state by default', () => {
    const store = createStore();
    const state = store.getState().products;

    expect(state.items).toEqual([]);
    expect(state.filters).toEqual({
      searchTerm: '',
      category: 'All',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });
  });

  it('should update search term and category filters', () => {
    const store = createStore();

    store.dispatch(setSearchTerm('headphones'));
    store.dispatch(setCategory('Audio'));
    store.dispatch(setSort({ sortBy: 'price', sortDirection: 'asc' }));

    const state = store.getState().products;
    expect(state.filters.searchTerm).toBe('headphones');
    expect(state.filters.category).toBe('Audio');
    expect(state.filters.sortBy).toBe('price');
    expect(state.filters.sortDirection).toBe('asc');
  });

  it('fetchProducts should load products from the service', async () => {
    productService.getProducts.mockResolvedValue([sampleProduct]);
    const store = createStore();

    await store.dispatch(fetchProducts());

    expect(productService.getProducts).toHaveBeenCalledWith({
      searchTerm: '',
      category: 'All',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });
    expect(store.getState().products.items).toEqual([sampleProduct]);
  });

  it('fetchProductById should populate selectedProduct', async () => {
    productService.getProductById.mockResolvedValue(sampleProduct);
    const store = createStore();

    await store.dispatch(fetchProductById('prod-test'));

    expect(productService.getProductById).toHaveBeenCalledWith('prod-test');
    expect(store.getState().products.selectedProduct).toEqual(sampleProduct);
  });

  it('createProduct should prepend the new product', async () => {
    productService.createProduct.mockResolvedValue(sampleProduct);
    const store = createStore();

    await store.dispatch(createProduct(sampleProduct));

    expect(productService.createProduct).toHaveBeenCalledWith(sampleProduct);
    expect(store.getState().products.items[0]).toEqual(sampleProduct);
  });

  it('updateProduct should replace an existing product', async () => {
    const updatedProduct = { ...sampleProduct, name: 'Updated Name' };
    productService.updateProduct.mockResolvedValue(updatedProduct);

    const baseState = productReducer(undefined, { type: '@@INIT' });
    const preloaded = {
      products: {
        ...baseState,
        items: [sampleProduct],
        selectedProduct: sampleProduct,
      },
    };
    const store = createStore(preloaded);

    await store.dispatch(updateProduct({ productId: sampleProduct.id, updates: { name: 'Updated Name' } }));

    expect(productService.updateProduct).toHaveBeenCalledWith(sampleProduct.id, { name: 'Updated Name' });
    const state = store.getState().products;
    expect(state.items[0]).toEqual(updatedProduct);
    expect(state.selectedProduct).toEqual(updatedProduct);
  });

  it('deleteProduct should remove the product and clear selection', async () => {
    productService.deleteProduct.mockResolvedValue({ success: true });

    const baseState = productReducer(undefined, { type: '@@INIT' });
    const preloaded = {
      products: {
        ...baseState,
        items: [sampleProduct],
        selectedProduct: sampleProduct,
      },
    };
    const store = createStore(preloaded);

    await store.dispatch(deleteProduct(sampleProduct.id));

    expect(productService.deleteProduct).toHaveBeenCalledWith(sampleProduct.id);
    const state = store.getState().products;
    expect(state.items).toHaveLength(0);
    expect(state.selectedProduct).toBeNull();
  });

  it('clearSelectedProduct should reset selected product state', () => {
    const baseState = productReducer(undefined, { type: '@@INIT' });
    const populatedState = {
      products: {
        ...baseState,
        selectedProduct: sampleProduct,
        selectedProductStatus: 'succeeded',
        selectedProductError: null,
      },
    };
    const store = createStore(populatedState);

    store.dispatch(clearSelectedProduct());

    const state = store.getState().products;
    expect(state.selectedProduct).toBeNull();
    expect(state.selectedProductStatus).toBe('idle');
    expect(state.selectedProductError).toBeNull();
  });
});

