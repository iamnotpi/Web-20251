import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productService } from '../../services/ProductService';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  selectedProduct: null,
  selectedProductStatus: 'idle',
  selectedProductError: null,
  filters: {
    searchTerm: '',
    category: 'All',
    sortBy: 'createdAt',
    sortDirection: 'desc',
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState }) => {
    const {
      products: { filters },
    } = getState();
    return productService.getProducts(filters);
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId) => {
    return productService.getProductById(productId);
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData) => productService.createProduct(productData)
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, updates }) => productService.updateProduct(productId, updates)
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId) => {
    await productService.deleteProduct(productId);
    return productId;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.filters.searchTerm = action.payload;
    },
    setCategory(state, action) {
      state.filters.category = action.payload;
    },
    setSort(state, action) {
      const { sortBy, sortDirection } = action.payload;
      if (sortBy) {
        state.filters.sortBy = sortBy;
      }
      if (sortDirection) {
        state.filters.sortDirection = sortDirection;
      }
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
      state.selectedProductStatus = 'idle';
      state.selectedProductError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.selectedProductStatus = 'loading';
        state.selectedProductError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProductStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedProductStatus = 'failed';
        state.selectedProductError = action.error.message;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.items = state.items.map((product) =>
          product.id === action.payload.id ? action.payload : product
        );
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((product) => product.id !== action.payload);
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      });
  },
});

export const { setSearchTerm, setCategory, setSort, clearSelectedProduct } = productSlice.actions;

export const selectProductState = (state) => state.products;
export const selectProducts = (state) => state.products.items;
export const selectProductFilters = (state) => state.products.filters;
export const selectProductStatus = (state) => state.products.status;
export const selectProductError = (state) => state.products.error;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectSelectedProductStatus = (state) => state.products.selectedProductStatus;
export const selectSelectedProductError = (state) => state.products.selectedProductError;

export default productSlice.reducer;

