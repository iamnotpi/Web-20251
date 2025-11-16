import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import './Products.scss';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import ProductForm from '../../components/product/ProductForm/ProductForm';
import { productCategories } from '../../data/mockProducts';
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  selectProductError,
  selectProductFilters,
  selectProductState,
  selectProductStatus,
  selectProducts,
  setCategory,
  setSearchTerm,
  setSort,
  updateProduct,
} from '../../store/slices/productSlice';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const products = useSelector(selectProducts);
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);
  const filters = useSelector(selectProductFilters);
  const { selectedProductStatus } = useSelector(selectProductState);

  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [
    dispatch,
    filters.category,
    filters.sortBy,
    filters.sortDirection,
    filters.searchTerm,
  ]);

  const categories = useMemo(() => {
    const unique = new Set(['All', ...productCategories]);
    products.forEach((product) => unique.add(product.category));
    return Array.from(unique);
  }, [products]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category') || 'All';
    const searchParam = params.get('search') || '';

    if (categoryParam !== filters.category) {
      dispatch(setCategory(categoryParam));
    }

    if (searchParam !== filters.searchTerm) {
      dispatch(setSearchTerm(searchParam));
      setSearchInput(searchParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    setSearchInput(filters.searchTerm);
  }, [filters.searchTerm]);

  const syncUrl = (searchValue, categoryValue) => {
    const params = new URLSearchParams();
    if (searchValue) {
      params.set('search', searchValue);
    }
    if (categoryValue && categoryValue !== 'All') {
      params.set('category', categoryValue);
    }

    const queryString = params.toString();
    navigate(queryString ? `/products?${queryString}` : '/products', { replace: location.pathname === '/products' });
  };

  const handleSearchSubmit = (event) => {
    event?.preventDefault();
    dispatch(setSearchTerm(searchInput));
    syncUrl(searchInput, filters.category);
  };

  const handleCategoryChange = (event) => {
    const nextCategory = event.target.value;
    dispatch(setCategory(nextCategory));
    syncUrl(filters.searchTerm, nextCategory);
  };

  const handleSortChange = (event) => {
    dispatch(setSort({ sortBy: event.target.value }));
  };

  const handleSortDirectionToggle = () => {
    dispatch(
      setSort({
        sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc',
      })
    );
  };

  const handleOpenCreateForm = () => {
    setEditingProduct(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (product) => {
    setEditingProduct(product);
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleFormDismiss = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormError(null);
  };

  const handleFormSubmit = async (payload) => {
    try {
      if (editingProduct) {
        await dispatch(
          updateProduct({ productId: editingProduct.id, updates: payload })
        ).unwrap();
      } else {
        await dispatch(createProduct(payload)).unwrap();
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      setFormError(null);
      dispatch(fetchProducts());
    } catch (submitError) {
      setFormError(submitError.message || 'Unable to save product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      'Do you really want to delete this product?'
    );
    if (!confirmed) return;

    try {
      await dispatch(deleteProduct(productId)).unwrap();
      dispatch(fetchProducts());
    } catch (deleteError) {
      setFormError(deleteError.message || 'Unable to delete product.');
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <main className="products-page container">
      <header className="products-page__header">
        <div>
          <h1>Product Catalog</h1>
          <p>Search, sort, and manage products available in the store.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={handleOpenCreateForm}>
          Add Product
        </button>
      </header>

      <section className="products-page__filters">
        <form className="products-page__search" onSubmit={handleSearchSubmit}>
          <label htmlFor="product-search" className="visually-hidden">
            Search products
          </label>
          <input
            id="product-search"
            type="search"
            placeholder="Search by name, description, or tag"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button type="submit" className="btn btn-outline-primary">
            Search
          </button>
        </form>

        <div className="products-page__controls">
          <label className="products-page__control">
            <span>Category</span>
            <select value={filters.category} onChange={handleCategoryChange}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="products-page__control">
            <span>Sort by</span>
            <select value={filters.sortBy} onChange={handleSortChange}>
              <option value="createdAt">Newest</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </label>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleSortDirectionToggle}
          >
            {filters.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </section>

      {status === 'loading' && (
        <div className="products-page__status">Loading products...</div>
      )}

      {error && (
        <div className="products-page__status products-page__status--error">
          {error}
        </div>
      )}

      <section className="products-page__grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={handleViewProduct}
            onEdit={handleOpenEditForm}
            onDelete={handleDeleteProduct}
          />
        ))}

        {status === 'succeeded' && products.length === 0 && (
          <div className="products-page__empty">
            <h3>No products match your filters.</h3>
            <p>Try adjusting search criteria or create a new product.</p>
          </div>
        )}
      </section>

      {selectedProductStatus === 'loading' && (
        <div className="products-page__status">Loading product details...</div>
      )}

      {formError && (
        <div className="products-page__status products-page__status--error">
          {formError}
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          initialValues={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormDismiss}
        />
      )}
    </main>
  );
};

export default Products;

